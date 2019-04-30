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
      data: Dirkem.createInput("book")
    })
    .done((res: string): void => {
      Dirkem.displayMsgs(res);
      Dirkem.play(<HTMLFormElement>event.target);
    });
});

// Book search

$(".bookSearch form").on("submit", (event: JQuery.Event): void => {
  Dirkem.pause(true);

  $
    .ajax({
      type: "POST",
      url: "/booksearch",
      data: Dirkem.searchInput("book")
    })
    .done((res: string): void => {
      Dirkem.displayResults("book", res);
      Dirkem.play();
    });
});

// Book update/delete

$(".bookUpdate form").on("submit", (event: Event): void => {
  event.preventDefault();
  $(".loading").css("display", "flex");

  const book: Types.Book = $("#upBkDelete").prop("checked") ?
    {
      _id: $("#upBk_id").val().toString(),
      isAvailable: $("#upBkisAvailable").val() === "available" ? true : false
    } :
    {
      _id: $("#upBk_id").val().toString(),
      author: $("#upBkAuthor").val().toString(),
      title: $("#upBkTitle").val().toString(),
      year: $("#upBkYear").val().toString(),
      language: $("#upBkLanguage").val().toString()
    };

  $
    .ajax({
      type: $("#upBkDelete").prop("checked") ? "DELETE" : "PUT",
      url: $("#upBkDelete").prop("checked") ?
        "/dashboard/bookdelete" :
        "/dashboard/bookupdate",
      data: book
    })
    .done((res: string): void => {
      $(".bookComponent").hide();

      const msgs: Types.flashMsg[] = JSON.parse(res);

      $(".msgDash").text("").show();
      msgs.forEach((msg: Types.flashMsg): void => {
        $("<p></p>")
          .text(msg.message)
          .attr("class", msg.type)
          .appendTo($(".msgDash"));
      });

      const form: HTMLFormElement = <HTMLFormElement>event.target;
      form.reset();

      $(".bookSearch").show();
      $(".loading").hide();
    });
});