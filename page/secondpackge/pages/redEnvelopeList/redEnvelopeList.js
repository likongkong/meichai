var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '我的红包', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,

    headSel:1,
    listdata:[]
  },
  getInfo: function (recycle = true) {
    var _this = this;

    wx.showLoading({
      title: '加载中...',
      mask:true
    });

    var q1 = Dec.Aese('mod=blindBox&operation=welfareList&uid=' + app.signindata.uid + '&loginid=' + app.signindata.loginid);

    console.log('mod=blindBox&operation=welfareList&uid=' + app.signindata.uid + '&loginid=' + app.signindata.loginid)

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        console.log('getInfo======',res)
        wx.stopPullDownRefresh();
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {

          var listData = res.data.List.welfare || {};
          var listdata = [];
          if(_this.data.headSel == 1){
              listdata = listData.luckyValue; 
          }else if(_this.data.headSel == 2){
              listdata = listData.blindboxMoney;
          };
          _this.setData({
             blindboxMoney: listData.blindboxMoney || [], // 是抽盒金的
             luckyValue: listData.luckyValue || [],  // 是幸运值的
             listdata
          });
        }
        
      },

      fail: function (res) {
        wx.stopPullDownRefresh();
        wx.hideLoading()
      }

    })
  },
  // 抽红包 幸运值
  redpagInfo: function (event) {
    var _this = this;
    var welfareId = event.currentTarget.dataset.wid || event.target.dataset.wid || 1;
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    var q = Dec.Aese('mod=blindBox&operation=getWelfareDetail&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&welfareId=' + welfareId)
   
    console.log('mod=blindBox&operation=getWelfareDetail&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&welfareId=' + welfareId)

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        console.log('领取红包',res)
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          if(res.data.Info.welfare.welfareType == 2){
            _this.setData({
              ishowredpackage: false,
              ishowpagInfo: true,
            })
          }else if(res.data.Info.welfare.welfareType == 3){
            _this.setData({
              isBlindboxPacketOne: false,
              isBlindboxPacketTwo: true,
            })
          }
          _this.setData({
            welfareInfo: res.data.Info.welfare,
            welfareList: res.data.List.welfare,
          })
        } else {
          app.showToastC(res.data.Msg);
        }
      }
    });
  },

  headSelFun(event){
    var index = event.currentTarget.dataset.index || event.target.dataset.index || 1;

    var listdata = [];
    if(index == 1){
        listdata = this.data.luckyValue || []; // 是幸运值的
    }else if(index == 2){
        listdata = this.data.blindboxMoney || []; // 是抽盒金的
    };
    this.setData({
      headSel:index,
      listdata
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否授权
    this.activsign();
  },
  onLoadfun:function(){
    var _this = this;

    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
    });

    this.getInfo()

  },
  closepagInfo: function () {
    var _this = this
    _this.setData({
      ishowpagInfo: false,
    })
    this.getInfo();
  },
  //获取用户信息
  getUserInfo(){
    var _this = this;
    wx.login({
      success:function(){
        wx.getUserInfo({
          success: function (res) {
            _this.setData({
              avatarUrl: res.userInfo.avatarUrl,
              nickName: res.userInfo.nickName
            })
          }
        });
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
  clicktganone: function () {
    this.setData({ tgabox: false })
  }, 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var reshare = Dec.sharemc();
    return reshare
  },
  
})