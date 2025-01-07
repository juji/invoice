import { intro, outro, select, log } from '@clack/prompts';

const Acts = {
  client: './client/index',
  invoice: './invoice/index',
  receipt: './receipt/index',
}

console.log(`
    _/                                  _/                     
       _/_/_/    _/      _/    _/_/          _/_/_/    _/_/    
  _/  _/    _/  _/      _/  _/    _/  _/  _/        _/_/_/_/   
 _/  _/    _/    _/  _/    _/    _/  _/  _/        _/          
_/  _/    _/      _/        _/_/    _/    _/_/_/    _/_/_/     
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

if(act.valueOf() && Acts[act.valueOf()]){
  
  try{
    const module = await import(Acts[act.valueOf()]).then(v => v.default)
    await module()
  }catch(e){
    log.error(e)    
  }

}else{
  log.error('No module with that name')
}


outro(`bye`);
