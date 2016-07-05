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

router.post("/customevent", function(req, res){
    if(auth.checkPin(req.body.pin))
    {
        var event = {};
        event.road = req.body.road;
        event.category = [];
        event.category[0] = req.body.category;
        event.category[1] = req.body.description;
        event.title = event.road + " " + req.body.direction + " " + event.category[0];
        event.description = "Status: " + req.body.status + "\n" + "Lanes Closed: " + req.body.lanes + "\n" + "Description: " + req.body.description;
        event.latitude = req.body.latitude;
        event.longitude = req.body.longitude;
        var reference = new Date().getDate() + "-" + new Date().getMonth() + "-" + new Date().getYear() + "-" + Math.floor(Math.random() * 1000);
        event.reference = reference;
        event.eventStart = req.body.eventStart;
        eventFactory.addCustomEvent(event);
        res.render('index');
    }
    else
    {
        res.sendStatus(403);
    }
});

router.get("/blockedList", function(req, res){
    res.render('blocked');
});

router.get("/blockList", function(req, res){
    var blocks = eventFactory.getBlockList();
    var events = eventFactory.getEvents();
    var results = [];
    events.forEach(function(event){
        if (blocks.indexOf(event.reference) > -1){
            results.push(event);
        };
    });

    res.json(results);
});

router.post("/blocklist", function(req,res){
    eventFactory.removeBlock(req.body.reference);
});

router.get("/customEvents", function(req, res){
    res.render('custom');
});

router.get("/customList", function(req, res){
    var results = eventFactory.getCustomEvents();
    res.json(results);
});

router.post("/customList", function(req,res){
    eventFactory.removeCustomEvent(req.body.reference);
});

module.exports = router;

