/// <reference path="../other/Types.ts"/>
/// <reference path="../other/Dirkem.ts"/>

// Back button listener, lendBooksUpdate component

$(".lbBackBtn").click((event: JQuery.Event): void => {
  event.preventDefault();
  $(".lendBooksUpdate").hide();
  $(".lendBooksSearch").show();
  $(".memberBooks > ul").html("");
});

// Member setup

$(".lendBooksSearch form").on("submit", (event: Event): void => {
  Dirkem.pause(true);

  $
    .ajax({
      type: "POST",
      url: "/dashboard/membershipsearch",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(Dirkem.lendBooksInput("member"))
    })
    .done((members: string) => {

      Dirkem.displayResults("lendBooksMembers", members);
      Dirkem.play(<HTMLFormElement>event.target);
    });
});

// Book search

$(".lendBooksForm form").on("submit", (event: JQuery.Event): void => {
  Dirkem.pause(true);

  $
    .ajax({
      type: "POST",
      url: "/booksearch",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(Dirkem.lendBooksInput("book"))
    })
    .done((books: string): void => {

      Dirkem.displayResults("lendBooks", books);
      Dirkem.play();
    });
});

// Update member

$(".lendBooksMemberUpdate form").on("submit", (event: JQuery.Event): void => {
  Dirkem.pause();

  $
    .ajax({
      type: "PUT",
      url: "/dashboard/updatememberbooks",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(Dirkem.lendBooksInput("update"))
    })
    .done((res: string): void => {

      $(".lendBooksUpdate").hide();
      $(".lendBooksSearch").show();
      Dirkem.displayMsgs(res);
      Dirkem.play();
    });
});