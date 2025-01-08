import { text, select, log } from '@clack/prompts';
import { readdir, writeFile, readFile } from 'fs/promises';
import { buildAndDownload } from '../lib/build-and-download';
import { isHttpsUri } from 'valid-url';
import { getVersionedFilename } from '../lib/get-versioned-filename';

async function getInvoices(){

  const dirContents = await readdir('./scripts/data/invoice')
  return Promise.all(
    dirContents.map(async v => {
      const str = await readFile( `./scripts/data/invoice/${v}`, { encoding: 'utf8'} )
      return {
        id: v.replace('.json',''),
        content: JSON.parse(str)
      }
    })
  )

}

export default async function receipt (){

  const invoices = await getInvoices()

  const invoiceId = await select({
    message: 'Select the invoice',
    options: invoices.map(v => {
      return {
        value: v.id,
        label: v.id
      }
    })
  });

  const invoice = invoiceId.valueOf()
  const invoiceObj = invoices.find(v => v.id === invoice)?.content
  if(!invoiceObj) throw new Error('Invoice object not found')

  const paymentVia = await select({
    message: 'Payment method?',
    options: [
      {
        value: 'single',
        label: 'single'
      },
      {
        value: 'subscription',
        label: 'subscription'
      }
    ]
  });
  
  const paymentDoneVia = paymentVia.valueOf()
  const paymentUrl = paymentDoneVia === 'single' ? 
    invoiceObj.singlePaymentUrl : invoiceObj.subscriptionUrl

  const paymentProof = await text({
    message: 'What is the paymentProofUrl?',
    initialValue: 'https://',
    validate(value) {
      if (value.length === 0) return `Value is required!`;
      if (!isHttpsUri(value)) return `Value needs to be a secure url (https)!`;
    },
  })

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