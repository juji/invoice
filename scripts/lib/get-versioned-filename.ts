import { text, log, isCancel } from '@clack/prompts';
import { stat } from 'fs/promises';
import { addLeadingZero } from '../lib/add-leading-zero';


export async function getVersionedFilename({
  clientCode,
  date,
  type
}:{
  clientCode: string
  date: Date
  type: 'receipt' | 'invoice'
}){

  let version = ''
  let fileName = ''
  let first = true
  let initialValue = 0

  while(!version){

    const mssg = first ? 
      `What version is this ${type}?` : 
      'Version change is required:';
    
    first = false
    initialValue++;

    const v = await text({
      message: mssg,
      initialValue: initialValue + '',
      validate(value) {
        if (value.length === 0) return `Value is required!`;
        if(!Number(value)) return 'It should be a number with value';
        if(Number(value) < 0) return 'You really want to test something? test your sanity';
      },
    });

    if(isCancel(v)){
      log.error('canceled')
      return '';
    }

    version = v.toString()

    fileName = `${clientCode}-${type}-` +
      `${date.getFullYear()}.` + 
      `${addLeadingZero(date.getMonth()+1)}.` +
      `${addLeadingZero(date.getDate())}-${version}`

    try{
      await stat(`./scripts/data/${type}/${fileName}.json`)
      version = ''
      log.error('Version already exist')
    }catch(e){}

  }

  return fileName

}
  