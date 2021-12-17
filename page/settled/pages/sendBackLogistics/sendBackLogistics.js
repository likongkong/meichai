var Dec = require('../../../../common/public.js');//aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 接口地址
    comurl: app.signindata.comurl,
    // 图片地址
    zdyurl: Dec.zdyurl(),
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
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoadfun: function () {
    this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid
    });
    this.selectComponent("#hide").getappData()
  },   
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      id: options.id || 0,
      gcover: options.gcover
    }); 
    let q = Dec.Aese('mod=send_back&operation=show_shipping_track&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + this.data.id)
    wx.request({
      url: app.signindata.comurl + 'order.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log(res)
        if (res.data.ReturnCode == 200) {
            _this.setData({
               info:res.data.Info,
               list:res.data.List,
               gcoveriftr:true
            })
        };
      },
      fail: function () {
        // fail
      }
    })
  },






  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.sharemc()    
  }
})