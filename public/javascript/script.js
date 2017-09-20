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

$(".submit").on("click", function(event) {
    event.preventDefault();
    var username = $("#username").val();
    login = username;
    var newPost = {
        name: username
    }
    $.post("/", newPost, function(data) {
        $("#login").html("<div id='logWrap'>" + data.name + "&nbsp;&nbsp;<img id='avatar' src='/images/avatar.jpg'></div>");
        $("#username").val("");
        if(login) {
            $(".inputWrap").remove();
            var slideshow;
            var newInput = $("<input id='artQuery' type='text'  placeholder='Type a masterpiece'>");
            var searchBtn = $("<button id='artSearch' class='btn btn-lg btn-danger' type='submit'>");
            searchBtn.text("Search");
            $("#title").append(newInput, searchBtn);
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
                    clearInterval(slideshow);
                    $.ajax({
                        url: queryURL,
                        method: "GET"
                    }).done(function(data) {
                            console.log(data.artObjects);
                            $("#artQuery").val("");
                            var index = 1;
                            var returnedImages = $("<img class='artDisplay'>").attr("src", data.artObjects[0].webImage.url);
                            $(".imageDisplay").html(returnedImages);
                                slideshow = setInterval(function() {
                                returnedImages = $("<img class='artDisplay'>").attr("src", data.artObjects[index].webImage.url);
                                $(".imageDisplay").html(returnedImages);
                                index += 1;
                                if(index === data.artObjects.length) {
                                    index = 0;
                                }
                            }, 5000);
                        });
                    }
                });
        }
    });
});

window.addEventListener("resize", init);

init();