var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();
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
    tabOneId:1,
    // tab two
    tabTwoId:1,

    priceBreakBox:false,
    // 联系人 名字好手机号
    contactsname:'',
    contactsphone:'',
    // 购买弹框
    buyabulletframe:false,
   
    banner:[],

    ticket:{},

    ticketTwo:[],
    ticketInstrut:false,
    ticketingInOne:'',
    ticketingInTwo:'',
    explainnum:1,
    realNameSystem:false

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
    this.setData({
      identity:identity,
      iid:identity[ind].id || ''
    });

  },

  // 
  buyingTickPay:function(){

    // 联系人 名字好手机号

    var _this = this;
    if(this.data.tabOneId == ''){
      app.showToastC('请选择场次')
      return false;
    } else if(this.data.tabTwoId == ''){
      app.showToastC('请选择票档')
      return false;
    };  


    var identity = _this.data.identity || [];
    var consignee = '';
    var idcard = '';
    var mobile = '';
    for(var i=0; i<identity.length; i++){
      if(identity[i].isCheck){
        consignee = identity[i].consignee;
        idcard = identity[i].idcard;
        mobile = identity[i].mobile;
        break;
      }
    };
    if(consignee == '' || idcard == ''){
      app.showToastC('请填写身份证')
      return false;
    };

    var qqq = Dec.Aese('mod=ticket&operation=buyTicket&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&consignee=' + consignee + '&idcard=' + idcard + '&date=' + _this.data.tabOneId + '&type=' + _this.data.tabTwoId +'&mobile=' + mobile);

    console.log('mod=ticket&operation=buyTicket&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&consignee=' + consignee + '&idcard=' + idcard + '&date=' + _this.data.tabOneId + '&type=' + _this.data.tabTwoId +'&mobile=' + mobile)

    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('提交订单',res)
        if (res.data.ReturnCode == 200) {

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
    wx.request({
      url: app.signindata.comurl + 'order.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
              wx.requestPayment({
                  'timeStamp': res.data.Info.timeStamp.toString(),
                  'nonceStr': res.data.Info.nonceStr,
                  'package': res.data.Info.package,
                  'signType': 'MD5',
                  'paySign': res.data.Info.paySign,
                  'success': function (res) {          
                      wx.redirectTo({
                        url: "/pages/dismantlingbox/dismantlingbox"
                      });

                   },
                  'fail':function(res){

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




  identityTipFun:function(){
     this.setData({
       identityTip:!this.data.identityTip,
       inputnamedata:'',
       inputidnumberdata:'',
       realNameSystem:false
     });
  },
  buyabframe:function(){
    this.setData({buyabulletframe:!this.data.buyabulletframe})
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
    console.log('num======obtain',num,obtain)
    // tab one
    if(obtain == 1){
      var ticket = _this.data.ticket || [];
      var ticketTwo = ticket[ind].listTicket || []; 
      var tabTwoId = '';
      var sumPrice = 0;
      for(var i=0 ; i< ticketTwo.length ; i++){
        if(ticketTwo[i].stock>0){
         tabTwoId = ticketTwo[i].type || '';
         sumPrice = ticketTwo[i].price || 0;
         break;
        };
      };
      _this.setData({
        tabOneId:num,
        ticketTwo:ticketTwo || [],
        tabTwoId:tabTwoId,
        seldate:ticket[ind].date || '',
        sumPrice:sumPrice
      })
    }else if(obtain == 2){ // tab two
      var ticketTwo = _this.data.ticketTwo || [];
      if(ticketTwo[ind] && ticketTwo[ind].stock <= 0){
        app.showToastC('库存不足');
        return false;
      };
      _this.setData({
        tabTwoId:num,
        sumPrice:ticketTwo[ind].price || 0
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
  },
  onLoadfun:function(){
    var _this = this;
    _this.setData({
      uid: app.signindata.uid,
      loginid: app.signindata.loginid,
      isProduce: app.signindata.isProduce,
      defaultinformation:app.signindata.defaultinformation||'',
    }); 

    _this.getData();
    _this.tigetData();
  },

  tigetData:function(){

    var _this = this;

    wx.request({
      url: 'https://cdn.51chaidan.com/produce/toyshowTicket.json',
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log('购票须知=============',res)
        _this.setData({
          ticketingInOne:res.data.rule || '',
          ticketingInTwo:res.data.tip || '',
          agreement:res.data.agreement || ''
        });
      }
    })
  },


  getData:function(){
    var _this = this;


    var q = Dec.Aese('mod=ticket&operation=getInfo&uid=' +_this.data.uid+'&loginid='+_this.data.loginid)

    console.log('mod=ticket&operation=getInfo&uid=' +_this.data.uid+'&loginid='+_this.data.loginid)

    wx.showLoading({title: '加载中...',mask:true});
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
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
          if(ticket && ticket.length != 0){
            tabOneId = ticket[0].day || '';
            seldate = ticket[0].date || '';
            ticketTwo = ticket[0].listTicket || [];
            for(var i=0 ; i< ticketTwo.length ; i++){
               if(ticketTwo[i].stock>0){
                tabTwoId = ticketTwo[i].type || '';
                sumPrice = ticketTwo[i].price || 0;
                break;
               };
            };
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
          _this.setData({
            banner:res.data.List.banner || [],
            ticket:ticket,
            identity:identity,
            ticketTwo:ticketTwo,
            tabOneId:tabOneId,
            tabTwoId:tabTwoId,
            iid:iid,
            detail:res.data.List.detail || [],
            sumPrice:sumPrice,
            seldate:seldate,
            // contactsname:res.data.Info.contact || '',
            // contactsphone:res.data.Info.mobile || ''
          });

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
    this.getData();
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
    return Dec.sharemc()    
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
      cancelText: '取消',
      confirmText: '确定',
      confirmColor:'#000',
      cancelColor: '#000',
      success (res) {
        if (res.confirm) {
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
         } else if (res.cancel) {
           console.log('用户点击取消按钮')
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
      cancelText: '取消',
      confirmText: '确定',
      confirmColor:'#000',
      cancelColor: '#000',
      success: function (res) {
        if (res.confirm) {
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



  }



})