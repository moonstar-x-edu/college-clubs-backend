const ClubEntitiesManager = require('./ClubEntitiesManager');
const { ResourceAlreadyExistsError, ResourceNotFoundError, InvalidObjectTypeError } = require('../../errors');
const { ClubMember } = require('../entities');

class ClubMembersManager extends ClubEntitiesManager {
  async createClubMember(clubID, clubMember) {
    if (!(clubMember instanceof ClubMember)) {
      throw new InvalidObjectTypeError('New club member needs to be of instance ClubMember.');
    }

    const entry = await this.store.get(`${clubID}:${clubMember.id}`);

    if (entry) {
      throw new ResourceAlreadyExistsError(`Club member ${clubMember.id} already exists in club ${clubID}.`);
    }

    const keys = await this.getKeysForClub(clubID);

    if (!keys) {
      throw new ResourceNotFoundError(`Club ${clubID} does not exist.`);
    }

    await this.setKeysForClub(clubID, [...keys, clubMember.id]);

    await this.store.set(`${clubID}:${clubMember.id}`, clubMember);

    return clubMember;
  }

  async getClubMember(clubID, id) {
    const entry = await this.store.get(`${clubID}:${id}`);

    if (!entry) {
      throw new ResourceNotFoundError(`Club member ${id} does not exist in club ${clubID}.`);
    }

    return entry;
  }

  async getAllClubMembers(clubID) {
    const keys = await this.getKeysForClub(clubID);

    if (!keys) {
      throw new ResourceNotFoundError(`Club ${clubID} does not exist.`);
    }

    return Promise.all(keys.map((key) => this.getClubMember(clubID, key)));
  }

  async deleteClubMember(clubID, id) {
    const old = await this.getClubMember(clubID, id);
    await this.store.delete(`${clubID}:${id}`);

    const keys = await this.getKeysForClub(clubID);
    await this.setKeysForClub(clubID, keys.filter((key) => key !== id));

    return old;
  }

  async deleteAllClubMembers(clubID) {
    const keys = await this.getKeysForClub(clubID);

    return Promise.all(keys.map((key) => this.deleteClubMember(clubID, key)));
  }

  async updateClubMember(clubID, clubMemberID, newClubMember) {
    if (!(newClubMember instanceof ClubMember.Partial)) {
      throw new InvalidObjectTypeError('New club member needs to be of instance ClubMember.Partial');
    }

    const old = await this.getClubMember(clubID, clubMemberID);
    const merged = { ...old, ...newClubMember };

    await this.store.set(`${clubID}:${clubMemberID}`, merged);

    return merged;
  }
}

module.exports = ClubMembersManager;
