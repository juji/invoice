import { text } from "@clack/prompts";
import { isHttpsUri } from "valid-url";

export async function getPaymentProofUrl(){

  return await text({
    message: 'If there is a paymentProofUrl, insert it here:',
    initialValue: '',
    validate(value) {
      if (value.length && !isHttpsUri(value)) return `Value needs to be a secure url (https)!`;
    },
  })

}