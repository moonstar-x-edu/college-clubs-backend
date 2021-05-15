const express = require('express');
const bodyParser = require('body-parser');
const Response = require('../classes/Response');
const { onlySupportedMethods } = require('../middleware');
const { InvalidBodyError } = require('../errors');
const { Club, ClubMember } = require('../classes/entities');
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

router.put('/club/:id', (req, res, next) => {
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

router.all('/club/:id', onlySupportedMethods(['GET', 'DELETE', 'PUT']));

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
      return clubs.membersManager.createClubMember(clubID, ClubMember.from(body))
        .then((created) => {
          const response = new Response(Response.CODES.CREATED);
          return res.status(response.code).send(response.create(created));
        });
    })
    .catch(next);
});

router.all('/club/:clubID/members', onlySupportedMethods(['GET', 'POST']));

module.exports = router;
