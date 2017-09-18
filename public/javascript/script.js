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
            $(".inputWrap").css("opacity", 0);
            $(".inputWrap").css("left", 5000);
            var query = "vincent%20van%20gogh"
            $.get("https://www.rijksmuseum.nl/api/en/collection/?key=nRpUKIg0&format=json&ps=10&imgonly=True&q=" + query, function(data) {
                console.log(data.artObjects[0].webImage.url);
                var index = 1;
                var test = $("<img class='artDisplay'>").attr("src", data.artObjects[0].webImage.url);
                $(".test").html(test);
                var slideshow = setInterval(function() {
                    test = $("<img class='artDisplay'>").attr("src", data.artObjects[index].webImage.url);
                    $(".test").html(test);
                    index += 1;
                    if(index === data.artObjects.length) {
                        index = 0;
                    }
                }, 5000);
                
            });            
        }
    });
});

window.addEventListener("resize", init);

init();