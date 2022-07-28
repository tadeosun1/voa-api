const express = require('express');

const router = express.Router();
const equipmentRepo = require('../repos/equipmentRepo');

router.get('/', (req, res, next) => {
  equipmentRepo.get(
    (data) => {
      const response = {
        status: 200,
        statusText: 'OK',
        message: 'All equipment retrieved.',
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
  equipmentRepo.getById(
    req.params.id,
    (data) => {
      if (data) {
        const response = {
          status: 200,
          statusText: 'OK',
          message: 'Single equipment retrieved.',
          data,
        };
        res.status(200).json(response);
      } else {
        const response = {
          status: 404,
          statusText: 'Not Found',
          message: `The equipment '${req.params.id}' could not be found.`,
          error: {
            code: 'NOT_FOUND',
            message: `The equipment '${req.params.id}' could not be found.`,
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
