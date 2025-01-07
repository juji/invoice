<script lang="ts">
	import type { JInvoice } from "$lib/data/types";

  const {
    items,
    numberFormatLocale,
    numberFormatCurrency,
    total
  }:{
    items: JInvoice['items']
    numberFormatLocale: string
    numberFormatCurrency: string
    total: number
  } = $props()

  const intl = new Intl.NumberFormat( 
    numberFormatLocale, 
    { style: 'currency', currency: numberFormatCurrency } 
  )

</script>

<table>
  <thead>
    <tr>
      <th>Items</th>
      <th>Price ({numberFormatCurrency})</th>
    </tr>
  </thead>
  <tbody>
    {#each items as item }
      <tr>
        <td>{item.name}</td>
        <td>{item.price ? intl.format(item.price) : 'priceless'}</td>
      </tr>
    {/each}
    <tr>
      <th>Total</th>
      <th>{intl.format(total)}</th>
    </tr>
  </tbody>
</table>

<style>

  table{
		width: 100%;
		border-spacing: 0px;
		border-collapse: collapse;
    margin-bottom: 2rem;

		th, td{
			text-align: left;
			border: 1px solid var(--border-color);
			padding: 1rem;

			&:nth-child(2){
				width: 40%;
			}
		}

		td{
			font-size: 0.9rem;
			padding: 1.5rem 1rem;
		}
		
	}
</style>