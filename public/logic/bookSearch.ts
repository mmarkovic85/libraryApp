/// <reference path="./customTypes.ts"/>

$(".bookSearch form").on("submit", (event: JQuery.Event): void => {
  event.preventDefault();

  const bookQuery: object = {
    author: $('#idAuthor').val(),
    title: $('#idTitle').val(),
    year: $('#idYear').val(),
    language: $('#idLanguage').val()
  };

  $
    .ajax({
      type: "POST",
      url: "/books",
      data: bookQuery
    })
    .done((serverRes: string) => {
      $(".bookSearchResult").show();
      $(".booksContainer").html("");
      JSON.parse(serverRes).forEach((document: customTypes.Book): void => {
        $(".booksContainer").append(
          $(`<tr></tr>`).html(`
          <td>${document.author}</td>
          <td>${document.title}</td>
          <td>${document.year}</td>
          <td>${document.language}</td>
          <td>${document.available ? "yes" : "no"}</td>
          `))
      });
    });

});