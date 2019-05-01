/// <reference path="./Types.ts"/>

namespace Dirkem {
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

  export function displaySearch(type: string): void {
    $(`.${type}Component`).hide();
    $(`.${type}Search`).show();
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
          _id: $("#upBk_id").val().toString(),
          author: $("#upBkAuthor").val().toString(),
          title: $("#upBkTitle").val().toString(),
          year: $("#upBkYear").val().toString(),
          language: $("#upBkLanguage").val().toString()
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

  export function displayResults(type: string, res: string): void {
    cleanupPrevRes(type);
    displayNewRes(type, res);
  }

  function cleanupPrevRes(type: string): void {
    $(`.sr${resId(type)}Results`)
      .html(`  
            <span>Click on ${type} you wish to edit</span>
            <ul>
            </ul>
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
    }
  }

  function displayNewRes(type: string, res: string): void {
    let serverRes: Types.Book[] & Types.Employee[] & Types.Membership[];
    switch (type) {
      case "book":
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
        serverRes = JSON
          .parse(res)
          .sort((a: Types.Membership, b: Types.Membership): number => {
            return a.surname < b.surname ? -1 : a.surname > b.surname ? 1 : 0;
          });
        break;
    }

    serverRes.forEach(
      (e: Types.Book | Types.Employee | Types.Membership): void => {
        displayHTML(type, e);
        setResultsListeners(type, e);
      }
    );
  }

  function displayHTML(
    type: string,
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
          ${isAvailable ? "available" : "borrowed"}, 
          ${_id}`
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

    $(`.sr${resId(type)}Results > ul`).append(
      $(`<li id="${_id}"></li>`).text(resText)
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

  export function displayPublicResults(res: string): void {
    const books: Types.Book[] = JSON.parse(res);

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
  }
}