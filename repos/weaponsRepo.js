const fs = require('fs');

const FILE_NAME = './assets/weaponTemplates.json';

const weaponsRepo = {
  get(resolve, reject) {
    fs.readFile(FILE_NAME, 'utf8', (readErr, data) => {
      if (readErr) {
        reject(readErr);
      } else {
        const weapons = JSON.parse(data);
        resolve(weapons);
      }
    });
  },

  getById(id, resolve, reject) {
    fs.readFile(FILE_NAME, 'utf8', (readErr, data) => {
      if (readErr) {
        reject(readErr);
      } else {
        const weapon = JSON.parse(data).find((w) => w.nameId === id);
        resolve(weapon);
      }
    });
  },
};

module.exports = weaponsRepo;
