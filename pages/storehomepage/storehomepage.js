var Dec = require('../../common/public.js');//aes加密解密js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 接口地址
    comurl: app.signindata.comurl,
    // 图片地址
    zdyurl: Dec.zdyurl(),
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    appNowTime: app.signindata.appNowTime,

    // 版本号
    versionnumber: app.signindata.versionnumber,
 
    c_title: '',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90, 
    // 是否授权
    signinlayer:true,
    windowHeight: app.signindata.windowHeight - 65 - wx.getStorageSync('statusBarHeightMc')||0,

    is_vip:0
  },

  // 我的订单
  myorderfun:function(e){
    wx.navigateTo({  
      url: "/pages/myorder/myorder?tabnum=3"
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {


    var dateTime = new Date();
    var day = dateTime.getDate();
    if(day == 12){
      var txtColor = '#F8627B';
    }else if(day == 13){
      var txtColor = '#3B8DB5';
    }else if(day == 14){
      var txtColor = '#299331';
    }else{
      var txtColor = '#F8627B';
    };
    this.setData({
      txtColor:txtColor
    })
    console.log(day,txtColor)

    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        if (true) {
          // '已经授权'
          _this.data.loginid = app.signindata.loginid;
          _this.setData({
            uid: app.signindata.uid,
            isProduce: app.signindata.isProduce,
            signinlayer: true,
            tgabox: false
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this)
          }
        } else {
          wx.hideLoading();
          _this.setData({
            signinlayer:false
          }); 
          // '没有授权 统计'
          app.userstatistics(4);

        }
      }
    });
  },
  listdata:function(){
    var _this = this;
    wx.showLoading({ title: '加载中...', mask:true })

    var q = Dec.Aese('mod=bind&operation=screenVIP&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)

    wx.request({
      url: app.signindata.comurl + 'toy.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('是否是VIP===',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading()
        if (res.data.ReturnCode == 200){
          // vip
          _this.setData({
            is_vip:1,
            info:res.data.Info
          })
        }else if(res.data.ReturnCode == 201){
          // 非 vip
          _this.setData({
            is_vip:2,
            info:res.data.Info
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.Msg,
            showCancel: false,
            success: function (res) {
              wx.reLaunch({
                url: "/pages/index/index?judgeprof=2"
              });
            }
          })          
        };


      }
    }); 
  },
  onLoadfun:function(){
    //  我的订单数据
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
    });  
    _this.listdata()

    // 已经授权，可以直接调用
    if(app.signindata.userInfo && app.signindata.userInfo.avatarUrl){
      var userInfo = app.signindata.userInfo || {};
      _this.setData({
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        gender: userInfo.gender,
        istitnex: false,
        istit: true,
      })
    };

  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  pullupsignin:function(){
    // // '没有授权'
    this.setData({
      tgabox: true
    });
  },
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
    app.downRefreshFun(() => {
      this.listdata();  
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.sharemc()    
  },
  onShareTimeline:function(){
    return {
      title:'潮玩社交平台',
      query:{}
    }
  },

  // 导航跳转
  whomepage: function () {
    wx.reLaunch({
      url: "/pages/index/index?judgeprof=2"
    });
  },
  wnews: function () {
    var _this = this;
    app.limitlottery(_this);
  },
  wshoppingCart: function () {
    var _this = this;
    wx.redirectTo({
      url: "/pages/shoppingCart/shoppingCart"
    });
  },
  wmy: function () { 
    this.onPullDownRefresh(); 
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
            tgabox: false
          });
          _this.onShow();
          // 确认授权用户统计
          app.clicktga(4)
        }
      }
    });
    if (e.detail.detail.userInfo) { } else {
      app.clicktga(8)  //用户按了拒绝按钮
    };

  },


})