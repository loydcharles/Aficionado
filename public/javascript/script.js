var login = false,
logState = false;

function init() {
    $(".wrapper").css("height", window.innerHeight);
    if(window.innerWidth < 1200) {
        $(".wrapper").css("width", "100vw");
    } else {
        $(".wrapper").css("width", "1200px");
    }
    var pos = window.innerWidth / 2;
    var off = parseInt($(".wrapper").outerWidth()) / 2;
    $(".wrapper").css("left", (pos - off) + "px");
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
    var index = 1,
    last = data.artObjects[0].principalOrFirstMaker,
    presentationDiv = $("<div>"),
    returnedName = $("<h1 class='artistName'>").text(data.artObjects[0].principalOrFirstMaker),
    returnedTitle = $("<h1 class='artTitle'>").text(data.artObjects[0].title),
    returnedImages = $("<img id='artDisplay'>").attr("src", data.artObjects[0].webImage.url),
    pos,
    off;
    presentationDiv.append(returnedName, returnedTitle, returnedImages);
    $(".imageDisplay").html(presentationDiv);
    // console.log(document.getElementById("artDisplay").clientWidth, document.getElementById("artDisplay").clientHeight);
    if(document.getElementById("artDisplay").clientWidth > document.getElementById("artDisplay").clientHeight) {
        $("#artDisplay").css("width", $(".wrapper").width() + "px");
        $("#artDisplay").css("height", "auto");
        pos = $(".wrapper").height() / 2;
        off = document.getElementById("artDisplay").clientHeight / 2;
        $("#artDisplay").css("left", (pos - off) + "px");
    } else {
        $("#artDisplay").css("height", $(".wrapper").height() + "px");
        $("#artDisplay").css("width", "auto");
        pos = $(".wrapper").width() / 2;
        off = document.getElementById("artDisplay").clientWidth / 2;
        $("#artDisplay").css("bottom", (pos - off) + "px");
    }
    responsiveVoice.speak(data.artObjects[0].principalOrFirstMaker);
    responsiveVoice.speak(data.artObjects[0].title);
    slideshow = setInterval(function() {
        presentationDiv = $("<div>");
        returnedName = $("<h1 class='artistName'>").text(data.artObjects[index].principalOrFirstMaker);
        returnedTitle = $("<h1 class='artTitle'>").text(data.artObjects[index].title);
        returnedImages = $("<img id='artDisplay'>").attr("src", data.artObjects[index].webImage.url);
        presentationDiv.append(returnedName, returnedTitle, returnedImages);
        $(".imageDisplay").html(presentationDiv);  
        if(document.getElementById("artDisplay").clientWidth > document.getElementById("artDisplay").clientHeight) {
            $("#artDisplay").css("width", $(".wrapper").width() + "px");
            $("#artDisplay").css("height", "auto");
            pos = $(".wrapper").height() / 2;
            off = document.getElementById("artDisplay").clientHeight / 2;
            $("#artDisplay").css("left", (pos - off) + "px");
        } else {
            $("#artDisplay").css("height", $(".wrapper").height() + "px");
            $("#artDisplay").css("width", "auto");
            pos = $(".wrapper").width() / 2;
            off = document.getElementById("artDisplay").clientWidth / 2;
            $("#artDisplay").css("bottom", (pos - off) + "px");
        }   
        if(last != data.artObjects[index].principalOrFirstMaker) {
            last = data.artObjects[index].principalOrFirstMaker;
            responsiveVoice.speak(data.artObjects[index].principalOrFirstMaker);
        }
        responsiveVoice.speak(data.artObjects[index].title);
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
    var password = $("#password").val();
    login = username;
    var newPost = {
        name: username,
        pwd: password
    };
    $.post("/", newPost, function(data) {
        $("#login").html("<div id='logName'>" + data.name + "&nbsp;&nbsp;</div><img id='avatar' src='/images/avatar.jpg'><div id='logOut'>Log Out&nbsp;</div>");     
        avatarClick();
        $("#username").val("");

        if(login) {
            $(".inputWrap").remove();
            
            var newInput = $("<input id='artQuery' type='text'  placeholder='Search'>");
            var searchBtn = $("<button id='artSearch' class='search' type='submit'>Submit</button>");
            $("#title").append(newInput, searchBtn);  
            addClick();          
        }
    });
});

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
function addClick() {
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
                if(data.artObjects.length) {
                    renderData(data);
                } else {
                    $.get("/api/default", function(data) {
                        renderData(data);
                    });
                }
                
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