$(".activityLog > button").click((): void => {
  Dirkem.pause();
  $
    .ajax({
      type: "POST",
      url: "/dashboard/activitylog",
      dataType: "text"
    })
    .done((res: string): void => {
      $(".activityLog > section").html("").show();
      res.split("\n").reverse().forEach((logEntry): void => {
        logEntry && $("<p></p>").text("*" + logEntry).appendTo($(".activityLog > section"));
      });
      Dirkem.play();
    });
});