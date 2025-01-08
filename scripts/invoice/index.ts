import { text, select, log, isCancel } from '@clack/prompts';
import { readdir, writeFile, readFile } from 'fs/promises';
import { type JInvoiceItem } from '../../scripts/data/types'
import { buildAndDownload } from '../lib/build-and-download';
import { isHttpsUri } from 'valid-url';
import { getVersionedFilename } from '../lib/get-versioned-filename';

async function getClients(){

  const dirContents = await readdir('./scripts/data/client')
  return Promise.all(
    dirContents.map(async v => {
      const str = await readFile( `./scripts/data/client/${v}`, { encoding: 'utf8'} )
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

  if(isCancel(clientSel)){
    log.error('canceled')
    return;
  }

  const client = clients.find(v => v.code === clientSel.valueOf())

  if(!client) throw new Error(`client code: ${clientSel.valueOf()} not found`)

  const singlePayment = await text({
    message: 'What is the singlePaymentUrl?',
    initialValue: 'https://',
    validate(value) {
      if (value.length === 0) return `Value is required!`;
      if (!isHttpsUri(value)) return `Value needs to be a secure url (https)!`;
    },
  });

  if(isCancel(singlePayment)){
    log.error('canceled')
    return;
  }

  const singlePaymentUrl = singlePayment.valueOf()

  const subscription = await text({
    message: 'What is the subscriptionUrl?',
    initialValue: 'https://',
    validate(value) {
      if (value.length === 0) return `Value is required!`;
      if (!isHttpsUri(value)) return `Value needs to be a secure url (https)!`;
    },
  });

  if(isCancel(subscription)){
    log.error('canceled')
    return;
  }

  const subscriptionUrl = subscription.valueOf()

  const locale = await text({
    message: 'What\'s the locale for Intl.NumberFormat?',
    initialValue: 'en-US',
    validate(value) {
      if (value.length === 0) return `Value is required!`;
    },
  });

  if(isCancel(locale)){
    log.error('canceled')
    return;
  }

  const numberFormatLocale = locale.toString()

  const currency = await text({
    message: 'What\'s the currency for Intl.NumberFormat?',
    initialValue: 'USD',
    validate(value) {
      if (value.length === 0) return `Value is required!`;
    },
  });

  if(isCancel(currency)){
    log.error('canceled')
    return;
  }

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

      if(isCancel(isDone)){
        log.error('canceled')
        return;
      }

      done = !!isDone.valueOf()
    }

    if(!done){

      const n = await text({
        message: 'What is the name of the item?',
        validate(value) {
          if (value.length === 0) return `Value is required!`;
        },
      });

      if(isCancel(n)){
        log.error('canceled')
        return;
      }

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

      if(isCancel(isPriceless)){
        log.error('canceled')
        return;
      }

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

        if(isCancel(price)){
          log.error('canceled')
          return;
        }

        data.price = Number(price.valueOf())
        items.push(data)
        confirmDone = true

      }

    }

  }

  const date = new Date()
  const data = {
    client,
    singlePaymentUrl,
    subscriptionUrl,
    numberFormatCurrency,
    numberFormatLocale,
    items,
    date: date.toISOString()
  }

  const fileName = await getVersionedFilename({ 
    clientCode: client.code,
    date,
    type: 'invoice'
  })

  if(!fileName) return;

  await writeFile( 
    `./scripts/data/invoice/${fileName}.json`, 
    JSON.stringify(data, null, 2) 
  )

  await buildAndDownload({
    sourcename: `./scripts/data/invoice/${fileName}.json`,
    destination: `./src/lib/data/invoice/${fileName}.json`,
    url: `/invoice/${fileName}.html`,
    file: `./results/${fileName}.pdf`
  })

  log.success('done')


}