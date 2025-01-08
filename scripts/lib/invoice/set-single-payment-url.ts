import { text } from "@clack/prompts";
import { isHttpsUri } from "valid-url";


export async function setSinglePayment( defaultSinglePaymentUrl?: string ){

  return await text({
    message: 'What is the singlePaymentUrl?',
    initialValue: defaultSinglePaymentUrl ? defaultSinglePaymentUrl : 'https://',
    validate(value) {
      if (value.length === 0) return `Value is required!`;
      if (!isHttpsUri(value)) return `Value needs to be a secure url (https)!`;
    },
  });

}