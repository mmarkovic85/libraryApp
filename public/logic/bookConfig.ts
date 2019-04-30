/// <reference path="./customTypes.ts"/>

// Book settings menu buttons

$(".bookCreateBtn").click((): void => {
  $(".msgDash").hide();
  $(".bookComponent").hide();
  $(".bookCreate").show();
});

$(".bookSearchBtn").click((): void => {
  $(".msgDash").hide();
  $(".bookComponent").hide();
  $(".bookSearch").show();
});

// Book create

$(".bookCreate form").on("submit", (event: Event): void => {
  event.preventDefault();
  $(".loading").css("display", "flex");

  const book: customTypes.Book = {
    author: $("#crBkAuthor").val().toString(),
    title: $("#crBkTitle").val().toString(),
    year: $("#crBkYear").val().toString(),
    language: $("#crBkLanguage").val().toString()
  }

  $
    .ajax({
      type: "POST",
      url: "/dashboard/bookcreate",
      data: book
    })
    .done((res: string): void => {
      const msgs: customTypes.flashMsg[] = JSON.parse(res);

      $(".msgDash").text("").show();
      msgs.forEach((msg: customTypes.flashMsg): void => {
        $("<p></p>")
          .text(msg.message)
          .attr("class", msg.type)
          .appendTo($(".msgDash"));
      });

      const form: HTMLFormElement = <HTMLFormElement>event.target;
      form.reset();

      $(".loading").hide();
    });
});

// Book search

$(".bookSearch form").on("submit", (event: JQuery.Event): void => {
  event.preventDefault();
  $(".msgDash").hide();
  $(".loading").css("display", "flex");

  const book: customTypes.Book = {
    author: $("#srBkAuthor").val().toString(),
    title: $("#srBkTitle").val().toString(),
    year: $("#srBkYear").val().toString(),
    language: $("#srBkLanguage").val().toString()
  };

  $
    .ajax({
      type: "POST",
      url: "/booksearch",
      data: book
    })
    .done((res: string): void => {
      $(".srBkResults")
        .html(`  
        <span>Click on book you wish to edit</span>
        <ul>
        </ul>
        `)
        .show();

      JSON.parse(res)
        .sort((a: customTypes.Book, b: customTypes.Book): number => {
          return a.author < b.author ? -1 : a.author > b.author ? 1 : 0;
        })
        .forEach((e: customTypes.Book): void => {
          // Book HTML
          $(".srBkResults > ul").append(
            $(`<li id="${e._id}"></li>`).text(`
            ${e.author}, 
            ${e.title}, 
            ${e.year}, 
            ${e.language}, 
            ${e.isAvailable ? "available" : "borrowed"}, 
            ${e._id}
            `)
          );
          // Book edit listener
          $(`#${e._id}`).click((): void => {
            $(".msgDash").hide();
            $(".bookComponent").hide();
            $("#upBk_id").val(e._id);
            $("#upBkAuthor").val(e.author);
            $("#upBkTitle").val(e.title);
            $("#upBkYear").val(e.year);
            $("#upBkLanguage").val(e.language);
            $("#upBkisAvailable").val(e.isAvailable ? "available" : "borrowed");
            $(".bookUpdate").show();
          });
        });

      $(".loading").hide();
    });
});

// Book update/delete

$(".bookUpdate form").on("submit", (event: Event): void => {
  event.preventDefault();
  $(".loading").css("display", "flex");

  const book: customTypes.Book = $("#upBkDelete").prop("checked") ?
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

      const msgs: customTypes.flashMsg[] = JSON.parse(res);

      $(".msgDash").text("").show();
      msgs.forEach((msg: customTypes.flashMsg): void => {
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