const puppeteer = require("puppeteer");

async function run({ proxyServer, url }) {
  return new Promise(async resolve => {
    const options = {
      headless: true,
      args: ["--no-sandbox", `--proxy-server=${proxyServer}`]
    };

    if (!proxyServer) {
      delete options;
    }

    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    const timer = setTimeout(() => {
      resolve(false);
    }, 3000);
    try {
      await page.goto(url);
      clearTimeout(timer);
      await browser.close();
      resolve(true);
    } catch (error) {
      clearTimeout(timer);
      await browser.close();
      resolve(false);
    }
  });
}

module.exports = run;
