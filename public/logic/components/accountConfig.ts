/// <reference path="../other/Dirkem.ts"/>

$(".accountConfig form").on("submit", (event: Event): void => {
  Dirkem.pause();

  $
    .ajax({
      type: "PUT",
      url: "/dashboard/changepassword",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(Dirkem.passwordInput())
    })
    .done((res: string) => {
      Dirkem.displayMsgs(res);
      Dirkem.play(<HTMLFormElement>event.target);
    });
});