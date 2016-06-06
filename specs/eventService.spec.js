var eventServiceModule = require("../src/eventService.js");

var eventService = new eventServiceModule();
var eventFactory = eventService.getEventFactory();
var closureStrings = ["All lanes are closed", "All lanes will be closed"];
var slipString = ["exit slip", "entry slip"];
var slanesStrings = ["three of four lanes", "two of three lanes", "one of two lanes"];
var today = new Date();
var tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
var yesterday = new Date().setDate(new Date().getDate() - 1);

var eventOne = { eventStart: today.toDateString(), category: ["Road Works","Barrier/Bridge Repairs"], title:"A1 Works", road:"A1", reference:"RW0001", status: "Active", description: closureStrings[0] };
var eventTwo = { eventStart: today.toDateString(), category: ["Road Works","Barrier/Bridge Repairs"], title:"A2 Works", road:"A2", reference:"RW0002", status: "Active", description: closureStrings[1] };
var eventThree = { eventStart: today.toDateString(), category: ["Barrier/Bridge Repairs", "Road Works"], title:"A3 Works", road:"A3", reference:"RW0003", status: "Active", description: closureStrings[1] + " " + slipString[0] };
var eventFour = { eventStart: today.toDateString(), category: ["Barrier/Bridge Repairs", "Road Works"], title:"A4 Works", road:"A4", reference:"RW0004", status: "Active", description: closureStrings[0] + " " + slipString[1] };
var eventFive = { eventStart: today.toDateString(), category: ["Road Works","Barrier/Bridge Repairs"], title:"A5 Works", road:"A5", reference:"RW0005", status: "Active", description: slanesStrings[0] };
var customEventOne = { eventStart: today.toDateString(), category: ["Road Works","Barrier/Bridge Repairs"], title:"A6 Works", road:"A6", reference:"RW0006", status: "Active", description: slanesStrings[2] };
var customEventTwo = { eventStart: today.toDateString(), category: ["Barrier/Bridge Repairs", "Road Works"], title:"A7 Works", road:"A7", reference:"RW0007", status: "Active", description: slanesStrings[1] + " " + slipString[0] };
var customEventThree = { eventStart: today.toDateString(), category: ["Barrier/Bridge Repairs", "Road Works"], title:"A8 Works", road:"A8", reference:"RW0008", status: "Active", description:" "};
var customEventFour = { eventStart: today.toDateString(), category: ["Road Works","Barrier/Bridge Repairs"], title:"A9 Works", road:"A9", reference:"RW0009", status: "Active", description:" " };
var customEventFive = { eventStart: tomorrow.toDateString(), category: ["Road Works","Barrier/Bridge Repairs"], title:"A10 Works", road:"A10", reference:"RW0010", status: "Active", description: closureStrings[0] };

eventFactory.addEvent(eventOne);
eventFactory.addEvent(eventTwo);
eventFactory.addEvent(eventThree);
eventFactory.addEvent(eventFour);
eventFactory.addEvent(eventFive);
eventFactory.addCustomEvent(customEventOne);
eventFactory.addCustomEvent(customEventTwo);
eventFactory.addCustomEvent(customEventThree);
eventFactory.addCustomEvent(customEventFour);
eventFactory.addCustomEvent(customEventFive);

describe("Request events and check search criteria", function(){
    it("Gets full closures on main carriageways today", function(done){
        eventService.getEvents({ slips: "N", slanes: "N", startDate: new Date() }, function(error, results){
            var targetArray = [];
            targetArray.push(eventOne);
            targetArray.push(eventTwo);
            expect(results).toContain(eventOne);
            expect(results).toContain(eventTwo);
            expect(results).not.toContain(eventThree);
            expect(results).not.toContain(eventFour);
            expect(results).not.toContain(eventFive);
            expect(results).not.toContain(customEventOne);
            expect(results).not.toContain(customEventTwo);
            expect(results).not.toContain(customEventThree);
            expect(results).not.toContain(customEventFour);
            expect(results).not.toContain(customEventFive);
            done();
        });
    });
    it("Gets full closures on slips and main carriageway today",function(done){
        eventService.getEvents({ slips: "Y", slanes: "N", startDate: new Date() }, function(error, results){
            var targetArray = [];
            targetArray.push(eventOne);
            targetArray.push(eventTwo);
            targetArray.push(eventThree);
            targetArray.push(eventFour);
            expect(results).toContain(eventOne);
            expect(results).toContain(eventTwo);
            expect(results).toContain(eventThree);
            expect(results).toContain(eventFour);
            expect(results).not.toContain(eventFive);
            expect(results).not.toContain(customEventOne);
            expect(results).not.toContain(customEventTwo);
            expect(results).not.toContain(customEventThree);
            expect(results).not.toContain(customEventFour);
            expect(results).not.toContain(customEventFive);
            done();
        });
    });
    it("Gets lane closures on main carriageway today",function(done){
        eventService.getEvents({ slips: "N", slanes: "Y", startDate: new Date() }, function(error, results){
            var targetArray = [];
            targetArray.push(eventOne);
            targetArray.push(eventTwo);
            targetArray.push(eventFive);
            targetArray.push(customEventOne);
            expect(results).toContain(eventOne);
            expect(results).toContain(eventTwo);
            expect(results).not.toContain(eventThree);
            expect(results).not.toContain(eventFour);
            expect(results).toContain(eventFive);
            expect(results).toContain(customEventOne);
            expect(results).not.toContain(customEventTwo);
            expect(results).not.toContain(customEventThree);
            expect(results).not.toContain(customEventFour);
            expect(results).not.toContain(customEventFive);
            done();
        });
    });
    it("Gets lane closures on main carriageway and slips today",function(done){
        eventService.getEvents({ slips: "Y", slanes: "Y", startDate: new Date() }, function(error, results){
            var targetArray = [];
            targetArray.push(eventOne);
            targetArray.push(eventTwo);
            targetArray.push(eventThree);
            targetArray.push(eventFour);
            targetArray.push(eventFive);
            targetArray.push(customEventOne);
            targetArray.push(customEventTwo);
            expect(results).toContain(eventOne);
            expect(results).toContain(eventTwo);
            expect(results).toContain(eventThree);
            expect(results).toContain(eventFour);
            expect(results).toContain(eventFive);
            expect(results).toContain(customEventOne);
            expect(results).toContain(customEventTwo);
            expect(results).not.toContain(customEventThree);
            expect(results).not.toContain(customEventFour);
            expect(results).not.toContain(customEventFive);
            done();
        });
    });
    it("Gets full closures on main carriageway tomorrow",function(done){
        eventService.getEvents({ slips: "Y", slanes: "Y", startDate: tomorrow }, function(error, results){
            var targetArray = [];
            targetArray.push(eventOne);
            targetArray.push(eventTwo);
            targetArray.push(eventThree);
            targetArray.push(eventFour);
            targetArray.push(eventFive);
            targetArray.push(customEventOne);
            targetArray.push(customEventTwo);
            expect(results).toContain(eventOne);
            expect(results).toContain(eventTwo);
            expect(results).toContain(eventThree);
            expect(results).toContain(eventFour);
            expect(results).toContain(eventFive);
            expect(results).toContain(customEventOne);
            expect(results).toContain(customEventTwo);
            expect(results).not.toContain(customEventThree);
            expect(results).not.toContain(customEventFour);
            expect(results).toContain(customEventFive);
            done();
        });
    });
});
