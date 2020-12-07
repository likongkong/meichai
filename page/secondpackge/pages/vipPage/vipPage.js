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
  iftrdetailpagen: function () {
    this.setData({
      iftrdetailpagetwo: true
    })
  },

 // 开通VIP
 openingVip:function(){

  // app.showToastC('敬请期待');
  // return false;
  wx.showLoading({ title: '加载中...'})
  var _this = this;
  var qqq = Dec.Aese('mod=memberVip&operation=vipPay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);

  console.log(app.signindata.comurl + 'member.php?' +'mod=memberVip&operation=vipPay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)

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
                 },
                'fail':function(res){

                 },
                'complete': function (res) {}
              })
      }else{       
        if (res.data.ReturnCode == 800) {
          app.showToastC('非该用户订单');
        };
        if (res.data.ReturnCode == 815) {
          app.showToastC('订单状态错误');
        };
        if (res.data.ReturnCode == 816) {
          app.showToastC('不支持的支付类型');
        };
        if (res.data.ReturnCode == 817) {
          app.showToastC('付款明细已生成');
        };
        if (res.data.ReturnCode == 201) {
          app.showToastC('微信预支付失败');
        }; 
        if (res.data.ReturnCode == 805) {
          app.showToastC('剩余库存不足');
        };   
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
    wx.login({
      success:function(){
        wx.getUserInfo({
          success: function (res) {
            _this.setData({
              avatarUrl: res.userInfo.avatarUrl,
              nickName: res.userInfo.nickName
            })
          }
        });
      }
    });
  },
  getInfo(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=memberVip&operation=vipInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
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
          var goodsDescDetails  = res.data.List.prerogativeList[0].desc.replace(/<img/gi, '<img style="width:100%;height:auto;display:block;"');
          _this.setData({
            goodsDescDetails,
            infoData:res.data.Info,
            listData:res.data.List,
            memberExpireTime:_this.formatTime(res.data.Info.memberExpireTime,'Y年M月D日')
          })
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
        if (res.authSetting['scope.userInfo']) {
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
        if (res.authSetting['scope.userInfo']) {
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
    var reshare = Dec.sharemc();
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
  }
  
})