<script>
	import Repl from "./Repl.svelte";
	import { onMount } from "svelte";

	let replRef;
	
	onMount(() => {
		replRef.set({
			components: [
				{
					name: "App",
					type: "svelte",
					source: '<script>\nimport Nested from ".\/Nested.svelte";\n<\/script>\n\n<b>bold</b>\n<Nested />\n',
				},
				{
					name: "Nested",
					type: "svelte",
					source: `<i>Nested</i>`,
				},
			],
		});
	});
</script>

<Repl bind:this={replRef} workersUrl="workers" embedded relaxed />
