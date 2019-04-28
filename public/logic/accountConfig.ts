/// <reference path="./customTypes.ts"/>

$(".accountConfig form").on("submit", (event: Event): void => {
  $(".loading").css("display", "flex");
  event.preventDefault();

  const employeeData: customTypes.Employee = {
    newpass1: $("#accNewPassword1").val().toString(),
    newpass2: $("#accNewPassword2").val().toString()
  };

  $
    .ajax({
      type: "PUT",
      url: "/dashboard/changepassword",
      data: employeeData
    })
    .done((res: string) => {
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