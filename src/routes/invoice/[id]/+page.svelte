<script>

  import Layout from "$lib/component/main.svelte";

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
  color={'#f400ff'}
  title="Invoice"
/>