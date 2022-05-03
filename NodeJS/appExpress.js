const express = require( 'express');
const path = require( 'path');
const fs=require('fs')

const app = express();

// EXPRESS STUFF...
app.set( '/static', express.static( 'static'));
app.use(express.urlencoded({extended : true}));


// PUG CONF....
app.set( 'view engine', 'pug');
app.set( 'views', path.join( __dirname, 'views'));

// PUG demo documentation....
app.get( "/demo", (req, res)=>{
     res.status(200).render( 'demo', { title : 'Using PUG', message : 'Hello from PUG world'} );
});

// ENDPOINTS...
app.get("/", (req, res)=> {
    const params={
        "heading" : "Tell us about yourself",
        "message" : 'text message..---...'
    }
    res.status(200).render( 'index', params );

});

app.post("/", (req, res)=> {
    const params={
        "heading" : "Your data has been saved"
    }
    res.status(200).render( 'index', params );
    formData = req.body;

    outFileName='DATA/' + formData.name + '_' + Date.now();
    fileOutput = `[${formData.name}] aged [${formData.age}] working as [${formData.profession}] lives at [${formData.address}]. \nWe also know this about them [${formData.more}]`;
    fs.writeFileSync( outFileName, fileOutput);
    console.log( outFileName);
    console.log( fileOutput);
});

// STARTING SERVER....
port = 80;
app.listen( port, ()=>{
    console.log( `Listening on port ${port}`);
});