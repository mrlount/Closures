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
            if(block === event.reference)
            {
                results.push(event);
            }
        });
    });
    return results;
}

exports.removeBlock = function(reference)
{
    blockedEvents = blockedEvents.splice(0, blockedEvents.indexOf(reference));
}

exports.addCustomEvent = function(event)
{
    var tempEvent = {};
    for (var property in event)
    {
        if(event.hasOwnProperty(property))
        {
            tempEvent[property] = xssfilters.inHTMLData(event[property]);
        }
    }
    customEvents.push(tempEvent);
}

exports.getCustomEvents = function()
{
    return customEvents;
}
