
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
    commonBulletFrame:false,
    afterSaleData:{},
    rejectOrAdopt:1
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
      rejectTxt: e.detail.value
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
    let ind = event.currentTarget.dataset.ind || 0;
    var DescribeImg = _this.data.afterSaleData.order.DescribeImg || [];
    wx.previewImage({
      current: DescribeImg[ind], // 当前显示图片的http链接
      urls: DescribeImg // 需要预览的图片http链接列表
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
      orderId:options.oid || ''
    })
    // '已经授权'
    _this.data.loginid = app.signindata.loginid;
    _this.data.uid = app.signindata.uid;
    // 判断是否登录
    _this.onLoadfun();


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
      if(this.data.businessOrUser == 1){ // 商家
          this.getDataBus();
      }else{
          this.getDataUser();
      };
    }else{
      if(this.data.businessOrUser == 1){ // 商家
          app.getAccessToken(_this.getDataBus)
      }else{  // 用户
          app.getAccessToken(_this.getDataUser)
      };
    };
  },
  // 商家 获取数据
  getDataBus(num=1){
    var _this = this;
    api.refundInfo(_this.data.orderId,{}).then((res) => {
     console.log('商家数据=======',res)
     if (res.data.status_code == 200) {
        _this.setData({
          afterSaleData: res.data.data.Info.order || {},


          modifyName: res.data.data.Info.order.order.sendBackMan || '' , //    寄回联系人
          modifyMobile: res.data.data.Info.order.order.sendBackTel || '' , //   寄回联系人电话
          province: res.data.data.Info.order.order.sendBackProvince || '' , //   寄回省
          city: res.data.data.Info.order.order.sendBackCity || '' , //   寄回市
          county: res.data.data.Info.order.order.sendBackArea || '' , //   寄回区
          deladdress: res.data.data.Info.order.order.sendBackAddress || '' , //   寄回地址

        });
     }else{
       if(res.data && res.data.message){
         app.showModalC(res.data.message); 
       };        
     };
    })
  },
  // 用户 获取数据
  getDataUser(num=1){
    var _this = this;
    var q1 = Dec.Aese('mod=saleAfterList&operation=orderDetail&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id='+_this.data.orderId);
    console.log('mod=saleAfterList&operation=orderDetail&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id='+_this.data.orderId)
    wx.showLoading({title: '加载中...',mask:true})
    wx.request({
      url: app.signindata.comurl + 'order.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        console.log('用户 获取数据=====',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
            _this.setData({
               afterSaleData: res.data.List || {},
            })
        }else{
          wx.showModal({
            content: res.data.Msg || res.data.msg,
            showCancel:false,
            success: function (res) {}
          });          
        };
      },

    })


    // api.refundInfo(_this.data.orderId,{}).then((res) => {
    //  console.log('商家数据=======',res)
    //  if (res.data.status_code == 200) {
    //     _this.setData({
    //       afterSaleData:{}
    //     })
    //  }else{
    //    if(res.data && res.data.message){
    //      app.showModalC(res.data.message); 
    //    };        
    //  };
    // })
  },
  // 驳回或者通过
  refundOperation(e){
    var _this = this;
    api.refundOperation(_this.data.orderId,{
      type: _this.data.rejectOrAdopt , // 1 通过 2是驳回
      send_back_man:_this.data.modifyName || '' , //    寄回联系人
      send_back_tel:_this.data.modifyMobile || '' , //   寄回联系人电话
      send_back_province:_this.data.province || '' , //   寄回省
      send_back_city:_this.data.city || '' , //   寄回市
      send_back_area:_this.data.county || '' , //   寄回区
      send_back_address:_this.data.deladdress || '' , //   寄回地址
      rebut_text:_this.data.rejectTxt || '' , //  驳回理由
    }).then((res) => {
     console.log('驳回或者通过=======',res)
     if (res.data.status_code == 200) {
        app.showModalC(res.data.message); 
     }else{
       if(res.data && res.data.message){
         app.showModalC(res.data.message); 
       };        
     };
    })
  },
  adoptButton(){
      this.data.rejectOrAdopt = 1;
      this.refundOperation();
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
      if(this.data.businessOrUser == 1){ // 商家
          this.getDataBus();
      }else{
          this.getDataUser();
      };
    })   
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


  commonBulletFrameFun(e){
    let index = e.currentTarget.dataset.index;
    let num = e.currentTarget.dataset.num || 0; // 订单标识
    var _this = this;
    var selectData = _this.data.afterSaleData || {};
    if(index == 1){ // 1 修改地址 2 退款 3 物流

    } else if(index == 2){      
        api.checkOrderRefund({
            orderId:selectData.order.orderId,	// Number订单id 对内唯一标识
            customerId:selectData.order.userId // 	Number对应订单的用户id
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
                orderNum:num,
                selectData
              })
          }else{
            if(res.data && res.data.message){
              app.showModalC(res.data.message); 
            };        
          }          
        })
    } else if(index == 3){

    }else if(index == 4){
    };
    if(index != 2){
      this.setData({
        commonBulletFrame:true,
        logisticsRefundModify:index,
        orderNum:num,
        selectData,
        rejectTxt:''
      })
    }

  },
  // 弹框确认按钮    1 修改收货地址 2 退款 3 物流 4批量导出订单 6 删除订单
  confirmCommonTip(){ 
    var _this = this;
    var logisticsRefundModify = _this.data.logisticsRefundModify;
    var selectData = _this.data.selectData || {};
    var orderNum = _this.data.orderNum || 0;
    console.log(logisticsRefundModify)
    if(logisticsRefundModify == 1){

    }else if(logisticsRefundModify == 2){
        api.brandRefund({
            orderId:selectData.order.orderId,	// Number订单id 对内唯一标识
            customerId:selectData.order.userId // 	Number对应订单的用户id
        }).then(res => {
          if (res.data.status_code == 200) {
              app.showToastC('退款成功，退款金额将在72小时之内原路返回到支付账户上。');
              setTimeout(()=>{
                _this.getData();
              },2000);
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
                                        app.showToastC('退款成功，退款金额将在72小时之内原路返回到支付账户上。');
                                        setTimeout(()=>{
                                          _this.getData();
                                        })
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
        
    }else if(logisticsRefundModify == 4){
        this.data.rejectOrAdopt = 2;
        this.refundOperation();
    }else if(logisticsRefundModify == 5){
      
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
      commonBulletFrame:false
    });

  },
  navigateBackLast(){
    wx.navigateBack({//返回
      delta: 1
    })
  },


  // 跳转详情
  jumpTimDetail(e){
    if(e.currentTarget.dataset.fid == app.signindata.uid){
      var id = e.currentTarget.dataset.tid;
    }else{
      var id = e.currentTarget.dataset.fid;
    };
    var comdata = this.data.afterSaleData;
    var order = {
      order_id: comdata.oid || '',
      order_name: comdata.goods_name || '',
      photo_url: comdata.goods_img || '',
      price: comdata.order_amount || '',
      style: comdata.goods_role_name || '',
    }
    wx.navigateTo({ 
      url: `/page/settled/pages/timHomePage/timHomePage?id=${id}&order=${JSON.stringify(order)}`
    });
  },
  // 取消申请
  withdraw(e){
    var groupid = e.currentTarget.dataset.groupid || 0;
    wx.showModal({
      title:'取消申请',
      content: '你确定要取消售后申请吗？',
      confirmColor:'#02BB00',
      success: (res) => {
        if (res.confirm) {
            if(e.currentTarget.dataset.fid == app.signindata.uid){
              var id = e.currentTarget.dataset.tid;
            }else{
              var id = e.currentTarget.dataset.fid;
            };
            var q1 = Dec.Aese('mod=userSig&operation=del&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&from_userid='+id);
            wx.showLoading({title: '加载中...',mask:true})
            wx.request({
              url: app.signindata.comurl + 'im.php' + q1,
              method: 'GET',
              header: {'Accept': 'application/json'},
              success: function(res) {
                console.log('删除会话=====',res)
                wx.hideLoading();
                if (res.data.ReturnCode == 200) {
    
                }else{
                  wx.showModal({
                    content: res.data.Msg || res.data.msg,
                    showCancel:false,
                    success: function (res) {}
                  });          
                };
              },

            })
        };
      },
    })
  },
})
