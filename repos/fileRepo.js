const fs = require('fs');

const fileRepo = {
  getById(id, resolve, reject) {
    const filename = `./assets/_files/${id}.json`;
    fs.readFile(filename, 'utf8', (readErr, data) => {
      if (readErr) {
        reject(readErr);
      } else {
        const gameObject = JSON.parse(data);
        resolve(gameObject);
      }
    });
  },

  createIfNotExist(newData, id, resolve, reject) {
    const filename = `./assets/_files/${id}.json`;
    fs.readFile(filename, 'utf8', (readErr, data) => {
      if (readErr) {
        fs.writeFile(filename, JSON.stringify(newData), (writeErr) => {
          if (writeErr) {
            reject(writeErr);
          } else {
            resolve(newData);
          }
        });
      } else {
        resolve(newData);
      }
    });
  },

  update(newData, id, resolve, reject) {
    const filename = `./assets/_files/${id}.json`;
    fs.writeFile(filename, JSON.stringify(newData), (writeErr) => {
      if (writeErr) {
        reject(writeErr);
      } else {
        resolve(newData);
      }
    });
  },
};

module.exports = fileRepo;
