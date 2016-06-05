"use strict";

var express = require('express');
var helmet = require('helmet');
var compression = require('compression');
var app = express();

app.set('view engine', 'pug');
app.use(helmet());
app.use('/resources', express.static('node_modules'));
app.use('/static', express.static('static'));
app.use(compression());

app.get('/', function (req, res) {
  res.render('index');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
