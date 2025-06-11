<script>
    import { onMount, getContext } from 'svelte';
    import { browser } from '$app/environment';
    import data from "$data/annotations.csv";
    import { scaleLinear } from "d3-scale";

    let { panoramaUrl, coords, zoom } = $props();
    let viewerContainer;
    let viewer;
    let opacity = $state(0);
    let isViewerReady = $state(false);

    let scaleYaw = scaleLinear().domain([0, 1]).range([0,Math.PI * 2]);
    let scalePitch = scaleLinear().domain([0, 1]).range([Math.PI / 2, -Math.PI / 2]);

    let markers = [];

    function parseMarkers() {
        let markersParsed = [];
        
        // Group data by id
        let groupedData = data.reduce((acc, row) => {
            if (!acc[row.id]) {
                acc[row.id] = {
                    id: row.id,
                    polygon: [],
                    text: null
                };
            }
            
            // If it's a polygon point, add to polygon array
            if (row.form === 'poly') {
                acc[row.id].polygon.push({
                    yaw: scaleYaw(row.x) + Math.PI,
                    pitch: scalePitch(row.y)
                });
            }
            // If it's a text marker, store the text
            else if (row.form === 'text') {
                acc[row.id].text = row.text;
            }
            
            return acc;
        }, {});

        // Convert grouped data to marker format
        markers = Object.values(groupedData).map(group => {
            let markerSet = [];
            
            // Add polygon marker if we have polygon points
            if (group.polygon.length > 0) {
                markerSet.push({
                    id: `${group.id}-polygon`,
                    className: 'fade',
                    polygon: group.polygon.map(point => [point.yaw, point.pitch]),
                    svgStyle: {
                        stroke: 'rgba(255, 0, 50, 0.8)',
                        strokeWidth: '2px',
                        marginLeft: '-1px',
                        opacity: null,
                        strokeOpacity: 'none',
                        fill: 'none',
                    }
                });
            }
            
            // Add text marker if we have text
            if (group.text) {
                // Use the first polygon point as the text position
                const position = group.polygon[0] || { yaw: 0, pitch: 0 };
                markerSet.push({
                    id: `${group.id}-text`,
                    className: 'fade',
                    position: position,
                    html: `<div>${group.text}</div>`,
                    anchor: 'bottom left',
                    //rotation: { yaw: '10deg', pitch: '10deg', roll: 'deg' },
                    scale: {
                        zoom: [1, 1],
                        yaw: [1, 1.5],
                        pitch: [1, 1.5]
                    },
                    style: {
                        maxWidth: '100px',
                        color: 'white',
                        opacity: null,
                        marginLeft: '-1px',
                        paddingLeft: '5px',
                        paddingRight: '5px',
                        backgroundColor: 'red',
                        fontSize: '10px',
                        fontFamily: 'Helvetica, sans-serif',
                        textAlign: 'center',
                    }
                });
            }
            
            return markerSet;
        }).flat();

        console.log('Parsed markers:', markers);
    }

    function makeRandomMarker() {
        // Clear existing markers
        markers = [];
        
        // Generate 5 random marker sets
        for (let i = 0; i < 10; i++) {

            let randomPos = { 
                yaw: Math.random() * 6,

                pitch: -0.04*Math.random()
            };

            
            // Create a marker set with the random position
            let markerSet = [{
                id: `test-${i}`,
                className: 'fade',
                position: { yaw: randomPos.yaw, pitch: randomPos.pitch },
                html: `<div>Marker ${i}</div>`,
                anchor: 'top left',
                scale: {
                    yaw: [1, 1.5]
                },
                style: {
                    maxWidth: '100px',
                    color: 'white',
                    opacity: null,
                    marginLeft: '-1px',
                    paddingLeft: '5px',
                    paddingRight: '5px',
                    backgroundColor: 'red',
                    fontSize: '10px',
                    fontFamily: 'Helvetica, sans-serif',
                    textAlign: 'center',
                }
            },
            {
                id: `test-${i}-polygon`,
                className: 'fade',
                scale: {
                    yaw: [1, 1.5]
                },
                polygon: [
                    [randomPos.yaw, randomPos.pitch],
                    [randomPos.yaw + .1, randomPos.pitch],
                    [randomPos.yaw + .1, randomPos.pitch + .1],
                    [randomPos.yaw, randomPos.pitch + .1],
                    [randomPos.yaw, randomPos.pitch],
                ],
                svgStyle: {
                    stroke: 'rgba(255, 0, 50, 0.8)',
                    strokeWidth: '2px',
                    marginLeft: '-1px',
                    opacity: null,
                    strokeOpacity: 'none',
                    fill: 'none',
                },
            }];
            
            // Push the marker set to the markers array
            markers.push(...markerSet);
        }
    }

    $effect.root(() => {
        $effect(() => {
            // Explicitly track coords as a dependency
            const currentCoords = coords;
            
            if (viewer && currentCoords) {

                // console.log('currentCoords', currentCoords);
                viewer.rotate({
                    yaw: currentCoords[0],
                    pitch: currentCoords[1],
                });
                viewer.zoom(zoom);
            }
        });
    });

    onMount(async () => {
        parseMarkers();
        console.log(markers);
        if (browser) {
            try {
                const [{ Viewer }, css, { MarkersPlugin }, markersCss] = await Promise.all([
                    import('@photo-sphere-viewer/core'),
                    import('@photo-sphere-viewer/core/index.css'),
                    import('@photo-sphere-viewer/markers-plugin'),
                    import('@photo-sphere-viewer/markers-plugin/index.css')
                ]);
                
                viewer = new Viewer({
                    container: viewerContainer,
                    panorama: panoramaUrl,
                    navbar: false,
                    loading_html: null,
                    loading_img: null,
                    defaultPitch: 6.18,
                    defaultYaw: -.002,
                    plugins: [
                        [MarkersPlugin, {
                            markers: markers,
                        }],
                    ],
                });

                viewer.addEventListener('panorama-loaded', (event) => {
                    // console.log('Panorama image loaded', event);
                    opacity = 1;
                    isViewerReady = true; // <<< Set viewer ready flag
                    // console.log('isViewerReady set to true. Initial position:', viewer.getPosition());
                });

                viewer.addEventListener('ready', () => {
                    console.log(viewer.getPosition());
                    viewer.rotate({
                        yaw: coords[0],
                        pitch: coords[1],
                    });

                    // viewer.addEventListener('position-updated', ({ position }) => {
                    //     console.log(`new position is yaw: ${position.yaw} pitch: ${position.pitch}`);
                    // });
                });

            } catch (error) {
                console.error('Failed to load photo sphere viewer:', error);
            }
        }

        return () => {
            if (viewer) {
                viewer.destroy();
            }
        };
    });

</script>

<div bind:this={viewerContainer} id="viewer" style="opacity: {opacity}; transition: opacity 0.5s ease-in-out;"></div>

<style>

    #viewer {
        width: 100%;
        height: 100vh;
    }
</style>