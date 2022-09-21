function log_out(){
    $("#logout_btn").on("click", function(){
        let id = $(this).attr("value")
        $.ajax({
            url: "/user/logout",
            method:"POST",
            data: {
                id : id
            },
            success: function(res){
                let code = res["code"]
                if(code==200){
                    alert("登出成功");
                    window.location.href="/user/login"
                } else {
                    alert(code["message"]);
                }                
            }
        })
    })
}


$(function(){
    log_out();
});