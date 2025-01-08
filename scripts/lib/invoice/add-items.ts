import { isCancel, log, select, text } from "@clack/prompts";
import type { JInvoiceItem } from "../../data/types";


export async function addItems(){

  let done = false
  let confirmDone = false
  let items: JInvoiceItem[] = []
  let canceled = false

  while(!done){

    if(confirmDone){
      const isDone = await select({
        message: 'Are you done adding items?',
        options: [
          { value: true, label: 'Done' },
          { value: false, label: 'Add Another' }
        ],
      });

      if(isCancel(isDone)){
        log.error('canceled')
        canceled = true
        break;
      }

      done = !!isDone.valueOf()
    }

    if(!done){

      const n = await text({
        message: 'What is the name of the item?',
        validate(value) {
          if (value.length === 0) return `Value is required!`;
        },
      });

      if(isCancel(n)){
        log.error('canceled')
        canceled = true
        break;
      }

      const data: {
        name: string
        price?: number
      } = {
        name: n.valueOf() as string,
      }

      const isPriceless = await select({
        message: 'Is it priceless?',
        options: [
          { value: false, label: 'Input the price' },
          { value: true, label: 'Yes' },
        ],
      });

      if(isCancel(isPriceless)){
        log.error('canceled')
        canceled = true
        break;
      }

      if(isPriceless.valueOf()){

        log.info('Awesome!')
        items.push(data)
        confirmDone = true
        
      }else{

        const price = await text({
          message: 'What\'s the price?',
          validate(value) {
            if (value.length === 0) return `Value is required!`;
            if(!Number(value)) return 'It should be a number with value';
            if(Number(value) < 0) return 'Loss is not a billable thing';
          },
        });

        if(isCancel(price)){
          log.error('canceled')
          canceled = true
          break;
        }

        data.price = Number(price.valueOf())
        items.push(data)
        confirmDone = true

      }

    }

  }

  return {
    canceled,
    items
  }

}