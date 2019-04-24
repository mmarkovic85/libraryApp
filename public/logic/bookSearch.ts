/// <reference path="./customTypes.ts"/>

$(".bookSearch form").on("submit", (event: JQuery.Event): void => {
  event.preventDefault();

  const bookQuery: customTypes.Book = {
    author: $('#idAuthor').val().toString(),
    title: $('#idTitle').val().toString(),
    year: $('#idYear').val().toString(),
    language: $('#idLanguage').val().toString()
  };

  $
    .ajax({
      type: "POST",
      url: "/books",
      data: bookQuery
    })
    .done((serverRes: string) => {
      const books: customTypes.Book[] = JSON.parse(serverRes);
      $(".numOfBooks").text(books.length);
      $(".booksContainer").html("");
      books.forEach((document: customTypes.Book): void => {
        $(".booksContainer").append(
          $(`<tr></tr>`).html(`
          <td>${document.author}</td>
          <td>${document.title}</td>
          <td>${document.year}</td>
          <td>${document.language}</td>
          <td>${document.available ? "yes" : "no"}</td>
          `))
      });
      $(".bookSearchResult").show();
    });
});