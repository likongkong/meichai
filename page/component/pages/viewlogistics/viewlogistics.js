var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginid: app.signindata.loginid,
    uid: app.signindata.uid, 
    info:'',
    list:[],
    // 图片地址
    gcover:'',
    //  显示无数据
    gcoveriftr:true,

    c_title: '物流信息',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoadfun: function () {
    this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid
    });
    this.listdata();
  },   
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      order_id: options.order_id
    }); 
    this.onLoadfun();
  },
  listdata:function(){
    var _this = this;
    Pub.postRequest(_this, 'view_logistics', { uid: _this.data.uid, loginid: _this.data.loginid, order_id: _this.data.order_id }, function (res) {
      _this.setData({
        gcoveriftr:true,
        info: res.data.Info
      })
    });
  },





  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.sharemc()    
  }
})