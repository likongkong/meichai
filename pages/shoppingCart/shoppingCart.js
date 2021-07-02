var Dec = require('../../common/public.js');//aes加密解密js
var time = require('../../utils/util.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    totalMoney: 0,
    // 购物车数据  
    zunmdata: [], 
    //  全选
    zomiftr: false,
    //  购物车结算
    dsbbmoncom: false,
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
    // 适配苹果X
    isIphoneX: app.signindata.isIphoneX,      
    // 价钱符号
    munit: '￥',
    movies: [],
    // 拆单用户数据
    uinfodata: {},
    // 倒计时
    countdown: '',
    // 弹框背景
    tipback: false,
    // 订单弹框
    tipbox: false,
    // 拆单数量
    numberofdismantling: 1,
    // 拆单弹框显示隐藏
    dsbframeiftr: false,
    // 文体提示弹框
    textpbiftr: false,
    textpbiftrtext: '已成功加入购物车',
    // 价格明细显示隐藏
    pricedetailc: true,
    // 协议radio
    radioagreement: true,
    // 选择弹框
    buybombsimmediately: false,
    // 二级背景
    tipbacktwo: false,
    // 收货地址
    receivingaddress: false,
    // 优惠券弹框
    couponprojectile: false,
    // 兑换input值
    coupondata: '',
    gid: '',
    // 评论数据
    allcomlist: [],
    // 收货地址数据
    addressdata: [],
    // 收货地址显示 请选择收货地址
    tipaddress: '请选择收货地址',
    tipaid: '',
    // 弹框优惠券 请选择优惠券
    tipcoupon: '请选择优惠券',
    // 颜色id
    colorid: '',
    // 颜色id
    sizeid: '',
    //  优惠券 运费卷
    coudata1: [],
    coudata1cid: '',
    coudata1mon: '0.00',
    // 代金券
    coudata2: [],
    coudata2cid: '',
    coudata2mon: '0.00',
    // 优惠券 1正常优惠券 2折扣券
    coupon_type: 1,
    coudata2mondiscount: '0.00',
    // 公共默认信息
    defaultinformation: app.signindata.defaultinformation,
    // 后台返回总价格
    payment: '',
    // 支付弹框
    paymentiftr: false,
    // 应付金额
    amountpayable: '0.00',
    // 运费
    freight: '￥0.00',
    // 运费判断关于运费券
    freightiftr: '0.00',
    // 商品价格
    commodityprice: 0,
    // 税费
    taxation: 0,
    //  支付 id
    cart_id: '',
    // 支付完成赠送卷
    paycheadwsong: '',
    // 分享图片地址
    paycheadwsongimg: '',
    // 判断是否支付完成
    payiftr: false,
    // 分享
    title: '',
    // 授权弹框
    tgabox: false,
    // 支付完成后分享数据
    gidiftr: '',
    paycheadwsongimgiftr: '',
    titleiftr: '',
    // 买家备注
    desc: '',
    // 购物车列表分页
    page: 0,
    // 定时提交数据
    setint: '',
    iftrsetint: 0,
    // 购物车提示语
    shopcptxt: '',
    // 身份证号弹框判断
    idnumberboxiftr: false,
    // 真实姓名
    inputnamedata: '',
    // 身份证号
    inputidnumberdata: '',
    // 第一次加载不显示暂无数据
    nodataiftr: false,
    // 点击请求判断防止多次提交
    clicktherequestiftr: true,
    // 红条提示跳转数据
    rdjump: '',
    // 微信号码
    wxnum: 'meichai666666',
    // 支付完成显示分类跳转数据
    shareinfo: '',
    // 显示购物车数量
    shopnum: 0,
    //  店铺购物车是否显示导航栏
    navigationiftr: 0,
    temporary_store_id: 0,
    // 底部弹框列表
    bulletlist:[],
    // 判断底部列表是否显示
    iftrBotShopList:false,
    recommandPage:-1,
    // 推荐数据
    recommand:[],
    // 提交蒙层
    upMongolia:false,
    // 不可用优惠券
    unavailablearr: [],
    // 晒单数量
    dryinglistnum: 0,
    isProduce: app.signindata.isProduce,
    spreadEntry: app.signindata.spreadEntry,
    // 领奖列表
    raplist:[],
    timer:'',
    awatxt:'',
    // 顶部倒计时
    overtimetop:'',
    toptimer:'',
    wintheprtinterval:'',
    comtopcounttime:'',
    awardpresentation:false,
    goodsDiscount:'',//立减金额
    awardOrderId:'',//立减需要传后端的字段
    relGidTips:'',
    // 底部提示
    msgBigShot:'',
    c_title: '购物车',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    // 是否显示提示弹框
    buySthToCabinet: false,
    // 是否是地域黑用户  false不是地狱拉黑用户 true是地狱拉黑用户
    isHellBlackUser: false,
    // 购物车数据是传这个字段 1为加入玩具柜 0反之
    isAddToyCabinet: 0,
    // 是否显示弹框
    ishelladdtoy: false,
    isDisplayBlock:true,
    // 是否授权
    signinlayer: true,
    windowHeight: app.signindata.windowHeight - 65 - wx.getStorageSync('statusBarHeightMc') || 0,
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
    this.setData({
      amountpayable:this.data.isUseBlindboxMoney? (this.data.originalAmountpayable-this.data.useblindAmountpayable).toFixed(2):this.data.originalAmountpayable,
      isDeductNum:this.data.isUseBlindboxMoney?1:0
    })
  },
  topcabinetordelgoods: function (w) {
    var num = w.currentTarget.dataset.num || w.target.dataset.num || 0;
    this.data.isAddToyCabinet = num;
    this.setData({
      ishelladdtoy: false,
      isDisplayBlock:false
    });
    this.shoppingcartlist(1);
  },


  topcountdown: function () {
    var _this = this;
    clearInterval(_this.data.toptimer);
    var raplist = _this.data.overtimetop || '';
    var comtopcounttime = this.data.comtopcounttime || {};
    function nowTime() {
      var iftrtopcount = false;
      // 获取现在的时间
      var nowTime = new Date().getTime();
      var lastTime = raplist * 1000;
      var differ_time = lastTime - nowTime;
      if (differ_time >= 0) {
        var differ_day = Math.floor(differ_time / (3600 * 24 * 1e3));
        var differ_hour = Math.floor(differ_time % (3600 * 1e3 * 24) / (1e3 * 60 * 60));
        var differ_minute = Math.floor(differ_time % (3600 * 1e3) / (1000 * 60));
        var s = Math.floor(differ_time % (3600 * 1e3) % (1000 * 60) / 1000);
        var ms = Math.floor(differ_time % 1000 / 100);
        if (differ_day.toString().length < 2) { differ_day = "0" + differ_day; };
        if (differ_hour.toString().length < 2) { differ_hour = "0" + differ_hour; };
        if (differ_minute.toString().length < 2) { differ_minute = "0" + differ_minute; };
        if (s.toString().length < 2) { s = "0" + s; };
        comtopcounttime.day = differ_day;
        comtopcounttime.hour = differ_hour;
        comtopcounttime.minute = differ_minute;
        comtopcounttime.second = s;
        comtopcounttime.ms = ms;
      } else {
        comtopcounttime.day = '00';
        comtopcounttime.hour = '00';
        comtopcounttime.minute = '00';
        comtopcounttime.second = '00';
        comtopcounttime.ms = '0';
        iftrtopcount = true;
      };
      _this.setData({
        comtopcounttime: comtopcounttime
      });
      if (iftrtopcount) {
        clearInterval(_this.data.toptimer);
        _this.setData({ overtimetop: '' });
      };
    };
    if (_this.data.overtimetop != '') {
      nowTime();
      clearInterval(_this.data.toptimer);
      _this.data.toptimer = setInterval(nowTime, 1000);
    };
  },

  // 倒计时
  countdownbfun: function () {
    var _this = this;
    clearInterval(_this.data.timer);
    var raplist = _this.data.raplist||[];
    var len = raplist.length;
    function nowTime() {
      var iftrins = true;
      // 获取现在的时间
      var nowTime = new Date().getTime();
      for (var i = 0; i < len; i++) {
          var lastTime = raplist[i].overtime * 1000;
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
        raplist: raplist
      });
      if (iftrins) {
        clearInterval(_this.data.timer);
      };
    }
    if (_this.data.raplist.length != 0) {
      nowTime();
      clearInterval(_this.data.timer);
      _this.data.timer= setInterval(nowTime, 1000);
    };
  },



  // 支付完成弹框隐藏弹框
  paymentcompletionwimg: function () {
    var _this = this;
    this.setData({
      tipback: false,
      payiftr: false
    });
  },
  // 查看订单
  viewtheorder: function () {
    wx.navigateTo({
      url: "/pages/myorder/myorder?tabnum=0"
    });
    this.paymentcompletionwimg();
  },

  // 跳转详情页 
  addressmanagement: function (event) {
    var gid = event.currentTarget.dataset.gid || event.target.dataset.gid;
    var is_store = event.currentTarget.dataset.is_store || event.target.dataset.is_store;
    var store_id = event.currentTarget.dataset.store_id || event.target.dataset.store_id;
    wx.navigateTo({
      url: "/pages/detailspage/detailspage?gid=" + gid
    })

  },
  /**
   * 合计总数钱触发函数
   */
  // 选中切换
  iftrcheck: function (w) {
    var _this = this;
    var ind = w.target.dataset.index || w.currentTarget.dataset.index;
    var cart_id = w.target.dataset.cart_id || w.currentTarget.dataset.cart_id;
    var temdata = this.data.zunmdata;

    temdata[ind].iftrcheck = !temdata[ind].iftrcheck
    this.setData({
      zunmdata: temdata
    });
    // 判断全选和结算
    var zomtemdata = _this.data.zunmdata;
    var iftr = true;
    var moniftr = false;
    for (var i = 0; i < zomtemdata.length; i++) {
      if (!zomtemdata[i].iftrcheck) {
        iftr = false;
      };
      if (zomtemdata[i].iftrcheck) {
        moniftr = true;
      };
    };
    
    _this.setData({
      zomiftr: iftr,
      dsbbmoncom: moniftr
    });
    _this.totalMoneyEvent();
    //  每隔一段时间提交数据
    _this.jumpaddupdata(3);

  },
  // 全选
  zomiftrcheck: function () {
    var _this = this;
    var zomtemdata = this.data.zunmdata;
    for (var i = 0; i < zomtemdata.length; i++) {
      if (zomtemdata[i].stock < zomtemdata[i].numberofdismantling) {
        zomtemdata[i].iftrcheck = false
      } else {
        zomtemdata[i].iftrcheck = !this.data.zomiftr;
      }
    };
    if (zomtemdata.length != 0) {
      this.setData({
        zomiftr: !this.data.zomiftr,
        dsbbmoncom: !this.data.zomiftr,
        zunmdata: zomtemdata
      });
    } else {
      this.setData({
        zomiftr: !this.data.zomiftr,
        dsbbmoncom: false,
        zunmdata: zomtemdata
      });
    };
    this.totalMoneyEvent();

    _this.jumpaddupdata(3);
  },
  // 全选金额计算 
  totalMoneyEvent: function () {
    var _this = this;
    let zunmdata = this.data.zunmdata;
    let len = zunmdata.length;
    let taxation = 0;
    let totalMoney = 0;
    var stornum=0;
    var mcnum = 0;
    for (let i = 0; i < len; i++) {
      if (zunmdata[i].iftrcheck) {
        totalMoney += parseFloat(zunmdata[i].gsale) * parseFloat(zunmdata[i].numberofdismantling);
        if (zunmdata[i].is_tax == 1) {
          taxation += parseFloat(zunmdata[i].tax || 0) * parseFloat(zunmdata[i].numberofdismantling);
        };
        if (zunmdata[i].is_store == 1) {
          stornum += parseInt(zunmdata[i].numberofdismantling);
        };
        if (zunmdata[i].is_store == 0) {
          mcnum += parseInt(zunmdata[i].numberofdismantling);
        };        
      }
    };
    var iftrcommon = parseFloat(totalMoney);
    if (this.data.defaultinformation){
      var freeForPieces = typeof (this.data.defaultinformation.carriage.freeForPieces) != "undefined" ? this.data.defaultinformation.carriage.freeForPieces : 10;
      var freeMCPieces = this.data.defaultinformation.carriage.freeMCPieces;
    } else{
      var freeForPieces = 10;
      var freeMCPieces = 10;
    }
    
    if (iftrcommon == 0 || iftrcommon == '0.00') {
      var iftrcomtxt = '';
    } else if (stornum >= parseFloat(freeForPieces)) {
      var iftrcomtxt = '已满足包邮条件，快去结算吧。';
      _this.setData({ iftrBotShopList: false });
    } else if (typeof (freeMCPieces) != "undefined" && mcnum >= parseFloat(freeMCPieces)) {
      var iftrcomtxt = '已满足包邮条件，快去结算吧。';
      _this.setData({ iftrBotShopList: false });
    } else if (iftrcommon < parseFloat(_this.data.defaultinformation.carriage.free)) {
      var chja = parseFloat(_this.data.defaultinformation.carriage.free) - iftrcommon;
      var iftrcomtxt = '还差￥' + chja.toFixed(2) + '享包邮，凑几片面膜抵邮费>>'; 
    } else if (iftrcommon >= parseFloat(_this.data.defaultinformation.carriage.free)) {
      var iftrcomtxt = '已满足包邮条件，快去结算吧。';
      _this.setData({ iftrBotShopList: false });
    };

    this.setData({
      totalMoney: totalMoney.toFixed(2),
      taxation: taxation.toFixed(2),
      shopcptxt: iftrcomtxt
    });
  },
  /**
   * 删除某个数据触发函数
   */
  deleteData: function (currentTarget) {
    var _this = this; 
    var index = currentTarget.currentTarget.dataset.index || currentTarget.target.dataset.index;
    var cart_id = currentTarget.currentTarget.dataset.cart_id || currentTarget.target.dataset.cart_id;
    var store_id = currentTarget.currentTarget.dataset.store_id || currentTarget.target.dataset.store_id;
    var qformid = Dec.Aese('mod=cart&operation=del&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&count=1' + '&cart_id=' + cart_id + '&store_id=' + store_id);
    _this.setData({ upMongolia:true});
    wx.request({
      url: app.signindata.comurl + 'goods.php' + qformid,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          app.showToastC('删除成功');
          _this.data.zunmdata.splice(index, 1);
          _this.setData({
            zunmdata: _this.data.zunmdata
          })
          var dsbbmoncom = _this.data.zunmdata.length === 0 ? false : true;
          _this.setData({
            dsbbmoncom: dsbbmoncom
          });
          _this.shoppingcartlist(1);
          // 购物车数据显示
          Dec.shopnum(_this,app.signindata.comurl);
        } else if (res.data.ReturnCode == 825) {
          app.showToastC('用户id和购物车信息id不匹配');
        } else if (res.data.ReturnCode == 826) {
          app.showToastC('cart_id个数和count不匹配');
        } else if (res.data.ReturnCode == 900) {
          app.showToastC('登陆状态有误');
        };
        _this.setData({ upMongolia: false });
      },
      fail: function () { }
    });

  },
  /** 
   * 增加数量触发函数
   */
  addEvent: function (target) {
    var _this = this;
    var index = target.currentTarget.dataset.add || target.target.dataset.add||0;
    var stock = parseFloat(this.data.zunmdata[index].stock)||1;
    if ((parseFloat(this.data.zunmdata[index].numberofdismantling) + 1) > stock){
      app.showToastC('商品库存不足');
      return false;
    };
    this.data.zunmdata[index].numberofdismantling = parseFloat(this.data.zunmdata[index].numberofdismantling) + 1;
    this.data.zunmdata[index].iftrcheck = true;
    if (this.data.zunmdata[index].numberofdismantling > 1) {
      this.data.zunmdata[index].color = "#000";
    };
    var groupData = _this.data.zunmdata[index].groupData;
    if (groupData){
      if (groupData.goodsList.length==1){
        if (groupData.goodsList[0].goods_id == this.data.zunmdata[index].goods_id){
          if (groupData.goodsList[0].num <= this.data.zunmdata[index].numberofdismantling){
            _this.data.zunmdata[index].groupData.goodsList=[];
          };
        };
      };
    };
    
    var shopnum = parseFloat(_this.data.shopnum) + 1;
   
    this.setData({
      zunmdata: this.data.zunmdata,
    })
    // 计算总金额 
    this.totalMoneyEvent();
    //  每隔一段时间提交数据
    _this.jumpaddupdata(3);
    _this.setData({
      // iftrsetint: 1,
      shopnum: shopnum
    });
  },
  /**
   * 减少数量触发函数
   */
  reduceEvent: function (target) {
    var _this = this;
    var index = target.currentTarget.dataset.reduce || target.target.dataset.reduce||0;
    if (this.data.zunmdata[index].numberofdismantling <= 1) {
      this.data.zunmdata[index].color = "#a8a8a8";
      this.setData({
        zunmdata: this.data.zunmdata
      })
      return false;
    };
    this.data.zunmdata[index].numberofdismantling = this.data.zunmdata[index].numberofdismantling - 1;
    this.data.zunmdata[index].iftrcheck = true;
    var shopnum = parseFloat(_this.data.shopnum) - 1;

    var groupData = _this.data.zunmdata[index].groupData;
    if (groupData) {
      if (groupData.goodsList.length == 0) {
        var groupDataRec = _this.data.zunmdata[index].groupDataRec
        if (groupDataRec){
          if (groupDataRec.goods_id == this.data.zunmdata[index].goods_id) {
            if (groupDataRec.num > this.data.zunmdata[index].numberofdismantling) {
              _this.data.zunmdata[index].groupData.goodsList.push(groupDataRec);
            };
          };
        };
      };
    };


    this.setData({
      zunmdata: this.data.zunmdata,
    });
    this.totalMoneyEvent();
    //  每隔一段时间提交数据
    _this.jumpaddupdata(3);
    _this.setData({
      shopnum: shopnum
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 调取购物车列表
  shoppingcartlist: function (num) {
    var _this = this;
    var iftrcom = true;
    if (num == 1) {
      _this.data.page = 0;
      this.setData({
        recommand: [],
        zunmdata: []
      });
      this.data.recommandPage = -1;
      clearInterval(this.data.timer);
      clearInterval(this.data.toptimer);
    }else{
      _this.data.page = ++this.data.page;
      wx.showLoading({ title: '加载中...', })
    }; 
    
    if (_this.data.recommandPage==-1){
      var qformid = Dec.Aese('mod=cart&operation=list&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&page=' + _this.data.page + '&store_id=' + _this.data.store_id + '&isAddToyCabinet=' + _this.data.isAddToyCabinet);
    }else{
      var qformid = Dec.Aese('mod=cart&operation=list&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&page=' + _this.data.page + '&store_id=' + _this.data.store_id + '&recommandPage=' + _this.data.recommandPage + '&isAddToyCabinet=' + _this.data.isAddToyCabinet);
    };
    wx.request({
      url: app.signindata.comurl + 'goods.php' + qformid,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('购物车数据',res)
        // 刷新完自带加载样式回去
        _this.setData({
          nodataiftr: true,
        });
        wx.hideLoading()
        _this.data.clicktherequestiftr = true;// 多次提交判断
        wx.stopPullDownRefresh();
        // 购物车数据显示
        Dec.shopnum(_this,app.signindata.comurl); 
        var iftrdsbbmoncom = false;
        if (res.data.ReturnCode == 200) {
          var rdw = res.data.list.cart || [];
          var rdwGruop = res.data.list.group || '';
          var deduct = res.data.Info.deduct || '';

          // 领奖商品
          if (num==1){
            if (_this.data.raplist&&_this.data.raplist.length != 0 && res.data.list.awardOrder&& res.data.list.awardOrder.length==0){
                _this.data.uid='';
                _this.data.loginid='';
                app.signindata.loginid = '';
                app.signindata.uid = '';
                _this.onShow();
            };
          };

          var raplist = res.data.list.awardOrder || [];
          var raplistiftr = res.data.list.relOidRebate || {};
          if (res.data.list.awardOrder){
            if (raplist && raplist.length != 0) {
              for (var ra = 0; ra < raplist.length; ra++) {
                if (raplistiftr[raplist[ra].order_id]) {
                  raplist[ra].isFinished = raplistiftr[raplist[ra].order_id].isFinished;
                  if (raplist[ra].order_type!=2){
                    raplist[ra].readyAward = raplistiftr[raplist[ra].order_id].isFinished;
                  };
                }else{
                  raplist[ra].isFinished = false;
                };
              }
            };
          };
          _this.setData({
            raplist: raplist,
            relGidTips: res.data.list.relGidTips,
          });
          if (_this.data.raplist.length != 0) {
            _this.countdownbfun();
          };

          if (_this.data.page==0){

            var awatxt = res.data.Info.notice || '';
            var overtimetop = res.data.Info.overtime || '';
            var rdjump = res.data.Info.category_info||{};
            var msgBigShot = res.data.Info.msgBigShot ||'';
            _this.setData({
              awatxt: awatxt,
              overtimetop: overtimetop,
              rdjump: rdjump,
              msgBigShot: msgBigShot
            });
            if (overtimetop) {
              clearInterval(_this.data.toptimer);
              _this.topcountdown()
            };

            if (res.data.list.default){
              if (res.data.list.default.list){
                var defaultList = res.data.list.default.list||[];
                _this.setData({
                  bulletlist: defaultList
                });
              };
            };
          };
          var goodsDiscount = res.data.Info.goodsDiscount || 0;
          var awardOrderId = res.data.Info.awardOrderId || '';
          _this.setData({
            goodsDiscount: goodsDiscount,
            awardOrderId: awardOrderId,
          })
          
          var relationprice = res.data.list.relationPrice||{};
          var relGidTips = res.data.list.relGidTips||{};
          if (rdw) {
            if (rdw.length != 0) {
              for (var i = 0; i < rdw.length; i++) {
                rdw[i].numberofdismantling = parseInt(rdw[i].count);
                rdw[i].gid = rdw[i].goods_id;
                rdw[i].gsale = parseFloat(rdw[i].gsale).toFixed(2);

                if (parseInt(rdw[i].count) > rdw[i].stock){
                  rdw[i].iftrcheck = false;
                }else{
                  if (rdw[i].selected == 1) {
                    rdw[i].iftrcheck = true;
                  } else {
                    rdw[i].iftrcheck = false;
                  };
                };
                rdw[i].groupData = rdwGruop[rdw[i].displayGroupId]||'';
                if (rdwGruop[rdw[i].displayGroupId]){
                  if (rdwGruop[rdw[i].displayGroupId].goodsList){
                    if (rdwGruop[rdw[i].displayGroupId].goodsList[0]){
                      rdw[i].groupDataRec = rdwGruop[rdw[i].displayGroupId].goodsList[0] || '';
                    };
                  };
                };
                if (relationprice[rdw[i].cart_id]){
                  rdw[i].gsale = relationprice[rdw[i].cart_id].discountPrice;
                };
                if (relGidTips[rdw[i].goods_id]) {
                    rdw[i].relGidTips = relGidTips[rdw[i].goods_id] || '';
                  rdw[i].dipsCount = parseInt(rdw[i].count)+1;
                  };
              };
            } else {
              app.showToastC('暂无更多数据');
            };
          };
          if (num == 1) {
            var comdataarr = rdw;
          } else {
            var comdataarr = _this.data.zunmdata.concat(rdw);
          }
          for (var j = 0; j < comdataarr.length; j++) {
            if (comdataarr[j].iftrcheck) {
              iftrdsbbmoncom = true;
            } else {
              iftrcom = false;
            }
          };

          _this.setData({
            zunmdata: comdataarr,
            zomiftr: iftrcom,
            dsbbmoncom: iftrdsbbmoncom
          });

          if (_this.data.recommand.length == 0) {
            var rdwrecommand = res.data.list.recommand || [];
            _this.data.recommandPage = _this.data.page;
            _this.setData({
              recommand: rdwrecommand
            });
          } else {
            var rdwrecommand = res.data.list.recommand || [];
            var abclist = _this.data.recommand.concat(rdwrecommand);
            _this.setData({
              recommand: abclist
            });
          };
          _this.setData({
            deductRatio:deduct.deductRatio,
            isDeduct:deduct.isDeduct,
            isUseBlindboxMoney:deduct.isDeduct?true:false,
            isDeductNum:deduct.isDeduct&&_this.data.blindboxMoney!=0?1:0
          })
          // 计算金额
          _this.totalMoneyEvent();
        } else if (res.data.ReturnCode == 300) {

          if (_this.data.recommand.length==0){
            var rdwrecommand = res.data.List.recommand || [];
            _this.data.recommandPage = _this.data.page;
            _this.setData({
              recommand:rdwrecommand
            });
          }else{
            var rdwrecommand = res.data.List.recommand || [];
            var abclist = _this.data.recommand.concat(rdwrecommand);
            _this.setData({
              recommand: abclist
            });
          };
          // 领奖商品
          if (num == 1) {
            if (_this.data.raplist && _this.data.raplist.length != 0 && res.data.List.awardOrder && res.data.List.awardOrder.length == 0) {
              _this.data.uid = '';
              _this.data.loginid = '';
              app.signindata.loginid = '';
              app.signindata.uid = '';
              _this.onShow();
            };
          };
          
          var raplist = res.data.List.awardOrder || [];
          if (res.data.List.awardOrder){
            // 领奖商品
            var raplistiftr = res.data.List.relOidRebate || {};
            if (raplist && raplist.length != 0) {
              for (var ra = 0; ra < raplist.length; ra++) {
                if (raplistiftr[raplist[ra].order_id]) {
                  raplist[ra].isFinished = raplistiftr[raplist[ra].order_id].isFinished;
                  if (raplist[ra].order_type != 2) {
                    raplist[ra].readyAward = raplistiftr[raplist[ra].order_id].isFinished;
                  };
                } else {
                  raplist[ra].isFinished = false;
                };
              }
            };
          };
          _this.setData({
            raplist: raplist
          });
          if (_this.data.raplist.length != 0) {
            _this.countdownbfun();
          };

          if (_this.data.page==0){
            var raplist = _this.data.raplist;
            var iftrdsbbmoncom = false;
            _this.setData({
              zunmdata: [],
              dsbbmoncom: iftrdsbbmoncom,
              zomiftr: false,
              totalMoney: '0.00',
              taxation: '0.00',
            });
            if (res.data.Info){
              var msgBigShot = res.data.Info.msgBigShot || '';
              _this.setData({ msgBigShot: msgBigShot});
              var overtimetop = res.data.Info.overtime || '';
              if (overtimetop) {
                _this.setData({
                  overtimetop: overtimetop
                });
                clearInterval(_this.data.toptimer);
                _this.topcountdown()
              };
              var awatxt = res.data.Info.notice || '';
              if (awatxt) {
                _this.setData({
                  awatxt: awatxt
                });
              };
            };

          };
          var goodsDiscount = res.data.Info.goodsDiscount || 0;
          var awardOrderId = res.data.Info.awardOrderId || '';
          _this.setData({
            goodsDiscount: goodsDiscount,
            awardOrderId: awardOrderId,
          })

        } else if (res.data.ReturnCode == 900) {
          app.showToastC('登陆状态有误');
        };
      },
      fail: function () { }
    });
  },
  onLoadfun: function () {
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      store_id: app.signindata.store_id || 0,
      isProduce: app.signindata.isProduce,
      spreadEntry: app.signindata.spreadEntry,
      // 公共默认信息
      defaultinformation: app.signindata.defaultinformation,
      isHellBlackUser: app.signindata.isHellBlackUser,
      raplist:[],
      blindboxMoney:app.signindata.blindboxMoney
    });
    // 判断是在哪个店
    if (_this.data.temporary_store_id == _this.data.uid) {
      // 自己的店
    } else {
      // 别人的店
      _this.setData({
        store_id: _this.data.temporary_store_id
      });
    };

    setTimeout(function(){
      _this.otherdata();
    },1000);

    _this.setData({ isAwardOrder: app.signindata.isAwardOrder, awardOrder: app.signindata.awardOrder || false });
    clearInterval(_this.data.wintheprtinterval);
    if (app.signindata.isAwardOrder) {
      app.winningtheprizetime(_this);
    };
    // 获取默认信息
    if (this.data.isDisplayBlock){
      var qq = Dec.Aese('operation=info&mod=info')
      wx.request({
        url: app.signindata.comurl + 'general.php' + qq,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {
          if (res.data.ReturnCode == 200) {
            _this.setData({
              defaultinformation: res.data.Info,
              wxnum: res.data.Info.cs.wxid || 'meichai666666',
              buySthToCabinet: res.data.Info.function.buySthToCabinet || false //是否显示提示弹框
            });
            if (res.data.Info.function.buySthToCabinet && !app.signindata.isHellBlackUser) {
              var istip = Dec.Aese('mod=cart&operation=showprizenumber&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
              wx.request({
                url: app.signindata.comurl + 'goods.php' + istip,
                method: 'GET',
                header: { 'Accept': 'application/json' },
                success: function (res) {
                  var ishelladdtoy = res.data.Info.isOpenable || false;
                  if (!ishelladdtoy) {
                    // 获取购物车列表
                    _this.shoppingcartlist(1);
                    _this.setData({ isDisplayBlock: false })
                  };
                  _this.setData({
                    ishelladdtoy: ishelladdtoy
                  })
                }
              });
            } else {
              // 获取购物车列表
              _this.shoppingcartlist(1);
              _this.setData({ isDisplayBlock:false})
            };
            _this.totalMoneyEvent();
            app.signindata.defaultinformation = res.data.Info || '';
          };
          // 判断非200和登录
          Dec.comiftrsign(_this, res, app);
        }
      });
    }else{
      // 获取购物车列表
      _this.shoppingcartlist(1);
      _this.setData({ isDisplayBlock: false })      
    };

  },

  jumporder: function () {
    var _this = this;
    app.jumporder(_this);
  },
  
  otherdata:function(){
    var _this = this;

    _this.nextpagediao();
    // 调取晒单数量
    Dec.dryingSum(_this, app.signindata.clwcomurl);
  },
  onLoad: function (options) {
    this.setData({
      navigationiftr: options.ng || 0,
      temporary_store_id: options.store_id || 0,
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      store_id: app.signindata.store_id || 0,
      isProduce: app.signindata.isProduce,
      spreadEntry: app.signindata.spreadEntry, 
      isHellBlackUser: app.signindata.isHellBlackUser,   
    });

  },
  // 授权点击统计
  clicktga: function () {
    app.clicktga(2)
  },
  // 调取收货地址
  nextpagediao: function () {
    var _this = this;
    //  调取收货地址
    var q = Dec.Aese('mod=address&operation=getlist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'user.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
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
            _this.data.tipaid=tptipadi;
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.totalMoneyEvent();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      // _this.shoppingcartlist(1);
      _this.onLoadfun();
      return false;
    };
    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      _this.onLoadfun();
    }else{
      wx.getSetting({
        success: res => {
          if (true) {
            // '已经授权'
            _this.setData({
              loginid: app.signindata.loginid,
              uid: app.signindata.uid,
              openid: app.signindata.openid,
              store_id: app.signindata.store_id || 0,
              isProduce: app.signindata.isProduce,
              spreadEntry: app.signindata.spreadEntry,
              signinlayer: true,
              tgabox: false,
              raplist:[]
            }); 
            // 判断是否登录
            if (_this.data.loginid != '' && _this.data.uid != '') {
              _this.onLoadfun();
            } else {
              app.signin(_this)
            }
          } else {
            app.userstatistics(3);
            // '没有授权'
            _this.setData({
              tgabox: false,
              signinlayer: false
            });

          }
        }
      });
    };
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.timer);
    clearInterval(this.data.toptimer);
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer);
    clearInterval(this.data.toptimer);
  },
  // 监听页面跳转提交数据
  jumpaddupdata: function (num) {
    var _this = this;
    var combarr = _this.data.zunmdata || [];
    var adtocar = [];
    if (combarr.length != 0) {
      for (var i = 0; i < combarr.length; i++) {
        if (combarr[i].iftrcheck) {
          adtocar.push({ 'cart_id': combarr[i].cart_id, 'count': combarr[i].numberofdismantling, 'selected': 1, 'store_id': combarr[i].store_id })
        } else {
          adtocar.push({ 'cart_id': combarr[i].cart_id, 'count': combarr[i].numberofdismantling, 'selected': 0, 'store_id': combarr[i].store_id  })
        };
      };
    };
    var adtocarleng = adtocar.length;
    adtocar = JSON.stringify(adtocar);
    var qformid = Dec.Aese('mod=cart&operation=adjustforbatch&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&count=' + adtocarleng + '&info=' + adtocar);
    _this.setData({ upMongolia:true});
    wx.request({
      url: app.signindata.comurl + 'goods.php' + qformid,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        _this.setData({ upMongolia: false });
        if (num == 1) {
          if (res.data.ReturnCode == 200) {
            // 购物车数据显示
            Dec.shopnum(_this,app.signindata.comurl);
          } else if (res.data.ReturnCode == 805) {
            app.showToastC('没有足够库存');
          } else if (res.data.ReturnCode == 825) {
            app.showToastC('用户id和购物车信息id不匹配');
          } else if (res.data.ReturnCode == 201) {
            app.showToastC('异常情况 修改失败');
          } else if (res.data.ReturnCode == 900) {
            app.showToastC('登陆状态有误');
          }
        };
        if (num == 3){
          _this.shoppingcartlist(1);
        };
      },
      fail: function () { }
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 调取数据
    this.shoppingcartlist(1);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.shoppingcartlist(2);
  },
  /**
   * 用户点击右上角分享
   */
  onShareTimeline:function(){
    var _this = this;
    return {
      title:_this.data.c_title || '潮玩社交平台',
      query:{}
    }
  },
  onShareAppMessage: function () {
    var _this = this;
    if (_this.data.payiftr) {
      if (_this.data.title != '') {
        var title = _this.data.titleiftr;
      } else {
        var title = '美拆'
      };
      var shareimg = _this.data.paycheadwsongimgiftr;
      var gid = _this.data.gidiftr;
      var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
      if (!reg.test(shareimg)) {
        shareimg = _this.data.zdyurl + shareimg;
      };
      _this.paymentcompletionwimg();
      var reshare = {
        title: title,  // 转发标题（默认：当前小程序名称）
        path: '/pages/detailspage/detailspage?gid=' + gid + '&store_id=0',
        imageUrl: shareimg,
        success: function (res) {},
      }
    } else {
      if (_this.data.title != '') {
        var title = _this.data.title;
      } else {
        var title = '美拆'
      };
      var shareimg = _this.data.paycheadwsongimg;
      var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
      if (!reg.test(shareimg)) {
        shareimg = _this.data.zdyurl + shareimg;
      };
      var reshare = {
        title: title,  // 转发标题（默认：当前小程序名称）
        path: '/pages/detailspage/detailspage?gid=' + _this.data.gid + '&store_id=0',
        imageUrl: shareimg,
        success: function (res) {},
      }
    }
    return reshare
  },
  // 提交订单
  placeorder: function () {
    var _this = this;

    if (this.data.tipaid == '') {
      app.showToastC('请选择地址');
      return false;
    };

    var zunmdata = _this.data.zunmdata;
    var iftrisabroad = false;
    var isisdefaultdata = false;
    if (zunmdata.length != 0) {
      for (var i = 0; i < zunmdata.length; i++) {
        if (zunmdata[i].iftrcheck) {
          if (zunmdata[i].isabroad == 1) {
            iftrisabroad = true;
          };
        };
      };
    };
    if (iftrisabroad) {
      var isisdefault = _this.data.addressdata;
      if (isisdefault.length != 0) {
        for (var i = 0; i < isisdefault.length; i++) {
          if (isisdefault[i].aid == _this.data.tipaid) {
            if (isisdefault[i].idcard != '' && isisdefault[i].idcard) {
              isisdefaultdata = false;
            } else {
              isisdefaultdata = true;
            };
          };
        };
      };
    };
    if (isisdefaultdata) {  //海外购身份证号验证
      _this.setData({
        idnumberboxiftr: !_this.data.idnumberboxiftr
      });
      return false;
    };

    var zunmdata = _this.data.zunmdata;
    var ginfo = [];
    var cart_id = [];
    var iftrgti = true;
    for (var i = 0; i < zunmdata.length; i++) {
      if (zunmdata[i].iftrcheck) {
        if (iftrgti) {
          _this.setData({
            gid: zunmdata[i].gid,
            paycheadwsongimg: zunmdata[i].goods_thumb,
            title: '￥' + zunmdata[i].gsale + "   " + zunmdata[i].pre_name + " " + zunmdata[i].ds + " " + zunmdata[i].gname
          });
          iftrgti = false;
        }; 
        cart_id.push(zunmdata[i].cart_id);
        if (zunmdata[i].color.no) { var color = zunmdata[i].color.no; } else { var color = 0; };
        if (zunmdata[i].size.no) { var size = zunmdata[i].size.no; } else { var size = 0; };
        ginfo.push({ gid: zunmdata[i].gid, color: color || 0, size: size || 0, count: zunmdata[i].numberofdismantling, store_id: zunmdata[i].store_id, rec_goods_id: zunmdata[i].rec_goods_id || 0, rec_cart_id: zunmdata[i].rec_cart_id || 0, group_id: zunmdata[i].group_id || 0, referee: zunmdata[i].referee||0,specRoleId:zunmdata[i].specRoleId || ''});
      };
    };
    var gcount = ginfo.length;
    var aid = _this.data.tipaid;
    var cid = [];
    cart_id = cart_id.join();
    if (_this.data.coudata1cid != '') { cid.push(_this.data.coudata1cid); };
    if (_this.data.coudata2cid != '') { cid.push(_this.data.coudata2cid); };
    var cid = cid.join();
    ginfo = JSON.stringify(ginfo);
    var q = Dec.Aese('mod=order&operation=carorder&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&gcount=' + gcount + '&aid=' + aid + '&cid=' + cid + '&ginfo=' + ginfo + '&desc=' + _this.data.desc + '&cart_id=' + cart_id + '&goodsDiscount=' + JSON.stringify(_this.data.relGidTips) + '&awardOrderId=' + _this.data.awardOrderId + '&isAddToyCabinet=' + _this.data.isAddToyCabinet+'&isDeduct='+_this.data.isDeductNum)
  var geturl = 'goods.php' + q;

    wx.request({
      url: app.signindata.comurl + geturl,
      method: 'GET',
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            tipbacktwo: false,
            buybombsimmediately: false,
            receivingaddress: false,
            couponprojectile: false,
            tipback: false,
            paymentiftr: false,
            payment: res.data.Info.amount,
            cart_id: res.data.Info.cart_id,
            // 优惠券清空
            tipcoupon: '请选择优惠券',
            coudata1cid: '',
            coudata1mon: '0.00',
            coudata2cid: '',
            coudata2mon: '0.00',
            desc: ''
          });
          // 提交订单支付
          _this.paymentmony();
          var iftrgti = true;
          var comdata = _this.data.zunmdata;
          var comdataw = [];
          
          for (var i = 0; i < comdata.length; i++) {
            if (!comdata[i].iftrcheck) {
              comdataw.push(comdata[i]);
            };
            if (comdata[i].iftrcheck) {
              if (iftrgti) {
                _this.setData({
                  gid: comdata[i].gid,
                  paycheadwsongimg: comdata[i].goods_thumb,
                  title: '￥' + comdata[i].gsale + "  " + comdata[i].pre_name + " " + comdata[i].ds + " " + comdata[i].gname
                });
                iftrgti = false;
              };
            };
          };
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.Msg,
            showCancel: false,
            success: function (res) { }
          })  
        } 
      }
    });

   
  },
  // 点击取消支付页
  paymentboxheadfun: function () {
    var _this = this;
    wx.showModal({
      title: '确定放弃支付吗？',
      content: '个人中心-我的订单-继续支付\n付款成功后，才可以拆单成功',
      success: function (res) {
        if (res.confirm) {
          _this.setData({
            tipback: false,
            tipbox: false,
            dsbframeiftr: false,
            paymentiftr: false,
          })
        }
      }
    })
  },
  // 微信支付
  paymentmony: function () {
    var _this = this;
    var q = Dec.Aese('mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1' + '&oid=' + _this.data.cart_id + '&xcx=1&openid=' + _this.data.openid)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
         
          // 支付完成弹框显示数据
          var shareinfo = res.data.Shareinfo;
          var payinfo = res.data.Info;
          if (shareinfo) {
            for (var f = 0; f < shareinfo.length; f++) {
              if (!app.signindata.reg.test(shareinfo[f].img)) {
                shareinfo[f].img = _this.data.zdyurl + shareinfo[f].img;
              };
              shareinfo[f].name = shareinfo[f].name.replace(/\\n/g, '\n');
            };
            _this.setData({ shareinfo: shareinfo });
          };

          _this.data.subscribedata = res.data.Info.subscribe || ''  // 订阅信息

          wx.requestPayment({
            'timeStamp': res.data.Info.timeStamp.toString(),
            'nonceStr': res.data.Info.nonceStr,
            'package': res.data.Info.package,
            'signType': 'MD5',
            'paySign': res.data.Info.paySign,
            'success': function (res) {
              _this.setData({
                gidiftr: _this.data.gid,
                paycheadwsongimgiftr: _this.data.paycheadwsongimg,
                titleiftr: _this.data.title,

                tipback: false,
                tipbox: false,
                dsbframeiftr: false,
                paymentiftr: false,
                buybombsimmediately: false,
                tipbacktwo: false,
                // 优惠券清空
                tipcoupon: '请选择优惠券',
                coudata1cid: '',
                coudata1mon: '0.00',
                coudata2cid: '',
                coudata2mon: '0.00',
                //  分享判断是否支付成功
                payiftr: true,
                desc: ''
              });
              _this.shoppingcartlist(1);
              var cart_id = _this.data.cart_id;

              // 订阅授权
              app.comsubscribe(_this);

              if (_this.data.isAddToyCabinet == 1) {
                wx.navigateTo({
                  url: "/page/component/pages/myothertoydg/myothertoydg?ownerId=" + _this.data.uid
                })
              } else if (payinfo.isFreeBuyOrder) {
                wx.navigateTo({
                  url: "/page/component/pages/hidefun/hidefun?type=1&cart_id=" + cart_id
                });
              }

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
              _this.setData({
                tipback: false,
                tipbox: false,
                tipbacktwo: false,
                buybombsimmediately: false,
                dsbframeiftr: false,
                paymentiftr: false,
                // 优惠券清空
                tipcoupon: '请选择优惠券',
                coudata1cid: '',
                coudata1mon: '0.00',
                coudata2cid: '',
                coudata2mon: '0.00',
                //  分享判断是否支付成功
                payiftr: false,
                desc: ''
              })
              _this.shoppingcartlist(1);
            },
            'complete': function (res) {}
          });
          // _this.shoppingcartlist(1);
        };
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
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
      }
    })
  },

  // 提交金额计算
  amountcalculation: function () {
    var _this = this;
    var comzund = this.data.zunmdata;
    // 税费
    var txton = 0;
    var compric = 0;
    // 商铺总价格
    var storpric = 0;
    var carriagearr = [];
    var stornum = 0;
    // 美拆商品计数
    var mcnum = 0;
    for (var i = 0; i < comzund.length; i++) {
      if (comzund[i].iftrcheck) {
        txton += parseFloat(comzund[i].tax || 0).toFixed(2) * parseFloat(comzund[i].numberofdismantling).toFixed(2);
        compric += parseFloat(comzund[i].gsale).toFixed(2) * parseFloat(comzund[i].numberofdismantling).toFixed(2);
        carriagearr.push(comzund[i].carriage||0);
        if (comzund[i].is_store == 1) {
          stornum += parseInt(comzund[i].numberofdismantling);
          storpric += parseFloat(comzund[i].gsale).toFixed(2) * parseFloat(comzund[i].numberofdismantling).toFixed(2);
        };
        if (comzund[i].is_store == 0){
          mcnum += parseInt(comzund[i].numberofdismantling);
        };
      };
    };
    compric = compric - parseFloat(_this.data.goodsDiscount);
    var compricbj = compric - parseFloat(_this.data.coudata2mon).toFixed(2);
    // 运费
    var max3 = carriagearr.sort().reverse()[0] || _this.data.defaultinformation.carriage.d || 6;
    var acc = 0;
    var freightiftr = '0.00';
    var xianshi = '0.00';
    var storzom = parseFloat(this.data.defaultinformation.carriage.freeForAmount);
    var freeMCPieces = this.data.defaultinformation.carriage.freeMCPieces;
    var freeForPieces = typeof (this.data.defaultinformation.carriage.freeForPieces) != "undefined" ? this.data.defaultinformation.carriage.freeForPieces : 10;
    var freeForPieces =  10;
    // 包邮提示 
    var packingtips = false;
    if (this.data.defaultinformation.carriage.free != '-1') {
      var tddefcarfr = parseFloat(_this.data.defaultinformation.carriage.free);
      if (stornum >= parseFloat(freeForPieces)) {
        acc = 0;
        freightiftr = 0;
        xianshi = '商品包邮';
      } else if (typeof (freeMCPieces) != "undefined" && mcnum >= parseFloat(freeMCPieces)) {
        if (freeMCPieces==1){
          acc = 0;
          freightiftr = 0;
          xianshi = '限时包邮';
        }else{
          acc = 0;
          freightiftr = 0;
          xianshi = '商品包邮';
        };
      } else if (compricbj >= tddefcarfr) {
        acc = 0;
        freightiftr = 0;
        xianshi = '满￥' + parseFloat(this.data.defaultinformation.carriage.free).toFixed(2) + '包邮';
      } else {
        var tdzuncar = max3;
        freightiftr = parseFloat(tdzuncar);
        xianshi = '￥' + parseFloat(tdzuncar).toFixed(2);
        acc = parseFloat(tdzuncar) > parseFloat(_this.data.coudata1mon) ? parseFloat(tdzuncar) - parseFloat(_this.data.coudata1mon) : 0;
      };
    } else {
      var tdzuncar = max3;
      xianshi = '￥0.00';
      freightiftr = parseFloat(tdzuncar);
      acc = parseFloat(tdzuncar) > parseFloat(_this.data.coudata1mon) ? parseFloat(tdzuncar) - parseFloat(_this.data.coudata1mon) : 0;
    };

    // 应付金额
    var _this = this;
    if (this.data.coupon_type == 1) { 
      var ap = compric - parseFloat(_this.data.coudata2mon) + acc + txton;
    } else {
      var coudata2 = _this.data.coudata2||[];
      var type = '';
      if (coudata2 && coudata2.length!=0){
        for (var cou = 0; cou < coudata2.length; cou++) {
          if (coudata2[cou].imgcheck) {
            type = coudata2[cou].type;
          }
        };
      };
      var comnum = 0;
      if (type!=''){
        var comzund = _this.data.zunmdata;
        for (var e = 0; e < comzund.length; e++) {
          if (comzund[e].iftrcheck) {
            if (comzund[e].coupon.voucher) {
              if (comzund[e].coupon.voucher.indexOf(type) > -1){
                comnum += parseFloat(comzund[e].gsale).toFixed(2) * parseFloat(comzund[e].numberofdismantling).toFixed(2);
              }
            };
          };
        };
      };
      
      var comnumpre = comnum - (comnum * parseFloat(_this.data.coudata2mon) / 10);
      var ap = compric - comnumpre + acc + txton;
      this.setData({
        coudata2mondiscount: comnumpre.toFixed(2) || '0'
      })
    };
    if (ap <= 0) {
      ap = 0;
    };

    let useblindAmountpayable = this.data.blindboxMoney>(ap.toFixed(2)*this.data.deductRatio)?ap.toFixed(2)*this.data.deductRatio:this.data.blindboxMoney;
    let amountpayable = this.data.blindboxMoney!=0? this.data.isDeduct? this.data.isUseBlindboxMoney? (ap.toFixed(2)-useblindAmountpayable).toFixed(2) :ap.toFixed(2) :ap.toFixed(2) :ap.toFixed(2)
    this.setData({
      // 应付金额
      amountpayable:amountpayable,
      // 原始应付金额
      originalAmountpayable: ap.toFixed(2),
      // 使用抽盒金后应付金额
      useblindAmountpayable: parseFloat(useblindAmountpayable).toFixed(3).slice(0,-1),
      // 运费
      //  freight: acc,
      freight: xianshi,
      freightiftr: freightiftr,
      // 商品价格
      commodityprice: compric.toFixed(2),
      // 税费
      taxation: txton.toFixed(2)
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
  // 兑换input值
  coupondatafun: function (e) {
    this.setData({
      coupondata: e.detail.value
    })
  },
  // 购物券选中
  checkimg1: function (event) {
    var cid = event.target.dataset.cid || event.currentTarget.dataset.cid;
    var checktwo1 = this.data.coudata1;
    for (var i = 0; i < checktwo1.length; i++) {
      if (checktwo1[i].cid == cid) {
        checktwo1[i].imgcheck = !checktwo1[i].imgcheck;
      } else {
        checktwo1[i].imgcheck = false;
      };
    };
    this.setData({
      coudata1: checktwo1
    })
  },
  checkimg2: function (event) {
    var cid = event.target.dataset.cid || event.currentTarget.dataset.cid;
    var checktwo2 = this.data.coudata2;
    for (var i = 0; i < checktwo2.length; i++) {
      if (checktwo2[i].cid == cid) {
        checktwo2[i].imgcheck = !checktwo2[i].imgcheck;
      } else {
        checktwo2[i].imgcheck = false;
      };
    };
    this.setData({
      coudata2: checktwo2
    })
  },
  // 兑换激活码
  couclicksou: function () {
    var _this = this;
    var coupondata = _this.data.coupondata.replace(/\s*/g, "");
    var q = Dec.Aese('mod=coupon&operation=exchange&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&code=' + coupondata)
    wx.request({
      url: app.signindata.comurl + 'user.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 906) {
          app.showToastC('激活码错误');
        };
        if (res.data.ReturnCode == 907) {
          app.showToastC('激活码已被使用');
        };
        if (res.data.ReturnCode == 908) {
          app.showToastC('激活码已过期');
        };
        if (res.data.ReturnCode == 200) {
          app.showToastC('兑换成功');
          // 调取优惠券
          this.comcouponprfun();

        };

      },
      fail: function () {}
    })
  },
  //  数组去重
  distinct: function (arr) {
    var arr = arr, i, j, len = arr.length;
    for (i = 0; i < len; i++) {
      for (j = i + 1; j < len; j++) {
        if (arr[i].cid == arr[j].cid) {
          arr.splice(j, 1);
          len--;
          j--;
        }
      }
    }
    return arr;
  },
  // 优惠券
  comcouponprfun: function () {
    var _this = this;
    // 优惠券
    var q = Dec.Aese('mod=coupon&operation=getlist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'user.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        var screeningavailable1 = [];
        var screeningavailable2 = [];
        // 不可用优惠券
        var unavailablearr = [];
        if (res.data.ReturnCode == 200) {
          var redali = res.data.List;
          if (redali && redali.length != 0) {
            var comzund = _this.data.zunmdata;
            // 运费卷
            var comarrcarriage = [];
            // 选中商品个数
            var selectionnum = 0;
            for (var i = 0; i < comzund.length; i++) {
              if (comzund[i].iftrcheck) {
                selectionnum+=1;
                if (comzund[i].coupon.carriage){
                  comarrcarriage = comarrcarriage.concat(comzund[i].coupon.carriage);
                };
              };
            };
            comarrcarriage = _this.unique(comarrcarriage);
            if (redali && redali.length!=0){
              for (var r = 0; r < redali.length; r++) {
                redali[r].gettime = time.formatTimeTwo(redali[r].gettime, 'Y/M/D h:m:s');
                redali[r].overtime = time.formatTimeTwo(redali[r].overtime, 'Y/M/D h:m:s');
              };
            };
            for (var t = 0; t < comarrcarriage.length; t++) {
              var compric = 0;
              for (var y = 0; y < comzund.length; y++) {
                if (comzund[y].iftrcheck) {
                  if (comzund[y].coupon.carriage.indexOf(comarrcarriage[t]) != -1) {
                    compric += parseFloat(comzund[y].gsale).toFixed(2) * parseFloat(comzund[y].numberofdismantling).toFixed(2);
                  };
                };
              };
              for (var u = 0; u < redali.length; u++) {
                if (redali[u].status == 0) {
                  if (redali[u].type == comarrcarriage[t]) {
                    if (parseFloat(redali[u].condition) <= compric) {
                      redali[u].imgcheck = false;
                      screeningavailable1.push(redali[u]);
                    }else{
                      unavailablearr.push(redali[u]);
                    };
                  }else{
                    unavailablearr.push(redali[u]);
                  };
                }else{
                  unavailablearr.push(redali[u]);
                };
              };
            };
            // 优惠券
            var comarrvoucher = [];
            for (var e = 0; e < comzund.length; e++) {
              if (comzund[e].iftrcheck) {
                if (comzund[e].coupon.voucher){
                  comarrvoucher = comarrvoucher.concat(comzund[e].coupon.voucher);
                };
              };
            };
            comarrvoucher = _this.unique(comarrvoucher);
            for (var p = 0; p < comarrvoucher.length; p++) {
              var compricvou = 0;
              for (var a = 0; a < comzund.length; a++) {
                if (comzund[a].iftrcheck) {
                  if (comzund[a].coupon.voucher.indexOf(comarrvoucher[p]) != -1) {
                    compricvou += parseFloat(comzund[a].gsale).toFixed(2) * parseFloat(comzund[a].numberofdismantling).toFixed(2);
                  };
                };
              };
              for (var b = 0; b < redali.length; b++) {
                if (redali[b].status == 0) {
                  if (redali[b].type == comarrvoucher[p]) {
                    if (parseFloat(redali[b].condition) <= compricvou) {
                      redali[b].imgcheck = false;
                      screeningavailable2.push(redali[b]);
                    }else{
                      unavailablearr.push(redali[b]);
                    };
                  }else{
                    unavailablearr.push(redali[b]);
                  };
                }else{
                  unavailablearr.push(redali[b]);
                };
              };
            };
            // 处理sp优惠券
            var marr = [];
            for (var m = 0; m < redali.length;m++){
              if (redali[m].isSpecial==1){
                var spstr = redali[m].type.toString();
                var s1 = spstr.substring(0, spstr.length - 2);
                redali[m].iftrtype = s1;
                marr.push(redali[m]) 
              };
            };
            for (var p = 0; p < marr.length;p++){
              if (comarrvoucher.indexOf(marr[p].iftrtype) != -1){
                var compricvou = 0;
                for (var a = 0; a < comzund.length; a++) {
                  if (comzund[a].iftrcheck) {
                    if (comzund[a].coupon.voucher.indexOf(comarrvoucher[p]) != -1) {
                      compricvou += parseFloat(comzund[a].gsale).toFixed(2) * parseFloat(comzund[a].numberofdismantling).toFixed(2);
                    };
                  };
                };
                if (parseFloat(marr[p].condition) <= compricvou && selectionnum>=2) {
                  marr[p].imgcheck = false;
                  screeningavailable2.push(marr[p]);
                };
              }
            };
            unavailablearr = _this.distinct(unavailablearr);
            if (screeningavailable2.length != 0) {
              for (var m = 0; m < unavailablearr.length; m++) {
                for (var n = 0; n < screeningavailable2.length; n++) {
                  if (unavailablearr[m]){
                    if (unavailablearr[m].cid == screeningavailable2[n].cid) {
                      unavailablearr.splice(m, 1);
                      m--;
                    };
                  };
                };
              };
            };
            if (screeningavailable1.length != 0) {
              for (var m = 0; m < unavailablearr.length; m++) {
                for (var n = 0; n < screeningavailable1.length; n++) {
                  if (unavailablearr[m]){
                    if (unavailablearr[m].cid == screeningavailable1[n].cid) {
                      unavailablearr.splice(m, 1);
                      m--;
                    };
                  };
                };
              };
            };            

          };
 
          _this.setData({
            coudata1: screeningavailable1,
            coudata2: screeningavailable2,
            unavailablearr: unavailablearr,
            // 清空优惠券信息
            tipcoupon: '请选择优惠券',
            coudata1cid: '',
            coudata1mon: '0.00',
            coudata2cid: '',
            coudata2mon: '0.00',
          });

          // 优惠券
          var checktwo2 = _this.data.coudata2;
          var txt2 = '', check2cid = '', check2mon = '0.00', coupon_type = 1;
          if (checktwo2.length != 0) {

            var coutypeone = [], coutypetwo = []; // 1 平常购物券 2 折扣券
            for (var dc = 0; dc < checktwo2.length; dc++) {
              if (checktwo2[dc].coupon_type == 2) {
                coutypetwo.push(checktwo2[dc])
              } else {
                coutypeone.push(checktwo2[dc])
              };
            };
            if (coutypeone.length != 0) {
              coutypeone.sort(_this.compare('value', false));
            };
            if (coutypetwo.length != 0) {
              coutypetwo.sort(function (a, b) { var v1 = a['value']; var v2 = b['value']; return v1 - v2; });
            };
            checktwo2 = coutypetwo.concat(coutypeone);

            if (checktwo2[0].coupon_type == 2) {
              txt2 = checktwo2[0].name + ' ' + checktwo2[0].value + '折';
              check2cid = checktwo2[0].cid;
              check2mon = checktwo2[0].value;
              checktwo2[0].imgcheck = true;
              coupon_type = 2;
            } else {
              if(checktwo2[0].coupon_id == 1001){
                txt2 = checktwo2[0].name;
                var zunmdata = _this.data.zunmdata || [];
                for(var i=0 ; i<zunmdata.length;i++){
                   if(zunmdata[i].category_id == 501){
                     check2mon = parseFloat(zunmdata[i].gsale);
                   }
                };
              }else{
                txt2 = checktwo2[0].name + checktwo2[0].unit + parseFloat(checktwo2[0].value).toFixed(2);
                check2mon = checktwo2[0].value;
              }
              check2cid = checktwo2[0].cid;
              checktwo2[0].imgcheck = true;
              coupon_type = 1;
            }
          };
          _this.setData({
            coudata2: checktwo2,
            coudata2cid: check2cid,
            coudata2mon: parseFloat(check2mon).toFixed(2),
            coupon_type: coupon_type
          });
          // 计算价格
          _this.amountcalculation();
          // 运费卷
          var checktwo1 = _this.data.coudata1;
          var txt1 = '', check1cid = '', check1mon = '0.00';
          if (checktwo1.length != 0 && _this.data.freightiftr > 0) {
            checktwo1.sort(_this.compare('value', false));
            if(checktwo1[0].coupon_id == 1001){
              txt1 = checktwo1[0].name + checktwo1[0].unit + parseFloat(checktwo1[0].value).toFixed(2);
            }else{
              txt1 = checktwo1[0].name;
            };
            check1cid = checktwo1[0].cid;
            check1mon = checktwo1[0].value;
            checktwo1[0].imgcheck = true;
            _this.setData({
              coudata1: checktwo1,
              coudata1cid: check1cid,
              coudata1mon: parseFloat(check1mon).toFixed(2),
            });
          } else {
            if (_this.data.freightiftr==0){
              for (var m = 0; m < unavailablearr.length; m++) {
                if (unavailablearr[m] != 'undefined') {
                  if (unavailablearr[m].type == 1) {
                    unavailablearr.splice(m, 1);
                    m--;
                  };
                };
              };
            };

            _this.setData({
              coudata1: [],
              coudata1cid: check1cid,
              unavailablearr: unavailablearr,
              coudata1mon: parseFloat(check1mon).toFixed(2),
            });
          };
          var txt = [];
          if (txt1 != '') { txt.push(txt1); };
          if (txt2 != '') { txt.push(txt2); };
          txt = txt.join('\n');
          if (txt1 == '' && txt2 == '') {
            txt = '请选择优惠券'
          };
          _this.setData({
            tipcoupon: txt,
          });
          // 计算价格
          _this.amountcalculation();

        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
      }
    });
  },
  // 截取字符串后几位
  getStr:function(str){
    //截取后8位
    //return str.match(/.*(.{8})/)[1] ;
    //截取后2位
    return str.match(/.*(.{2})/)[1] ;
  },
  // 根据数组中对象的某一个属性值进行排序
  compare: function (attr, rev) {
    //第二个参数没有传递 默认升序排列
    if (rev == undefined) {
      rev = 1;
    } else {
      rev = (rev) ? 1 : -1;
    }
    return function (a, b) {
      a = parseInt(a[attr]);
      b = parseInt(b[attr]);
      if (a < b) {
        return rev * -1;
      }
      if (a > b) {
        return rev * 1;
      }
      return 0;
    }
  },
  // 合并两个数组去重
  arr_concat: function (arr1, arr2) { 
    var arr = arr1.concat();
    for (var i = 0; i < arr2.length; i++) {
      arr.indexOf(arr2[i]) === -1 ? arr.push(arr2[i]) : 0;
    }
    return arr;
  },
  // 数组去重
  unique: function (array) {
    var temp = []; //一个新的临时数组
    for (var i = 0; i < array.length; i++) {
      if (temp.indexOf(array[i]) == -1) {
        temp.push(array[i]);
      }
    }
    return temp;
  },
  // 显示优惠券弹框
  couponprofun: function () {
    this.setData({
      couponprojectile: true,
    });
  },
  // 取消隐藏优惠券弹框
  couponprojectilefun: function () {
    var checktwo1 = this.data.coudata1
    for (var i = 0; i < checktwo1.length; i++) {
      if (this.data.coudata1cid == checktwo1[i].cid) {
        checktwo1[i].imgcheck = true;
      } else {
        checktwo1[i].imgcheck = false;
      };
    };
    var checktwo2 = this.data.coudata2;
    for (var i = 0; i < checktwo2.length; i++) {
      if (this.data.coudata2cid == checktwo2[i].cid) {
        checktwo2[i].imgcheck = true;
      } else {
        checktwo2[i].imgcheck = false;
      };
    };
    this.setData({
      coudata1: checktwo1,
      coudata2: checktwo2,
      couponprojectile: false,
    })
  },
  // 确认隐藏优惠券弹框 
  querencouponprojectilefun: function () {
    var checktwo1 = this.data.coudata1;
    var txt1 = '', check1cid = '', check1mon = '0.00';
    for (var i = 0; i < checktwo1.length; i++) {
      if (checktwo1[i].imgcheck) {
        if(checktwo1[i].coupon_id == 1001){
          txt1 = checktwo1[i].name;
        }else{
          txt1 = checktwo1[i].name + checktwo1[i].unit + parseFloat(checktwo1[i].value).toFixed(2);
        };
        check1cid = checktwo1[i].cid;
        check1mon = checktwo1[i].value;
      }
    };
 
    var checktwo2 = this.data.coudata2;
    var txt2 = '', check2cid = '', check2mon = '0.00', coupon_type = 1;
    for (var i = 0; i < checktwo2.length; i++) {
      if (checktwo2[i].imgcheck) {
        if (checktwo2[i].coupon_type == 1) {
          if(checktwo2[i].coupon_id == 1001){
            txt2 = checktwo2[i].name;
          }else{
            txt2 = checktwo2[i].name + checktwo2[i].unit + parseFloat(checktwo2[i].value).toFixed(2);
          };
          check2cid = checktwo2[i].cid;
          check2mon = checktwo2[i].value;
          coupon_type = checktwo2[i].coupon_type || 1;
        } else {
          txt2 = checktwo2[i].name + '' + checktwo2[i].value + '折';
          check2cid = checktwo2[i].cid;
          check2mon = checktwo2[i].value;
          coupon_type = checktwo2[i].coupon_type || 1;
        }
      }
    };
    var txt = [];
    if (txt1 != '') { txt.push(txt1); };
    if (txt2 != '') { txt.push(txt2); };
    txt = txt.join('\n');
    if (txt1 == '' && txt2 == '') {
      txt = '请选择优惠券'
    };
    this.setData({
      tipcoupon: txt,
      // 隐藏弹框
      couponprojectile: false,
      coudata1cid: check1cid,
      coudata1mon: parseFloat(check1mon).toFixed(2),
      coudata2cid: check2cid,
      coudata2mon: parseFloat(check2mon).toFixed(2),
      coupon_type: coupon_type
    });
    // 计算价格
    this.amountcalculation()
  },
  // 隐藏收货地址弹框
  receivingaddressfun: function () {
    this.setData({
      receivingaddress: false,
    })
  },
  // 收货地址弹框
  seladdressfun: function () {
    this.setData({
      receivingaddress: true,
    });
  },
  // 删除地址
  deladdress: function (event) {
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
            url: app.signindata.comurl + 'user.php' + q,
            method: 'GET',
            header: { 'Accept': 'application/json' },
            success: function (res) {
              if (res.data.ReturnCode == 200) {
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
  // 一级背景
  tipbackdis: function () {
    var _this = this;
    if (this.data.paymentiftr) {
      wx.showModal({
        title: '确定放弃支付吗？',
        content: '个人中心-我的订单-继续支付\n付款成功后，才可以拆单成功',
        success: function (res) {
          if (res.confirm) {
            _this.setData({
              tipback: false,
              tipbox: false,
              dsbframeiftr: false,
              paymentiftr: false,
            })
          }
        }
      })
    } else {
      _this.setData({
        tipback: false,
        tipbox: false,
        dsbframeiftr: false,
      })
    }

  },
  // 二级背景函数
  tipbacktwo: function () {
    if (this.data.receivingaddress) {
      this.setData({
        receivingaddress: false,
      })
    } else if (this.data.couponprojectile) {
      var checktwo1 = this.data.coudata1
      for (var i = 0; i < checktwo1.length; i++) {
        if (this.data.coudata1cid == checktwo1[i].cid) {
          checktwo1[i].imgcheck = true;
        } else {
          checktwo1[i].imgcheck = false;
        };
      };
      var checktwo2 = this.data.coudata2;
      for (var i = 0; i < checktwo2.length; i++) {
        if (this.data.coudata2cid == checktwo2[i].cid) {
          checktwo2[i].imgcheck = true;
        } else {
          checktwo2[i].imgcheck = false;
        };
      };
      this.setData({
        coudata1: checktwo1,
        coudata2: checktwo2,
        couponprojectile: false,
      });
    } else {
      this.setData({
        tipbacktwo: false,
        buybombsimmediately: false,
        receivingaddress: false,
        couponprojectile: false,
        tipback: false
      })
    };

  },
  immediatepurchase:function(){
    var _this = this;
    var raplist = _this.data.raplist||[];
    if (raplist && raplist.length != 0){
      _this.setData({awardpresentation:true});
    }else{
      _this.dsbbbutclickt();
    };
  },
  awardprestion:function(){
    this.setData({
      awardpresentation: false
    })
    wx.showLoading({ title: '加载中...', mask:true})
    var raplist = this.data.raplist||[];
    var cart_id = raplist[0].cart_id||'';
    wx.navigateTo({
      url: "/page/component/pages/awardwinningarea/awardwinningarea?cart_id=" + cart_id,
      complete:function(){
        wx.hideLoading()
      }
    });
  },
  // 立即购买弹框
  dsbbbutclickt: function () {
    this.setData({
      tipbacktwo: true,
      buybombsimmediately: true,
      awardpresentation:false
    });
    this.amountcalculation();
    // 调取优惠券
    this.comcouponprfun();
  },
  // 协议radio
  radioagreement: function () {
    this.setData({
      radioagreement: !this.data.radioagreement
    });
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
  // 阻止蒙层冒泡
  preventD() { },
  // 拆单弹框隐藏点击事件
  tipdel: function () {
    this.setData({
      tipback: false,
      tipbox: false,
    })
  },
  // 隐藏直接购买弹框
  dsbffun: function () {
    this.setData({
      tipback: false,
      dsbframeiftr: false,
    })
  },
  // 显示直接购买弹框
  dsbffunblock: function () {
    this.setData({
      tipback: true,
      dsbframeiftr: true,
      tipbox: false,
    });
  },
  pricedetailc: function () {  // 价格明细显示隐藏
    this.setData({
      pricedetailc: !this.data.pricedetailc
    })
  },
  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    };
  },
  // 导航跳转
  whomepage: function () {
    wx.redirectTo({
      url: "/pages/index/index?judgeprof=2"
    })
  },
  wnews: function () {
    var _this = this;
    app.limitlottery(_this);
  },
  wshoppingCart: function () {
    this.data.page = 0;
    wx.hideLoading()
    // 防止多次提交
    if (this.data.clicktherequestiftr) {
      this.data.clicktherequestiftr = false;
      this.shoppingcartlist(1);
      this.goTop();
    };
  },
  wmy: function () {
    wx.redirectTo({
      url: "/pages/wode/wode"
    })
  },
  clicktganone: function () {
    this.setData({ tgabox: false })
  },
  clicktganone: function () {
    this.setData({ tgabox: false })
  },
  pullupsignin: function () {
    // // '没有授权'
    this.setData({
      tgabox: true
    });
  },
  // 点击登录获取权限
  userInfoHandler: function (e) {
    var _this = this;
    wx.getSetting({
      success: res => {
        if (true) {
          _this.setData({
            tgabox: false,
            signinlayer: true,
          });          
          // '已经授权'
          _this.setData({
            loginid: app.signindata.loginid,
            uid: app.signindata.uid,
            openid: app.signindata.openid,
            store_id: app.signindata.store_id || 0
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this)
          };
          // 确认授权用户统计
          app.clicktga(4);
        } else {
          // '没有授权'
          // 跳转获取权限页面
          _this.setData({
            tgabox: true
          });
        }
      }
    });
    if (e.detail.detail.userInfo) { } else {
      app.clicktga(8)  //用户按了拒绝按钮
    };

  },
  // 买家备注
  inputChange: function (e) {
    this.setData({
      desc: e.detail.value
    });
  },
  // 返回首页
  frontpagebutton: function (w) {
    var whref = w.currentTarget.dataset.href || w.target.dataset.href;
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type || 0;
    var wname = w.currentTarget.dataset.name || w.target.dataset.name || '';
    // 公共跳转
    this.comjumpwxnav(item_type, whref, wname);
  },
  // 身份证号弹框取消事件
  idnumbbcenfun: function () {
    this.setData({
      idnumberboxiftr: !this.data.idnumberboxiftr
    })
  },
  // 身份证号弹框确定事件
  idnumbbsubfun: function () {
    var _this = this;
    if (_this.data.inputnamedata == '') {
      app.showToastC('姓名不能为空');
      return false;
    };
    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    if (this.data.inputidnumberdata == '') {
      app.showToastC('身份证号不能为空');
      return false;
    } else if (!regIdCard.test(this.data.inputidnumberdata)) {
      app.showToastC('身份证号格式不正确');
      return false;
    } else { };
    var isisdefault = _this.data.addressdata;
    var isisdefaultdata = '';
    if (isisdefault.length != 0) {
      for (var i = 0; i < isisdefault.length; i++) {
        if (isisdefault[i].aid == _this.data.tipaid) {
          isisdefaultdata = isisdefault[i].isdefault;
        };
      };
    };
    var qformid = Dec.Aese('mod=address&operation=set&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + _this.data.tipaid + '&consignee=' + _this.data.inputnamedata + '&idcard=' + _this.data.inputidnumberdata + '&isdefault=' + isisdefaultdata);
    wx.request({
      url: app.signindata.comurl + 'user.php' + qformid,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          // 调取收货地址
          _this.nextpagediao();
          _this.setData({
            idnumberboxiftr: !_this.data.idnumberboxiftr
          });
        };
        if (res.data.ReturnCode == 900) {
          app.showToastC('登陆状态有误');
        };
        if (res.data.ReturnCode == 901) {
          app.showToastC('身份证号格式不正确');
        };
        if (res.data.ReturnCode == 909) {
          app.showToastC('身份证信息不匹配');
        };
        if (res.data.ReturnCode == 910) {
          app.showToastC('身份信息错误次数过多，请明天再试。');
        };
        if (res.data.ReturnCode == 913) {
          app.showToastC('地址有误');
        };
      },
      fail: function () { }

    });
  },
  // 真实姓名 input 值改变
  inputnameChange: function (e) {
    this.setData({
      inputnamedata: e.detail.value
    });
  },
  // 身份证号
  inputidChange: function (e) {
    this.setData({
      inputidnumberdata: e.detail.value
    });
  },
  // 公共跳转
  comjumpwxnav: function (item_type, whref, wname) {
    if (item_type == 0) {
      var url = encodeURIComponent(whref)
      wx.navigateTo({    // 外部链接
        url: "/page/component/pages/webview/webview?webview=" + url
      });
    } else if (item_type == 1) {
      wx.navigateTo({    // 商品详情页
        url: "/pages/detailspage/detailspage?gid=" + whref
      });
    } else if (item_type == 2 || item_type == 3) {
      wx.navigateTo({    // 信息流
        url: "/pages/classificationpage/classificationpage?" + whref + '&wtype=' + item_type + '&wname=' + wname
      });
    } else if (item_type == 4 || item_type == 5) {

      wx.navigateTo({    // 瀑布流
        url: "/pages/classificationpage/classificationpage?" + whref + '&wtype=' + item_type + '&wname=' + wname
      });
    } else if (item_type == 6 || item_type == 7) {
      wx.navigateTo({    // 活动列表
        url: "/pages/activitysharinglist/activitysharinglist"
      });
    } else if (item_type == 8) {
      wx.navigateTo({    // 活动详情页
        url: "/pages/activitydetailspage/activitydetailspage?id=" + whref
      });
    } else if (item_type == 9) {
      wx.navigateTo({    //签到
        url: "/page/component/pages/newsignin/newsignin"
      });
    } else if (item_type == 998) {
      wx.reLaunch({    //签到
        url: "/pages/index/index?judgeprof=2"
      });
    };
  },
  //  支付成功跳转
  comindellistjump: function (w) {
    var whref = w.currentTarget.dataset.href || w.target.dataset.href;
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type || 0;
    var wname = w.currentTarget.dataset.name || w.target.dataset.name || '美拆';
    // 公共跳转
    this.comjumpwxnav(item_type, whref, wname);
  },
  // 底部推荐商品加入购物车
  botAddShopCar:function(w){
    var _this = this;
    var indnum = w.currentTarget.dataset.indnum || w.target.dataset.indnum || 0;
    var bulletlist = _this.data.bulletlist[indnum];
    var iftrext = true;
    var colorId = 0;
    var sizeId = 0;
    var selectedId = 1;
    for (var i in bulletlist.extends){
      if (iftrext){
        colorId =  bulletlist.extends[i].c||0;
        sizeId =  bulletlist.extends[i].s||0;
        selectedId = bulletlist.extends[i].selected||1;
        iftrext = false;
      };
    };
   
    var adtocar = [{ 'goods_id': bulletlist.goods_id, 'color_id': colorId, 'size_id': sizeId, 'count': selectedId}];
    var adtocarleng = adtocar.length;
    adtocar = JSON.stringify(adtocar);
    var qformid = Dec.Aese('mod=cart&operation=add&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&gcount=' + adtocarleng + '&ginfo=' + adtocar);
    wx.request({
      url: app.signindata.comurl + 'goods.php' + qformid,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          app.showToastC('已成功加入购物车');
          _this.shoppingcartlist(1);
        } else if (res.data.ReturnCode == 802) {
          app.showToastC('规格选择有误');
        } else if (res.data.ReturnCode == 805) {
          app.showToastC('库存不足');
        } else if (res.data.ReturnCode == 201) {
          app.showToastC('添加失败');
        } else if (res.data.ReturnCode == 302) {
          app.showToastC('无效信息');
        }
      },
      fail: function () { }
    });
  },
  // 加入购物车
  addtocart: function (w) {  // 加入购物车
    var _this = this;
    if (_this.data.clicktherequestiftr) {
      _this.data.clicktherequestiftr = false;
      var gid = w.currentTarget.dataset.gid || w.target.dataset.gid;
      var adtocar = [{ 'goods_id': gid, 'color_id': 0, 'size_id': 0, 'count': 1 }];
      var adtocarleng = adtocar.length;
      adtocar = JSON.stringify(adtocar);
      var qformid = Dec.Aese('mod=cart&operation=add&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&gcount=' + adtocarleng + '&ginfo=' + adtocar);
      wx.request({
        url: app.signindata.comurl + 'goods.php' + qformid,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {
          _this.data.clicktherequestiftr = true;
          if (res.data.ReturnCode == 200) {
            app.showToastC('已成功加入购物车');
            _this.shoppingcartlist(1);
            Dec.shopnum(_this,app.signindata.comurl);
          } else if (res.data.ReturnCode == 802) {
            wx.navigateTo({ 
              url: "/pages/detailspage/detailspage?gid=" + gid
            });
          } else if (res.data.ReturnCode == 805) {
            app.showToastC('库存不足');
          } else if (res.data.ReturnCode == 201) {
            app.showToastC('添加失败');
          } else if (res.data.ReturnCode == 302) {
            app.showToastC('无效信息');
          }
        },
        fail: function () { }
      });
    };

  },
  // 显示隐鲹底部商品列表
  iftrBotShopList:function(){
    this.setData({
      iftrBotShopList: !this.data.iftrBotShopList
    });
  },
  // 组合加购物车
  mulshopaddcar:function(w){
    var _this = this;
    var addnum = w.currentTarget.dataset.addnum || w.target.dataset.addnum||0;
    var onemdata = _this.data.zunmdata[addnum].groupData.goodsList||[];
    var groupid = _this.data.zunmdata[addnum].group_id||0;
    var zunmdata = _this.data.zunmdata;
    var adtocar = [];
    // 优惠组合
    var zundataarr = [];
    for (var i = 0; i < onemdata.length;i++){
      zundataarr.push(onemdata[i].goods_id);
    };
    // 购物车所有商品
    var zuncomarr = [];
    for (var j = 0; j < zunmdata.length;j++){
      zuncomarr.push(zunmdata[j].goods_id);
      for (var f = 0; f < onemdata.length; f++) {
        if (onemdata[f].goods_id == zunmdata[j].goods_id){
          if (groupid == zunmdata[j].group_id){
            zunmdata[j].iftrcheck = true;
            if (onemdata[f].num > zunmdata[j].numberofdismantling) {
              var iftrext = true;
              var colorId = 0;
              var sizeId = 0;
              var selectedId = 1;
              for (var m in onemdata[f].extends) {
                if (iftrext) {
                  colorId = onemdata[f].extends[m].c || 0;
                  sizeId = onemdata[f].extends[m].s || 0;
                  selectedId = onemdata[f].extends[m].selected || 1;
                  iftrext = false;
                };
              };
              var reducenum = parseInt(onemdata[f].num) - parseInt(zunmdata[j].numberofdismantling) >= 1 ? parseInt(onemdata[f].num) - parseInt(zunmdata[j].numberofdismantling) : 1;
              adtocar.push({ 'goods_id': onemdata[f].goods_id, 'color_id': colorId, 'size_id': sizeId, 'count': reducenum, 'group_id': groupid });
          };

          }else{
            var iftrext = true;
            var colorId = 0;
            var sizeId = 0;
            var selectedId = 1;
            for (var m in onemdata[f].extends) {
              if (iftrext) {
                colorId = onemdata[f].extends[m].c || 0;
                sizeId = onemdata[f].extends[m].s || 0;
                selectedId = onemdata[f].extends[m].selected || 1;
                iftrext = false;
              };
            };
            var reducenum = parseInt(onemdata[f].num) - parseInt(zunmdata[j].numberofdismantling) >= 1 ? parseInt(onemdata[f].num) - parseInt(zunmdata[j].numberofdismantling) : 1;
            adtocar.push({ 'goods_id': onemdata[f].goods_id, 'color_id': colorId, 'size_id': sizeId, 'count': reducenum, 'group_id': groupid });

          };
        };
      };
    };
    for (var a = 0; a < zundataarr.length;a++){
      if (zuncomarr.indexOf(zundataarr[a])==-1){
        for (var b = 0; b < onemdata.length;b++){
          if (onemdata[b].goods_id == zundataarr[a]){
            var iftrext = true;
            var colorId = 0;
            var sizeId = 0;
            var selectedId = 1;
            for (var m in onemdata[b].extends) {
              if (iftrext) {
                colorId = onemdata[b].extends[m].c || 0;
                sizeId = onemdata[b].extends[m].s || 0;
                selectedId = onemdata[b].extends[m].selected || 1;
                iftrext = false;
              };
            };
            adtocar.push({ 'goods_id': onemdata[b].goods_id, 'color_id': colorId, 'size_id': sizeId, 'count': selectedId, 'group_id': groupid });
          };
        };
      };
    };


    var adtocarleng = adtocar.length;
    adtocar = JSON.stringify(adtocar);
    var qformid = Dec.Aese('mod=cart&operation=add&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&gcount=' + adtocarleng + '&ginfo=' + adtocar + '&group_id=' + groupid +'&specialType=1');
    wx.request({
      url: app.signindata.comurl + 'goods.php' + qformid,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          app.showToastC('已成功加入购物车');
          _this.shoppingcartlist(1);
        } else if (res.data.ReturnCode == 802) {
          app.showToastC('规格选择有误');
        } else if (res.data.ReturnCode == 805) {
          app.showToastC('库存不足');
        } else if (res.data.ReturnCode == 201) {
          app.showToastC('添加失败');
        } else if (res.data.ReturnCode == 302) {
          app.showToastC('无效信息');
        }
      },
      fail: function () { }
    });


  },
  dlfindfun: function () {
    wx.reLaunch({
      url: "/page/component/pages/dlfind/dlfind",
    })
  },

  jumpgoodsthings: function () {
    wx.navigateToMiniProgram({
      appId: 'wx56c8f077de74b07c',
      path: "/open/function-introduction/function-introduction",
      extraData: {
        foo: 'bar'
      },
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  },
  awajump: function (w) {
    var cart_id = w.currentTarget.dataset.cart_id || w.target.dataset.cart_id||0;
    var order_type = w.currentTarget.dataset.order_type || w.target.dataset.order_type || 0;
    var activity_id = w.currentTarget.dataset.activity_id || w.target.dataset.activity_id || 0;
    var detailaward = w.currentTarget.dataset.detailaward || w.target.dataset.detailaward || 0;
    if (order_type == 2 && detailaward != 2){
      wx.navigateTo({
        url: "/pages/activitydetailspage/activitydetailspage?id=" + activity_id
      });
    }else{
      wx.navigateTo({
        url: "/page/component/pages/awardwinningarea/awardwinningarea?cart_id=" + cart_id,
      });
    }


  }, 
  jumpaction: function (w) {
    var path = w.currentTarget.dataset.path || w.target.dataset.path || '';
    wx.navigateTo({
      url: path
    });
  }, 
  // 计算图片大小
  imageLoadad: function (e) {
    var _this = this;
    var indexnum = e.currentTarget.dataset.indexnum || e.target.dataset.indexnum || 0;
    if (indexnum == 5) {
      var ind = e.currentTarget.dataset.ind || e.target.dataset.ind || 0;
      var $width = e.detail.width,    //获取图片真实宽度
        $height = e.detail.height,
        ratio = $width / $height;
      var viewHeight = 116,           //设置图片显示宽度，
        viewWidth = 116 * ratio;
      var commoddata = this.data.zunmdata;
      if (viewWidth > 150) {
        viewWidth = 150;
      };
      if (commoddata[ind]) {
        if (commoddata[ind]) {
          commoddata[ind].width = viewWidth;
          _this.setData({
            zunmdata: commoddata
          })
        };
      };
    } else if (indexnum == 4) {
      var ind = e.currentTarget.dataset.ind || e.target.dataset.ind || 0;
      var $width = e.detail.width,    //获取图片真实宽度
        $height = e.detail.height,
        ratio = $width / $height;
      var viewHeight = 116,           //设置图片显示宽度，
        viewWidth = 116 * ratio;
      var commoddata = this.data.raplist;
      if (viewWidth > 150) {
        viewWidth = 150;
      };
      if (commoddata[ind]) {
        if (commoddata[ind]) {
          commoddata[ind].width = viewWidth;
          _this.setData({
            raplist: commoddata
          })
        };
      };

    }
  },
  // 临时展会授权
  togation:function(e){
    this.setData({
      tgabox:true
    })
  },  
})