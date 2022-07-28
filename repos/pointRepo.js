const fs = require('fs');

const FILE_NAME = './assets/pointTemplates.json';

const pointRepo = {
  get(resolve, reject) {
    fs.readFile(FILE_NAME, 'utf8', (readErr, data) => {
      if (readErr) {
        reject(readErr);
      } else {
        const points = JSON.parse(data);
        resolve(points);
      }
    });
  },

  getById(id, resolve, reject) {
    fs.readFile(FILE_NAME, 'utf8', (readErr, data) => {
      if (readErr) {
        reject(readErr);
      } else {
        const point = JSON.parse(data).find((e) => e.nameId === id);
        resolve(point);
      }
    });
  },
};

module.exports = pointRepo;
