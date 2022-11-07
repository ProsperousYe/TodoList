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

function right_nav(){
  $("#hello").on("click", function(){
    let nav = $("#nav_vertical")
    let right = $("#right_card")
    if(nav.val()==1){
      nav.val(0)
      right.val(0)
      nav.css({
        "position": "relative",
        "left": "-500px",
        "transition-duration":"1s"
      })
      right.css({
        "position": "relative",
        "right": "-500px",
        "transition-duration":"0.6s"
      })
    } else {
      nav.val(1)
      right.val(1)
      nav.css({
        "position": "relative",
        "left": "0px",
        "transition-duration":"1s"
      })
      right.css({
        "position": "relative",
        "right": "0px",
        "transition-duration":"1s"
      })
    }
  })
}

$(function () {
  log_out();
  change_password();
  back_home();
  right_nav();
})