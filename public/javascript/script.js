window.addEventListener("resize", init);

function init() {
    var height = window.innerHeight;
    $(".wrapper").css("height", height);
}

$(".submit").on("click", function(event) {
    event.preventDefault();
    var username = $("#username").val();
    var newPost = {
        name: username
    }
    $.post("/", newPost, function(data) {
        $("#login").html("<h2>" + data.name + "</h2>");
        $("#username").val("");
        if($("#login").html()) {
            $(".button-size").css("opacity", 0)
            $(".button-size").css("left", 5000)
        }
    });
});
init();