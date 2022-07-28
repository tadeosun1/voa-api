const express = require('express');

const router = express.Router();
const pointRepo = require('../repos/pointRepo');

router.get('/', (req, res, next) => {
  pointRepo.get(
    (data) => {
      const response = {
        status: 200,
        statusText: 'OK',
        message: 'All points retrieved.',
        data,
      };
      res.status(200).json(response);
    },
    (err) => {
      next(err);
    },
  );
});

router.get('/:id', (req, res, next) => {
  pointRepo.getById(
    req.params.id,
    (data) => {
      if (data) {
        const response = {
          status: 200,
          statusText: 'OK',
          message: 'Single point retrieved.',
          data,
        };
        res.status(200).json(response);
      } else {
        const response = {
          status: 404,
          statusText: 'Not Found',
          message: `The point '${req.params.id}' could not be found.`,
          error: {
            code: 'NOT_FOUND',
            message: `The point '${req.params.id}' could not be found.`,
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

module.exports = router;
