var Dec = require('../../../../common/public.js');//aes加密解密js

var COS = require('../../../../common/cos-wx-sdk-v5.js');

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

    // 电子票
    electronicTicket:true,
    vipOrOrderTip:false,
    myOrderNowTime: Date.parse(new Date()) / 1000,
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
        // 直接支付
        this.paymentmony();
    };
  },
  // 复制单号
  copyCart(w){
    var cart = w.currentTarget.dataset.cart || w.target.dataset.cart || '';
    var _this = this;
    wx.setClipboardData({
      data: cart || '',
      success: function (res) {
        app.showToastC('复制成功');
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
  // 更新用户信息
  getUserProfileRefundtiosun(w){
    app.getUserProfile((res,userInfo) => {
        this.refundtiosun();
    },'',1);
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

















  // 点击登录获取权限
  userInfoHandler: function (e) {
    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        if (true) {
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

    if(activity_id == 374856 || activity_id ==  374855 || activity_id == 374857){
      wx.navigateTo({
        url: "/page/secondpackge/pages/luckyDraw/luckyDraw"
      })  
    }else if(_this.data.comdata.isToyshowDrawGoods){
      wx.navigateTo({
        url: "/page/secondpackge/pages/buyingTickets/buyingTickets"
      });
    }else if (order_type == 3) {
      wx.navigateTo({
        url: "/page/component/pages/imdetailspage/imdetailspage?goods_id=" + gid
      });
    }else if (order_type==2){
      wx.navigateTo({    
        url: "../../../../pages/activitydetailspage/activitydetailspage?id=" + activity_id
      })
    } else if (order_type == 16 || !_this.data.comdata.skipGoodsDesc){
      return;
    } else if (order_type == 17) {
      wx.navigateTo({
        url: "/page/component/pages/crowdfunding/crowdfunding?aid=" + activity_id
      })
    } else if(order_type == 13 || order_type == 27){
      wx.navigateTo({    
        url: "/page/component/pages/limitlottery/limitlottery?id=" + activity_id+'&list=1'
      });
    } else if(order_type == 21){
      wx.navigateTo({   
        url: "/page/secondpackge/pages/aRewardDetails/aRewardDetails?id=" + activity_id
      });
    } else{
      app.comjumpwxnav(1,gid,'');
    }     

  },
  //时间戳转换时间  
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
  /**
   * 生命周期函数--监听页面加载
   */
  otherfunsettime:function(){
    var _this = this;
    setTimeout(function(){
      // 购物车数量
      Dec.shopnum(_this,app.signindata.comurl);
      // 调取晒单数量
      Dec.dryingSum(_this, app.signindata.clwcomurl);
    },1500);
  },
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
      defaultinformation:app.signindata.defaultinformation,
    });
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    var q = Dec.Aese('mod=getinfo&operation=orderdetail&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + _this.data.oid + '&blackCity=' + _this.data.blackCity);
    console.log('订单详情请求===','mod=getinfo&operation=orderdetail&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + _this.data.oid + '&blackCity=' + _this.data.blackCity)

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
            res.data.Info.audit_time = _this.toDate(res.data.Info.audit_time||0);
            res.data.Info.apply_time = _this.toDate(res.data.Info.apply_time||0);
            res.data.Info.gift_time = _this.toDate(res.data.Info.gift_time || 0);
            res.data.Info.receive_time = _this.toDate(res.data.Info.receive_time||0,1);
            res.data.Info.overtime = _this.toDate(res.data.Info.overtime || 0, 2);
            if(res.data.Info.payTime && res.data.Info.payTime!=0){
              res.data.Info.payTime = _this.toDate(res.data.Info.payTime||0);
            }

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

            if(res.data.Info.isToyshowDrawGoods){
              var nowTime = (new Date().getTime())/1000;
              if(nowTime > res.data.Info.ticketEndDisplay){  // 过期 过期
                  res.data.Info.isItOverdue = true;
              }; 
            };

            _this.setData({
              isShareGood:isShareGood,
              comdata: res.data.Info,
              id: res.data.Info.gid,
              subscribedata: res.data.Info.subscribe,
            })
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

    if(this.data.defaultinformation){}else{
      app.defaultinfofun(this);
    }

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
          if (true) {
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
  onHide: function() {
    // 调用重置刷新
    app.resetdownRefresh();
  },

  onUnload: function() {
    // 调用重置刷新
    app.resetdownRefresh();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    app.downRefreshFun(() => {
      this.onLoadfun();
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareTimeline:function(){
    var _this = this;
    return {
      title:_this.data.c_title || '潮玩社交平台',
      query:{'oid': _this.data.oid,}    
    }
  },
  onShareAppMessage: function () {
    var _this = this;
    var gar = parseFloat(_this.data.comdata.goods_amount||1)/parseFloat(_this.data.comdata.gnumber||1);
    if (false) {
      var shareimg = _this.data.paycheadwsongimg || _this.data.comdata.gcover;
      var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
      if (!reg.test(shareimg)) {
        shareimg = _this.data.zdyurl + shareimg;
      };
      _this.paymentcompletionwimg();
      var reshare = {
        // title: '￥' + gar.toFixed(2) + "  " + _this.data.comdata.pre_name + " " + _this.data.comdata.ds + " " + _this.data.comdata.gname,  // 转发标题（默认：当前小程序名称）
        title: _this.data.comdata.couponValue ? '我刚买了这个商品，一起下单各领￥' + _this.data.comdata.couponValue + '立减金' : '￥' + gar.toFixed(2) + "  " + _this.data.comdata.pre_name + " " + _this.data.comdata.ds + " " + _this.data.comdata.gname,
        path: 'pages/detailspage/detailspage?gid=' + _this.data.comdata.gid + '&store_id=0',
        imageUrl: shareimg,
        success: function (res) {
        },
      };
      var q = Dec.Aese('mod=share&operation=order&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + _this.data.comdata.cart_id)
      wx.request({
        url: app.signindata.comurl + 'user.php' + q,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {
          if (res.data.ReturnCode == 200) {
            app.showToastC(res.data.Info.notify);
          };
          if (res.data.ReturnCode == 900) {
            app.showToastC('登陆状态有误');
          };
          if (res.data.ReturnCode == 800) {
            app.showToastC('非该用户订单');
          };
          if (res.data.ReturnCode == 701) {
            app.showToastC('订单状态有误(不是“已完成”状态)');
          };
          _this.onLoadfun();
        },
      });      
    } else {
      if (_this.data.comdata.order_type==2){
        var reshare = {
          // title: '手慢无！我' + (_this.data.comdata.goods_price == 0 ? '免费' : '￥0.01')+'赢得了' + "  " + _this.data.comdata.pre_name + " " + _this.data.comdata.ds + " " +_this.data.comdata.gname,
          title: '免费送你' + _this.data.comdata.gname,
          // title: '我刚买了这个商品，一起下单各领立减金',
          path: '/pages/activitydetailspage/activitydetailspage?id=' + _this.data.comdata.gid + '&store_id=0&cs=1',
          imageUrl: _this.data.comdata.gcover,
          success: function (res) {
          },
        }; 
        var q = Dec.Aese('mod=share&operation=goods&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&gid=' + _this.data.comdata.gid)
        wx.request({
          url: app.signindata.comurl + 'user.php' + q,
          method: 'GET',
          header: { 'Accept': 'application/json' },
          success: function (res) {
            _this.onLoadfun();
          },
        });        
      } else if (_this.data.comdata.order_type == 3){
        var reshare = {
          title: '我用拆币兑换了' + _this.data.comdata.gname + '，一起分享赢拆币！',
          path: '/page/component/pages/imdetailspage/imdetailspage?goods_id=' + _this.data.comdata.gid,
          imageUrl: _this.data.comdata.gcover,
          success: function (res) {},
        };
      } else if (_this.data.comdata.order_type == 21){  // 一番赏
        var reshare = {
          title:_this.data.comdata.gname + ' 来看我一发入魂',
          path: "/page/secondpackge/pages/aRewardDetails/aRewardDetails?id=" + _this.data.comdata.activity_id,
          imageUrl: _this.data.comdata.gcover,
          success: function (res) { },
        };
      }else{
        var reshare = {
          // title: '￥' + gar.toFixed(2) + "  " + _this.data.comdata.pre_name + " " + _this.data.comdata.ds + " " +_this.data.comdata.gname,  // 转发标题（默认：当前小程序名称）
          title: _this.data.comdata.couponValue ? '我刚买了这个商品，一起下单各领￥' + _this.data.comdata.couponValue + '立减金' : '￥' + gar.toFixed(2) + "  " + _this.data.comdata.pre_name + " " + _this.data.comdata.ds + " " + _this.data.comdata.gname,
          path: '/pages/detailspage/detailspage?gid=' + _this.data.comdata.gid + '&store_id=0',
          imageUrl: _this.data.comdata.gcover,
          success: function (res) {},
        };        
      }

    }
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
  // 寄回物流
  sendBackLogistics:function(w){
    var id = w.target.dataset.id || w.currentTarget.dataset.id;
    var gcover = w.target.dataset.gcover || w.currentTarget.dataset.gcover;
    wx.navigateTo({  
      url:'/page/settled/pages/sendBackLogistics/sendBackLogistics?id='+id+'&gcover='+gcover
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
    app.comjumpwxnav(998,'','');
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
// 不检验
vipOrOrdercancel(){
  this.setData({
    vipOrOrderTip:false
  })
},
// 检验
vipOrOrdermine1(){
  var _this = this;
  var comdata = _this.data.comdata;
  wx.showLoading({ title: '加载中...', mask:true })
  
  var q = Dec.Aese('mod=bind&operation=verifyTicket&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&ticketType=' + _this.data.comdata.ticketType + '&ticketIdentify='+ _this.data.comdata.ticketIdentify + '&keyDay=' + (_this.data.comdata.keyDay || ''))

  console.log('mod=bind&operation=verifyTicket&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&ticketType=' + _this.data.comdata.ticketType + '&ticketIdentify='+ _this.data.comdata.ticketIdentify + '&keyDay=' + (_this.data.comdata.keyDay || ''))

  wx.request({
    url: app.signindata.comurl + 'toy.php'+q,
    method: 'GET',
    header: { 'Accept': 'application/json' },
    success: function (res) {
      console.log('票务信息统计===',res)
      // 刷新完自带加载样式回去
      wx.stopPullDownRefresh();
      wx.hideLoading()
      if (res.data.ReturnCode == 200){
          if(_this.data.comdata.isReceive){
            if(_this.data.comdata.ticketType == "vip" ){
              wx.navigateTo({ 
                url: "/pages/collectGiftBag/collectGiftBag?isv=1&oid="+comdata.oid 
              });
            }else{
              wx.navigateTo({ 
                url: "/pages/collectGiftBag/collectGiftBag?isv=2&oid="+comdata.oid 
              });
            };

          }else{
            // 提交订单蒙层
            _this.setData({
              suboformola: true
            });    
            // 直接支付
            _this.paymentmony(); 
          };
      }else{
          wx.showModal({
            title: '提示',
            content: res.data.Msg || res.data.msg,
            showCancel: false,
            success: function (res) {}
          })          
      };


    }
  });


},

  // 付款
  payment: function () {
    var _this = this;
    var comdata = _this.data.comdata;

    if(comdata.needVerifyTicket){

      if(_this.data.comdata.isReceive){
        var txttxt = _this.data.comdata.ticketType == "vip" ? 1 :2;
      }else{
        var txttxt = 3;
      }

      _this.setData({
          vipOrOrder:txttxt,
          vipOrOrderTip:true,
      })


      // wx.showModal({
      //   content:txttxt,
      //   cancelText: '核验',
      //   confirmText: '不核验',
      //   confirmColor:'#000',
      //   cancelColor: '#000',
      //   success (res) {
      //     if (res.cancel) {
                         
      //      } else if (res.confirm) {
             
      //      }
      //    }
      // })

      

      
           
    }else{
      if(comdata.isReceive){
        if(comdata.ticketType == "vip" ){
          wx.navigateTo({ 
            url: "/pages/collectGiftBag/collectGiftBag?isv=1&oid="+comdata.oid  
          });
        }else{
          wx.navigateTo({ 
            url: "/pages/collectGiftBag/collectGiftBag?isv=2&oid="+comdata.oid
          });
        };        
      }else{
        if(comdata.isNeedConfirm){
          this.closeCommonTip();
        }else{
          // 提交订单蒙层
          this.setData({
            suboformola: true
          });    
          // 直接支付
          this.paymentmony();
        };
      };

    };


    
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
                suboformola: false,
                vipOrOrderTip:false
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
                suboformola: false,
                vipOrOrderTip:false
              }); 
              _this.onLoadfun();             
             },
            'complete': function (res) { }
          })
        }else{
          _this.setData({
            suboformola: false
          }); 
          app.showModalC(res.data.Msg || res.data.msg || '');   
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
      data: self.data.defaultinformation.cs.wxid,
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
    if (item_type == 996) {
      this.setData({
        awatip: true,
        awardrresentiftr:false
      })
    } else {   // 取件信息
      app.comjumpwxnav(item_type, whref, wname)     
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
    app.comjumpwxnav(6,'','');
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
        if(anum == 2){


          wx.getImageInfo({
            src: res.tempFiles[0].path,
            success: (ddd) => {
              
              var dddwidth = ddd.width;
              var dddheight = ddd.height;
              console.log('下载图片=========',ddd,dddwidth,dddheight)
    
              if((dddheight/1.594444).toFixed() == dddwidth || (dddheight/1.8426).toFixed() == dddwidth || (dddheight/1.8464).toFixed() == dddwidth || (dddheight/1.596).toFixed() == dddwidth  || (dddheight/1.592).toFixed() == dddwidth){
                app.showModalC('请将晒单图片保存后分享朋友截图上传')
                return false;
              }

              var cos = new COS({
                SecretId: 'AKIDmY0RxErYIm2TfkckG8mEYbcNA4wYsPbe',
                SecretKey: '4WkpgJ5bJlU4B6wNuCG4EDyVnGWUFhw1',
              });
      
              wx.showLoading({
                title: '加载中...',
              })
              console.log(res)
              var filePath = res.tempFiles[0].path;
      
              //获取最后一个.的位置
              var index= filePath.lastIndexOf(".");
              //获取后缀
              var ext = filePath.substr(index+1);
      
              var timestamp = Date.parse(new Date());
              var date = new Date(timestamp);
              var Y = date.getFullYear();
              var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      
              cos.postObject(
                  {
                    Bucket: 'mc-1300990269',
                    Region: 'ap-beijing',
                    Key: 'images/freeOrder/'+Y+M+'/'+ new Date().getTime() +'_'+ app.signindata.uid+ '.'+ext,
                    FilePath: filePath,
                    onProgress: function (info) {
                        console.log(JSON.stringify(info));
                    }
                  },
                  function (err, data) {
                      console.log(data);
                      if(data){
                          wx.request({
                            url:  Dec.comurl() + 'order.php',
                            header: { "Content-Type": "application/x-www-form-urlencoded" },
                            name: 'litpic',
                            method: "POST",
                            data: {
                              'mod':'info',
                              'operation':'upload',
                              'uid': _this.data.uid, 
                              'loginid':_this.data.loginid ,
                              'cart_id':_this.data.comdata.cart_id,
                              'picture_type':2,
                              'type':2,
                              'remotePic':data.Location
                            },
                            success: function (res) {
                              _this.setData({ headhidden: true });
                              wx.hideLoading();
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
                            fail(){
                              _this.setData({ headhidden: true });
                              wx.hideToast();
                              app.showToastC('上传失败');
                            }
                          })
                      }else{
                        wx.hideLoading()
                        _this.setData({ headhidden: true });
                        wx.hideToast();
                        app.showToastC('上传失败');
                      };
                      console.log('err============',err)
                      if(err){
                        wx.hideLoading()
                        _this.setData({ headhidden: true });
                        wx.hideToast();
                        app.showToastC('上传失败');
                      }
                  }
              );


            }
          })

          
        }else{
          var tempFilePaths = res.tempFilePaths[0];
          _this.uploadFile(_this, tempFilePaths, 'litpic', cart_id, anum);
        }
        
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
    app.comjumpwxnav(998,'','');
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
                        src: app.signindata.mergePicImg || 'https://cdn.51chaidan.com/images/default/shareImg.jpg',
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

                  }else if(_this.data.activityblindbox.length != 0){

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
                    }else{
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
                    }

                  },
                  fail: function (res) {
                    wx.hideLoading()
                    // app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:03}');
                    // _this.setData({ upserimgbox: false, headhidden: true });
                    wx.getImageInfo({
                      src: 'https://cdn.51chaidan.com/images/qrcode/qrMc.jpg', // 太阳码
                      success: function (res) {
                        ctxt.drawImage(res.path, 129.5, 340, 60, 60);
                        // ctxt.draw(true);
    
                        if(app.signindata.is_eveShareAdver && app.signindata.mergePicImg){
    
                          // 渲染广告图片
                          wx.getImageInfo({
                            src: app.signindata.mergePicImg || 'https://cdn.51chaidan.com/images/default/shareImg.jpg',
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
    
                      }else if(_this.data.activityblindbox.length != 0){
    
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
                        }else{
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
                        }
    
                      },
                      fail: function (res) {
                        wx.hideLoading()
                        app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:03}');
                        _this.setData({ upserimgbox: false, headhidden: true });
                      }
                    });



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
                        src: app.signindata.mergePicImg || 'https://cdn.51chaidan.com/images/default/shareImg.jpg',
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

                  }else if(_this.data.activityblindbox.length != 0){

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
                    }else{
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
  // 更新用户信息
  getUserProfile(w){
    app.getUserProfile((res,userInfo) => {
      this.data.avatarUrl=userInfo.avatarUrl;
      this.data.nickName=userInfo.nickName;
      this.data.gender=userInfo.gender;
      this.upserimgboxiftr(w)
    })
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
    app.comjumpwxnav(1,gid,'');
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
    app.comjumpwxnav(993,'','');
  },
  // 导航跳转
  whomepage: function () {
    app.comjumpwxnav(998,'','');
  },
  wmy: function () {
    app.comjumpwxnav(9059,'','');
  },
  // 更新用户信息
  getUserProfileRefund(w){
    app.getUserProfile((res,userInfo) => {
        this.refund();
    },'',1);
  },
  refund: function () {
    wx.navigateTo({
      url: "../../../secondpackge/pages/refund/refund?oid="+this.data.oid
    });
  },
  wshoppingCart: function () {
    wx.reLaunch({
      url: "../../../../pages/refund/refund"
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
  // 跳转客服聊天
  jumpTimDetail(e){
    app.getUserProfile((res,userInfo) => {
        var comdata = this.data.comdata;
        var id = comdata.brand_uid;
        var order = {
          order_id: comdata.oid || '',
          order_name: comdata.gname || '',
          photo_url: comdata.gcover || '',
          price: comdata.goods_price || '',
          style: comdata.roleName || '',
        }
        wx.navigateTo({ 
          url: `/page/settled/pages/timHomePage/timHomePage?id=${id}&order=${JSON.stringify(order)}`
        });
    })
  },
  
  // 领取红包封面
  showRedPackage(e){
    wx.showRedPackage({
      url:e.currentTarget.dataset.key,
      success: (res) => {
       }
    })
  },

})