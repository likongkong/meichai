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
    openid: app.signindata.openid,
    share_uid:0,
    cart_id:'',
    id:0,
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
    auctionFailPopMask:false,
    timer:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.data.share_uid = options.share_uid || 0
    _this.data.id = options.id || 0
    this.setData({
      id: options.id || 0
    }); 
    // 判断是否授权
    this.activsign();
  },
  onLoadfun:function(){
    this.setData({
      uid: app.signindata.uid,
      loginid:app.signindata.loginid,
      openid: app.signindata.openid,
    }); 
    this.getInfo();
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
    app.comjumpwxnav(9059,'','');
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
    clearInterval(this.data.timer);
    clearInterval(this.data.timer1);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer);
    clearInterval(this.data.timer1); 
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    clearInterval(this.data.timer);
    clearInterval(this.data.timer1);
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
    var _this = this
    var share = {
      title:  app.signindata.titleShare,
      path: 'page/secondpackge/pages/auctionDetails/auctionDetails?share_uid=' + _this.data.uid+'&id=' + _this.data.id,
      imageUrl: app.signindata.indexShareImg,
      success: function(res) {

      }
    }
    return share
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
  //跳转拍卖列表
  jumpAuctionListPage(){
    wx.navigateTo({  
      url: "../auctionList/auctionList"
    })
  },
  //跳转我的拍卖
  jumpMyAuctionList(){
    wx.navigateTo({  
      url: "../myAuctionList/myAuctionList"
    })
  },
  //跳转出价记录
  jumpAuctionRecord(e){
    var _this = this;
    // wx.navigateTo({  
    //   url: "../auctionRecord/auctionRecord",
    //   success: function(res) {
    //     // 通过eventChannel向被打开页面传送数据
    //     res.eventChannel.emit('acceptDataFromOpenerPage', { data: _this.data.dataInfo.showAuctionRecordList })
    //   }
    // })
    wx.navigateTo({  
      url: `../auctionRecord/auctionRecord?id=${e.currentTarget.dataset.id}`
    })
  },
  //跳转拍卖详情
  jumpAuctionDetails(e){
    wx.navigateTo({  
      url: `../auctionDetails/auctionDetails?id=${e.currentTarget.dataset.id}`
    })
  },

  getInfo(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=auction&operation=info&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&share_uid='+_this.data.share_uid)
    console.log('拍卖详情请求数据===','mod=auction&operation=info&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&share_uid='+_this.data.share_uid)
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
          clearInterval(_this.data.timer);
          var goodsDescDetails  = res.data.Info.goodsDesc.replace(/<img/gi, '<img style="width:100%;height:auto;display:block;"');
          _this.setData({
            goodsDescDetails,
            dataInfo:res.data.Info,
            bidRange:res.data.Info.auctionRule.bid_increment,
            lastBidPrice:res.data.Info.currentPrice,
            firstBidPrice:Number(res.data.Info.auctionRule.bid_increment)+Number(res.data.Info.currentPrice),
            currentBidPrice:res.data.Info.currentPrice,
            subscribedata:res.data.Info.subscribe || ''
          })
          _this.data.timer = setInterval(function () {
            //将时间传如 调用 
            _this.dateformat(res.data.Info.showTime);
          }.bind(_this), 1000);
          
          //status=1 拍卖未开始
          if(res.data.Info.status == 1){
            var notStartedTime = _this.toDatehd(res.data.Info.showTime);
            _this.setData({
              notStartedTime
            })
          }

          //status=3 且 showTime>0 为活动结束已中奖
          if(res.data.Info.status == 3 && res.data.Info.showTime > 0){
            if(res.data.Info.isVictory == 1 || res.data.Info.isVictory == 3){
              var payFinishTime = _this.toDatehd(res.data.Info.showTime);
              _this.setData({
                auctionResultPopMask:true,
                payFinishTime
              })
            }
          //status=3 且 showTime=0 为活动结束未中奖
          }else if(res.data.Info.status == 3 && res.data.Info.showTime == 0){ 
            if(res.data.Info.isVictory == 2){
              _this.setData({
                auctionFailPopMask:true
              })
              _this.getListInfo();
            }
          }


        } else {
          app.showToastC(res.data.msg);
        }
      }
    });
  },

  //推荐活动
  getListInfo(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=auction&operation=list&showType=2&pid=0')
    console.log('拍卖列表请求数据===','mod=auction&operation=list&showType=2&pid=0')
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('拍卖结束，推荐活动======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          let activity = res.data.List.activity;
          _this.setData({
            ListInfo:activity
          })
          _this.listDateformat(_this,activity);

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
      auctionFailPopMask:false,
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
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=auction&operation=deposit&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id)
    console.log('保证金下单请求数据===','mod=auction&operation=deposit&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id)
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('保证金下单数据======',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 358) {
          _this.data.cart_id=res.data.Info.cart_id;
          _this.paymentmony()
        } else {
          app.showToastC(res.data.msg);
        }
      }
    });
  },

  // 立即支付
  payNow(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=auction&operation=buyGoods&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id)
    console.log('立即支付下单请求数据===','mod=auction&operation=buyGoods&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id)
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('立即支付下单数据======',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          _this.data.cart_id=res.data.Info.cart_id;
          _this.paymentmony()
        } else {
          app.showToastC(res.data.msg);
        }
      }
    });
  },

  // 微信支付
  paymentmony: function () {
    var _this = this;
    var q = Dec.Aese('mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + _this.data.cart_id + '&xcx=1' + '&openid=' + _this.data.openid)
    console.log('预支付数据===','mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + _this.data.cart_id + '&xcx=1' + '&openid=' + _this.data.openid)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          // 支付完成弹框显示数据
          console.log('预支付数据===',res)
          // var payinfo = res.data.Info;
          wx.requestPayment({
            'timeStamp': res.data.Info.timeStamp.toString(),
            'nonceStr': res.data.Info.nonceStr,
            'package': res.data.Info.package,
            'signType': 'MD5',
            'paySign': res.data.Info.paySign,
            'success': function (res) {
              _this.getInfo();
              _this.hideMask();
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
          app.showModalC(res.data.Msg || res.data.msg || '');
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
  // 底部出价竞拍
  footerbidBtnFun(){
    var _this = this;
    // auction_type 1为限时 2为限次
    if(_this.data.dataInfo.auction_type == 1){
      _this.setData({
        bidPopMask:true,
        currentBidPrice:Number(_this.data.lastBidPrice)+Number(_this.data.bidRange)
      })
    }else{
      if(_this.data.dataInfo.suplusChance == 0 ){
        _this.setData({
          inviteFriendsPopMask:true
        })
      }else{
        _this.bidBtnFun();
      }
    }
  },
  // 弹层出价竞拍
  bidBtnFun(){
    var _this = this;
    // auction_type 1为限时 2为限次
    if(_this.data.dataInfo.auction_type == 1){
      if( ((_this.data.currentBidPrice-_this.data.lastBidPrice)%_this.data.bidRange) != 0 || _this.data.currentBidPrice <= _this.data.lastBidPrice){
        wx.showToast({
          title: `出价金额需高于当前出价且为 ${_this.data.bidRange} 的倍数`,
          icon: 'none',
          duration: 2000
        })
        return false;
      }
    }
    

    wx.showLoading({ title: '加载中...'})
    // auction_type 1为限时 2为限次
    if(_this.data.dataInfo.auction_type == 1){
      var q = Dec.Aese('mod=auction&operation=offer&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&lastOffer='+ _this.data.lastBidPrice + '&offerPrice='+this.data.currentBidPrice)
      console.log('mod=auction&operation=offer&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&lastOffer='+ _this.data.lastBidPrice + '&offerPrice='+_this.data.currentBidPrice)
    }else{
      var offerPrice = Number(_this.data.currentBidPrice)+Number(_this.data.bidRange);
      var q = Dec.Aese('mod=auction&operation=offer&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&lastOffer='+ _this.data.lastBidPrice + '&offerPrice='+offerPrice)
      console.log('mod=auction&operation=offer&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&lastOffer='+ _this.data.lastBidPrice + '&offerPrice='+offerPrice)
    }
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('出价竞拍======',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          _this.getInfo();
          _this.hideMask();
          _this.setData({
            bidSucceedPopMask:true,
            currentBidPrice:_this.data.currentBidPrice
          })
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
  subshowmodalfun: function () {
    var _this = this;
    wx.showModal({
      title: '提示',
      content: _this.data.subscribeCouponTip|| '订阅成功,开售前通过微信发送提醒',
      showCancel: false,
      success: function (res) {
        _this.setData({
          subscribeCouponTip: '',
          isSubscribeCoupon: false
        })
      }
    })
  },
  // 时间格式化输出，将时间戳转为 倒计时时间
  dateformat: function (micro_second) {
    var _this = this
    var timestamp = Date.parse(new Date())
    //总的秒数 
    var second = micro_second - (timestamp / 1000);
    if (second > 0) {
      // 天位    
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;

      // 小时位 
      var hr = Math.floor(second / 3600 % 24);
      // var hr = Math.floor(second / 3600); //直接转为小时 没有天 超过1天为24小时以上
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位  
      var min = Math.floor(second / 60 % 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位  
      var sec = Math.floor(second % 60);
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;
      if (day == 0) {
        //   return hrStr + ":" + minStr + ":" + secStr;
        _this.setData({
          dayStr: 0,
          hrStr: hrStr,
          minStr: minStr,
          secStr: secStr,
        })
      } else {
        _this.setData({
          dayStr: dayStr,
          hrStr: hrStr,
          minStr: minStr,
          secStr: secStr,
        })
        //   return dayStr + "天" + hrStr + ":" + minStr + ":" + secStr;
      }
    } else {
      _this.setData({
        dayStr: 0,
        hrStr: "00",
        minStr: "00",
        secStr: "00",
      })
    }
  },
  // 时间格式化输出，将时间戳转为 倒计时时间
  listDateformat(_this,activity) {
    let len=activity.length;//时间数据长度
    function nowTime() {//时间函数
      for (var i = 0; i < len; i++) {
      var intDiff = activity[i].stop_time - Date.parse(new Date())/1000;
      var day=0, hour=0, minute=0, second=0;  
      var str = '';
      if(intDiff > 0){//转换时间
        day = Math.floor(intDiff / (60 * 60 * 24));
        hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
        minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        // if(hour <=9) hour = '0' + hour;
        // if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        activity[i].stop_time = activity[i].stop_time--;
        if(day>0){
          str='剩'+day+'天'+hour+'时' 
        }else if(day==0 && hour>0){
          str='剩'+hour+'时'+minute+'分' 
        }else if(day==0 && hour==0 && minute>0){
          str='剩'+minute+'分'+second+'秒' 
        }else{
          str='剩'+minute+'分'+second+'秒' 
        }
        // console.log(str) 
      }else{
        str = "已结束";
        clearInterval(_this.data.timer1); 
      }
      // console.log(str);
      activity[i].difftime = str;//在数据中添加difftime参数名，把时间放进去
      }
      _this.setData({
        ListInfo: activity
      })
    }
    nowTime();
    _this.data.timer1 = setInterval(nowTime, 1000);
  },
  //时间戳转换时间  
  toDatehd: function (number) {
    var date = new Date(number * 1000);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    //status==1拍卖未开始  status==3拍卖已结束
    if(this.data.dataInfo.status == 1){
      return M + '月' + D + '日 ' + h + ':' + m;
    }else if(this.data.dataInfo.status == 3){
      return Y+'年'+ M + '月' + D + '日 ' + h + ':' + m;
    }
  },

})