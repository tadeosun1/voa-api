const express = require('express');

const router = express.Router();
const weaponsRepo = require('../repos/weaponsRepo');

router.get('/', (req, res, next) => {
  weaponsRepo.get(
    (data) => {
      const response = {
        status: 200,
        statusText: 'OK',
        message: 'All weapons retrieved.',
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
  weaponsRepo.getById(
    req.params.id,
    (data) => {
      if (data) {
        const response = {
          status: 200,
          statusText: 'OK',
          message: 'Single weapon retrieved.',
          data,
        };
        res.status(200).json(response);
      } else {
        const response = {
          status: 404,
          statusText: 'Not Found',
          message: `The weapon "${req.params.id}" could not be found.`,
          error: {
            code: 'NOT_FOUND',
            message: `The weapon "${req.params.id}" could not be found.`,
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
