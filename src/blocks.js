'use strict';

var xssFilters = require('xss-filters');

function blocks(){
    /*jshint validthis:true */
    this.blocks = [];
}

blocks.prototype.addBlock = function(setReference, setId){
    var block = {reference: xssFilters.inHTMLData(setReference), id: xssFilters.inHTMLData(setId)};
    this.blocks.push(block);
};

blocks.prototype.removeBlock = function(ref){
    var me = this;
    this.blocks.forEach(function(item, index){
       if(item.reference === ref)
       {
           me.blocks.splice(index,1);
       }
    });
};

blocks.prototype.getBlocks = function(){
    return this.blocks;
};

blocks.prototype.getBlockList = function(){
    var returnArray = [];
    this.blocks.forEach(function(item){
       returnArray.push(item.reference);
    });
    return returnArray;
};

blocks.prototype.cleanBlocks = function(eventData)
{
    var me = this;
    var tempArray = [];
    me.blocks.forEach(function(block){
        eventData.forEach(function(event){
            if (event.reference === block.reference)
            {
                tempArray.push(block);
            }
        });
    });
    this.blocks = tempArray;
};

module.exports = blocks;
