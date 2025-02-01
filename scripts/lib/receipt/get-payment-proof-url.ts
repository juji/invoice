import { text } from "@clack/prompts";
import { isHttpsUri } from "valid-url";

export async function getPaymentProofUrl(){

  return await text({
    message: 'What is the paymentProofUrl?',
    initialValue: '',
    validate(value) {
      if (value.length && !isHttpsUri(value)) return `Value needs to be a secure url (https)!`;
    },
  })

}