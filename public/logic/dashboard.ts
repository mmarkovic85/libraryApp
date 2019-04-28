/// <reference path="./customTypes.ts"/>

// Account settings listener
$(".accountConfigBtn").click((): void => {
  $(".appDash").hide();
  $(".accountConfig").show();
});

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

// Book Create

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
      const msg: customTypes.flashMsg[] = JSON.parse(res);

      $(".msgDash").text("").show();
      msg.forEach((msg: customTypes.flashMsg) => {
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