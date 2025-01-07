<script lang="ts">
  let { children } = $props();
  import '$lib/styles/main.css';
  
</script>

<div class="layout">
{@render children()}
</div>

<style>
  .layout{
    height: 100vh;
    padding: 1rem;
  }
</style>