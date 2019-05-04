/// <reference path="../other/Nineveh.ts"/>

$(".activityLog > button").click((): void => {
  Nineveh.pause();

  $
    .ajax({
      type: "POST",
      url: "/dashboard/activitylog",
      dataType: "text"
    })
    .done((res: string): void => {

      Nineveh.displayLog(res);
      Nineveh.play();
    });
});