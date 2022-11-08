var date = new Date();
var year = date.getFullYear();
var nowyear = date.getFullYear();
var month = date.getMonth()+1;
var nowmonth = date.getMonth()+1;
var dateday = date.getDate();
var todateHtml = year + '-'+ month;
var duedates = new Array();
var events = new Array();
$('#topDate').text(todateHtml)

//加载有due的日期
function load_duedates(year, month){
    $.ajax({
        method: "POST",
        url: "/event/duedates",
        async: false,
        dataType: "json",
        data: {
            "year": year,
            "month": month,
        },
        success:function(res){
            events = [];
            duedates = [];
            console.log(typeof(res.message.dates))
            // events = $.parseJSON(res.message.events)
            // dates = $.parseJSON(res.message.dates)
            for(let event of res.message.events){
                //console.log(typeof(event.id))
                events.push(event.id)
                //console.log(events.length)
            }
            for(let date of res.message.dates){
                //console.log(typeof(date.date))
                duedates.push(date.date)
                //console.log(duedates.length)
            }
        }
    })
}

//展示cld
function showcld(){
    //console.log(month, year)
    load_duedates(year, month);
    //console.log(duedates);
    var monthDay = [31,28,31,30,31,30,31,31,30,31,30,31];  // 创建数组存放每个月有多少天 ,默认2月为28天
    // 判断闰年
    if(year % 4 == 0 && year %100 != 0 || year % 400 == 0){
        monthDay[1] = 29;
    }
    // 计算每个月的天数
    var days = monthDay[month-1];
    // 判断每月第一天为周几
    date.setYear(year);        //某年
    date.setMonth(month-1);   //某年的某月
    date.setDate(1);   // 某月的某天
    var weekday = date.getDay();  // 判断某天是周几
    // 补齐一号前的空格
    var tbodyHtml = "<tr class='dates'>";
    for(var i = 0; i<weekday; i++){
        tbodyHtml += "<td></td>";
    }
    // 补齐每月的日期
    var changLine = weekday;
    var tagClass = '';
    for(i=1; i<=days; i++){//每一个日期的填充
        if(duedates.includes(i)){
            if(year == nowyear && month == nowmonth && i == dateday){
                tagClass = "'curDate hasDue'";//当前日期对应格子
            }else{
                tagClass = "'isDate hasDue'";
            }
        } else {
            if(year == nowyear && month == nowmonth && i == dateday){
                tagClass = "curDate";//当前日期对应格子
            }else{
                tagClass = "isDate";
            }
        }
        tbodyHtml += "<td class=" + tagClass + ">" + i + "</td>";
        changLine = (changLine+1)%7;
        if(changLine == 0 && i != days){//是否换行填充的判断
            tbodyHtml += "</tr><tr class='dates'>";
        }
    }
    $('#tbody').empty();   // 清空原有的内容
    $('#tbody').append(tbodyHtml);   //添加当前月份的日期内容
}

// 设置按钮点击事件
$('#left').click(function(){
    month = month-1;
    if(month < 1){
        month = 12;
        year--;
    }
    var todateHtml = year + '-'+ month;
    $('#topDate').text(todateHtml);
    showcld();
    add_due();
});

$('#right').click(function(){
    month = month+1;
    if(month > 12){
        month = 1;
        year++;
    }
    var todateHtml = year + '-'+ month;
    $('#topDate').text(todateHtml);
    showcld();
    add_due();
})

//添加小红点在日期下
function add_due(){
    $(".dates").children().each(function(){
        if($(this).hasClass("hasDue")){
            $(this).append("<div class='due'> </div>")
        }
    })
}

showcld();  //页面加载后执行函数
add_due();