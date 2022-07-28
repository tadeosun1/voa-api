const fs = require('fs');

const FILE_NAME = './assets/unitTemplates.json';

const unitRepo = {
  get(resolve, reject) {
    fs.readFile(FILE_NAME, 'utf8', (readErr, data) => {
      if (readErr) {
        reject(readErr);
      } else {
        const units = JSON.parse(data);
        resolve(units);
      }
    });
  },

  getById(id, resolve, reject) {
    fs.readFile(FILE_NAME, 'utf8', (readErr, data) => {
      if (readErr) {
        reject(readErr);
      } else {
        const unit = JSON.parse(data).find((u) => u.id === id);
        resolve(unit);
      }
    });
  },

  insert(newData, resolve, reject) {
    fs.readFile(FILE_NAME, 'utf8', (readErr, data) => {
      if (readErr) {
        reject(readErr);
      } else {
        const units = JSON.parse(data);
        units.push(newData);
        fs.writeFile(FILE_NAME, JSON.stringify(units), (writeErr) => {
          if (writeErr) {
            reject(writeErr);
          } else {
            resolve(newData);
          }
        });
      }
    });
  },

  update(newData, id, resolve, reject) {
    fs.readFile(FILE_NAME, 'utf8', (readErr, data) => {
      if (readErr) {
        reject(readErr);
      } else {
        const units = JSON.parse(data);
        const unit = units.find((u) => u.id === id);
        if (unit) {
          Object.assign(unit, newData);
          fs.writeFile(FILE_NAME, JSON.stringify(units), (writeErr) => {
            if (writeErr) {
              reject(writeErr);
            } else {
              resolve(newData);
            }
          });
        }
      }
    });
  },
};

module.exports = unitRepo;
