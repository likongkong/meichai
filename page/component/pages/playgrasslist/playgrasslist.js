var Dec = require('../../../../common/public.js'); //aes加密解密js
var WxParse = require('../../../../wxParse/wxParse.js');
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    //接口地址
    comurl: app.signindata.comurl,
    // 图片地址
    zdyurl: Dec.zdyurl(),

    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,
    avatarUrl: app.signindata.avatarUrl,
    grocerystoreiftr: app.signindata.grocerystoreiftr || 'off',
    isStore: app.signindata.isStore,
    isProduce: app.signindata.isProduce,
    // 适配苹果X
    isIphoneX: app.signindata.isIphoneX,
    defaultinformation: '',
    wxnum: "",

    // 晒单数量
    dryinglistnum: 0,
    shopnum: 0,

    c_title: '潮玩种草',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
  },


  crowdfunding: function(e) {
    var id = e.currentTarget.dataset.id || e.target.dataset.id || 0;
    wx.navigateTo({
      url: "/page/component/pages/crowdfunding/crowdfunding?aid=" + id,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;

    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.data.isNewer = app.signindata.isNewer;

    _this.setData({
      uid: app.signindata.uid,
      grocerystoreiftr: app.signindata.grocerystoreiftr || 'off',
      isStore: app.signindata.isStore,
      isProduce: app.signindata.isProduce,
      avatarUrl: app.signindata.avatarUrl,
    });



    _this.getlist();

    _this.getdefault();

    var clouddata = { type:15};
    app.cloudstatistics('exhibitionList', clouddata)
    
  },

  getdefault: function() {
    // 调取晒单数量
    var _this = this;
    Dec.dryingSum(_this, app.signindata.clwcomurl);
    var qqq = Dec.Aese('operation=info&mod=info');
    // 获取默认信息
    wx.request({
      url: app.signindata.comurl + 'general.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            defaultinformation: res.data.Info,
            wxnum: res.data.Info.cs.wxid || 'meichai666666',
          });
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
        // 购物车数据显示
        Dec.shopnum(_this,app.signindata.comurl);
      }
    });
    // 统计推送进入
    if (_this.data.pushWay > 0) {
      app.pushfun(_this);
    }
  },

  getlist: function() {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    var qqq = Dec.Aese('mod=wtb&operation=getList');
    wx.request({
      url: app.signindata.comurl + 'spread.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        console.log('种草列表=============',res)
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          _this.setData({
            listdata: res.data.List.activity,
          })
        };
      }
    });

  },

  // 计算图片大小
  imageLoadad: function(e) {
    var _this = this;
    var indexnum = e.currentTarget.dataset.indexnum || e.target.dataset.indexnum || 0;
    var listdata = _this.data.listdata || [];
    var $width = e.detail.width,
      $height = e.detail.height,
      ratio = $width / $height;
    var viewWidth = 714,
      viewHeight = 714 / ratio;
    if (listdata[indexnum]) {
      listdata[indexnum].heightc = viewHeight;
      _this.setData({
        listdata: listdata
      })
    };
  },

  // 计算图片大小
  imageLoadlogo: function(e) {
    var _this = this;
    var indexnum = e.currentTarget.dataset.indexnum || e.target.dataset.indexnum || 0;
    var listdata = _this.data.listdata || [];
    var $width = e.detail.width,
      $height = e.detail.height,
      ratio = $width / $height;
    var viewWidth = 100 * ratio,
      viewHeight = 100;
    if (listdata[indexnum]) {
      listdata[indexnum].widthlogo = viewWidth < 150 ? viewWidth : 150;
      _this.setData({
        listdata: listdata
      })
    };
  },

  // 导航跳转
  whomepage: function() {
    setTimeout(function() {
      wx.reLaunch({
        url: "/pages/index/index?judgeprof=2"
      });
    }, 100);
  },

  dlfindfun: function() {
    setTimeout(function() {
      wx.reLaunch({
        url: "/page/component/pages/dlfind/dlfind",
      })
    }, 100);
  },

  // 导航跳转 
  wnews: function() {
    var _this = this;
    setTimeout(function() {
      app.limitlottery(_this);
    }, 100);
  },

  wshoppingCart: function() {
    setTimeout(function() {
      wx.redirectTo({
        url: "/pages/shoppingCart/shoppingCart"
      });
    }, 100);
  },

  wmy: function() {
    app.signindata.iftr_mc = true;
    setTimeout(function() {
      wx.redirectTo({
        url: "/pages/wode/wode"
      });
    }, 40);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getlist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})