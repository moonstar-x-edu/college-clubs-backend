const { ResourceAlreadyExistsError, ResourceNotFoundError, InvalidObjectTypeError } = require('../../errors');
const { ClubMember } = require('../entities');

class ClubMemberManager {
  constructor(store) {
    this.members = store;
  }

  async createClubMember(clubID, clubMember) {
    if (!(clubMember instanceof ClubMember)) {
      throw new InvalidObjectTypeError('New club member needs to be of instance ClubMember.');
    }

    const entry = await this.members.get(`${clubID}:${clubMember.id}`);

    if (entry) {
      throw new ResourceAlreadyExistsError(`Club member ${clubMember.id} already exists in club ${clubID}.`);
    }

    await this.members.set(`${clubID}:${clubMember.id}`, clubMember);

    const keys = await this.getKeysForClub(clubID);
    await this.setKeysForClub(clubID, [...keys, clubMember.id]);

    return clubMember;
  }

  async getClubMember(clubID, id) {
    const entry = await this.members.get(`${clubID}:${id}`);

    if (!entry) {
      throw new ResourceNotFoundError(`Club member ${id} does not exist in club ${clubID}.`);
    }

    return entry;
  }

  async getAllClubMembers(clubID) {
    const keys = await this.getKeysForClub(clubID);

    return Promise.all(keys.map((key) => this.getClubMember(clubID, key)));
  }

  async deleteClubMember(clubID, id) {
    const old = await this.getClubMember(`${clubID}:${id}`);
    await this.members.delete(`${clubID}:${id}`);

    const keys = await this.getKeysForClub(clubID);
    await this.setKeysForClub(clubID, keys.filter((key) => key !== id));

    return old;
  }

  async updateClubMember(clubID, clubMemberID, newClubMember) {
    if (!(newClubMember instanceof ClubMember.Partial)) {
      throw new InvalidObjectTypeError('New club member needs to be of instance ClubMember.Partial');
    }

    const old = await this.get(`${clubID}:${clubMemberID}`);
    const merged = { ...old, ...newClubMember };

    await this.members.set(`${clubID}:${clubMemberID}`, merged);

    return merged;
  }

  async getKeysForClub(clubID) {
    return await this.members.get(clubID);
  }

  async setKeysForClub(clubID, newKeys) {
    return await this.members.set(clubID, newKeys);
  }

  async createKeysForClub(clubID) {
    const keys = await this.members.get(clubID);

    if (!keys) {
      await this.members.set(clubID, []);
      return true;
    }

    return false;
  }

  async deleteKeysForClub(clubID) {
    return await this.members.delete(clubID);
  }
}

module.exports = ClubMemberManager;
