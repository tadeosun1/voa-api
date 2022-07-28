const express = require('express');

const router = express.Router();
const fileRepo = require('../repos/fileRepo');

router.get('/', (req, res, next) => {
  fileRepo.getById(
    '00000000-0000-0000-0000-000000000000',
    (data) => {
      const response = {
        status: 200,
        statusText: 'OK',
        message: 'All files retrieved.',
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
  fileRepo.getById(
    req.params.id,
    (data) => {
      if (data) {
        const response = {
          status: 200,
          statusText: 'OK',
          message: 'Single file retrieved.',
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

router.put('/:id/:createIfNotExist', (req, res, next) => {
  if (req.params.createIfNotExist == 'true') {
    fileRepo.createIfNotExist(req.body, req.params.id, (dataFromUpdate) => {
      res.status(200).json({
        status: 200,
        statusText: 'OK',
        message: 'File updated.',
        data: dataFromUpdate,
      });
    });
  } else {
    // attempt to update the data
    fileRepo.update(req.body, req.params.id, (dataFromUpdate) => {
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
