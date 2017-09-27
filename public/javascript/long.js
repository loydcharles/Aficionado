$("#title").mouseover(function(){
    showDescription();
  });
  
  function showDescription() {    
    descriptionState = true;
    if(descriptionState) {
      var description = $("<div id='description'>Aficionado is an application that allows users to search and display over 200,000 art masterpieces from the Dutch national museum. Aficionado was developed by Clay Crawley, Daniel Ascher, Long Nguyen, and Lloyd Charles using the Rijksmuseum API.  All art is from the Rijksmuseum Collection. </div>");
      $("#title").append(description);  
        var descriptionDrop = setInterval(function() {
          var descriptionHeight = parseInt($("#description").css("height"));
          if(descriptionHeight < 150) {
            descriptionHeight += 2;
            // $("#description").css("font-size", descriptionHeight / 7 + "px");
            $("#description").css("height", descriptionHeight + "px");
          }
          if(!descriptionState) {
            clearInterval(descriptionDrop);
          }
        }, 10);
    } 
  }
  
  function hideDescription() {
    if(!descriptionState) {
      var descriptionHide = setInterval(function() {
        var descriptionHeight = parseInt($("#description").css("height"));
        if(descriptionHeight > 0) {
          descriptionHeight -= 2;
        //   $("#description").css("font-size", descriptionHeight / 7 + "px");
          $("#description").css("height", descriptionHeight + "px");
        }
        if(descriptionState) {
          clearInterval(descriptionHide);
        }
      }, 10);
    }
  }
  
  window.addEventListener("resize", init);
  window.addEventListener("mousemove", function(event) {
    mouse.y = event.y;
    if(mouse.y > 150) {
      descriptionState = false;
      hideDescription();
    }
  });
  
  init();
  