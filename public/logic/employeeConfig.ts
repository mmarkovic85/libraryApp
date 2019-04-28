/// <reference path="./customTypes.ts"/>

// Employee settings menu buttons

$(".employeeCreateBtn").click((): void => {
  $(".msgDash").hide();
  $(".employeeComponent").hide();
  $(".employeeCreate").show();
});

$(".employeeSearchBtn").click((): void => {
  $(".msgDash").hide();
  $(".employeeComponent").hide();
  $(".employeeSearch").show();
});

// Employee create

$(".employeeCreate form").on("submit", (event: Event): void => {
  event.preventDefault();
  $(".loading").css("display", "flex");

  const employee: customTypes.Employee = {
    username: $("#crEmpUsername").val().toString(),
    newpass1: $("#crEmpNewpass1").val().toString(),
    newpass2: $("#crEmpNewpass2").val().toString(),
    name: $("#crEmpName").val().toString(),
    surname: $("#crEmpSurname").val().toString(),
    email: $("#crEmpEmail").val().toString(),
    isAdmin: $("#crEmpIsAdmin").prop("checked")
  }

  $
    .ajax({
      type: "POST",
      url: "/dashboard/employeecreate",
      data: employee
    })
    .done((res: string): void => {
      const msg: customTypes.flashMsg[] = JSON.parse(res);

      $(".msgDash").text("").show();
      msg.forEach((msg: customTypes.flashMsg) => {
        $("<p></p>")
          .text(msg.message)
          .attr("class", msg.type)
          .appendTo($(".msgDash"));
      });

      const form: HTMLFormElement = <HTMLFormElement>event.target;
      form.reset();

      $(".loading").hide();
    });
});

// Employee search

$(".employeeSearch form").on("submit", (event: JQuery.Event): void => {
  event.preventDefault();
  $(".loading").css("display", "flex");

  const employee: customTypes.Employee = {
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
      $(".srEmpResults")
        .html(`  
        <span>Click on employee you wish to edit</span>
        <ul>
        </ul>
        `)
        .show();

      JSON.parse(res).forEach((e: customTypes.Employee) => {
        // Employee HTML
        $(".srEmpResults > ul").append(
          $(`<li id="${e._id}"></li>`).text(`${e.username} ${e.name} ${e.surname} ${e.email}`)
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

      $(".loading").hide();
    });
});

// Employee update/delete

$(".employeeUpdate form").on("submit", (event: Event): void => {
  event.preventDefault();
  $(".loading").css("display", "flex");

  const employeeData: customTypes.Employee = $("#upEmpDelete").prop("checked") ?
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
      data: employeeData
    })
    .done((res: string) => {
      $(".employeeComponent").hide();

      const msg: customTypes.flashMsg[] = JSON.parse(res);

      $(".msgDash").text("").show();
      msg.forEach((msg: customTypes.flashMsg) => {
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