var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '优先入场资格抽奖', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    share_uid:0,
    countdown:'',
    percent:'',
    isRecordMask:false,
    isAwardMask:false,
    isidCardMask:false,
    idcardIndex:0,
    selectCard:0,
    // 绑定身份证id
    bindIdcard:'',
    bindDate:'',
    // 抽奖数
    drawnum:1,
    isShowRule:false,
    isPrior:false
  },
 
  togglerecordFun(){
    var _this = this;
    if(!this.data.isRecordMask){
      wx.showLoading({ title: '加载中...'})
      var q = Dec.Aese('mod=prior&operation=drawRecord&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
      console.log(app.signindata.comurl + 'spread.php?mod=prior&operation=drawRecord&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
      wx.request({
        url: app.signindata.comurl + 'spread.php'+q,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {
          console.log('抽奖记录======',res)
          wx.hideLoading();
          if (res.data.ReturnCode == 200) {
            if(res.data.List.awardList.length != 0){
              _this.setData({
                isRecordMask:true,
                awardList:res.data.List.awardList
              })
            }else{
              app.showToastC('你暂时没有抽奖记录')
            }
          }else{
            app.showToastC(res.data.Msg)
          }
        }
      }); 
    }else{
      _this.setData({
        isRecordMask:false
      })
    }
  },
  toggleRuleFun(){
    this.setData({
      isShowRule:!this.data.isShowRule
    })
  },
  toggleawardFun(){
    this.setData({
      isAwardMask:!this.data.isAwardMask
    })
  },
  toggleidCardFun(){
    if(this.data.identity.length == 0){
      wx.showModal({
        title: '提示',
        content: '您还未购买本次展会门票，请先购买门票',
        confirmText: '去购票',
        success (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: "/page/secondpackge/pages/buyingTickets/buyingTickets"
            });
          } else if (res.cancel) {

          }
        }
      })
    }else{
      if(this.data.isidCardMask){
        this.setData({
          idcardIndex: this.data.selectCard
        })
      }else{
        this.setData({
          selectCard : this.data.idcardIndex
        })
      }
      this.setData({
        isidCardMask:!this.data.isidCardMask
      })
    }
  },
  selectCardFun(e){
    var index = e.currentTarget.dataset.index;
    var idcard = e.currentTarget.dataset.idcard;
    var date = e.currentTarget.dataset.date;
    this.setData({
      idcardIndex:index,
      bindIdcard:idcard,
      bindDate:date
    })
  },
  plusXing (str,frontLen,endLen) {
    var len = str.length-frontLen-endLen;
    var xing = '';
    for (var i=0;i<len;i++) {
    xing+='*';
    }
    return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
  },
  getInfo(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=prior&operation=getInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&shareUId=' + _this.data.share_uid);
    console.log(app.signindata.comurl + 'spread.php?mod=prior&operation=getInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&shareUId=' + _this.data.share_uid)
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('数据======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          let data = res.data;
          for(var i=0;i<data.List.identity.length;i++){
            data.List.identity[i].actualidcard = data.List.identity[i].idcard;
            data.List.identity[i].idcard = _this.plusXing(data.List.identity[i].idcard,4,4);
            data.List.identity[i].consignee = _this.plusXing(data.List.identity[i].consignee,1,0);
            data.List.identity[i].mobile = _this.plusXing(data.List.identity[i].mobile,3,4);
          }
          if(data.Info.bindIdentity != 0){
            data.Info.bindIdentity.consignee = _this.plusXing(data.Info.bindIdentity.consignee,1,0);
            data.Info.bindIdentity.idcard = _this.plusXing(data.Info.bindIdentity.idcard,4,4);
          }
          _this.setData({
            suplusChance:data.Info.user.suplusChance,
            activity:data.Info.activity,
            bindIdentity:data.Info.bindIdentity,
            user:data.Info.user,
            isPrior:data.Info.isPrior,
            countdown:data.Info.endTime,
            totalScratch:data.Info.user.totalScratch,
            scratch:data.List.scratch,
            identity:data.List.identity,
            bindIdcard:data.List.identity[_this.data.idcardIndex]?data.List.identity[_this.data.idcardIndex].actualidcard:0,
            bindDate:data.List.identity[_this.data.idcardIndex]?data.List.identity[_this.data.idcardIndex].date:0,
            percent:(data.Info.user.totalScratch/data.Info.user.peakValue)*100,
            explain:data.List.explain,
            subscribedata:res.data.Info.subscribe
          })
          _this.countdownbfun();        
        }else{
          wx.showToast({
            title: res.data.Msg,
            icon: 'none',
            mask:true,
            duration:1000
          });  
          if(res.data.ReturnCode == 384 && _this.data.share_uid){
            _this.data.share_uid = 0;
            setTimeout(function(){
              _this.getInfo()
            },1000)
          }
        }
      }
    }); 
  },
  bindidCardFun(e){
    var _this = this;
    var idcard =this.data.bindIdcard;
    var bindDate = this.data.bindDate;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=prior&operation=bindIdentity&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&idcard=' + idcard + '&date='+bindDate);
    console.log(app.signindata.comurl + 'spread.php?mod=prior&operation=bindIdentity&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&idcard=' + idcard + '&date=' + bindDate)
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('绑定的身份证号======',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          wx.showToast({
            title: '绑定成功',
            icon: 'none',
            mask:true,
            duration:1000
          });  
          _this.setData({
            isidCardMask:false
          })  
          setTimeout(function(){
            _this.getInfo();
          },1000)
        }else{
          app.showToastC(res.data.Msg)
        }
      }
    }); 
  },
  drawFun(e){

    if(this.data.suplusChance == 0){
      app.showToastC('剩余刮刮卡不足')
      return false;
    }

    var num = e.currentTarget.dataset.num;
    var _this = this;
    wx.showLoading({ title: '加载中...',mask:true})
    var q = Dec.Aese('mod=prior&operation=scratchGift&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&num=' + num);
    console.log(app.signindata.comurl + 'spread.php?mod=prior&operation=scratchGift&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&num=' + num)
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('刮卡======',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          if(num == 1){
            _this.setData({
              suplusChance:_this.data.suplusChance-1,
            })
          }else{
            if(_this.data.user.isVIP){
              _this.setData({
                suplusChance:_this.data.suplusChance-7,
              })
            }else{
              _this.setData({
                suplusChance:_this.data.suplusChance-10,
              })
            }
          }
          _this.setData({
            drawnum:num,
            isAwardMask:true,
            result:res.data.List.result
          })
        }else{
          app.showToastC(res.data.Msg)
        }
      }
    }); 
  },
  getDrawFun(e){
    var type = e.currentTarget.dataset.type;
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=prior&operation=getEntrance&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&getType='+type);
    console.log(app.signindata.comurl + 'spread.php?mod=prior&operation=scratchGift&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&getType='+type)
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('领取投票券======',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          wx.showToast({
            title: '领取成功',
            icon: 'none',
            mask:true,
            duration:1000
          });  
          setTimeout(function(){
            _this.getInfo();
          },1000)
        }else{
          app.showToastC(res.data.Msg)
        }
      }
    }); 
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否授权
    var _this = this;
    _this.data.share_uid = options.share_uid || 0
    _this.activsign();
    _this.countdownbfun();        
    // this.onLoadfun(); 
  },
  onLoadfun:function(){
    var _this = this;
    _this.setData({
      uid: app.signindata.uid,
      loginid: app.signindata.loginid,
    });  
    _this.getInfo();
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
          app.userstatistics(49);
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
    if (this.data.countdown) {
      this.countdownbfun();
    };
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer);
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
  //     title: '优先入场资格刮刮卡',
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
  //     title: '优先入场资格刮刮卡',
  //     path: '/page/secondpackge/pages/luckyDraw/luckyDraw?share_uid='+_this.data.uid,
  //     imageUrl:_this.data.shareImg,
  //     success: function (res) {}
  //   }      
  // },


  onShareAppMessage: function () {
    var _this = this;
    return {
      title:'刮刮卡:我正在美拆抽取展会优先入场资格，快来帮我助力吧',
      path: "/page/secondpackge/pages/luckyDraw/luckyDraw?share_uid=" + _this.data.uid,
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
      title:'刮刮卡:我正在美拆抽取展会优先入场资格，快来帮我助力吧',
      query:'share_uid='+_this.data.uid,
      imageUrl:indexShareImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
    }
  },  


  // 倒计时
  countdownbfun: function () {
    var _this = this;
    clearInterval(_this.data.timer);
    var countdown = _this.data.countdown || '';
    var commoddata = _this.data.commoddata||{};

    function nowTime() { //时间函数
      var iftrins = true;
      // 获取现在的时间
      var nowTime = new Date().getTime();
      // nowTime = Date.parse(nowTime);//当前时间戳
      var lastTime = countdown * 1000;
      var differ_time = lastTime - nowTime; //时间差：
      if (differ_time >= 0) {
        var differ_day = Math.floor(differ_time / (3600 * 24 * 1e3));
        var differ_hour = Math.floor(differ_time % (3600 * 1e3 * 24) / (1e3 * 60 * 60));
        var differ_minute = Math.floor(differ_time % (3600 * 1e3) / (1000 * 60));
        var s = Math.floor(differ_time % (3600 * 1e3) % (1000 * 60) / 1000);
        if (differ_day.toString().length < 2) {
          differ_day = "0" + differ_day;
        };
        if (differ_hour.toString().length < 2) {
          differ_hour = "0" + differ_hour;
        };
        if (differ_minute.toString().length < 2) {
          differ_minute = "0" + differ_minute;
        };
        if (s.toString().length < 2) {
          s = "0" + s;
        };
        commoddata.day = differ_day;
        commoddata.hour = differ_hour;
        commoddata.minute = differ_minute;
        commoddata.second = s;
      } else {
        commoddata.day = '00'
        commoddata.hour = '00';
        commoddata.minute = '00';
        commoddata.second = '00';
      };
      if (commoddata.day != '00' || commoddata.hour != '00' || commoddata.minute != '00' || commoddata.second != '00') {
        iftrins = false;
      };
      _this.setData({
        commoddata: commoddata
      });
      
      if (iftrins) {
        clearInterval(_this.data.timer);
      };
    }
    if (countdown) {
      nowTime();
      clearInterval(_this.data.timer);
      _this.data.timer = setInterval(nowTime, 1000);
    };
  },
  // 跳转
  jumpOtherPage:function(w){
    var num = w.currentTarget.dataset.num || w.target.dataset.num || 100000;
    var whref = w.currentTarget.dataset.whref || w.target.dataset.whref || 100000;
    var title = w.currentTarget.dataset.title || w.target.dataset.title || '';
    app.comjumpwxnav(num,whref,title);
    if(num==9){
      this.data.isJumpSignin = true;
    }
  },
  jumpVipPage(){
    wx.navigateTo({  
      url: "/page/secondpackge/pages/vipPage/vipPage"
    })
  },
   // 订阅授权
   subscrfun:function(){
    var _this = this;
    app.comsubscribe(_this);
  },
})