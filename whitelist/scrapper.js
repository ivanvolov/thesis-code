const fs = require('fs-extra');
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const puppeteer = require('puppeteer');

(async () => {
    // const browser = await puppeteer.launch({ headless: false });
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const arr = [];

    await page.goto(`https://rarity.tools/meebits/view/1`);
    await delay(5000);
    try {
        for (let i = 7942; i <= 10000; i++) {
            console.log(i);
            // await page.goto(`https://rarity.tools/meebits/view/${i}`, { waitUntil: 'networkidle0' });
            await page.goto(`https://rarity.tools/meebits/view/${i}`);

            let rarity;
            while (!rarity) {
                await delay(1000);
                try {
                    const data = await page.evaluate(() => document.querySelector('*').outerHTML);
                    rarity = Number(data.split(`Rarity Score`)[1].split(` </div> <div class="px-4`)[0].split(`800">`)[1]);
                    // console.debug(rarity);
                } catch (err) { console.log(err) };
            }

            console.log(rarity);
            arr.push({ i, rarity });
            await save(arr);
        }

        await browser.close();
    } catch (err) { console.log(err) };


})();

async function save(arr) {
    let header = [];
    for (const i of arr) {
        header.push(...Object.keys(i));
    }
    header = header.filter(onlyUnique);

    console.log(header);
    let csvWriter = createCsvWriter({
        path: `whitelist/rating2.csv`,
        header: header.map(key => ({ id: key, title: key })),
    });
    await csvWriter.writeRecords(arr);
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}