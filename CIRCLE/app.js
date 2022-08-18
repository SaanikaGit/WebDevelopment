//Morgan is logger middlware used by Express...
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Set PUG as the VIEW template engine...
app.set('view engine', 'pug');
// Set template VIEWS directory...
app.set('views', path.join(__dirname, 'views'));

// GLOBAL Middlwware....
// Set HTTP Headers
// Serve Static files..
//serving static files on our filesystem
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());

// LOgging for development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit requests from particular IP in a time period. Solves demial-of-servie-attack and also brite force password tries
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try after some time',
});

app.use('/api', limiter);

// parses incoming requests with JSON data and attaced them to req.body
// Limit size of req.body, so malicious code cannot be sent...
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NOSQL query injection
// Code like {"$gt":""} - whch is always true and can return all DB values.
// removes $ signs and other query injection methods in body...
app.use(mongoSanitize());

// Data sanitization against XSS
// prevent user from injecting HTML/javascript via parameters and mess up the base HTML/Javascript...
// Code like {"value": <div id='navBar'>NAV</div>}] - whch is always true and can return all DB values.
app.use(xss());

// Prevent HTTP parameter pollution...
// Multiple search/sort parameters added to URL like "?sort=name&sort=subject" are taken care of. Only 1 parameter is allowed( last one)..
// if we want to let multiple parameters, we can pass a WHITELIST parameter in hpp.2
app.use(hpp());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// Mount Routes...

app.get('/', (req, res) => {
    res.status(400).render('base', {
        product: 'Book',
        vendor: 'Saanika',
    });
});

app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);

// Default Router ( ALL => all operations GET/POST/PATCH etc ) - for routes not defined as yet...
// If we hit this point - we know that none of the handlers defined above were caught by middleare pipeline...
app.all('*', (req, res, next) => {
    next(
        new AppError(
            `Unable to find [${req.method}]:[${req.originalUrl}] on this server...`,
            404
        )
    );
});

// GLobal Error handler...
app.use(globalErrorHandler);

module.exports = app;
