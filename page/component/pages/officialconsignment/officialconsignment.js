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
    isProduce: app.signindata.isProduce,
    // 数据 
    listdata:[],
    headhidden:false,
    shopnum:0,
    dryinglistnum:0,

    c_title: '官方寄售',
    c_arrow: true,
    c_backcolor: '#ff2742',
    page:0,
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    iftrnodata:false,
    inputdata: '',
    searchorwhole:true,
    windowHeight: app.signindata.windowHeight - 65 - wx.getStorageSync('statusBarHeightMc') || 0,
    signinlayer: false,
  },

  // input 值改变
  inputChange: function (e) {
    this.setData({
      inputdata: e.detail.value
    });
  },
  wholefun:function(){
    this.setData({
      inputdata: ''
    })
    // 获取list数据
    this.listdata(0);
  },
  // 搜索
  jumpsoousuo: function () {
    // 获取list数据
    this.listdata(0);
  },
  mtdlocationfun:function(){
    var _this = this;
    this.setData({
      mtdlocation:false
    });
    this.listdata(0);
    let pages = getCurrentPages();
    let prevpage = pages[pages.length - 2];
    if (prevpage) {
      wx.navigateBack();
    } else {
      wx.redirectTo({
        url: "/page/component/pages/myothertoydg/myothertoydg?ownerId=" + _this.data.uid
      });
    };
  },


  // 授权
  clicktga: function () {
    app.clicktga(2)
  },
  clicktganone: function () {
    this.setData({ tgabox: false })
  },
  userInfoHandler: function (e) {
    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 确认授权用户统计
          app.clicktga(4);
          _this.setData({
            tgabox: false,
            signinlayer: true,
          });
          // '已经授权'
          _this.data.loginid = app.signindata.loginid,
            _this.data.openid = app.signindata.openid,
            _this.data.isNewer = app.signindata.isNewer;

          _this.setData({
            uid: app.signindata.uid,
            avatarUrl: app.signindata.avatarUrl,
            isProduce: app.signindata.isProduce,
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this);
          };
        } else {
          _this.setData({
            tgabox: true
          });
        }
      }
    });
    if (e.detail.detail.userInfo) { } else {
      app.clicktga(8) //用户按了拒绝按钮
    };
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoadfun: function () {
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      isShareFun: app.signindata.isShareFun,
    });
    _this.listdata(0);
    this.selectComponent("#hide").getappData()
    // 购物车数量
    Dec.shopnum(_this,app.signindata.comurl);
    var qqq = Dec.Aese('operation=info&mod=info');
    // 调取晒单数量
    Dec.dryingSum(_this, app.signindata.clwcomurl);
    // 获取默认信息
    wx.request({
      url: app.signindata.comurl + 'general.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            defaultinformation: res.data.Info,
            wxnum: res.data.Info.cs.wxid || 'meichai666666',
          });
          app.signindata.defaultinformation = res.data.Info || '';
        };
      }
    });

  }, 
  // 阻止蒙层冒泡
  preventD() { },
  onLoad: function (options) {
 
    // 购物车数据显示
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      drying_id: options.drying_id||'',
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      isShareFun: app.signindata.isShareFun
    });

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // '已经授权'
          _this.data.loginid = app.signindata.loginid;
          _this.data.openid = app.signindata.openid;
          _this.setData({
            signinlayer: true,
            uid: app.signindata.uid,
            isProduce: app.signindata.isProduce,
            isShareFun: app.signindata.isShareFun
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this)
          }
        } else {
          _this.onLoadfun();
          this.setData({
            signinlayer: false,
          })
        }
      }
    });
    

  },
  listdata: function (num){
    var _this = this;
    if (num == 0) {
      _this.data.page = 0;
      _this.setData({ listdata: [], iftrnodata:false });
    } else {
      var pagenum = parseInt(_this.data.page)
      _this.data.page = ++pagenum;
    };
    // 发现详情
    var qqq = Dec.Aese('mod=cabinet&operation=consignmentList&pid=' + _this.data.page + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&Keyword=' + _this.data.inputdata);
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        _this.setData({ iftrnodata:true});
        if (res.data.ReturnCode == 200) {
          var listdata = res.data.List || [];
          if (listdata.length!=0){
            if (num == 0) {
              _this.setData({ listdata: listdata });
            } else {
              var ltlist = _this.data.listdata.concat(listdata);
              _this.setData({ listdata: ltlist });
            };
          }else{
            app.showToastC('暂无更多数据');
          };
          if (_this.data.inputdata==''){
            _this.setData({
              searchorwhole:true
            })
          }else{
            _this.setData({
              searchorwhole: false
            })            
          }

        };
      }
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
    this.listdata(0);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.listdata(1);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    var reshare = Dec.sharemc();
    return reshare
  },
  dlfindfun: function () {
    setTimeout(function () {
      wx.reLaunch({
        url: "/page/component/pages/dlfind/dlfind",
      })
    }, 100);
  },
  // 导航跳转
  whomepage: function () {
    setTimeout(function () {
      wx.reLaunch({
        url: "../../../../pages/index/index?judgeprof=2"
      })
    }, 40);
  },
  wmy: function () {
    setTimeout(function () {
      wx.reLaunch({
        url: "../../../../pages/wode/wode"
      });
    }, 40);
  },
  wshoppingCart: function () {
    setTimeout(function () {
      wx.reLaunch({
        url: "../../../../pages/shoppingCart/shoppingCart"
      });
    }, 100);
  },



  // 计算图片大小
  imageLoad: function (e) {
    var _this = this;
    var ind = parseInt(e.currentTarget.dataset.ind || e.target.dataset.ind || 0);
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;
    var viewHeight = 150,           //设置图片显示宽度，
      viewWidth = 150 * ratio;
    var listdata = this.data.listdata;
    if (viewWidth > 160) {
      viewWidth = 160;
    };
    if (listdata[ind]) {
      listdata[ind].width = viewWidth;
      _this.setData({
        listdata: listdata
      })
    };
  },

  owneridfun: function (event) {
    var id = event.currentTarget.dataset.ownerid || event.target.dataset.ownerid||'';
    var _this = this;
    wx.navigateTo({
      url: "/page/component/pages/myothertoydg/myothertoydg?ownerId=" + id,
    });
  },
  jumpsmokelist:function(){
    wx.navigateTo({
      url: "/pages/smokeboxlist/smokeboxlist"
    });
  },
  // 导航跳转 
  wnews: function () {
    var _this = this;
    setTimeout(function () {
      app.limitlottery(_this);
    }, 100);
  },

  pullupsignin: function () {
    // // '没有授权'
    this.setData({
      tgabox: true
    });
  },

})