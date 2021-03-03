var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '拍卖详情', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    subscribedata:'',
    bidRange:0,
    lastBidPrice:0,
    currentBidPrice:0,
    depositPopMask:false,
    bidPopMask:false,
    bidSucceedPopMask:false,
    inviteFriendsPopMask:false,
    auctionResultPopMask:false,
    noticePopMask:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.data.share_uid = options.share_uid || 0
    // 判断是否授权
    this.activsign();
    this.getInfo();
  },
  onLoadfun:function(){
    this.setData({
      uid: app.signindata.uid,
      loginid:app.signindata.loginid,
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
          _this.setData({
            tgabox: true,
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
    wx.navigateTo({ 
      url: "/pages/wode/wode"
    }) 
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

  changetabbar(e){
    this.setData({
      currentNum: e.currentTarget.dataset.ind
    })
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
    this.getInfo();
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
    var reshare = app.sharemc();
    return reshare
  },
   /**
   * 用户点击右上角分享朋友圈
   */
  onShareTimeline:function(){
    var _this = this;
    return {
      title:_this.data.c_title || '潮玩社交平台',
      query:{}    
    }
  },

  //跳转我的拍卖
  jumpMyAuctionList(){
    wx.navigateTo({  
      url: "../myAuctionList/myAuctionList"
    })
  },

  getInfo(){
    var _this = this;
    var id = 318834;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=auction&operation=info&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + id + '&share_uid='+_this.data.share_uid)
    console.log('拍卖详情请求数据===','mod=auction&operation=info&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + id + '&share_uid='+_this.data.share_uid)
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('拍卖详情数据======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          var goodsDescDetails  = res.data.Info.goodsDesc.replace(/<img/gi, '<img style="width:100%;height:auto;display:block;"');
          _this.setData({
            goodsDescDetails,
            dataInfo:res.data.Info,
            bidRange:res.data.Info.auctionRule.bid_increment,
            lastBidPrice:res.data.Info.currentPrice,
            currentBidPrice:res.data.Info.currentPrice,
            subscribedata:res.data.subscribe || ''
          })
        } else {
          app.showToastC(res.data.msg);
        }
      }
    });
  },
  hideMask(){
    this.setData({
      depositPopMask:false,
      bidPopMask:false,
      bidSucceedPopMask:false,
      inviteFriendsPopMask:false,
      auctionResultPopMask:false,
      noticePopMask:false,
    })
  },

  //立即参拍
  joinAuctionFun(){
    this.setData({
      depositPopMask: true
    })
  },

  //竞拍须知
  noticePopShow(){
    this.setData({
      noticePopMask: true
    })
  },

  //支付保证金
  depositPay(){

  },
  // 微信支付
  paymentmony: function () {
    var _this = this;
    var q = Dec.Aese('mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + _this.data.cart_id + '&xcx=1' + '&openid=' + _this.data.openid)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          // 支付完成弹框显示数据
          var payinfo = res.data.Info;
          wx.requestPayment({
            'timeStamp': res.data.Info.timeStamp.toString(),
            'nonceStr': res.data.Info.nonceStr,
            'package': res.data.Info.package,
            'signType': 'MD5',
            'paySign': res.data.Info.paySign,
            'success': function (res) {

            },
            'fail': function (res) {
            },
            'complete': function (res) {
              // 订阅授权
            }
          })
        } else {
          // 提交订单蒙层
          _this.setData({
            suboformola: false
          });
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
          // 判断非200和登录
          Dec.comiftrsign(_this, res, app);
        };
      }
    })
  },

  // 加价
  addPriceFun(){
    this.setData({
      currentBidPrice: Number(this.data.currentBidPrice)+Number(this.data.bidRange)
    })
  },
  // 减价
  minusPriceFun(){
    if(Number(this.data.currentBidPrice)-Number(this.data.bidRange) != 0){
      this.setData({
        currentBidPrice: Number(this.data.currentBidPrice)-Number(this.data.bidRange)
      })
    }
  },
  // 出价竞拍
  bidBtnFun(){
    var _this = this;
    var id = 318834;
    if( (_this.data.currentBidPrice%_this.data.bidRange) != 0 || _this.data.currentBidPrice <= _this.data.lastBidPrice){
      wx.showToast({
        title: `出价金额需高于当前出价且为 ${_this.data.bidRange} 的倍数`,
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=auction&operation=offer&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + id + '&lastOffer='+ _this.data.lastBidPrice + '&offerPrice='+_this.data.currentBidPrice)
    console.log('mod=auction&operation=offer&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + id + '&lastOffer='+ _this.data.lastBidPrice + '&offerPrice='+_this.data.currentBidPrice)
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('出价竞拍======',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          app.showToastC(res.data.Msg);
        }else{
          app.showToastC(res.data.Msg);
        }
      }
    }); 
  },
  // 拉起订阅
  subscrfun: function () {
    var _this = this;
    var subscribedata = _this.data.subscribedata || '';
    if (subscribedata && subscribedata.template_id && app.signindata.subscribeif) {
      if (subscribedata.template_id instanceof Array) {
        wx.requestSubscribeMessage({
          tmplIds: subscribedata.template_id || [],
          success(res) {
            var is_show_modal = true;
            for (var i = 0; i < subscribedata.template_id.length; i++) {
              if (res[subscribedata.template_id[i]] == "accept") {
                app.subscribefun(_this, 0, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
                if (is_show_modal) {
                  _this.subshowmodalfun();
                  is_show_modal = false;
                };
              };
            };
          },
          complete() { }
        })
      } else {
        wx.requestSubscribeMessage({
          tmplIds: [subscribedata.template_id || ''],
          success(res) {
            if (res[subscribedata.template_id] == "accept") {
              app.subscribefun(_this, 0, subscribedata.template_id, subscribedata.subscribe_type);
              _this.subshowmodalfun();
            };
          }
        })
      };
    };
  },

})