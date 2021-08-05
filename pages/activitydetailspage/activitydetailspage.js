var Dec = require('../../common/public.js');//aes加密解密js
var WxParse = require('../../wxParse/wxParse.js');
var time = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tgaimg: app.signindata.tgaimg || 'https://www.51chaidan.com/images/default/openscreen.jpg',
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
    blackCity: app.signindata.blackCity,  
    windowHeight: app.signindata.windowHeight || 600,
    // 加载loading
    headhidden: true,    
    id:'', 
    typea:1,
    // 颜色id
    colorid: '',
    colorcon: '',
    // 颜色id
    sizeid: '',
    sizecon: '',      
    // 数据
    commoddata:'',
    // banner 图片
    movies:[],
    // 授权弹框
    tgabox: false,
    movies: [],
    // 商品详情数据
    zunmdata: {},
    // 拆单用户数据
    uinfodata: {},
    // 倒计时
    countdown: 30,
    // 倒计时判断
    iftrcountdown:true,
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
    textpbiftrtext: '',
    // 价格明细显示隐藏
    pricedetailc: false,
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
    colorcon: '',
    // 颜色id
    sizeid: '',
    sizecon: '',
    //  优惠券 运费券
    coudata1: [],
    coudata1cid: '',
    coudata1mon: 0,
    // 代金券
    coudata2: [],
    coudata2cid: '',
    coudata2mon: 0,
    coupon_type:1,
    coudata2mondiscount: '0.00',
    // 公共默认信息
    defaultinformation: app.signindata.defaultinformation || '',
    // 后台返回总价格
    payment: '',
    // 支付弹框
    paymentiftr: false,
    // 应付金额
    amountpayable: '0.00',
    // 运费
    freight: '￥0.00',
    // 商品价格
    commodityprice: 0,
    // 税费
    taxation: 0,
    // 订单id
    cart_id: '',
    // 后台传回
    hamount: 0,
    // 支付完成赠送卷
    paycheadwsong: '',
    // 是否支付成功
    payiftr: false,
    // 支付成功分享的图片地址
    paycheadwsongimg: '',
    // 组合弹框
    combdataimg: {},
    // 判断是否是 原产品还是活动 1原产品 2 活动二 
    judgmentactivity: 1,
    // 滚动条的高度
    scrollHeight: 0,
    // 提交支付蒙层
    suboformola: false,
    // 机会不足提示语
    tips: '',
    // 新人专享提示语
    newtips:'',
    // 新人专享和机会不足提示判断
    ifcomtipiftr: 1 ,    
    // 弹框判断
    comtipiftr: false, 
    // 买家备注
    desc: '',
    // 满减优惠券的使用判断
    commoditypriceiftr: 0,
    // 购买显示商品数量
    quantityofgoods: '',
    //  预览图数据
    imgArr: [],
    // 身份证号弹框判断
    idnumberboxiftr: false,
    // 真实姓名
    inputnamedata: '',
    // 身份证号
    inputidnumberdata: '' ,
    // 滚动条高度
    nemscrollTop:0 ,
    apptiptxt:'app专享活动，快去下载参加\n输入口令“美拆”，即可下载',
    // 微信号码
    wxnum: 'meichai666666', 
    // 支付完成显示分类跳转数据
    shareinfo: '',
    // 倒计时
    interval:"",
    // 统计邀请
    rec_goods_id:'',
    rec_cart_id:'',
    // 保存图片
    picbox:false,
    tgimgbox:false, 
    copyiftr:false,
    // 免单活动列表
    exemption:[],
    // 截图本地路径
    snapshot: '',    
    // 免单提示数据图片列表
    eshlist:[],
    // 免单活动是否显示
    wsh:false,
    wshpay:false,
    eshjumphref:'',
    // 领奖提示数据
    awardrresentation:[],
    awardrresentiftr:false,
    awardrresentationjump:'',
    datatoken:'',
    // 支付运费弹框
    payfreightone:false,
    // 支付运费金额
    payfreightmony:0,
    // 红包口令
    redpinputdata:'',
    redpinputdataiftr:false,
    // 防止多次提交
    preventmultiplesubmission: true,
    imageLoadSponsorheight:0,
    // 判断图片是否加载完
    imagenum:0,
    // 签到任务
    signtask:'',
    tipstask:'',
    clicktherequestiftr:true,
    comtipiftrtask:true,
    // 活动分享微信图片
    actimgshare:'',
    // 保存图片上传图片弹框
    upserimgbox:false,
    share_desc:'',
    // 判断是否保存图片
    savepicturesiftr:false,
    gengImgArr:[],
    arrjson:{},
    // 用户头像
    avatarUrl: app.signindata.avatarUrl,
    // 分享图片地址
    actimgshare: '',
    cart_idsave: '',
    uploadscreenshots: false,
    share_desc: '',
    upserimgboxWinningtheprize:false,
    share_descWinningtheprize:'',
    actimgshareWinningtheprize:'',
    // 领奖提示
    rpinfotip:'',
    swiperIndex:0,
    // tab切换
    tabdopnum:1,
    shopnum:0,
    // 防止swiper卡住
    swiperError: 0,
    goodsIndex: 0,
    preIndex: 0, 
    swiperarr:[],
    swiperCurrent:0,
    toDateTime:'',
    taskOrUserImg:true,
    pinkSpot:[1,2,3],
    iftrmoneySymbol:true,
    iftrTimeCd:false,
    tgfrShareIftr:false,
    // 赠送优惠券数据
    newcoupondata: [],
    // 节日主题
    newcoutitle: '新人礼包',
    // 赠送优惠券弹框是否显示
    newcoupon: false,
    headhiddengeneratePictures:true,
    // 晒单数量
    dryinglistnum: 0,
    isProduce: app.signindata.isProduce,
    awatip:false,
    uidid:'',
    newcouiftr:0,
    // 是否开启了分享功能
    isShareFun: true,
    actrecactnum:1,
    actrecactlist:[],
    actispay:1,// 1 免费 先显示付费 2 付费 先显示免费
    actscrollleft:0,
    pid:0,
    c_title: '活动详情',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    listBlindBox: [],
    listShowBox: [],
    listLotto:[],
    successfulregistration:false,
    subscrpro:'',
    subscrproiftr:false,
    tipfulregistration:false,
    iftrtipstar:true,
    detaposiiftr:true,
    islimittery:0, // 是否是抽签页面跳转过来 
    pushWay:0,
    // 订阅判断
    subscribeif: app.signindata.subscribeif,
    // 订阅参数 template_id    模版id  subscribe_type   模版类型
    subscribedata:'',
    subscribeifstat:true,
    // 透视卡大小悬浮框
    perspcardiftrmax:false,
    perspcardiftrmin:false,
    // 倒计时时间戳
    perspcardata:'',
    // 倒计时展示数据
    percountdown:'',
    // 倒计时
    countdowntime:'',
    // 是否是手动直接分享 0 不是 1 是
    cs:0,
    // 上传截图提示弹框
    screenshottipsiftr:false,
    is_share: false,
    // 生成图片分享数据
    activityblindbox:'',
    patchReceive:[],
    isGainPatchBySelf:true,
    videoOpportunity:true,
    ishowgetchip:false,
    isshowusertip:'',
    otherimgarr:[],

    // 是否是展会
    is_exhibition: 0,
    addfrindcommoni: false,
    exhpage: 0,
    exhdata: [],
    exhbanner: [],
    exhibdetail: 1, // 1品牌专区 2奖项介绍 3商品详情
    brandId: '',
    userbranddata: '',
    saveimgurlfrpb: '',

    pictboxbox: false,
    cliptxt:'pili@51chaidan.com',
    addsetData:[[]],
    mySignatureNumber:false,
    signatureList:false,
    winningProbability:false,
    // 是否中奖
    wonOrNot:false,
    sigListdata:[],
    rLUserLotto:{},
    muSnData:[],
    multipleDisplay:'',
    timestamp:Date.parse(new Date()) / 1000,
    // 刮刮卡入口
    isScrapingCard:false,
  },
  // 跳转刮刮卡
  jumpScrapingCard(){
    app.comjumpwxnav(9023,'','','')
  },

  wonOrNot(){
    this.setData({wonOrNot:!this.data.wonOrNot})
  },
  winProbility(w){
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    if(ind == 9999){
      this.setData({
        winningProbability:!this.data.winningProbability
      })
    }else{
      if(ind == 999){
        var multipleDisplay = this.data.rLUserLotto
      }else{
        var multipleDisplay = this.data.sigListdata[ind];
      };
      this.setData({
        winningProbability:!this.data.winningProbability,
        multipleDisplay:multipleDisplay
      })      
    };

  },
  mySignatureNum(){
    var _this = this;
    if(_this.data.muSnData.length == 0){

      var qhd = Dec.Aese('mod=miandan&operation=mylotto&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id);
      wx.showLoading({ title: '加载中...', mask: true })
      wx.request({
        url: app.signindata.comurl + 'spread.php' + qhd,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {
          console.log('签号列表================',res)
          wx.hideLoading();
          if (res.data.ReturnCode == 200) {
            var muSnData = res.data.List.lotto || [];
            if(muSnData.length != 0){
              muSnData.map(function(item){
                if(item.nick){
                  item.nick =  _this.plusXing(item.nick,1,0);
                };
                return item;
              })
            };
            _this.setData({
              muSnData:muSnData || []
            });
            _this.setData({mySignatureNumber:!_this.data.mySignatureNumber})
          } else {
            app.showModalC(res.data.Msg)
          };
        }
      }); 
    }else{
      this.setData({mySignatureNumber:!this.data.mySignatureNumber})
    };

    
  },
  plusXing (str,frontLen,endLen) {
    var len = str.length-frontLen-endLen;
    var xing = '';
    for (var i=0;i<len;i++) {
    xing+='*';
    }
    return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
  },

  sigListFun(){
    var _this = this;
    if(_this.data.sigListdata.length == 0){
      var qhd = Dec.Aese('mod=miandan&operation=lottoTop&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id);
      wx.showLoading({ title: '加载中...', mask: true })
      wx.request({
        url: app.signindata.comurl + 'spread.php' + qhd,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {
          console.log('列表排行================',res)
          wx.hideLoading();
          if (res.data.ReturnCode == 200) {
            var sigListdata = res.data.List.lotto || [];
            if(sigListdata.length != 0){
              sigListdata.map(function(item){
                if(item.nick){
                  item.nick = _this.plusXing(item.nick,1,0);
                };
                return item;
              })
            };

            _this.setData({
              sigListdata:sigListdata || [],
              rLUserLotto:res.data.Info.userLotto || {}
            })
            _this.setData({signatureList:!_this.data.signatureList})
          } else {
            app.showModalC(res.data.Msg)
          };
        }
      }); 
    }else{
      this.setData({signatureList:!this.data.signatureList})
    };

    
  },
  pictboxboxfun: function () {
    this.setData({ pictboxbox: false });
    this.subscrfunstar();
  },
  //展会推荐列表跳转
  jumpexhdetail: function (w) { 
    var _this = this;
    var mtype = w.currentTarget.dataset.mtype || w.target.dataset.mtype || 0;
    var brandid = w.currentTarget.dataset.brandid || w.target.dataset.brandid || "";
    var id;
    if(mtype == 12 || mtype == 11){
      id = w.currentTarget.dataset.gid || w.target.dataset.gid || 0;
    } else {
      id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    }
    app.jumpexhdetail(mtype, id,brandid);
  },
  // 展会公共跳转
  exhibitionpubjump:function(w){
    var type = w.currentTarget.dataset.type || w.target.dataset.type||'';
    var jumpid = w.currentTarget.dataset.id || w.target.dataset.id || '';
    app.exhibitionpubjump(type, jumpid)
    var clouddata = { type:17 ,adv_id: jumpid};
    app.cloudstatistics('advertisingStat', clouddata)
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
      _this.setData({
        exhpicsave: false
      });
    } else {
      _this.setData({
        exhpicsave: false,
      });
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
              if (res.authSetting['scope.writePhotosAlbum'] === undefined){
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
                _this.setData({
                  exhpicsave: true,
                });
              }
            } else {
              // 有则直接保存
              wx.saveImageToPhotosAlbum({
                filePath: imgSrc,
                success(res) {
                  app.showToastC('保存成功');
                  _this.setData({ addfrindcommoni: false })
                },
                fail(res) {
                  app.showToastC('保存失败');
                  _this.setData({ addfrindcommoni:false})
                }
              })
            }
          }
        });
      }
    })

  },
  addfrindcommonifun: function (w) {
    var url = w.currentTarget.dataset.url || w.target.dataset.url;
    var name = w.currentTarget.dataset.name || w.target.dataset.name||'';
    if (url) {
      this.setData({
        addfrindcommoni: !this.data.addfrindcommoni,
        saveimgurlfrpb: url
      });
    } else {
      app.showToastC(name+'未提供此方式');
    }
  },

  
closefrindcommoni:function(){
  this.setData({
    addfrindcommoni: !this.data.addfrindcommoni
  });
},

  limsavefun: function () {
    this.setData({
      limsaveiftr: !this.data.limsaveiftr
    });
  },
  exhibdetailfun: function (w) {
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 1;
    this.setData({
      exhibdetail: ind
    })
    var query = wx.createSelectorQuery();
    query.select('#exh' + ind).boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec(function(res) {
      if (res && res[0] && res[1]) {
        wx.pageScrollTo({
           scrollTop:res[0].top+res[1].scrollTop-app.signindata.statusBarHeightMc||90,
           duration:300
        })
      }
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
  // 调取展会品牌数据
  exhibdatafun: function (num) {
    var _this = this;
    if (num == 1) {
      _this.data.exhpage = 0;
      _this.setData({});
    } else {
      var pagenum = parseInt(_this.data.exhpage)
      _this.data.exhpage = ++pagenum;
    };
    // 展会
    var exh = Dec.Aese('mod=show&operation=brandDetail&brandId=' + _this.data.brandId + '&page=' + _this.data.exhpage + '&gid=' + _this.data.gid+ '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid+'&dataType='+_this.data.is_exhibition);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + exh,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          if (num == 1) {
            var brand = res.data.Info.brand || '';
            var list = res.data.List.activity || '';
            for (var r = 0; r < list.length; r++) {
              list[r].start_time = time.toDate(list[r].start_time);
              list[r].stop_time = time.toDate(list[r].stop_time);
            };
            _this.setData({
              exhdata: list,
              userbranddata: brand
            })

            if(_this.data.is_exhibition==1){
              _this.addsementfun();
            };

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

  closegetchip: function () {
    var _this = this;
    _this.setData({
      ishowgetchip: !_this.data.ishowgetchip,
    })
  },
  screenshottips:function(w){
     this.setData({
       screenshottipsiftr:true
     });
  },
  screenshottipsnone:function(){
    this.setData({
      screenshottipsiftr: false
    });
  },
  detaposiiftrfun: function () {
    this.setData({ detaposiiftr: !this.data.detaposiiftr });
  },
  subscrprofun:function(){
    this.setData({ subscrproiftr:false})
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
  swfcanimgcouone:function(){
    if (this.data.couponType==2){
      wx.navigateTo({
        url: "/pages/smokeboxlist/smokeboxlist",
      });
    }else{
      wx.navigateTo({
        url: "/pages/classificationpage/classificationpage?cate=5&cid=57&wtype=3&wname=潮玩",
      });
    };
    this.setData({ newcoupon:false})
  },
  //轮播图的切换事件  
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current   //获取当前轮播图片的下标
    });
  },
  changeGoodsSwip: function (detail) {
    if (detail.detail.source == "touch") {
      //当页面卡死的时候，current的值会变成0 
      var detalNum = detail.detail.current;
      var swiperarr = this.data.swiperarr[detalNum]||{};
   
      if (this.data.swiperarr.length==2){
         this.setData({
           iftrmoneySymbol:false
         })
      };
      if (detalNum == 1){
         this.setData({
           taskOrUserImg:false
         });
      }else{
        this.setData({
          taskOrUserImg: true
        });     
      };
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
        //将开关重置为0
        this.setData({ swiperError: 0 })
      }
    }
  },
  // tab切换
  tabdopnum:function(w){
    var tabdopnum = w.currentTarget.dataset.tabdopnum || w.target.dataset.tabdopnum;
    this.setData({
      tabdopnum: tabdopnum
    });
  },
  // 显示弹框
  discomtip: function (w) {
    var desc = w.currentTarget.dataset.desc || w.target.dataset.desc;
    this.setData({
      tipstask: desc || '',
      comtipiftrtask: !this.data.comtipiftrtask,
    });
  },
  taskhidcomtip: function () {
    this.setData({
      comtipiftrtask: !this.data.comtipiftrtask
    })
  },
  // 截图函数
  /**
   * 绘制多行文本
   */
  drawText: function (ctx, str, initHeight, lineHeight, beginWidth, canvasWidth) {
    var line = 0;
    var lineWidth = 0;
    var dotWidth = 0;
    var lastSubStrIndex = 0;
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
        initHeight += lineHeight;
        lineWidth = 0;
        lastSubStrIndex = i;
        beginWidth = 0;
        line += 1;
      }
      if (i == str.length - 1) {
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
      src: _this.data.commoddata.cover,
      fail: function (res) {},
      success: function (res) {
        const ctx = wx.createCanvasContext('snapshot')
        let dw = 300
        let dh = 180
        var width = res.width
        var height = res.height
        var scale = height / dh
        ctx.setFillStyle('#fff')
        ctx.fillRect(0, 0, dw, 240)
        ctx.drawImage(res.path, (dw - width / scale) / 2, 0, width / scale, dh);
        ctx.fillStyle = "#f93e45";
        var txtVol = 'Vol.' + _this.data.commoddata.id;
        var measTxtNum = ctx.measureText(txtVol).width + 45;
        ctx.fillRect(6, 6, measTxtNum , 26);
        ctx.setFontSize(17);
        ctx.setFillStyle('#fff');
        ctx.fillText(txtVol, 16, 26);
        ctx.draw(true);
        var actor = _this.data.gengImgArr||[];
        if(actor.length>=4){
          var actorarr = actor.slice(0,4);
          actorarr.unshift({ headphoto: '../images/actfree.png'});
        }else{
          var actorarr = actor||[];
          var lengthi = 5 - actorarr.length;
          for (var i = 0; i < lengthi;i++){
            actorarr.unshift({ headphoto: '../images/actfree.png' });
          };
        };
        _this.generateMoreImg(ctx, actorarr, dh);
      }
    })
  },
  generateMoreImg: function (ctx, actorarr, dh){
    var _this = this;
    for (var i = 0; i < actorarr.length;i++){
      _this.data.arrjson[actorarr[i].headphoto] = { path: '', ind: i }
    };
    for (var a in _this.data.arrjson){
      _this.genlistimg(ctx, a, dh);
    };
  },
  genlistimg: function (ctx,url,dh){
    var _this = this;
    if (url != '../images/actfree.png'){
      wx.getImageInfo({
        src: url,
        success: function (res) {
          _this.data.arrjson[url].path = res.path || '../images/actfree.png';
          var num = 0;
          for (var a in _this.data.arrjson) {
            if (_this.data.arrjson[a].path == '') {
              return;
            };
            num++;
          };
          if(num<5){
            var nu = 5-num;
             for(var n=0;n<nu;n++){
               _this.data.arrjson[n + 'q'] = { path: '../images/actfree.png', ind: n }
             };
          };
          var qq = 0;
          for (var b in _this.data.arrjson) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(parseInt(_this.data.arrjson[b].ind) * (46 + 12) + 34, (dh + 31),23, 0, Math.PI * 2, false);
            ctx.strokeStyle = "#3f47b0";
            ctx.clip();
            ctx.drawImage(_this.data.arrjson[b].path, parseInt(_this.data.arrjson[b].ind) * (46 + 12) + 11, (dh + 8), 46, 46)
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
            ctx.draw(true);
            qq++
            if(qq==5){
              ctx.draw(true , setTimeout(function () {
                  wx.canvasToTempFilePath({
                    canvasId: 'snapshot',
                    success: function (res) {
                      _this.setData({
                        snapshot: res.tempFilePath
                      });
                    },
                    fail: function (res) {}
                  })
                }, 300));
            }
          };
        },
        fail: function (res) {
          _this.data.arrjson[url].path = '../images/actfree.png';
          _this.data.arrjson[url].fail = true
          var num = 0;
          for (var a in _this.data.arrjson) {
            if (_this.data.arrjson[a].path == '') {
              return;
            };
            num++;
          };
          if (num < 5) {
            var nu = 5 - num;
            for (var n = 0; n < nu; n++) {
              _this.data.arrjson[n + 'q'] = { path: '../images/actfree.png', ind: n }
            };
          };
          var qq = 0;
          for (var b in _this.data.arrjson) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(parseInt(_this.data.arrjson[b].ind) * (46 + 12) + 34, (dh + 31), 23, 0, Math.PI * 2, false);
            if (_this.data.arrjson[b].fail){
              ctx.strokeStyle = "red";
            }else{
              ctx.strokeStyle = "#3f47b0";
            };
            ctx.clip();
            ctx.drawImage(_this.data.arrjson[b].path, parseInt(_this.data.arrjson[b].ind) * (46 + 12) + 11, (dh + 8), 46, 46)
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
            ctx.draw(true);
            qq++
            if (qq == 5) {
              ctx.draw(true, setTimeout(function () {
                wx.canvasToTempFilePath({
                  canvasId: 'snapshot',
                  success: function (res) {
                    _this.setData({
                      snapshot: res.tempFilePath
                    });
                  },
                  fail: function (res) {}
                })
              }, 300));
            }
          };
        }
      });
    }else{
      _this.data.arrjson[url].path = '../images/actfree.png';
      var num = 0;
      for (var a in _this.data.arrjson) {
        if (_this.data.arrjson[a].path == '') {
          return;
        };
        num++;
      };
      if (num < 5) {
        var nu = 5 - num;
        for (var n = 0; n < nu; n++) {
          _this.data.arrjson[n + 'q'] = { path: '../images/actfree.png', ind: n }
        };
      };
      var qq = 0;
      for (var b in _this.data.arrjson) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(parseInt(_this.data.arrjson[b].ind) * (46 + 12) + 34, (dh + 31), 23, 0, Math.PI * 2, false);
        ctx.strokeStyle = "#3f47b0";
        ctx.clip();
        ctx.drawImage(_this.data.arrjson[b].path, parseInt(_this.data.arrjson[b].ind) * (46 + 12) + 11, (dh + 8), 46, 46)
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        ctx.draw(true);
        qq++
        if (qq == 5) {
          ctx.draw(true, setTimeout(function () {
            wx.canvasToTempFilePath({
              canvasId: 'snapshot',
              success: function (res) {
                _this.setData({
                  snapshot: res.tempFilePath
                });
              },
              fail: function (res) {}
            })
          }, 300));
        }
      };
    };
  },
  // 免单活动跳转
  actexempfun: function (event){
    var gid = event.currentTarget.dataset.gid || event.target.dataset.gid;
    wx.redirectTo({   
      url: "/pages/activitydetailspage/activitydetailspage?id=" + gid
    });
  },
  acetlistfun:function(){
    let pages = getCurrentPages();
    let prevpage = pages[pages.length - 2];
    if (prevpage) {
      if (prevpage.route == 'pages/activitysharinglist/activitysharinglist') {
        wx.navigateBack();
      } else {
        wx.redirectTo({
          url: "/pages/activitysharinglist/activitysharinglist"
        });
      };
    } else {
      wx.redirectTo({
        url: "/pages/activitysharinglist/activitysharinglist"
      });
    };
    this.setData({
      wsh:false,
      awardrresentiftr:false,
      payfreightone:false
    });
  },
  // 点击复制
  sponsocopyone:function(){
    this.setData({
      copyiftr:true
    });
  },
  copyfitrfun:function(){
    this.setData({
      copyiftr: false
    });
  },
  sponsocopytwo:function(){
    var _this = this;
    if(_this.data.commoddata.brand){
        var txt = _this.data.cliptxt || '';
    }else{
        var txt = _this.data.wxnum;
    }
    wx.setClipboardData({
      data: txt ,
      success: function (res) {
        app.showToastC('复制成功');
        _this.setData({copyiftr:false});
      }
    });
  },
  // 我要赞助
  sponsofun:function(){
    this.setData({
      tgimgbox:true
    });
  }, 
  // 保存图片
  savethepicture: function () {
    var _this = this;
    var imgSrc = _this.data.commoddata.supportUrl || '';
    wx.downloadFile({
      url: imgSrc,
      success: function (res) {
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            app.showToastC('保存成功');
            _this.setData({ shareshopiftr: false, tgimgbox: false});
          },
          fail: function (err) {
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              _this.setData({
                picbox: true
              });
            }
          },
          complete(res) {}
        })
      }
    })
  },
  // 取消保存图片授权
  imgCanelTg: function () {
    app.showToastC('保存失败');
    this.setData({ shareshopiftr: false, tgimgbox: false, picbox: false });
  },
  handleSetting: function (e) {
    let that = this;
    var _this = this;
    if (!e.detail.authSetting['scope.writePhotosAlbum']) {
      wx.showModal({
        title: '警告',
        content: '若不打开授权，则无法将图片保存在相册中！',
        showCancel: false
      });
      that.setData({
        picbox: false
      });
      _this.setData({ shareshopiftr: false, tgimgbox: false });
    } else {
      that.setData({
        picbox: false,
      });
      _this.setData({ shareshopiftr: false, tgimgbox: false });
    }
  },
  tgimgbg: function () {
    this.setData({
      tgimgbox: false,
      wsh:false,
      wshpay:false
    });
  },  
  // 跳转邀请页面
  invitingfriends:function(){
    var _this = this;
    var commoddata = this.data.commoddata;  
    var cart_id = this.data.cart_id||'';
    var goods_id = commoddata.id; // 商品id
    var goods_name = commoddata.name; // 商品名称
    var gsale = commoddata.gsale;  //价格
    var goods_share = commoddata.goods_share || '';  //缩略图
    var snapshot = this.data.snapshot||'';
    var title = '免费送你[' +(_this.data.commoddata.activityDesc || '') + ']，点击领取！';
    wx.navigateTo({
      url: "/pages/invitingfriends/invitingfriends?goods_id=" + goods_id + "&goods_name=" + goods_name + "&gsale=" + gsale + "&goods_share=" + encodeURIComponent(goods_share) + "&cart_id=" + cart_id + "&shoporact=2&snapshot=" + encodeURIComponent(snapshot) + "&title=" + title
    });
  },
  // 获取滚动条当前位置
  onPageScroll: function (e) {},
  // 监听scrolltop高度
  articelScroll: function (w) {
    this.setData({
      scrollHeight: w.detail.scrollTop
    });
  },
  // 点击改变scrolltop高度
  slider1change: function (e) { 
    var scrollHeight = this.data.scrollHeight;
    scrollHeight += 50;
    this.setData({
      scrollHeight: scrollHeight
    })
  },
  // 活动二提交金额计算
  hdramountcalculation: function () {
    var _this = this;
    var comzund = this.data.combdataimg.goods_detial;
    // 税费
    var txton = 0;
    var compric = 0;
    var carriagearr = [];
    for (var i = 0; i < comzund.length; i++) {
      if (comzund[i].imgiftr) {
        txton += parseFloat(comzund[i].tax||0).toFixed(2) * parseFloat(comzund[i].numberofdismantling).toFixed(2);
        compric += parseFloat(comzund[i].gsale).toFixed(2) * parseFloat(comzund[i].numberofdismantling).toFixed(2);
        carriagearr.push(comzund[i].carriage);
      };
    };
    var compricbj = compric - parseFloat(_this.data.coudata2mon).toFixed(2);
    // 运费
    var max3 = carriagearr.sort().reverse()[0];
    var acc = 0;
    var freightiftr = '0.00';
    var xianshi = '0.00';
    if (this.data.defaultinformation.carriage.free != '-1') {
      var tddefcarfr = parseFloat(_this.data.defaultinformation.carriage.free)
      if (compricbj >= tddefcarfr) {
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
      freightiftr = parseFloat(tdzuncar);
      xianshi = '￥0.00';
      acc = parseFloat(tdzuncar) > parseFloat(_this.data.coudata1mon) ? parseFloat(tdzuncar) - parseFloat(_this.data.coudata1mon) : 0;
    };
    // 应付金额
    var _this = this;
    if (this.data.coupon_type == 1){
      var ap = compric - parseFloat(_this.data.coudata2mon) + acc + txton;
    }else{
      var ap = compric * (parseFloat(_this.data.coudata2mon)/10) + acc + txton;
      var coudata2mondiscount = compric - (compric * (parseFloat(_this.data.coudata2mon) / 10))
      this.setData({
        coudata2mondiscount: coudata2mondiscount.toFixed(2) || '0'
      })      
    }
    if (ap <= 0) {
      ap = 0;
    };
    this.setData({
      // 应付金额
      amountpayable: ap.toFixed(2),
      // 运费
      // freight: acc,
      freight: xianshi,
      freightiftr: freightiftr,
      // 商品价格
      commodityprice: compric.toFixed(2),
      // 税费
      taxation: txton.toFixed(2)
    })
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
  // 调取购物券
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
        if (res.data.ReturnCode == 200) {
          if (res.data.List){
            var redali = res.data.List||[];
            if (res.data.List.length != 0) {
              // 商品详情购买
              var comzund = _this.data.combdataimg.goods_detial||[];
              // 运费卷
              var comarrcarriage = [];
              for (var i = 0; i < comzund.length; i++) {
                if (comzund[i].imgiftr) {
                  if (comzund[i].coupon.carriage){
                    comarrcarriage = comarrcarriage.concat(comzund[i].coupon.carriage);
                  };
                };
              };
              comarrcarriage = _this.unique(comarrcarriage);
              for (var t = 0; t < comarrcarriage.length; t++) {
                var compric = 0;
                for (var y = 0; y < comzund.length; y++) {
                  if (comzund[y].imgiftr) {
                    if (comzund[y].coupon.carriage.indexOf(comarrcarriage[t]) != -1) {
                      compric += parseFloat(comzund[y].gsale).toFixed(2)*parseFloat(comzund[y].numberofdismantling).toFixed(2);
                    };
                  };
                };
                for (var u = 0; u < redali.length; u++) {
                  if (redali[u].status == 0) {
                    if (redali[u].type == comarrcarriage[t]) {
                      if (parseFloat(redali[u].condition) <= compric) {
                        redali[u].imgcheck = false;
                        redali[u].gettime = time.formatTimeTwo(redali[u].gettime, 'Y/M/D h:m:s');
                        redali[u].overtime = time.formatTimeTwo(redali[u].overtime, 'Y/M/D h:m:s');
                        screeningavailable1.push(redali[u]);
                      };
                    };
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
              for (var p = 0; p < comarrvoucher.length; p++) {
                var compricvou = 0;
                for (var a = 0; a < comzund.length; a++) {
                  if (comzund[a].imgiftr) {
                    if (comzund[a].coupon.voucher.indexOf(comarrvoucher[p]) != -1) {
                      compricvou+=parseFloat(comzund[a].gsale).toFixed(2)*parseFloat(comzund[a].numberofdismantling).toFixed(2);
                    };
                  };
                };
                for (var b = 0; b < redali.length; b++) {
                  if (redali[b].status == 0) {
                    if (redali[b].type == comarrvoucher[p]) {
                      if (parseFloat(redali[b].condition) <= compricvou) {
                        redali[b].imgcheck = false;
                        redali[b].gettime = time.formatTimeTwo(redali[b].gettime, 'Y/M/D h:m:s');
                        redali[b].overtime = time.formatTimeTwo(redali[b].overtime, 'Y/M/D h:m:s');
                        screeningavailable2.push(redali[b]);
                      };
                    };
                  };
                };
              };

              _this.setData({
                coudata1: screeningavailable1,
                coudata2: screeningavailable2,
                // 清空优惠券信息
                tipcoupon: '请选择优惠券',
                coudata1cid: '',
                coudata1mon: '0.00',
                coudata2cid: '',
                coudata2mon: '0.00',
              });
              // 优惠券 
              var checktwo2 = _this.data.coudata2||[];
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
                  }else{
                    txt2 = checktwo2[0].name + checktwo2[0].unit + parseFloat(checktwo2[0].value).toFixed(2);
                  }
                  check2cid = checktwo2[0].cid;
                  check2mon = checktwo2[0].value;
                  checktwo2[0].imgcheck = true;
                  coupon_type = 1;
                }; 
              };
              _this.setData({
                coudata2: checktwo2,
                coudata2cid: check2cid,
                coudata2mon: parseFloat(check2mon).toFixed(2),
                coupon_type: coupon_type
              });
              // 计算价格
              if (_this.data.judgmentactivity == 1) {
                _this.setData({
                  amountpayable: '0.01',
                  commodityprice: _this.data.commoddata.gsales,
                  coudata1cid: '',
                  coudata1mon: '0.00',
                  coudata2cid: '',
                  coudata2mon: '0.00',
                  taxation: '0.00',
                  freight: '￥0.00'
                })
              } else {
                _this.hdramountcalculation()
              };                        
              // 运费卷
              var checktwo1 = _this.data.coudata1||[];
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
                _this.setData({
                  coudata1: [],
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
                tipcoupon: txt,
              });
              // 计算价格
              if (_this.data.judgmentactivity == 1) {
                _this.setData({
                  amountpayable: '0.01',
                  commodityprice: _this.data.commoddata.gsales,
                  coudata1cid: '',
                  coudata1mon: '0.00',
                  coudata2cid: '',
                  coudata2mon: '0.00',
                  taxation: '0.00',
                  freight: '￥0.00'
                })
              } else {
                _this.hdramountcalculation()
              };
            }
        }
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
      }
    });
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
    var temp = []; 
    for (var i = 0; i < array.length; i++) {
      if (temp.indexOf(array[i]) == -1) {
        temp.push(array[i]);
      }
    }
    return temp;
  },   
  // 活动二提交金额计算
  hdramountcalculation: function () {
    var _this = this;
    var comzund = this.data.combdataimg.goods_detial;
    // 税费
    var txton = 0;
    var compric = 0;
    var carriagearr = [];
    for (var i = 0; i < comzund.length; i++) {
      if (comzund[i].imgiftr) {
        txton += parseFloat(comzund[i].tax||0).toFixed(2) * parseFloat(comzund[i].numberofdismantling).toFixed(2);
        compric += parseFloat(comzund[i].gsale).toFixed(2) * parseFloat(comzund[i].numberofdismantling).toFixed(2);
        carriagearr.push(comzund[i].carriage);
      };
    };
    var compriciftr = parseFloat(compric).toFixed(2);
    compric = compric - parseFloat(_this.data.coudata2mon).toFixed(2);
    // 运费
    var max3 = carriagearr.sort().reverse()[0];
    var acc = 0;
    if (this.data.defaultinformation.carriage.free != '-1') {
      var tddefcarfr = parseFloat(_this.data.defaultinformation.carriage.free)
      if (compric >= tddefcarfr) {
        acc = 0;
      } else {
        var tdzuncar = max3;
        acc = parseFloat(tdzuncar) > parseFloat(_this.data.coudata1mon) ? parseFloat(tdzuncar) - parseFloat(_this.data.coudata1mon) : 0;
      };
    } else {
      var tdzuncar = max3;
      acc = parseFloat(tdzuncar) > parseFloat(_this.data.coudata1mon) ? parseFloat(tdzuncar) - parseFloat(_this.data.coudata1mon) : 0;
    };
    // 应付金额
    var _this = this;
    if (this.data.coupon_type == 2) {
      var ap = compric * (parseFloat(_this.data.coudata2mon)/10) + acc + txton;
      var coudata2mondiscount = compric - (compric * (parseFloat(_this.data.coudata2mon) / 10))
      this.setData({
        coudata2mondiscount: coudata2mondiscount.toFixed(2) || '0'
      })
    }else{
      var ap = compric - parseFloat(_this.data.coudata2mon) + acc + txton;
    };
    if (ap <= 0) {
      ap = 0;
    };
    var freightiftr = '0.00';
    if (acc <= 0) {
      freightiftr = 0;
      acc = '满￥' + parseFloat(this.data.defaultinformation.carriage.free).toFixed(2) + '包邮';
    } else {
      freightiftr = parseFloat(acc).toFixed(2);
      acc = '￥' + parseFloat(acc).toFixed(2);
    };
    this.setData({
      // 应付金额
      amountpayable: ap.toFixed(2),
      // 运费
      freight: acc,
      freightiftr: freightiftr,
      // 商品价格
      commodityprice: compric.toFixed(2),
      // 满减优惠券的使用判断
      commoditypriceiftr: compriciftr,      
      // 税费
      taxation: txton.toFixed(2)
    })
  },
  // 倒计时
  cdtime: function (cdtime) {
    var _this = this;
    clearInterval(_this.data.interval);
    var totalSecond = 30;
    var interval =function () {
      var second = totalSecond;// 秒数  
      // 秒位  
      var sec = second;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;
      console.log(secStr)
      _this.setData({
        countdown: secStr,
      });

      totalSecond--;
      if (totalSecond < 0) {
        // 从新调取数据
        clearInterval(_this.data.interval);
      }
    };
    _this.data.interval=setInterval(interval, 1000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoadfun: function () {
    var _this = this;
    _this.data.loginid=app.signindata.loginid;
    _this.data.openid=app.signindata.openid;
    _this.data.perspcardata = app.signindata.perspcardata||'';
    if (_this.data.perspcardata) {
      _this.setData({
        perspcardiftrmin: true
      });
      app.countdowntime(_this, _this.data.perspcardata)
    };
    _this.setData({
      uid: app.signindata.uid,
      avatarUrl:app.signindata.avatarUrl,
      blackCity: app.signindata.blackCity,
      defaultinformation: app.signindata.defaultinformation || '',
      isProduce: app.signindata.isProduce,
      isShareFun: app.signindata.isShareFun,
      windowHeight: app.signindata.windowHeight || 600,
    });
    _this.detailfun();

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

    // 活动提示语 
    if (_this.data.defaultinformation == '') {
        var qhd = Dec.Aese('operation=info&mod=info');
        wx.request({
          url: app.signindata.comurl + 'general.php' + qhd,
          method: 'GET',
          header: { 'Accept': 'application/json' },
          success: function (res) {
            if (res.data.ReturnCode == 200) {
              var tips = res.data.Info.tips[0].miandan;
              tips = decodeURIComponent(tips.replace(/\+/g, ' '));
              tips = tips.replace(/\\n/g, '\n');
              var newtips = res.data.Info.desc[0].miandan;
              newtips = decodeURIComponent(newtips.replace(/\+/g, ' '));
              newtips = newtips.replace(/\\n/g, '\n');          
              _this.setData({
                defaultinformation: res.data.Info,
                tips: tips,
                newtips: newtips,
                wxnum: res.data.Info.cs.wxid || 'meichai666666',
              });
              app.signindata.defaultinformation = res.data.Info || '';
            };
            // 判断非200和登录
            Dec.comiftrsign(_this, res, app);
          }
        }); 
    }else{
        var thdadefau = _this.data.defaultinformation;
        if (thdadefau){
          var tips = thdadefau.tips[0].miandan;
          tips = decodeURIComponent(tips.replace(/\+/g, ' '));
          tips = tips.replace(/\\n/g, '\n');
          var newtips = thdadefau.desc[0].miandan;
          newtips = decodeURIComponent(newtips.replace(/\+/g, ' '));
          newtips = newtips.replace(/\\n/g, '\n');
          _this.setData({
            tips: tips,
            newtips: newtips,
            wxnum: thdadefau.cs.wxid || 'meichai666666',
          });
        };
    }      
    _this.otherdata();
    wx.showShareMenu({
      withShareTicket: false 
    });
    if (app.signindata.isAwardOrder) {
      _this.setData({ isAwardOrder: app.signindata.isAwardOrder, awardOrder: app.signindata.awardOrder || false });
      app.winningtheprizetime(_this);
    };
    // 统计推送进入
    if (_this.data.pushWay > 0) {
      app.pushfun(_this);
    }
    // 生成图片商品数据
    if (app.signindata.activityblindbox){
      _this.data.activityblindbox = app.signindata.activityblindbox;
    }else{
      app.activityblindboxfun(_this);
    };
    // 分享获取碎片
  },
  // 订阅完成隐藏 开启后隐藏按钮
  hiddenButTip(){
    var commoddata = this.data.commoddata;
    commoddata.isSubscribed = true;
    this.setData({commoddata:commoddata}) 
  },
  // 拉起订阅
  subscrfunstar: function () {
    var _this = this;
    var subscribedata = _this.data.subscribedata || '';
    if (subscribedata && subscribedata.template_id && this.data.subscribeif) {
      if (subscribedata.template_id instanceof Array) {
        wx.requestSubscribeMessage({
          tmplIds: subscribedata.template_id || [],
          success(res) {
            var is_show_modal = true;
            for (var i = 0; i < subscribedata.template_id.length; i++) {
              if (res[subscribedata.template_id[i]] == "accept") {
                app.subscribefun(_this, 0, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
                if (is_show_modal) {
                  _this.hiddenButTip()
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
            var is_show_modal = true;
            if (res[subscribedata.template_id] == "accept") {
              app.subscribefun(_this, 0, subscribedata.template_id, subscribedata.subscribe_type);
              if (is_show_modal) {
                _this.hiddenButTip()
                is_show_modal = false;
              };
            };
          }
        })
      };
    };
  },
  // 分享接口
  sharerequier:function(num){
    var _this = this;

    var qhd = Dec.Aese('mod=miandan&operation=signActivity&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id);

    wx.showLoading({ title: '加载中...', mask: true })
    wx.request({
      url: app.signindata.comurl + 'spread.php' + qhd,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('报名================',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          setTimeout(function () {
            _this.detailfun();
          }, 1000);
          _this.cdtime();
          _this.subscrfunstar();
        } else {
          app.showModalC(res.data.Msg)
        };
      }
    }); 

    // if(num==1){
    //   var qhd = Dec.Aese('mod=activity&operation=drawPatch&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&shareUId=' + _this.data.shareUId);
    // }else{
    //   var qhd = Dec.Aese('mod=activity&operation=drawPatch&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&shareUId=0');
    // };
    // wx.showLoading({ title: '加载中...', mask: true })
    // wx.request({
    //   url: app.signindata.comurl + 'spread.php' + qhd,
    //   method: 'GET',
    //   header: { 'Accept': 'application/json' },
    //   success: function (res) {
    //     console.log('报名================',res)
    //     wx.hideLoading();
    //     if (num == 1){
    //       if (res.data.ReturnCode == 200) {
    //         var totalPatch = _this.data.totalPatch || 0;
    //         _this.setData({
    //           ishowgetchip: true,
    //           totalPatch: totalPatch,
    //           isshowusertip: res.data.Msg,
    //           otherimgarr: res.data.List.patchReceive || [],
    //           fragreturnCode:200
    //         });
    //         _this.detailfun();
    //       } else if (res.data.ReturnCode == 100) {
    //         _this.setData({ ishowgetchip: true, otherimgarr: res.data.List.patchReceive || [], isshowusertip: res.data.Msg, fragreturnCode: 100 });
    //       } else if (res.data.ReturnCode == 201) {
    //         _this.setData({ ishowgetchip: true, otherimgarr: res.data.List.patchReceive || [], isshowusertip: res.data.Msg, fragreturnCode: 201 });
    //       } else if (res.data.ReturnCode == 202) {
    //         _this.placeorder();
    //         _this.data.shareUId = 0;
    //         setTimeout(function () {
    //           _this.detailfun();
    //         }, 500);
    //       } else if (res.data.ReturnCode == 203) {
    //         _this.setData({ ishowgetchip: true, otherimgarr: res.data.List.patchReceive || [], isshowusertip: res.data.Msg, fragreturnCode: 203 });
    //       };
    //       _this.data.shareUId = 0;
    //     }else{
    //       if (res.data.ReturnCode == 200) {
    //         app.showToastC(res.data.Msg);
    //         _this.detailfun();
    //         _this.subscrfunstar();
    //       } else if (res.data.ReturnCode == 100 || res.data.ReturnCode == 201 || res.data.ReturnCode == 203) {
    //         app.showToastC(res.data.Msg);
    //       } else if (res.data.ReturnCode == 202) {
    //         _this.placeorder();
    //         _this.data.shareUId = 0;
    //         setTimeout(function () {
    //           _this.detailfun();
    //         }, 500);
    //       };
    //       _this.data.shareUId = 0;          
    //     }
    //   }
    // }); 
  },
  jumporder: function () {
    var _this = this;
    app.jumporder(_this);
  },
  otherdata:function(){
    var _this = this;
    setTimeout(function(){
      // 调取收货地址
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
      }else{
        _this.nextpagediao();
      };
      
      // 分享和生成图片底部广告
      app.indexShareBanner();
    },1000);
  },
  //时间戳转换时间  
  toDatehd: function (number,num) {
    var num = num ||0;
    var date = new Date(number * 1000);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    if (num==2){
      return Y + '年' + M + '月' + D + '日' + h + ':' + m;
    }else if (num==1){
      return Y + '-' + M + '-' + D + ' ' + h + ':' + m;
    }else if (new Date(number * 1000).toDateString() === new Date().toDateString()) {
      return h + ':' + m;
    } else {
      return M + '-' + D + ' ' + h + ':' + m;
    }
  },
  // 助力接口
  powerInterface:function(num){
    var _this = this;
    var diffTime = Date.parse(new Date())/1000 - _this.data.sharetime;
    var qhd = Dec.Aese('mod=miandan&operation=signActivity&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&shareUId=' + _this.data.shareUId +'&diffTime=' +diffTime);

    wx.showLoading({ title: '加载中...', mask: true })
    wx.request({
      url: app.signindata.comurl + 'spread.php' + qhd,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('助力================',res)
        wx.hideLoading();
        _this.data.shareUId = 0;
        if (res.data.ReturnCode == 200) {
          app.showModalC(res.data.Msg);
        } else {
          app.showModalC(res.data.Msg)
        };
      }
    }); 

  },

  // 商品详情
  detailfun:function(){
    var _this = this;
    var reg = /^((https|http|ftp|rtsp|mms|www||wx)?:\/\/)[^\s]+/;
    var arrlist = '';
    // 商品列表  
    this.setData({
      headhidden: false,
      listBlindBox: [],
      listShowBox : []
    });
    // clearInterval(this.data.interval);
    var newDate = new Date();
    var m = newDate.getMinutes();
    var s = newDate.getSeconds();
    var q = Dec.Aese('mod=activity&operation=info&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&type=' + _this.data.typea +'&blackCity='+_this.data.blackCity);
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('详情===========',res)
        wx.stopPullDownRefresh();
        _this.setData({headhidden: true});
        if (res.data.ReturnCode == 200) {
          console.log(res)
          var infoshow = res.data.Info;
          //  && infoshow.couponOverTime
          if (infoshow.infoCoupon && infoshow.infoCoupon.length != 0){
            var couponOverTime = infoshow.couponOverTime||'';
            var infoCoupon = infoshow.infoCoupon||[];
            for (var oo = 0; oo < infoCoupon.length;oo++){
              infoCoupon[oo].overtime = couponOverTime;
            };
            var couponType = infoshow.couponType||1;
            if (couponType==2){
              var newcoutitle = '在线抽盒机'
            }else{
              var newcoutitle = '没中奖就买了TA'
            };
            _this.setData({
              newcoupon: true,
              newcoupondata: infoCoupon,
              newcoutitle: newcoutitle ,
              newcouiftr:1,
              couponType: couponType
            });            
          }else{
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
                      newcoutitle: res.data.Info.title,
                      newcouiftr:0,
                      couponType:1
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
          };

          // 免单活动列表
          var newDate = new Date();
          var m = newDate.getMinutes();
          var s = newDate.getSeconds();
          var exemption = res.data.List;
          // 分享领取用户头像图片
          var patchReceive = exemption.patchReceive||[];
          if (patchReceive.length<4){
            var ppatchnum = patchReceive.length;
            for (var p = 0; p < 4 - ppatchnum;p++){
              patchReceive.push({src:''})
            };
          };
          var totalPatch = infoshow.totalPatch||0;
          _this.setData({
            patchReceive: patchReceive,
            totalPatch: totalPatch,
            // fragmentTotalNumber: infoshow.fragmentTotalNumber || 2 //碎片显示个数 
          });
          var signtask = res.data.Info.task||'';
          _this.setData({ signtask: signtask});
          if (infoshow) {
            var share_desc1 = infoshow.showOrderDesc||'';
            _this.setData({ share_descWinningtheprize: share_desc1 });
          };
          if (exemption) {
            var exemptionac = res.data.List.activity || [];
            if (exemptionac && exemptionac.length != 0) {
              for (var i = 0; i < exemptionac.length; i++) {
                if (!app.signindata.reg.test(exemptionac[i].gcover)) {
                  exemptionac[i].gcover = _this.data.zdyurl + exemptionac[i].gcover;
                };
              };
              _this.data.exemption=exemptionac;
            };
          };
          var arrlist = res.data.Info;
          var banlist = arrlist.gimages;
          _this.setData({
            amountpayable: arrlist.sales
          })
          if (!reg.test(arrlist.gcover)) {
            arrlist.gcover = _this.data.zdyurl + arrlist.gcover;
          };
          if (!app.signindata.reg.test(arrlist.cover)) {
            arrlist.cover = _this.data.zdyurl + arrlist.cover;
          };
          if (banlist.length != 0) {
            var imgArr = [];
            for (var i = 0; i < banlist.length; i++) {
              if (!reg.test(banlist[i])) {
                banlist[i] = _this.data.zdyurl + banlist[i];
              };
              imgArr.push(banlist[i])
            };
            _this.data.imgArr=imgArr;
            _this.setData({
              movies: banlist
            });
          };
          var genlistimg = [];
          for (var i = 0; i < arrlist.actor.length; i++) {
            if (arrlist.actor[i].headphoto) {
              if (!reg.test(arrlist.actor[i].headphoto)) {
                arrlist.actor[i].headphoto = _this.data.zdyurl + arrlist.actor[i].headphoto;
              };
              arrlist.actor[i].iftr = false;
              arrlist.actor[i].status = arrlist.status;
              genlistimg.push(arrlist.actor[i]);
            };
          };
          _this.data.gengImgArr= genlistimg || [];
          var aacl = arrlist.actor.length || 0;
          // 中奖名次处理
          var awarderdata = arrlist.awarder;
          if (awarderdata) {
            for (var awa in awarderdata) {
              if (!reg.test(awarderdata[awa].icon)) {
                awarderdata[awa].icon = _this.data.zdyurl + awarderdata[awa].icon;
              };
              if (awarderdata[awa].num > awarderdata[awa].list.length) {
                var alength = parseInt(awarderdata[awa].num) - parseInt(awarderdata[awa].list.length);
                if (alength > 0) {
                  for (var a = 0; a < alength; a++) {
                    awarderdata[awa].list.push({ headphoto: '', nick: '', iftr: false });
                  };
                };
              };
              if (awarderdata[awa].list) {
                for (var aa = 0; aa < awarderdata[awa].list.length; aa++) {
                  if (awarderdata[awa].list[aa].headphoto != '' && awarderdata[awa].list[aa].headphoto) {
                    if (!reg.test(awarderdata[awa].list[aa].headphoto)) {
                      awarderdata[awa].list[aa].headphoto = _this.data.zdyurl + awarderdata[awa].list[aa].headphoto;
                    };
                  };
                  awarderdata[awa].list[aa].iftr = false;
                };
              }
            }
          }

          // 颜色
          if (arrlist.color) {
            if (arrlist.color.length != 0) {
              _this.data.colorcon=arrlist.color[0].property
              _this.setData({
                // 颜色id
                colorid: arrlist.color[0].no
              })
            }
          } else {
            arrlist.color = [];
            _this.setData({
              colorid: 0,
            })
          };
          // 尺寸
          if (arrlist.size) {
            if (arrlist.size.length != 0) {
              _this.data.sizecon=arrlist.size[0].property;
              _this.setData({
                // 尺寸id
                sizeid: arrlist.size[0].no
              })
            };
          } else {
            arrlist.size = [];
            _this.setData({
              sizeid: 0,
            })
          };
          // 商品库存
          var exstring = 'c' + _this.data.colorid + '_' + _this.data.sizeid;
          _this.setData({
            quantityofgoods: arrlist.extends[exstring].num
          });
          var iftrnum = true;
          for (var js in arrlist.extends) {
            if (iftrnum) {
              _this.setData({
                sizeid: arrlist.extends[js].s || 0,
                colorid: arrlist.extends[js].c || 0,
                quantityofgoods: arrlist.extends[js].num || 0
              });
              arrlist.tax = arrlist.extends[js].tax || 0;
              arrlist.gsale = arrlist.extends[js].price || 0;
              iftrnum = false;
              break;
            };
          };
          arrlist.gdesc = decodeURIComponent(arrlist.gdesc.replace(/\+/g, ' '));
          // 活动
          arrlist.adesc = decodeURIComponent(arrlist.adesc.replace(/\+/g, ' '));
          WxParse.wxParse('article1', 'html', arrlist.adesc, _this, 0);
          WxParse.wxParse('article', 'html', arrlist.gdesc, _this, 0);
          arrlist.is_xcxiftr = false;
          var share_desc = arrlist.share_desc.replace(/\\n/g, '\n');
          var swiperarr = [];
          if (arrlist.is_limit != 1) {
            if (arrlist.status == 1) {
              // if (arrlist.start_time == 0){
              //   _this.setData({ iftrTimeCd: false })
              // }else{
              //   _this.setData({ iftrTimeCd: true })
              //   _this.cdtime(arrlist.start_time);
              // };
              _this.setData({
                toDateTime: _this.toDatehd(arrlist.start_time) || ''
              });
            } else if (arrlist.status == 2 && arrlist.is_limit != 1) {
              _this.setData({
                toDateTime: _this.toDatehd(arrlist.stop_time) || ''
              });
              if (arrlist.is_join == 1){
                // if (arrlist.stop_time == 0) {
                //   _this.setData({ iftrTimeCd:false})
                // } else {
                //   _this.setData({ iftrTimeCd: true })
                //   _this.cdtime(arrlist.stop_time);
                // }
              };
            }; 
          };
          //  stynum 1 没有副标题 2有副标题 3 三行
          //  ifshare 是否分享
          //  iftrtask 1 显示任务块
          var isGainPatchBySelf = arrlist.isGainPatchBySelf;
          var aeve = true;
          var videoOpportunity = true;
          // if (isGainPatchBySelf){
          //   videoOpportunity = false;
          //   if (arrlist.is_join == 1){
          //     aeve = true;
          //   }else{
          //     aeve = false;
          //   }
          // }else{
          //   aeve=true;
          // };

          if (aeve){
                if (arrlist.is_receive == 2) {
                  swiperarr.push({ name: '已领取', subname: '', abcircular: '#F9DCB1', witcircular: '#f18f00', stynum: 1, sizeColor: '#FFF1F1', clickiftr: 8 });
                } else if (arrlist.status == 0) {
                  swiperarr.push({ name: '即将开始',clickiftr:9, subname: '订阅提醒', abcircular: '#EAE7E7', witcircular: '#eeae19', stynum: 2 }); //   A29FA0  
                } else if (arrlist.status == 1) {
                  swiperarr.push({ name: '等待开启', subname: '1', abcircular: '#EAE7E7', witcircular: '#A29FA0', stynum: 2 });
                } else if (arrlist.status == 2 && arrlist.is_join == 0) {
                  if (arrlist.need_times == 0) {
                    if (arrlist.needVideo == 1) {
                      swiperarr.push({ name: '我要免单', stynum: 1, clickiftr: 7, abcircular: '#FBD6D8', witcircular: '#F93F45', sizeColor: '#F9DCDC', subname: '观看视频参与' });
                    } else if (arrlist.needChance == 0) {
                      swiperarr.push({ name: '我要免单', stynum:1, clickiftr: 1, abcircular: '#FBD6D8', witcircular: '#F93F45', sizeColor: '#F9DCDC', subname: '消耗:拆币x' + arrlist.needIntegral, needChance: 1 });
                    } else {
                      swiperarr.push({ name: '我要免单', stynum: 1, clickiftr: 1, abcircular: '#FBD6D8', witcircular: '#F93F45', sizeColor: '#F9DCDC', subname: '消耗:免单机会x' + arrlist.needChance, needChance: 1 });
                    };
                  } else {
                    if (arrlist.needVideo == 1) {
                      swiperarr.push({ name: '我要免单', stynum: 1, clickiftr: 7, abcircular: '#FBD6D8', witcircular: '#F93F45', sizeColor: '#F9DCDC', subname: '观看视频参与' });
                    } else if (arrlist.needChance == 0) {
                      swiperarr.push({ name: '报名免单', subname: '消耗:拆币x' + arrlist.needIntegral, needChance: 1, abcircular: '#FBD6D8', witcircular: '#F93F45', stynum: 1, clickiftr: 1, sizeColor: '#F9DCDC' });
                    } else {
                      swiperarr.push({ name: '报名免单', subname: '消耗:免单机会x' + arrlist.needChance, needChance: 1, abcircular: '#FBD6D8', witcircular: '#F93F45', stynum: 1, clickiftr: 1, sizeColor: '#F9DCDC' });
                    };
                  }
                } else if (arrlist.status == 2 && arrlist.is_join == 1 && arrlist.needAuditPic == 1 && arrlist.auditPic != 2) {
                  if (arrlist.auditPic == 0 || arrlist.auditPic == 3) {
                    swiperarr.push({ name: '上传截图', subname: '', clickiftr: 2, abcircular: '#8BC34A', witcircular: '#259B24', stynum: 1, sizeColor: '#FFF1F1' });
                  } else {
                    swiperarr.push({ name: '上传成功', subname: '审核中', abcircular: '#8BC34A', witcircular: '#259B24', stynum: 2, sizeColor: '#FFF1F1' });
                  };
                } else if (arrlist.is_receive == 1 && arrlist.isShowOrder == 1 && arrlist.showOrder == 0) {
                  swiperarr.push({ name: '恭喜您', subname: '1.晒单领奖', clickiftr: 3, abcircular: '#F9DCB1', witcircular: '#f18f00', stynum: 2, sizeColor: '#FFF1F1', jumpclass: 1 });
                } else if (arrlist.is_receive == 1 && arrlist.isShowOrder == 1 && arrlist.showOrder == 4 || arrlist.showOrder == 3) {
                  swiperarr.push({ name: '恭喜您', subname: '2.上传晒单', clickiftr: 3, abcircular: '#F9DCB1', witcircular: '#f18f00', stynum: 2, sizeColor: '#FFF1F1', jumpclass: 1 });
                } else if (arrlist.is_receive == 1 && arrlist.isShowOrder == 1 && arrlist.showOrder == 1) {
                  swiperarr.push({ name: '领取奖励', subname: '3.等待审核', abcircular: '#F9DCB1', witcircular: '#f18f00', stynum: 2, sizeColor: '#FFF1F1', jumpclass: 1 });
                } else if (arrlist.is_receive == 1 && arrlist.isShowOrder == 1 && arrlist.showOrder == 2) {
                  swiperarr.push({ name: '领取奖励', subname: '4.晒单成功', abcircular: '#F9DCB1', witcircular: '#f18f00', stynum: 2, sizeColor: '#FFF1F1', clickiftr: 4, jumpclass: 1 });
                } else if (arrlist.status == 2 && arrlist.is_join == 1 && arrlist.auditPic != 2) {
                  // swiperarr.push({ name: '上传截图', subname: '', clickiftr: 2, abcircular: '#8BC34A', witcircular: '#259B24', stynum: 1, sizeColor: '#FFF1F1' });
                  swiperarr.push({ name: '待开奖', subname: '已报名', clickiftr: 2, abcircular: '#FBD6D8', witcircular: '#F93F45', stynum: 2, sizeColor: '#F9DCDC' });
                  // 是否上传过截图
                  // if (arrlist.auditPic == 0 || arrlist.auditPic == 3) {
                  //   swiperarr.push({ name: '报名未完成', subname: '1', abcircular: '#FBD6D8', witcircular: '#F09D9F', stynum: 3, clickiftr: 2 });
                  // } else {
                  //   swiperarr.push({ name: '等待开奖', subname: '1', abcircular: '#FBD6D8', witcircular: '#F09D9F', stynum: 3, clickiftr: 2 });
                  // };
                  swiperarr.push({ name: '继续邀请', subname: '好友助力', abcircular: '#FBD6D8', witcircular: '#F93F45', stynum: 3, clickiftr: 5 });
                  _this.setData({
                    goodsIndex: 1,
                    taskOrUserImg:false,
                    swiperIndex: 1
                  });
                } else if (arrlist.status == 2 && arrlist.is_join == 1 && arrlist.auditPic == 2) {
                  // swiperarr.push({ name: '等待开奖', subname: '1', abcircular: '#f5d1d4', witcircular: '#e39397', stynum: 3 });
                  swiperarr.push({ name: '待开奖', subname: '已报名', clickiftr: 2, abcircular: '#FBD6D8', witcircular: '#F93F45', stynum: 3, sizeColor: '#F9DCDC' });
                  swiperarr.push({ name: '继续邀请', subname: '好友助力', abcircular: '#FBD6D8', witcircular: '#F93F45', stynum: 3, clickiftr: 5 });
                  _this.setData({
                    goodsIndex: 1,
                    taskOrUserImg:false,
                    swiperIndex: 1
                  });

                } else if (arrlist.status == 2 && (arrlist.is_limit == 1 && arrlist.is_full == 1)) {
                  swiperarr.push({ name: '开奖中', abcircular: '#FBD6D8', witcircular: '#F93F45', stynum: 1 });
                } else if (arrlist.status == 3 && arrlist.is_receive == 3) {
                  swiperarr.push({ name: '已过期', subname: '未中奖', abcircular: '#CECCCC', witcircular: '#2A2A2A', stynum: 2, sizeColor: '#FFF1F1' });
                } else if (arrlist.status == 3) {
                  swiperarr.push({name:'已开奖',subname:'重在参与',abcircular:'#E6E6E6',witcircular:'#8A8888',stynum:2});
                };
          }

          if(arrlist.status == 3){
            _this.wonOrNot();
            if(arrlist.is_receive == 1){
              arrlist.receiveTxt ='请于' + _this.toDatehd(arrlist.receiveTime,2) + '前领取'; 
            };
          };


          var actrecactnum = 1;
          if (arrlist.is_pay==1){
            actrecactnum = 2;
          }else{
            actrecactnum = 1;
          };
          var tipfulregistration = false;
          var uidid = parseInt(_this.data.uid) + parseInt(arrlist.id);
          var listBlindBox = arrlist.listBlindBox||[];
          var listShowBox = arrlist.listShowBox||[];
          var listLotto = arrlist.listLotto||[];

          // if(res.data.Info&&res.data.Info.brandId>0){
          //   res.data.Info.specialWay = 1;
          // };

          if(arrlist.brand &&  arrlist.brand.name && arrlist.brand.name.indexOf("旗舰店") != -1){
            arrlist.isBrandNaq = 1;
          }else{
            arrlist.isBrandNaq = 0;
          };
          
          if(arrlist.status == 2 && arrlist.is_join == 1 && arrlist.signTime){
             var timeDifference = Date.parse(new Date())/1000 - arrlist.signTime;
             if(timeDifference > 30){
               _this.setData({
                countdown:0
               })
             };
          };

          _this.setData({
            commoddata: arrlist,
            subscribedata: res.data.Info.subscribe || '',
            cart_id: arrlist.cart_id || '',
            share_desc: share_desc,
            swiperarr: swiperarr,
            uidid: uidid,
            actrecactnum: actrecactnum,
            actispay: actrecactnum,
            listBlindBox: listBlindBox,
            listShowBox: listShowBox,
            listLotto: listLotto,
            tipfulregistration: tipfulregistration,
            iftrtipstar:false,
            isGainPatchBySelf: aeve,
            videoOpportunity: videoOpportunity,

            is_exhibition: res.data.Info.specialWay || '',
            brandId:res.data.Info.brandId || '',
          });
          // 是否调取展会数据
          if (res.data.Info.specialWay && res.data.Info.specialWay == 1 || (res.data.Info.specialWay!=1&&_this.data.brandId>0)) {
            //  wx.hideShareMenu();
            _this.exhibdatafun(1)
            if(res.data.Info.specialWay == 1){
              app.livebroadcast(_this, res.data.Info.brandId)  // 直播数据
            };
          };

          // 云统计
          var clouddata = { act_id: _this.data.id, type: res.data.Info.specialWay || 0 };
          app.cloudstatistics('activityStatistics', clouddata)

          // 助力
          if (arrlist.status == 2 &&_this.data.shareUId && _this.data.shareUId!=_this.data.uid) {
            _this.powerInterface();
          };
          // 调取推荐活动
          _this.actrecactlist(1);
          if (_this.data.snapshot==''){
            _this.getSnapshot();
          };
          // 分享动态消息  
          var activityId = _this.data.commoddata.activity_id || '';
        };
        if (res.data.ReturnCode == 304) {
            wx.showModal({
              title: '提示',
              content: '活动id有误',
              success: function (res) {
                wx.reLaunch({
                  url: "/pages/index/index?judgeprof=2"
                });
              }
            });
        };
        if (res.data.ReturnCode == 305) {
          app.showToastC('数据异常');
        };
        if (res.data.ReturnCode == 900) {
          app.showToastC('登陆状态有误');
        };
      }
    });    
  },
  //key(需要检错的键） url（传入的需要分割的url地址）
  getSearchString: function (key, Url) {
    // 获取URL中?之后的字符
    var str = Url;
    var arr = str.split("&");
    var obj = new Object();
    for (var i = 0; i < arr.length; i++) {
      var tmp_arr = arr[i].split("=");
      obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
    }
    return obj[key];
  },
  onLoad: function (options) {
    console.log('options======',options)
    app.signindata.suap = 10;
    var _this = this;
    this.data.ctxt = wx.createCanvasContext('myordercanimgser');
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.data.pushWay = options.pushWay||0;
    _this.data.sharetime = options.sharetime || 0;
    _this.setData({
      uid: app.signindata.uid,
      avatarUrl: app.signindata.avatarUrl,
      blackCity: app.signindata.blackCity,
      defaultinformation: app.signindata.defaultinformation || '',
      isProduce: app.signindata.isProduce,
      isShareFun: app.signindata.isShareFun,
      windowHeight: app.signindata.windowHeight || 600,
    });
    if (options.scene){
      let scene = decodeURIComponent(options.scene);
      var goods_id = _this.getSearchString('referee', scene);
      app.signindata.global_store_id = 0;
      app.signindata.referee = _this.getSearchString('referee', scene) || 0;
      _this.data.shareUId = _this.getSearchString('referee', scene) || 0;
      app.signindata.activity_id = _this.getSearchString('id', scene) || 0;
      if (_this.getSearchString('t', scene)) {
        if (_this.getSearchString('t', scene) == 2) {
          app.signindata.activity_type = 2;
          app.signindata.activity_type_share = 2;
        } else if (_this.getSearchString('t', scene) == 1) {
          app.signindata.activity_type_share = 1;
        };
      };
      if (_this.getSearchString('id', scene)) {
        this.setData({
          id: _this.getSearchString('id', scene),
          typea: 1,
          headhidden: false,
          is_share: true
        });
        this.activsign();
      } else {
        wx.reLaunch({
          url: "/pages/index/index"
        });
      };
    }else{
      var newDate = new Date();
      var m = newDate.getMinutes();
      var s = newDate.getSeconds();
      app.signindata.global_store_id = 0;
      app.signindata.referee = options.referee || 0;
      _this.data.shareUId = options.referee || 0;
      app.signindata.activity_id = options.id || 0;
      this.setData({
        rec_goods_id: options.rec_goods_id || '',
        rec_cart_id: options.rec_cart_id || '',
        islimittery: options.islimittery || 0,
        cs: options.cs||0,
        is_share: options.cs==1?true:false
      });
      if (options.id) {
        this.setData({
          id: options.id,
          typea: 1,
          headhidden: false
        });
        this.activsign();
      } else {
        wx.reLaunch({
          url: "/pages/index/index"
        });
      };
    };
  },
  activsign:function(){
    // 判断是否授权 
    var _this = this;
    if (_this.data.loginid != '' && _this.data.uid != '') {
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
            _this.data.loginid = app.signindata.loginid;
            _this.data.openid = app.signindata.openid;
            _this.setData({
              uid: app.signindata.uid,
              avatarUrl: app.signindata.avatarUrl,
              blackCity: app.signindata.blackCity,
              defaultinformation: app.signindata.defaultinformation || '',
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
            _this.detailfun();
            wx.getUserInfo({
              success: res => {
                // 判断是否登录
                if (_this.data.loginid != '' && _this.data.uid != '') {
                  _this.onLoadfun();
                } else {
                  app.signin(_this);
                }
              },
              fail: res => {
                // '没有授权 统计'
                if(_this.data.cs==1){
                  app.userstatistics(1000);
                } else if (app.signindata.activity_type_share==1){
                  app.userstatistics(1001);
                } else if (app.signindata.activity_type_share == 2){
                  app.userstatistics(1002);
                }else{
                  app.userstatistics(5);
                };
                _this.setData({
                  tgabox: true
                });
              }
            });
            // 统计新用户
            var qqqqq=Dec.Aese('mod=share&operation=dotactivity'+'&referee='+app.signindata.referee+'&activity_id='+app.signindata.activity_id);
            wx.request({
              url: app.signindata.comurl + 'statistics.php' + qqqqq,
              method: 'GET',
              header: { 'Accept': 'application/json' },
              success: function (res) {},
              fail: function () { }
            });
          }
        }
      });
    };
  },
  // 授权
  clicktga:function(){
    app.clicktga(2)
  },
  // 点击登录获取权限
  userInfoHandler: function (e) {
    var _this = this;
    if (e.detail.userInfo) {} else {
      app.clicktga(8)  //用户按了拒绝按钮
    };
    wx.getSetting({
      success: res => {
        if (true) {
          _this.setData({
            tgabox: false
          });
          _this.activsign();
          // 确认授权用户统计
          app.clicktga(4)          
        };      
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     var _this = this;
     var commoddata = _this.data.commoddata;
    //  if (commoddata.is_limit != 1){
    //    if (commoddata.is_limit != 1) {
    //      if (commoddata.status == 1) {
    //        if (commoddata.start_time==0){
    //          _this.setData({ iftrTimeCd: false })
    //        }else{
    //          _this.setData({ iftrTimeCd: true })
    //          _this.cdtime(commoddata.start_time);
    //        };
    //      } else if (commoddata.status == 2 && commoddata.is_limit != 1 && commoddata.is_join == 1) {
    //        if (commoddata.stop_time == 0) {
    //          _this.setData({ iftrTimeCd: false })
    //        } else {
    //          _this.setData({ iftrTimeCd: true })
    //          _this.cdtime(commoddata.stop_time);
    //        };
    //      };
    //    };
    //  };
   
  },
  onHide: function () {
    // clearInterval(this.data.interval);
    clearInterval(this.data.countdowntime);
    // 调用重置刷新
    app.resetdownRefresh();
  },
  onUnload: function () {
    clearInterval(this.data.interval);
    clearInterval(this.data.countdowntime);
    // 调用重置刷新
    app.resetdownRefresh();
  },
  onPullDownRefresh: function () {
    app.downRefreshFun(() => {
      this.setData({
        iftrtipstar:false
      })
      this.onLoadfun();
      if (this.data.is_exhibition == 1) {
        this.exhibdatafun(1)
      } else {
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh()
      } 
    })
    
  },
  onReachBottom: function () {
    if (this.data.is_exhibition == 1) {
      this.exhibdatafun(2)
    }    
  },
  /**
   * 用户点击右上角分享
   */
  onShareTimeline:function(){
    var _this = this;
    return {
      title:'免费送你'+_this.data.commoddata.name,
      query:{
        'id': _this.data.id
      },
      imageUrl:_this.data.commoddata.cover
    }
  },
  onShareAppMessage: function (options) {
    var _this = this;
    _this.setData({ tgfrShareIftr:false});
    var djz = _this.data.commoddata.pre_name || '';
    var djzb = _this.data.commoddata.ds || '';
    var gsales = _this.data.commoddata.gsales;
    var name = '免费送你' + _this.data.commoddata.name;
    if (_this.data.payiftr) {
      _this.paymentcompletionwimg();
      var reshare = {
        title: name,
        path: '/pages/activitydetailspage/activitydetailspage?id=' + _this.data.id +'&referee='+_this.data.uid+'&cs=1&sharetime='+ _this.data.commoddata.signTime || Date.parse(new Date())/1000,
        imageUrl: _this.data.snapshot,
        success: function (res) {},
      };
      var q = Dec.Aese('mod=share&operation=order&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + _this.data.cart_id)
      wx.request({
        url: app.signindata.comurl + 'user.php' + q,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {
          _this.onLoadfun()
        },
      });
    } else {
      var reshare = {
        title: name,
        path: '/pages/activitydetailspage/activitydetailspage?id=' + _this.data.id + '&referee=' + _this.data.uid + '&cs=1&sharetime='+ _this.data.commoddata.signTime || Date.parse(new Date())/1000,
        imageUrl: _this.data.snapshot,
        success: function (res) {},
      };
      if (_this.data.commoddata.needVideo != 1){
          var q = Dec.Aese('mod=activity&operation=share&type=1&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id);
          wx.request({
            url: app.signindata.comurl + 'spread.php' + q,
            method: 'GET',
            header: { 'Accept': 'application/json' },
            success: function (res) {
              if (res.data.ReturnCode == 200) {
                if (res.data.Info.need_times != 0) {
                  var need = _this.data.commoddata
                  need.need_times = res.data.Info.need_times;
                  _this.setData({
                    commoddata: need
                  });
                  _this.detailfun();
                } else {}
              };
              if (res.data.ReturnCode == 304) {
                app.showToastC("活动id有误")
              };
              if (res.data.ReturnCode == 900) {
                app.showToastC("登陆状态有误");
              };
            },
          })
      }
    }
    return reshare
  },
  // 选择颜色型号
  comcolorsel: function (w) {
    var _this = this;
    var index = w.currentTarget.dataset.no || w.target.dataset.no;
    var property = w.currentTarget.dataset.property || w.target.dataset.property;
    var commoddata = _this.data.commoddata;
    var stringcs = 'c' + index + '_' + _this.data.sizeid;
    _this.data.quantityofgoods = commoddata.extends[stringcs].num;
    commoddata.tax = commoddata.extends[stringcs].tax||0;
    _this.data.colorcon=property;
    this.setData({
      colorid: index,
      commoddata: commoddata,
      quantityofgoods: _this.data.quantityofgoods
    });
  },
  // 选择尺寸
  comsizesel: function (w) {
    var _this = this;
    var index = w.currentTarget.dataset.no || w.target.dataset.no;
    var property = w.currentTarget.dataset.property || w.target.dataset.property;
    var commoddata = _this.data.commoddata;
    var stringcs = 'c' + _this.data.colorid + '_' + index;
    _this.data.quantityofgoods = commoddata.extends[stringcs].num;
    commoddata.tax = commoddata.extends[stringcs].tax||0;
    _this.data.sizecon = property;
    this.setData({
      sizeid: index,
      commoddata: commoddata,
      quantityofgoods: _this.data.quantityofgoods
    });
  },
  // 显示直接购买弹框
  dsbffunblock: function () {
    if (this.data.commoddata.is_xcx=="-1"){
        var commoddata = this.data.commoddata;
        commoddata.is_xcxiftr = true;
        this.setData({
          commoddata: commoddata
        });       
        return false;
    };
    this.setData({
      tipback: true,
      dsbframeiftr: true,
      tipbox: false,
      judgmentactivity:1
    });
  },
  // 隐藏直接购买弹框
  dsbffun: function () {
    this.setData({
      tipback: false,
      dsbframeiftr: false,
    })
  }, 
  // 立即购买弹框
  dsbbbutclickt: function () {
    this.setData({
      tipbacktwo: true,
      buybombsimmediately: true
    });
    if (this.data.judgmentactivity == 1) {
      this.setData({
        amountpayable: '0.01',
        commodityprice: this.data.commoddata.gsales,
        coudata1cid:'',
        coudata1mon: '0.00',
        coudata2cid: '',
        coudata2mon: '0.00', 
        taxation:'0.00',
        freight:'￥0.00'        
      })      
    } else {
      this.hdramountcalculation();
      // 调取购物券
      this.comcouponprfun();       
    };
  },   
  pricedetailc: function () { 
    this.setData({
      pricedetailc: !this.data.pricedetailc
    })
  },
  // 收货地址弹框
  seladdressfun: function () {
    this.setData({
      receivingaddress: true,
    });
  },
  // 隐藏收货地址弹框
  receivingaddressfun: function () {
    this.setData({
      receivingaddress: false,
    })
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
            header: { 'Accept': 'application/json' },
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
            }
          })
        }
      }
    })
  },
  // 下一页返回调取
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
          if (rdl.length != 0) {
            for (var i = 0; i < rdl.length; i++) {
              if (rdl[i].isdefault == 1) {
                rdl[i].checked = true;
                tptipadi = rdl[i].aid;
                tptipadd = rdl[i].address;
              } else {
                rdl[i].checked = false;
              }
            };
            _this.data.tipaid=tptipadi;
            _this.setData({
              addressdata: rdl,
              tipaddress: tptipadd
            })
            app.signindata.receivingAddress = rdl;
          } else {
            _this.setData({
              addressdata: [],
            })
          };
        };
        if (res.data.ReturnCode == 900) {
          app.showToastC('登陆状态有误');
        };
      }
    });
  },
  // 修改收货地址
  revisethereceivingaddress: function (w) {
    var tipaid = w.currentTarget.dataset.tipaid || w.target.dataset.tipaid;
    var tipadd = w.currentTarget.dataset.tipadd || w.target.dataset.tipadd;
    _this.data.tipaid=tipaid;
    this.setData({
      tipaddress: tipadd,
      receivingaddress: false,
    });
  },
  // 跳转增加新地址
  jumpaddress: function () {
    wx.navigateTo({  
      url: "/pages/newreceivingaddress/newreceivingaddress?iftrid=1"
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
      })
    };
  },
  // 提交订单
  placeorder: function () {
    var _this = this;
    if (this.data.judgmentactivity == 1){
      if (_this.data.commoddata.is_command == 1 && _this.data.redpinputdata==''){
        setTimeout(function(){
          _this.setData({ redpinputdataiftr: true });
        },150);
        return false;
      };
      var id = _this.data.id;
      var color = _this.data.colorid || 0;
      var size = _this.data.sizeid || 0;
      var count = _this.data.numberofdismantling;
      var aid = _this.data.tipaid;
      var ginfo = { gid: _this.data.commoddata.goods_id, color: color, size: size, count: count, rec_goods_id: _this.data.rec_goods_id, rec_cart_id: _this.data.rec_cart_id };
      ginfo = JSON.stringify(ginfo);
      var q = Dec.Aese('mod=activity&operation=sign&type=1&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&gcount=1&aid=' + aid + '&ginfo=' + ginfo + '&id=' + id + '&desc=' + _this.data.desc + '&command=' + _this.data.redpinputdata + '&blackCity=' + _this.data.blackCity);
      var url = app.signindata.comurl + 'spread.php' + q;
    }else{
      if (this.data.tipaid == '') {
        app.showToastC('请选择地址');
        return false;
      };
      var zunmdata = this.data.combdataimg.goods_detial;
      var ginfo = [];
      for (var i = 0; i < zunmdata.length; i++) {
        if (zunmdata[i].imgiftr) {
          ginfo.push({ gid: zunmdata[i].goods_id, color: zunmdata[i].colorid || 0, size: zunmdata[i].sizeid || 0, count: zunmdata[i].numberofdismantling });
        };
      };
      var gcount = zunmdata.length;
      var aid = _this.data.tipaid;
      var cid = [];
      if (_this.data.coudata1cid != '') { cid.push(_this.data.coudata1cid); };
      if (_this.data.coudata2cid != '') { cid.push(_this.data.coudata2cid); };
      var cid = cid.join();
      ginfo = JSON.stringify(ginfo);
      var q = Dec.Aese('mod=order&operation=carorder&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&gcount=1&aid=' + aid + '&cid=' + cid + '&ginfo=' + ginfo + '&desc=' + _this.data.desc);
      var url = app.signindata.comurl + 'goods.php' + q;      
    };
    // 提交订单蒙层
    _this.setData({
      suboformola: true
    });    
    wx.request({
      url: url,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('报名订单=============',res)
        if (res.data.ReturnCode == 200) {
          _this.setData({
            tipbacktwo: false,
            buybombsimmediately: false,
            receivingaddress: false,
            couponprojectile: false,
            cart_id: res.data.Info.cart_id,
            hamount: res.data.Info.amount,
            paymentiftr: false,
            payment: res.data.Info.amount,
            redpinputdata:'',  // 红包口令
            redpinputdataiftr: false, // 红包口令
            subscribedata: res.data.Info.subscribe || '',  // 模版类型  
            suboformola:false
          }); 
          if (res.data.Info.tempChance){
            // 透视卡数据
            _this.setData({
              perspcardata: res.data.Info.tempChance.overtime || '',
            });
            app.signindata.perspcardata = res.data.Info.tempChance.overtime;
          }
          // 显示保存图片弹框
          if (_this.data.commoddata.needAuditPic == 1 && _this.data.commoddata.share_url != '' && _this.data.commoddata.qrcode != '') {
            _this.generatePictures();
            _this.setData({ upserimgbox: true, suboformola: false });
            return false;
          }else{
            // 提交订单支付
            // _this.paymentmony();
          };
          if (_this.data.judgmentactivity == 1 && _this.data.islimittery == 1){
            var pages = getCurrentPages(); // 当前页面
            var beforePage = pages[pages.length - 2]; // 前一个页面
            beforePage.activityMD(1); // 执行前一个页面的activityMD方法
          }
        }else{
          // 提交订单蒙层
          _this.setData({
            tipbacktwo: false,
            buybombsimmediately: false,
            receivingaddress: false,
            couponprojectile: false,
            paymentiftr: false,
            tipback: false,
            tipbox: false,
            dsbframeiftr: false,
            suboformola: false
          }); 
          if (res.data.ReturnCode == 900) {
            app.showToastC('登陆状态有误');
          } else if (res.data.ReturnCode == 317){
            app.showToastC('口令不正确');
            _this.setData({ 
              redpinputdataiftr: true,
              redpinputdata:''
             });
          } else if (res.data.ReturnCode == 315) {
            _this.setData({
              wsh:true,
              eshlist: res.data.List.activity||[]
            }); 
          } else if (res.data.ReturnCode == 316) {
              _this.setData({
                wshpay: true,
                eshlist: res.data.List.Goods || [],
                eshjumphref: res.data.Info||''
              }); 
          }else if (res.data.ReturnCode == 301) {
              app.showToastC('机会不足');
              _this.setData({
                ifcomtipiftr: 2,
                comtipiftr: !_this.data.comtipiftr
              });
          } else if (res.data.ReturnCode == 321) {
              app.showToastC('拆币不足');
              setTimeout(function(){
                wx.navigateTo({    //签到
                  url: "/page/component/pages/newsignin/newsignin"
                });
              },1500);
          }else if (res.data.ReturnCode == 302) {
            app.showToastC('今天报名次数已达到上限');
            _this.onLoadfun();
          }else if (res.data.ReturnCode == 311) {
            app.showToastC('本次免单商品只对没参加过免单活动的用户开启，请选择其他免单商品报名，祝你好运');
            _this.onLoadfun();
          }else if (res.data.ReturnCode == 312) {
            app.showToastC('本次免单商品只对近期购买过商品的用户开启，请选择其他免单商品报名，祝你好运');
            _this.onLoadfun();
          }else if (res.data.ReturnCode == 303) {
            app.showToastC('再分享'+res.data.Info.need_times+'可参与活动');
          }else if (res.data.ReturnCode == 305) {
            app.showToastC('数据异常');
          }else if (res.data.ReturnCode == 304) {
            app.showToastC('活动id有误');
          }else if (res.data.ReturnCode == 306) {
            app.showToastC('活动状态异常无法报名');
          }else if (res.data.ReturnCode == 307) {
            app.showToastC('已报名');
            _this.onLoadfun();
          }else if (res.data.ReturnCode == 308) {
            app.showToastC('名额已满');
            _this.onLoadfun();
          }else if (res.data.ReturnCode == 913) {
            app.showToastC('地址id和用户id不匹配');
          }else if (res.data.ReturnCode == 808) {
            app.showToastC('该优惠券以被使用过');
          }else if (res.data.ReturnCode == 809) {
            app.showToastC('该优惠券未达到使用条件');
          }else if (res.data.ReturnCode == 822) {
            app.showToastC('优惠券类型相同');
          } else {
            app.showToastC(res.data.Msg);
          };
        };
      }
    })
  },
  // 禁止分享显示保存图片
  ifsharedis:function(){
    this.generatePictures();
    this.setData({ tgfrShareIftr: true });
  },

  // 拉起订阅
  subscrfunsoon:function(){
    var _this = this;
    var subscribedata = _this.data.subscribedata||'';
    if (subscribedata && subscribedata.template_id && this.data.subscribeif) {
      if (subscribedata.template_id instanceof Array){
        wx.requestSubscribeMessage({
          tmplIds: subscribedata.template_id||[],
          success(res) {
            var is_show_modal = true;
            for (var i = 0; i < subscribedata.template_id.length;i++){
              if (res[subscribedata.template_id[i]] == "accept") {
                app.subscribefun(_this, 0, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
                if (is_show_modal) {
                  _this.hiddenButTip()
                  is_show_modal = false;
                };                
              };
            };
          }
        })
      }else{
        wx.requestSubscribeMessage({
          tmplIds: [subscribedata.template_id || ''],
          success(res) {
            var is_show_modal = true;
            if (res[subscribedata.template_id] == "accept") {
              app.subscribefun(_this, 0, subscribedata.template_id, subscribedata.subscribe_type);
              if (is_show_modal) {
                _this.hiddenButTip()
                is_show_modal = false;
              };
            };
          }
        })        
      };
    };
  },

  // 拉起订阅
  subscrfun:function(){
    var _this = this;
    var subscribedata = _this.data.subscribedata||'';
    if (_this.data.subscribeifstat && subscribedata && subscribedata.template_id && this.data.subscribeif) {
      if (subscribedata.template_id instanceof Array){
        wx.requestSubscribeMessage({
          tmplIds: subscribedata.template_id||[],
          success(res) {
            var is_show_modal = true;
            for (var i = 0; i < subscribedata.template_id.length;i++){
              if (res[subscribedata.template_id[i]] == "accept") {
                app.subscribefun(_this, 0, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
                if (is_show_modal) {
                  _this.hiddenButTip()
                  is_show_modal = false;
                };               
              };
            };
            _this.data.subscribeifstat = false;
          },
          complete() { _this.sucfulregfun();}
        })
      }else{
        wx.requestSubscribeMessage({
          tmplIds: [subscribedata.template_id || ''],
          success(res) {
            var is_show_modal = true;
            if (res[subscribedata.template_id] == "accept") {
              app.subscribefun(_this, 0, subscribedata.template_id, subscribedata.subscribe_type);
              _this.data.subscribeifstat = false;
              if (is_show_modal) {
                _this.hiddenButTip()
                is_show_modal = false;
              };
            };
          },
          complete() { _this.sucfulregfun();}
        })        
      };
    } else {
      _this.sucfulregfun();
    };
  },
  sucfulregfun:function(){
    var _this = this;
          if (_this.data.commoddata.isShowImg == 1) {
            _this.upserimgboxiftr();
          } else if (_this.data.commoddata.is_redpack == 1) {
            // 跳转红包页面
            wx.navigateTo({
              url: "/pages/redenvelopes/redenvelopes?cart_id=" + _this.data.cart_id
            });
          } else if (_this.data.commoddata.is_invite == 1) {
            _this.onLoadfun();
          } else {
            //  跳转至活动列表 
            wx.redirectTo({
              url: "/pages/activitysharinglist/activitysharinglist"
            });
          };

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
            payiftr: true,
            numberofdismantling: 1,
            //  活动支付完成隐藏弹框
            suboformola: false,
            desc: '',
            successfulregistration:false,
            iftrtipstar:false
          });
          _this.onLoadfun();
  },
  // 微信支付
  // paymentmony: function () {
  //   var _this = this;
  //   if (_this.data.commoddata.is_free == 1){
  //     _this.setData({
  //       suboformola:false
  //     });
  //     return false;   
  //   } else {};
  //   var q = Dec.Aese('mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + _this.data.cart_id + '&xcx=1' + '&openid=' + _this.data.openid)
  //   wx.request({
  //     url: app.signindata.comurl + 'order.php' + q,
  //     method: 'GET',
  //     header: { 'Accept': 'application/json' },
  //     success: function (res) {
  //       if (res.data.ReturnCode == 200) {
  //         // 支付完成弹框显示数据
  //         var shareinfo = res.data.Shareinfo;
  //         if (shareinfo) {
  //           for (var f = 0; f < shareinfo.length; f++) {
  //             if (!app.signindata.reg.test(shareinfo[f].img)) {
  //               shareinfo[f].img = _this.data.zdyurl + shareinfo[f].img;
  //             };
  //             shareinfo[f].name = shareinfo[f].name.replace(/\\n/g, '\n');
  //           };
  //           _this.setData({ shareinfo: shareinfo });
  //         };           
  //         wx.requestPayment({
  //           'timeStamp': res.data.Info.timeStamp.toString(),
  //           'nonceStr': res.data.Info.nonceStr,
  //           'package': res.data.Info.package,
  //           'signType': 'MD5',
  //           'paySign': res.data.Info.paySign,
  //           'success': function (res) {
  //             _this.setData({
  //               tipbacktwo: false,
  //               buybombsimmediately: false,
  //               tipback: false,
  //               tipbox: false,
  //               dsbframeiftr: false,
  //               paymentiftr: false,
  //               // 优惠券清空
  //               tipcoupon: '请选择优惠券',
  //               coudata1cid: '',
  //               coudata1mon: '0.00',
  //               coudata2cid: '',
  //               coudata2mon: '0.00',
  //               //  分享判断是否支付成功
  //               payiftr: true,
  //               numberofdismantling: 1,
  //               suboformola: false,
  //               desc: ''
  //             });              
  //             if (_this.data.commoddata.is_redpack){
  //               // 跳转红包页面
  //               wx.navigateTo({
  //                 url: "/pages/redenvelopes/redenvelopes?cart_id=" + _this.data.cart_id
  //               });
  //             } else if(_this.data.commoddata.is_invite == 1) {
  //               _this.invitingfriends();  // 跳转邀请页面
  //             }else{
  //               _this.setData({
  //                 successfulregistration:true
  //               });
  //             };
  //           },
  //           'fail': function (res) {
  //             _this.setData({
  //               tipback: false,
  //               tipbox: false,
  //               tipbacktwo: false,
  //               buybombsimmediately: false,
  //               dsbframeiftr: false,
  //               paymentiftr: false,
  //               // 优惠券清空
  //               tipcoupon: '请选择优惠券',
  //               coudata1cid: '',
  //               coudata1mon: '0.00',
  //               coudata2cid: '',
  //               coudata2mon: '0.00',
  //               //  分享判断是否支付成功
  //               payiftr: true,
  //               numberofdismantling: 1,
  //               suboformola: false,
  //               desc: '' 
  //             })
  //           },
  //           'complete': function (res) {}
  //         })
  //       }else{
  //         // 提交订单蒙层
  //         _this.setData({
  //           suboformola: false
  //         });    
  //         app.showToastC(res.data.Msg || res.data.msg);           
  //       };
  //     }
  //   })
  // },  
  // 支付完成隐藏弹框
  paymentcompletionwimg: function () {
    this.onLoadfun();
    this.setData({
      tipback: false,
      tipback: false,
      dsbframeiftr: false,
      tipbox: false,      
    });
  },
  // 返回首页
  returntothehomepage: function () {
    wx.reLaunch({
      url: "/pages/index/index"
    });
    this.paymentcompletionwimg();
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
    wx.navigateTo({
      url: "/pages/detailspage/detailspage?gid=" + gid
    });
  },  
  // 抽盒机详情页 
  addresssmokebox: function (event) {
    var gid = event.currentTarget.dataset.gid || event.target.dataset.gid;
    // 统计商品点击量
    var _this = this;
    wx.navigateTo({
      url: "/pages/smokebox/smokebox?gid=" + gid
    });
  },
  adsclicksefun:function(w){
    var nick = w.currentTarget.dataset.nick || w.target.dataset.nick || '';
    var index = w.currentTarget.dataset.index || w.target.dataset.index || 0;
    if (nick != "") {
      var ccac = this.data.commoddata;
      for (var i = 0; i < ccac.actor.length; i++) {
        if (i != index) {
          ccac.actor[i].iftr = false;
        } else {
          if (ccac.actor[i].iftr){
            ccac.actor[i].iftr = false;
          }else{
            ccac.actor[i].iftr = true;
          }
        };
      }
      this.setData({
        commoddata: ccac
      })
    }
  },
  // 中奖图片显示隐藏
  wintheadspuserimgleftstar: function (w) {
    var nick = w.currentTarget.dataset.nick || w.target.dataset.nick||'';
    var name = w.currentTarget.dataset.name || w.target.dataset.name;
    var index = w.currentTarget.dataset.index || w.target.dataset.index || 0;
    if (nick != "") {
      var ccac = this.data.commoddata;
      for (var i = 0; i < ccac.awarder[name].list.length;i++){
         if(i!=index){
           ccac.awarder[name].list[i].iftr=false;
         }else{
           if (ccac.awarder[name].list[i].iftr){
             ccac.awarder[name].list[i].iftr=false;
           }else{
             ccac.awarder[name].list[i].iftr = true;
           }
         }
      }
      this.setData({
        commoddata: ccac
      })
    }
  },   
 
  // 隐藏弹框
  hidcomtip: function () {
    this.setData({
      comtipiftr: !this.data.comtipiftr
    });
    this.onLoadfun();
  }, 
  // 买家备注
  inputChange: function (e) {
    this.setData({
      desc: e.detail.value
    });
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
        txt1 = checktwo1[i].name + checktwo1[i].unit + parseFloat(checktwo1[i].value).toFixed(2);
        check1cid = checktwo1[i].cid;
        check1mon = checktwo1[i].value;
      }
    };
    var checktwo2 = this.data.coudata2;
    var txt2 = '', check2cid = '', check2mon = '0.00', coupon_type = 1;
    for (var i = 0; i < checktwo2.length; i++) {
      if (checktwo2[i].imgcheck) {
        if (checktwo2[i].coupon_type == 1) {
          txt2 = checktwo2[i].name + checktwo2[i].unit + parseFloat(checktwo2[i].value).toFixed(2);
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
    if (this.data.judgmentactivity == 1) {} else {
      this.hdramountcalculation()
    }
  },  
  // 分类跳转
  jumprecom: function (w) {
    var whref = w.currentTarget.dataset.href || w.target.dataset.href;
    var wtype = w.currentTarget.dataset.type || w.target.dataset.type||0;
    var wname = w.currentTarget.dataset.name || w.target.dataset.name||'美拆';
    this.comjumpwxnav(wtype, whref, wname);
    this.setData({
      wshpay: false
    });    
  }, 
  // 跳转显示参与活动用户
  hdparticipateintheuser:function(w){
    var hdid = w.currentTarget.dataset.hdid || w.target.dataset.hdid;
    wx.navigateTo({ 
      url: "/page/component/pages/hdparticipateintheuser/hdparticipateintheuser?hdid="+hdid
    });  
  },
  // 兑换input值
  coupondatafun: function (e) {
    this.setData({
      coupondata: e.detail.value
    })
  },  
  // 兑换激活码
  couclicksou: function () {
    var _this = this;
    var q = Dec.Aese('mod=coupon&operation=exchange&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&code=' + _this.data.coupondata)
    wx.request({
      url: app.signindata.comurl + 'user.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {         
        if (res.data.ReturnCode == 200) {
          app.showToastC('兑换成功');
          // 调取购物券
          _this.comcouponprfun();
        }else{
          app.showToastC(res.data.Msg || res.data.msg);
        };
      },
      fail: function () {}
    })
  },
  // 图片预览
  previewImg: function (w) {
    var index = w.currentTarget.dataset.index || w.target.dataset.index||0;
    var imgArr = this.data.imgArr;
    wx.previewImage({
      current: imgArr[index],   
      urls: imgArr,              
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    });
  },
  screenshotpreviewImg: function (w) {
    var index = 0;
    var imgArr = ['http://www.51chaidan.com/images/default/consultOrder.jpg'];
    wx.previewImage({
      current: imgArr[index],
      urls: imgArr,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    });
  },
  screenshotpreviewImgzhong: function (w) {
    var index = 0;
    var imgArr = ['http://www.51chaidan.com/images/default/consultAudit.jpg'];
    wx.previewImage({
      current: imgArr[index],
      urls: imgArr,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    });
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
        }else{
          app.showToastC(res.data.Msg || res.data.msg);
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
  // app 弹框提示
  apphidcomtip:function(){
    var commoddata = this.data.commoddata;
    commoddata.is_xcxiftr=false;
    this.setData({
      commoddata: commoddata
    });
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
    } else if (item_type == 998){
      wx.reLaunch({    //签到
        url: "/pages/index/index?judgeprof=2"
      });
    } else if (item_type == 996) {
      this.setData({
        awatip:true,
        awardrresentiftr:false
      })
    };
  },
  // 额外奖励
  clicktocollect:function(){
    var _this = this;
    if (_this.data.preventmultiplesubmission) {
      _this.setData({ preventmultiplesubmission: false });
      var cart_id = _this.data.cart_id || '';
      var qqq = Dec.Aese('mod=operate&operation=receiveaward&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + cart_id);
      wx.request({
        url: app.signindata.comurl + 'order.php' + qqq,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {
          _this.setData({ preventmultiplesubmission: true });
          if (res.data.ReturnCode == 200) {
            app.showToastC('领取成功');
            _this.onLoadfun();
          } else if (res.data.ReturnCode == 830) {
            var rpiinfo = res.data.Info.tip.replace(/\\n/g, '\n')||'';
            if (res.data.Info.Goods.item_type==996){
              _this.awajump();
            }else{
              _this.setData({ awardrresentiftr: !_this.data.awardrresentiftr, })
            };
            _this.setData({
              rpinfotip: rpiinfo
            });
            _this.setData({
              awardrresentation: res.data.List,
              awardrresentationjump: res.data.Info.Goods || '',
              payfreightmony: res.data.Info.amount || 10
            });
          } else {
            app.showToastC(res.data.Msg);
          };
        }
      });
    };
  }, 
  awardrresentiftr:function(){
    this.setData({
      awardrresentiftr: !this.data.awardrresentiftr,
      payfreightone:false
    })
  },
  // 支付运费
  payfreight:function(){
    this.setData({
      payfreightone: true
    });    
  },
  // 支付运费订单
  payfreighplaceorder:function(){
    var _this = this;
    var aid = _this.data.tipaid; 
    // 提交订单蒙层
    _this.setData({
      suboformola: true
    });    
    var abcd = Dec.Aese('mod=operate&operation=activitycarriage&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + _this.data.cart_id + '&aid=' + aid);
    wx.request({
      url: app.signindata.comurl + 'order.php' + abcd,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200){
          var cart_id = res.data.Info.cart_id||'';
          var q = Dec.Aese('mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + cart_id + '&xcx=1' + '&openid=' + _this.data.openid)
          wx.request({
            url: app.signindata.comurl + 'order.php' + q,
            method: 'GET',
            header: { 'Accept': 'application/json' },
            success: function (res) {
              // 提交订单蒙层
              _this.setData({
                suboformola: false
              });
              if (res.data.ReturnCode == 200) {
                wx.requestPayment({
                  'timeStamp': res.data.Info.timeStamp.toString(),
                  'nonceStr': res.data.Info.nonceStr,
                  'package': res.data.Info.package,
                  'signType': 'MD5',
                  'paySign': res.data.Info.paySign,
                  'success': function (res) {
                    _this.setData({
                      payfreightone:false,
                      awardrresentiftr:false
                    });
                  },
                  'fail': function (res) {
                    _this.setData({
                      payfreightone: false,
                      awardrresentiftr: false
                    })
                  }
                })
              } else {
                app.showToastC(res.data.Msg);
              };
            }
          })
        }
      },
      fail: function () { }
    });
  },
  // 红包口令 input 值改变
  redpinputChange: function (e) {
    this.setData({
      redpinputdata: e.detail.value
    });
  },
  redpinputdataiftr:function(){
    this.setData({
      redpinputdataiftr: !this.data.redpinputdataiftr,
      redpinputdata:''
    })
  },
  imageLoadmon:function(w){
    var index = w.currentTarget.dataset.index || w.target.dataset.index || 0;
    var lenghtimg = this.data.movies.length;
    this.data.imagenum = this.data.imagenum+1;
    if (this.data.imagenum == lenghtimg){
      this.data.imagenum = 0;
      app.clicktga(7);
    };
  },
  imageLoadSponsor:function(e){
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height; 
    var viewWidth = 560,
      viewHeight = 560 / ratio;
    this.setData({
      imageLoadSponsorheight: viewHeight||0
    })
  },
  // 邀请领奖接口
  receiveAprize: function () {
    var _this = this;
    if (_this.data.clicktherequestiftr) {
      _this.setData({ clicktherequestiftr: false });
      var qqqqq = Dec.Aese('mod=do&operation=receive&task_id=6&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
      wx.request({
        url: app.signindata.comurl + 'task.php' + qqqqq,
        method: 'GET',
        header: {'Accept': 'application/json'},
        success: function (res) {
          _this.setData({ clicktherequestiftr:true});
          if (res.data.ReturnCode == 200) {
            app.showToastC('领取成功');
            _this.onLoadfun();
          } else {
            app.showToastC(res.data.Msg);
          };
        },
        fail: function () { }
      });
    };
  },
  jumpsigntask:function(){
    wx.navigateTo({    //签到
      url: "/page/component/pages/newsignin/newsignin"
    });
  },
  // 生成分享图片
  generatePictures:function(){
    var _this = this;
    if (_this.data.actimgshare==''){
      console.log('活动图片:' + _this.data.commoddata.share_url);
      console.log('太阳码图片:' + _this.data.commoddata.qrcode)
      if (_this.data.commoddata.share_url != '' && _this.data.commoddata.qrcode!=''){
        _this.setData({ headhidden: false, headhiddengeneratePictures:false });       
        wx.getImageInfo({
          src: _this.data.commoddata.share_url ,
          success: function (res) {
            const ctx = wx.createCanvasContext('canimgser');
            ctx.drawImage(res.path, 0, 0, 360, 384);
            ctx.draw(true);
            wx.getImageInfo({
              src: _this.data.commoddata.qrcode,
              success: function (res) {
                const ctxt = wx.createCanvasContext('canimgser');
                ctxt.drawImage(res.path, 141, 288, 70,70)
                ctxt.draw(true);
                // 第一步 底部背景颜色改变
                ctxt.fillStyle = '#feffff';
                ctxt.fillRect(0, 384, 360, 191);
                ctxt.draw(true);
                // 第二部 渲染标题
                var strnew = '—— 在线抽盒机 ——';
                ctxt.setFontSize(13);
                ctxt.setFillStyle('#000');
                ctxt.fillText(strnew, (360 - ctxt.measureText(strnew).width) / 2, 409);
                ctxt.draw(true);
                // 第三部 渲染左边图片
                wx.getImageInfo({
                  src: _this.data.activityblindbox[0].cover,
                  success: function (res) {
                      // 渲染左边图片
                      ctxt.fillStyle = '#fff';
                      ctxt.fillRect(14,424,159,140);
                      ctxt.draw(true);
                      ctxt.drawImage(res.path, 14, 424, 159, 85)
                      ctxt.draw(true);
                      ctxt.setFontSize(11);
                      ctxt.setFillStyle('#000');
                      ctxt.fillText(_this.data.activityblindbox[0].name,17, 529);
                      ctxt.draw(true);
                      ctxt.setFontSize(11);
                      ctxt.setFillStyle('#ff2742');
                      ctxt.fillText('￥' + _this.data.activityblindbox[0].shop_price, 17, 551);
                      ctxt.draw(true);
                      ctxt.setFontSize(10);
                      ctxt.setFillStyle('#ff2742');
                      ctxt.fillText(_this.data.activityblindbox[0].tip, 98, 551);
                      ctxt.draw(true);
                      ctxt.strokeStyle = "#ff2742"; 
                      ctxt.lineWidth = 1; 
                      ctxt.strokeRect(95, 539, ctxt.measureText(_this.data.activityblindbox[0].tip).width+6,16); 
                      ctxt.draw(true);
                      // 第四部 渲染右边图片
                      wx.getImageInfo({
                        src: _this.data.activityblindbox[1].cover,
                        success: function (res) {
                          // 渲染右边图片
                          ctxt.fillStyle = '#fff';
                          ctxt.fillRect(187,424,159,140);
                          ctxt.draw(true);
                          ctxt.drawImage(res.path, 187, 424, 159, 85)
                          ctxt.draw(true);
                          ctxt.setFontSize(11);
                          ctxt.setFillStyle('#000');
                          ctxt.fillText(_this.data.activityblindbox[1].name, 190, 527);
                          ctxt.draw(true);
                          ctxt.setFontSize(11);
                          ctxt.setFillStyle('#ff2742');
                          ctxt.fillText('￥' + _this.data.activityblindbox[1].shop_price, 190, 551);
                          ctxt.draw(true);
                          ctxt.setFontSize(10);
                          ctxt.setFillStyle('#ff2742');
                          ctxt.fillText(_this.data.activityblindbox[1].tip, 270, 551);
                          ctxt.draw(true);
                          ctxt.strokeStyle = "#ff2742";
                          ctxt.lineWidth = 1;
                          ctxt.strokeRect(267,539,ctxt.measureText(_this.data.activityblindbox[1].tip).width+6,16);
                          ctxt.draw(true);
                          wx.getImageInfo({
                            src: 'https://www.51chaidan.com/images/mc.jpg', // 美拆头像
                            success: function (res) {
                              const ctxt = wx.createCanvasContext('canimgser');
                              ctxt.arc(176, 323, 16, 0, Math.PI * 2, false);
                              ctxt.strokeStyle = "#fff";
                              ctxt.clip();
                              ctxt.drawImage(res.path, 160, 306, 34, 34);
                              ctxt.stroke();//画实心圆
                              ctxt.closePath();
                              ctxt.restore();
                              ctxt.draw(true);
                              const path = wx.getStorageSync('image_cache')
                              var uidimg = app.signindata.avatarUrl || 'https://static.51chaidan.com/images/headphoto/' + _this.data.uid + '.jpg';
                              if (uidimg) {
                                var tdavatar = uidimg;
                              } else if (path != null) {
                                if (path) { var tdavatar = path; } else { var tdavatar = _this.data.avatarUrl; };
                              } else {
                                var tdavatar = _this.data.avatarUrl;
                              };
                              wx.getImageInfo({
                                src: tdavatar,
                                success: function (res) {
                                  const ctxt = wx.createCanvasContext('canimgser');
                                  ctxt.arc(176, 323, 16, 0, Math.PI * 2, false);
                                  ctxt.strokeStyle = "#fff";
                                  ctxt.clip();
                                  ctxt.drawImage(res.path, 160, 306, 34, 34);
                                  ctxt.stroke();//画实心圆
                                  ctxt.closePath();
                                  ctxt.restore();
                                  ctxt.draw(true, setTimeout(function () {
                                    wx.canvasToTempFilePath({
                                      canvasId: 'canimgser',
                                      success: function (res) {
                                        _this.setData({
                                          actimgshare: res.tempFilePath,
                                          headhidden: true,
                                          headhiddengeneratePictures: true
                                        });
                                      },
                                      fail: function (res) {
                                        app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:01}');
                                        _this.setData({upserimgbox:false,headhidden:true,headhiddengeneratePictures:true});
                                      },
                                    });
                                  }, 300));
                                },
                                fail: function (res) {
                                  const ctxt = wx.createCanvasContext('canimgser');
                                  ctxt.draw(true, setTimeout(function () {
                                    wx.canvasToTempFilePath({
                                      canvasId: 'canimgser',
                                      success: function (res) {
                                        _this.setData({
                                          actimgshare: res.tempFilePath,
                                          headhidden: true,
                                          headhiddengeneratePictures: true
                                        });
                                      },
                                      fail: function (res) {
                                        app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:01}');
                                        _this.setData({upserimgbox:false,headhidden:true,headhiddengeneratePictures:true});
                                      },
                                    });
                                  }, 300));
                                }
                              })
                            },
                            fail: function (res) {
                              app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:16}');
                              _this.setData({ upserimgboxWinningtheprize: false, headhidden: true });
                            }
                          });
                        },
                        fail: function () {
                          app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:011}');
                        }
                      })
                  },
                  fail:function(){
                    app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:010}');
                  }
                });
              },
              fail: function (res) {
                app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:03}');
                _this.setData({ upserimgbox: false, headhidden: true, headhiddengeneratePictures: true});
              }              
            })
          },
          fail:function(res){
            app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:04}');
            _this.setData({ upserimgbox: false, headhidden: true, headhiddengeneratePictures: true });
          }
        })
      }else{
        _this.setData({ upserimgbox: false, savepicturesiftr: true, headhiddengeneratePictures: true });
        if (_this.data.commoddata.is_join != 1) {
          _this.placeorder();
        };
      };
    };
  },
  sharesavethepictureadd:function(){
    var _this = this;
    var subscribedata = _this.data.subscribedata || '';
    if (_this.data.subscribeifstat && subscribedata && subscribedata.template_id && this.data.subscribeif) {
      if (subscribedata.template_id instanceof Array) {
        wx.requestSubscribeMessage({
          tmplIds: subscribedata.template_id || [],
          success(res) {
            var is_show_modal = true;
            for (var i = 0; i < subscribedata.template_id.length; i++) {
              if (res[subscribedata.template_id[i]] == "accept") {
                app.subscribefun(_this, 0, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
                if (is_show_modal) {
                  _this.hiddenButTip()
                  is_show_modal = false;
                };
              };
            };
            _this.data.subscribeifstat = false;
          },
          complete() { _this.sucfulregfun();}
        })
      } else {
        wx.requestSubscribeMessage({
          tmplIds: [subscribedata.template_id || ''],
          success(res) {
            var is_show_modal = true;
            if (res[subscribedata.template_id] == "accept") {
              app.subscribefun(_this, 0, subscribedata.template_id, subscribedata.subscribe_type);
              _this.data.subscribeifstat = false;
              if (is_show_modal) {
                _this.hiddenButTip()
                is_show_modal = false;
              };
            };
          },
          complete() { _this.sucfulregfun();}
        })
      };
    } else {
      _this.sharesavethepicture();
      if (_this.data.perspcardata) {
        _this.setData({
          perspcardiftrmax: true
        });
        app.countdowntime(_this, _this.data.perspcardata)
      };
    };
  },
  // 保存图片
  sharesavethepicture: function () {
    var _this = this;
    var imgSrc = _this.data.actimgshare || '';
    wx.getSetting({
      success(res) {
        // 如果没有则获取授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.saveImageToPhotosAlbum({
                filePath: imgSrc,
                success() {
                  app.showToastC('保存成功');
                  _this.setData({ upserimgbox: false, savepicturesiftr: true, tgfrShareIftr:false});
                  // _this.placeorder();
                  if (_this.data.commoddata.is_join != 1) {
                    // _this.placeorder();
                    // 提交订单支付
                    // _this.paymentmony();
                  };
                },
                fail() {
                  app.showToastC('保存失败');
                  _this.setData({ upserimgbox: false, savepicturesiftr: true, tgfrShareIftr: false });
                }
              })
            },
            fail() {
              _this.setData({
                picbox: true
              });
            }
          })
        } else {
          // 有则直接保存
          wx.saveImageToPhotosAlbum({
            filePath: imgSrc,
            success(res) {
              app.showToastC('保存成功');
              _this.setData({ upserimgbox: false, savepicturesiftr: true, tgfrShareIftr: false});
             if (_this.data.commoddata.is_join != 1){
                // _this.placeorder();
               // 提交订单支付
              //  _this.paymentmony();
             };
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
  // 关闭保存图片上传图片
  closeupserimg:function(){
    this.setData({ upserimgbox: false, upserimgboxWinningtheprize:false });
  },
  upserimgboxiftr:function(){
    this.setData({ upserimgbox: true });
    this.generatePictures();
  },
  // 上传图片
  upImgSer:function(){
    var _this = this;
    if (_this.data.commoddata.is_join != 1){
      app.showToastC('未报名,不能上传截图');
      return false;
    };
    var auditPicTime = _this.data.commoddata.auditPicTime||0;
    var timestamp = Date.parse(new Date());
    if (auditPicTime) {
      if (auditPicTime > timestamp/1000){
          _this.setData({
            subscrproiftr:true,
            subscrpro: '未到提供截图时间,请先分享朋友圈一小时后上传。上传开启时间:' + _this.toDatehd(auditPicTime,1)
          });
          return false;
      };
    };
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths[0];
        _this.uploadFile(_this, tempFilePaths, 'litpic',1);
      }
    })
  },
    //上传文件
  uploadFile: function (_this, filePath, name, anum) {
    var _this = _this;
    _this.setData({ headhidden:false});
    wx.uploadFile({
      url: Dec.comurl() + 'order.php',
      filePath: filePath,
      name: name,
      header: {
        'content-type': 'multipart/form-data'
      }, 
      formData: {
        'mod': 'info',
        'operation': 'upload',
        'uid': _this.data.uid,
        'cart_id': _this.data.cart_id,
        'loginid': _this.data.loginid,
        'picture_type': 2,
        'type': anum
      }, 
      success: function (res) {
        _this.setData({ headhidden: true });
        wx.hideToast();
        if (res.data){
          if (res.data == 200) {
            _this.setData({ pictboxbox: true })
            if (anum==2){
              _this.setData({ upserimgboxWinningtheprize: false, screenshottipsiftr: false });
              _this.onLoadfun();
            }else{
              _this.detailfun();
            };
            _this.setData({
              upserimgbox:false,
              upserimgboxWinningtheprize:false,
              screenshottipsiftr:false
            })
          } else {
            _this.setData({
              subscrpro: res.data,
              subscrproiftr: true
            });
          }
        };
      },
      fail: function (res) {
        _this.setData({ headhidden: true });
        wx.hideToast();
        app.showToastC('上传失败');
      }
    })
  },

  // 更新用户信息
  getUserProfile(w){
    app.getUserProfile((res,userInfo) => {
        this.data.avatarUrl=userInfo.avatarUrl;
        this.data.nickName=userInfo.nickName;
        this.data.gender=userInfo.gender;
      this.upserimgboxiftrWinningtheprize(w)
    })
  },
  //  晒单
  upserimgboxiftrWinningtheprize: function (w) {
    var qrcode = w.currentTarget.dataset.qrcode || w.target.dataset.qrcode;  // 太阳码
    var awardinfo = w.currentTarget.dataset.awardinfo || w.target.dataset.awardinfo||'';  // 标题
    var cover = w.currentTarget.dataset.cover || w.target.dataset.cover;  // banner图片
    var cart_idsave = w.currentTarget.dataset.cart_id || w.target.dataset.cart_id||'';
    var showOrder = w.currentTarget.dataset.showorder || w.target.dataset.showorder || 0;
    if (showOrder != 0) {
      var uploadscreenshots = true;
    } else {
      var uploadscreenshots = false;
    };
    this.setData({ upserimgboxWinningtheprize: true, cart_idsave: cart_idsave, uploadscreenshots: uploadscreenshots });
    this.generatePicturesWinningtheprize(qrcode, awardinfo, cover);
  },             
  // 上传图片
  upImgSernum: function (w) {
    var _this = this;
    var cart_id = _this.data.cart_idsave;
    var anum = w.currentTarget.dataset.anum || w.target.dataset.anum || 1;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'], 
      success: function (res) {
        var tempFilePaths = res.tempFilePaths[0];
        _this.uploadFile(_this, tempFilePaths, 'litpic', 2);
      }
    })
  },
  // 生成图片
  generatePicturesWinningtheprize: function (qrcode, awardinfo, cover) {
    var _this = this;
    _this.setData({ headhidden: false, actimgshare: '' });
    const ctxt = _this.data.ctxt;
    ctxt.clearRect(0, 0, 319, 414);
    ctxt.setFillStyle('#fff')
    ctxt.fillRect(0, 0, 319, 414)
    ctxt.draw(true);
    if (_this.data.avatarUrl){}else{
      _this.setData({ avatarUrl: app.signindata.avatarUrl})
    };
    const path = wx.getStorageSync('image_cache')
    var uidimg = app.signindata.avatarUrl || 'https://static.51chaidan.com/images/headphoto/' + _this.data.uid + '.jpg';
    if (uidimg) {
      var tdavatar = uidimg;
    } else if (path != null) {
      if (path) { var tdavatar = path; } else { var tdavatar = _this.data.avatarUrl; };
    } else {
      var tdavatar = _this.data.avatarUrl;
    };
    var labelstyleImg = '';
    wx.getImageInfo({
      src: 'https://cdn.51chaidan.com/images/icon/newArrival.png', // 新上抽盒机角标图片
      success: function (res) {
        labelstyleImg = res.path;
      }
    })
    wx.getImageInfo({
      src: 'https://www.51chaidan.com/images/mc.jpg', // 美拆头像
      success: function (res) {
        ctxt.drawImage(res.path, 134, 54, 52, 52);
        ctxt.draw(true);
        wx.getImageInfo({
          src: tdavatar, // 用户头像
          success: function (res) {
            ctxt.drawImage(res.path, 134, 54, 52, 52);
            // ctxt.draw(true);
            wx.getImageInfo({
              src: 'https://www.51chaidan.com/images/default/bg_winner.png', // 背景
              success: function (res) {
                ctxt.drawImage(res.path, 0, 0, 319, 414);
                ctxt.setFontSize(16);
                ctxt.setFillStyle('#000');
                ctxt.fillText('我在美拆抽中了', 100, 135);
                var str = awardinfo || '';
                ctxt.setFontSize(13);
                ctxt.setFillStyle('#000');
                ctxt.fillText(str, (319 - ctxt.measureText(str).width) / 2, 162);
                wx.getImageInfo({
                  src: qrcode, // 太阳码
                  success: function (res) {
                    ctxt.drawImage(res.path, 129.5, 340, 60, 60);
                    // ctxt.draw(true);
                    wx.getImageInfo({
                      src: cover, // banner 图片
                      success: function (res) {
                        ctxt.drawImage(res.path, 17, 180, 285, 151);


                        if(app.signindata.is_eveShareAdver && app.signindata.mergePicImg){


                          // 渲染广告图片
                          wx.getImageInfo({
                            src: app.signindata.mergePicImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
                            success: function (res) {
                              console.log('渲染广告图片',res)

                              var ratio = res.width / res.height;   
                              var viewHeight = (319/ratio)<=175?(319/ratio):175;    

                              ctxt.drawImage(res.path, 0, 414, 319, viewHeight)
                              ctxt.draw(true);
                              ctxt.draw(true, setTimeout(function () {
                                wx.canvasToTempFilePath({
                                  canvasId: 'myordercanimgser',
                                  x:0,
                                  y:0,
                                  width:319,
                                  height:414+viewHeight,
                                  destWidth:319*4,
                                  destHeight:(414+viewHeight)*4,
                                  success: function (res) {
                                    console.log(414+viewHeight,res,'切割图片生成')
                                    _this.setData({
                                      actimgshareWinningtheprize: res.tempFilePath,
                                      headhidden: true
                                    });
                                  },
                                  fail: function (res) {
                                    app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:05}');
                                    _this.setData({ upserimgboxWinningtheprize: false, headhidden: true });
                                  },
                                });
                              }, 300));

                            },
                            fail: function () {},
                          });

                      }else{

                          // 第一步 底部背景颜色改变
                          ctxt.fillStyle = '#feffff';
                          ctxt.fillRect(0, 414, 319, 175);
                          ctxt.draw(true);
                          // 第二部 渲染标题
                          var strnew = '—— 在线抽盒机 ——';
                          ctxt.setFontSize(13);
                          ctxt.setFillStyle('#000');
                          ctxt.fillText(strnew, (319 - ctxt.measureText(strnew).width) / 2, 437);
                          ctxt.draw(true);
                          // 第三部 渲染左边图片
                          wx.getImageInfo({
                            src: _this.data.activityblindbox[0].cover,
                            success: function (res) {
                              // 渲染左边图片
                              ctxt.fillStyle = '#fff';
                              ctxt.fillRect(10, 449, 144, 130);
                              ctxt.draw(true);
                              ctxt.drawImage(res.path, 10, 449, 144, 77)
                              ctxt.draw(true);
                              if(_this.data.activityblindbox[0].isNewArrival){
                                ctxt.drawImage(labelstyleImg, 114, 449, 40, 40)
                                ctxt.draw(true);
                              }
                              ctxt.setFontSize(11);
                              ctxt.setFillStyle('#000');
                              ctxt.fillText(_this.data.activityblindbox[0].name, 13, 544);
                              ctxt.draw(true);
                              ctxt.setFontSize(11);
                              ctxt.setFillStyle('#ff2742');
                              ctxt.fillText('￥' + _this.data.activityblindbox[0].shop_price, 13, 566);
                              ctxt.draw(true);
                              if (_this.data.activityblindbox[0].tip){
                                ctxt.setFontSize(10);
                                ctxt.setFillStyle('#ff2742');
                                ctxt.fillText(_this.data.activityblindbox[0].tip, 83, 566);
                                ctxt.draw(true);
                                ctxt.strokeStyle = "#ff2742";
                                ctxt.lineWidth = 1;
                                ctxt.strokeRect(80, 554, ctxt.measureText(_this.data.activityblindbox[0].tip).width + 6, 16);
                                ctxt.draw(true);
                              };
                              // 第四部 渲染右边图片
                              wx.getImageInfo({
                                src: _this.data.activityblindbox[1].cover,
                                success: function (res) {
                                  // 渲染右边图片
                                  ctxt.fillStyle = '#fff';
                                  ctxt.fillRect(164, 449, 144, 130);
                                  ctxt.draw(true);
                                  ctxt.drawImage(res.path, 164, 449, 144, 77)
                                  ctxt.draw(true);
                                  if(_this.data.activityblindbox[1].isNewArrival){
                                    ctxt.drawImage(labelstyleImg, 268, 449, 40, 40)
                                    ctxt.draw(true);
                                  }
                                  ctxt.setFontSize(11);
                                  ctxt.setFillStyle('#000');
                                  ctxt.fillText(_this.data.activityblindbox[1].name, 167, 544);
                                  ctxt.draw(true);
                                  ctxt.setFontSize(11);
                                  ctxt.setFillStyle('#ff2742');
                                  ctxt.fillText('￥' + _this.data.activityblindbox[1].shop_price, 167, 566);
                                  ctxt.draw(true);
                                  if (_this.data.activityblindbox[1].tip){
                                    ctxt.setFontSize(10);
                                    ctxt.setFillStyle('#ff2742');
                                    ctxt.fillText(_this.data.activityblindbox[1].tip, 237, 566);
                                    ctxt.draw(true);
                                    ctxt.strokeStyle = "#ff2742";
                                    ctxt.lineWidth = 1;
                                    ctxt.strokeRect(234, 554, ctxt.measureText(_this.data.activityblindbox[1].tip).width + 6, 16);
                                    ctxt.draw(true);
                                  };
                                  ctxt.draw(true, setTimeout(function () {
                                    wx.canvasToTempFilePath({
                                      canvasId: 'myordercanimgser',
                                      success: function (res) {
                                        _this.setData({
                                          actimgshareWinningtheprize: res.tempFilePath,
                                          headhidden: true
                                        });
                                      },
                                      fail: function (res) {
                                        app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:05}');
                                        _this.setData({ upserimgboxWinningtheprize: false, headhidden: true });
                                      },
                                    });
                                  }, 300));
                                },
                                fail:function(){

                                },
                              });
                            },    
                          fail: function() {

                          },
                        });
                        }
                      },
                      fail: function (res) {
                        app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:06}');
                        _this.setData({ upserimgboxWinningtheprize: false, headhidden: true });
                      }
                    });
                  },
                  fail: function (res) {
                    // app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:07}');
                    // _this.setData({ upserimgboxWinningtheprize: false, headhidden: true });
                    console.log('缺少太阳码=============')
                    wx.getImageInfo({
                      src: 'https://cdn.51chaidan.com/images/qrcode/qrMc.jpg', // 太阳码
                      success: function (res) {
                        ctxt.drawImage(res.path, 129.5, 340, 60, 60);
                        // ctxt.draw(true);
                        wx.getImageInfo({
                          src: cover, // banner 图片
                          success: function (res) {
                            ctxt.drawImage(res.path, 17, 180, 285, 151);
    
    
                            if(app.signindata.is_eveShareAdver && app.signindata.mergePicImg){
    
    
                              // 渲染广告图片
                              wx.getImageInfo({
                                src: app.signindata.mergePicImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
                                success: function (res) {
                                  console.log('渲染广告图片',res)
    
                                  var ratio = res.width / res.height;   
                                  var viewHeight = (319/ratio)<=175?(319/ratio):175;    
    
                                  ctxt.drawImage(res.path, 0, 414, 319, viewHeight)
                                  ctxt.draw(true);
                                  ctxt.draw(true, setTimeout(function () {
                                    wx.canvasToTempFilePath({
                                      canvasId: 'myordercanimgser',
                                      x:0,
                                      y:0,
                                      width:319,
                                      height:414+viewHeight,
                                      destWidth:319*4,
                                      destHeight:(414+viewHeight)*4,
                                      success: function (res) {
                                        console.log(414+viewHeight,res,'切割图片生成')
                                        _this.setData({
                                          actimgshareWinningtheprize: res.tempFilePath,
                                          headhidden: true
                                        });
                                      },
                                      fail: function (res) {
                                        app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:05}');
                                        _this.setData({ upserimgboxWinningtheprize: false, headhidden: true });
                                      },
                                    });
                                  }, 300));
    
                                },
                                fail: function () {},
                              });
    
                          }else{
    
                              // 第一步 底部背景颜色改变
                              ctxt.fillStyle = '#feffff';
                              ctxt.fillRect(0, 414, 319, 175);
                              ctxt.draw(true);
                              // 第二部 渲染标题
                              var strnew = '—— 在线抽盒机 ——';
                              ctxt.setFontSize(13);
                              ctxt.setFillStyle('#000');
                              ctxt.fillText(strnew, (319 - ctxt.measureText(strnew).width) / 2, 437);
                              ctxt.draw(true);
                              // 第三部 渲染左边图片
                              wx.getImageInfo({
                                src: _this.data.activityblindbox[0].cover,
                                success: function (res) {
                                  // 渲染左边图片
                                  ctxt.fillStyle = '#fff';
                                  ctxt.fillRect(10, 449, 144, 130);
                                  ctxt.draw(true);
                                  ctxt.drawImage(res.path, 10, 449, 144, 77)
                                  ctxt.draw(true);
                                  if(_this.data.activityblindbox[0].isNewArrival){
                                    ctxt.drawImage(labelstyleImg, 114, 449, 40, 40)
                                    ctxt.draw(true);
                                  }
                                  ctxt.setFontSize(11);
                                  ctxt.setFillStyle('#000');
                                  ctxt.fillText(_this.data.activityblindbox[0].name, 13, 544);
                                  ctxt.draw(true);
                                  ctxt.setFontSize(11);
                                  ctxt.setFillStyle('#ff2742');
                                  ctxt.fillText('￥' + _this.data.activityblindbox[0].shop_price, 13, 566);
                                  ctxt.draw(true);
                                  if (_this.data.activityblindbox[0].tip){
                                    ctxt.setFontSize(10);
                                    ctxt.setFillStyle('#ff2742');
                                    ctxt.fillText(_this.data.activityblindbox[0].tip, 83, 566);
                                    ctxt.draw(true);
                                    ctxt.strokeStyle = "#ff2742";
                                    ctxt.lineWidth = 1;
                                    ctxt.strokeRect(80, 554, ctxt.measureText(_this.data.activityblindbox[0].tip).width + 6, 16);
                                    ctxt.draw(true);
                                  };
                                  // 第四部 渲染右边图片
                                  wx.getImageInfo({
                                    src: _this.data.activityblindbox[1].cover,
                                    success: function (res) {
                                      // 渲染右边图片
                                      ctxt.fillStyle = '#fff';
                                      ctxt.fillRect(164, 449, 144, 130);
                                      ctxt.draw(true);
                                      ctxt.drawImage(res.path, 164, 449, 144, 77)
                                      ctxt.draw(true);
                                      if(_this.data.activityblindbox[1].isNewArrival){
                                        ctxt.drawImage(labelstyleImg, 268, 449, 40, 40)
                                        ctxt.draw(true);
                                      }
                                      ctxt.setFontSize(11);
                                      ctxt.setFillStyle('#000');
                                      ctxt.fillText(_this.data.activityblindbox[1].name, 167, 544);
                                      ctxt.draw(true);
                                      ctxt.setFontSize(11);
                                      ctxt.setFillStyle('#ff2742');
                                      ctxt.fillText('￥' + _this.data.activityblindbox[1].shop_price, 167, 566);
                                      ctxt.draw(true);
                                      if (_this.data.activityblindbox[1].tip){
                                        ctxt.setFontSize(10);
                                        ctxt.setFillStyle('#ff2742');
                                        ctxt.fillText(_this.data.activityblindbox[1].tip, 237, 566);
                                        ctxt.draw(true);
                                        ctxt.strokeStyle = "#ff2742";
                                        ctxt.lineWidth = 1;
                                        ctxt.strokeRect(234, 554, ctxt.measureText(_this.data.activityblindbox[1].tip).width + 6, 16);
                                        ctxt.draw(true);
                                      };
                                      ctxt.draw(true, setTimeout(function () {
                                        wx.canvasToTempFilePath({
                                          canvasId: 'myordercanimgser',
                                          success: function (res) {
                                            _this.setData({
                                              actimgshareWinningtheprize: res.tempFilePath,
                                              headhidden: true
                                            });
                                          },
                                          fail: function (res) {
                                            app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:05}');
                                            _this.setData({ upserimgboxWinningtheprize: false, headhidden: true });
                                          },
                                        });
                                      }, 300));
                                    },
                                    fail:function(){
    
                                    },
                                  });
                                },    
                              fail: function() {
    
                              },
                            });
                            }
                          },
                          fail: function (res) {
                            app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:06}');
                            _this.setData({ upserimgboxWinningtheprize: false, headhidden: true });
                          }
                        });
                      },
                      fail: function (res) {
                        app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:07}');
                        _this.setData({ upserimgboxWinningtheprize: false, headhidden: true });
                      }
                    });





                  }
                });

              },
              fail: function (res) {
                app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:08}');
                _this.setData({ upserimgboxWinningtheprize: false, headhidden: true });
              }
            })
          },
          fail: function (res) {
            wx.getImageInfo({
              src: 'https://www.51chaidan.com/images/default/bg_winner.png', // 背景
              success: function (res) {
                ctxt.drawImage(res.path, 0, 0, 319, 414);
                ctxt.setFontSize(16)
                ctxt.setFillStyle('#000')
                ctxt.fillText('我在美拆抽中了', 100, 135);
                var str = awardinfo || '';
                ctxt.setFontSize(13)
                ctxt.setFillStyle('#000')
                ctxt.fillText(str, (319 - ctxt.measureText(str).width) / 2, 162)

                wx.getImageInfo({
                  src: qrcode, // 太阳码
                  success: function (res) {
                    ctxt.drawImage(res.path, 129.5, 340, 60, 60);
                    // ctxt.draw(true);
                    wx.getImageInfo({
                      src: cover, // banner 图片
                      success: function (res) {
                        ctxt.drawImage(res.path, 17, 180, 285, 151);


                        if(app.signindata.is_eveShareAdver && app.signindata.mergePicImg){


                          // 渲染广告图片
                          wx.getImageInfo({
                            src: app.signindata.mergePicImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
                            success: function (res) {
                              
                              var ratio = res.width / res.height;   
                              var viewHeight = (319/ratio)<=175?(319/ratio):175;    

                              ctxt.drawImage(res.path, 0, 414, 319, viewHeight)
                              ctxt.draw(true);
                              ctxt.draw(true, setTimeout(function () {
                                wx.canvasToTempFilePath({
                                  canvasId: 'myordercanimgser',
                                  x:0,
                                  y:0,
                                  width:319,
                                  height:414+viewHeight,
                                  destWidth:319*4,
                                  destHeight:(414+viewHeight)*4,
                                  success: function (res) {
                                    _this.setData({
                                      actimgshareWinningtheprize: res.tempFilePath,
                                      headhidden: true
                                    });
                                  },
                                  fail: function (res) {
                                    app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:05}');
                                    _this.setData({ upserimgboxWinningtheprize: false, headhidden: true });
                                  },
                                });
                              }, 300));

                            },
                            fail: function () {},
                          });

                      }else{

                          // 第一步 底部背景颜色改变
                          ctxt.fillStyle = '#feffff';
                          ctxt.fillRect(0, 414, 319, 175);
                          ctxt.draw(true);
                          // 第二部 渲染标题
                          var strnew = '—— 在线抽盒机 ——';
                          ctxt.setFontSize(13);
                          ctxt.setFillStyle('#000');
                          ctxt.fillText(strnew, (319 - ctxt.measureText(strnew).width) / 2, 437);
                          ctxt.draw(true);
                          // 第三部 渲染左边图片
                          wx.getImageInfo({
                            src: _this.data.activityblindbox[0].cover,
                            success: function (res) {
                              // 渲染左边图片
                              ctxt.fillStyle = '#fff';
                              ctxt.fillRect(10, 449, 144, 130);
                              ctxt.draw(true);
                              ctxt.drawImage(res.path, 10, 449, 144, 77)
                              ctxt.draw(true);
                              if(_this.data.activityblindbox[0].isNewArrival){
                                ctxt.drawImage(labelstyleImg, 114, 449, 40, 40)
                                ctxt.draw(true);
                              }
                              ctxt.setFontSize(11);
                              ctxt.setFillStyle('#000');
                              ctxt.fillText(_this.data.activityblindbox[0].name, 13, 544);
                              ctxt.draw(true);
                              ctxt.setFontSize(11);
                              ctxt.setFillStyle('#ff2742');
                              ctxt.fillText('￥' + _this.data.activityblindbox[0].shop_price, 13, 566);
                              ctxt.draw(true);
                              if (_this.data.activityblindbox[0].tip){
                                ctxt.setFontSize(10);
                                ctxt.setFillStyle('#ff2742');
                                ctxt.fillText(_this.data.activityblindbox[0].tip, 83, 566);
                                ctxt.draw(true);
                                ctxt.strokeStyle = "#ff2742";
                                ctxt.lineWidth = 1;
                                ctxt.strokeRect(80, 554, ctxt.measureText(_this.data.activityblindbox[0].tip).width + 6, 16);
                                ctxt.draw(true);
                              };
                              // 第四部 渲染右边图片
                              wx.getImageInfo({
                                src: _this.data.activityblindbox[1].cover,
                                success: function (res) {
                                  // 渲染右边图片
                                  ctxt.fillStyle = '#fff';
                                  ctxt.fillRect(164, 449, 144, 130);
                                  ctxt.draw(true);
                                  ctxt.drawImage(res.path, 164, 449, 144, 77)
                                  ctxt.draw(true);
                                  if(_this.data.activityblindbox[1].isNewArrival){
                                    ctxt.drawImage(labelstyleImg, 268, 449, 40, 40)
                                    ctxt.draw(true);
                                  }
                                  ctxt.setFontSize(11);
                                  ctxt.setFillStyle('#000');
                                  ctxt.fillText(_this.data.activityblindbox[1].name, 167, 544);
                                  ctxt.draw(true);
                                  ctxt.setFontSize(11);
                                  ctxt.setFillStyle('#ff2742');
                                  ctxt.fillText('￥' + _this.data.activityblindbox[1].shop_price, 167, 566);
                                  ctxt.draw(true);
                                  if (_this.data.activityblindbox[1].tip){
                                    ctxt.setFontSize(10);
                                    ctxt.setFillStyle('#ff2742');
                                    ctxt.fillText(_this.data.activityblindbox[1].tip, 237, 566);
                                    ctxt.draw(true);
                                    ctxt.strokeStyle = "#ff2742";
                                    ctxt.lineWidth = 1;
                                    ctxt.strokeRect(234, 554, ctxt.measureText(_this.data.activityblindbox[1].tip).width + 6, 16);
                                    ctxt.draw(true);
                                  };
                                  ctxt.draw(true, setTimeout(function () {
                                    wx.canvasToTempFilePath({
                                      canvasId: 'myordercanimgser',
                                      success: function (res) {
                                        _this.setData({
                                          actimgshareWinningtheprize: res.tempFilePath,
                                          headhidden: true
                                        });
                                      },
                                      fail: function (res) {
                                        app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:05}');
                                        _this.setData({ upserimgboxWinningtheprize: false, headhidden: true });
                                      },
                                    });
                                  }, 300));
                                },
                                fail:function(){

                                },
                              });
                            },    
                          fail: function() {

                          },
                        });
                        }
                      },
                      fail: function (res) {
                        app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:06}');
                        _this.setData({ upserimgboxWinningtheprize: false, headhidden: true });
                      }
                    });
                  },
                  fail: function (res) {
                    app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:07}');
                    _this.setData({ upserimgboxWinningtheprize: false, headhidden: true });
                  }
                });

              },
              fail: function (res) {
                app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:08}');
                _this.setData({ upserimgboxWinningtheprize: false, headhidden: true });
              }
            })
          }
        })
      },
      fail: function (res) {
        app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:10}');
        _this.setData({ upserimgboxWinningtheprize: false, headhidden: true });
      }
    });  
  },

  // 保存图片
  sharesavethepictureWinningtheprize: function () {
    var _this = this;
    var imgSrc = _this.data.actimgshareWinningtheprize || '';
    wx.getSetting({
      success(res) {
        // 如果没有则获取授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.saveImageToPhotosAlbum({
                filePath: imgSrc,
                success() {
                  _this.saveimgfun();
                },
                fail() {
                  app.showToastC('保存失败');
                  _this.setData({ upserimgboxWinningtheprize: false, actimgshare: '' });
                }
              })
            },
            fail() {
              _this.setData({
                picbox: true,
                upserimgbox: false,
                actimgshare: ''
              });
            }
          })
        } else {
          // 有则直接保存
          wx.saveImageToPhotosAlbum({
            filePath: imgSrc,
            success() {
              _this.saveimgfun();
            },
            fail() {
              app.showToastC('保存失败');
              _this.setData({ upserimgboxWinningtheprize: false, savepicturesiftr: true, actimgshare: '' });
            }
          })
        }
      }
    });
  },
  saveimgfun: function () {
    var _this = this;
    var qsign = Dec.Aese('mod=operate&operation=confirmSave&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + _this.data.cart_idsave);
    wx.request({
      url: app.signindata.comurl + 'order.php' + qsign,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        app.showToastC('保存成功');
        _this.setData({ upserimgboxWinningtheprize: false, actimgshare: '' });
        _this.onLoadfun();
      },
      fail: function () { }
    });
  },
  bindchange(e) {
    this.setData({
      swiperIndex: e.detail.current
    })
  },
  wmy: function () {
    app.signindata.iftr_mc = true;
    wx.redirectTo({
      url: "/pages/wode/wode"
    });
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
  tgfrShareIftrFun:function(){
    this.setData({
      tgfrShareIftr:false
    })
  },
  dlfindfun: function () {
    wx.reLaunch({
      url: "/page/component/pages/dlfind/dlfind",
    })
  },
  awajump:function(){
    var cart_id = this.data.commoddata.cart_id || '';
    wx.navigateTo({
      url: "/page/component/pages/awardwinningarea/awardwinningarea?cart_id=" + cart_id,
    });
    this.setData({awatip: false});    
  },
  awatipdisnone:function(){
    this.setData({awatip:false});
  },
  // 调取活动列表
  actrecactnum: function (w) {
    var actrecactnum = w.currentTarget.dataset.actrecactnum || w.target.dataset.actrecactnum;
    this.setData({
      actrecactnum: actrecactnum,
      actscrollleft:0
    });
    this.actrecactlist(1);
  },
  actrecactlist: function (num){
    var _this = this;
    if (num == 1) {
      _this.setData({ pid: 0 });
    } else {
      var pagenum = _this.data.pid;
      _this.setData({ pid: ++pagenum });
    };
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    var q = Dec.Aese('mod=activity&operation=list&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&category_id=9&pid=' + _this.data.pid);
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          var arrlist = res.data.List.list || [];
          if (arrlist.length != 0) {
            for (var i = 0; i < arrlist.length; i++) {
              if (!reg.test(arrlist[i].goods_cover)) {
                arrlist[i].goods_cover = _this.data.zdyurl + arrlist[i].goods_cover;
              };
              if (!reg.test(arrlist[i].cover)) {
                arrlist[i].cover = _this.data.zdyurl + arrlist[i].cover;
              };
              arrlist[i].start_time = _this.toDatehd(arrlist[i].start_time);
              arrlist[i].stop_time = _this.toDatehd(arrlist[i].stop_time);
            };
          };
          if (num == 1) {
            var comdataarr = arrlist || [];
          } else {
            var comdataarr = _this.data.commoddata.concat(arrlist);
          };
          _this.setData({
            actrecactlist: comdataarr
          });
        };
        if (res.data.ReturnCode == 300) {
          if (num == 1) {
            _this.setData({
              actrecactlist: []
            });
          }
        };
        if (res.data.ReturnCode == 900) {
          app.showToastC('登陆状态有误');
        };
      }
    });
  },
  loaddataright:function(){
    this.actrecactlist(2);
  },
  jumppicture:function(){
    var txt = this.data.commoddata.explain||'';
    wx.navigateTo({
      url: "/page/component/pages/savethepicture/savethepicture?txt=" + txt+'&type=1'
    });
  },
  // 计算图片大小
  imageLoadad: function (e) {
    var _this = this;
    var indexnum = e.currentTarget.dataset.indexnum || e.target.dataset.indexnum || 0;
    if (indexnum == 1){
      var num = e.currentTarget.dataset.num || e.target.dataset.num || 0;
      var $width = e.detail.width,    //获取图片真实宽度
        $height = e.detail.height,
        ratio = $width / $height;
      var viewHeight = 177,           //设置图片显示宽度，
        viewWidth = 177 * ratio;
      var listBlindBox = this.data.listBlindBox || [];
      if (viewWidth > 680) {
        viewWidth = 680;
      };
      if (listBlindBox) {
        if (listBlindBox[num]) {
          listBlindBox[num].width = viewWidth;
          _this.setData({
            listBlindBox: listBlindBox
          });
        };
      };
    }else if (indexnum == 2) {
      var num = e.currentTarget.dataset.num || e.target.dataset.num || 0;
      var $width = e.detail.width,    //获取图片真实宽度
        $height = e.detail.height,
        ratio = $width / $height;
      var viewHeight = 240,           //设置图片显示宽度，
        viewWidth = 240 * ratio;
      var listShowBox = this.data.listShowBox||[];
      if (viewWidth > 680) {
        viewWidth = 680;
      };
      if (listShowBox) {
        if (listShowBox[num]) {
          listShowBox[num].width = viewWidth;
          _this.setData({
            listShowBox: listShowBox
          });
        };
      };
    }
  },
  // 拆明盒
  jumpopenbox: function (event) {
    var id = event.currentTarget.dataset.id || event.target.dataset.id;
    var _this = this;
    wx.navigateTo({
      url: "/page/component/pages/mingbox/mingbox?id=" + id,
    });
  },
  showboxlistfun:function(){
    wx.navigateTo({
      url: "/page/component/pages/mingboxList/mingboxList",
    });
  },
  // 在线抽盒机
  bbevebox: function (event) {
    var id = event.currentTarget.dataset.gid || event.target.dataset.gid;
    var _this = this;
    wx.navigateTo({
      url: "/pages/smokebox/smokebox?id=" + id,
    });
  },
  bblistfun:function(){
    wx.redirectTo({
      url: "/pages/smokeboxlist/smokeboxlist",
    });
  },
  limitlottfun:function(){
    wx.navigateTo({
      url: "/page/component/pages/limitlotterylist/limitlotterylist",
    });
  },
  jumpdlflottery: function (event) {
    var id = event.currentTarget.dataset.id || event.target.dataset.id;
    var _this = this;
    _this.setData({ jumpdevanningiftr: true });
    wx.navigateTo({
      url: "/page/component/pages/limitlottery/limitlottery?id=" + id,
    });
  },
  tipfulregistrationfun:function(){
    var _this = this;
    _this.setData({
      tipfulregistration: false
    });
    _this.upserimgboxiftr();
  },
  acetlistfunfun:function(){
    this.setData({
      upserimgbox:false
    })
  },
  perspcarfun:function(){
    this.setData({
      perspcardiftrmax:false,
      perspcardiftrmin:true
    });
  },

  // 晒单点赞
  // 点赞
  ispraisefun: function (w) {
    var _this = this;
    var is_praise = w.currentTarget.dataset.is_praise || w.target.dataset.is_praise || 0;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var lid = w.currentTarget.dataset.lid || w.target.dataset.lid || 0;
    var listdata = this.data.exhdata;
    if (_this.data.loginid != '' && _this.data.uid != '') {
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
          if (res.data.ReturnCode == 200) {
              if (is_praise == 0) {
                listdata[ind].is_praise = 1;
                listdata[ind].praise_sum = parseInt(listdata[ind].praise_sum) + 1;
              } else {
                listdata[ind].is_praise = 0;
                listdata[ind].praise_sum = parseInt(listdata[ind].praise_sum) - 1;
              };
              _this.setData({ exhdata: listdata });
          } else {
            app.showToastC(res.data.Msg);
          }
        },
        fail: function () {}
      });
    }

  }, 
  gobrandDetails: function (w) {
    var mid = w.currentTarget.dataset.mid || w.target.dataset.mid || 0;
    var settlement = this.data.is_exhibition;
    wx.navigateTo({
      url: "/page/secondpackge/pages/brandDetails/brandDetails?id=" + mid + "&settlement="+settlement,
    });
  },


})