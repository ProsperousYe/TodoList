function log_out() {
  $("#logout_btn").on("click", function () {
    let id = $(this).attr("value");
    $.ajax({
      url: "/user/logout",
      method: "POST",
      data: {
        id: id,
      },
      success: function (res) {
        let code = res["code"];
        if (code == 200) {
          alert("登出成功");
          window.location.href = "/user/login";
        } else {
          console.log(code);
          alert(code);
        }
      },
    });
  });
}

function change_password() {
  $("#change_password_btn").on("click", function () {
    window.location.href = "/user/change_password";
  });
}

function add_event() {
  $("#add_event_btn").on("click", function () {
    const list_id = $(this).attr("value");
    window.location.href = "/event/add_event";
  });
}

function add_todolist() {
  $("#add_todolist_btn").on("click", function () {
    window.location.href = "/event/add_todolist";
  });
}

function load_event(){
  $.ajax({
    method: 'GET',
    url: '/event/load_event',
    success:function(res){
      const code = res['code']
      if(code === 200){
      } else {
      }
    }
  })
}

$(function () {
  log_out();
  change_password();
  add_event();
  add_todolist();
  load_event();
});
