/// <reference path="./Types.ts"/>
/// <reference path="./Background.ts"/>

namespace Nineveh {
  let animation: Background.Animation;
  let borrowedBooks: Set<string>;
  let returnedBooks: Set<string>;

  export function init(): void {
    animation = new Background.Animation;
  }

  export function bgAnimationToggle(): void {
    $(".bgAnimationBtn").click((): void => {
      const isPlaying: boolean = !!animation.numOfCircles();

      $(".bgAnimationBtn").text(
        isPlaying ?
          animation.setupCircles(0) && "Turn on" :
          animation.setupCircles() && "Turn off"
      );
    });
  }

  export function passwordInput(): Types.Employee {
    return {
      newpass1: $("#accNewPassword1").val().toString(),
      newpass2: $("#accNewPassword2").val().toString()
    };
  }

  export function pause(hideMsg: boolean = false): void {
    event.preventDefault();
    $(".loading").css("display", "flex");
    hideMsg && $(".msgDash").hide();
  }

  export function play(form?: HTMLFormElement): void {
    form && form.reset();
    $(".loading").hide();
  }

  export function displayMsgs(res: string): void {
    $(".msgDash").text("").show();

    JSON.parse(res).forEach((msg: Types.flashMsg): void => {
      $("<p></p>")
        .text(msg.message)
        .attr("class", msg.type)
        .appendTo($(".msgDash"));
    });
  }

  export function displayErrorMsg(message: string): void {
    $(".srLbResults").html("");

    $(".msgDash").text("").show();

    $("<p></p>")
      .text(message)
      .attr("class", "error")
      .appendTo($(".msgDash"));
  }

  export function displaySearch(type: string): void {
    $(`.${type}Component`).hide();
    $(`.${type}Search`).show();
  }

  export function displayLogs(logs: string) {
    $(".activityLog > section").html("").show();

    JSON.parse(logs)
      .sort()
      .reverse()
      .forEach((log: Types.logObj): void => {
        const date: Date = (new Date(
          parseInt(log.date)
        ));

        $("<p class=\"results\"></p>")
          .text(
            date.toLocaleDateString() +
            " " +
            date.toLocaleTimeString() +
            log.entry
          )
          .appendTo($(".activityComponent"));
      });
  }

  function displayMemberBooks(): void {
    pause(true);

    $(".memberBooks").html("");

    $
      .ajax({
        type: "POST",
        url: "/dashboard/memberbookssearch",
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(Array.from(borrowedBooks))
      })
      .done((books: string): void => {
        displayBorrowedBooks(books);
        play();
      });
  }

  function displayBorrowedBooks(booksString: string) {
    JSON.parse(booksString).forEach((bk: Types.Book): void => {
      $(".memberBooks").append(
        $(`<p id="memBk${bk._id}" class="results"></p>`)
          .text(`
            ${bk.author},
            ${bk.title},
            ${bk.year},
            ${bk.language},
            ${bk._id}
          `)
          .click((): void => {
            borrowedBooks.delete(bk._id);
            returnedBooks.add(bk._id);
            $(`#memBk${bk._id}`).remove();
          })
      );
    });
  }

  export function mainScreen(type: string): void {
    type === "admin" ?
      $((): void => {
        $(".activityLog").show();
      }) :
      $((): void => {
        $(`.lendBooksUpdate`).hide();
        $(".lendBooksConfig").show();
      });
  }

  export function configBtn(
    component: string,
    action: string,
    type: string = "app"
  ): void {
    $(`.${component}${action}Btn`).click((): void => {
      $(`.${type}Dash`).hide();
      $(`.${component}Component`).hide();
      type === "app" && $(`.${component}Search`).show();
      $(`.${component}${action}`).show();
    });
  }

  function rawInput(
    type: string,
    action: string
  ): Types.Book | Types.Employee | Types.Membership {

    switch (type) {
      case "book":
        return bookRaw(action);
      case "employee":
        return employeeRaw(action);
      case "membership":
        return membershipRaw(action);
      case "lendBooks":
        return lendBooksRaw(action);
    }
  }

  function bookRaw(action: string): Types.Book {
    switch (action) {
      case "cr":
      case "sr":
        return {
          author: $(`#${action}BkAuthor`).val().toString(),
          title: $(`#${action}BkTitle`).val().toString(),
          year: $(`#${action}BkYear`).val().toString(),
          language: $(`#${action}BkLanguage`).val().toString()
        };
      case "up":
        return {
          isAvailable: $(`#${action}BkisAvailable`).val() === "available" ?
            true :
            false,
          _id: $("#upBk_id").val().toString(),
          author: $(`#${action}BkAuthor`).val().toString(),
          title: $(`#${action}BkTitle`).val().toString(),
          year: $(`#${action}BkYear`).val().toString(),
          language: $(`#${action}BkLanguage`).val().toString()
        };
      case "del":
        return {
          isAvailable: $("#upBkisAvailable").val() === "available" ?
            true :
            false,
          _id: $("#upBk_id").val().toString()
        };
    }
  }

  function employeeRaw(action: string): Types.Employee {
    switch (action) {
      case "cr":
        return {
          username: $(`#${action}EmpUsername`).val().toString(),
          name: $(`#${action}EmpName`).val().toString(),
          surname: $(`#${action}EmpSurname`).val().toString(),
          email: $(`#${action}EmpEmail`).val().toString(),
          newpass1: $(`#${action}EmpNewpass1`).val().toString(),
          newpass2: $(`#${action}EmpNewpass2`).val().toString(),
          isAdmin: $(`#${action}EmpIsAdmin`).prop("checked")
        };
      case "sr":
        return {
          username: $(`#${action}EmpUsername`).val().toString(),
          name: $(`#${action}EmpName`).val().toString(),
          surname: $(`#${action}EmpSurname`).val().toString(),
          email: $(`#${action}EmpEmail`).val().toString()
        };
      case "up":
        return {
          _id: $("#upEmp_id").val().toString(),
          newpass1: $("#upEmpNewpass1").val().toString(),
          newpass2: $("#upEmpNewpass2").val().toString()
        };
      case "del":
        return {
          _id: $("#upEmp_id").val().toString()
        };
    }
  }

  function membershipRaw(action: string): Types.Membership {
    switch (action) {
      case "cr":
      case "sr":
        return {
          name: $(`#${action}MemName`).val().toString(),
          surname: $(`#${action}MemSurname`).val().toString(),
          address: $(`#${action}MemAddress`).val().toString(),
          status: $(`#${action}MemStatus`).val().toString()
        };
      case "up":
        return {
          _id: $("#upMem_id").val().toString(),
          name: $("#upMemName").val().toString(),
          surname: $("#upMemSurname").val().toString(),
          address: $("#upMemAddress").val().toString(),
          status: $("#upMemStatus").val().toString()
        };
      case "del":
        return {
          _id: $("#upMem_id").val().toString(),
        };
    }
  }

  function lendBooksRaw(action: string): Types.Membership | Types.Book {
    switch (action) {
      case "member":
        return {
          name: $("#srLbName").val().toString(),
          surname: $("#srLbSurname").val().toString()
        };
      case "book":
        return {
          author: $("#srLbAuthor").val().toString(),
          title: $("#srLbTitle").val().toString(),
          year: $("#srLbYear").val().toString(),
          language: $("#srLbLanguage").val().toString()
        };
      case "update":
        return {
          _id: $("#upLb_id").val().toString(),
          books: Array.from(borrowedBooks),
          returned: Array.from(returnedBooks)
        };
    }
  }

  export function createInput(
    type: string
  ): Types.Book | Types.Employee | Types.Membership {
    return rawInput(type, "cr")
  }

  export function searchInput(
    type: string
  ): Types.Book | Types.Employee | Types.Membership {
    return rawInput(type, "sr")
  }

  export function deleteInput(
    type: string
  ): Types.Book | Types.Employee | Types.Membership {
    return rawInput(type, "del")
  }

  export function updateInput(
    type: string
  ): Types.Book | Types.Employee | Types.Membership {
    return rawInput(type, "up")
  }

  export function lendBooksInput(
    action: string
  ): Types.Book | Types.Employee | Types.Membership {
    return rawInput("lendBooks", action)
  }

  export function displayResults(
    type: string,
    res: string,
    public: boolean = false): void {

    cleanupPrevRes(type, public, JSON.parse(res).length);
    displayNewRes(type, public, res);
  }

  function cleanupPrevRes(type: string, public: boolean, numOfBooks: number): void {

    const prefix: string = resId(type);
    $(`.sr${prefix}Results`)
      .html(
        public ?
          `<span class="title">Found ${numOfBooks} book(s)</span>` :
          `<span class="title">Click on ${
          prefix === "LbMem" ?
            "member" :
            prefix === "Lb" ?
              "book" :
              type + " you wish to edit"
          }</span>
      `)
      .show();
  }

  function resId(type: string): string {
    switch (type) {
      case "book":
        return "Bk";
      case "employee":
        return "Emp";
      case "membership":
        return "Mem";
      case "lendBooksMembers":
        return "LbMem";
      case "lendBooks":
        return "Lb"
    }
  }

  function displayNewRes(type: string, public: boolean, res: string): void {
    let serverRes: Types.Book[] & Types.Employee[] & Types.Membership[];

    switch (type) {
      case "book":
      case "lendBooks":
        serverRes = JSON
          .parse(res)
          .sort((a: Types.Book, b: Types.Book): number => {
            return a.author < b.author ? -1 : a.author > b.author ? 1 : 0;
          });
        break;
      case "employee":
        serverRes = JSON.parse(res)
          .sort((a: Types.Employee, b: Types.Employee): number => {
            return a.username < b.username ?
              -1 :
              a.username > b.username ? 1 : 0;
          });
        break;
      case "membership":
      case "lendBooksMembers":
        serverRes = JSON
          .parse(res)
          .sort((a: Types.Membership, b: Types.Membership): number => {
            return a.surname < b.surname ? -1 : a.surname > b.surname ? 1 : 0;
          });
        break;
    }


    serverRes.forEach(
      type === "lendBooks" || type === "lendBooksMembers" ?
        (e: Types.Book | Types.Membership): void => {
          displayLendHTML(type, e);
        } :
        (e: Types.Book | Types.Employee | Types.Membership): void => {
          displayHTML(type, public, e);
          public || setResultsListeners(type, e);
        }
    );
  }

  function displayLendHTML(
    type: string,
    e: Types.Book & Types.Employee & Types.Membership
  ): void {

    const {
      author, title, year, language, _id,
      isAvailable, name, surname, books
    } = e;

    switch (type) {
      case "lendBooks":
        // Lend book HTML
        $(".srLbResults").append(
          $(`<p id="lb${_id}" class="results"></p>`)
            .html(`
            ${author},
            ${title},
            ${year},
            ${language},
            ${isAvailable ?
                "available" :
                "<span class=\"borrowed\">borrowed</span>"},
            ${_id}
            `)
            .click((): void => {
              $(".msgDash").text("").hide();
              if (borrowedBooks.size < 3 && isAvailable) {
                borrowedBooks.add(_id);
                returnedBooks.delete(_id);

                $(".memberBooks").html("");
                displayMemberBooks();
                $(`#lb${_id}`).remove();
                $(".srLbResults").html("");
              } else if (!isAvailable) {

                displayErrorMsg("Book is alredy borrowed!");
              } else {

                displayErrorMsg("Can't borrow more than 3 books");
              }
            })
        );
        break;
      case "lendBooksMembers":
        // Lend book membership HTML
        $(".srLbMemResults").append(
          $(`<p id="lbm${_id}" class="results"></p>`)
            .text(`
            ${_id},
            ${surname},
            ${name}
            `)
            .click(() => {
              $(".msgDash").hide();
              $(".lendBooksComponent").hide();

              $("#upLb_id").val(_id);
              $("#upLbSurname").val(surname);
              $("#upLbName").val(name);

              borrowedBooks = new Set(books);
              returnedBooks = new Set();

              displayMemberBooks();
              $(".lendBooksUpdate").show();
            })
        );
        break;
    }
  }

  function displayHTML(
    type: string,
    public: boolean,
    e: Types.Book & Types.Employee & Types.Membership
  ): void {
    const {
      author, title, year, language, _id, isAvailable,
      username, name, surname, email, isAdmin, status, address
    } = e;
    let resText: string;

    switch (type) {
      case "book":
        resText = `
          ${author},
          ${title},
          ${year},
          ${language},
          ${isAvailable ?
            "available" :
            "<span class=\"borrowed\">borrowed</span>"}
          ${public ? "" : _id}`
        break;
      case "employee":
        resText = `
          ${username},
          ${name},
          ${surname},
          ${email},
          ${isAdmin ? "administrator" : "librarian"}
          ${_id}`
        break;
      case "membership":
        resText = `
          ${surname},
          ${name},
          ${status},
          ${address}
          ${_id}`
        break;
    }

    $(`.sr${resId(type)}Results`).append(
      $(`<p id="${_id}" class="results"></p>`).html(resText)
    );
  }

  function setResultsListeners(
    type: string,
    e: Types.Book & Types.Employee & Types.Membership
  ): void {
    const {
      author, title, year, language, _id, isAvailable,
      username, name, surname, email, isAdmin, status, address
    } = e;

    $(`#${_id}`).click((): void => {
      $(".msgDash").hide();
      $(`.${type}Component`).hide();

      switch (type) {
        case "book":
          $("#upBk_id").val(_id);
          $("#upBkAuthor").val(author);
          $("#upBkTitle").val(title);
          $("#upBkYear").val(year);
          $("#upBkLanguage").val(language);
          $("#upBkisAvailable").val(isAvailable ? "available" : "borrowed");
          break;
        case "employee":
          $("#upEmp_id").val(_id);
          $("#upEmpIsAdmin").val(isAdmin ? "administrator" : "librarian");
          $("#upEmpUsername").val(username);
          $("#upEmpName").val(name);
          $("#upEmpSurname").val(surname);
          $("#upEmpEmail").val(email);
          break;
        case "membership":
          $("#upMem_id").val(_id);
          $("#upMemSurname").val(surname);
          $("#upMemName").val(name);
          $("#upMemStatus").val(status);
          $("#upMemAddress").val(address);
          break;
      }

      $(`.${type}Update`).show();
    });
  }
}