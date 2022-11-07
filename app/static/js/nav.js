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

function back_home() {
  $("#home-btn").on("click", function () {
    console.log("home");
    $.ajax({
      method:"get",
      url:"/home"
    }).then((res)=>{
      window.location.href = res;
    })
  });
}

$(function () {
  log_out();
  change_password();
  back_home()
})