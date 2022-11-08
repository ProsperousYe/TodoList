function redirect_register() {
  $("#register_btn").on("click", function () {
    window.location.href = "/user/register";
  });
}

function redirect_change_password() {
  $("#forget_password_btn").on("click", function () {
    window.location.href = "/forget_password";
  });
}



$(function () {
  redirect_change_password();
  redirect_register();
});
