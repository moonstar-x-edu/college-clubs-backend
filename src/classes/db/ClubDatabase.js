const SQLiteDatabase = require('./SQLiteDatabase');
const ClubMembersManager = require('./ClubMembersManager');
const { ResourceAlreadyExistsError, ResourceNotFoundError, InvalidObjectTypeError, DatabaseError } = require('../../errors');
const { Club } = require('../entities');

class ClubDatabase extends SQLiteDatabase {
  constructor() {
    super('clubs.sqlite', 'DB:Clubs');

    this.clubs = this._createStore('clubs');
    this._prepareKeys(this.clubs);

    this.membersManager = new ClubMembersManager(this._createStore('members'));
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

    const createdKeysForClub = await this.membersManager.createKeysForClub(club.id);

    if (!createdKeysForClub) {
      throw new DatabaseError(`Keys for ${club.id} already existed! Did the club database and members go out-of-sync?`);
    }

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

    try {
      await this.membersManager.deleteAllClubMembers(old.id);

      const deletedKeysForClub = await this.membersManager.deleteKeysForClub(old.id);
  
      if (!deletedKeysForClub) {
        throw new Error(); // Will get re-thrown as proper error instance.
      }
    } catch (err) {
      throw new DatabaseError(`Keys for ${old.id} did not exist! Did the club database and members go out-of-sync?`);
    }
    

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

  async getClubMemberInAnyClubByStudentID(id) {
    const clubs = await this.getAll();

    const allMembers = await Promise.all(clubs.map((club) => {
      return this.membersManager.getAllClubMembers(club.id);
    }));

    const allMembersFlat = allMembers.reduce((acc, cur) => acc.concat(cur), []);

    return allMembersFlat.find((member) => member.studentID === id);
  }
}

module.exports = ClubDatabase;
