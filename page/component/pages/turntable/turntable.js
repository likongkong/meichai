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
    tgabox: false,
    receawalist: [],
    listdata:[],
    surplus_sum:0, //可抽奖次数
    reward_list:[],  //总奖励信息
    weekly_sum: 0, //本周抽奖次数
    commoddetip: false, // 商品弹框
    commoddetdata:{}, 
    receawanum:1,
    receawaiftr:false,
    frequency:'',
    goodsid: '',

    comtopcounttime: {},
    awatip: false,
    cart_id: '',
    awardrresentiftr: false,
    awardrresentation: '',
    awardrresentationjump: '',
    payfreightmony: '',
    preventmultiplesubmission: true,
    phoneiftr: false,
    drawid: '',
    goodstype: '',
    lkbdctlist:[],
    // 说明
    explain:'',
    explainiftr:false,
    tipshare:false,
    havephoneiftr:false,
    isNewer:false,

    c_title: '',
    c_arrow: true,
    c_backcolor: '#5b94fd',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
  },
  // 获取手机号
  getPhoneNumber: function (e) {
    var _this = this;
    if (e.detail.errMsg == 'getPhoneNumber: ok' || e.detail.errMsg == "getPhoneNumber:ok") {
      wx.login({
        success: function (res) {
          if (res.code) {
            _this.helpOther(res.code, e.detail.encryptedData, e.detail.iv)
          };
        }
      });
    } else {
      app.showToastC('获取手机号失败！');
      _this.setData({ havephoneiftr: true })
    }
  },
  helpOther: function (code, encryptedData, iv) {
    var _this = this;
    var turndata = {
      uid: _this.data.uid,
      loginid: _this.data.loginid,
      code: code,
      encryptedData: encryptedData,
      iv: iv,
      callingAddress: 1
    };
    wx.showLoading({ title: '加载中...', });
    Pub.postRequest(_this, 'decryptPhone', turndata, function (res) {
   
      wx.hideLoading();
      if (res.data.Info) {
        _this.setData({
          inputdata: res.data.Info.phoneNumber || ''
        });
      };
      _this.setData({ havephoneiftr: false });
      app.signindata.isNewer=false;
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 购物车数据显示
    app.signindata.referee = options.referee || 0;
    app.signindata.tid = options.tid || 0;
    var _this = this;
    _this.data.loginid= app.signindata.loginid;
    _this.data.uid = app.signindata.uid;
    _this.data.openid = app.signindata.openid;
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
      return false;
    };
    wx.getSetting({
      success: res => {
        if (true) {
          // '已经授权'
          _this.data.loginid = app.signindata.loginid;
          _this.data.uid = app.signindata.uid;
          _this.data.openid = app.signindata.openid;
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this)
          }
        } else {
          // 跳转获取权限页面
          app.userstatistics(23);
          _this.setData({
            tgabox: true
          });
        }
      }
    });
  },
  onLoadfun: function () {
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.uid = app.signindata.uid;
    _this.data.openid = app.signindata.openid;
    _this.listdata();
    _this.luckbroadcast();
  },
  // 抽奖播报信息
  luckbroadcast:function(){
    var _this = this;
    Pub.postRequest(_this, 'luck_broadcast', { uid: _this.data.uid, loginid: _this.data.loginid, isNewer: app.signindata.isNewer }, function (res) {
    
      var lkbdctlist = res.data.List.list||[];
      var explain = res.data.List.explain||'';
      var obtainPhone = res.data.List.ObtainPhone||false;
      if (app.signindata.isNewer || obtainPhone) {
        _this.setData({ havephoneiftr: true });
      };

      _this.setData({
        lkbdctlist: lkbdctlist,
        explain: explain
      });
    });
  },
  listdata:function(){
    var _this = this;
    wx.showLoading({ title: '加载中...', })
    Pub.postRequest(_this, 'turntable_exhibition', { uid: _this.data.uid, loginid: _this.data.loginid, isNewer: app.signindata.isNewer}, function (res) {
      
      _this.setData({
        listdata: res.data.List.turntable_list||[],
        surplus_sum: res.data.List.surplus_sum || 0, //可抽奖次数
        reward_list: res.data.List.reward_list||[],  //总奖励信息
        weekly_sum: res.data.List.weekly_sum || 0 //本周抽奖次数
      })
    },'',function(){
      wx.hideLoading();
    });

    // 连续签到奖励
    Pub.postRequest(_this, 'prizeList', { uid: _this.data.uid, loginid: _this.data.loginid, request: 'draw', type: 'Exhibition' }, function (res) {


      var infodata = res.data.Info.headData || [];
      var listdata = res.data.List;
      _this.setData({
        contrewone: infodata,
        contrewtwo: listdata,
      });
    });



  },
  // 跳转抽奖
  jumpcumconrew: function (w) {
    var num = w.currentTarget.dataset.num || w.target.dataset.num || 0;
    wx.redirectTo({
      url: "/page/component/pages/cumconreward/cumconreward?signdraw=draw&number=" + num
    });
  },
  // 授权
  clicktga: function () {
    app.clicktga(2)
  },
  // 点击登录获取权限
  userInfoHandler: function (e) {
    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        if (true) {
          // 确认授权用户统计
          app.clicktga(4);
          _this.setData({
            tgabox: false
          });
          // '已经授权'
          _this.setData({
            loginid: app.signindata.loginid,
            uid: app.signindata.uid,
            openid: app.signindata.openid,
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
    if (e.detail.userInfo) { } else {
      app.clicktga(8)  //用户按了拒绝按钮
    };

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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  tipshare:function(){
    var _this = this;
    setTimeout(function(){
      _this.setData({
        tipshare: false
      })
    },7000);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this;
    setTimeout(function(){
      _this.setData({ tipshare:true});
      _this.tipshare();
    },500);
   
    var reshare = {
      title: '我正在美拆参加抽奖活动，精品好礼免费拿，快来助我一臂之力吧！',
      path: 'page/component/pages/turntable/turntable?referee='+_this.data.uid+'&tid=12',
      imageUrl: 'https://www.51chaidan.com/images/spread/dial/Advertising.png',
      success: function (res) { },
    };
    return reshare
  },
  rotaryrecordjump:function(){
    wx.navigateTo({
      url: "/page/component/pages/rotaryrecord/rotaryrecord"
    })
  },
  commoddetail:function(w){
    var comnum = w.currentTarget.dataset.comnum || w.target.dataset.comnum||0;
    var ccc = w.currentTarget.dataset.ccc || w.target.dataset.ccc || 0;
    if (ccc==2){
      var reward_list = this.data.reward_list;
      if (reward_list[comnum]) {
        this.setData({
          commoddetip: true,
          commoddetdata: reward_list[comnum]
        })
      }
    }else{
      var listdata = this.data.listdata||[];
      if (listdata[comnum]) {
        this.setData({
          commoddetip: true,
          commoddetdata: listdata[comnum]
        })
      }
    }

  },
  commoddetipfun:function(){
    this.setData({
      commoddetip: false
    })
  },
  // 跳转详情页 
  addressmanagement: function (w) {
    var _this = this;
    var gid = w.currentTarget.dataset.gid || w.target.dataset.gid;
    wx.navigateTo({
      url: "/pages/detailspage/detailspage?gid=" + gid,
      complete: function () { _this.setData({ commoddetip: false }); }
    });
  },
  // 抽奖
  receiveawardsack:function(w){
    var receawanum = w.currentTarget.dataset.receawa || w.target.dataset.receawa||1;
    this.setData({
      receawanum: receawanum
    })
    var _this = this;
    wx.showLoading({ title: '加载中...',mask:true });
    Pub.postRequest(_this, 'add_LuckyDraw', { uid: _this.data.uid, loginid: _this.data.loginid, frequency: receawanum, isNewer: app.signindata.isNewer}, function (res) {
    
      if (receawanum==1){
        _this.setData({
          receawalist: res.data.List||[],
          receawaiftr: true
        })
      } else if (receawanum == 5){
        _this.setData({
          receawalist: res.data.List || [],
          receawaiftr: true
        })
      } else if (receawanum == 10){
        _this.setData({
          receawalist: res.data.List || [],
          receawaiftr: true
        })
      };
      _this.listdata();
    }, '', function(){
      wx.hideLoading();
    });    
  },
  receawaiftrfundis:function(){
    this.setData({
      receawaiftr:false
    })
  },
  // 领取奖励
  receiveawardsweek:function(){
    var _this = this;
    Pub.postRequest(_this, 'week_total_prize', { uid: _this.data.uid, loginid: _this.data.loginid, goods_id: _this.data.goodsid, frequency: _this.data.frequency }, function (res) {

      var cart_id = res.data.List.cart_id || '';
      _this.clicktocollect(cart_id);
      _this.setData({ cart_id: cart_id});
    });
  },
  // 领奖
  clicktocollect: function (cart_id) {
    var _this = this;
    if (_this.data.preventmultiplesubmission) {
      _this.setData({ preventmultiplesubmission: false });
      var cart_id = cart_id;
      var qqq = Dec.Aese('mod=operate&operation=receiveaward&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + cart_id);
      wx.showLoading({ title: '加载中...', })
      wx.request({
        url: app.signindata.comurl + 'order.php' + qqq,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {
        
          _this.setData({ preventmultiplesubmission: true });
          wx.hideLoading();
          if (res.data.ReturnCode == 200) {
            app.showToastC('领取成功');
            _this.onLoadfun();
          } else if (res.data.ReturnCode == 830) {
            var rpiinfo = res.data.Info.tip.replace(/\\n/g, '\n') || '';
            if (res.data.Info.Goods.item_type == 996) {
              _this.setData({ awatip: true });
            } else {
              _this.setData({ awardrresentiftr: !_this.data.awardrresentiftr, })
            };
            _this.setData({
              rpinfotip: rpiinfo
            });
            _this.setData({
              awardrresentation: res.data.List,
              awardrresentationjump: res.data.Info.Goods || '',
              payfreightmony: res.data.Info.amount || 10
            });
          } else {
            app.showToastC(res.data.Msg);
          };
        }
      });
    };

  },

  receiveawardsfun: function (w) {
    var frequency = w.currentTarget.dataset.frequency || w.target.dataset.frequency;
    var goodsid = w.currentTarget.dataset.goodsid || w.target.dataset.goodsid
    this.setData({
      frequency: frequency,
      goodsid: goodsid
    });
    this.receiveawardsweek();
  },
  awajump: function () {
    var cart_id = this.data.cart_id || '';
    wx.navigateTo({
      url: "/page/component/pages/awardwinningarea/awardwinningarea?cart_id=" + cart_id,
    });
    this.setData({ awatip: false });
  }, 

  awatipdisnone: function () {
    this.setData({ awatip: false });
  },
  awardrresentiftrfun: function () {
    this.setData({
      awardrresentiftr: false
    })
  },
  //  支付成功跳转
  comindellistjump: function (w) {
    var whref = w.currentTarget.dataset.href || w.target.dataset.href;
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type || 0;
    var wname = w.currentTarget.dataset.name || w.target.dataset.name || '美拆';
    // 公共跳转
    app.comjumpwxnav(item_type, whref, wname);
  },
  acetlistfun: function () {
    wx.redirectTo({
      url: "/page/component/pages/activitysharinglist/activitysharinglist"
    });
    this.setData({
      awardrresentiftr: false,
    });
  },

  explainfun:function(){
    this.setData({
      explainiftr: !this.data.explainiftr
    })
  },














})