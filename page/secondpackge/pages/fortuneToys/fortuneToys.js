var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '领取抽盒金', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    is_mobile_phone:false,
    gain_source:8
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
    wx.hideShareMenu() // 禁止页面转发
  },
  onLoadfun:function(){
    this.setData({
      uid: app.signindata.uid,
      loginid:app.signindata.loginid,
      is_mobile_phone:app.signindata.mobile?true:false,
      mobile:app.signindata.mobile,
      gain_source:!app.signindata.gotTBBMBS8?8:!app.signindata.gotTBBMBS9?9:0
    }); 
  },
  getAward(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var gain_source = !app.signindata.gotTBBMBS8?8:!app.signindata.gotTBBMBS9?9:'';
    var q = Dec.Aese('mod=LuckyDraw&operation=getCashOnly&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&gain_source=' + gain_source)
    console.log('mod=LuckyDraw&operation=getCashOnly&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&gain_source=' + gain_source)
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('领取抽盒福利======',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          if(gain_source == 8){
            app.signindata.gotTBBMBS8 = true;
          }else if(gain_source == 9){
            app.signindata.gotTBBMBS9 = true;
          }
          wx.showModal({
            title: '领取成功！',
            content: '快去抽盒吧，祝您欧气爆棚',
            confirmText:'立即抽盒',
            showCancel:false,
            success (res) {
              if (res.confirm) {
                _this.jumpsmokeboxlistPage();
              }
            }
          })
        }else if(res.data.ReturnCode == 351){
          wx.showModal({
            title: '您已经领过券了',
            content: '不能重复领取',
            confirmText:'立即抽盒',
            showCancel:false,
            success (res) {
              if (res.confirm) {
                _this.jumpsmokeboxlistPage();
              }
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

  jumpsmokeboxlistPage(){
    wx.navigateTo({  
      url: "/pages/smokeboxlist/smokeboxlist"
    })
  },

  // 获取手机号
  getPhoneNumber: function(e) {
    var _this = this;
    console.log(e.detail.errMsg == 'getPhoneNumber: ok' || e.detail.errMsg == "getPhoneNumber:ok");
    if (e.detail.errMsg == 'getPhoneNumber: ok' || e.detail.errMsg == "getPhoneNumber:ok") {
      wx.login({
        success: function(res) {
          if (res.code) {
            _this.helpOther(res.code, e.detail.encryptedData, e.detail.iv)
          };
        }
      });
    } else {
      app.showToastC('获取手机号失败！');
      _this.setData({
        havephoneiftr: true
      })
    }
  },
  helpOther: function(code, encryptedData, iv) {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    });
    console.log('mod=subscription&operation=authMobile&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&iv=' + iv + '&encryptedData=' + encryptedData + '&code=' + code)
    var q1 = Dec.Aese('mod=subscription&operation=authMobile&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&iv=' + iv + '&encryptedData=' + encryptedData + '&code=' + code);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        wx.hideLoading()
        console.log('手机号授权提交=====',res)
        if(res.data.ReturnCode == 200){
          _this.setData({
            is_mobile_phone:true,
            mobile:res.data.List.phoneNumber
          });
          app.showToastC('获取手机号成功');
        }else{
          if(res.data.Msg){
            app.showToastC(res.data.Msg||'');
          };
        };
      },
      fail: function(res) {
        wx.hideLoading()
      }
    })
  },
})