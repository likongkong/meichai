var Pub = require('../../common/mPublic.js'); //aes加密解密js
var Dec = require('../../../../common/public.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid, 
    page:0,
    coin:9,

    c_title: '拆币记录',
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
      listdata:'',
      coin: options.coin||0
    });
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
      return false;
    };
    // 判断是否授权 
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // '已经授权'
          _this.setData({
            loginid: app.signindata.loginid,
            uid: app.signindata.uid,
            openid: app.signindata.openid
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
  },
  onLoadfun:function(){
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid
    });
    _this.listdata(1)
  },
  listdata: function (num){
    var _this = this;
    if (num == 1) {
      _this.setData({ page: 0 });
    } else {
      var pagenum = parseInt(_this.data.page)
      _this.setData({ page: ++pagenum });
    };
    Pub.postRequest(_this, 'currencyRecord', { uid: _this.data.uid, loginid: _this.data.loginid, page: _this.data.page }, function (res) {
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh(); 
        var listdataone = res.data.List || [];
        if (listdataone.length!=0){
          if (num == 1) {
            _this.setData({
              listdata: listdataone
            });
          } else {
            var ltlist = _this.data.listdata.concat(listdataone);
            _this.setData({ listdata: ltlist });
          };
        }else{
          app.showToastC('暂无更多数据');
        }

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
    this.listdata(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.listdata(2)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return Dec.sharemc()
  }
})