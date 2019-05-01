/// <reference path="../other/Types.ts"/>

// Membership settings menu buttons
Dirkem.configBtn("membership", "Create", "msg");
Dirkem.configBtn("membership", "Search", "msg");

// Membership create

$(".membershipCreate form").on("submit", (event: Event): void => {
  Dirkem.pause();

  $
    .ajax({
      type: "POST",
      url: "/dashboard/membershipcreate",
      data: Dirkem.createInput("membership")
    })
    .done((res: string): void => {
      Dirkem.displayMsgs(res);
      Dirkem.play(<HTMLFormElement>event.target);
    });
});

// Membership search

$(".membershipSearch form").on("submit", (event: Event): void => {
  Dirkem.pause(true);

  $
    .ajax({
      type: "POST",
      url: "/dashboard/membershipsearch",
      data: Dirkem.searchInput("membership")
    })
    .done((res: string): void => {
      Dirkem.displayResults("membership", res);
      Dirkem.play(<HTMLFormElement>event.target);
    });
});

// Member update/delete

$(".membershipUpdate form").on("submit", (event: Event): void => {
  Dirkem.pause();

  const isForDelete: boolean = $("#upMemDelete").prop("checked");

  $
    .ajax({
      type: isForDelete ? "DELETE" : "PUT",
      url: isForDelete ?
        "/dashboard/membershipdelete" :
        "/dashboard/membershipupdate",
      data: isForDelete ?
        Dirkem.deleteInput("membership") :
        Dirkem.updateInput("membership")
    })
    .done((res: string): void => {
      Dirkem.displaySearch("employee");
      Dirkem.displayMsgs(res);
      Dirkem.play(<HTMLFormElement>event.target);
    });
});