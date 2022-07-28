const fs = require('fs');
const fsextra = require('fs-extra');
const path = require('path');
const xml2js = require('xml2js');

const MANIFEST_FILENAME = 'imsmanifest.xml';
const SCORM_PACKAGE_DIRECTORY = './assets/scormpackage';
const SCORM_BUILD_DIRECTORY = './assets/scormBuilds';

const AdmZip = require('adm-zip');
const { parseString } = require('xml2js');
const sessionRepo = require('./sessionsRepo');

function lessonPublishPath(sessionId, lessonId) {
  return path.join(SCORM_BUILD_DIRECTORY, sessionId, lessonId, 'publish');
}

function lessonPublishFile(sessionId, lessonId, lessonTitle) {
  return path.join(lessonPublishPath(sessionId, lessonId), `${lessonTitle}.zip`);
}

const scormRepo = {
  insert(requestData, resolve, reject) {
    const { sessionId, lessonId, lessonTitle } = requestData;

    function createZipFile(lessonBuildSource) {
      console.log(`zipping directory:\t${lessonBuildSource}`);

      const zipPath = lessonPublishPath(sessionId, lessonId);
      fs.mkdirSync(zipPath, { recursive: true }, (zipDirErr) => {
        if (zipDirErr) {
          reject(zipDirErr);
        }
      });

      const zipFile = lessonPublishFile(sessionId, lessonId, lessonTitle);

      if (fs.existsSync(zipFile)) {
        fs.unlinkSync(zipFile);
      }

      const zip = new AdmZip();
      zip.addLocalFolder(lessonBuildSource);
      zip.writeZip(zipFile);
      resolve();
    }

    function createStreamingLessonFile(streamingAssetsDir, lessonBuildSource) {
      const lessonJsonPath = path.join(streamingAssetsDir, 'lessonRequest.json');
      console.log(`writing lesson request file:\t${lessonJsonPath}`);
      fs.writeFile(lessonJsonPath, JSON.stringify(requestData), (writeLessonErr) => {
        if (writeLessonErr) {
          reject(writeLessonErr);
        } else {
          createZipFile(lessonBuildSource);
        }
      });
    }

    function createStreamingDirectory(lessonBuildSource) {
      const streamingDir = path.join(lessonBuildSource, 'StreamingAssets');
      console.log(`creating directory:\t${streamingDir}`);

      fs.mkdirSync(streamingDir, { recursive: true }, (streamingDirErr) => {
        if (streamingDirErr) {
          reject(streamingDirErr);
        }
      });

      createStreamingLessonFile(streamingDir, lessonBuildSource);
    }

    function updateScormManifest(manifestJson, lessonBuildDir) {
      console.log(`setting manifest title:\t${lessonTitle}`);
      const organization = manifestJson.manifest.organizations[0].organization[0];
      organization.title = lessonTitle;

      const builder = new xml2js.Builder();
      const manifestXml = builder.buildObject(manifestJson);

      console.log('saving imsmanifest.xml for lesson');
      const manifestPath = path.join(lessonBuildDir, MANIFEST_FILENAME);
      fs.writeFile(manifestPath, manifestXml, (lessonXmlWriteErr) => {
        if (lessonXmlWriteErr) {
          reject(lessonXmlWriteErr);
        } else {
          createStreamingDirectory(lessonBuildDir);
        }
      });
    }

    function openScormManifest(lessonBuildSource) {
      console.log('updating imsmanifest.xml for scorm wrapper');
      fs.readFile(
        path.join(lessonBuildSource, MANIFEST_FILENAME),
        'utf8',
        (readErr, xmlData) => {
          if (readErr) {
            reject(readErr);
          } else {
            parseString(xmlData, (parseErr, manifestJson) => {
              if (parseErr) {
                reject(parseErr);
              } else {
                updateScormManifest(manifestJson, lessonBuildSource);
              }
            });
          }
        },
      );
    }

    function copyScormPackage(lessonBuildSource) {
      console.log(`copying scormpackage template files\n\tfrom:\t${SCORM_PACKAGE_DIRECTORY}\n\tto:\t${lessonBuildSource}`);
      fsextra.copy(SCORM_PACKAGE_DIRECTORY, lessonBuildSource, (copyErr) => {
        if (copyErr) {
          reject(copyErr);
        } else {
          openScormManifest(lessonBuildSource);
        }
      });
    }

    // INSERT -------------------------------------------------------------------------------------
    sessionRepo.getById(sessionId, () => {
      const lessonBuildSource = path.join(SCORM_BUILD_DIRECTORY, sessionId, lessonId, 'source');

      console.log(`creating directory:\t${lessonBuildSource}`);
      fs.mkdirSync(lessonBuildSource, { recursive: true }, (lessonBuildDirErr) => {
        if (lessonBuildDirErr) {
          reject(lessonBuildDirErr);
        }
      });

      copyScormPackage(lessonBuildSource);
    });
  },

  getById(sessionId, lessonId, lessonTitle, resolve, reject) {
    const filename = lessonPublishFile(sessionId, lessonId, lessonTitle);
    fs.readFile(filename, 'utf8', (readErr) => {
      if (readErr) {
        reject(readErr);
      } else {
        resolve(filename);
      }
    });
  },
};

module.exports = scormRepo;
