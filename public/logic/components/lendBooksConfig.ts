/// <reference path="../other/Types.ts"/>

// Member setup

$(".lendBooksSearch form").on("submit", (event: JQuery.Event): void => {
  event.preventDefault();
  $(".msgDash").hide();
  $(".loading").css("display", "flex");

  const membership: Types.Membership = {
    name: $("#srMemName").val().toString(),
    surname: $("#srMemSurname").val().toString()
  };

  $
    .ajax({
      type: "POST",
      url: "/dashboard/membershipsearch",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(membership)
    })
    .done((res: string) => {
      $(".srLbMemResults")
        .html(`  
        <span>Click on member</span>
        <ul>
        </ul>
        `)
        .show();

      JSON.parse(res)
        .sort((a: Types.Membership, b: Types.Membership): number => {
          return a.surname < b.surname ? -1 : a.surname > b.surname ? 1 : 0;
        })
        .forEach((empl: Types.Membership) => {
          // membership HTML
          $(".srLbMemResults > ul").append(
            $(`<li id="lbm${empl._id}"></li>`).text(`
            ${empl._id}, 
            ${empl.surname}, 
            ${empl.name}
            `)
          );
          // membership edit listener
          $(`#lbm${empl._id}`).click(() => {
            $(".msgDash").hide();
            $(".lendBooksComponent").hide();

            $("#upLb_id").val(empl._id);
            $("#upLbSurname").val(empl.surname);
            $("#upLbName").val(empl.name);

            Dirkem.books = new Set(empl.books);
            Dirkem.returned = new Set();

            loadBooks(empl.books);
            $(".lendBooksUpdate").show();
          });
        });

      $(".loading").hide();
    });
});

// Book search

$(".lendBooksForm form").on("submit", (event: JQuery.Event): void => {
  event.preventDefault();
  $(".msgDash").hide();
  $(".loading").css("display", "flex");

  const book: Types.Book = {
    author: $("#srLbAuthor").val().toString(),
    title: $("#srLbTitle").val().toString(),
    year: $("#srLbYear").val().toString(),
    language: $("#srLbLanguage").val().toString()
  };

  $
    .ajax({
      type: "POST",
      url: "/booksearch",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(book)
    })
    .done((res: string): void => {
      $(".srLbResults")
        .html(`  
          <span>Click on book</span>
          <ul>
          </ul>
        `)
        .show();

      JSON
        .parse(res)
        .sort((a: Types.Book, b: Types.Book): number => {
          return a.author < b.author ? -1 : a.author > b.author ? 1 : 0;
        })
        .forEach((bk: Types.Book): void => {
          $(".srLbResults > ul").append(
            $(`<li id="lb${bk._id}"></li>`)
              .text(`
                ${bk.author}, 
                ${bk.title}, 
                ${bk.year}, 
                ${bk.language}, 
                ${bk.isAvailable ? "available" : "borrowed"}, 
                ${bk._id}
              `)
              .click((): void => {
                $(".msgDash").text("").hide();
                if (Dirkem.books.size < 3 && bk.isAvailable) {
                  Dirkem.books.add(bk._id);
                  Dirkem.returned.delete(bk._id);

                  $(".memberBooks").html("");
                  loadBooks(Array.from(Dirkem.books));
                  $(`#lb${bk._id}`).remove();
                  $(".srLbResults > ul").html("");
                } else if (!bk.isAvailable) {
                  $(".srLbResults > ul").html("");
                  Dirkem.displayMsgs(JSON.stringify([{
                    type: "error",
                    message: "book is alredy lended!"
                  }]));
                } else {
                  $(".srLbResults > ul").html("");
                  Dirkem.displayMsgs(JSON.stringify([{
                    type: "error",
                    message: "cannot lend more than 3 books"
                  }]));
                }
              })
          );
        });

      $(".loading").hide();
    });
});

// Update member

$(".lendBooksMemberUpdate form").on("submit", (event: JQuery.Event): void => {
  event.preventDefault();
  $(".loading").css("display", "flex");

  const member: Types.Membership = {
    _id: $("#upLb_id").val().toString(),
    books: Array.from(Dirkem.books),
    returned: Array.from(Dirkem.returned)
  }

  $
    .ajax({
      type: "PUT",
      url: "/dashboard/updatememberbooks",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(member)
    })
    .done((res: string): void => {
      $(".lendBooksUpdate").hide();
      $(".lendBooksSearch").show();
      Dirkem.displayMsgs(res);
      $(".loading").hide();
    });
});

function loadBooks(books: string[]): void {
  $(".msgDash").hide();
  $(".loading").css("display", "flex");
  $(".memberBooks").html("");
  $
    .ajax({
      type: "POST",
      url: "/dashboard/findmemberbooks",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(books)
    })
    .done((res: string): void => {
      JSON.parse(res).forEach((bk: Types.Book): void => {
        $(".memberBooks").append(
          $(`<p id="memBk${bk._id}"></p>`)
            .text(`
                ${bk.author}, 
                ${bk.title}, 
                ${bk.year}, 
                ${bk.language}, 
                ${bk._id}
              `)
            .click((): void => {
              Dirkem.books.delete(bk._id);
              Dirkem.returned.add(bk._id);
              $(`#memBk${bk._id}`).remove();
            })
        );
      });

      $(".loading").hide();
    });
}

$(".lbBackBtn").click((event: JQuery.Event): void => {
  event.preventDefault();
  $(".lendBooksUpdate").hide();
  $(".lendBooksSearch").show();
  $(".memberBooks").html("");
});