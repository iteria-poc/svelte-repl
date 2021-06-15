<script>
  import { onMount } from "svelte";
  import Repl from "./Repl.svelte";
  import "@iteria-app/wysiwyg/public/export";
  import { getBoxComponent } from "./stories/helpers/getComponentSource";
  import { getTagSource } from "./stories/helpers/getTagSource";

  let replRef;
  let wysiwygMode = "inspecting";
  let update;
  let win;

  const fastHead =
    '<svelte:head><script type="module" src="https://unpkg.com/@microsoft/fast-components">' +
    "<" +
    "/script></svelte:head>";
  const components = [
    {
      name: "App",
      type: "svelte",
      source:
        fastHead +
        `
		  <fast-design-system-provider use-defaults>
			<fast-text-field></fast-text-field>
			<!--<fast-data-grid></fast-data-grid>-->
		  </fast-design-system-provider>
		  ` +
        getBoxComponent("Box"),
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
      console.log("clone", sourceLocation);
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

  function clone(event) {
    console.log("App.svelte clone", event);
    // TODO <fast-data-grid> event.detail?.dialogInsertField({ tooltipText: 'Insert Field', intro })
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
      console.log("clone", sourceLocation);
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

  const widgetMeta = {
    "FAST-TEXT-FIELD": [
      {
        name: "label",
        title: "Label",
        description: "",
        required: false,
        type: "string",
        //TODO messageId: 'TODO'
      },
      {
        name: "placeholder",
        title: "Placeholder",
        description:
          "Sets the placeholder value of the element, generally used to provide a hint to the user",
        required: false,
        type: "string",
        //TODO messageId: 'TODO'
      },
      {
        name: "required",
        title: "Required",
        description:
          "Require the field to be completed prior to form submission",
        type: "boolean",
        default: false,
        required: false,
      },
    ],
  };
  const widgetTags = Object.keys(widgetMeta);

  function onMouseOver(event) {
    console.log("<App hover", event);
    const { hoverElement, inspect } = event.detail;

    const allowTags = [
      "MAIN",
      "SECTION",
      "ARTICLE",
      "ASIDE",
      "DIV",
      "SPAN",
      "BUTTON",
      ...widgetTags,
    ];
    const display = allowTags.find((t) => hoverElement.tagName === t);
    const disabled =
      hoverElement.tagName === "SPAN" &&
      hoverElement.classList.contains("nested");

    if (display) {
      hoverElement.removeEventListener("click", (e) =>
        clickElement(e, hoverElement, inspect)
      );
      hoverElement.addEventListener(
        "click",
        (e) => clickElement(e, hoverElement, inspect),
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
    const icon =
      ["SPAN", "LABEL"].indexOf(hoverElement.tagName) > -1
        ? "edit"
        : "settings";
    inspect({ display, tooltipText, disabled, icon });
  }

  function onEditing(event) {
    const { editingElement, dialogWidgetFields } = event.detail;

    const widgetFound = widgetTags.find((t) => editingElement.tagName === t);
    if (widgetFound) {
      const fields = widgetMeta[editingElement.tagName];
      dialogWidgetFields({ tooltipText: "Widget Field", fields });
    }
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
      on:hover={onMouseOver}
      on:showsource={console.log}
      on:editing={onEditing}
    />
  {/if}
</div>

<style>
	.repl-wrapper {
		height: 100vh;
	}
</style>
