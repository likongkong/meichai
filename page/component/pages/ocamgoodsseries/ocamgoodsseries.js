var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '闲置交易', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    isProduce: app.signindata.isProduce,
    pid:0,
    currentNum:0,
    dataList:[],
    skiplistL:[],
    loadprompt:false,
    seriesId:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.seriesId = options.seriesId;
    this.setData({
      uid: app.signindata.uid,
      loginid:app.signindata.loginid,
      isProduce: app.signindata.isProduce,
    });
    // 判断是否授权
    this.activsign();
  },
  onLoadfun:function(){
    this.setData({
      uid: app.signindata.uid,
      loginid:app.signindata.loginid,
      isProduce: app.signindata.isProduce,
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
    if(e.currentTarget.dataset.ind != 0){
      wx.showToast({
        title: '敬请期待',
        icon: 'none',
        duration: 1500
      })
    }
    // this.setData({
    //   currentNum: e.currentTarget.dataset.ind
    // })
    // this.reset();
    // this.getInfo();
  },

  resetpage(e){
    this.data.seriesId = e.currentTarget.dataset.seriesid;
    this.reset();
    this.getInfo();
  },

  getInfo(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=cabinet&operation=detailSeries&seriesId=' + this.data.seriesId)
    console.log('请求数据===','mod=cabinet&operation=detailSeries&seriesId=' + this.data.seriesId)
    wx.request({
      url: app.signindata.comurl + 'toy.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('商品系列数据======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          _this.setData({
            dataInfo:res.data.Info,
            dataList:res.data.List.goods,
            noBuyToyStatus : res.data.Info.noBuyToyStatus || false,
            skiplist:res.data.List.skip
          })
        } else {
          app.showToastC(res.data.msg);
        }
      }
    });
  },

  jumpAreward:function(e){
    // 跳转类型 0不显示 1抽盒机 2一番赏
    var _this = this;
    var skipType = e.currentTarget.dataset.skiptype || 0;
    var skipNeedId = e.currentTarget.dataset.skipid || 0;
    if(skipType == 1){
        if(skipNeedId !=0 ){
           app.comjumpwxnav(9005,skipNeedId,'','')
        }else{
           app.comjumpwxnav(988,'','','')
        };
    }else if(skipType == 2){
        if(skipNeedId !=0 ){
          app.comjumpwxnav(9016,skipNeedId,'','')
        }else{
          app.comjumpwxnav(9015,'','','')
        };
    }else if(skipType == 3){
      if(skipNeedId !=0 ){
        app.comjumpwxnav(9004,skipNeedId,'','')
      }else{
        app.comjumpwxnav(990,'','','')
      };
    }
  },

  jumpshopbut:function(w){
    var name = w.currentTarget.dataset.name || w.target.dataset.name;
    var minprice = w.currentTarget.dataset.minprice || w.target.dataset.minprice||0;
    var maxprice = w.currentTarget.dataset.maxprice || w.target.dataset.maxprice || 0;
    var goods_id = w.currentTarget.dataset.goods_id || w.target.dataset.goods_id || '';
    if (minprice == 0 && maxprice==0){
      app.showToastC('暂无该款信息');
      return false
    };
    var urlname = encodeURIComponent(name);
    wx.navigateTo({
      url: "/page/component/pages/ocamcart/ocamcart?name=" + urlname+"&but=shop&goods_id="+goods_id
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
  reset(){
    this.setData({pid:0,dataList:[],loadprompt:false,nodata:false})
    clearInterval(this.data.timer); 
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // this.reset();
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


})