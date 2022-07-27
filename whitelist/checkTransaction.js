const fs = require('fs-extra');
const Web3 = require("web3");
const ethNetwork = 'https://mainnet.infura.io/v3/02dc1b201ea0402eb4d789fb23b5ce6a';
const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

// let's fetch a balance

// getTransactionReceipt

// 0xd09229a8
// input
// status

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// (async () => {
//     let data = fs.readJsonSync("whitelist/res-from-alchemy-procecced.json");

//     console.log(data.length);
//     let arr = [];
//     for (const i of data) {
//         const res = await web3.eth.getTransactionReceipt(i.hash);
//         if(res.status){
//             arr.push(i);
//         }

//         console.log(1);
//         await delay(50);
//         // break;
//     }

//     fs.writeJSONSync("whitelist/res-from-alchemy-procecced2.json", arr);
// })();

// const str = "0xd09229a8";
// (async () => {
//     let data = fs.readJsonSync("whitelist/res-from-alchemy-procecced2.json");
//     console.log(data.length);

//     let arr = [];
//     let j = 0;
//     for (const i of data) {
//         const res = await web3.eth.getTransaction(i.hash);
//         // console.log(res);
//         if (res.input.startsWith(str)) {
//             arr.push(i);
//         }

//         j++;
//         await delay(50);
//         if (j % 10 == 0) console.log(j);
//         // break;
//     }

//     fs.writeJSONSync("whitelist/res-from-alchemy-procecced3.json", arr);
// })();


// (async () => {
//     let data = fs.readJsonSync("whitelist/res-from-alchemy-procecced3.json");
//     console.log(data.length);
// })();


// (async () => {
//     let data = fs.readJsonSync("whitelist/res-from-alchemy-procecced3.json");
//     console.log(data.length);
// })();

(async () => {
    let data = fs.readJsonSync("whitelist/res-from-alchemy-procecced3.json");
    console.log(data.length);

    const dict = {};
    data.map(i => {
        if (!dict[i.from]) dict[i.from] = 0;
        dict[i.from]++;
    });

    data = Object.keys(dict).map(i => ({
        address: i,
        whitelisted: dict[i],
    }));

    let header = [];
    for (const i of data) {
        header.push(...Object.keys(i));
    }
    header = header.filter(onlyUnique);

    console.log(header);
    let csvWriter = createCsvWriter({
        path: `whitelist/whitelist.csv`,
        header: header.map(key => ({ id: key, title: key })),
    });
    // console.log(data);
    await csvWriter.writeRecords(data);

    // fs.writeJSONSync("whitelist/whitelist.json", data);
})();

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}