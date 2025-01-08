import { intro, outro, select, log, isCancel } from '@clack/prompts';

console.log(`
██ ███    ██ ██    ██  ██████  ██  ██████ ███████ 
██ ████   ██ ██    ██ ██    ██ ██ ██      ██      
██ ██ ██  ██ ██    ██ ██    ██ ██ ██      █████   
██ ██  ██ ██  ██  ██  ██    ██ ██ ██      ██      
██ ██   ████   ████    ██████  ██  ██████ ███████ 
`)

intro(`Yo!`);

const act = await select({
  message: 'Pick one',
  options: [
    { value: 'client', label: 'Add Client' },
    { value: 'invoice', label: 'Create Invoice' },
    { value: 'receipt', label: 'Create Receipt' },
  ],
});

const val = act.valueOf()
if(isCancel(val)){
  outro(`bye`);
  process.exit()
}

if(!val) throw new Error('no act')

if( val === 'client' ){
  
  try{
    const module = await import('./client/index').then(v => v.default)
    await module()
  }catch(e){
    console.error(e)
  }

}else if(val === 'invoice'){
  
  try{
    const module = await import('./invoice/index').then(v => v.default)
    await module()
  }catch(e){
    console.error(e) 
  }

}else if(val === 'receipt'){
  
  try{
    const module = await import('./receipt/index').then(v => v.default)
    await module()
  }catch(e){
    console.error(e) 
  }

}


outro(`bye`);
