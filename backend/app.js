var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const debug = require('debug');

const cors = require('cors');
const { isProduction } = require('./config/keys');
const csurf = require('csurf');

require('./models/User');
require('./models/Itinerary');
require('./config/passport');
const passport = require('passport');
const usersRouter = require('./routes/api/users');
const csrfRouter = require('./routes/api/csrf');
const itinerariesRouter = require('./routes/api/itineraries')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

if (!isProduction) {
    app.use(cors());
} else {
    const path = require('path');
    // Serve the frontend's index.html file at the root route
    app.get('/', (req, res) => {
      res.cookie('CSRF-TOKEN', req.csrfToken());
      res.sendFile(
        path.resolve(__dirname, '../frontend', 'build', 'index.html')
      );
    });

    // Serve the static assets in the frontend's build folder
    app.use(express.static(path.resolve("../frontend/build")));

    // Serve the frontend's index.html file at all other routes NOT starting with /api
    app.get(/^(?!\/?api).*/, (req, res) => {
      res.cookie('CSRF-TOKEN', req.csrfToken());
      res.sendFile(
        path.resolve(__dirname, '../frontend', 'build', 'index.html')
      );
    });
}

app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
);

app.use('/api/users', usersRouter);
app.use('/api/csrf', csrfRouter);
app.use('/api/itineraries', itinerariesRouter);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.statusCode = 404;
    next(err);
});

const serverErrorLogger = debug('backend:error');

app.use((err, req, res, next) => {
    serverErrorLogger(err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        statusCode,
        errors: err.errors
    })
});

module.exports = app;
