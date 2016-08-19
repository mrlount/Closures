var fs = require("fs");

function gaz(){
  this.gazetteer = JSON.parse(fs.readFileSync("static/scripts/gaz.json", "utf8"));
}

gaz.prototype.getPoints = function(lat, lon)
{
	var gazPoints = [];
  var me = this;
	this.gazetteer.forEach(function(item){
		item.distance = me.getDistance(parseFloat(lat), parseFloat(lon), parseFloat(item.lat), parseFloat(item.lon));
		gazPoints.push(item);
	});
	
	gazPoints.sort(function(a, b){return a.distance - b.distance });
	
	var usingPoints = gazPoints.slice(0,9);
  return usingPoints;
}

gaz.prototype.getDistance = function(lat1,lon1,lat2,lon2){
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

module.exports = gaz;