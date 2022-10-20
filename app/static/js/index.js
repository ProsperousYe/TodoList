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
  $(".todo-list-btn").on("click", function () {
    let id = $(this).attr("value");
    console.log(id);
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
          todo_lists.append("<li class='nav-item d-grid'><button data-bs-toggle='button' class='active todo-list-btn btn btn-outline-dark' value='"+todo.id+"'>"+todo.list_name+"</button></li><label class='form-label'></label>")
        } else {
          todo_lists.append("<li class='nav-item d-grid'><button data-bs-toggle='button' class='todo-list-btn btn btn-outline-dark' value='"+todo.id+"'>"+todo.list_name+"</button></li><label class='form-label'></label>")
        }
      }
      load_event();
    }
  })
}

$(function () {
  log_out();
  change_password();
  add_event();
  add_todolist();
  load_todo_list();
});
