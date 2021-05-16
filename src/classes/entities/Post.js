const Joi = require('joi');
const { v4: uuid } = require('uuid');
const Validator = require('./Validator');

class Post {
  constructor(validated) {
    for (const key in validated) {
      this[key] = validated[key];
    }

    this.id = uuid();
  }

  static from(obj, toCreate = true) {
    if (toCreate) {
      const validated = Validator.validate(obj, Post.SCHEMA.CREATE);
      return new Post(validated);
    }

    const validated = Validator.validate(obj, Post.SCHEMA.UPDATE);
    return new Post.Partial(validated);
  }
}

Post.SCHEMA = {
  CREATE: Joi.object({
    id: Joi.forbidden(),
    author: Joi.string().trim().required(),
    content: Joi.string().trim().max(2000).required(),
    createdAt: Joi.string().isoDate(),
    likes: Joi.number().min(0).default(0),
    media: Joi.array().items(Joi.object({
      url: Joi.string().uri().required(),
      description: Joi.string().trim().max(1024).allow('').allow(null).default(null)
    })).default([]),
    public: Joi.boolean().default(true)
  }),
  UPDATE: Joi.object({
    id: Joi.forbidden(),
    author: Joi.forbidden(),
    content: Joi.string().trim().max(2000),
    createdAt: Joi.forbidden(),
    likes: Joi.number().min(0),
    media: Joi.array().items(Joi.object({
      url: Joi.string().uri().required(),
      description: Joi.string().trim().max(1024).allow('').allow(null).default(null)
    })),
    public: Joi.boolean()
  })
};

Post.Partial = class Partial {
  constructor(validated) {
    for (const key in validated) {
      this[key] = validated[key];
    }
  }
};

module.exports = Post;
