require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const hbs = require('handlebars');
const http = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

//conection mongo
mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch(error => {
    throw new Error(error);
  });


  // Middleware Setup
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
// app.use(envInjector);



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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//End Server Setup

// Routes

var index = require ('./routes/index');
app.use('/', index);
var user = require('./routes/user');
app.use('/', user);
var product = require('./routes/product');
app.use('/', product);
var order = require('./routes/order')
app.use('/', order);