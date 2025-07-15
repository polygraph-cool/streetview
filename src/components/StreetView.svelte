<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { scaleLinear } from "d3-scale";

    let { defaultCoords, panoramaUrl, coords, zoom, value, markersRaw, type, height, isPanoramaLoaded = $bindable(false) } = $props();
    let viewerContainer;
    let viewer;
    let opacity = $state(0);
    let isViewerReady = $state(false);
    let isAnimating = $state(false);
    let prevCoords = $state([0, 0]);
    let prevZoom = $state(0);


    let colors = [
        {
            "name":"teal",
            "color":"#74FCD0",
            "text":"#000"
        },
        {
            "name":"yellow",
            "color":"#DEFE05",
            "text":"#000"
        },
        {
            "name":"red",
            "color":"#FF0F00",
            "text":"#fff"
        },
        {
            "name":"green",
            "color":"#63FF02",
            "text":"#000"
        },
        {
            "name":"orange",
            "color":"#FFC300",
            "text":"#000"
        },
        {
            "name":"blue",
            "color":"#01B4FD",
            "text":"#000"
        },
        
    ];


    // let resolutionPlugin;
    let scaleYaw = scaleLinear().domain([0, 1]).range([0,Math.PI * 2]);
    let scalePitch = scaleLinear().domain([0, 1]).range([Math.PI / 2, -Math.PI / 2]);
    let debounceTimer = null;
    let markers = [];

    function parseMarkers() {
        let markersParsed = [];
        // Group data by id
        let groupedData = markersRaw.reduce((acc, row) => {
            if (!acc[row.id]) {
                acc[row.id] = {
                    id: row.id,
                    polygon: [],
                    text: null,
                    step: row.val,
                    delay: row.count
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
                acc[row.id].textPos = {
                    yaw: scaleYaw(row.x) + Math.PI,
                    pitch: scalePitch(row.y)                    
                };
            }
            
            return acc;
        }, {});
        // Convert grouped data to marker format
        markers = Object.values(groupedData).map((group, i) => {
            let markerSet = [];

            const colorsShuffle = colors.sort(() => Math.random() - 0.5);

            const colorIndex = i % colorsShuffle.length;  // This will cycle through colors array

            // Add polygon marker if we have polygon points
            if (group.polygon.length > 0) {
                markerSet.push({
                    id: `${group.id}-polygon`,
                    className: `fade annotation-value-${group.step} delay-${group.delay}`,
                    polygon: group.polygon.map(point => [point.yaw, point.pitch]),
                    svgStyle: {
                        strokeWidth: '2px',
                        marginLeft: '-1px',
                        opacity: null,
                        stroke: colorsShuffle[colorIndex].color,
                        strokeOpacity: 'none',
                        fill: 'none',
                    }
                });
            }
            
            // Add text marker if we have text
            if (group.text) {
                // Use the first polygon point as the text position
                const position = group.textPos || { yaw: 0, pitch: 0 };
                markerSet.push({
                    id: `${group.id}-text`,
                    className: `fade annotation-value-${group.step} delay-${group.delay}`,
                    position: position,
                    html: `<div>${group.text}</div>`,
                    anchor: 'bottom left',
                    //rotation: { yaw: '10deg', pitch: '10deg', roll: 'deg' },
                    scale: {
                        zoom: [1, 1],
                        yaw: [1, 1],
                        pitch: [1, 1]
                    },
                    style: {
                        // maxWidth: '100px',
                        color: colorsShuffle[colorIndex].text,
                        backgroundColor: colorsShuffle[colorIndex].color,
                        opacity: null,
                        marginLeft: '-1px',
                        paddingLeft: '5px',
                        paddingRight: '5px',
                        fontSize: '12px',
                        textAlign: 'left',
                    }
                });
            }

            
            return markerSet;
        }).flat();

        // console.log(markers)

        // console.log('Parsed markers:', markers);
    }

    $effect(() => {
        const currentCoords = coords;
        if (
            viewer && currentCoords &&
            (currentCoords[0] !== prevCoords[0] || currentCoords[1] !== prevCoords[1] || zoom !== prevZoom)
        ) {
            prevCoords = currentCoords;
            prevZoom = zoom;

            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }
            // Batch the operations to reduce reflows
            debounceTimer = setTimeout(() => {
                // console.log("new coorrds")
                

                // if(!isAnimating){
                //     isAnimating = true;

                //     viewer.animate({
                //         yaw: currentCoords[0],
                //         pitch: currentCoords[1],
                //         zoom: zoom,
                //         speed: 0,
                //     })  
                //     .then(() => {
                //             isAnimating = false;
                //         });
                // }
                viewer.rotate({
                    yaw: currentCoords[0],
                    pitch: currentCoords[1],
                })  
                viewer.zoom(zoom);
            }, 10);
        }
    });

    onMount(async () => {
        parseMarkers();
        if (browser) {
            try {
                let [{ Viewer, TextureLoader }, css, { MarkersPlugin }, markersCss] = await Promise.all([
                    import('@photo-sphere-viewer/core'),
                    import('@photo-sphere-viewer/core/index.css'),
                    import('@photo-sphere-viewer/markers-plugin'),
                    import('@photo-sphere-viewer/markers-plugin/index.css'),
                ]);

                
                viewer = new Viewer({
                    container: viewerContainer,
                    panorama: panoramaUrl,
                    navbar: false,
                    loadingImg: null,
                    defaultYaw: defaultCoords[0],
                    defaultPitch: defaultCoords[1],
                    plugins: [
                        [MarkersPlugin, {
                            markers: markers,
                        }],
                    ],
                });

                viewer.addEventListener('panorama-loaded', (event) => {
                    isPanoramaLoaded = true; // <-- Notify the parent by updating the bound prop

                    if(type === "intro"){
                        console.log('Panorama image loaded', event);
                    }
                    // console.log('isViewerReady set to true. Initial position:', viewer.getPosition());
                });

                viewer.addEventListener('ready', () => {
                    if(type === "intro"){
                        console.log("ready",coords)
                    }
                    opacity = 1;
                    isViewerReady = true; // <<< Set viewer ready flag

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

<div bind:this={viewerContainer} id="viewer" style="height: {height}px; opacity: {opacity}; transition: opacity 0.5s ease-in-out;"></div>

<style>

    #viewer {
        width: 100%;
        height: var(--height);
    }
</style>