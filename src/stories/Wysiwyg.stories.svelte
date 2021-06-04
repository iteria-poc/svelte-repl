<script>
    import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
    import { onMount } from "svelte";
    import Repl from "../Repl.svelte";
    import "@iteria-app/wysiwyg/public/export";
    import { getBoxComponent } from "./helpers/getComponentSource";
    import { getTagSource } from "./helpers/getTagSource";

    let replRef;
    let wysiwygMode = "inspecting";
    let update;
    let win;

    const components = [
        {
            name: "App",
            type: "svelte",
            source: getBoxComponent("Box"),
        },
        {
            name: "Nested",
            type: "svelte",
            source: `<button style="margin: 0 0.5rem;">BUTTON</button>\n${getBoxComponent(
                "Nested Box",
                true
            )}`,
        },
    ];

    onMount(() => {
        replRef.set({
            components,
        });
    });

    function listenForPointerMove(node) {
        const iframe = node.querySelector("iframe[title=Result]");
        iframe.addEventListener("load", async (event) => {
            win = iframe.contentWindow;
        });
    }

    let sourceLocation;

    function replHover(event) {
        const { loc } = event.detail;
        if (loc) {
            sourceLocation = loc;
        }
    }

    function del() {
        if (sourceLocation) {
            let type = "svelte";
            const name = sourceLocation.file.replace(/.\w+$/, (match) => {
                type = match.slice(1);
                return "";
            });
            const component = components.find(
                (c) => c.name === name && c.type === type
            );
            const { source } = component;
            const elementSource = getTagSource(source, sourceLocation.char);
            if (elementSource) {
                const srcBefore = source.slice(0, elementSource.start);
                const srcAfter = source.slice(elementSource.end);
                console.log(srcBefore);
                console.log(srcAfter);
                component.source = `${srcBefore}${srcAfter}`;
                update({ components });
            }
        }
    }

    function clone() {
        if (sourceLocation) {
            let type = "svelte";
            const name = sourceLocation.file.replace(/.\w+$/, (match) => {
                type = match.slice(1);
                return "";
            });
            const component = components.find(
                (c) => c.name === name && c.type === type
            );
            const { source } = component;
            console.log(sourceLocation);
            const elementSource = getTagSource(source, sourceLocation.char);
            if (elementSource) {
                const codeBefore = source.slice(0, elementSource.end);
                const codeAfter = source.slice(elementSource.end);
                component.source = `${codeBefore}\n${elementSource.source}${
                    codeAfter.match(/^\s*\n/) ? "" : "\n"
                }${codeAfter}`;
                update({ components });
            }
        }
    }

    function onInspect(event) {
        const { target, callback } = event.detail;

        const allowTags = [
            "MAIN",
            "SECTION",
            "ARTICLE",
            "ASIDE",
            "DIV",
            "SPAN",
            "BUTTON",
        ];
        const display = allowTags.find((t) => target.tagName === t);
        const disabled =
            target.tagName === "SPAN" && target.classList.contains("nested");

        if (display) {
            target.removeEventListener("click", (e) =>
                clickElement(e, target, callback)
            );
            target.addEventListener(
                "click",
                (e) => clickElement(e, target, callback),
                { once: true }
            );
        }

        let tooltipText = "";
        if (sourceLocation) {
            const lineNo = sourceLocation.line + 1;
            const columnNo = sourceLocation.column + 1;
            tooltipText = `${sourceLocation.file.replace(
                /\.svelte$/,
                ""
            )} Line: ${lineNo} Column: ${columnNo}`;
        } else {
            tooltipText = "";
        }
        callback({ display, tooltipText, disabled });
    }

    function clickElement(event, target, callback) {
        const element = event.target;
        const formControls = ["BUTTON", "A", "SUBMIT", "INPUT", "SELECT"];
        if (target === element) {
            if (!formControls.find((tagName) => tagName === target.tagName)) {
                wysiwygMode = "editing";
            }
        }
    }

</script>

<Meta
    title="Example/Wysiwyg"
    component={Repl}
    argTypes={{
        // label: { control: "text" },
        // primary: { control: "boolean" },
        // backgroundColor: { control: "color" },
        // size: {
        //     control: { type: "select", options: ["small", "medium", "large"] },
        // },
        // onClick: { action: "onClick" },
    }}
/>

<Template let:args>
    <div class="repl-wrapper" use:listenForPointerMove>
        <Repl
            bind:this={replRef}
            on:hover={replHover}
            bind:update
            workersUrl="workers"
            embedded
            relaxed
        />
        {#if win}
            <iteria-wysiwyg
                {win}
                on:clone={clone}
                on:delete={del}
                on:inspect={onInspect}
                on:showsource={console.log}
                on:modechange={console.log}
            />
        {/if}
    </div>
</Template>

<Story name="Primary" args={{}} />

<style>
    :root {
        height: 100%;
    }
    :global(body) {
        height: 100%;
    }
    .repl-wrapper {
        width: 100%;
        min-height: 50vh;
        height: 100%;
    }

</style>
