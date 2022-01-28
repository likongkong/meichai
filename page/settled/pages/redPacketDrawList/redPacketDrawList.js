var Dec = require('../../../../common/public.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newdataexh:Date.parse(new Date())/1000,
    c_title: '红包封面抽选', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
  },
  getInfo(){
    var _this = this;
    wx.showLoading({ title: '加载中...',mask:true})
    var q = Dec.Aese('mod=lotto&operation=list&uid='  + _this.data.uid + '&loginid=' + _this.data.loginid + '&specialCate=1');
    console.log('mod=lotto&operation=list&uid='  + _this.data.uid + '&loginid=' + _this.data.loginid + '&specialCate=1')
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('红包封面抽选数据======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          _this.setData({
            infoData:res.data.Info || [],
            listData:res.data.List.activity || [],
          })
        }else{
          app.showToastC(res.data.Msg || res.data.msg)
        }
      }
    }); 
  },
  // 跳转抽签详情
  limitlotteryd: function(w) {
    var id = w.currentTarget.dataset.gid || w.target.dataset.gid;
    wx.navigateTo({
      url: "/page/component/pages/limitlottery/limitlottery?list=1&id=" + id
    });
  },
  onLoad: function (options) {
    wx.hideShareMenu();
    this.activsign();
  },
  onLoadfun:function(){
    var _this = this;
    _this.setData({
      uid: app.signindata.uid,
      loginid: app.signindata.loginid,
    });  
    _this.getInfo();
  },
  activsign: function () {
    // 判断是否授权 
    var _this = this;
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
      return false;
    };    
    // '已经授权'
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
    });
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
    } else {
      app.signin(_this);
    };      
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
  // onShareAppMessage: function () {
  //   var reshare = app.sharemc();
  //   return reshare
  // },

  // onShareTimeline:function(){
  //   var _this = this;
  //   return {
  //     title: '优先入场资格刮刮卡',
  //     query:'share_uid='+_this.data.uid,
  //     imageUrl:_this.data.shareImg,
  //   }
  // },
  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {
  //   var _this = this;
  //   return {
  //     title: '优先入场资格刮刮卡',
  //     path: '/page/secondpackge/pages/luckyDraw/luckyDraw?share_uid='+_this.data.uid,
  //     imageUrl:_this.data.shareImg,
  //     success: function (res) {}
  //   }      
  // },


  onShareAppMessage: function () {
  },
  onShareTimeline:function(){
  },  
})