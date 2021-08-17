
var Dec = require('../../../../common/public');//aes加密解密js
var tcity = require("../../../../common/citys.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '订单管理',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    testArr:[1111,22222,33333,44444,555555,66666,1111,22222,33333,44444,555555,66666],
    brandid:0,
    ordername:'',
    centerIndex:0,
    scrollleft:0,
    scrollleftTop:0,
    logisticsRefundModify:4, // 1 修改 2 退款 3 物流 4批量导出订单
    scanCodeMsg: "",
    commonBulletFrame:false, // 公共弹框
    // 省市联动数据
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    cityback:false, 
    brand:[
      {
        "brandId": 569,
        "brandName": "SOUR LEMON-CLUB",
        "brandLogo": "https://cdn.51chaidan.com/images/toyShow2/logo/20200730/e16e884b941e1eb262c26463dbd3cde0.jpg"
      },
      {
        "brandId": 570,
        "brandName": "怪猴子（Super Monkey）",
        "brandLogo": "https://cdn.51chaidan.com/images/toyShow3/logo/20210104/45db5c3f5351e32701ac832cba819667.jpg"
      }
    ] 
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
      'province': options.province || '天津市',
      'city': options.city || '天津市',
      'county': options.district || '河东区'
    })
    setTimeout(() => {
      this.setData({
        condition: !this.data.condition,
        cityback: !this.data.cityback
      }) 
    }, 2000);

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
  // 跳转详情
  jumpBusOrderDetails(){
    wx.navigateTo({
      url: "/page/settled/pages/businessOrderDetails/businessOrderDetails"
    });
  },
  closeCommonTip(){
    this.setData({
      commonBulletFrame:false,
    })
  },
  commonBulletFrameFun(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      commonBulletFrame:true,
      logisticsRefundModify:index
    })
  },
  scanCode: function() {
    var that = this;
    wx.scanCode({ //扫描API
      success(res) { //扫描成功
        console.log(res) //输出回调信息
        that.setData({
          scanCodeMsg: res.result
        });
        wx.showToast({
          title: '成功',
          duration: 1000
        })
      }
    })
  },

  classifyChange(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let name = e.currentTarget.dataset.name;
    let ele = '#ele' + index;
    that.setData({
      centerIndex:index,
    })
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select(ele).boundingClientRect();
    query.exec(function(res) {
      console.log(res[0])
      that.setData({
        scrollleft:e.currentTarget.offsetLeft - wx.getSystemInfoSync().windowWidth/2 + (res[0].width/2)
      })
    })
  },  
  // input 值改变
  inputChange: function (e) {
    this.setData({
      ordername: e.detail.value
    });
  },
  jumpsearch:function(){
    // this.eldatalistfun(0);
    this.getlist(0);
  },
  onFocus: function (w) {
    this.setData({
      ordername:""
    });
  },  

  scrollViewTop(e){
    var brandid = e.currentTarget.dataset.brandid;
    this.setData({
      brandid:brandid
    });
    let that = this;
    let top = '#top' + brandid;
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select(top).boundingClientRect();
    query.exec(function(res) {
      console.log(res[0])
      that.setData({
        scrollleftTop:e.currentTarget.offsetLeft - wx.getSystemInfoSync().windowWidth/2 + (res[0].width/2)
      })
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.hideShareMenu();

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
  },
  // 获取数据
  getData(){

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

})
