import { text, select, log } from '@clack/prompts';
import { readdir, writeFile, readFile } from 'fs/promises';
import { buildAndDownload } from '../lib/build-and-download';
import { addLeadingZero } from '../lib/add-leading-zero';
import { isHttpsUri } from 'valid-url';

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
    validate(value) {
      if (value.length === 0) return `Value is required!`;
      if (!isHttpsUri(value)) return `Value needs to be a secure url (https)!`;
    },
  })

  const paymentProofUrl = paymentProof.valueOf()

  const data = {
    paymentProofUrl,
    paymentDoneVia,
    paymentUrl,
    invoiceId,
    date: new Date().toISOString()
  }

  const now = new Date()

  const v = await text({
    message: 'What version is this receipt?',
    initialValue: '1',
    validate(value) {
      if (value.length === 0) return `Value is required!`;
      if(!Number(value)) return 'It should be a number with value';
      if(Number(value) < 0) return 'You really want to test something? test your sanity';
    },
  });

  const version = v.toString()

  const fileName = `${invoiceObj.client.code}-receipt-` +
      `${now.getFullYear()}.` + 
      `${addLeadingZero(now.getMonth()+1)}.` +
      `${addLeadingZero(now.getDate())}-${version}`
  
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