const fs = require('fs');
const util = require('util');

const aarRepo = {
  getAARRange(id, behaviourid, start, end, resolve, reject) {
    const filename = `./assets/_files/${id}.json`;
    fs.readFile(filename, 'utf8', (readErr, data) => {
      if (readErr) {
        const recorderRefs = [];
        resolve(recorderRefs);
      } else {
        const aarStream = JSON.parse(data);
        const behaviours = aarStream.AARStream.b;
        const behaviour = behaviours.find((b) => b.y === behaviourid);
        let recorderRefs = behaviour.RecorderRefs;
        if (typeof recorderRefs === 'undefined') {
          // otherwise recorderRefs can be undefined at the for loop,
          // and accessing .length crashes the server
          recorderRefs = [];
        }
        for (let i = 0; i < recorderRefs.length; i++) {
          const recorderRef = recorderRefs[i];
          if (recorderRef.Recorder != null) {
            const rebindEntries = recorderRef.Recorder.DeserializationRebindEntries;
            for (let d = 0; d < rebindEntries.length; d++) {
              const propCurves = rebindEntries[d].PropertyCurves;
              for (let j = 0; j < propCurves.length; j++) {
                const keyframes = propCurves[j].Keyframes;
                const prunedKeyframes = [];
                for (let k = 0; k < keyframes.length; k++) {
                  const keyframe = keyframes[k];
                  if (keyframe.T >= start && keyframe.T < end) {
                    prunedKeyframes.push(keyframe);
                  }
                }
              }
            }
          }
        }

        // console.log(util.inspect(prunedKeyframes, {showHidden: false, depth: null, colors: true}));
        resolve(recorderRefs);
      }
    });
  },

  update(newData, id, behaviourid, resolve, reject) {
    const filename = `./assets/_files/${id}.json`;
    console.log(`AAR Updating ${filename}`);
    fs.readFile(filename, 'utf8', (readErr, data) => {
      if (readErr) {
        reject(readErr);
      } else {
        const aarStream = JSON.parse(data);
        const behaviours = aarStream.AARStream.b;
        const behaviour = behaviours.find((b) => b.y === behaviourid);
        const recorderRefs = behaviour.RecorderRefs;
        if (behaviour.RecorderRefs == null) {
          behaviour.RecorderRefs = newData;
        }
        else if (newData != null) {
          behaviour.RecorderRefs = recorderRefs.concat(newData);
        }

        //console.log('RANGE DATA:', util.inspect(aarStream, {showHidden: false, depth: null, colors: true}));

        fs.writeFile(filename, JSON.stringify(aarStream), (writeErr) => {
          if (writeErr) {
            reject(writeErr);
          } else {
            resolve(aarStream);
          }
        });
      }
    });
  },

  deleteall(id, behaviourid, resolve, reject) {
    const filename = `./assets/_files/${id}.json`;
    console.log(`Deleting AAR data from ${filename}...`);
    fs.readFile(filename, 'utf8', (readErr, data) => {
      if (readErr) {
        console.log(`${filename} not found, skipping`);
      } else {
        console.log(`${filename} found, deleting AAR data`);
        const aarStream = JSON.parse(data);
        const behaviours = aarStream.AARStream.b;
        const behaviour = behaviours.find((b) => b.y === behaviourid);
        const recorderRefs = behaviour.RecorderRefs;
        behaviour.RecorderRefs = [];
        fs.writeFile(filename, JSON.stringify(aarStream), (writeErr) => {
          if (writeErr) {
            reject(writeErr);
          } else {
            resolve(aarStream);
          }
        });
      }
    });
  },
};

module.exports = aarRepo;
