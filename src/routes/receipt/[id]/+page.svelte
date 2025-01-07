<script>

  import Layout from "$lib/component/layout.svelte";

  /** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

  $effect(() => {
    window.print()
  })

</script>

<svelte:head>
  <title>{data.id}</title>
</svelte:head>

<Layout 
  id={data.id}
  data={data.data}
  color={'#139740'}
  title="Receipt"
/>