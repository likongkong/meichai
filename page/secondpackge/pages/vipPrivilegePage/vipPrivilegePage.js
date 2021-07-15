var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: 'VIP特权领取', 
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var data = JSON.parse(options.data)
    // console.log(data)
    // this.data.listData = data;
    // 判断是否授权
    this.activsign();
  },
  onLoadfun:function(){
    this.setData({
      uid: app.signindata.uid,
      loginid:app.signindata.loginid
    }); 
    this.getInfo();
  },
  getInfo(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=memberVip&operation=vipPrivilegeInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    console.log('vip特权领取数据请求======','mod=memberVip&operation=vipPrivilegeInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'member.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('vip特权领取数据======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          _this.setData({
            listData:res.data.List.vipPrerogativeStyle,
            subscribedata:res.data.Info.subscribe
          })
        }else if(res.data.ReturnCode == 201){
          wx.navigateTo({ 
            url: "/pages/wode/wode"
          }) 
        }
      }
    });
  },
  getAward(e){ 
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=memberVip&operation=getVipWelfare&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&getType='+type)
    wx.request({
      url: app.signindata.comurl + 'member.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('领取vip奖励======',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          app.showToastC(res.data.Msg);
          let change = "listData["+ index +"].status";
          _this.setData({
            [change]: false,
          });
          var gbm = Dec.Aese('mod=blindBox&operation=getBlindboxMoney&uid='+_this.data.uid);
          wx.request({
            url: app.signindata.comurl + 'spread.php' + gbm,
            method: 'GET',
            header: { 'Accept': 'application/json' },
            success: function (res) {
              if (res.data.ReturnCode == 200) {
                console.log('更新抽盒金=====',res)
                app.signindata.blindboxMoney = res.data.Info.blindbox_money || "";
                app.signindata.tempBlindboxMoney = res.data.Info.tempBlindboxMoney || "";
              };
            }
          })

        }
      }
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
          _this.setData({
            tgabox: true,
            signinlayer: false
          })
          console.log()
          // '没有授权 统计'
          app.userstatistics(42);
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
    wx.navigateTo({ 
      url: "/pages/wode/wode"
    }) 
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
    this.getInfo()
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
    var reshare = app.sharemc();
    return reshare
  },
  // 订阅授权
  subscrfun:function(){
    var _this = this;
    app.comsubscribe(_this);
  },
  jumpVipPage(){
    wx.navigateTo({  
      url: "/page/secondpackge/pages/vipPage/vipPage"
    })
  },
})