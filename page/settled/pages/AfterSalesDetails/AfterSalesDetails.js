
var Dec = require('../../../../common/public');//aes加密解密js
var api = require("../../../../utils/api.js");
var tcity = require("../../../../common/citys.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '售后详情',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    businessOrUser:1, // 1 商家 2 用户
    // 省市联动数据
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],

    logisticsRefundModify:4,
    commonBulletFrame:false

  },
  // 省市联动
  bindChange: function (e) {
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData||[];

    if (val[0] != t[0]) {
      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })

      return;
    }
    if (val[1] != t[1]) {
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      this.setData({
        county: this.data.countys[val[2]],
        values: val,
        value: val
      })
      return;
    }


  },
  // 修改地址名字
  namefun:function(e){
    this.data.modifyName = e.detail.value;
  },
  // 修改地址手机号
  telfun: function (e) { 
    this.data.modifyMobile = e.detail.value
  },
  // 修改地址 地址详情
  deladdressfun: function (e) {
    this.setData({
      deladdress: e.detail.value
    })
  },  
  // 驳回备注
  rejectTxtfun: function (e) {
    this.setData({
      deladdress: e.detail.value
    })
  },  
  open: function (options) {
    // 省市联动
    var _this = this;
    tcity.init(_this);
    var cityData = _this.data.cityData;
    const provinces = [];
    const citys = [];
    const countys = [];
    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }
    _this.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': _this.data.province,
      'city': _this.data.city,
      'county': _this.data.county
    })
    this.setData({
      condition: !this.data.condition,
      cityback: !this.data.cityback
    }) 

  },   
  // 复制单号
  copyCart(w){
    var cart = w.currentTarget.dataset.cart || w.target.dataset.cart || '';
    var _this = this;
    wx.setClipboardData({
      data: cart || '',
      success: function (res) {
        app.showToastC('复制成功');
      }
    });
  },
  preview(event) {
    let currentUrl = event.currentTarget.dataset.src
    wx.previewImage({
      current: 'https://cdn2.51chaidan.com/images/goods/16400686485760_744.jpg', // 当前显示图片的http链接
      urls: ['https://cdn2.51chaidan.com/images/goods/16400686485760_744.jpg'] // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.hideShareMenu();

    _this.setData({
      businessOrUser:options.bou || 2,
    })
    // '已经授权'
    _this.data.loginid = app.signindata.loginid;
    _this.data.uid = app.signindata.uid;
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
    } else {
      app.signin(_this)
    };


  },
  onLoadfun(){
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.uid = app.signindata.uid;
    _this.setData({
      uid: app.signindata.uid,
      avatarUrl: app.signindata.avatarUrl,
      isProduce: app.signindata.isProduce,
      isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
    });

    this.getData();
    
  },
  // 获取数据
  getData(num=1){
    var _this = this;
    
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
    app.downRefreshFun(() => {
      this.getData()
    })   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getData(2)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this;
    var indexShare = app.signindata.indexShare || [];
    var indexShareNum = Math.floor(Math.random() * indexShare.length) || 0;
    var indexShareImg = '';
    if(indexShare.length!=0 && indexShare[indexShareNum]){
      indexShareImg = indexShare[indexShareNum]+'?time=' + Date.parse(new Date());
    };
    return {
      title:app.signindata.titleShare?app.signindata.titleShare:'你喜欢的潮玩都在这里！',
      path: 'pages/index/index',
      imageUrl:indexShareImg || 'https://cdn.51chaidan.com/images/default/shareImg.jpg',
      success: function (res) {}
    } 
  },

})
