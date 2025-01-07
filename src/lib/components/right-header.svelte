<script lang="ts">

  const {
    color, 
    title,
    invoiceId, 
    receiptId, 
    date
  }:{
    color: 'invoice' | 'receipt' 
    title: string
    invoiceId?: string 
    receiptId?: string 
    date: Date
  } = $props()

  const bgColor = color === 'invoice' ? `var(--invoice-color)` : `var(--receipt-color)`

</script>

<div class="right-header">
  <p class="title" style={`--color:${bgColor}`}>{title}</p>
  {#if receiptId}
    <p>Receipt ID: {receiptId}</p>
  {/if}
  {#if invoiceId}
    <p>Invoice ID: {invoiceId}</p>
  {/if}
  <p>{date.toUTCString()}</p>
  <br />
  <p>Tri Rahmat Gunadi</p>
  <a target="_blank" href="https://jujiyangasli.com">jujiyangasli.com</a>
  <p>Tangerang, Indonesia</p>
</div>

<style>
  .right-header{
    text-align: right;
    line-height: 0.5rem;
    font-size: 14px;

    .title{
      font-size: large;
      padding: 1rem;
      margin-top: 0;
      background-color: var(--color);
      color: white;
    }
  }
</style>