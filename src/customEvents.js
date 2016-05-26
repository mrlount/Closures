var xssfilters = require("xss-filters");
var officialEvents = require("./OfficialEvents.js");

var blockedEvents = [];
var customEvents = [];

exports.addBlock = function(blockString)
{
    if(typeof(blockString) === "string")
    {
        blockedEvents.push(xssfilters.inHTMLData(blockString));
    }
}

exports.getBlockList = function()
{
    return blockedEvents;
}

exports.getBlockedEvents = function()
{
    var events = officialEvents.getEvents();
    var results = [];
    
    events.forEach(function(event){
        blockedEvents.forEach(function(block){
            if(block.reference === event.reference)
            {
                results.push(event);
            }
        });
    });
    
    return results;
}
