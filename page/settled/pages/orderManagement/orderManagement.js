
var Dec = require('../../../../common/public');//aes加密解密js
var tcity = require("../../../../common/citys.js");
var api = require("../../../../utils/api.js");
var COS = require("../../../../common/cos-wx-sdk-v5.js")
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
    brandid:0,
    ordername:'',
    centerIndex:'-1',
    scrollleft:0,
    scrollleftTop:0,
    logisticsRefundModify:4, // 1 修改 2 退款 3 物流 4批量导出订单
    scanCodeMsg: "",
    csc:'',
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
    brand:[],
    order:{},
    payStatus:[
      {name:'全部',num:'-1'},
      {name:'待支付',num:'0'},
      {name:'待发货',num:'2'},
      {name:'已发货',num:'4'},
      {name:'已完成',num:'5'}
    ], // 支付状态 
    subLedger: 0 , // 1 已分账 2 未分账
    countOrder:0,
    nodataiftr:false
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
  conditionfun(){
    this.setData({
      condition: false,
      cityback:false
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
  // 跳转详情
  jumpBusOrderDetails(w){
    let orderid = w.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: "/page/settled/pages/businessOrderDetails/businessOrderDetails?orderid="+orderid
    });
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
    let num = e.currentTarget.dataset.num || 0; // 订单标识
    var _this = this;
    var order = _this.data.order || [];
    var selectData = order[num] || {};
    if(index == 1){ // 1 修改地址 2 退款 3 物流
      var receipt = order[num].receipt || {};
      _this.setData({
        modifyName:receipt.consignee,
        modifyMobile:receipt.mobile,
        deladdress:receipt.address,
        province:receipt.province,
        city:receipt.city,
        county:receipt.district
      })
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
      _this.setData({
        csc:'',
        scanCodeMsg:''
      })
    }else if(index == 4){

    };
    if(index != 2){
      this.setData({
        commonBulletFrame:true,
        logisticsRefundModify:index,
        orderNum:num,
        selectData
      })
    }

  },
  // 弹框确认按钮    1 修改收货地址 2 退款 3 物流 4批量导出订单
  confirmCommonTip(){ 
    var _this = this;
    var logisticsRefundModify = _this.data.logisticsRefundModify;
    var selectData = _this.data.selectData || {};
    var orderNum = _this.data.orderNum || 0;
    console.log(logisticsRefundModify)
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
              app.showToastC('添加成功');
              var receipt = _this.data.order[orderNum].receipt || [];
              receipt.consignee = _this.data.modifyName;
              receipt.mobile = _this.data.modifyMobile;
              receipt.address = _this.data.deladdress;
              receipt.province = _this.data.province;
              receipt.city = _this.data.city;
              receipt.district = _this.data.county;
              _this.setData({
                commonBulletFrame:false,
                ['order[' + orderNum + '].receipt'] : receipt
              });
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
              app.showToastC('添加成功');
              _this.setData({
                commonBulletFrame:false,
                ['order[' + orderNum + '].order.shippingCode'] : _this.data.scanCodeMsg
              });
          }else{
            if(res.data && res.data.message){
              app.showModalC(res.data.message); 
            };        
          }          
        })
    }else if(logisticsRefundModify == 4){
    //   var access_token = wx.getStorageSync('access_token') || '';
    //   wx.downloadFile({
    //     url: `${Dec.comUrlNew()}brand/exportorder`,
    //     header: {
    //       'app-version': Dec.versionnumber,
    //       'Accept': 'application/x.mcts.v1+json',
    //       'app-source':3,
    //       'Authorization': 'Bearer ' + access_token          
    //     },
    //     success: function(res) {
    //         var filePath = res.tempFilePath;
    //         console.log(filePath);
    //         wx.openDocument({
    //             filePath: filePath,
    //             success: function(res) {
    //                 console.log('打开文档成功')
    //             },
    //             fail: function(res) {
    //                 console.log(res);
    //             },
    //             complete: function(res) {
    //                 console.log(res);
    //             }
    //         })
    //     },
    //     fail: function(res) {
    //         console.log('文件下载失败');
    //     },
    //     complete: function(res) {},
    // })

        api.exportOrder({}).then((res)=>{
          console.log('导出订单=======',res)
        if (res.data.status_code == 200) {
            _this.copyTBL(res.data.data.Info.file.path || '')
        }else{
          if(res.data && res.data.message){
            app.showModalC(res.data.message); 
          };        
        }
        });
    }else if(logisticsRefundModify == 5){
      var cos = new COS({
        SecretId: 'AKIDmY0RxErYIm2TfkckG8mEYbcNA4wYsPbe',
        SecretKey: '4WkpgJ5bJlU4B6wNuCG4EDyVnGWUFhw1',
      });

      wx.chooseMessageFile({
        count: 1,
        type: 'file',
        success (res) {
          console.log('上传文件',res)
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFiles;
          if(tempFilePaths && tempFilePaths.length != 0){
              var iftr = true;
              tempFilePaths.forEach(element => {
                  console.log(element)
                  var filePath = element.path;
                  //获取最后一个.的位置
                  var index= filePath.lastIndexOf(".");
                  //获取后缀
                  var ext = filePath.substr(index+1);
                  var fileName =  `${app.signindata.uid}_${new Date().getTime()}.${ext}`;
                  cos.postObject({
                        Bucket: 'brand-settled-info-1300990269',
                        Region: 'ap-beijing',
                        Key: `excel/${fileName}`,
                        FilePath: filePath,
                        onProgress: function (info) {  //上传进度
                            console.log('进度条',JSON.stringify(info));
                        }
                      },(err, data) => {
                        console.log(err,data)
                        if(data){
                          api.brandImport({
                            fileName:fileName
                          }).then((res)=>{
                            if (res.data.status_code == 200) {
                              app.showToastC('上传成功');
                              setTimeout(()=>{
                                _this.getData();
                              },2000)
                              
                            }else{
                              if(res.data && res.data.message){
                                app.showModalC(res.data.message); 
                              };        
                            };
                          })
                        }else if(err){
                          app.showToastC('上传失败')
                        };

                      }
                  );
              });
          };

        }
      })
    }
    _this.setData({
      commonBulletFrame:false
    });

  },

  //  复制内容到粘贴板
  copyTBL: function (title) {
    wx.setClipboardData({
      data: title,
      success: function (res) {
        app.showToastC('复制成功');
      }
    });
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
    let index = e.currentTarget.dataset.index || 0;
    let ele = '#ele' + index;
    that.setData({
      centerIndex:index,
    })
    this.getData();
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select(ele).boundingClientRect();
    query.exec(function(res) {
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
    this.getData();
  },
  onFocus: function (w) {
    this.setData({
      ordername:""
    });
  },  

  scrollViewTop(e){
    var brandid = e.currentTarget.dataset.brandid || 0;
    this.setData({
      brandid:brandid
    });
    this.getData();
    let that = this;
    let top = '#top' + brandid;
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select(top).boundingClientRect();
    query.exec(function(res) {
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

    if(wx.getStorageSync('access_token')){
      this.getData();
    }else{
      app.getAccessToken(_this.getData)
    };
    
  },
  // 获取数据
  getData(num=1){
     var _this = this;
    if (num==1){
      _this.setData({countOrder:0,page : 1,nodataiftr:false});
    }else{
      var pagenum = _this.data.page;
      _this.data.page = ++pagenum;
    };
     api.oMgetData({
       'searchValue':_this.data.ordername,
       'payStatus':_this.data.centerIndex,
       'brandId':_this.data.brandid || 0,
       'pageId':_this.data.page
     }).then((res) => {
      console.log('列表数据=======',res)
      _this.setData({nodataiftr:true})
      if (res.data.status_code == 200) {
          var order = res.data.data.List.order || [];
          if(order && order.length != 0){
            order.forEach(element => {
               if(element.order.payTime){
                  element.order.payTimeTrans = _this.toDate(element.order.payTime);
               };
            });
          };
          console.log(order)

          if (num==1){
              var countOrder =  res.data.data.Info.order.count || 0;
              var brand = res.data.data.List.brand || [];
              _this.setData({
                countOrder,
                brand,
                order
              });
          }else{
            var orderData = [..._this.data.order,...order]
            _this.setData({
              order:orderData
            });
          };
      }else{
        if(res.data && res.data.message){
          app.showModalC(res.data.message); 
        };        
      };
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
      imageUrl:indexShareImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
      success: function (res) {}
    } 
  },

})
