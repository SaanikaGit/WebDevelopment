var mongoose = require( 'mongoose')

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/sansDance";

var myDatabase = 'sansDance';
var myCollection = 'allBooks';

// Create and connect to DB
MongoClient.connect(url, function(err, db) {
    console.log(err);
    if (err) throw err;
    console.log("Database created!");
    
    // Create collection  - if it does not exist
    
    var dbo = db.db(myDatabase);
    dbo.createCollection(myCollection, function(err, res) {
        console.log(err);

        if (err) throw err;
        console.log("Collection created!");
     });
    });