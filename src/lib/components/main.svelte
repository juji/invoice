<script lang="ts">
	import type { JInvoice, JReceipt } from "$lib/data/types";
	import Logo from "./logo.svelte";
	import RightHeader from "./right-header.svelte";
	import Footer from "./footer.svelte";
	import Table from "./table.svelte";
	import Client from "./client.svelte";
	import ReceiptInfo from "./receipt-info.svelte";
	import PaymentInfo from "./payment-info.svelte";
  
	let { 
		id,
		data, 
		title, 
		color 
	}:{ 
		id: string
		data: JInvoice | JReceipt
		title: 'Invoice' | 'Receipt' 
		color: 'invoice' | 'receipt'
	} = $props();

	// svelte-ignore non_reactive_update
	// was used
	let total = 0
	let items: JInvoice['items'] = []
	let client: JInvoice['client'] | null = null
	let clientAddress: string = ''
	let clientName = ''
	let clientPerson = ''
	let clientPersonEmail = ''

	let receiptId = ''
	let invoiceId = ''
	let date: Date | string = ''

	let singlePaymentUrl = ''
	let subscriptionUrl = ''
	let paymentDoneVia: JReceipt['paymentDoneVia'] | '' = ''
	let paymentProofUrl = ''
	let numberFormatLocale = ''
	let numberFormatCurrency = ''

	let invoiceRef: JInvoice | null = null
	
	if((data as JReceipt).invoiceId){

		receiptId = id
		
		let d = data as JReceipt
		invoiceRef = d.invoiceRef
		invoiceId = d.invoiceId
		date = new Date(d.date)
		paymentDoneVia = d.paymentDoneVia
		paymentProofUrl = d.paymentProofUrl

	}else{

		let d = data as JInvoice
		invoiceRef = d
		date = new Date(d.date)
		invoiceId = id

	}

	items = invoiceRef.items
	client = invoiceRef.client

	numberFormatLocale = invoiceRef.numberFormatLocale
	numberFormatCurrency = invoiceRef.numberFormatCurrency
	
	total = invoiceRef.items.reduce((a,b) => a + (b.price ? b.price : 0), 0)
	clientAddress = invoiceRef.client.address
	clientName = invoiceRef.client.name
	clientPerson = invoiceRef.client.person
	clientPersonEmail = invoiceRef.client.personEmail

	singlePaymentUrl = invoiceRef.singlePaymentUrl
	subscriptionUrl = invoiceRef.subscriptionUrl

</script>

<div class="container">

	<header>
		<Logo />
		<RightHeader
			color={color}
			title={title}
			invoiceId={invoiceId}
			receiptId={receiptId}
			date={date}
		/>
	</header>
	
	<main>
		<Table 
			items={items}
			numberFormatLocale={numberFormatLocale}
			numberFormatCurrency={numberFormatCurrency}
			total={total}
		/>
		<div class="bottom">
			<Client 
				title={title}
				clientName={clientName}
				clientAddress={clientAddress}
				clientPerson={clientPerson}
				clientPersonEmail={clientPersonEmail}
			/>
			{#if title === 'Receipt' }
				<ReceiptInfo 
					paymentDoneVia={paymentDoneVia || undefined}
					paymentProofUrl={paymentProofUrl}
				/>
			{:else}
				<PaymentInfo
					singlePaymentUrl={singlePaymentUrl}
					subscriptionUrl={subscriptionUrl}
				/>
			{/if}
		</div>
	</main>

	<Footer />

</div>


<style>

	
	.container{
		height: 100%;
		border: 1px solid var(--border-color);
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: auto 1fr auto;
	}

	header{
		padding: 1rem;
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid var(--border-color);
	}

	main{
		padding: 1rem;

		.bottom{
			display: grid;
			grid-template-columns: 1fr 1fr;
		}
	}

	


</style>