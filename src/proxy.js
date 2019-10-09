const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const proxyWebsite = "https://www.xicidaili.com/";

async function refresh() {
  const options = {
    headless: true,
    devtools: true
  };

  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  await page.goto(proxyWebsite);

  const data = await page.evaluate(() => {
    const ipListEl = document.querySelectorAll("#ip_list tr");
    const ipList = [];
    const isIp = (str = "") => {
      return str.split(".").length >= 4;
    };

    ipListEl.forEach(item => {
      const tds = item.querySelectorAll("td");
      const ip = tds.length >= 7 ? tds[1].innerHTML.trim() : "";

      if (ip && isIp(ip)) {
        const contry = tds[0].querySelector("img");
        ipList.push({
          country: contry ? contry.getAttribute("alt").toLowerCase() : "",
          ip,
          port: tds[2].innerHTML.trim(),
          city: tds[3].innerText.trim(),
          hidden: tds[4].innerHTML.trim() === "高匿",
          protocol: tds[5].innerHTML.trim().toLowerCase(),
          survival_time: tds[6].innerText.trim() || tds[8].innerText.trim(),
          verify_time: tds[7].innerText.trim() || tds[9].innerText.trim(),
        });
      }
    });
    return ipList;
  });

  await browser.close();

  fs.writeFileSync(
    path.resolve(__dirname, "../proxy.json"),
    JSON.stringify(data)
  );

  return data;
}

module.exports = {
  refresh
};
