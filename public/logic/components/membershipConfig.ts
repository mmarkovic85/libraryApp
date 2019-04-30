/// <reference path="../other/Types.ts"/>

// Membership settings menu buttons
Dirkem.configBtn("membership", "Create", "msg");
Dirkem.configBtn("membership", "Search", "msg");

// Membership create

$(".membershipCreate form").on("submit", (event: Event): void => {
  Dirkem.pause();

  $
    .ajax({
      type: "POST",
      url: "/dashboard/membershipcreate",
      data: Dirkem.createInput("membership")
    })
    .done((res: string): void => {
      Dirkem.displayMsgs(res);
      Dirkem.play(<HTMLFormElement>event.target);
    });
});

// Membership search

$(".membershipSearch form").on("submit", (event: JQuery.Event): void => {
  Dirkem.pause(true);

  const membership: Types.Membership = {
    name: $("#srMemName").val().toString(),
    surname: $("#srMemSurname").val().toString(),
    address: $("#srMemAddress").val().toString(),
    status: $("#srMemStatus").val().toString()
  };

  $
    .ajax({
      type: "POST",
      url: "/dashboard/membershipsearch",
      data: membership
    })
    .done((res: string) => {


      JSON.parse(res)
        .sort((a: Types.Membership, b: Types.Membership): number => {
          return a.surname < b.surname ? -1 : a.surname > b.surname ? 1 : 0;
        })
        .forEach((e: Types.Membership) => {
          // membership HTML
          $(".srMemResults > ul").append(
            $(`<li id="${e._id}"></li>`).text(`
            ${e.surname}, 
            ${e.name}, 
            ${e.status}, 
            ${e.address}`)
          );
          // membership edit listener
          $(`#${e._id}`).click(() => {
            $(".msgDash").hide();
            $(".membershipComponent").hide();
            $("#upMem_id").val(e._id);
            $("#upMemSurname").val(e.surname);
            $("#upMemName").val(e.name);
            $("#upMemStatus").val(e.status);
            $("#upMemAddress").val(e.address);
            $(".membershipUpdate").show();
          });
        });

      $(".loading").hide();
    });
});

// Member update/delete

$(".membershipUpdate form").on("submit", (event: Event): void => {
  event.preventDefault();
  $(".loading").css("display", "flex");

  const membership: Types.Membership = $("#upMemDelete").prop("checked") ?
    {
      _id: $("#upMem_id").val().toString(),
    } :
    {
      _id: $("#upMem_id").val().toString(),
      name: $("#upMemName").val().toString(),
      surname: $("#upMemSurname").val().toString(),
      address: $("#upMemAddress").val().toString(),
      status: $("#upMemStatus").val().toString()
    };

  $
    .ajax({
      type: $("#upMemDelete").prop("checked") ? "DELETE" : "PUT",
      url: $("#upMemDelete").prop("checked") ?
        "/dashboard/membershipdelete" :
        "/dashboard/membershipupdate",
      data: membership
    })
    .done((res: string) => {
      $(".membershipComponent").hide();

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

      $(".membershipSearch").show();
      $(".loading").hide();
    });
});