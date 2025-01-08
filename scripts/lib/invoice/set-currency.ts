import { text } from "@clack/prompts";


export async function setCurrency( defaultCurrency?: string ){

  return await text({
    message: 'What\'s the currency for Intl.NumberFormat?',
    initialValue: defaultCurrency ? defaultCurrency : 'USD',
    validate(value) {
      if (value.length === 0) return `Value is required!`;
    },
  });

}