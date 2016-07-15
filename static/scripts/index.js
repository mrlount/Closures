var markers = [];
var map;

var motorways = [{road: "M1"}, {road:"M2"}, {road:"M3"}, {road:"M4"}, {road:"M5"}, {road:"M6"}, {road:"M11"}, {road:"M18"}, {road:"M20"}, {road:"M23"}, {road:"M25"}, {road:"M26"}, {road:"M27"}, {road:"M32"}, {road:"M40"}, {road:"M42"}, {road:"M45"}, {road:"M49"}, {road:"M50"}, {road:"M53"}, {road:"M54"}, {road:"M55"}, {road:"M56"}, {road:"M57"}, {road:"M58"}, {road:"M60"}, {road:"M61"}, {road:"M62"}, {road:"M65"}, {road:"M66"}, {road:"M67"}, {road:"M69"}, {road:"M180"}, {road:"M181"}, {road:"M271"}, {road:"M275"}, {road:"M602"}, {road:"M621"}];
var aroads = [{road: "A1"}, {road: "A1(M)"}, {road: "A2"}, {road: "A3"}, {road: "A3(M)"}, {road: "A4"}, {road: "A5"}, {road: "A6"}, {road: "A11"}, {road: "A12"}, {road: "A13"}, {road: "A14"}, {road: "A19"}, {road: "A20"}, {road: "A21"}, {road: "A23"}, {road: "A26"}, {road: "A27"}, {road: "A28"}, {road: "A30"}, {road: "A31"}, {road: "A34"}, {road: "A35"}, {road: "A36"}, {road: "A38"}, {road: "A38(M)"}, {road: "A40"}, {road: "A41"}, {road: "A42"}, {road: "A43"}, {road: "A45"}, {road: "A46"}, {road: "A47"}, {road: "A49"}, {road: "A50"}, {road: "A52"}, {road: "A55"}, {road: "A56"}, {road: "A57"}, {road: "A57(M)"}, {road: "A58"}, {road: "A58(M)"}, {road: "A59"}, {road: "A61"}, {road: "A62"}, {road: "A63"}, {road: "A64"}, {road: "A64(M)"}, {road: "A66"}, {road: "A67"}, {road: "A68"}, {road: "A69"}, {road: "A74(M)"}, {road: "A75"}, {road: "A120"}, {road: "A160"}, {road: "A162"}, {road: "A167"}, {road: "A167(M)"}, {road: "A168"}, {road: "A172"}, {road: "A174"}, {road: "A180"}, {road: "A184"}, {road: "A194(M)"}, {road: "A228"}, {road: "A229"}, {road: "A249"}, {road: "A251"}, {road: "A259"}, {road: "A260"}, {road: "A282"}, {road: "A292"}, {road: "A296"}, {road: "A303"}, {road: "A308(M)"}, {road: "A309"}, {road: "A316"}, {road: "A329M"}, {road: "A403"}, {road: "A404"}, {road: "A404M"}, {road: "A405"}, {road: "A406"}, {road: "A414"}, {road: "A417"}, {road: "A419"}, {road: "A421"}, {road: "A428"}, {road: "A435"}, {road: "A446"}, {road: "A449"}, {road: "A452"}, {road: "A453"}, {road: "A454"}, {road: "A456"}, {road: "A458"}, {road: "A460"}, {road: "A461"}, {road: "A463"}, {road: "A465"}, {road: "A483"}, {road: "A491"}, {road: "A494"}, {road: "A500"}, {road: "A516"}, {road: "A550"}, {road: "A556"}, {road: "A560"}, {road: "A580"}, {road: "A585"}, {road: "A590"}, {road: "A595"}, {road: "A601(M)"}, {road: "A614"}, {road: "A616"}, {road: "A627(M)"}, {road: "A628"}, {road: "A631"}, {road: "A638"}, {road: "A643"}, {road: "A663"}, {road: "A696"}, {road: "A1001"}, {road: "A1023"}, {road: "A1033"}, {road: "A1053"}, {road: "A1057"}, {road: "A1081"}, {road: "A1089"}, {road: "A1198"}, {road: "A2070"}, {road: "A2270"}, {road: "A3113"}, {road: "A4010"}, {road: "A4036"}, {road: "A4041"}, {road: "A4114"}, {road: "A4123"}, {road: "A4540"}, {road: "A4600"}, {road: "A5036"}, {road: "A5080"}, {road: "A5103"}, {road: "A5111"}, {road: "A5117"}, {road: "A5127"}, {road: "A5139"}, {road: "A5148"}, {road: "A5300"}, {road: "A6129"}]; 


var roadworksImage = "static/images/roadworks.png";
var futureRoadworksImage = "static/images/future-roadworks.png";
var closedImage = "static/images/closed.png";
var futureClosedImage = "static/images/future-closed.png";
var accidentsImage = "static/images/accidents.png";
var congestionImage = "static/images/congestions.png";
var incidentsImage = "static/images/incidents.png";

var closureStrings = ["All lanes are closed", "All lanes will be closed"];
var slanesStrings = ["are three of four lanes", "are two of three lanes", "is one of two lanes"];
var futureSlanesStrings = ["will be three of four lanes", "will be two of three lanes", "will be one of two lanes"];

function clearMarkers()
{
    markers.forEach(function(marker){
        marker.setMap(null);
    });
    markers = null;
    markers = [];
}

function initMap()
{
    var width = Math.floor(0.98 * screen.width);
    var height = Math.floor(0.7 * screen.height);
    $("#map").css("width", width.toString() + "px");
    $("#map").css("height", height.toString() + "px");
    
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 52.486243, lng: -1.890401},
        zoom: 9
    });
    map.addListener('rightclick', function(event){clickOnMap(event);});
    
    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    updateEvents();
}

function updateEvents()
{
    clearMarkers();
    var slips =  $("#includeslips").prop("checked") ? "Y" : "N";
    var slanes =  $("#includeslanes").prop("checked") ? "Y" : "N";
    var startDate = new Date();
    var options = {
        slips: slips,
        slanes: slanes,
        startDate: startDate
    };
    $.ajax("events", {
        method: "GET", 
        data: options
    }).done(placeEvents);
}

function placeEvents(data)
{
    data.forEach(function(event){
        var image;
        switch(event.category[0])
        {
            case "Accident": image = accidentsImage;
            break;
            case "Congestion": image = congestionImage;
            break;
            case "Road Works": image = roadworksIcon(event);
            break;
            case "Barrier/Bridge Repairs": image = roadworksIcon(event);
            break;
            case "RoadOrCarriagewayOrLaneManagement": image = roadworksImage;
            break;
            default: image = incidentsImage;
            break;
        }
        var panelClass = "panel-default";
        if(image === futureClosedImage || image === futureRoadworksImage)
        {
            panelClass = "panel-primary";   
        }
        else
        {
           panelClass = "panel-danger";
        }
        var contentString = '<div class="panel ' + panelClass + '"><div class="panel-heading ' + panelClass + '">';
        contentString += event.title + '</div><div class="panel-body ' + panelClass + '">';
        contentString += event.description.replace(/\n/g, "<br>");
        contentString += '</div><div class="panel-footer ' + panelClass + '">';
        contentString += event.reference;
        contentString += '<span><input type="text" id="' + event.reference + '" style="margin: 2px" autocomplete="off" placeholder="Enter Pin"><input type="button" class="btn btn-default" value="Remove" onclick="removeEvent(';
        contentString += "'";
        contentString += event.reference;
        contentString += "'";
        contentString += ')"></span>'; 
        contentString += '</div></div>';
        
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        var myLatLng = {lat: parseFloat(event.latitude), lng: parseFloat(event.longitude)};
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: event.title,
            icon: image
        });
        marker.addListener('click', function() {
            infowindow.open(map, marker);
        });
        markers.push(marker);
    });
}

function roadworksIcon(event)
{
    if(event.description.indexOf(closureStrings[0]) > -1){
        return closedImage;
    }
    else if(event.description.indexOf(closureStrings[1]) > -1 ){
        return futureClosedImage;
    }
    else
    {
        var image = incidentsImage;
        slanesStrings.forEach(function(slanes){
            if (event.description.indexOf(slanes) > -1)
            {
                image = roadworksImage;
            }
        });
        futureSlanesStrings.forEach(function(futureSlanes){
            if (event.description.indexOf(futureSlanes) > -1)
            {
                image = futureRoadworksImage;
            }
        });
        return image;
    }   
}

function removeEvent(eventId)
{
    var pin = document.getElementById(eventId);
    var options = {
        pin: pin.value,
        block: eventId
    };
    $.ajax("block", {
        method: "POST", 
        data: options
    }).done(
        updateEvents()
        ).fail(
        function(){alert("Adding block failed\nCheck your pin");}
    );
}

function clickOnMap(mouseevent)
{
    var latitude = mouseevent.latLng.lat();
    var longitude = mouseevent.latLng.lng();
    var contentString = '<input type="button" class="btn btn-default" value="Create Event" onclick="createLogEvent(';
    contentString += "'";
    contentString += latitude;
    contentString += "','";
    contentString += longitude;
    contentString += "'"; 
    contentString += ')"></input>';
    var infowindow = new google.maps.InfoWindow({
    position: mouseevent.latLng,
    content: contentString
    });
    infowindow.open(map);
}

function createLogEvent(Lat, Lng)
{
    var contentString = '<form action="customevent" method="post" style="width: 400px"><div class="form-group"><label for="eventRoad">Road</label><select name="road" class="form-control" id="eventRoad">';
    motorways.forEach(function(mway){
        contentString += '<option>' + mway.road + '</option>';
    });
    aroads.forEach(function(aroad){
        contentString += '<option>' + aroad.road + '</option>';
    });
    contentString += '</select></div>';
    contentString += '<div class="form-group"><label for="direction">Direction</label><select name="direction" id="direction" class="form-control"><option>Northbound</option><option>Southbound</option><option>Eastbound</option><option>Westbound</option><option>Clockwise</option><option>Anti-Clockwise</option></select></div>';
    contentString += '<div class="form-group"><label for="pin">Pin Number</label><div><input type="text" name="pin" class="form-control" id="pin" autocomplete="off" required></div>';
    contentString += '<div class="form-group"><label for="category">Category</label><select name="category" class="form-control" id="category" required><option>Accident</option>Congestion<option>Road Works</option><option>Debris</option><option>Other</option></select></div>';
    contentString += '<div class="form-group"><label for="ActiveSelect">Status</label><select name="status" class="form-control" id="ActiveSelect" required><option>Currently Active</option><option>Pending</option></select>';
    contentString += '<div class="form-group"><label for="ClosureType">Lanes Closed</label><select name="lanes" class="form-control" id="ClosureType" required><option>All lanes are closed</option><option>Two of Three Lanes</option><option>One of Three Lanes</option><option>One of Two Lanes</option><option>Three of Four Lanes</opton><option>Two of Four Lanes</opton><option>One of Four Lanes</opton></select></div>';
    contentString += '<div class="form-group"><label for="description">Description</label><input class="form-control" type="text" id="description" name="description" required></div>';
    contentString += '<div class="form-group"><label for="eventStart">Start Date</label><input type="text" class="form-control" id="eventStart" name="eventStart" required></div>';
    contentString += '<input type="text" value="' + Lat + '" class="hidden" name="latitude">';
    contentString += '<input type="text" value="' + Lng + '" class="hidden" name="longitude">';
    contentString += '<button type="submit" class="btn btn-default">Submit</button>';
    contentString += '</form>';
    
    var infowindow = new google.maps.InfoWindow({
    position: {lat: parseFloat(Lat), lng: parseFloat(Lng)},
    content: contentString,
    maxWidth: 800
    });
    infowindow.open(map);

    $('#eventStart').datetimepicker({ 
        
    });
}
