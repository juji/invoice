<script lang="ts">
  import '$lib/styles/main.css';
  let { children } = $props();
</script>

<div class="layout">
{@render children()}
</div>

<style>
  .layout{
    /* this can be problematic */
    height: 100vh;
    padding: 1rem;
  }
</style>