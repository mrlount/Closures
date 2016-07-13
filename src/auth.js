"use strict";

var fs = require("fs");

function auth(){
    this.pinArray = [];
    var me = this;
    var result = fs.readFileSync("pins.json","utf8");
    var input = JSON.parse(result);
    input.forEach(function(pin){
        me.pinArray.push(pin);
    });
}

auth.prototype.checkPin = function(pin)
{
    var testPin;
    testPin = typeof(pin) === "string" ? pin = parseInt(pin) : pin;

    if(this.pinArray.indexOf(pin) > -1)
    {
        return this.pinArray.indexOf(pin);
    }
    else
    {
        return false;
    }
}

module.exports = auth;