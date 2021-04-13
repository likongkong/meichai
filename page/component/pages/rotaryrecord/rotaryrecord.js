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
    listdata: [],
    emtabnum: 1,
    page: 1,
    nodataiftr: false, 
    // 加载提示
    loadprompt: '加载更多.....',
    emfixediftr: false,
    userdata: {},
    expressdata: [],
    objectIndex: 0,
    headhidden: true,
    inputdata: '',
    order_id: '',
    overtime:0,
    overtimetop:'',
    comtopcounttime:{},
    awatip:false,
    cart_id:'',
    awardrresentiftr:false,
    awardrresentation:'',
    awardrresentationjump:'',
    payfreightmony:'',
    preventmultiplesubmission:true,
    phoneiftr:false,
    drawid: '',
    goodstype: '',
    // 是否需要身份证
    vident:'',
    havephoneiftr:false,
    // 身份证号弹框判断
    idnumberboxiftr: false,
    // 真实姓名
    inputnamedata: '',
    // 身份证号
    inputidnumberdata: '',
    windowHeight:700,
    videoAdtipfinshi: false,
    videoAdnum: 1,
    videotips: '',
    videocanid: '',

    c_title: '中奖记录',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    videoAdiftr:false
  },
  phoneiftrfun:function(){
    this.setData({ phoneiftr: false, inputdata:''});
  },
  // 免单活动跳转
  actexempfun: function (event) {
    var gid = event.currentTarget.dataset.gid || event.target.dataset.gid;
    wx.redirectTo({
      url: "/pages/activitydetailspage/activitydetailspage?id=" + gid
    });
  },  
  detailspage: function (w) {
    var goods_id = w.currentTarget.dataset.goods_id || w.target.dataset.goods_id || 0;
    app.detailspage(goods_id);
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
      url: "/pages/activitysharinglist/activitysharinglist"
    });
    this.setData({
      awardrresentiftr: false,
    });
  },
  awardrresentiftrfun: function () {
    this.setData({
      awardrresentiftr: false
    })
  },
  awatipdisnone: function () {
    this.setData({ awatip: false });
  },
  awajump: function () {
    var cart_id = this.data.cart_id || '';
    wx.navigateTo({
      url: "/page/component/pages/awardwinningarea/awardwinningarea?cart_id=" + cart_id,
    });
    this.setData({ awatip: false });
  },  

  // 领奖
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
  havephoneiftrfun:function(){
     this.setData({
       havephoneiftr:false
     })
  },
  // 身份证号弹框取消事件
  idnumbbcenfun: function () {
    this.setData({
      idnumberboxiftr: !this.data.idnumberboxiftr
    })
  },
  receiveawardsfun:function(w){
    var _this = this;
    var drawid = w.currentTarget.dataset.drawid || w.target.dataset.drawid || 0;
    var goodstype = w.currentTarget.dataset.goodstype || w.target.dataset.goodstype || 0;
    var vident = w.currentTarget.dataset.vident || w.target.dataset.vident || 0;
    this.setData({
      drawid: drawid,
      goodstype: goodstype,
      vident: vident
    });
    if (goodstype == 1 || goodstype == 2){
      this.setData({phoneiftr:true});
    } else if (vident==1){
      this.setData({idnumberboxiftr: true});
    }else{
      this.receiveawards();
    }
  },

  helpOther: function (code, encryptedData, iv) {
    var _this = this;
    var turndata = {
        uid:_this.data.uid,
        loginid: _this.data.loginid,
        code: code,
        encryptedData: encryptedData,
        iv: iv,
        callingAddress:1
    };
    wx.showLoading({ title: '加载中...', });
    Pub.postRequest(_this, 'decryptPhone', turndata, function (res) {
     
      wx.hideLoading();
      if (res.data.Info){
        _this.setData({
          inputdata: res.data.Info.phoneNumber||''
        });
      };
      _this.setData({ havephoneiftr: true});
    });
  },
  // 获取手机号
  getPhoneNumber: function (e) {
    var _this = this;

    if (e.detail.errMsg == 'getPhoneNumber: ok' || e.detail.errMsg == "getPhoneNumber:ok") {
      wx.login({
        success: function (res) {
          if (res.code) {
            _this.setData({ phoneiftr: false })
            _this.helpOther(res.code, e.detail.encryptedData, e.detail.iv)
          } else {}
        }
      });
    } else {
      app.showToastC('获取手机号失败！');
      _this.setData({phoneiftr: false})
    }
  },
  // 真实姓名 input 值改变
  inputnameChange: function (e) {
    this.setData({
      inputnamedata: e.detail.value
    });
  },
  // 身份证号
  inputidChange: function (e) {
    this.setData({
      inputidnumberdata: e.detail.value
    });
  },  
  // 领取奖励
  receiveawards: function () {
    var _this = this;
    var drawid = _this.data.drawid || 0;
    var goodstype = _this.data.goodstype || 0;
    var vident = _this.data.vident || 0;
    if (vident == 1) {
      // 获取身份证号
      if (_this.data.inputnamedata == '') {
        app.showToastC('姓名不能为空');
        return false;
      };
      var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
      if (this.data.inputidnumberdata == '') {
        app.showToastC('身份证号不能为空');
        return false;
      } else if (!regIdCard.test(this.data.inputidnumberdata)) {
        app.showToastC('身份证号格式不正确');
        return false;
      } else { };
    }

    if (goodstype == 1 || goodstype ==2){
      var myreg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57]|19[0-9]|16[0-9])[0-9]{8}$/;
      if (_this.data.inputdata==''){
        _this.setData({ phoneiftr: true });
        return false;
      };     
      var turndata = { uid: _this.data.uid, loginid: _this.data.loginid, phone: _this.data.inputdata, draw_id: drawid};
    } else if (vident==1){
      var turndata = { uid: _this.data.uid, loginid: _this.data.loginid, draw_id: drawid,consignee:_this.data.inputnamedata, idcard: _this.data.inputidnumberdata };
    }else{
      var turndata = { uid: _this.data.uid, loginid: _this.data.loginid, draw_id: drawid };
    };
    
    Pub.postRequest(_this, 'turntable_rewards', turndata, function (res) {
      
      if (goodstype == 2){
        wx.requestPayment({
          'timeStamp': res.data.List.pay.timeStamp.toString(),
          'nonceStr': res.data.List.pay.nonceStr,
          'package': res.data.List.pay.package,
          'signType': 'MD5',
          'paySign': res.data.List.pay.paySign,
          'success': function (res) {
            app.showToastC('支付成功');
            _this.onLoadfun();           
          },
          'fail': function (res) {
            app.showToastC('支付失败')
          },
          'complete': function (res) { 
            _this.setData({ phoneiftr: false, inputdata: '', phoneiftr: false, havephoneiftr: false, idnumberboxiftr: false}); 
            // 订阅授权
            
          }
        });        
      }else{
        var cart_id = res.data.List.cart_id || '';
        _this.clicktocollect(cart_id);
        _this.setData({ cart_id: cart_id, inputdata: '', phoneiftr: false, havephoneiftr: false, idnumberboxiftr:false });
      };
    });
  },
  // input 值改变
  inputChange: function (e) {
    this.setData({
      inputdata: e.detail.value
    });
  },
  topcountdown: function () {
    var _this = this;
    clearInterval(_this.data.toptimer);
    var raplist = _this.data.overtimetop || '';
    var comtopcounttime = this.data.comtopcounttime || {};
    function nowTime() {
      var iftrtopcount = false;
      // 获取现在的时间
      var nowTime = new Date().getTime();
      var lastTime = raplist * 1000;
      var differ_time = lastTime - nowTime;
      if (differ_time >= 0) {
        var differ_day = Math.floor(differ_time / (3600 * 24 * 1e3));
        var differ_hour = Math.floor(differ_time % (3600 * 1e3 * 24) / (1e3 * 60 * 60));
        var differ_minute = Math.floor(differ_time % (3600 * 1e3) / (1000 * 60));
        var s = Math.floor(differ_time % (3600 * 1e3) % (1000 * 60) / 1000);
        var ms = Math.floor(differ_time % 1000 / 100);
        if (differ_day.toString().length < 2) { differ_day = "0" + differ_day; };
        if (differ_hour.toString().length < 2) { differ_hour = "0" + differ_hour; };
        if (differ_minute.toString().length < 2) { differ_minute = "0" + differ_minute; };
        if (s.toString().length < 2) { s = "0" + s; };
        comtopcounttime.day = differ_day;
        comtopcounttime.hour = differ_hour;
        comtopcounttime.minute = differ_minute;
        comtopcounttime.second = s;
        comtopcounttime.ms = ms;
      } else {
        comtopcounttime.day = '00';
        comtopcounttime.hour = '00';
        comtopcounttime.minute = '00';
        comtopcounttime.second = '00';
        comtopcounttime.ms = '0';
        iftrtopcount = true;
      };
      _this.setData({
        comtopcounttime: comtopcounttime
      });
      if (iftrtopcount) {
        clearInterval(_this.data.toptimer);
      };
    };
    if (_this.data.overtimetop != '' && _this.data.overtimetop) {
      nowTime();
      clearInterval(_this.data.toptimer);
      _this.data.toptimer = setInterval(nowTime, 100);
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 点击视频
  videoclickbut:function(w){
    // var tips = w.currentTarget.dataset.tips || w.target.dataset.tips || '';
    // var videocanid = w.currentTarget.dataset.drawid || w.target.dataset.drawid || '';
    // this.setData({
    //   videotips: tips,
    //   videocanid: videocanid
    // });
    // this.videoAdfun();
  },
  videoAdfun: function () {
    // var _this = this;
    // if (this.data.videoAd) {
    //   this.data.videoAd.show();
    //   var qqqqq = Dec.Aese('mod=click&operation=playPayAdv&uid=' + _this.data.uid + '&loginid=' + app.signindata.loginid + '&activityId=1&step=1');
    //   wx.request({
    //     url: app.signindata.comurl + 'statistics.php' + qqqqq,
    //     method: 'GET',
    //     header: { 'Accept': 'application/json' },
    //     success: function (res) { }
    //   });
    // }
  },
  videoAdtipdisfun: function () {
    this.setData({
      videoAdtipfinshi: false
    })
  },
  videoAdtipfun: function () {
    this.setData({
      videoAdtipiftr: false
    })
  },
  onLoad: function (options) {
    // 购物车数据显示
    var _this = this;
    _this.data.loginid= app.signindata.loginid;
    _this.data.uid= app.signindata.uid;
    _this.data.openid= app.signindata.openid;


    let videoAd = null;
    // wx.createRewardedVideoAd
    if (false) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-479c873151eed9cc'
      });
      videoAd.load();
      videoAd.onError(err => {
        _this.setData({ videoAdiftr: false });
      });
      videoAd.onLoad(err => {
      });
      videoAd.onClose(err => {
        if (err && err.isEnded || err === undefined) {
          Pub.postRequest(_this, 'luck_drawWatch', { uid: _this.data.uid, loginid: _this.data.loginid, draw_id: _this.data.videocanid }, function (res) {
            _this.setData({ videoAdtipfinshi: true, videoAdnum: 1 });
            _this.onLoadfun();
          },function(){
            _this.setData({ videoAdtipfinshi: false, videoAdnum: 1 });
          });
          var qqqqq = Dec.Aese('mod=click&operation=playPayAdv&uid=' + _this.data.uid + '&loginid=' + app.signindata.loginid + '&activityId=1&step=3');
          wx.request({
            url: app.signindata.comurl + 'statistics.php' + qqqqq,
            method: 'GET',
            header: { 'Accept': 'application/json' },
            success: function (res) { }
          });
        } else {
          _this.setData({ videoAdtipfinshi: true, videoAdnum: 2 });
        };
      });
      _this.data.videoAd = videoAd;
    } else {
      _this.setData({ videoAdiftr: false });
    };



    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
      return false;
    };
    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      _this.onLoadfun();
    }else{
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
            _this.setData({
              tgabox: true
            });
            app.userstatistics(24);
          }
        }
      });
    };
  },
  onLoadfun: function () {
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.uid = app.signindata.uid;
    _this.data.openid = app.signindata.openid;
    _this.listdata(0);
    _this.setData({ windowHeight: (app.signindata.windowHeight + 30) || 600 })
  },
  listdata: function (num) {
    var _this = this;
    if (num == 0) {
      _this.setData({ page: 1, loadprompt: '加载更多.....', nodataiftr: true });
    } else {
      var pagenum = parseInt(_this.data.page)
      _this.setData({ page: ++pagenum, loadprompt: '加载更多.....', nodataiftr: true });
    };
 
    wx.showLoading({ title: '加载中...', })
    Pub.postRequest(_this, 'showRaffleList', { uid: _this.data.uid, loginid: _this.data.loginid, page: _this.data.page }, function (res) {
    
      
      if (num == 0){
        var overtimetop = res.data.List.over_time || 0;
        if (overtimetop){
          _this.setData({ overtimetop: overtimetop });
          if (overtimetop) {
            _this.topcountdown()
          }
        };
      };
      var listdata = res.data.List.list || [];
      if (listdata.length != 0) {
        if (num == 0) {
          _this.setData({ listdata: listdata});
        } else {
          var ltlist = _this.data.listdata.concat(listdata);
          _this.setData({ listdata: ltlist });
        };
      } else {
        if (num == 0) {
          _this.setData({ listdata: [] });
        };
        _this.setData({ loadprompt: '没有更多数据了' });
        app.showToastC('暂无更多数据');
      };

    }, '', function () {
      wx.hideLoading();
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
    clearInterval(this.data.toptimer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.toptimer);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.listdata(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.listdata(1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var reshare = app.sharemc();
    return reshare
  },
  onShareTimeline:function(){
    return {
      title:'潮玩社交平台',
      query:{}    
    }
  },
  // 发货
  delivergoods: function (w) {
    var order_id = w.currentTarget.dataset.order_id || w.target.dataset.order_id || '';
    this.setData({ order_id: order_id })
    var _this = this;
    Pub.postRequest(_this, 'deliver_goods', { uid: _this.data.uid, loginid: _this.data.loginid, order_id: order_id }, function (res) {
      
      var userdata = res.data.Info.user_info || {};
      var expressdata = res.data.Info.express_info || [];
      _this.setData({
        emfixediftr: true,
        userdata: userdata,
        expressdata: expressdata
      });
    });
  },


  // 确认收货
  confirmreceipt: function (w) {
    var order_id = w.currentTarget.dataset.order_id || w.target.dataset.order_id || '';
    var _this = this;
    Pub.postRequest(_this, 'confirm_receipt', { uid: _this.data.uid, loginid: _this.data.loginid, order_id: order_id }, function (res) {
      app.showToastC('确认成功');
      _this.listdata(0);
    });
  },
  // 查看物流
  viewlogistics: function (w) {
    var order_id = w.currentTarget.dataset.order_id || w.target.dataset.order_id || '';
    wx.navigateTo({
      url: "/page/component/pages/viewlogistics/viewlogistics?order_id=" + order_id
    })

  },
  exchangeanddifun: function () {
    wx.navigateTo({
      url: "/page/component/pages/exchangeanddismantling/exchangeanddismantling"
    });

  },




})