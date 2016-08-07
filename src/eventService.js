'use strict';

var eventFactoryModule = require("./eventFactory.js");

var closureStrings = ["All lanes are closed", "All lanes will be closed"];
var slipString = ["exit slip", "entry slip"];
var slanesStrings = ["three of four lanes", "two of three lanes", "one of two lanes"];

function eventService()
{
    /*jshint validthis:true */
    this.eventFactory = new eventFactoryModule();
}

eventService.prototype.updateEvents = function()
{
    var me = this;
    this.eventFactory.updateEvents();
    setInterval(function(){me.eventFactory.updateEvents()},120000);
    setInterval(function(){me.eventFactory.cleanBlocks()},103000);
}

eventService.prototype.getEventFactory = function(){
    return this.eventFactory;
};

eventService.prototype.getEvents = function( options, callback){
    var me = this;
    var results = [];
    options.targetDate = Date.parse(options.startDate);
    var events = this.eventFactory.getUnblockedEvents();
    events.forEach(function(event){
        var itemDate = new Date(event.eventStart);
        if(itemDate.setHours(0) < options.targetDate)
        {
            if(event.category[0] === "Road Works" || event.category[0] === "Barrier/Bridge Repairs"){
                if(event.description.indexOf(closureStrings[0]) > -1 || event.description.indexOf(closureStrings[1]) > -1)
                {
                    if(options.slips !== "Y" && ((event.description.indexOf(slipString[0]) > -1 || event.description.indexOf(slipString[1]) > -1)))
                    {
                        // do nothing
                    }
                    else
                    {
                        results.push(event); // Full closures main c/way and slips
                    }
                }
                else if (options.slanes ==="Y" && (event.description.indexOf(slanesStrings[0]) > -1 || event.description.indexOf(slanesStrings[1]) > -1 || event.description.indexOf(slanesStrings[2]) > -1))
                {
                    if(options.slips !== "Y" && (event.description.indexOf(slipString[0]) > -1 || event.description.indexOf(slipString[1]) > -1))
                    {
                        // do nothing
                    }
                    else
                    {
                        results.push(event); // Single lanes main c/way and slips
                    }   
                }
                else
                {
                    // do nothing
                }
            }
            else
            {
                results.push(event);
            }
        }
    });
    callback(null, results);
};

module.exports = eventService;
