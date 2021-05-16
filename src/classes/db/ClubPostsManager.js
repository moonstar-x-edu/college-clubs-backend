const ClubEntitiesManager = require('./ClubEntitiesManager');
const { InvalidObjectTypeError, ResourceAlreadyExistsError, ResourceNotFoundError } = require('../../errors');
const { Post } = require('../entities');

class ClubPostManager extends ClubEntitiesManager {
  async createPost(clubID, post) {
    if (!(post instanceof Post)) {
      throw new InvalidObjectTypeError('New post needs to be of instance Post.');
    }

    const entry = await this.store.get(`${clubID}:${post.id}`);

    if (entry) {
      throw new ResourceAlreadyExistsError(`Post ${post.id} already exists in club ${clubID}.`);
    }

    const keys = await this.getKeysForClub(clubID);

    if (!keys) {
      throw new ResourceNotFoundError(`Club ${clubID} does not exist.`);
    }

    await this.setKeysForClub(clubID, [...keys, post.id]);

    await this.store.set(`${clubID}:${post.id}`, post);

    return post;
  }

  async getPost(clubID, id) {
    const entry = await this.store.get(`${clubID}:${id}`);

    if (!entry) {
      throw new ResourceNotFoundError(`Post ${id} does not exist in club ${clubID}.`);
    }

    return entry;
  }

  async getAllPosts(clubID) {
    const keys = await this.getKeysForClub(clubID);

    if (!keys) {
      throw new ResourceNotFoundError(`Club ${clubID} does not exist.`);
    }

    return Promise.all(keys.map((key) => this.getPost(clubID, key)));
  }

  async deletePost(clubID, id) {
    const old = await this.getPost(clubID, id);
    await this.store.delete(`${clubID}:${id}`);

    const keys = await this.getKeysForClub(clubID);
    await this.setKeysForClub(clubID, keys.filter((key) => key !== id));

    return old;
  }

  async deleteAllPosts(clubID) {
    const keys = await this.getKeysForClub(clubID);

    return Promise.all(keys.map((key) => this.deletePost(clubID, key)));
  }

  async updatePost(clubID, postID, newPost) {
    if (!(newPost instanceof Post.Partial)) {
      throw new InvalidObjectTypeError('New post needs to be of instance Post.Partial.');
    }

    const old = await this.getPost(clubID, postID);
    const merged = { ...old, ...newPost };

    await this.store.set(`${clubID}:${postID}`, merged);

    return merged;
  }

  async updatePostLikes(clubID, postID, increment) {
    const old = await this.getPost(clubID, postID);
    const newPost = {
      ...old,
      likes: old.likes + increment
    };

    await this.store.set(`${clubID}:${postID}`, newPost);

    return newPost;
  }
}

module.exports = ClubPostManager;
