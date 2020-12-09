var Dec = require('../../common/public.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,


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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options===',options)
    var _this = this;

    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      console.log('options========',scene)
      this.setData({
        oid: _this.getSearchString('referee', oid) || 0,
      })
    } else {
      console.log(2)
      this.setData({
        oid: options.oid || 0,
      })
    };

    // 判断是否授权
    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      this.onLoadfun();
    }else{
      this.activsign();
    };
  },
  onLoadfun:function(){
    // '已经授权'
    this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      isAuthMobile:app.signindata.isAuthMobile,
      isProduce: app.signindata.isProduce,
    });

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    var _this = this;

    // return {
    //   title: '这个展会限量版日历太好看了，快来为Ta投票免费拿',
    //   path:shareUrl,
    //   imageUrl:imageUrl,
    //   success: function (res) {}
    // }  
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
        if (res.authSetting['scope.userInfo']) {
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
          console.log(111111)
          _this.setData({
            tgabox: false,
            signinlayer: false
          });
          _this.onLoadfun();

          // '没有授权 统计'
          app.userstatistics(46);

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
        if (res.authSetting['scope.userInfo']) {
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

  onPullDownRefresh: function () {

  },
  onReachBottom: function () {


  },

  clicktganone: function () {
    this.setData({ tgabox: false })
  }, 
 

})