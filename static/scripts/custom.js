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
        var panel = '<div class="panel panel-default"><div class="panel-heading">' + item.title + '<input class="btn btn=default" type="button" onclick="removeCustom(' + "'" + item.reference + "'" + ')" style="margin-left: 100px" value="Remove">' + '</div><div class="panel-body">' + item.description.replace(/\n/g, "<br>") + '</div><div class="panel-footer">Reference: ' + item.reference + '</div></div>';
        var panelElement = $(panel);
        panelElement.appendTo('#customlist');
    });
};

function removeCustom(reference)
{
    var data = {reference: reference};
    $.ajax("customList", {
        method: "POST",
        data: data
    }).done();
    getCustomList();
}