const express = require('express');

const router = express.Router();
const aarRepo = require('../repos/aarRepo');

router.get('/:id/:behaviourid/:start/:end', (req, res, next) => {
  aarRepo.getAARRange(
    req.params.id,
    req.params.behaviourid,
    req.params.start,
    req.params.end,
    (data) => {
      if (data) {
        const response = {
          status: 200,
          statusText: 'OK',
          message: 'Range retrieved.',
          data,
        };
        res.status(200).json(response);
      } else {
        const response = {
          status: 404,
          statusText: 'Not Found',
          message: `The file '${req.params.id}' could not be found.`,
          error: {
            code: 'NOT_FOUND',
            message: `The file '${req.params.id}' could not be found.`,
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
  const response = {
    status: 404,
    statusText: 'Invalid Operation',
    message: 'POST not supported for files, use PUT',
    error: {
      code: 'NOT_FOUND',
      message: 'The file could not be found.',
    },
  };
  res.status(404).json(response);
  (err) => {
    next(err);
  };
});

router.put('/:id/:behaviourid/:delete', (req, res, next) => {
  if (req.params.delete == 'true') {
    aarRepo.deleteall(req.params.id, req.params.behaviourid, (dataFromUpdate) => {
      res.status(200).json({
        status: 200,
        statusText: 'OK',
        message: 'File updated.',
        data: dataFromUpdate,
      });
    });
    (err) => {
      next(err);
    };
  } else {
    // attempt to update the data
    aarRepo.update(req.body, req.params.id, req.params.behaviourid, (dataFromUpdate) => {
      res.status(200).json({
        status: 200,
        statusText: 'OK',
        message: 'File updated.',
        data: dataFromUpdate,
      });
    });
    (err) => {
      next(err);
    };
  }
});

module.exports = router;
