var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
var WxParse = require('../../../../wxParse/wxParse.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '入场核验', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    code:''
  },

  

  GetRequest(url) {  
    var url = url;
    var temp1 = url.split('?');
    var pram = temp1[1];
    var keyValue = pram.split('&');
    var obj = {};
    for (var i = 0; i<keyValue.length; i++){
        var item = keyValue[i].split('=');
        var key = item[0];
        var value = item[1];
        obj[key] = value;
    }
    return obj
 },

  //key(需要检错的键） url（传入的需要分割的url地址）
  getSearchString: function (key, Url) {
    // 获取URL中?之后的字符
    var str = Url;
    var arr = str.split("&");
    var obj = new Object();

    // 将每一个数组元素以=分隔并赋给obj对象 
    for (var i = 0; i < arr.length; i++) {
      var tmp_arr = arr[i].split("=");
      obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
    }
    return obj[key];
  },

  codeFun: function (e) {
    this.setData({code: e.detail.value});
  }, 

  setTicketInfo(){
    console.log(this.data.code)
    if(this.data.code ==''){
      wx.showToast({
        title: '请输入',
        icon: 'none',
        mask:true,
        duration:1000
      });  
      return false;
    }
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=bind&operation=verifyingRandomCode&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid +'&random_code=' + this.data.code);
    console.log('核验======'+'mod=bind&operation=verifyingRandomCode&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid +'&random_code=' + this.data.code)

    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log('提交结果======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          wx.navigateTo({
            url: "/pages/myorder/myorder?inventory=" + _this.data.inventory
          });
        }else{
          wx.showToast({
            title: res.data.Msg,
            icon: 'none',
            mask:true,
            duration:1000
          });  
        }
      }
    }); 
  },

  getCaption(obj){
      var index=obj.lastIndexOf("\=");
      obj=obj.substring(index+1,obj.length);
      return obj;
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否授权
    console.log('options========',options)
    var _this = this;
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      console.log('options.scene========',scene)
      _this.data.inventory = _this.getCaption(scene) || 0;
      console.log('inventory========111',_this.getCaption(scene))
    } else {
      console.log('inventory========222',options.inventory)
      _this.data.inventory = options.inventory || 0;
    };
    _this.activsign();
    wx.hideShareMenu();
  },
  indexpic(){
    var _this = this;
    wx.request({
      url: 'https://meichai-1300990269.cos.ap-beijing.myqcloud.com/produce/openScreen.json?time='+app.signindata.appNowTime,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if(res.data && res.data.List && res.data.List.openscreen){
          var openscreen = res.data.List.openscreen || [];
          var imgnum = Math.floor(Math.random() * openscreen.length) || 0;
          var nowTime = Date.parse(new Date());//当前时间戳
          if(openscreen[imgnum]){
            var imgUrl = openscreen[imgnum]+'?time=' + nowTime;
            app.signindata.tgaimg = imgUrl;
            console.log('首页开机图片===========', res,imgnum,imgUrl)
            _this.setData({
              imgUrl: imgUrl
            });
          }
        };    
      },
      fail: function (res) {}
    }) 
  },

  onLoadfun:function(){
    var _this = this;
    _this.setData({
      uid: app.signindata.uid,
      loginid: app.signindata.loginid,
    });  
  },
  activsign: function () {
    // 判断是否授权 
    var _this = this;
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
      return false;
    };    
    wx.getSetting({
      success: res => {
        if (true) {
          // '已经授权'
          _this.setData({
            loginid: app.signindata.loginid,
            uid: app.signindata.uid,
            openid: app.signindata.openid,
            avatarUrl: app.signindata.avatarUrl,
            isShareFun: app.signindata.isShareFun,
            isProduce: app.signindata.isProduce,
            signinlayer: true,
            tgabox: false
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this);
          }
        } else {
          console.log(11111111111111111111111111111)
          _this.setData({
            tgabox: false,
            signinlayer: false
          })
          console.log()
          // '没有授权 统计'
          app.userstatistics(49);
          _this.onLoadfun();
        }
      }
    });      
  },
  // 授权点击统计
  clicktga: function () {
    app.clicktga(2)
  },
  clicktganone: function () {
    this.setData({ tgabox: false })
  },
  // 点击登录获取权限
  userInfoHandler: function (e) {
    var _this = this;
    wx.getSetting({
      success: res => {
        if (true) {
          _this.setData({
            signinlayer: true,
            tgabox: false
          });
          _this.activsign();
          // 确认授权用户统计
          app.clicktga(4);          
        }
      }
    });
    if (e.detail.detail.userInfo) { } else {
      app.clicktga(8)  //用户按了拒绝按钮
    };
  },
  pullupsignin: function () {
    // // '没有授权'
    this.setData({
      tgabox: true
    });
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
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getInfo();
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
    var _this = this;
    return {
      title:'我正在美拆抽取展会优先入场资格，快来一起参与吧',
      path: "/page/secondpackge/pages/luckyDraw/luckyDraw?id="+_this.data.id,
      imageUrl:app.signindata.indexShareImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
    } 
  },
  // /**
  //  * 用户点击右上角分享
  //  */
  onShareTimeline:function(){
   
  },  

})