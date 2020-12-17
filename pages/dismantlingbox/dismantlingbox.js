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

    movies:[],
    // 订阅上传id
    pid:0,
    page:0,
    liveind:0,
    goodsListThree:[],
    goodsListTwo:[],
    goodsListOne:[],
    liveListData:[],
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
    shunButBarData:[
      {name:'展会活动',tid:1},
      {name:'线上潮玩展',tid:2},
      {name:'票务信息',tid:3},
      {name:'品牌合作',tid:4},
      {name:'线下商品',tid:5}
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
    arr:[
      {x:3,y:6},
      {x:4,y:6},
      {x:5,y:6},
    ]
  },
  toggleAwardFun(){
    this.setData({
      isAwardBox:!this.data.isAwardBox
    })
  },
  // 跳转日历列表
  jumpCalendarList(){
    wx.navigateTo({ 
      url: "/page/secondpackge/pages/calendarList/calendarList"
    })
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
    // this.setData({havephoneiftr:!this.data.havephoneiftr});
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
            // _this.shareExhBen();
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

  
  jumpChouxuanHomepage(){
    wx.navigateTo({
      url: "/page/secondpackge/pages/chouxuanHomepage/chouxuanHomepage"
    });
  },
  jumpLuckyDraw(){
    wx.navigateTo({
      url: "/page/secondpackge/pages/luckyDraw/luckyDraw"
    });
  },
  // 跳转定位
  jumpposition:function(w){
    // var nowTime = new Date().getTime();
    // var isBuyingTickets = this.data.isBuyingTickets;
    // console.log('nowTime=====',nowTime)
    // if(isBuyingTickets && (nowTime/1000 > isBuyingTickets)){
      wx.navigateTo({
        url: "/page/secondpackge/pages/buyingTickets/buyingTickets"
      });
    // } else {

    //   var tid = w.currentTarget.dataset.tid || w.target.dataset.tid || 0;

    //   var query = wx.createSelectorQuery();
    //   query.select('#e' + tid).boundingClientRect();
    //   query.selectViewport().scrollOffset();
    //   query.exec(function(res) {
    //     if (res && res[0] && res[1]) {
    //       wx.pageScrollTo({
    //          scrollTop:( res[0].top+res[1].scrollTop-app.signindata.statusBarHeightMc||90 )-85,
    //          duration:300
    //       })
    //     }
    //   });

    //   var subscribe_data = w.currentTarget.dataset.subscribe_data;
    //   console.log(subscribe_data)
    //   this.setData({
    //     subscribedata:subscribe_data
    //   })
    //   app.comsubscribe(this)
    // }
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
    var whref = w.currentTarget.dataset.href || w.target.dataset.href;
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type||0;
    var imgurl = w.currentTarget.dataset.imgurl || w.target.dataset.imgurl || '';
    var wname = w.currentTarget.dataset.title || w.target.dataset.title || '美拆'; 
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

    // 是否认证手机号
    if(!_this.data.isMobileAuth){
      _this.data.isShareOrSub = false;
      _this.havephoneiftrfun();
      return false;
    };


    var eveid = w.currentTarget.dataset.eveid || w.target.dataset.eveid||1;
    var type = w.currentTarget.dataset.type || w.target.dataset.type||1;
    var index = w.currentTarget.dataset.index || w.target.dataset.index||0;
    var subscribedata = '';
    if(type==1){
       var goodsListOne = _this.data.goodsListOne;
       subscribedata = goodsListOne.toyShowSubscribe || '';
    }else if(type==2){
      var goodsListTwo = _this.data.goodsListTwo;
      subscribedata = goodsListTwo.toyShowSubscribe || '';
    }else if(type==3){
      var goodsListThree = _this.data.goodsListThree;
      subscribedata = goodsListThree.toyShowSubscribe || '';
    };
    _this.setData({
      subscribedata:subscribedata,
      id:eveid,
      typeEve:type,
      indexEve:index
    });
    _this.subscrfun();
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

    // 推送统计
    this.data.push_id = options.push_id || 0;

    this.onLoadfun();

    if(app.signindata.sceneValue==1154){
      
    }else{
      // 判断是否授权
      this.activsign();
    }

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
    // _this.commodityinformation(1,1);
    // // blibli
    // _this.commodityinformation(1,2);
    // // 直播商品
    // _this.commodityinformation(1,3);
    // // 直播列表
    // _this.liveList(1);

    // //  收货地址
    // _this.nextpagediao();

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
          app.showToastC('剩余库存不足');
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
            _this.setData({
              liveListData:liveListData
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
    //调取搜索关键词跳转对应列表数据
    wx.request({
      url: 'https://cdn.51chaidan.com/json/toyshowBrand.json',
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('媒体数据logo===',res)
        _this.setData({
          mediaBrandList:res.data || []
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
          // 品牌数据
          _this.brandJson();
          if (res.data.ReturnCode == 200) {
            if(num==1){
              var bannerList = res.data.List.bannerList || [];
              var brandList = res.data.List.brand || [];
              var calendarList = res.data.List.calendar || [];
              var isMobileAuth = res.data.Info.isMobileAuth || false;
              var countSubsribe = res.data.Info.countSubsribe || 0;
              _this.data.countdown = res.data.Info.endTime || '';
              _this.countdownbfun();
              _this.setData({
                bannerList:bannerList,
                calendarList,
                brandList,
                countSubsribe,
                isMobileAuth:isMobileAuth
              });
              // 是否是分享围观
              _this.shareReferee();
              
              var nowTime = new Date().getTime();
              var isBuyingTickets = res.data.Info.ticketTime;
              console.log('nowTime=====',nowTime)
              if(isBuyingTickets && (nowTime/1000 > isBuyingTickets)){
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
        },
  
      })
  },
  shareReferee:function(){
     var _this = this;
     if(_this.data.referee&&_this.data.uid&&_this.data.referee!=_this.data.uid){
        if(_this.data.isMobileAuth){
          // _this.shareExhBen();             
        }else{
          _this.data.isShareOrSub = true;
          // _this.havephoneiftrfun();
          // 展会福利
          // _this.exhibitionBenefits();
        };
     }else{
        // 展会福利
        // _this.exhibitionBenefits();
     };
  },
  // 商品信息 type 1为线上 2为blibli 3为直播
  commodityinformation:function(num,type){
      var _this = this
      wx.showLoading({
        title: '加载中...',
      })
      var q1 = Dec.Aese('mod=subscription&operation=goodsList&type=' + type + "&pid=" + _this.data.page + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid );
      console.log('mod=subscription&operation=goodsList&type=' + type + "&pid=" + _this.data.page)
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
                  var goodsList = res.data.List.goodsList || [];
                  var goodsListOne = {
                    toyShowSubscribe:toyShowSubscribe,
                    goodsList:goodsList
                  };
                  _this.setData({
                    goodsListOne:goodsListOne
                  })
                }else{
                  var goodsList = res.data.List.goodsList || [];
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
             if(type==2){
                if(num==1){
                  var toyShowSubscribe = res.data.Info.toyShowSubscribe || {};
                  var goodsList = res.data.List.goodsList || [];
                  var goodsListTwo = {
                    toyShowSubscribe:toyShowSubscribe,
                    goodsList:goodsList
                  };
                  _this.setData({
                    goodsListTwo:goodsListTwo
                  })
                }else{
                  var goodsList = res.data.List.goodsList || [];
                  if(goodsList&&goodsList.length!=0){
                    var goodsListTwo =  _this.data.goodsListTwo;
                    var goodsListAnd = goodsListTwo.goodsList.concat(goodsList);
                    goodsListTwo.goodsList = goodsListAnd;
                    _this.setData({
                      goodsListTwo:goodsListTwo
                    })
                  };
                };
             };
             if(type==3){
                if(num==1){
                    var toyShowSubscribe = res.data.Info.toyShowSubscribe || {};
                    var goodsList = res.data.List.goodsList || [];
                    var goodsListThree = {
                      toyShowSubscribe:toyShowSubscribe,
                      goodsList:goodsList
                    };
                    _this.setData({
                      goodsListThree:goodsListThree
                    })
                }else{
                    var goodsList = res.data.List.goodsList || [];
                    if(goodsList&&goodsList.length!=0){
                      var goodsListThree =  _this.data.goodsListTwo;
                      var goodsListAnd = goodsListThree.goodsList.concat(goodsList);
                      goodsListThree.goodsList = goodsListAnd;
                      _this.setData({
                        goodsListThree:goodsListThree
                      })
                    };
                };
             };
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
        if (res.authSetting['scope.userInfo']) {
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
        if (res.authSetting['scope.userInfo']) {
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
    // _this.commodityinformation(1,1);
    // // blibli
    // _this.commodityinformation(1,2);
    // // 直播商品
    // _this.commodityinformation(1,3)
    // // 直播列表
    // _this.liveList(1);
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
  onShareAppMessage: function () {
    var _this = this;
    var giftInfo = _this.data.giftInfo || {};
    var img = 'https://cdn.51chaidan.com/images/default/toyShow/toyshowShare.jpg';
    return {
      title:'12月18日 20:00准时开票！',
      path: "/pages/dismantlingbox/dismantlingbox?shareId=" + _this.data.giftInfo.shareId + '&referee=' + _this.data.uid,
      imageUrl:app.signindata.indexShareImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
    }   
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
      title:'12月18日 20:00准时开票！',
      imageUrl:indexShareImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
    }
  },  
})