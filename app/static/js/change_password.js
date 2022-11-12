//绑定注册验证码按钮
function bindCaptchaClick() {
  $("#captcha-btn").on("click", function () {
    let $this = $(this);
    let email = $(this).attr("value");
    if (!email) {
      alert("请输入邮箱！");
    } else {
      // 通过js发送网络请求：ajax
      //alert("start ajax")
      $.ajax({
        url: "/user/captcha",
        method: "POST",
        data: {
          email: email,
          operation: "Changing Password",
        },
        success: function (res) {
          //res是视图函数返回的东西
          let code = res["code"];
          if (code === 200) {
            alert("验证码发送成功！");
            $this.off("click");
            $this.addClass("disabled");
            let countDown = 60;
            let timer = setInterval(function () {
              countDown--;
              if (countDown > 0) {
                $this.text(countDown + "秒后重新发送");
                //完成之后可以重新点击
              } else {
                //clearInterval(timer);
                $this.text("点击发送验证码");
                $this.removeClass("disabled")
                bindCaptchaClick();
                clearInterval(timer); //  清除计时器
              }
            }, 1000);
          } else {
            alert(res["message"]);
          }
        },
      });
    }
  });
}

//加载导航栏，这里使用了template
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

//添加返回主页面的按钮事件
function back_home(){
  $.ajax({
    method: "GET",
    url: "/home",
  })
}

//加载事件
function load_event(){
  $("#search-btn").on("click", function () {
    let events = $("#events")
    console.log($("textarea[name='event_description']").val())
    $.ajax({
      method: 'POST',
      dataType: 'json',
      url: '/event/search',
      data:{
        event_name: $("input[name='event_name']").val(),
        event_description: $("textarea[name='event_description']").val(),
        event_url: $("textarea[name='event_url']").val(),
        event_finish_date: $("input[name='event_finish_date']").val(),
        event_finish_time: $("input[name='event_finish_time']").val(),
      }
    }).then((res) =>{
      if(res.code==200){
        events.html(res.message)
        finished();
        delete_event();
        progress();
      }
    })
  });
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

// 等网页加载完成后再执行
$(function () {
  bindCaptchaClick();
  load_nav();
  load_event();
});
