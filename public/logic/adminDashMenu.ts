// Main Screen

$((): void => {
  $(".activityLog").show();
});

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