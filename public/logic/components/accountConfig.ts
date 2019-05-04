/// <reference path="../other/Nineveh.ts"/>

Nineveh.bgAnimationToggle();

$(".accountConfig form").on("submit", (event: Event): void => {
  Nineveh.pause();

  $
    .ajax({
      type: "PUT",
      url: "/dashboard/changepassword",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(Nineveh.passwordInput())
    })
    .done((res: string) => {

      Nineveh.displayMsgs(res);
      Nineveh.play(<HTMLFormElement>event.target);
    });
});