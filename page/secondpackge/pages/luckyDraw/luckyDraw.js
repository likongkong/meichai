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
    shareUId:'',
    countdown:'1608102710',
    percent:'',
    isRecordMask:false,
    isAwardMask:false,
    isidCardMask:false,
    idcardIndex:1,
    bindIdcard:'',
    bindDate:''
  },
  togglerecordFun(){
    var _this = this;
    if(!this.data.isRecordMask){
      wx.showLoading({ title: '加载中...'})
      var q = Dec.Aese('mod=prior&operation=drawRecord&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
      console.log(app.signindata.comurl + 'toy.php?mod=prior&operation=drawRecord&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
      wx.request({
        url: app.signindata.comurl + 'toy.php'+q,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {
          console.log('抽奖记录======',res)
          wx.hideLoading();
          if (res.data.ReturnCode == 200) {
            _this.setData({
              isRecordMask:true
            })
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
  toggleawardFun(){
    this.setData({
      isAwardMask:!this.data.isAwardMask
    })
  },
  toggleidCardFun(){
    this.setData({
      isidCardMask:!this.data.isidCardMask
    })
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
    var q = Dec.Aese('mod=prior&operation=getInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&shareUId=' + _this.data.shareUId);
    console.log(app.signindata.comurl + 'spread.php?mod=prior&operation=getInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&shareUId=' + _this.data.shareUId)
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
          if(data.Info.bindIdentity){
            data.Info.bindIdentity.consignee = _this.plusXing(data.Info.bindIdentity.consignee,1,0);
            data.Info.bindIdentity.idcard = _this.plusXing(data.Info.bindIdentity.idcard,4,4);
          }
          console.log(data.List.identity,111)
          _this.setData({
            activity:data.Info.activity,
            bindIdentity:data.Info.bindIdentity,
            user:data.Info.user,
            totalScratch:data.Info.user.totalScratch,
            scratch:data.List.scratch,
            identity:data.List.identity,
            bindIdcard:data.List.identity[0].actualidcard,
            bindData:data.List.identity[0].date,
            percent:(data.Info.user.totalScratch/data.Info.user.peakValue)*100
          })
        }else{
          app.showToastC(res.data.Msg)
        }
      }
    }); 
  },
  bindidCardFun(e){
    var idcard =this.data.bindIdcard;
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
          app.showToastC('绑定成功')
          _this.getInfo();
        }else{
          app.showToastC(res.data.Msg)
        }
      }
    }); 
  },
  drawFun(e){
    var num = e.currentTarget.dataset.num;
    var _this = this;
    wx.showLoading({ title: '加载中...'})
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
    this.activsign();
    this.countdownbfun();        
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
  onShareAppMessage: function () {
    var reshare = Dec.sharemc();
    return reshare
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
})