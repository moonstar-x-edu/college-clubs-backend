/* eslint-disable max-params */
const logger = require('@greencoast/logger');
const { Post } = require('../src/classes/entities');
const { randomArrayItem, executeSequentially, randomBoolean } = require('./utils');

const content = 'content';

const createdAt = new Date().toISOString();

const randomLikes = () => Math.floor(Math.random() * 10);

const medias = [
  {
    url: 'https://example.com/image.jpg',
    description: 'image description'
  }, {
    url: 'https://example2.com/image.png',
    description: null
  }
];

const randomPost = (author) => {
  return {
    author,
    content,
    createdAt,
    likes: randomLikes(),
    media: randomBoolean() ? [randomArrayItem(medias)] : [],
    public: randomBoolean()
  };
};

const createPosts = (db, members, club, number) => {
  const memberIDs = members.map((s) => s.id);
  const posts = new Array(number).fill(null).map(() => Post.from(randomPost(randomArrayItem(memberIDs))));

  return executeSequentially(posts, (post) => {
    return db.postsManager.createPost(club.id, post);
  }, (post) => {
    logger.info(`Created Post ${post.id} in Club ${club.name} by ${post.author}`);
  });
};

module.exports = {
  createPosts
};
