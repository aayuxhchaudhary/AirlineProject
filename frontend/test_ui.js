import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  
  await page.screenshot({ path: '/home/aayush/.gemini/antigravity/brain/654bd510-91c0-4ad5-b98f-46e12c941988/chrome_list.png' });
  
  // Click grid button
  await page.click('button[aria-label="Grid view"]');
  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({ path: '/home/aayush/.gemini/antigravity/brain/654bd510-91c0-4ad5-b98f-46e12c941988/chrome_grid.png' });
  
  await browser.close();
})();
