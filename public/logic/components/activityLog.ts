$(".activityLog > button").click((): void => {
  Dirkem.pause();

  $
    .ajax({
      type: "POST",
      url: "/dashboard/activitylog",
      dataType: "text"
    })
    .done((res: string): void => {

      Dirkem.displayLog(res);
      Dirkem.play();
    });
});