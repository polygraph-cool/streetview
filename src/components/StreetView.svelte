<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    let { panoramaUrl, coords } = $props();
    let viewerContainer;
    let viewer;
    let opacity = $state(0);
    let isViewerReady = $state(false);

    // Function to generate marker HTML
    function getMarkerHtml() {
        return `<div>Matt</div>`;
    }

    let markers = [];

    function makeRandomMarker() {
        // Clear existing markers
        markers = [];
        
        // Generate 5 random marker sets
        for (let i = 0; i < 10; i++) {
            // Generate random position between -π and π for yaw, and -π/2 to π/2 for pitch
            // let randomPos = { 
            //     yaw: (Math.random() * 2 * Math.PI) - Math.PI,
            //     pitch: (Math.random() * Math.PI) - (Math.PI / 2)
            // };

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

                // viewer.zoom(100);
            }
        });
    });

    onMount(async () => {
        makeRandomMarker();
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
                    // console.log('Viewer "ready" event fired. Current position:', viewer.getPosition());
                    // 'panorama-loaded' is generally better for ensuring position is stable.
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