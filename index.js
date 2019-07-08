const puppeteer = require('puppeteer');
const url = "https://medium.com/free-code-camp/why-you-should-choose-usestate-instead-of-usereducer-ffc80057f815";
const proxies = [
    "114.143.205.226:42574",
    "129.205.160.160:57195",
    "117.102.104.131:37098",
    "178.210.148.123:53281"
];

const randomProxy = () => 
    proxies[Math.floor(Math.random() * (proxies.length - 1))]

const autoScroll = page => 
    page.evaluate(
        async () => await new Promise((resolve, reject) => {
            let totalHeight = 0
            let distance = 100
            let timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight
                window.scrollBy(0, distance)
                totalHeight += distance
                if(totalHeight >= scrollHeight){
                    clearInterval(timer)
                    resolve()
                }
            }, 300)
        })
    )

(async () => {
  const browser = await puppeteer.launch({
      args: [`--proxy-server=http=${randomProxy}`, "--incognito"],
      headless: true
  });
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle2" });
  } catch (error) {
    console.log(error);
    browser.close();
  }
  process.on("unhandledRejection", (reason, p) => {
    console.error("Unhandled Rejection at: Promise", p, "reason:", reason);
    browser.close();
  });

  await page.setViewport({ width: 1200, height: 800 });
  await autoScroll(page);
  await page.screenshot({ path: "test.png", type: "png" });
  await page.close();
  await browser.close();
})();