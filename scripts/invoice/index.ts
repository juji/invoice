import { text, select, log } from '@clack/prompts';
import { readdir, writeFile, readFile } from 'fs/promises';
import { type JInvoiceItem } from '../../src/lib/data/types'
import { buildAndDownload } from '../lib/build-and-download';
import { addLeadingZero } from '../lib/add-leading-zero';
import { isHttpsUri } from 'valid-url';

async function getClients(){

  const dirContents = await readdir('./src/lib/data/client')
  return Promise.all(
    dirContents.map(async v => {
      const str = await readFile( `./src/lib/data/client/${v}`, { encoding: 'utf8'} )
      return JSON.parse(str)
    })
  )

}

export default async function invoice (){

  const clients = await getClients()

  const clientSel = await select({
    message: 'Select the client',
    options: clients.map(v => {
      return {
        value: v.code,
        label: v.name
      }
    })
  });

  const client = clients.find(v => v.code === clientSel.valueOf())

  if(!client) throw new Error(`client code: ${clientSel.valueOf()} not found`)

  const singlePayment = await text({
    message: 'What is the singlePaymentUrl?',
    validate(value) {
      if (value.length === 0) return `Value is required!`;
      if (!isHttpsUri(value)) return `Value needs to be a secure url (https)!`;
    },
  });

  const singlePaymentUrl = singlePayment.valueOf()

  const subscription = await text({
    message: 'What is the subscriptionUrl?',
    validate(value) {
      if (value.length === 0) return `Value is required!`;
      if (!isHttpsUri(value)) return `Value needs to be a secure url (https)!`;
    },
  });

  const subscriptionUrl = subscription.valueOf()

  const locale = await text({
    message: 'What\'s the locale for Intl.NumberFormat?',
    initialValue: 'en-US',
    validate(value) {
      if (value.length === 0) return `Value is required!`;
    },
  });

  const numberFormatLocale = locale.toString()

  const currency = await text({
    message: 'What\'s the currency for Intl.NumberFormat?',
    initialValue: 'USD',
    validate(value) {
      if (value.length === 0) return `Value is required!`;
    },
  });

  const numberFormatCurrency = currency.toString()

  let done = false
  let confirmDone = false
  let items: JInvoiceItem[] = []

  while(!done){

    if(confirmDone){
      const isDone = await select({
        message: 'Are you done adding items?',
        options: [
          { value: true, label: 'Done' },
          { value: false, label: 'Add Another' }
        ],
      });

      done = !!isDone.valueOf()
    }

    if(!done){

      const n = await text({
        message: 'What is the name of the item?',
        validate(value) {
          if (value.length === 0) return `Value is required!`;
        },
      });

      const data: {
        name: string
        price?: number
      } = {
        name: n.valueOf() as string,
      }

      const isPriceless = await select({
        message: 'Is it priceless?',
        options: [
          { value: false, label: 'Input the price' },
          { value: true, label: 'Yes' },
        ],
      });

      if(isPriceless.valueOf()){

        log.info('Awesome!')
        items.push(data)
        confirmDone = true

      }else{

        const price = await text({
          message: 'What\'s the price?',
          validate(value) {
            if (value.length === 0) return `Value is required!`;
            if(!Number(value)) return 'It should be a number with value';
            if(Number(value) < 0) return 'Loss is not a billable thing';
          },
        });

        data.price = Number(price.valueOf())
        items.push(data)
        confirmDone = true

      }

    }

  }

  const v = await text({
    message: 'What version is this invoice?',
    initialValue: '1',
    validate(value) {
      if (value.length === 0) return `Value is required!`;
      if(!Number(value)) return 'It should be a number with value';
      if(Number(value) < 0) return 'You really want to test something? test your sanity';
    },
  });

  const version = v.toString()

  const now = new Date()
  const data = {
    client,
    singlePaymentUrl,
    subscriptionUrl,
    numberFormatCurrency,
    numberFormatLocale,
    items,
    date: now.toISOString()
  }

  const fileName = `${client.code}-inv-` +
    `${now.getFullYear()}.` + 
    `${addLeadingZero(now.getMonth()+1)}.` +
    `${addLeadingZero(now.getDate())}-${version}`

  await writeFile( 
    `./src/lib/data/invoice/${fileName}.json`, 
    JSON.stringify(data, null, 2) 
  )

  await buildAndDownload({
    url: `/invoice/${fileName}.html`,
    file: `./results/${fileName}.pdf`
  })

  log.success('done')


}