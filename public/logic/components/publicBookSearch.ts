/// <reference path="../other/Types.ts"/>

$(".bookSearch form").on("submit", (event: JQuery.Event): void => {
  Dirkem.pause();

  $
    .ajax({
      type: "POST",
      url: "/booksearch",
      data: Dirkem.searchInput("book")
    })
    .done((res: string) => {
      Dirkem.displayPublicResults(res);
      Dirkem.play();
    });
});