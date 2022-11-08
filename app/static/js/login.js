//重定向到注册页面
function redirect_register() {
  $("#register_btn").on("click", function () {
    window.location.href = "/user/register";
  });
}

//重定向到修改密码页面
function redirect_change_password() {
  $("#forget_password_btn").on("click", function () {
    window.location.href = "/forget_password";
  });
}

//页面加载完成后挂载
$(function () {
  redirect_change_password();
  redirect_register();
});
