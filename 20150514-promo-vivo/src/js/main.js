var basePath = 'http://wximg.gtimg.com/tmt/_events/20150514-promo-vivo/dist/';

if (!(typeof webpsupport == 'function')) {
    var webpsupport = function (cb) {
        cb();
    }
}

webpsupport(function (webpa) {
    var loader = new WxMoment.Loader(),
        fileList = [
            'img/logo.png',
            'img/screen1_bg.jpg',
            'img/screen1_icon.png',
            'img/screen1_pic1.png',
            'img/screen1_pic2.png',
            'img/screen1_txt1.png',
            'img/screen1_txt2.png',
            'img/screen1_txt3.png',
            'img/screen1_txt4.png',
            'img/screen2_bg.jpg',
            'img/screen2_icon.png',
            'img/screen2_pic1.png',
            'img/screen2_pic2.png',
            'img/screen2_pic3.png',
            'img/screen2_pic4.png',
            'img/screen2_pic5.png',
            'img/screen2_txt1.png',
            'img/screen2_txt2.png',
            'img/screen2_txt3.png',
            'img/screen2_txt4.png',
            'img/screen3_bg.jpg',
            'img/screen3_icon.png',
            'img/screen3_pic1.png',
            'img/screen3_txt2.png',
            'img/screen3_txt3.png',
            'img/screen3_txt4.png',
            'img/screen4_bg.jpg',
            'img/screen4_icon.png',
            'img/screen4_pic1.png',
            'img/screen4_pic2.png',
            'img/screen4_pic3.png',
            'img/screen4_pic4.png',
            'img/screen4_pic5.png',
            'img/screen4_pic6.png',
            'img/screen4_pic7.png',
            'img/screen4_pic8.png',
            'img/screen4_txt1.png',
            'img/screen4_txt2.png',
            'img/screen4_txt3.png',
            'img/screen4_txt4.png',
            'img/screen5_pic1.png',
            'img/screen5_txt1.png',
            'img/screen5_txt2.png',
            'img/screen5_txt3.png',
            'img/screen5_txt4.png',
            'img/screen_arrow.png',
            'img/screen_btn.png',
            'img/thumb.jpg'
        ];

    for (var i = 0; i < fileList.length; i++) {
        var basename = fileList[i].substring(fileList[i].lastIndexOf('/') + 1);

        if (webpa && img_map && (basename in img_map) && img_map[basename]) { //if webp
            var path = fileList[i].replace(/\.\w+/, '.webp');
        } else {
            var path = fileList[i];
        }

        loader.addImage(basePath + path);
    }

    loader.addCompletionListener(function () {
        $('.loading').remove();
        $('.screen').eq(0).addClass('current');
        $('.wrap').show();
    });

    //loading 进度监听
    loader.addProgressListener(function (e) {
        var percentUp = Math.round((e.completedCount / e.totalCount) * 100), //正序, 1-100
            progressDown = 100 - percentUp;                                   //倒序, 100-1


        $('.loading-num').text(percentUp + '%');
    });

    //启动
    loader.start();
});


//旋屏提示
new WxMoment.OrientationTip();

//切换
new WxMoment.PageSlider({
    pages: document.querySelectorAll('.screen')
});

//分享
new WxMoment.Share({
    //分享到朋友圈
    'moment': {
        'title': '回归，是创造手品之美的起点',
        'desc': "回归美的原点，vivo创造手品之美，X5Pro心动上市"
    },
    //分享给好友
    'friend': {
        'title': "回归，是创造手品之美的起点",
        'desc': "回归美的原点，vivo创造手品之美，X5Pro心动上市"
    },
    'global': {
        'img_url': basePath + "img/thumb.jpg",
        'link': window.location.href.split("?")[0].replace(/([&|\?]{1})ticket=[\w\-]+(&?)/, '$1').replace(/\?$/, '')
    }
});

var wa = new WxMoment.Analytics({
    //projectName 请与微信商务团队确认
    projectName: "20150514VIVO"
});

//可以统计到按钮的点击事件
$('#J-btn').click(function () {
    //两个必填参数，分别为: 事件分类、事件名称
    wa.sendEvent('click', 'yuyue');
});
