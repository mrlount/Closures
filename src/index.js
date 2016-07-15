"use strict";

var express = require('express');
var helmet = require('helmet');
var compression = require('compression');
var bodyParser = require('body-parser');
var router = require('./routes.js');
var app = express();

app.set('view engine', 'pug');
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/resources', express.static('node_modules'));
app.use('/static', express.static('static'));
app.use('/', router);


app.listen(3000, function () {
  console.log('Test app listening on port 3000!');
});
