/// <reference path="./customTypes.ts"/>

// Admin dash menu buttons listeners

$(".activityLogBtn").click((): void => {
  $(".appDash").hide();
  $(".activityLog").show();
});

$(".employeeConfigBtn").click((): void => {
  $(".appDash").hide();
  $(".employeeComponent").hide();
  $(".employeeConfig").show();
});

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

$(".employeeCreate form").on(
  "submit",
  (event: Event): void => {
    $(".loading").css("display", "flex");
    event.preventDefault();

    $
      .ajax({
        type: "POST",
        url: "/dashboard/empcreate",
        data: {
          username: $("#crEmpUsername").val().toString(),
          newpass1: $("#crEmpNewpass1").val().toString(),
          newpass2: $("#crEmpNewpass2").val().toString(),
          name: $("#crEmpName").val().toString(),
          surname: $("#crEmpSurname").val().toString(),
          email: $("#crEmpEmail").val().toString(),
          isAdmin: $("#crEmpIsAdmin").prop("checked")
        }
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
  }
);