var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
var WxParse = require('../../../../wxParse/wxParse.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '在线福袋', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    // 适配苹果X
    isIphoneX: false,
    isProduce: app.signindata.isProduce,
    scene:'',
    isredpacket:false,
    isawardMask:false,
    recordList:[],
    goodsList:[],
    // 收货地址
    receivingaddress:false,
    tipback:false,
    // 收货地址数据
    addressdata:[],
    // 收货地址显示 请选择收货地址
    tipaddress:'请选择收货地址',
    tipaid:'',
    current:1,
    //我的抽盒金
    blindboxMoney:'',
    // 使用抽盒金比率
    deductRatio:0.6,
    // 此商品是否可以使用抽盒金抵扣
    isDeduct:true,
    // 是否使用抽盒金抵扣
    isUseBlindboxMoney:true,
    // 提交订单时是否使用抽盒金抵扣
    isDeductNum:1,
    // 下单type
    placeAnOrderType:0,
    // 订单信息
    order:'',
    // 福袋内容
    orderRoleList:[],
    isredpacket:false,
    detailList:[],
    is_detail:false,
    salesCalendar:[]
  },
  // 跳转日历
  jumpoffering(w){
      var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
      app.comjumpwxnav(0,id,'','')
  }, 
  isDetailF(e){
    let ia = e.currentTarget.dataset.ia || false;
    var goodsDesc1 = [];
    var goodsDesc2 = [];
    
    if(ia){
      goodsDesc1 = this.data.infoData.goodsDesc1;
      goodsDesc2 = this.data.infoData.goodsDesc2;
    }else{
      goodsDesc1 = this.data.infoData.goodsDesc1
    };
    this.setData({
      is_detail:!this.data.is_detail,
      goodsDesc1,
      goodsDesc2
    });
    console.log(ia,goodsDesc1,goodsDesc2)
  },
  jumpRankingList(){
    wx.navigateTo({
      url: "/page/settled/pages/nPnfankingList/nPnfankingList",
    });
  },
  nineSpotNine(e){
    let rule = e.currentTarget.dataset.rule;
    app.showModalC(rule); 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options) {
      this.setData({
        scene:options,
      })
    } 
    app.signindata.suap = 14;
    // 判断是否授权
    this.activsign();
  },
  onLoadfun:function(){
    var _this = this;
    this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      isProduce: app.signindata.isProduce,
      blindboxMoney:app.signindata.blindboxMoney
      // blindboxMoney:100
    });
    console.log(app.signindata.blindboxMoney)
    this.gitList();

    // 文章
    var exh = Dec.Aese('mod=subscription&operation=listArticle');
    wx.request({
      url: app.signindata.comurl + 'toy.php' + exh,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        console.log('文章=======',res)
        if (res.data.ReturnCode == 200) {
          _this.setData({
            artTicTip:res.data.Info.tip || '',
            salesCalendar:res.data.List.article || []
          });
        }
      },
      fail: function () { }
    });


  },
  activsign: function () {
    // 判断是否授权 
    var _this = this;
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
      return false;
    };    

    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      _this.onLoadfun();
    }else{
        // '已经授权'
        _this.setData({
          loginid: app.signindata.loginid,
          uid: app.signindata.uid,
          openid: app.signindata.openid,
          avatarUrl: app.signindata.avatarUrl,
          isShareFun: app.signindata.isShareFun,
          isProduce: app.signindata.isProduce,
          signinlayer: true,
          tgabox: false
        });
        // 判断是否登录
        if (_this.data.loginid != '' && _this.data.uid != '') {
          _this.onLoadfun();
        } else {
          app.signin(_this);
        };  
    };    
  },
  // 授权点击统计
  clicktga: function () {
    app.clicktga(2)
  },
  clicktganone: function () {
    this.setData({ tgabox: false })
  },
  // 点击登录获取权限
  userInfoHandler: function (e) {
    var _this = this;
    wx.getSetting({
      success: res => {
        if (true) {
          _this.setData({
            signinlayer: true,
            tgabox: false
          });
          _this.activsign();
          // 确认授权用户统计
          app.clicktga(4);          
        }
      }
    });
    if (e.detail.detail.userInfo) { } else {
      app.clicktga(8)  //用户按了拒绝按钮
    };
  },
  pullupsignin: function () {
    // // '没有授权'
    this.setData({
      tgabox: true
    });
  },

  tabChangeFun(e){
    this.setData({
      current: e.currentTarget.dataset.ind
    });
  },

  hideAwardMask(){
    this.gitList();
    this.setData({
      isawardMask:false
    })
  },

  getWelfare(e){
    this.setData({
      welfare:e.detail.welfare
    })
  },
  redpagshareimage(e){
    console.log(e.detail,"111111")
    this.setData({
      redpagshareimg:e.detail
    })
  },


  gitList(){
    var _this = this;
    clearInterval(_this.data.timer);
    wx.showLoading({title: '加载中...',})
    var exh = Dec.Aese('mod=luckbag&operation=goodsList&uid='+app.signindata.uid+'&loginid='+app.signindata.loginid)
    console.log("福袋详情 ===== "+app.signindata.comurl + 'mod=luckbag&operation=goodsList&uid='+app.signindata.uid+'&loginid='+app.signindata.loginid)
    wx.request({
      url: app.signindata.comurl + 'goods.php' + exh,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log('福袋详情 =========== ',res)
        if (res.data.ReturnCode == 200) {
          
          WxParse.wxParse('article', 'html', res.data.Info.goods_desc, _this, 0);
          var goodsList = res.data.List.goodsList
          _this.setData({
            subscribedata:res.data.Info.subscribe,
            shareInfo:res.data.Info.shareInfo,
            bannerImg:res.data.List.bannerImg,
            recordList:res.data.List.recordList,
            goodsList:goodsList,
            deductRatio:res.data.Info.normalDeductRatio,
            isDeduct:res.data.Info.isDeduct,
            isUseBlindboxMoney:res.data.Info.isDeduct?true:false,
            isDeductNum:res.data.Info.isDeduct&&_this.data.blindboxMoney!=0?1:0,
            countWelfare:res.data.Info.countWelfare,
            explain:res.data.Info.rule,
            infoData:res.data.Info
          },()=>{
              var is_newOpenTime = false;
              for(var i=0 ;i<goodsList.length;i++){
                if(goodsList[i].newOpenTime && goodsList[i].stockNumber == 0){
                    is_newOpenTime = true;
                };
              };
              if(is_newOpenTime){
                _this.countdownbfun();
              };
          })


          

          _this.setData({
            isredpacket:true
          })
          
        } else {
          app.showToastC(res.data.msg);
        }
      },
      fail: function () { }
    });
  },


  // 倒计时
  countdownbfun: function () {
    var _this = this;
    clearInterval(_this.data.timer);
    var raplist = _this.data.goodsList||[];
    var len = raplist.length;
    function nowTime() {
      var iftrins = true;
      // 获取现在的时间
      var nowTime = new Date().getTime();
      for (var i = 0; i < len; i++) {
          var lastTime = raplist[i].newOpenTime * 1000;
          var differ_time = lastTime - nowTime;
          if (differ_time >= 0) {
            var differ_day = Math.floor(differ_time / (3600 * 24 * 1e3));
            var differ_hour = Math.floor(differ_time % (3600 * 1e3 * 24) / (1e3 * 60 * 60));
            var differ_minute = Math.floor(differ_time % (3600 * 1e3) / (1000 * 60));
            var s = Math.floor(differ_time % (3600 * 1e3) % (1000 * 60) / 1000);
            if (differ_day.toString().length < 2) { differ_day = "0" + differ_day; };
            if (differ_hour.toString().length < 2) { differ_hour = "0" + differ_hour; };
            if (differ_minute.toString().length < 2) { differ_minute = "0" + differ_minute; };
            if (s.toString().length < 2) { s = "0" + s; };
            if (differ_day>0){
              var str = differ_day + '天' + ' ' + differ_hour + ':' + differ_minute + ':' + s;
            }else{
              var str = differ_hour + ':' + differ_minute + ':' + s;
            };
            raplist[i].timestr = str;
            raplist[i].day = differ_day;
            raplist[i].hour = differ_hour;
            raplist[i].minute = differ_minute;
            raplist[i].second = s;
          } else {
            raplist[i].timestr = '00:00:00:0';
            raplist[i].day = '00';
            raplist[i].hour = '00';
            raplist[i].minute = '00';
            raplist[i].second = '00';
          };
          if (raplist[i].day != '00' || raplist[i].hour != '00' || raplist[i].minute != '00' || raplist[i].second != '00') {
            iftrins = false;
          };
      };
      _this.setData({
        goodsList: raplist
      });
      if (iftrins) {
        clearInterval(_this.data.timer);
        setTimeout(()=>{
          _this.gitList();
        },1000);
      };
    }
    if (_this.data.goodsList.length != 0) {
      nowTime();
      clearInterval(_this.data.timer);
      _this.data.timer= setInterval(nowTime, 1000);
    };
  },


  useBlindboxMoneyFun(){
    this.setData({
      isUseBlindboxMoney:!this.data.isUseBlindboxMoney,
    })
    this.setData({
      amountpayable:this.data.isUseBlindboxMoney? (this.data.originalAmountpayable-this.data.useblindAmountpayable).toFixed(2):this.data.originalAmountpayable,
      isDeductNum:this.data.isUseBlindboxMoney?1:0
    })
  },
  showbuybombsimmediately(e){
    let price =  e.currentTarget.dataset.price;
    this.setData({
      isUseBlindboxMoney:true
    })
    let useblindAmountpayable = this.data.blindboxMoney>(price.toFixed(2)*this.data.deductRatio)?price.toFixed(2)*this.data.deductRatio:this.data.blindboxMoney;
    let amountpayable = this.data.blindboxMoney!=0? this.data.isDeduct? this.data.isUseBlindboxMoney? (price.toFixed(2)-useblindAmountpayable).toFixed(2) :price.toFixed(2) :price.toFixed(2) :price.toFixed(2)
    this.setData({
      placeAnOrderType: e.currentTarget.dataset.type,
      // 应付金额
      amountpayable:amountpayable,
      // 原始应付金额
      originalAmountpayable: price.toFixed(2),
      // 使用抽盒金后应付金额
      useblindAmountpayable: parseFloat(useblindAmountpayable).toFixed(3).slice(0,-1),
    })
    
    this.nextpagediao();
    this.setData({
      tipbacktwo: true,
      buybombsimmediately: true
    });
  },

  // 二级背景函数
  tipbacktwo:function(){
    this.setData({
      tipbacktwo: false,
      buybombsimmediately: false,
      receivingaddress: false,
    })
  },

  // 下单
  placeAnOrder:function(w){
    var _this = this;
    wx.showLoading({title: '加载中...',mask:true});

    var number = w.currentTarget.dataset.number || w.target.dataset.number || 0;

    if (this.data.tipaid == '') {
      app.showToastC('请选择地址');
      return false;
    };


    var exh = Dec.Aese('mod=luckbag&operation=payOrder&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&type='+this.data.placeAnOrderType+'&aid=' + _this.data.tipaid+'&isDeduct='+_this.data.isDeductNum);

    console.log('下单=========',app.signindata.comurl + 'goods.php?mod=luckbag&operation=payOrder&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&type='+this.data.placeAnOrderType+'&aid=' + _this.data.tipaid+'&isDeduct='+_this.data.isDeductNum)

    wx.request({
      url: app.signindata.comurl + 'goods.php' + exh,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading()
        console.log('placeAnOrder=====',res)
        if (res.data.ReturnCode == 200) {
           _this.data.order = res.data.Info.order;
          //  _this.setData({
          //   cardList : res.data.List.goods || [],
          //   gearCount : res.data.List.relRefillGearCount,
          //   is_finish:res.data.Info.isFinished
          //  })
          //  _this.data.recordtime = res.data.Info.newOverTime;	
          //  _this.countdown();

           _this.paymentmony();
        } else {
          wx.hideLoading()
          app.showToastC(res.data.Msg);
        }
      },
      fail: function () { }
    });
  },
  // 微信支付
  paymentmony:function(){
    var _this = this; 
    var q = Dec.Aese('mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + _this.data.order.cart_id + '&xcx=1' + '&openid=' + app.signindata.openid)

    console.log('支付=====',app.signindata.comurl + 'order.php?mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + _this.data.order.cart_id + '&xcx=1' + '&openid=' + app.signindata.openid)

    wx.request({
      url: app.signindata.comurl + 'order.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
              wx.hideLoading();
              var payinfo = res.data.Info;
              // _this.data.subscribedata = res.data.Info.subscribe || ''  // 订阅信息
              wx.requestPayment({
                  'timeStamp': res.data.Info.timeStamp.toString(),
                  'nonceStr': res.data.Info.nonceStr,
                  'package': res.data.Info.package,
                  'signType': 'MD5',
                  'paySign': res.data.Info.paySign,
                  'success': function (res) { 
                    _this.awardList();
                    // 更新抽盒金
                    if(_this.data.isDeduct && _this.data.isUseBlindboxMoney){
                      var gbm = Dec.Aese('mod=blindBox&operation=getBlindboxMoney&uid='+_this.data.uid);
                      wx.request({
                        url: app.signindata.comurl + 'spread.php' + gbm,
                        method: 'GET',
                        header: { 'Accept': 'application/json' },
                        success: function (res) {
                          if (res.data.ReturnCode == 200) {
                            console.log('更新抽盒金=====',res)
                            _this.setData({
                              blindboxMoney: res.data.Info.blindbox_money || ""
                            });
                            app.signindata.blindboxMoney = res.data.Info.blindbox_money || "";
                            app.signindata.tempBlindboxMoney = res.data.Info.tempBlindboxMoney || "";
                          };
                        }
                      })
                    }

                  },
                  'fail':function(res){},
                  'complete': function (res) {}
                })
        }else{
          if (res.data.ReturnCode == 800) {
            app.showToastC('非该用户订单');
          };
          if (res.data.ReturnCode == 815) {
            app.showToastC('订单状态错误');
          };
          if (res.data.ReturnCode == 816) {
            app.showToastC('不支持的支付类型');
          };
          if (res.data.ReturnCode == 817) {
            app.showToastC('付款明细已生成');
          };
          if (res.data.ReturnCode == 201) {
            app.showToastC('微信预支付失败');
          }; 
          if (res.data.ReturnCode == 805) {
            app.showToastC('剩余库存不足');
          }; 
               
          // 判断非200和登录
          Dec.comiftrsign(_this, res, app);     
        };   
      }
    })
  },


  awardList(){
    var _this = this;
    wx.showLoading({title: '加载中...',})
    var exh = Dec.Aese('mod=luckbag&operation=orderInfo&uid='+app.signindata.uid+'&loginid='+app.signindata.loginid+'&cart_id=' + _this.data.order.cart_id)
    console.log("福袋内容详情 ===== "+app.signindata.comurl + 'mod=luckbag&operation=orderInfo&uid='+app.signindata.uid+'&loginid='+app.signindata.loginid+'&cart_id=' + _this.data.order.cart_id)
    wx.request({
      url: app.signindata.comurl + 'goods.php' + exh,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading();
        console.log('福袋内容详情 =========== ',res)
        if (res.data.ReturnCode == 200) {
          _this.setData({
            isawardMask:true,
            tipbacktwo: false,
            buybombsimmediately: false,
            orderRoleList:res.data.List.orderRoleList,
          })
        } else {
          _this.gitList();
          _this.setData({
            buybombsimmediately:false,
            tipbacktwo: false,
          })
          app.showModalC(res.data.Msg || res.data.msg);
        }
      },
      fail: function () { }
    });
  },


  // 下一页返回调取
  nextpagediao:function(){
    var _this = this;
    //  调取收货地址
    var q = Dec.Aese('mod=address&operation=getlist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'user.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('收货地址======nextpagediao=======',res)
        if (res.data.ReturnCode == 200){
          var rdl = res.data.List;
          var tptipadi = '';
          var tptipadd = '';
          var tipnamephone = '';
          if (rdl.length != 0) {
            for (var i = 0; i < rdl.length; i++) {
              if (rdl[i].isdefault == 1) {
                rdl[i].checked = true;
                tptipadi = rdl[i].aid;
                tptipadd = rdl[i].address;
                tipnamephone = rdl[i].consignee + " " + rdl[i].phone;
              } else {
                rdl[i].checked = false;
              }
            };
            _this.data.tipaid = tptipadi;
            _this.setData({
              addressdata: rdl,
              tipnamephone: tipnamephone,
              tipaddress: tptipadd
            })

            app.signindata.receivingAddress = rdl;

          } else {
            _this.setData({
              addressdata: [],
            })
          };
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);         
      }
    });
  },
    // 隐藏收货地址弹框
  receivingaddressfun:function(){
    this.setData({
      receivingaddress: false,
      tipback:false,
    })
  },
   // 收货地址弹框
  seladdressfun:function(e){
    this.setData({
      receivingaddress:true,
      tipback:true,
      isAwardMask:false,
      isRecordMask:false,
      awardId:e.currentTarget.dataset.id
    });
  },
  // 删除地址
  deladdress: function (event){
    var _this = this;
    var dat = this.data.addressdata;
    var indid = event.target.dataset.ind;
    var num = '';
    var iftrdefault = false;
    for (var i = 0; i < dat.length; i++) {
      if (dat[i].aid == indid) {
        num = i;
        if (dat[i].isdefault == 1) {
          iftrdefault = true;
        }
      }
    };
    if (iftrdefault) {
      app.showToastC('默认地址不能删除');
      return false;
    };
    wx.showModal({
      content: '您确定要删除这个地址吗？',
      success: function (res) {
        if (res.confirm) {
          var q = Dec.Aese('mod=address&operation=delete&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + indid)
          wx.request({
            url: app.signindata.comurl + 'user.php'+q,
            method: 'GET',
            header: { 'Accept': 'application/json' },
            success: function (res) {
              if (res.data.ReturnCode == 200){
                dat.splice(num, 1);
                _this.setData({
                  addressdata: dat
                });
                app.signindata.receivingAddress = dat;
              };
              if (res.data.ReturnCode == 908) {
                app.showToastC('aid和uid不匹配');
              };              
              // 判断非200和登录
              Dec.comiftrsign(_this, res, app);              
            }
          })
        }
      }
    })
  },
  // 编辑地址
  jumpeditaddress: function (event) {
    var aid = event.target.dataset.aid || event.currentTarget.dataset.aid;
    var address = event.target.dataset.address || event.currentTarget.dataset.address;
    var city = event.target.dataset.city || event.currentTarget.dataset.city;
    var consignee = event.target.dataset.consignee || event.currentTarget.dataset.consignee;
    var district = event.target.dataset.district || event.currentTarget.dataset.district;
    var idcard = event.target.dataset.idcard || event.currentTarget.dataset.idcard;
    var phone = event.target.dataset.phone || event.currentTarget.dataset.phone;
    var province = event.target.dataset.province || event.currentTarget.dataset.province;
    wx.navigateTo({
      url: "/pages/shippingAddress/shippingAddress?aid=" + aid + '&address=' + address + '&city=' + city + '&consignee=' + consignee + '&district=' + district + '&idcard=' + idcard + '&phone=' + phone + '&province=' + province
    })
  },
  // 跳转增加新地址
  jumpaddress: function () {
    wx.navigateTo({
      url: "/pages/newreceivingaddress/newreceivingaddress"
    })
  },
  // 修改收货地址
  revisethereceivingaddress: function (w) {
    var tipaid = w.currentTarget.dataset.tipaid || w.target.dataset.tipaid;
    var tipadd = w.currentTarget.dataset.tipadd || w.target.dataset.tipadd;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind||0;
    this.data.tipaid = tipaid;
    var data = this.data.addressdata;
    this.setData({
      tipnamephone: data[ind].consignee + " " + data[ind].phone,
      tipaddress: tipadd,
      receivingaddress: false,
      tipback:false
    });
  },


  //跳转详情
  toaRewarddeyails(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({   
      url: "/page/secondpackge/pages/aRewardDetails/aRewardDetails?id=" + id
    });
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
    this.gitList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(options ) {
    var _this = this
    var share = {
      title: this.data.shareInfo.title,
      imageUrl: this.data.shareInfo.img,
      path: "/page/secondpackge/pages/onlineFukubukuro/onlineFukubukuro",
      // path: "/page/secondpackge/pages/onlineFukubukuro/onlineFukubukuro?referee=" + _this.data.uid + '&welfareid=' + _this.data.scene.welfareid + '&isredpag=1',
      success: function (res) {}
    }
    return share;
  },
  onShareTimeline:function(){
    var _this = this;
    return {
      title:this.data.shareInfo.title,
      query:{},
      imageUrl: this.data.shareInfo.img
    }
  },
  jumpowntoy: function() {
    wx.navigateTo({
      url: "/page/component/pages/myothertoydg/myothertoydg?ownerId=" + this.data.uid
    })
  },
   // banner 跳转
   jumpbanner: function (w) {
    var whref = w.currentTarget.dataset.href || w.target.dataset.href;
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type;
    var imgurl = w.currentTarget.dataset.imgurl || w.target.dataset.imgurl || '';
    var wname = w.currentTarget.dataset.title || w.target.dataset.title || '美拆'; 

    if(whref == ''){
      var _this = this;
      var subscribe_data = _this.data.subscribeJson[0].toyshowStart;
      console.log(subscribe_data)
      this.setData({
        subscribedata:subscribe_data
      });
      // _this.subscrfun(1);
      return false;
    }

    // 公共跳转
    app.comjumpwxnav(item_type, whref, wname, imgurl);

  },
  // 拉起订阅
  subscrfunstar: function () {
    var _this = this;
    var subscribedata = _this.data.subscribedata || '';
    if (subscribedata && subscribedata.template_id && app.signindata.subscribeif) {
      if (subscribedata.template_id instanceof Array) {
        wx.requestSubscribeMessage({
          tmplIds: subscribedata.template_id || [],
          success(res) {
            var is_show_modal = true;
            for (var i = 0; i < subscribedata.template_id.length; i++) {
              if (res[subscribedata.template_id[i]] == "accept") {
                app.subscribefun(_this, 0, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
                if (is_show_modal) {
                  _this.subshowmodalfun();
                  is_show_modal = false;
                };
              };
            };
          },
        })
      } else {
        wx.requestSubscribeMessage({
          tmplIds: [subscribedata.template_id || ''],
          success(res) {
            if (res[subscribedata.template_id] == "accept") {
              app.subscribefun(_this, 0, subscribedata.template_id, subscribedata.subscribe_type);
              _this.subshowmodalfun();
            };
          }
        })
      };
    };
  },
  subshowmodalfun: function () {
    var _this = this;
    wx.showModal({
      title: '提示',
      content: _this.data.subscribeCouponTip || '订阅成功,开售前通过微信发送提醒',
      showCancel: false,
      success: function (res) {
        _this.setData({
          subscribeCouponTip:'',
          isSubscribeCoupon:false
        })
        }
    })
  },
})