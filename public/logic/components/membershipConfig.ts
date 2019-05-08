/// <reference path="../other/Nineveh.ts"/>

// Membership settings menu buttons

Nineveh.configBtn("membership", "Create", "msg");
Nineveh.configBtn("membership", "Search", "msg");

// Membership create

$(".membershipCreate form").on("submit", (event: Event): void => {
  Nineveh.pause();

  $
    .ajax({
      type: "POST",
      url: "/dashboard/membershipcreate",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(Nineveh.createInput("membership"))
    })
    .done((res: string): void => {

      Nineveh.displayMsgs(res);
      Nineveh.play(<HTMLFormElement>event.target);
    });
});

// Membership search

$(".membershipSearch form").on("submit", (event: Event): void => {
  Nineveh.pause(true);

  $
    .ajax({
      type: "POST",
      url: "/dashboard/membershipsearch",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(Nineveh.searchInput("membership"))
    })
    .done((res: string): void => {
      
      res === "[]" &&
      Nineveh.displayErrorMsg("No match found!");

      Nineveh.displayResults("membership", res);
      
      Nineveh.play(<HTMLFormElement>event.target);
    });
});

// Member update/delete

$(".membershipUpdate form").on("submit", (event: Event): void => {
  Nineveh.pause();

  const isForDelete: boolean = $("#upMemDelete").prop("checked");

  $
    .ajax({
      type: isForDelete ? "DELETE" : "PUT",
      url: isForDelete ?
        "/dashboard/membershipdelete" :
        "/dashboard/membershipupdate",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(
        isForDelete ?
          Nineveh.deleteInput("membership") :
          Nineveh.updateInput("membership")
      )
    })
    .done((res: string): void => {

      Nineveh.displaySearch("membership");
      Nineveh.displayMsgs(res);
      Nineveh.play(<HTMLFormElement>event.target);
    });
});