const fs = require('fs');
const path = require('path');
const logger = require('@greencoast/logger');
const Keyv = require('keyv');

const DATA_FOLDER_PATH = path.join(__dirname, '../../../data');

class SQLiteDatabase {
  constructor(filename, tag = 'DB:SQLiteDB') {
    this.dbPath = path.join(DATA_FOLDER_PATH, filename);
    this.URI = `sqlite://${this.dbPath}`;
    this.TAG = tag;

    this._prepareDBFileSync();
  }

  async getKeys(store) {
    return await store.get(SQLiteDatabase.KEYS);
  }

  async setKeys(store, newKeys) {
    await store.set(SQLiteDatabase.KEYS, newKeys);
    return newKeys;
  }

  _createStore(namespace) {
    const store = new Keyv(this.URI, { namespace });

    store.on('error', (error) => {
      logger.error(`(${this.TAG}) - A database connection error has ocurred in namespace ${namespace}.`);
      logger.error(`(${this.TAG}) - ${error}`);
    });

    return store;
  }

  _prepareDBFileSync() {
    if (!fs.existsSync(DATA_FOLDER_PATH)) {
      logger.warn(`(${this.TAG}) - Data folder not found, creating...`);
      fs.mkdirSync(DATA_FOLDER_PATH);
      logger.info(`(${this.TAG}) - Data folder created!`);
    }

    if (!fs.existsSync(this.dbPath)) {
      logger.warn(`(${this.TAG}) - Database file not found, creating...`);
      fs.writeFileSync(this.dbPath, '');
      logger.info(`(${this.TAG}) - Database file created!`);
    }
  }

  async _prepareKeys(store) {
    const keys = await store.get(SQLiteDatabase.KEYS);

    if (!keys) {
      logger.warn(`(${this.TAG}) - Keys not initialized! Initializing with an empty array...`);
      await store.set(SQLiteDatabase.KEYS, []);

      logger.info(`(${this.TAG}) - Initialized keys in store.`);
    }

    return null;
  }
}

SQLiteDatabase.KEYS = '_keys';

module.exports = SQLiteDatabase;
