/*
  Marres
  Copyright (C) 2009 by Systemantics, Bureau for Informatics

  Lutz Issler
  Mauerstr. 10-12
  52064 Aachen
  GERMANY

  Web:    www.systemantics.net
  Email:  mail@systemantics.net

  Permission granted to use the files associated with this
  website only on your webserver.
*/



var zIndex = 1;



function enlargeImage(el) {
  // Enlarge
  var jOldImg = $(el).css("position", "absolute");
  var jContainer = jOldImg.parent(".exhibitionFileContainer");
  if (jContainer.length==0) {
    jContainer = jOldImg.wrap("<div></div>").parent()
      .addClass("exhibitionFileContainer")
      .height(jOldImg.height()+3);
  }
  var img = new Image();
  var oldWidth = jOldImg.width();
  img.onload = function() {
    var jImg = $(img)
      .addClass("on")
      .css("position", "absolute")
      .css("left", jContainer.offset().left-$("#content").offset().left)
      .click(function() {
        // Reduce
        $("img.on", jContainer).animate({
          width: oldWidth,
          marginLeft: 0
        }, 1000, function() {
          $(this).remove();
          jOldImg.css("position", "")
        });
      });
    var newWidth = img.width;
    img.width = jOldImg.width();
    jContainer.prepend(jImg);
    $("img.on", jContainer).css("zIndex", zIndex++);
    var options = {
      width: newWidth
    };
    if (jContainer.offset().left-$("#content").offset().left>0) {
      options.marginLeft = oldWidth-newWidth;
    }
    $("img.on", jContainer).animate(options, 1000);
  };
  img.src = jOldImg.get(0).src.replace("/p_", "/");
}

$(window).resize(function() {
  var footerHeight = $("#container").height()*.1;
  var contentHeight = $("#container").height()-footerHeight-$("#content").offset().top-8-21;
  if (contentHeight>600) {
    contentHeight = 600;
    footerHeight = $("#container").height()-contentHeight-$("#content").offset().top-8-21;
  }
  $("#footer").height(footerHeight);
  $("#content").height(contentHeight);
  
});

$(function() {
  $("#footer").css("height", "");
  $(window).resize();
  if (location.search) {
    jumpTo(location.search.substr(1));
  }
  $("#content > .column:first").addClass("first");
  $(".frameImage a").hover(
    function() {
      var img = $("img.off", this).get(0);
      img.src = img.src.replace("/sg_", "/s_");
    },
    function() {
      var img = $("img.off", this).get(0);
      img.src = img.src.replace("/s_", "/sg_");
    }
  );
  $(".frameImage a").click(function() {
    // Enlarge
    var jContainer = $(this);
    if ($("img", jContainer).length>1) {
      return false;
    }
    var img = new Image();
    var oldWidth = $("img", jContainer).eq(0).width();
    img.onload = function() {
    var jImg = $(img)
      .addClass("on")
      .click(function() {
        // Reduce
        $("img", jContainer).animate({
          width: oldWidth,
          opacity: 1,
          marginLeft: 0,
          marginTop: 0
        }, 1000, function() {
          $(this).filter(".on").remove();
          goTo(jContainer.get(0).href);
        });
        return false;
      });
      var newWidth = img.width;
      var newHeight = img.height;
      if (newHeight>$(window).height()) {
        var ratio = newWidth/newHeight;
        newHeight = $(window).height()-50;
        newWidth = newHeight*ratio;
      }
      jImg.width(oldWidth);
      jContainer.prepend(jImg);
      $("img", jContainer).css("zIndex", 1000+zIndex++);
      var options = {
        width: newWidth,
        opacity: 0
      };
      if (!$(jContainer).parent().hasClass("frameInvitation")) {
        options.marginLeft = oldWidth-newWidth;
      }
      var spaceY = $(window).height()-newHeight-jContainer.offset().top;
      if (spaceY<0) {
        options.marginTop = spaceY-15;
      }
      $("img", jContainer).animate(options, 1000, function() {
        $(this).filter(".off").hide();
      });
    };
    img.src = $("img", jContainer).get(0).src.replace("/s_", "/");
    this.blur();
    return false;
  });
  
  
  
  
  
});
