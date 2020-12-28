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
    appNowTime: Date.parse(new Date()),
    // 适配苹果X 
    isIphoneX: app.signindata.isIphoneX,
    headhidden: false,
    shopnum: 0,
    dryinglistnum: 0,

    c_title: '中奖记录',
    c_arrow: true,
    c_backcolor: '#ff2742',
    page: 0,
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    bannerdata: [{
        img: 'https://www.51chaidan.com//data/afficheimg/chaiminghe.jpg'
      },
      {
        img: 'https://www.51chaidan.com//data/afficheimg/bigShot.jpg?2'
      },
    ],
    scrolldata: {},
    listdata: [],

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoadfun: function() {
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isShareFun: app.signindata.isShareFun,
      isProduce: app.signindata.isProduce,
    });
    _this.listdata(0);
    // 购物车数量
    Dec.shopnum(_this,app.signindata.comurl);
    // 调取晒单数量
    Dec.dryingSum(_this, app.signindata.clwcomurl);

  },
  // 阻止蒙层冒泡
  preventD() {},
  onLoad: function(options) {

    // 购物车数据显示
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      drying_id: options.drying_id || '',
      uid: app.signindata.uid,
      isShareFun: app.signindata.isShareFun
    });
    _this.onLoadfun();

  },
  listdata: function(num) {
    var _this = this;
    if (num == 0) {
      _this.data.page = 0;
      _this.setData({
        listdata: []
      });
    } else {
      var pagenum = parseInt(_this.data.page)
      _this.data.page = ++pagenum;
    };
    var qqq = Dec.Aese('mod=fleet&operation=getRecord&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&pid=' + _this.data.page);
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.signindata.comurl + 'spread.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        if (res.data.ReturnCode == 200) {
          var recordList = res.data.List.record || [];
          if (num == 0 && recordList && recordList.length != 0) {
            _this.setData({
              recordList: recordList,
            })
          } else if (recordList && recordList.length > 0) {
            var ltlist = _this.data.recordList.concat(recordList);
            _this.setData({
              recordList: ltlist
            });
          } else {
            app.showToastC('没有更多数据了');
          }
        } else {
          app.showToastC('没有更多数据了');
        }
      }
    });


  },

  // 计算图片大小
  imageLoad: function(e) {
    var _this = this;
    var iftr = parseInt(e.currentTarget.dataset.iftr || e.target.dataset.iftr || 0);
    if (iftr == 1) {

    } else if (iftr == 2) {

      var ind = parseInt(e.currentTarget.dataset.ind || e.target.dataset.ind || 0);
      var outindex = parseInt(e.currentTarget.dataset.outindex || e.target.dataset.outindex || 0);
      var $width = e.detail.width, //获取图片真实宽度
        $height = e.detail.height,
        ratio = $width / $height;
      var viewHeight = 140, //设置图片显示宽度，
        viewWidth = 140 * ratio;
      var bannerdata = this.data.bannerdata;
      if (bannerdata[ind]) {
        _this.setData({
          ['recordList[' + outindex + '].record[' + ind + '].width']: viewWidth
        })
      };
    } else if (iftr == 3) {

    } else if (iftr == 4) {

    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.listdata(0);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.listdata(1);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(options) {
    var reshare = app.sharemc();
    return reshare
  },
  dlfindfun: function() {
    wx.reLaunch({
      url: "/page/component/pages/dlfind/dlfind",
    })
  },
  // 导航跳转
  whomepage: function() {
    wx.reLaunch({
      url: "../../../../pages/index/index?judgeprof=2"
    })
  },
  wmy: function() {
    wx.reLaunch({
      url: "../../../../pages/wode/wode"
    });
  },
  wshoppingCart: function() {
    wx.reLaunch({
      url: "../../../../pages/shoppingCart/shoppingCart"
    });
  },


  // 导航跳转 
  wnews: function() {
    var _this = this;
    app.limitlottery(_this);
  },
  jumpsmoke: function() {
    wx.navigateTo({
      url: "/pages/smokeboxlist/smokeboxlist",
    });
  },

})