<script>

    let terms = [
        "Fuhgetaboutit",
        "No restrooms",
        "surveillance",
    ]
    let images = [
        "assets/images/sign.png",
        "assets/images/sign.png",
        "assets/images/sign.png",
        "assets/images/sign.png",
    ]

</script>

<div class="text-section">
    <p>[still thinking about the design for this, but it'd basically call out interesting examples of street view imagery for terms...right now I'm thinking it's a carousel, but could be anything!]</p>
</div>

<div class="carousel">
    {#each terms as term}
        <div class="row">
            <p>{term}</p>
            {#each images as image}
                <div class="image-container">
                    <img width="200px" src="{image}" alt="">
                </div>
            {/each}
        </div>
    {/each}
</div>

<div class="text-section">
    <p>[next there's a ranking section of terms...still need to write the transition text here.]</p>
    <p>[plan is to have example images show up as you scroll through the terms...]</p>
</div>

<style>
    .carousel {
        margin: 0 auto;
    }
    .row {
        display: flex;
        justify-content: center;
    }

    .image-container {
        display: flex;
    }

</style>