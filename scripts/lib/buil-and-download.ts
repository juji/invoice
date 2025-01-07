import { log } from '@clack/prompts';
import puppeteer from 'puppeteer';
import http from 'http'
import serveStatic from 'serve-static'
import finalhandler from 'finalhandler'
import { $ } from 'bun';


export async function buildAndDownload({
  url, file
}:{
 url: string,
 file: string 
}){

  await $`bun run build`

  const serve = serveStatic('build')
  const server = http.createServer(function onRequest (req, res) {
    serve(req, res, finalhandler(req, res))
  })

  await new Promise<void>((r,j) => {
    server.listen(8765, async () => {
      try{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`http://localhost:8765${url}`);
        await page.pdf({ path: `${file}` });
        await browser.close()
        log.message(`pdf saved to ${file}`)
        server.closeAllConnections()
        server.close()
        r()
      }catch(e){
        log.error(e)
        j(e)
      }
    })
  })
}