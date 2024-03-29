var Dec = require('../../common/public.js'); //aes加密解密js
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '', 
    c_arrow: true,
    c_backcolor: '',
    statusBarHeightMc:wx.getStorageSync('statusBarHeightMc')?wx.getStorageSync('statusBarHeightMc')-44:90,
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    // 适配苹果X
    isIphoneX: app.signindata.isIphoneX,
    movies:[],
    // 订阅上传id
    pid:0,
    page:0,
    liveind:0,
    goodsListThree:[],
    goodsListTwo:[],
    goodsListOne:[],
    liveListData:[],
    subGoodsList:[],
    typeEve:0,
    indexEve:0,
    tipaid:'',
    punchAddres:false,
    giftList:[],
    giftInfo:{},
    shareBoxTip:false,
    shareId:'',
    referee:'',
    defaultinformation:'',
    paybuythree:false,
    // true 运费  false 幸运值
    lucValOrFreig:true,
    shareShopData:'',
    mapImgDisplay:false,
    iftrdetailpagetwo:false,
    // shunButBarData:[
    //   {name:'线上潮玩展',tid:1},
    //   {name:'线上商品',tid:2},
    //   {name:'参展品牌',tid:4}
    // ],

    shunButBarData:[

      {name:'票务信息',tid:1},
      {name:'线上展会',tid:2},
      {name:'海报展示',tid:6},
      {name:'场馆地图',tid:5},
      {name:'参展品牌',tid:4},
      // {name:'展品预告',tid:3,sonnav:[
      //   {name:'热门订阅',tid:33},
      //   {name:'手作专区',tid:30},
      //   {name:'海外专区',tid:31},
      //   {name:'更多展品',tid:32},
      //   {name:'线下潮玩展',tid:32},
      // ]},
      

      // {name:'直播间订阅',tid:1},
      // {name:'展会限定福利',tid:2},
      // {name:'展品预告',tid:3,sonnav:[
      //   {name:'热门订阅',tid:33},
      //   {name:'手作专区',tid:30},
      //   {name:'海外专区',tid:31},
      //   {name:'更多展品',tid:32},
      // ]},
      // {name:'参展品牌',tid:4}
    ],

    // 获取手机号弹框
    havephoneiftr:false,
    // 是否已认证手机号
    isMobileAuth:false,
    // 是分享还是订阅授权手机号
    isShareOrSub:true,
    nowIdx: 0,//当前swiper索引
　　imgList: [],
    subscribeJson:[
       {"toyshowStart":{"template_id":["Q0tWM7kOihw1TilTeR3YmLzWp5tS0McgyOeJx2xX-B0","7rx-pSLTpdYH6IdOKAudkP1A0MmAzN0cOS2RXMTVyKo"], "subscribe_type":["12","12"]}},{"toyshowTicket":{"template_id":["Q0tWM7kOihw1TilTeR3YmLzWp5tS0McgyOeJx2xX-B0","7rx-pSLTpdYH6IdOKAudkP1A0MmAzN0cOS2RXMTVyKo"], "subscribe_type":["17","17"]}}
    ],
    countdown:'',
    isAwardBox:false,
    isBuyingTickets:false,
    isShowDrawTxt:false,
    is_show:false,
    // 商品默认图片
    defaultimg:'/pages/images/goods_Item_Default_Image.png',
    isPopping:false,
    nowAdmissionTime:Date.parse(new Date()) / 1000,
    is_formaldress:false,
    moreDataNum:10,
    informationListData:''
  },

  //点击弹出
  plus: function (e) {
    let ind = e.currentTarget.dataset.ind;
    if (!this.data.isPopping && ind == 3) {
      //弹出
      this.popp();
      this.setData({
        isPopping: true
      })
      }
    else {
      //缩回
      this.takeback();
      this.setData({
        isPopping: false
      });
    }
  },
  //弹出动画
  popp: function () {
    var _this = this;
    let animationcollect = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease'
    })
    var query = wx.createSelectorQuery();
    query.select('#ani').boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec(function(res) {
      console.log(res)
      if (res && res[0]) {
        animationcollect.translateY(-(res[0].height+33)).opacity(1).step();
        _this.setData({
          animation: animationcollect.export()
        })
      }
    });
  },
  //收回动画
  takeback: function () {
    let animationcollect = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease'
    })
    animationcollect.translateY(0).opacity(0).step();
    this.setData({
      animation: animationcollect.export()
    })
  },

  // 获取滚动条当前位置
  onPageScroll: function (e) {
    // console.log(e.scrollTop)
    if(e.scrollTop>600 && !this.data.is_show){
      this.setData({
        is_show: true
      }); 
    }
  },  
  
  toggleAwardFun(){
    this.setData({
      isAwardBox:!this.data.isAwardBox
    })
  },
  //跳转商品详情
  jumpGoodsDetails(w){

    // return false;

    var gid = w.currentTarget.dataset.gid || w.target.dataset.gid;
    var islotto = w.currentTarget.dataset.islotto || w.target.dataset.islotto || false;
    var isblindbox = w.currentTarget.dataset.isblindbox || w.target.dataset.isblindbox || false;
    if(islotto){
       app.comjumpwxnav(9003,gid,'','');
    } else if(isblindbox){
      app.comjumpwxnav(9005,gid,'','');
    }else{
      app.comjumpwxnav(1,gid,'');
    }
 
  },
  // 跳转日历列表
  jumpCalendarList(){
    wx.navigateTo({ 
      url: "/page/secondpackge/pages/calendarList/calendarList"
    })
  },
  // 跳转生成地图页面
  jumpcanvasRoute(){
    wx.navigateTo({ 
      url: "/page/secondpackge/pages/canvasRoute/canvasRoute"
    });
  },
  //获取swiper高度
  getHeight: function (e) {
  　　var winWid = wx.getSystemInfoSync().windowWidth - 2 * 30;//获取当前屏幕的宽度
  　　var imgh = e.detail.height;//图片高度
  　　var imgw = e.detail.width;
  　　var sH = winWid * imgh / imgw;
  　　this.setData({
  　　　　swiperH: sH//设置高度
  　　})
  },
  //swiper滑动事件
  swiperChange: function (e) {
  　　this.setData({
  　　　　nowIdx: e.detail.current
  　　})
  },
  havephoneiftrfun:function(){
    this.setData({havephoneiftr:!this.data.havephoneiftr});
  },
  // 获取手机号
  getPhoneNumber: function(e) {
    var _this = this;
    console.log(e.detail.errMsg == 'getPhoneNumber: ok' || e.detail.errMsg == "getPhoneNumber:ok");
    if (e.detail.errMsg == 'getPhoneNumber: ok' || e.detail.errMsg == "getPhoneNumber:ok") {
      wx.login({
        success: function(res) {
          if (res.code) {
            _this.helpOther(res.code, e.detail.encryptedData, e.detail.iv)
          };
        }
      });
    } else {
      app.showToastC('获取手机号失败！');
      _this.setData({
        havephoneiftr: true
      })
    }
  },
  helpOther: function(code, encryptedData, iv) {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    });
    console.log('mod=subscription&operation=authMobile&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&iv=' + iv + '&encryptedData=' + encryptedData + '&code=' + code)
    var q1 = Dec.Aese('mod=subscription&operation=authMobile&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&iv=' + iv + '&encryptedData=' + encryptedData + '&code=' + code);

    wx.request({
      url: app.signindata.comurl + 'toy.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        console.log('手机号授权提交=====',res)
        if(res.data.ReturnCode == 200){
          _this.setData({
            havephoneiftr: false,
            isMobileAuth:true
          });
          if(_this.data.isShareOrSub){
            _this.shareExhBen();
          }
          app.showToastC(res.data.Msg||'');
        }else{
          app.showToastC(res.data.Msg||'');
        };

      },
      complete: function(res) {
        wx.hideLoading()
      }
    })
  },
  informationListJump(e){
    var index = e.currentTarget.dataset.index || 0;
    var url = this.data.informationListData[index].url || '';
    app.comjumpwxnav(0, url);
  },
  brandIntrodMore(e){
    var ind = e.currentTarget.dataset.ind || 0;
    if(ind == 1){
      if(this.data.moreDataNum == 9999){
          var moreDataNum = 10;
      }else{
        var moreDataNum = 9999;
      }
      this.setData({
          moreDataNum:moreDataNum
      })
    };

  },
  jumpChouxuanHomepage(e){
    var url = e.currentTarget.dataset.url;
    app.comjumpwxnav(0, url);
    // var isBuyingTickets = this.data.isBuyingTickets;
    // if(isBuyingTickets){
    //   wx.navigateTo({
    //     url: "/page/secondpackge/pages/chouxuanHomepage/chouxuanHomepage"
    //   });
    // }else{
    //   app.showToastC('敬请期待');
    // }
  },
  // jumpLuckyDraw(){
  //   // var isBuyingTickets = this.data.isBuyingTickets;
  //   // if(isBuyingTickets){
  //   //   wx.navigateTo({
  //   //     url: "/page/secondpackge/pages/priorityList/priorityList"
  //   //   });
  //   // }else{
  //   //   app.showToastC('活动已结束，今晚20:00公布中奖名单');
  //   // }

  //   var nowTime = new Date().getTime();
  //   console.log('nowTime=====',parseInt(nowTime/1000))
  //   if( parseInt(nowTime/1000) >= '1621492396' ){
  //     this.setData({
  //       isShowDrawTxt:true
  //     })
  //     wx.navigateTo({
  //       url: "/page/secondpackge/pages/priorityList/priorityList"
  //     });
  //   }else{
  //     this.setData({
  //       isShowDrawTxt:false
  //     })
  //     app.showToastC('活动已结束，今晚20:00公布中奖名单');
  //   }
  // },
  jumpposition:function(w){
    wx.navigateTo({
      url: "/page/secondpackge/pages/buyingTickets/buyingTickets"
    });
  },
  position:function(w){
      var tid = w.currentTarget.dataset.tid || w.target.dataset.tid || 0;
      var query = wx.createSelectorQuery();
      query.select('#e' + tid).boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec(function(res) {
        if (res && res[0] && res[1]) {
          wx.pageScrollTo({
             scrollTop:( res[0].top+res[1].scrollTop-app.signindata.statusBarHeightMc||90 )-85,
             duration:300
          })
        }
      });

      var subscribe_data = w.currentTarget.dataset.subscribe_data;
      console.log(subscribe_data)
      //缩回
      this.takeback();
      this.setData({
        subscribedata:subscribe_data,
        isPopping: false
      })
      app.comsubscribe(this)
  },
  displayDetail:function(w){
    wx.showLoading({title: '加载中...',})
    var _this = this;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind||0;
    var giftList = this.data.giftList || [];
    if(giftList[ind]&&giftList[ind].goods_desc){
      var gdesc = decodeURIComponent(giftList[ind].goods_desc.replace(/\+/g, ' '));
      console.log(gdesc)
      WxParse.wxParse('article', 'html', gdesc, _this, 0);
      this.setData({
        iftrdetailpagetwo:true
      })
    }
    wx.hideLoading()
  },
  iftrdetailpageb:function(){
    this.setData({iftrdetailpagetwo:false});
  },
  // 图片预览
  previewImg: function (w) {
    var index = 0;
    var giftInfo = this.data.giftInfo.imgIntroduce || 'https://cdn.51chaidan.com/images/sign/toyShowBrandPosition.jpg';
    var imgArr = [giftInfo];
    wx.previewImage({
      current: imgArr[index],    
      urls: imgArr,               
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },  
  mapImgDisplayfun:function(){
    this.setData({mapImgDisplay:!this.data.mapImgDisplay});
  },
  paybuythreeFun:function(){
    this.setData({paybuythree:!this.data.paybuythree});
  },
  shareBoxTipfun:function(){
    this.setData({shareBoxTip:!this.data.shareBoxTip});
  },
  // banner 跳转
  jumpbanner: function (w) {
    console.log(w)
    var whref = w.currentTarget.dataset.href || w.target.dataset.href;
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type||0;
    var imgurl = w.currentTarget.dataset.imgurl || w.target.dataset.imgurl || '';
    var wname = w.currentTarget.dataset.title || w.target.dataset.title || '美拆'; 

    if(whref == ''){
      var _this = this;
      var subscribe_data = _this.data.subscribeJson[0].toyshowStart;
      console.log(subscribe_data)
      this.setData({
        subscribedata:subscribe_data
      });
      _this.subscrfun(1);
      return false;
    }

    // 公共跳转
    app.comjumpwxnav(item_type, whref, wname, imgurl);

  },
  auditversion:function(){
     this.onLoadfun();
  },

  arousesubscribeFun:function(e){
    var _this = this;
    var subscribe_data = e.currentTarget.dataset.subscribe_data;
    console.log(subscribe_data)
    this.setData({
      subscribedata:subscribe_data
    });

    _this.subscrfun(1);

  },

  // 每一个拉起订阅
  evesubscrfun:function(w){
    var _this = this;
    console.log(w)
    // 是否认证手机号
    // if(!_this.data.isMobileAuth){
    //   _this.data.isShareOrSub = false;
    //   _this.havephoneiftrfun();
    //   return false;
    // };

    var id = 0;
    // var activityid = w.currentTarget.dataset.activityid || w.target.dataset.activityid||1;
    // var eveid = w.currentTarget.dataset.eveid || w.target.dataset.eveid||1;
    var type = w.currentTarget.dataset.type || w.target.dataset.type||1;
    var index = w.currentTarget.dataset.index || w.target.dataset.index||0;
    var islotto = w.currentTarget.dataset.islotto || w.target.dataset.islotto||false;
    var subscribedata = '';
    if(type==1){
      var goodsListOne = _this.data.goodsListOne;
      if(islotto){  //是否是抽签活动 true  订阅抽签
        subscribedata = goodsListOne.lottoSubscribe || '';
        id = w.currentTarget.dataset.activityid || w.target.dataset.activityid||1;
      }else{
        subscribedata = goodsListOne.toyShowSubscribe || '';
        id = w.currentTarget.dataset.eveid || w.target.dataset.eveid||1;
      }
    }else if(type==2){
      var goodsListTwo = _this.data.goodsListTwo;
      if(islotto){  //是否是抽签活动 true  订阅抽签
        subscribedata = goodsListTwo.lottoSubscribe || '';
        id = w.currentTarget.dataset.activityid || w.target.dataset.activityid||1;
      }else{
        subscribedata = goodsListTwo.toyShowSubscribe || '';
        id = w.currentTarget.dataset.eveid || w.target.dataset.eveid||1;
      }
    }else if(type==3){
      var goodsListThree = _this.data.goodsListThree;
      if(islotto){  //是否是抽签活动 true  订阅抽签
        subscribedata = goodsListThree.lottoSubscribe || '';
        id = w.currentTarget.dataset.activityid || w.target.dataset.activityid||1;
      }else{
        subscribedata = goodsListThree.toyShowSubscribe || '';
        id = w.currentTarget.dataset.eveid || w.target.dataset.eveid||1;
      }
    }else if(type==4){
      var subGoodsList = _this.data.subGoodsList;
      if(islotto){  //是否是抽签活动 true  订阅抽签
        subscribedata = subGoodsList.lottoSubscribe || '';
        id = w.currentTarget.dataset.activityid || w.target.dataset.activityid||1;
      }else{
        subscribedata = subGoodsList.toyShowSubscribe || '';
        id = w.currentTarget.dataset.eveid || w.target.dataset.eveid||1;
      }
    }else if(type==5){
      var goodsListNew = _this.data.goodsListNew;
      if(islotto){  //是否是抽签活动 true  订阅抽签
        subscribedata = goodsListNew.lottoSubscribe || '';
        id = w.currentTarget.dataset.activityid || w.target.dataset.activityid||1;
      }else{
        subscribedata = goodsListNew.toyShowSubscribe || '';
        id = w.currentTarget.dataset.eveid || w.target.dataset.eveid||1;
      }
    }else if(type==6){
      var drawInfo = _this.data.drawInfo;
      if(islotto){  //是否是抽签活动 true  订阅抽签
        subscribedata = drawInfo.lottoSubscribe || '';
        id = w.currentTarget.dataset.activityid || w.target.dataset.activityid||1;
      }else{
        subscribedata = drawInfo.toyShowSubscribe || '';
        id = w.currentTarget.dataset.eveid || w.target.dataset.eveid||1;
      }
    }else if(type==7){
      subscribedata = _this.data.DayJudSubscribe || '';
    };
    _this.setData({
      subscribedata:subscribedata,
      id:id,
      typeEve:type,
      indexEve:index
    });
    if(type==7){
      _this.subscrfun(1);
    }else{
      _this.subscrfun();
    }
    
  },
  // 拉起订阅
  subscrfun: function (num) {
    var _this = this;
    var subscribedata = _this.data.subscribedata || '';
    console.log('subscribedata===',subscribedata)
    console.warn(1,subscribedata && subscribedata.template_id && app.signindata.subscribeif)

    if (subscribedata && subscribedata.template_id && app.signindata.subscribeif) {
      console.warn(2)
      if (subscribedata.template_id instanceof Array) {
        console.warn(3)
        wx.requestSubscribeMessage({
          tmplIds: subscribedata.template_id || [],
          success(res) {
            var is_show_modal = true;
            console.warn(4)
            for (var i = 0; i < subscribedata.template_id.length; i++) {
              if (res[subscribedata.template_id[i]] == "accept") {
                if(num == 1){
                  app.subscribefun(_this, 1, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
                }else{
                  app.subscribefun(_this, 0, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
                };
                
                if (is_show_modal) {
                  _this.subshowmodalfun();
                  _this.subshowmodalTip();
                  is_show_modal = false;
                };
              };
            };
          },
          complete() { }
        })
      } else {
        console.warn(5)
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
  subshowmodalTip: function () {
    var _this = this;
    wx.showModal({
      title: '提示',
      content: '订阅成功',
      showCancel: false,
      success: function (res) {}
    })
  },

  subshowmodalfun: function () {
    var _this = this;
    var typeEve = _this.data.typeEve || 0;
    var indexEve = _this.data.indexEve || 0;
    console.log(typeEve,indexEve)
    if(typeEve==1){
        var goodsListOne = _this.data.goodsListOne;
        _this.setData({
            ['goodsListOne.goodsList['+indexEve+'].is_subscribe']: 1
        })
    }else if(typeEve==2){
      var goodsListTwo = _this.data.goodsListTwo;
      _this.setData({
            ['goodsListTwo.goodsList['+indexEve+'].is_subscribe']: 1
      })
    }else if(typeEve==3){
      var goodsListThree = _this.data.goodsListThree;
      _this.setData({
          ['goodsListThree.goodsList['+indexEve+'].is_subscribe']: 1
      })
    }else if(typeEve==4){
      var subGoodsList = _this.data.subGoodsList;
      _this.setData({
          ['subGoodsList.goodsList['+indexEve+'].is_subscribe']: 1
      })
    }else if(typeEve==5){
      var goodsListNew = _this.data.goodsListNew;
      _this.setData({
          ['goodsListNew.goodsList['+indexEve+'].is_subscribe']: 1
      })
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      shareId:options.shareId||'',
      referee:options.referee||''
    })
    app.signindata.suap = 6;
    // 推送统计
    this.data.push_id = options.push_id || 0;

    this.onLoadfun();

    if(app.signindata.sceneValue==1154){
      
    }else{
      // 判断是否授权
      this.activsign();
    };
    this.obtaintabfun();
  },
  // 判断是否是审核版本
  obtaintabfun:function(){
    var _this = this;
    // 判断是正是版本还是审核版本
    wx.request({
      url: 'https://meichai-1300990269.cos.ap-beijing.myqcloud.com/produce/verifyVersion.conf?time='+app.signindata.appNowTime,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.WeChat == app.signindata.versionnumber) {
             _this.setData({is_formaldress : true})
        } else {
             _this.setData({is_formaldress : false})
        };
      },
      fail: function (res) {}
    });
  },

  onLoadfun:function(){
    console.log('123')
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      avatarUrl: app.signindata.avatarUrl,
      isShareFun: app.signindata.isShareFun,
      isProduce: app.signindata.isProduce,
      defaultinformation:app.signindata.defaultinformation
    });

    _this.brandinformation(1);
    // // 线上
    _this.commodityinformation(1,1);
    // // 手作
    // _this.commodityinformation(1,2);
    // // 海外
    // _this.commodityinformation(1,3);
    // // 直播列表
    _this.liveList(1);


    //展会福利
    // _this.exhibitionBenefits();

    // //  收货地址
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
    

    if(_this.data.defaultinformation){}else{
      console.log('defaultinformation=====接口')
      app.defaultinfofun(_this);
    }

    
    var ctx = wx.createCanvasContext('myCanvas');
    var arr = this.data.arr;
    // ctx.moveTo(120, 200)
    // for(var i=0;i<arr.length;i++){
    //   console.log(arr[i].x*40, arr[i].y*40)
    //   // ctx.lineTo(arr[i].x*40, arr[i].y*40)
    // }
    ctx.moveTo(120, 200)
    ctx.lineTo(40, 0)
    ctx.stroke()
    ctx.draw()
    
  },
  // 分享展会福利
  shareExhBen:function(){
    var _this = this;
    var q1 = Dec.Aese('mod=subscription&operation=circusee&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&shareId='+_this.data.shareId + '&shareUid=' +_this.data.referee);
    console.log('mod=subscription&operation=circusee&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&shareId='+_this.data.shareId + '&shareUid=' +_this.data.referee)
    wx.showLoading({title: '加载中...',})
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        _this.data.referee = '';
        console.log('分享展会福利=====',res)
        wx.stopPullDownRefresh();
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          _this.setData({
            shareShopData:res.data.Info.circuseeInfo || ''
          });
          _this.shareBoxTipfun();
          // 分享数据调取完成调取展会福利
          _this.exhibitionBenefits();
        }else{
          wx.showModal({
            content: res.data.Msg || res.data.msg,
            showCancel:false,
            success: function (res) {}
          });          
        };
      },

    })
  },
  // 展会福利
  exhibitionBenefits:function(){
    var _this = this;
    var q1 = Dec.Aese('mod=subscription&operation=giftList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid+ '&push_id='+_this.data.push_id );
    console.log('mod=subscription&operation=giftList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid+ '&push_id='+_this.data.push_id)
    wx.showLoading({title: '加载中...',})
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        _this.data.push_id =  0;
        console.log('展会福利=====',res)
        wx.stopPullDownRefresh();
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          _this.setData({
            giftList:res.data.List.giftList || [],
            giftInfo:res.data.Info || {}
          })
        };
      },

    })
  },
  // 跳转增加新地址
  jumpaddress:function(){
    wx.navigateTo({ 
      url: "/pages/newreceivingaddress/newreceivingaddress"
    })     
  },
  // 下订单
  placingSnOrder:function(){
      var _this = this;
      if(_this.data.lucValOrFreig){
         var type = 2;
      }else{
         var type = 1;
      }
      var q1 = Dec.Aese('mod=subscription&operation=getGift&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid +'&type='+type +'&gId=' + _this.data.goods_id + '&aid=' + _this.data.tipaid );

      console.log('mod=subscription&operation=getGift&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid +'&type='+type +'&gId=' + _this.data.goods_id + '&aid=' + _this.data.tipaid )

      wx.showLoading({title: '加载中...',mask:true})
      wx.request({
        url: app.signindata.comurl + 'toy.php' + q1,
        method: 'GET',
        header: {'Accept': 'application/json'},
        success: function(res) {
          console.log('生成订单=====',res)
          wx.stopPullDownRefresh();
          wx.hideLoading()
          if (res.data.ReturnCode == 200) {
            // 运费领奖
            if(_this.data.lucValOrFreig){
                _this.data.cart_id = res.data.Info.cart_id || '';
                _this.paymentmony()
            }else{
              _this.paybuythreeFun();
              wx.showModal({
                content: res.data.Msg,
                showCancel: false,
                success: function (res) { }
              }) 
              _this.exhibitionBenefits()
            };
          }else{
            wx.showModal({
              content: res.data.Msg,
              showCancel: false,
              success: function (res) { }
            }) 
          };
        },

      })
  },
  // 微信支付
  paymentmony: function () {
    var _this = this;
    var q = Dec.Aese('mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + _this.data.cart_id + '&xcx=1' + '&openid=' + _this.data.openid);
    wx.showLoading({title: '加载中...',mask:true})
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading()
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
                    paybuythree:false,
                    punchAddres:false
                 });
                 wx.showModal({
                    content: '领取成功',
                    showCancel: false,
                    success: function (res) {
                      _this.exhibitionBenefits()
                    }
                }) 
                 
            },
            'fail': function (res) {
                _this.setData({
                  paybuythree:false,
                  punchAddres:false
                });
            },
            'complete': function (res) {}
          })
        } else {
          app.showModalC(res.data.Msg || res.data.msg || '');
        };
      }
    })
  },
  // 地址确认框
  displeyNoneAdd:function(){
    var _this = this;
    // 隐藏选地址框
    _this.punchAddresfun();
    // 显示选择幸运值或运费领奖框
    this.paybuythreeFun();
  },
  // 幸运值领奖
  paybuytwoleft:function(){
     var giftInfo = this.data.giftInfo;
     this.data.lucValOrFreig = false;
     console.log(giftInfo.luckNumber<giftInfo.getCostLuckNumber)
     if(giftInfo.luckNumber<giftInfo.getCostLuckNumber){
        wx.showModal({
          content: '幸运值不足',
          showCancel:false,
          confirmText:'确定',
          success: function (res) {}
        })        
     }else{
       console.log(11111111)
       this.placingSnOrder()
     }
  },
  // 运费领奖
  paybuytworight:function(){
    this.data.lucValOrFreig = true;
    this.placingSnOrder()
  },
  // 修改收货地址
  revisethereceivingaddress:function(w){
    var tipaid = w.currentTarget.dataset.tipaid || w.target.dataset.tipaid;
    var tipadd = w.currentTarget.dataset.tipadd || w.target.dataset.tipadd;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind||0;
    this.data.tipaid = tipaid;
    var addressdata = this.data.addressdata || [];
    for (var i = 0; i < addressdata.length; i++) {
      addressdata[i].checked = false;
    };
    if (addressdata[ind]) {
      addressdata[ind].checked = true;
    };
    this.setData({
      addressdata:addressdata
    });
  },
  punchAddresfun:function(w){
    console.log(w,1,this.data.goods_id)
    if(w){
      this.data.goods_id = w.currentTarget.dataset.goods_id || w.target.dataset.goods_id || '';
      console.log(w,2,this.data.goods_id)
    };
    this.setData({punchAddres:!this.data.punchAddres});
  },
  // 下一页返回调取
  nextpagediao:function(){
    var _this = this;
    //  调取收货地址
    var q = Dec.Aese('mod=address&operation=getlist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.showLoading({title: '加载中...',})
    wx.request({
      url: app.signindata.comurl + 'user.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading()
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
  // 资讯列表
  informationList(){
      var _this = this;
      
      var q1 = Dec.Aese('mod=subscription&operation=message&page=0&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
      console.log('mod=subscription&operation=message&page=0&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)

      wx.request({
        url: app.signindata.comurl + 'toy.php' + q1,
        method: 'GET',
        header: {'Accept': 'application/json'},
        success: function(res) {
          console.log('资讯列表=====',res)

          if (res.data.ReturnCode == 200) {
            _this.setData({
              informationListData:res.data.List.brandMessageList || ''
            });
          };
        },

      })
  },
  // 直播信息  
  liveList:function(num){
    var _this = this
    wx.showLoading({title: '加载中...',})
    if (num==1){
      _this.data.liveind = 0;
    }else{
      var pagenum = _this.data.liveind;
      _this.data.liveind = ++pagenum;
    };

    var q1 = Dec.Aese('mod=subscription&operation=liveList&pid=' + _this.data.liveind );
    console.log('mod=subscription&operation=brandList&pid=' + _this.data.liveind)

    wx.request({
      url: app.signindata.comurl + 'toy.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        console.log('直播列表=====',res)
        wx.stopPullDownRefresh();
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          if(num==1){
            var liveListData = res.data.List.liveList || [];
            var rewardList = res.data.List.rewardList || [];
            var drawInfo = res.data.List.drawInfo || [];

            if(parseInt(drawInfo.status) == 2){
              _this.data.countdown = parseInt(drawInfo.stop_time) || '';
              _this.countdownbfun();
            }
            // else if(parseInt(drawInfo.status) == 1){
            //   _this.data.countdown = parseInt(drawInfo.start_time) || '';
            //   _this.countdownbfun();
            // };

            _this.setData({
              liveListData:liveListData,
              rewardList:rewardList,
              drawInfo:drawInfo
            })
          }else{
            var liveList = res.data.List.liveList || [];
            console.log('品牌信息=======2',res)
            var liveListData = _this.data.liveListData.concat(liveList);
            _this.setData({
              liveListData:liveListData
            })
          };
        };
      },

    })
},

brandJson:function(){
     var _this = this;
    //媒体品牌logo数据
    wx.request({
      url: 'https://cdn.51chaidan.com/json/toyShowNextData.json?time='+app.signindata.appNowTime,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('媒体数据logo===',res)
        _this.setData({
          mediaBrandList:res.data.mediaData || [],
          undertakeData:res.data.undertakeData || [],
        })
      }
    })
  },
  toyShowbrandJson:function(){
    var _this = this;
    // 参展品牌logo数据
   wx.request({
     url: 'https://meichai-1300990269.cos.ap-beijing.myqcloud.com/produce/toyshowSign.json?time='+app.signindata.appNowTime,
     method: 'GET',
     header: { 'Accept': 'application/json' },
     success: function (res) {
       console.log('参展品牌logo===',res)
       _this.setData({
        brandList:res.data.List.brand || []
       })
     }
   })
  },
  // 品牌信息
  brandinformation:function(num){
      var _this = this
      wx.showLoading({
        title: '加载中...',
      })
      if (num==1){
        _this.data.pid = 0;
      }else{
        var pagenum = _this.data.pid;
        _this.data.pid = ++pagenum;
      };
      var q1 = Dec.Aese('mod=subscription&operation=brandList&type=1&pid=' + _this.data.pid+'&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid );
      console.log('mod=subscription&operation=brandList&type=1&pid=' + _this.data.pid+'&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
      wx.request({
        url: app.signindata.comurl + 'toy.php' + q1,
        method: 'GET',
        header: {'Accept': 'application/json'},
        success: function(res) {
          console.log('品牌信息=====',res)
          wx.stopPullDownRefresh();
          wx.hideLoading()
          if (res.data.ReturnCode == 200) {
            if(num==1){
              var listData = res.data.List || {};
              var infoData = res.data.Info || {};
              var bannerList = listData.bannerList || [];
              var brandList = res.data.List.brand || [];
              var goodsInfo = listData.goodsInfo || [];
              var calendarList = listData.calendar || [];
              var isMobileAuth = infoData.isMobileAuth || false;
              var countSubsribe = infoData.countSubsribe || 0;
              var featuredBrands = listData.featuredBrands || [];
              var DayJudSubscribe = listData.toyShowSubscribe || [];

              // _this.data.countdown = infoData.endTime || '';

              // _this.countdownbfun();
              _this.setData({
                bannerList:bannerList,
                urlScratch:infoData.urlScratch,
                calendarList,
                brandList,
                goodsInfo,
                countSubsribe,
                isMobileAuth:isMobileAuth,
                featuredBrands:featuredBrands,
                DayJudSubscribe:DayJudSubscribe
              });
              // 是否是分享围观
              // _this.shareReferee();
              
              var nowTime = new Date().getTime();
              var isBuyingTickets = res.data.Info.ticketTime;
              console.log('nowTime=====',parseInt(nowTime/1000))
              if(isBuyingTickets && (parseInt(nowTime/1000) >= isBuyingTickets)){
              // if(isBuyingTickets && ('1608346345' >= isBuyingTickets)){
                _this.setData({
                  isBuyingTickets:true
                })
              }
            }else{
              var brandList = res.data.List.brandList || [];
              if(brandList&&brandList.length!=0){
                console.log('品牌信息=======2',res)
                var comdataarr = _this.data.brandList.concat(brandList);
                _this.setData({
                  brandList:comdataarr
                })
              }else{
                app.showToastC('没有更多数据了');
              };
            }

          };
          // 品牌数据
          // _this.toyShowbrandJson();
          _this.brandJson();

        },
  
      })
  },
  shareReferee:function(){
     var _this = this;
     if(_this.data.referee&&_this.data.uid&&_this.data.referee!=_this.data.uid){
        if(_this.data.isMobileAuth){
          _this.shareExhBen();             
        }else{
          _this.data.isShareOrSub = true;
          _this.havephoneiftrfun();
          // 展会福利
          _this.exhibitionBenefits();
        };
     }else{
        // 展会福利
        _this.exhibitionBenefits();
     };
  },
  // 商品信息 type 1为线上 2为blibli 3为直播
  commodityinformation:function(num,type){
      var _this = this
      wx.showLoading({
        title: '加载中...',
      })
      var q1 = Dec.Aese('mod=subscription&operation=goodsList&type=' + type + "&pid=" + _this.data.page + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid );
      console.log('mod=subscription&operation=goodsList&type=' + type + "&pid=" + _this.data.page + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid )
      wx.request({
        url: app.signindata.comurl + 'toy.php' + q1,
        method: 'GET',
        header: {'Accept': 'application/json'},
        success: function(res) {
          console.log('商品信息====='+type,res)
          wx.stopPullDownRefresh();
          wx.hideLoading()
          if (res.data.ReturnCode == 200) {
            // 商品信息 type 1为线上 2为blibli 3为直播
             if(type==1){
                if(num==1){
                  var toyShowSubscribe = res.data.Info.toyShowSubscribe || {};
                  var lottoSubscribe = res.data.Info.lottoSubscribe || {};
                  var goodsListOne = res.data.List.goodsListOne || [];
                  var goodsListTwo = res.data.List.goodsListTwo || [];
                  var goodsListThree = res.data.List.goodsListThree || [];
                  var goodsListNew = res.data.List.goodsListNew || [];
                  var subGoodsList = res.data.List.subscriptionGoodsList || [];
                  var offlineGoodsList = res.data.List.offlineGoodsList || [];
                  var goodsListOne = {
                    lottoSubscribe,
                    toyShowSubscribe,
                    goodsList:goodsListOne
                  };
                  var goodsListTwo = {
                    lottoSubscribe,
                    toyShowSubscribe,
                    goodsList:goodsListTwo
                  };
                  var goodsListThree = {
                    lottoSubscribe,
                    toyShowSubscribe,
                    goodsList:goodsListThree
                  };
                  var goodsListNew = {
                    lottoSubscribe,
                    toyShowSubscribe,
                    goodsList:goodsListNew
                  };
                  var subGoodsList = {
                    lottoSubscribe,
                    toyShowSubscribe,
                    goodsList:subGoodsList
                  };

                  _this.setData({
                    goodsListOne,
                    goodsListTwo,
                    goodsListThree,
                    goodsListNew,
                    subGoodsList,
                    offlineGoodsList
                  })
                  // 资讯列表
                  _this.informationList();
                }else{
                  var goodsList = res.data.List.goodsListOne || [];
                  if(goodsList&&goodsList.length!=0){
                    var goodsListOne =  _this.data.goodsListOne;
                    var goodsListAnd = goodsListOne.goodsList.concat(goodsList);
                    goodsListOne.goodsList = goodsListAnd;
                    _this.setData({
                      goodsListOne:goodsListOne
                    })
                    console.log(_this.data.goodsListOne)
                  };
                };
             };
            //  if(type==2){
            //     if(num==1){
            //       var toyShowSubscribe = res.data.Info.toyShowSubscribe || {};
            //       var goodsList = res.data.List.goodsListTwo || [];
            //       var goodsListTwo = {
            //         toyShowSubscribe:toyShowSubscribe,
            //         goodsList:goodsList
            //       };
            //       _this.setData({
            //         goodsListTwo:goodsListTwo
            //       })
            //     }else{
            //       var goodsList = res.data.List.goodsListTwo || [];
            //       if(goodsList&&goodsList.length!=0){
            //         var goodsListTwo =  _this.data.goodsListTwo;
            //         var goodsListAnd = goodsListTwo.goodsList.concat(goodsList);
            //         goodsListTwo.goodsList = goodsListAnd;
            //         _this.setData({
            //           goodsListTwo:goodsListTwo
            //         })
            //       };
            //     };
            //  };
            //  if(type==3){
            //     if(num==1){
            //         var toyShowSubscribe = res.data.Info.toyShowSubscribe || {};
            //         var goodsList = res.data.List.goodsListThree || [];
            //         var goodsListThree = {
            //           toyShowSubscribe:toyShowSubscribe,
            //           goodsList:goodsList
            //         };
            //         _this.setData({
            //           goodsListThree:goodsListThree
            //         })
            //     }else{
            //         var goodsList = res.data.List.goodsListThree || [];
            //         if(goodsList&&goodsList.length!=0){
            //           var goodsListThree =  _this.data.goodsListTwo;
            //           var goodsListAnd = goodsListThree.goodsList.concat(goodsList);
            //           goodsListThree.goodsList = goodsListAnd;
            //           _this.setData({
            //             goodsListThree:goodsListThree
            //           })
            //         };
            //     };
            //  };
          };
        },

      })
  },
  
  activsign: function () {
    // 判断是否授权 
    var _this = this;
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {

      return false;
    };    
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
            isProduce: app.signindata.isProduce,
            signinlayer: true,
            tgabox: false
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {

          } else {
            app.signin(_this);
          }
        } else {
          console.log(11111111111111111111111111111)
          _this.setData({
            tgabox: false,
            signinlayer: false
          })
          console.log()
          // '没有授权 统计'
          app.userstatistics(42);
        }
      }
    });      
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

   /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    this.setData({
      nowAdmissionTime:Date.parse(new Date()) / 1000
    })

    if (this.data.countdown) {
      this.countdownbfun();
    };
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer);
  },

  // 倒计时
  countdownbfun: function () {
    var _this = this;
    clearInterval(_this.data.timer);
    var countdown = _this.data.countdown || '';
    var commoddata = _this.data.commoddata||{};
    console.log('倒计时======',countdown)
    function nowTime() { //时间函数
      var iftrins = true;
      // 获取现在的时间
      var nowTime = new Date().getTime();
      // nowTime = Date.parse(nowTime);//当前时间戳
      var lastTime = countdown * 1000;
      var differ_time = lastTime - nowTime; //时间差：
      if (differ_time >= 0) {
        var differ_day = Math.floor(differ_time / (3600 * 24 * 1e3));
        var differ_hour = Math.floor(differ_time % (3600 * 1e3 * 24) / (1e3 * 60 * 60));
        var differ_minute = Math.floor(differ_time % (3600 * 1e3) / (1000 * 60));
        var s = Math.floor(differ_time % (3600 * 1e3) % (1000 * 60) / 1000);
        if (differ_day.toString().length < 2) {
          differ_day = "0" + differ_day;
        };
        if (differ_hour.toString().length < 2) {
          differ_hour = "0" + differ_hour;
        };
        if (differ_minute.toString().length < 2) {
          differ_minute = "0" + differ_minute;
        };
        if (s.toString().length < 2) {
          s = "0" + s;
        };
        commoddata.day = differ_day;
        commoddata.hour = differ_hour;
        commoddata.minute = differ_minute;
        commoddata.second = s;
      } else {
        commoddata.day = '00'
        commoddata.hour = '00';
        commoddata.minute = '00';
        commoddata.second = '00';
      };
      if (commoddata.day != '00' || commoddata.hour != '00' || commoddata.minute != '00' || commoddata.second != '00') {
        iftrins = false;
      };
      _this.setData({
        commoddata: commoddata
      });

      
      if (iftrins) {
        clearInterval(_this.data.timer);
      };
    }
    if (countdown) {
      nowTime();
      clearInterval(_this.data.timer);
      _this.data.timer = setInterval(nowTime, 1000);
    };
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var _this = this;
    _this.data.page = 0;
    _this.brandinformation(1);
    // // 线上
    _this.commodityinformation(1,1);
    // // 手作
    // _this.commodityinformation(1,2);
    // // 海外
    // _this.commodityinformation(1,3)
    // // 直播列表
    _this.liveList(1);
    // // 展会福利
    // _this.exhibitionBenefits();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // var _this = this;
    // var pagenum = _this.data.page;
    // _this.data.page = ++pagenum;
    // // 线上
    // _this.commodityinformation(2,1);
    // // blibli
    // _this.commodityinformation(2,2);
    // // 直播
    // _this.commodityinformation(2,3)
    // _this.brandinformation(2);
  },
  clicktganone: function () {
    this.setData({ tgabox: false })
  }, 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    var _this = this;
    var giftInfo = _this.data.giftInfo || {};

    var indexShare = app.signindata.indexShare || [];
    var indexShareNum = Math.floor(Math.random() * indexShare.length) || 0;
    var indexShareImg = '';
    if(indexShare.length!=0 && indexShare[indexShareNum]){
      indexShareImg = indexShare[indexShareNum]+'?time=' + Date.parse(new Date());
    };

    if (options.from == 'button' ){
      return {
        title: '我正在领展会限定福利，数量有限，先到先得' ,
        path: "/pages/dismantlingbox/dismantlingbox?shareId=" + _this.data.giftInfo.shareId + '&referee=' + _this.data.uid,
        imageUrl:indexShareImg || 'https://cdn.51chaidan.com/images/default/shareImg.jpg',
      }
    }else{

      return {
        title:app.signindata.titleShare ,
        path: "/pages/dismantlingbox/dismantlingbox?shareId=" + _this.data.giftInfo.shareId + '&referee=' + _this.data.uid,
        imageUrl:indexShareImg || 'https://cdn.51chaidan.com/images/default/shareImg.jpg',
      } 
    };

  
  },
  
  onShareTimeline:function(){
    var _this = this;
    var giftInfo = _this.data.giftInfo || {};
    var img = 'https://cdn.51chaidan.com/images/default/toyShow/toyshowShare.jpg';

    var indexShare = app.signindata.indexShare || [];
    var indexShareNum = Math.floor(Math.random() * indexShare.length) || 0;
    var indexShareImg = '';
    if(indexShare.length!=0 && indexShare[indexShareNum]){
      indexShareImg = indexShare[indexShareNum]+'?time=' + Date.parse(new Date());
    };

    return {
      title:app.signindata.titleShare ,
      imageUrl:indexShareImg || 'https://cdn.51chaidan.com/images/default/shareImg.jpg',
    }
  },  
  // 跳转一番赏列表
  toaRewarddeyails(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/page/secondpackge/pages/aRewardList/aRewardList?its=1"
    })
  },
  // 跳转门票抽选
  jumpluckyDraw(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/page/secondpackge/pages/luckyDraw/luckyDraw"
    })    
  },
  // 跳转门票激活码
  jumpbindTicket(e){
    wx.navigateTo({
      url: "/page/secondpackge/pages/bindTicket/bindTicket"
    })   
    
  },
  // 跳转品牌专区
  jumpbindexhibi(e){
    wx.navigateTo({
      url: "/page/secondpackge/pages/exhibition/exhibition?type=2"
    })   
  },
  jumpbrandD(w){
    var id = w.currentTarget.dataset.id || w.target.dataset.id || '';
    wx.navigateTo({
      url: "/page/secondpackge/pages/brandDetails/brandDetails?id=" + id + "&settlement=1"
    });
  },
  // 关注 和 点赞 函数
  followfun: function(w) {
    var _this = this;
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    var type = w.currentTarget.dataset.type || w.target.dataset.type || 0;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var informationListData = _this.data.informationListData || [];
    console.log('mod=community&operation=likeAttention&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&setType=' + type + '&id=' + id)
    var qqq = Dec.Aese('mod=community&operation=likeAttention&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&setType=' + type + '&id=' + id);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        console.log('关注=====',res)
        if (res.data.ReturnCode == 200) {
             _this.setData({
                 ['informationListData['+ind+'].isFocus'] : !informationListData[ind].isFocus
             });
        };
      }
    });
  },


})