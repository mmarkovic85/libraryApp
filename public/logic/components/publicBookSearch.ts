/// <reference path="../other/Types.ts"/>

$(".bookSearch form").on("submit", (event: JQuery.Event): void => {
  $(".loading").css("display", "flex");
  event.preventDefault();

  const book: Types.Book = {
    author: $('#srBkAuthor').val().toString(),
    title: $('#srBkTitle').val().toString(),
    year: $('#srBkYear').val().toString(),
    language: $('#srBkLanguage').val().toString()
  };

  $
    .ajax({
      type: "POST",
      url: "/booksearch",
      data: book
    })
    .done((serverRes: string) => {
      const books: Types.Book[] = JSON.parse(serverRes);
      $(".numOfBooks").text(books.length);
      $(".booksContainer").html("");
      books.forEach((document: Types.Book): void => {
        $(".booksContainer").append(
          $(`<tr></tr>`).html(`
          <td>${document.author}</td>
          <td>${document.title}</td>
          <td>${document.year}</td>
          <td>${document.language}</td>
          <td>${document.isAvailable ? "yes" : "no"}</td>
          `))
      });
      $(".bookSearchResult").show();
      $(".loading").hide();
    });
});