const fs = require('fs');

const mapTileRepo = {
  getById(folder, id, resolve, reject) {
    const filename = `./maptiles/${folder}/${id}.png`;
    fs.readFile(filename, (readErr, data) => {
      if (readErr) {
        reject(readErr);
      } else {
        resolve.writeHead(200, {
          'Content-type': 'image/png',
        });
        res.end(content);
      }
    });
  },

  // update(newData, id, resolve, reject) {
  //  const filename = `./assets/${id}.json`;
  //  fs.writeFile(filename, JSON.stringify(newData), (writeErr) => {
  //    if (writeErr) {
  //      reject(writeErr);
  //    } else {
  //      resolve(newData);
  //    }
  //  });
  // },
};

module.exports = mapTileRepo;
