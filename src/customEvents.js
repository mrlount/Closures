"use strict";

var xssFilters = require("xss-Filters");

function customEvent(){
    /*jshint validthis:true */
    this.events = [];
}

customEvent.prototype.addEvent = function(event)
{
    var tempObj = {};  
    for(var property in event){
        if (event.hasOwnProperty(property))
        {
            if(property === "startDate")
            {
                tempObj[property] = Date(event[property]);
            }
            else if(property === "category")
            {
                var tempCat = [];
                tempCat.push(xssFilters.inHTMLData(event[property][0]));
                tempCat.push(xssFilters.inHTMLData(event[property][1]));
                tempObj[property] = tempCat;
            }
            else
            {
                tempObj[property] = xssFilters.inHTMLData(event[property]);
            }
        }
    }
    this.events.push(tempObj);
};

customEvent.prototype.removeEvent = function(reference)
{
    var me = this;
    this.events.forEach(function(event, index){
        if(event.reference === reference)
        {
            me.events.splice(index, 1);
        }
    });
};

customEvent.prototype.getEvents = function()
{
    return this.events;
};

customEvent.prototype.clearEvents = function()
{
    this.events = [];
};

module.exports = customEvent;
