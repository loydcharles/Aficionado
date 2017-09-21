var login = false;

function init() {
    $(".wrapper").css("height", window.innerHeight);
    if(!login) {
        loginDisplay();
    }
}

function loginDisplay() {
    if(window.innerHeight > 600) {
        $(".inputWrap").css("top", window.innerHeight / 2 - 200);
    }
    if(window.innerWidth > 500) {
        $(".inputWrap").css("left", window.innerWidth / 2 - 250);
    }
}
var slideshow;

function renderData(data) {
    $(".imageDisplay").empty();
    clearInterval(slideshow);
    var index = 1;
    var presentationDiv = $("<div>");
    var returnedName = $("<h1 class='artistName'>").text(data.artObjects[0].principalOrFirstMaker);
    var returnedTitle = $("<h1 class='artTitle'>").text(data.artObjects[0].title);
    var returnedImages = $("<img class='artDisplay'>").attr("src", data.artObjects[0].webImage.url);
    presentationDiv.append(returnedName, returnedTitle, returnedImages);
    $(".imageDisplay").html(presentationDiv);
        slideshow = setInterval(function() {
        presentationDiv = $("<div>");
        returnedName = $("<h1 class='artistName'>").text(data.artObjects[index].principalOrFirstMaker);
        returnedTitle = $("<h1 class='artTitle'>").text(data.artObjects[index].title);
        returnedImages = $("<img class='artDisplay'>").attr("src", data.artObjects[index].webImage.url);
        presentationDiv.append(returnedName, returnedTitle, returnedImages);
        $(".imageDisplay").html(presentationDiv);
        index += 1;
        if(index === data.artObjects.length) {
            index = 0;
        }
    }, 5000);
}

function defaultSearch() {
    var queryURL = "https://www.rijksmuseum.nl/api/en/collection/?key=nRpUKIg0&format=json&ps=10&imgonly=True&q=Van%20Gogh";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(data) {
        console.log("Default firing!");
        renderData(data);
        $("#artQuery").val("");    
    });
}

$(".submit").on("click", function(event) {
    event.preventDefault();
    var username = $("#username").val();
    login = username;
    var newPost = {
        name: username
    };
    $.post("/", newPost, function(data) {
        $("#login").html("<div id='logWrap'>" + data.name + "&nbsp;&nbsp;<img id='avatar' src='/images/avatar.jpg'></div>");
        $("#username").val("");

        if(login) {
            $(".inputWrap").remove();
            var newInput = $("<input id='artQuery' type='text'  placeholder='Type a masterpiece'>");
            var searchBtn = $("<button id='artSearch' class='btn btn-lg btn-danger' type='submit'>");
            searchBtn.text("Search");
            $("#title").append(newInput, searchBtn);
            // Allows the enter key to submit the data
            $(function() {
                $("input").keypress(function (e) {
                    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
                        $('#artSearch').click();
                        return false;
                    } else {
                        return true;
                    }
                });
            });
            $("#artSearch").on("click", function(event) {
                event.preventDefault();
                var query = $("#artQuery").val().trim();
                var patt = new RegExp("^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$");
                if ((query === "") || (patt.test(query) !== true)) {
                    $("#artQuery").val("");
                    return false;
                } else {
                var queryURL = "https://www.rijksmuseum.nl/api/en/collection/?key=nRpUKIg0&format=json&ps=10&imgonly=True&q=" + 
                query;
                console.log(queryURL);
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).done(function(data) {
                        console.log(data.artObjects);
                        if (data.artObjects.length === 0) {
                            defaultSearch();
                        } else {
                            renderData(data);
                        }
                        $("#artQuery").val("");
                    });
                }
            });
        }
    });
});

window.addEventListener("resize", init);

init();