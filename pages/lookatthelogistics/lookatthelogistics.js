var Dec = require('../../common/public.js');//aes加密解密js
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
      gcover: options.gcover
    }); 
    var q = Dec.Aese('mod=getinfo&operation=ordertrace&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + options.oid)
    wx.request({
      url: app.signindata.comurl + 'order.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
            _this.setData({
               info:res.data.Info,
               list:res.data.List,
               gcoveriftr:true
            })
        };
        if (res.data.ReturnCode == 814) {
          app.showToastC('查询失败');
        };
        if (res.data.ReturnCode == 813) {
          app.showToastC('异常订单，无法查询');
        };
        if (res.data.ReturnCode == 811) {
          app.showToastC('该订单未付款，无法查询');
        };
        if (res.data.ReturnCode == 812) {
          app.showToastC('该订单尚未发货');
        };
        if (res.data.ReturnCode == 812) {
          app.showToastC('该订单尚未发货');
        };
        if (res.data.ReturnCode == 900) {
          app.showToastC('登陆状态有误');
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
    return Dec.sharemc()    
  }
})