var Pub = require('../../common/mPublic.js'); //aes加密解密js
var Dec = require('../../../../common/public.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 接口地址
    comurl: app.signindata.comurl,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,
    // 适配苹果X 
    isIphoneX: app.signindata.isIphoneX,     
    shopnum: 0,
 
    listdata:[],
    page:1,
    // 加载提示
    loadprompt: '加载更多.....',
    // 公共默认信息
    defaultinformation: '',
    appNowTime: Date.parse(new Date()),

    c_title: '通知',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,

    iftrnodata:false

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      user_id: app.signindata.uid,
      isShareFun: app.signindata.isShareFun,
    });
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
            isShareFun: app.signindata.isShareFun
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this)
          }
        } else {
          // 跳转获取权限页面
          wx.navigateTo({
            url: "../../../../pages/signin/signin"
          });
        }
      }
    });



  },
  onLoadfun:function(){
    var _this = this;

    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      user_id: app.signindata.uid,
      defaultinformation:app.signindata.defaultinformation,
      isShareFun: app.signindata.isShareFun
    });

    // 晒单列表
    _this.listdata(0);
    
    // _this.otherdata();

  },
  otherdata:function(){
    var _this = this;

    if(this.data.defaultinformation){}else{
      app.defaultinfofun(this);
    };
  },
  // 晒单列表
  listdata:function(num){
    var _this = this;
    if(num==0){
      _this.data.page = 1;
      _this.setData({iftrnodata:false});
    }else{
      var pagenum = parseInt(_this.data.page)
      _this.data.page = ++pagenum;
      _this.setData({ iftrnodata: false});
    };
    Pub.postRequest(_this, 'replyCommentList', { uid: _this.data.uid, loginid: _this.data.loginid, page: _this.data.page, cat_id: _this.data.cat_id, topic_id: _this.data.topic_id }, function (res) {
      var listdata = res.data.List ||[];
      if (listdata.length!=0){
        if (num == 0) {
          _this.setData({ listdata: listdata, iftrnodata: true });
        } else {
          var ltlist = _this.data.listdata.concat(listdata);
          _this.setData({ listdata: ltlist, iftrnodata: true});
        };
      }else{
        if (num == 0){
          _this.setData({ listdata: [], iftrnodata: true });
        };
        _this.setData({ loadprompt: '没有更多数据了', iftrnodata: true  });
      };

  
    }); 
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.listdata(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.listdata(1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    var reshare = app.sharemc();
    return reshare 
  },
  // 导航跳转 
  wnews: function () {
    var _this = this
    app.limitlottery(_this);
  },

  // 导航跳转
  whomepage: function () {
    wx.reLaunch({
      url: "../../../../pages/index/index?judgeprof=2"
    })
  },
  wmy: function () {
    wx.reLaunch({
      url: "../../../../pages/wode/wode"
    });
  },
  wshoppingCart: function () {
    wx.reLaunch({
      url: "../../../../pages/shoppingCart/shoppingCart"
    });
  },
  jumpdldetail:function(w){
    var dryingid = w.currentTarget.dataset.dryingid || w.target.dataset.dryingid||0;
    wx.navigateTo({
      url: "/page/component/pages/dlfinddetails/dlfinddetails?drying_id=" + dryingid,
    })
  },
 

})