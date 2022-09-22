// function add_event(){
//   $("#add_event_btn").on("click", function () {
//     let id = $(this).attr("value");
//     $.ajax({
//       url: "/event/add_event",
//       method: "POST",
//       data: {
//         id: id,
//         title: title,
//         content: content,
//         setting_datetime: setting_datetime
//       },
//       success: function (res) {
//         let code = res["code"];
//         if (code == 200) {
//           alert("添加成功");
//           window.location.href = "/index";
//         } else {
//           console.log(code);
//           alert(code);
//         }
//       }
//     })
//   })
// }

// $(function () {
//   add_event();
// })