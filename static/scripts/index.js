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
}
