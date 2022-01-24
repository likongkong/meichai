
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
    csc:'',
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
    is_loading:false   
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
    _this.setData({is_loading:false});
    api.oMbrandInfo(_this.data.orderid,{}).then((res) => {
      _this.setData({is_loading:true});
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
    var detailData = _this.data.detailData || {};
    var selectData = _this.data.detailData;
    if(index == 1){ // 1 修改地址 2 退款 3 物流
      var receipt = detailData.receipt || {};
      _this.setData({
        modifyName:receipt.consignee,
        modifyMobile:receipt.mobile,
        deladdress:receipt.address,
        province:receipt.province,
        city:receipt.city,
        county:receipt.district,
        selectData
      })
    } else if(index == 2){
        api.checkOrderRefund({
            orderId:detailData.order.orderId,	// Number订单id 对内唯一标识
            customerId:detailData.order.userId // 	Number对应订单的用户id
        }).then(res => {
          console.log('查询是否分账',res)
          if (res.data.status_code == 200) {
              var payInfoData = res.data.data.Info;
              var subLedger = 1;
              if(payInfoData.isProfit){
                subLedger = 1;
              }else{
                subLedger = 2;
              };
              _this.setData({
                subLedger:subLedger,
                payInfoData:payInfoData,
                commonBulletFrame:true,
                logisticsRefundModify:index,
                selectData
              })
          }else{
            if(res.data && res.data.message){
              app.showModalC(res.data.message); 
            };        
          }          
        })
    } else if(index == 3){
      _this.setData({
        csc:detailData.order.shippingName || '',
        scanCodeMsg:detailData.order.shippingCode || '',
        selectData
      })

    };

    if(index != 2){
      this.setData({
        commonBulletFrame:true,
        logisticsRefundModify:index,
        selectData
      })
    }


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
            district:_this.data.county, //	String	收件地区县
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
                app.showToastC('退款成功，退款金额将在72小时之内原路返回到支付账户上。')
                _this.getData();
            }else if(res.data.status_code == 410004){
                var infoData = res.data.data.Info || {};
                var q = Dec.Aese('mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + infoData.order.cartId + '&xcx=1' + '&openid=' + app.signindata.openid)
                console.log('mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + infoData.order.cartId + '&xcx=1' + '&openid=' + app.signindata.openid)
                wx.request({
                  url: app.signindata.comurl + 'order.php'+q,
                  method: 'GET',
                  header: { 'Accept': 'application/json' },
                  success: function (res) {
                    if (res.data.ReturnCode == 200) {
                          wx.requestPayment({
                              'timeStamp': res.data.Info.timeStamp.toString(),
                              'nonceStr': res.data.Info.nonceStr,
                              'package': res.data.Info.package,
                              'signType': 'MD5',
                              'paySign': res.data.Info.paySign,
                              'success': function (res) { 
                                    // 成功之后在调取一下退款接口
                                    api.brandRefund({
                                        orderId:selectData.order.orderId,	// Number订单id 对内唯一标识
                                        customerId:selectData.order.userId // 	Number对应订单的用户id
                                    }).then(res => {
                                      if (res.data.status_code == 200) {
                                          app.showToastC('退款成功，退款金额将在72小时之内原路返回到支付账户上。')
                                          _this.getData();
                                      }else{
                                        if(res.data && res.data.message){
                                          app.showModalC(res.data.message); 
                                        };
                                      }          
                                    })                              
                              },
                              'fail':function(res){},
                              'complete': function (res) {}
                            })
                    };   
                  }
                })       
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
    }else if(logisticsRefundModify == 6){
        api.emptyLogistics(selectData.order.orderId,{}).then(res => {
            if (res.data.status_code == 200) {
                app.showToastC('删除成功');
                setTimeout(()=>{
                  _this.getData();
                },2000);
            }else{
              if(res.data && res.data.message){
                app.showModalC(res.data.message); 
              };
            }          
        })
    };
    _this.setData({
      commonBulletFrame:false,
      selectData
    })
  },
  conditionfun(){
    this.setData({
      condition: false,
      cityback:false
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
    app.downRefreshFun(() => {
      this.getData()
    })  
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
  jump(){
    var _this = this;
    var detailData = _this.data.detailData;

    if(detailData.order.orderType == 1){ // 普通订单
      app.comjumpwxnav(9047,detailData.goods.goodsId,'','')
    }else if(detailData.order.orderType == 13){ // 限定抽签
      app.comjumpwxnav(9003,detailData.order.activityId,'','')
    }else if(detailData.order.orderType == 14){ // 抽盲盒
      app.comjumpwxnav(9005,detailData.order.activityId,'','')
    }else if(detailData.order.orderType == 2){ // 免单活动订单
      app.comjumpwxnav(8,detailData.order.activityId,'','')
    }else if(detailData.order.orderType == 21){ // 一番赏
      app.comjumpwxnav(9016,detailData.order.activityId,'','')
    }else if(detailData.order.orderType == 12){
      app.comjumpwxnav(9004,detailData.order.activityId,'','')
    }
    // else if(detailData.order.orderType == ){
    //   app.comjumpwxnav('','','','')
    // }else if(detailData.order.orderType == ){
    //   app.comjumpwxnav('','','','')
    // }else if(detailData.order.orderType == ){
    //   app.comjumpwxnav('','','','')
    // }else if(detailData.order.orderType == ){
    //   app.comjumpwxnav('','','','')
    // }else if(detailData.order.orderType == ){
    //   app.comjumpwxnav('','','','')
    // }else if(detailData.order.orderType == ){
    //   app.comjumpwxnav('','','','')
    // }
    
  }

})
