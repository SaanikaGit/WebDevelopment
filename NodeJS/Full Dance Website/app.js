const express = require( 'express');
const path = require( 'path');
// const fs = require( 'fs');
const app = express();

// PUG CONF....
app.set( 'view engine', 'pug'); // Set PUG as the template engine
app.set( 'views', path.join( __dirname, 'views')); // Set VIEWS didrectory

// EXPRESS STUFF...
app.use( '/static', express.static('public'));
app.use( '/images', express.static('images'));
app.use(express.urlencoded({extended:true}));


// ENDPOINTS...
app.get("/", (req, res)=> {
    
    res.status(200).render( 'index.pug' );

});


// STARTING SERVER....
port = 80;
app.listen( port, ()=>{
    console.log( `Listening on port ${port}`);
    // console.log( app.set());
});