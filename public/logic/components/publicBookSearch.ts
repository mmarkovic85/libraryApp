/// <reference path="../other/Nineveh.ts"/>

$(".bookSearch form").on("submit", (event: Event): void => {
  Nineveh.pause();

  $
    .ajax({
      type: "POST",
      url: "/booksearch",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(Nineveh.searchInput("book"))
    })
    .done((res: string) => {

      Nineveh.displayResults("book", res, true);
      Nineveh.play();
    });
});