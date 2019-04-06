require("dotenv").config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const siteRoutes = require('./routes/index');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/review')
const passportConfig = require('./config/passport.js');
const ensureLogin = require("connect-ensure-login");
const http = require("http");
const moment = require('moment');

const app = express();

hbs.registerHelper('date-format', function(context, format) {
  if (moment && context !== null && context !== '') {
      // var format = block.hash.format || "DD-MM-YYYY";
      return moment(context).format(format);
  }
  
  // Moment not present or the date is empty-ish, show the default value or nothing
  return (block.hash.default ? block.hash.default : context);
});

hbs.registerHelper('ifvalue', function (conditional, options) {
  if (options.hash.value === conditional) {
    return options.fn(this)
  } else {
    return options.inverse(this);
  }
});



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



// passport and session config
app.use(passportConfig);

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
var order = require('./routes/order');
app.use('/', order);
var auth = require('./routes/auth');
app.use('/', auth);
var review = require('./routes/review');
app.use('/', review);
