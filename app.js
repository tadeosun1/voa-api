const createError = require('http-errors');
const express = require('express');
const compression = require('compression');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const milSymbolsRouter = require('./routes/milSymbols/milSymbols');
const equipmentRouter = require('./routes/equipment');
const sessionsRouter = require('./routes/sessions');
const lessonsRouter = require('./routes/lessons');
const fileRouter = require('./routes/files');
const aarRouter = require('./routes/aar');
const unitsRouter = require('./routes/units');
const weaponsRouter = require('./routes/weapons');
const viewsRouter = require('./routes/views');
const pointRouter = require('./routes/point');
const scormRouter = require('./routes/scorm');
const maptileRouter = require('./routes/maptiles');
const planRouter = require('./routes/plans');

const app = express();

// gzip/deflate outgoing responses
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/v1/sessions', sessionsRouter);
app.use('/v1/lessons', lessonsRouter);
app.use('/v1/files', fileRouter);
app.use('/v1/aar', aarRouter);
app.use('/v1/mil-symbols', milSymbolsRouter);
app.use('/v1/equipment', equipmentRouter);
app.use('/v1/weapons', weaponsRouter);
app.use('/v1/units', unitsRouter);
app.use('/v1/views', viewsRouter);
app.use('/v1/points', pointRouter);
app.use('/v1/scorm', scormRouter);
app.use('/v1/maptiles', maptileRouter);
app.use('/v1/plans', planRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

const port = process.env.PORT || 8080;
app.listen(port, '127.0.0.1');
console.log(`VOA API server listening at http://127.0.0.1:${port}`);

// // ryan test
// const aarRepo = require('./repos/aarRepo');
// const res = aarRepo.getAARRange(
//   'aar',
//   'f2c74bdf-7275-42eb-8867-1036b3a87905',
//   1000,
//   2100,
//   (data) => {
//   if (data) {
//     const response = {
//       status: 200,
//       statusText: 'OK',
//       message: 'Range retrieved.',
//       data,
//     };
//   } else {
//     const response = {
//       status: 404,
//       statusText: 'Not Found',
//       message: `The file '${req.params.id}' could not be found.`,
//       error: {
//         code: 'NOT_FOUND',
//         message: `The file '${req.params.id}' could not be found.`,
//       },
//     };
//   }
// });
