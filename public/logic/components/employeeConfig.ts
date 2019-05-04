/// <reference path="../other/Nineveh.ts"/>

// Employee settings menu
Nineveh.configBtn("employee", "Create", "msg");
Nineveh.configBtn("employee", "Search", "msg");

// Employee create

$(".employeeCreate form").on("submit", (event: Event): void => {
  Nineveh.pause();

  $
    .ajax({
      type: "POST",
      url: "/dashboard/employeecreate",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(Nineveh.createInput("employee"))
    })
    .done((res: string): void => {

      Nineveh.displayMsgs(res);
      Nineveh.play(<HTMLFormElement>event.target);
    });
});

// Employee search

$(".employeeSearch form").on("submit", (event: Event): void => {
  Nineveh.pause(true);

  $
    .ajax({
      type: "POST",
      url: "/dashboard/employeesearch",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(Nineveh.searchInput("employee"))
    })
    .done((res: string): void => {

      res === "[]" ?
        Nineveh.displayErrorMsg("No match found!") :
        Nineveh.displayResults("employee", res);

      Nineveh.play(<HTMLFormElement>event.target);
    });
});

// Employee update/delete

$(".employeeUpdate form").on("submit", (event: Event): void => {
  Nineveh.pause();

  const isForDelete: boolean = $("#upEmpDelete").prop("checked");

  $
    .ajax({
      type: isForDelete ? "DELETE" : "PUT",
      url: isForDelete ?
        "/dashboard/employedelete" :
        "/dashboard/employeeupdate",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(
        isForDelete ?
          Nineveh.deleteInput("employee") :
          Nineveh.updateInput("employee")
      )
    })
    .done((res: string): void => {

      Nineveh.displaySearch("employee");
      Nineveh.displayMsgs(res);
      Nineveh.play(<HTMLFormElement>event.target);
    });
});