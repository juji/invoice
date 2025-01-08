import { readFile } from "fs/promises"
import { readdir } from "fs/promises"
import type { JInvoiceClient } from "../../data/types"


export async function getClients(){

  const dirContents = await readdir('./scripts/data/client')
  return Promise.all(
    dirContents.map(async v => {
      const str = await readFile( `./scripts/data/client/${v}`, { encoding: 'utf8'} )
      return JSON.parse(str) as JInvoiceClient
    })
  )

}