$.getJson("/articles", function(data){
    for (var i = 0; i < data.length; i++){
        $("#articles").append("<li data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</li>" + "<br />")
    }
});

$(document).on("click", "li", function(){
    $("#comments").empty();

    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    .then(function(data){
        console.log(data);

        $("#comments").append("<h3>" + data.title + "<h3>");
        $("#comments").append("<input id='titleInput' name='title'>");
        $("#comments").append("<textarea id='bodyInput' name='body'></textarea>");
        $("#comments").append("<button data-id='" + data._id + "' id='saveComment'>Save Comment")
    })
})