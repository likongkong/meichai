var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: 'VIP', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    tabNum:0,
    iftrdetailpagetwo: false,
    expiryMonth:12
  },
  getUserProfile(){
    app.getUserProfile(this.getUserInfo)
  },
  toggleTab(e){
    this.setData({
      expiryMonth:e.currentTarget.dataset.expirymonth,
      tabNum:0
    })
  },
  toggleShowVipPrivilegeFun(e){
    if(e.currentTarget.dataset.index == this.data.tabNum){
      this.setData({
        tabNum:0
      })
    }else{
      this.setData({
        tabNum:e.currentTarget.dataset.index
      })
    }
  },
  iftrdetailpageb: function () {
    this.setData({
      iftrdetailpagetwo: false
    });
  },
  iftrdetailpagen: function (e) {
    var goodsDescDetails  = e.currentTarget.dataset.desc.replace(/<img/gi, '<img style="width:100%;height:auto;display:block;"');
    this.setData({
      goodsDescDetails,
      iftrdetailpagetwo: true
    })
  },

  // 更新用户信息
  getUserProfileCom(w){
    console.log(1111111)
    app.getUserProfile((res,userInfo) => {
      this.openingVip();
    },'',1);
  },
 // 开通VIP
 openingVip:function(){
  // app.showToastC('敬请期待');
  // return false;
  wx.showLoading({ title: '加载中...'})
  var _this = this;
  var qqq = Dec.Aese('mod=memberVip&operation=vipPay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&expiryMonth='+_this.data.expiryMonth);

  console.log(app.signindata.comurl + 'member.php?' +'mod=memberVip&operation=vipPay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&expiryMonth='+_this.data.expiryMonth)

  wx.request({
    url: app.signindata.comurl + 'member.php' + qqq,
    method: 'GET',
    header: { 'Accept': 'application/json' },
    success: function (res) {
      console.log('开通VIP',res)
      wx.hideLoading();
      if (res.data.ReturnCode == 200) {
         _this.paymentmony(res.data.Info.cart_id)
      };
    }
  }) 
},
// 微信支付
paymentmony:function(cart_id){
  var _this = this; 

  console.log('微信支付===', app.signindata.comurl + 'order.php?'+'mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + cart_id + '&xcx=1' + '&openid=' + app.signindata.openid)

  var q = Dec.Aese('mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + cart_id + '&xcx=1' + '&openid=' + app.signindata.openid)
  wx.request({
    url: app.signindata.comurl + 'order.php'+q,
    method: 'GET',
    header: { 'Accept': 'application/json' },
    success: function (res) {
      if (res.data.ReturnCode == 200) {
            wx.requestPayment({
                'timeStamp': res.data.Info.timeStamp.toString(),
                'nonceStr': res.data.Info.nonceStr,
                'package': res.data.Info.package,
                'signType': 'MD5',
                'paySign': res.data.Info.paySign,
                'success': function (res) {          
                  _this.getInfo();

                  app.signindata.isVip = true;

                 },
                'fail':function(res){

                 },
                'complete': function (res) {}
              })
      }else{       
        app.showModalC(res.data.Msg || res.data.msg || '');
      };   
    }
  })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否授权
    this.activsign();
  },
  onLoadfun:function(){
    this.getUserInfo();
    this.getInfo();
  },
  //获取用户信息
  getUserInfo(){
    var _this = this;
    _this.setData({
      avatarUrl: app.signindata.userInfo.avatarUrl,
      nickName: app.signindata.userInfo.nickName
    })
  },
  getInfo(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=memberVip&operation=vipInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    console.log('mod=memberVip&operation=vipInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'member.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('vip数据======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          _this.setData({
            infoData:res.data.Info,
            listData:res.data.List,
            memberExpireTime:_this.formatTime(res.data.Info.memberExpireTime,'Y年M月D日'),
          })
          if(res.data.Info.openMember){
            _this.setData({
              expiryMonth:res.data.Info.VIPType
            })
          }
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
          console.log(11111111111111111111111111111)
          _this.setData({
            tgabox: false,
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
    this.getInfo()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  clicktganone: function () {
    this.setData({ tgabox: false })
  }, 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var reshare = app.sharemc();
    return reshare
  },
  formatTime(number, format) {
    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];
    var date = new Date(number * 1000);
    returnArr.push(date.getFullYear());
    returnArr.push(date.getMonth() + 1);
    returnArr.push(date.getDate());
    returnArr.push(date.getHours());
    returnArr.push(date.getMinutes());
    returnArr.push(date.getSeconds());
   
    for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
  },
  jumpVipClause(){
    wx.navigateTo({  
      url: "/page/secondpackge/pages/vipClausePage/vipClausePage"
    })
  }
  
})