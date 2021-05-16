const path = require('path');
const fs = require('fs');
const logger = require('@greencoast/logger');

const DATA_PATH = path.join(__dirname, '../data');

const clearDataSync = () => {
  const files = fs.readdirSync(DATA_PATH).filter((file) => file.endsWith('.sqlite'));
  for (const file of files) {
    fs.unlinkSync(path.join(DATA_PATH, file));
    logger.warn(`Removed ${file}`);
  }
};

const randomArrayItem = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const executeSequentially = (arr, fn, thenFn) => {
  return fn(arr.shift())
    .then((x) => {
      thenFn(x);
      if (arr.length > 0) {
        return executeSequentially(arr, fn, thenFn);
      }
    });
};

const randomBoolean = () => !!Math.round(Math.random());

module.exports = {
  clearDataSync,
  randomArrayItem,
  executeSequentially,
  randomBoolean
};
