const express = require('express');
const fs = require('fs');
const path = require('path');
const jimp = require('jimp');

const router = express.Router();
// const mapTileRepo = require('../repos/mapTileRepo');

/* router.get('/', (req, res, next) => {
    mapTileRepo.get(
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
}); */

router.get('/tile/:folder/:id', (req, res) => {
  console.log(decodeURIComponent(req.params.viewRef));
  const filePath = path.join(
    __dirname,
    '../maptiles/',
    decodeURIComponent(req.params.folder),
    `${decodeURIComponent(req.params.id)}.png`,
  );

  const tilePath = path.join(
    __dirname,
    '../maptiles/',
    decodeURIComponent(req.params.folder),
    `${decodeURIComponent(req.params.id)}_tile.png`,
  );

  console.log(filePath);

  if (!fs.existsSync(tilePath)) {
    jimp.read(filePath, (err, orig) => {
      if (err) console.log(err.messages);
      orig.resize(75, 75).write(tilePath);
      fs.readFile(tilePath, (err, content) => {
        if (err) {
          res.writeHead(400, {
            'Content-type': 'text/html',
          });
          console.log(err);
          res.end('No such image');
        } else {
          // specify the content type in the response will be an image
          res.writeHead(200, {
            'Content-type': 'image/png',
          });
          res.end(content);
        }
      });
    });
  } else {
    fs.readFile(tilePath, (err, content) => {
      if (err) {
        res.writeHead(400, {
          'Content-type': 'text/html',
        });
        console.log(err);
        res.end('No such image');
      } else {
        // specify the content type in the response will be an image
        res.writeHead(200, {
          'Content-type': 'image/png',
        });
        res.end(content);
      }
    });
  }
});

router.get('/:folder/:id', (req, res) => {
  console.log(decodeURIComponent(req.params.viewRef));
  const filePath = path.join(
    __dirname,
    '../maptiles/',
    decodeURIComponent(req.params.folder),
    `${decodeURIComponent(req.params.id)}.png`,

  );

  console.log(filePath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(400, {
        'Content-type': 'text/html',
      });
      console.log(err);
      res.end('No such image');
    } else {
      // specify the content type in the response will be an image
      res.writeHead(200, {
        'Content-type': 'image/png',
      });
      res.end(content);
    }
  });
});

/* router.post('/', (req, res, next) => {
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

router.put('/:id', (req, res, next) => {
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
}); */

module.exports = router;
