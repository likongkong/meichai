// page/component/pages/bargainList/bargainList.js
var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();

Page({
  data: {
    // 接口地址
    comurl: app.signindata.comurl,
    gifturl: app.signindata.clwcomurl,
    version: Pub.versionNumber(),
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,

    list: [],

    page: 1,

    ishowlist: false,
    typeList: [0, 1, 2, 3, 4, 5],

    scrollleft: 0,

    selectid: 1,

    refreshid: "-1",

    // 晒单数量
    dryinglistnum: 0,
    shopnum: 0,
    defaultinformation: '',
    // 适配苹果X
    isIphoneX: app.signindata.isIphoneX,
    isStore: app.signindata.isStore,
    isProduce: app.signindata.isProduce,
    isbargain: 1,
    ishare: 1, //共享
    sharelist: [],
    sharepage: 1,
    ishowExplain:false,

    c_title: '砍价',
    c_arrow: true,
    c_backcolor: '#ff6968',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    pushWay: 0
  },

  openExplain: function () {
    var _this = this
    this.setData({
      ishowExplain: !_this.data.ishowExplain,
    })
  },
  
  // 授权点击统计
  clicktga: function () {
    app.clicktga(2)
  },

  switchlist: function(w) {
    var _this = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          var tag = w.currentTarget.dataset.tag || w.target.dataset.tag;
          this.setData({
            isbargain: tag,
          })
          if (tag == 2) {
            _this.data.sharepage = 1;
            _this.getshareList(_this.data.sharepage, _this.data.ishare == 1 ? "launch" : "help")
          } else {
            _this.data.page = 1;
            _this.getList(1, _this.data.refreshid);
          }

        } else {
          _this.setData({
            tgabox: true,
          })
        }
      }
    });

    
  },

  sharebargain: function(w) {
    var _this = this
    var tag = w.currentTarget.dataset.tag || w.target.dataset.tag;

    this.setData({
      ishare: tag,
    })
    _this.data.sharepage = 1;
    if (tag == 2) {
      _this.getshareList(_this.data.sharepage, "help")
    } else {
      _this.getshareList(_this.data.sharepage, "launch")
    }
  },

  bargainclass: function() {
    var _this = this
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.signindata.clwcomurl + 'bargainclass',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        source: 4,
        vcode: _this.data.version,

      },
      complete: function() {
        wx.hideLoading()
      },
      success: function(res) {
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          _this.setData({
            typeList: res.data.List,
            selectid: res.data.List[0].cat_id,
          })
        } else {

        }
      },
    })
  },

  typeClick: function(w) {
    var _this = this
    var id = w.currentTarget.dataset.id || w.target.dataset.id;
    var index = w.currentTarget.dataset.index || w.target.dataset.index;
    this.setData({
      selectid: id,
    })
    var query = wx.createSelectorQuery();
    query.select('#q' + id).boundingClientRect();
    query.exec(function(res) {
      if (res && res[0] && res[0].width){
        _this.setData({
          scrollleft: w.currentTarget.offsetLeft - (wx.getSystemInfoSync().windowWidth) / 2 + (res[0].width / 2)
        });
      };
    });

    var _this = this;
    _this.data.page = 1;
    _this.setData({
      refreshid: id,
    })
    _this.getList(1, id);
  },

  clickcut: function() {
    var _this = this;
    this.setData({
      ishowlist: !_this.data.ishowlist,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.data.pushWay = options.pushWay || 0;
    _this.setData({
      uid: app.signindata.uid,
      isStore: app.signindata.isStore,
      isProduce: app.signindata.isProduce,
    });

    _this.onLoadfun();
    
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
            tgabox: false
          });
          // '已经授权'
          _this.data.loginid = app.signindata.loginid,
            _this.data.openid = app.signindata.openid,
            _this.setData({
              uid: app.signindata.uid,
              isShareFun: app.signindata.isShareFun
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

  onLoadfun: function() {
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isStore: app.signindata.isStore,
      isProduce: app.signindata.isProduce,
    });

    _this.getList(1, _this.data.refreshid);
    _this.bargainclass();
    this.selectComponent("#hide").getappData()
    // 调取晒单数量
    Dec.dryingSum(_this, app.signindata.clwcomurl);
    var qqq = Dec.Aese('operation=info&mod=info');
    // 获取默认信息
    wx.request({
      url: app.signindata.comurl + 'general.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            defaultinformation: res.data.Info,
          });
        };
        Dec.comiftrsign(_this, res, app);
        // 购物车数据显示
        Dec.shopnum(_this,app.signindata.comurl);
      }
    });
    // 统计推送进入
    if (_this.data.pushWay > 0) {
      app.pushfun(_this);
    }

  },

  onShow: function() {

    var _this = this;
    if (_this.data.isbargain == 1) {
      _this.data.page = 1;
      _this.getList(1, _this.data.refreshid);
    } else {
      _this.data.sharepage = 1;
      if (_this.data.ishare == 2) {
        _this.getshareList(_this.data.sharepage, "help")
      } else {
        _this.getshareList(_this.data.sharepage, "launch")
      }
    }

  },

  goDetail: function(w) {
    var _this = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          //已经授权
          var id = w.currentTarget.dataset.id || w.target.dataset.id;
          var ishare = w.currentTarget.dataset.ishare || w.target.dataset.ishare;
          wx.navigateTo({
            url: "../bargainDetail/bargainDetail?goods_id=" + id + "&ishare=" + ishare,
          })

        } else {
          _this.setData({
            tgabox: true,
          })
        }
      }
    });

    
  },

  gorder: function(w) {
    var id = w.currentTarget.dataset.id || w.target.dataset.id;
    var ishare = w.currentTarget.dataset.ishare || w.target.dataset.ishare;
    wx.navigateTo({
      url: "../bargainDetail/bargainDetail?order_sn=" + id + "&ishare=" + ishare,
    })
  },

  jumporder: function(w) {
    var id = w.currentTarget.dataset.id || w.target.dataset.id;
    var status = w.currentTarget.dataset.status || w.target.dataset.status;
    wx.navigateTo({
      url: "../bargainDetail/bargainDetail?goods_id=" + id + "&status=" + status,
    })
  },

  getList: function(page, cat_id) {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.signindata.clwcomurl + 'jigsawlist',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        source: 4,
        vcode: _this.data.version,
        more: 'more',
        page: page,
        is_bargain: 'bargain',
        launch: 'meichai',
        cat_id: cat_id,
      },
      complete: function() {
        wx.hideLoading()
      },
      success: function(res) {
        wx.stopPullDownRefresh();
        if (res.data.ReturnCode == 200) {
          if (page == 1) {
            _this.setData({
              list: res.data.List,
            })
          } else if (res.data.List) {
            var l = _this.data.list.concat(res.data.List);
            _this.setData({
              list: l,
            })
          } else {
            _this.setData({
              page: page - 1,
            })
          }
        } else {

        }
      },
    })
  },

  getshareList: function(page, mclass) {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.signindata.clwcomurl + 'bargain_shareList',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        source: 4,
        vcode: _this.data.version,
        class: mclass,
        page: page,
      },
      complete: function() {
        wx.hideLoading()
      },
      success: function(res) {
        wx.stopPullDownRefresh();
        if (res.data.ReturnCode == 200) {
          if (page == 1) {
            _this.setData({
              sharelist: res.data.List,
            })
          } else if (res.data.List) {
            var l = _this.data.sharelist.concat(res.data.List);
            _this.setData({
              sharelist: l,
            })
          } else {
            _this.setData({
              sharepage: page - 1,
            })
          }
        } else {

        }
      },
    })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var _this = this;
    if (_this.data.isbargain == 1) {
      _this.data.page = 1;
      _this.getList(1, _this.data.refreshid);
    } else {
      _this.data.sharepage = 1;
      if (_this.data.ishare == 2) {
        _this.getshareList(_this.data.sharepage, "help")
      } else {
        _this.getshareList(_this.data.sharepage, "launch")
      }
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var _this = this;
    if (_this.data.isbargain == 1) {
      var p = _this.data.page + 1;
      _this.data.page = p;
      _this.getList(p, _this.data.refreshid);
    } else {
      var p = _this.data.sharepage + 1;
      _this.data.sharepage = p;
      if (_this.data.ishare == 2) {
        _this.getshareList(p, "help")
      } else {
        _this.getshareList(p, "launch")
      }
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var _this = this
    var share = {
      title: '只要朋友多，0元购好物，赶快呼朋唤友来砍价吧！',
      path: 'page/component/pages/bargainList/bargainList',
      imageUrl: '../images/bargain_list_share.png',
      success: function(res) {

      }
    }
    return share;
  },

  // 导航跳转
  whomepage: function() {
    wx.reLaunch({
      url: "/pages/index/index?judgeprof=2"
    });
  },

  dlfindfun: function() {
    wx.reLaunch({
      url: "/page/component/pages/dlfind/dlfind",
    })
  },

  // 导航跳转 
  wnews: function() {
    var _this = this;
    app.limitlottery(_this);
  },

  wshoppingCart: function() {
    wx.redirectTo({
      url: "/pages/shoppingCart/shoppingCart"
    });
  },

  wmy: function() {
    app.signindata.iftr_mc = true;
    wx.redirectTo({
      url: "/pages/wode/wode"
    });
  },

})