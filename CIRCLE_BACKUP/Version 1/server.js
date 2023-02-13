const mongoose = require('mongoose');
const dotenv = require('dotenv');

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
app.listen(port, () => {
    console.log(`Listening on port ${port} `);
});
