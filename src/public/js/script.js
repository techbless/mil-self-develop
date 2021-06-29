$(".chkbox").click(function () {
  if ($(this).hasClass("c")) {
    $(this).removeClass("c");
    $(this).css("background-color", "white");
    $(this).children("input").prop("checked", false);
  } else {
    $(this).addClass("c");
    $(this).css("background-color", "aquamarine");
    $(this).children("input").prop("checked", true);
  }
});
