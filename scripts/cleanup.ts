import { intro, outro, confirm, isCancel, log } from "@clack/prompts";
import { writeFile } from "fs/promises";
import { mkdir } from "fs/promises";
import { cp, rm } from "fs/promises";

intro('cleanup')

const c = await confirm({
  message: `
  This will cleanup your data into it's orginal form. 
  Your saved clients, invoices, and receipts will be gone. 
  All created pdfs will also be gone.
  Continue?
  `
})

if(isCancel(c) || !c){
  process.exit()
}

log.warning('Cleaning..')

log.message('Removing invoices')
await rm('./scripts/data/invoice', { recursive: true })
await cp('./src/lib/data/invoice', './scripts/data/invoice',{ recursive: true })

log.message('Removing receipts')
await rm('./scripts/data/receipt', { recursive: true })
await cp('./src/lib/data/receipt', './scripts/data/receipt',{ recursive: true })

log.message('Removing clients')
await rm('./scripts/data/client', { recursive: true })
await cp('./src/lib/data/client', './scripts/data/client',{ recursive: true })

log.message('Removing pdfs')
await rm('./results', { recursive: true })
await mkdir('./results')
await writeFile('./results/.gitkeep','')

outro('cleanup done')