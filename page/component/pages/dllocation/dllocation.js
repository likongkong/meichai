var Pub = require('../../common/mPublic.js'); //aes加密解密js
var Dec = require('../../../../common/public.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location:false,
    // 接口地址
    comurl: app.signindata.comurl,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,
    appNowTime: Date.parse(new Date()),
    // 适配苹果X 
    isIphoneX: app.signindata.isIphoneX,
    // 是否显示杂货铺
    grocerystoreiftr: app.signindata.grocerystoreiftr || 'off', 
    listdata:[],
    page:1,

    c_title: '所在位置',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      grocerystoreiftr: app.signindata.grocerystoreiftr || 'off',
    });
    // 获取当前的地理位置
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {//非初始化进入该页面,且未授权
          _this.setData({
            location: true
          });
        } else if (res.authSetting['scope.userLocation'] == undefined) {//初始化进入
          _this.getLocation();
        }
        else { //授权后默认加载
          _this.getLocation();
        }
      }
    });
  },

  // 授权取消按钮
  apptipleftfun: function () {
    this.setData({
      location: false
    });
  },
  handler: function (e) {
    var that = this;
    if (e.detail.authSetting['scope.userLocation']) {
      that.setData({
        location: false
      });
      that.getLocation();
    } else {
      that.setData({
        location: false
      });
    };
  },
  jumpbackgcreat:function(w){
    var title = w.currentTarget.dataset.title || w.target.dataset.title || 0;
    var pages = getCurrentPages();             //  获取页面栈
    var currPage = pages[pages.length - 1];    // 当前页面
    var prevPage = pages[pages.length - 2];    // 上一个页面
    setTimeout(function(){
      prevPage.setData({
        locationtitle: title,
      });
      wx.navigateBack({
        success: function () {
          prevPage.locationfun(title); // 执行前一个页面的onLoad方法  
        }
      });
    },100);

  },
  // 位置数据
  listdata: function (num){
    var _this = this;
    if (num == 0) {
      _this.data.page = 1;
    } else {
      var pagenum = parseInt(_this.data.page)
      _this.data.page = ++pagenum;
    };
    Pub.postRequest(_this, 'mapList', { uid: _this.data.uid, loginid: _this.data.loginid, longitude: _this.data.longitude, latitude: _this.data.latitude, page: _this.data.page }, function (res) {
      var listdata = res.data.List||[];
      if (listdata.length!=0){
        if (num == 0) {
          _this.setData({ listdata: listdata });
        } else {
          var ltlist = _this.data.listdata.concat(listdata);
          _this.setData({ listdata: ltlist });
        };
      }else{
        app.showToastC('暂无更多数据');
      }

    });
  },
  // 获取经纬度
  getLocation: function () {
    var _this = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude || 0;
        var longitude = res.longitude || 0;
        _this.data.latitude = latitude;
        _this.data.longitude = longitude;
        _this.listdata(0);
      },
      fail: function () {
        _this.setData({
          location: true
        });
      }
    })
  }, 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.listdata(1);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var reshare = Dec.sharemc();
    return reshare 
  }
})