// Main Screen

$((): void => {
  $(".lendBooks").show();
});

// Employee dash menu buttons listeners

$(".lendBooksBtn").click((): void => {
  $(".appDash").hide();
  $(".lendBooks").show();
});

$(".bookConfigBtn").click((): void => {
  $(".appDash").hide();
  $(".bookComponent").hide();
  $(".bookConfig").show();
});

$(".membershipConfigBtn").click((): void => {
  $(".appDash").hide();
  $(".membershipComponent").hide();
  $(".membershipConfig").show();
});