
export type JInvoiceItem = {
  name: string
  price?: number
}

export type JInvoiceClient = {
  code: string
  name: string
  address: string
  person: string
  personEmail: string
}

export type JInvoice = {
  date: string
  client: JInvoiceClient
  items: JInvoiceItem[]
  singlePaymentUrl: string
  subscriptionUrl: string
  numberFormatLocale: string,
  numberFormatCurrency: string,
  tax?: number
}

export type JReceipt = {
  date: string
  invoiceId: string
  invoiceRef: JInvoice
  paymentDoneVia: 'single' | 'subscription'
  paymentUrl: string
  paymentProofUrl: string
}