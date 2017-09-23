const puppeteer = require('puppeteer');
const config = require('./config/default');

async function run() {
  const browser = await puppeteer.launch({
    headless: true
  });
  console.log('launched browser');
  const page = await browser.newPage();
  console.log('got a page');

  await page.goto('https://github.com');
  console.log('go to website');

  await page.screenshot({
    path: `${config.screenshots}/${Date.now()}.png`,
  });
  console.log(`got screenshot in ${config.screenshots}`);

  await browser.close();
}

run();
