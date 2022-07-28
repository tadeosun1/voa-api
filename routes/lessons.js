const express = require('express');

const router = express.Router();

const fileRepo = require('../repos/fileRepo');

router.get('/:sessionId/:lessonId', (req, res, next) => {
  const { sessionId } = req.params;
  const { lessonId } = req.params;

  fileRepo.getById(
    sessionId,
    (sessionFile) => {
      // get children of the session
      const sessionData = Object.values(sessionFile)[0]; // ignore session name/key
      const plansAndLessons = sessionData.c;

      let targetLesson = {};

      // filter for plans, store the view ids recorded in those plans
      for (let i = 0; i < plansAndLessons.length; i++) {
        // ignore plan name/key
        const planOrLessonValues = Object.values(plansAndLessons[i])[0];
        if ('t' in planOrLessonValues && planOrLessonValues.t === 'Voa.Plan') {
          // is a plan file reference, keep looking for lesson data
          continue;
        } else {
          const sourceBehaviour = planOrLessonValues.b[0];
          if ('t' in sourceBehaviour && sourceBehaviour.t === 'Voa.Lesson') {
            if (planOrLessonValues.ID === lessonId) {
              targetLesson = plansAndLessons[i];
              break;
            }
          }
        }
      }

      if (Object.keys(targetLesson).length === 0) { // null check...
        const response = {
          status: 404,
          statusText: 'Not Found',
          message: `The lesson '${lessonId}' could not be found.`,
          error: {
            code: 'NOT_FOUND',
            message: `The lesson '${lessonId}' could not be found.`,
          },
        };
        res.status(404).json(response);
      } else {
        // respond with successful creation code
        const successResponse = {
          status: 200,
          statusText: 'OK',
          message: 'Single lesson retrieved.',
          data: targetLesson,
        };

        res.status(200).json(successResponse);
      }
    },
    () => {
      const response = {
        status: 404,
        statusText: 'Not Found',
        message: `The session '${sessionId}' could not be found.`,
        error: {
          code: 'NOT_FOUND',
          message: `The session '${sessionId}' could not be found.`,
        },
      };
      res.status(404).json(response);
    },
    (err) => {
      next(err);
    },
  );
});

module.exports = router;
