var Dec = require('../../common/public.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '万圣节活动', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    dateTime:0,
    issharePopup:false,
    ishelpPopup:false,
    canAssist:false,
    ishowphone:false, // 微信手机号授权
  },
  // 是否需要手机号
  isPhone:function(){
    var _this = this;
    if(app.signindata.isAuthMobile){  // 授权
      var q = Dec.Aese('mod=festival&operation=shareWSJ&isMobile=0&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid +'&shareUId='+_this.data.shareUId)
      wx.request({
        url: app.signindata.comurl + 'spread.php' + q,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {
          console.log('助力',res)
          if (res.data.ReturnCode == 200) {
            wx.showModal({
              title: '提示',
              content: '助力成功',
              showCancel: false,
              success: function (res) { }
            })            
          } else {
            app.showToastC(res.data.Msg);
          };
        }
      });
    }else{
      _this.dialogClick();
    }
  },
  // 手机号授权弹框
  dialogClick:function(){
    this.setData({
      ishowphone: !this.data.ishowphone
    });
  },
  getPhoneNumber: function (e) {
    var _this = this
    if (e.detail.errMsg == 'getPhoneNumber: ok' || e.detail.errMsg == "getPhoneNumber:ok") {  //授权通过执行跳转
      wx.login({
        success: function (res) {
          if (res.code) {
            var encryptedData = e.detail.encryptedData||'';
            var iv = e.detail.iv||'';
            var code = res.code||'';
            //发起网络请求
            
            var q = Dec.Aese('mod=festival&operation=shareWSJ&isMobile=1&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&code=' + code + '&iv=' + iv + '&encryptedData=' + encryptedData+'&shareUId='+_this.data.shareUId)
            wx.request({
              url: app.signindata.comurl + 'spread.php' + q,
              method: 'GET',
              header: { 'Accept': 'application/json' },
              success: function (res) {
          
                if (res.data.ReturnCode == 200) {
                  _this.setData({ ishowphone: false});
                  wx.showModal({
                    title: '提示',
                    content: '助力成功',
                    showCancel: false,
                    success: function (res) {}
                  }) 
                } else {
                  _this.setData({ ishowphone: false });
                  app.showToastC(res.data.Msg);
                };
              }
            });
          } else {
        
          }
        }
      });




    } else { 

      this.dialogClick()




    };

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.showLeft();
    // this.getData();
    // 判断是否授权
    this.activsign();
  },
  onLoadfun:function(){
    // '已经授权'
    this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid
    });
    this.getData();
  },
  getData(){
    var _this = this;
    wx.showLoading({ title: '加载中...', }) 
    var q = Dec.Aese('mod=festival&operation=listWSJ&uid=' +_this.data.uid+'&loginid='+_this.data.loginid+'&shareUId='+_this.data.shareUId+'&shareDate='+_this.data.shareDate);
    console.log('mod=festival&operation=listWSJ&uid=' +_this.data.uid+'&loginid='+_this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) { 
        if (res.data.ReturnCode == 200) {
          for(let i=0;i<res.data.List.date.length;i++){
            res.data.List.date[i] = _this.formatTime(res.data.List.date[i])
          }
          _this.setData({
            datetimeAll:res.data.List.date,
            rank:res.data.List.rank,
            tips:res.data.Info.tips,
            share:res.data.List.share,
            canAssist:res.data.Info.canAssist
          })
        }
      },
      fail: function () {},
      complete:function(){
        wx.hideLoading()
      }
    });
  },
  //时间戳转换成日期时间
  formatTime(time) {
    var date = new Date(time*1000);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    // return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;//年月日时分秒
    return m + '月' + d + '日';
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
          app.userstatistics(44);
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

 


  // onPullDownRefresh: function () {
  
  // },
  // onReachBottom: function () {

  // },

  clicktganone: function () {
    this.setData({ tgabox: false })
  }, 
 
  tabBtnFun(e){
    this.setData({
      dateTime:e.currentTarget.dataset.datetime
    })
  },
  showLeft() {
    //获取当前时间
    var nowTime = Date.now();
    // var nowTime = new Date().getTime();
    //获取当天 23:59 
    var endTime = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
    //获取时间差
    var timediff = Math.round((endTime - nowTime) / 1000);
    //获取还剩多少小时
    var hour = parseInt(timediff / 3600 % 24) + parseInt(timediff / 3600 / 24) * 24;
    //获取还剩多少分钟
    var minute = parseInt(timediff / 60 % 60);
    //获取还剩多少秒
    var second = timediff % 60;
    //输出还剩多少时间
    hour = this.timerFilter(hour);
    minute = this.timerFilter(minute);
    second = this.timerFilter(second);
    // console.log(hour + "时" + minute + "分" + second + "秒")
    this.setData({
      todaycountdown:hour + ":" + minute + ":" + second
    })
    setTimeout(()=>{
      this.showLeft()
    },1000)
  },
  //给小于10的数值前面添加 0 
  timerFilter(params) {
      if (params - 0 < 10) {
          return '0' + params
      } else {
          return params
      }
  },
  showSharePopup(){
    this.setData({ issharePopup: !this.data.issharePopup })
  },
  showhelpPopup(){
    this.setData({ ishelpPopup: !this.data.ishelpPopup })
  }

})