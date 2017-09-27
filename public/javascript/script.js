var login = false,
logState = false,
search = false,
searchActive = false,
searched = false;

function init() {
    $(".wrapper").css("height", window.innerHeight);
    if(window.innerWidth < 1200) {
        $(".wrapper").css("width", "100vw");
    } else {
        $(".wrapper").css("width", "1200px");
    }
    $("#imageDisplay").css("height", window.innerHeight + "px");
    loginDisplay();
}

function loginDisplay() {
    if(!searched) {
        if(window.innerHeight > 600) {
            $(".inputWrap").css("top", window.innerHeight / 2 - 200);
        }
    }
    if(window.innerWidth > 500) {
        $(".inputWrap").css("left", window.innerWidth / 2 - 250);
    }
}
var slideshow,
textHide,
textShow;

function renderData(data) {
    $("#imageDisplay").empty();
    clearInterval(slideshow);
    var index = 0,
    last = index,
    lastTitle = data.artObjects[index].title;
    returnedName = $("<h1 class='artistName'>").text(data.artObjects[index].principalOrFirstMaker);
    returnedTitle = $("<h1 class='artTitle'>").text(data.artObjects[index].title);
    returnedImages = $("<img id='artDisplay' class='img-responsive col-xs-12' style='height: 100%; max-width: 100%;'></img>").attr("src", data.artObjects[index].webImage.url);
    $("#imageDisplay").html(returnedImages).append(returnedName).append(returnedTitle);
    responsiveVoice.speak(data.artObjects[index].title);
    responsiveVoice.speak(data.artObjects[index].principalOrFirstMaker);
    textHide = setTimeout(function() {
        $(".artistName").fadeOut();
        $(".artTitle").fadeOut();
    }, 3000);
    slideshow = setInterval(function() {
        index += 1;
        if(index === data.artObjects.length) {
            index = 0;
        }
        do
            index += 1;
        while (data.artObjects[index].title == lastTitle);
        lastTitle = data.artObjects[index].title;
        returnedName = $("<h1 class='artistName'>").text(data.artObjects[index].principalOrFirstMaker);
        returnedTitle = $("<h1 class='artTitle'>").text(data.artObjects[index].title);
        returnedImages = $("<img id='artDisplay' class='img-responsive col-xs-12' style='height: 100%; max-width: 100%;'></img>").attr("src", data.artObjects[index].webImage.url);
        $("#imageDisplay").html(returnedImages).append(returnedName).append(returnedTitle);
        textHide = setTimeout(function() {
            $(".artistName").fadeOut();
            $(".artTitle").fadeOut();
        }, 3000);
        responsiveVoice.speak(data.artObjects[index].title);
        if(last != data.artObjects[index].principalOrFirstMaker) {
            last = data.artObjects[index].principalOrFirstMaker;
            responsiveVoice.speak(data.artObjects[index].principalOrFirstMaker);
        }
    }, 8000);
}

function defaultSearch() {
    var queryURL = "https://www.rijksmuseum.nl/api/en/collection/?key=nRpUKIg0&format=json&ps=100&imgonly=True&q=Van%20Gogh";
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
    var password = $("#password").val();
    login = username;
    var newPost = {
        name: username,
        pwd: password
    };
    $.post("/", newPost, function(data) {
        $("#login").html("<div id='logName'>" + data.name + "&nbsp;&nbsp;</div><img id='avatar' src='/images/avatar.jpg'><img id='mag' src='/images/magIcon.png'><div id='logOut'>Log Out&nbsp;</div>");     
        avatarClick();
        $("#username").val("");

        if(login) {
            $(".inputWrap").empty();
            
            var newInput = $("<input id='artQuery' type='text'  placeholder='Search'>");
            var searchBtn = $("<button id='artSearch' class='search' type='submit'>Submit</button>");
            $(".inputWrap").append(newInput, searchBtn);  
            addClick();          
        }
    });
});
function addClick() {
    $("#mag").on("click", function(event) {
        if(search && searchActive) {
            search = false;
            searchDisplay();
        } else if(searchActive) {
            search = true;
            searchHide();
        }
    });
    $("input").keypress(function (e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
            $('#artSearch').click();
            return false;
        } else {
            return true;
        }
    });
    $("#artSearch").on("click", function(event) {
        event.preventDefault();
        var query = $("#artQuery").val().trim();
        var patt = new RegExp("^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$");
        if (query === "" || patt.test(query) !== true) {
            $("#artQuery").val("");
            return false;
        } else {
            var newPost = {query: query};
            $("#artQuery").val("");
            $.get("/api/" + query, function(data) {
                // renderData($.parseJSON(data));
                if(searchActive) {
                    searchHide();
                } else {
                    searched = true;
                }
                if(data.artObjects.length) {
                    search = true;
                    searchActive = true;
                    renderData(data);
                } else {
                    $.get("/api/default", function(data) {
                        search = true;
                        searchActive = true;
                        renderData(data);
                    });
                }
                $(".inputWrap").css("top", "-400px");
                $("#artSearch").css("top", "235px");
                $("#artQuery").css("top", "235px");
            });
        }
    });
}
function avatarClick() {
    $("#avatar").on("click", function(event) {
        logState = true;
        if(logState) {
            var logoutDrop = setInterval(function() {
                var logHeight = parseInt($("#logOut").css("height"));
                if(logHeight < 45) {
                    logHeight += 1;
                    $("#logOut").css("font-size", logHeight / 2 + "px");
                    $("#logOut").css("height", logHeight + "px");
                }
                if(!logState) {
                    clearInterval(logoutDrop);
                }
            }, 10);
        }
    });
    $("#logOut").on("click", function(event) {
        location.reload();
    });
}
function hideLogOut() {
    if(!logState) {
        var logoutHide = setInterval(function() {
            var logHeight = parseInt($("#logOut").css("height"));
            if(logHeight > 0) {
                logHeight -= 1;
                $("#logOut").css("font-size", logHeight / 2 + "px");
                $("#logOut").css("height", logHeight + "px");
            }
            if(logState) {
                clearInterval(logoutHide);
            }
        }, 10);
    }
}
function searchDisplay() {
    var barHeight = parseInt($("#artSearch").css("top"));
    var searchDisplay = setInterval(function() {
        barHeight += 5;
        $("#artSearch").css("top", barHeight + "px");
        $("#artQuery").css("top", barHeight + "px");
        if(barHeight >= 435) {
            clearInterval(searchDisplay);
        }
    }, 10);
}
function searchHide() {
    var barHeight = parseInt($("#artSearch").css("top"));
    var searchDisplay = setInterval(function() {
        barHeight -= 5;
        $("#artSearch").css("top", barHeight + "px");
        $("#artQuery").css("top", barHeight + "px");
        if(barHeight <= 235) {
            clearInterval(searchDisplay);
        }
    }, 10);
}

window.addEventListener("resize", init);
window.addEventListener("mousemove", function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
    if(mouse.y > 150) {
        logState = false;
        hideLogOut();
    }
    var screenWidth = window.innerWidth * 0.6;
    if(mouse.x < screenWidth) {
        logState = false;
        hideLogOut();
    }
});

init();