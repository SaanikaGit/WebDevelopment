//Morgan is logger middlware used by Express...
const express = require('express');
const morgan = require('morgan');

const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Middlwware....
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());

//serving static files on our filesystem
app.use(express.static(`${__dirname}/public`));

// define our  own middleware...
app.use((req, res, next) => {
    console.log('Hello from middleware...');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// Mount Routes...
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
