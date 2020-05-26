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
    // 是否显示杂货铺
    grocerystoreiftr: app.signindata.grocerystoreiftr || 'off',  
    tgabox:false,
    listdata:[],
    emtabnum:1,
    page:1, 
    nodataiftr:false,
    // 加载提示
    loadprompt: '加载更多.....', 
    emfixediftr: false, 
    userdata:{},
    expressdata:[],
    objectIndex: 0,
    headhidden:true,
    inputdata:'',
    order_id:'',
    // 待发货
    stayshipped:0,

    c_title: '赚拆币',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    
  },
  // input 值改变
  inputChange: function (e) {
    this.setData({
      inputdata: e.detail.value
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 购物车数据显示
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      grocerystoreiftr: app.signindata.grocerystoreiftr || 'off',
    });
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
            grocerystoreiftr: app.signindata.grocerystoreiftr || 'off',
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
  },
  onLoadfun: function () {
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      grocerystoreiftr: app.signindata.grocerystoreiftr || 'off',
    });
    _this.listdata(0);
    _this.stayshipped();
  }, 
  // 显示个数
  stayshipped:function(){
    var _this = this;
    Pub.postRequest(_this, 'stay_shipped', { uid: _this.data.uid, loginid: _this.data.loginid}, function (res) {
      _this.setData({
        stayshipped: res.data.Info.stay_shipped||0
      });
    });
  },
  listdata: function (num) {
    var _this = this;
    if (num == 0) {
      _this.setData({ page: 1, loadprompt: '加载更多.....', nodataiftr: false });
    } else {
      var pagenum = parseInt(_this.data.page)
      _this.setData({ page: ++pagenum, loadprompt: '加载更多.....', nodataiftr: false });
    };
    Pub.postRequest(_this, 'exchange_list', { uid: _this.data.uid, loginid: _this.data.loginid, page: _this.data.page, nav: _this.data.emtabnum}, function (res) {
      var listdata = res.data.List || [];
      if (listdata.length != 0) {
        if (num == 0) {
          _this.setData({ listdata: listdata });
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

    },function(){
      _this.setData({ nodataiftr: true})
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
        if (res.authSetting['scope.userInfo']) {
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
  onShareAppMessage: function () {},
  emtab:function(w){
    var emtabnum = w.currentTarget.dataset.emtabnum || w.target.dataset.emtabnum||1;
    this.setData({ emtabnum: emtabnum});
    this.listdata(0);
  },
  // 发货
  delivergoods:function(w){
    var order_id = w.currentTarget.dataset.order_id || w.target.dataset.order_id || '';
    this.setData({ order_id: order_id})
    var _this = this;
    Pub.postRequest(_this, 'deliver_goods', { uid: _this.data.uid, loginid: _this.data.loginid, order_id: order_id}, function (res) {
      var userdata = res.data.Info.user_info||{};
      var expressdata = res.data.Info.express_info||[];
      _this.setData({
        emfixediftr: true,
        userdata: userdata,
        expressdata: expressdata
      });
    });
  },


  //普通选择器2：
  bindPickerChange2: function (e) {
    this.setData({
      objectIndex: e.detail.value
    });
  },
  // 确认发货
  confirmshipment:function(){
    this.setData({emfixediftr: false});
    var _this = this;
    var shipping_number = _this.data.inputdata || '';
    if (shipping_number==''){
      app.showToastC('快递单号不能为空');
      return false;
    };
    var objectIndex = _this.data.objectIndex || 0;
    var expressdata = _this.data.expressdata || [];
    var order_id = _this.data.order_id||'';
    var shipping_code = expressdata[objectIndex].code||'';
    var shipping_name = expressdata[objectIndex].name||'';
    Pub.postRequest(_this, 'confirm_deliver', { uid: _this.data.uid, loginid: _this.data.loginid, order_id: order_id, shipping_code: shipping_code, shipping_name: shipping_name, shipping_number: shipping_number}, function (res) {
      app.showToastC('发货成功');
      _this.setData({
        shipping_number:'',
        objectIndex:0
      })
      _this.listdata(0);
      _this.stayshipped();
    });
  },
  emfixediftrbg:function(){
    this.setData({ emfixediftr: false });
  },
  // 取消订单
  cancforder:function(w){
    var order_id = w.currentTarget.dataset.order_id || w.target.dataset.order_id || '';
    var _this = this;
    Pub.postRequest(_this, 'cancel_exchangeOrder', { uid: _this.data.uid, loginid: _this.data.loginid, order_id: order_id }, function (res) {
      app.showToastC('取消成功');
      _this.listdata(0);
    });
  },
  // 确认收货
  confirmreceipt:function(w){
    var order_id = w.currentTarget.dataset.order_id || w.target.dataset.order_id || '';
    var _this = this;
    Pub.postRequest(_this, 'confirm_receipt', { uid: _this.data.uid, loginid: _this.data.loginid, order_id: order_id}, function (res) {
      app.showToastC('确认成功');
      _this.listdata(0);
    });    
  },
  // 查看物流
  viewlogistics:function(w){
    var order_id = w.currentTarget.dataset.order_id || w.target.dataset.order_id || '';
    wx.navigateTo({
      url: "/page/component/pages/viewlogistics/viewlogistics?order_id="+order_id
    })   
  },
  exchangeanddifun: function () {
    wx.navigateTo({
      url: "/page/component/pages/exchangeanddismantling/exchangeanddismantling"
    });
  },
  //  复制内容到粘贴板
  copyTBL: function (e) {
    var _this = this;
    var userdata = _this.data.userdata||{};
    var content = (userdata.consignee || '') + (userdata.tel || '') + (userdata.province || '') + (userdata.city || '') + (userdata.district || '') + (userdata.address || '');
    wx.setClipboardData({
      data: content,
      success: function (res) {
        app.showToastC('复制成功');
      }
    });

  }, 




})