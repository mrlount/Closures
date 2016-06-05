'use strict';

function events(){
    /*jshint validthis:true */
    this.events = [];
}

events.prototype.getEvents = function()
{
    return this.events;
};

events.prototype.setEvents = function(data)
{
    this.events = data;
};

events.prototype.addEvent = function(data)
{
    this.events.push(data);
};

events.prototype.addEvents = function(data)
{
    var me = this;
    data.forEach(function(item){
       me.events.push(item); 
    });
};

events.prototype.clearEvents = function()
{
    this.events = [];
};

module.exports = events;
