
var Dec = require('../../../../common/public');//aes加密解密js
var tcity = require("../../../../common/citys.js");
var api = require("../../../../utils/api.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '图鉴',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    detailData:{},
    movies:[
      'https://cdn.51chaidan.com/images/202106/source_img/38364_P_1624887986673.jpg',
      'https://cdn.51chaidan.com/images/202106/source_img/38364_P_1624887986197.jpg',
      'https://cdn.51chaidan.com/images/202106/source_img/38364_P_1624887986516.jpg',
      'https://cdn.51chaidan.com/images/202106/source_img/38364_P_1624887986766.jpg'
    ]
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.hideShareMenu();
    
    // '已经授权'
    _this.data.loginid = app.signindata.loginid;
    _this.data.uid = app.signindata.uid;
    _this.data.orderid = options.orderid
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
    } else {
      app.signin(_this)
    }
  },
  onLoadfun(){
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.uid = app.signindata.uid;
    _this.setData({
      uid: app.signindata.uid,
      avatarUrl: app.signindata.avatarUrl,
      isProduce: app.signindata.isProduce,
      isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
    });
    if(wx.getStorageSync('access_token')){
      this.getData();
    }else{
      app.getAccessToken(_this.getData)
    };
  },
  // 获取数据
  getData(){
    var _this = this;
    console.log('=========================')
    // api.oMbrandInfo(_this.data.orderid,{}).then((res) => {
    //   console.log('订单详情=======',res)
    //  if (res.data.status_code == 200) {
    //      var detailData = res.data.data.Info.order;
    //      detailData.order.payTimeTrans = _this.toDate(detailData.order.payTime);
    //      detailData.order.addTimeTrans = _this.toDate(detailData.order.addTime);
    //      detailData.order.deliverTimeTrans = _this.toDate(detailData.order.deliverTime);
    //      detailData.order.shippingTimeTrans = _this.toDate(detailData.order.shippingTime);
    //      _this.setData({
    //        detailData:res.data.data.Info.order || {}
    //      })

    //  }else{
    //    if(res.data && res.data.message){
    //      app.showModalC(res.data.message); 
    //    };        
    //  }
    // })
 },  


  toDate(number,num) {
    var date = new Date(number * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + '/' + M + '/' + D +' ' + h + ':' + m + ':' +s;
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
    app.downRefreshFun(() => {
      this.getData()
    })  
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
    
  },

})
