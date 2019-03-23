require("dotenv").config();
const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const hbs = require('handlebars');
const http = require('http');
const path = require('path')



const app = express();


// Engine do HBS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));


//server connection

let server = http.createServer(app);

server.on('error', error => {
    if (error.syscall !== 'listen') { throw error }

    switch (error.code) {
        case 'EACCES':
            console.error(`Port ${process.env.PORT} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`Port ${process.env.PORT} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});

server.listen(process.env.PORT, () => {
    console.log(`Listening on http://localhost:${process.env.PORT}`);
})



//End Server Setup

// Routes

var index = require ('./routes/index');
app.use('/', index);
var user = require('./routes/user');
app.use('/', user);
