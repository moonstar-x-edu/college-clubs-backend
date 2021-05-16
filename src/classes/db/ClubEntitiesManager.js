class ClubEntitiesManager {
  constructor(store) {
    this.store = store;
  }

  async getKeysForClub(clubID) {
    return await this.store.get(clubID);
  }

  async setKeysForClub(clubID, newKeys) {
    return await this.store.set(clubID, newKeys);
  }

  async createKeysForClub(clubID) {
    const keys = await this.store.get(clubID);

    if (!keys) {
      await this.store.set(clubID, []);
      return true;
    }

    return false;
  }

  async deleteKeysForClub(clubID) {
    return await this.store.delete(clubID);
  }
}

module.exports = ClubEntitiesManager;
