const express = require('express');

const router = express.Router();
const unitsRepo = require('../repos/unitsRepo');

router.get('/', (req, res, next) => {
  unitsRepo.get(
    (data) => {
      const response = {
        status: 200,
        statusText: 'OK',
        message: 'All units retrieved.',
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
  unitsRepo.getById(
    req.params.id,
    (data) => {
      if (data) {
        const response = {
          status: 200,
          statusText: 'OK',
          message: 'Single unit retrieved.',
          data,
        };
        res.status(200).json(response);
      } else {
        const response = {
          status: 404,
          statusText: 'Not Found',
          message: `The unit '${req.params.id}' could not be found.`,
          error: {
            code: 'NOT_FOUND',
            message: `The unit '${req.params.id}' could not be found.`,
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
  unitsRepo.insert(
    req.body,
    (data) => {
      res.status(201).json({
        status: 201,
        statusText: 'Created',
        message: 'New unit added.',
        data,
      });
    },
    (err) => {
      next(err);
    },
  );
});

router.put('/:id', (req, res, next) => {
  unitsRepo.getById(
    req.params.id,
    (sourceData) => {
      if (sourceData) {
        // attempt to update the data
        unitsRepo.update(req.body, req.params.id, (updatedData) => {
          res.status(200).json({
            status: 200,
            statusText: 'OK',
            message: `Unit '${req.params.id}' updated.`,
            data: updatedData,
          });
        });
      } else {
        res.status(404).json({
          status: 404,
          statusText: 'Not Found',
          message: `The unit '${req.params.id}' could not be found.`,
          error: {
            code: 'NOT_FOUND',
            message: `The unit '${req.params.id}' could not be found.`,
          },
        });
      }
    },
    (err) => {
      next(err);
    },
  );
});

module.exports = router;
