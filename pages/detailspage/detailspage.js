var Dec = require('../../common/public.js');//aes加密解密js
var WxParse = require('../../wxParse/wxParse.js');
var time = require('../../utils/util.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    newdataexh:Date.parse(new Date())/1000<1588175999?true:false,
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
    avatarUrl: app.signindata.avatarUrl,    
    // 授权弹框
    tgabox: false,   
    headhidden:true, 
    movies: [],
    // 商品详情数据
    zunmdata:{},
    // 拆单用户数据
    uinfodata:{},
    // 倒计时
    countdown:'',
    // 一级弹框背景
    tipback:false,
    // 点赞变化
    gttu:false,
    // 拆单数量
    numberofdismantling:1,
    // 拆单弹框显示隐藏
    dsbframeiftr:false,
    // 文体提示弹框
    textpbiftr:false,
    textpbiftrtext:'已成功加入购物车',
    // 价格明细显示隐藏
    pricedetailc:true,
    // 协议radio
    radioagreement:true,
    // 选择弹框
    buybombsimmediately:false,
    // 二级背景
    tipbacktwo:false,
    // 收货地址
    receivingaddress:false,
    // 优惠券弹框
    couponprojectile:false,
    // 兑换input值
    coupondata:'',
    gid:'',
    // 评论数据
    allcomlist:[],
    // 收货地址数据
    addressdata:[],
    // 收货地址显示 请选择收货地址
    tipaddress:'请选择收货地址',
    tipaid:'',
    // 弹框优惠券 请选择优惠券
    tipcoupon:'请选择优惠券',
    // 颜色id
    colorid:'',
    colorcon:'',
    // 颜色id
    sizeid: '', 
    sizecon:'',  
    // 运费券
    coudata1:[],
    coudata1cid:'',
    coudata1mon:'0.00',
    // 代金券
    coudata2: [],
    coudata2cid: '',
    coudata2mon:'0.00',
    // 优惠券 1正常优惠券 2折扣券
    coupon_type:1,    
    coudata2mondiscount: '0.00',
    // 公共默认信息
    defaultinformation:'',
    // 后台返回总价格
    payment:'',
    // 支付弹框
    paymentiftr:false,
    // 应付金额
    amountpayable:'0.00',
    // 使用抽盒金后应付金额
    useblindAmountpayable:'',
    // 运费
    freight:'￥0.00',
    // 运费判断关于运费券
    freightiftr:'0.00',
    // 商品价格
    commodityprice:0,
    // 税费
    taxation:'0.00',
    // 订单id
    cart_id:'',
    // 后台传回
    hamount:0,
    // 支付完成赠送卷
    paycheadwsong: '',   
    // 支付成功分享的图片地址
    paycheadwsongimg:'',
    combdataimg:{},
    // 组合显示税总和
    combtaxation:'0.00',
    // 判断是否是 原产品还是活动 1原产品 2 活动二 
    judgmentactivity:1,
    // 滚动条的高度
    scrollHeight:0,
    // 购物车判断是否显示下拉提示图片
    addcatlimg:0,
    // 提交支付蒙层
    suboformola:false,
    // 买家备注
    desc:'',
    // 口令
    descpassword:'',
    // 满减优惠券的使用判断
    commoditypriceiftr: 0,  
    // 购买显示商品数量
    quantityofgoods:'', 
    //  预览图数据
    imgArr: [],
    // 身份证号弹框判断
    idnumberboxiftr:false,
    // 真实姓名
    inputnamedata:'',
    // 身份证号
    inputidnumberdata:'',
    // 微信号码
    wxnum: 'meichai666666', 
    // 支付完成显示分类跳转数据
    shareinfo:'',
    // 统计邀请
    rec_goods_id: 0,
    rec_cart_id: 0,
    // 生成分享图片
    snapshot: '',
    // group_id 数据 列表id
    href: '',
    isVideoSwiper:false,
    shopnum:0,
    // 适配苹果X
    isIphoneX: app.signindata.isIphoneX,
    // 防止swiper卡住
    swiperError: 0,
    goodsIndex: 0,
    preIndex: 0, 
    ginfo: '',
    video: '',
    ishowvideo: false,
    videoContext: '',
    animation: "",
    tgfrShareIftr:false,
    actimgshare:'',
    ishowwelfare:false,

    // 赠送优惠券数据
    newcoupondata: [],
    // 节日主题
    newcoutitle: '新人礼包',
    // 赠送优惠券弹框是否显示
    newcoupon: false,
    // 不可用优惠券
    unavailablearr:[],
    referee:0,
    welvalue:false,
    // 晒单数量
    dryinglistnum: 0,
    isProduce: app.signindata.isProduce,
    product: '',
    // 是否显示购买
    limitnum:0, 
    awa:0,
    // 是否开启了分享功能
    isShareFun: true,
    // 检测视频广告进入
    gdt_vid : '',
    weixinadinfo : '',
    detailbutnum:1,
    dryinglist:[],
    iftrputfor:true,
    detaposiiftr:true,
    drydisnum:0,
    pagenum:1,
    loadprompttxt:'查看更多',
    c_title: '商品详情',
    c_arrow: true,
    c_backcolor:'#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    othershop:[],
    // 是否授权
    windowHeight: app.signindata.windowHeight - 65 - wx.getStorageSync('statusBarHeightMc') || 0,
    tgabox: false,
    signinlayer: false,
    is_share: false,
    detailSwiperindex:0,
    // 直播房间id
    room_id:0,

    // 是否是展会
    is_exhibition: 0,
    addfrindcommoni: false,
    exhpage: 0,
    exhdata: [],
    exhbanner: [],
    exhibdetail: true, // 1品牌专区 2奖项介绍 3商品详情
    brandId: '',
    userbranddata: '',
    saveimgurlfrpb: '',

    pictboxbox: false,
    
    iftrrefresh:true,
    subscribedata:'',
    isSubscribeCoupon:false,
    subscribeCouponTip:'',
    // 定金参数
    depositbox:false,
    // 抽盒机规则选择个数
    isBlindBoxNum:1,
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
    // 关注公众号标签
    // 手机壳样式
    specialGoods:0,

    modelSelInde:0,

    detailColorIndex:0,
    selectShell:{},
    // 刮刮卡入口
    isScrapingCard:false,
    mpmBulletFrame:false,  
    guidanceMask:false,
    proTipTrue:false,
    commodityAgreement:false

  },
  commdargee(){
      this.setData({
          commodityAgreement:!this.data.commodityAgreement
      })
  },
  closeCommonTip(){
    this.setData({
      proTipTrue:!this.data.proTipTrue,
      commodityAgreement:false
    })
  },
  continueToBuy(){
    var _this = this;
    if(this.data.commodityAgreement){
      if(this.data.zunmdata.orderSn){
        this.data.cart_id = this.data.zunmdata.orderSn || '';
        console.log('支付尾款=====',_this.data.cart_id)
        this.paymentmony();
      }else{
        this.placeorder();
        this.closeCommonTip();
      };
    };
  },

  toogleGuidanceMask(){
    this.setData({
      guidanceMask:!this.data.guidanceMask
    }) 
  },

  mpmBullFrame(){
     this.setData({
       mpmBulletFrame:!this.data.mpmBulletFrame
     })
  },
  // 跳转刮刮卡
  jumpScrapingCard(){
    app.comjumpwxnav(9023,'','','')
  },

  dSCfun(event){
    var _this = this;
    var index = event.currentTarget.dataset.index || event.target.dataset.index || 0;
    // var name = this.data.detailSpecColor[index].name;
    // var arr = [];
    // console.log(this.data.detailSpecModel)
    // console.log(this.data.detailSpecColor[index].name)
    // for(var i = 0; i<this.data.detailSpecModel.length;i++){
    //   if(this.data.detailSpecModel[i].arrCloseSpec.indexOf(name) != -1){
    //     arr.push(this.data.detailSpecModel[i])
    //   }
    // }
    // this.setData({
    //   detailSpecModel:arr
    // })
    
    var detailSpecModel = this.data.detailSpecModel || [];
    var detailSpecColor = this.data.detailSpecColor || [];
    _this.setData({
      movies: detailSpecColor[index].listImg || _this.data.zunmdata.gimages || [],
      goodsIndex:0
    })
    var listSpec = this.data.listSpec;


    //多款式默认选择第一个 start
    // if(detailSpecColor.length > 1){
      var indnum = 0;
      var realityStock = '';  //真实库存数据
      var istrue = true;
      var styleName = detailSpecColor[index].name;  //当前款式名字
      for(var i=0 ; i < detailSpecModel.length ; i++){
         if(istrue){
            if(detailSpecModel[i].arrCloseSpec[styleName]){
              indnum = i;
              istrue = false;
            };
         };
         realityStock = listSpec[detailSpecModel[i].name.toString()+ '-' + styleName.toString()];
         if(realityStock){
            detailSpecModel[i].stock = realityStock.stock
            detailSpecModel[i].salesStatus = realityStock.salesStatus
            detailSpecModel[i].realStock = realityStock.realStock
         }

      };
      _this.setData({
        modelSelInde:indnum,
        detailSpecModel
      })
      // var indnum = 0;
      // for(var i=0 ; i < detailSpecModel.length ; i++){
      //    if(detailSpecModel[i].arrCloseSpec[detailSpecColor[index].name]){
      //       indnum = i;
      //       break;
      //    };
      // };
      // _this.setData({
      //   modelSelInde:indnum
      // })
    // }
    //多款式默认选择第一个 end
   
    var modelColor = detailSpecModel[this.data.modelSelInde].name+'-'+detailSpecColor[index].name;
    console.log(listSpec[modelColor])

    var zunmdata = this.data.zunmdata; 

    if(detailSpecColor[index] && detailSpecColor[index].tipStockOnLine){
      zunmdata.tipStockOnLine = detailSpecColor[index].tipStockOnLine;
      zunmdata.isSuplusChance = detailSpecColor[index].isSuplusChance || false;
    };
    // 回答题答案
    if(zunmdata.additional_type==2){
      zunmdata.option =  detailSpecColor[index].option || [];
      zunmdata.anwer =  detailSpecColor[index].anwer || ''
    }

    if( listSpec[modelColor] && listSpec[modelColor].stock > 0 ){

      zunmdata.gsale = listSpec[modelColor].price || 0;
      zunmdata.gprice = listSpec[modelColor].price || 0;

      if(zunmdata.totalSpecStock && listSpec[modelColor].stock > zunmdata.totalSpecStock){
         this.data.totalSpecStock = zunmdata.totalSpecStock;
      }else{
         this.data.totalSpecStock = listSpec[modelColor].stock;
      };
      if(zunmdata.status == 2){
        if(zunmdata.depositInfo && zunmdata.depositInfo[listSpec[modelColor].roleId]){
          zunmdata.isDepositSubscribe = zunmdata.depositInfo[listSpec[modelColor].roleId].isDepositSubscribe;
          if(zunmdata.depositInfo[listSpec[modelColor].roleId].orderSn){
            zunmdata.orderSn = zunmdata.depositInfo[listSpec[modelColor].roleId].orderSn;
            zunmdata.isDisplayDeposit = true;
          }else{
            zunmdata.isDisplayDeposit = false;
          };
        }else{
          zunmdata.isDepositSubscribe = false;
          zunmdata.isDisplayDeposit = true;
        };
      }
      // 手机壳 并且 isSpecSoldOut 为 true 全部卖完
      if(zunmdata.isSpecSoldOut){
          zunmdata.debuff = 3; 
      }else{
          zunmdata.debuff = 0; 
      };

      zunmdata.goods_thumb = listSpec[modelColor].roleImg;
      console.log(zunmdata)

      this.setData({
        detailColorIndex:index,
        selectShell:listSpec[modelColor],
        zunmdata:zunmdata
      })
    }else{ 
      zunmdata.gsale = listSpec[modelColor].price || 0;
      zunmdata.gprice = listSpec[modelColor].price || 0;

      if(zunmdata.status == 2){
        // zunmdata.isDepositSubscribe = false;
        // zunmdata.isDisplayDeposit = true;
        if(zunmdata.status == 2){
          if(zunmdata.depositInfo && zunmdata.depositInfo[listSpec[modelColor].roleId]){
            zunmdata.isDepositSubscribe = zunmdata.depositInfo[listSpec[modelColor].roleId].isDepositSubscribe;
            if(zunmdata.depositInfo[listSpec[modelColor].roleId].orderSn){
              zunmdata.orderSn = zunmdata.depositInfo[listSpec[modelColor].roleId].orderSn;
              zunmdata.isDisplayDeposit = true;
            }else{
              zunmdata.isDisplayDeposit = false;
            };
          }else{
            zunmdata.isDepositSubscribe = false;
            zunmdata.isDisplayDeposit = true;
          };
        };
      };
      if(zunmdata.status == 3 && listSpec[modelColor] && zunmdata.depositInfo){
        if(zunmdata.depositInfo[listSpec[modelColor].roleId] && zunmdata.depositInfo[listSpec[modelColor].roleId].balanceOrderSn){
          zunmdata.orderSn = zunmdata.depositInfo[listSpec[modelColor].roleId].balanceOrderSn;
          zunmdata.orderAmount = zunmdata.depositInfo[listSpec[modelColor].roleId].orderAmount;
        }else{
          zunmdata.orderSn = '';
          zunmdata.orderAmount = '';
        };
      };
      if(listSpec[modelColor].realStock<=0 && listSpec[modelColor].stock<=0){
        zunmdata.debuff = 3; 
      }else if(listSpec[modelColor].realStock<=0 && listSpec[modelColor].stock>0){
        zunmdata.debuff = 3; 
      }
      console.log(zunmdata)
      this.setData({
        detailColorIndex:index,
        selectShell:listSpec[modelColor],
        zunmdata,
      })

    };
  },
  //分类选择
  bindPickerChange: function (w) {
    var _this = this;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    console.log('picker发送选择改变，携带值为',ind)
    var detailSpecModel = this.data.detailSpecModel || [];
    var detailSpecColor = this.data.detailSpecColor || [];
    var listSpec = this.data.listSpec;

    var ifAdopt = false;
    var assignment = true;
    var detailColorIndex = _this.data.detailColorIndex || 0;
    var selectShell = {};

    var modelColor = detailSpecModel[ind].name+'-'+detailSpecColor[detailColorIndex].name;
        
    if(listSpec[modelColor]){
      selectShell = listSpec[modelColor]; 
      ifAdopt = true; 
    };

    // for( var i = 0 ; i < detailSpecColor.length ; i++ ){
    //     var modelColor = detailSpecModel[ind].name+'-'+detailSpecColor[i].name;
        
    //     if(listSpec[modelColor]){
    //       console.log(modelColor,listSpec[modelColor])
    //       detailSpecColor[i].select = true;
    //       ifAdopt = true;
    //       if(assignment){
    //         assignment = false;
    //         detailColorIndex = i;
    //         selectShell = listSpec[modelColor];                    
    //       }
    //     } else {
    //       detailSpecColor[i].select = false;
    //     };
    // }; 
    var zunmdata = this.data.zunmdata; 

    if(ifAdopt){
      console.log(1)
      
      zunmdata.gsale = selectShell.price || 0;
      zunmdata.gprice = selectShell.price || 0;
      zunmdata.debuff = 0;
      zunmdata.goods_thumb = selectShell.roleImg;

      if(zunmdata.status == 2){
        if(zunmdata.depositInfo && zunmdata.depositInfo[selectShell.roleId]){
          zunmdata.isDepositSubscribe = zunmdata.depositInfo[selectShell.roleId].isDepositSubscribe;
          console.log(zunmdata.isDepositSubscribe,zunmdata.depositInfo[selectShell.roleId].isDepositSubscribe)
          if(zunmdata.depositInfo[selectShell.roleId].orderSn){
            zunmdata.orderSn = zunmdata.depositInfo[selectShell.roleId].orderSn;
            zunmdata.isDisplayDeposit = true;
          }else{
            zunmdata.isDisplayDeposit = false;
          };
        }else{
          zunmdata.isDepositSubscribe = false;
          zunmdata.isDisplayDeposit = true;
        };
      }
      console.log('zunmdata.isDisplayDeposit',zunmdata.isDisplayDeposit)
      if(zunmdata.isDisplayDeposit){
        // 手机壳 并且 isSpecSoldOut 为 true 全部卖完
        if(selectShell.salesStatus == 1 && selectShell.realStock <= 0){
          zunmdata.debuff = 2;
        }else if( selectShell.stock <= 0 || zunmdata.isSpecSoldOut){
          zunmdata.debuff = 3;
        };
        if(zunmdata.totalSpecStock && selectShell.stock > zunmdata.totalSpecStock){
          this.data.totalSpecStock = zunmdata.totalSpecStock;
        }else{
          this.data.totalSpecStock = selectShell.stock;
        };

      };


      
      if(zunmdata.status == 3 && selectShell && zunmdata.depositInfo){
        console.log(3,selectShell)
        console.log(selectShell,zunmdata.depositInfo[selectShell.roleId])
        if(zunmdata.depositInfo[selectShell.roleId] && zunmdata.depositInfo[selectShell.roleId].balanceOrderSn){
          zunmdata.orderSn = zunmdata.depositInfo[selectShell.roleId].balanceOrderSn;
          zunmdata.orderAmount = zunmdata.depositInfo[selectShell.roleId].orderAmount;
        }else{
          zunmdata.orderSn = '';
          zunmdata.orderAmount = ''
        };
      };


      this.setData({
        modelSelInde:ind,
        numberofdismantling:1,
        selectShell,
        zunmdata:zunmdata,
        detailColorIndex,
        detailSpecColor
      })
      console.log(zunmdata)
    }else{
      console.log(2)
      var zunmdata = this.data.zunmdata; 
      if(zunmdata.status == 2){
        zunmdata.isDepositSubscribe = false;
        zunmdata.isDisplayDeposit = true;
      };

      if(zunmdata.status == 3 && zunmdata.depositInfo && selectShell.roleId){
        console.log(zunmdata.depositInfo[selectShell.roleId] , zunmdata.depositInfo[selectShell.roleId].balanceOrderSn)
        if(zunmdata.depositInfo[selectShell.roleId] && zunmdata.depositInfo[selectShell.roleId].balanceOrderSn){
          zunmdata.orderSn = zunmdata.depositInfo[selectShell.roleId].balanceOrderSn;
          zunmdata.orderAmount = zunmdata.depositInfo[selectShell.roleId].orderAmount;
        }else{
          zunmdata.orderSn = '';
          zunmdata.orderAmount = '';
        };
      };

      zunmdata.debuff = 3;
      this.setData({
        modelSelInde:ind,
        selectShell:{},
        zunmdata,
        detailSpecColor,
        numberofdismantling:1
      })

    };



    // var modelColor = detailSpecModel[e.detail.value].name+'-'+detailSpecColor[this.data.detailColorIndex].name;
    // if( listSpec[modelColor] && listSpec[modelColor].stock > 0 ){
    //   var zunmdata = this.data.zunmdata; 
    //   zunmdata.gsale = listSpec[modelColor].price || 0;
    //   zunmdata.gprice = listSpec[modelColor].price || 0;
    //   zunmdata.debuff = 0;
    //   zunmdata.goods_thumb = listSpec[modelColor].roleImg;
    //   this.setData({
    //     modelSelInde:e.detail.value,
    //     selectShell:listSpec[modelColor],
    //     zunmdata:zunmdata
    //   })
    // }else{
    //   var zunmdata = this.data.zunmdata; 
    //   zunmdata.debuff = 3;
    //   this.setData({
    //     modelSelInde:e.detail.value,
    //     selectShell:{},
    //     zunmdata,
    //   })

    // };
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
  livebroadcast:function(){
    var liveShowRoomId = this.data.zunmdata.liveShowRoomId;
    console.log(this.data.zunmdata.liveShowRoomId)
    wx.reLaunch({
      url: "plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id="+liveShowRoomId
    });
  },
  
  depositboxfun:function(){
    this.setData({
      depositbox:!this.data.depositbox
    })
  },
  jumpDSIE(){
    wx.navigateTo({
      url: "/page/secondpackge/pages/detailSimgEffects/detailSimgEffects?gid="+this.data.gid
    });
  },
  // 抽盒机详情页 
  addresssmokebox: function (event) {
    var gid = event.currentTarget.dataset.gid || event.target.dataset.gid;
    wx.navigateTo({
      url: "/pages/smokebox/smokebox?gid=" + gid
    });
  },
  // 抽盒机详情页 
  crowdfundingfun: function (event) {
    var gid = event.currentTarget.dataset.gid || event.target.dataset.gid;
    wx.navigateTo({
      url:"/page/component/pages/crowdfunding/crowdfunding?aid=" + gid,
    });
  },
  // vip 页面
  jumpVipPage: function (event) {
    wx.navigateTo({  
      url: "/page/secondpackge/pages/vipPage/vipPage"
    })
  },
  //时间戳转换时间  
  toDatehd: function (number) {
    var date = new Date(number * 1000);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    if (new Date(number * 1000).toDateString() === new Date().toDateString()) {
      return h + ':' + m;
    } else {
      return M + '-' + D + ' ' + h + ':' + m;;
    };
  },
  // 中奖提示倒计时
  winningtheprizetimedetail: function (clock) {
    var _this = this;
    var clock = clock;
    _this.data.wintheprtintervaldetail = setInterval(function () {
      //将时间传如 调用 
      var timestamp = Date.parse(new Date())
      //总的秒数 
      var second = clock - (timestamp / 1000);
      if (second > 0) {
        // 天位    
        var day = Math.floor(second / 3600 / 24);
        var dayStr = day.toString();
        if (dayStr.length == 1) dayStr = '0' + dayStr;
        // 小时位 
        var hr = Math.floor(second / 3600 % 24);
        var hrStr = hr.toString();
        if (hrStr.length == 1) hrStr = '0' + hrStr;
        // 分钟位  
        var min = Math.floor(second / 60 % 60);
        var minStr = min.toString();
        if (minStr.length == 1) minStr = '0' + minStr;
        // 秒位  
        var sec = Math.floor(second % 60);
        var secStr = sec.toString();
        if (secStr.length == 1) secStr = '0' + secStr;
        if (day == 0) {
          var h = {
            dayStr: 0,
            hrStr: hrStr,
            minStr: minStr,
            secStr: secStr,
          }
        } else {
          var h = {
            dayStr: dayStr,
            hrStr: hrStr,
            minStr: minStr,
            secStr: secStr,
          }
        }
        _this.setData({ //正常倒计时        
          winningovertimedetail: h
        });
      } else {
        setTimeout(()=>{
          clearInterval(_this.data.wintheprtintervaldetail);
          if (_this.data.iftrrefresh){
            _this.detailfunshop();
            _this.setData({iftrrefresh:false});
          };
        },1000)

      };
    }.bind(_this), 1000);
  },


  // 中奖提示倒计时
  countdownOfGifts: function (clock) {
    var _this = this;
    var clock = clock;
    _this.data.countdownofgifts = setInterval(function () {
      //将时间传如 调用 
      var timestamp = Date.parse(new Date())
      //总的秒数 
      var second = clock - (timestamp / 1000);
      if (second > 0) {
        // 天位    
        var day = Math.floor(second / 3600 / 24);
        var dayStr = day.toString();
        if (dayStr.length == 1) dayStr = '0' + dayStr;
        // 小时位 
        var hr = Math.floor(second / 3600 % 24);
        var hrStr = hr.toString();
        if (hrStr.length == 1) hrStr = '0' + hrStr;
        // 分钟位  
        var min = Math.floor(second / 60 % 60);
        var minStr = min.toString();
        if (minStr.length == 1) minStr = '0' + minStr;
        // 秒位  
        var sec = Math.floor(second % 60);
        var secStr = sec.toString();
        if (secStr.length == 1) secStr = '0' + secStr;
        if (day == 0) {
          var h = {
            dayStr: 0,
            hrStr: hrStr,
            minStr: minStr,
            secStr: secStr,
          }
        } else {
          var h = {
            dayStr: dayStr,
            hrStr: hrStr,
            minStr: minStr,
            secStr: secStr,
          }
        }
        _this.setData({ //正常倒计时        
          cog: h
        });
      } else {
        clearInterval(_this.data.countdownofgifts);
        _this.detailfunshop();
      };
    }.bind(_this), 1000);
  },
  // 拉起订阅
  subscrfun: function (w) {
    var _this = this;
    console.log(w)
    var ind = 0;
    if(w && w.currentTarget && w.currentTarget.dataset && w.currentTarget.dataset.ind){
      ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    };
    
    if(ind == 'sup2' && _this.data.zunmdata.supple){  // 售罄之后 我想要订阅
      var subscribedata = _this.data.zunmdata.supple.suppleSubscibe || '';
      _this.data.id =  _this.data.zunmdata.supple.suppleSubscibeId || '';
    }else if(_this.data.specialGoods == 1 && (_this.data.zunmdata.debuff==3 || ind ==1 )){
      var subscribedata = _this.data.specSubscribe || '';
    }else{
      var subscribedata = _this.data.subscribedata || '';
    };
    
    if (subscribedata && subscribedata.template_id && app.signindata.subscribeif) {
      if (subscribedata.template_id instanceof Array) {
        wx.requestSubscribeMessage({
          tmplIds: subscribedata.template_id || [],
          success(res) {
            var is_show_modal = true;
            for (var i = 0; i < subscribedata.template_id.length; i++) {
              if (res[subscribedata.template_id[i]] == "accept") {
                if(_this.data.specialGoods == 1 && _this.data.zunmdata.debuff == 3){  // 手机壳 要传订阅的是哪款
                  app.subscribefun(_this, 0, subscribedata.template_id[i], subscribedata.subscribe_type[i],_this.data.selectShell.roleId ||'');
                }else{
                  app.subscribefun(_this, 0, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
                }
                
                if (is_show_modal) {
                  _this.subshowmodalfun();
                  is_show_modal = false;
                  if(ind == 'sup2' && _this.data.zunmdata.supple){
                     _this.setData({
                       ['zunmdata.supple.isSubscribe']:true
                     })
                  }
                };
              };
            };
          },
          complete() { }
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

    var zunmdata = this.data.zunmdata || {};
    if(zunmdata.arrSeries && zunmdata.arrSeries.length!=0 && zunmdata.status==1){
      this.setData({
        tipback: true,
        dsbframeiftr: true,
        judgmentactivity: 1,
      });
    }

  },
  subshowmodalfun: function () {
    var _this = this;
    wx.showModal({
      title: '提示',
      content: '订阅成功',
      showCancel: false,
      success: function (res) {
        _this.setData({
          subscribeCouponTip: '',
          isSubscribeCoupon: false
        })
      }
    })
  },
  detaposiiftrfun:function(){
    this.setData({ detaposiiftr: !this.data.detaposiiftr});
  },
  detailbutnumfun:function(w){
    var detailbutnum = w.currentTarget.dataset.detailbutnum || w.target.dataset.detailbutnum||1;
    this.setData({ detailbutnum: detailbutnum});
  },
  // 阻止蒙层冒泡
  preventD() { },
  newhbfun: function () {
    this.setData({
      newcoupon: !this.data.newcoupon
    });
  },
  // 新人获取优惠券弹框
  swfcanimgcou: function () {
    this.setData({
      newcoupon: !this.data.newcoupon
    });
  }, 
  closewelfare:function(){
    this.setData({
      ishowwelfare:false,
    })
  },
  showwel:function(){
    this.setData({
      ishowwelfare: true,
    })
  },
  /**
   * 绘制多行文本
   */
  drawText: function (ctx, str, initHeight, lineHeight, beginWidth, canvasWidth) {
    var line = 0;
    var lineWidth = 0;
    var dotWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      if (line > 0) {
        dotWidth = ctx.measureText('.').width * 6;
      }
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth + beginWidth + dotWidth >= canvasWidth) {
        if (line > 0 && i < str.length - 1) {
          ctx.fillText(str.substring(lastSubStrIndex, i) + '...', beginWidth + 0, initHeight);//绘制截取部分
        } else {
          ctx.fillText(str.substring(lastSubStrIndex, i), beginWidth + 0, initHeight);//绘制截取部分
        }
        initHeight += lineHeight;//20为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
        beginWidth = 0;
        line += 1;
      }
      if (i == str.length - 1) {//绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), beginWidth + 0, initHeight);
      }
      if (line > 0 + 1) {
        break;
      }
    }
    return lineWidth
  },
  /**
   * 生成截图
   */
  getSnapshot: function () {
    var _this = this;
    wx.getImageInfo({
      src: _this.data.zdyurl + _this.data.zunmdata.goods_share,
      success: function (res) {
        const ctx = wx.createCanvasContext('snapshot')
        let dw = 300
        // let dh = 180
        let dh = 260
        var width = res.width
        var height = res.height
        var scale = height / dh
        ctx.setFillStyle('#fff')
        ctx.fillRect(0, 0, dw, 240)
        ctx.drawImage(res.path, (dw - width / scale) / 2, 0, width / scale, dh);
        ctx.draw(true, setTimeout(function () {
          wx.canvasToTempFilePath({
            canvasId: 'snapshot',
            success: function (res) {
              _this.setData({
                snapshot: res.tempFilePath
              })
            },
            fail: function (res) {
            },
          });
        }, 300));
      }
    })
  },
  // 监听scrolltop高度
  articelScroll:function(w){
    this.setData({
      scrollHeight: w.detail.scrollTop
    });
  },
  // 点击改变scrolltop高度
  slider1change: function (e) {                 //获取slider滑动的当前值
    var scrollHeight = this.data.scrollHeight;
    scrollHeight+=50;
    this.setData({
      scrollHeight: scrollHeight
    })
  }, 
  // 活动隐藏一级弹框
  combforkheadimg:function(){
    this.setData({
      tipback: false,
    })
  },
  // 查看订单
  viewtheorder:function(){
    wx.navigateTo({   
      url: "/pages/myorder/myorder?tabnum=0"
    });        
  }, 
  // 返回首页
  returntothehomepage:function(){
    wx.reLaunch({
      url: "/pages/index/index"
    });
  },
  passWOnBlur:function(){
    console.log('失去焦点')
    var _this = this;
    var zunmdata = this.data.zunmdata;
    if(_this.data.descpassword && (zunmdata.arrCommand.indexOf(_this.data.descpassword) > -1)){
      
      var relCommandAwarda = zunmdata.relCommandAward || {};
      var nameValue = relCommandAwarda[_this.data.descpassword];
      console.log('口令值判断=====',nameValue)

    }
  },
  qandanswerquestions:function(){
    var _this = this;
    var zunmdata = this.data.zunmdata;
    // if(zunmdata.isCommand){
    //   if(_this.data.descpassword == ''){
    //     _this.placeorder();
    //   }else if (zunmdata.arrCommand.indexOf(_this.data.descpassword) > -1){
    //     _this.placeorder();
    //   }else{
    //     wx.showModal({
    //       content: '输入口令错误',
    //       cancelText: '重新输入',
    //       confirmText: '直接支付',
    //       confirmColor:'#000',
    //       cancelColor: '#000',
    //       success: function (res) {
    //         if (res.confirm) {
    //           _this.placeorder();
    //         }
    //       }
    //     }) 
    //   }

    // }else 
    if(zunmdata.isNeedConfirm){
        this.closeCommonTip();
        return false;
    };

    if(!_this.data.isShareGood && _this.data.desc==''){
      app.showToastC('请填写品牌信息及联系方式');
      return false;
    }

    if (zunmdata.additional_type==2&&zunmdata.option){
      wx.showModal({
        title: '限购答题',
        content: zunmdata.subject,
        cancelText: zunmdata.option[0],
        confirmText: zunmdata.option[1],
        confirmColor:'#000',
        cancelColor: '#000',
        success: function (res) {
          if (res.confirm) {
            if (zunmdata.option[1] == zunmdata.anwer){
              _this.placeorder();
            }else{
              app.showToastC('回答错误');
              return false;
            }
          }else{
            if (zunmdata.option[0] == zunmdata.anwer) {
              _this.placeorder();
            }else{
              app.showToastC('回答错误');
              return false;
            }            
          }
        }
      })
    }else{
      _this.placeorder();
    }
  },
  // 提交订单
  placeorder:function(){
    var _this = this;
    if (!this.data.radioagreement){
      app.showToastC('请同意并接受协议');
      return false;
    };
    // 验证地址
    if (this.data.tipaid == '') {
      app.showToastC('请选择地址');
      return false;
    };    
    // 判断是否是海外购 填写身份证
    var isisdefaultdata = false;
    if (this.data.judgmentactivity == 1){
      if (_this.data.zunmdata.isabroad == 1){
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
    }else{
      var zunmdata = this.data.combdataimg.goods_detial;
      var iftrisabroad = false;
      for (var i = 0; i < zunmdata.length; i++) {
        if (zunmdata[i].imgiftr) {
          if (zunmdata[i].isabroad==1){
             iftrisabroad = true;
          };
        };
      };
      if (iftrisabroad){
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
    };
    if (isisdefaultdata){  //海外购身份证号验证
        _this.setData({
          idnumberboxiftr: !_this.data.idnumberboxiftr
        }); 
        return false; 
    }; 
    if(this.data.judgmentactivity==1){
      var gid = _this.data.gid;
      var color = _this.data.colorid || 0;
      var size = _this.data.sizeid || 0;
      
      var aid = _this.data.tipaid;
      var cid = [];
      if (_this.data.coudata1cid != '') { cid.push(_this.data.coudata1cid); };
      if (_this.data.coudata2cid != '') { cid.push(_this.data.coudata2cid); };
      var cid = cid.join();
      if(_this.data.zunmdata.wholeBox&&_this.data.zunmdata.is_suit==1){
        var count = _this.data.numberofdismantling*_this.data.isBlindBoxNum;
        
        if(_this.data.isBlindBoxNum>1){
          var isWholeSuit = 1;
        }else{
          var isWholeSuit = 0;
        };
        
        console.log(11,count,_this.data.numberofdismantling,_this.data.isBlindBoxNum,'isWholeSuit=='+isWholeSuit)

        var ginfo = [{ gid: gid, color: color, size: size, count: count,isWholeSuit:isWholeSuit, rec_goods_id: (_this.data.rec_goods_id || 0), rec_cart_id: (_this.data.rec_cart_id || 0), 'referee': _this.data.referee,specRoleId:_this.data.selectShell.roleId ||'' }];

      }else{
        var count = _this.data.numberofdismantling;
        console.log(22,count)

        var ginfo = [{ gid: gid, color: color, size: size, count: count, rec_goods_id: (_this.data.rec_goods_id || 0), rec_cart_id: (_this.data.rec_cart_id || 0), 'referee': _this.data.referee ,specRoleId:_this.data.selectShell.roleId ||''}];

      };

      ginfo = JSON.stringify(ginfo);
      console.log(ginfo)
    }else{
      var zunmdata = this.data.combdataimg.goods_detial;
      var ginfo = [];
      for (var i = 0; i < zunmdata.length; i++) {
        if (zunmdata[i].imgiftr) {
          ginfo.push({ gid: zunmdata[i].goods_id, color: zunmdata[i].colorid || 0, size: zunmdata[i].sizeid || 0, count: zunmdata[i].numberofdismantling, store_id: zunmdata[i].store_id || 0, 'group_id': _this.data.href ,specRoleId:_this.data.selectShell.roleId ||''});
        };
      };
      var gcount = zunmdata.length;
      var aid = _this.data.tipaid;
      var cid = [];
      if (_this.data.coudata1cid != '') { cid.push(_this.data.coudata1cid); };
      if (_this.data.coudata2cid != '') { cid.push(_this.data.coudata2cid); };
      var cid = cid.join();
      ginfo = JSON.stringify(ginfo);      
    };
    // 提交订单蒙层
    _this.setData({
      suboformola:true
    });

   

    var q = Dec.Aese('mod=order&operation=carorder&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&gcount=1&aid=' + aid + '&cid=' + cid + '&ginfo=' + ginfo + '&desc=' + _this.data.desc + '&gdt_vid=' + _this.data.gdt_vid + '&weixinadinfo=' + _this.data.weixinadinfo + '&roomId=' + _this.data.room_id+'&command='+_this.data.descpassword+'&isDeduct='+_this.data.isDeductNum);

    console.log('mod=order&operation=carorder&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&gcount=1&aid=' + aid + '&cid=' + cid + '&ginfo=' + ginfo + '&desc=' + _this.data.desc + '&gdt_vid=' + _this.data.gdt_vid + '&weixinadinfo=' + _this.data.weixinadinfo + '&roomId=' + _this.data.room_id+'&command='+_this.data.descpassword+'&isDeduct='+_this.data.isDeductNum)

    wx.request({
      url: app.signindata.comurl + 'goods.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {  
        if (res.data.ReturnCode == 200) {
          _this.setData({
            tipbacktwo: true,
            buybombsimmediately: true,
            receivingaddress: false,
            couponprojectile: false,
            cart_id: res.data.Info.cart_id,
            hamount: res.data.Info.amount,
            paymentiftr:false,
            payment: res.data.Info.amount,
          });
          // 微信支付
          _this.paymentmony()
        }else if(res.data.ReturnCode == 400){
          _this.setData({
            tipbacktwo: false,
            buybombsimmediately: false,                        
            tipback: false,
            dsbframeiftr: false,
            paymentiftr: false, 
            // 优惠券清空
            tipcoupon: '请选择优惠券',
            coudata1cid: '',
            coudata1mon:'0.00',
            coudata2cid: '',
            coudata2mon:'0.00', 
            numberofdismantling:1,
            isBlindBoxNum:1,
            //  活动支付完成隐藏弹框
            suboformola: false,
            desc: '',
            descpassword:''                       
          }); 
          wx.showModal({
            content: res.data.Msg || res.data.msg,
            showCancel:false,
            success: function (res) {
              wx.navigateTo({  
                url: "/pages/myorder/myorder?tabnum=0"
              });
            }
          })          
        }else{
          // 提交订单蒙层
          _this.setData({
            suboformola: false
          });          
          wx.showModal({
            title: '提示',
            content: res.data.Msg,
            showCancel: false,
            success: function (res) { }
          })
        };
      }
    })
  },
  // 点击取消支付页
  paymentboxheadfun:function(){
    var _this = this;
    wx.showModal({
      title: '确定放弃支付吗？',
      content: '个人中心-我的订单-继续支付\n付款成功后，才可以拆单成功',
      success: function (res) {
        if (res.confirm) {
          _this.setData({
            tipback: false,
            dsbframeiftr: false,
            paymentiftr: false,
          })
        }
      }
    }) 
  },
  // 支付尾款
  paythebalance:function(){
    var _this = this;
    _this.data.cart_id = _this.data.zunmdata.orderSn || '';
    console.log('支付尾款=====',_this.data.cart_id)
    if(_this.data.zunmdata.isNeedConfirm){

      this.closeCommonTip();
      return false;
    };
    _this.paymentmony();
  },
  // 微信支付
  paymentmony:function(){
    var _this = this; 

    console.log('微信支付===','mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + _this.data.cart_id + '&xcx=1' + '&openid=' + _this.data.openid)

    var q = Dec.Aese('mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + _this.data.cart_id + '&xcx=1' + '&openid=' + _this.data.openid)
    wx.request({
      url: app.signindata.comurl + 'order.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
              // 支付完成弹框显示数据
              var shareinfo=res.data.Shareinfo;
              var payinfo = res.data.Info;
              if (shareinfo){
                for (var f = 0; f < shareinfo.length;f++){
                  if (!app.signindata.reg.test(shareinfo[f].img)) {
                    shareinfo[f].img = _this.data.zdyurl + shareinfo[f].img;
                  };
                  shareinfo[f].name = shareinfo[f].name.replace(/\\n/g, '\n');
                };
                _this.setData({ shareinfo: shareinfo});
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
                        tipbacktwo: false,
                        buybombsimmediately: false,                        
                        tipback: false,
                        dsbframeiftr: false,
                        paymentiftr: false, 
                        // 优惠券清空
                        tipcoupon: '请选择优惠券',
                        coudata1cid: '',
                        coudata1mon:'0.00',
                        coudata2cid: '',
                        coudata2mon:'0.00', 
                        numberofdismantling:1,
                        isBlindBoxNum:1,
                        //  活动支付完成隐藏弹框
                        suboformola: false,
                        desc: '',
                        descpassword:''                       
                      });   
                    var zunmdata = _this.data.zunmdata;
                    var cart_id = _this.data.cart_id || '0';
                    var goods_id = zunmdata.gid || '0';
                    var goods_name = zunmdata.gname  || '0';
                    var gsale = zunmdata.gsale || '0';
                    var goods_share = zunmdata.gimages[0] || '0';
                    var pre_name = zunmdata.pre_name || '0';
                    var ds = zunmdata.ds || '0';                    
                    var snapshot = _this.data.snapshot || '';
                    var sharename = _this.data.zunmdata.goodsDesc ||'';
                    var title = '分享给你一个实用好物，[' + sharename + ']更便宜！';

                    // 订阅授权
                    if(zunmdata.goods_type==3){
                       _this.subscrfun();
                       // 商品详情
                       _this.detailfunshop();                       
                    }else{
                      app.comsubscribe(_this);
                    };
                    

                    if (payinfo.isFreeBuyOrder) {
                      wx.navigateTo({
                        url: "/page/component/pages/hidefun/hidefun?type=1&cart_id=" + _this.data.cart_id
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
                  'fail':function(res){
                      _this.setData({
                        tipback: false,
                        tipbacktwo: false,
                        buybombsimmediately: false,
                        dsbframeiftr: false,
                        paymentiftr: false,
                        // 优惠券清空
                        tipcoupon: '请选择优惠券',
                        coudata1cid: '',
                        coudata1mon: '0.00',
                        coudata2cid: '',
                        coudata2mon:'0.00',
                        numberofdismantling: 1,
                        isBlindBoxNum:1,
                        //  活动支付完成隐藏弹框
                        suboformola: false,
                        desc: '',
                        descpassword:''                                                                          
                      })
                      if(_this.data.zunmdata.goods_type==3){
                        // 商品详情
                        _this.detailfunshop();                       
                      }
                   },
                  'complete': function (res) {}
                })
        }else{
          // 提交订单蒙层
          _this.setData({
            suboformola: false
          });     
          app.showModalC(res.data.Msg || res.data.msg || '')     
        };   
      }
    })
  },

  // 组合 活动二提交金额计算
  hdramountcalculation: function () {
    var _this = this;
    var comzund = this.data.combdataimg.goods_detial;
    var iftrzk = this.data.combdataimg;
    // 税费
    var txton = 0;
    var compric = 0;
    var carriagearr = [];
    var shop_num = 0;
    // 判断是否全选
    var iftrnum = 0;
    for (var c = 0; c < comzund.length; c++) {
      if (comzund[c].imgiftr) {
        iftrnum++;
      };
    };
    if (iftrzk.sale_type == 1) {
      for (var i = 0; i < comzund.length; i++) {
        if (comzund[i].imgiftr) {
          txton += parseFloat(comzund[i].tax || 0).toFixed(2) * parseFloat(comzund[i].numberofdismantling).toFixed(2);
          compric += parseFloat(comzund[i].gsale).toFixed(2) * parseFloat(comzund[i].numberofdismantling).toFixed(2);
          carriagearr.push(comzund[i].carriage);
          shop_num += parseFloat(comzund[i].numberofdismantling);
        };
      };
    } else {
      if (iftrzk.countGoods == iftrnum) {
        for (var i = 0; i < comzund.length; i++) {
          if (comzund[i].imgiftr) {
            txton += parseFloat(comzund[i].goods_tax || 0).toFixed(2) * parseFloat(comzund[i].numberofdismantling).toFixed(2);
            compric += parseFloat(comzund[i].goods_price).toFixed(2) * parseFloat(comzund[i].numberofdismantling).toFixed(2);
            carriagearr.push(comzund[i].carriage);
            shop_num += parseFloat(comzund[i].numberofdismantling);
          };
        };
      } else {
        for (var i = 0; i < comzund.length; i++) {
          if (comzund[i].imgiftr) {
            txton += parseFloat(comzund[i].tax || 0).toFixed(2) * parseFloat(comzund[i].numberofdismantling).toFixed(2);
            compric += parseFloat(comzund[i].gsale).toFixed(2) * parseFloat(comzund[i].numberofdismantling).toFixed(2);
            carriagearr.push(comzund[i].carriage);
            shop_num += parseFloat(comzund[i].numberofdismantling);
          };
        };
      };
    };
    var compriciftr = parseFloat(compric).toFixed(2);
    // compric = compric;
    var compricbj = compric - parseFloat(_this.data.coudata2mon).toFixed(2);
    // 运费
    var max3 = carriagearr.sort().reverse()[0];
    var acc = 0;
    var freightiftr = '0.00';
    var xianshi = '0.00';
    if ((this.data.defaultinformation.carriage.free || "99") != '-1') {
      var tddefcarfr = parseFloat(_this.data.defaultinformation.carriage.free || "99")
      if (compricbj >= tddefcarfr) {
        acc = 0;
        freightiftr = 0;
        xianshi = '满￥' + parseFloat(this.data.defaultinformation.carriage.free || "99").toFixed(2) + '包邮';
      } else if (shop_num >= parseFloat(this.data.defaultinformation.carriage.freeMCPieces)) {
        if (this.data.defaultinformation.carriage.freeMCPieces == 1) {
          acc = 0;
          freightiftr = 0;
          xianshi = '限时包邮';
        } else {
          acc = 0;
          freightiftr = 0;
          xianshi = '商品包邮';
        }
      } else {
        var tdzuncar = max3;
        freightiftr = parseFloat(tdzuncar);
        xianshi = '￥' + parseFloat(tdzuncar).toFixed(2);
        acc = parseFloat(tdzuncar) > parseFloat(_this.data.coudata1mon) ? parseFloat(tdzuncar) - parseFloat(_this.data.coudata1mon) : 0;
      };
    } else {
      var tdzuncar = max3;
      freightiftr = parseFloat(tdzuncar);
      xianshi = '￥0.00';
      acc = parseFloat(tdzuncar) > parseFloat(_this.data.coudata1mon) ? parseFloat(tdzuncar) - parseFloat(_this.data.coudata1mon) : 0;
    };
    // 应付金额
    var _this = this;
    if (this.data.coupon_type==2){
      var ap = compric * (parseFloat(_this.data.coudata2mon)/10) + acc + txton;
      var coudata2mondiscount = compric - (compric * (parseFloat(_this.data.coudata2mon) / 10))
      this.setData({
        coudata2mondiscount: coudata2mondiscount.toFixed(2) || '0'
      });
    }else{
      var ap = compric - parseFloat(_this.data.coudata2mon) + acc + txton;
    }
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
      // freight: acc,
      freight: xianshi,
      freightiftr: freightiftr,
      // 商品价格
      commodityprice: compric.toFixed(2),
      // 满减优惠券的使用判断
      commoditypriceiftr: compriciftr,
      // 税费
      taxation: txton.toFixed(2)
    });
  },
  // 金额计算
  amountcalculation:function(){
    var _this = this;
    var zunmdata = this.data.zunmdata || {};
    // 税费
    var txton = parseFloat(zunmdata.tax || 0) * parseFloat(this.data.numberofdismantling); 
     
     // 运费 
    var acc = 0;
    var xianshi = '0.00';
    var freightiftr = '0.00';


    // if(_this.data.zunmdata.isBlindBox){
      // 商品价格
      var compric = parseFloat(zunmdata.gsale) * parseFloat(this.data.numberofdismantling)*parseFloat(this.data.isBlindBoxNum);   
      var compricbj = parseFloat(zunmdata.gsale) * parseFloat(this.data.numberofdismantling)*parseFloat(this.data.isBlindBoxNum) - parseFloat(this.data.coudata2mon); 
      // 商品个数
      var mcnum = parseInt(this.data.numberofdismantling)*parseFloat(this.data.isBlindBoxNum);
    // }else{
    //   // 商品价格
    //   var compric = parseFloat(console.log()zunmdata.gsale) * parseFloat(this.data.numberofdismantling);   
    //   var compricbj = parseFloat(zunmdata.gsale) * parseFloat(this.data.numberofdismantling) - parseFloat(this.data.coudata2mon); 
    //   // 商品个数
    //   var mcnum = parseInt(this.data.numberofdismantling);
    // }
    if ((this.data.defaultinformation.carriage.free||"99")!='-1'){
      var tddefcarfr = parseFloat(this.data.defaultinformation.carriage.free||"99");
      if (mcnum >= parseFloat(this.data.defaultinformation.carriage.freeMCPieces)) {
        if (this.data.defaultinformation.carriage.freeMCPieces==1){
          acc = 0;
          freightiftr = 0;
          xianshi = '限时包邮'; 
        }else{
          acc = 0;
          freightiftr = 0;
          xianshi = '商品包邮';          
        };
      }else if (compricbj>=tddefcarfr){
            acc = 0;
            freightiftr = 0;
            xianshi = '满￥' + parseFloat(this.data.defaultinformation.carriage.free||"99").toFixed(2) + '包邮';
      }else{
        if (zunmdata.carriage !== '') {
          var tdzuncar = zunmdata.carriage;
        } else {
          var tdzuncar = this.data.defaultinformation.carriage.d;
        };        
        xianshi = '￥' + parseFloat(tdzuncar).toFixed(2);
        freightiftr = parseFloat(tdzuncar);
        acc = parseFloat(tdzuncar) > parseFloat(this.data.coudata1mon) ? parseFloat(zunmdata.carriage) - parseFloat(this.data.coudata1mon) : 0;
      };  
    }else{
        if (zunmdata.carriage !== '') {
          var tdzuncar = zunmdata.carriage;
        } else {
          var tdzuncar = this.data.defaultinformation.carriage.d;
        };      
        xianshi = '￥0.00';
        freightiftr = parseFloat(tdzuncar);
        acc = parseFloat(tdzuncar) > parseFloat(this.data.coudata1mon) ? parseFloat(zunmdata.carriage) - parseFloat(this.data.coudata1mon) : 0;
    };
     // 应付金额
    var _this = this;
    if (this.data.coupon_type==1){
      // if(_this.data.zunmdata.isBlindBox){
        var ap = parseFloat(zunmdata.gsale) * parseFloat(this.data.numberofdismantling)*parseFloat(this.data.isBlindBoxNum) - parseFloat(this.data.coudata2mon) + acc + txton;
      // }else{
      //   var ap = parseFloat(zunmdata.gsale) * parseFloat(this.data.numberofdismantling) - parseFloat(this.data.coudata2mon) + acc + txton;
      // }

    }else{
      
      // if(_this.data.zunmdata.isBlindBox){
        var ap = parseFloat(zunmdata.gsale) * parseFloat(this.data.numberofdismantling) *parseFloat(this.data.isBlindBoxNum)* (parseFloat(this.data.coudata2mon) / 10) + acc + txton;
        var coudata2mondiscount = (parseFloat(zunmdata.gsale) * parseFloat(this.data.numberofdismantling)*parseFloat(this.data.isBlindBoxNum)) - parseFloat(zunmdata.gsale) * parseFloat(this.data.numberofdismantling) * (parseFloat(this.data.coudata2mon) / 10)
        this.setData({
          coudata2mondiscount: coudata2mondiscount.toFixed(2)||'0'
        })
      // }else{
      //   var ap = parseFloat(zunmdata.gsale) * parseFloat(this.data.numberofdismantling) * (parseFloat(this.data.coudata2mon) / 10) + acc + txton;
      //   var coudata2mondiscount = (parseFloat(zunmdata.gsale) * parseFloat(this.data.numberofdismantling)) - parseFloat(zunmdata.gsale) * parseFloat(this.data.numberofdismantling) * (parseFloat(this.data.coudata2mon) / 10)
      //   this.setData({
      //     coudata2mondiscount: coudata2mondiscount.toFixed(2)||'0'
      //   })       
      // };
    }
    if (ap <=0){
        ap=0;
    };

    // 定金
    if(zunmdata.goods_type==3){
      ap = parseFloat(zunmdata.promote_price) * parseFloat(this.data.numberofdismantling) || 0;
      xianshi = '￥0.00';
      freightiftr = 0;
      txton = 0.00;
    }

    console.log(ap,xianshi,freightiftr,compric,mcnum)

    let useblindAmountpayable = this.data.blindboxMoney>(ap.toFixed(2)*this.data.deductRatio)?ap.toFixed(2)*this.data.deductRatio:this.data.blindboxMoney;
    let amountpayable = this.data.blindboxMoney!=0? this.data.isDeduct? this.data.isUseBlindboxMoney? (ap.toFixed(2)-useblindAmountpayable).toFixed(2) :ap.toFixed(2) :ap.toFixed(2) :ap.toFixed(2);

    this.setData({
      // 应付金额
      amountpayable:amountpayable,
      // 原始应付金额
      originalAmountpayable: ap.toFixed(2),
      // 使用抽盒金后应付金额
      useblindAmountpayable: parseFloat(useblindAmountpayable).toFixed(3).slice(0,-1),
      // 运费
      // freight: acc,
      freight: xianshi,
      freightiftr: freightiftr,
      // 商品价格
      commodityprice: compric.toFixed(2),
      // 税费
      taxation: txton.toFixed(2)
    });     
  },
  // 抽盒机规则选择
  isBlindBoxsel:function(w){
    var index = w.currentTarget.dataset.no || w.target.dataset.no;
    var taxation = parseFloat(index) * parseFloat(this.data.zunmdata.tax||0);  
    var zunmdata = this.data.zunmdata;

    if (this.data.totalSpecStock && this.data.totalSpecStock > index) {
        app.showToastC('该商品最多购买' + this.data.totalSpecStock + '件');
        return false;
    };

    if (zunmdata.limitBuy > 0) {
      if (index > zunmdata.limitBuy) {
        app.showToastC('该商品限购' + zunmdata.limitBuy + '件');
        return false;
      };
    };
    if (index>this.data.quantityofgoods){
      app.showToastC('选中数量不能超过库存');
      return false;
    };
    this.setData({
      isBlindBoxNum: index,
      taxation: taxation.toFixed(2)
    });
  },
  // 选择拆单数量
  comissuitsel:function(w){ 
    var index = w.currentTarget.dataset.no || w.target.dataset.no;
    var taxation = parseFloat(index) * parseFloat(this.data.zunmdata.tax||0);  
    var zunmdata = this.data.zunmdata;
    if (zunmdata.limitBuy > 0) {
      if (index > zunmdata.limitBuy) {
        app.showToastC('该商品最多一次性购买' + zunmdata.limitBuy + '件');
        return false;
      };
    };
    if (index>this.data.quantityofgoods){
      app.showToastC('选中数量不能超过库存');
      return false;
    };
    this.setData({
      numberofdismantling: index,
      taxation: taxation.toFixed(2)
    });
  },
  // 选择颜色型号
  comcolorsel:function(w){
    var _this = this;
    var index = w.currentTarget.dataset.no || w.target.dataset.no;
    var property = w.currentTarget.dataset.property || w.target.dataset.property;
    var zunmdata = _this.data.zunmdata;
    var stringcs = 'c' + index + '_' + _this.data.sizeid;
    if (zunmdata.extends[stringcs]){}else{return false;};
    zunmdata.gsale = zunmdata.extends[stringcs].price;
    _this.data.quantityofgoods = zunmdata.extends[stringcs].num;
    zunmdata.tax = zunmdata.extends[stringcs].tax||0;
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    if (zunmdata.extends[stringcs].img != 0 && zunmdata.extends[stringcs].img != '' && zunmdata.extends[stringcs].img){
      if (!reg.test(zunmdata.extends[stringcs].img)) {
        zunmdata.goods_thumb = _this.data.zdyurl + zunmdata.extends[stringcs].img;
      } else {
        zunmdata.goods_thumb = zunmdata.extends[stringcs].img;
      };
    };
    this.setData({
      colorid: index, 
      colorcon: property,
      zunmdata: zunmdata,
      quantityofgoods: _this.data.quantityofgoods
    });
    var gid = parseInt(zunmdata.extends[stringcs].belong_goods_id);
    if (gid != '' && gid != 0 && gid != _this.data.gid && gid){
      _this.setData({gid:gid});
      _this.adjdatagid();
    };
  },
  // 选择尺寸
  comsizesel:function(w){
    var _this = this;
    var index = w.currentTarget.dataset.no || w.target.dataset.no;
    var property = w.currentTarget.dataset.property || w.target.dataset.property;
    var zunmdata = _this.data.zunmdata;
    var stringcs = 'c' + _this.data.colorid + '_' + index;
    if (zunmdata.extends[stringcs]){}else{return false;};
    zunmdata.gsale = zunmdata.extends[stringcs].price;
    _this.data.quantityofgoods = zunmdata.extends[stringcs].num;
    zunmdata.tax = zunmdata.extends[stringcs].tax||0;
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    if (zunmdata.extends[stringcs].img != 0 && zunmdata.extends[stringcs].img != '' && zunmdata.extends[stringcs].img){
      if (!reg.test(zunmdata.extends[stringcs].img)) {
        zunmdata.goods_thumb = _this.data.zdyurl + zunmdata.extends[stringcs].img;
      } else {
        zunmdata.goods_thumb = zunmdata.extends[stringcs].img;
      }; 
    };
    this.setData({
      sizeid: index,
      sizecon: property,
      zunmdata: zunmdata,
      quantityofgoods: _this.data.quantityofgoods
    });
    var gid = parseInt(zunmdata.extends[stringcs].belong_goods_id);
    if (gid != '' && gid != 0 && gid != _this.data.gid && gid) {
      _this.setData({gid: gid});
      _this.adjdatagid();
    };    
  },

  switchProducts:function(w){
      var _this = this;
      var gid = w.currentTarget.dataset.gid || w.target.dataset.gid;
      console.log(gid,_this.data.gid)
      if (gid != '' && gid != 0 && gid != _this.data.gid && gid) {
        // _this.setData({gid: gid});
        // _this.adjdatagid();
        wx.redirectTo({
          url: "/pages/detailspage/detailspage?gid=" + gid
        });        
      }; 
  },
  // 颜色尺寸根据gid不同从新加载数据
  adjdatagid:function(){
    var _this = this;
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    var q = Dec.Aese('mod=getinfo&operation=info&gid=' + _this.data.gid + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'goods.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          if (!reg.test(res.data.Ginfo.goods_thumb)) {
            res.data.Ginfo.goods_thumb = _this.data.zdyurl + res.data.Ginfo.goods_thumb;
          };
          // 颜色
          if (res.data.Ginfo.color) {
            if (res.data.Ginfo.color.length != 0) {
            }
          } else {
            res.data.Ginfo.color = [];
          };
          // 尺寸
          if (res.data.Ginfo.size) {
            if (res.data.Ginfo.size.length != 0) {
            };
          } else {
            res.data.Ginfo.size = [];
          };
          // 商品库存
          var exstring = 'c' + _this.data.colorid + '_' + _this.data.sizeid;
          if (res.data.Ginfo.extends[exstring]){
            _this.setData({
              quantityofgoods: res.data.Ginfo.extends[exstring].num
            });
          }else{
            _this.setData({
              quantityofgoods:999
            });            
          };
          // 是否点赞
          if (res.data.Ginfo.praise == 1) {
            _this.data.gttu=true;
          } else {
            _this.data.gttu=false;
          }
          // 是否是多件装
          var issuit = [];
          if (res.data.Ginfo.is_suit == 1) {
            for (var s = 0; s < res.data.Ginfo.suit_num; s++) {
              issuit.push(s + 1);
            };
            res.data.Ginfo.issuit = issuit;
          } else {
            res.data.Ginfo.issuit = [];
          };
          var redauin = res.data.Ginfo;
          var imgArr = [];
          for (var j = 0; j < res.data.Ginfo.gimages.length; j++) {
            if (!reg.test(res.data.Ginfo.gimages[j].url)) {
              res.data.Ginfo.gimages[j].url = _this.data.zdyurl + res.data.Ginfo.gimages[j].url;
            };
            imgArr.push(res.data.Ginfo.gimages[j].url)
          }
          redauin.gdesc = decodeURIComponent(redauin.gdesc.replace(/\+/g, ' '));
          WxParse.wxParse('article', 'html', redauin.gdesc, _this, 0);
          redauin.retailer_url = decodeURIComponent(redauin.retailer_url)
          if (redauin.gnum != 0) {
            _this.cdtime(res.data.Ginfo.overtime);
          };
          _this.data.imgArr=imgArr;
          _this.setData({
            movies: res.data.Ginfo.gimages,
            zunmdata: redauin,
            taxation: redauin.tax||0,
            isVideoSwiper: res.data.Ginfo.videoBanner || false,
            isSubscribeCoupon: res.data.isSubscribeCoupon||false,
            subscribeCouponTip: res.data.subscribeCouponTip||''
          });
        };
        if (res.data.ReturnCode == 100) {
          app.showToastC('该商品已下架');
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
      }
    })
  },
  // 修改收货地址
  revisethereceivingaddress:function(w){
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
  // 点赞变化
  gttufun: function () {
    var _this = this;
     if (this.data.gttu){
       var q = Dec.Aese('mod=thumbs&operation=down&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&gid=' + _this.data.gid)
       wx.request({
         url: app.signindata.comurl + 'goods.php'+q,
         method: 'GET',
         header: { 'Accept': 'application/json' },
         success: function (res) {
           if (res.data.ReturnCode == 200) {
             var numzum = _this.data.zunmdata;
             numzum.gpraise = parseInt(numzum.gpraise) - 1;  
             _this.data.gttu=!_this.data.gttu;     
             _this.setData({
               zunmdata:numzum
             });             
             app.showToastC('取消点赞');
           };
           if (res.data.ReturnCode == 100) {
            app.showToastC('该商品已下架');
           };
           if (res.data.ReturnCode == 918) {
            app.showToastC('未关注过该商品');
           };                      
           // 判断非200和登录
           Dec.comiftrsign(_this, res, app);           
         },
       });
     }else{
       var qq = Dec.Aese('mod=thumbs&operation=up&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&gid=' + _this.data.gid)
       wx.request({
         url: app.signindata.comurl + 'goods.php'+qq,
         method: 'GET',
         header: { 'Accept': 'application/json' },
         success: function (res) {
           if (res.data.ReturnCode == 200) {
             var numzum = _this.data.zunmdata;
             numzum.gpraise = parseInt(numzum.gpraise) + 1    
             _this.data.gttu=!_this.data.gttu;
             _this.setData({
               zunmdata: numzum
             });               
             app.showToastC('提交成功');
           };
           if (res.data.ReturnCode == 100) {
            app.showToastC('该商品已下架');
           };
           if (res.data.ReturnCode == 917) {
            app.showToastC('已经为这个商品点赞');
           };              
           // 判断非200和登录
           Dec.comiftrsign(_this, res, app);           
         },
       });
     }
  },
  // 兑换input值
  coupondatafun:function(e){
    this.setData({
      coupondata: e.detail.value
    })    
  },
  // 兑换激活码
  couclicksou: function () {
    var _this = this;
    var coupondata = _this.data.coupondata.replace(/\s*/g, "");
    var q = Dec.Aese('mod=coupon&operation=exchange&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&code=' + coupondata)
    wx.request({
      url: app.signindata.comurl + 'user.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 906) {
          app.showToastC('激活码错误');
        }else if (res.data.ReturnCode == 907) {
          app.showToastC('激活码已被使用');
        }else if (res.data.ReturnCode == 914) {
          app.showToastC(res.data.Msg);
        }else if (res.data.ReturnCode == 908) {
          app.showToastC('激活码已过期');
        }else if (res.data.ReturnCode == 200) {
          app.showToastC('兑换成功');
          // 调取购物券
          _this.comcouponprfun();
        }else{
          app.showToastC(res.data.Msg);  
        };
      }
    })
  },  
  //  数组去重
  distinct: function (arr) {
    var arr = arr, i, j, len = arr.length;
    for (i = 0; i < len; i++) {
      for (j = i + 1; j < len; j++) {
        if (arr[i].cid == arr[j].cid ) {
          arr.splice(j, 1);
          len--;
          j--;
        }
      }
    }
    return arr;
  },
  // 调取购物券
  comcouponprfun:function(){
    var _this = this;
    // 优惠券
    var q = Dec.Aese('mod=coupon&operation=getlist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'user.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('优惠券=====',res)
        var screeningavailable1 = [];
        var screeningavailable2 = [];
        // 不可用优惠券
        var unavailablearr = [];
        if (res.data.ReturnCode == 200) {
          if (res.data.List){
            if (res.data.List.length != 0){
              // 商品详情购买
              var redali = res.data.List||[];
              if (redali && redali.length != 0) {
                for (var r = 0; r < redali.length; r++) {
                  redali[r].gettime = time.formatTimeTwo(redali[r].gettime, 'Y/M/D h:m:s');
                  redali[r].overtime = time.formatTimeTwo(redali[r].overtime, 'Y/M/D h:m:s');
                };
              };
              if (_this.data.judgmentactivity == 1){
                var zunmdatacoupon = _this.data.zunmdata.coupon;
                // 运费卷
                var carriage = zunmdatacoupon.carriage || [];
                // 优惠券
                var voucher = zunmdatacoupon.voucher || [];
                // 价格
                var numgsal = parseFloat(_this.data.numberofdismantling) * parseFloat(_this.data.zunmdata.gsale);
                for (var i = 0; i < redali.length;i++){
                    if (redali[i].status == 0){
                        for (var q = 0; q < carriage.length; q++) {
                          if (redali[i].type == carriage[q] && numgsal >= parseFloat(redali[i].condition)) {
                            redali[i].imgcheck = false;
                            screeningavailable1.push(redali[i]);
                          }else{
                            unavailablearr.push(redali[i]);
                          };
                        };
                        for (var w = 0; w < voucher.length; w++) {
                          if (redali[i].type == voucher[w] && numgsal >= parseFloat(redali[i].condition)) {
                            redali[i].imgcheck = false;
                            screeningavailable2.push(redali[i]);
                          }else{
                            unavailablearr.push(redali[i]);
                          };
                        };                     
                    }else{
                      unavailablearr.push(redali[i]);
                    };
                };
                unavailablearr=_this.distinct(unavailablearr);
              }else{  // 来一套选取优惠券
                var comzund = _this.data.combdataimg.goods_detial||[];
                // 运费卷
                var comarrcarriage = [];
                for (var i = 0; i < comzund.length; i++){
                  if (comzund[i].imgiftr) {
                    if (comzund[i].coupon.carriage){
                      comarrcarriage = comarrcarriage.concat(comzund[i].coupon.carriage);
                    };
                  };
                };
                comarrcarriage = _this.unique(comarrcarriage);
                for (var t = 0; t < comarrcarriage.length;t++){
                    var compric =0;
                    for (var y = 0; y < comzund.length;y++){
                      if (comzund[y].imgiftr){
                        if (comzund[y].coupon.carriage.indexOf(comarrcarriage[t]) != -1) {
                          compric += parseFloat(comzund[y].gsale).toFixed(2) * parseFloat(comzund[y].numberofdismantling).toFixed(2);
                        };
                      };
                    };
                    for (var u = 0; u < redali.length; u++){
                      if (redali[u].status == 0){
                        if (redali[u].type == comarrcarriage[t]) {
                          if (parseFloat(redali[u].condition) <= compric) {
                            redali[u].imgcheck = false;
                            screeningavailable1.push(redali[u]);
                          }else{
                            unavailablearr.push(redali[u]);
                          };
                        } else {
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
                  if (comzund[e].imgiftr) {
                    if (comzund[e].coupon.voucher){
                       comarrvoucher = comarrvoucher.concat(comzund[e].coupon.voucher);
                    };
                  };
                };
                comarrvoucher = _this.unique(comarrvoucher);
                for (var p = 0; p < comarrvoucher.length;p++){
                    var compricvou = 0;
                    for (var a = 0; a < comzund.length; a++) {
                      if (comzund[a].imgiftr) {
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
                unavailablearr = _this.distinct(unavailablearr);
              };
            };
        };
          if (screeningavailable2.length != 0) {
            for (var m = 0; m < unavailablearr.length; m++) {
              for (var n = 0; n < screeningavailable2.length; n++) {
                if (unavailablearr[m]) {
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
                if (unavailablearr[m]) {
                  if (unavailablearr[m].cid == screeningavailable1[n].cid) {
                    unavailablearr.splice(m, 1);
                    m--;
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
            var checktwo2 = _this.data.coudata2||[];
            // discountcoupon
            // coupon_type 1是正常优惠券 2是折扣券
            var txt2 = '', check2cid = '', check2mon = '0.00', coupon_type=1;
            if (checktwo2.length != 0) {
              var coutypeone=[],coutypetwo=[]; // 1 平常购物券 2 折扣券
              for (var dc = 0; dc < checktwo2.length;dc++){
                if (checktwo2[dc].coupon_type == 2){
                  coutypetwo.push(checktwo2[dc])
                }else{
                  coutypeone.push(checktwo2[dc])
                };
              };
              if (coutypeone.length!=0){
                coutypeone.sort(_this.compare('value', false));
              };
              if (coutypetwo.length!=0){
                coutypetwo.sort(function (a, b) { var v1 = a['value']; var v2 = b['value']; return v1 - v2; });
              };
              checktwo2 = coutypetwo.concat(coutypeone);
              // checktwo2.sort(_this.compare('value', false));
              if (checktwo2[0].coupon_type==2){
                txt2 = checktwo2[0].name + ' ' + checktwo2[0].value+'折';
                check2cid = checktwo2[0].cid;
                check2mon = checktwo2[0].value;
                checktwo2[0].imgcheck = true;
                coupon_type = 2;
              }else{
                if(checktwo2[0].coupon_id == 1001){
                  txt2 = checktwo2[0].name;
                  check2mon = parseFloat(_this.data.zunmdata.gsale);
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
            if (_this.data.judgmentactivity == 1) {
              _this.amountcalculation();
            } else {
              _this.hdramountcalculation();
            };                        
            // 运费卷
            var checktwo1 = _this.data.coudata1||[];
            var txt1 = '', check1cid = '', check1mon = '0.00';
            if (checktwo1.length!=0&&_this.data.freightiftr>0) {
              checktwo1.sort(_this.compare('value', false));
              if(checktwo1[0].coupon_id == 1001){
                txt1 = checktwo1[0].name + checktwo1[0].unit + parseFloat(checktwo1[0].value).toFixed(2);
              }else{
                txt1 = checktwo1[0].name;
              };
              
              check1cid = checktwo1[0].cid;
              check1mon = checktwo1[0].value;
              checktwo1[0].imgcheck=true;
              _this.setData({
                coudata1: checktwo1,
                coudata1cid: check1cid,
                coudata1mon: parseFloat(check1mon).toFixed(2),                
              });
            }else{
              for (var m = 0; m < unavailablearr.length; m++) {
                if (unavailablearr[m]!='undefined'){
                  if (unavailablearr[m].type == 1) {
                    unavailablearr.splice(m, 1);
                    m--;
                  };                  
                };
              };
              _this.setData({
                coudata1: [],
                unavailablearr: unavailablearr,
                coudata1cid: '',
                coudata1mon: '0.00',
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
              // 隐藏弹框
              tipcoupon: txt,
            });
            // 计算价格
            if (_this.data.judgmentactivity == 1) {
              _this.amountcalculation();
            } else {
              _this.hdramountcalculation();
            };   
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);        
      }
    });  
  },
  // 合并两个数组去重
  arr_concat:function (arr1, arr2) { 
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
  couponprofun:function(){
    this.setData({couponprojectile: true,});
  },
  // 取消隐藏优惠券弹框
  couponprojectilefun:function(){
    var checktwo1 = this.data.coudata1
    for (var i = 0; i < checktwo1.length; i++) {
      if (this.data.coudata1cid == checktwo1[i].cid){
        checktwo1[i].imgcheck = true;
      }else{
        checktwo1[i].imgcheck = false;
      };
    };
    var checktwo2 = this.data.coudata2;
    for (var i = 0; i < checktwo2.length; i++) {
      if (this.data.coudata2cid == checktwo2[i].cid){
        checktwo2[i].imgcheck = true;
      }else{
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
    var txt1 = '', check1cid = '', check1mon='0.00';
    for (var i = 0; i < checktwo1.length; i++) {
      if(checktwo1[i].imgcheck){
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
    var txt2 = '', check2cid = '', check2mon = '0.00',coupon_type = 1;
    for (var i = 0; i < checktwo2.length; i++) {
      if(checktwo2[i].imgcheck){
        if (checktwo2[i].coupon_type==1){
          if(checktwo2[i].coupon_id == 1001){
            txt2 = checktwo2[i].name;
          }else{
            txt2 = checktwo2[i].name + checktwo2[i].unit + parseFloat(checktwo2[i].value).toFixed(2);
          };
          check2cid = checktwo2[i].cid;
          check2mon = checktwo2[i].value;
          coupon_type = checktwo2[i].coupon_type || 1;
        }else{
          txt2 = checktwo2[i].name + '' + checktwo2[i].value+'折';
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
    if (txt1 == '' && txt2==''){
      txt = '请选择优惠券'
    };
    this.setData({
      // 隐藏弹框
      couponprojectile: false,
      tipcoupon: txt,
      coudata1cid: check1cid,
      coudata1mon: parseFloat(check1mon).toFixed(2), 
      coudata2cid: check2cid,
      coudata2mon: parseFloat(check2mon).toFixed(2), 
      coupon_type: coupon_type            
    });
    // 计算价格
    if (this.data.judgmentactivity == 1) {
      this.amountcalculation()
    } else {
      this.hdramountcalculation()
    }
  },  
  // 隐藏收货地址弹框
  receivingaddressfun:function(){
    this.setData({
      receivingaddress: false,
    })
  },
  // 收货地址弹框
  seladdressfun:function(){
    this.setData({
      receivingaddress:true,
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
  // 一级背景
  tipbackdis:function(){
    var _this = this;
    if (this.data.paymentiftr){
      wx.showModal({
        title:'确定放弃支付吗？',
        content: '个人中心-我的订单-继续支付\n付款成功后，才可以拆单成功',
        success: function (res) {
          if (res.confirm) {
            _this.setData({
              tipback: false,
              dsbframeiftr: false,
              paymentiftr:false,
            })
          }
        }
      })       
    }else{
      _this.setData({
        tipback: false,
        dsbframeiftr: false,
      })
    }
  },
  // 二级背景函数
  tipbacktwo:function(){
    // if(this.data.specialGoods==1){
    //   this.setData({
    //     tipback: false
    //   })
    // };
    if (this.data.receivingaddress){
      this.setData({
        receivingaddress: false,
      })        
    } else if (this.data.couponprojectile){
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
    }else{
      this.setData({
        tipbacktwo: false,
        buybombsimmediately: false,
        receivingaddress: false,
        couponprojectile: false,
      })
    };
  },
  // 立即购买弹框
  dsbbbutclickt:function(){
    
    this.setData({
      tipback: true,
      tipbacktwo: true,
      buybombsimmediately: true
    });
    if (this.data.judgmentactivity==1){
      this.amountcalculation()
    }else{
      this.hdramountcalculation()
    };
    // 调取购物券   不是定金的时候调取优惠券
    if(this.data.zunmdata.goods_type!=3){
      this.comcouponprfun();   
    };

    if(this.data.addressdata && this.data.addressdata.length != 0){}else{
      this.nextpagediao();
    };


  },
  // 协议radio
  radioagreement:function(){
    this.setData({
      radioagreement: !this.data.radioagreement
    });
  },
  // 编辑地址
  jumpeditaddress: function (event){
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
  jumpaddress:function(){
    wx.navigateTo({ 
      url: "/pages/newreceivingaddress/newreceivingaddress"
    })     
  },
  // 阻止蒙层冒泡
  preventD(){},  
  // 购买数量sub
  clicksub:function(){
    var _this = this;
    var numbadd = --this.data.numberofdismantling;
    var taxation = parseFloat(numbadd) * parseFloat(_this.data.zunmdata.tax||0);
     if (numbadd<=1){
       numbadd=1;
       taxation = parseFloat(numbadd) * parseFloat(_this.data.zunmdata.tax||0);
     }
     this.setData({
       numberofdismantling:numbadd,
       taxation: taxation.toFixed(2)
     })
  },
  // 购买数量add
  clickadd: function () {
    var _this = this;
    var numbadd = ++this.data.numberofdismantling;
    var zunmdata = this.data.zunmdata;
    var selectShell = this.data.selectShell || '';
    if(this.data.specialGoods==1 && selectShell && selectShell.salesStatus==1){
      if(parseInt(numbadd) > parseInt(selectShell.realStock)){
        app.showToastC('该商品限购' + selectShell.realStock + '件');
        numbadd = selectShell.realStock;
      };
    };
    if (zunmdata.limitBuy > 0) {
      if (numbadd > zunmdata.limitBuy) {
        app.showToastC('该商品限购' + zunmdata.limitBuy + '件');
        numbadd = zunmdata.limitBuy;
      };
    };
    if (numbadd>99){
      app.showToastC('该商品限购99件');      
      numbadd = 99;
    };
    if (parseInt(_this.data.quantityofgoods) < numbadd){
      app.showToastC('该商品最多不能超过剩余库存');
      numbadd = _this.data.quantityofgoods;
    };    
    var taxation = parseFloat(numbadd) * parseFloat(_this.data.zunmdata.tax||0);
    this.setData({
      numberofdismantling: numbadd,
      taxation: taxation.toFixed(2)
    })
  }, 
  // 隐藏直接购买弹框
  dsbffun:function(){
    this.setData({
      tipback: false,
      dsbframeiftr: false,      
    })     
  },
  // 显示直接购买弹框
  dsbffunblock: function () {
    var _this = this;
    var res = this.data.zunmdata;
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    var iftrnum = true;
    // if(_this.data.specialGoods == 1){
    //   _this.dsbbbutclickt()
    //   return false;
    // };
    if(_this.data.specialGoods == 1){
      var stock = _this.data.selectShell.stock || 0;
      _this.setData({
        sizeid: 0,
        colorid: 0,
        quantityofgoods: stock
      });
    } else if (res.selected_spec){}else{
        for (var js in res.extends) {
          if (iftrnum) {
            _this.setData({
              sizeid: res.extends[js].s,
              colorid: res.extends[js].c,
              quantityofgoods: res.extends[js].num
            });
            res.tax = res.extends[js].tax || 0;
            res.gsale = res.extends[js].price;
            if (res.extends[js].img != 0 && res.extends[js].img != '' && res.extends[js].img) {
              if (!reg.test(res.extends[js].img)) {
                res.goods_thumb = _this.data.zdyurl + res.extends[js].img;
              } else {
                res.goods_thumb = res.extends[js].img;
              };
            };
            var gid = res.extends[js].belong_goods_id;
            if (gid != '' && gid != 0 && gid != res.gid && gid) {
              _this.setData({
                gid: gid
              });
              _this.adjdatagid();
            };
            iftrnum = false;
            break;
          };
        };    
        _this.setData({
          zunmdata: res 
        });
    };    
    this.setData({
      tipback: true,
      dsbframeiftr: true,
      judgmentactivity: 1,
    });    
  },  
  pricedetailc: function () {  // 价格明细显示隐藏
     this.setData({
       pricedetailc: !this.data.pricedetailc
     })
  },
  // 外部加入购物车判断
  addtocartiftr:function(){
    var _this = this;
    var res = this.data.zunmdata;
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    var iftrnum = true;

    if(_this.data.specialGoods == 1){
      var stock = _this.data.selectShell.stock || 0;
      _this.setData({
        sizeid: 0,
        colorid: 0,
        quantityofgoods: stock
      });
    } else if (res.selected_spec){}else{
        for (var js in res.extends) {
          if (iftrnum) {
            _this.setData({
              sizeid: res.extends[js].s,
              colorid: res.extends[js].c,
              quantityofgoods: res.extends[js].num
            });
            res.tax = res.extends[js].tax || 0;
            res.gsale = res.extends[js].price;
            if (res.extends[js].img != 0 && res.extends[js].img != '' && res.extends[js].img) {
              if (!reg.test(res.extends[js].img)) {
                res.goods_thumb = _this.data.zdyurl + res.extends[js].img;
              } else {
                res.goods_thumb = res.extends[js].img;
              };
            };
            var gid = res.extends[js].belong_goods_id;
            if (gid != '' && gid != 0 && gid != res.gid && gid) {
              _this.setData({
                gid: gid
              });
              _this.adjdatagid();
            };
            iftrnum = false;
            break;
          };
        };
        _this.setData({
          zunmdata:res
        }); 
    };   
    var _this = this;
    if (_this.data.zunmdata.color.length != 0 || _this.data.zunmdata.size.length != 0){
      _this.setData({
        tipback: true,
        dsbframeiftr: true,
      });           
    }else{
      _this.addtocart();
    }
  },
  addtocart: function () {  // 加入购物车
    var _this = this;
    if(_this.data.quantityofgoods == 0){
      app.showToastC('库存不足');
      return false;
    };

    _this.setData({
      suboformola: true
    });

    if(_this.data.zunmdata.isBlindBox){
       var count = parseFloat(_this.data.numberofdismantling) * parseFloat(_this.data.isBlindBoxNum);
    }else{
      var count = _this.data.numberofdismantling
    }
    var adtocar = [{ 'goods_id': _this.data.gid, 'color_id': _this.data.colorid || 0, 'size_id': _this.data.sizeid || 0, 'count':count , rec_goods_id: (_this.data.rec_goods_id || 0), rec_cart_id: (_this.data.rec_cart_id || 0), 'referee': _this.data.referee||0,specRoleId:_this.data.selectShell.roleId ||'' }];

    console.log(adtocar)

    if (_this.data.awa == 1){
      var othershop = _this.data.othershop||[];
      if (othershop && othershop.length != 0){
        for (var i = 0; i < othershop.length; i++) {
          adtocar.push({ 'goods_id': othershop[i].gid, 'color_id': 0, 'size_id': 0, 'count': othershop[i].limitnum})
        };
      };
    };
    var adtocarleng = adtocar.length;
    adtocar = JSON.stringify(adtocar);
    var qformid = Dec.Aese('mod=cart&operation=add&uid=' + _this.data.uid + '&referee=' + _this.data.referee + '&loginid=' + _this.data.loginid + '&gcount=' + adtocarleng + '&ginfo=' + adtocar + '&rec_goods_id=' + (_this.data.rec_goods_id || 0) + '&rec_cart_id=' + (_this.data.rec_cart_id || 0) + '&gdt_vid=' + _this.data.gdt_vid + '&weixinadinfo=' + _this.data.weixinadinfo);
    wx.request({
        url: app.signindata.comurl + 'goods.php'+qformid,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {
          _this.setData({
            suboformola: false
          });
          if (res.data.ReturnCode == 200){
            app.showToastC('已成功加入购物车');
              _this.setData({
                tipback: false,
                dsbframeiftr: false,
              });
            // 购物车数据显示
            Dec.shopnum(_this,app.signindata.comurl);
          } else if (res.data.ReturnCode == 802){
            app.showToastC('规格选择有误');
          } else if (res.data.ReturnCode == 805){
            app.showToastC('库存不足');
          } else if (res.data.ReturnCode == 201) {
            app.showToastC('添加失败');
          } else if (res.data.ReturnCode == 302){
            app.showToastC('无效信息');
          }
        },
        fail: function () {
          _this.setData({
            suboformola: false
          });
        },
      });
  }, 
  // 倒计时
  cdtime: function (cdtime){   
    var _this = this;
    var totalSecond = parseInt(cdtime) - Date.parse(new Date()) / 1000;
    var interval = setInterval(function () {
      // 秒数  
      var second = totalSecond;
      // 天数位  
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;
      // 小时位  
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;
      // 分钟位  
      var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;
      // 秒位  
      var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;
      if (dayStr=='00'){
        this.setData({
          countdown: '剩余'+ hrStr + '小时' + minStr + '分' + secStr + '秒',
        });
      }else{
        this.setData({
          countdown: '剩余' + dayStr + '天' + hrStr + '小时' + minStr + '分' + secStr + '秒',
        });
      }
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        _this.setData({countdown: '活动已结束'});
        this.setData({
          countdown: '剩余' + dayStr + '天' + hrStr + '小时' + minStr + '分' + secStr + '秒',
        });
      }
    }.bind(this), 1000); 
  },
  // 跳转所有评论
  jumpallcomments:function(){
    var _this = this;
    wx.navigateTo({  
      url: "/pages/allcomments/allcomments?gid=" + _this.data.gid
    });
  },
  //时间戳转换时间  
  toDate: function (number) {
    var n = number * 1000;
    var date = new Date(n);
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (Y + M + D)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  sharefrind:function(){
    var _this = this;
    if (_this.data.actimgshare==''){
      if (_this.data.zunmdata.goods_thumb != '' && _this.data.zunmdata.qrcode!=''){
        _this.setData({ shareFriendMask: true, headhidden:false});
        wx.showLoading({ title: '加载中...', })
    wx.getImageInfo({
      src: _this.data.avatarUrl,
      fail: function (res) {
        _this.setData({ shareFriendMask: false, headhidden: true });
        wx.hideLoading()
      },
      success: function (res) {
        const ctx = wx.createCanvasContext('sharefriend')
        ctx.setFillStyle('#fff')
        ctx.fillRect(0, 0,310, 410)
        // ctx.fillRect(0, 0, dw, 240)
        ctx.drawImage(res.path,6,6,28,28);
        ctx.setFontSize(12)
        ctx.fillStyle = "#000";
        // var str = '分享给你一个实用好物，[' + _this.data.zunmdata.goodsDesc + ']更便宜！';
        var str = '';
        ctx.fillText(str,42,26)
        var text = _this.data.zunmdata.gname;//这是要绘制的文本
        var chr = text.split("");//这个方法是将一个字符串分割成字符串数组
        var temp = "";
        var row = [];
        ctx.setFontSize(14)
        ctx.setFillStyle("#000")
        for (var a = 0; a < chr.length; a++) {
          if (ctx.measureText(temp).width < 170) {
            temp += chr[a];
          }
          else {
            a--; 
            row.push(temp);
            temp = "";
          }
        }
        row.push(temp);
        if (row.length > 2) {
          var rowCut = row.slice(0, 2);
          var rowPart = rowCut[1];
          var test = "";
          var empty = [];
          for (var a = 0; a < rowPart.length; a++) {
            if (ctx.measureText(test).width < 160) {
              test += rowPart[a];
            }else {
              break;
            }
          }
          empty.push(test);
          var group = empty[0] + "..."
          rowCut.splice(1, 1, group);
          row = rowCut;
        }
        for (var b = 0; b < row.length; b++) {
          ctx.fillText(row[b], 10, 310 + b *20, 300);
        }
        ctx.draw(true)
        ctx.setFontSize(16)
        ctx.fillStyle = "#ff2742";
        if (_this.data.zunmdata.pre_name){
          var strprice = _this.data.zunmdata.pre_name+':￥'+ _this.data.zunmdata.gsale;
        }else{
          var strprice = '￥' + _this.data.zunmdata.gsale;
        };
        ctx.fillText(strprice,10,370)
        ctx.draw(true)
        ctx.setFontSize(10)
        ctx.fillStyle = "#999999";
        var strprice = '长按识别，查看详情';
        ctx.fillText(strprice,200, 400)
        ctx.draw(true)
        // 商品缩略图   goods_thumb
        var goodsthumb = _this.data.zunmdata.goods_share;
        if (!app.signindata.reg.test(goodsthumb)) {
          goodsthumb = _this.data.zdyurl + goodsthumb;
        };
        var bgImg = goodsthumb.replace(/^http:/, "https:")
        wx.getImageInfo({
          src: bgImg ,
          fail: function (res) {
            _this.setData({ shareFriendMask: false, headhidden: true });
            wx.hideLoading()
          },
          success: function (res) {

            let dw = 246;
            let dh = 246;
            let width = res.width;
            let height = res.height;
            let scaleO = width / height;
            let imgWidth = scaleO*246;
            let imgHeight = 246/scaleO;

            if( imgWidth >= 246 ){
              let marginRpx = ((246 - imgHeight) / 2) + 40;
              ctx.drawImage(res.path,32,marginRpx,dw,imgHeight);
            }else{
              let marginRpx = (310 - scaleO*246) / 2;
              ctx.drawImage(res.path,marginRpx,40,imgWidth,dh);
            };

            // ctx.drawImage(res.path,32,40,246,246);

            ctx.draw(true);
            // 二维码
            console.log(_this.data.zunmdata.qrcode,2222222)
            wx.getImageInfo({
              src: _this.data.zunmdata.qrcode,
              fail: function (res) {
                _this.setData({ shareFriendMask: false, headhidden: true });
                wx.hideLoading();
              },
              success: function (res) {
                ctx.drawImage(res.path,205,300,85,85);
                ctx.draw(true,setTimeout(function () {
                  wx.canvasToTempFilePath({
                    canvasId: 'sharefriend',
                    success: function (res) {
                      _this.setData({
                        actimgshare: res.tempFilePath
                      });
                    },
                    fail: function (res) {}
                  })
                }, 300));
                _this.setData({ shareFriendMask: false, headhidden:true });
                wx.hideLoading()
              }
            })
          }
        })
        ctx.draw(true);
      }
    });
    };
    };
  },
  onLoadfun:function(){
    var _this = this;

    var isShareGood = true;
    if(app.signindata.notAllowShareGoodsId&&app.signindata.notAllowShareGoodsId.length!=0){
      if(app.signindata.notAllowShareGoodsId.indexOf(_this.data.gid) > -1){
        isShareGood = false;
      }
    };
    

    _this.setData({
      isShareGood:isShareGood,
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid:app.signindata.openid,
      avatarUrl: app.signindata.avatarUrl,
      isProduce: app.signindata.isProduce,
      isShareFun: app.signindata.isShareFun,
      defaultinformation:app.signindata.defaultinformation,
      signinlayer: true,
      tgabox: false
    });
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    // 商品详情
    _this.detailfunshop();
    // 节日红包奖励
    var qqqqq = Dec.Aese('mod=coupon&operation=holiday&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
    wx.request({
      url: app.signindata.comurl + 'user.php' + qqqqq,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          if (res.data.Info) {
            _this.setData({
              newcoupon: true,
              newcoupondata: res.data.Info.List,
              newcoutitle: res.data.Info.title
            });
          };
        };
        if (res.data.ReturnCode == 201) {
          _this.setData({
            newcoupon: false
          });
        };
      },
      fail: function () { }
    });
    _this.data.videoContext = wx.createVideoContext('myVideo')//初始化视频组件
    setTimeout(function(){
      _this.otherdata();
    },1000)
    if (app.signindata.isAwardOrder) {
      _this.setData({ isAwardOrder: app.signindata.isAwardOrder, awardOrder: app.signindata.awardOrder || false });
      app.winningtheprizetime(_this);
    };

    // 刮刮卡入口
    wx.request({
      url: 'https://meichai-1300990269.cos.ap-beijing.myqcloud.com/cardOpenStatus.txt?time='+Date.parse(new Date()),
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('刮刮卡入口',res)
        _this.setData({isScrapingCard:res.data.open || false,goodsInfoAds:res.data.goodsInfoAds})
      },
      fail: function (res) {}
    }) 

  },
  jumporder: function () {
    var _this = this;
    app.jumporder(_this);
  },
  otherdata:function(){
    var _this = this;

    if(this.data.defaultinformation){}else{
      app.defaultinfofun(this);
    };

    // 调取晒单数量
    Dec.dryingSum(_this, app.signindata.clwcomurl);
    // 购物车数据显示
    Dec.shopnum(_this,app.signindata.comurl);

    if(app.signindata.receivingAddress && app.signindata.receivingAddress.length != 0){
      var rdl = app.signindata.receivingAddress;
      var tptipadi = '';
      var tptipadd = '';
      var tipnamephone = '';
      for (var i = 0; i < rdl.length; i++) {
        if (rdl[i].isdefault == 1) {
          rdl[i].checked = false;
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
      console.log('地址=======onloadfun====',_this.data.addressdata)
  };

    //  收货地址
    // _this.nextpagediao();


    // 评论数据
    // var qq = Dec.Aese('mod=comment&operation=getgoodcomment&gid=' + _this.data.gid + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    // wx.request({
    //   url: app.signindata.comurl + 'user.php' + qq,
    //   method: 'GET',
    //   header: { 'Accept': 'application/json' },
    //   success: function (res) {
    //     if (res.data.ReturnCode == 200) {
    //       var arrlist = res.data.List || [];
    //       if (arrlist.length != 0) {
    //         for (var i = 0; i < arrlist.length; i++) {
    //           if (!app.signindata.reg.test(arrlist[i].headphoto)) {
    //             arrlist[i].headphoto = _this.data.zdyurl + arrlist[i].headphoto;
    //           }
    //           arrlist[i].time = _this.toDate(arrlist[i].time);
    //         };
    //         // 点赞降序排列
    //         arrlist.sort(_this.compare('praise', false))
    //         _this.setData({
    //           allcomlist: arrlist
    //         })
    //       }
    //     } else {
    //       _this.setData({
    //         allcomlist: [],
    //       })
    //     };
    //     // 判断非200和登录
    //     Dec.comiftrsign(_this, res, app);
    //   }
    // });
    // if (_this.data.isProduce){
    //   // 晒单数据
    //   _this.delpostdata(0);
    // };
  },
  detailfunshop:function(){
    var _this = this;
    _this.setData({headhidden: false}); 
    wx.showLoading({ title: '加载中...', })
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    var q = Dec.Aese('mod=getinfo&operation=info&gid=' + _this.data.gid + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid+ '&push_id='+_this.data.push_id)
    wx.request({
      url: app.signindata.comurl + 'goods.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        _this.data.push_id =  0;
        console.log('详情',res)
        _this.setData({ headhidden: true }); 
        wx.hideLoading();
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh()
        clearInterval(_this.data.wintheprtintervaldetail);
        if (res.data.ReturnCode == 200) {
          var dataGinfo = res.data.Ginfo;
          _this.setData({
            welvalue:true,
            specialGoods:dataGinfo.specialGoods // 特殊商品  手机壳
          })

          if(!dataGinfo.isGoodsCanShare && _this.data.canShare!=1){
            console.log('isGoodsCanShare','true 能 false不能分享')
            wx.hideShareMenu();
            if(!_this.data.referee){
               _this.toogleGuidanceMask();
            };
          }else{
            wx.showShareMenu({
              withShareTicket:true
            });
          };


          if (!reg.test(res.data.Ginfo.goods_thumb)) {
            res.data.Ginfo.goods_thumb = _this.data.zdyurl + res.data.Ginfo.goods_thumb;
          };
          // 相关商品
          var relative_goods = res.data.Ginfo.relative_goods || [];
          if (relative_goods){
            if (relative_goods.length!=0){
                for (var m = 0; m < relative_goods.length;m++){
                  if (!app.signindata.reg.test(relative_goods[m].goods_thumb)) {
                    relative_goods[m].goods_thumb = _this.data.zdyurl + relative_goods[m].goods_thumb;
                  };
                }
            }
          };
          // 拆单数组
          var suit_goods = res.data.Ginfo.suit_goods || [];
          if (suit_goods) {
            if (suit_goods.length != 0) {
              for (var s = 0; s < suit_goods.length; s++) {
                if (!app.signindata.reg.test(suit_goods[s].goods_thumb)) {
                  suit_goods[s].goods_thumb = _this.data.zdyurl + suit_goods[s].goods_thumb;
                };
              }
            }
          }; 
          // 颜色
          if (res.data.Ginfo.color) {
            if (res.data.Ginfo.color.length != 0) {
              _this.setData({
                // 颜色id
                colorid: res.data.Ginfo.color[0].no,
                colorcon: res.data.Ginfo.color[0].property,
              })
            }
          } else {
            res.data.Ginfo.color = [];
            _this.setData({
              colorid: 0,
            })
          };
          // 尺寸
          if (res.data.Ginfo.size) {
            if (res.data.Ginfo.size.length != 0) {
              _this.setData({
                // 尺寸id
                sizeid: res.data.Ginfo.size[0].no,
                sizecon: res.data.Ginfo.size[0].property,
              })
            };
          } else {
            res.data.Ginfo.size = [];
            _this.setData({
              sizeid: 0,
            })
          };
          // 商品库存
          var exstring = 'c' + _this.data.colorid + '_' + _this.data.sizeid;
          if (res.data.Ginfo.extends[exstring]) {
            _this.setData({
              quantityofgoods: res.data.Ginfo.extends[exstring].num || 0
            });
          } else {
            _this.setData({
              quantityofgoods: 0
            });
          }
          var iftrnum = true;
          if (res.data.Ginfo.selected_spec) {
            var colsel = 'c' + res.data.Ginfo.selected_spec.color + '_' + res.data.Ginfo.selected_spec.size
            _this.setData({
              sizeid: res.data.Ginfo.extends[colsel].s,
              colorid: res.data.Ginfo.extends[colsel].c,
              quantityofgoods: res.data.Ginfo.extends[colsel].num
            });
            res.data.Ginfo.tax = res.data.Ginfo.extends[colsel].tax || 0;
            res.data.Ginfo.gsale = res.data.Ginfo.extends[colsel].price;
            if (res.data.Ginfo.extends[colsel].img != 0 && res.data.Ginfo.extends[colsel].img != '' && res.data.Ginfo.extends[colsel].img) {
              if (!reg.test(res.data.Ginfo.extends[colsel].img)) {
                res.data.Ginfo.goods_thumb = _this.data.zdyurl + res.data.Ginfo.extends[colsel].img;
              } else {
                res.data.Ginfo.goods_thumb = res.data.Ginfo.extends[colsel].img;
              };
            };
            var gid = res.data.Ginfo.extends[colsel].belong_goods_id;
            if (gid != '' && gid != 0 && gid != res.data.Ginfo.gid && gid) {
              _this.setData({
                gid: gid
              });
              _this.adjdatagid();
            };
            iftrnum = false;
          };
          // 是否点赞
          if (res.data.Ginfo.praise == 1) {
            _this.data.gttu= true;
          } else {
            _this.data.gttu=false;
          }
          // 是否是多件装
          var issuit = [];
          if (res.data.Ginfo.is_suit == 1) {
            for (var s = 0; s < parseInt(res.data.Ginfo.suit_num); s++) {
              issuit.push(s + 1);
            };
            res.data.Ginfo.issuit = issuit;
            if(_this.data.awa==1){
              res.data.Ginfo.limitnum = _this.data.numberofdismantling || 1;
            }
          } else {
            res.data.Ginfo.issuit = [];
          };
          var redauin = res.data.Ginfo;
          var imgArr = [];
          for (var j = 0; j < res.data.Ginfo.gimages.length; j++) {
            if (!reg.test(res.data.Ginfo.gimages[j].url)) {
              res.data.Ginfo.gimages[j].url = _this.data.zdyurl + res.data.Ginfo.gimages[j].url;
            };
            imgArr.push(res.data.Ginfo.gimages[j].url)
          };
          redauin.gdesc = decodeURIComponent(redauin.gdesc.replace(/\+/g, ' '));
          WxParse.wxParse('article', 'html', redauin.gdesc, _this, 0);
          redauin.retailer_url = decodeURIComponent(redauin.retailer_url);
          _this.data.ginfo=res.data.Ginfo;
          _this.data.imgArr=imgArr;
          if (redauin.status == 1) {
            var datatimewell = redauin.startTime;
            redauin.datatimew = datatimewell;
            redauin.datatimew = _this.toDatehd(redauin.datatimew);
            _this.winningtheprizetimedetail(redauin.startTime);
          };
          if (redauin.status == 2) {
            var datatimewell = redauin.endTime;
            redauin.datatimew = datatimewell;
            redauin.datatimew = _this.toDatehd(redauin.datatimew);
            if ((res.data.Ginfo.specialWay && res.data.Ginfo.specialWay==1)){
              _this.winningtheprizetimedetail(redauin.endTime);
            }else if(res.data.Ginfo.depositEndTime && Date.parse(new Date())/1000 < res.data.Ginfo.depositEndTime){
              clearInterval(_this.data.wintheprtintervaldetail);
              _this.winningtheprizetimedetail(res.data.Ginfo.depositEndTime);
            }else if(redauin.finalDepositTime){}else if(redauin.goods_type==3){
              console.log(111111111,redauin.endTime)
              _this.winningtheprizetimedetail(redauin.endTime);
            };
          };
          if(res.data.Ginfo.gid == 36875 || res.data.Ginfo.gid == 36876 || res.data.Ginfo.gid == 36877 ||res.data.Ginfo.gid == 37568 || res.data.Ginfo.gid == 37569 || res.data.Ginfo.gid == 37573 ||res.data.Ginfo.gid == 37700){
            clearInterval(_this.data.wintheprtintervaldetail);
            _this.winningtheprizetimedetail(1621094400);
          };
          
          // if(res.data.Ginfo&&res.data.Ginfo.brandId>0){
          //   res.data.Ginfo.specialWay = 1;
          // };
          _this.setData({
            movies: res.data.Ginfo.gimages,
            zunmdata: redauin,
            subscribedata: res.data.toyShowSubscribe || '',
            specSubscribe: res.data.specSubscribe || '',
            taxation: redauin.tax || 0,
            isVideoSwiper: res.data.Ginfo.videoBanner||false,
            is_exhibition: res.data.Ginfo.specialWay || 0,
            brandId: res.data.Ginfo ? res.data.Ginfo.brandId : '',
            // exhibdetail: res.data.Ginfo.specialWay==1?true:false,
            exhibdetail:false,
            isSubscribeCoupon: res.data.isSubscribeCoupon || false,
            subscribeCouponTip: res.data.subscribeCouponTip || '',
            deductRatio:res.data.Ginfo.deductRatio,
            isDeduct:res.data.Ginfo.isDeduct,
            isUseBlindboxMoney:res.data.Ginfo.isDeduct?true:false,
            isDeductNum:res.data.Ginfo.isDeduct&&_this.data.blindboxMoney!=0?1:0,
            isCanShare:res.data.Ginfo.isCanShare,
            nowTime : Date.parse(new Date())/1000,//当前时间戳
            totalSpecStock:res.data.Ginfo.totalSpecStock || 0
          },function(){
              // 是否播放视频
              if(_this.data.isVideoSwiper){
                console.log('是否播放视频')
                _this.previewVideo();
              };
          });

          // 赠品倒计时
          if(redauin.isGiveGoodsStatus == 2){
            console.log('redauin.isGiveGoodsStatus == 2 redauin.giftEndTime',redauin.giftEndTime)
            _this.countdownOfGifts(redauin.giftEndTime)
          }
          if(res.data.Ginfo.specialGoods && res.data.Ginfo.specialGoods == 1){
            var infoSpecial = dataGinfo.infoSpecial;
            var detailSpecColor = infoSpecial.detailSpec[infoSpecial.specCate[1]] || [];


            var detailSpecModel = infoSpecial.detailSpec[infoSpecial.specCate[0]] || [];
            var listSpec = infoSpecial.listSpec;
            var detailColorIndex = 0;
            var modelSelInde = 0;
            var selectShell = {};
            var spgsale = 0;
            var minImg = '';
            if(_this.data.selectShell.roleId){
                detailColorIndex = _this.data.detailColorIndex || 0;
                modelSelInde = _this.data.modelSelInde || 0;
                var modelColor = detailSpecModel[modelSelInde].name+'-'+detailSpecColor[detailColorIndex].name;
                if(detailSpecModel[modelSelInde].tipStockOnLine){
                  res.data.Ginfo.tipStockOnLine = detailSpecModel[modelSelInde].tipStockOnLine;
                  res.data.Ginfo.isSuplusChance = detailSpecModel[modelSelInde].isSuplusChance || false;
                };
                // 回答题答案
                if(res.data.Ginfo.additional_type==2){
                  res.data.Ginfo.option =  detailSpecModel[modelSelInde].option || [];
                  res.data.Ginfo.anwer = detailSpecModel[modelSelInde].anwer || ''
                }


                if(listSpec[modelColor]){
                    selectShell = listSpec[modelColor];
                    spgsale = listSpec[modelColor].price; 
                    if(listSpec[modelColor].salesStatus == 1 && listSpec[modelColor].realStock <= 0){
                      redauin.debuff = 2; 
                    }else if( listSpec[modelColor] && listSpec[modelColor].stock > 0 ){
                      redauin.debuff = 0; 
                    }else{
                      redauin.debuff = 3; 
                    };
                    if(res.data.Ginfo.totalSpecStock && listSpec[modelColor].stock > res.data.Ginfo.totalSpecStock){
                      _this.data.totalSpecStock = res.data.Ginfo.totalSpecStock;
                    }else{
                      _this.data.totalSpecStock = listSpec[modelColor].stock;
                    };
                    if(res.data.Ginfo.depositInfo && res.data.Ginfo.depositInfo[selectShell.roleId]){
                      res.data.Ginfo.isDepositSubscribe = res.data.Ginfo.depositInfo[selectShell.roleId].isDepositSubscribe;
                      if(res.data.Ginfo.depositInfo[selectShell.roleId].orderSn){
                        res.data.Ginfo.orderSn = res.data.Ginfo.depositInfo[selectShell.roleId].orderSn;
                        res.data.Ginfo.isDisplayDeposit = true;
                      }else{
                        res.data.Ginfo.isDisplayDeposit = false;
                      };
                      

                      if(res.data.Ginfo.status == 3){
                        if(res.data.Ginfo.depositInfo[selectShell.roleId].balanceOrderSn){
                          res.data.Ginfo.orderSn = res.data.Ginfo.depositInfo[selectShell.roleId].balanceOrderSn;
                          res.data.Ginfo.orderAmount = res.data.Ginfo.depositInfo[selectShell.roleId].orderAmount;
                        }else{
                          res.data.Ginfo.orderSn = '';
                          res.data.Ginfo.orderAmount = ''
                        };
                      };
                    }else{
                      res.data.Ginfo.isDepositSubscribe = false;
                      res.data.Ginfo.isDisplayDeposit = true;
                    };
                    console.log(1,detailSpecColor,detailColorIndex,detailSpecColor[detailColorIndex].listImg)
                    _this.setData({
                      movies: detailSpecColor[detailColorIndex].listImg || res.data.Ginfo.gimages || [],
                      goodsIndex:0
                    })
                };
            }else{
                if(res.data.Ginfo.status == 3 && res.data.Ginfo.depositInfo){
                      outSide:for( var j = 0 ; j < detailSpecModel.length ; j++ ){
                          var ifAdopt = false;
                          var assignment = true
                          for( var i = 0 ; i < detailSpecColor.length ; i++ ){
                              var modelColor = detailSpecModel[j].name+'-'+detailSpecColor[i].name;
                              if(listSpec[modelColor] && res.data.Ginfo.depositInfo[listSpec[modelColor].roleId]){
                                detailSpecColor[i].select = true;
                                if(detailSpecColor[i].tipStockOnLine){
                                  res.data.Ginfo.tipStockOnLine = detailSpecColor[i].tipStockOnLine;
                                  res.data.Ginfo.isSuplusChance = detailSpecColor[i].isSuplusChance || false;
                                };
                                // 回答题答案
                                if(res.data.Ginfo.additional_type==2){
                                  res.data.Ginfo.option =  detailSpecColor[i].option || [];
                                  res.data.Ginfo.anwer =  detailSpecColor[i].anwer || ''
                                };


                                ifAdopt = true;
                                if(assignment){
                                  assignment = false;
                                  detailColorIndex = i;
                                  modelSelInde = j;
                                  selectShell = listSpec[modelColor];
                                  spgsale = listSpec[modelColor].price; 
                                  if(res.data.Ginfo.depositInfo && res.data.Ginfo.depositInfo[selectShell.roleId]){
                                    if(res.data.Ginfo.depositInfo[selectShell.roleId].balanceOrderSn){
                                      res.data.Ginfo.orderSn = res.data.Ginfo.depositInfo[selectShell.roleId].balanceOrderSn;
                                      res.data.Ginfo.orderAmount = res.data.Ginfo.depositInfo[selectShell.roleId].orderAmount;
                                    }else{
                                      res.data.Ginfo.orderSn = '';
                                      res.data.Ginfo.orderAmount = '';
                                    };
                                  };
                                  break;
                                }
                              } else {
                                detailSpecColor[i].select = false;
                              };
                          };
                          if(ifAdopt){
                            break outSide;
                          }
                      }; 
                }else{
                    outSide:for( var j = 0 ; j < detailSpecModel.length ; j++ ){
                        var ifAdopt = false;
                        var assignment = true
                        for( var i = 0 ; i < detailSpecColor.length ; i++ ){
                            var modelColor = detailSpecModel[j].name+'-'+detailSpecColor[i].name;
                            if(listSpec[modelColor]){
                              detailSpecColor[i].select = true;
                              if(detailSpecColor[i].tipStockOnLine){
                                res.data.Ginfo.tipStockOnLine = detailSpecColor[i].tipStockOnLine;
                                res.data.Ginfo.isSuplusChance = detailSpecColor[i].isSuplusChance || false;
                              };
                              // 回答题答案
                              if(res.data.Ginfo.additional_type==2){
                                res.data.Ginfo.option =  detailSpecColor[i].option || [];
                                res.data.Ginfo.anwer =  detailSpecColor[i].anwer || ''
                              }
                              ifAdopt = true;
                              if(assignment){
                                assignment = false;
                                detailColorIndex = i;
                                modelSelInde = j;
                                selectShell = listSpec[modelColor];
                                spgsale = listSpec[modelColor].price; 
                                if( listSpec[modelColor] && listSpec[modelColor].salesStatus == 1 && listSpec[modelColor].realStock <= 0){
                                  redauin.debuff = 2; 
                                }else if( listSpec[modelColor] && listSpec[modelColor].stock > 0 ){
                                  redauin.debuff = 0; 
                                }else{
                                  redauin.debuff = 3; 
                                };
                                if(res.data.Ginfo.totalSpecStock && listSpec[modelColor].stock > res.data.Ginfo.totalSpecStock){
                                  _this.data.totalSpecStock = res.data.Ginfo.totalSpecStock;
                                }else{
                                  _this.data.totalSpecStock = listSpec[modelColor].stock;
                                };

                                if(res.data.Ginfo.depositInfo && res.data.Ginfo.depositInfo[selectShell.roleId]){
                                  res.data.Ginfo.isDepositSubscribe = res.data.Ginfo.depositInfo[selectShell.roleId].isDepositSubscribe;
                                  if(res.data.Ginfo.depositInfo[selectShell.roleId].orderSn){
                                    res.data.Ginfo.orderSn = res.data.Ginfo.depositInfo[selectShell.roleId].orderSn;
                                    res.data.Ginfo.isDisplayDeposit = true;
                                  }else{
                                    res.data.Ginfo.isDisplayDeposit = false;
                                  };
                                  
                                }else{
                                  res.data.Ginfo.isDepositSubscribe = false;
                                  res.data.Ginfo.isDisplayDeposit = true;
                                };

                              }
                            } else {
                              detailSpecColor[i].select = false;
                            };
                        };
                        if(ifAdopt){
                          break outSide;
                        }
                    }; 
                }

            }


            redauin.gsale = spgsale;
            redauin.gprice = spgsale;
            redauin.goods_thumb = selectShell.roleImg;
            // 手机壳 并且 isSpecSoldOut 为 true 全部卖完
            if(res.data.Ginfo.isSpecSoldOut){
              if(selectShell.salesStatus == 1){
                redauin.debuff = 2; 
              }else{
                redauin.debuff = 3; 
              };
            };

            _this.setData({
              zunmdata:redauin,
              listSpec,
              specCate:infoSpecial.specCate,
              detailSpecColor,
              detailSpecModel,
              detailColorIndex,
              modelSelInde,
              selectShell
            })
            
            // specialGoods=1是特殊的商品，走手机壳逻辑
            // Ginfo.infoSpecial.listSpec   对应关系
            // Ginfo.infoSpecial.specCate        属性列表
            // Ginfo.infoSpecial.detailSpec        属性明细            
          };

          if (res.data.Ginfo.gdesc == '' ){
            // 展会
            _this.exhibdatafun(1);
            app.livebroadcast(_this, res.data.Ginfo.brandId)  // 直播数据
          }

          // if (_this.data.is_exhibition==1||(_this.data.is_exhibition!=1&&_this.data.brandId>0)){
          //   // 展会
          //   _this.exhibdatafun(1);
          //   app.livebroadcast(_this, res.data.Ginfo.brandId)  // 直播数据
          // }
          // 云统计
          var clouddata = { act_id:'g'+_this.data.id, type: res.data.Ginfo.specialWay || 0 };
          app.cloudstatistics('activityStatistics', clouddata);
          // 分享生成图片
          _this.getSnapshot();
          // 生成图片
          // _this.sharefrind();
          // 是否能分享
          if(!res.data.Ginfo.isCanShare){
            console.log('不能分享')
            wx.hideShareMenu();
            _this.setData({isShareFun : false});
          };


        };
        if (res.data.ReturnCode == 100) {
          app.showToastC('该商品已下架');
          wx.reLaunch({
            url: "/pages/index/index?judgeprof=2"
          });
        };
        if (res.data.ReturnCode == '000') {
          app.showToastC('商品暂时找不到了');
          wx.reLaunch({
            url: "/pages/index/index?judgeprof=2"
          });
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
      }
    })    
  },
  // 根据数组中对象的某一个属性值进行排序
  compare: function (attr, rev){
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
  onLoad: function (options) { 


    app.signindata.suap = 7;
    console.log(options)
    this.data.gdt_vid = options.gdt_vid||'';
    this.data.weixinadinfo = options.weixinadinfo||'';
    app.signindata.global_store_id = options.store_id||0;
    app.signindata.referee=options.referee || 0;
    if (options.awa){
      var othershop = [];
      if (options.othershop){
        othershop = JSON.parse(options.othershop);
      }
      this.setData({ 
        limitnum: parseInt(options.limitnum) || 0,
        awa: parseInt(options.awa) || 0, 
        numberofdismantling: parseInt(options.limitnum) || 1,
        othershop: othershop
      });
    }

    // 推送统计
    this.data.push_id = options.push_id || 0;

    this.setData({
      rec_goods_id: options.rec_goods_id || 0,
      rec_cart_id: options.rec_cart_id || 0,
      referee: options.referee||0,
      room_id: options.room_id||0,
      canShare: options.canShare || 0,
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      avatarUrl: app.signindata.avatarUrl,
      isProduce: app.signindata.isProduce,
      isShareFun: app.signindata.isShareFun,
      blindboxMoney:app.signindata.blindboxMoney
    });
    if (options.gid){
      this.setData({
        gid: options.gid,
        id: options.gid,
        is_share: options.referee ? true : false
      });
      // 判断是否授权
      this.activsign();
    }else{
      wx.reLaunch({  
        url: "/pages/index/index"
      });      
    };
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
    for (var i = 0; i < checktwo2.length;i++){
      if (checktwo2[i].cid == cid){
        checktwo2[i].imgcheck = !checktwo2[i].imgcheck; 
      }else{
        checktwo2[i].imgcheck = false; 
      };
    };
    this.setData({
      coudata2: checktwo2
    })
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
  // 评论点赞
  commentary: function (w) {
    var _this = this;
    var cid = w.currentTarget.dataset.cid || w.target.dataset.cid;
    var q = Dec.Aese('mod=thumbs&operation=thumbup&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&cid=' + cid)
    wx.request({
      url: app.signindata.comurl + 'user.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          app.showToastC('点赞成功');
          var abcdata = _this.data.allcomlist;
          var ind = parseInt(w.currentTarget.dataset.ind);
          abcdata[ind].praised = 1;
          abcdata[ind].praise = parseInt(abcdata[ind].praise) + 1;
          _this.setData({
            allcomlist: abcdata
          })
        };
        if (res.data.ReturnCode == 912) {
          app.showToastC('gid和cid不匹配');
        };
        if (res.data.ReturnCode == 917) {
          app.showToastC('已经为这个商品点赞'); 
        };
        // 判断非200和登录 
        Dec.comiftrsign(_this, res, app);    
      }
    })
  },
  // 取消评论点赞
  cancelcommentary: function (w) {
    var _this = this;
    var cid = w.currentTarget.dataset.cid || w.target.dataset.cid;
    var q = Dec.Aese('mod=thumbs&operation=thumbdown&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&cid=' +cid)
    wx.request({
      url: app.signindata.comurl + 'user.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          app.showToastC('已取消点赞');
          var abcdata = _this.data.allcomlist;
          var ind = parseInt(w.currentTarget.dataset.ind);
          abcdata[ind].praised = 0;
          abcdata[ind].praise = parseInt(abcdata[ind].praise) - 1;
          _this.setData({
            allcomlist: abcdata
          })
        };
        if (res.data.ReturnCode == 918) {
          app.showToastC('未关注过该商品');
        };        
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);            
      }
    })
  },    
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _this = this;
    this.animation = wx.createAnimation({
      // 动画持续时间，单位ms，默认值 400
      duration: 200,
      timingFunction: 'ease-out',
      // 延迟多长时间开始
      delay: 200,
      transformOrigin: 'center bottom 0',
      success: function (res) {}
    })
    _this.mAnimation()//开启动画
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var _this = this;
    if (_this.data.isVideoSwiper) {
      _this.data.videoContext.pause()
      _this.data.videoContext.stop()
    };
    clearInterval(this.data.wintheprtintervaldetail);
    clearInterval(_this.data.countdownofgifts);
     // 调用重置刷新
     app.resetdownRefresh();
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var _this = this;
    if (_this.data.isVideoSwiper) {
      _this.data.videoContext.pause()
      _this.data.videoContext.stop()
    }
    clearInterval(this.data.wintheprtintervaldetail);
    clearInterval(_this.data.countdownofgifts);
     // 调用重置刷新
     app.resetdownRefresh();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if(this.data.is_exhibition == 1){
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '重新进入商品详情可刷新库存状态',
        icon: 'none',
        duration: 2000
      })
    }else{
      app.downRefreshFun(() => {
        // 商品详情
        this.detailfunshop();
      })
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      if(this.data.userbranddata){}else if (this.data.is_exhibition==1||(this.data.is_exhibition!=1&&this.data.brandId>0)){
        this.exhibdatafun(1);
        app.livebroadcast(this, this.data.brandId)  // 直播数据
      }
  },
  /**
   * 用户点击右上角分享
   */
  onShareTimeline:function(){
    var _this = this;
    return {
      title:_this.data.zunmdata.gname,
      query:{
        'gid':_this.data.gid
      },
      imageUrl:'https://cdn.51chaidan.com/'+_this.data.zunmdata.goods_share 
    }
  },
  onShareAppMessage: function (options) {
    var _this = this;
    _this.setData({ tgfrShareIftr:false});
    var shareimg = _this.data.paycheadwsongimg || _this.data.zunmdata.goods_thumb;
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    if (!reg.test(shareimg)) {
      shareimg = _this.data.zdyurl + shareimg;
    };    
    
    var reshare = {
      title:_this.data.zunmdata.gname ,
      path: '/pages/detailspage/detailspage?gid=' + _this.data.gid + '&referee='+_this.data.uid,
      // imageUrl: 'https://cdn.51chaidan.com/'+_this.data.zunmdata.goods_share ,
      imageUrl:_this.data.zunmdata.goods_share ,
      success: function (res) {},
    };

    var q = Dec.Aese('mod=share&operation=goods&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&gid=' + _this.data.gid)
    wx.request({
      url: app.signindata.comurl + 'user.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {},
    }) 


    return reshare  
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
      _this.detailfunshop();
    }else{
      
      wx.getSetting({
        success: res => {
          if (true) {
            // '已经授权'
            _this.setData({
              loginid: app.signindata.loginid,
              uid: app.signindata.uid,
              openid: app.signindata.openid,
              avatarUrl: app.signindata.avatarUrl,
              isShareFun: app.signindata.isShareFun,
              signinlayer: true,
              tgabox: false
            });
            // 判断是否登录
            if (_this.data.loginid != '' && _this.data.uid != '') {
              _this.onLoadfun();
            } else {
              app.signin(_this);
            }
          } else {
            _this.setData({
              tgabox: false,
              signinlayer: false
            })
            // '没有授权 统计'
            app.userstatistics(7);
            // 商品详情
            _this.detailfunshop();
          }
        }
      });  
    };    
  },  
  pullupsignin: function () {
    // // '没有授权'
    this.setData({tgabox: true});
  },
  // 授权点击统计
  clicktga: function () {app.clicktga(2)},  
  clicktganone: function () {this.setData({ tgabox: false })},
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
  // 跳转详情页 
  addressmanagement: function (event) {
    var gid = event.currentTarget.dataset.gid || event.target.dataset.gid;
    wx.redirectTo({  
      url: "/pages/detailspage/detailspage?gid=" + gid
    });
  },
  // 跳转详情页 不关闭上一页 
  addressmanagementlastno: function (event) {
    this.setData({ tipback: false, dsbframeiftr: false });
    var gid = event.currentTarget.dataset.gid || event.target.dataset.gid;
    wx.navigateTo({   
      url: "/pages/detailspage/detailspage?gid=" + gid
    })
  },   
  jumpecqdetail: function (w) {
      var id = w.currentTarget.dataset.id || w.target.dataset.id || '';
      var brandid = w.currentTarget.dataset.brandid || w.target.dataset.brandid || "";
      wx.navigateTo({
        url: "/page/component/pages/limitlottery/limitlottery?gid=" + id+'&brandId='+brandid,
      });
  },
  // 买家备注
  inputChange: function (e) {
    this.setData({desc: e.detail.value});
  }, 
  // 口令
  inputChangePW: function (e) {
    this.setData({descpassword: e.detail.value});
  }, 

  // 图片预览
  previewImg: function (w) {
    // var index = w.currentTarget.dataset.index || w.target.dataset.index||0;
    // var imgArr = this.data.imgArr;
    // wx.previewImage({
    //   current: imgArr[index],    
    //   urls: imgArr,               
    //   success: function (res) { },
    //   fail: function (res) { },
    //   complete: function (res) { },
    // })
  },

  // 身份证号弹框取消事件
  idnumbbcenfun:function(){
    this.setData({idnumberboxiftr: !this.data.idnumberboxiftr})
  },
  // 身份证号弹框确定事件
  idnumbbsubfun: function () {
    var _this = this; 
    if (_this.data.inputnamedata==''){
      app.showToastC('姓名不能为空');
      return false;
    };
    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    if (this.data.inputidnumberdata == '') {
      app.showToastC('身份证号不能为空');
      return false;
    } else if (!regIdCard.test(this.data.inputidnumberdata)){
      app.showToastC('身份证号格式不正确');
      return false;
    }else{};
    var isisdefault = _this.data.addressdata;
    var isisdefaultdata = '';
    if (isisdefault.length!=0){
      for (var i = 0; i < isisdefault.length;i++){
        if (isisdefault[i].aid == _this.data.tipaid){
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
        if (res.data.ReturnCode == 200){
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
    this.setData({inputnamedata: e.detail.value});
  },    
  // 身份证号
  inputidChange: function (e) {
    this.setData({inputidnumberdata: e.detail.value});
  }, 
  //  支付成功跳转
  comindellistjump: function (w) {
    var whref = w.currentTarget.dataset.href || w.target.dataset.href;
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type || 0;
    var wname = w.currentTarget.dataset.name || w.target.dataset.name || '美拆';
    // 公共跳转
    this.comjumpwxnav(item_type, whref, wname);
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
        url: "/page/component/pages/activitysharinglist/activitysharinglist"
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
  wshoppingCart: function () {
    wx.redirectTo({
      url: "/pages/shoppingCart/shoppingCart"
    });
  },  
  // 导航跳转 
  wnews: function () {
    var _this = this;
    app.limitlottery(_this);
  }, 
  // 导航跳转
  whomepage: function () {
    wx.reLaunch({
      url: "/pages/index/index?judgeprof=2"
    });
  },
  wmy: function () {
    app.signindata.iftr_mc = true;
    wx.redirectTo({
      url: "/pages/wode/wode"
    });
  },
  swiperchangeindex: function (detail){
    this.setData({
      detailSwiperindex: detail.detail.current
    });
    if(this.data.isVideoSwiper && this.data.ishowvideo && this.data.video){
      this.closevideo();
    }
  },
  changeGoodsSwip: function (detail) {
    if (detail.detail.source == "touch") {
      if (detail.detail.current == 0) {
        let swiperError = this.data.swiperError
        swiperError += 1
        this.setData({ swiperError: swiperError })
        if (swiperError >= 3) {
          console.error(this.data.swiperError)
          this.setData({ goodsIndex: this.data.preIndex });
          this.setData({ swiperError: 0 })
        }
      } else {
        this.setData({ preIndex: detail.detail.current });
        this.setData({ swiperError: 0 })
      }
    }
  },
  // 图片预览
  previewVideo: function () {
    var _this = this;
    if (_this.data.isVideoSwiper) {
      _this.setData({
        ishowvideo: true,
        video: this.data.ginfo.videos[0].url,
      })
      _this.data.videoContext.play();
    }
  },
  closevideo: function () {
    var _this = this
    _this.data.videoContext.pause()
    _this.data.videoContext.stop()
    _this.setData({
      ishowvideo: false,
    });
  },
  mAnimation: function () {
    this.animation.translate(0, -10).step().translate(0, 0).step().translate(0, -10).step().translate(0, 0).step()
    this.data.animation=this.animation.export();
  },
  tgfrShareIftrFun: function () {
    this.setData({tgfrShareIftr: false})
  },
  displaysharefriend:function(){
    this.sharefrind();
    this.setData({tgfrShareIftr:true});
  },
  // 保存图片
  sharesavethepicture: function () {
    var _this = this;
    var imgSrc = _this.data.actimgshare || '';
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.saveImageToPhotosAlbum({
                filePath: imgSrc,
                success() {
                  app.showToastC('保存成功')
                  _this.setData({ upserimgbox: false, savepicturesiftr: true, tgfrShareIftr: false });
                },
                fail() {
                  app.showToastC('保存失败')
                  _this.setData({ upserimgbox: false, savepicturesiftr: true, tgfrShareIftr: false });
                }
              })
            },
            fail() {_this.setData({picbox: true});}
          })
        } else {
          // 有则直接保存
          wx.saveImageToPhotosAlbum({
            filePath: imgSrc,
            success() {
              app.showToastC('保存成功');
              _this.setData({ upserimgbox: false, savepicturesiftr: true, tgfrShareIftr: false });
            },
            fail() {
              app.showToastC('保存失败');
              _this.setData({ upserimgbox: false, savepicturesiftr: true, tgfrShareIftr: false });
            }
          })
        }
      }
    });
  },
  dlfindfun: function () {
    wx.reLaunch({
      url: "/page/component/pages/dlfind/dlfind",
    })
  }, 
  // 晒单加载更多 
  delpostdatamore: function () {
    this.delpostdata(1);
  }, 
  // 晒单数据
  // post请求函数  url(请求地址) data(请求参数)  
  delpostdata: function (num){
    var _this = this;
    if (num == 0) {
      _this.data.pagenum = 1;
      _this.setData({ loadprompttxt: '查看更多'});
    } else {
      wx.showLoading({ title: '加载中...', })
      var pagenum = parseInt(_this.data.pagenum)
      _this.data.pagenum = ++pagenum;
      _this.setData({ loadprompttxt: '查看更多'});
    };
    var data = {
      uid: _this.data.uid, 
      loginid: _this.data.loginid, 
      page: _this.data.pagenum, 
      goods_id:_this.data.gid,
      vcode: Dec.subversionNumber(),
      source: 4
    };
    wx.request({
      url: app.signindata.clwcomurl + 'dryinglist',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      data: data,
      success: function (res) {
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          var dryinglist = res.data.List||[];
          if (num == 0) {
            var drydisnum = 0;
            if (res.data.Info){
              drydisnum = res.data.Info.drying_number || 0;
            };
            if (dryinglist.length!=0){
              _this.setData({ dryinglist: dryinglist, drydisnum: drydisnum });
            }else{
              _this.setData({ dryinglist: dryinglist, loadprompttxt: '暂无更多数据' });
            };
          } else {
            if (dryinglist.length != 0){
              var ltlist = _this.data.dryinglist.concat(dryinglist);
              _this.setData({ dryinglist: ltlist });
            }else{
              app.showToastC('暂无更多数据');
              _this.setData({ loadprompttxt: '暂无更多数据' });
            };
          };
        } else {
          app.showToastC(res.data.Msg)
        }
      },
      fail: function () {}
    })
  },
  // 晒单点赞
  ispraisefun: function (w) {
    var _this = this;
    var is_praise = w.currentTarget.dataset.is_praise || w.target.dataset.is_praise || 0;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var lid = w.currentTarget.dataset.lid || w.target.dataset.lid || 0;
    var listdata = this.data.dryinglist;
    if (_this.data.iftrputfor) {
      _this.data.iftrputfor = false;
      var data = {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        vcode: Dec.subversionNumber(),
        source: 4,
        drying_id: lid,
        is_praise: is_praise
      }
      wx.request({
        url: app.signindata.clwcomurl + 'praiseDrying',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: "POST",
        data: data,
        success: function (res) {
          _this.data.iftrputfor = true;
          if (res.data.ReturnCode == 200) {
              if (is_praise == 0) {
                listdata[ind].is_praise = 1;
                listdata[ind].praise_sum = parseInt(listdata[ind].praise_sum) + 1;
                listdata[ind].praise_user_list.unshift({ litpic: _this.data.userhead })
              } else {
                listdata[ind].is_praise = 0;
                listdata[ind].praise_sum = parseInt(listdata[ind].praise_sum) - 1;
              };
              _this.setData({ dryinglist: listdata });
          } else {
            app.showToastC(res.data.Msg)
          }
        },
        fail: function () {}
      });
    }
  }, 
  // 跳转详情
  jumpdlfdetail: function (w) {
    var drying_id = w.currentTarget.dataset.drying_id || w.target.dataset.drying_id || 0;
    wx.navigateTo({
      url: "/page/component/pages/dlfinddetails/dlfinddetails?drying_id=" + drying_id,
    })
  },
  // 计算图片大小
  imageLoadad: function (e) {
    var _this = this;
    var index = e.currentTarget.dataset.index || e.target.dataset.index || 0;
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;
    var viewHeight = 500,           //设置图片显示宽度，
      viewWidth = 500 * ratio;
    var commoddata = this.data.movies;
    if (commoddata) {
      commoddata[index].width = viewWidth;
      _this.setData({
        movies: commoddata
      });
    };
  },
  gobrandDetails: function (w) {
    var mid = w.currentTarget.dataset.mid || w.target.dataset.mid || 0;
    var settlement = this.data.is_exhibition;
    wx.navigateTo({
      url: "/page/secondpackge/pages/brandDetails/brandDetails?id=" + mid + "&settlement="+settlement,
    });
  },
  //展会推荐列表跳转
  jumpexhdetail: function (w) {
    var _this = this;
    var mtype = w.currentTarget.dataset.mtype || w.target.dataset.mtype || 0;
    var brandid = w.currentTarget.dataset.brandid || w.target.dataset.brandid || "";
    var id;
    if (mtype == 12 || mtype == 11) {
      id = w.currentTarget.dataset.gid || w.target.dataset.gid || 0;
    } else {
      id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    }
    app.jumpexhdetail(mtype, id,brandid);
  },
  // 展会公共跳转
  exhibitionpubjump: function (w) {
    var type = w.currentTarget.dataset.type || w.target.dataset.type || '';
    var jumpid = w.currentTarget.dataset.id || w.target.dataset.id || '';
    app.exhibitionpubjump(type, jumpid)
    var clouddata = { type:18 ,adv_id: jumpid};
    app.cloudstatistics('advertisingStat', clouddata)
  },
  // 调取展会品牌数据
  exhibdatafun: function (num) {
    var _this = this;
    if (num == 1) {
      _this.data.exhpage = 0;
    } else {
      var pagenum = parseInt(_this.data.exhpage)
      _this.data.exhpage = ++pagenum;
    };
    // 展会
    var exh = Dec.Aese('mod=show&operation=brandDetail&brandId=' + _this.data.brandId + '&page=' + _this.data.exhpage + '&gid=' + _this.data.gid + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid+'&dataType='+_this.data.is_exhibition);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + exh,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('展会===============',res)
        if (res.data.ReturnCode == 200) {
          if (num == 1) {
            var brand = res.data.Info.brand || '';
            var list = res.data.List.activity || '';
            for (var r = 0; r < list.length; r++) {
              if(_this.data.newdataexh){
                list[r].start_time = '暂未';
                list[r].stop_time = _this.toDate(list[r].stop_time);
              }else{
                list[r].start_time = _this.toDate(list[r].start_time);
                list[r].stop_time = _this.toDate(list[r].stop_time);
              }
            };

            brand.bradDesc = brand.bradDesc.split('hc').join('\n');
            _this.setData({
              exhdata: list,
              userbranddata: brand
            })
            _this.addsementfun();
          } else {
            var list = res.data.List.activity || [];
            if (list.length != 0) {
              var comdataarr = _this.data.exhdata.concat(list);
              _this.setData({
                exhdata: comdataarr
              })
            } else {
              app.showToastC('没有更多数据了');
            }
          };
        };
      },
      fail: function () { }
    });
  },
  // 广告
  addsementfun: function () {
    var _this = this;
    var exh = Dec.Aese('mod=info&operation=toyShow&type=1');
    wx.request({
      url: app.signindata.comurl + 'ads.php' + exh,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('广告=============',res)
        if (res.data.ReturnCode == 200) {
          _this.setData({
            addsetData: res.data.banner || []
          })
        } else {
          _this.setData({
            addsetData: []
          })
        };
      },
      fail: function () { }
    });
  },
  imgCanelTgexh: function () {
    this.setData({
      exhpicsave: false,
      addfrindcommoni: false
    });
  },
  exhsavehandleSetting: function (e) {
    var _this = this;
    if (!e.detail.authSetting['scope.writePhotosAlbum']) {
      wx.showModal({
        title: '警告',
        content: '若不打开授权，则无法将图片保存在相册中！',
        showCancel: false
      });
      _this.setData({exhpicsave: false});
    } else {
      _this.setData({exhpicsave: false,});
      _this.frpcomsavethepicture();
    }
  },
  // 保存图片
  frpcomsavethepicture: function () {
    var _this = this;
    var imgSrc = '';
    wx.getImageInfo({
      src: _this.data.saveimgurlfrpb || '',
      fail: function (res) {},
      success: function (res) {
        var imgSrc = res.path;
        wx.getSetting({
          success(res) {
            // 如果没有则获取授权
            if (!res.authSetting['scope.writePhotosAlbum']) {
              if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
                wx.authorize({
                  scope: 'scope.writePhotosAlbum',
                  success() {
                    wx.saveImageToPhotosAlbum({
                      filePath: imgSrc,
                      success() {
                        app.showToastC('保存成功');
                        _this.setData({ addfrindcommoni: false })
                      },
                      fail() {
                        app.showToastC('保存失败');
                        _this.setData({ addfrindcommoni: false })
                      }
                    })
                  }
                })
              } else {
                _this.setData({exhpicsave: true,});
              }
            } else {
              // 有则直接保存
              wx.saveImageToPhotosAlbum({
                filePath: imgSrc,
                success(res) {
                  app.showToastC('保存成功')
                  _this.setData({ addfrindcommoni: false })
                },
                fail(res) {
                  app.showToastC('保存失败')
                  _this.setData({ addfrindcommoni: false })
                }
              })
            }
          }
        });
      }
    })
  },
  exhibdetailfun: function (w) {
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 1;
    var query = wx.createSelectorQuery();
    query.select('#exh' + ind).boundingClientRect();
    query.selectViewport().scrollOffset();

    if(this.data.userbranddata || ind==2){}else if (this.data.is_exhibition==1||(this.data.is_exhibition!=1&&this.data.brandId>0)){
      this.exhibdatafun(1);
      app.livebroadcast(this, this.data.brandId)  // 直播数据
    };

    query.exec(function(res) {
      if (res && res[0] && res[1]) {
        wx.pageScrollTo({
           scrollTop:res[0].top+res[1].scrollTop-app.signindata.statusBarHeightMc||99,
           duration:300
        })
      }
    });
    this.setData({
      exhibdetail: !this.data.exhibdetail
    })
  },
  addfrindcommonifun: function (w) {
    var url = w.currentTarget.dataset.url || w.target.dataset.url;
    var name = w.currentTarget.dataset.name || w.target.dataset.name || '';
    if (url) {
      this.setData({
        addfrindcommoni: !this.data.addfrindcommoni,
        saveimgurlfrpb: url
      });
    } else {
      app.showToastC(name + '未提供此方式');
    }
  },
  closefrindcommoni: function () {
    this.setData({
      addfrindcommoni: !this.data.addfrindcommoni
    });
  },
  // 跳转定位
  jumpposition:function(w){
    wx.navigateTo({
      url: "/page/secondpackge/pages/buyingTickets/buyingTickets"
    });
  },
  jumpMapFun(){
    wx.navigateTo({ 
      url: "/page/secondpackge/pages/canvasRoute/canvasRoute"
    });
  },
  SaveCard: function(e) {
    let that = this;
    console.log('保存');
    var imgSrc = e.currentTarget.dataset.img;
    //获取相册授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功');
              that.img(imgSrc)
            }
          })
        }else{
          that.img(imgSrc)
        }
      }
    })
  },
  img: function (imgSrc){
    var imgSrc = imgSrc;
    wx.downloadFile({
      url: imgSrc,
      success: function (res) {
        console.log(res); //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            console.log(data);
            wx.showToast({
              title: '保存成功',
              duration: 2000
            })
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    wx.showToast({
                      title: '图片已保存',
                      icon:'none',
                      duration:2000
                    })
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          }
        })
      }
    })

  }, 



})
