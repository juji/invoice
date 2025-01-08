import { text } from "@clack/prompts";


export async function setLocale( defaultLocale?: string ){

  return await text({
    message: 'What\'s the locale for Intl.NumberFormat?',
    initialValue: defaultLocale || 'en-US',
    validate(value) {
      if (value.length === 0) return `Value is required!`;
    },
  });

}