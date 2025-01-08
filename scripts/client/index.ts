import { text, log } from '@clack/prompts';
import { writeFile } from 'fs/promises'

export default async function client (){

  const cc = await text({
    message: "What is the client code you want to use?",
    placeholder: 'smallcase.nospace',
    validate(value) {
      if (value.length === 0) return `Value is required!`;
    },
  });

  const code = cc.valueOf().toString().toLowerCase().replace(/[\s\r\n]/g,'')

  const n = await text({
    message: "What is the client company name?",
    validate(value) {
      if (value.length === 0) return `Value is required!`;
    },
  });

  const name = n.valueOf()

  const a = await text({
    message: "What is the address?",
    validate(value) {
      if (value.length === 0) return `Value is required!`;
    },
  });

  const address = a.valueOf()

  const p = await text({
    message: "Name the person you are working with in this company",
    validate(value) {
      if (value.length === 0) return `Value is required!`;
    },
  });

  const person = p.valueOf()

  const e = await text({
    message: "What is the email for that person?",
    validate(value) {
      if (value.length === 0) return `Value is required!`;
    },
  });

  const personEmail = e.valueOf()

  const data = JSON.stringify({
    code, name, address, person, personEmail
  }, null, 2)

  await writeFile( `./scripts/data/client/${code}.json`, data )  

  log.success('created')


}