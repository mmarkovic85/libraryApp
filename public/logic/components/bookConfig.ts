/// <reference path="../other/Nineveh.ts"/>

// Book settings menu buttons

// Book settings menu
Nineveh.configBtn("book", "Create", "msg")
Nineveh.configBtn("book", "Search", "msg")

// Book create

$(".bookCreate form").on("submit", (event: Event): void => {
  Nineveh.pause();

  $
    .ajax({
      type: "POST",
      url: "/dashboard/bookcreate",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(Nineveh.createInput("book"))
    })
    .done((res: string): void => {

      Nineveh.displayMsgs(res);
      Nineveh.play(<HTMLFormElement>event.target);
    });
});

// Book search

$(".bookSearch form").on("submit", (event: Event): void => {
  Nineveh.pause(true);

  $
    .ajax({
      type: "POST",
      url: "/booksearch",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(Nineveh.searchInput("book"))
    })
    .done((res: string): void => {

      res === "[]" &&
        Nineveh.displayErrorMsg("No match found!");

      Nineveh.displayResults("book", res);

      Nineveh.play(<HTMLFormElement>event.target);
    });
});

// Book update/delete

$(".bookUpdate form").on("submit", (event: Event): void => {
  Nineveh.pause();

  const isForDelete: boolean = $("#upBkDelete").prop("checked");

  $
    .ajax({
      type: isForDelete ? "DELETE" : "PUT",
      url: isForDelete ?
        "/dashboard/bookdelete" :
        "/dashboard/bookupdate",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(
        isForDelete ?
          Nineveh.deleteInput("book") :
          Nineveh.updateInput("book")
      )
    })
    .done((res: string): void => {

      Nineveh.displaySearch("book");
      Nineveh.displayMsgs(res);
      Nineveh.play(<HTMLFormElement>event.target);
    });
});