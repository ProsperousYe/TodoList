//加载普通列表下的事件
function load_event(){
  $(".todo-list-btn").on("click", function () {
    console.log("test")
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
        delete_event();
        progress();
      }
    })
  });
}

//加载日历
function load_calendar(){
  let calendar = $('#calendar')
  $.ajax({
    method: 'GET',
    url: '/event/load_calendar',
  }).then((res)=>{
    console.log('calendar')
    calendar.html(res)
  })
}

//加载组建中的统计图表
function load_echarts(){
  let calendar = $('#calendar')
  $.ajax({
    method: 'GET',
    url: '/echart',
  }).then((res) =>{
    calendar.html(res)
  })
}

//加载固定标签分类下的事件
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
        delete_event();
        progress();
      }
    })
  });
}

//加载todo_list
//目前是暂时的方案，需要重构这里的代码逻辑
function load_todo_list(){
  let body = $("body")
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
          let list_id = todo.id
          let btn = "<div class='add_event_btn' data-bs-toggle='modal' data-bs-target='#exampleModal"+todo.id+"' id='add_event_btn_"+list_id+"' value='" +  list_id  + "'>+</div>"
          let btn_del = "<div class='del_event_btn' data-bs-toggle='modal' data-bs-target='#del_"+todo.id+"' id='del_todo_list_btn_"+list_id+"' value='" +  list_id  + "'>-</div>"
          let model = "<div class='modal fade' id='del_"+todo.id+"' tabindex='-1' aria-labelledby='delModalLabel' aria-hidden='rue'><div class='modal-dialog modal-dialog-centered'><div class='modal-content'><div class='modal-header'><h5 class='modal-title' id='exampleModalLabel'>Are you sure to delete the "+todo.list_name+" ?</h5></div><div class='modal-footer'><button type='button' class='btn btn-secondary' data-bs-dismiss='modal'>NO</button><button type='submit' class='btn btn-primary del-list-btn' value='"+todo.id+"'>YES</button></div></div></div></div>"
          let add_model = "<div class='modal fade' id='exampleModal"+todo.id+"' tabindex='-1' aria-labelledby='exampleModalLabel' aria-hidden='true'><div class='modal-dialog modal-dialog-centered'><div class='modal-content'><div class='modal-header'><h5 class='modal-title' id='exampleModalLabel'>Create a new event</h5><button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button></div><form id='form1' action='"+"/event/add_event"+"' method='POST'><div class='modal-body'><div class='md-3'><label for='event_name' class='form-label'>Event name:</label><input type='text' class='form-control' id='event_name' name='event_name' /></div><div class='md-3'><label for='event_description' class='form-label'>Event description:</label><textarea class='form-control' id='event_description' name='event_description'></textarea></div><div class='md-3'><label for='event_url' class='form-label'>URL:</label><textarea class='form-control' id='event_url' name='event_url'></textarea></div><div class='md-3'><div class='row'><div class='col-8'><label class='from-label'>Dead Date:</label><input type='date' class='form-control' id='event_finish_date' name='event_finish_date' /></div><div class='col-4'><label class='from-label'>Dead Time:</label><input type='time' class='form-control' id='event_finish_time' name='event_finish_time' /></div></div></div><div class='md-3'><label for='label' class='from-label'>Label:</label><div class='row'><div class='col-1'></div><div class='form-check col'><input class='form-check-input' type='radio' name='label' id='flexRadioDefault1' value='1'><label class='form-check-label' for='flexRadioDefault1'><span class='badge bg-danger'>Red</span></label></div><div class='form-check col'><input class='form-check-input' type='radio' name='label' id='flexRadioDefault2' value='2'><label class='form-check-label' for='flexRadioDefault2'><span class='badge bg-primary'>Blue</span></label></div><div class='form-check col'><input class='form-check-input' type='radio' name='label' id='flexRadioDefault3' value='3'><label class='form-check-label' for='flexRadioDefault3'><span class='badge bg-warning'>Yellow</span></label></div><div class='form-check col'><input class='form-check-input' type='radio' name='label' id='flexRadioDefault4' value='4'><label class='form-check-label' for='flexRadioDefault4'><span class='badge bg-success'>Green</span></label></div><div class='form-check col'><input class='form-check-input' type='radio' name='label' id='flexRadioDefault5' value='5' checked><label class='form-check-label' for='flexRadioDefault5'><span class='badge bg-secondary'>Other</span></label></div></div></div></div><input type='hidden' value='"+todo.id+"' name='list_id' id='list_id' /><div class='modal-footer'><button type='button' class='btn btn-secondary' data-bs-dismiss='modal'>Close</button><button type='submit' class='btn btn-primary'>Confirm</button></div></form></div></div></div>";
          todo_lists.append("<input type='radio' name='todo_lists' autocomplete='off' class='btn-check todo-list-btn' checked id='"+todo.id+"'><label class='btn btn-outline-dark todo_list-label' for='"+todo.id+"'>"+todo.list_name+"</label>"+btn+btn_del)
          body.append(model)
          body.append(add_model)
        } else {
          let list_id = todo.id
          let btn = "<div class='add_event_btn' data-bs-toggle='modal' data-bs-target='#exampleModal"+todo.id+"' id='add_event_btn_"+list_id+"' value='" +  list_id  + "'>+</div>"
          let btn_del = "<div class='del_event_btn' data-bs-toggle='modal' data-bs-target='#del_"+todo.id+"' id='del_todo_list_btn_"+list_id+"' value='" +  list_id  + "'>-</div>"
          let model = "<div class='modal fade' id='del_"+todo.id+"' tabindex='-1' aria-labelledby='delModalLabel' aria-hidden='rue'><div class='modal-dialog modal-dialog-centered'><div class='modal-content'><div class='modal-header'><h5 class='modal-title' id='exampleModalLabel'>Are you sure to delete the "+todo.list_name+" ?</h5></div><div class='modal-footer'><button type='button' class='btn btn-secondary' data-bs-dismiss='modal'>NO</button><button type='submit' class='btn btn-primary del-list-btn' value='"+todo.id+"'>YES</button></div></div></div></div>"
          let add_model = "<div class='modal fade' id='exampleModal"+todo.id+"' tabindex='-1' aria-labelledby='exampleModalLabel' aria-hidden='true'><div class='modal-dialog modal-dialog-centered'><div class='modal-content'><div class='modal-header'><h5 class='modal-title' id='exampleModalLabel'>Create a new event</h5><button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button></div><form id='form1' action='"+"/event/add_event"+"' method='POST'><div class='modal-body'><div class='md-3'><label for='event_name' class='form-label'>Event name:</label><input type='text' class='form-control' id='event_name' name='event_name' /></div><div class='md-3'><label for='event_description' class='form-label'>Event description:</label><textarea class='form-control' id='event_description' name='event_description'></textarea></div><div class='md-3'><label for='event_url' class='form-label'>URL:</label><textarea class='form-control' id='event_url' name='event_url'></textarea></div><div class='md-3'><div class='row'><div class='col-8'><label class='from-label'>Dead Date:</label><input type='date' class='form-control' id='event_finish_date' name='event_finish_date' /></div><div class='col-4'><label class='from-label'>Dead Time:</label><input type='time' class='form-control' id='event_finish_time' name='event_finish_time' /></div></div></div><div class='md-3'><label for='label' class='from-label'>Label:</label><div class='row'><div class='col-1'></div><div class='form-check col'><input class='form-check-input' type='radio' name='label' id='flexRadioDefault1' value='1'><label class='form-check-label' for='flexRadioDefault1'><span class='badge bg-danger'>Red</span></label></div><div class='form-check col'><input class='form-check-input' type='radio' name='label' id='flexRadioDefault2' value='2'><label class='form-check-label' for='flexRadioDefault2'><span class='badge bg-primary'>Blue</span></label></div><div class='form-check col'><input class='form-check-input' type='radio' name='label' id='flexRadioDefault3' value='3'><label class='form-check-label' for='flexRadioDefault3'><span class='badge bg-warning'>Yellow</span></label></div><div class='form-check col'><input class='form-check-input' type='radio' name='label' id='flexRadioDefault4' value='4'><label class='form-check-label' for='flexRadioDefault4'><span class='badge bg-success'>Green</span></label></div><div class='form-check col'><input class='form-check-input' type='radio' name='label' id='flexRadioDefault5' value='5' checked><label class='form-check-label' for='flexRadioDefault5'><span class='badge bg-secondary'>Other</span></label></div></div></div></div><input type='hidden' value='"+todo.id+"' name='list_id' id='list_id' /><div class='modal-footer'><button type='button' class='btn btn-secondary' data-bs-dismiss='modal'>Close</button><button type='submit' class='btn btn-primary'>Confirm</button></div></form></div></div></div>";
          todo_lists.append("<input type='radio' name='todo_lists' autocomplete='off' class='btn-check todo-list-btn' id='"+todo.id+"'><label class='btn btn-outline-dark todo_list-label' for='"+todo.id+"'>"+todo.list_name+"</label>"+btn+btn_del)
          body.append(model)
          body.append(add_model)
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
      show_add_btn();
      del_todo_btn()
    }
  })
}

//删除list的事件
function del_todo_btn(){
  $(".del-list-btn").on("click",function(){
    let id = $(this).val()
    $.ajax({
      method:'post',
      url: '/event/del_list',
      data: {
        id: id
      }
    }).then((res) => {
      location.reload()
    })
  })
}

//list按钮左右浮现删除和添加的按钮事件
function show_add_btn(){
  $(".todo_list-label").hover(function(){
    //console.log("hovered");
    let list_id = $(this).attr("for")
    //console.log("add_event_btn_"+list_id)
    // let btn = "<button type='button' class='btn btn-success' data-bs-toggle='modal' data-bs-target='#exampleModal' id='add_event_btn' value='" +  list_id  + "'>+</button>"
    // $(this).parent().append(btn)
    $("#add_event_btn_"+list_id).css({
      "visibility":"visible",
      "opacity":"1",
    });
    $("#del_todo_list_btn_"+list_id).css({
      "visibility":"visible",
      "opacity":"1",
    });
  },function(){
    let list_id = $(this).attr("for")
    //console.log("add_event_btn_"+list_id)
    $("#add_event_btn_"+list_id).css({
      "visibility":"hidden",
      "opacity":"0",
    });
    $("#del_todo_list_btn_"+list_id).css({
      "visibility":"hidden",
      "opacity":"0",
    });
  });
  $(".add_event_btn").hover(function(){
    $(this).css({
      "visibility":"visible",
      "opacity":"1",
    });
  },function(){
    $(this).css({
      "visibility":"hidden",
      "opacity":"0",
    });
  })
  $(".del_event_btn").hover(function(){
    $(this).css({
      "visibility":"visible",
      "opacity":"1",
    });
  },function(){
    $(this).css({
      "visibility":"hidden",
      "opacity":"0",
    });
  })
}

//标记事件完成
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
      location.reload();
    })
  })
}

//删除事件
function delete_event(){
  $(".delete-event-btn").on("click", function(){
    let id = $(this).attr("value")
    // console.log(id)
    $.ajax({
      method:"POST",
      datatype:"json",
      url:"/event/delete_event",
      data:{
        id : id,
      }
    }).then((res)=>{
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
      location.reload();
    })
  })
}

//加载进度条
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

//加载导航栏，template！
function load_nav(){
  let id = $("#navbar").attr("value")
  $.ajax({
    method: "GET",
    url: "/nav",
    data:{
      id: id,
    }
  }).then((res) => {
    $("#navbar").html(res)
  })
}

//事件完成
function completed(){
  $(".com-list-btn").on("click", function(){
    let com = $(this).val();
    let events = $("#events")
    $.ajax({
      method: "post",
      url: "/event/completed",
      dataType: "json",
      data:{
        com: com,
      }
    }).then((res)=>{
      if(res.code==200){
        // console.log(res)
        events.html(res.message)
        finished();
        delete_event();
        progress();
      }
    })
  })
}

//cld组件切换的逻辑
function calendar_change_(){
  $("#calendar_nav").on("click", function(){
    load_calendar();
    $(this).addClass("active")
    $("#statis_nav").removeClass("active")
  });
  $("#statis_nav").on("click", function(){
    load_echarts();
    $(this).addClass("active")
    $("#calendar_nav").removeClass("active")
  })
}

//页面加载完成后挂载
$(function () {
  load_todo_list();
  load_event_labels();
  load_calendar();
  show_add_btn();
  load_nav();
  completed();
  calendar_change_();
});
