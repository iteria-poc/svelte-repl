<script>
  import Repl from './Repl.svelte'
  let replRef
  replRef.set({
			components: [
				{
					name: 'App',
					type: 'svelte',
					source: `<b>bold</b>`
				},{
					name: 'Nested',
					type: 'svelte',
					source: `<i>Nested</i>`
				},
			]
		})
</script>

<Repl
   bind:this={replRef}
   workersUrl="workers"
   embedded
   relaxed
   />
