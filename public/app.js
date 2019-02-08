$.ajax("/getData",{
    type: "GET"
}).then(function(data){
    for(var i=0; i<data.length;i++){
        var title = $("<h3>")
        var body = $("<p>")
        var div = $("<div>")
        title.text(data[i].title);
        body.text(data[i].body)
        div.append(title);
        div.append(body)
        $("#results").append(div)
    }
})