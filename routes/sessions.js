const express = require('express');

const router = express.Router();
const sessionRepo = require('../repos/sessionsRepo');

router.get('/', (req, res, next) => {
  sessionRepo.get(
    (data) => {
      const response = {
        status: 200,
        statusText: 'OK',
        message: 'All sessions retrieved.',
        data,
      };
      res.status(200).json(response);
    },
    (err) => {
      next(err);
    },
  );
});

router.get('/:id/plans', (req, res, next) => {
  sessionRepo.getPlansById(
    req.params.id,
    (data) => {
      if (data) {
        const response = {
          status: 200,
          statusText: 'OK',
          message: 'List of plans retrieved.',
          data,
        };
        res.status(200).json(response);
      } else {
        const response = {
          status: 404,
          statusText: 'Not Found',
          message: `Plans or the session '${req.params.id}' could not be found.`,
          error: {
            code: 'NOT_FOUND',
            message: `Plans or the session '${req.params.id}' could not be found.`,
          },
        };
        res.status(404).json(response);
      }
    },
    (err) => {
      next(err);
    },
  );
});

router.get('/:id', (req, res, next) => {
  sessionRepo.getById(
    req.params.id,
    (data) => {
      if (data) {
        const response = {
          status: 200,
          statusText: 'OK',
          message: 'Single session retrieved.',
          data,
        };
        res.status(200).json(response);
      } else {
        const response = {
          status: 404,
          statusText: 'Not Found',
          message: `The session '${req.params.id}' could not be found.`,
          error: {
            code: 'NOT_FOUND',
            message: `The session '${req.params.id}' could not be found.`,
          },
        };
        res.status(404).json(response);
      }
    },
    (err) => {
      next(err);
    },
  );
});

router.post('/', (req, res, next) => {
  sessionRepo.insert(
    req.body,
    (data) => {
      res.status(201).json({
        status: 201,
        statusText: 'Created',
        message: 'New session added.',
        data,
      });
    },
    (err) => {
      next(err);
    },
  );
});

router.put('/:id', (req, res, next) => {
  sessionRepo.getById(
    req.params.id,
    (dataForUpdate) => {
      if (dataForUpdate) {
        // attempt to update the data
        sessionRepo.update(req.body, req.params.id, (dataFromUpdate) => {
          res.status(200).json({
            status: 200,
            statusText: 'OK',
            message: 'Session updated.',
            data: dataFromUpdate,
          });
        });
      } else {
        const response = {
          status: 404,
          statusText: 'Not Found',
          message: `The session '${req.params.id}' could not be found.`,
          error: {
            code: 'NOT_FOUND',
            message: `The session '${req.params.id}' could not be found.`,
          },
        };
        res.status(404).json(response);
      }
    },
    (err) => {
      next(err);
    },
  );
});

router.delete('/:id', (req, res, next) => {
  sessionRepo.delete(
    req.params.id,
    (data) => {
      res.status(200).json({
        status: 200,
        statusText: 'OK',
        message: 'Session deleted.',
        data,
      });
    },
    (err) => {
      next(err);
    },
  );
});

module.exports = router;
