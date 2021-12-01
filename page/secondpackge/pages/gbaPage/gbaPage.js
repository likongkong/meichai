var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
var WxParse = require('../../../../wxParse/wxParse.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '攻略', 
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
    console.log(options)
    let that = this;
    wx.request({
      url: options.webview+'?time='+app.signindata.appNowTime,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log(res)
        if(options.from == "blindBox"){  //抽盒机
          WxParse.wxParse('article', 'html', res.data.blindBox, that,5);
        }else if(options.from == "showBox"){  //原价抽明盒
          WxParse.wxParse('article', 'html', res.data.showBox, that,5);
        }else if(options.from == "blindBoxList"){  //原价抽明盒
          WxParse.wxParse('article', 'html', res.data.wholeBoxHideRole, that,5);
        }
      },
      fail: function (res) {}
    }) 

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

  }
})