//Morgan is logger middlware used by Express...
const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Middlwware....
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// parses incoming requests with JSON data and attaced them to req.body
app.use(express.json());

//serving static files on our filesystem
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// Mount Routes...
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
