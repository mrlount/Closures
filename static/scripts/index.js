var markers = [];
var map;

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
        contentString += event.reference + '</div></div>';
        
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


