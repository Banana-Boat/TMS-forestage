//////////////////////////////////////////////////////////////////////////////////////////////////////
var selectedApplication = [];   //已选择的申请

//////////////////////////////////////////////////////////////////////////////////////////////////////
//#region 展示表格、刷新
function refreshTable(){
    $.ajax({ 
        type: 'GET',
        dataType: 'JSON',
        url: '../TestData/toolEntityCheckList.json',  //后端Url，待改
        success: function(result){
            if(result.Status == 'error'){
                alert('获取数据失败，请稍后重试..');
            }else{
                $('tbody').empty();
                for(let i = 0; i < result.length; i++){
                    $('tbody').append(
                        '<tr><td><input class="checkbox" onchange="selectOne(this);" type="checkbox">'
                        + '</td><td>' + result[i].Code
                        + '</td><td>' + result[i].SeqID
                        + '</td><td>' + result[i].Workcell
                        + '</td><td>' + result[i].RemainDays
                        + '</td><td><button class="btn act-btn" onclick="check(this);">点检</button>'
                        + '</td></tr>');
                }
            }
        },
        error: function(){
            alert('获取信息失败，请刷新重试...');
        }
    });
}
$(window).on('load', refreshTable);
//#endregion

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//#region checkbox
$('#selectAll').change(function(){
    if($(this).prop('checked')){
        for(let i = 0; i < $('tbody').children().length; i++){
            $('tbody').children().eq(i).children().eq(0).children().eq(0).prop('checked', true);
            $('tbody').children().eq(i).addClass('tr-selected');
        }
    }else{
        for(let i = 0; i < $('tbody').children().length; i++){
            $('tbody').children().eq(i).children().eq(0).children().eq(0).prop('checked', false);
            $('tbody').children().eq(i).removeClass('tr-selected');
        }
    }
})
function selectOne(e){
    if(!$(e).prop('checked')){
        $(e).prop('checked', false);
        $(e).parent().parent().removeClass('tr-selected');
    }else{
        $(e).prop('checked', true);
        $(e).parent().parent().addClass('tr-selected');
    }
}
//#endregion

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//#region 单个同意、驳回
function check(e){
    var transData = [
        {
            "Code": $(e).parent().parent().children().eq(1).text(),
            "SeqID": $(e).parent().parent().children().eq(2).text()
        }
    ]
    //SubmitByAjax(transData, '');
}
//#endregion

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//#region 批量同意、驳回
function AddToSelectedApplication(){
    selectedApplication = [];
    for(let i = 0; i < $('tbody').children().length; i++){
        if($('tbody').children().eq(i).children().eq(0).children().eq(0).prop('checked')){
            selectedApplication.push({
                "Code": $('tbody').children().eq(i).children().eq(1).text(),
                "SeqID": $('tbody').children().eq(i).children().eq(1).text()
            });
        }
    }
}
function SubmitByAjax(data, url){
    $.ajax({
        type: 'POST',
        dataType: 'JSON',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(data),
        url: url,  
        success: function(result){
            if(result.Status == 'error'){
                alert('提交失败，请稍后重试...');
            }else{
                alert('提交成功！');
                refreshTable();
            }
        } 
    });
}
$('#bulkCheck').click(function(){
    AddToSelectedApplication();
    if(selectedApplication.length == 0){
        alert('您当前还未选择任何夹具！');
    }else{
        var transData = selectedApplication;
        //SubmitByAjax(transData, '');
    }
    
});
//#endregion

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//#region 回到顶部悬浮按钮
$(window).on('load', function(){
    // 获取页面可视区域的高度
    var clientHeight = document.documentElement.clientHeight;
    var timer = null;// 定义定时器变量
    var isTop = true;// 是否返回顶部
    // 滚动滚动条时候触发
    $(window).on('scroll', function(){
        // 获取滚动条到顶部高度-返回顶部显示或者隐藏
        var osTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (osTop >= clientHeight / 3) {
            $('#danglingBack').show();
        } else {
            $('#danglingBack').hide();
        }
        // 如果是用户触发滚动条就取消定时器
        if (!isTop) {
            clearInterval(timer);
        }
        isTop = false;
    });
    // 返回顶部按钮点击事件
    $('#danglingBack').click(function(){
        timer = setInterval(function() {
            // 获取滚动条到顶部高度
            var osTop = document.documentElement.scrollTop || document.body.scrollTop;
            var distance = Math.floor(-osTop / 6);
            document.documentElement.scrollTop = document.body.scrollTop = osTop + distance;
            isTop = true;
            if (osTop == 0) {
                clearInterval(timer);
            }
        }, 30);
    });
})
//#endregion