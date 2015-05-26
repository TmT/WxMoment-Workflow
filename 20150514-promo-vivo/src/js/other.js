$(document).ready(function(){
    // 放大元素,按照320x504定位,按比例scale
    function scaleEle(selector,position){
        var pageScale;
        var currentScale=screenWidth/screenHeight;
        var originScale=320/504;
        if(currentScale>originScale){
            pageScale=screenHeight/504;
        }else{
            pageScale=screenWidth/320;
        }
        $(selector).css({"-webkit-transform-origin":position,"transform-origin":position,"-webkit-transform":"scale("+pageScale+");","transform":"scale("+pageScale+");"});
    }

    var screenHeight = document.documentElement.clientHeight,
        screenWidth = document.documentElement.clientWidth;

    scaleEle(".screen__inner","center");
});