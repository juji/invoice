
import { select } from "@clack/prompts";
import { Invoice } from "../../types";

export async function selectInvoice(invoices: Invoice[]){

  const invoiceId = await select({
    message: 'Select the invoice',
    options: invoices.map(v => {
      return {
        value: v.id,
        label: v.id
      }
    })
  });

  return invoiceId

}