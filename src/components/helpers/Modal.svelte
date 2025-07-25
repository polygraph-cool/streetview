<script>
    import { isModalOpen, modalContent } from '$utils/appState.svelte.js';
    import { fade } from 'svelte/transition';

    let { height } = $props();
</script>

{#if $isModalOpen}
    <div class="modal-backdrop" transition:fade={{ duration: 300 }}>
        <div class="modal-content">
            {#if $modalContent.type === 'image'}
                <img style="height: {height*.8}px;" src={$modalContent.src} alt="Hint">
            {/if}
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }

    .modal-content img {
        max-width: 80vw;
        max-height: var(--height);
        display: block;
        border-radius: 10px;
    }
</style> 