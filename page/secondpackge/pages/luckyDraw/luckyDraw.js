var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
var WxParse = require('../../../../wxParse/wxParse.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '展会VIP抽选', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    perayu:0, // 0正常分享  1朋友圈
    share_time:0,
    share_uid:0,
    countdown:'',
    percent:'',
    isRecordMask:false,
    isAwardMask:false,
    isidCardMask:false,
    idcardIndex:0,
    selectCard:0,
    // 绑定身份证id
    bindIdcard:'',
    bindDate:'',
    // 抽奖数
    drawnum:1,
    isShowRule:false,
    isPrior:false,
    // 弹框数据
    mySignatureNumber:false,
    signatureList:false,
    winningProbability:false,
    // 是否中奖弹框
    wonOrNot:false,
    sigListdata:[],
    rLUserLotto:{},
    muSnData:[],
    multipleDisplay:'',
    displayClearText:false,
    id:'',
    current:1,
    commoddata:{},
    // 邀请倒计时
    askcountdown: 0,
    // 收货地址
    receivingaddress:false,
    tipback:false,
    // 收货地址数据
    addressdata:[],
    // 收货地址显示 请选择收货地址
    tipaddress:'请选择收货地址',
    tipaid:'',
    // 订单信息
    order:'',
    // 订票服务条款
    displayToBS:false,
    termsOfBookingService:''
  },
  displayToBSfun(){
     this.setData({
      displayToBS:!this.data.displayToBS
     })
  },
  tabChangeFun(e){
    this.setData({
      current: e.currentTarget.dataset.ind
    });
  },
  plusXing (str,frontLen,endLen) {
    var len = str.length-frontLen-endLen;
    var xing = '';
    for (var i=0;i<len;i++) {
    xing+='*';
    }
    return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
  },
  changeTickets(e){
    this.setData({
      id: e.currentTarget.dataset.id,
      sigListdata:[],
      muSnData:[],
      share_uid:0
    });
    this.getInfo();
  },
  getInfo(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var diffTime = Date.parse(new Date())/1000 - _this.data.share_time;
    console.log('diffTime===',diffTime)
    var q = Dec.Aese('mod=lotto&operation=info&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&isNewer=' + _this.data.isNewer + '&gid=' + _this.data.gid + '&push_id='+_this.data.push_id + '&shareUId=' + _this.data.share_uid +'&diffTime='+diffTime);
    console.log('mod=lotto&operation=info&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&isNewer=' + _this.data.isNewer + '&gid=' + _this.data.gid + '&push_id='+_this.data.push_id + '&shareUId=' + _this.data.share_uid +'&diffTime='+diffTime)

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        _this.data.push_id = 0;
        console.log('数据======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200 || res.data.ReturnCode == 201 || res.data.ReturnCode == 202) {
          let dataInfo = res.data.Info;

          if(dataInfo.sort){
            if(parseInt(dataInfo.sort) < 10){
              dataInfo.sort = '00'+dataInfo.sort
            }else if(dataInfo.sort.length == 2){
              dataInfo.sort = '0'+ dataInfo.sort.toString()
            }; 
          };


          _this.setData({
            dataInfo,
            priority: res.data.List.priority,
            countdown: dataInfo.status==1?res.data.Info.start_time:dataInfo.status==2?res.data.Info.stop_time:0,
            subscribedata:res.data.Info.subscribe,
            signTime:dataInfo.pay_time,
          });  

          if(dataInfo.status == 2 && dataInfo.countLotto!=0){
            let diffTime = (Date.parse(new Date())/1000) - dataInfo.pay_time;
            if(diffTime<30){
              _this.cdtime(30-diffTime);
            }else{
              _this.setData({
                askcountdown:0
              })
              clearInterval(_this.data.interval);
            }
          }else{
            _this.setData({
              askcountdown:0
            })
            clearInterval(_this.data.interval);
          }

          // 商品详情 
          WxParse.wxParse('article', 'html', dataInfo.actionDetails, _this, 0);
          // 活动结束 显示中奖未中奖弹框
          if(dataInfo.status == 3){
            _this.wonOrNot()
          }
          _this.countdownbfun();        
        };
        if(res.data.ReturnCode != 200){
          wx.showToast({
            title: res.data.Msg,
            icon: 'none',
            mask:true,
            duration:1000
          });  
        }

      }
    }); 
  },

  joinDraw(){
    var _this = this;
    wx.showLoading({title: '加载中...',mask:true});

    if (this.data.tipaid == '') {
      app.showToastC('请选择地址');
      _this.setData({
        receivingaddress:true
      })
      return false;
    };

    var q1 = Dec.Aese('mod=lotto&operation=joinDraw&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&aid='+this.data.tipaid);
    console.log('参与抽签','mod=lotto&operation=joinDraw&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&aid='+this.data.tipaid)
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        console.log('参与抽签数据=====================',res)
        if (res.data.ReturnCode == 358) {
          _this.data.order = res.data.Info;
          _this.paymentmony();
        }else{
          app.showToastC(res.data.msg);
        }
      }
    })
  },
  // 微信支付
  paymentmony:function(){
    var _this = this; 
    var q = Dec.Aese('mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + _this.data.order.cart_id + '&xcx=1' + '&openid=' + app.signindata.openid)

    console.log('支付=====',app.signindata.comurl + 'order.php?mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + _this.data.order.cart_id + '&xcx=1' + '&openid=' + app.signindata.openid)

    wx.request({
      url: app.signindata.comurl + 'order.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          wx.hideLoading();
          var payinfo = res.data.Info;
          _this.data.subscribedata = res.data.Info.subscribe || ''  // 订阅信息
          wx.requestPayment({
              'timeStamp': res.data.Info.timeStamp.toString(),
              'nonceStr': res.data.Info.nonceStr,
              'package': res.data.Info.package,
              'signType': 'MD5',
              'paySign': res.data.Info.paySign,
              'success': function (res) { 

                _this.getInfo();
                _this.cdtime(30);
              },
              'fail':function(res){},
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
               
          // 判断非200和登录
          Dec.comiftrsign(_this, res, app);     
        };   
      }
    })
  },

  // 邀请倒计时
  cdtime: function (cdtime) {
    var _this = this;
    clearInterval(_this.data.interval);
    var totalSecond = cdtime;
    var interval =function () {
      var second = totalSecond;// 秒数  
      // 秒位  
      var sec = second;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;
      _this.setData({
        askcountdown: secStr,
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
  onLoad: function (options) {
    // 判断是否授权
    var _this = this;
    _this.setData({
      id: options.id || 374855
    });
    _this.data.share_uid = options.share_uid || 0;
    _this.data.share_time = options.share_time || 0;
    // 是否是朋友圈进入
    _this.data.perayu = options.perayu || 0;
    // 推送统计
    _this.data.push_id = options.push_id || 0;
    _this.activsign();
    _this.countdownbfun();        
    // this.onLoadfun(); 
  },
  onLoadfun:function(){
    var _this = this;
    _this.setData({
      uid: app.signindata.uid,
      loginid: app.signindata.loginid,
    });  
    _this.data.isNewer = app.signindata.isNewer;
    
    _this.getInfo();
    _this.nextpagediao();
    wx.request({
      url: 'https://cdn.51chaidan.com/produce/ticketsLotto.json?time='+app.signindata.appNowTime,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('规则==========',res)
        _this.setData({
          termsOfBookingService:res.data.clause || ''
        });
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
          console.log(11111111111111111111111111111)
          _this.setData({
            tgabox: false,
            signinlayer: false
          })
          console.log()
          // '没有授权 统计'
          app.userstatistics(49);
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.share_uid = 0;
    this.getInfo();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this;
    if(this.data.dataInfo.countLotto == 0 || this.data.dataInfo.status == 3 || this.data.dataInfo.status == 1){
      return {
        title:this.data.dataInfo.shareTitle,
        path: "/page/secondpackge/pages/luckyDraw/luckyDraw?id="+_this.data.id,
        imageUrl:this.data.dataInfo.shareImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
      }   
    }else{
      return {
        title:this.data.dataInfo.shareTitle,
        path: "/page/secondpackge/pages/luckyDraw/luckyDraw?share_uid=" + _this.data.uid + "&share_time=" + _this.data.signTime +'&id='+_this.data.id,
        imageUrl:this.data.dataInfo.shareImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
      }  
    }
     
  },
  // /**
  //  * 用户点击右上角分享
  //  */
  onShareTimeline:function(){
    var _this = this;
    var indexShare = app.signindata.indexShare || [];
    var indexShareNum = Math.floor(Math.random() * indexShare.length) || 0;
    var indexShareImg = '';
    if(indexShare.length!=0 && indexShare[indexShareNum]){
      indexShareImg = indexShare[indexShareNum]+'?time=' + Date.parse(new Date());;
    };
    if(this.data.dataInfo.countLotto == 0){
      return {
        title:this.data.dataInfo.shareTitle,
        query:'perayu=1&id='+_this.data.id,
        imageUrl:this.data.dataInfo.shareImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
      } 
    }else{
      return {
        title:this.data.dataInfo.shareTitle,
        query:'share_uid='+_this.data.uid+'&share_time=' + _this.data.signTime+'&perayu=1&id='+_this.data.id,
        imageUrl:this.data.dataInfo.shareImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
      }
    }
  
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
        dayStr:commoddata.day,
        hrStr:commoddata.hour,
        minStr:commoddata.minute,
        secStr:commoddata.second,
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
  // 跳转
  jumpOtherPage:function(w){
    var num = w.currentTarget.dataset.num || w.target.dataset.num || 100000;
    var whref = w.currentTarget.dataset.whref || w.target.dataset.whref || 100000;
    var title = w.currentTarget.dataset.title || w.target.dataset.title || '';
    app.comjumpwxnav(num,whref,title);
    if(num==9){
      this.data.isJumpSignin = true;
    }
  },
  jumpVipPage(){
    wx.navigateTo({  
      url: "/page/secondpackge/pages/vipPage/vipPage"
    })
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

   // 下一页返回调取
   nextpagediao:function(){
    var _this = this;
    //  调取收货地址
    var q = Dec.Aese('mod=address&operation=getlist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'user.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('收货地址======nextpagediao=======',res)
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
    // 隐藏收货地址弹框
  receivingaddressfun:function(){
    this.setData({
      receivingaddress: false,
      tipback:false,
    })
  },
   // 收货地址弹框
  seladdressfun:function(e){
    this.setData({
      receivingaddress:true,
      tipback:true,
      isAwardMask:false,
      isRecordMask:false,
      awardId:e.currentTarget.dataset.id
    });
  },
  // 删除地址
  deladdress: function (event){
    var _this = this;
    var dat = this.data.addressdata;
    var indid = event.target.dataset.ind;
    var num = '';
    var iftrdefault = false;
    for (var i = 0; i < dat.length; i++) {
      if (dat[i].aid == indid) {
        num = i;
        if (dat[i].isdefault == 1) {
          iftrdefault = true;
        }
      }
    };
    if (iftrdefault) {
      app.showToastC('默认地址不能删除');
      return false;
    };
    wx.showModal({
      content: '您确定要删除这个地址吗？',
      success: function (res) {
        if (res.confirm) {
          var q = Dec.Aese('mod=address&operation=delete&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + indid)
          wx.request({
            url: app.signindata.comurl + 'user.php'+q,
            method: 'GET',
            header: { 'Accept': 'application/json' },
            success: function (res) {
              if (res.data.ReturnCode == 200){
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
      receivingaddress: false,
      tipback:false
    });
  },
  // 中奖概率 弹框
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
  wonOrNot(){
    this.setData({wonOrNot:!this.data.wonOrNot})
  },
  // 已获得幸运值
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
              muSnData:muSnData || [],
              totalLotto:res.data.Info.totalLotto
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
  // 排行榜
  sigListFun(){
    var _this = this;
    if(_this.data.sigListdata.length == 0){
      console.log(_this.data.id)
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
  //  复制内容到粘贴板
  copyTBL: function (e) {
    var _this = this;
    wx.setClipboardData({
      data: _this.data.dataInfo.cdkey || '',
      success: function (res) {
        app.showToastC('复制成功');
      }
    });

  },  
  // 激活码 是否明文 切换
  is_dct:function(){
    this.setData({
      displayClearText:!this.data.displayClearText
    })
  },
  // 去激活
  deactivation(){
    wx.navigateTo({
      url: "/page/secondpackge/pages/bindTicket/bindTicket"
    })  
  },
  // 跳转展会门票
  acetlistfun(){
    wx.navigateTo({  
      url: "/page/secondpackge/pages/buyingTickets/buyingTickets"
    })
  },
  jumpWinningResult(){
    wx.navigateTo({  
      url: "/page/secondpackge/pages/winningResult/winningResult"
    })
  }
})