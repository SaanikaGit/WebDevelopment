// console.log('hello');

const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 80; // Default Port for localhost...
const fileHome = fs.readFileSync('./home.html')
const fileServices = fs.readFileSync('./services.html')
const fileClients = fs.readFileSync('./clients.html')
const fileContact = fs.readFileSync('./contact.html')

const server = http.createServer((req, res) => {
    console.log(req.url);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    if (req.url == '/') {
        res.end(fileHome);
    }
    else if (req.url == '/home') {
        res.end(fileHome);
    }
    else if (req.url == '/servicesSection') {
        res.end(fileServices);
    }
    else if (req.url == '/clientSection') {
        res.end(fileClients);
    }
    else if (req.url == '/contactSection') {
        res.end(fileContact);
    }
    else{
        res.statusCode = 404;
        res.end('<h1>404 : File not found...</h1>');
        
    }
    
});


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
