import { text, log, isCancel } from '@clack/prompts';
import { stat } from 'fs/promises';
import { writeFile } from 'fs/promises'
import * as EmailValidator from 'email-validator';

export default async function client (){

  let code = ''

  while(!code){

    const cc = await text({
      message: "What is the client code you want to use?",
      placeholder: 'smallcase nospace nosymbols dot.allowed alphabeth.first',
      validate(value) {
        if (value.length === 0) return `Value is required!`;
        if(!value.match(/^[a-z]+([a-z0-9.])+$/)) return 'smallcase nospace nosymbols dot.allowed alphabeth.first'
      },
    });
  
    if(isCancel(cc)){
      log.error('canceled')
      return;
    }
  
    code = cc.valueOf().toString().toLowerCase().replace(/[\s\r\n]/g,'')

    try{
      await stat(`./scripts/data/client/${code}.json`)
      code = ''
      log.error(`the code '${code}' has been used`)
    }catch(e){}

  }

  const n = await text({
    message: "What is the client company name?",
    validate(value) {
      if (value.length === 0) return `Value is required!`;
    },
  });

  if(isCancel(n)){
    log.error('canceled')
    return;
  }

  const name = n.valueOf()

  const a = await text({
    message: "What is the address?",
    validate(value) {
      if (value.length === 0) return `Value is required!`;
    },
  });

  if(isCancel(a)){
    log.error('canceled')
    return;
  }

  const address = a.valueOf()

  const p = await text({
    message: "Name the person you are working with in this company",
    validate(value) {
      if (value.length === 0) return `Value is required!`;
    },
  });

  if(isCancel(p)){
    log.error('canceled')
    return;
  }

  const person = p.valueOf()

  const e = await text({
    message: "What is the email for that person?",
    validate(value) {
      if (value.length === 0) return `Value is required!`;
      if(!EmailValidator.validate(value)) return `Email doesn't seem to be valid`
    },
  });

  if(isCancel(e)){
    log.error('canceled')
    return;
  }

  const personEmail = e.valueOf()

  const data = JSON.stringify({
    code, name, address, person, personEmail
  }, null, 2)

  await writeFile( `./scripts/data/client/${code}.json`, data )  

  log.success('created')


}