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

    c_title: '开车送隐藏',
    c_arrow: true,
    c_backcolor: '#ff2742',
    page: 0,
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    bannerdata: [],
    scrolldata: {},
    listdata: [],
    tickettip: false,
    // 车票数
    ticket: '',
    record: {},
    nomoredata:false
  },
  tickettipfun: function() {
    this.setData({
      tickettip: !this.data.tickettip
    });
  },
  // 授权
  clicktga: function() {
    app.clicktga(2)
  },
  // 点击登录获取权限
  userInfoHandler: function(e) {
    var _this = this;
    if (e.detail.userInfo) {} else {
      app.clicktga()
    };
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          _this.setData({
            tgabox: false
          });
          _this.activsign();
          // 确认授权用户统计
          app.clicktga()
        };
      }
    });
  },
  activsign: function() {
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
            isShareFun: app.signindata.isShareFun
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this);
          }
        } else {
          wx.getUserInfo({
            success: res => {
              // 判断是否登录
              if (_this.data.loginid != '' && _this.data.uid != '') {
                _this.onLoadfun();
              } else {
                app.signin(_this);
              }
            },
            fail: res => {
              // '没有授权 统计'
              app.userstatistics(35);
              // '没有授权'
              _this.setData({
                tgabox: true
              });
            }
          });
        }
      }
    });
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
    var qqq = Dec.Aese('operation=info&mod=info');
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

    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      _this.onLoadfun();
    }else{

      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // '已经授权'
            _this.data.loginid = app.signindata.loginid;
            _this.data.openid = app.signindata.openid;
            _this.setData({
              uid: app.signindata.uid,
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
            _this.setData({
              tgabox: true
            });
          }
        }
      });
    };

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
    _this.setData({ nomoredata:false})
    var qqq = Dec.Aese('mod=fleet&operation=getList&pid=' + _this.data.page + '&class=5&personal_list=1&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&pid=' + _this.data.page);
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
        _this.setData({
          iftrnodata: true
        });
        if (res.data.ReturnCode == 200) {
          if (num == 0) {
            var ticket = res.data.Info.ticket || 0;
            var bannerdata = res.data.List.banner || [];
            var record = res.data.List.record[0]|| {};
            var listdata = res.data.List.activity || [];
            if (listdata && listdata.length != 0) {
              for (var i = 0; i < listdata.length; i++) {
                if (listdata[i].teamMember && listdata[i].teamVolume != listdata[i].teamMember.length) {
                  var numa = parseInt(listdata[i].teamVolume) - parseInt(listdata[i].teamMember.length);
                  var arr = [];
                  for (var j = 0; j < numa; j++) {
                    arr.push(j);
                  };
                  listdata[i].addarr = arr;
                }
              }
            };
            _this.setData({
              ticket: ticket,
              bannerdata: bannerdata,
              scrolldata: record,
              listdata: listdata
            })
          } else {
            var listdata = res.data.List.activity || [];
            if (listdata && listdata.length != 0) {
              for (var i = 0; i < listdata.length; i++) {
                if (listdata[i].teamVolume != listdata[i].teamMember.length) {
                  var numa = parseInt(listdata[i].teamVolume) - parseInt(listdata[i].teamMember.length);
                  var arr = [];
                  for (var j = 0; j < numa; j++) {
                    arr.push(j);
                  };
                  listdata[i].addarr = arr;
                }
              };
              var ltlist = _this.data.listdata.concat(listdata);
              _this.setData({
                listdata: ltlist
              });
            } else {
              _this.setData({ nomoredata: true })
            };

          };

        } else if (res.data.ReturnCode == 300) {
          _this.setData({ nomoredata: true })
        } else {
          app.showToastC(res.data.Msg);
        };
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
  onShareTimeline:function(){
    return {
      title:'潮玩社交平台',
      query:{}    
    }
  },
  onShareAppMessage: function(options) {
    var reshare = Dec.sharemc();
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



  // 计算图片大小
  imageLoad: function(e) {
    var _this = this;
    var iftr = parseInt(e.currentTarget.dataset.iftr || e.target.dataset.iftr || 0);
    if (iftr == 1) {
      var ind = parseInt(e.currentTarget.dataset.ind || e.target.dataset.ind || 0);
      var $width = e.detail.width, //获取图片真实宽度
        $height = e.detail.height,
        ratio = $width / $height;
      var viewHeight = 110, //设置图片显示宽度，
        viewWidth = 110 * ratio;
      var bannerdata = this.data.bannerdata;
      if (bannerdata[ind]) {
        bannerdata[ind].width = viewWidth;
        _this.setData({
          ['bannerdata[' + ind + '].width']: viewWidth
        })
      };
    } else if (iftr == 2) {
      
      var ind = parseInt(e.currentTarget.dataset.ind || e.target.dataset.ind || 0);
      var $width = e.detail.width, //获取图片真实宽度
        $height = e.detail.height,
        ratio = $width / $height;
      var viewHeight = 140, //设置图片显示宽度，
        viewWidth = 140 * ratio;
      var bannerdata = this.data.bannerdata;
      if (bannerdata[ind]) {
        _this.setData({
          ['scrolldata.record[' + ind + '].width']: viewWidth
        })
      };
    } else if (iftr == 3) {
      var ind = parseInt(e.currentTarget.dataset.ind || e.target.dataset.ind || 0);
      var $width = e.detail.width, //获取图片真实宽度
        $height = e.detail.height,
        ratio = $width / $height;
      var viewHeight = 140, //设置图片显示宽度，
        viewWidth = 140 * ratio;
      var bannerdata = this.data.bannerdata;
      if (bannerdata[ind]) {
        _this.setData({
          ['listdata[' + ind + '].width']: viewWidth
        })
      };
    } else if(iftr == 4){

    }

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
  jumpdhl: function() {
    wx.navigateTo({
      url: "/page/component/pages/drivetohidelist/drivetohidelist",
    });
  },
  jumpdhhdetail: function(w) {
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    wx.navigateTo({
      url: "/page/component/pages/drivetohide/drivetohide?id=" + id,
    });
  },
  jumpnewsignin:function(){
    wx.navigateTo({
      url: "/page/component/pages/newsignin/newsignin",
    });
  }
})