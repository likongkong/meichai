var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '', 
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
    limit:20,
    dataList:[],
    loadprompt:true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.seriesId = options.seriesId;
    this.data.pageid = options.pageid;
    if(options.pageid == 0){
      this.setData({c_title:'捡漏专区'})
    }else{
      this.setData({c_title:'热门专区'})
    }
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


  getInfo(){
    var _this = this;
    let url = '';
    wx.showLoading({ title: '加载中...'})
    if(this.data.pageid == 0){
      url = 'http://meichai-1300990269.cos.ap-beijing.myqcloud.com/produce/toyCabinetChearperZone.json'
    }else{
      url = 'http://meichai-1300990269.cos.ap-beijing.myqcloud.com/produce/toyCabinetHotZone.json'
    }
    wx.request({
      url:url,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('专区数据======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        _this.data.allData = res.data.List.role;
        _this.data.processingData = _this.data.allData;
        // 处理数据分页        
        _this.processingDataPaging();
      }
    });
  },

    // 处理列表数据分页
    processingDataPaging(){
      let _this = this;
      let pid = _this.data.pid;
      let limit = _this.data.limit;
      let dataList = _this.data.processingData;
      let data = [];
      if(pid == 0){
        for (let i=0; i < limit; i++) {
          if(dataList[i]!=undefined){
            data.push(dataList[i])
          }else{
            _this.data.loadprompt = false;
          }
        }
      }else{
        let num = Number(pid*limit);
        let len = Number(num+limit);
        for (let i=num; i < len; i++) {
          if(dataList[i]!=undefined){
            data.push(dataList[i])
          }else{
            _this.data.loadprompt = false;
          }
        }
      }
      console.log(data,pid)
      setTimeout(function(){
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
      },500)
      _this.setData({
        dataList: [..._this.data.dataList,...data]
      })
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
    this.setData({pid:0,dataList:[],loadprompt:true,nodata:false})
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
    if(this.data.loadprompt){
      this.data.pid = ++this.data.pid;
      // 处理数据分页    
      wx.showLoading({ title: '加载中...'})    
      this.processingDataPaging();
    }else{
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 2000
      })
    }
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