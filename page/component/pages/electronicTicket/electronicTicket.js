var Dec = require('../../../../common/public.js');//aes加密解密js
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
    openid: app.signindata.openid,
    windowHeight: app.signindata.windowHeight || 600,
    comdata: {},
    // 倒计时
    countdown: '',
    paymentiftr: false,
    //  背景
    tipback: false,
    // 支付完成弹框显示
    paymentcompletionwiftr: false,
    // 支付完成赠送卷
    paycheadwsong: '',
    // 分享图片地址
    paycheadwsongimg: '',
    // 判断是否支付完成
    payiftr: false,
    // 提交支付蒙层
    suboformola: false,
    oid:'',
    // 微信号码
    wxnum: 'meichai666666',
    // 支付完成显示分类跳转数据
    shareinfo: '',
    // 领奖提示数据
    awardrresentation: [],
    awardrresentiftr: false,
    awardrresentationjump: '' ,
    // 防止多次提交
    preventmultiplesubmission: true,
    avatarUrl: app.signindata.avatarUrl,
    headhidden:true,
    // 分享图片地址
    actimgshare: '',
    cart_idsave: '',
    uploadscreenshots: false,
    share_desc: '' ,
    // 领奖提示
    rpinfotip: '',     
    tgabox:false,
    ctxt:'',
    blackCity: app.signindata.blackCity,   
    id:'',
    c_title: '订单详情',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    subscrproiftr: false,
    subscrpro:'',
    receivingaddress:false,
    addressdata:[],
    addmodtip:false,
    addmodtxt:'',
    conphone:'',
    tipaid:'',
    shopnum:0,
    dryinglistnum:0,
    refundtips:false,
    refundtipssure:false,
    
    // 上传截图提示弹框
    screenshottipsiftr: false,
    pictboxbox:false,
    electronicInvoice:true,
    isrefresh :false,
    commoddata:{}

  },


  // 倒计时
  countdownbfun: function() {
    var _this = this;
    clearInterval(_this.data.timer);
    var countdown = _this.data.countdown;
    var commoddata = _this.data.commoddata;
    function nowTime() { //时间函数
      var iftrins = true;
      // 获取现在的时间
      var nowTime = new Date().getTime();
      var lastTime = countdown * 1000;
      var differ_time = lastTime - nowTime; //时间差：
      if (differ_time >= 0) {
        var differ_day = Math.floor(differ_time / (3600 * 24 * 1e3));
        var differ_hour = Math.floor(differ_time % (3600 * 1e3 * 24) / (1e3 * 60 * 60));
        var differ_minute = Math.floor(differ_time % (3600 * 1e3) / (1000 * 60));
        var s = Math.floor(differ_time % (3600 * 1e3) % (1000 * 60) / 1000);
        var ms = Math.floor(differ_time % 1000 / 100);
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
        commoddata.ms = ms;
      } else {
        commoddata.day = '00'
        commoddata.hour = '00';
        commoddata.minute = '00';
        commoddata.second = '00';
        commoddata.ms = '00';
      };
      if (commoddata.day != '00' || commoddata.hour != '00' || commoddata.minute != '00' || commoddata.second != '00') {
        iftrins = false;
      };
      _this.setData({
        commoddata: commoddata,
        isrefresh:false
      });
      console.log(_this.data.commoddata)
      if (iftrins) {
        clearInterval(_this.data.timer);
        _this.setData({
          isrefresh:true
        });
      };
    }
    if (_this.data.countdown) {
      nowTime();
      clearInterval(_this.data.timer);
      _this.data.timer = setInterval(nowTime, 1000);
    };

  },
  onShow: function() {
    if (this.data.countdown) {
      this.countdownbfun();
    };
  },

  onHide: function() {
    clearInterval(this.data.timer);
  },

  onUnload: function() {
    clearInterval(this.data.timer);
  },
  // 刷新二维码
  refreshQRCode:function(){
    var _this = this;
    console.log(1)
    wx.showLoading({ title: '加载中...', }) 
    var comdata = _this.data.comdata;

    if(Dec.env == 'online'){
      var getUrl = 'http://brandentry.51chaidan.com/';
    }else{
      var getUrl = 'http://brandentry-test.51chaidan.com/';
    };
    console.log(getUrl + 'verificationcode?orderNum='+comdata.ticketQrKey)
    wx.request({
      url:getUrl + 'verificationcode?orderNum='+comdata.ticketQrKey,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          comdata.qrcode = res.data.List.imgBase || '';
          _this.setData({
            comdata:comdata,
            countdown:res.data.List.expiryTime || 0
          });
          _this.countdownbfun();
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
      }
    }); 
  },
  pictboxboxfun:function(){
    this.setData({ pictboxbox:false});
    this.subscrfunstar();
  },
  screenshottips: function (w) {
    this.setData({
      screenshottipsiftr: true
    });
  },
  screenshottipsnone: function () {
    this.setData({
      screenshottipsiftr: false
    });
  },

  applicationforrefund:function(){
    this.setData({ refundtips:true});
  },
  // 退款
  refundtipssuresure:function(){
    var _this = this;
    var q = Dec.Aese('mod=operate&operation=applyRefund&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + _this.data.comdata.cart_id)
    wx.showLoading({ title: '加载中...', }) 
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          _this.setData({
            refundtips: false,
            refundtipssure: false
          });
          app.showToastC('退款成功，请注意查收');
          setTimeout(function(){
            _this.onLoadfun();
          },2000);
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);

      }
    }); 
  },
  refundtipssurefun:function(){
    this.setData({ refundtipssure: false, refundtips:false })
  },
  refundtiosun:function(){
    this.setData({ refundtipssure:true})
  },
  refundtipsfun:function(){
    this.setData({ refundtips:false})
  },
  modaddfun:function(){
    this.nextpagediao();
    this.setData({
      receivingaddress:true,
      tipback: true
    });

  },
  // 隐藏收货地址弹框
  receivingaddressfun: function () {
    this.setData({
      receivingaddress: false,
      tipback:false
    })
  },
  // 确定
  addmoddetermine:function(){
    var _this = this;
    var q = Dec.Aese('mod=operate&operation=changeAddress&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + _this.data.tipaid + '&oid=' + _this.data.comdata.cart_id)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            receivingaddress: false,
            tipback: false,
            addmodtip: false,
            addmodtxt: '',
            conphone: ''            
          });
          _this.onLoadfun();
          wx.showModal({
            content: '修改成功',
            success: function (res) {}
          })          
        } else if (res.data.ReturnCode == 201){
          _this.setData({
            receivingaddress: false,
            tipback: false,
            addmodtip: false,
            addmodtxt: '',
            conphone: ''
          }); 
          wx.showModal({
            content: res.data.Msg || "无法修改",
            showCancel: false,
            success: function (res) {}
          })
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);

      }
    }); 
  },
  // 取消
  addmodcancel:function(){
    this.setData({
      addmodtip:false
    })
  },
  // 修改收货地址
  revisethereceivingaddress: function (w) {
    var tipaid = w.currentTarget.dataset.tipaid || w.target.dataset.tipaid || '';
    var address = w.currentTarget.dataset.address || w.target.dataset.address || '';
    var province = w.currentTarget.dataset.province || w.target.dataset.province || '';
    var city = w.currentTarget.dataset.city || w.target.dataset.city || '';
    var district = w.currentTarget.dataset.district || w.target.dataset.district || '';
    var consignee = w.currentTarget.dataset.consignee || w.target.dataset.consignee || '';
    var phone = w.currentTarget.dataset.phone || w.target.dataset.phone || '';

    var addmodtxt = province + ' ' + city + ' ' + district + ' ' + address;
    var conphone = consignee + ' ' + phone;
    this.data.tipaid = tipaid;
    this.setData({
      tipaid: tipaid,
      receivingaddress: false,
      tipback: false,
      addmodtip:true,
      addmodtxt: addmodtxt,
      conphone: conphone
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
              // 判断非200和登录
              Dec.comiftrsign(_this, res, app);
            }
          })

        }
      }
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
    wx.navigateTo({
      url: "/pages/newreceivingaddress/newreceivingaddress"
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
            _this.data.tipaid = tptipadi;
            _this.setData({
              addressdata: rdl,
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

















  // 点击登录获取权限
  userInfoHandler: function (e) {
    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 确认授权用户统计
          app.clicktga(4);
          _this.setData({
            tgabox: false
          });
          // '已经授权'
          _this.setData({
            loginid: app.signindata.loginid,
            uid: app.signindata.uid,
            openid: app.signindata.openid,
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
    if (e.detail.userInfo) { } else {
      app.clicktga(8)  //用户按了拒绝按钮
    };

  },
  gobargainDetail: function (w) {
    var ordersn = w.target.dataset.ordersn || w.currentTarget.dataset.ordersn;
    wx.navigateTo({
      url: '/page/component/pages/bargainDetail/bargainDetail?order_sn=' + ordersn,
    })
  },

  // 跳转详情页 
  addressmanagement: function (event) {
    // 统计商品点击量
    var gid = event.currentTarget.dataset.gid || event.target.dataset.gid;
    var order_type = event.currentTarget.dataset.order_type || event.target.dataset.order_type;
    var activity_id = event.currentTarget.dataset.activity_id || event.target.dataset.activity_id || 0;
    var _this = this;
    if (order_type == 3) {
      wx.navigateTo({
        url: "/page/component/pages/imdetailspage/imdetailspage?goods_id=" + gid
      });
    }else if (order_type==2){
      wx.navigateTo({    
        url: "../../../../pages/activitydetailspage/activitydetailspage?id=" + activity_id
      })
    } else if (order_type == 16){
      return;
    } else if (order_type == 17) {
      wx.navigateTo({
        url: "/page/component/pages/crowdfunding/crowdfunding?aid=" + activity_id
      })
    } else if(order_type == 13){
      wx.navigateTo({   
        url: "/page/component/pages/limitlottery/limitlottery?id=" + activity_id
      });
    } else if(order_type == 21){
      wx.navigateTo({   
        url: "/page/secondpackge/pages/aRewardDetails/aRewardDetails?id=" + activity_id
      });
    } else{
      wx.navigateTo({    
        url: "../../../../pages/detailspage/detailspage?gid=" + gid
      })
    }     

  },
  // 时间戳转换时间  
  toDate: function (number,num) {
    var num = num || 0;
    var date = new Date(number * 1000);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate()<10?'0'+date.getDate():date.getDate();
    var h = date.getHours()<10?'0'+date.getHours():date.getHours();
    var m = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
    var s = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
    if (num == 1){
      return Y + '-' + M + '-' + D + ' '+ h + ':' + m;
    } else if (num == 2) {
      return M + '-' + D + ' ' + h + ':' + m;
    }else{
      return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
    };
  },




  getData:function(){
     var _this = this;
     var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
     var q = Dec.Aese('mod=getinfo&operation=orderdetail&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + _this.data.oid + '&blackCity=' + _this.data.blackCity);
 
     wx.request({
       url: app.signindata.comurl + 'order.php' + q,
       method: 'GET',
       header: { 'Accept': 'application/json' },
       success: function (res) {
         console.log('订单详情===',res)
         if (res.data.ReturnCode == 200) {
           if (res.data.Info){
             var infoshow = res.data.Info;
 
             if (infoshow) {
               if (infoshow.share_desc){
                 var share_desc = infoshow.share_desc.replace(/\\n/g, '\n') || '';
                 _this.setData({ share_desc: share_desc });
               };
             };
             if (infoshow) {
               if (infoshow.showOrderDesc){
                 var share_desc1 = infoshow.showOrderDesc.replace(/\\n/g, '\n') || '';
                 _this.setData({ share_descWinningtheprize: share_desc1 });
               };
             };
             if (!reg.test(res.data.Info.gcover)) {
               res.data.Info.gcover = _this.data.zdyurl + res.data.Info.gcover;
             }
             res.data.Info.ordertime = _this.toDate(res.data.Info.ordertime||0);
             res.data.Info.gift_time = _this.toDate(res.data.Info.gift_time || 0);
             res.data.Info.receive_time = _this.toDate(res.data.Info.receive_time||0,1);
             res.data.Info.overtime = _this.toDate(res.data.Info.overtime || 0, 2);
 
             var isShareGood = true;
             if(app.signindata.notAllowShareGoodsId&&app.signindata.notAllowShareGoodsId.length!=0){
               if(app.signindata.notAllowShareGoodsId.indexOf(res.data.Info.gid) > -1){
                 isShareGood = false;
                 wx.hideShareMenu();
               }
             };

             if(res.data.Info.mobile){
                res.data.Info.mobile = res.data.Info.mobile.replace(/^(.{3})(?:\w+)(.{3})$/, "$1*****$2");
             };
             if(res.data.Info.idcard){
                res.data.Info.idcard = res.data.Info.idcard.replace(/^(.{4})(?:\w+)(.{4})$/, "$1**********$2");
             };

             //  

             
             var ticketTime = res.data.Info.ticketTime || 0;
             console.log('nowTime=====',nowTime);
   
             var showSubscription = true;
             console.log(nowTime/1000 > ticketTime)
             if(ticketTime && (nowTime/1000 > ticketTime)){
               showSubscription = false
             };
             var nowTime = new Date().getTime();
             if(res.data.Info.ticketDisplayTime && (nowTime/1000 > res.data.Info.ticketDisplayTime)){
                res.data.Info.qrcode = '';
             };

            // 是否过期
            if(res.data.Info.ticketEndDisplay && (nowTime/1000 > res.data.Info.ticketEndDisplay)){
                
            };             
             


             _this.setData({
               isShareGood:isShareGood,
               comdata: res.data.Info,
               id: res.data.Info.gid,
               subscribedata: res.data.Info.subscribe,
             })

            if(res.data.Info.ticketDisplayTime && (nowTime/1000 > res.data.Info.ticketDisplayTime)){
                _this.refreshQRCode();
            }
             
             
           };
         };
         if (res.data.ReturnCode == 800) {
           app.showToastC('非该用户订单');
         };
         // 判断非200和登录
         Dec.comiftrsign(_this, res, app);
         // 刷新完自带加载样式回去
         wx.stopPullDownRefresh();        
       },
       fail: function () {
         // fail
       }
     });


  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  otherfunsettime:function(){  },
  onLoadfun: function () { 
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      avatarUrl: app.signindata.avatarUrl,
      blackCity: app.signindata.blackCity,
      windowHeight: app.signindata.windowHeight || 600,
      comdata:{},
      isProduce: app.signindata.isProduce,
      isShareFun: app.signindata.isShareFun,
    });

    _this.getData();
    

    var qqq = Dec.Aese('operation=info&mod=info');
    // 获取默认信息
    wx.request({
      url: app.signindata.comurl + 'general.php' + qqq,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            wxnum: res.data.Info.cs.wxid || 'meichai666666',
          })
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
      }
    }) 
    this.otherfunsettime(); 

    
    // 生成图片商品数据
    if (app.signindata.activityblindbox) {
      _this.data.activityblindbox = app.signindata.activityblindbox;
    } else {
      app.activityblindboxfun(_this);
    };

  },   
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      oid: options.oid,
      avatarUrl: app.signindata.avatarUrl,
      blackCity: app.signindata.blackCity,
      windowHeight: app.signindata.windowHeight || 600,
    });    

    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
      return false;
    }

    // 判断是否授权 
    var _this = this;
    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      _this.onLoadfun();
    }else{
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // '已经授权'
            _this.setData({
              loginid: app.signindata.loginid,
              uid: app.signindata.uid,
              openid: app.signindata.openid,
              blackCity: app.signindata.blackCity,
            });
            // 判断是否登录
            if (_this.data.loginid != '' && _this.data.uid != '') {
              _this.onLoadfun();
            } else {
              app.signin(_this);
            }
          } else {
            _this.unauthorized();
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
                app.userstatistics(38);
                _this.setData({
                  tgabox: true
                });
              }
            });

          }
        }
      });
    }






    this.data.ctxt = wx.createCanvasContext('myordercanimgser');
    



  },
  // 授权点击统计
  clicktga: function () {
    app.clicktga(2)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoadfun();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this;
    var reshare = Dec.sharemc();
    return reshare
  },
  // 查看物流
  lookatthelogistics: function (event) {
    var oid = event.currentTarget.dataset.oid || event.target.dataset.oid;
    var gcover = event.currentTarget.dataset.gcover || event.target.dataset.gcover;
    wx.navigateTo({    
      url: "../../../../pages/lookatthelogistics/lookatthelogistics?oid="+oid+'&gcover='+gcover
    })
  },  
  // 取消订单
  cancellationoforder: function (w) {
    var oid = w.currentTarget.dataset.oid || w.target.dataset.oid;
    var _this = this;
    var q = Dec.Aese('mod=operate&operation=cancel&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + oid)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          app.showToastC('操作成功');
          // 调取上一页地址接口重新刷新数据
          var pages = getCurrentPages(); // 当前页面  
          var beforePage = pages[pages.length - 2]; // 前一个页面 
          //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
          if (beforePage) {
            if (beforePage.route == 'pages/myorder/myorder') {
              wx.navigateBack({
                success: function () {
                  beforePage.datatransfer();
                }
              });
            } else {
              wx.navigateBack();
            };
          } else {
            wx.navigateBack();
          };
        };
        if (res.data.ReturnCode == 800) {
          app.showToastC('非该用户订单');
        };
        if (res.data.ReturnCode == 810) {
          app.showToastC('仅可以取消未付款订单');
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);  

      }
    })
  },
  // 支付完成弹框隐藏弹框
  paymentcompletionwimg: function () {
    this.setData({
      paymentcompletionwiftr: false,
      tipback: false,
      payiftr: false,
    });
  },
  // 查看订单
  viewtheorder: function () {
    wx.navigateTo({    
      url: "../../../../pages/myorder/myorder?tabnum=0"
    })
    this.paymentcompletionwimg();
  },
  // 返回首页
  returntothehomepage: function () {
    wx.reLaunch({    
      url: "../../../../pages/index/index"
    });
    this.paymentcompletionwimg();
  },
  // 取消付款
  paymentboxheadfun: function () {
    var _this = this;
    wx.showModal({
      title: '确定放弃支付吗？',
      content: '个人中心-我的订单-继续支付\n付款成功后，才可以拆单成功',
      success: function (res) {
        if (res.confirm) {
          _this.setData({
            paymentiftr: false,
            tipback: false
          })
        }
      }
    })
  },  
  // 付款
  payment: function () {

    // 提交订单蒙层
    this.setData({
      suboformola: true
    });    
    // 直接支付
    this.paymentmony();
    
  },
  // 微信支付
  paymentmony: function () {
    var _this = this;
    var q = Dec.Aese('mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1' + '&oid=' + _this.data.comdata.cart_id + '&xcx=1' + '&openid=' + _this.data.openid)
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
            'success': function(res){
              _this.setData({
                tipback: false,
                paymentiftr: false,
                paymentcompletionwiftr: true,
                payiftr: true,
                suboformola: false
              });

              //跳转0元购
              if (payinfo.isFreeBuyOrder) {
                wx.navigateTo({
                  url: "/page/component/pages/hidefun/hidefun?type=1&cart_id=" + _this.data.comdata.cart_id
                });
              }
              _this.onLoadfun();
              // 订阅授权
              app.comsubscribe(_this);

            },
            'fail': function (res) { 
              _this.setData({
                tipback: false,
                paymentiftr: false,
                paymentcompletionwiftr: false,
                payiftr: false,
                suboformola: false
              });              
             },
            'complete': function (res) { }
          })
        }else{
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
  // 删除订单
  delwholeheadrimg: function (w) {
    var oid = w.currentTarget.dataset.oid || w.target.dataset.oid;
    var _this = this;
    var q = Dec.Aese('mod=operate&operation=delete&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + oid)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          app.showToastC('操作成功');
          // 调取上一页地址接口重新刷新数据
          var pages = getCurrentPages(); // 当前页面  
          var beforePage = pages[pages.length - 2]; // 前一个页面 
          //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
          if (beforePage) {
            if (beforePage.route == 'pages/myorder/myorder') {
              wx.navigateBack({
                success: function () {
                  beforePage.datatransfer();
                }
              });
            } else {
              wx.navigateBack();
            };
          } else {
            wx.navigateBack();
          };
        };
        if (res.data.ReturnCode == 800) {
          app.showToastC('非该用户订单');
        };
        if (res.data.ReturnCode == 824) {
          app.showToastC('订单状态有误');
        };
        if (res.data.ReturnCode == 900) {
          app.showToastC('登陆状态有误');
        };
      }
    });
  },
  // 确认收货
  confirmationofreceipt: function (w) {
    var oid = w.currentTarget.dataset.oid || w.target.dataset.oid;
    var _this = this;
    var q = Dec.Aese('mod=operation&operation=arrival&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + oid)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          app.showToastC('操作成功');
          _this.onLoadfun();
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
      }
    });
  },
  //  复制内容到粘贴板
  copyTBL: function (e) {
    var self = this;
    wx.setClipboardData({
      data: self.data.wxnum,
      success: function (res) {
        app.showToastC('复制成功');
      }
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
        url: "../../../../pages/detailspage/detailspage?gid=" + whref
      });
    } else if (item_type == 2 || item_type == 3) {
      wx.navigateTo({    // 信息流
        url: "../../../../pages/classificationpage/classificationpage?" + whref + '&wtype=' + item_type + '&wname=' + wname
      });
    } else if (item_type == 4 || item_type == 5) {

      wx.navigateTo({    // 瀑布流
        url: "../../../../pages/classificationpage/classificationpage?" + whref + '&wtype=' + item_type + '&wname=' + wname
      });
    } else if (item_type == 6 || item_type == 7) {
      wx.navigateTo({    // 活动列表
        url: "../../../../pages/activitysharinglist/activitysharinglist"
      });
    } else if (item_type == 8) {
      wx.navigateTo({    // 活动详情页
        url: "../../../../pages/activitydetailspage/activitydetailspage?id=" + whref
      });
    } else if (item_type == 9) {
      wx.navigateTo({    //签到
        url: "/page/component/pages/newsignin/newsignin"
      });
    } else if (item_type == 998) {
      wx.reLaunch({    //签到
        url: "../../../../pages/index/index?judgeprof=2"
      });
    } else if (item_type == 996) {
      this.setData({
        awatip: true,
        awardrresentiftr:false
      })
    };
  },  
  // 跳转邀请页面
  invitingfriends: function (w) {
    var cart_id = w.currentTarget.dataset.cart_id || w.target.dataset.cart_id || '0';
    var goods_id = w.currentTarget.dataset.gid || w.target.dataset.gid || '0';
    var goods_name = w.currentTarget.dataset.gname || w.target.dataset.gname || '0';
    var gsale = w.currentTarget.dataset.goods_price || w.target.dataset.goods_price || '0';
    var goods_share = w.currentTarget.dataset.gcover || w.target.dataset.gcover || '0';
    var order_type = w.currentTarget.dataset.order_type || w.target.dataset.order_type || '1';
    var pre_name = w.currentTarget.dataset.pre_name || w.target.dataset.pre_name || '0';
    var ds = w.currentTarget.dataset.ds || w.target.dataset.ds || '';

    if (order_type == 2) {
      wx.navigateTo({
        url: "../../../../pages/invitingfriends/invitingfriends?goods_id=" + goods_id + "&goods_name=" + goods_name + "&gsale=" + gsale + "&goods_share=" + encodeURIComponent(goods_share) + "&cart_id=" + cart_id + "&shoporact=2"
      });
    } else {
      wx.navigateTo({
        url: "../../../../pages/invitingfriends/invitingfriends?goods_id=" + goods_id + "&goods_name=" + goods_name + "&gsale=" + gsale + "&goods_share=" + encodeURIComponent(goods_share) + "&cart_id=" + cart_id + "&pre_name=" + pre_name + "&ds=" + ds + "&shoporact=1"
      });
    }

  }, 
  // 额外奖励
  clicktocollect: function (w) {
    var _this = this;

    var showorder = w.currentTarget.dataset.sorder || w.target.dataset.sorder || 0;
    if (showorder == 1) {
      app.showToastC('请等待审核');
      return;
    }

    if (_this.data.preventmultiplesubmission){
      _this.setData({ preventmultiplesubmission: false });
        var cart_id = w.currentTarget.dataset.cart_id || w.target.dataset.cart_id || 0;
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
              var rpiinfo = res.data.Info.tip.replace(/\\n/g, '\n') || '';
              if (res.data.Info.Goods.item_type == 996) {
                if (_this.data.comdata.order_type == 2){
                  _this.awajump();
                }else{
                  _this.setData({ awatip: true });
                };
                
              } else {
                _this.setData({ awardrresentiftr: !_this.data.awardrresentiftr, })
              };
              _this.setData({
                rpinfotip: rpiinfo
              });
              _this.setData({
                awardrresentation: res.data.List,
                awardrresentationjump: res.data.Info.Goods || ''
              });
            } else {
              app.showToastC(res.data.Msg);
              setTimeout(function () {
                _this.onLoadfun();
              }, 1500)
            };
          }
        });
    };

  },
  awardrresentiftr: function () {
    this.setData({
      awardrresentiftr: !this.data.awardrresentiftr
    })
  },

  // 免单活动跳转
  actexempfun: function (event) {
    var gid = event.currentTarget.dataset.gid || event.target.dataset.gid;
    wx.redirectTo({
      url: "../../../../pages/activitydetailspage/activitydetailspage?id=" + gid
    })
  },

  acetlistfun: function () {
    wx.redirectTo({
      url: "../../../../pages/activitysharinglist/activitysharinglist"
    });
    this.setData({
      wsh: false,
      awardrresentiftr: false
    });
  }, 
    // 上传图片
  upImgSer: function (w) {
    var _this = this;
    var cart_id = w.currentTarget.dataset.cart_id || w.target.dataset.cart_id||'';
    var anum = w.currentTarget.dataset.anum || w.target.dataset.anum || 1;
    if (anum == 1) {
      var auditPicTime = parseInt(_this.data.comdata.auditPicTime) || 0;
      var timestamp = Date.parse(new Date());
      if (auditPicTime) {
        if (auditPicTime > timestamp / 1000) {
          _this.setData({
            subscrproiftr: true,
            subscrpro: '未到提供截图时间,请先分享朋友圈一小时后上传。上传开启时间:'+ _this.toDate(auditPicTime, 1)
          });
          return false;
        };
      }
    }
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        
        var tempFilePaths = res.tempFilePaths[0];
        _this.uploadFile(_this, tempFilePaths, 'litpic', cart_id, anum);
      }
    })
  },
  //上传文件
  uploadFile: function (_this, filePath, name, cart_id, anum) {
    //启动上传等待中...  

    var _this = _this;
    _this.setData({ headhidden: false });
    wx.showLoading({ title: '加载中...', })
    wx.uploadFile({
      url: Dec.comurl() + 'order.php',
      filePath: filePath,
      name: name,
      header: {
        'content-type': 'multipart/form-data'
      }, // 设置请求的 header
      formData: {
        'mod': 'info',
        'operation': 'upload',
        'uid': _this.data.uid,
        'cart_id': _this.data.comdata.cart_id,
        'loginid': _this.data.loginid,
        'picture_type': 2,
        'type': anum
      }, // HTTP 请求中其他额外的 form data
      success: function (res) {
        wx.hideToast();
        _this.setData({
          headhidden: true,
          upserimgbox:false,
          upserimgboxact: false,
          screenshottipsiftr:false
        });
        wx.hideLoading()
        if (res.data){
          if (res.data == 200) {
            _this.setData({ pictboxbox: true })
          } else {
            _this.setData({
              subscrpro: res.data,
              subscrproiftr: true
            });
          }
        }
        setTimeout(function(){
          _this.onLoadfun();
        },3000);
        
      },
      fail: function (res) {
        _this.setData({ headhidden: true, upserimgboxact: false, });
        wx.hideLoading()
        wx.hideToast();
        app.showToastC('上传失败');
      }
    })
  },    
  // 跳转首页
  frontpagebutton: function () {
    wx.reLaunch({
      url: "../../../../pages/index/index?judgeprof=2"
    })
  },  
  // 生成图片
  generatePictures: function (qrcode, awardinfo, cover) {
    var _this = this;
    if (_this.data.actimgshare==''){
      wx.showLoading({ title: '加载中...', })
    _this.setData({ headhidden: false, actimgshare: '' });
    this.data.ctxt = wx.createCanvasContext('myordercanimgser');
    const ctxt = _this.data.ctxt;
    ctxt.clearRect(0, 0, 319, 414);
    ctxt.setFillStyle('#fff')
    ctxt.fillRect(0, 0, 319, 414)
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
                ctxt.setFontSize(16)
                ctxt.setFillStyle('#000')
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

                    if(app.signindata.is_eveShareAdver && app.signindata.mergePicImg){

                      // 渲染广告图片
                      wx.getImageInfo({
                        src: app.signindata.mergePicImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
                        success: function (res) {
                          var ratio = res.width / res.height;   
                          var viewHeight = (319/ratio)<=175?(319/ratio):175;    

                          ctxt.drawImage(res.path, 0, 414, 319, viewHeight)
                          ctxt.draw(true);
                          wx.getImageInfo({
                            src: cover, // banner 图片 
                            success: function (res) {
                              ctxt.drawImage(res.path, 17, 180, 285, 151);
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
                                      actimgshare: res.tempFilePath,
                                      headhidden: true
                                    });
                                    wx.hideLoading()
                                  },
                                  fail: function (res) {
                                    wx.hideLoading()
                                    app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:01}');
                                    _this.setData({ upserimgbox: false, headhidden: true });

                                  },
                                });
                              }, 300));

                            },
                            fail: function (res) {
                              wx.hideLoading()
                              app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:02}');
                              _this.setData({ upserimgbox: false, headhidden: true });
                            }
                          });

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
                        }

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
                            }

                                wx.getImageInfo({
                                  src: cover, // banner 图片 
                                  success: function (res) {
                                    ctxt.drawImage(res.path, 17, 180, 285, 151);
                                    ctxt.draw(true, setTimeout(function () {
                                      wx.canvasToTempFilePath({
                                        canvasId: 'myordercanimgser',
                                        success: function (res) {
                                          _this.setData({
                                            actimgshare: res.tempFilePath,
                                            headhidden: true
                                          });
                                          wx.hideLoading()
                                        },
                                        fail: function (res) {
                                          wx.hideLoading()
                                          app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:01}');
                                          _this.setData({ upserimgbox: false, headhidden: true });

                                        },
                                      });
                                    }, 300));

                                  },
                                  fail: function (res) {
                                    wx.hideLoading()
                                    app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:02}');
                                    _this.setData({ upserimgbox: false, headhidden: true });
                                  }
                                });
                            },
                            fail: function () {
                              app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:011}');
                            }
                          })
                        },
                        fail: function () {
                          app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:010}');
                        }
                      });
                    }

                  },
                  fail: function (res) {
                    wx.hideLoading()
                    app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:03}');
                    _this.setData({ upserimgbox: false, headhidden: true });
                  }
                });

              },
              fail: function (res) {
                wx.hideLoading()
                app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:04}');
                _this.setData({ upserimgbox: false, headhidden: true });
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
                ctxt.setFontSize(13);
                ctxt.setFillStyle('#000');
                ctxt.fillText(str, (319 - ctxt.measureText(str).width) / 2, 162);

                wx.getImageInfo({
                  src: qrcode, // 太阳码
                  success: function (res) {
                    ctxt.drawImage(res.path, 129.5, 340, 60, 60);
                    // ctxt.draw(true);

                    if(app.signindata.is_eveShareAdver && app.signindata.mergePicImg){


                      // 渲染广告图片
                      wx.getImageInfo({
                        src: app.signindata.mergePicImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
                        success: function (res) {

                          var ratio = res.width / res.height;   
                          var viewHeight = (319/ratio)<=175?(319/ratio):175;    

                          ctxt.drawImage(res.path, 0, 414, 319, viewHeight)
                          ctxt.draw(true);
                          wx.getImageInfo({
                            src: cover, // banner 图片 
                            success: function (res) {
                              ctxt.drawImage(res.path, 17, 180, 285, 151);
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
                                      actimgshare: res.tempFilePath,
                                      headhidden: true
                                    });
                                    wx.hideLoading()
                                  },
                                  fail: function (res) {
                                    wx.hideLoading()
                                    app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:01}');
                                    _this.setData({ upserimgbox: false, headhidden: true });

                                  },
                                });
                              }, 300));

                            },
                            fail: function (res) {
                              wx.hideLoading()
                              app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:02}');
                              _this.setData({ upserimgbox: false, headhidden: true });

                            }
                          });

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
                        }

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
                            }

                                wx.getImageInfo({
                                  src: cover, // banner 图片 
                                  success: function (res) {
                                    ctxt.drawImage(res.path, 17, 180, 285, 151);
                                    ctxt.draw(true, setTimeout(function () {
                                      wx.canvasToTempFilePath({
                                        canvasId: 'myordercanimgser',
                                        success: function (res) {
                                          _this.setData({
                                            actimgshare: res.tempFilePath,
                                            headhidden: true
                                          });
                                          wx.hideLoading()
                                        },
                                        fail: function (res) {
                                          wx.hideLoading()
                                          app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:01}');
                                          _this.setData({ upserimgbox: false, headhidden: true });

                                        },
                                      });
                                    }, 300));

                                  },
                                  fail: function (res) {
                                    wx.hideLoading()
                                    app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:02}');
                                    _this.setData({ upserimgbox: false, headhidden: true });

                                  }
                                });
                            },
                            fail: function () {
                              app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:011}');
                            }
                          })
                        },
                        fail: function () {
                          app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:010}');
                        }
                      });
                    }
                  },
                  fail: function (res) {
                    wx.hideLoading()
                    app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:03}');
                    _this.setData({ upserimgbox: false, headhidden: true });

                  }
                });

              },
              fail: function (res) {
                wx.hideLoading()
                app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:04}');
                _this.setData({ upserimgbox: false, headhidden: true });

              }
            })

          }
        });

      },
      fail: function (res) {
        app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:10}');
        _this.setData({ upserimgboxWinningtheprize: false, headhidden: true });
      }
    });

    };
  },
  // 保存图片
  sharesavethepicture: function (w) {
    var _this = this;
    var indnum = w.currentTarget.dataset.indnum || w.target.dataset.indnum || '';
    if (indnum == 1) {
      var imgSrc = _this.data.actimgshare || '';
    } else {
      var imgSrc = _this.data.actimgshareact || '';
    };

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
                  if (indnum == 1){
                    _this.saveimgfun();
                  };
                  _this.setData({ upserimgbox: false, upserimgboxact: false });
                },
                fail() {
                  app.showToastC('保存失败');
                  _this.setData({ upserimgbox: false, upserimgboxact:false, actimgshare: '' });
                }
              })
            },
            fail() {
              _this.setData({
                picbox: true,
                upserimgbox: false,
                upserimgboxact: false, 
                actimgshare: ''
              });
            }
          })
        } else {
          // 有则直接保存
          wx.saveImageToPhotosAlbum({
            filePath: imgSrc,
            success() {
              if (indnum == 1){
                _this.saveimgfun();
              }
              _this.setData({ upserimgbox: false, upserimgboxact: false });
              
            },
            fail() {
              app.showToastC('保存失败');
              _this.setData({ upserimgbox: false, upserimgboxact: false, savepicturesiftr: true, actimgshare: '' });
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
        _this.setData({ upserimgbox: false, actimgshare: '' });
        _this.onLoadfun();
      },
      fail: function () { }
    });
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
  // 关闭保存图片上传图片
  closeupserimg: function () {
    this.setData({ upserimgbox: false, actimgshare: '' });
  },
  upserimgboxiftr: function (w) {
    var _this = this;
    var qrcode = w.currentTarget.dataset.qrcode || w.target.dataset.qrcode;  // 太阳码
    var awardinfo = w.currentTarget.dataset.awardinfo || w.target.dataset.awardinfo;  // 标题
    var cover = w.currentTarget.dataset.cover || w.target.dataset.cover;  // banner图片
    if (!app.signindata.reg.test(cover)) {
      cover = _this.data.zdyurl + cover;
    };
    var cart_idsave = w.currentTarget.dataset.cart_id || w.target.dataset.cart_id;
    var showOrder = w.currentTarget.dataset.showorder || w.target.dataset.showorder || 0;
    if (showOrder != 0) {
      var uploadscreenshots = true;
    } else {
      var uploadscreenshots = false;
    };
    this.setData({ upserimgbox: true, cart_idsave: cart_idsave, uploadscreenshots: uploadscreenshots });
    if (_this.data.comdata.order_type==10){
      this.generatePicturesbs();
    }else{
      this.generatePictures(qrcode, awardinfo, cover);
    }
    
  },

  // 生成分享图片
  generatePicturesact: function (w) {
    var _this = this;
    var qrcode = _this.data.comdata.qrcode || '';
    var share_url = _this.data.comdata.share_url || '';
    
    _this.setData({ upserimgboxact: true, actimgshareact:'' });
    if (_this.data.actimgshareact == '') {
      console.log('活动图片:' + share_url);
      console.log('太阳码图片:' + qrcode)
      if (share_url != '' && qrcode != '') {
        _this.setData({ headhidden: false });
        wx.showLoading({ title: '加载中...', })

        wx.getImageInfo({
          src: share_url,

          success: function (res) {
            const ctx = wx.createCanvasContext('canimgser');
            ctx.drawImage(res.path, 0, 0, 360, 384);
            ctx.draw(true);
            wx.getImageInfo({
              src: qrcode,
              success: function (res) {
                const ctxt = wx.createCanvasContext('canimgser');
                ctxt.drawImage(res.path, 141, 288, 70, 70)
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
                    ctxt.fillRect(14, 424, 159, 140);
                    ctxt.draw(true);
                    ctxt.drawImage(res.path, 14, 424, 159, 85)
                    ctxt.draw(true);
                    ctxt.setFontSize(11);
                    ctxt.setFillStyle('#000');
                    ctxt.fillText(_this.data.activityblindbox[0].name, 17, 529);
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
                    ctxt.strokeRect(95, 539, ctxt.measureText(_this.data.activityblindbox[0].tip).width + 6, 16);
                    ctxt.draw(true);
                    // 第四部 渲染右边图片
                    wx.getImageInfo({
                      src: _this.data.activityblindbox[1].cover,
                      success: function (res) {
                        // 渲染右边图片
                        ctxt.fillStyle = '#fff';
                        ctxt.fillRect(187, 424, 159, 140);
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
                        ctxt.strokeRect(267, 539, ctxt.measureText(_this.data.activityblindbox[1].tip).width + 6, 16);
                        ctxt.draw(true);


                            wx.getImageInfo({
                              src: 'https://www.51chaidan.com/images/mc.jpg', // 美拆头像
                              success: function (res) {
                                const ctxt = wx.createCanvasContext('canimgser');
                                // ctxt.save();
                                // ctx.beginPath();
                                ctxt.arc(176, 323, 16, 0, Math.PI * 2, false);
                                ctxt.strokeStyle = "#fff";
                                ctxt.clip();
                                ctxt.drawImage(res.path, 160, 306, 34, 34);
                                ctxt.stroke();//画实心圆
                                ctxt.closePath();
                                ctxt.restore(); 
                                ctxt.draw(true);                   
                                wx.getImageInfo({
                                  src: tdavatar,
                                  success: function (res) {
                                    const ctxt = wx.createCanvasContext('canimgser');
                                    // ctxt.save();
                                    // ctx.beginPath();
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
                                            actimgshareact: res.tempFilePath,
                                            headhidden: true
                                          });
                                          wx.hideLoading()
                                        },
                                        fail: function (res) {
                                          wx.hideLoading()
                                          app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:01}');
                                          _this.setData({ upserimgboxact: false, headhidden: true });

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
                                            actimgshareact: res.tempFilePath,
                                            headhidden: true
                                          });
                                          wx.hideLoading()
                                        },
                                        fail: function (res) {
                                          wx.hideLoading()
                                          app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:01}');
                                          _this.setData({ upserimgboxact: false, headhidden: true });

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
                  fail: function () {
                    app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:010}');
                  }
                });

              },
              fail: function (res) {
                wx.hideLoading()
                app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:03}');
                _this.setData({ upserimgboxact: false, headhidden: true });
               
              }
            })
          },
          fail: function (res) {
            wx.hideLoading()
            app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:04}');
            _this.setData({ upserimgboxact: false, headhidden: true });
            
          }
        })
      } else {
        _this.setData({ upserimgboxact: false, savepicturesiftr: true });

      };
    };





  },

  acetlistfunact: function () {
    this.setData({ upserimgboxact: false });
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

  gofreedetail: function (w) {
    var _this = this;
    var cart_id = w.currentTarget.dataset.cart_id || w.target.dataset.cart_id || '';
    wx.navigateTo({
      url: "/page/component/pages/hidefun/hidefun?type=0&cart_id=" + cart_id
    });
  },

  goodsetail: function (w) {
    var _this = this;
    var gid = w.currentTarget.dataset.gid || w.target.dataset.gid || '';
    wx.navigateTo({
      url: "../../../../pages/detailspage/detailspage?gid=" + gid
    })
  },

  personalhomepage: function (w) {
    var myordata = this.data.comdata || [];
    var mylistarr = [];
    mylistarr.push(myordata.gid);
    mylistarr = JSON.stringify(mylistarr);
    wx.reLaunch({
      url: "/page/component/pages/dldlcreate/dldlcreate?mylist=" + mylistarr,
    })
  },
  // 取消保存图片授权
  imgCanelTg: function () {
    app.showToastC('保存失败');
    this.setData({ shareshopiftr: false, tgimgbox: false, picbox: false });
  },
  awajump: function () {
    var cart_id = this.data.comdata.cart_id || '';
    wx.navigateTo({
      url: "/page/component/pages/awardwinningarea/awardwinningarea?cart_id=" + cart_id,
    });
    this.setData({ awatip: false });
  },
  awatipdisnone: function () {
    this.setData({ awatip: false });
  },
  // 大咖图片生成
  generatePicturesbs: function () {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    });
    var prize = _this.data.comdata.prizeCover || [];
    var prizenum = prize.length;
    if (prizenum == 1) {
      var goodspo = prize[0].gcover || '';
      if (goodspo.indexOf("https") < 0) {
        goodspo = goodspo.replace(/http/, 'https');
      }
    } else {
      var goodspo = prize[0].gcover || '';
      if (goodspo.indexOf("https") < 0) {
        goodspo = goodspo.replace(/http/, 'https');
      }
      var goodspt = prize[1].gcover || '';
      if (goodspt.indexOf("https") < 0) {
        goodspt = goodspt.replace(/http/, 'https');
      }
    };

    var ctxt = wx.createCanvasContext('canimgserceshi')
    wx.getImageInfo({
      src: goodspo,
      success: function (res) {
        if (prizenum == 1) {
          ctxt.drawImage(res.path, 130, 296, 114, 114);
          wx.getImageInfo({
            src: "https://www.51chaidan.com/images/cast/ca_1.png",
            success: function (res) {
              ctxt.drawImage(res.path, 0, 0, 375, 603);

              // 第一步 底部背景颜色改变
              ctxt.fillStyle = '#feffff';
              ctxt.fillRect(0, 603, 375, 185);
              ctxt.draw(true);
              // 第二部 渲染标题
              var strnew = '—— 在线抽盒机 ——';
              ctxt.setFontSize(13);
              ctxt.setFillStyle('#000');
              ctxt.fillText(strnew, (375 - ctxt.measureText(strnew).width) / 2, 628);
              ctxt.draw(true);
              // 第三部 渲染左边图片
              wx.getImageInfo({
                src: _this.data.activityblindbox[0].cover,
                success: function (res) {
                  // 渲染左边图片
                  ctxt.fillStyle = '#fff';
                  ctxt.fillRect(15, 645, 165, 130);
                  ctxt.draw(true);
                  ctxt.drawImage(res.path, 15, 645, 165, 80)
                  ctxt.draw(true);
                  ctxt.setFontSize(11);
                  ctxt.setFillStyle('#000');
                  ctxt.fillText(_this.data.activityblindbox[0].name, 18, 742);
                  ctxt.draw(true);
                  ctxt.setFontSize(11);
                  ctxt.setFillStyle('#ff2742');
                  ctxt.fillText('￥' + _this.data.activityblindbox[0].shop_price, 18, 762);
                  ctxt.draw(true);
                  if (_this.data.activityblindbox[0].tip) {
                    ctxt.setFontSize(10);
                    ctxt.setFillStyle('#ff2742');
                    ctxt.fillText(_this.data.activityblindbox[0].tip, 108, 762);
                    ctxt.draw(true);
                    ctxt.strokeStyle = "#ff2742";
                    ctxt.lineWidth = 1;
                    ctxt.strokeRect(105, 750, ctxt.measureText(_this.data.activityblindbox[0].tip).width + 6, 16);
                    ctxt.draw(true);
                  }

                  // 第四部 渲染右边图片
                  wx.getImageInfo({
                    src: _this.data.activityblindbox[1].cover,
                    success: function (res) {
                      // 渲染右边图片
                      ctxt.fillStyle = '#fff';
                      ctxt.fillRect(195, 645, 165, 130);
                      ctxt.draw(true);
                      ctxt.drawImage(res.path, 195, 645, 165, 80)
                      ctxt.draw(true);
                      ctxt.setFontSize(11);
                      ctxt.setFillStyle('#000');
                      ctxt.fillText(_this.data.activityblindbox[1].name, 198, 742);
                      ctxt.draw(true);
                      ctxt.setFontSize(11);
                      ctxt.setFillStyle('#ff2742');
                      ctxt.fillText('￥' + _this.data.activityblindbox[1].shop_price, 198, 762);
                      ctxt.draw(true);
                      if (_this.data.activityblindbox[1].tip) {
                        ctxt.setFontSize(10);
                        ctxt.setFillStyle('#ff2742');
                        ctxt.fillText(_this.data.activityblindbox[1].tip, 288, 762);
                        ctxt.draw(true);
                        ctxt.strokeStyle = "#ff2742";
                        ctxt.lineWidth = 1;
                        ctxt.strokeRect(285, 750, ctxt.measureText(_this.data.activityblindbox[1].tip).width + 6, 16);
                        ctxt.draw(true);
                      };
                      ctxt.draw(true, setTimeout(function () {
                        wx.canvasToTempFilePath({
                          canvasId: 'canimgserceshi',
                          success: function (res) {
                            _this.setData({
                              actimgshare: res.tempFilePath,
                            });
                            wx.hideLoading()
                          },
                          fail: function (res) {
                            wx.hideLoading()
                            app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:01}');
                            _this.setData({
                              upserimgbox: false,
                            });
                            
                          },
                        });
                      }, 300));

                    },
                    fail: function () {

                    },
                  });
                },
                fail: function () {

                },
              });  

            },
            fail: function (res) {
              wx.hideLoading()
              app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:02}');
              _this.setData({
                upserimgbox: false,
              });
              
            }
          });
        } else {
          ctxt.drawImage(res.path, 66, 293, 114, 114);
          wx.getImageInfo({
            src: goodspt,
            success: function (res) {
              ctxt.drawImage(res.path, 195, 293, 114, 114);
              wx.getImageInfo({
                src: "https://www.51chaidan.com/images/cast/ca_2.png",
                success: function (res) {
                  ctxt.drawImage(res.path, 0, 0, 375, 603);


                  // 第一步 底部背景颜色改变
                  ctxt.fillStyle = '#feffff';
                  ctxt.fillRect(0, 603, 375, 185);
                  ctxt.draw(true);
                  // 第二部 渲染标题
                  var strnew = '—— 在线抽盒机 ——';
                  ctxt.setFontSize(13);
                  ctxt.setFillStyle('#000');
                  ctxt.fillText(strnew, (375 - ctxt.measureText(strnew).width) / 2, 628);
                  ctxt.draw(true);
                  // 第三部 渲染左边图片
                  wx.getImageInfo({
                    src: _this.data.activityblindbox[0].cover,
                    success: function (res) {
                      // 渲染左边图片
                      ctxt.fillStyle = '#fff';
                      ctxt.fillRect(15, 645, 165, 130);
                      ctxt.draw(true);
                      ctxt.drawImage(res.path, 15, 645, 165, 80)
                      ctxt.draw(true);
                      ctxt.setFontSize(11);
                      ctxt.setFillStyle('#000');
                      ctxt.fillText(_this.data.activityblindbox[0].name, 18, 742);
                      ctxt.draw(true);
                      ctxt.setFontSize(11);
                      ctxt.setFillStyle('#ff2742');
                      ctxt.fillText('￥' + _this.data.activityblindbox[0].shop_price, 18, 762);
                      ctxt.draw(true);
                      if (_this.data.activityblindbox[0].tip) {
                        ctxt.setFontSize(10);
                        ctxt.setFillStyle('#ff2742');
                        ctxt.fillText(_this.data.activityblindbox[0].tip, 108, 762);
                        ctxt.draw(true);
                        ctxt.strokeStyle = "#ff2742";
                        ctxt.lineWidth = 1;
                        ctxt.strokeRect(105, 750, ctxt.measureText(_this.data.activityblindbox[0].tip).width + 6, 16);
                        ctxt.draw(true);
                      }

                      // 第四部 渲染右边图片
                      wx.getImageInfo({
                        src: _this.data.activityblindbox[1].cover,
                        success: function (res) {
                          // 渲染右边图片
                          ctxt.fillStyle = '#fff';
                          ctxt.fillRect(195, 645, 165, 130);
                          ctxt.draw(true);
                          ctxt.drawImage(res.path, 195, 645, 165, 80)
                          ctxt.draw(true);
                          ctxt.setFontSize(11);
                          ctxt.setFillStyle('#000');
                          ctxt.fillText(_this.data.activityblindbox[1].name, 198, 742);
                          ctxt.draw(true);
                          ctxt.setFontSize(11);
                          ctxt.setFillStyle('#ff2742');
                          ctxt.fillText('￥' + _this.data.activityblindbox[1].shop_price, 198, 762);
                          ctxt.draw(true);
                          if (_this.data.activityblindbox[1].tip) {
                            ctxt.setFontSize(10);
                            ctxt.setFillStyle('#ff2742');
                            ctxt.fillText(_this.data.activityblindbox[1].tip, 288, 762);
                            ctxt.draw(true);
                            ctxt.strokeStyle = "#ff2742";
                            ctxt.lineWidth = 1;
                            ctxt.strokeRect(285, 750, ctxt.measureText(_this.data.activityblindbox[1].tip).width + 6, 16);
                            ctxt.draw(true);
                          };


                          ctxt.draw(true, setTimeout(function () {
                            wx.canvasToTempFilePath({
                              canvasId: 'canimgserceshi',
                              success: function (res) {
                                _this.setData({
                                  actimgshare: res.tempFilePath,
                                });
                                wx.hideLoading()
                              },
                              fail: function (res) {
                                wx.hideLoading()
                                app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:03}');
                                _this.setData({
                                  upserimgbox: false,
                                });
                                
                              },
                            });
                          }, 300));

                        },
                        fail: function () {

                        },
                      });
                    },
                    fail: function () {

                    },
                  });

                },
                fail: function (res) {
                  wx.hideLoading()
                  app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:04}');
                  _this.setData({
                    upserimgbox: false,
                  });
                  
                }
              });
            },
            fail: function (res) {
              wx.hideLoading()
              app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:05}');
              _this.setData({
                upserimgbox: false,
              });
              
            }
          });
        }

      },
      fail: function (res) {
        wx.hideLoading()
        app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:06}');
        _this.setData({
          upserimgbox: false,
        });
        
      }
    });
  },
  jumpowntoy: function () {
    var _this = this;
    wx.navigateTo({
      url: "/page/component/pages/myothertoydg/myothertoydg?ownerId=" + _this.data.uid
    })
  },
  subscrprofun: function () {
    this.setData({ subscrproiftr: false })
  },

  // 计算图片大小
  imageLoadad: function (e) {
    var _this = this;
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;
    var viewHeight = 140,           //设置图片显示宽度，
      viewWidth = 140 * ratio;
    var commoddata = this.data.comdata;
    console.log()
    if (viewWidth > 140) {
      viewWidth = 140;
    };
    if (commoddata) {
      commoddata.width = viewWidth;
      _this.setData({
        comdata: commoddata
      });
    };
  },








  dlfindfun: function () {
    wx.reLaunch({
      url: "/page/component/pages/dlfind/dlfind",
    })
  },
  // 导航跳转
  whomepage: function () {
    wx.reLaunch({
      url: "../../../../pages/index/index?judgeprof=2"
    })
  },
  wmy: function () {
    wx.reLaunch({
      url: "../../../../pages/wode/wode"
    });
  },
  wshoppingCart: function () {
    wx.reLaunch({
      url: "../../../../pages/shoppingCart/shoppingCart"
    });
  },

  // 导航跳转 
  wnews: function () {
    var _this = this;
    app.limitlottery(_this);
  },
  // 拉起订阅
  subscrfunstar: function () {
    var _this = this;
    var subscribedata = _this.data.subscribedata || '';
    if (subscribedata && subscribedata.template_id && app.signindata.subscribeif) {
      if (subscribedata.template_id instanceof Array) {
        wx.requestSubscribeMessage({
          tmplIds: subscribedata.template_id || [],
          success(res) {
            for (var i = 0; i < subscribedata.template_id.length; i++) {
              if (res[subscribedata.template_id[i]] == "accept") {
                app.subscribefun(_this, 0, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
              };
            };
          },
        })
      } else {
        wx.requestSubscribeMessage({
          tmplIds: [subscribedata.template_id || ''],
          success(res) {
            if (res[subscribedata.template_id] == "accept") {
              app.subscribefun(_this, 0, subscribedata.template_id, subscribedata.subscribe_type);
            };
          }
        })
      };
    };
  },











})