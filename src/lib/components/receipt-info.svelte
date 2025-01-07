<script lang="ts">
	import type { JReceipt } from "$lib/data/types";

  const {
    paymentDoneVia,
    paymentProofUrl
  }:{
    paymentDoneVia?: JReceipt['paymentDoneVia']
    paymentProofUrl: string
  } = $props()

</script>

<div class="receipt-info">
  {#if paymentDoneVia}
  <p>
    Payment was done via {paymentDoneVia === 'single' ? 'Single Payment' : 'Subscription'}.
  </p>
  {/if}
  <p>
    <a target="_blank" href={paymentProofUrl}>See Proof of Payment</a>
  </p>
</div>

<style>
  
</style>