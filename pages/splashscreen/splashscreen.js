var Dec = require('../../common/public.js');//aes加密解密js
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
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,
    appNowTime: app.signindata.appNowTime,
    // 判断是ios或者android
    iftriosorand: app.signindata.iftriosorand,     
    // 授权弹框
    tgabox: false,   
    iftrjump:true ,
    scene:'',
    // 图片地址
    imgUrl:'',
    countdown: '跳过\n2s',
    timer:'',
    imagewidth: 0,//缩放后的宽
    imageheight: 0,//缩放后的高 
    is_jump_index:false,
    isInToToyShow:false,
    selectedData:'',
    num:2
  },
  imageLoad: function (e) {
    var imageSize = this.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
 
  imageUtil: function (e) {
    var imageSize = {};
    var originalWidth = e.detail.width;//图片原始宽
    var originalHeight = e.detail.height;//图片原始高
    var originalScale = originalHeight / originalWidth;
    //获取屏幕宽高
    wx.getSystemInfo({
      success: function (res) {
        var windowWidth = res.windowWidth;
        var windowHeight = res.windowHeight;
        var windowscale = windowHeight / windowWidth;
        if (originalScale < windowscale) {//图片高宽比小于屏幕高宽比
          //图片缩放后的宽为屏幕宽
          imageSize.imageWidth = windowWidth;
          imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
        } else {//图片高宽比大于屏幕高宽比
          //图片缩放后的高为屏幕高
          imageSize.imageHeight = windowHeight;
          imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
        }

      }
    })
    return imageSize;
  },

  //key(需要检错的键） url（传入的需要分割的url地址）
  getSearchString:function(key, Url) {
    // 获取URL中?之后的字符
    var str = Url;
    var arr = str.split("&");
    var obj = new Object();
    // 将每一个数组元素以=分隔并赋给obj对象 
    for(var i = 0; i<arr.length; i++) {
        var tmp_arr = arr[i].split("=");
        obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
    }
    return obj[key];
  },
  // 倒计时
  countdownfun:function(){
      var _this = this;
      var num = this.data.num;
      _this.data.timer = setInterval(function(){
        num--;
        _this.setData({
          countdown:'跳过\n'+num+'s',
          num:num
        });
        if (num <= 0) {
          clearInterval(_this.data.timer);
          setTimeout(function(){
            if(!_this.data.is_jump_index){
              _this.onLoadfun();
            };
          },1000);
        };
      },1000);
  },
  clickcountdownfun:function(){
    clearInterval(this.data.timer);
    this.onLoadfun();
  },
  jumpActivity(){   // 跳转活动
    var selectedData = this.data.selectedData || {};
    if(selectedData.item_type){
      if(selectedData.item_type != 9025){
        clearInterval(this.data.timer);
      };
      app.comjumpwxnav(selectedData.item_type, selectedData.href || '', selectedData.name || '', '')
    };
  },
  onLoad: function (options) {
    var _this = this;
    console.log('onLoad======onLoad')
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      app.signindata.referee = _this.getSearchString('referee', scene) || 0;
      app.signindata.share_source = 2;
      if (_this.getSearchString('id', scene)){
        app.signindata.activity_id = _this.getSearchString('id', scene) || 0;
      }else{
        app.signindata.activity_id = _this.getSearchString('aid', scene) || 0;
      }
      _this.setData({ iftrjump: false, scene: scene});
     } else {
      _this.setData({ iftrjump: true });
     };

    wx.request({
      url: 'https://meichai-1300990269.cos.ap-beijing.myqcloud.com/produce/openScreen.json?time='+app.signindata.appNowTime,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('开机屏===',res)

        if(res.data.Info){
          var isInToToyShow = res.data.Info.isInToToyShow || false;
          _this.setData({
            isInToToyShow:isInToToyShow
          });
        };
        if(res.data && res.data.List && res.data.List.openScreen){
          var openScreen = res.data.List.openScreen || [];
          var imgnum = Math.floor(Math.random() * openScreen.length) || 0;
          var nowTime = Date.parse(new Date());//当前时间戳
          if(openScreen[imgnum]){
            var imgUrl = openScreen[imgnum].litpic+'?time=' + nowTime;
            app.signindata.tgaimg = imgUrl;
            console.log('首页开机图片===========', res,imgnum,imgUrl)
            _this.setData({
              imgUrl: imgUrl,
              selectedData:openScreen[imgnum]
            });
          }
          if(openScreen.length != 0){
            _this.countdownfun();
          }else{
            _this.clickcountdownfun();
          };
          
        }else{
          _this.clickcountdownfun();
        };    
      },
      fail: function (res) {}
    }) 
    

  },
  onLoadfun:function(){
    var _this = this;
    if (_this.data.iftrjump){
      //获取当前时间戳  
      var timestamp = Date.parse(new Date()) / 1000; 
      // timestamp>=1624903821
      if(_this.data.isInToToyShow){
        wx.reLaunch({
          url: "/page/secondpackge/pages/exhibitionlist/exhibitionlist",
          complete:function(){
            _this.data.is_jump_index = true
          }
        })
      }else{
        wx.reLaunch({
          url: "/pages/index/index",
          complete:function(){
            _this.data.is_jump_index = true
          }
        }) 
      };
      app.signindata.iftr_mc=true;
    }else{
      var scene = _this.data.scene;
      var goods_id = _this.getSearchString('goods_id', scene)||0;
      var id = _this.getSearchString('id', scene)||0;
      var aid = _this.getSearchString('aid', scene)||0;
      var indexid = _this.getSearchString('indexid', scene) || 0;
      var g = _this.getSearchString('g', scene) || 0;
      var t = _this.getSearchString('t', scene) || 0;
      var store_id = _this.getSearchString('store_id', scene) || 0;
      if (goods_id) {
        app.comjumpwxnav(998,'','');
      } else if (id){
        if (_this.getSearchString('t', scene)){
          if (_this.getSearchString('t', scene) == 2) {
            app.signindata.activity_type = 2;
            app.signindata.activity_type_share=2;
          } else if (_this.getSearchString('t', scene) == 1) {
            app.signindata.activity_type_share = 1;
          };
        };
        wx.reLaunch({
          url: '/pages/activitydetailspage/activitydetailspage?id=' + _this.getSearchString('id', scene) + '&referee=' + _this.getSearchString('referee', scene)
        }); 
      } else if (aid||indexid){
        app.signindata.typeNum = 2;
        app.comjumpwxnav(998,'','');
      } else if (g){
        app.signindata.referee = _this.getSearchString('u', scene) || 0;
        wx.reLaunch({
          url: "/pages/detailspage/detailspage?gid=" + g + '&referee=' + _this.getSearchString('u', scene) || 0
        });
      } else if (t) {
        if(t==3){ //抽签
          app.signindata.referee = _this.getSearchString('u', scene) || 0;
          app.signindata.activity_id = _this.getSearchString('i', scene) || 0;
          wx.reLaunch({
            url: "/page/component/pages/limitlottery/limitlottery?id="+_this.getSearchString('i', scene)+"&referee=" + _this.getSearchString('u', scene) + '&activity_id=' + _this.getSearchString('i', scene)
          });
        }else if(t==4) { //抽签列表
          app.signindata.referee = _this.getSearchString('u', scene) || 0;
          app.signindata.activity_id = _this.getSearchString('i', scene) || 0;
          app.comjumpwxnav(989,'','');
        }else{
          wx.reLaunch({
            url: "/page/component/pages/hidefun/hidefun?type=" + t + "&order_id=" + _this.getSearchString('o', scene) || 0,
          });
        };
      } else if (store_id){
        wx.reLaunch({
          url: "/pages/storehomepage/storehomepage?store_id=" + _this.getSearchString('store_id', scene)
        })
      }else{
        app.comjumpwxnav(998,'','');
      };

    };

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     console.log('onShow=====',this.data.selectedData)
     if(this.data.selectedData && this.data.selectedData.item_type == 9025){
       this.countdownfun();
     }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})