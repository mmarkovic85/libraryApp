/// <reference path="../other/Types.ts"/>

$(".bookSearch form").on("submit", (event: JQuery.Event): void => {
  Dirkem.pause();

  $
    .ajax({
      type: "POST",
      url: "/booksearch",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(Dirkem.searchInput("book"))
    })
    .done((res: string) => {
      Dirkem.displayPublicResults(res);
      Dirkem.play();
    });
});