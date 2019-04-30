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
      data: Dirkem.createInput("employee")
    })
    .done((res: string): void => {
      Dirkem.displayMsgs(res);
      Dirkem.play(<HTMLFormElement>event.target);
    });
});

// Employee search

$(".employeeSearch form").on("submit", (event: JQuery.Event): void => {
  Dirkem.pause(true);

  const employee: Types.Employee = {
    username: $('#srEmpUsername').val().toString(),
    name: $('#srEmpName').val().toString(),
    surname: $('#srEmpSurname').val().toString(),
    email: $('#srEmpEmail').val().toString()
  };

  $
    .ajax({
      type: "POST",
      url: "/dashboard/employeesearch",
      data: employee
    })
    .done((res: string) => {
      

      JSON.parse(res)
        .sort((a: Types.Employee, b: Types.Employee): number => {
          return a.username < b.username ? -1 : a.username > b.username ? 1 : 0;
        })
        .forEach((e: Types.Employee) => {
          // Employee HTML
          $(".srEmpResults > ul").append(
            $(`<li id="${e._id}"></li>`).text(`
            ${e.username}, 
            ${e.name}, 
            ${e.surname}, 
            ${e.email}`)
          );
          // Employee edit listener
          $(`#${e._id}`).click(() => {
            $(".msgDash").hide();
            $(".employeeComponent").hide();
            $("#upEmp_id").val(e._id);
            $("#upEmpUsername").val(e.username);
            $("#upEmpName").val(e.name);
            $("#upEmpSurname").val(e.surname);
            $("#upEmpEmail").val(e.email);
            $(".employeeUpdate").show();
          });
        });

        Dirkem.play();
    });
});

// Employee update/delete

$(".employeeUpdate form").on("submit", (event: Event): void => {
  event.preventDefault();
  $(".loading").css("display", "flex");

  const employee: Types.Employee = $("#upEmpDelete").prop("checked") ?
    {
      _id: $("#upEmp_id").val().toString(),
    } :
    {
      _id: $("#upEmp_id").val().toString(),
      newpass1: $("#upEmpNewpass1").val().toString(),
      newpass2: $("#upEmpNewpass2").val().toString()
    };

  $
    .ajax({
      type: $("#upEmpDelete").prop("checked") ? "DELETE" : "PUT",
      url: $("#upEmpDelete").prop("checked") ?
        "/dashboard/employedelete" :
        "/dashboard/employeeupdate",
      data: employee
    })
    .done((res: string) => {
      $(".employeeComponent").hide();

      const msgs: Types.flashMsg[] = JSON.parse(res);

      $(".msgDash").text("").show();
      msgs.forEach((msg: Types.flashMsg) => {
        $("<p></p>")
          .text(msg.message)
          .attr("class", msg.type)
          .appendTo($(".msgDash"));
      });

      const form: HTMLFormElement = <HTMLFormElement>event.target;
      form.reset();

      $(".employeeSearch").show();
      $(".loading").hide();
    });
});