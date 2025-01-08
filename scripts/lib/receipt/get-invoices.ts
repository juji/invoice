import { readdir, readFile } from "fs/promises"
import { Invoice } from "../../types"

export async function getInvoices( pattern?: RegExp ): Promise<Invoice[]> {

  const dirContents = await readdir('./scripts/data/invoice')
  let dirContentsFiltered = pattern ? dirContents.filter(v => v.match(pattern)) : dirContents
  return Promise.all(
    dirContentsFiltered.map(async v => {
      const str = await readFile( `./scripts/data/invoice/${v}`, { encoding: 'utf8'} )
      return {
        id: v.replace('.json',''),
        content: JSON.parse(str)
      }
    })
  )

}