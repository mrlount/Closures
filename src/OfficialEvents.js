var http = require("http");
var xml2js = require("xml2js");
var async = require("async");

var unplannedEventsFeed = "http://m.highways.gov.uk/feeds/rss/UnplannedEvents.xml";
var plannedEventsFeed = "http://m.highways.gov.uk/feeds/rss/CurrentAndFutureEvents.xml";

var events = [];
var tempEvents = [];

exports.updateEvents = function()
{
    async.parallel([
        function(callback){ getData(unplannedEventsFeed, callback); },
        function(callback){ getData(plannedEventsFeed, callback); }
    ], function(error, results){
        if(error)
        {
            console.log(new Date() + " - " + error.message);
        }
        else
        {
            events = tempEvents;
            tempEvents = [];
            console.log(new Date() + " - Updated rss feeds");
        }
    });
}

function getData(url, callback)
{
    try
    {
        http.request(url, function(response){
            var tempXML = '';
            response.on("error", function(error){
                callback(error);
            });
            response.on("data", function(chunk){
                tempXML += chunk;
            });
            response.on("end", function(){
                processXML(tempXML, callback);
            });
        }).end();
    }
    catch(error)
    {
        callback(error);
    }
}

function processXML(data, callback)
{
    try
    {
        xml2js.parseString(data, {explicitArray: false}, function(error, result){
            if(error)
            {
                callback(error);
            }
            else
            {
                if( typeof(result.rss.channel.item.length) !== "undefined")
                {
                    result.rss.channel.item.forEach(function(event){
                        tempEvents.push(event);
                    });
                    callback(null, "success");
                }
                else if(typeof(result.rss.channel.item.reference) === "string")
                {
                    tempEvents.push(result.rss.channel.item);
                    callback(null, "success");
                }
                else
                {
                    callback(error);
                }    
            }
        });
    }
    catch(error)
    {
        callback(error);
    }
}

exports.getEvents = function()
{
    return events;
}

