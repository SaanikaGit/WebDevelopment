const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Set environment variables...
dotenv.config({ path: './config.env' });

const Tour = require('./../../models/tourModel');

const DB = process.env.DATABASE;

console.log(`trying to connectc to database [${DB}]`);
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

// Read data file - JSON
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// IMport data in DB.

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Tour Data loaded');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// Delete current data
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('ALL Tour Data deleted');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if( process.argv[2] === '--import') {
    importData();

}

if( process.argv[2] === '--delete') {
    deleteData();
}

