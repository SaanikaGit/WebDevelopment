
// Creating a regular server
// const http = require( 'http');

// const server = http.createServer( (req, res) => {
//     res.end("Hello from My Server.....");
// });

// server.listen(3000);

// Creating a server with Expreess
const express = require( 'express');

console.log("Starting Express......")
const app = express();

app.get('/', (req, res)=>{
    res.send("Response from Express - Udated")
});

app.listen(3000);