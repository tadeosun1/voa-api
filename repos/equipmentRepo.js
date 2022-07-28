const fs = require('fs');

const FILE_NAME = './assets/equipmentTemplates.json';

const equipmentRepo = {
  get(resolve, reject) {
    fs.readFile(FILE_NAME, 'utf8', (readErr, data) => {
      if (readErr) {
        reject(readErr);
      } else {
        const equipment = JSON.parse(data);
        resolve(equipment);
      }
    });
  },

  getById(id, resolve, reject) {
    fs.readFile(FILE_NAME, 'utf8', (readErr, data) => {
      if (readErr) {
        reject(readErr);
      } else {
        const equip = JSON.parse(data).find((e) => e.nameId === id);
        resolve(equip);
      }
    });
  },
};

module.exports = equipmentRepo;
