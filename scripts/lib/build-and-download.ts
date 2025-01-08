import { log, spinner } from '@clack/prompts';
import puppeteer from 'puppeteer';
import http from 'http'
import serveStatic from 'serve-static'
import finalhandler from 'finalhandler'
import { $ } from 'bun';
import getPort from 'get-port';
import { copyFile, rm } from 'fs/promises';

export async function buildAndDownload({
  sourcename, 
  destination,
  url, file
}:{
  sourcename: string
  destination: string
  url: string
  file: string
}){

  
  // coyp sourcename to destination
  await copyFile(sourcename, destination)

  const s = spinner();
  s.start('Running build');
  try{
    
    await $`bun run build`.text()
    s.stop('Docs Built');

  }catch(e){
    
    s.stop('ERROR while Building');
    await rm(destination)
    throw e

  }
  
  
  const port = await getPort()
  const serve = serveStatic('build')
  const server = http.createServer(function onRequest (req, res) {
    serve(req, res, finalhandler(req, res))
  })

  await new Promise<void>((r,j) => {
    
    server.on('error',(e) => {
      j(e)
    })

    server.listen(port, async () => {
      try{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`http://localhost:${port}${url}`);
        await page.pdf({ path: `${file}` });
        await browser.close()
        log.info(`pdf saved to ${file}`)
        server.closeAllConnections()
        server.close()
        r()
      }catch(e){
        log.error(e)
        j(e)
      }
    })

  }).finally(async () => {

    // remove destination
    return await rm(destination)
  })


}