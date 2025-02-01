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
  {#if paymentProofUrl}
  <p>
    <a target="_blank" href={paymentProofUrl}>See Proof of Payment</a>
  </p>
  {:else}
  <p>
    Payment Proof was sent along with this document.
  </p>
  {/if}
</div>

<style>
  .receipt-info{
    border: 1px solid var(--border-color);
    padding: 1rem;

    p{
      margin: 0;
    }

    p:first-child{
      margin-bottom: 0.5rem;
    }
  }
</style>