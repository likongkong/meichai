var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();

var WxParse = require('../../../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '展会优先入场资格', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    listData:[],
    type:1,
  },

  plusXing (str,frontLen,endLen) {
    var len = str.length-frontLen-endLen;
    var xing = '';
    for (var i=0;i<len;i++) {
    xing+='*';
    }
    return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.data.share_uid = options.share_uid || 0
    // 判断是否授权
    this.activsign();
    // 活动介绍
    wx.request({
      url: 'https://www.51chaidan.com/produce/lottoPrior.json',
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log(res.data.tip)
        WxParse.wxParse('article', 'html', res.data.tip, _this, 0);
        var descDetails  = res.data.tip;
        _this.setData({
          descDetails
        })
      }
    })
  },
  onLoadfun:function(){
    var _this = this;
    _this.setData({
      uid: app.signindata.uid,
      loginid:app.signindata.loginid
    });  

    this.getInfo();
  },
  getInfo(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=lottoPrior&operation=info&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    console.log('mod=lottoPrior&operation=info&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('详情数据======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          var ticket = res.data.List.ticket;
          for(var i=0;i<ticket.length;i++){
            ticket[i].actualidcard = ticket[i].idcard;
            ticket[i].idcard = _this.plusXing(ticket[i].idcard,4,4);
            ticket[i].consignee = _this.plusXing(ticket[i].consignee,1,0);
            ticket[i].mobile = _this.plusXing(ticket[i].mobile,3,4);
          }
          _this.setData({
            subscribedata:res.data.Info.subscribe,
            listData:ticket
          });  
        }
      }
    }); 
  },
  signup(e){
    let id = e.currentTarget.dataset.id;
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=lottoPrior&operation=sign&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&ticketId=' + id)
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('报名数据======',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          app.showToastC('报名成功')
          _this.subscrfun();
          setTimeout(function(){
            _this.getInfo();
          },1500)
        }
      }
    }); 
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
          app.userstatistics(48);
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
  // onShareAppMessage: function () {
  //   var reshare = app.sharemc();
  //   return reshare
  // },

  // onShareTimeline:function(){
  //   var _this = this;
  //   return {
  //     title: '优先入场资格抽选',
  //     query:'share_uid='+_this.data.uid,
  //     imageUrl:_this.data.shareImg,
  //   }
  // },
  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {
  //   var _this = this;
  //   return {
  //     title: '优先入场资格抽选',
  //     path: '/page/secondpackge/pages/chouxuanHomepage/chouxuanHomepage?share_uid='+_this.data.uid,
  //     imageUrl:_this.data.shareImg,
  //     success: function (res) {}
  //   }      
  // },


  onShareAppMessage: function () {
    var _this = this;
    return {
      title:'我正在美拆参加展会优先入场资格抽选活动，快来一起观展吧',
      path: "/page/secondpackge/pages/chouxuanHomepage/chouxuanHomepage?share_uid=" + _this.data.uid,
      imageUrl:app.signindata.indexShareImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
    }   
  },
  onShareTimeline:function(){
    var _this = this;

    var indexShare = app.signindata.indexShare || [];
    var indexShareNum = Math.floor(Math.random() * indexShare.length) || 0;
    var indexShareImg = '';
    if(indexShare.length!=0 && indexShare[indexShareNum]){
      indexShareImg = indexShare[indexShareNum]+'?time=' + Date.parse(new Date());;
    };

    return {
      title:'我正在美拆参加展会优先入场资格抽选活动，快来一起观展吧',
      query:'share_uid='+_this.data.uid,
      imageUrl:indexShareImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
    }
  },  


   // 拉起订阅
  subscrfun: function () {
    var num = 0;
    var _this = this;
    _this.data.id = 1;
    var subscribedata = _this.data.subscribedata || '';
    console.log('subscribedata===',subscribedata)
    console.warn(1,subscribedata && subscribedata.template_id && app.signindata.subscribeif)

    if (subscribedata && subscribedata.template_id && app.signindata.subscribeif) {
      console.warn(2)
      if (subscribedata.template_id instanceof Array) {
        console.warn(3)
        wx.requestSubscribeMessage({
          tmplIds: subscribedata.template_id || [],
          success(res) {
            var is_show_modal = true;
            console.warn(4)
            for (var i = 0; i < subscribedata.template_id.length; i++) {
              if (res[subscribedata.template_id[i]] == "accept") {
                if(num == 1){
                  app.subscribefun(_this, 1, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
                }else{
                  app.subscribefun(_this, 0, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
                };
                
                if (is_show_modal) {
                  // _this.subshowmodalfun();
                  // _this.subshowmodalTip();
                  is_show_modal = false;
                };
              };
            };
          },
          complete() { }
        })
      } else {
        console.warn(5)
        wx.requestSubscribeMessage({
          tmplIds: [subscribedata.template_id || ''],
          success(res) {
            if (res[subscribedata.template_id] == "accept") {
              app.subscribefun(_this, 0, subscribedata.template_id, subscribedata.subscribe_type);
              // _this.subshowmodalfun();
            };
          }
        })
      };
    };
  },
  jumpposition:function(){
    wx.navigateTo({
      url: "/page/secondpackge/pages/buyingTickets/buyingTickets"
    });
  }
})