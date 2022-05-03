const express = require( 'express')
const app = express();

const morgan = require( 'morgan');

// Bring in code from ROuter folder
const {getPosts} = require( "./routes/post.js")

// Middleware
app.use(morgan("dev"));

app.get("/", getPosts);

const port = 3000
app.listen(port, ()=>console.log(`API Listening on port-[${port}]` ));
