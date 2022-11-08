//管理员删除用户的逻辑
function delete_user() {
  $(".delete_user_btn").on("click", function () {
    $.ajax({
      url: "/admin/delete_user",
      method: "POST",
      data: {
        id: id,
      },
      success: function (res) {
        let code = res["code"];
        alert("删除成功！");
        location.reload();
      },
    });
  });
}

//页面加载完成后挂载
$(function () {
  delete_user();
});
