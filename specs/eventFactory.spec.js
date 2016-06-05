var eventFactoryModule = require("../src/eventFactory.js");

var eventFactory = new eventFactoryModule();

var eventOne = { title:"A1 Works", road:"A1", reference:"RW0001", status: "Active" };
var eventTwo = { title:"A2 Works", road:"A2", reference:"RW0002", status: "Active" };
var eventThree = { title:"A3 Works", road:"A3", reference:"RW0003", status: "Active" };
var eventFour = { title:"A4 Works", road:"A4", reference:"RW0004", status: "Active" };
var eventFive = { title:"A5 Works", road:"A5", reference:"RW0005", status: "Active" };
var customEventOne = { title:"A6 Works", road:"A6", reference:"RW0006", status: "Active" };
var customEventTwo = { title:"A7 Works", road:"A7", reference:"RW0007", status: "Active" };
var customEventThree = { title:"A8 Works", road:"A8", reference:"RW0008", status: "Active" };
var customEventFour = { title:"A9 Works", road:"A9", reference:"RW0009", status: "Active" };
var customEventFive = { title:"A10 Works", road:"A10", reference:"RW0010", status: "Active" };

var testArray = [eventOne, eventTwo, eventThree, eventFour, eventFive];
var blockedArray = [eventOne, eventTwo, eventFour, eventFive];
var customArray = [customEventOne, customEventTwo, customEventThree, customEventFour, customEventFive];

describe("Add events and check they are returned correctly", function(){
    it("adds events and checks they are returned", function(){
        eventFactory.addEvent(eventOne);
        eventFactory.addEvent(eventTwo); 
        eventFactory.addEvent(eventThree); 
        eventFactory.addEvent(eventFour); 
        eventFactory.addEvent(eventFive);
        
        expect(eventFactory.getEvents()).toEqual(testArray); 
        expect(eventFactory.getUnblockedEvents()).toEqual(testArray);            
    });
    it("adds custom events and checks they are returned",function(){
        eventFactory.addCustomEvent(customEventOne);
        eventFactory.addCustomEvent(customEventTwo);
        eventFactory.addCustomEvent(customEventThree);
        eventFactory.addCustomEvent(customEventFour);
        eventFactory.addCustomEvent(customEventFive);
        expect(eventFactory.getEvents()).toEqual(testArray.concat(customArray));
        expect(eventFactory.getUnblockedEvents()).toEqual(testArray.concat(customArray));
        expect(eventFactory.getCustomEvents()).toEqual(customArray);
        eventFactory.removeCustomEvents();
        expect(eventFactory.getCustomEvents()).toEqual([]);
        eventFactory.addCustomEvent(customEventOne);
        eventFactory.addCustomEvent(customEventTwo);
        eventFactory.addCustomEvent(customEventThree);
        eventFactory.addCustomEvent(customEventFour);
        eventFactory.addCustomEvent(customEventFive);
    });
    it("Blocks an event and checks it is not returned", function(){
        eventFactory.addBlock("RW0003", "ID1");
        expect(eventFactory.getEvents()).toEqual(testArray.concat(customArray));
        expect(eventFactory.getUnblockedEvents()).toEqual(blockedArray.concat(customArray));
        expect(eventFactory.getBlockList()).toEqual(["RW0003"]);
        expect(eventFactory.getBlocks()).toEqual([{reference:"RW0003",id:"ID1"}]);
    });
    it("Removes the block and receives all events", function(){
        eventFactory.removeBlock("RW0003");
        expect(eventFactory.getBlockList()).toEqual([]);
        expect(eventFactory.getBlocks()).toEqual([]);
        expect(eventFactory.getEvents()).toEqual(testArray.concat(customArray));
        expect(eventFactory.getUnblockedEvents()).toEqual(testArray.concat(customArray));
    });
    it("Removes a custom event and check it is not returned",function(){
        var tempArray = [customEventOne, customEventTwo, customEventThree, customEventFour];
        eventFactory.removeCustomEvent("RW0010");
        expect(eventFactory.getCustomEvents()).toEqual(tempArray);
        expect(eventFactory.getEvents()).toEqual(testArray.concat(tempArray));
        expect(eventFactory.getUnblockedEvents()).toEqual(testArray.concat(tempArray));
    });
})
