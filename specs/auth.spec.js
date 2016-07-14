var fs = require("fs");
var authModule = require("../src/auth.js");

var pinArray = [12, 16, 18, 19, 20];
var json = JSON.stringify(pinArray);
fs.writeFileSync("pins.json", json, "utf8");

var auth = new authModule();

describe("It checks different pins to see if they are valid", function(){
    it("Checks a correct pin", function(){
        expect(auth.checkPin(16)).toBeGreaterThan(0);
    });
    it("Checks an incorrect pin", function(){
        expect(auth.checkPin(100)).toBe(false);
    });
});
