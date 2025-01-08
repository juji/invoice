import { log, isCancel } from '@clack/prompts';
import { writeFile } from 'fs/promises';
import { buildAndDownload } from '../lib/build-and-download';
import { getVersionedFilename } from '../lib/get-versioned-filename';
import { getInvoices } from '../lib/receipt/get-invoices'
import { selectInvoice } from '../lib/receipt/select-invoice';

import type { ReceiptParams } from '../types';
import selectPaymentMethod from '../lib/receipt/select-payment-method';
import { getPaymentProofUrl } from '../lib/receipt/get-payment-proof-url';

export default async function receipt ( par?: ReceiptParams ){

  const {
    invoicePattern
  } = par || {}

  const invoices = await getInvoices( invoicePattern )
  const invoiceId = await selectInvoice( invoices )

  if(isCancel(invoiceId)){
    log.error('canceled')
    return;
  }

  const invoice = invoiceId.valueOf()
  const invoiceObj = invoices.find(v => v.id === invoice)?.content
  if(!invoiceObj) throw new Error('Invoice object not found')

  const paymentVia = await selectPaymentMethod()

  if(isCancel(paymentVia)){
    log.error('canceled')
    return;
  }
  
  const paymentDoneVia = paymentVia.valueOf()
  const paymentUrl = paymentDoneVia === 'single' ? 
    invoiceObj.singlePaymentUrl : invoiceObj.subscriptionUrl

  const paymentProof = await getPaymentProofUrl()

  if(isCancel(paymentProof)){
    log.error('canceled')
    return;
  }

  const paymentProofUrl = paymentProof.valueOf()

  const date = new Date()
  const data = {
    paymentProofUrl,
    paymentDoneVia,
    paymentUrl,
    invoiceId,
    date: date.toISOString()
  }

  const fileName = await getVersionedFilename({ 
    clientCode: invoiceObj.client.code,
    date,
    type: 'receipt'
  })

  if(!fileName) return;
  
  await writeFile( 
    `./scripts/data/receipt/${fileName}.json`, 
    JSON.stringify(data, null, 2) 
  )

  await buildAndDownload({
    sourcename: `./scripts/data/receipt/${fileName}.json`,
    destination: `./src/lib/data/receipt/${fileName}.json`,
    url: `/receipt/${fileName}.html`,
    file: `./results/${fileName}.pdf`
  })

  log.success('done')

}