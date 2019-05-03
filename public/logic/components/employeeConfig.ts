/// <reference path="../other/Types.ts"/>

// Employee settings menu
Dirkem.configBtn("employee", "Create", "msg");
Dirkem.configBtn("employee", "Search", "msg");

// Employee create

$(".employeeCreate form").on("submit", (event: Event): void => {
  Dirkem.pause();

  $
    .ajax({
      type: "POST",
      url: "/dashboard/employeecreate",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(Dirkem.createInput("employee"))
    })
    .done((res: string): void => {

      Dirkem.displayMsgs(res);
      Dirkem.play(<HTMLFormElement>event.target);
    });
});

// Employee search

$(".employeeSearch form").on("submit", (event: Event): void => {
  Dirkem.pause(true);

  $
    .ajax({
      type: "POST",
      url: "/dashboard/employeesearch",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify(Dirkem.searchInput("employee"))
    })
    .done((res: string): void => {

      res === "[]" ?
        Dirkem.displayErrorMsg("No match found!") :
        Dirkem.displayResults("employee", res);

      Dirkem.play(<HTMLFormElement>event.target);
    });
});

// Employee update/delete

$(".employeeUpdate form").on("submit", (event: Event): void => {
  Dirkem.pause();

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
          Dirkem.deleteInput("employee") :
          Dirkem.updateInput("employee")
      )
    })
    .done((res: string): void => {

      Dirkem.displaySearch("employee");
      Dirkem.displayMsgs(res);
      Dirkem.play(<HTMLFormElement>event.target);
    });
});