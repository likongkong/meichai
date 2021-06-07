var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();
var WxParse = require('../../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '购票', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,


    identityTip:false,
    // 姓名
    inputnamedata:'',
    // 省份证号
    inputidnumberdata:'',
    // 身份id
    iid:'',
    // tab one
    tabOneId:'',
    // tab two
    tabTwoId:'',

    priceBreakBox:false,
    // 联系人 名字好手机号
    contactsname:'',
    contactsphone:'',
    // 购买弹框
    buyabulletframe:false,
   
    banner:[],

    ticket:'',

    ticketTwo:[],
    ticketInstrut:false,
    ticketingInOne:'',
    ticketingInTwo:'',
    explainnum:1,
    realNameSystem:false,

    buyNowOrOppor:false,
    isSubscribe:false,

    showSubscription:true,
    cartId:'',
    is_subscribe:false,
    pfiii:false,
    tid:1,
    is_gdbp_display:false,
    is_anPos_position:false,
    is_ziaprtp:false,
    ziaprtp_url:'',
    isanPosTop:false

  },
  isziaprtpfun(w){
    var url = w.currentTarget.dataset.url || w.target.dataset.url||0;
    this.setData({
      is_ziaprtp:!this.data.is_ziaprtp,
      ziaprtp_url:url
    })
  },
  onPageScroll(e) {
    let scrollTop = e.scrollTop;

    if(scrollTop>this.data.anPosTop){
       this.setData({
          is_gdbp_display:true,
          isanPosTop:true,
       })
    }else{
      this.setData({
        isanPosTop:false,
      })
    };
    
    if(scrollTop <= 0 && this.data.tid !=1){
       this.setData({
          tid:1
       })
    };

    if(scrollTop > this.data.windowHeight - 53){
      this.setData({is_anPos_position:true})
    }else{
      this.setData({is_anPos_position:false})
    };



    // var space = this.data.bottomtop - this.data.navbtn

    // if (e.scrollTop > space) {
    //   this.setData({
    //     ishowsusp: true
    //   })
    // } else {
    //   this.setData({
    //     ishowsusp: false
    //   })
    // }

  },
  // 锚点定位
  position:function(w){
    var tid = w.currentTarget.dataset.tid || w.target.dataset.tid || 0;
    this.setData({tid:tid})
    if(tid == 3 && !this.data.is_gdbp_display){
      this.setData({
        is_gdbp_display:true
      });
      setTimeout(()=>{
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
      },500)
    }else{
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
    };


},

  // 预填信息 弹框
  pfiiifun:function(){
    this.setData({
      pfiii:!this.data.pfiii
    })
  },
  // 订阅授权
  subscrfun:function(){
    var _this = this;
    _this.data.id = _this.data.tabOneId;
    _this.subscrfuna();
  },

  // 拉起订阅
  subscrfuna: function (num) {
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
                _this.setData({
                  is_subscribe:true
                });
                console.log(1111)
                if(num == 1){
                  app.subscribefun(_this, 1, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
                }else{
                  app.subscribefun(_this, 0, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
                };
                
                if (is_show_modal) {
                  // _this.subshowmodalTip();
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


  realNameSysfun:function(){
    this.setData({
      realNameSystem:!this.data.realNameSystem
    })
  },
  ticketInstrutfun:function(w){
    var ind = w.currentTarget.dataset.ind || 0;
    if(ind<=0){
      this.setData({ticketInstrut:!this.data.ticketInstrut})
    } else {
      this.setData({ticketInstrut:!this.data.ticketInstrut,explainnum:ind})
    };
    
  },

  identitysel:function(w){

    var ind = w.currentTarget.dataset.ind || 0;
    var identity = this.data.identity || [];
    for(var i=0 ;i<identity.length; i++){
        identity[i].isCheck = false;
    };
    identity[ind].isCheck = true;
    // clearInterval(this.data.timer)  
    this.setData({
      identity:identity,
      iid:identity[ind].id || '',
    });

  },
  
  buyingTickPayOne:function(){
    var _this = this;
    var tabTwoId = _this.data.tabTwoId;
    if(tabTwoId==1){
      _this.buyingTickPay();
    }else{
      var ticketTwo = _this.data.ticketTwo || [];
      var subTitle = '';
      for(var i=0; i<ticketTwo.length; i++){
         if(ticketTwo[i].type == tabTwoId){
          subTitle = ticketTwo[i].subTitle || '';
          break;
         };
      };


      wx.showModal({
        title: '',
        content:  '凭本人身份证现场领取'+subTitle,
        cancelText: '确定',
        confirmText: '取消',
        confirmColor:'#000',
        cancelColor: '#000',
        success (res) {
          if (res.cancel) {
            _this.buyingTickPay();
          };
        }
      })
    }
  },
  
  randomsort(a, b) {
    return Math.random()>.5 ? -1 : 1;
    //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
  },

  // 
  buyingTickPay:function(){

    // 联系人 名字好手机号

    var _this = this;



    var identity = _this.data.identity || [];
    var consignee = '';
    var idcard = '';
    var mobile = '';
    for(var i=0; i<identity.length; i++){
      if(identity[i].isCheck){
        consignee = identity[i].consignee;
        idcard = identity[i].idcard;
        _this.data.idcard = identity[i].idcard
        mobile = identity[i].mobile;
        break;
      }
    };
    if(consignee == '' || idcard == ''){
      app.showToastC('请填写身份证')
      return false;
    };


    if(this.data.tabOneId == ''){
      app.showToastC('请选择场次')
      return false;
    } else if(this.data.tabTwoId == ''){
      app.showToastC('请选择票档')
      return false;
    } 
    console.log(app.signindata.placeAnOrderOne,app.signindata.placeAnOrderTwo)
    if(_this.data.tabTwoId == 1){

      console.log(app.signindata.placeAnOrderOne , app.signindata.placeAnOrderOne.cartId , app.signindata.placeAnOrderOne.tabTwoId , _this.data.tabTwoId , app.signindata.placeAnOrderOne.tabOneId , _this.data.tabOneId , app.signindata.placeAnOrderOne.idcard , _this.data.idcard)

      if(app.signindata.placeAnOrderOne && app.signindata.placeAnOrderOne.cartId && app.signindata.placeAnOrderOne.tabTwoId == _this.data.tabTwoId && app.signindata.placeAnOrderOne.tabOneId == _this.data.tabOneId && app.signindata.placeAnOrderOne.idcard == _this.data.idcard){
        this.paymentmony(app.signindata.placeAnOrderOne.cartId)
        return false;
      };  
    }else{

      console.log(app.signindata.placeAnOrderTwo , app.signindata.placeAnOrderTwo.cartId , app.signindata.placeAnOrderTwo.tabTwoId , _this.data.tabTwoId , app.signindata.placeAnOrderTwo.tabOneId , _this.data.tabOneId , app.signindata.placeAnOrderTwo.idcard , _this.data.idcard)

      if(app.signindata.placeAnOrderTwo && app.signindata.placeAnOrderTwo.cartId && app.signindata.placeAnOrderTwo.tabTwoId == _this.data.tabTwoId && app.signindata.placeAnOrderTwo.tabOneId == _this.data.tabOneId && app.signindata.placeAnOrderTwo.idcard == _this.data.idcard){
        this.paymentmony(app.signindata.placeAnOrderTwo.cartId)
        return false;
      }
    }; 

    var tabTwoId = _this.data.tabTwoId;
    var question = _this.data.QA[tabTwoId];
    if(question != undefined){
      var randomQuestion = question[Math.floor((Math.random()*question.length))];
      randomQuestion.option.sort(_this.randomsort);
      console.log('正确答案==',randomQuestion.answer)
      wx.showModal({
        title: '限购答题',
        content: randomQuestion.question,
        cancelText: randomQuestion.option[0].toString(),
        confirmText: randomQuestion.option[1].toString(),
        confirmColor:'#000',
        cancelColor: '#000',
        success: function (res) {
          if (res.confirm) {
            if (randomQuestion.option[1] == randomQuestion.answer){
              _this.buyingTickPayTwo(consignee,idcard,mobile);
            }else{
              app.showToastC('回答错误');
              return false;
            }
          }else{
            if (randomQuestion.option[0] == randomQuestion.answer) {
              _this.buyingTickPayTwo(consignee,idcard,mobile);
            }else{
              app.showToastC('回答错误');
              return false;
            }            
          }
        }
      })
    }else{
      _this.buyingTickPayTwo(consignee,idcard,mobile);
    }
  },

  buyingTickPayTwo(consignee,idcard,mobile){
    var _this = this;
    console.log(consignee,idcard,mobile)
    var qqq = Dec.Aese('mod=ticket&operation=buyTicket&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&consignee=' + consignee + '&idcard=' + idcard + '&date=' + _this.data.tabOneId + '&type=' + _this.data.tabTwoId +'&mobile=' + mobile);
    console.log('mod=ticket&operation=buyTicket&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&consignee=' + consignee + '&idcard=' + idcard + '&date=' + _this.data.tabOneId + '&type=' + _this.data.tabTwoId +'&mobile=' + mobile)
    wx.showLoading({ title: '加载中...',mask:true }) 
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading()
        console.log('提交订单',res)
        if (res.data.ReturnCode == 200) {
          if(_this.data.tabTwoId == 1){
            app.signindata.placeAnOrderOne = {
                cartId:res.data.Info.cartId,
                idcard:idcard,
                time:Date.parse(new Date()) / 1000,
                tabOneId:_this.data.tabOneId,
                tabTwoId:_this.data.tabTwoId
            };
          }else{
            app.signindata.placeAnOrderTwo = {
                cartId:res.data.Info.cartId,
                idcard:idcard,
                time:Date.parse(new Date()) / 1000,
                tabOneId:_this.data.tabOneId,
                tabTwoId:_this.data.tabTwoId
            };
          };


          _this.paymentmony(res.data.Info.cartId)

        }else{
          if(res.data.Msg){
            wx.showModal({
              title: '提示',
              content: res.data.Msg,
              showCancel: false,
              success: function (res) { }
            })
          };
        };
      }
    }) 
  },

  // 微信支付
  paymentmony:function(cart_id){
    var _this = this; 

    console.log('微信支付===', app.signindata.comurl + 'order.php?'+'mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + cart_id + '&xcx=1' + '&openid=' + app.signindata.openid)

    var q = Dec.Aese('mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + cart_id + '&xcx=1' + '&openid=' + app.signindata.openid)
    wx.showLoading({ title: '加载中...',mask:true }) 
    wx.request({
      url: app.signindata.comurl + 'order.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
              wx.requestPayment({
                  'timeStamp': res.data.Info.timeStamp.toString(),
                  'nonceStr': res.data.Info.nonceStr,
                  'package': res.data.Info.package,
                  'signType': 'MD5',
                  'paySign': res.data.Info.paySign,
                  'success': function (res) {          
                      wx.showModal({
                        title: '',
                        content: '恭喜您，门票购票成功\n请在门票规定入场时间内\n持本人身份证入场\n详情请到“我的”-“订单”中查看',
                        cancelText: '查看订单',
                        confirmText: '继续购买',
                        confirmColor:'#000',
                        cancelColor: '#000',
                        success (res) {
                          if (res.confirm) {
                              _this.setData({
                                buyabulletframe:false
                              });
                          } else if (res.cancel) {
                              wx.navigateTo({
                                url: "/pages/myorder/myorder?tabnum=3"
                              });
                              _this.setData({
                                buyabulletframe:false
                              });
                          }
                        }
                      });
                      if(_this.data.tabTwoId == 1){
                          app.signindata.placeAnOrderOne = '';
                      }else{
                          app.signindata.placeAnOrderTwo = '';
                      };

                   },
                  'fail':function(res){
                     
                      _this.dateformat()
                  },
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
        };   
      }
    })
  },


  identityTipFunjump:function(){
      wx.navigateTo({    
          url: "/page/secondpackge/pages/idCardVerification/idCardVerification"
      });
      this.setData({
        realNameSystem:false
      })
  },

  identityTipFun:function(){
     this.setData({
       identityTip:!this.data.identityTip,
       inputnamedata:'',
       inputidnumberdata:'',
       realNameSystem:false
     });
  },
  buyabframe:function(){
    if(this.data.tabTwoId == ''){
      app.showToastC('请选择票档')
      return false;
    };
    this.setData({
      buyabulletframe:!this.data.buyabulletframe,
    })
  },
  priceBreakBoxFun:function(){
    this.setData({
      priceBreakBox:!this.data.priceBreakBox
    }) 
  },
  tabObtainData:function(w){
    var _this = this;
    var num = w.currentTarget.dataset.num || 0;
    var ind = w.currentTarget.dataset.ind || 0;
    var obtain = w.currentTarget.dataset.obtain || 0;
    var buyNowOrOppor = false;
    var isSubscribe = false;
    console.log('num======obtain',num,obtain)
    // tab one
    if(obtain == 1){
      var ticket = _this.data.ticket || [];
      var ticketTwo = ticket[ind].listTicket || []; 
      var tabTwoId = '';
      var sumPrice = 0;
      // for(var i=0 ; i< ticketTwo.length ; i++){
      //   if(ticketTwo[i].stock>0 || ticketTwo[i].isFillChance){
      //    tabTwoId = ticketTwo[i].type || '';
      //    sumPrice = ticketTwo[i].price || 0;
      //    if(ticketTwo[i].isFillChance){
      //       buyNowOrOppor = true;
      //    };
      //    break;
      //   };
      // };

      tabTwoId = ticketTwo[0].type || '';
      sumPrice = ticketTwo[0].price || 0;

      if(ticketTwo[0].stock>0){
        buyNowOrOppor = false;
        isSubscribe = false;
      }else if(ticketTwo[0].isFillChance){
        buyNowOrOppor = true;
        isSubscribe = false;
      }else{
        isSubscribe = true;
      };

      _this.setData({
        tabOneId:num,
        ticketTwo:ticketTwo || [],
        tabTwoId:tabTwoId,
        seldate:ticket[ind].date || '',
        sumPrice:sumPrice,
        buyNowOrOppor:buyNowOrOppor,
        isSubscribe:isSubscribe,
        is_buy_place:false,
        is_subscribe:false
      })
    }else if(obtain == 2){ // tab two
      var ticketTwo = _this.data.ticketTwo || [];
      // if(ticketTwo[ind] && ticketTwo[ind].stock <= 0 && !ticketTwo[ind].isFillChance){
      //   app.showToastC('库存不足');
      //   return false;
      // };
      // if(ticketTwo[ind] && ticketTwo[ind].stock <= 0){
      //   buyNowOrOppor = true;
      // };

      console.log(app.signindata.placeAnOrderTwo)

      // 条件不成立
      var is_buy_place = false;
      if(app.signindata.placeAnOrderTwo && num == 2 && app.signindata.placeAnOrderTwo.tabTwoId == 2 && app.signindata.placeAnOrderTwo.tabOneId != _this.data.tabOneId){
        is_buy_place = true;
      };

      buyNowOrOppor
      if(ticketTwo[ind].stock>0){
        buyNowOrOppor = false;
        isSubscribe = false;
      }else if(ticketTwo[ind].isFillChance){
        if(app.signindata.placeAnOrderTwo && num == 2 && app.signindata.placeAnOrderTwo.tabTwoId == 2 && app.signindata.placeAnOrderTwo.tabOneId == _this.data.tabOneId){
          buyNowOrOppor = false;
        }else{
          buyNowOrOppor = true;
        };
        isSubscribe = false;
      }else{
        isSubscribe = true;
      };

      _this.setData({
        tabTwoId:num,
        sumPrice:ticketTwo[ind].price || 0,
        buyNowOrOppor:buyNowOrOppor,
        isSubscribe:isSubscribe,
        is_buy_place:is_buy_place,
        is_subscribe:false
      });

    };
    
  },
  // 联系人姓名 input 值改变
  contactsChangen: function (e) {
    this.setData({contactsname: e.detail.value});
  },    
  // 联系人手机号
  contactsChangep: function (e) {
    this.setData({contactsphone: e.detail.value});
  }, 

  // 真实姓名 input 值改变
  inputnameChange: function (e) {
    this.setData({inputnamedata: e.detail.value});
  },    
  // 身份证号
  inputidChange: function (e) {
    this.setData({inputidnumberdata: e.detail.value});
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否授权
    this.activsign();
    // 推送统计
    this.data.push_id = options.push_id || 0;

  },
  onLoadfun:function(){
    var _this = this;
    _this.setData({
      uid: app.signindata.uid,
      loginid: app.signindata.loginid,
      isProduce: app.signindata.isProduce,
      defaultinformation:app.signindata.defaultinformation||'',
      isNeedUserInfo:app.signindata.isNeedUserInfo
    }); 

    _this.getData();
    _this.tigetData();
    _this.toyShowbrandJson();
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
  tigetData:function(){

    var _this = this;

    wx.request({
      url: 'https://cdn.51chaidan.com/produce/toyshowTicket.json?time='+app.signindata.appNowTime,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        _this.setData({
          ticketingInOne:res.data.rule || '',
          ticketingInTwo:res.data.tip || ''
        });
      }
    })

    wx.request({
      url: 'https://cdn.51chaidan.com/produce/ticketsLotto.json?time='+app.signindata.appNowTime,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('规则==========',res)
        _this.setData({
          agreement:res.data.clause || ''
        });
      }
    })


  },


  getData:function(){
    var _this = this;
    var nowTime = new Date().getTime();
    _this.setData({
      nowTime:parseInt(nowTime/1000)
    })
    var q = Dec.Aese('mod=ticket&operation=getInfo&uid=' +_this.data.uid+'&loginid='+_this.data.loginid + '&push_id='+_this.data.push_id)

    console.log('mod=ticket&operation=getInfo&uid=' +_this.data.uid+'&loginid='+_this.data.loginid + '&push_id='+_this.data.push_id)

    wx.showLoading({title: '加载中...',mask:true});
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        _this.data.push_id =  0;

        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log('getData=============',res)
        if (res.data.ReturnCode == 200) {
          var ticket = res.data.List.ticket || [];
          var ticketTwo = [];
          var tabTwoId = '';
          var tabOneId = '';
          var iid = '';
          var seldate = '';
          var sumPrice = 0;
          var buyNowOrOppor = false;
          var isSubscribe = false;
          var is_buy_place = false;
          if(ticket && ticket.length != 0){
            console.log(_this.data.tabOneId)
            if(_this.data.tabOneId){

              for(var i=0; i< ticket.length;i++){
                 if(_this.data.tabOneId == ticket[i].day){
                    tabOneId = ticket[i].day || '';
                    seldate = ticket[i].date || '';
                    ticketTwo = ticket[i].listTicket || [];
                 };
              };

              var ind = 0;
              for(var j=0;j<ticketTwo.length;j++){
                  if(_this.data.tabTwoId == ticketTwo[j].type){
                    tabTwoId = ticketTwo[j].type || '';
                    sumPrice = ticketTwo[j].price || 0;
                    ind = j;
                  };
              };


              if(app.signindata.placeAnOrderTwo && _this.data.tabTwoId == 2 && app.signindata.placeAnOrderTwo.tabTwoId == 2 && app.signindata.placeAnOrderTwo.tabOneId != _this.data.tabOneId){
                is_buy_place = true;
              };
  
              if(ticketTwo[ind].stock>0){
                buyNowOrOppor = false;
                isSubscribe = false;
              }else if(ticketTwo[ind].isFillChance){
                // 条件不成立
                if(app.signindata.placeAnOrderTwo && _this.data.tabTwoId == 2 && app.signindata.placeAnOrderTwo.tabTwoId == 2 && app.signindata.placeAnOrderTwo.tabOneId == _this.data.tabOneId){
                  buyNowOrOppor = false;
                }else{
                  buyNowOrOppor = true;
                };
                // buyNowOrOppor = true;
                isSubscribe = false;
              }else{
                isSubscribe = true;
              };
            }else{

              var is_value = true;
              for(var i=0; i< ticket.length;i++){
                  if(ticket[i].listTicket && ticket[i].listTicket[0] && ticket[i].listTicket[0].stock > 0){
                      tabOneId = ticket[i].day || '';
                      seldate = ticket[i].date || '';
                      ticketTwo = ticket[i].listTicket || [];
                      is_value = false;
                      break;
                  };
              };

              if(is_value){
                tabOneId = ticket[0].day || '';
                seldate = ticket[0].date || '';
                ticketTwo = ticket[0].listTicket || [];
              };

              tabTwoId = ticketTwo[0].type || '';
              sumPrice = ticketTwo[0].price || 0;
  
              if(ticketTwo[0].stock>0){
                buyNowOrOppor = false;
                isSubscribe = false;
              }else if(ticketTwo[0].isFillChance){
                buyNowOrOppor = true;
                isSubscribe = false;
              }else{
                isSubscribe = true;
              };
            }


            // for(var i=0 ; i< ticketTwo.length ; i++){
            //    if(ticketTwo[i].stock>0 || ticketTwo[i].isFillChance){
            //     tabTwoId = ticketTwo[i].type || '';
            //     sumPrice = ticketTwo[i].price || 0;
            //     if(ticketTwo[i].isFillChance){
            //       buyNowOrOppor = true;
            //     };
            //     break;
            //    };
            // };

          };
          var identity = res.data.List.identity || [];
          if(identity && identity.length != 0){
            for(var i=0; i<identity.length ;i++){
              identity[i].isCheck = false;
              identity[i].idcarddis = identity[i].idcard.replace(/^(.{4})(?:\w+)(.{4})$/, "$1**********$2");
              identity[i].mobiledis = identity[i].mobile.replace(/^(.{3})(?:\w+)(.{3})$/, "$1*****$2");
            };
            identity[0].isCheck = true;
            iid = identity[0].id || '';
          }else{
            _this.realNameSysfun();
          };

          var nowTime = new Date().getTime();
          var ticketTime = res.data.Info.ticketTime || 0;
          console.log('nowTime=====',nowTime);

          var showSubscription = true;
          console.log(nowTime/1000 > ticketTime)
          if(ticketTime && (nowTime/1000 > ticketTime)){
            showSubscription = false
          };

          console.log('showSubscription=========',tabOneId,seldate)

          var goods_desc_poster = res.data.List.goods_desc_poster || [];
          var goods_desc_brand_poster = res.data.List.goods_desc_brand_poster || [];
          _this.setData({
            goods_desc_brand_poster:goods_desc_brand_poster,
            goods_desc_poster:goods_desc_poster,
            showSubscription:showSubscription,
            buyNowOrOppor:buyNowOrOppor,
            banner:res.data.List.banner || [],
            ticket:ticket,
            QA:res.data.List.QA,
            identity:identity,
            ticketTwo:ticketTwo,
            tabOneId:tabOneId,
            tabTwoId:tabTwoId,
            iid:iid,
            detail:res.data.List.detail || [],
            sumPrice:sumPrice,
            seldate:seldate,
            subscribedata:res.data.Info.subscribe || [],
            isSubscribe:isSubscribe,
            is_buy_place:is_buy_place

            // contactsname:res.data.Info.contact || '',
            // contactsphone:res.data.Info.mobile || ''
          });

          // 商品详情 
          if(res.data.Info.goods_desc){
            WxParse.wxParse('article', 'html', decodeURIComponent(res.data.Info.goods_desc.replace(/\+/g, ' ')), _this, 0);
          };


          wx.createSelectorQuery().select('#anPos').boundingClientRect(function(rect){
            _this.setData({
              anPosTop:rect.top
            })
          }).exec()
          
          

        } else {
          if(res.data.Msg){
            wx.showToast({
              title: res.data.Msg,
              icon: 'none',
              duration: 1500
            })
          };
        }
      }
    })
  },

  activsign: function () {
    // 判断是否授权 
    var _this = this;
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
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
            _this.onLoadfun();
          } else {
            app.signin(_this);
          }
        } else {
          _this.setData({
            tgabox: false,
            signinlayer: false
          })
          console.log()
          // '没有授权 统计'
          app.userstatistics(42);
          _this.onLoadfun();
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
      var nowData = Date.parse(new Date()) / 1000;
      if(app.signindata.placeAnOrderTwo && app.signindata.placeAnOrderTwo.time){
         if(nowData-app.signindata.placeAnOrderTwo.time > 60){
          app.signindata.placeAnOrderTwo = '';
          clearInterval(this.data.timer) 
         };
      };
      if(app.signindata.placeAnOrderOne && app.signindata.placeAnOrderOne.time){
          if(nowData - app.signindata.placeAnOrderOne.time > 60){
            app.signindata.placeAnOrderOne = '';
            clearInterval(this.data.timer) 
          };
      };

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
      // 商品详情
      this.getData();
    })


  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  clicktganone: function () {
    this.setData({ tgabox: false })
  }, 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.sharemc()    
  },

  // 录入身份信息
  upIdentity:function(){
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
    } else if (this.data.inputidnumberdata.length!=18){
      app.showToastC('身份证号位数不正确');
      return false;
    } else if (this.data.contactsphone == '') {
      app.showToastC('手机号不能为空')
      return false;
    } else if (this.data.contactsphone.length < 11) {
      app.showToastC('手机号长度有误')
      return false;
    }else{}; 


    wx.showModal({
      title: '身份信息确认',
      content: '姓名:'+_this.data.inputnamedata + '\n手机号:'+_this.data.contactsphone +  '\n身份证号:'+_this.data.inputidnumberdata ,
      cancelText: '确定',
      confirmText: '取消',
      confirmColor:'#000',
      cancelColor: '#000',
      success (res) {
        if (res.cancel) {
            var q = Dec.Aese('mod=ticket&operation=addIdentity&consignee='+_this.data.inputnamedata+'&idcard='+_this.data.inputidnumberdata + '&uid=' + _this.data.uid+'&loginid=' + _this.data.loginid+'&mobile=' + _this.data.contactsphone)

            console.log('mod=ticket&operation=addIdentity&consignee='+_this.data.inputnamedata+'&idcard='+_this.data.inputidnumberdata + '&uid=' + _this.data.uid+'&loginid=' + _this.data.loginid+'&mobile=' + _this.data.contactsphone)
        
            wx.showLoading({title: '加载中...',mask:true});
        
            wx.request({
              url: app.signindata.comurl + 'toy.php' + q,
              method: 'GET',
              header: { 'Accept': 'application/json' },
              success: function (res) {
                wx.hideLoading();
                wx.stopPullDownRefresh();
                console.log('录入身份信息=======',res)
                if (res.data.ReturnCode == 200) {
                  var identityarr = _this.data.identity || [];
                  var identity = res.data.Info.identity || '';
                  var iid = '';
                  if(identityarr && identityarr.length != 0){
                    for(var i=0; i<identityarr.length ;i++){
                      identityarr[i].isCheck = false;
                    };
                  };
        
                  if(identity){
                    identity.isCheck = true;
                    identity.idcarddis = identity.idcard.replace(/^(.{4})(?:\w+)(.{4})$/, "$1**********$2");
                    identity.mobiledis = identity.mobile.replace(/^(.{3})(?:\w+)(.{3})$/, "$1*****$2");
                    iid = identity.id || '';
                    identityarr.push(identity);
                  };
                  _this.setData({
                    identity: identityarr || [],
                    inputnamedata:'',
                    inputidnumberdata:'',
                    contactsphone:'',
                    iid : iid
                  });
                  _this.identityTipFun();
                } else {
        
                  _this.setData({
                    inputnamedata:'',
                    inputidnumberdata:'',
                  });
                  _this.identityTipFun();
        
                  if(res.data.Msg){
                    wx.showToast({
                      title: res.data.Msg,
                      icon: 'none',
                      duration: 1500
                    })
                  };
                }
              }
            })
         } else if (res.confirm) {
           
         }
       }
    })

    
  },
  // 删除id 
  deleteIdent:function(w){

    var _this = this;
    var ind = w.currentTarget.dataset.ind || 0;
    var identity = this.data.identity || [];
    var queData = identity[ind] || {};

    wx.showModal({
      title: '提示',
      content: '确定要删除此条信息吗',
      cancelText: '确定',
      confirmText: '取消',
      confirmColor:'#000',
      cancelColor: '#000',
      success: function (res) {
        if (res.cancel) {
            var q = Dec.Aese('mod=ticket&operation=delIdentity&id='+ queData.id + '&uid=' + _this.data.uid+'&loginid=' + _this.data.loginid)
            console.log('mod=ticket&operation=delIdentity&id='+ queData.id + '&uid=' + _this.data.uid+'&loginid=' + _this.data.loginid)
            wx.showLoading({title: '加载中...',mask:true});
            wx.request({
              url: app.signindata.comurl + 'toy.php' + q,
              method: 'GET',
              header: { 'Accept': 'application/json' },
              success: function (res) {
                wx.hideLoading();
                wx.stopPullDownRefresh();
                console.log('删除身份信息=======',res)
                if (res.data.ReturnCode == 200) {
                  wx.showToast({
                    title: '删除成功',
                    icon: 'none',
                    duration: 1500
                  })    
                  _this.setData({
                    cartId:''
                  })    
                  if(queData.isCheck){
                    identity.splice(ind,1);
                    var iid = '';
                    if(identity && identity.length != 0){
                      identity[0].isCheck = true;
                      iid = identity[0].id;
                    };
                    _this.setData({
                      identity: identity || [],
                      iid : iid
                    });
                  }else{
                    identity.splice(ind,1);
                    _this.setData({
                      identity: identity || []
                    });
                  }
        
                } else {
                  if(res.data.Msg){
                    wx.showToast({
                      title: res.data.Msg,
                      icon: 'none',
                      duration: 1500
                    })
                  };
                }
              }
            })
        }else{
           
        }
      }
    })



  },
  // 时间格式化输出，将时间戳转为 倒计时时间
  dateformat: function (micro_second) {
    var _this = this;
    clearInterval(_this.data.timer)
    //总的秒数 
    var second = 60;
    _this.data.timer = setInterval(function () {
        if (second > 0) {
          second --;
          console.log(second)
        } else if (second <= 0) {
          
          clearInterval(_this.data.timer) 
          app.signindata.placeAnOrderOne = '';
          app.signindata.placeAnOrderTwo = '';
          setTimeout(()=>{
            _this.getData();
          },150)
          
        }
    }.bind(_this), 1000);
  },
  // 更新用户信息
  getUserProfile(w){
    var _this = this;
    console.log(1111111)
    app.getUserProfile((res,userInfo) => {
       _this.setData({
          isNeedUserInfo:false
       });
       app.signindata.isNeedUserInfo = false; 
    });
  },


})