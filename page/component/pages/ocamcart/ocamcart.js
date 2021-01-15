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
    isProduce: app.signindata.isProduce,
    headhidden: false,
    shopnum: 0,
    dryinglistnum: 0,
    listdata:[],
    c_title: '闲置潮玩',
    c_arrow: true,
    c_backcolor: '#ff2742',
    page: 0,
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    iftrnodata: false,
    inputdata: '',
    searchorwhole: true,
    windowHeight: app.signindata.windowHeight - 65 - wx.getStorageSync('statusBarHeightMc') || 0,
    signinlayer: false,
    cartInfo: 0,
    cartData: [],
    islistdata:false,
    shopdetaillist:[],
    shopdetail:'',
    shopimgtop:0,
    addressefm: false,
    isaddress:false, //是否显示地址（是否有地址）
    pricedetailc:true,
    //我的抽盒金
    blindboxMoney:'',
    // 使用抽盒金比率
    deductRatio:0.6,
    // 此商品是否可以使用抽盒金抵扣
    isDeduct:true,
    // 是否使用抽盒金抵扣
    isUseBlindboxMoney:true,
    // 提交订单时是否使用抽盒金抵扣
    isDeductNum:1
  },
  useBlindboxMoneyFun(){
    this.setData({
      isUseBlindboxMoney:!this.data.isUseBlindboxMoney,
    })
    this.amountcalculation();
    this.setData({
      isDeductNum:this.data.isUseBlindboxMoney?1:0
    })
  },
  addresssefmcancel: function () {
    this.setData({ addressefm: false })
  },
  diaplayaddressefm: function () {
    // this.setData({ addressefm: true });
    this.placeorder();
  },
  // input 值改变
  inputChange: function(e) {
    this.setData({
      inputdata: e.detail.value
    });
  },
  wholefun: function() {
    this.setData({
      inputdata: ''
    })
    // 获取list数据
    this.listdata(0);
  },
  // 搜索
  jumpsoousuo: function() {
    // 获取list数据
    this.listdata(0);
  },
  mtdlocationfun: function() {
    var _this = this;
    this.setData({
      mtdlocation: false
    });
    this.listdata(0);
    let pages = getCurrentPages();
    let prevpage = pages[pages.length - 2];
    if (prevpage) {
      wx.navigateBack();
    } else {
      wx.redirectTo({
        url: "/page/component/pages/myothertoydg/myothertoydg?ownerId=" + _this.data.uid
      });
    };
  },


  // 授权
  clicktga: function() {
    app.clicktga(2)
  },
  clicktganone: function() {
    this.setData({
      tgabox: false
    })
  },
  userInfoHandler: function(e) {
    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 确认授权用户统计
          app.clicktga(4);
          _this.setData({
            tgabox: false,
            signinlayer: true,
          });
          // '已经授权'
          _this.data.loginid = app.signindata.loginid,
            _this.data.openid = app.signindata.openid,
            _this.data.isNewer = app.signindata.isNewer;

          _this.setData({
            uid: app.signindata.uid,
            avatarUrl: app.signindata.avatarUrl,
            isProduce: app.signindata.isProduce,
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
    if (e.detail.detail.userInfo) {} else {
      app.clicktga(8) //用户按了拒绝按钮
    };
  },
  
  listdatafun:function(){
    if (this.data.islistdata){
      this.setData({
        islistdata: false
      });      
    }else{
      this.setData({
        islistdata: true
      });
    };
    if (this.data.listdata.length==0){
      this.getCartList("total");
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoadfun: function() {
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      isShareFun: app.signindata.isShareFun,
      defaultinformation:app.signindata.defaultinformation,
      blindboxMoney:app.signindata.blindboxMoney
    });
    if (this.data.but == 'cart') {
      this.listdatafun();
    } else {
      this.rolenamefun(0)
    };
    // _this.data.loginid = "2ac7b3a1d8c7f37ae3c8dd8071eff871";
    // _this.data.uid = "744";

    _this.getCartList("limit");
    // 购物车数量
    Dec.shopnum(_this,app.signindata.comurl);
    var qqq = Dec.Aese('operation=info&mod=info');
    // 调取晒单数量
    Dec.dryingSum(_this, app.signindata.clwcomurl);
    _this.nextpagediao()
    // 获取默认信息
    wx.request({
      url: app.signindata.comurl + 'general.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            defaultinformation: res.data.Info,
            wxnum: res.data.Info.cs.wxid || 'meichai666666',
          });
          app.signindata.defaultinformation = res.data.Info || '';
        };
      }
    });

  },
  rolenamefun:function(num){
    var _this = this;
    if (num == 0) {
      _this.data.page = 0;
      _this.setData({
        shopdetaillist: [],
        iftrnodata: false,
        shopdetail:'',
        shopimgtop:''
      });
    } else {
      var pagenum = parseInt(_this.data.page)
      _this.data.page = ++pagenum;
    };
    var urlname = encodeURIComponent(_this.data.name);
    console.log('mod=cabinet&operation=detailRole&roleName=' + urlname + '&pid=' + _this.data.page + '&goods_id='+_this.data.goods_id)
    var qqq = Dec.Aese('mod=cabinet&operation=detailRole&roleName=' + urlname + '&pid=' + _this.data.page + '&goods_id='+_this.data.goods_id);

    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        console.log('闲置购买数据=====',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh()
        if (res.data.ReturnCode == 200) {
          var shopdetaillist = res.data.List.goods||[];
          if (shopdetaillist.length!=0){
            if (num == 0) {
              _this.setData({
                shopdetaillist: shopdetaillist,
              });
            } else {
              var ltlist = _this.data.shopdetaillist.concat(shopdetaillist);
              _this.setData({
                shopdetaillist: ltlist,
              });
            };
          }else{
            app.showToastC('暂无更多数据');
          };
          if (num == 0){
            var shopdetail = '';
            if (res.data.Info) {
              shopdetail = res.data.Info.role || ''
            };
            _this.setData({
              shopdetail: shopdetail
            });
          };
          
        };
      }
    });
  },
  // 阻止蒙层冒泡
  preventD() {},
  onLoad: function(options) {
    
    // 购物车数据显示
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.data.goods_id = options.goods_id||'';
    _this.setData({
      drying_id: options.drying_id || '',
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      isShareFun: app.signindata.isShareFun,
      but: options.but||'cart',
      name:decodeURIComponent(options.name)||''
    });
    console.log(options,decodeURIComponent(options.name))
    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      _this.onLoadfun();
    }else{

      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // '已经授权'
            _this.data.loginid = app.signindata.loginid;
            _this.data.openid = app.signindata.openid;
            _this.setData({
              signinlayer: true,
              uid: app.signindata.uid,
              isProduce: app.signindata.isProduce,
              isShareFun: app.signindata.isShareFun
            });
            // 判断是否登录
            if (_this.data.loginid != '' && _this.data.uid != '') {
              _this.onLoadfun();
            } else {
              app.signin(_this)
            }
          } else {
            _this.onLoadfun();
            this.setData({
              signinlayer: false,
            })
          }
        }
      });
    };

  },
  listdata: function(num) {
    var _this = this;
    if (num == 0) {
      _this.data.page = 0;
      _this.setData({
        listdata: [],
        iftrnodata: false
      });
    } else {
      var pagenum = parseInt(_this.data.page)
      _this.data.page = ++pagenum;
    };
    var qqq = Dec.Aese('mod=cabinet&operation=consignmentList&pid=' + _this.data.page + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&Keyword=' + _this.data.inputdata);
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        _this.setData({
          iftrnodata: true
        });
        if (res.data.ReturnCode == 200) {
          var listdata = res.data.List || [];
          if (listdata.length != 0) {
            if (num == 0) {
              _this.setData({
                listdata: listdata
              });
            } else {
              var ltlist = _this.data.listdata.concat(listdata);
              _this.setData({
                listdata: ltlist
              });
            };
          } else {
            app.showToastC('暂无更多数据');
          };
          if (_this.data.inputdata == '') {
            _this.setData({
              searchorwhole: true
            })
          } else {
            _this.setData({
              searchorwhole: false
            })
          }

        };
      }
    });
  },

  getCartList: function(request) {
    var _this = this;
    if (request == "limit") {
      _this.setData({
        cartInfo: [],
        cartData: [],
        conut: 0,
        payprice:0,
      })
    } else {
      _this.setData({
        cartInfo: [],
        listdata: [],
        conut: 0,
        payprice: 0,
      })
    }
    // 发现详情
    var qqq = Dec.Aese('mod=cabinet&operation=showCartList' + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&request=' + request);
    console.log(app.signindata.comurl + 'toy.php?' +'mod=cabinet&operation=showCartList' + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&request=' + request)
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        wx.hideLoading();
        if (res.data.ReturnCode == "200") {
          _this.setData({
            deductRatio:res.data.Info.deduct.deductRatio,
            isDeduct:res.data.Info.deduct.isDeduct,
            isUseBlindboxMoney:res.data.Info.deduct.isDeduct?true:false,
            isDeductNum:res.data.Info.deduct.isDeduct&&_this.data.blindboxMoney!=0?1:0
          })
          
          if (request == "limit"){
            _this.setData({
              cartInfo: res.data.Info,
              cartData: res.data.List,
              conut: res.data.Info.count||0,
              payprice: res.data.Info.totalAmount,
            })
          }else{
            _this.setData({
              cartInfo: res.data.Info,
              listdata: res.data.List,
              conut: res.data.Info.count || 0,
              payprice: res.data.Info.totalAmount,
            })
          };
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.rolenamefun(0);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.rolenamefun(1);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(options) {
    var reshare = app.sharemc();
    return reshare
  },
  onShareTimeline:function(){
    var _this = this;
    return {
      title:_this.data.c_title || '潮玩社交平台',
      query:{
        drying_id: _this.data.drying_id || '',
        but: _this.data.but||'cart',
        name:_this.data.name||''
      }    
    }
  },
  dlfindfun: function() {
    wx.reLaunch({
      url: "/page/component/pages/dlfind/dlfind",
    })
  },
  // 导航跳转
  whomepage: function() {
    wx.reLaunch({
      url: "../../../../pages/index/index?judgeprof=2"
    })
  },
  wmy: function() {
    wx.reLaunch({
      url: "../../../../pages/wode/wode"
    });
  },
  wshoppingCart: function() {
    wx.reLaunch({
      url: "../../../../pages/shoppingCart/shoppingCart"
    });
  },

  imageLoadad:function(e){
    var $width = e.detail.width, //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;
    var viewHeight = 150, //设置图片显示宽度，
      viewWidth = 200 * ratio;
    if (viewWidth > 200) {
      viewWidth = 200;
    };
    this.setData({
      shopimgtop: viewWidth
    })
  },

  // 计算图片大小
  imageLoad: function(e) {
    var _this = this;
    var eve = e.currentTarget.dataset.eve || e.target.dataset.eve || 0;
    var ind = e.currentTarget.dataset.ind || e.target.dataset.ind || 0;
    var num = e.currentTarget.dataset.num || e.target.dataset.num || 0;
    var $width = e.detail.width, //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;
    if(eve==1){
      var viewHeight = 150, //设置图片显示宽度，
        viewWidth = 100 * ratio;
      var cartData = this.data.cartData || [];
      if (viewWidth > 100) {
        viewWidth = 100;
      };
      if (cartData[ind]) {
        if (cartData[ind].role && cartData[ind].role[num]){
          cartData[ind].role[num].width = viewWidth;
          _this.setData({
            cartData: cartData
          })
        };
      };
      
    }else if(eve==2){
      var viewHeight = 150, //设置图片显示宽度，
        viewWidth = 100 * ratio;
      var listdata = this.data.listdata || [];
      if (viewWidth > 100) {
        viewWidth = 100;
      };
      if (listdata[ind]) {
        if (listdata[ind].role && listdata[ind].role[num]) {
          listdata[ind].role[num].width = viewWidth;
          _this.setData({
            listdata: listdata
          });
        };
      };
    } else if (eve == 5) {
      var viewHeight = 150, //设置图片显示宽度，
        viewWidth = 100 * ratio;
      var shopdetaillist = this.data.shopdetaillist || [];
      if (viewWidth > 100) {
        viewWidth = 100;
      };
      if (shopdetaillist[ind]) {
        if (shopdetaillist[ind].role && shopdetaillist[ind].role[num]) {
          shopdetaillist[ind].role[num].width = viewWidth;
          _this.setData({
            shopdetaillist: shopdetaillist
          });
        };
      };
    }

  },

  owneridfun: function(event) {
    var id = event.currentTarget.dataset.ownerid || event.target.dataset.ownerid || '';
    var _this = this;
    wx.navigateTo({
      url: "/page/component/pages/myothertoydg/myothertoydg?ownerId=" + id,
    });
  },
  jumpsmokelist: function() {
    wx.navigateTo({
      url: "/pages/smokeboxlist/smokeboxlist"
    });
  },
  // 导航跳转 
  wnews: function() {
    var _this = this;
    // setTimeout(function() {
      // app.limitlottery(_this);
    // }, 100);
  },

  pullupsignin: function() {
    // // '没有授权'
    this.setData({
      tgabox: true
    });
  },


  // 购买

  deleteCartfun:function(w){
    var cart_id = w.currentTarget.dataset.cart_id || w.target.dataset.cart_id;
    this.deleteCart(cart_id)

  },

  deleteCart: function (cartid) {
    var _this = this;
    // 发现详情
    var qqq = Dec.Aese('mod=cabinet&operation=delCart' + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&cartId=' + cartid);
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.ReturnCode == "200") {
          app.showToastC('删除成功');
          setTimeout(function(){
            _this.getCartList("limit");
            _this.getCartList("total");
          },2000);
        } else {
          wx.hideLoading();
          app.showToastC(res.data.Msg);
        }
      },
      fail:function(){
        wx.hideLoading();
      }
    })
  },
  addCartdata:function(w){
    var groupIds = w.currentTarget.dataset.groupid || w.target.dataset.groupid;
    var toyIds = w.currentTarget.dataset.toyids || w.target.dataset.toyids;
    var toyType = w.currentTarget.dataset.toytype || w.target.dataset.toytype;
    var price = w.currentTarget.dataset.price || w.target.dataset.price;
    var ownerId = w.currentTarget.dataset.ownerid || w.target.dataset.ownerid;
    this.addCart(groupIds, toyIds, toyType, price, ownerId)
  },
  addCart: function (groupIds, toyIds, toyType, price, ownerId) {
    var _this = this;
    // 发现详情
    var qqq = Dec.Aese('mod=cabinet&operation=addCartInfo' + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&groupIds=' + groupIds + '&toyIds=' + toyIds + '&topType=' + toyType + '&price=' + price + '&ownerId=' + ownerId);
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.ReturnCode == "200") {
          app.showToastC('添加成功');
          setTimeout(function(){
            _this.getCartList("limit");
            _this.getCartList("total");
          },1500);
        } else {
          wx.hideLoading();
          app.showToastC(res.data.Msg);
        }
      },
      fail:function(){
        wx.hideLoading();
      }
    })
  },




  // 立即购买弹框
  dsbbbutclickt: function () {
    this.setData({
      tipbacktwo: true,
      buybombsimmediately: true,
      ishowwholebox: false,
    });
    this.amountcalculation()
  },

  tipbacktwo: function () {
    this.setData({
      tipbacktwo: false,
      buybombsimmediately: false,
      receivingaddress: false,
    });
  },

  // 收货地址弹框
  seladdressfun: function () {
    this.setData({
      receivingaddress: true,
      addressefm:false
    });
  },

  // 隐藏收货地址弹框
  receivingaddressfun: function () {
    this.setData({
      receivingaddress: false,
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
    var _this = this;
    wx.navigateTo({
      url: "/pages/newreceivingaddress/newreceivingaddress"
    })
  },
  // 阻止蒙层冒泡
  preventD() { },

  pricedetailc: function () { // 价格明细显示隐藏
    this.setData({
      pricedetailc: !this.data.pricedetailc
    })
  },

  // 金额计算
  amountcalculation: function () { // payprice 支付金额 
    var _this = this
    // 运费 
    var xianshi = '0.00';
    var freightiftr = '0.00';
    // 商品个数
    var mcnum = 1;
    if ((this.data.defaultinformation.carriage.free || "99") != '-1') {
      var tddefcarfr = parseFloat(this.data.defaultinformation.carriage.free || "99");
      if (mcnum >= parseFloat(this.data.defaultinformation.carriage.freeMCPieces)) {
        if (this.data.defaultinformation.carriage.freeMCPieces == 1) {
          freightiftr = 0;
          xianshi = '限时包邮';
        } else {
          freightiftr = 0;
          xianshi = '商品包邮';
        };
      } else if (_this.data.payprice >= tddefcarfr) {
        freightiftr = 0;
        xianshi = '满￥' + parseFloat(this.data.defaultinformation.carriage.free || "99").toFixed(2) + '包邮';
      } else {
        var tdzuncar = this.data.defaultinformation.carriage.d;
        xianshi = '￥' + parseFloat(tdzuncar).toFixed(2);
        freightiftr = (parseFloat(tdzuncar) + parseFloat(_this.data.payprice)).toFixed(2);
      };
    } else {
      var tdzuncar = this.data.defaultinformation.carriage.d;
      xianshi = '￥0.00';
      freightiftr = parseFloat(tdzuncar);
    };

    if(freightiftr>0){
      console.log()
      var payprice = parseFloat(_this.data.payprice) + parseFloat(_this.data.defaultinformation.carriage.d)
    }else{
      var payprice = _this.data.payprice;
    }

    let useblindAmountpayable = _this.data.blindboxMoney>(payprice.toFixed(2)*_this.data.deductRatio)?payprice.toFixed(2)*_this.data.deductRatio:_this.data.blindboxMoney;
    let amountpayable = _this.data.blindboxMoney!=0? _this.data.isDeduct? _this.data.isUseBlindboxMoney? (payprice.toFixed(2)-useblindAmountpayable).toFixed(2) :payprice.toFixed(2) :payprice.toFixed(2) :payprice.toFixed(2)
    console.log(amountpayable)

    this.setData({
      freight: xianshi,
      freightiftr: freightiftr,
      // originalAmountpayable:amountpayable,
      // 应付金额
      originalAmountpayable:amountpayable,
      // 使用抽盒金后应付金额
      useblindAmountpayable: parseFloat(useblindAmountpayable).toFixed(3).slice(0,-1),
    });
  },

  // 下一页返回调取
  nextpagediao: function () {
    var _this = this;
    //  调取收货地址
    var q = Dec.Aese('mod=address&operation=getlist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'user.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          var rdl = res.data.List;
          var tptipadi = '';
          var tptipadd = '';
          var tipnamephone = '';
          var isaddress = false;
          if (rdl.length != 0) {
            for (var i = 0; i < rdl.length; i++) {
              if (rdl[i].isdefault == 1) {
                rdl[i].checked = true;
                tptipadi = rdl[i].aid;
                tptipadd = rdl[i].address;
                tipnamephone = rdl[i].consignee + " " + rdl[i].phone;
                isaddress=true;
              } else {
                rdl[i].checked = false;
              }
            };
            _this.data.tipaid = tptipadi;
            _this.setData({
              addressdata: rdl,
              tipnamephone: tipnamephone,
              tipaddress: tptipadd,
              isaddress: isaddress
            })
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

  // 删除地址
  deladdress: function (event) {
    var _this = this;
    var dat = this.data.addressdata;
    var indid = event.target.dataset.ind;
    var num = '';
    for (var i = 0; i < dat.length; i++) {
      if (dat[i].aid == indid) {
        num = i;
      }
    };
    wx.showModal({
      content: '您确定要删除这个地址吗？',
      success: function (res) {
        if (res.confirm) {
          var q = Dec.Aese('mod=address&operation=delete&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + indid)
          wx.request({
            url: app.signindata.comurl + 'user.php' + q,
            method: 'GET',
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              if (res.data.ReturnCode == 200) {
                dat.splice(num, 1);
                _this.setData({
                  addressdata: dat
                });
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
      receivingaddress: false
    });
  },

  // 买家备注
  inputChange: function (e) {
    this.setData({
      desc: e.detail.value
    });
  },

  // 提交订单
  placeorder: function () {
    var _this = this;

    if (this.data.tipaid == '') {
      app.showToastC('请选择地址');
      return false;
    };

    wx.showLoading({
      title: '加载中',
    })
    var aid = _this.data.tipaid;

    // 提交订单蒙层
    _this.setData({
      suboformola: true,
    });
    var q = Dec.Aese('mod=cabinet&operation=cartPurchase&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + aid + '&desc=' + _this.data.desc+'&isDeduct='+_this.data.isDeductNum);
    console.log('mod=cabinet&operation=cartPurchase&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + aid + '&desc=' + _this.data.desc+'&isDeduct='+_this.data.isDeductNum)
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          _this.setData({
            cart_id: res.data.Info.cart_id,
            tipbacktwo: true,
            buybombsimmediately: true,
            receivingaddress: false,
          });
          _this.paymentmony()

        } else {
          // 提交订单蒙层
          _this.setData({
            suboformola: false
          });
          app.showToastC(res.data.Msg);
        };
      }
    })
  },

  // 微信支付
  paymentmony: function () {
    var _this = this;

    var q = Dec.Aese('mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + _this.data.cart_id + '&xcx=1' + '&openid=' + _this.data.openid)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          // 支付完成弹框显示数据
          var payinfo = res.data.Info;

          wx.requestPayment({
            'timeStamp': res.data.Info.timeStamp.toString(),
            'nonceStr': res.data.Info.nonceStr,
            'package': res.data.Info.package,
            'signType': 'MD5',
            'paySign': res.data.Info.paySign,
            'success': function (res) {

              _this.setData({
                tipbacktwo: false,
                buybombsimmediately: false,
                suboformola: false,
                desc: '',
                addressefm: false
              });
              app.showToastC('购买成功');
              setTimeout(function(){
                _this.getCartList("limit");
                _this.getCartList("total");
              },1500)

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
            'fail': function (res) {
              _this.getCartList("limit");
              _this.getCartList("total");
             },
            'complete': function (res) {
              _this.setData({
                tipbacktwo: false,
                buybombsimmediately: false,
                suboformola: false,
                desc: '',
                addressefm: false
              });
              // 订阅授权
              
            }
          })
        } else {
          // 提交订单蒙层
          _this.setData({
            suboformola: false
          });
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

  jumpmyo: function (w) {
    var ownerid = w.currentTarget.dataset.ownerid || w.target.dataset.ownerid;
    var _this = this;
    wx.navigateTo({
      url: "/page/component/pages/myothertoydg/myothertoydg?ownerId=" + ownerid
    });
  }




















})