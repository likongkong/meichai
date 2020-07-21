var Dec = require('../../../../common/public.js');//aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 接口地址
    comurl: app.signindata.comurl,
    // 图片地址
    zdyurl: Dec.zdyurl(),   
    //  默认数据
    webview:'',
    imgurl:'',
    // 后台默认
    img_url:"",
    title:'',

    c_title: '美拆',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    if (options.webview) { var url = decodeURIComponent(options.webview); } else { var url = "";};
    if (options.imgurl) { var imgurl = decodeURIComponent(options.imgurl); } else { var imgurl = "";};
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    if (imgurl!=""){
      if (!reg.test(imgurl)) {
        imgurl = this.data.zdyurl + imgurl;
      }; 
    };
    this.setData({
       webview: url,
       imgurl: imgurl
    });
    
    // 分享内容数据
    wx.request({
      url: app.signindata.comurl + 'share_for_xcx.php?url=' + url,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        var img_url = '', title = '';
        if (res.data.img_url) { img_url = res.data.img_url; };
        if (res.data.title) { title = res.data.title; };
        _this.setData({
          img_url: img_url,
          title: title
        });
      }
    }); 
       
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  // 跳转首页
  frontpagebutton: function () {
    wx.reLaunch({     //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
      url: '/pages/index/index'
    })
  },



  /**
   * 用户点击右上角分享
   */
  onShareTimeline:function(){
    var _this = this;
    return {
      title:_this.data.c_title || '潮玩社交平台',
      query:{'webview':encodeURIComponent(_this.data.webview)}    
    }
  },
  onShareAppMessage: function () {
    var _this = this;
    var pageurl = '/page/component/pages/webview/webview?webview=' + encodeURIComponent(_this.data.webview) + "&imgurl=" + encodeURIComponent(_this.data.imgurl);
    if (this.data.img_url || this.data.imgurl){
      return {
        title: _this.data.title || '新品潮玩都在这里！',
        path: pageurl,
        imageUrl: _this.data.img_url || _this.data.imgurl,
        success: function (res) {}
      }
    }else{
      return {
        title: _this.data.title || '新品潮玩都在这里！',
        path: pageurl,
        success: function (res) {}
      }      
    };
    
  }
})