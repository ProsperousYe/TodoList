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
  // $("#add_event_btn").on("click", function () {
  //   post_data = $('#form1').serialize()
  //   post_data["list_id"] = $(this).attr("value");
  //   console.log("title:",post_data.event_title);
  //   $.ajax({
  //     type: "POST",
  //     dataType: "json",
  //     url: "/event/add_event" ,
  //     data: post_data,
  //     success: function (result) {
  //         console.log(result);       //打印服务端返回的数据(调试用)
  //         if (result.code == 200) {
  //           console.log(result);
  //         }
  //         ;
  //     },
  //   });
  // })
}

function add_todolist() {
  $("#add_todolist_btn").on("click", function () {
    window.location.href = "/event/add_todolist";
  });
}

function load_event(){
  $(".todo-list-btn").on("click", function () {
    let id = $(this).attr("id");
    let events = $("#events")
    $.ajax({
      method: 'POST',
      dataType: 'json',
      url: '/event/load_event',
      data:{
        id: id,
      }
    }).then((res) =>{
      if(res.code==200){
        console.log(res)
        events.html(res.message)
        add_event();
      }
    })
  });
}

function load_todo_list(){
  let todo_lists = $("#todo_lists")
  $.ajax({
    method: 'GET',
    dataType: 'json',
    async: false,
    url: '/event/load_todolist',
  }).then((res) => {
    if(res.code == 200){
      let list = res.message;
      // console.log(list);
      for(let i = 0; i<list.length;i++){
        let todo = list[i];
        if(i==0){
          todo_lists.append("<input type='radio' name='todo_lists' autocomplete='off' class='btn-check todo-list-btn' checked id='"+todo.id+"'><label class='btn btn-outline-dark' for='"+todo.id+"'>"+todo.list_name+"</label><label class='form-label'></label>")
        } else {
          todo_lists.append("<input type='radio' name='todo_lists' autocomplete='off' class='btn-check todo-list-btn' id='"+todo.id+"'><label class='btn btn-outline-dark' for='"+todo.id+"'>"+todo.list_name+"</label><label class='form-label'></label>")
        }
      }
      // 自动请求选择的第一个列表里的事件
      let id = list[0].id;
      let events = $("#events")
      $.ajax({
        method: 'POST',
        dataType: 'json',
        url: '/event/load_event',
        data:{
          id: id,
        }
      }).then((res) =>{
        if(res.code==200){
          console.log(res)
          events.html(res.message)
          add_event();
        }
      })
      load_event(); // 注册点击事件
    }
  })
}

$(function () {
  log_out();
  change_password();
  add_todolist();
  load_todo_list();
});
