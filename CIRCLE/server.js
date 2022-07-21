const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Handle ALL unhandled ( SYNC code ) exceptions... Like MOngoose connectioon error
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION IN APPLICATION..');
    console.log(err.name, err.message);
    console.log('EXITING APPLICATION........');
    process.exit(1);
});

// Set environment variables...
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE;

console.log(`trying to connect to database [${DB}]`);
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndMOdify: false
    })
    .then((con) => {
        console.log('Connected to MongoDB');
        // console.log(con.connections);
    });

// Start Server...
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Listening on port ${port} `);
});

// Handle ALL unhandled ( ASYNC code ) promise rejections... Like MOngoose connectioon error
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION IN APPLICATION..');
    console.log(err.name, err.message);
    console.log('EXITING APPLICATION........');
    server.close(() => {
        process.exit(1);
    });
});
