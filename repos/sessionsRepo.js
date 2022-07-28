const fs = require('fs');

const FILE_NAME = './assets/sessions.json';
const RECYCLEBIN = './assets/recyclesessions.json';

const fileRepo = require('./fileRepo');

const sessionsRepo = {
  get(resolve, reject) {
    fs.readFile(FILE_NAME, 'utf8', (readErr, data) => {
      if (readErr) {
        reject(readErr);
      } else {
        const sessions = JSON.parse(data);
        resolve(sessions);
      }
    });
  },

  getById(id, resolve, reject) {
    fs.readFile(FILE_NAME, 'utf8', (readErr, data) => {
      if (readErr) {
        reject(readErr);
      } else {
        const session = JSON.parse(data).find((s) => s._F === id);
        resolve(session);
      }
    });
  },

  getPlansById(id, resolve, reject) {
    fs.readFile(FILE_NAME, 'utf8', (readErr, data) => {
      if (readErr) {
        reject(readErr);
      } else {
        const session = JSON.parse(data).find((s) => s._F === id);
        fileRepo.getById(
          session._F,
          (sessionData) => {
            const sessionGameObject = Object.values(sessionData)[0];
            const sessionGameObjectBehaviours = sessionGameObject.b;
            const sessionBehaviour = Object.values(sessionGameObjectBehaviours)[0];
            const plans = sessionBehaviour.e;
            const plansList = [];
            plans.forEach((plan) => {
              const planValues = plan.a;
              plansList.push({
                name: planValues.n,
                fileRef: planValues._F,
              });
            });
            resolve(plansList);
          },
          (sessionErr) => {
            reject(sessionErr);
          },
        );
      }
    });
  },

  insert(newData, resolve, reject) {
    fs.readFile(FILE_NAME, 'utf8', (readErr, data) => {
      if (readErr) {
        reject(readErr);
      } else {
        const sessions = JSON.parse(data);
        const session = sessions.find((s) => s._F === newData._F);
        if (session) {
          this.update(newData, newData._F, resolve, reject);
        } else {
          sessions.push(newData);
          fs.writeFile(FILE_NAME, JSON.stringify(sessions), (writeErr) => {
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

  update(newData, id, resolve, reject) {
    fs.readFile(FILE_NAME, 'utf8', (readErr, data) => {
      if (readErr) {
        reject(readErr);
      } else {
        const sessions = JSON.parse(data);
        const session = sessions.find((s) => s._F === id);
        if (session) {
          Object.assign(session, newData);
          fs.writeFile(FILE_NAME, JSON.stringify(sessions), (writeErr) => {
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

  delete(id, resolve, reject) {
    fs.readFile(FILE_NAME, 'utf8', (readErr, data) => {
      if (readErr) {
        reject(readErr);
      } else {
        const sessions = JSON.parse(data);
        const session = sessions.find((s) => s._F === id);
        if (session) {
          const index = sessions.indexOf(session);
          if (index > -1) {
            sessions.splice(index, 1);
          }
          console.log(`Sessions: ${JSON.stringify(sessions)}`);
          fs.readFile(RECYCLEBIN, 'utf8', (readErr, recycleData) => {
            console.log(`DATA: ${recycleData}`);
            if (typeof recycleData === 'undefined' || recycleData.length === 0) {
              recycleData = '[]';
            }
            const recycle = JSON.parse(recycleData);
            recycle.push(session);
            fs.writeFile(RECYCLEBIN, JSON.stringify(recycle), (writeErr) => {
              if (writeErr) {
                console.log(writeErr);
              }
            });
          });
          fs.writeFile(FILE_NAME, JSON.stringify(sessions), (writeErr) => {
            if (writeErr) {
              reject(writeErr);
            } else {
              resolve(session);
            }
          });
        }
      }
    });
  },
};

module.exports = sessionsRepo;
