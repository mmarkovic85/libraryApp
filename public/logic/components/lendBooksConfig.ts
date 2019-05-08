/// <reference path="../other/Types.ts"/>
/// <reference path="../other/Nineveh.ts"/>

// Back button listener, lendBooksUpdate component

$(".lbBackBtn").click((event: JQuery.Event): void => {
  event.preventDefault();
  $(".lendBooksUpdate").hide();
  $(".lendBooksSearch").show();
  $(".memberBooks > ul").html("");
});

// Member setup

$(".lendBooksSearch form").on("submit", (event: Event): void => {
  Nineveh.pause(true);
  
  $
    .ajax({
      type: "POST",
      url: "/dashboard/membershipsearch",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(Nineveh.lendBooksInput("member"))
    })
    .done((members: string) => {
      
      members === "[]" &&
      Nineveh.displayErrorMsg("No match found!");

      Nineveh.displayResults("lendBooksMembers", members);

      Nineveh.play(<HTMLFormElement>event.target);
    });
});

// Book search

$(".lendBooksForm form").on("submit", (event: JQuery.Event): void => {
  Nineveh.pause(true);

  $
    .ajax({
      type: "POST",
      url: "/booksearch",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(Nineveh.lendBooksInput("book"))
    })
    .done((books: string): void => {

      books === "[]" &&
      Nineveh.displayErrorMsg("No match found!");

      Nineveh.displayResults("lendBooks", books);

      Nineveh.play();
    });
});

// Update member

$(".lendBooksMemberUpdate form").on("submit", (event: JQuery.Event): void => {
  Nineveh.pause();

  $
    .ajax({
      type: "PUT",
      url: "/dashboard/updatememberbooks",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(Nineveh.lendBooksInput("update"))
    })
    .done((res: string): void => {

      $(".lendBooksUpdate").hide();
      $(".lendBooksSearch").show();
      Nineveh.displayMsgs(res);
      Nineveh.play();
    });
});