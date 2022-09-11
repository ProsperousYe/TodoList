function delete_user(){
    $(".delete_user_btn").on("click", function(){
        let id = $(this).attr("value");
        console.log(id)
        $.ajax({
            url:"/admin/delete_user",
            method:"POST",
            data:{
                "id": id
            },
            success: function(res){
                let code = res['code'];
                alert("删除成功！");
                location.reload();
            }
        })
    })
}

$(function(){
    delete_user();
});