import { log, isCancel } from '@clack/prompts';
import { writeFile } from 'fs/promises';
import { buildAndDownload } from '../lib/build-and-download';
import { getVersionedFilename } from '../lib/get-versioned-filename';
import { getClients } from '../lib/invoice/get-clients'
import { selectClient } from '../lib/invoice/select-client';
import { setSinglePayment } from '../lib/invoice/set-single-payment-url';
import { setSubscriptionUrl } from '../lib/invoice/set-subscription-url'
import { setLocale } from '../lib/invoice/set-locale'
import { setCurrency } from '../lib/invoice/set-currency'
import { addItems } from '../lib/invoice/add-items';

import type { JInvoiceClient } from '../../scripts/data/types'
import type { InvoiceParams } from '../types';

export default async function invoice (par?:InvoiceParams){

  const {
    asClient,
    defaultSinglePaymentUrl,
    defaultSubscriptionUrl,
    defaultLocale,
    defaultCurrency
  } = par || {}

  //
  let client: JInvoiceClient;
  if(asClient) {
    client = asClient
  }else{

    const clients = await getClients()
    const clientSel = await selectClient( clients );
  
    if(isCancel(clientSel)){
      log.error('canceled')
      return;
    }
  
    const c = clients.find(v => v.code === clientSel.valueOf())
    if(!c) throw new Error(`client code: ${clientSel.valueOf()} not found`)
    client = c

  }
  
  //
  const singlePayment = await setSinglePayment( defaultSinglePaymentUrl )
  if(isCancel(singlePayment)){
    log.error('canceled')
    return;
  }
  const singlePaymentUrl = singlePayment.valueOf()

  //
  const subscription = await setSubscriptionUrl( defaultSubscriptionUrl )
  if(isCancel(subscription)){
    log.error('canceled')
    return;
  }
  const subscriptionUrl = subscription.valueOf()

  //
  const locale = await setLocale( defaultLocale );
  if(isCancel(locale)){
    log.error('canceled')
    return;
  }
  const numberFormatLocale = locale.toString()

  //
  const currency = await setCurrency( defaultCurrency )
  if(isCancel(currency)){
    log.error('canceled')
    return;
  }
  const numberFormatCurrency = currency.toString()

  //
  const { canceled, items } = await addItems()
  if(canceled) return;

  //
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