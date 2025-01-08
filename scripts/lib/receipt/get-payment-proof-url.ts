import { text } from "@clack/prompts";
import { isHttpsUri } from "valid-url";

export async function getPaymentProofUrl(){

  return await text({
    message: 'What is the paymentProofUrl?',
    initialValue: 'https://',
    validate(value) {
      if (value.length === 0) return `Value is required!`;
      if (!isHttpsUri(value)) return `Value needs to be a secure url (https)!`;
    },
  })

}