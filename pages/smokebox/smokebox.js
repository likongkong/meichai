// /pages/smokebox/smokebox.js
var Dec = require('../../common/public.js'); //aes加密解密js
var time = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newdataexh:Date.parse(new Date())/1000<1588175999?true:false,
    //接口地址
    comurl: app.signindata.comurl,
    // 图片地址
    zdyurl: Dec.zdyurl(),
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,
    avatarUrl: app.signindata.avatarUrl,
    isProduce: app.signindata.isProduce,
    // 适配苹果X
    isIphoneX: app.signindata.isIphoneX,
    defaultinformation: '',
    wxnum: '',

    // 授权弹框
    tgabox: false,

    // 晒单数量
    dryinglistnum: 0,
    shopnum: 0,

    c_title: '在线抽盒机',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,

    list: [1, 1, 1, 1, 1, 1],

    testlist: [1, 1, 1, 1, 1, 1, 1, 1],

    boxwidth: 0,

    tipbacktwo: false,
    buybombsimmediately: false,
    receivingaddress: false,
    pricedetailc: false,
    freight: "",
    tipaid: "",
    addressdata: "",
    tipaddress: "",
    receivingaddress: "",
    desc: '',
    cart_id: '',

    animation: "",
    atimer: "",

    activity: "",
    inviteList: [],
    queueList: [],
    roleList: [],
    payprice: 0,
    linenum: "",
    id: 0,
    gid: 0,
    awardimg: "",
    awardname: "",
    order_id: "",
    total: '',

    isqueue: true,
    ishowbox: false,
    ishowhalf: true,
    ishowaward: false,

    recordtime: 0,
    timer: "",

    remaintime: 0,
    iefheight: 0,
    iewidth: 0,


    ischange: false,

    rollchance: 0,
    ischangebox: false,

    idlist: [],
    relAidList: [],
    ischangeid: false,
    ischangeagain: false,
    ishowexit: false,

    isTry: false, // 是否是试一试
    suplusTry: 0, //试一试次数
    isReTry: false, //是否可以试一试重抽

    ishowguess: false, //猜一盒 
    ishowhint: false,
    ishareguessbox: false, //邀请猜盒
    iexpendtip: false, // 消耗提示卡
    iexpendray: false, // 消耗透视卡 
    hintstr: "",

    isusertip: false,
    isuserray: false,

    cardTip: 0, //提示卡
    cardXRay: 0, //透视卡

    pageBg: "#e6d4c6",

    ishowcard: false,
    cardImg: "",
    cardstr: "",
    ishowagain: false,
    isagainroll: false,

    hideList: [],
    hideheight: 0,
    hidewidth: 0,
    boxnum: 0,
    isloadfun: false,

    cardimgheight: 0,
    isOpenWholeBox: false,
    ishowwholebox: false,
    wholeBoxList: [],
    ishowWholeBoxList: false,
    iswholePay: false,
    isAllshow: false,
    ishowxray: false,
    ishowxraybtn: false,
    iftrdetailpageone: false,
    iftrdetailpagetwo: false,
    windowHeight: app.signindata.windowHeight - 65 - wx.getStorageSync('statusBarHeightMc') || 0,
    signinlayer: true,

    festivalId: false,

    hideboxList: [],

    wholebox_avtivity_id: 0,
    patchNumber: '',

    isRepeatOpen: 0,

    wholeboxidheight: 0,

    tricklinelist: [1, 2, 3, 4, 5, 6, 7],
    scrollleft: 0,
    chiplist: ["https://www.51chaidan.com/images/spread/blindBox/32771_51_1566440065.png",
      "https://www.51chaidan.com/images/spread/blindBox/32771_51_1566440065.png",
      "https://www.51chaidan.com/images/spread/blindBox/32771_51_1566440065.png",
      "https://www.51chaidan.com/images/spread/blindBox/32771_51_1566440065.png",
      "https://www.51chaidan.com/images/spread/blindBox/32771_51_1566440065.png",
      "https://www.51chaidan.com/images/spread/blindBox/32771_51_1566440065.png",
      "https://www.51chaidan.com/images/spread/blindBox/32771_51_1566440065.png"
    ],
    ishowcollectchip: false,
    iselected: 0,
    ishowcollectrule: false,
    goldtip: -1,
    sivertip: -1,

    // 倒计时时间戳
    perspcardata: '',
    // 倒计时展示数据
    percountdown: '',
    // 倒计时
    countdowntime: '',
    perspcardiftrmin: false,

    chipItemHeight: 0,
    chiprownum: 2,
    nogetimagewidth: 0,

    hideBoxImg: "https://www.51chaidan.com/images/blindbox/gold_case.png",
    blindBoxImg: "https://www.51chaidan.com/images/blindbox/silver_case.png",
    is_share: false,
    automat: app.signindata.automat,
    automatTimes: 0,
    automattitle: '',

    showClass: false,

    intervaltimer: false,
    snapshotshare: '',
    ishowdealoradd: false,
    ishowdeal: true,
    ishowadd: false,
    addressdata: [],
    isBlindBoxDefaultAddress: false,
    maddid: '',
    ishowcover: false,
    framtop: (app.signindata.windowHeight - 400) / 2,
    welfare: [],
    redpagList: [],
    ishowredpackage: false,
    firstshowredpag: true,
    ishowpagInfo: false,
    welfareInfo: "",
    welfareList: [],
    isharepag: false,
    isredshare: false,
    welfareid: 0,
    isredpag: 0,
    redpagshareimg: "http://www.51chaidan.com/images/blindBox/halfPackage.jpg",
    ishowsurebuy: false,
    wwheight: app.signindata.windowHeight,
    isheavyroll: false, // 点击了重抽
    rollbefore: "",
    rollbelater: "",
    isallready: false,
    istipsure: false,
    israysure: false,

    isfirst: false,
    is_exhibition: 0,
    exhibdetail: true,
    exhdata: [],
    userbranddata: "",
    tipCheapForWholeBox: 0,
    subscribedata: '',
    isSubscribeCoupon: false,
    subscribeCouponTip: '',
    imgwidth:450,
    isDirectShipping:false,
    iftrcloud: true,
    // 端盒送实物
    whole_boxGift:'',
    wholeBoxGiftImg:'',
    wholeBoxGiftInfo:{},
    // 防止重复提交
    pmc:true,
    //是否可回收
    isRecycle:false,
    //是否可用抽盒金抵扣
    isDeduct:false,
    //是否使用抽盒金抵扣
    isUseDeduct:false,
    //抽盒金规则
    isrecyclerule:false,
    thePreviousSelOrder:true,
    //是否获得抽盒金
    isRecycleMask:false,
    isRecycleStateA:true,
    isSingle:true,

    //端盒60秒倒计时C
    dhRecycleCount:60,
    isDhRecycleBtn:true
  },
  // 在线抽盒机
  bbevebox: function(event) {
    var id = event.currentTarget.dataset.gid || event.target.dataset.gid;
    var _this = this;
    wx.redirectTo({
      url: "/pages/smokebox/smokebox?gid=" + id
    });
  },
  exhibdetailfun: function (w) {
    this.setData({
      exhibdetail: !this.data.exhibdetail
    })
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 1;
    var query = wx.createSelectorQuery();
    query.select('#exh' + ind).boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec(function(res) {
      if (res && res[0] && res[1]) {
        wx.pageScrollTo({
           scrollTop:res[0].top+res[1].scrollTop-app.signindata.statusBarHeightMc||99,
           duration:300
        })
      }
    });
  },

  clickCard: function () {
    var _this = this;
    if (_this.data.awardfront != _this.data.awardback) {
      this.setData({
        showClass: !_this.data.showClass,
      })
    }
  },
  startDraw: function () {
    var _this = this;
    if (_this.data.awardfront != _this.data.awardback) {
      _this.data.intervaltimer = setInterval(function () {
        console.log('startDraw------>clickCard')
        _this.clickCard()
      }.bind(_this), 2000);
    }
  },
  stopDraw: function () {
    clearInterval(this.data.intervaltimer);
  },

  doubleEleven: function () {
    var _this = this;
    wx.navigateTo({
      url: "/page/component/pages/doubleEleven/doubleEleven"
    });
  },
  showrule: function () {
    var _this = this

    wx.navigateTo({
      url: "/page/component/pages/webview/webview?webview=https://www.51chaidan.com/notice/strategyBlindBox.html",
    });
  },

  againOpenBox: function () {
    var _this = this
    wx.showLoading({
      title: '加载中...',
    })
    var q1 = Dec.Aese('mod=blindBox&operation=openNew' + '&id=' + _this.data.id);

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },

      success: function (res) {
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          wx.redirectTo({
            url: "/pages/smokebox/smokebox?id=" + res.data.Info.activityId,
          });
        }
      },
      fail: function () {
        wx.hideLoading()
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    if (options.scene) {
      // '&welfareid=' + _this.data.welfareid + '&isredpag=1'
      let scene = decodeURIComponent(options.scene);
      app.signindata.referee = _this.getSearchString('referee', scene) || 0;
      app.signindata.activity_id = _this.getSearchString('id', scene) || 0;
      _this.data.id = _this.getSearchString('id', scene) || 0;
      _this.data.gid = _this.getSearchString('gid', scene) || 0;
      _this.data.welfareid = _this.getSearchString('welfareid', scene) || 0;
      _this.data.isredpag = _this.getSearchString('isredpag', scene) || 0;
      _this.setData({
        is_share: _this.getSearchString('referee', scene) || 0 ? true : false
      })
    } else {
      app.signindata.referee = options.referee || 0;
      app.signindata.activity_id = options.id || 0;
      _this.data.id = options.id || 0;
      _this.data.gid = options.gid || 0;
      _this.data.welfareid = options.welfareid || 0;
      _this.data.isredpag = options.isredpag || 0;
      _this.setData({
        is_share: options.referee ? true : false
      })
    }

    // _this.data.id = 47670;
    // _this.data.gid = 0;

    // 推送统计
    _this.data.push_id = options.push_id || 0;

    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      avatarUrl: app.signindata.avatarUrl,
      isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
    });
    wx.showLoading({
      title: '加载中...',
    })
    _this.getHideBox()
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
              uid: app.signindata.uid,
              avatarUrl: app.signindata.avatarUrl,
              isProduce: app.signindata.isProduce,
              signinlayer: true,
              isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
            });
            // 判断是否登录
            if (_this.data.loginid != '' && _this.data.uid != '') {
              _this.onLoadfun();
            } else {
              app.signin(_this)
            }
          } else {
            wx.hideLoading()
            if (_this.data.isredpag==1){
              app.userstatistics(41);
            }else{
              app.userstatistics(30);
            }
            _this.onLoadfun();
            this.setData({
              signinlayer: false,
            })
          }
        }
      });
    };


  },

  // 授权点击统计
  clicktga: function () {
    app.clicktga(2)
  },
  clicktganone: function () {
    this.setData({
      tgabox: false
    })
  },
  userInfoHandler: function (e) {
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
            _this.setData({
              uid: app.signindata.uid,
              avatarUrl: app.signindata.avatarUrl,
              isProduce: app.signindata.isProduce,
              isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
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
    if (e.detail.detail.userInfo) { } else {
      app.clicktga(8) //用户按了拒绝按钮
    };

  },

  onLoadfun: function () {

    var _this = this
    wx.hideLoading()

    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.data.perspcardata = app.signindata.perspcardata || '';
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      avatarUrl: app.signindata.avatarUrl,
      automat: app.signindata.automat || {
        isOpen: false,
        times: 0
      },
      automatTimes: app.signindata.automat.times,
      automattitle: app.signindata.automattitle || '',
      isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
      defaultinformation:app.signindata.defaultinformation,
    });
    if (_this.data.isredpag == 1) {
      this.shareopen(_this.data.welfareid)
    }
    this.getInfo()

    setTimeout(function () {
      _this.getdefault();
    }, 1000)

    if (_this.data.perspcardata) {
      app.countdowntime(_this, _this.data.perspcardata)
      _this.setData({
        perspcardiftrmin: true
      })
    };

    if (_this.data.loginid != '' && _this.data.uid != '' && !_this.data.isBlindBoxDefaultAddress) {
      _this.setData({
        ishowdealoradd: true,
        ishowcover: true,
      })
    }



  },

  getdefault: function () {
    var _this = this;

    if(_this.data.defaultinformation){}else{
      console.log('defaultinformation=====接口')
      
      app.defaultinfofun(_this);
    }


  },

  initview: function () {
    var _this = this

    //创建节点选择器
    var box = wx.createSelectorQuery();
    //选择id
    box.select('#boxindex').boundingClientRect();
    box.exec(function (res) {
      if (res && res[0]) {
        _this.setData({
          boxwidth: (res[0].width - 2) / _this.data.linenum - 2,
        })
      };
    })

    if (_this.data.ischangeid) {
      _this.setData({
        ischangebox: true,
      })

      setTimeout(function () {
        _this.setData({
          ischangebox: false,
          ischangeid: false,
        })
      }, 2000)
    }

    _this.animation = wx.createAnimation({
      // 动画持续时间，单位ms，默认值 400
      duration: 300,
      timingFunction: 'linear',
      // 延迟多长时间开始
      delay: 0,
      transformOrigin: 'center center 0',
      success: function (res) {}
    })
    // _this.mAnimation() //开启动画
  },
  imageLoadhead: function (e) {
    var _this = this;
    var $width = e.detail.width;
    var $height = e.detail.height;
    var ratio = $width / $height;
    var viewWidth = 454,
      viewHeight = viewWidth / ratio;
    // if (viewHeight > 500) {
    //   viewWidth = 500 * ratio;
    //   viewHeight = 500;
    // };
    if (viewHeight>400){
       this.setData({
         imgwidth:300
       })
    }
    this.initview()
  },

  mAnimation: function () {
    var _this = this
    clearInterval(this.data.atimer)
    this.data.atimer = setInterval(function () {
      this.animation.translate(0, -13).step().translate(0, 0).step().translate(0, -5).step().translate(0, 0).step()
      this.setData({
        //输出动画
        animation: this.animation.export(),
      })
    }.bind(this), 1350)
  },

  getInfo: function (recycle = true) {
    var _this = this
    wx.showLoading({
      title: '加载中...',
    })
    var q1 = Dec.Aese('mod=blindBox&operation=info&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&gid=' + _this.data.gid+ '&push_id='+_this.data.push_id);

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },

      success: function (res) {
        _this.data.push_id =  0;
        console.log('getInfo======',res)
        wx.stopPullDownRefresh();
        _this.data.isloadfun = true
        wx.stopPullDownRefresh()
        if (res.data.ReturnCode == 200) {
          clearInterval(_this.data.timer)
          clearInterval(_this.data.atimer)
          if (res.data.Info.activity.backgroundCode && res.data.Info.activity.backgroundCode != "") {
            _this.setData({
              pageBg: res.data.Info.activity.backgroundCode
            })
          } else {
            _this.setData({
              pageBg: "#e6d4c6"
            })
          }
          if (res.data.Info.activity.status == 1) {
            res.data.Info.activity.start_time = time.toDate(res.data.Info.activity.start_time);
          }


          // if (redauin.status == 1) {
          //   var datatimewell = redauin.startTime;
          //   redauin.datatimew = datatimewell;
          //   redauin.datatimew = _this.toDatehd(redauin.datatimew);
          //   _this.winningtheprizetimedetail(redauin.startTime);
          // };


          _this.setData({
            activity: res.data.Info.activity,
            festivalId: res.data.Info.festivalId || false,
            festivalTicket: res.data.Info.festivalTicket || false,
            inviteList: res.data.List.invite || [],
            queueList: res.data.List.queue || [],
            roleList: res.data.List.role || [],
            employList: res.data.List.employ || [],
            retry: res.data.Info.alert ? res.data.Info.alert.retry : "免费重抽不支持二选一",
            multipleHide: res.data.List.multipleHide || [],
            id: res.data.Info.activity.id,
            gid: res.data.Info.activity.goods_id,
            rollchance: res.data.Info.activity.suplusChance,
            idlist: res.data.List.arrActivityId || [],
            relAidList: res.data.List.relAIdUnpack || [],
            suplusTry: res.data.Info.activity.suplusTry,
            cardTip: res.data.Info.user.cardTip,
            cardXRay: res.data.Info.user.cardXRay,
            isOpenWholeBox: res.data.Info.activity.isOpenWholeBox||'',
            isRepeatOpenWholeBox: res.data.Info.function.isRepeatOpenWholeBox || true,
            isFirstOrder: res.data.Info.function.isFirstOrder || false,
            firstOrderDiscount: res.data.Info.function.firstOrderDiscount || 0,
            countLine: res.data.Info.countLine,
            countRole: res.data.Info.countRole,
            isOpenLine: res.data.Info.isOpenLine,
            isDirectOpenWholeBox: res.data.Info.isDirectOpenWholeBox||'',
            welfare: res.data.Info.welfare || [],
            is_exhibition: res.data.Info.activity.specialWay ? res.data.Info.activity.specialWay : 0,
            brandId: res.data.Info.activity ? res.data.Info.activity.brandId : '',
            tipCheapForWholeBox: res.data.Info.tipCheapForWholeBox || 0,
            subscribedata: res.data.Info.subscribe || '',
            blindBoxLucky: res.data.Info.user.blindBoxLucky,
            exchangeLuckyCondition: res.data.Info.user.exchangeLuckyCondition,
            wholeBoxImg: res.data.Info.img.wholeBox ? res.data.Info.img.wholeBox : "https://www.51chaidan.com/images/blindbox/gold_case.png",
            isSubscribeCoupon: res.data.Info.activity.isSubscribeCoupon || false,
            subscribeCouponTip: res.data.Info.activity.subscribeCouponTip || '',
            // 是否是端盒送实物
            whole_boxGift:res.data.Info.whole_boxGift||'',
            wholeBoxGiftImg:res.data.Info.wholeBoxGiftImg || '',
            definePicture:res.data.Info.img||{},
            idendataList:res.data.List.sameBrandActivity||[], // 相同品牌数据 
            branddata:res.data.Info.brand || '', // 品牌数据
            //刷新关闭弹框
            ishowcollectchip: false,
            //是否可回收
            isRecycle:res.data.Info.activity.isRecycle,
            //是否可使用抽盒金抵扣
            isDeduct:res.data.Info.activity.isDeduct,
            //是否使用抽盒金抵扣
            isUseDeduct:res.data.Info.activity.isDeduct?true:false
          })

          if(recycle){
            _this.setData({
              isRecycleMask:false,
              isRecycleStateA:true
            })
          }

          // 商品详情 
          if (res.data.Info && res.data.Info.goods) {
            if (res.data.Info.goods.goods_desc) {
              WxParse.wxParse('article', 'html', res.data.Info.goods.goods_desc, _this, 0);
              _this.setData({
                iftrdetailpageone: true,
                goods_thumb: res.data.Info.goods.goods_thumb ? res.data.Info.goods.goods_thumb : "",
              });
            } else {
              _this.setData({
                iftrdetailpageone: false
              });
            };
          } else {
            _this.setData({
              iftrdetailpageone: false
            });
          };


          var l = res.data.List.employ.concat(res.data.List.queue);
          _this.setData({ queueList: l })

          // 是否调取展会数据
          if (!_this.data.isfirst && res.data.Info.activity.specialWay && res.data.Info.activity.specialWay == 1||(res.data.Info.activity.specialWay!=1&&_this.data.brandId>0)) {
            _this.data.isfirst = true;
            // wx.hideShareMenu()
            _this.exhibdatafun(1)
            app.livebroadcast(_this, res.data.Info.activity.brandId)  // 直播数据
          }
          // 云统计
          if (_this.data.iftrcloud) {
            var clouddata = { act_id: _this.data.id, type: res.data.Info.activity.specialWay || 0 };
            app.cloudstatistics('activityStatistics', clouddata);
            _this.data.iftrcloud = false;
          };


          if (_this.data.firstshowredpag && res.data.Info.welfare.length > 0 && res.data.Info.welfare[0].currentAmount == 0 && _this.data.isredpag != 1) {
            _this.hidepackage()
            _this.setData({
              redpagList: res.data.Info.welfare || [],
              firstshowredpag: false,
            })
          } else if (_this.data.firstshowredpag) {
            _this.data.firstshowredpag = false
          }

          if (res.data.List.role.length == 8 || res.data.List.role.length == 12 || res.data.List.role.length == 7 || res.data.List.role.length == 10 || res.data.List.role.length == 11 || res.data.List.role.length == 24 || res.data.List.role.length == 18) {
            _this.setData({
              linenum: 4,
            })
          } else if (res.data.List.role.length == 9 || res.data.List.role.length == 6 || res.data.List.role.length == 5 || res.data.List.role.length == 3) {
            _this.setData({
              linenum: 3,
            })
          } else if (res.data.List.role.length == 13 || res.data.List.role.length == 14 || res.data.List.role.length == 15) {
            _this.setData({
              linenum: 5,
            })
          } else if (res.data.List.role.length == 4 || res.data.List.role.length == 2) {
            _this.setData({
              linenum: 2,
            })
          }

          if (_this.data.inviteList.length < 6) {
            var list = _this.data.inviteList
            var y = 6 - _this.data.inviteList.length
            for (var i = 0; i < y; i++) {
              list.push(1)
            }
            _this.setData({
              inviteList: list,
            })
          }

          if (res.data.Info.activity.aheadUser == 0 && !_this.data.activity.isInQueue) {
            _this.reset()
          }

          if (res.data.Info.activity.aheadUser == 0 && !_this.data.activity.isInQueue && res.data.Info.activity.status == 2 && _this.data.isqueue) {
            _this.queueup(1, 0) //排队 
            _this.setData({
              isqueue: false,
            })
          }

          if (res.data.Info.activity.refreshTime) {
            if (_this.data.recordtime == 0 || res.data.Info.activity.refreshTime >= _this.data.recordtime) {
              _this.setData({
                recordtime: res.data.Info.activity.refreshTime + (parseInt(res.data.Info.activity.aheadUser) * 2)
              })
            }

            var timestamp = Date.parse(new Date()) / 1000
            if (res.data.Info.activity.refreshTime > timestamp) {
              _this.countdown()
            } else if (!res.data.Info.activity.canOperate) {
              _this.reset()
            }
          }

          if (res.data.List.hideRole.length > 0) {
            for (var i = 0; i < res.data.List.hideRole.length; i++) {
              res.data.List.hideRole[i].img = _this.data.zdyurl + res.data.List.hideRole[i].img;
            }
            _this.setData({
              hideList: res.data.List.hideRole,
            })
          }

          if (res.data.List.role.length > 0) {
            var boxnum = 0;
            for (var i = 0; i < res.data.List.role.length; i++) {
              if (!res.data.List.role[i].isSoldOut) {
                boxnum++;
              }
            }
            _this.setData({
              boxnum: boxnum,
            })
          }

          _this.initview()

          // 生成图片
          if (res.data.Info.function.isFirstOrderActivity) {
            _this.snapshotsharefun();
          };

          setTimeout(function () {
            _this.nextpagediao()
            _this.setData({
              isallready: true,
            })
          }, 500) //延迟时间 这里是1秒


        }
        wx.hideLoading()
      },

      fail: function (res) {
        wx.stopPullDownRefresh();
        wx.hideLoading()
      }

    })
  },



  reset: function () {
    var _this = this
    _this.setData({
      ishowbox: false,
      ishowhalf: true,
      ishowaward: false,
      tipbacktwo: false,
      buybombsimmediately: false,
      receivingaddress: false,
      isTry: false,
      ishowguess: false, //猜一盒 
      ishowhint: false,
      ishowcard: false,
      ishowagain: false,
      isagainroll: false,
      ishowxray: false,
    })
    _this.stopDraw();
  },

  goDetail: function () {
    var _this = this
    _this.queueup(2, 1)
    setTimeout(function () {
      wx.navigateTo({
        url: "../../../../pages/detailspage/detailspage?gid=" + _this.data.activity.infoGift.goods_id,
      })
    }, 100)
  },

  countdown: function () {
    var _this = this;
    clearInterval(_this.data.timer)
    _this.data.timer = setInterval(function () {
      //将时间传如 调用 
      _this.dateformat(_this.data.recordtime);
    }.bind(_this), 1000);
  },

  lineup: function () {
    var _this = this;
    console.log(1111111111)
    _this.queueup(1, 0)
  },

  // continuType  1是跳详情    2选择一个盲盒   3再来一个  4分享   5跳转新增地址  6支付成功  7重roll
  // type 1是排队  2是延时
  queueup: function (type, continuType,refresh) {
    var _this = this
    wx.showLoading({
      title: '加载中...',
    })

    var q1 = Dec.Aese('mod=blindBox&operation=lineUp&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&type=' + type + '&continuType=' + continuType);

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },

      success: function (res) {
        if (res.data.ReturnCode == 200) {
          if (type == 1) {
            _this.getInfo()
          } else {
            var timestamp = Date.parse(new Date()) / 1000
            if (res.data.Info.newOverTime > timestamp) {
              _this.data.recordtime = res.data.Info.newOverTime;
              _this.countdown();
            }
            wx.hideLoading()
          }
        } else if (res.data.ReturnCode == 348) {
          app.showToastC('即将开放，敬请期待');
          _this.subscrfun();
        };
        if(refresh){
          _this.getInfo()
        }
      },
      fail: function () {
        wx.hideLoading()
      }
    })
  },

  selectbox: function () {
    var _this = this
    _this.setData({
      ishowcollectchip: false,
      isUseDeduct:_this.data.isDeduct,
      payFail:false
    })
    if (_this.data.activity.aheadUser == 0 && _this.data.activity.isInQueue) {
      _this.placeorder()
    } else {
      _this.lineup();
    }
  },

  closeselect: function () {
    var _this = this
    _this.setData({
      ishowbox: false,
      ishowhalf: true,
    })
  },

  closeguess: function () {
    var _this = this
    _this.setData({
      ishowguess: false,
      ishowhalf: true,
    })
  },

  ubpackbox: function () {
    var _this = this
    console.log('ishowaward================ishowaward支付完成显示重抽')
    _this.setData({
      ishowaward: true,
      ishowguess: false,
      ishowbox: false,
    })
    _this.startDraw();
  },

  closeaward: function (w) {
    var _this = this
    var type = w.currentTarget.dataset.type || w.target.dataset.type;
    if (type == 2) {
      if (!_this.data.isTry) {
        _this.queueup(2, 3)
      }
      _this.setData({
        ishowaward: false,
        ishowbox: false,
        ishowhalf: true,
        isTry: false,
        isRecycleMask:false,
        isRecycleStateA:true
      })
      _this.stopDraw();
    } else {
      if (!_this.data.isTry) { // 如果是在试一试中 不弹二级确认
        if (_this.data.rollchance > 0 && _this.data.boxnum > 0 && !_this.data.isheavyroll) {
          _this.setData({
            ishowagain: true,
          })
        } else {
          _this.setData({
            ishowexit: true,
          })
        }
      } else {
        _this.affirmexit()
      }
    }
  },

  closexit: function () {
    var _this = this
    _this.setData({
      ishowexit: false,
    })
  },

  closeagain: function () {
    var _this = this
    _this.setData({
      ishowagain: false,
    })
  },

  affirmexit: function () {
    var _this = this
    _this.setData({
      ishowexit: false,
      ishowagain: false,
      ishowaward: false,
      ishowbox: false,
      ishowhalf: true,
      isTry: false,
    })
    _this.stopDraw();
  },

  judgeAgainRoll: function () {
    var _this = this
    if (_this.data.rollchance > 0) {
      _this.setData({
        isagainroll: true,
      })
    } else {
      _this.againroll()
    }
    _this.setData({
      isRecycleMask: false,
    })
  },
  closeJudgeAgainRoll: function () {
    var _this = this
    _this.setData({
      isagainroll: false,
    })
  },

  againroll: function () {
    var _this = this
    wx.showLoading({
      title: '加载中...',
    })

    var q1 = Dec.Aese('mod=blindBox&operation=reRoll&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&order_id=' + _this.data.order_id);

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },

      success: function (res) {
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          _this.setData({
            awardimg: res.data.Info.imgRole,
            awardname: res.data.Info.roleName,
            order_id: res.data.Info.order_id,
            rollchance: res.data.Info.suplusChance,
            ishowagain: false,
            isagainroll: false,
            awardimglist: res.data.Info.descImg != "" ? [res.data.Info.imgRole, res.data.Info.descImg] : [res.data.Info.imgRole],
            awardfront: res.data.Info.imgRole,
            awardback: res.data.Info.descImg != "" ? res.data.Info.descImg : res.data.Info.imgRole,
            isheavyroll: true,
            rollbelater: res.data.Info.imgRole,
          })
          _this.queueup(2, 7)

          _this.setData({
            ischangeagain: true,
          })
          setTimeout(function () {
            _this.setData({
              ischangeagain: false
            })
          }, 2000)

        } else {
          _this.setData({
            ishowaward: false,
            ishowbox: false,
            ishowhalf: true,
            ishowagain: false,
            isagainroll: false,
          })
          _this.stopDraw();
          app.showToastC(res.data.Msg);
        }
      },
      fail: function () {
        wx.hideLoading()
      }
    })
  },

  onShow: function () {
    var _this = this;
    console.log('onShow===============')
    if (_this.data.loginid != '' && _this.data.uid != '' && _this.data.isloadfun) {
      console.log('onshow=================111111')
      _this.getInfo();
    };
    Dec.getdoubleEleven(this, app);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var _this = this
    clearInterval(_this.data.timer)
    clearInterval(_this.data.atimer)
    clearInterval(this.data.countdowntime);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var _this = this
    clearInterval(_this.data.timer)
    clearInterval(_this.data.atimer)
    clearInterval(this.data.countdowntime);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getInfo()
    if (this.data.is_exhibition == 1) {
      this.exhibdatafun(1)
    }
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
      title:_this.data.activity.name || '潮玩社交平台',
      query:{
        'id': _this.data.id,
        'gid':_this.data.gid
      },
      imageUrl:'https://cdn.51chaidan.com/images/blindbox/'+_this.data.activity.id+'.jpg'    
    }
  },
  onShareAppMessage: function () {
    var _this = this
    if (_this.data.ishowpagInfo) {
      var info = _this.data.redpagList[_this.data.redpagind]
      var xilie = _this.data.activity.seriesName != "" ? "-" : ""
      var title = ""
      if(info.welfareType == 1){
        title = "我抽到了" + _this.data.activity.seriesName + xilie + info.roleName + "，隐藏红包送给你们。"
      } else {
        if (info.userId && info.userId != _this.data.uid) {
          title = info.nick + "抽到了" + _this.data.activity.seriesName + xilie + info.roleName + "，幸运值红包送给你们。"
        } else {
          title = "我抽到了" + _this.data.activity.seriesName + xilie + info.roleName + "，幸运值红包送给你们。"
        }
      }
      var share = {
        title: title,
        imageUrl: _this.data.redpagshareimg,
        path: "/pages/smokebox/smokebox?id=" + _this.data.id + '&referee=' + _this.data.uid + '&gid=' + _this.data.gid + '&welfareid=' + _this.data.welfareid + '&isredpag=1',
        success: function (res) {
        }
      }
    } else {
      var share = {
        title: "我正在在线抽盲盒，免费重抽！免费重抽！免费重抽！",
        imageUrl: _this.data.snapshotshare || "https://www.51chaidan.com/images/blindbox/" + _this.data.id + ".jpg",
        path: "/pages/smokebox/smokebox?id=" + _this.data.id + '&referee=' + _this.data.uid + '&gid=' + _this.data.gid + '&welfareid=' + _this.data.welfareid + '&isredpag=0',
        success: function (res) {

        }
      }
    }
    _this.queueup(2, 4)
    return share;
  },
  // 分享图生成
  snapshotsharefun: function () {
    var _this = this;
    wx.getImageInfo({
      src: "https://cdn.51chaidan.com/images/blindbox/" + _this.data.id + ".jpg",
      success: function (res) {

        const ctxt = wx.createCanvasContext('snapshotshare');
        ctxt.drawImage(res.path, 0, 0, 300, 240)

        ctxt.fillStyle = "#FE666B";
        var txtVol = '首单减' + _this.data.firstOrderDiscount + '元';
        var measTxtNum = ctxt.measureText(txtVol).width + 20;

        ctxt.fillRect((300 - measTxtNum) / 2, 0, measTxtNum, 28);
        ctxt.setFontSize(18);
        ctxt.setFillStyle('#fff');
        ctxt.fillText(txtVol, (300 - measTxtNum) / 2 + 10, 21);

        ctxt.draw(true);

        ctxt.draw(true, setTimeout(function () {
          wx.canvasToTempFilePath({
            canvasId: 'snapshotshare',
            success: function (res) {
              _this.setData({
                snapshotshare: res.tempFilePath
              })
            },
            fail: function (res) {},
          });
        }, 300));
      }
    })
  },


  // 导航跳转
  whomepage: function () {
    setTimeout(function () {
      wx.reLaunch({
        url: "/pages/index/index?judgeprof=2"
      });
    }, 100);
  },

  dlfindfun: function () {
    setTimeout(function () {
      wx.reLaunch({
        url: "/page/component/pages/dlfind/dlfind",
      })
    }, 100);
  },

  // 导航跳转 
  wnews: function () {
    var _this = this;
    app.limitlottery(_this);
  },

  wshoppingCart: function () {
    wx.redirectTo({
      url: "/pages/shoppingCart/shoppingCart"
    });
  },

  wmy: function () {
    app.signindata.iftr_mc = true;
    wx.redirectTo({
      url: "/pages/wode/wode"
    });
  },

  // 立即购买弹框
  dsbbbutclickt: function () {
    this.setData({
      tipbacktwo: true,
      buybombsimmediately: true,
      ishowwholebox: false,
    });
    this.queueup(2, 2)
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
    for (var i = 0; i < 3; i++) {
      _this.queueup(2, 5)
    }
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
  amountcalculation: function () {
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
        freightiftr = parseFloat(tdzuncar);
      };
    } else {
      var tdzuncar = this.data.defaultinformation.carriage.d;
      xianshi = '￥0.00';
      freightiftr = parseFloat(tdzuncar);
    };
    this.setData({
      freight: xianshi,
      freightiftr: freightiftr,
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
          if (rdl.length != 0) {
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
  placeorder: function (callback) {
    var _this = this;

    wx.showLoading({
      title: '加载中',
    })

    var id = _this.data.activity.id
    var aid = -1;
    // 提交订单蒙层
    _this.setData({
      suboformola: true,
      payprice: _this.data.activity.shop_price,
      iswholePay: false,
    });
    var q = Dec.Aese('mod=blindBox&operation=order&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + id + '&aid=' + aid + '&desc=' + _this.data.desc + '&isDeduct='+(_this.data.isUseDeduct?1:0));
    console.log('mod=blindBox&operation=order&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + id + '&aid=' + aid + '&desc=' + _this.data.desc + '&isDeduct='+(_this.data.isUseDeduct?1:0))
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          if(_this.data.isUseDeduct){  // 当前选中
            _this.data.thePreviousSelOrder = true;
          }else{
            _this.data.thePreviousSelOrder = false;
          };
          _this.setData({
            suboformola: false,
            cart_id: res.data.Info.cart_id,
            payment: res.data.Info.amount,
            awardimg: res.data.Info.imgRole,
            awardname: res.data.Info.roleName,
            order_id: res.data.Info.order_id,
            cardTip: res.data.Info.cardTip, //提示卡
            cardXRay: res.data.Info.cardXRay, //透视卡
            awardimglist: res.data.Info.descImg != "" ? [res.data.Info.imgRole, res.data.Info.descImg] : [res.data.Info.imgRole],
            awardfront: res.data.Info.imgRole,
            awardback: res.data.Info.descImg != "" ? res.data.Info.descImg : res.data.Info.imgRole,
            isheavyroll: false,
            rollbefore: res.data.Info.imgRole,

            //显示
            ishowbox: true,
            ishowhalf: false,

            isusertip: false,
            isuserray: false,

            isusedWelfare: res.data.Info.isWelfare,
            welfareAmount: parseFloat(res.data.Info.welfareAmount),
            usedamount: parseFloat(res.data.Info.amount),
          });

          _this.queueup(2, 2)

          if(typeof callback == "function") {
            callback();
          }

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

  updateadd: function () {
    var _this = this;
      if(_this.data.isUseDeduct){  // 当前选中
        if(_this.data.thePreviousSelOrder){  // 上一个选中
          _this.updateAddress()
        }else{
          _this.placeorder(function(){
            _this.updateAddress()
          })          
        }
      }else{
        if(_this.data.thePreviousSelOrder){  // 上一个选中
          _this.placeorder(function(){
            _this.updateAddress()
          })          
        }else{
          _this.updateAddress()
        }
      }
  },

  updateAddress(){
    var _this = this;

    // if (this.data.tipaid == '') {
    //   app.showToastC('请选择地址');
    //   return false;
    // };
  
    var orderid = _this.data.order_id;
    var aid = _this.data.tipaid;

    // 提交订单蒙层
    _this.setData({
      suboformola: true
    });
    if (this.data.tipaid != '') {
      var q = Dec.Aese('mod=blindBox&operation=updateAddress&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&order_id=' + orderid + '&aid=' + aid);
      wx.request({
        url: app.signindata.comurl + 'spread.php' + q,
        method: 'GET',
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          if (res.data.ReturnCode == 200) {
            _this.setData({
              tipbacktwo: false,
              buybombsimmediately: false,
              receivingaddress: false,
              iswholePay: false,
            });
            _this.queueup(2, 2)
            _this.paymentmony()
  
          } else {
            // 提交订单蒙层
            _this.setData({suboformola: false});
            app.showToastC(res.data.Msg);
          };
        }
      })
    }else{
      _this.setData({
        tipbacktwo: false,
        buybombsimmediately: false,
        receivingaddress: false,
        iswholePay: false,
      });
      _this.queueup(2, 2)
      _this.paymentmony()
    }
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
          _this.data.isloadfun = false;
          wx.requestPayment({
            'timeStamp': res.data.Info.timeStamp.toString(),
            'nonceStr': res.data.Info.nonceStr,
            'package': res.data.Info.package,
            'signType': 'MD5',
            'paySign': res.data.Info.paySign,
            'success': function (res) {
              setTimeout(function () {
                var cart_id = _this.data.cart_id || '0';
                _this.setData({
                  tipbacktwo: false,
                  buybombsimmediately: false,
                  suboformola: false,
                  ishowsurebuy: false,
                  ishowcard: false,
                  desc: '',
                  isloadfun:false,
                  isDhRecycleBtn:true,
                  dhRecycleCount:60
                });
                if (payinfo.isFreeBuyOrder) {
                  wx.navigateTo({
                    url: "/page/component/pages/hidefun/hidefun?type=1&cart_id=" + _this.data.cart_id
                  });
                } else {
                  app.showToastC('购买成功');
                }

                wx.hideLoading();
                if (_this.data.iswholePay) {
                  _this.getPatchInfo();
                  
                  var wholeBoxGiftInfo = _this.data.wholeBoxGiftInfo || '';
                  if(wholeBoxGiftInfo&&wholeBoxGiftInfo.goods_thumbHidden){
                    _this.setData({
                      ['wholeBoxGiftInfo.goods_thumb']: wholeBoxGiftInfo.goods_thumbHidden,
                      ['wholeBoxGiftInfo.goods_name']: wholeBoxGiftInfo.goods_nameHidden,
                    })
                  }

                } else {

                  // clearInterval(_this.data.timer);
                  
                  // _this.instantopen()
                  

                  _this.ubpackbox()
                  _this.queueup(2, 6,true)

                  // setTimeout(function () {
                  //   _this.getInfo()
                  // }, 3000)
                }
              }, 1000);

            },
            'fail': function (res) {
              _this.setData({
                tipbacktwo: false,
                buybombsimmediately: false,
                suboformola: false,
                ishowsurebuy: false,
                ishowcard: false,
                desc: ''
              }) 
            },
            'complete': function (res) {}
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

  // 时间格式化输出，将时间戳转为 倒计时时间
  dateformat: function (micro_second) {
    var _this = this
    var timestamp = Date.parse(new Date())
    //总的秒数 
    var second = micro_second - (timestamp / 1000);
    if (second > 0) {
      _this.setData({
        remaintime: second,
      })
      if (second == 5 && _this.data.ishowguess) {
        _this.instantopen()
      }
    } else if (second == 0) {
      // console.log('定时器======1111111111111')
      clearInterval(_this.data.timer)
      _this.getInfo()
    }
  },

  changeone: function () {
    var _this = this
    if (_this.data.boxnum < 2) {
      app.showToastC('已经是最后一盒了，不能换了哟');
      return;
    }
    if (_this.data.ischange) {
      return
    }
    if (true) {
      var exh = Dec.Aese('mod=blindBox&operation=changeRole&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id);
      wx.request({
        url: app.signindata.comurl + 'spread.php' + exh,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {
          if (res.data.ReturnCode == 200) {
            _this.placeorder();
          } else {
            app.showToastC(res.data.Msg);
          }
        },
        fail: function () { }
      });
    } else {
      _this.placeorder();
    }

    _this.setData({
      ischange: true,
    })

    setTimeout(function () {
      _this.setData({
        ischange: false,
      })
    }, 2000)

  },

  chancebox: function () {
    var _this = this

    if (_this.data.ischangebox) {
      return
    }

    let ind = _this.data.relAidList.indexOf(_this.data.id);
    var index = 0;
    if (ind != 0) {
      index = ind - 1;
    } else {
      index = _this.data.relAidList.length - 1;
    }

    _this.setData({
      ischangeid: true,
      id: _this.data.relAidList[index]
    })
    _this.getInfo()

  },

  // 计算图片大小
  imageLoadad: function (e) {
    var _this = this;
    var $width = e.detail.width,
      $height = e.detail.height,
      ratio = $width / $height;
    var viewWidth = 360,
      viewHeight = 360 / ratio;
    if (viewHeight > 500) {
      viewWidth = 500 * ratio;
      viewHeight = 500;
    };
    _this.setData({
      iefheight: viewHeight,
      iewidth: viewWidth,
    });
  },

  // 计算图片大小
  imageLoadhide: function (e) {
    var _this = this;
    var $width = e.detail.width,
      $height = e.detail.height,
      ratio = $width / $height;
    var viewHeight = 65,
      viewWidth = 65 * ratio;
    _this.setData({
      hideheight: 65,
      hidewidth: viewWidth,
    });
  },



  havetry: function (w) { // 试一试
    var _this = this

    var isretry = w.currentTarget.dataset.isretry || w.target.dataset.isretry;

    wx.showLoading({
      title: '加载中...',
    })
    var q1 = Dec.Aese('mod=blindBox&operation=try&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&isReTry=' + isretry);

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },

      success: function (res) {
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          _this.setData({
            awardimg: res.data.Info.imgRole,
            awardname: res.data.Info.roleName,
            suplusTry: res.data.Info.suplusTry,
            isReTry: res.data.Info.isReTry,
            awardimglist: res.data.Info.descImg != "" ? [res.data.Info.imgRole, res.data.Info.descImg] : [res.data.Info.imgRole],
            awardfront: res.data.Info.imgRole,
            awardback: res.data.Info.descImg != "" ? res.data.Info.descImg : res.data.Info.imgRole,

          })

          if (isretry == 1) {
            _this.setData({
              ischangeagain: true,
              isheavyroll: true,
              rollbelater: res.data.Info.imgRole,
            })
            setTimeout(function () {
              _this.setData({
                ischangeagain: false
              })
            }, 2000)
          } else {
            _this.setData({
              ishowaward: true,
              isDhRecycleBtn:false,
              ishowhalf: false,
              isTry: true,
              isheavyroll: false,
              rollbefore: res.data.Info.imgRole,
            })
            _this.startDraw();
          }

        } else {
          app.showToastC(res.data.Msg);
        }
      },
      fail: function () {
        wx.hideLoading()
      }
    })
  },

  //立即开启
  instantopen: function () {
    var _this = this

    wx.showLoading({
      title: '加载中',
    })

    var q1 = Dec.Aese('mod=blindBox&operation=finishGuess&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + "&order_id=" + _this.data.order_id + "&type=1");

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },

      success: function (res) {
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          _this.ubpackbox()
          _this.queueup(2, 2)
        }
      },
      fail: function (res) { }
    })
  },

  showhint: function (w) { // 3猜盒  2提示卡 1透视卡 
    var _this = this

    var type = w.currentTarget.dataset.type || w.target.dataset.type;


    if (type == 1) {
      _this.setData({
        hintstr: '透视卡：使用后可直接显示盒内商品（使用后不可发起猜盲盒）\n获取方式：参加免单活动，上传截图有几率获得；分享6名新朋友围观抽盒可获取。',
        ishowhint: false,
        ishareguessbox: false,
        iexpendtip: false,
        iexpendray: true,
        ishowxray: true,
      })
    } else if (type == 2) {
      _this.setData({
        hintstr: '提示卡：提示使用者，盲盒中不是那一款\n获取方式：参加免单活动，上传截图有几率获得。',
        ishowhint: true,
        ishareguessbox: false,
        iexpendtip: true,
        iexpendray: false,
      })
    } else if (type == 3) {
      _this.setData({
        hintstr: '竞猜人数超过20得展示盒×' + _this.data.activity.infoGift.number + '\n',
        ishowhint: true,
        ishareguessbox: true,
        iexpendtip: false,
        iexpendray: false,

      })
    } else if (type == 4) {
      _this.setData({
        hintstr: '透视卡：使用后可直接显示盒内商品（使用后不可发起猜盲盒）\n获取方式：参加猜盒活动，并猜中，获得透视卡。',
        ishowhint: true,
        ishareguessbox: false,
        iexpendtip: false,
        iexpendray: false,
      })
    }
  },

  jumpguessbos: function () {
    var _this = this
    wx.navigateTo({
      url: "/page/component/pages/guessbox/guessbox?id=" + _this.data.id + '&order_id=' + _this.data.order_id,
      complete: function () {
        _this.setData({
          ishowhint: false,
          ishowguess: false,
          ishowhalf: true,
        })
      }
    });

  },

  closehint: function () {
    var _this = this
    _this.setData({
      ishowhint: false,
    })
  },

  usercard: function (w) {
    var _this = this
    wx.showLoading({
      title: '加载中',
      mask:true,
    })

    if (_this.data.activity.aheadUser == 0 && _this.data.activity.isInQueue) {} else {
      app.showToastC("您已不在队列中，请重新排队");
      return;
    }

    var type = w.currentTarget.dataset.type || w.target.dataset.type;
    if (type == "tip" && _this.data.isusertip) {
      app.showToastC("该盲盒只可使用1次提示卡");
      return;
    } else if (type == "XRay" && _this.data.isuserray) {
      app.showToastC("该盲盒只可使用1次透视卡");
      return;
    }

    var q1 = Dec.Aese('mod=blindBox&operation=reduceCard&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + "&order_id=" + _this.data.order_id + "&cardType=" + type);

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },

      success: function (res) { // img      
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          _this.queueup(2, 2)
          if (type == "tip") {
            _this.setData({
              isusertip: true,
              ishowhint: false,
              ishowxray: false,
              cardTip: res.data.Info.cardTip, //提示卡
              cardXRay: res.data.Info.cardXRay, //透视卡
              cardstr: "    " + res.data.Info.tip,
              ishowcard: true,
              istipsure: true,
              cardImg: res.data.Info.tipImg
            })

          } else if (type == "XRay") {
            _this.setData({
              isuserray: true,
              ishowhint: false,
              ishowxray: false,
              cardTip: res.data.Info.cardTip, //提示卡
              cardXRay: res.data.Info.cardXRay, //透视卡
              ishowcard: true,
              israysure: true,
              cardstr: "是     " + res.data.Info.roleName,
              cardImg: res.data.Info.img
            })
            if (_this.data.perspcardata) {
              clearInterval(_this.data.countdowntime);
              _this.setData({
                perspcardata: "",
                perspcardiftrmin: false,
              })
              app.signindata.perspcardata = "";
            };
          }
        } else {
          setTimeout(function () {
            app.showToastC(res.data.Msg);
          }, 500)
        }
      },
      fail: function (res) {
        wx.hideLoading()
      }
    })

  },

  closecard: function () {
    var _this = this
    _this.setData({
      ishowcard: false,
      istipsure: false,
      israysure: false,
    })
  },

  //key(需要检错的键） url（传入的需要分割的url地址）
  getSearchString: function (key, Url) {
    // 获取URL中?之后的字符
    var str = Url;
    var arr = str.split("&");
    var obj = new Object();

    // 将每一个数组元素以=分隔并赋给obj对象 
    for (var i = 0; i < arr.length; i++) {
      var tmp_arr = arr[i].split("=");
      obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
    }
    return obj[key];
  },

  cardImgLoad: function (e) {
    var _this = this;
    var $width = e.detail.width,
      $height = e.detail.height,
      ratio = $width / $height;
    var viewWidth = 150,
      viewHeight = 150 / ratio;
    _this.setData({
      cardimgheight: viewHeight
    });
  },

  showWhole: function () {
    var _this = this
    if (_this.data.isOpenWholeBox) { } else {
      app.showToastC("库存不足");
      return;
    }
    _this.setData({
      payprice: _this.data.activity.shop_price * _this.data.roleList.length,
      iswholePay: true,
      isRepeatOpen: 0,
    })
    _this.dsbbbutclickt();
  },

  closewhole: function () {
    this.setData({
      ishowwholebox: false,
    })
  },

  wholebox: function () {
    var _this = this;

    // if (this.data.tipaid == '') {
    //   app.showToastC('请选择地址');
    //   return false;
    // };

    wx.showLoading({
      title: '加载中',
      mask:true,
    })

    var orderid = _this.data.order_id;
    var aid = _this.data.tipaid?_this.data.tipaid:-1;

    // 提交订单蒙层
    _this.setData({
      suboformola: true,
      iswholePay: true,
    });
    
    var q = Dec.Aese('mod=blindBox&operation=openWholeBox&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&aid=' + aid + '&desc=' + _this.data.desc + '&isRepeatOpen=' + _this.data.isRepeatOpen + '&isDeduct='+(_this.data.isUseDeduct?1:0));
    console.log('mod=blindBox&operation=openWholeBox&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&aid=' + aid + '&desc=' + _this.data.desc + '&isRepeatOpen=' + _this.data.isRepeatOpen + '&isDeduct='+(_this.data.isUseDeduct?1:0))

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        console.log('wholebox=======',res)
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          for (var i = 0; i < res.data.List.role.length; i++) {
            res.data.List.role[i].ishow = false;
          }
          _this.setData({
            suboformola: false,
            wholebox_avtivity_id: res.data.Info.activityId,
            cart_id: res.data.Info.cart_id,
            wholeBoxList: res.data.List.role,
            ishowwholebox: false,
            // ishowWholeBoxList:true,
          });

          if(res.data.Info.wholeBoxGiftInfo&&res.data.Info.wholeBoxGiftInfo.goods_thumb){
            _this.setData({
              ['wholeBoxGiftInfo.goods_thumbHidden']: res.data.Info.wholeBoxGiftInfo.goods_thumb,
              ['wholeBoxGiftInfo.goods_nameHidden']: res.data.Info.wholeBoxGiftInfo.goods_name||''
            })
          };

          

          // 微信支付
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

  closeWholePay: function (w) {

    var mtype = w.currentTarget.dataset.mtype || w.target.dataset.mtype;

    this.setData({
      ishowWholeBoxList: false,
    });
    // 是否是端盒送实物
    if(this.data.whole_boxGift){
      this.collectchip();
    } else if (mtype == "open" && this.data.isRepeatOpenWholeBox) {
      this.setData({
        iswholePay: true,
        isRepeatOpen: 1,
        isRecycleMask:false,
        isRecycleStateA:true
      })
      this.dsbbbutclickt()
    }
    this.setData({
      isRecycleMask:false
    })
  },

  circulationshow: function (u) {
    var _this = this
    var list = _this.data.wholeBoxList;
    setTimeout(function () {
      if (u < list.length) {
        _this.rrrr(u)
        u++;
        _this.circulationshow(u);
      } else {
        _this.setData({
          isAllshow: false,
        })
        return;
      }
    }, 500)
  },

  rrrr: function (i) {
    var _this = this
    var list = _this.data.wholeBoxList;
    list[i].ishow = true;
    _this.setData({
      wholeBoxList: list,
    })
  },

  allShow: function () {
    var _this = this
    var list = _this.data.wholeBoxList;
    for (var i = 0; i < list.length; i++) {
      list[i].ishow = true;
    }
    _this.setData({
      wholeBoxList: list,
      isAllshow: false,
    })
  },

  closexray: function () {
    this.setData({
      ishowxray: false,
    })
  },

  showxray: function (w) {
    var _this = this
    var type = w.currentTarget.dataset.type || w.target.dataset.type || 0;

    wx.showLoading({
      title: '加载中',
    })

    var q = Dec.Aese('mod=blindBox&operation=getShareGroupImg&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id);

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          _this.setData({
            gainXRay: res.data.Info.gainXRay,
            maxXRay: res.data.Info.maxXRay,
            updateOne: res.data.List.shareGroupImg[0] || 0,
            updateTwo: res.data.List.shareGroupImg[1] || 0,
            ishowxray: true,
          })
          if (type == 1) {
            _this.setData({
              ishowxraybtn: true,
            })
          } else {
            _this.setData({
              ishowxraybtn: false,
            })
          }
        } else {
          app.showToastC(res.data.Msg);
        };
      }
    })
  },

  // 上传图片
  upImgSernum: function (w) {
    var _this = this;
    var uploadType = w.currentTarget.dataset.type || w.target.dataset.type || 0;
    var no = w.currentTarget.dataset.no || w.target.dataset.no || 0;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths[0];
        if (uploadType == 0) {
          _this.uploadFile(_this, tempFilePaths, 1, no);
        } else {
          _this.uploadFile(_this, tempFilePaths, 2, no);
        }
      }
    })
  },

  //上传文件
  uploadFile: function (_this, filePath, uploadType, no) {
    var _this = _this;
    wx.showLoading({
      title: '加载中',
    })
    wx.uploadFile({
      url: Dec.comurl() + 'spread.php',
      filePath: filePath,
      name: 'litpic',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: {
        'mod': 'info',
        'operation': 'upload',
        'uid': _this.data.uid,
        'loginid': _this.data.loginid,
        'id': _this.data.id,
        'type': 7,
        'uploadType': uploadType,
        'no': no,
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data) {
          if (res.data == 200) {
            app.showToastC('上传成功');
            _this.refreshupdate();
          } else {
            app.showToastC(res.data);
          }
        };
      },
      fail: function (res) {
        wx.hideLoading()
        app.showToastC('上传失败');
      }
    })
  },

  refreshupdate: function () {
    var _this = this
    var q = Dec.Aese('mod=blindBox&operation=getShareGroupImg&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id);
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          _this.setData({
            gainXRay: res.data.Info.gainXRay,
            maxXRay: res.data.Info.maxXRay,
            updateOne: res.data.List.shareGroupImg[0] || 0,
            updateTwo: res.data.List.shareGroupImg[1] || 0,
            ishowxray: true,
          })
        }
      }
    })
  },
  iftrdetailpageb: function () {
    this.setData({
      iftrdetailpagetwo: false,
      blindBoxdetailpagetwo: false,
      hideBoxdetailpagetwo: false,
      iftrdetailpagehtml: false,
      wholeBGIDetail:false
    });
  },
  iftrdetailpagen: function () {
    if (this.data.iftrdetailpageone) {
      this.setData({
        iftrdetailpagetwo: true,
        iftrdetailpagehtml: true,
      })
    };
  },
  // 赠送实物详情
  wholeBGIDetailfun:function(){
    var _this = this;
    var wholeBoxGiftInfo = this.data.wholeBoxGiftInfo || [];
    if(wholeBoxGiftInfo&&wholeBoxGiftInfo.goods_desc){
        WxParse.wxParse('detail', 'html', wholeBoxGiftInfo.goods_desc, _this, 0);
        this.setData({
          iftrdetailpagetwo: true,
          wholeBGIDetail:true,
          iftrdetailpagehtml: false,
          blindBoxdetailpagetwo:false,
          hideBoxdetailpagetwo:false
        })
    }

  },
  blindBoxdetailpagen: function (w) {
    var ind = w.currentTarget.dataset.ind;
    if (this.data.blindBoxdetailpageone) {
      this.setData({
        iftrdetailpagetwo: true,
        blindBoxdetailpagetwo: true
      })
    } else {
      this.showsivertips(ind);
    };
  },
  hideBoxdetailpagen: function (w) {
    var ind = w.currentTarget.dataset.ind;
    if (this.data.hideBoxdetailpageone) {
      this.setData({
        iftrdetailpagetwo: true,
        hideBoxdetailpagetwo: true
      })
    } else {
      this.showgoldtips(ind);
    };
  },

  pullupsignin: function () {
    // // '没有授权'
    this.setData({
      tgabox: true
    });
  },

  getHideBox: function () {
    var _this = this
    var q = Dec.Aese('mod=blindBox&operation=listHide');
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        // _this.setData({
        //   hideboxList: res.data.List,
        // })
        // var hideboxList = _this.data.hideboxList;
        var hideboxList = res.data.List;
        var swiperhide = [];
        var ishowarrow = false;
        if (hideboxList.length > 15) {
          var len = parseInt(hideboxList.length / 15);
          var mend = 0;
          for (var i = 0; i < len; i++) {
            swiperhide.push(hideboxList.slice(i * 15, (i + 1) * 15));
            if (i == len - 1) {
              swiperhide.push(hideboxList.slice((i + 1) * 15, hideboxList.length));
            }
          }
          ishowarrow = true;
        } else {
          swiperhide.push(hideboxList)
          ishowarrow = false;
        }
        _this.setData({
          swiperhide: swiperhide,
          ishowarrow: ishowarrow,
          patchNumber: res.data.Info.patchNumber
        })

      }
    })
  },

  // 计算图片大小
  imageloadhidebox: function (e) {
    var _this = this;
    var ind = parseInt(e.currentTarget.dataset.ind || e.target.dataset.ind || 0);
    var $width = e.detail.width,
      $height = e.detail.height,
      ratio = $width / $height;
    var viewWidth = 110 * ratio;
    var hideboxList = this.data.hideboxList;

    if (hideboxList[ind]) {
      hideboxList[ind].width = viewWidth;
      _this.setData({
        hideboxList: hideboxList
      })
    };
  },

  // 计算图片大小
  imageloaddebrisitems: function (e) {
    var _this = this;
    var ind = parseInt(e.currentTarget.dataset.ind || e.target.dataset.ind || 0);
    var ind = parseInt(e.currentTarget.dataset.ind || e.target.dataset.ind || 0);
    var $width = e.detail.width,
      $height = e.detail.height,
      ratio = $width / $height;
    var viewwidth = 155;
    var viewheight = 155 / ratio;
    if (viewheight > 230) {
      viewheight = 230;
      viewwidth = 230 * ratio;
    }
    var wholeBoxList = _this.data.wholeBoxList;

    if (wholeBoxList[ind]) {
      wholeBoxList[ind].height = viewheight;
      wholeBoxList[ind].width = viewwidth;
      _this.setData({
        wholeBoxList: wholeBoxList,
        wholeimageheight: wholeBoxList[0].height,
      })
    };
  },

  getPatchInfo: function () {
    var _this = this
    wx.showLoading({
      title: '开盒中,请稍后',
      mask: true,
    })
    _this.setData({
      ishowcollectchip: false
    })
    setTimeout(function () {
      wx.hideLoading();
      _this.setData({
        ishowWholeBoxList: true,
        ishowcollectchip: false,
      })
      _this.circulationshow(0);
    }, 2000);
    var inter = setInterval(function() {
      this.setData({
        dhRecycleCount: this.data.dhRecycleCount - 1
      });
      if (this.data.dhRecycleCount < 0) {
        clearInterval(inter)
        this.setData({
          dhRecycleCount: 60,
          isDhRecycleBtn:false
        });
      }
    }.bind(this), 1000);
  },

  closecollectchip: function () {
    var _this = this
    this.setData({
      ishowcollectchip: !_this.data.ishowcollectchip,
      goldtip: -1,
      sivertip: -1,
    })
  },

  collectchip: function () {
    var _this = this;

    _this.setData({
      payprice: _this.data.activity.shop_price * _this.data.roleList.length,
      iswholePay: true,
      isRepeatOpen: 0,
      ishowcollectchip: false,
    })

    wx.showLoading({
      title: '加载中,请稍后',
      mask: true,
    })
    var q = Dec.Aese('mod=blindBox&operation=getLineData' + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + "&gid=" + _this.data.gid);
    // var q = Dec.Aese('mod=blindBox&operation=getLineData' + '&uid=853' + '&loginid=833fd30ef03cf5510d22fee4a0e4b29c' + '&id=' + _this.data.id + "&gid=" + _this.data.gid);

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log('collectchip========',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          _this.setData({
            whole_boxGift:res.data.Info.whole_boxGift||''
          });
          if(_this.data.whole_boxGift){
            _this.setData({
              wholeBoxGiftInfo: res.data.Info.wholeBoxGiftInfo||''
            });
          }else{
            if (res.data.Info.blindBoxImg && res.data.Info.blindBoxDesc) {
              WxParse.wxParse('blindBox', 'html', res.data.Info.blindBoxDesc, _this, 0);
              _this.setData({
                blindBoxdetailpageone: true,
              });
            } else {
              _this.setData({
                blindBoxdetailpageone: false
              });
            }
  
            if (res.data.Info.hideBoxImg && res.data.Info.hideBoxDesc) {
              WxParse.wxParse('hideBox', 'html', res.data.Info.hideBoxDesc, _this, 0);
              _this.setData({
                hideBoxdetailpageone: true,
              });
            } else {
              _this.setData({
                hideBoxdetailpageone: false
              });
            }
  
            _this.setData({
              tricklinelist: res.data.List.line,
              chiplist: res.data.List.role,
              patchList: res.data.List.patch,
              chiprule: res.data.Info.rule,
              countLine: res.data.Info.countLine,
              hideBoxImg: res.data.Info.hideBoxImg ? res.data.Info.hideBoxImg : "https://www.51chaidan.com/images/blindbox/gold_case.png",
              blindBoxImg: res.data.Info.blindBoxImg ? res.data.Info.blindBoxImg : "https://www.51chaidan.com/images/blindbox/silver_case.png",
              blindboxTip: res.data.Info.blindboxTip ? res.data.Info.blindboxTip : "随机盲盒碎片：收集5片自动合成,可到玩具柜查看",
              hideBoxTip: res.data.Info.hideBoxTip ? res.data.Info.hideBoxTip : "随机隐藏碎片：收集20片自动合成,可到玩具柜查看",
              wholeBoxTitle:res.data.Info.wholeBoxTitle||''
            })
  
            _this.selectData(0);
          }
          _this.setData({
            ishowcollectchip: !_this.data.ishowcollectchip,
          })

        }
      },
      fail: function () {
        wx.hideLoading();
      }
    })

  },
  tabClick: function (w) {
    var _this = this
    var id = w.currentTarget.dataset.id;
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#q' + id).boundingClientRect();
    query.exec(function (res) {
      if (res && res[0] && res[0].width) {
        _this.setData({
          scrollleft: w.currentTarget.offsetLeft - (wx.getSystemInfoSync().windowWidth) / 2 + (res[0].width / 2)
        });
      };
    });
    _this.selectData(id);
  },

  selectData: function (id) {
    var _this = this;
    var tricklinelist = _this.data.tricklinelist;
    var lightRole = tricklinelist[id].lightRole;
    var role = _this.data.chiplist;
    if (tricklinelist && tricklinelist.length > 0) { } else {
      return;
    }
    if (lightRole && lightRole.length > 0) { //将需要点亮的数据加到数组中
      var mMap = new Map();
      for (var i = 0; i < lightRole.length; i++) {
        mMap.set(parseInt(lightRole[i] - 1), lightRole[i]);
      }
      for (var i = 0; i < role.length; i++) {
        if (mMap.has(i)) {
          role[i].islight = true;
        } else {
          role[i].islight = false;
        }
      }
    }

    var rowData = tricklinelist[id].rowData;

    if (rowData && rowData.length > 0) {

    } else {
      return;
    }

    for (var i = 0; i < rowData.length; i++) {
      if (rowData[i].isFinished) {
        rowData[i].img = _this.data.patchList[rowData[i].patchId].img;
      }
    }


    _this.setData({
      chiplist: role,
      rowData: tricklinelist[id].rowData,
      columnData: tricklinelist[id].columnData,
      iselected: id,
    })

    var chipList = _this.data.chiplist;

    if (chipList.length == 8 || chipList.length == 12 || chipList.length == 7 || chipList.length == 11 || chipList.length == 4||chipList.length == 18) {
      _this.setData({
        chiplinenum: 4,
      })
    } else if (chipList.length == 9 || chipList.length == 6 || chipList.length == 5 || chipList.length == 3) {
      _this.setData({
        chiplinenum: 3,
      })
    } else if (chipList.length == 10 || chipList.length == 13 || chipList.length == 14 || chipList.length == 15) {
      _this.setData({
        chiplinenum: 5,
      })
    }

    _this.setData({
      chipItemWidth: (420 / _this.data.chiplinenum) - 4,
      chiprownum: Math.ceil(chipList.length / _this.data.chiplinenum),
    })

  },

  // 计算图片大小
  imageLoadchip: function (e) {
    var _this = this;
    var $width = e.detail.width,
      $height = e.detail.height,
      ratio = $width / $height;
    var viewWidth = _this.data.chipItemWidth,
      viewHeight = viewWidth / ratio;

    _this.setData({
      chipItemHeight: viewHeight,
      nogetimagewidth: viewWidth > viewHeight ? viewHeight : viewWidth,
    });
  },

  showchiprule: function () {
    var _this = this
    _this.setData({
      ishowcollectrule: !_this.data.ishowcollectrule,
    })
  },

  showgoldtips: function (ind) {
    var _this = this;

    if (ind == _this.data.goldtip) {
      this.setData({
        goldtip: -1,
      })
    } else {
      this.setData({
        goldtip: ind,
      })
    }
  },

  showsivertips: function (ind) {
    var _this = this;
    if (ind == _this.data.sivertip) {
      this.setData({
        sivertip: -1,
      })
    } else {
      this.setData({
        sivertip: ind,
      })
    }
  },

  agreeset: function () {
    var _this = this;
    _this.setData({
      ishowdeal: false,
      ishowadd: true,
    })
  },

  closedealoradd: function () {
    var _this = this;
    if (!_this.data.ishowdealoradd) {
      _this.setData({
        ishowdealoradd: true,
      })
    } else {
      if (_this.data.ishowadd) {
        _this.setData({
          ishowdeal: true,
          ishowadd: false,
        })
      } else {
        _this.setData({
          ishowdealoradd: false,
        })
      }
    }
  },

  showdealoradd: function () {
    var _this = this;
    _this.setData({
      ishowdealoradd: !_this.data.ishowdealoradd,
    })
  },

  // 跳转增加新地址
  jumpaddress: function () {
    var _this = this;
    wx.navigateTo({
      url: "/pages/newreceivingaddress/newreceivingaddress"
    })
  },

  selectdefult: function (w) {
    var _this = this;
    var ind = w.currentTarget.dataset.ind;
    var addressdata = _this.data.addressdata;
    for (var i = 0; i < addressdata.length; i++) {
      if (i != ind) {
        addressdata[i].checked = false;
      }
    }
    if (!addressdata[ind].checked) {
      addressdata[ind].checked = !addressdata[ind].checked;
      _this.setData({
        addressdata: addressdata,
        maddid: addressdata[ind].aid,
      })
    } else {
      addressdata[ind].checked = !addressdata[ind].checked;
      _this.setData({
        addressdata: addressdata,
        maddid: '',
      })
    }

  },

  setdefultadd: function () {
    var _this = this;
    //  调取收货地址
    var q = Dec.Aese('mod=address&operation=setBlindBoxDefaultAddress&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + _this.data.maddid)

    wx.request({
      url: app.signindata.comurl + 'user.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            ishowdealoradd: false,
            isBlindBoxDefaultAddress: true,
            ishowcover: false,
          })
          app.signindata.isBlindBoxDefaultAddress = true;
          _this.nextpagediao();
        }
      }
    });
  },

  hidepackage: function () {
    var _this = this;
    if (!_this.data.ishowredpackage) {
      _this.setData({
        redpagList: _this.data.welfare,
      })
    }
    _this.setData({
      ishowredpackage: !_this.data.ishowredpackage,
      isharepag: false,
    })
  },

  openpackage: function (w) {
    var _this = this;
    var id = w.currentTarget.dataset.mid;
    var isget = w.currentTarget.dataset.isget;
    var samount = w.currentTarget.dataset.samount;
    var ind = w.currentTarget.dataset.ind;
    _this.drawredpagshare(ind)
    if (!isget || (samount && samount == 0)) {
      _this.openredpackage(id)
      _this.setData({
        welfareid: id,
        redpagind: ind,
      })
    } else {
      _this.redpagInfo(id)
      _this.setData({
        welfareid: id,
        redpagind: ind,
      })
    }

  },

  openredpackage: function (welfareId) {
    var _this = this;
    wx.showLoading({
      title: '开启中...',
    })
    
    if(_this.data.pmc){
      console.log('_this.data.pmc========',_this.data.pmc)
      _this.data.pmc = false;
      var q = Dec.Aese('mod=blindBox&operation=receiveWelfare&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&welfareId=' + welfareId)
      wx.request({
        url: app.signindata.comurl + 'spread.php' + q,
        method: 'GET',
        header: {'Accept': 'application/json'},
        success: function (res) {
          wx.hideLoading()
          _this.data.pmc = true;
          if (res.data.ReturnCode == 200) {
            app.showToastC('领取成功');
            _this.redpagInfo(welfareId)
          } else {
            app.showToastC(res.data.Msg);
            _this.setData({
              ishowredpackage: false,
            })
          }
        }
      });
    }

  },

  redpagInfo: function (welfareId) {
    var _this = this
    wx.showLoading({
      title: '加载中...',
    })
    var q = Dec.Aese('mod=blindBox&operation=getWelfareDetail&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&welfareId=' + welfareId)

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          _this.setData({
            ishowredpackage: false,
            ishowpagInfo: true,
            welfareInfo: res.data.Info.welfare,
            welfareList: res.data.List.welfare,
          })
        } else {
          app.showToastC(res.data.Msg);
        }
      }
    });
  },

  closepagInfo: function () {
    var _this = this
    _this.setData({
      ishowpagInfo: false,
    })
  },

  shareopen: function (welfareId) {
    var _this = this;

    var q = Dec.Aese('mod=blindBox&operation=getWelfareInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&welfareId=' + welfareId)

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          _this.setData({
            redpagList: res.data.Info.welfare || [],
            ishowredpackage: true,
            isharepag: true,
          })
        } else {
          app.showToastC(res.data.Msg);
        }
      }
    });
  },

  showsurebuy: function () {
    var _this = this
    _this.setData({
      ishowsurebuy: !_this.data.ishowsurebuy,
    })
  },

  drawredpagshare: function (ind) {
    var _this = this
    var info = _this.data.redpagList[ind]
    wx.getImageInfo({
      src: "https://www.51chaidan.com/images/blindBox/halfPackage.jpg",
      success: function (res) {
        const ctxt = wx.createCanvasContext('redpagshare');
        ctxt.drawImage(res.path, 0, 0, 300, 240)
        wx.getImageInfo({
          src: info.roleImg,
          success: function (res) {
            var radio = res.width / res.height;
            var width = 80 * radio;
            if(width>110){
              var widthOther = 60 * radio;
              ctxt.drawImage(res.path, 25, 25, widthOther, 60)
            }else{
              ctxt.drawImage(res.path, 25, 25, width, 80)
            };
            
            ctxt.setFontSize(25);
            ctxt.setFillStyle('#f0ca97');
            if (info.welfareType == 1) {
              ctxt.fillText("隐藏红包", 165, 60);
              ctxt.fillText(parseInt(info.limitAmount) + "元", 177, 90);
              ctxt.fillText("隐藏红包", 165, 60.5);
              ctxt.fillText(parseInt(info.limitAmount) + "元", 177.5, 90);
            } else {
              ctxt.fillText("幸运值红包", 145, 60);
              ctxt.fillText(parseInt(info.limitAmount) + "点", 170, 90);
              ctxt.fillText("幸运值红包", 145, 60.5);
              ctxt.fillText(parseInt(info.limitAmount) + "点", 170.5, 90);
            }
            ctxt.draw(true, setTimeout(function () {
              wx.canvasToTempFilePath({
                canvasId: 'redpagshare',
                success: function (res) {
                  _this.setData({
                    redpagshareimg: res.tempFilePath
                  })
                },
                fail: function (res) {},
              });
            }, 300));

          }
        })

      }
    })
  },

  mmm: function () {

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
    var exh = Dec.Aese('mod=show&operation=brandDetail&brandId=' + _this.data.brandId + '&page=' + _this.data.exhpage + '&gid=' + _this.data.gid + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + exh,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh()
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
        } else {
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
            app.showToastC(res.data.Msg)
          }
        },
        fail: function () { }
      });
    }
  },

  addfrindcommonifun: function (w) {
    var _this = this;
    var url = w.currentTarget.dataset.url || w.target.dataset.url || 0;
    var name = w.currentTarget.dataset.name || w.target.dataset.name || 0;
    if (url && url != "") {
      this.setData({
        showimg: url != "" ? url : "https://cdn.51chaidan.com/images/act/1577083808.jpg",
        addfrindcommoni: !this.data.addfrindcommoni
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

  // 保存图片
  sharesavethepicture: function () {
    var _this = this;
    var imgSrc = '';
    wx.getImageInfo({
      src: _this.data.showimg || '',
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
                  _this.setData({
                    addfrindcommoni: false
                  });
                },
                fail(res) {
                  app.showToastC('保存失败');
                  _this.setData({
                    addfrindcommoni: false
                  });
                }
              })
            }
          }
        });
      }
    })
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
      _this.sharesavethepicture();
    }
  },

  gobrandDetails: function (w) {
    var mid = w.currentTarget.dataset.mid || w.target.dataset.mid || 0;
    var settlement = this.data.is_exhibition;
    wx.navigateTo({
      url: "/page/secondpackge/pages/brandDetails/brandDetails?id=" + mid + "&settlement="+settlement,
    });
  },
  // 拉起订阅
  subscrfun: function () {
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

  exchange: function () {
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    var exh = Dec.Aese('mod=blindBox&operation=exchangeLuckyValue&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
    wx.request({
      url: app.signindata.comurl + 'spread.php' + exh,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          _this.setData({
            cardXRay: res.data.Info.user.cardXRay,
            blindBoxLucky: res.data.Info.user.blindBoxLucky,
            exchangeLuckyCondition: res.data.Info.user.exchangeLuckyCondition,
          })
          app.showToastC('兑换成功');
        } else {
          app.showToastC(res.data.Msg);
        };
      },
      fail: function () { }
    });
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
  exhibitionpubjump(w){
    var type = w.currentTarget.dataset.type || w.target.dataset.type || '';
    var jumpid = w.currentTarget.dataset.id || w.target.dataset.id || '';
    app.exhibitionpubjump(type, jumpid)   
    var clouddata = { type:15 ,adv_id: jumpid};
    app.cloudstatistics('advertisingStat', clouddata) 
  },
  toggleRecyclerule(){
    this.setData({
      isrecyclerule:!this.data.isrecyclerule
    })
  },
  toggleBlindBoxAmount(){
    this.setData({
      isUseDeduct:!this.data.isUseDeduct
    })
  },
  getBlindBoxAmount(){
    if (this.data.iswholePay) {
      this.setData({isSingle:false})
    }else{
      this.setData({isSingle:true})
    }
    this.setData({
      isRecycleMask:true
    })
  },
  closeRecycleMask(){
    this.setData({
      isRecycleMask:false
    })
  },
  confirmGetBlindBoxAmount(){
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    var exh = Dec.Aese('mod=blindBox&operation=recycle&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&cart_id=' + _this.data.cart_id);
    console.log('mod=blindBox&operation=recycle&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&cart_id=' + _this.data.cart_id)
    wx.request({
      url: app.signindata.comurl + 'spread.php' + exh,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          _this.setData({
            isRecycleStateA: false,
            isDhRecycleBtn:false
          })
          _this.getInfo(false);
        } else {
          app.showToastC(res.data.Msg);
        };
      },
      fail: function () { }
    });
  }
})