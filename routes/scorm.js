const express = require('express');

const router = express.Router();
const scormRepo = require('../repos/scormRepo');

router.post('/', (req, res, next) => {
  scormRepo.insert(
    req.body,
    (data) => {
      const response = {
        status: 201,
        statusText: 'Created',
        message: 'Lesson Created',
        data,
      };
      res.status(201).json(response);
    },
    (err) => {
      next(err);
    },
  );
});

router.get('/:sessionId/:lessonId/:lessonName', (req, res) => {
  scormRepo.getById(
    req.params.sessionId,
    req.params.lessonId,
    req.params.lessonName,
    (filepath) => {
      if (filepath) res.download(filepath);
      else {
        const response = {
          status: 500,
          statusText: 'File not found',
          message: 'Could not download the file.',
        };
        res.status(500).json(response);
      }
    },
  );
});

module.exports = router;
