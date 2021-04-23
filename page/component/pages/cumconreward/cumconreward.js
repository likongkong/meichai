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
    headhidden:false,
    shopnum:0,
    dryinglistnum:0,

    c_title: '',
    c_arrow: true,
    c_backcolor: '#ff2742',
    page:1,
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    scrolllefthq: 0,
    scrollleft: 1,
    scrdata: [{ name: '连续签到7天', value: 1 }, { name: '连续签到15天', value: 2 }, { name: '连续签到30天', value: 3 }],
    commoddata: {},
    countdown: 0,
    tabid:1,
    listdata:[],
    awatip:false,
    signdraw: 1, // 签到 1 抽奖 2
    iftrnodata:false,
    preventmultiplesubmission:true,
    awatxt:'下方商品任选一款'
  },
  disfuncumnone: function () {
    this.setData({ awatip: false });
  },
  // 转盘领取奖励
  receiveawardsweek: function (w) {
    var goods_id = w.target.dataset.goods_id || w.currentTarget.dataset.goods_id||'';
    var frequency = w.target.dataset.frequency || w.currentTarget.dataset.frequency||'';

    var _this = this;
    Pub.postRequest(_this, 'week_total_prize', { uid: _this.data.uid, loginid: _this.data.loginid, goods_id: goods_id, frequency: frequency }, function (res) {
      var cart_id = res.data.List.cart_id || '';
      _this.clicktocollect(cart_id);
      _this.setData({ cart_id: cart_id});
    });
  },
  clicktocollect: function (cart_id) {
    var _this = this;
    if (_this.data.preventmultiplesubmission) {
      _this.setData({ preventmultiplesubmission: false });
      var cart_id = cart_id;
      var qqq = Dec.Aese('mod=operate&operation=receiveaward&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + cart_id);
      wx.request({
        url: app.signindata.comurl + 'order.php' + qqq,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {
          _this.setData({ preventmultiplesubmission: true });
          if (res.data.ReturnCode == 200) {
            app.showToastC('领取成功');
            _this.onLoadfun();
          } else if (res.data.ReturnCode == 830) {
            _this.setData({ awatip: true });
          } else {
            app.showToastC(res.data.Msg);
          };
        }
      });
    };

  }, 
  // 连续签到领取奖励
  receiveawards: function (w) {
    var sign_total = w.currentTarget.dataset.sign_total || w.target.dataset.sign_total || 0;
    var goods_id = w.target.dataset.goods_id || w.currentTarget.dataset.goods_id || '';
    var _this = this;
    Pub.postRequest(_this, 'continuitySignRecive', { uid: _this.data.uid, loginid: _this.data.loginid, sign_total: sign_total, goods_id: goods_id }, function (res) {
      var cart_id = res.data.List.cart_id || '';
      _this.clicktocollect(cart_id)
      _this.setData({ cart_id: cart_id });
    });
  },
  awajump: function () {
    var cart_id = this.data.cart_id || '';
    wx.navigateTo({
      url: "/page/component/pages/awardwinningarea/awardwinningarea?cart_id=" + cart_id,
    });
    this.setData({ awatip: false });
  },
  // tab切换
  tabbotdata: function (w) {
    var _this = this;
    var value = w.currentTarget.dataset.category_id || w.target.dataset.category_id || 0;
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type || 0;
    var tablist = _this.data.tablist||[];
    var title = '';
    for (var i = 0; i < tablist.length; i++) {
      if (tablist[i].value == _this.data.tabid) {
        title = tablist[i].display || '';
      };
    };

    _this.setData({
      tabid: value,
      c_title: title
    });
    // 获取list数据
    this.listdata(0);
    var _this = this;
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#q' + value).boundingClientRect();
    query.exec(function (res) {
      if (res && res[0]) {
        if (res[0].width) {
          _this.setData({
            scrollleft: w.currentTarget.offsetLeft - wx.getSystemInfoSync().windowWidth / 2 + (res[0].width / 2)
          });
        };
      }
    });
  },
  //  获取滚动条位置
  scrollleftf: function (event) {
    this.data.scrolllefthq = event.detail.scrollLeft;
    this.data.scrollwidth = event.detail.scrollwidth;
  },
  // 倒计时
  countdownbfun: function () {
    var _this = this;
    clearInterval(_this.data.timer);
    var countdown = _this.data.countdown;
    var commoddata = _this.data.commoddata||{};

    function nowTime() { //时间函数
      var iftrins = true;
      // 获取现在的时间
      var nowTime = new Date().getTime();
      // nowTime = Date.parse(nowTime);//当前时间戳
      var lastTime = countdown * 1000;
      var differ_time = lastTime - nowTime; //时间差：
      if (differ_time >= 0) {
        var differ_day = Math.floor(differ_time / (3600 * 24 * 1e3));
        var differ_hour = Math.floor(differ_time % (3600 * 1e3 * 24) / (1e3 * 60 * 60));
        var differ_minute = Math.floor(differ_time % (3600 * 1e3) / (1000 * 60));
        var s = Math.floor(differ_time % (3600 * 1e3) % (1000 * 60) / 1000);
        var ms = Math.floor(differ_time % 1000 / 100);
        if (differ_day.toString().length < 2) {
          differ_day = "0" + differ_day;
        };
        if (differ_hour.toString().length < 2) {
          differ_hour = "0" + differ_hour;
        };
        if (differ_minute.toString().length < 2) {
          differ_minute = "0" + differ_minute;
        };
        if (s.toString().length < 2) {
          s = "0" + s;
        };
        commoddata.day = differ_day;
        commoddata.hour = differ_hour;
        commoddata.minute = differ_minute;
        commoddata.second = s;
        commoddata.ms = ms;
      } else {
        commoddata.day = '00'
        commoddata.hour = '00';
        commoddata.minute = '00';
        commoddata.second = '00';
        commoddata.ms = '00';
      };
      if (commoddata.day != '00' || commoddata.hour != '00' || commoddata.minute != '00' || commoddata.second != '00') {
        iftrins = false;
      };
      _this.setData({
        commoddata: commoddata
      });

      if (iftrins) {
        clearInterval(_this.data.timer);
        if (_this.data.jumptime) {
          let pages = getCurrentPages();
          let prevpage = pages[pages.length - 2];
          if (prevpage) {
            wx.navigateBack();
          } else {
            wx.redirectTo({
              url: "/pages/index/index"
            });
          };
          _this.data.jumptime = false;
        }

      };
    }
    if (_this.data.countdown) {
      nowTime();
      clearInterval(_this.data.timer);
      _this.data.timer = setInterval(nowTime, 1000);
    };

  },
  // 授权
  clicktga: function () {
    app.clicktga(2)
  },
  // 点击登录获取权限
  userInfoHandler: function (e) {
    var _this = this;
    if (e.detail.userInfo) { } else {
      app.clicktga()  
    };
    wx.getSetting({
      success: res => {
        if (true) {
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
              app.userstatistics(7);
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
  onLoadfun: function () {
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isShareFun: app.signindata.isShareFun,
      isProduce: app.signindata.isProduce,
      defaultinformation:app.signindata.defaultinformation,
    });
    _this.listdata(0);
    this.selectComponent("#hide").getappData();

    if(this.data.defaultinformation){}else{
      app.defaultinfofun(this);
    };

  }, 
  // 阻止蒙层冒泡
  preventD() { },
  onLoad: function (options) {

    // 签到 1 抽奖 2
    this.setData({
      signdraw: options.signdraw,
      tabid: options.number
    });

    
    // 购物车数据显示
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      drying_id: options.drying_id||'',
      uid: app.signindata.uid,
      isShareFun: app.signindata.isShareFun
    });

    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      _this.onLoadfun();
    }else{
      wx.getSetting({
        success: res => {
          if (true) {
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
  listdata: function (num){
    var _this = this;
    if (num == 0) {
      _this.data.page = 1;
      _this.setData({ listdata: [], iftrnodata:false });
    } else {
      var pagenum = parseInt(_this.data.page)
      _this.data.page = ++pagenum;
    };
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    Pub.postRequest(_this, 'prizeList', { uid: _this.data.uid, loginid: _this.data.loginid, request: _this.data.signdraw, type: 'List', number: _this.data.tabid, page: _this.data.page }, function (res) {
      var listdata = res.data.List||[];
      if (num == 0){
        var tablist = res.data.Info.headData || [];
        var lastmodify = res.data.Info.lastmodify || [];
        var title = '';
        for (var i = 0; i < tablist.length;i++){
          if (tablist[i].value==_this.data.tabid){
            title = tablist[i].display||'';
          };
        };
        _this.setData({
          scrdata: tablist,
          countdown: lastmodify,
          c_title: title
        });
        _this.countdownbfun();
      };
      if (listdata && listdata.length!=0){
        if (num == 0) {
          _this.setData({
            listdata: listdata
          });
        } else {
          var arrlistarr = _this.data.listdata.concat(listdata);
          _this.setData({
            listdata: arrlistarr
          });
        };
      }else{
        app.showToastC('暂无更多数据');
      };

    },function(){
      wx.hideLoading();
      _this.setData({
        iftrnodata:true
      });
    });
  },
  onReady: function () {},
  onShow: function () {
    if (this.data.countdown) {
      this.countdownbfun();
    };
  },
  onHide: function () {
    clearInterval(this.data.timer);
  },
  onUnload: function () {
    clearInterval(this.data.timer);
  },
  onPullDownRefresh: function () {
    this.listdata(0);
  },
  onReachBottom: function () {
    this.listdata(1);
  },
  onShareAppMessage: function (options) {
    var reshare = app.sharemc();
    return reshare
  },
  onShareTimeline:function(){
    var _this = this;
    return {
      title:_this.data.c_title || '潮玩社交平台',
      query:{}    
    }
  },
  dlfindfun: function () {
    wx.reLaunch({
      url: "/page/component/pages/dlfind/dlfind",
    })
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
  // 导航跳转 
  wnews: function () {
    // 延迟提交formId
    var _this = this;
    app.limitlottery(_this);
  },
  detailspagefun:function(w){
    var gid = w.currentTarget.dataset.gid || w.target.dataset.gid || 0;
    app.detailspage(gid)
  },

})