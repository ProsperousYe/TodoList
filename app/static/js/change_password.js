function bindCaptchaClick(){
    $("#captcha-btn").on("click", function(){
        let $this = $(this);
        let email =  $(this).attr("value")
        if(!email){
            alert("请输入邮箱！");
        } else {
            // 通过js发送网络请求：ajax
            //alert("start ajax")
            $.ajax({
                url:"/user/captcha",
                method:"POST",
                data:{
                    "email": email,
                    "operation": "Change Password"
                },
                success: function(res){ //res是视图函数返回的东西
                    let code = res['code'];
                    if(code===200){
                        alert("验证码发送成功！");
                        $this.off("click");
                        let countDown = 60;
                        let timer = setInterval(function(){
                            countDown--;
                            if(countDown>0){
                                $this.text(countDown+"秒后重新发送");
                                //完成之后可以重新点击
                            } else {
                                //clearInterval(timer);
                                $this.text("点击发送验证码")
                                bindCaptchaClick();
                                clearInterval(timer);//  清除计时器
                            }
                        },1000)
                    } else {
                        alert(res['message']);
                    }
                }
            })
        }
    });
}

// 等网页加载完成后再执行
$(function(){
    bindCaptchaClick();
});