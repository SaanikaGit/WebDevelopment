const { Console } = require("console");
const fs = require( "fs");

let err, text = fs.readFileSync( "./TMP/input.txt", "utf-8");
console.log( err);

text = text.replace( "Niraj", "Niraj Gupta");

fs.writeFileSync( "./TMP/out1.txt", text);