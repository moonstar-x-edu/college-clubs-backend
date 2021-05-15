const SQLiteDatabase = require('./SQLiteDatabase');
const { ResourceAlreadyExistsError, ResourceNotFoundError, InvalidObjectTypeError } = require('../../errors');
const { Club } = require('../entities');

class ClubDatabase extends SQLiteDatabase {
  constructor() {
    super('clubs.sqlite', 'DB:Clubs');

    this.clubs = this._createStore('clubs');
    this._prepareKeys(this.clubs);
  }

  async create(club) {
    if (!(club instanceof Club)) {
      throw new InvalidObjectTypeError('New club needs to be of instance Student.');
    }

    const entry = await this.clubs.get(club.id);

    if (entry) {
      throw new ResourceAlreadyExistsError(`Club ${club.id} already exists.`);
    }

    await this.clubs.set(club.id, club);

    const keys = await this.getKeys(this.clubs);
    await this.setKeys(this.clubs, [...keys, club.id]);

    return club;
  }

  async get(id) {
    const entry = await this.clubs.get(id);

    if (!entry) {
      throw new ResourceNotFoundError(`Club ${id} does not exist!`);
    }

    return entry;
  }

  async getAll() {
    const keys = await this.getKeys(this.clubs);

    return Promise.all(keys.map((key) => this.get(key)));
  }

  async delete(id) {
    const old = await this.get(id);
    await this.clubs.delete(id);

    const keys = await this.getKeys(this.clubs);
    await this.setKeys(this.clubs, keys.filter((key) => key !== id));

    return old;
  }

  async update(id, newClub) {
    if (!(newClub instanceof Club.Partial)) {
      throw new InvalidObjectTypeError('New club needs to be of instance Club.Partial.');
    }
    
    const old = await this.get(id);
    const merged = { ...old, ...newClub };

    await this.clubs.set(id, merged);

    return merged;
  }
}

module.exports = ClubDatabase;