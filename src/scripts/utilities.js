const { BigNumber } = require("@ethersproject/bignumber");
const fs = require("fs-extra");
const moment = require("moment");
const { parse } = require("csv-parse");

function sleeper(time) {
  return new Promise((resolve) => setTimeout(resolve, time * 1000));
}

const Token = (value, digits) => {
  if (value === 0 || value === "0" || !value) return BigNumber.from(0);

  value = parseFloat(value.toString());
  let [x, y] = value.toString().split(".");

  const a = BigNumber.from(x + "0".repeat(digits));
  if (y) {
    y = y.slice(0, digits);
    let zeros = digits - y.length;
    const b = BigNumber.from(y + (zeros > 0 ? "0".repeat(zeros) : ""));

    return a.add(b);
  } else return a;
};

const _Token = (value, digits) => {
  if (value.toString() === "0") return "0";
  const num = value.toString();
  let newNum;

  if (num.length > 18) {
    const point = num.length - digits;

    const parts = [num.slice(0, point), num.slice(point)];
    // console.log(parts);

    if (parts[1].replace(/0/gi, "") === "") {
      newNum = parts[0];
    } else if (!parts[0]) {
      newNum = "0." + parts[1];
      while (newNum[newNum.length - 1] === "0") newNum = newNum.slice(0, -1);
    } else {
      newNum = parts.join(".");
      while (newNum[newNum.length - 1] === "0") newNum = newNum.slice(0, -1);
    }
  } else {
    const delta = digits - num.length;
    newNum = "0." + "0".repeat(delta) + num;
    while (newNum[newNum.length - 1] === "0") newNum = newNum.slice(0, -1);
  }
  return newNum;
};

const getETHPriceDF = () => {
  return new Promise((resolve) => {
    fs.readFile("cur/ETH-USD.csv", (_, fileData) => {
      parse(fileData, {}, (_, rows) => {
        resolve(
          rows.slice(1).map((i) => ({
            time: moment(i[0]),
            price: parseFloat(i[4]),
          }))
        );
      });
    });
  });
};

module.exports = {
  getETHPriceDF,
  sleeper,
};
