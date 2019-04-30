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

    JSON.parse(res).forEach((msg: Types.flashMsg) => {
      $("<p></p>")
        .text(msg.message)
        .attr("class", msg.type)
        .appendTo($(".msgDash"));
    });
  }

  export function adminMainScreen() {
    $((): void => {
      $(".activityLog").show();
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
        return {
          author: $(`#${action}BkAuthor`).val().toString(),
          title: $(`#${action}BkTitle`).val().toString(),
          year: $(`#${action}BkYear`).val().toString(),
          language: $(`#${action}BkLanguage`).val().toString()
        }
      case "employee":
        return {
          username: $(`#${action}EmpUsername`).val().toString(),
          newpass1: $(`#${action}EmpNewpass1`).val().toString(),
          newpass2: $(`#${action}EmpNewpass2`).val().toString(),
          name: $(`#${action}EmpName`).val().toString(),
          surname: $(`#${action}EmpSurname`).val().toString(),
          email: $(`#${action}EmpEmail`).val().toString(),
          isAdmin: $(`#${action}EmpIsAdmin`).prop("checked")
        }
      case "membership":
        return {
          name: $(`#${action}MemName`).val().toString(),
          surname: $(`#${action}MemSurname`).val().toString(),
          address: $(`#${action}MemAddress`).val().toString(),
          status: $(`#${action}MemStatus`).val().toString()
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

  export function displayResults(type: string, res: string): void {
    cleanupPrevRes(type);
    displayNewRes(type, res);
  }

  function cleanupPrevRes(type: string): void {
    switch (type) {
      case "book":
        $(".srBkResults")
          .html(`  
            <span>Click on book you wish to edit</span>
            <ul>
            </ul>
          `)
          .show();
        break;
      case "employee":
        $(".srEmpResults")
          .html(`  
            <span>Click on employee you wish to edit</span>
            <ul>
            </ul>
          `)
          .show();
        break;
      case "membership":
        $(".srMemResults")
          .html(`  
            <span>Click on member you wish to edit</span>
            <ul>
            </ul>
          `)
          .show();
        break;
    }
  }

  function displayNewRes(type: string, res: string) {
    switch (type) {
      case "book":
        JSON.parse(res)
          .sort((a: Types.Book, b: Types.Book): number => {
            return a.author < b.author ? -1 : a.author > b.author ? 1 : 0;
          })
          .forEach((e: Types.Book): void => {
            displayHTML("book", e);
            setResultsListeners("book", e);
          });
        break;
      case "employee":
        ;
        break;
      case "membership":
        ;
        break;
    }
  }

  function displayHTML(type: string, e: Types.Book): void {
    switch (type) {
      case "book":
        const {
          author, title, year,
          language, _id, isAvailable
        } = e;
        // Book HTML
        $(".srBkResults > ul").append(
          $(`<li id="${_id}"></li>`).text(`
            ${author}, 
            ${title}, 
            ${year}, 
            ${language}, 
            ${isAvailable ? "available" : "borrowed"}, 
            ${_id}
        `));
        break;
      case "employee":
        break;
      case "membership":
        break;
    }
  }

  function setResultsListeners(type: string, e: Types.Book): void {
    switch (type) {
      case "book":
        const {
          author, title, year,
          language, _id, isAvailable
        } = e;
        // Book edit listener
        $(`#${_id}`).click((): void => {
          $(".msgDash").hide();
          $(".bookComponent").hide();
          $("#upBk_id").val(_id);
          $("#upBkAuthor").val(author);
          $("#upBkTitle").val(title);
          $("#upBkYear").val(year);
          $("#upBkLanguage").val(language);
          $("#upBkisAvailable").val(isAvailable ? "available" : "borrowed");
          $(".bookUpdate").show();
        });
        break;
      case "employee":
        break;
      case "membership":
        break;
    }
  }
}