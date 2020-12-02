var Dec = require('../../common/public.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '展会日历', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    // 品牌详情 2 单张详情 1
    isBrandDetail:0,
    share_uid:0,
    pid:0
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options===',options)

    // 品牌详情 2 单张详情 1
    if(options.brand_id){
      this.setData({
        isBrandDetail:2,
        brand_id:options.brand_id || 518
      })
    }else{
      this.setData({
        isBrandDetail:1,
        calendar_id:options.calendar_id || 518
      })      
    }

    // this.setData({
    //   isBrandDetail:2,
    //   brand_id:options.brand_id || 518
    // })

    // this.setData({
    //   isBrandDetail:1,
    //   calendar_id:2
    // })


    this.data.share_uid + options.share_uid || 0


    // 判断是否授权
    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      this.onLoadfun();
    }else{
      this.activsign();
    };
  },
  onLoadfun:function(){
    // '已经授权'
    this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      isAuthMobile:app.signindata.isAuthMobile
    });
    if(this.data.isBrandDetail==2){
      this.brandDetail()
    }else{
      this.calendarDetail(1);
    }
    
  },

  brandDetail:function(){
    var _this = this;

    wx.showLoading({ title: '加载中...',mask:true }) 

    var q = Dec.Aese('mod=Obtain&operation=BrandToCalendarList&uid=' +_this.data.uid+'&loginid='+_this.data.loginid+'&brand_id='+_this.data.brand_id);



    console.log(app.signindata.comurl + 'spread.php?'+'mod=Obtain&operation=BrandToCalendarList&uid=' +_this.data.uid+'&loginid='+_this.data.loginid+'&brand_id='+_this.data.brand_id)

    wx.request({
      url: app.signindata.comurl + 'brandDrying.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) { 
        console.log('brandDetail====',res)
        if (res.data.ReturnCode == 200) {
          _this.setData({
            brandDetails:res.data.List.brandDetails,
            calendarDetails:res.data.List.calendarDetails,
            voteToUserList:res.data.List.voteToUserList
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.Msg,
            showCancel: false,
            success: function (res) { }
          })           
        }
      },
      fail: function () {},
      complete:function(){
        wx.hideLoading()
      }
    });
  },
  calendarDetail:function(num){
    var _this = this;

    if (num == 1) {
      _this.data.pid = 0;
      _this.setData({
        listdata: [],
      });
    } else {
      var pagenum = parseInt(_this.data.pid)
      _this.data.pid = ++pagenum;
    };

    wx.showLoading({ title: '加载中...',mask:true }) 

    var q = Dec.Aese('mod=Obtain&operation=calendarInfo&uid=' +_this.data.uid+'&loginid='+_this.data.loginid+'&id='+_this.data.calendar_id+'&pid='+_this.data.pid);


    console.log(app.signindata.comurl + 'brandDrying.php?'+'mod=Obtain&operation=calendarInfo&uid=' +_this.data.uid+'&loginid='+_this.data.loginid+'&id='+_this.data.calendar_id+'&pid='+_this.data.pid)

    wx.request({
      url: app.signindata.comurl + 'brandDrying.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) { 
        console.log('calendarDetail====',res)
        if (res.data.ReturnCode == 200) {
          _this.setData({
            calendarDetails:res.data.List.calendarDetails,
            calendarDetailsToUser:res.data.List.calendarDetailsToUser
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.Msg,
            showCancel: false,
            success: function (res) { }
          })  
        }
      },
      fail: function () {},
      complete:function(){
        wx.hideLoading()
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    var _this = this;
    if(_this.data.isBrandDetail == 2){
       var shareUrl = 'pages/modifythenickname/modifythenickname?brand_id='+_this.data.brand_id + '&share_uid=' + _this.data.uid;
    }else{
       var shareUrl = 'pages/modifythenickname/modifythenickname?calendar_id='+_this.data.calendar_id + '&share_uid=' + _this.data.uid;
    };
    return {
      title: '日历',
      path:shareUrl,
      imageUrl:'',
      success: function (res) {}
    }  
  },
  onShareTimeline:function(){
    var _this = this;
    if(_this.data.isBrandDetail == 2){
      var shareUrl = 'brand_id='+_this.data.brand_id+'&share_uid='+_this.data.share_uid;
   }else{
      var shareUrl = 'calendar_id='+_this.data.calendar_id+'&share_uid='+_this.data.share_uid;
   };
    return {
      title:'日历',
      query:shareUrl,
      imageUrl:''
    }
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
 

  // 跳转
  jumpOtherPage:function(w){
    var num = w.currentTarget.dataset.num || w.target.dataset.num || 100000;
    var whref = w.currentTarget.dataset.whref || w.target.dataset.whref || 100000;
    var title = w.currentTarget.dataset.title || w.target.dataset.title || '';
    app.comjumpwxnav(num,whref,title)
  },
  // 跳转我参与的
  jumpiwas:function(){
    wx.navigateTo({
      url: "/page/component/pages/iWasInvolved/iWasInvolved"
    })
  },
    // 投票
  votingInterface:function(w){

    var _this = this;

    var brand_id = w.currentTarget.dataset.brand_id || w.target.dataset.brand_id || 0;
    var calendar_id = w.currentTarget.dataset.calendar_id || w.target.dataset.calendar_id || 0;

    wx.showLoading({ title: '加载中...',mask:true }) 

    var q = Dec.Aese('mod=Obtain&operation=recordVote&uid=' +_this.data.uid+'&loginid='+_this.data.loginid + '&calendar_id=' + calendar_id + '&brand_id=' + brand_id + '&share_uid=' + _this.data.share_uid);


    console.log(app.signindata.comurl +'brandDrying.php?' + 'mod=Obtain&operation=recordVote&uid=' +_this.data.uid+'&loginid='+_this.data.loginid + '&calendar_id=' + calendar_id + '&calendar_id=' + brand_id + '&share_uid=' + _this.data.share_uid)


    wx.request({
      url: app.signindata.comurl + 'brandDrying.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) { 
        console.log('receivefun====',res)
        if (res.data.ReturnCode == 200) {
          wx.showModal({
            title: '',
            content: '投票成功',
            showCancel: false,
            success: function (res) { }
          })
          _this.listdata(1);
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.Msg,
            showCancel: false,
            success: function (res) { }
          })          
        }
      },
      fail: function () {},
      complete:function(){
        wx.hideLoading()
      }
    });    
  },
  // 投票
  votingInterface:function(w){

    var _this = this;

    var brand_id = w.currentTarget.dataset.brand_id || w.target.dataset.brand_id || 0;
    var calendar_id = w.currentTarget.dataset.calendar_id || w.target.dataset.calendar_id || 0;

    wx.showLoading({ title: '加载中...',mask:true }) 

    var q = Dec.Aese('mod=Obtain&operation=recordVote&uid=' +_this.data.uid+'&loginid='+_this.data.loginid + '&calendar_id=' + calendar_id + '&brand_id=' + brand_id + '&share_uid=' + _this.data.share_uid);


    console.log(app.signindata.comurl +'brandDrying.php?' + 'mod=Obtain&operation=recordVote&uid=' +_this.data.uid+'&loginid='+_this.data.loginid + '&calendar_id=' + calendar_id + '&calendar_id=' + brand_id + '&share_uid=' + _this.data.share_uid)


    wx.request({
      url: app.signindata.comurl + 'brandDrying.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) { 
        console.log('receivefun====',res)
        if (res.data.ReturnCode == 200) {
          wx.showModal({
            title: '',
            content: '投票成功',
            showCancel: false,
            success: function (res) { }
          })
          _this.listdata(1);
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.Msg,
            showCancel: false,
            success: function (res) { }
          })          
        }
      },
      fail: function () {},
      complete:function(){
        wx.hideLoading()
      }
    });    
  },

})