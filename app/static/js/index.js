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

function load_event(){
  $(".todo-list-btn").on("click", function () {
    let id = $(this).attr("id");
    let events = $("#events")
    $.ajax({
      method: 'POST',
      dataType: 'json',
      url: '/event/load_event',
      data:{
        list_id: id,
      }
    }).then((res) =>{
      if(res.code==200){
        // console.log(res)
        events.html(res.message)
        finished();
        progress();
      }
    })
  });
}

function load_event_labels(){
  $(".label-list-btn").on("click", function () {
    let label = $(this).attr("value");
    let events = $("#events")
    $.ajax({
      method: 'POST',
      dataType: 'json',
      url: '/event/load_event_label',
      data:{
        label: label,
      }
    }).then((res) =>{
      if(res.code==200){
        // console.log(res)
        events.html(res.message)
        finished();
        progress();
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
          list_id: id,
        }
      }).then((res) =>{
        if(res.code==200){
          // console.log(res)
          events.html(res.message)
          finished()
          progress()
        }
      })
      load_event(); // 注册点击事件
    }
  })
}

function finished(){
  $(".finished-btn").on('click',function(){
    let id = $(this).attr("value")
    // console.log(id)
    $.ajax({
      method:"POST",
      datatype:"json",
      url:"/event/finished_event",
      data:{
        id : id,
      }
    }).then((res)=>{
    console.log($('#todo_lists').children('input'))
      $('#todo_lists').children('input').each(function(){
        if($(this).attr('checked')){
          $(this).trigger('click');
        } else {
          $('#labels').children('input').each(function () {
            if($(this).attr('checked')){
              $(this).trigger('click');
            }
          })
        }
      })
    })
  })
}

function progress() {
  $(".event-progress").each(function(){
    console.log(13)
    let gone_days = $(this).attr('aria-valuenow')
    let duration = $(this).attr('aria-valuemax')
    let width = (duration-gone_days)/duration
    let width_percent = width * 100
    console.log(width_percent)
    $(this).css({'width': width_percent+'%'})
  })
}

$(function () {
  log_out();
  change_password();
  load_todo_list();
  load_event_labels();
});
