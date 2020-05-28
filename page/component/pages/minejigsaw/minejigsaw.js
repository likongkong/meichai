// pages/minejigsaw/minejigsaw.js
var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
var util = require('../../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 接口地址
    comurl: app.signindata.comurl,
    gifturl: app.signindata.clwcomurl,
    version: Pub.versionNumber(),
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,
    // 授权弹框判断
    tgabox: false,

    headhidden: false,

    mType: -1,

    jigsawList: [],

    statusBarHeight: '',
    titleBarHeight: '',

    c_title: '我的拼图',
    c_arrow: true,
    c_backcolor: '#ff6968',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')
  },

  clickbar: function(v) {
    var _this = this;
    var select = v.currentTarget.dataset.select || v.target.dataset.select;
    this.setData({
      mType: select,
    })
    _this.jigsaworderlist(select);
  },

  goDetail: function(w) {
    var order_sn = w.currentTarget.dataset.order_sn || w.target.dataset.order_sn;
    setTimeout(function() {
      wx.navigateTo({
        url: "../jigsawDetail/jigsawDetail?order_sn=" + order_sn,
      })
    }, 100);
  },

  buttonClick: function() {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      goods_id: options.goods_id || '',

    });
    // 判断是否授权
    var _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // '已经授权'
          _this.data.loginid = app.signindata.loginid;
          _this.data.openid = app.signindata.openid,
          _this.setData({
            uid: app.signindata.uid,
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this)
          }
        } else {
          // 跳转获取权限页面
          wx.navigateTo({
            url: "../../../../pages/signin/signin"
          })
        }
      }
    });
    // _this.onLoadfun();

    this.setData({
      statusBarHeight: wx.getStorageSync('statusBarHeight'),
      titleBarHeight: wx.getStorageSync('titleBarHeight')
    })
  },

  onLoadfun: function() {
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
    });
    _this.jigsaworderlist(_this.data.mType);
    this.selectComponent("#hide").getappData()
    wx.hideShareMenu();
  },

  jigsaworderlist: function(mType) {
    var _this = this;
    _this.setData({
      headhidden: false,
    })
    wx.request({
      url: app.signindata.clwcomurl + 'jigsaworderlist',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        source: 4,
        vcode: _this.data.version,
        goods_id: _this.data.goods_id,
        type: mType,
        launch: 'meichai',
      },
      complete: function() {
        _this.setData({
          headhidden: true,
        })
      },
      success: function(res) {
        wx.stopPullDownRefresh();
        if (res.data.ReturnCode == 200) {
          _this.setData({
            jigsawList: res.data.List.spelling,
          })
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var _this = this
    _this.jigsaworderlist(_this.data.mType);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var _this = this;
    _this.jigsaworderlist(_this.data.mType);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(ops) {

    if (ops.from == 'button') {
      var title = ops.target.dataset.title;
      var cover = ops.target.dataset.cover;
      var order_sn = ops.target.dataset.order_sn;
      var share = {
        title: title,
        path: 'pages/getjigsaw/getjigsaw?order_sn=' + order_sn,
        imageUrl: cover,
        success: function(res) {

        }
      }
    } else {
      var share = {
        title: '拆礼物送好友',
        path: 'pages/index/index',
        imageUrl: '../images/logo.jpg',
        success: function(res) {

        }
      }
    }
    return share;

  },
})