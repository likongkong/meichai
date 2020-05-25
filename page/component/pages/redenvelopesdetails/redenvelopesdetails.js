var Dec = require('../../../../common/public.js');//aes加密解密js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 接口地址
    comurl: app.signindata.comurl,
    // 图片地址
    zdyurl: Dec.zdyurl(),
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,
    appNowTime: app.signindata.appNowTime,
    // 判断是ios或者android
    iftriosorand: app.signindata.iftriosorand,    
    // 商铺id
    store_id: '',
    // 授权弹框
    tgabox: false,
    moneytxt:'支付成功,返现红包元',
    moneynum:'' ,
    nowdate:'',
    nick:'美拆',
    avatarUrl:'',
    nickName:'',   
    userinfo:{},
    cart_id:'',
    litpic:''  ,

    c_title: '红包详情',
    c_arrow: true,
    c_backcolor: '#da5943',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
  },
  // 获取当前时间
  formatTime: function (date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var txt = month + '月' + day + '日' + ' ' + this.formatNumber(hour) + ':' + this.formatNumber(minute);
    return txt;
  },
  formatNumber: function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userinfo={ goods:{
      goods_amount: options.goods_amount,
      goods_cover: decodeURIComponent(options.goods_cover),
      goods_id: options.goods_id,
      goods_name: options.goods_name,
      goods_store: options.goods_store,
      store_id: options.store_id,
      goods_price_unit: options.goods_price_unit || '',
      goods_pre_name: options.goods_pre_name || '',
      goods_ds: options.goods_ds || ''
    }};
    this.setData({
      moneytxt: options.moneytxt || '支付成功,返现红包元',
      moneynum:options.moneynum||'',
      nick: options.nick||'美拆',
      userinfo: userinfo,
      cart_id:options.cart_id,
      litpic: decodeURIComponent(options.litpic)
    });
    wx.setNavigationBarTitle({
      title: options.nick || '美拆'
    });    
    this.setData({
      nowdate: this.formatTime(new Date())
    });    
    // 判断是否授权
    this.tograntauthorization();    
  },
  onLoadfun: function () {
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      store_id: app.signindata.store_id
    });    
    wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            _this.setData({
              avatarUrl: res.userInfo.avatarUrl,
              nickName: res.userInfo.nickName,
            })
          }
        });
      }
    });
  },
  ranking: function () {

  },    
  // 授权
  tograntauthorization: function () {
    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          _this.setData({ tgabox: false });
          // '已经授权'
          _this.setData({
            loginid: app.signindata.loginid,
            uid: app.signindata.uid,
            openid: app.signindata.openid,
            store_id: app.signindata.store_id
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this);
          }
        } else {
          // '没有授权 统计'
          // app.userstatistics(12);          
          // _this.setData({
          //   tgabox: true
          // });
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
              app.userstatistics(12);          
              _this.setData({
                tgabox: true
              });
            }
          });

        }
      }
    });
  },
  // 授权点击统计
  clicktga: function () {
    app.clicktga(2)
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
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this;
    var goods = _this.data.userinfo.goods;


    if (goods.goods_store == 1) {
      var paths = '../../../../pages/detailspage/detailspage?gid=' + goods.goods_id;
      var title = '￥' + goods.goods_amount + (goods.goods_price_unit || '') + ' ' + (goods.goods_pre_name || '') + (goods.goods_ds || '') + goods.goods_name;
    } else if (goods.goods_store == 0) {
      var paths = '../../../../pages/detailspage/detailspage?gid=' + goods.goods_id;
      var title = '￥' + goods.goods_amount + (goods.goods_price_unit || '') + ' ' + (goods.goods_pre_name || '') + (goods.goods_ds || '') + goods.goods_name;
    } else if (goods.goods_store == 2) {
      var paths = '../../../../pages/activitydetailspage/activitydetailspage?id=' + goods.goods_id+'&cs=1';
      var title = 'Vol.' + goods.goods_id + ' 我￥0.01赢得了' + goods.goods_name;
    };

    var reshare = {
      title: title,       
      path: paths,
      imageUrl: goods.goods_cover,
      success: function (res) {},
    };
    var q = Dec.Aese('mod=share&operation=order&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + _this.data.cart_id)
    wx.request({
      url: app.signindata.comurl + 'user.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {},
    });
    return reshare     
  },
  // 授权 登录
  userInfoHandler: function (e) {
    // 判断是否授权
    var _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          _this.setData({
            tgabox: false
          });
          _this.tograntauthorization();
          // 确认授权用户统计
          app.clicktga(4);
        };
      }
    }); 
    if (e.detail.userInfo) { } else {
      app.clicktga(8)  //用户按了拒绝按钮
    };

  },  
})