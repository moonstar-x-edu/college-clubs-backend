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

module.exports = {
  clearDataSync,
  randomArrayItem
};
