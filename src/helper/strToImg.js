const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);

module.exports = async (str, dir) => {
  if ((/\.(png|jpg|gif)$/).test(str)) {
    await urlToImg(str, dir);
  } else {
    await base64ToImg(str, dir);
  }
};

async function base64ToImg(base64Str, dir) {
  const matches = base64Str.match(/^data:(.+?);base64,(.+)$/);
  try {
    const ext = matches[1].split('/')[1].replace('jpeg', 'jpg');
    const file = path.join(dir, `./${Date.now()}.${ext}`);
    await writeFile(file, matches[2], 'base64');
    console.log(file);

  } catch (ex) {
    console.log('非法 base64 字符串！');
  }
};

const urlToImg = promisify((url, dir, callback) => {
  const file = path.join(dir, `./${Date.now()}${path.extname(url)}`);
  const mod = /^https/.test(url) ? https: http;
  mod.get(url, res => {
    res.pipe(fs.createWriteStream(file))
      .on('finish', () => {
        callback();
        console.log(file);
      });
  });
})
