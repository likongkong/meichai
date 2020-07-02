var Dec = require('../../../../common/public.js'); //aes加密解密js

const app = getApp();
Page({
  data: {
    //接口地址
    comurl: app.signindata.comurl,
    // 图片地址
    zdyurl: Dec.zdyurl(),

    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,
    avatarUrl: app.signindata.avatarUrl,
    isProduce: app.signindata.isProduce,
    // 适配苹果X
    isIphoneX: app.signindata.isIphoneX,

    c_title: '限定抽签',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    listdata: [],
    pid: 0,
    // 晒单数量
    dryinglistnum: 0,
    shopnum: 0,
    nodataiftr: false,
    windowHeight: app.signindata.windowHeight - 65 - wx.getStorageSync('statusBarHeightMc') || 0,
    signinlayer: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 判断是否授权 
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      isProduce: app.signindata.isProduce,
      // 适配苹果X 
      isIphoneX: app.signindata.isIphoneX
    });

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // '已经授权'
          _this.setData({
            loginid: app.signindata.loginid,
            uid: app.signindata.uid,
            openid: app.signindata.openid,
            isProduce: app.signindata.isProduce,
            // 适配苹果X 
            isIphoneX: app.signindata.isIphoneX
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this)
          }
          _this.setData({
            signinlayer: true,
          })
        } else {
          wx.hideLoading()
          _this.onLoadfun();
          this.setData({
            signinlayer: false,
          })
        }
      }
    });

  },
  onLoadfun: function() {
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      isProduce: app.signindata.isProduce,
      // 适配苹果X 
      isIphoneX: app.signindata.isIphoneX
    });

    _this.listdata(1),
      // 调取晒单数量
      Dec.dryingSum(_this, app.signindata.clwcomurl);
    // 购物车数据显示
    Dec.shopnum(_this,app.signindata.comurl);

    if (app.signindata.isAwardOrder) {
      _this.setData({
        isAwardOrder: app.signindata.isAwardOrder,
        awardOrder: app.signindata.awardOrder || false
      });
      app.winningtheprizetime(_this);
    };

  },

  // 授权点击统计
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

  jumporder: function() {
    var _this = this;
    app.jumporder(_this);
  },

  listdata: function(num) { // 1 下拉 2 上拉
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    if (num == 1) {
      _this.setData({
        pid: 0,
        nodataiftr: false
      });
    } else {
      var pagenum = _this.data.pid;
      _this.setData({
        pid: ++pagenum,
        nodataiftr: false
      });
    };
    var q = Dec.Aese('mod=lotto&operation=list&uid='  + _this.data.uid + '&loginid=' + _this.data.loginid + '&pid=' + _this.data.pid);
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        // 刷新完自带加载样式回去
        wx.hideLoading()
        wx.stopPullDownRefresh();
        _this.setData({
          nodataiftr: true
        });
        if (res.data.ReturnCode == 200) {
          var arrlist = res.data.List.inProgree || [];
          if (arrlist && arrlist.length != 0) {
            for (var i = 0; i < arrlist.length; i++) {
              if (arrlist[i].status == 1) {
                arrlist[i].start_time = _this.toDate(arrlist[i].start_time);
              } else if (arrlist[i].status == 2) {
                arrlist[i].stop_time = _this.toDate(arrlist[i].stop_time);
              };
            };
            if (num == 1) {
              var comdataarr = arrlist || [];
              var signarray = res.data.List.sign || [];
              var finishedarray = res.data.List.finished || [];
            } else {
              var comdataarr = _this.data.listdata.concat(arrlist);
              var signarray = _this.data.listdata.concat(res.data.List.sign);
              var finishedarray = _this.data.listdata.concat(res.data.List.finished);
            };
            _this.setData({
              listdata: comdataarr,
              signlist: signarray,
              finishedlist: finishedarray,
            });
          } else {
            app.showToastC('暂无更多数据');
          };

        };
        if (res.data.ReturnCode == 300) {
          app.showToastC('暂无更多数据');
          if (num == 1) {
            _this.setData({
              listdata: []
            });
          }
        };
        if (res.data.ReturnCode == 900) {
          app.showToastC('登陆状态有误');
        };
        _this.setData({
          nodataiftr: true
        })

      }

    });
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
    this.listdata(1)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.listdata(2)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  jumpaction: function(w) {
    var path = w.currentTarget.dataset.path || w.target.dataset.path || '';
    wx.navigateTo({
      url: path
    });
  },
  //时间戳转换时间  
  toDate: function(number) {
    var date = new Date(number * 1000);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    if (new Date(number * 1000).toDateString() === new Date().toDateString()) {
      return h + ':' + m + ':' + s;
    } else {
      return M + '月' + D + '日' + ' ' + h + ':' + m;
    }
  },



  // 导航跳转
  whomepage: function() {
    setTimeout(function() {
      wx.reLaunch({
        url: "/pages/index/index?judgeprof=2"
      });
    }, 100);
  },

  dlfindfun: function() {
    setTimeout(function() {
      wx.reLaunch({
        url: "/page/component/pages/dlfind/dlfind",
      })
    }, 100);
  },

  // 导航跳转 
  wnews: function() {
    var _this = this;
    app.limitlottery(_this); 
  },

  wshoppingCart: function() {
    setTimeout(function() {
      wx.redirectTo({
        url: "/pages/shoppingCart/shoppingCart"
      });
    }, 100);
  },

  wmy: function() {
    app.signindata.iftr_mc = true;
    setTimeout(function() {
      wx.redirectTo({
        url: "/pages/wode/wode"
      });
    }, 40);
  },
  // 跳转抽签详情
  limitlotteryd: function(w) {
    var id = w.currentTarget.dataset.gid || w.target.dataset.gid;
    wx.navigateTo({
      url: "/page/component/pages/limitlottery/limitlottery?id=" + id
    });
  },
  // 计算图片大小
  imageLoadad: function(e) {
    var _this = this;
    var indexnum = e.currentTarget.dataset.indexnum || e.target.dataset.indexnum || 0;
    var listdata = _this.data.listdata || [];
    var $width = e.detail.width,
      $height = e.detail.height,
      ratio = $width / $height;
    var viewWidth = 714,
      viewHeight = 714 / ratio;
    if (listdata[indexnum]) {
      listdata[indexnum].heightc = viewHeight;
      _this.setData({
        listdata: listdata
      })
    };
  },

  pullupsignin: function () {
    // // '没有授权'
    this.setData({
      tgabox: true
    });
  },
  // 计算图片大小
  imageLoadad: function (e) {
    var _this = this;
    var indexnum = e.currentTarget.dataset.indexnum || e.target.dataset.indexnum || 0;
    // 已报名
    if (indexnum == 1) {
      var ind = e.currentTarget.dataset.ind || e.target.dataset.ind || 0;
      var $width = e.detail.width,
        $height = e.detail.height,
        ratio = $width / $height;
      var viewHeight = 140,
        viewWidth = 140 * ratio;
      var signlist = this.data.signlist;
      if (signlist[ind]) {
        if (signlist[ind]) {
          signlist[ind].width = viewWidth;
          _this.setData({
            ['signlist[' + ind + '].width']: viewWidth
          });
        };
      };
    } else if (indexnum == 2) { // 已完成
      var ind = e.currentTarget.dataset.ind || e.target.dataset.ind || 0;
      var $width = e.detail.width,
        $height = e.detail.height,
        ratio = $width / $height;
      var viewHeight = 140,
        viewWidth = 140 * ratio;
      var finishedlist = this.data.finishedlist;
      if (finishedlist[ind]) {
        _this.setData({
          ['finishedlist['+ind+'].width']: viewWidth
        })
      };
    };
  },

})