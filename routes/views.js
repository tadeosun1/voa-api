const express = require('express');

const router = express.Router();
const forms = require('formidable');
const fs = require('fs');
const path = require('path');
const jimp = require('jimp');
const AdmZip = require('adm-zip');

const fileRepo = require('../repos/fileRepo');

router.post('/uploadview', (req, res) => {
  const form = new forms.IncomingForm();
  form.parse(req, (formErr, fields, files) => {
    const oldpath = files.filetoupload.path;
    const newpath = `./viewsStore/${files.filetoupload.name}`;

    const thumbPath = `./viewsStore/${files.filetoupload.name.split('.')[0]}_thumb${path.extname(files.filetoupload.name)}`;

    fs.copyFile(oldpath, newpath, (err) => {
      if (err) console.log(err.message);
      const response = {
        status: 200,
        statusText: 'OK',
        message: 'View Image Uploaded',
      };
      res.status(200).json(response);
    });

    jimp.read(oldpath, (err, orig) => {
      if (err) console.log(err.messages);
      orig.resize(160, 90).write(thumbPath);
    });
  });
});

router.get('/view/:viewId', (req, res) => {
  console.log(decodeURIComponent(req.params.viewId));
  const filePath = path.join(
    __dirname,
    '../viewsStore',
    decodeURIComponent(req.params.viewId),
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
        'Content-type': 'image/jpeg',
      });
      res.end(content);
    }
  });
});

router.get('/view/delete/:viewId', (req, res) => {
  console.log(decodeURIComponent(req.params.viewId));
  const filePath = path.join(
    __dirname,
    '../viewsStore',
    decodeURIComponent(req.params.viewId),
  );
  const thumbPath = `${filePath.split('.')[0]}_thumb${path.extname(filePath)}`;
  console.log(filePath);
  fs.unlink(thumbPath, (err) => {
    if (err) {
      console.log(err);
    }
  });
  fs.unlink(filePath, (err) => {
    if (err) {
      res.writeHead(400, {
        'Content-type': 'text/html',
      });
      console.log(err);
      res.end('No such image');
    } else {
      // specify the content type in the response will be an image
      const response = {
        status: 200,
        statusText: 'OK',
        message: 'View Image Uploaded',
      };
      res.status(200).json(response);
    }
  });
});

router.get('/view/rename/:viewId/:newViewId', (req, res) => {
  console.log(decodeURIComponent(req.params.viewId));
  const filePath = path.join(
    __dirname,
    '../viewsStore',
    decodeURIComponent(req.params.viewId),
  );
  const newPath = path.join(
    __dirname,
    '../viewsStore',
    decodeURIComponent(req.params.newViewId),
  );

  const thumbPath = `${filePath.split('.')[0]}_thumb${path.extname(filePath)}`;
  const newthumbPath = `${newPath.split('.')[0]}_thumb${path.extname(newPath)}`;

  console.log(filePath);
  fs.rename(thumbPath, newthumbPath, (err) => {
    if (err) {
      console.log(err);
    }
  });
  fs.rename(filePath, newPath, (err) => {
    if (err) {
      res.writeHead(400, {
        'Content-type': 'text/html',
      });
      console.log(err);
      res.end('No such view');
    } else {
      // specify the content type in the response will be an image
      const response = {
        status: 200,
        statusText: 'OK',
        message: 'View Renamed',
      };
      res.status(200).json(response);
    }
  });
});

function zipFolderPath(sessionId) {
  return path.join(__dirname, '../viewsStore', 'zipArchives', `${sessionId}`);
}

function zipFilePath(sessionId, sessionName) {
  return path.join(zipFolderPath(sessionId), `${sessionName} Images.zip`);
}

function createZipForViewIds(cameraViewsInfo, sessionId, sessionName) {
  const zip = new AdmZip();

  const zipDestination = zipFolderPath(sessionId);
  fs.mkdirSync(zipDestination, { recursive: true });

  const zipSource = path.join(zipDestination, 'source');
  fs.mkdirSync(zipSource, { recursive: true });

  // check for image files for the viewIds, add any that exist to ZIP
  cameraViewsInfo.forEach((viewInfo) => {
    const imageSource = path.join(
      __dirname,
      '../viewsStore',
      `${viewInfo.id}.jpg`,
    );

    if (fs.existsSync(imageSource)) {
      const imageZipName = `${viewInfo.planName}_${viewInfo.displayName}.jpg`;
      const imageDestination = path.join(zipSource, imageZipName);
      fs.copyFileSync(imageSource, imageDestination);
      zip.addLocalFile(imageDestination);
    }
  });

  console.log('Creating ZIP for images:');
  console.log(cameraViewsInfo);
  const zipFile = zipFilePath(sessionId, sessionName);

  // if a previous (old, outdated) download exists for this session, delete it
  if (fs.existsSync(zipFile)) {
    fs.unlinkSync(zipFile);
  }

  zip.writeZip(zipFile, (zipError) => {
    if (zipError) {
      console.log(zipError);
    } else if (fs.existsSync(zipSource)) {
      // cleanup copied and renamed image files, originals remain in viewsStore
      fs.rm(zipSource, { recursive: true }, (rmError) => {
        if (rmError) {
          console.log(rmError);
        }
      });
    }
  });
}

// create a zip file of all images in the session with the provided id
router.post('/view/', (req, res) => {
  const requestBody = req.body;
  const { sessionId, sessionName } = requestBody;

  // get file for requested session
  fileRepo.getById(
    sessionId,
    (sessionFile) => {
      // get children of the session
      const sessionData = sessionFile[sessionName];
      const sessionBehaviours = sessionData.b;
      if (sessionBehaviours === null) {
        return;
      }

      const cameraViewsInfo = [];

      for (let sessionIndex = 0; sessionIndex < sessionBehaviours.length; sessionIndex++) {
        // PlanContainers are serialized as 'e'
        const planContainers = sessionBehaviours[sessionIndex].e;
        if (planContainers === null) {
          return;
        }

        for (let planIndex = 0; planIndex < planContainers.length; planIndex++) {
          const planContainer = planContainers[planIndex];

          // CameraViews are serialized as 'b'
          const cameraViews = planContainer.b;
          if (cameraViews === null) {
            return;
          }

          for (let camViewIndex = 0; camViewIndex < cameraViews.length; camViewIndex++) {
            const cameraView = cameraViews[camViewIndex];

            // Ref is serialized as 'a', __name is serialized as 'n'
            const planName = planContainer.a.n;

            cameraViewsInfo.push({
              id: cameraView.Id,
              planName,
              displayName: cameraView.DisplayName,
            });
          }
        }
      }

      createZipForViewIds(cameraViewsInfo, sessionId, sessionName);

      // respond with successful creation code
      const createResponse = {
        status: 201,
        statusText: 'OK',
        message: 'View images ZIP created',
      };

      res.status(201).json(createResponse);
    },
    () => {
      const errorResponse = {
        status: 500,
        statusText: 'ERROR',
        message: 'Could not create images ZIP for requested session.',
      };

      res.status(500).json(errorResponse);
    },
  );
});

// route for downloading ZIP file after creation via POST
router.get('/view/:sessionId/:sessionName', (req, res) => {
  const zipFile = zipFilePath(req.params.sessionId, req.params.sessionName);
  fs.readFile(zipFile, 'utf8', (readErr) => {
    if (readErr) {
      const response = {
        status: 500,
        statusText: 'File not found',
        message: 'Could not download the file.',
      };
      res.status(500).json(response);
    } else {
      res.download(zipFile);
    }
  });
});

module.exports = router;
