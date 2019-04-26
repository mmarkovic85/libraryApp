/// <reference path="./customTypes.ts"/>

$(".accountConfigBtn").click((): void => {
  $(".appDash").hide();
  $(".accountConfig").show();
});

$(".accountConfig form").on("submit", (event: JQuery.Event): void => {
  event.preventDefault();

  const user: customTypes.Employee = {
    password: $("#accCurrentPassword").val().toString(),
    newpass1: $("#accNewPassword1").val().toString(),
    newpass2: $("#accNewPassword2").val().toString()
  }
  /* TODO
    $.ajax().done()
  */
})