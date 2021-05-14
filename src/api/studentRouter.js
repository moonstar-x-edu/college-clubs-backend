const express = require('express');
const bodyParser = require('body-parser');
const Response = require('../classes/Response');
const { onlySupportedMethods } = require('../middleware');
const { InvalidBodyError } = require('../errors');
const { Student } = require('../classes/entities');
const { students } = require('../classes/db');

const router = express.Router();
router.use(bodyParser.json());

router.get('/students', (req, res, next) => {
  return students.getAll()
    .then((data) => {
      const response = new Response(Response.CODES.OK);
      return res.status(response.code).send(response.create(data));
    })
    .catch(next);
});

router.post('/students', (req, res, next) => {
  const { body } = req;

  if (!body || Object.keys(body).length < 1) {
    throw new InvalidBodyError(Response.DEFAULT_MESSAGES.MISSING_JSON_BODY);
  }

  return students.create(Student.from(body))
    .then((created) => {
      const response = new Response(Response.CODES.CREATED);
      return res.status(response.code).send(response.create(created));
    })
    .catch(next);
});

router.all('/students', onlySupportedMethods(['GET', 'POST']));

router.get('/student/:id', (req, res, next) => {
  const { id } = req.params;

  return students.get(id)
    .then((data) => {
      const response = new Response(Response.CODES.OK);
      return res.status(response.code).send(response.create(data));
    })
    .catch(next);
});

router.delete('/student/:id', (req, res, next) => {
  const { id } = req.params;

  return students.delete(id)
    .then((removed) => {
      const response = new Response(Response.CODES.OK);
      return res.status(response.code).send(response.create(removed));
    })
    .catch(next);
});

router.put('/student/:id', (req, res, next) => {
  const { body, params: { id } } = req;

  if (!body || Object.keys(body).length < 1) {
    throw new InvalidBodyError(Response.DEFAULT_MESSAGES.MISSING_JSON_BODY);
  }

  return students.update(id, Student.from(body, false))
    .then((updated) => {
      const response = new Response(Response.CODES.OK);
      return res.status(response.code).send(response.create(updated));
    })
    .catch(next);
});

router.all('/student/:id', onlySupportedMethods(['GET', 'DELETE', 'PUT']));

module.exports = router;
