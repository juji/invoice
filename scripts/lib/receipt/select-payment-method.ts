import { select } from "@clack/prompts";

export default async function selectPaymentMethod(){

  return await select({
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

}