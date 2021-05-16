const express = require('express');
const bodyParser = require('body-parser');
const Response = require('../classes/Response');
const { onlySupportedMethods } = require('../middleware');
const { InvalidBodyError, ResourceAlreadyExistsError } = require('../errors');
const { Club, ClubMember, Post } = require('../classes/entities');
const { clubs, students } = require('../classes/db');

const router = express.Router();
router.use(bodyParser.json());

router.get('/clubs', (req, res, next) => {
  return clubs.getAll()
    .then((data) => {
      const response = new Response(Response.CODES.OK);
      return res.status(response.code).send(response.create(data));
    })
    .catch(next);
});

router.post('/clubs', (req, res, next) => {
  const { body } = req;

  if (!body || Object.keys(body).length < 1) {
    throw new InvalidBodyError(Response.DEFAULT_MESSAGES.MISSING_JSON_BODY);
  }

  return clubs.create(Club.from(body))
    .then((created) => {
      const response = new Response(Response.CODES.CREATED);
      return res.status(response.code).send(response.create(created));
    })
    .catch(next);
});

router.all('/clubs', onlySupportedMethods(['GET', 'POST']));

router.get('/club/:id', (req, res, next) => {
  const { id } = req.params;

  return clubs.get(id)
    .then((data) => {
      const response = new Response(Response.CODES.OK);
      return res.status(response.code).send(response.create(data));
    })
    .catch(next);
});

router.delete('/club/:id', (req, res, next) => {
  const { id } = req.params;

  return clubs.delete(id)
    .then((deleted) => {
      const response = new Response(Response.CODES.OK);
      return res.status(response.code).send(response.create(deleted));
    })
    .catch(next);
});

router.patch('/club/:id', (req, res, next) => {
  const { body, params: { id } } = req;

  if (!body || Object.keys(body).length < 1) {
    throw new InvalidBodyError(Response.DEFAULT_MESSAGES.MISSING_JSON_BODY);
  }

  return clubs.update(id, Club.from(body, false))
    .then((updated) => {
      const response = new Response(Response.CODES.OK);
      return res.status(response.code).send(response.create(updated));
    })
    .catch(next);
});

router.all('/club/:id', onlySupportedMethods(['GET', 'DELETE', 'PATCH']));

router.get('/club/:clubID/members', (req, res, next) => {
  const { clubID } = req.params;

  return clubs.membersManager.getAllClubMembers(clubID)
    .then((data) => {
      const response = new Response(Response.CODES.OK);
      return res.status(response.code).send(response.create(data));
    })
    .catch(next);
});

router.post('/club/:clubID/members', (req, res, next) => {
  const { body, params: { clubID } } = req;

  if (!body || Object.keys(body).length < 1) {
    throw new InvalidBodyError(Response.DEFAULT_MESSAGES.MISSING_JSON_BODY);
  }

  if (!body.studentID) {
    throw new InvalidBodyError('A studentID property needs to be specified!');
  }

  return students.get(body.studentID)
    .then(() => {
      return clubs.getClubMemberInAnyClubByStudentID(body.studentID)
        .then((member) => {
          if (member) {
            throw new ResourceAlreadyExistsError(`Student ${body.studentID} is already a member of a club!`);
          }

          return clubs.membersManager.createClubMember(clubID, ClubMember.from(body))
            .then((created) => {
              const response = new Response(Response.CODES.CREATED);
              return res.status(response.code).send(response.create(created));
            });
        });
    })
    .catch(next);
});

router.all('/club/:clubID/members', onlySupportedMethods(['GET', 'POST']));

router.get('/club/:clubID/member/:memberID', (req, res, next) => {
  const { clubID, memberID } = req.params;

  return clubs.membersManager.getClubMember(clubID, memberID)
    .then((data) => {
      const response = new Response(Response.CODES.OK);
      return res.status(response.code).send(response.create(data));
    })
    .catch(next);
});

router.delete('/club/:clubID/member/:memberID', (req, res, next) => {
  const { clubID, memberID } = req.params;

  return clubs.membersManager.deleteClubMember(clubID, memberID)
    .then((deleted) => {
      const response = new Response(Response.CODES.OK);
      return res.status(response.code).send(response.create(deleted));
    })
    .catch(next);
});

router.patch('/club/:clubID/member/:memberID', (req, res, next) => {
  const { body, params: { clubID, memberID } } = req;

  if (!body || Object.keys(body).length < 1) {
    throw new InvalidBodyError(Response.DEFAULT_MESSAGES.MISSING_JSON_BODY);
  }

  return clubs.membersManager.updateClubMember(clubID, memberID, ClubMember.from(body, false))
    .then((updated) => {
      const response = new Response(Response.CODES.OK);
      return res.status(response.code).send(response.create(updated));
    })
    .catch(next);
});

router.all('/club/:clubID/member/:memberID', onlySupportedMethods(['GET', 'DELETE', 'PATCH']));

router.get('/club/:clubID/posts', (req, res, next) => {
  const { clubID } = req.params;

  return clubs.postsManager.getAllPosts(clubID)
    .then((data) => {
      const response = new Response(Response.CODES.OK);
      return res.status(response.code).send(response.create(data));
    })
    .catch(next);
});

router.post('/club/:clubID/posts', (req, res, next) => {
  const { body, params: { clubID } } = req;

  if (!body || Object.keys(body).length < 1) {
    throw new InvalidBodyError(Response.DEFAULT_MESSAGES.MISSING_JSON_BODY);
  }

  if (!body.author) {
    throw new InvalidBodyError('An author property needs to be specified!');
  }

  return clubs.membersManager.getClubMember(clubID, body.author)
    .then(() => {
      return clubs.postsManager.createPost(clubID, Post.from(body))
        .then((created) => {
          const response = new Response(Response.CODES.CREATED);
          return res.status(response.code).send(response.create(created));
        });
    })
    .catch(next);
});

router.all('/club/:clubID/posts', onlySupportedMethods(['GET', 'POST']));

router.get('/club/:clubID/post/:postID', (req, res, next) => {
  const { clubID, postID } = req.params;

  return clubs.postsManager.getPost(clubID, postID)
    .then((data) => {
      const response = new Response(Response.CODES.OK);
      return res.status(response.code).send(response.create(data));
    })
    .catch(next);
});

router.delete('/club/:clubID/post/:postID', (req, res, next) => {
  const { clubID, postID } = req.params;

  return clubs.postsManager.deletePost(clubID, postID)
    .then((deleted) => {
      const response = new Response(Response.CODES.OK);
      return res.status(response.code).send(response.create(deleted));
    })
    .catch(next);
});

router.patch('/club/:clubID/post/:postID', (req, res, next) => {
  const { body, params: { clubID, postID } } = req;

  if (!body || Object.keys(body).length < 1) {
    throw new InvalidBodyError(Response.DEFAULT_MESSAGES.MISSING_JSON_BODY);
  }

  return clubs.postsManager.updatePost(clubID, postID, Post.from(body, false))
    .then((updated) => {
      const response = new Response(Response.CODES.OK);
      return res.status(response.code).send(response.create(updated));
    })
    .catch(next);
});

router.all('/club/:clubID/post/:postID', onlySupportedMethods(['GET', 'DELETE', 'PATCH']));

router.patch('/club/:clubID/post/:postID/like', (req, res, next) => {
  const { clubID, postID } = req.params;

  return clubs.postsManager.updatePostLikes(clubID, postID, 1)
    .then((updated) => {
      const response = new Response(Response.CODES.OK);
      return res.status(response.code).send(response.create(updated));
    })
    .catch(next);
});

router.all('/club/:clubID/post/:postID/like', onlySupportedMethods(['PATCH']));

router.patch('/club/:clubID/post/:postID/dislike', (req, res, next) => {
  const { clubID, postID } = req.params;

  return clubs.postsManager.updatePostLikes(clubID, postID, -1)
    .then((updated) => {
      const response = new Response(Response.CODES.OK);
      return res.status(response.code).send(response.create(updated));
    })
    .catch(next);
});

router.all('/club/:clubID/post/:postID/dislike', onlySupportedMethods(['PATCH']));

module.exports = router;
