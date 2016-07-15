$(document).ready(function(){
    getCustomList();
});

function getCustomList()
{
    $("#customlist").empty();
    $.ajax("customList", {
        method: "GET"
    }).done(doCustomList);
};

function doCustomList(data)
{
    data.forEach(function(item){
        var panel = '<div class="panel panel-default"><div class="panel-heading">' + item.title + '<input type="text" id="' + item.reference + '" placeholder="Enter Pin"><input class="btn btn=default" type="button" onclick="removeCustom(' + "'" + item.reference + "'" + ')" style="margin-left: 100px" value="Remove">' + '</div><div class="panel-body">' + item.description.replace(/\n/g, "<br>") + '</div><div class="panel-footer">Reference: ' + item.reference + ' Created by user id: ' + item.creator + '</div></div>';
        var panelElement = $(panel);
        panelElement.appendTo('#customlist');
    });
};

function removeCustom(reference)
{
    var pinElement = document.getElementById(reference);
    var data = {reference: reference, pin: pinElement.value};
    $.ajax("customList", {
        method: "POST",
        data: data
    }).done(getCustomList).fail(
        function(){alert("Removing custom event failed\nCheck your pin");}
    );
}

