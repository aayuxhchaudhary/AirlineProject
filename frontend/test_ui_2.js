import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  
  // wait extra time for load
  await new Promise(r => setTimeout(r, 2000));
  
  // we are in list mode by default, so just take screenshot
  await page.screenshot({ path: '/home/aayush/.gemini/antigravity/brain/654bd510-91c0-4ad5-b98f-46e12c941988/chrome_list_loaded.png' });
  
  await browser.close();
})();
