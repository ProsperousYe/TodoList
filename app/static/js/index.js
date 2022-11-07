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
        progress();
      }
    })
  });
}

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
          let list_id = todo.id
          let btn = "<div class='add_event_btn' data-bs-toggle='modal' data-bs-target='#exampleModal' id='add_event_btn_"+list_id+"' value='" +  list_id  + "'>+</div>"
          todo_lists.append("<input type='radio' name='todo_lists' autocomplete='off' class='btn-check todo-list-btn' checked id='"+todo.id+"'><label class='btn btn-outline-dark todo_list-label' for='"+todo.id+"'>"+todo.list_name+"</label>"+btn)
        } else {
          let list_id = todo.id
          let btn = "<div class='add_event_btn' data-bs-toggle='modal' data-bs-target='#exampleModal' id='add_event_btn_"+list_id+"' value='" +  list_id  + "'>+</div>"
          todo_lists.append("<input type='radio' name='todo_lists' autocomplete='off' class='btn-check todo-list-btn' id='"+todo.id+"'><label class='btn btn-outline-dark todo_list-label' for='"+todo.id+"'>"+todo.list_name+"</label>"+btn)
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
    }
  })
}

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
  },function(){
    let list_id = $(this).attr("for")
    //console.log("add_event_btn_"+list_id)
    $("#add_event_btn_"+list_id).css({
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
      location.reload();
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

$(function () {
  load_todo_list();
  load_event_labels();
  load_calendar();
  show_add_btn();
  load_nav();
});
