const puppeteer = require('puppeteer');
const { mn } = require('./config/default');
const srcToImg = require('./helper/srcToImg');

(async() => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://image.baidu.com/');
  console.log('go to http://image.baidu.com/');

  await page.setViewport({
    width: 1920,
    height: 1080
  });
  console.log('reset viewport');

  await page.focus('#kw');
  await page.keyboard.sendCharacter('美女');
  await page.click('.s_btn');
  console.log('go to search list');

  page.on('load', async () => {
    console.log('page loading done, start fetch...');

    const srcs = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img.main_img');
      return Array.prototype.map.call(imgs, img => img.src);
    });
    console.log(`get ${srcs.length} images, start download...`);

    srcs.forEach(async(src) => {
      await page.waitFor(200);
      await srcToImg(src, mn);
    });

    await browser.close();

  });

})();
