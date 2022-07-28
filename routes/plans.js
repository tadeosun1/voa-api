const express = require('express');

const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fileRepo = require('../repos/fileRepo');

async function ReplaceSerializableGameObjectRefs(planObject, oldRef, newRef) {
  for (const behaviourObj in planObject.b) {
    for (const behaviourProp in planObject.b[behaviourObj]) {
      // console.log("Checking " + behaviourProp);
      if (Array.isArray(planObject.b[behaviourObj][behaviourProp])) {
        // console.log("Checking " + behaviourProp);
        // console.log("Found Array " + behaviourProp)
        for (const index in planObject.b[behaviourObj][behaviourProp]) {
          if (planObject.b[behaviourObj][behaviourProp][index] === oldRef) {
            planObject.b[behaviourObj][behaviourProp][index] = newRef;
          }
        }
      } else if (planObject.b[behaviourObj][behaviourProp] === oldRef) {
        planObject.b[behaviourObj][behaviourProp] = newRef;
      }
    }
  }

  // console.log("Processing Children, " + planObject["c"]);

  for (const childObj in planObject.c) {
    // console.log("Processing Children, " + planObject["c"][childObj]);
    for (const childKey in planObject.c[childObj]) await ReplaceSerializableGameObjectRefs(planObject.c[childObj][childKey], oldRef, newRef);
  }
}

async function CreateNewIds(gameObject, callback) {
  await GenerateNewIDs(gameObject, null);

  callback(gameObject);
}

async function GenerateNewIDs(gameObject, rootObj) {
  for (const planObjectName in gameObject) {
    // console.log("Key name: " + planObjectName);

    const planObject = gameObject[planObjectName];
    if (rootObj == null) {
      rootObj = planObject;
      planObject.a = 'true'; // __serializeToFile
      // console.log("Setting planobject as root object");
    }
    // console.log("PO: " + JSON.stringify(planObject));
    let oldSerializableGameObjectID = planObject.z;
    let newSerializableGameObjectID = uuidv4();

    await ReplaceSerializableGameObjectRefs(rootObj, oldSerializableGameObjectID, newSerializableGameObjectID);
    planObject.z = newSerializableGameObjectID;

    // console.log("REPLACING SERIALIZABLEIDs");
    for (const behaviorKey in planObject.b) {
      // Replace SerializableID
      oldSerializableGameObjectID = planObject.b[behaviorKey].y;
      newSerializableGameObjectID = uuidv4();
      if (oldSerializableGameObjectID !== '11111111-1111-1111-1111-111111111111' && oldSerializableGameObjectID !== '22222222-2222-2222-2222-222222222222') {
        await ReplaceSerializableGameObjectRefs(rootObj, oldSerializableGameObjectID, newSerializableGameObjectID);
        planObject.b[behaviorKey].y = newSerializableGameObjectID;
      }

      /// /Replace SerializableGameObjectID
      // oldSerializableGameObjectID = planObject["b"][behaviorKey]["z"];
      // newSerializableGameObjectID = uuidv4();
      // await ReplaceSerializableGameObjectRefs(rootObj, oldSerializableGameObjectID, newSerializableGameObjectID);
      // planObject["b"][behaviorKey]["z"] = newSerializableGameObjectID;
    }

    // console.log("Processing Children, " + planObject["c"]);
    for (const childObj in planObject.c) {
      await GenerateNewIDs(planObject.c[childObj], rootObj);
    }
  }
}

router.get('/clone/:oldId', (req, res, next) => {
  fileRepo.getById(
    req.params.oldId,
    (gameObject) => {
      // console.log("GO: " + JSON.stringify(gameObject));
      if (gameObject) {
        CreateNewIds(gameObject, (cloneobj) => {
          const root = {};
          const clone = {};
          clone.n = 'New Clone';
          clone._F = uuidv4();

          root['New Clone'] = clone;

          fileRepo.update(
            cloneobj,
            clone._F,
            (newData) => {
              console.log(`Wrote ${clone._F}`);
              res.status(200).json({
                status: 200,
                statusText: 'OK',
                message: 'Plan Cloned',
                data: root,
              });
            },
            (err) => {
              next(err);
            },
          );

          console.log(JSON.stringify(root));
        });
      }
    },
    (err) => {
      next(err);
    },
  );
});

// router.post('/', (req, res, next) => {
//  const response = {
//    status: 404,
//    statusText: 'Invalid Operation',
//    message: 'POST not supported for files, use PUT',
//    error: {
//      code: 'NOT_FOUND',
//      message: 'The file could not be found.',
//    },
//  };
//  res.status(404).json(response);
//  (err) => {
//    next(err);
//  };
// });

// router.put('/:id', (req, res, next) => {
//  // attempt to update the data
//  fileRepo.update(req.body, req.params.id, (dataFromUpdate) => {
//    res.status(200).json({
//      status: 200,
//      statusText: 'OK',
//      message: 'File updated.',
//      data: dataFromUpdate,
//    });
//  });
//  (err) => {
//    next(err);
//  };
// });

module.exports = router;
