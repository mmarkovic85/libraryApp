// Main Screen

Dirkem.mainScreen("librarian");

// Employee dash menu 

$(".lendBooksConfigBtn").click((): void => {
  $(`.appDash`).hide();
  $(`.lendBooksUpdate`).hide();
  $(`.lendBooksSearch`).show();
  $(`.lendBooksConfig`).show();
});

// Common dashboard menu

Dirkem.configBtn("book", "Config");
Dirkem.configBtn("membership", "Config");