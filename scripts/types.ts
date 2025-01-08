import { JInvoice, JInvoiceClient } from "./data/types"


export type ReceiptParams = {
  invoicePattern?: RegExp
}

export type InvoiceParams = {
  asClient?: JInvoiceClient
  defaultSinglePaymentUrl?: string
  defaultSubscriptionUrl?: string
  defaultLocale?: string
  defaultCurrency?: string
}

export type Invoice = {
  id: string 
  content: JInvoice
}

export type Clients = {

}