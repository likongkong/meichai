// page/component/pages/limitlottery/limitlottery.js
var Dec = require('../../../../common/public.js'); //aes加密解密js
var WxParse = require('../../../../wxParse/wxParse.js');
var time = require('../../../../utils/util.js');
var Pub = require('../../common/mPublic.js'); //aes加密解密js
var api = require("../../../../utils/api.js");
import Poster from '../../../../pages/wxa_plugin_canvas/poster/poster';
const app = getApp();
Page({
  /**
   * 页面的初始数据 
   */
  data: {
    newdataexh:Date.parse(new Date())/1000<1588175999?true:false,
    //接口地址
    comurl: app.signindata.comurl,

    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,
    avatarUrl: app.signindata.avatarUrl,
    isProduce: app.signindata.isProduce,
    // 适配苹果X
    isIphoneX: app.signindata.isIphoneX,
    defaultinformation: '',

    dayStr: 0,
    hrStr: "00",
    minStr: "00",
    secStr: "00",

    list: [1, 1, 1, 1, 1, 1],
    id: 0,
    infoActivity: "",
    infoGoods: "",
    winnerLotto: "",
    reLottoList:'', // 补抽列表
    btntext: "",

    // 口令
    redpinputdata: '',
    redpinputdataiftr: false,
    actimgshare: false,
    imgtype: 0,
    upserimgboxWinningtheprize: false,

    payprice: 0,
    tipbacktwo: false,
    buybombsimmediately: false,
    receivingaddress: false,
    pricedetailc: false,
    freight: "",
    tipaid: "",
    addressdata: "",
    tipaddress: "",
    desc: '',
    cart_id: '',
    isgetaward: false,

    bottomtop: 0,
    ishowsusp: false,

    c_title: '限定抽签',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,

    activityMD: '',
    ishowAction: false,

    isNewer: false,

    iscoupon: false,

    newcoupondata: [],

    isonshow: false,
    pushWay: 0,

    snapshotlim: "",

    updateOne: 0,
    updateTwo: 0,
    gainShareGroupLotto: 0,
    maxShareGroupLotto: 0,
    ishowxray: false,

    windowHeight: app.signindata.windowHeight - 65 - wx.getStorageSync('statusBarHeightMc') || 0,
    signinlayer: false,
    is_share: false,

    chiplist: [],

    shareUserInfo: [],

    limit: ["h", "d", "t", "e", "e", "f"],

    awardstatus: 0,

    chipwidth: 0,

    linenum: 0,

    share_id: 0,

    ishowgetchip: false,

    ranking: 0,

    chipsonwidth: 0,

    boxwidth: 0,

    subscribedata: "",
    limsaveiftr: false,
    saveimgurl: '',
    // 是否是展会
    is_exhibition: 0,
    timedata: [],
    addfrindcommoni: false,
    exhpage: 0,
    exhdata: [],
    exhbanner: [],
    exhibdetail: true,
    brandId: '',
    userbranddata: '',
    saveimgurlfrpb: '',
    perayu:0, // 0正常分享  1朋友圈
    brightNumber:0,
    // 判断是ios 还是android
    iftriosorand:app.signindata.iftriosorand || true,
    shareFriendBox:false,
    shFrBxBo:false,
    shFrBxTo:false,
    iscashpledge:false,
    payMask:false,
    // 判断是否能分享
    is_share_but:true,
    // 太阳码参数 用户是否能分享 1 可以分享 
    canShare:0,
    addsetData:[[]],
    scrollTopPage:0,
    isfullPledge:false,
    promote_start_date:false,
    // 是否订阅
    subscribeOrNot:false,
    // 刮刮卡入口
    isScrapingCard:false,
    // 是否从列表进入
    isList:0,
    listTipImg:false,
    ordinaryTicketUser:false,
    twoAffirmBox:false,
    lottoid:0,
    isPopNum:0,
    appNowTime: Date.parse(new Date())/1000,
    commonBulletFrame:false,
    comBulFraNun:0, // 1 为好友助力 2 报名成功  3 身份信息  4 未中签 中签
    helpTipFitst:true,
    refreshGetin:true,
    showPicturesImg:false,
    showimg:'',
    BrandConcernTip:false,
    isPreview:'',   //isPreview=1为预览，默认''
    SignUpOrSubscribe:1, // 1 订阅 2 报名 
  },
  BrandConcernTipFun(){
    this.setData({
      BrandConcernTip:false
    })
  },
  // 抽签规则
  drawRuleJump(){
    app.comjumpwxnav(9050,1,'','')
  },
  // 身份信息
  identityFun(){
    var idName = {};
    
    idName.idcard = time.plusXing(this.data.infoActivity.signIdCard,4,4);
    idName.name = time.plusXing(this.data.infoActivity.signName,1,0);
     this.setData({
      idName:idName
     })
     this.commonBulletFrameFun(3)
  },
  // 好友助力
  friendHelp(){
    var _this = this;
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    var exh = Dec.Aese('mod=lottoV2&operation=friendHelp&gid=' + _this.data.gid+ '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id+ '&share_uid=' + _this.data.share_id);
    console.log('mod=lottoV2&operation=friendHelp&gid=' + _this.data.gid+ '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id+ '&share_uid=' + _this.data.share_id)
    wx.request({
      url: app.signindata.comurl + 'spread.php' + exh,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('助力===========',res)
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
           _this.setData({
             ['helpInfo.status']:1
           })
        } else {
          wx.showModal({
            content: res.data.Msg || res.data.msg || '',
            showCancel: false,
            success: function (res) {}
          })
          _this.setData({
            commonBulletFrame:false
          })
        };
      },
      fail: function () { }
    });
  },
  commonBulletFrameFun(num=0){
     this.setData({
        comBulFraNun:num,
        commonBulletFrame:!this.data.commonBulletFrame
     })
  },
  // new中间名单
  jumpWinningList(w){
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    var type = w.currentTarget.dataset.type || w.target.dataset.type || 0;
    wx.navigateTo({
        url: "/page/settled/pages/LimWinningList/LimWinningList?id="+id+'&type='+type
    });
  },
  // 跳转刮刮卡
  jumpScrapingCard(){
    app.comjumpwxnav(9023,'','','')
  },
  onPageScroll: function (ev) {
    var _this = this;
    //当滚动的top值最大或最小时，为什么要做这一步是因为在手机实测小程序的时候会发生滚动条回弹，所以为了处理回弹，设置默认最大最小值
    if (ev.scrollTop <= 0) {
      ev.scrollTop = 0;
    } else if (ev.scrollTop > wx.getSystemInfoSync().windowHeight) {
      ev.scrollTop = wx.getSystemInfoSync().windowHeight;
    };
    
    //给scrollTop重新赋值
    setTimeout(function () {
      _this.setData({
        scrollTopPage: ev.scrollTop
      })
    }, 0)
  },
  sharefriend:function(){
     this.setData({
      shareFriendBox:!this.data.shareFriendBox,
      shFrBxBo:true,
      shFrBxTo:false
     })
  },
  shFrBxToFun:function(){
    this.setData({
      shFrBxBo:false,
      shFrBxTo:true
     })   
  },
  subshowmodalfun: function () {
    var _this = this;
    wx.showModal({
      title: '提示',
      content: _this.data.subscribeCouponTip|| '订阅成功,开售前通过微信发送提醒',
      showCancel: false,
      success: function (res) {
        _this.setData({
          subscribeCouponTip: '',
          isSubscribeCoupon: false
        })
      }
    })
  },
  FollowSubscription(){
    this.setData({
      BrandConcernTip:true,
      SignUpOrSubscribe:1
    })
  },
  // 拉起订阅
  subscrfun: function (num) {
    var _this = this;
    var subscribedata = _this.data.subscribedata || '';
    var infoActivity = _this.data.infoActivity || {};
    if (subscribedata && subscribedata.template_id && app.signindata.subscribeif) {
      if (subscribedata.template_id instanceof Array) {
        wx.requestSubscribeMessage({
          tmplIds: subscribedata.template_id || [],
          success(res) {
            var is_show_modal = true;
            for (var i = 0; i < subscribedata.template_id.length; i++) {
              if (res[subscribedata.template_id[i]] == "accept") {
                if(num == 1){
                  _this.data.id = infoActivity.goods_id || '';
                }else{
                  _this.data.id = infoActivity.id || '';
                };
                app.subscribefun(_this, 0, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
                if (is_show_modal) {
                  _this.subshowmodalfun();
                  is_show_modal = false;
                  if(_this.data.promote_start_date){
                    _this.setData({
                      subscribeOrNot:true
                    })
                  };
                };
              };
            };

            _this.data.id = infoActivity.id || '';
            
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
  ishowtipsfun:function(){ 
    var _this = this;
    wx.showModal({
      content: _this.data.infoActivity.toyShowTips || '抽选卡:展会抽盒机、展会限时购、展会福袋任意消费可获得抽选卡x1',
      showCancel: false,
      success: function (res) {}
    })
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
    app.jumpexhdetail(mtype,id,brandid);
  },
  // 展会公共跳转
  exhibitionpubjump: function (w) {
    var type = w.currentTarget.dataset.type || w.target.dataset.type || '';
    var jumpid = w.currentTarget.dataset.id || w.target.dataset.id || '';
    app.exhibitionpubjump(type, jumpid)
    var clouddata = { type:15 ,adv_id: jumpid};
    app.cloudstatistics('advertisingStat', clouddata)

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
  imgCanelTgexh: function () {
    this.setData({
      exhpicsave: false,
      addfrindcommoni: false
    });
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
  addfrindcommonifun1: function (w) {
    var _this = this;
    var url = w.currentTarget.dataset.url || w.target.dataset.url || 0;
    if (url && url != "") {
      this.setData({
        showimg: url != "" ? url : "https://cdn.51chaidan.com/images/act/1577083808.jpg",
        addfrindcommoni: !this.data.addfrindcommoni
      });
    } else {
      app.showToastC((_this.data.brandinfo.brandName || '') + '未提供此方式');
    }
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
      app.showToastC(name +'未提供此方式');
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
  closegetchip: function () {
    var _this = this;
    _this.setData({
      ishowgetchip: !_this.data.ishowgetchip,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    app.signindata.suap = 20;
    console.log('options========',options)

    if(options.isPreview == 1){   //预览
      let previewData = {
        isPreview:options.isPreview,
        setGoodsStatusData:options
      }
      this.setData({ 
        isPreview:options.isPreview,
        setGoodsStatusData:options,
        previewData
      });
    }
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      console.log('options========',scene,)
      app.signindata.referee = _this.getSearchString('referee', scene) || 0;
      app.signindata.activity_id = _this.getSearchString('id', scene) || 0;
      _this.data.id = _this.getSearchString('id', scene) || 0;
      _this.data.gid = _this.getSearchString('gid', scene) || 0;
      // 用户是否能分享
      _this.data.canShare = _this.getSearchString('canShare', scene) || 0;
      // 是否从列表进入
      _this.data.isList = _this.getSearchString('list', scene) || 0;
      this.setData({
        share_id: _this.getSearchString('referee', scene) || 0,
        canShare:_this.getSearchString('canShare', scene) || 0
      })
    } else {
      console.log(2)
      app.signindata.referee = options.referee || 0;
      app.signindata.activity_id = options.id || 0;

      _this.data.id = options.id || 0;
      _this.data.gid = options.gid || 0;
      _this.data.canShare = options.canShare || 0;
      // 是否是朋友圈进入
      _this.data.perayu = options.perayu || 0;
      // 是否从列表进入
      _this.data.isList = options.list || 0;

      this.setData({
        share_id: options.referee || 0,
        brandId:options.brandId||'',
        canShare:options.canShare || 0
      })
    };

    console.log('isList========',_this.data.isList)

    // 推送统计
    _this.data.push_id = options.push_id || 0;

    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.data.isNewer = app.signindata.isNewer;
    var saveimgurl = 'https://www.51chaidan.com/images/lot/' + _this.data.id + '.jpg'
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      avatarUrl: app.signindata.avatarUrl,
      saveimgurl: saveimgurl,
    });

    _this.data.pushWay = options.pushWay || 0;
    // 单独商家分享
    wx.hideShareMenu();

    wx.showLoading({
      title: '加载中...'
    })

    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      _this.onLoadfun();
    }else{
        // '已经授权'
        _this.data.loginid = app.signindata.loginid;
        _this.data.openid = app.signindata.openid;
        _this.data.isNewer = app.signindata.isNewer;
        _this.setData({
          signinlayer: true,
          uid: app.signindata.uid,
          avatarUrl: app.signindata.avatarUrl,
          isProduce: app.signindata.isProduce,
        });
        // 判断是否登录
        if (_this.data.loginid != '' && _this.data.uid != '') {
          _this.onLoadfun();
        } else {
          app.signin(_this)
        }
    };

  },

  onLoadfun: function () {
    var _this = this
    wx.hideLoading()

    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.data.isNewer = app.signindata.isNewer;

    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      avatarUrl: app.signindata.avatarUrl,
      defaultinformation:app.signindata.defaultinformation,
      iftriosorand:app.signindata.iftriosorand
    });

    _this.getinfo();

    // if (_this.data.share_id != 0) {
    //   _this.joinDraw(_this.data.share_id);
    // }

    setTimeout(function () {
      _this.getdefault()
    }, 1000)
    // 生成图片商品数据
    if (app.signindata.activityblindbox) {
      _this.data.activityblindbox = app.signindata.activityblindbox;
    } else {
      app.activityblindboxfun(_this);
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

  getdefault: function () {
    // 调取晒单数量
    var _this = this;

    if(this.data.defaultinformation){}else{
      app.defaultinfofun(this);
    };
    // 统计推送进入
    if (_this.data.pushWay > 0) {
      app.pushfun(_this);
    }
  },

  getinfo: function () {
    var _this = this
    wx.showLoading({
      title: '加载中...',
      mask:true
    })

    var q1 = Dec.Aese('mod=lottoV2&operation=info&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&share_uid=' + _this.data.share_id + '&gid=' + _this.data.gid + '&push_id='+_this.data.push_id+'&isPreview='+this.data.isPreview);

    console.log('mod=lotto&operation=info&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id +  '&share_uid=' + _this.data.share_id + '&gid=' + _this.data.gid + '&push_id='+_this.data.push_id+'&isPreview='+this.data.isPreview)
    clearInterval(_this.data.timer);
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh();
        _this.data.push_id =  0;
        console.log('详情接口===',res)
        if (res.data.ReturnCode == 200) {
            
            _this.setData({
              appNowTime: Date.parse(new Date())/1000,
            })
            if(res.data.Info.goods && res.data.Info.goods.goodsDesc){
                res.data.Info.goods.goodsDesc = decodeURIComponent(res.data.Info.goods.goodsDesc.replace(/\+/g, ' '));
                WxParse.wxParse('article', 'html', res.data.Info.goods.goodsDesc, _this, 0);
            };
            var infoActivity = res.data.Info.activity;
            var listData = res.data.List; 
            var dataInfo = res.data.Info; 
           
            if(infoActivity.status == 1){
              infoActivity.start_time = time.toDate(infoActivity.startTime,2);
                //将时间传如 调用 
                _this.dateformat(infoActivity.startTime);
            }else if(infoActivity.status == 2){
              infoActivity.stop_time = time.toDate(infoActivity.stopTime,2);
                //将时间传如 调用 
                _this.dateformat(infoActivity.stopTime);
            }else if(infoActivity.status == 3){
              infoActivity.finalPay_time = time.toDate(infoActivity.finalPayTime,2);
              // 支付倒计时
              if(!infoActivity.isReceived && _this.data.appNowTime < infoActivity.finalPayTime && infoActivity.isWinner){
                  _this.dateformat(infoActivity.finalPayTime);
              };
            };
            
            console.log('时间=====',_this.data.appNowTime < infoActivity.finalPayTime,_this.data.appNowTime , infoActivity.finalPayTime)

            // 支付定金报名成功添加提示框
            if(_this.data.infoActivity && !_this.data.infoActivity.isSign && _this.data.is_payment && infoActivity.activitySignMothed == 'payTicket'){
              _this.setData({
                  lottoSucc:listData.lotto[0].lotto || ''
              });
              _this.data.is_payment = false;
              _this.commonBulletFrameFun(2)
            };
            // 是否中签弹框提示
            console.log(_this.data.appNowTime , infoActivity.finalPayTime)
            if(infoActivity.status == 3 && infoActivity.isSign &&  _this.data.appNowTime < infoActivity.finalPayTime){
              if(infoActivity.isWinner){
                if(!infoActivity.isReceived){
                    _this.commonBulletFrameFun(4);
                };
              }else{
                console.log(1111111)
                _this.commonBulletFrameFun(4);
              };

            };

            infoActivity.introduce = decodeURI(infoActivity.introduce)


            _this.setData({
                dataInfo,
                infoActivity:infoActivity,
                brandinfo:res.data.Info.brandInfo || '',
                listData:listData,
                subscribedata: res.data.Info.subscribe.lotto || '',
                cashPledge:infoActivity.cashPledge||0,
                cart_id: infoActivity.cartId || '',
                id:infoActivity.id || 0,
            });

            if(_this.data.tipaid){}else{_this.addressCom();}
            // 是否能分享
            if(infoActivity.isCanShare || infoActivity.isAdmin){
              wx.showShareMenu({
                menus:['shareAppMessage','shareTimeline'],
                withShareTicket:true
              });
            }else{
              console.log(infoActivity.isCanShare,infoActivity.isAdmin,'不能分享')
              wx.hideShareMenu();
              _this.setData({
                  is_share_but:false
              })
            }
            // if(!infoActivity.isCanShare && _this.data.canShare!=1 && _this.data.isList != 1){
            //   wx.hideShareMenu();
            //   _this.setData({
            //     is_share_but:false
            //   })
            //     // if(!_this.data.share_id){
            //     //     _this.toogleGuidanceMask();
            //     // };
            // }else{
            //     wx.showShareMenu({
            //       withShareTicket:true
            //     });
            // };
            // 助力
            var helpInfo = res.data.Info.helpInfo || ""
            if(helpInfo && helpInfo.status !=3 && _this.data.helpTipFitst){
                _this.setData({
                    helpInfo:helpInfo,
                    helpTipFitst:false
                });
                _this.commonBulletFrameFun(1)
            }
            // _this.setData({
            //   is_ordinary_ticket_user: res.data.Info.is_ordinary_ticket_user,
            //   promote_start_date:promote_start_date,
            //   reLottoList:res.data.List.reLottoList || '',
            //   // is_brand_display:is_brand_display,
            //   activityDesc: res.data.Info.activityDesc || "",
            //   brandRule: res.data.Info.infoActivity.brandRule || "",
            //   shareStatus: res.data.Info.shareStatus || "",
            //   activityMD: res.data.Info.activityMD || "",
            //   infoActivity: res.data.Info.infoActivity,
            //   is_exhibition: res.data.Info.infoActivity ? res.data.Info.infoActivity.specialWay||'' : '',
            //   brandId:brandid ,
            //   infoFragment: res.data.Info.infoFragment,
            //   chiplist: chiplist,
            //   shareUserInfo: shareUserInfo,
            //   chipwidth: 600 / infoFragment.totalFragmentNumber,
            //   linenum: infoFragment.totalFragmentNumber / 2,
            //   infoGoods: res.data.Info.infoGoods,
            //   winnerUnclaimedLotto: res.data.List.winnerUnclaimedLotto || "",
            //   payprice: res.data.Info.infoGoods.shop_price || 0,
            //   subscribedata: res.data.Info.subscribe || '',
            //   id:res.data.Info.infoActivity.id||0,
            //   cashPledge:res.data.Info.cashPledge||0,
            // })



        }else{
          wx.showModal({
            content: res.data.Msg || '',
            showCancel: false,
            success: function (res) {}
          })
        };



      },

      fail: function (res) {
        wx.stopPullDownRefresh();
        wx.hideLoading()
      }

    })
    
    return false
    var q1 = Dec.Aese('mod=lotto&operation=info&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&isNewer=' + _this.data.isNewer + '&gid=' + _this.data.gid + '&push_id='+_this.data.push_id);
    console.log('抽签详情请求===','mod=lotto&operation=info&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&isNewer=' + _this.data.isNewer + '&gid=' + _this.data.gid + '&push_id='+_this.data.push_id)
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        _this.data.push_id =  0;
        console.log('详情接口===',res)
        wx.stopPullDownRefresh();
        wx.stopPullDownRefresh()
        if (res.data.ReturnCode == 200) {
          wx.hideLoading()
          app.signindata.isNewer = false;
          _this.data.isNewer = false;
          _this.data.isonshow = true;

          if(res.data.Info.infoGoods && res.data.Info.infoGoods.goods_desc){
              res.data.Info.infoGoods.goods_desc = decodeURIComponent(res.data.Info.infoGoods.goods_desc.replace(/\+/g, ' '));
              WxParse.wxParse('article', 'html', res.data.Info.infoGoods.goods_desc, _this, 0);
          };
          
          
          clearInterval(_this.data.timer)


          if(res.data.Info.infoActivity.is_limit==1){

          }else{
            if (res.data.Info.infoActivity.status == 1) {
              _this.data.timer = setInterval(function () {
                //将时间传如 调用 
                _this.dateformat(res.data.Info.infoActivity.start_time);
              }.bind(_this), 1000);
              if(res.data.Info.infoActivity.isLiveShow){
                res.data.Info.infoActivity.isLiveShow_time = time.toDate(res.data.Info.infoActivity.start_time,1);
              };
            }
            if (res.data.Info.infoActivity.status == 2) {
              _this.data.timer = setInterval(function () {
                //将时间传如 调用 
                _this.dateformat(res.data.Info.infoActivity.stop_time);
              }.bind(_this), 1000);
            }
          };


          if (res.data.Info.infoActivity.status == 3) {

            if (res.data.Info.infoActivity.isWinner) {
              if (res.data.Info.infoActivity.isOrdered) {
                _this.setData({
                  btntext: "已领取成功",
                  awardstatus: 1,
                })
              } else if (res.data.Info.infoActivity.nextPay) { // 直接吊起预支付
                _this.setData({
                  btntext: "直接购买",
                  cart_id: res.data.Info.infoActivity.cart_id,
                  awardstatus: 2,
                })
                _this.data.timer = setInterval(function () {
                  //将时间传如 调用 
                  _this.dateformat(res.data.Info.infoActivity.overtime);
                }.bind(_this), 1000);
              } else if (res.data.Info.infoActivity.nextOrder) { // 中奖了
                if(_this.data.isPopNum == 0){
                  wx.showModal({
                    title: '',
                    content: '恭喜，您已中签',
                    showCancel:false,
                    confirmText:'知道了',
                    success (res) {
                    }
                  })
                  _this.setData({
                    isPopNum: 1
                  })
                }
                _this.setData({
                  awardstatus: 2,
                  isgetaward:true
                })
                _this.data.timer = setInterval(function () {
                  //将时间传如 调用 
                  _this.dateformat(res.data.Info.infoActivity.overtime);
                }.bind(_this), 1000);
              } else {
                _this.setData({
                  btntext: "未领取，已过期",
                  awardstatus: 3,
                })
                if (res.data.Info.infoActivity.isFillChance) {
                  _this.data.timer = setInterval(function () {
                    //将时间传如 调用 
                    _this.dateformat(res.data.Info.infoActivity.refreshTime);
                  }.bind(_this), 1000);
                }
              }
            } else {
              if(res.data.Info.infoFragment && res.data.Info.infoFragment.activitySignNumber && res.data.Info.infoFragment.activitySignNumber.length > 0){
                if(_this.data.isPopNum == 0){
                  wx.showModal({
                    title: '',
                    content: '很遗憾，您未中签',
                    showCancel:false,
                    confirmText:'知道了',
                    success (res) {
                    }
                  })
                  _this.setData({
                    isPopNum: 1
                  })
                }
              };
              _this.setData({
                btntext: "没有中奖,再接再厉",
                awardstatus: 4,
              })
              if (res.data.Info.infoActivity.isFillChance) {
                _this.data.timer = setInterval(function () {
                  //将时间传如 调用 
                  _this.dateformat(res.data.Info.infoActivity.refreshTime);
                }.bind(_this), 1000);
              }
            }

          }

          var infoFragment = res.data.Info.infoFragment;
          var chiplist = [];
          var shareUserInfo = infoFragment.shareUserInfo;
          res.data.Info.infoFragment.personalFragmentNumber = parseInt(infoFragment.personalFragmentNumber);

          if (infoFragment.totalFragmentNumber && infoFragment.totalFragmentNumber > 0) {
            for (var i = 0; i < infoFragment.totalFragmentNumber; i++) {
              if (i < infoFragment.personalFragmentNumber) {
                chiplist.push(1);
              } else {
                chiplist.push(2);
              }
            }

            for (var i = infoFragment.shareUserInfo.length; i < infoFragment.totalFragmentNumber; i++) {
              shareUserInfo.push(1);
            }
          }

          console.log(chiplist)

          if (res.data.Info.infoActivity.joinMothed == "blindBox" && !res.data.Info.infoActivity.isCanOpenLotto) {
            wx.hideShareMenu();
          } else {
            wx.showShareMenu({
              withShareTicket:true
            });
            wx.showShareMenu();
          }

          // res.data.List.ShareUser && res.data.List.ShareUser.indexOf(_this.data.uid) == -1
          if(res.data.Info.infoActivity.detail == 1 && _this.data.canShare!=1 && _this.data.isList != 1){
            console.log('detail == 1','不能分享')
            wx.hideShareMenu();
            _this.setData({
              is_share_but:false
            })
          };
          
          // 云统计
          var clouddata = { act_id: _this.data.id, type: res.data.Info.infoActivity.specialWay || 0 }
          app.cloudstatistics('activityStatistics', clouddata )

          
          if(_this.data.brandId&&_this.data.brandId!=0){
            console.log(1,_this.data.brandId)
             var brandid = _this.data.brandId||'';
             res.data.Info.infoActivity.brandId = brandid;
          }else{
            console.log(2)
            var brandid = res.data.Info.infoActivity ? res.data.Info.infoActivity.brandId||'' : '';
          };

          // var is_brand_display = false;
          // if(brandid&&brandid>0){
          //   res.data.Info.infoActivity.specialWay = 1;
          //   // 不是展会 但是是品牌
          //   is_brand_display = true;
          // }

          console.log('res.data.Info.infoActivity.specialWay=====',res.data.Info.infoActivity.specialWay)
          
          var promote_start_date = false;
          if(res.data.Info.infoGoods && res.data.Info.infoGoods.promote_start_date){
            var timestamp = Date.parse(new Date()) / 1000; 
            if(res.data.Info.infoGoods.promote_start_date > timestamp){
              promote_start_date = true;
            };
          };

          _this.setData({
            is_ordinary_ticket_user: res.data.Info.is_ordinary_ticket_user,
            promote_start_date:promote_start_date,
            reLottoList:res.data.List.reLottoList || '',
            // is_brand_display:is_brand_display,
            activityDesc: res.data.Info.activityDesc || "",
            brandRule: res.data.Info.infoActivity.brandRule || "",
            shareStatus: res.data.Info.shareStatus || "",
            activityMD: res.data.Info.activityMD || "",
            infoActivity: res.data.Info.infoActivity,
            is_exhibition: res.data.Info.infoActivity ? res.data.Info.infoActivity.specialWay||'' : '',
            brandId:brandid ,
            infoFragment: res.data.Info.infoFragment,
            chiplist: chiplist,
            shareUserInfo: shareUserInfo,
            chipwidth: 600 / infoFragment.totalFragmentNumber,
            linenum: infoFragment.totalFragmentNumber / 2,
            infoGoods: res.data.Info.infoGoods,
            winnerLotto: res.data.List.winnerLotto || "",
            winnerUnclaimedLotto: res.data.List.winnerUnclaimedLotto || "",
            payprice: res.data.Info.infoGoods.shop_price || 0,
            subscribedata: res.data.Info.subscribe || '',
            id:res.data.Info.infoActivity.id||0,
            cashPledge:res.data.Info.cashPledge||0,
          })

          if(res.data.Info.is_ordinary_ticket_user!=undefined&&res.data.Info.is_ordinary_ticket_user){
            _this.setData({
              paypriceCashPledge:parseFloat(res.data.Info.infoGoods.shop_price || 0).toFixed(2)
            })
          }else{
            _this.setData({
              paypriceCashPledge:parseFloat((res.data.Info.infoGoods.shop_price || 0)-(res.data.Info.cashPledge||0)).toFixed(2)
            })
          }

          console.log(_this.data.is_ordinary_ticket_user,'是否是普票用户')


          // 是否调取展会数据
          if (res.data.Info.infoActivity && res.data.Info.infoActivity.specialWay && res.data.Info.infoActivity.specialWay == 1||(res.data.Info.infoActivity.specialWay != 1&&brandid>0)) {
            _this.exhibdatafun(1)
            app.livebroadcast(_this, res.data.Info.infoActivity.brandId)  // 直播数据
          }
          //创建节点选择器
          var box = wx.createSelectorQuery();
          //选择id
          box.select('#chipfather').boundingClientRect();
          box.exec(function (res) {
            if (res && res[0]) {
              _this.setData({
                boxwidth: (res[0].width / _this.data.linenum - 2),
              })
            };
          })
          //创建节点选择器
          var mchip = wx.createSelectorQuery();
          //选择id
          mchip.select('#mchip').boundingClientRect();
          mchip.exec(function (res) {
            if (res && res[0]) {
              _this.setData({
                chipwidth: res[0].width / infoFragment.totalFragmentNumber>=40?40:res[0].width / infoFragment.totalFragmentNumber,
              })
              console.log(_this.data.chipwidth)
            };
          })


          if (res.data.Info.coupon.infoCoupon && res.data.Info.coupon.infoCoupon.length > 0) {
            _this.setData({
              iscoupon: true,
              newcoupondata: res.data.Info.coupon.infoCoupon || "",
              couponOverTime: res.data.Info.coupon.couponOverTime || "",
            })
          }

          setTimeout(function () {
            if (res.data.Info.infoActivity.status == 3 && res.data.Info.infoActivity.isWinner && !res.data.Info.infoActivity.isOrdered) {
              _this.addressCom();
            }
            // && res.data.Info.infoActivity.payTicketCate && res.data.Info.infoActivity.payTicketCate == 'fullPledge'
            if(res.data.Info.infoActivity.joinMothed == 'payTicket' || (res.data.Info.is_ordinary_ticket_user!=undefined&&res.data.Info.is_ordinary_ticket_user)){
              _this.addressCom();
            } 
            
          }, 1000)

        }else{
          wx.showModal({
            content: res.data.Msg || '',
            showCancel: false,
            success: function (res) {}
          })
        }

      },

      fail: function (res) {
        wx.stopPullDownRefresh();
        wx.hideLoading()
      }

    })
  },
  addressCom:function(){
      var _this = this;
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
        _this.nextpagediao()
      };
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
    console.log('mod=show&operation=brandDetail&brandId=' + _this.data.brandId + '&page=' + _this.data.exhpage + '&gid=' + _this.data.gid+ '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid+'&dataType='+_this.data.is_exhibition)
    var exh = Dec.Aese('mod=show&operation=brandDetail&brandId=' + _this.data.brandId + '&page=' + _this.data.exhpage + '&gid=' + _this.data.gid+ '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid+'&dataType='+_this.data.is_exhibition);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + exh,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('展会品牌==================',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh()
        if (res.data.ReturnCode == 200) {
          if (num == 1) {
            var brand = res.data.Info.brand || '';
            var list = res.data.List.activity || '';
            for (var r = 0; r < list.length; r++) {
              if(_this.data.newdataexh){
                list[r].start_time = '暂未';
                list[r].stop_time = time.toDate(list[r].stop_time);
              }else{
                list[r].start_time = time.toDate(list[r].start_time);
                list[r].stop_time = time.toDate(list[r].stop_time);
              }

            };
            brand.bradDesc = brand.bradDesc.split('hc').join('\n');
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
  listTipImg(){
    this.setData({listTipImg:!this.data.listTipImg});
  },
  // 更新用户信息
  getUserProfileComSign(w){
    console.log(1111111)
    var _this = this;
    app.getUserProfile((res,userInfo) => {
        if(_this.data.brandinfo && !_this.data.brandinfo.isAttention){
            _this.setData({
              BrandConcernTip:true,
              SignUpOrSubscribe:2
            })
        }else{
            _this.joinlimitlottery()
        };
    },'',1);
  },
  BrandConcernJoin(){
    var _this = this;
    var id = _this.data.brandinfo.brandId || 0;
    var type = 0;
    console.log('mod=community&operation=likeAttention&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&setType=' + type + '&id=' + id)
    var qqq = Dec.Aese('mod=community&operation=likeAttention&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&setType=' + type + '&id=' + id);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        console.log('关注=====',res)
        if (res.data.ReturnCode == 200) {
          app.showToastC('关注成功');
          _this.setData({
            [`brandinfo.isAttention`]: !_this.data.brandinfo.isAttention,
            BrandConcernTip:false
          })
          if(_this.data.SignUpOrSubscribe == 1){
            _this.subscrfun(2);            
          }else{
            _this.joinlimitlottery()
          };
        };
      }
    });
  },
  joinlimitlottery: function () {
    if(app.signindata.isNeedUserInfo){
      app.getUserProfile((res,userInfo) => {
        this.data.avatarUrl=userInfo.avatarUrl;
        this.data.nickName=userInfo.nickName;
        app.signindata.isNeedUserInfo = false; 
        this.joinlimitlotteryFun();
      })
    }else{
      this.joinlimitlotteryFun();
    }
  },
  joinlimitlotteryFun(){
    var _this = this;
    _this.newJoinDraw()
    
  },


  plusXing (str,frontLen,endLen) {
    var len = str.length-frontLen-endLen;
    var xing = '';
    for (var i=0;i<len;i++) {
    xing+='*';
    }
    return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
  },

  ticketList(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=lotto&operation=showOrdinaryTicketInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
    console.log('普票列表请求======'+'mod=bind&operation=verifyVipTicket&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log('普票列表======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          var ticketList = res.data.List.ticketList;
          for(var i=0;i<ticketList.length;i++){
            for(var j=0;j<ticketList[i].length;j++){
              res.data.List.ticketList[i][j].consignee =  _this.plusXing(res.data.List.ticketList[i][j].consignee,1,0)
              res.data.List.ticketList[i][j].idcard =  _this.plusXing(res.data.List.ticketList[i][j].idcard,4,5)
              res.data.List.ticketList[i][j].tel =  _this.plusXing(res.data.List.ticketList[i][j].tel,3,3)
            }
          }
          _this.setData({
            ordinaryTicketUser:true,
            ticketListDate:res.data.List.ticketList
          })
        }else{
          wx.showToast({
            title: res.data.Msg,
            icon: 'none',
            mask:true,
            duration:2000
          });  
        }
      }
    }); 
  },
  hideOrdinaryTicketUser(){
    this.setData({
      ordinaryTicketUser:false
    })
  },
  twoAffirm(e){
    this.setData({
      twoAffirmBox:true,
      ticketorderid:e.currentTarget.dataset.orderid,
      ticketindex:e.currentTarget.dataset.index,
      ticketsonindex:e.currentTarget.dataset.sonindex,
    })
  },
  // 不检验
  vipOrOrdercancel(){
    this.setData({
      twoAffirmBox:false
    })
  },
  
  // 新报名
  newJoinDraw(){
    var _this = this;

    // 群内分享  在列表进去禁止报名
    if(!_this.data.infoActivity.isCanShare && !_this.data.share_id){
      _this.toogleGuidanceMask();
      return false
    };

    console.log(_this.data.infoActivity.awardType)

    if(_this.data.infoActivity.awardType != 'normal'){
      let tipaid = 0;
      var q1 = Dec.Aese('mod=lottoV2&operation=joinDraw&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id +'&aid='+tipaid + '&share_uid=' + _this.data.share_id);
      console.log('参与抽签','mod=lottoV2&operation=joinDraw&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id +'&aid='+tipaid + '&share_uid=' + _this.data.share_id)
      this.setData({isfullPledge: false})
    }else{
      if(this.data.isfullPledge){
        let tipaid = _this.data.tipaid;
        var q1 = Dec.Aese('mod=lottoV2&operation=joinDraw&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id +'&aid='+tipaid + '&share_uid=' + _this.data.share_id);
        console.log('参与抽签','mod=lottoV2&operation=joinDraw&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id +'&aid='+tipaid + '&share_uid=' + _this.data.share_id)
        this.setData({isfullPledge: false})
      }else{
        this.setData({
          receivingaddress:true
        })
        return false;
      }
    }

    wx.showLoading({
      title: '加载中...',
      mask:true
    })  
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log('报名抽签==========',res)
        if (res.data.ReturnCode == 200) {
          if(res.data.Info && res.data.Info.activity && res.data.Info.activity.lotto[0]){
            _this.setData({
                lottoSucc:res.data.Info.activity.lotto
            });
          };

          _this.commonBulletFrameFun(2);
          _this.getinfo();

          var subscribedata = res.data.Info.subscribe || '';
          _this.data.subscribedata = subscribedata;
          if (app.signindata.subscribeif && subscribedata && subscribedata.template_id) {
            if (subscribedata.template_id instanceof Array) {
              wx.requestSubscribeMessage({
                tmplIds: subscribedata.template_id || [],
                success(res) {
                  for (var i = 0; i < subscribedata.template_id.length; i++) {
                    if (res[subscribedata.template_id[i]] == "accept") {
                      app.subscribefun(_this, 0, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
                    };
                  };
                }
              })
            } else {
              wx.requestSubscribeMessage({
                tmplIds: [subscribedata.template_id || ''],
                success(res) {
                  if (res[subscribedata.template_id] == "accept") {
                    app.subscribefun(_this, 0, subscribedata.template_id, subscribedata.subscribe_type);
                  };
                },
                complete() { }
              })
            };
          };

        } else if (res.data.ReturnCode == 358){
          _this.setData({
            payMask: true,
            cart_id: res.data.Info.order.cart_id
          })
        } else {
          if(res.data.ReturnCode != 300){
            if(res.data.Msg){
              wx.showModal({
                content: res.data.Msg || '',
                showCancel: false,
                success: function (res) {}
              })              
            }
          };
        }
      },
      complete:function(){
        wx.hideLoading()
      }
    })
  },
  // joinDraw: function (share_uid) {
  //   var _this = this;
  //   // && this.data.infoActivity.payTicketCate == 'fullPledge'
  //   if(this.data.infoActivity.joinMothed == 'payTicket'){
  //     console.log(1)
  //     if(this.data.isfullPledge){
  //       var q1 = Dec.Aese('mod=lotto&operation=joinDraw&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&share_uid=' + share_uid+'&perayu='+_this.data.perayu+'&aid='+this.data.tipaid);
  //       console.log('参与抽签','mod=lotto&operation=joinDraw&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&share_uid=' + share_uid+'&perayu='+_this.data.perayu+'&aid='+this.data.tipaid)
  //       this.setData({isfullPledge: false})
  //     }else{
  //       this.setData({
  //         receivingaddress:true
  //       })
  //       return false;
  //     }
  //   }else{
  //     console.log(2)
  //     var q1 = Dec.Aese('mod=lotto&operation=joinDraw&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&share_uid=' + share_uid+'&perayu='+_this.data.perayu);
  //     console.log('参与抽签','mod=lotto&operation=joinDraw&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&share_uid=' + share_uid+'&perayu='+_this.data.perayu)
  //   }
  //   wx.showLoading({
  //     title: '加载中...',
  //     mask:true
  //   })

  //   wx.request({
  //     url: app.signindata.comurl + 'spread.php' + q1,
  //     method: 'GET',
  //     header: {
  //       'Accept': 'application/json'
  //     },
  //     success: function (res) {
  //       console.log('参与抽签数据=====================',res)
  //       if (res.data.ReturnCode == 200) {
  //         _this.getinfo();
  //         if (share_uid != 0) {
 
  //           _this.setData({
  //             // ishowgetchip: !_this.data.ishowgetchip,
  //             ranking: res.data.Info.ranking,
  //             brightNumber:res.data.Info.brightNumber
  //           })

  //           setTimeout(function () {
  //             //创建节点选择器
  //             var box = wx.createSelectorQuery();
  //             //选择id
  //             box.select('#chipson').boundingClientRect();
  //             box.exec(function (res) {
  //               if (res && res[0]) {
  //                 _this.setData({
  //                   chipsonwidth: (res[0].width / _this.data.linenum - 2),
  //                 })
  //               };
  //             })
  //           }, 1000)
  //         }

  //         var subscribedata = res.data.Info.subscribe || '';
  //         _this.data.subscribedata = subscribedata;
  //         if (app.signindata.subscribeif && subscribedata && subscribedata.template_id) {
  //           if (subscribedata.template_id instanceof Array) {
  //             wx.requestSubscribeMessage({
  //               tmplIds: subscribedata.template_id || [],
  //               success(res) {
  //                 for (var i = 0; i < subscribedata.template_id.length; i++) {
  //                   if (res[subscribedata.template_id[i]] == "accept") {
  //                     app.subscribefun(_this, 0, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
  //                   };
  //                 };
  //               }
  //             })
  //           } else {
  //             wx.requestSubscribeMessage({
  //               tmplIds: [subscribedata.template_id || ''],
  //               success(res) {
  //                 if (res[subscribedata.template_id] == "accept") {
  //                   app.subscribefun(_this, 0, subscribedata.template_id, subscribedata.subscribe_type);
  //                 };
  //               },
  //               complete() { }
  //             })
  //           };
  //         };

  //       } else if (res.data.ReturnCode == 358){
  //         _this.setData({
  //           payMask: true,
  //           cart_id: res.data.Info.cart_id
  //         })
  //       } else {
  //         if(res.data.ReturnCode != 300){
  //           if(res.data.Msg){
  //             wx.showModal({
  //               content: res.data.Msg || '',
  //               showCancel: false,
  //               success: function (res) {}
  //             })              
  //           }
  //         };
  //       }
  //     },
  //     complete:function(){
  //       wx.hideLoading()
  //     }
  //   })

  // },
  // 领取红包封面
  showRedPackage(e){
    wx.showRedPackage({
      url:e.currentTarget.dataset.key,
      success: (res) => {
       }
    })
  },
  // 红包口令 input 值改变
  redpinputChange: function (e) {
    this.setData({
      redpinputdata: e.detail.value
    });
  },

  redpinputdataiftr: function () {
    this.setData({
      redpinputdataiftr: !this.data.redpinputdataiftr,
      redpinputdata: ''
    })
  },

  closeAction: function () {
    this.setData({
      ishowAction: false,
    })
  },

  itemclick: function (w) {
    var _this = this
    var type = w.currentTarget.dataset.type;
    if (type == 1) {
      _this.redpinputdataiftr()
    } else if (type == 2) {
      _this.generatePictures()
      // _this.getimg()
    } else if (type == 6) {
      _this.activityMD()
    } else if (type == 5 && !_this.data.infoActivity.isTodayShare) {
      app.showToastC("今日已完成，每天都可以推荐获得抽签，去完成其他任务吧");
    } else if (type == 7) {
      _this.showxray()
    }
  },


  getword: function () {
    var _this = this
    wx.showLoading({
      title: '加载中...',
    })
    var q1 = Dec.Aese('mod=lotto&operation=command&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.infoActivity.id + '&command=' + _this.data.redpinputdata);
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },

      success: function (res) {
        wx.stopPullDownRefresh();
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          _this.getinfo()
          _this.setData({
            redpinputdataiftr: false,
          })
          app.showToastC("激活成功");
        } else {
          wx.showModal({
            content: res.data.Msg || '',
            showCancel: false,
            success: function (res) {}
          })
        }
      },

      fail: function (res) {
        wx.hideLoading()
      }

    })
  },

  moreaction: function () {
    app.comjumpwxnav(989,'','');
  },

  /**
   * 生成截图
   */
  sharePictures(){

  },
  onShow: function () {
    if (this.data.isonshow) {
      this.getinfo()
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    // 调用重置刷新
    app.resetdownRefresh();
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 调用重置刷新
    app.resetdownRefresh();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    app.downRefreshFun(() => {
      this.getinfo();
      if (this.data.is_exhibition == 1) {
        this.exhibdatafun(1)
      } else {
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh()
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
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
    _this.setData({
      shareFriendBox:false,
      showPictures:false
    })
    return {
      title:_this.data.infoActivity.name,
      query:'id='+_this.data.infoActivity.id+'&gid='+_this.data.gid+ '&referee=' + _this.data.uid+'&perayu=1&list='+_this.data.isList,

      // query:{
      //   'id': _this.data.infoActivity.id,
      //   'gid':_this.data.gid
      // },
      imageUrl:_this.data.infoActivity.cover 
    }
  },
  onShareAppMessage: function () {
    var _this = this;
    _this.setData({
      shareFriendBox:false
    })

    var urlpath = "/page/component/pages/limitlottery/limitlottery?id=" + _this.data.infoActivity.id + '&referee=' + _this.data.uid + '&gid=' + _this.data.gid + '&list='+_this.data.isList;
    var share = {
      title:'【抽选】'+_this.data.infoActivity.name,
      imageUrl: _this.data.infoActivity.cover,
      path:urlpath ,
      success: function (res) {}
    }
    if (_this.data.infoActivity.isTodayShare) {
      _this.sharerequest()
    }
    return share;
  },

  sharerequest: function () {
    var _this = this
    var q1 = Dec.Aese('mod=lotto&operation=share&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.infoActivity.id);
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.showModal({
          content: res.data.Msg || '',
          showCancel: false,
          success: function (res) {}
        })
      },

      fail: function (res) {
        wx.hideLoading()

      }

    })
  },



  // 导航跳转
  whomepage: function () {
    app.comjumpwxnav(998,'','');
  },

  dlfindfun: function () {
    app.comjumpwxnav(993,'','');
  },

  // 导航跳转 
  wnews: function () {
    var _this = this;
    app.limitlottery(_this);
  },

  wshoppingCart: function () {
    app.comjumpwxnav(9058, '', '');
  },

  wmy: function () {
    app.signindata.iftr_mc = true;
    app.comjumpwxnav(9059,'','');
  },

  // 时间格式化输出，将时间戳转为 倒计时时间
  dateformat: function (micro_second) {
    var _this = this;
    clearInterval(_this.data.timer);
    _this.data.timer = setInterval(function () {
      var timestamp = Date.parse(new Date())
      //总的秒数 
      var second = micro_second - (timestamp / 1000);
  
  
  
      if (second > 0) {
        // 天位    
        var day = Math.floor(second / 3600 / 24);
        var dayStr = day.toString();
        if (dayStr.length == 1) dayStr = '0' + dayStr;
  
        // 小时位 
        var hr = Math.floor(second / 3600 % 24);
        // var hr = Math.floor(second / 3600); //直接转为小时 没有天 超过1天为24小时以上
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
          //   return hrStr + ":" + minStr + ":" + secStr;
          _this.setData({
            dayStr: 0,
            hrStr: hrStr,
            minStr: minStr,
            secStr: secStr,
          })
        } else {
          _this.setData({
            dayStr: dayStr,
            hrStr: hrStr,
            minStr: minStr,
            secStr: secStr,
          })
          //   return dayStr + "天" + hrStr + ":" + minStr + ":" + secStr;
        }
      } else {
        _this.setData({
          dayStr: 0,
          hrStr: "00",
          minStr: "00",
          secStr: "00",
        })
        clearInterval(_this.data.timer);
        if(_this.data.refreshGetin){
            _this.data.refreshGetin = false;
            setTimeout(function(){
              _this.getinfo();
            },1000)
        };
      }
    }.bind(_this), 1000);

    

  },
  // 更新用户信息
  getUserProfileCom(w){
    var _this = this;
    console.log(1111111)
    app.getUserProfile((res,userInfo) => {
        _this.winnerlogic(w)
    },'',1);
  },

  winnerlogic: function (e) {
    var _this = this;
    this.data.lottoid = e.currentTarget.dataset.lottoid;
    var infoActivity = _this.data.infoActivity
    console.log(111)
    if (infoActivity.isWinner) {
      if(_this.data.infoActivity.cartId){
        _this.data.cart_id = _this.data.infoActivity.cartId || ''
        // 微信支付
        _this.paymentmony();
        _this.setData({
          commonBulletFrame:false
        })
      }else{
        _this.getGoodsPay();
      };
      
      // if (infoActivity.isOrdered) { //购买完成
      // } else if (infoActivity.nextPay) { // 直接吊起预支付
      //   // 微信支付
      //   _this.paymentmony()
      // } else if (infoActivity.nextOrder) { // 中奖了
      //   _this.dsbbbutclickt()
      // } else { }
    } else { //没有中奖,再接再厉
      // if(_this.data.is_ordinary_ticket_user){
      //   _this.dsbbbutclickt()
      // }
    }
  },
  // 领取商品并支付
  getGoodsPay(){
    var _this = this;


    if(this.data.isfullPledge){
      var q = Dec.Aese('mod=lottoV2&operation=getGoods&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&aid='+this.data.tipaid);
      this.setData({isfullPledge: false,commonBulletFrame:false})
    }else{
      this.setData({
        receivingaddress:true,
        commonBulletFrame:false
      })
      return false;
    };

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log('领取商品===',res)
        if (res.data.ReturnCode == 200) {
            _this.data.cart_id = res.data.Info.cart_id || ''
            // 微信支付
            _this.paymentmony()
        }else{
          app.showToastC(res.data.Msg || res.data.msg || '');
        };

      }
    });
  },
  // 立即购买弹框
  dsbbbutclickt: function () {
    this.setData({
      tipbacktwo: true,
      buybombsimmediately: true
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
      receivingaddress: true
    });
  },

  // 隐藏收货地址弹框
  receivingaddressfun: function () {
    this.setData({
      receivingaddress: false
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
    var idctrue = event.target.dataset.idctrue || event.currentTarget.dataset.idctrue || false;
    if(idctrue){
      wx.showModal({
        content:'该抽选需要实名制参加，请填写身份证号码',
        success: function (res) {
          if(res.confirm){
            wx.navigateTo({
              url: "/pages/shippingAddress/shippingAddress?lim=1&aid=" + aid + '&address=' + address + '&city=' + city + '&consignee=' + consignee + '&district=' + district + '&idcard=' + idcard + '&phone=' + phone + '&province=' + province
            })
          }
        }
      })
    }else{
      wx.navigateTo({
        url: "/pages/shippingAddress/shippingAddress?aid=" + aid + '&address=' + address + '&city=' + city + '&consignee=' + consignee + '&district=' + district + '&idcard=' + idcard + '&phone=' + phone + '&province=' + province
      })
    }

  },

  // 跳转增加新地址
  jumpaddress: function () {
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
    var acc = 0;
    var xianshi = '0.00';
    var freightiftr = '0.00';
    // 商品个数
    var mcnum = parseInt((_this.data.rednum + _this.data.bluenum));
    if ((this.data.defaultinformation.carriage.free || "99") != '-1') {
      var tddefcarfr = parseFloat(this.data.defaultinformation.carriage.free || "99");
      if (mcnum >= parseFloat(this.data.defaultinformation.carriage.freeMCPieces)) {
        if (this.data.defaultinformation.carriage.freeMCPieces == 1) {
          acc = 0;
          freightiftr = 0;
          xianshi = '限时包邮';
        } else {
          acc = 0;
          freightiftr = 0;
          xianshi = '商品包邮';
        };
      } else if (_this.data.payprice >= tddefcarfr) {
        acc = 0;
        freightiftr = 0;
        xianshi = '满￥' + parseFloat(this.data.defaultinformation.carriage.free || "99").toFixed(2) + '包邮';
      } else {
        if (this.data.infoGoods.carriage !== '') {
          var tdzuncar = this.data.infoGoods.carriage;
        } else {
          var tdzuncar = this.data.defaultinformation.carriage.d;
        };
        xianshi = '￥' + parseFloat(tdzuncar).toFixed(2);
        freightiftr = parseFloat(tdzuncar);
        acc = parseFloat(tdzuncar) > parseFloat(this.data.coudata1mon) ? parseFloat(this.data.infoGoods.carriage) - parseFloat(this.data.coudata1mon) : 0;
      };
    } else {
      if (this.data.infoGoods.carriage !== '') {
        var tdzuncar = this.data.infoGoods.carriage;
      } else {
        var tdzuncar = this.data.defaultinformation.carriage.d;
      };
      xianshi = '￥0.00';
      freightiftr = parseFloat(tdzuncar);
      acc = parseFloat(tdzuncar) > parseFloat(this.data.coudata1mon) ? parseFloat(this.data.infoGoods.carriage) - parseFloat(this.data.coudata1mon) : 0;
    };

    this.setData({

      // 运费
      // freight: acc,
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
        console.log('收货地址===',res)
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
                app.signindata.receivingAddress = dat;
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
    //  && this.data.infoActivity.payTicketCate == 'fullPledge'
    this.setData({
      isfullPledge:true
    });
    if(this.data.infoActivity.isWinner){
        this.getGoodsPay();
    }else{
        this.newJoinDraw(0);
    };
    
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
    // if (this.data.tipaid == '') {
    //   app.showToastC('请选择地址');
    //   return false;
    // };

    var id = _this.data.infoActivity.id
    var aid = _this.data.tipaid;
    // 提交订单蒙层
    _this.setData({
      suboformola: true
    });

    var q = Dec.Aese('mod=lotto&operation=order&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + id + '&aid=' + aid + '&desc=' + _this.data.desc + '&ticket_id=' + _this.data.lottoid);

    console.log('提交订单==','mod=lotto&operation=order&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + id + '&aid=' + aid + '&desc=' + _this.data.desc + '&ticket_id=' + _this.data.lottoid)

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log('提交订单结果==',res)
        if (res.data.ReturnCode == 200) {
          _this.setData({
            tipbacktwo: true,
            buybombsimmediately: true,
            receivingaddress: false,
            cart_id: res.data.Info.cart_id,
          });
          // 微信支付
          _this.paymentmony()
        } else {
          if(res.data.ReturnCode == 900){
            app.showModalC(res.data.Msg);
            _this.getinfo()
          }else{
            // 提交订单蒙层
            _this.setData({
              suboformola: false
            });
            app.showToastC(res.data.Msg);            
          }

        };
      }
    })
  },



  // 微信支付
  paymentmony: function (e) {
    var _this = this;
    var q = Dec.Aese('mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + _this.data.cart_id + '&xcx=1' + '&openid=' + _this.data.openid)
    wx.showLoading({ title: '加载中...', mask:true})
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
              wx.hideLoading(); 
              _this.setData({
                payMask:false,
                tipbacktwo: false,
                buybombsimmediately: false,
                suboformola: false,
                desc: '',
                lottoSucc: '',
              });


              _this.data.is_payment = true;
              _this.getinfo()
              

            },
            'fail': function (res) {
              _this.setData({
                tipbacktwo: false,
                buybombsimmediately: false,
                suboformola: false,
                desc: '',
                payMask:false
              })
              wx.hideLoading(); 
            },
            'complete': function (res) {}
          })
        } else {
          wx.hideLoading(); 
          // 提交订单蒙层
          _this.setData({
            suboformola: false
          });
          app.showToastC(res.Message || '');
        };
      },
      complete() {wx.hideLoading()}
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

  newpsellwellfun: function (w) {
    var _this = this
    var href = w.currentTarget.dataset.href || w.target.dataset.href || 0;
    var title = w.currentTarget.dataset.title || w.target.dataset.title || '';
    _this.setData({
      iscoupon: false,
    })
    wx.navigateTo({
      url: "/page/component/pages/newpsellwell/newpsellwell?" + href + '&title=' + title,
    })
  },

  dialogClick: function () {
    this.setData({
      iscoupon: false,
    })
  },

  showxray: function () {
    this.setData({
      ishowxray: true,
    })
  },

  closexray: function () {
    this.setData({
      ishowxray: false,
    })
  },

  pullupsignin: function () {
    // // '没有授权'
    this.setData({
      tgabox: true
    });
  },
  // 保存图片
  sharesavethepicture: function (event) {
    var _this = this;
    var ind = event.currentTarget.dataset.ind || event.target.dataset.ind || 0;
    var imgSrc = '';
    var src = '';
    if(ind==1){
      src = _this.data.infoActivity.premiseForJoin;
    }else if(ind==2){
      src = _this.data.showimg;
    }else{
      src = _this.data.saveimgurl || ''; 
    }
    wx.getImageInfo({
      src: src,
      fail: function (res) {
        console.log(res)
      },
      success: function (res) {
        var imgSrc = res.path;
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
                      _this.setData({
                        limsaveiftr: false,
                        listTipImg:false
                      });
                    },
                    fail() {
                      app.showToastC('保存失败');
                      _this.setData({
                        limsaveiftr: false,
                        listTipImg:false
                      });
                    }
                  })
                },
                fail() {
                  _this.setData({
                    limsaveiftr: false,
                    listTipImg:false
                  });
                }
              })
            } else {
              // 有则直接保存
              wx.saveImageToPhotosAlbum({
                filePath: imgSrc,
                success(res) {
                  app.showToastC('保存成功');
                  _this.setData({
                    limsaveiftr: false,
                    listTipImg:false
                  });
                },
                fail(res) {
                  app.showToastC('保存失败');
                  _this.setData({
                    limsaveiftr: false,
                    listTipImg:false
                  });
                }
              })
            }
          }
        });
      }
    })

  },
  // 查看订单
  viewtheorder: function (e) {
    var _this = this;
    wx.navigateTo({    
      url: "/page/component/pages/orderdetails/orderdetails?oid=" + e.currentTarget.dataset.oid
    })
  },
  jumpballotList(){
    wx.navigateTo({
      url: "/page/secondpackge/pages/ballotList/ballotList?id=" + this.data.infoActivity.id
    })
  },
  limitlotterypublish: function () {
    wx.navigateTo({
      url: "/page/component/pages/limitlotterypublish/limitlotterypublish",
    })
  },
  jumpdetail:function(w){
    var _this = this;
    var is_blind_box = w.currentTarget.dataset.is_blind_box || w.target.dataset.is_blind_box || 0;
    if(_this.data.promote_start_date){
      var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
      if(ind == 1){
        app.comjumpwxnav(1,_this.data.infoActivity.goods_id,'');
      }else{
        _this.subscrfun(1);
      };
    }else if(_this.data.infoGoods.isShowBox){
      wx.navigateTo({
        url: "/page/component/pages/mingboxList/mingboxList",
      });
    }else if(is_blind_box){
      wx.navigateTo({
        url: "/pages/smokebox/smokebox?gid=" + + _this.data.infoActivity.goods_id||'',
      });
    }else{
      app.comjumpwxnav(1,_this.data.infoActivity.goods_id,'');
    }

  },

  // 点赞
  ispraisefun: function (w) {
    var _this = this;
    var is_praise = w.currentTarget.dataset.is_praise || w.target.dataset.is_praise || 0;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var lid = w.currentTarget.dataset.lid || w.target.dataset.lid || 0;
    var brandList = _this.data.exhdata;
    if (_this.data.loginid != '' && _this.data.uid != '') {
      Pub.postRequest(_this, 'praiseDrying', {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        drying_id: lid,
        is_praise: is_praise
      }, function (res) {
        if (is_praise == 0) {
          brandList[ind].is_praise = 1;
          brandList[ind].praise_sum = parseInt(brandList[ind].praise_sum) + 1;
        } else {
          brandList[ind].is_praise = 0;
          brandList[ind].praise_sum = parseInt(brandList[ind].praise_sum) - 1;
        };
        _this.setData({
          exhdata: brandList
        });
      });
    }
  },
  // 复制微信号
  sponsocopytwo:function(){
    var _this = this;
    wx.setClipboardData({
      data:_this.data.infoActivity.wx,
      success: function (res) {
        app.showToastC('复制成功');
        _this.setData({copyiftr:false});
      }
    });
  },
  tigglePayMask(){
    this.setData({
      payMask:!this.data.payMask
    })
  },
  emptyFun(){},
  toogleGuidanceMask(){
    this.setData({
      guidanceMask:!this.data.guidanceMask
    }) 
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
  showPicturesFunShare(){
      this.setData({
        showPicturesImg:!this.data.showPicturesImg,
        commonBulletFrame:false,
      })
  },
  // 邀请朋友 获取更多签号
  inviteFriendsCanvas(){
    var _this = this;
    _this.setData({
      showPicturesImg:false
    })
    var q = Dec.Aese('mod=userinfo&operation=makeQrCode&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&activityId=' + _this.data.id  + '&type=27');

    console.log('mod=userinfo&operation=makeQrCode&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&activityId=' + _this.data.id  + '&type=27')

    wx.request({
      url: app.signindata.comurl + 'user.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log('用户太阳码==',res)
        if (res.data.ReturnCode == 200) {
          if(res.data.Info.qrcode){
            _this.data.qrcodeUser = res.data.Info.qrcode || '';
            _this.onCreatePoster()
          }else{
            app.showToastC(res.data.Msg); 
          };

        } else {
          app.showToastC(res.data.Msg);   
        };
      }
    })
  },
  //  生成图片
  onCreatePoster() {
    var that = this;

    wx.showLoading({
      title: '生成中...',
      mask:true
    })
    
    // 黑条
    var blocks = [{
      x:150,
      y:1566,
      width:950,
      height:100,
      backgroundColor:'#000',
      zIndex:6,
    }];
    var texts = [{
        x:148,
        y:630 ,
        baseLine: 'middle',
        text:that.data.infoActivity.name || '',
        fontSize: 72,
        textAlign: 'left',
        color: '#000',
        zIndex:5,
        width:730,
    },{
      x:170,
      y:1626,
      text: '价格¥'+ that.data.infoActivity.shop_price,
      fontSize: 60,
      color: '#fff',
      opacity: 1,
      textAlign: 'left',
      baseLine: 'middle',
      zIndex:7,
    }];
    var selLength = '抽选'+(that.data.infoActivity.quota || '')+'体';
    var selTxt = {
      x: (1078-(selLength.length*50)),
      y:1626,
      text: selLength,
      fontSize: 60,
      color: '#fff',
      opacity: 1,
      textAlign: 'left',
      baseLine: 'middle',
      zIndex:7,
    };
    texts.push(selTxt);

    // 图片
    var imgArr = [{
      x:0,
      y:0,
      url: 'https://cdn.51chaidan.com/images/brandInfoIcon/shareMap.png', // 背景图
      width: 1242,
      height: 2034,
      zIndex: 1,
      borderRadius:0,
    },{
      x:852,
      y:1750,
      url: that.data.qrcodeUser, // 太阳码
      width: 200,
      height: 200,
      zIndex: 2,
      borderRadius:0
    },{
      x:148,
      y:715,
      url: that.data.infoActivity.cover, // 商品图片
      width: 950,
      height: 950,
      zIndex: 2,
      borderRadius:0,
    },{
      x:940,
      y:550 ,
      url: that.data.infoActivity.brandLogo || '', // 用户头像
      width: 140,
      height: 140,
      zIndex: 2,
      borderRadius:0,
      borderRadius:140
    }];
    
    // setData配置数据
    that.setData({
      posterConfig: {
        width: 1242,
        height: 2034,
        debug: false,
        // pixelRatio: 1000,
        preload: false,
        hideLoading: false,
        backgroundColor: '#fff',
        blocks: blocks,
        texts:texts,
        images: imgArr
      }
    }, () => {
      Poster.create();
    });
  },
  onPosterFail(e){
    wx.hideLoading()
    console.log('生成失败=====',e)
  },
  onPosterSuccess(e) {
    wx.hideLoading();
    const {
      detail
    } = e;
    console.log(detail)
    this.setData({
      savepic: detail,
      showPictures:true
    });
  },
  showPicturesFun:function(){
    this.setData({
      showPictures:false
    })
  },
  savetoA() {
    var that = this;

    this.showPicturesFun();

    wx.getSetting({
      success(res) {
        wx.hideLoading();
        if (!res.authSetting['scope.writePhotosAlbum']) {
          //请求授权
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              //获得授权，开始下载
              that.downloadfile()
            },
            fail() {
              wx.showModal({
                title: '',
                content: '保存到系统相册需要授权',
                confirmText: '授权',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success(res) {
                        if (res.authSetting['scope.writePhotosAlbum'] === true) {
                          that.downloadfile()
                        }
                      }
                    })
                  }
                },
                fail() {
                  app.showToastC('打开设置页失败')
                }
              })
            }
          })
        } else {
          //已有授权
          that.downloadfile()
        }
      },
      fail() {
        wx.hideLoading();
        app.showToastC('获取授权失败')
      }
    })
  },
  downloadfile() {
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.savepic,
      success(res) {
        app.showToastC("保存至相册成功");
      },
      fail() {
        app.showToastC("保存至相册失败");
      }
    })
  },
  // 关注 和 点赞 函数
  followfun: function(w) {
    var _this = this;
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    var type = w.currentTarget.dataset.type || w.target.dataset.type || 0;
    console.log('mod=community&operation=likeAttention&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&setType=' + type + '&id=' + id)
    var qqq = Dec.Aese('mod=community&operation=likeAttention&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&setType=' + type + '&id=' + id);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        console.log('关注=====',res)
        if (res.data.ReturnCode == 200) {
          app.showToastC('关注成功');
          setTimeout(function(){
            _this.setData({
              [`brandinfo.isAttention`]: !_this.data.brandinfo.isAttention
            })
          },2000)
        };
      }
    });
  },
  noClickTip(w){
    var identif = w.currentTarget.dataset.identif || w.target.dataset.identif || 0;
    switch(parseInt(identif)){
      case 1: var txt = '微信'; break;
      case 2: var txt = '公众号'; break;
      case 3: var txt = '微博'; break;
      case 4: var txt = '小红书'; break;
      case 5: var txt = '抖音'; break;
      default: var txt = '';
    };
    app.showToastC('暂未设置'+ txt +'信息');
  },
  jumpxcx(w){
    var type = w.currentTarget.dataset.type || w.target.dataset.type || 0;
    var path = w.currentTarget.dataset.path || w.target.dataset.path || '';
    var appId = '';
    if(type == 1){
      appId = 'wx9074de28009e1111';
    }else if(type == 2){
      appId = 'wxb296433268a1c654';
    }
    wx.navigateToMiniProgram({
         appId: appId,
         path: path,
         envVersion: 'release',// 打开正式版
         success(res) {},
         fail: function (err) {
            console.log(err);
          }
    })
  },
  jumpexhbrandDetail: function (w) {
    var id = w.currentTarget.dataset.id || w.target.dataset.id || '';
    wx.navigateTo({
      url: "/page/secondpackge/pages/brandDetails/brandDetails?type=drying&id=" + id+"&settlement=0"
    });
  },
  // 跳转详情页 
  addressmanagement: function (event) {
    var gid = event.currentTarget.dataset.gid || event.target.dataset.gid;
    if(this.data.dataInfo.goodsBrandId){
      app.comjumpwxnav(9047,gid,'');
    }else{
      app.comjumpwxnav(1,gid,'');
    };
    
  },  
  // 抽盒机详情页 
  addresssmokebox: function (event) {
    var gid = event.currentTarget.dataset.gid || event.target.dataset.gid;
    wx.navigateTo({
      url: "/pages/smokebox/smokebox?gid=" + gid
    });
  },
  navigateBack(e){
    let pages = getCurrentPages();
    let prevpage = pages[pages.length - 2];
    prevpage.data.id = this.data.setGoodsStatusData.id;
    prevpage.data.callbackPreview = true;
    wx.navigateBack({
      delta: 1
    })   
  },
  setGoodsStatusBtn(){
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    let data = {
      goodsType:this.data.setGoodsStatusData.goodsType,
      id:this.data.setGoodsStatusData.id,
      brandId:this.data.setGoodsStatusData.brandId,
    }
    api.setGoodsStatus(data).then((res) => {
      console.log(res.data)
      if(res.data.status_code == 200){
        app.showToastC('发布成功',1500);
        setTimeout(function(){
          wx.navigateTo({  
            url: "/page/settled/pages/commodityManagement/commodityManagement"
          });
        },1500)
      }else{
        if(res.data && res.data.message){
          app.showModalC(res.data.message); 
        };        
      }
    }).catch((err)=>{
      console.log(err)
    })
  }
})