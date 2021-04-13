<script>
    export let pointerLocation;

    let left = 0;
    let top = 0;
    let text = "";

    $: if (pointerLocation) {
        const { iframe, target, loc, event } = pointerLocation;
        if (loc) {
            const doc = iframe.contentDocument;
            if (doc) {
                let element = iframe;
                let _left = 0;
                let _top = 0;
                while (element && element.tagName !== "BODY") {
                    _left += element.offsetLeft;
                    _top += element.offsetTop;
                    element = element.parentElement;
                }
                console.log(loc);
                left = _left + event.clientX;
                top = _top + event.clientY;
                text = `${loc.file} Line: ${loc.line + 1} Column: ${loc.column + 1} Tag: ${target.tagName.toLowerCase()}`;
            }
        } else {
            text = "";
        }
    }
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
