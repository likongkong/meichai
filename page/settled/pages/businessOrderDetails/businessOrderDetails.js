
var Dec = require('../../../../common/public');//aes加密解密js
var tcity = require("../../../../common/citys.js");
var api = require("../../../../utils/api.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '订单详情',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    detailData:{},
    scanCodeMsg:'',
    csc:''
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
    _this.data.orderid = options.orderid
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
    } else {
      app.signin(_this)
    }
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
    if(wx.getStorageSync('access_token')){
      this.getData();
    }else{
      app.getAccessToken(_this.getData)
    };
  },
  // 获取数据
  getData(){
    var _this = this;
    console.log('=========================')
    api.oMbrandInfo(_this.data.orderid,{}).then((res) => {
      console.log('订单详情=======',res)
     if (res.data.status_code == 200) {
         var detailData = res.data.data.Info.order;
         detailData.order.payTimeTrans = _this.toDate(detailData.order.payTime);
         detailData.order.addTimeTrans = _this.toDate(detailData.order.addTime);
         detailData.order.deliverTimeTrans = _this.toDate(detailData.order.deliverTime);
         detailData.order.shippingTimeTrans = _this.toDate(detailData.order.shippingTime);
         _this.setData({
           detailData:res.data.data.Info.order || {}
         })

     }else{
       if(res.data && res.data.message){
         app.showModalC(res.data.message); 
       };        
     }
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
  closeCommonTip(){
    this.setData({
      commonBulletFrame:false,
    })
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
  // 快递公司名称 Courier Services Company
  cscfun: function (e) {
    this.setData({
      csc: e.detail.value
    })
  },  
  // 订单号 
  scancodefun(e){
    this.setData({
      scanCodeMsg: e.detail.value
    })
  },
  commonBulletFrameFun(e){
    let index = e.currentTarget.dataset.index;
    var _this = this;
    var detailData = _this.data.detailData || [];
    if(index == 1){ // 1 修改地址 2 退款 3 物流
      var receipt = detailData.receipt || {};
      _this.setData({
        modifyName:receipt.consignee,
        modifyMobile:receipt.mobile,
        deladdress:receipt.address,
        province:receipt.province,
        city:receipt.city,
        county:receipt.district
      })
    } else if(index == 2){

    } else if(index == 3){


    }
    this.setData({
      commonBulletFrame:true,
      logisticsRefundModify:index,
    })
  },
  // 弹框确认按钮    1 修改收货地址 2 退款 3 物流 4批量导出订单
  confirmCommonTip(){ 
    var _this = this;
    var logisticsRefundModify = _this.data.logisticsRefundModify;
    console.log(logisticsRefundModify)
    var selectData = _this.data.detailData;
    if(logisticsRefundModify == 1){
        if (_this.data.modifyName == ''){
          app.showToastC('姓名不能为空');
          return false;
        };
        if (_this.data.modifyMobile.length == 0) {
          app.showToastC('输入的手机号为空')
          return false;
        } else if (_this.data.modifyMobile.length < 11) {
          app.showToastC('手机号长度有误！')
          return false;
        } else if (_this.data.modifyMobile && _this.data.modifyMobile[0]!=1) {
          app.showToastC('手机号有误！')
          return false;
        };
        api.modifyAddress(selectData.order.orderId,{
            orderId:selectData.order.orderId,// 订单id 对内唯一标识
            customerId:selectData.order.userId, //	Number对应订单的用户id
            province:_this.data.province, //	String收件地省份
            city:_this.data.city, //	String	收件地城市
            distirct:_this.data.county, //	String	收件地区县
            address:_this.data.deladdress, //	String	 收件地具体地址
            consignee:_this.data.modifyName, //	String	 收件人姓名
            mobile:_this.data.modifyMobile, //		String	收件人手机号
            idcard:''
        }).then(res => {
          if (res.data.status_code == 200) {
              var receipt = selectData.receipt || [];
              receipt.consignee = _this.data.modifyName;
              receipt.mobile = _this.data.modifyMobile;
              receipt.address = _this.data.deladdress;
              receipt.province = _this.data.province;
              receipt.city = _this.data.city;
              receipt.district = _this.data.county;
              _this.setData({
                ['detailData.receipt'] : receipt
              })
          }else{
            if(res.data && res.data.message){
              app.showModalC(res.data.message); 
            };        
          }          
        })
    }else if(logisticsRefundModify == 2){
      api.brandRefund({
          orderId:selectData.order.orderId,	// Number订单id 对内唯一标识
          customerId:selectData.order.userId // 	Number对应订单的用户id
      }).then(res => {
        if (res.data.status_code == 200) {
            app.showToastC('退款成功')
            _this.getData();
        }else{
          if(res.data && res.data.message){
            app.showModalC(res.data.message); 
          };        
        }          
      })
    }else if(logisticsRefundModify == 3){
        if (_this.data.scanCodeMsg == "") {
          app.showToastC('快递单号不能为空')
          return false;
        } else if (_this.data.csc == "") {
          app.showToastC('快递公司名称不能为空')
          return false;
        };
        api.addLogistics(selectData.order.orderId,{
            orderId:selectData.order.orderId,	// Number订单id 对内唯一标识
            customerId:selectData.order.userId, // 	Number对应订单的用户id
            shippingCode:_this.data.scanCodeMsg	,// 	String快递单号
            shippingName:_this.data.csc	// 	String快递公司名称
        }).then(res => {
          if (res.data.status_code == 200) {
              app.showToastC('添加成功')
              _this.getData();
          }else{
            if(res.data && res.data.message){
              app.showModalC(res.data.message); 
            };        
          }          
        })
    }
    _this.setData({
      commonBulletFrame:false
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
  toDate(number,num) {
    var date = new Date(number * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + '/' + M + '/' + D +' ' + h + ':' + m + ':' +s;
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
