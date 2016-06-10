"use strict";

var express = require('express');
var router = express.Router();
var eventsServiceModule = require('./eventService.js');
var querystring = require("querystring");
var url = require("url");
var authModule = require("./auth.js");

var auth = new authModule();
var eventService = new eventsServiceModule();
var eventFactory = eventService.getEventFactory();
eventService.updateEvents();

router.get('/', function(req, res) {
  res.render('index');;
});

router.get("/events", function(req, res){
    var query = querystring.parse(url.parse(req.url).query);
    eventService.getEvents( query, function(error, results){
        res.json(results);
    });    
});

router.post("/block", function(req, res){
    if(auth.checkPin(req.body.pin))
    {
        eventFactory.addBlock(req.body.block, req.body.pin);
        res.sendStatus(200);
    }
    else
    {
        res.sendStatus(403);
    }
});

module.exports = router;

