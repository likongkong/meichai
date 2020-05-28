// page/component/pages/mingboxList/mingboxList.js
var Dec = require('../../../../common/public.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
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
    defaultinformation: '',

    // 晒单数量
    dryinglistnum: 0,
    shopnum: 0,
    spreadEntry: app.signindata.spreadEntry,

    list: [],

    c_title: '原价拆明盒',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),

    pid: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      avatarUrl: app.signindata.avatarUrl,
      spreadEntry: app.signindata.spreadEntry,
    });
    wx.showLoading({
      title: '加载中...',
    })

    // 判断是否授权 

    var _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // '已经授权'
          _this.data.loginid = app.signindata.loginid;
          _this.data.openid = app.signindata.openid;
          _this.setData({
            uid: app.signindata.uid,
            avatarUrl: app.signindata.avatarUrl,
            isProduce: app.signindata.isProduce,
            spreadEntry: app.signindata.spreadEntry,
          });

          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this)
          }
        } else {
          wx.hideLoading()
          // '没有授权 统计'
          app.userstatistics(25);
          _this.onLoadfun();
        }
      }
    });

  },

  // 授权点击统计
  clicktga: function() {
    app.clicktga(2)
  },
  clicktganone: function () {
    this.setData({ tgabox: false })
  },
  userInfoHandler: function(e) {
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
              avatarUrl: app.signindata.avatarUrl,
              isProduce: app.signindata.isProduce,
              spreadEntry: app.signindata.spreadEntry,
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
    if (e.detail.detail.userInfo) {} else {
      app.clicktga(8) //用户按了拒绝按钮
    };

  },

  onLoadfun: function() {
    var _this = this
    wx.hideLoading()

    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      avatarUrl: app.signindata.avatarUrl,
      spreadEntry: app.signindata.spreadEntry,
    });

    

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
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
        // 购物车数据显示
        Dec.shopnum(_this,app.signindata.comurl);
      }
    });
    _this.getlist(_this.data.pid)

    if (app.signindata.isAwardOrder) {
      _this.setData({ isAwardOrder: app.signindata.isAwardOrder, awardOrder: app.signindata.awardOrder || false });
      app.winningtheprizetime(_this);
    };

  },

  jumporder: function () {
    var _this = this;
    app.jumporder(_this);
  },

  getlist: function(pid) {
    var _this = this
    wx.showLoading({
      title: '加载中...',
    })
    var q1 = Dec.Aese('mod=showBox&operation=list&uid=' + '&loginid=' + "&pid=" + pid);

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },

      success: function(res) {
        wx.stopPullDownRefresh();
        wx.stopPullDownRefresh()
        if (res.data.ReturnCode == 200) {
          var mlist = res.data.List.activity
          for (let i = 0; i < mlist.length; i++) {
            mlist[i].stopdate = formatTimeTwo(mlist[i].stop_time, 'M.D h:m')
          }
          if (pid == 0 && mlist.length > 0) {
            _this.setData({
              list: mlist,
            })
          } else if (mlist.length > 0) {
            mlist = _this.data.list.concat(mlist)
            _this.setData({
              list: mlist,
            })
          } else {
            _this.setData({
              pid: pid - 1,
            })
          }
        }
        wx.hideLoading()
      },

      fail: function(res) {
        wx.stopPullDownRefresh();
        wx.hideLoading()
      }

    })
  },

  jumpdetail: function(w) {
    var _this = this
    var gid = w.currentTarget.dataset.gid;
    var id = w.currentTarget.dataset.id || w.target.dataset.id||0;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.navigateTo({
            url: "/page/component/pages/mingbox/mingbox?gid=" + gid + '&id=' + id,
          });
        } else {
          _this.setData({
            tgabox: true,
          })
        }
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      pid: 0,
    })
    this.getlist(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var p = this.data.pid + 1;
    this.data.pid = p;
    this.getlist(p)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '原价拆明盒列表',
      path: "/page/component/pages/mingboxList/mingboxList",
      success: function(res) {}
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
    setTimeout(function() {
      app.limitlottery(_this);
    }, 100);
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

  jumpaction: function(w) {
    var _this = this
    var path = w.currentTarget.dataset.path || w.target.dataset.path || '';
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.navigateTo({
            url: path
          });
        } else {
          _this.setData({
            tgabox: true,
          })
        }
      }
    });

  },
  // 跳转发起拆明盒
  jumpinitiateopenboxes:function(){
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.navigateTo({
            url: "/page/component/pages/initiateopenboxeslist/initiateopenboxeslist",
          });   
        } else {
          this.setData({
            tgabox: true,
          })
        }
      }
    });

    
  }



})

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
 */
function formatTimeTwo(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}