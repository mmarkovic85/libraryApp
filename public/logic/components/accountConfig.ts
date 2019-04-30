/// <reference path="../other/Dirkem.ts"/>

$(".accountConfig form").on("submit", (event: Event): void => {
  Dirkem.stop();

  $
    .ajax({
      type: "PUT",
      url: "/dashboard/changepassword",
      data: Dirkem.passwordInput()
    })
    .done((res: string) => {
      Dirkem.displayMsgs(res);
      Dirkem.play(<HTMLFormElement>event.target);
    });
});