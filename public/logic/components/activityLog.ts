/// <reference path="../other/Nineveh.ts"/>

$(".activityLog > button").click((): void => {
  Nineveh.pause();

  $
    .ajax({
      type: "POST",
      url: "/dashboard/activitylog"
    })
    .done((res: string): void => {

      Nineveh.displayLogs(res);
      Nineveh.play();
    });
});