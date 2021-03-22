var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '我的拍卖', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    tabbarAll:[
      '我参与的','拍卖领先','拍卖出局','我的订阅','拍卖结束'
    ],
    currentNum:1,
    pid:0,
    dataList:[],
    timer:'',
    loadprompt:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var data = JSON.parse(options.data)
    // console.log(data)
    // this.data.listData = data;
    // 判断是否授权
    this.activsign();
  },
  onLoadfun:function(){
    this.setData({
      uid: app.signindata.uid,
      loginid:app.signindata.loginid
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
    this.reset();
    this.getInfo();
  },


  getInfo(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=auction&operation=record&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&showType=' + _this.data.currentNum + '&pid=' + _this.data.pid)
    console.log('我的拍卖列表请求数据===','mod=auction&operation=list&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&showType=' + _this.data.currentNum + '&pid=' + _this.data.pid)
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('拍卖列表数据======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          let record = res.data.List.record;
          if(record.length == 0 && _this.data.pid == 0){
            _this.setData({ nodata : true})
            wx.showToast({
              title: '暂无数据',
              icon: 'none',
              duration: 1000
            })
          }else{
            if(record.length == 0 && _this.data.pid != 0){
              wx.showToast({
                title: '没有更多数据了',
                icon: 'none',
                duration: 1000
              })
              _this.setData({loadprompt : true })
            }else{
              // for(var i =0;i<res.data.List.record.length;i++){
              //   record[0].stop_time = 1615887060;
              // }
              let dataList = [..._this.data.dataList,...record];
              _this.setData({dataList})
              _this.dateformat(_this,record);
            }
          }
        } else {
          app.showToastC(res.data.msg);
        }
      }
    });
  },

  reset(){
    this.setData({pid:0,dataList:[],loadprompt:false,nodata:false})
    clearInterval(this.data.timer); 
  },

  jumpAuctionDetails(e){
    wx.navigateTo({  
      url: `../auctionDetails/auctionDetails?id=${e.currentTarget.dataset.id}`
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
    this.reset();
    this.getInfo();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.loadprompt == false){
      this.setData({pid:++this.data.pid})
    }
    this.getInfo();
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

  jumpsmokeboxlistPage(){
    wx.navigateTo({  
      url: "/pages/smokeboxlist/smokeboxlist"
    })
  },

  jumpAuctionList(){
    wx.navigateTo({  
      url: "../auctionList/auctionList"
    })
  },


  // 时间格式化输出，将时间戳转为 倒计时时间
  dateformat(_this,record) {
    let len=record.length;//时间数据长度
    function nowTime() {//时间函数
      for (var i = 0; i < len; i++) {
      var intDiff = record[i].stop_time - Date.parse(new Date())/1000;
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
        record[i].stop_time = record[i].stop_time--;
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
        clearInterval(_this.data.timer); 
      }
      // console.log(str);
      record[i].difftime = str;//在数据中添加difftime参数名，把时间放进去
      }
      _this.setData({
        dataList: record
      })
    }
    nowTime();
    _this.data.timer = setInterval(nowTime, 1000);
  }
})