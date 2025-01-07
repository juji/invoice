import { log, spinner } from '@clack/prompts';
import puppeteer from 'puppeteer';
import http from 'http'
import serveStatic from 'serve-static'
import finalhandler from 'finalhandler'
import { $ } from 'bun';
import getPort from 'get-port';


export async function buildAndDownload({
  url, file
}:{
 url: string
 file: string
}){

  const port = await getPort()

  const s = spinner();
  s.start('Running build');
  await $`bun run build`.text()
  s.stop('Docs Built');

  const serve = serveStatic('build')
  const server = http.createServer(function onRequest (req, res) {
    serve(req, res, finalhandler(req, res))
  })

  await new Promise<void>((r,j) => {
    server.listen(port, async () => {
      try{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`http://localhost:${port}${url}`);
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