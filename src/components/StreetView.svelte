<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    let { panoramaUrl, coords } = $props();
    let viewerContainer;
    let viewer;
    let opacity = $state(0);
    let isViewerReady = $state(false);

    $effect.root(() => {
        $effect(() => {
            // Explicitly track coords as a dependency
            const currentCoords = coords;
            
            if (viewer && currentCoords) {
                viewer.rotate({
                    yaw: currentCoords[0],
                    pitch: currentCoords[1],
                });

                // viewer.zoom(100);
            }
        });
    });

    onMount(async () => {
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
                    // defaultZoomLvl: animatedValues.zoom.start,

                    plugins: [
                        [MarkersPlugin, {
                            markers: [
                                {
                                    id: 'text',
                                    position: { yaw: 0, pitch: 0 },
                                    html: 'HTML <b>marker</b> &hearts; {coords}',
                                    anchor: 'bottom right',
                                    scale: [0.5, 1.5],
                                    style: {
                                        maxWidth: '100px',
                                        color: 'white',
                                        fontSize: '20px',
                                        fontFamily: 'Helvetica, sans-serif',
                                        textAlign: 'center',
                                    }
                                },
                                {
                                    id: 'polygon-1',
                                    polygon: [
                                        [6.2208, 0.0906], [0.0443, 0.1028], [0.2322, 0.0849], [0.4531, 0.0387],
                                        [0.5022, -0.0056], [0.4587, -0.0396], [0.252, -0.0453], [0.0434, -0.0575],
                                        [6.1302, -0.0623], [6.0094, -0.0169], [6.0471, 0.032], [6.2208, 0.0906],
                                    ],
                                    svgStyle: {
                                        fill: 'url(#dots)',
                                        stroke: 'rgba(255, 0, 50, 0.8)',
                                        strokeWidth: '2px',
                                    },
                                },
                                {
                                    id: 'polygon-2',
                                    polygonPixels: [
                                        [3104,1193],[2984,1365],[2939,1328],[2855,1345],[2817,1327],[2703,1398],
                                        [2645,1413],[2499,1398],[2456,1373],[2456,1152],[3104,1095],
                                    ],
                                    svgStyle: {
                                        fill: 'url(#image)',
                                    },
                                },
                            ],
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

<button 
    on:click={() => {
        const currentPosition = viewer.getPosition();

        const textureX = ((currentPosition.yaw + Math.PI) / (2 * Math.PI)) * 6000;
        const textureY = ((Math.PI / 2 - currentPosition.pitch) / Math.PI) * 3000;

        const zoom = viewer.getZoomLevel();
        console.log(textureX, textureY, currentPosition, zoom);
        // viewer.animate({
        //     textureX: textureX+5,
        //     textureY: textureY,
        //     speed: '2rpm',
        // })
        // .then(() => /* animation complete */);

        // viewer.rotate({
        //     yaw: 3.961244051213098,
        //     pitch: -0.04427003953391351,
        // });



        // viewer.rotate({
        //     textureX: 1,
        //     textureY: 0,
        // });

        // const currentPosition2 = viewer.getPosition();

        // const textureX2 = ((currentPosition2.yaw + Math.PI) / (2 * Math.PI)) * 6000;
        // const textureY2 = ((Math.PI / 2 - currentPosition2.pitch) / Math.PI) * 3000;


        // console.log(textureX2, textureY2, currentPosition2);


    }}>
    Move Left
</button>

<div bind:this={viewerContainer} id="viewer" style="opacity: {opacity}; transition: opacity 0.5s ease-in-out;"></div>

<style>
    #viewer {
        width: 100%;
        height: 100vh;
    }
</style>