import { select } from "@clack/prompts";
import type { JInvoiceClient } from "../../data/types";

export async function selectClient(clients: JInvoiceClient[]){

  return await select({
    message: 'Select the client',
    options: clients.map(v => {
      return {
        value: v.code,
        label: v.name
      }
    })
  });

}