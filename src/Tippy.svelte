<script>
    export let text = "";

    export let top = 0;
    export let left = 0;
</script>

{#if text}
    <div class="tippy" style="top: {top}px;left: {left}px;">
        <div class="container">
            {text}
        </div>
    </div>
{/if}

<style>
    .tippy {
        --bg: #333;
        background: var(--bg);
        color: white;
        position: absolute;
        z-index: 100;
        border-radius: 0.3rem;
        transform: translate(-53%, -175%);
        min-width: max-content;
    }
    .tippy .container {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 0.5rem;
    }
    .container::after {
        position: absolute;
        content: "";
        width: 1rem;
        height: 0.5rem;
        background: var(--bg);
        top: 100%;
        left: calc(50% - 1rem);
        clip-path: polygon(0 0, 100% 0, 50% 100%, 0 0);
    }
</style>
