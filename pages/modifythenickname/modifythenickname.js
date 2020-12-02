var Dec = require('../../common/public.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '展会日历', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    // 品牌详情 2 单张详情 1
    isBrandDetail:1

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
    this.data.shareUId = options.shareUId;
    // lb 品牌详情 2 单张详情 1
    //   this.setData({
    //     isBrandDetail:options.lb || 1
    //   })



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
      isAuthMobile:app.signindata.isAuthMobile
    });
    this.getData();
  },

  getData(){
    var _this = this;

    wx.showLoading({ title: '加载中...',mask:true }) 
    var q = Dec.Aese('mod=festival&operation=listWSJ&uid=' +_this.data.uid+'&loginid='+_this.data.loginid+'&shareUId='+_this.data.shareUId+'&shareDate=1');
    console.log(app.signindata.comurl + 'spread.php?mod=festival&operation=listWSJ&uid=' +_this.data.uid+'&loginid='+_this.data.loginid+'&shareUId='+_this.data.shareUId+'&shareDate=1')
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) { 
        console.log('getData====',res)
        if (res.data.ReturnCode == 200) {

        }
      },
      fail: function () {},
      complete:function(){
        wx.hideLoading()
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    var _this = this;
    return {
      title: '万圣节抢限量大体，端盒送隐藏！',
      path: 'pages/modifythenickname/modifythenickname?lb='+_this.data.isBrandDetail,
      imageUrl:'',
      success: function (res) {}
    }  
  },
  onShareTimeline:function(){
    var _this = this;
    return {
      title:'万圣节抢限量大体，端盒送隐藏！',
      query:'lb='+_this.data.isBrandDetail,
      imageUrl:''
    }
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
          console.log(11111111111111111111111111111)
          _this.setData({
            tgabox: false,
            signinlayer: false
          })
          console.log()
          // '没有授权 统计'
          app.userstatistics(44);
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

  // onPullDownRefresh: function () {
  
  // },
  // onReachBottom: function () {

  // },

  clicktganone: function () {
    this.setData({ tgabox: false })
  }, 
 

  // 跳转
  jumpOtherPage:function(w){
    var num = w.currentTarget.dataset.num || w.target.dataset.num || 100000;
    var whref = w.currentTarget.dataset.whref || w.target.dataset.whref || 100000;
    var title = w.currentTarget.dataset.title || w.target.dataset.title || '';
    app.comjumpwxnav(num,whref,title)
  },
  // 跳转我参与的
  jumpiwas:function(){
    wx.navigateTo({
      url: "/page/component/pages/iWasInvolved/iWasInvolved"
    })
  }


})