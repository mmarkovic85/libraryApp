/// <reference path="../other/Dirkem.ts"/>

// Book settings menu buttons

// Book settings menu
Dirkem.configBtn("book", "Create", "msg")
Dirkem.configBtn("book", "Search", "msg")

// Book create

$(".bookCreate form").on("submit", (event: Event): void => {
  Dirkem.pause();

  $
    .ajax({
      type: "POST",
      url: "/dashboard/bookcreate",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(Dirkem.createInput("book"))
    })
    .done((res: string): void => {
      Dirkem.displayMsgs(res);
      Dirkem.play(<HTMLFormElement>event.target);
    });
});

// Book search

$(".bookSearch form").on("submit", (event: Event): void => {
  Dirkem.pause(true);

  $
    .ajax({
      type: "POST",
      url: "/booksearch",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(Dirkem.searchInput("book"))
    })
    .done((res: string): void => {
      Dirkem.displayResults("book", res);
      Dirkem.play(<HTMLFormElement>event.target);
    });
});

// Book update/delete

$(".bookUpdate form").on("submit", (event: Event): void => {
  Dirkem.pause();

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
          Dirkem.deleteInput("book") :
          Dirkem.updateInput("book")
      )
    })
    .done((res: string): void => {
      Dirkem.displaySearch("book");
      Dirkem.displayMsgs(res);
      Dirkem.play(<HTMLFormElement>event.target);
    });
});