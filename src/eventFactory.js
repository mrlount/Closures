'use strict';

var http = require("http");
var xml2js = require("xml2js");

var blocks = require("./blocks.js");
var events = require("./events.js");
var customEvents = require("./customEvents.js");

function eventFactory(){
    /*jshint validthis:true */
    this.unplannedURL = "http://m.highways.gov.uk/feeds/rss/UnplannedEvents.xml";
    this.plannedURL = "http://m.highways.gov.uk/feeds/rss/CurrentAndFutureEvents.xml";
    this.blocks = new blocks();
    this.events = new events();
    this.customEvents = new customEvents();
}

eventFactory.prototype.updateEvents = function(){
    this.events.clearEvents();
    this.downloadEvents(this.unplannedURL);
    this.downloadEvents(this.plannedURL);
};

eventFactory.prototype.downloadEvents = function(url){
    var me = this;
    http.request(url, function(response){
        var tempXML = "";
        response.on("error", function(error){
            console.log(new Date() + " - " + error.message);
        });
        response.on("data", function(chunk){
            tempXML += chunk;
        });
        response.on("end", function(){
            me.parseXML(tempXML); 
        });     
    }).end();
};

eventFactory.prototype.parseXML = function(xmlData){
    var me = this;
    xml2js.parseString(xmlData, {explicitArray:false}, function(error, result){
        if(error)
        {
            console.log(new Date() + " - " + error.message);
        }
        else
        {
            if(typeof(result.rss.channel.item) !== "undefined" && typeof(result.rss.channel.item.length) !== "undefined")
            {
                result.rss.channel.item.forEach(function(item){
                    me.events.addEvent(item);
                });
            }
        }
    });
};

eventFactory.prototype.getEvents = function(){
    var events = this.events.getEvents();
    var custom = this.customEvents.getEvents();
    return events.concat(custom);
};

eventFactory.prototype.getUnblockedEvents = function(){
    var me = this;
    var tempReturn = [];
    this.events.getEvents().forEach(function(event){
        var tempEvent = {};
        for(var property in event)
        {
            if(event.hasOwnProperty(property))
            {
                tempEvent[property] = event[property];
            }
        }
        tempReturn.push(tempEvent);
    });
        
    tempReturn.forEach(function(event, index){
        me.blocks.getBlockList().forEach(function(block){
            if(event.reference === block)
            {
                tempReturn.splice(index, 1);
            }
        });
    });
    var custom = this.customEvents.getEvents();
    return tempReturn.concat(custom);
};

eventFactory.prototype.addBlock = function(reference,id)
{
    this.blocks.addBlock(reference, id);
};

eventFactory.prototype.removeBlock = function(reference)
{
    this.blocks.removeBlock(reference);
};

eventFactory.prototype.getBlocks = function()
{
    return this.blocks.getBlocks();
};

eventFactory.prototype.getBlockList = function()
{
    return this.blocks.getBlockList();
};

eventFactory.prototype.cleanBlocks = function()
{
    return this.blocks.cleanBlocks(this.events.getEvents());
};

eventFactory.prototype.getCustomEvents = function()
{
    return this.customEvents.getEvents();
};

eventFactory.prototype.addCustomEvent = function(event)
{
    this.customEvents.addEvent(event);
};

eventFactory.prototype.removeCustomEvent = function(event)
{
    this.customEvents.removeEvent(event);
};

eventFactory.prototype.removeCustomEvents = function()
{
    this.customEvents.clearEvents();
};

// Only for testing
eventFactory.prototype.addEvent = function(event)
{
    this.events.addEvent(event);
};

module.exports = eventFactory;
