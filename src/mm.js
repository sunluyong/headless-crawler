const puppeteer = require('puppeteer');
const config = require('./config/default');
const strToImg = require('./helper/strToImg');

async function run() {
  const browser = await puppeteer.launch({
    headless: true
  });

  const page = await browser.newPage();
  await page.goto('http://image.baidu.com/');
  await page.setViewport({
    width: 1920,
    height: 2000
  });
  console.log('viewport setting done');

  await page.focus('#kw');
  await page.keyboard.sendCharacter('美女');
  const button = await page.$('.s_btn');
  await button.click();
  console.log('go to search list page');

  page.on('load', async() => {
    console.log('page load, start analyse...');

    const srcs = await page.evaluate(() => {
      const iamges = document.querySelectorAll('img.main_img');
      return Array.prototype.map.call(iamges, img => img.src);
    });

    console.log(`get ${srcs.length} images, downloading to disk...`);

    srcs.forEach(async(src) => {
      page.waitFor(200);
      await strToImg(src, config.mm);
    });

    await browser.close();
  });
}

run();
