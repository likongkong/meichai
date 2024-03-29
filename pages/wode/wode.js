var Dec = require('../../common/public.js');//aes加密解密js
var api = require("../../utils/api.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 接口地址
    comurl: app.signindata.comurl,
    // 图片地址
    zdyurl: Dec.zdyurl(),
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    appNowTime: app.signindata.appNowTime,
    // 判断是ios或者android
    iftriosorand: app.signindata.iftriosorand,    
    store_id: '',
    istit:false,
    istitnex:true,
    gender:0,
    // 用户图片
    avatarUrl:'../images/pic_head.png',
    // 用户名称
    nickName:'',
    // 待付款
    nonpayment:0,
    // 待拆单数
    nonunpack:0,
    // 待发货数
    nonsend:0,
    // 待收货数
    nonreceive:0,
    // 完成数
    finished: 0,
    // 售后数
    after_sale: 0,
    no_read: 0,
    no_read_no: 0,
    // 提现金额
    putforwardmoney:0,
    // 最佳合伙人
    partner:[],
    // 购物车显示数据
    shopnum: 0,
    // 授权弹框
    tgabox: false,
    // 微信号码
    wxnum:'',
    // 我的钱包数据
    point:0,
    B: false,
    temporary_store_id:'',
    // 判断美拆 or 店铺
    iftrstor:0,
    iftr_wx:false,
    // 版本号
    versionnumber: app.signindata.versionnumber,
    // 适配苹果X
    isIphoneX: app.signindata.isIphoneX,
    // 随机显示复制背景颜色
    wxcopybg:1 ,
    //公告标题
    notice_title: "",
    //公告链接
    notice_url: "",
    //公告类型
    notice_type: "",
    defaultinformation: "",
    // 晒单数量
    dryinglistnum: 0,
    isProduce: app.signindata.isProduce,
    c_title: '',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90, 
    // 是否授权
    signinlayer:true,
    windowHeight: app.signindata.windowHeight - 65 - wx.getStorageSync('statusBarHeightMc')||0,
    isweekend:false,
    isweekendtip:false,
    businesscooperation:false,
    cliptxt:'pili@51chaidan.com',
    awasustipimages:false,
    luckyValue:0,
    // 抽盒金
    blindbox_money:0,
    // 是否请求完成
    requestCompleted:false,
    showVipStatus:1,
    isSettledImg:true,
    // 审核状态
    brandSettledStatus:0,
    isAddNewEventMask:false,
    isSettledTypeMask:false
  },
  jinqingqidai(e){
    let type = e.currentTarget.dataset.type;
    if(type){
      app.comjumpwxnav(type,this.data.brand_id,'','')
    }else{
      app.showToastC('敬请期待')
    };
  },
  toggleAddNewEventMask(){
    this.setData({
      isAddNewEventMask: !this.data.isAddNewEventMask
    })
  },
  hideBrandSettledSuccessMask(){
    this.setData({
      brandSettledStatus: 5
    })
  },
  closeSettledImg(){
    this.setData({
      isSettledImg: false
    })
  },
  // 入驻类型弹框显示隐藏
  toggleSettledTypeMask(){
    this.setData({
      isSettledTypeMask: !this.data.isSettledTypeMask
    })
  },
  // 更新用户信息
  getUserProfileSettled(w){
    let progressNum = w.currentTarget.dataset.num;
    app.getUserProfile((res,userInfo) => {
        this.setData({
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          gender: userInfo.gender,
          istitnex: false,
          istit: true,
        });
        if(progressNum == 1){
          this.setData({
            isSettledTypeMask: true
          })
        }else{
          this.comjumpwxnav(w)
        }
    },'',1)
  },
  jumpSettled(e){
    let type = e.currentTarget.dataset.type;
    let whref = e.currentTarget.dataset.whref;
    this.setData({
      isSettledTypeMask: false
    })
    app.comjumpwxnav(type,whref)
  },
  comjumpwxnav(e){
    let type = e.currentTarget.dataset.type;
    let num = e.currentTarget.dataset.num;
    let whref = e.currentTarget.dataset.whref;
    this.setData({
      isAddNewEventMask:false
    })
    if(num && num == 1){
      this.setData({
        isSettledTypeMask: true
      })
    }else{
      app.comjumpwxnav(type,whref)
    } 
  },
  jumpVipPrivilegePage(){
    wx.navigateTo({  
      url: "/page/secondpackge/pages/vipPrivilegePage/vipPrivilegePage?data="+JSON.stringify(this.data.vipPrerogativeStyle)
    })
  },
  jumpVipPage(){
    app.comjumpwxnav(9021,'','');
  },
   // 订阅授权
  subscrfun:function(){
    var _this = this;
    app.comsubscribe(_this);
  },
  // 开通VIP
  openingVip:function(){

    app.showToastC('敬请期待');
    return false;
    var _this = this;
    var qqq = Dec.Aese('mod=getinfo&operation=vipPay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);

    console.log(app.signindata.comurl + 'order.php?' +'mod=getinfo&operation=vipPay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)

    wx.request({
      url: app.signindata.comurl + 'order.php' + qqq,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('开通VIP',res)
        if (res.data.ReturnCode == 200) {

           _this.paymentmony(res.data.Info.cart_id)
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

                   },
                  'fail':function(res){

                   },
                  'complete': function (res) {}
                })
        }else{       
          app.showModalC(res.data.Msg || res.data.msg || '');
        };   
      }
    })
  },
  wodesblist:function(){
    app.comjumpwxnav(988,'','','')
  },
  awasustipimages: function () {
    this.setData({
      awasustipimages: !this.data.awasustipimages
    })
  },
  businesscooperationfun:function(){
    this.setData({
      businesscooperation: !this.data.businesscooperation
    })
  },
  businesscooperationfunfz:function(){
    var _this = this;
    wx.setClipboardData({
      data: _this.data.cliptxt||'',
      success: function (res) {
        app.showToastC('复制成功');
      }
    });
    this.businesscooperationfun();
  },
  isweekendfun:function(){
     this.setData({
       isweekendtip: !this.data.isweekendtip
     })
  },
  isWeekEnd: function () {
    var weekArray = new Array("日", "一", "二", "三", "四", "五", "六");
    var date = new Date();
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var evedate = year + '/' + month + '/' + day;
    var week = weekArray[new Date(evedate).getDay()];
    var isweekend = false;
    if (week == '日' || week =='六'){
      isweekend = true;
    } else if (week == '五'){
      if (hour>=20){
        isweekend = true;
      };
    } else if (week == '一') {
      if (hour < 10) {
        isweekend = true;
      };
    };
    this.setData({
      isweekend: isweekend
    })

  },
  // 我的订单
  myorderfun:function(e){
    var num = e.currentTarget.dataset.tabnum;
    wx.navigateTo({  
      url: "/pages/myorder/myorder?tabnum=" + num
    });
  },
  // 跳转客服聊天
  jumpTimDetail(e){
    app.getUserProfile((res,userInfo) => {
        wx.navigateTo({  
          url: "/page/settled/pages/afterSaleService/afterSaleService"
        });      
    })
  },
  // 地址管理
  addressmanagement:function(){
    wx.navigateTo({ 
      url: "/pages/addressmanagement/addressmanagement"
    });
  },
  //  编辑信息
  personaldata:function(){
    wx.navigateTo({
      url: "/pages/personaldata/personaldata"
    })
  },
  // 优惠券 
  coupon: function () {
    wx.navigateTo({ 
      url: "/pages/coupon/coupon"
    });
  },
  // 我的钱包 
  mywallet: function () { 
    app.comjumpwxnav(9,'','');
  },  
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {

    this.isWeekEnd();

    if (options.scene){let scene = decodeURIComponent(options.scene);}else{
   
    }
    var test = [1, 2, 3];
    var num = test[Math.floor(Math.random() * test.length)]||1;
    this.data.loginid = app.signindata.loginid;
    this.setData({
      wxcopybg: num,
      temporary_store_id: options.store_id ||0,
      iftrstor: options.iftrstor||0,
      store_id: options.store_id || 0,
      uid: app.signindata.uid,
      store_id: app.signindata.store_id || 0,
      isProduce: app.signindata.isProduce,
    });
 
  },
  listdata:function(){
    var _this = this;
    wx.showLoading({ title: '加载中...', mask:true })
    var q = Dec.Aese('mod=getinfo&operation=myorder&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'order.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log(res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.Message != "Empty info") {
          if (res.data.ReturnCode == 200){
            // 获取钱包余额
            if(!res.data.Info.brandSettledLimit && res.data.Info.brandSettledInfo.brandSettledStatus == 5 && !res.data.Info.userJurisdictionList){
              if(wx.getStorageSync('access_token')){
                api.getLumpsumAndWithdraw({}).then((res) => {
                  console.log('withdrawInfo',res)
                  _this.setData({
                    withdrawInfo:res.data.data.info
                  })
                }).catch((err)=>{
                  console.log(err)
                })
              }else{
                app.getAccessToken(_this.listdata)
              };
            };
            
            _this.setData({
              isAddNewEventMask:false,
              dataInfo: res.data.Info,
              brandSettledStatus: res.data.Info.brandSettledInfo.brandSettledStatus,
              brand_id:res.data.Info.brandSettledInfo?res.data.Info.brandSettledInfo.brand_id:'',
              vipAdvertising: res.data.Info.vipAdvertising||'',
              userJurisdictionList:res.data.Info.userJurisdictionList || false,
              // 待付款
              nonpayment: res.data.Info.non_payment||0,
              // 待拆单数
              nonunpack: res.data.Info.non_unpack || 0,
              // 待发货数
              nonsend: res.data.Info.non_send || 0,
              // 待收货数
              nonreceive: res.data.Info.non_receive || 0,
              // 售后服务
              no_read: res.data.Info.no_read || 0,
              // 商家售后服务
              no_read_no: res.data.Info.no_read_no || 0,
              // 我的钱包数据
              point: res.data.Info.point || 0,
              // 提现金额
              putforwardmoney: res.data.Info.money || "0",
              // 幸运值
              luckyValue: res.data.Info.blindbox_lucky||0,
              // 抽盒金
              blindbox_money:res.data.Info.blindbox_money||0,
              // 限时抽盒金
              tempBlindboxMoney:res.data.Info.tempBlindboxMoney||0,
              //显示状态 1为未开通 2为待领取 3为明日领取
              showVipStatus:res.data.Info.showVipStatus || 1,
              //vip到期时间
              vipExpiryTime:_this.formatTime(res.data.Info.vipExpiryTime,'Y年M月D日'),
              //vip可领取特权数据
              vipPrerogativeStyle:res.data.Info.vipPrerogativeStyle || '',
              // 是否可领取抽盒机金
              isGetVipBlindBoxMoney:res.data.Info.isGetVipBlindBoxMoney || false,
              requestCompleted:true,
              subscribedata:res.data.Info.subscribe,

            });
            app.signindata.blindboxMoney = res.data.Info.blindbox_money||0,
            app.signindata.tempBlindboxMoney = res.data.Info.tempBlindboxMoney||0;
            _this.data.after_sale = res.data.Info.after_sale || 0;// 售后数
          };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);            
        } else {
          _this.setData({
            // 待付款
            nonpayment: 0,
            // 待拆单数
            nonunpack: 0,
            // 待发货数
            nonsend: 0,
            // 待收货数
            nonreceive: 0,
            requestCompleted:true
          });
          _this.data.after_sale = 0;// 售后数
        }
      }
    }); 
  },
  onLoadfun:function(){
    //  我的订单数据
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.setData({
      uid: app.signindata.uid,
      isVip: app.signindata.isVip,
      store_id: app.signindata.store_id || 0,
      isProduce: app.signindata.isProduce,
    });  
    wx.hideLoading()    
    _this.setData({ B: true, iftr_wx: true });  
    _this.listdata()

    if(this.data.defaultinformation){}else{
      app.defaultinfofun(this);
    };

    // 已经授权，可以直接调用
    if(app.signindata.userInfo && app.signindata.userInfo.avatarUrl){
      var userInfo = app.signindata.userInfo || {};
      _this.setData({
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        gender: userInfo.gender,
        istitnex: false,
        istit: true,
      })
    };

    // 购物车数据显示
    Dec.shopnum(_this,app.signindata.comurl);  
    // 调取晒单数量
    Dec.dryingSum(_this, app.signindata.clwcomurl);   

    if (app.signindata.isAwardOrder) {
      _this.setData({ isAwardOrder: app.signindata.isAwardOrder, awardOrder: app.signindata.awardOrder || false });
      app.winningtheprizetime(_this);
    };
  },

  jumporder: function () {
    var _this = this;
    app.jumporder(_this);
  },

  //  复制内容到粘贴板
  copyTBL: function (e) {
    var self = this;
    wx.setClipboardData({
      data: self.data.defaultinformation.cs.wxid,
      success: function (res) {
        app.showToastC('复制成功');
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
  pullupsignin:function(){
    // // '没有授权'
    this.setData({
      tgabox: true
    });
  },
  onShow: function () {   
    // wx.showLoading({ title: '加载中...', mask:true  }) 
    // 判断是否授权 
    var _this = this;
    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      _this.onLoadfun();
    }else{
      // '已经授权'
      _this.data.loginid = app.signindata.loginid;
      _this.setData({
        uid: app.signindata.uid,
        isProduce: app.signindata.isProduce,
        signinlayer: true,
        tgabox: false
      });
      // 判断是否登录
      if (_this.data.loginid != '' && _this.data.uid != '') {
        _this.onLoadfun();
      } else {
        app.signin(_this)
      }
    };
  },
  // 授权点击统计
  clicktga: function () {
    app.clicktga(2)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
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
      this.listdata();  
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.sharemc()    
  },
  onShareTimeline:function(){
    return {
      title:'潮玩社交平台',
      query:{}
    }
  },

  // 导航跳转
  whomepage: function () {
    app.comjumpwxnav(998,'','');
  },
  wnews: function () {
    var _this = this;
    app.limitlottery(_this);
  },
  wshoppingCart: function () {
    var _this = this;
    app.comjumpwxnav(9058, '', '');
  },
  wmy: function () { 
    this.onPullDownRefresh(); 
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
            tgabox: false
          });
          _this.onShow();
          // 确认授权用户统计
          app.clicktga(4)
        }
      }
    });
    if (e.detail.detail.userInfo) { } else {
      app.clicktga(8)  //用户按了拒绝按钮
    };

  },
  // 提现跳转
  putforward:function(){
    var siddata = this.data.temporary_store_id
    wx.navigateTo({
      url: "/pages/sputforward/sputforward?store_id=" + siddata
    });  
  },
  // 最佳合伙人
  sbestpartner: function () {
    wx.navigateTo({
      url: "/pages/sbestpartner/sbestpartner"
    });
  },  
  //公告跳转
  jumpnotice: function () {
    var _this = this
    if (_this.data.defaultinformation.notice.type == 1) {
      var url = encodeURIComponent(_this.data.defaultinformation.notice.url + "?uid=" + _this.data.uid)
      wx.navigateTo({
        url: "/page/component/pages/webview/webview?webview=" + url
      });
    } else {
      app.comjumpwxnav(1,_this.data.defaultinformation.notice.url,'');
    }
  }, 
  dlfindfun: function () {
    app.comjumpwxnav(993,'','');
  },
  personalhomepage: function () {
    wx.reLaunch({
      url: "/page/component/pages/dlpersonalhomepage/dlpersonalhomepage",
    })
  },
  jumpowntoy: function () {
    var _this = this;
    wx.navigateTo({
      url: "/page/component/pages/myothertoydg/myothertoydg?ownerId=" + _this.data.uid
    })
  },
  handleContact(e) {},

  // 点击复制
  sponsocopyone: function () {
    this.setData({
      copyiftr: true
    });
  },
  copyfitrfun: function () {
    this.setData({
      copyiftr: false
    });
  },
  sponsocopytwo: function () {
    var _this = this;
    wx.setClipboardData({
      data: "meichaimeichai",
      success: function (res) {
        app.showToastC('复制成功');
        _this.setData({
          copyiftr: false
        });
      }
    });
  },
  // 临时展会授权
  togation:function(e){
    this.setData({
      tgabox:true
    })
  }, 
    // 每日领取，vip专属券  3 领取vip专属限时抽盒金
  receivefun:function(getType){
    var _this = this;

    wx.showLoading({ title: '加载中...',mask:true }) 

    var q = Dec.Aese('mod=Obtain&operation=getCalendarTicket&uid=' +_this.data.uid+'&loginid='+_this.data.loginid+'&getType='+3);


    console.log(app.signindata.comurl +'brandDrying.php?' + 'mod=Obtain&operation=getCalendarTicket&uid=' +_this.data.uid+'&loginid='+_this.data.loginid+'&getType='+3)


    wx.request({
      url: app.signindata.comurl + 'brandDrying.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) { 
        console.log('receivefun====',res)
        if (res.data.ReturnCode == 200) {
          wx.showModal({
            title: '',
            content: '领取成功',
            showCancel: false,
            success: function (res) { }
          }),
          _this.listdata();
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.Msg,
            showCancel: false,
            success: function (res) { }
          })          
        }
      },
      fail: function () {},
      complete:function(){
        wx.hideLoading()
      }
    });
  },
  formatTime(number, format) {
    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];
    var date = new Date(number * 1000);
    returnArr.push(date.getFullYear());
    returnArr.push(date.getMonth() + 1);
    returnArr.push(date.getDate());
    returnArr.push(date.getHours());
    returnArr.push(date.getMinutes());
    returnArr.push(date.getSeconds());
   
    for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
  },
  // 获取用户头像名称授权
  getUserProfile(){
    var _this = this;
    console.log(wx.canIUse('getUserProfile'),wx.canIUse('getUserProfile'))
    wx.removeStorageSync('access_token') // 同步删除缓存
    wx.getUserProfile({
        lang: 'zh_CN',
        desc:'获取标识信息',
        success(res){
          console.log(res)

          var userInfo = res.userInfo || {};

          console.log('mod=userinfo&operation=setinfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&nick=' + userInfo.nickName + '&gender=' + userInfo.gender + '&headphoto=' + userInfo.avatarUrl + '&nick=' + encodeURIComponent(userInfo.nickName))

          var qq = Dec.Aese('mod=userinfo&operation=setinfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&nick=' + userInfo.nickName + '&gender=' + userInfo.gender + '&headphoto=' + userInfo.avatarUrl + '&nick=' + encodeURIComponent(userInfo.nickName) );

          wx.request({
            url: app.signindata.comurl + 'user.php' + qq,
            method: 'GET',
            header: { 'Accept': 'application/json' },
            success: function (res) {
              console.log('设置头像名称=====',res)
              if (res.data.ReturnCode == 200) {
                 
                 _this.setData({
                  avatarUrl: userInfo.avatarUrl,
                  nickName: userInfo.nickName,
                  gender: userInfo.gender,
                  istitnex: false,
                  istit: true,
                });
                
                app.showToastC('设置成功')

                app.signindata.avatarUrl = userInfo.avatarUrl;
                app.signindata.nickName = userInfo.nickName;
                app.signindata.userInfo = userInfo || {};
                app.signindata.isNeedUserInfo = false; 
              };
            }
          }) 


        },
        fail(res){
          console.log(res)
        }
    })
  },
  permissionDeniedFun(){
    app.showToastC('您没有权限',1500);
  },
  closeCommonTip(){
    this.setData({
      commonBulletFrame:!this.data.commonBulletFrame,
    })
  },

})