
// Variable for the query search
$(".query").on("click", function(event) {
    event.preventDefault();
    var query = $("input").val();
    var apiKey = "FePp8H2l";
    // Query that includes parameters, API-key and search variable
    var queryURL = "https://www.rijksmuseum.nl/api/en/collection/sk-c-5?key=" + apiKey + 
    "&format=json&q=" + query;
    // Ajax call to the Rijksmuseum API to retrieve data
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).done(function(response) {
    console.log(response);
    var results = response.artObjects;
    var artist = results.principalOrFirstMaker;
    var title = results.title;
    var image = results.webImage.url;
    var artDiv = $("<div>");
    var a = $("<p>").text(title);
    var t = $("<p>").text(title);
    var artImage = $("<img>").attr("src", image);
    artDiv.append(a);
    artDiv.append(p);
    artDiv.append(artImage);
    });
});