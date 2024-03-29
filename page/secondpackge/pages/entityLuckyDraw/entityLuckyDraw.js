var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '刮刮卡', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    id:'',
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
    isWinner:false,
     // 收货地址
    receivingaddress:false,
    tipback:false,
    // 收货地址数据
    addressdata:[],
    // 收货地址显示 请选择收货地址
    tipaddress:'请选择收货地址',
    tipaid:'',
    awardId:0,
    swiperH: '',//swiper高度
　　nowIdx: 0,//当前swiper索引
　　activity:[]
  },
  showtoast(){
    wx.showToast({
      title: '上一个奖励抽完后将自动开启当前奖励',
      icon: 'none',
      mask:true,
      duration:2000
    }); 
  },
  //获取swiper高度
  getHeight: function (e) {
  　　var winWid = wx.getSystemInfoSync().windowWidth - 2 * 50;//获取当前屏幕的宽度
  　　var imgh = e.detail.height;//图片高度
  　　var imgw = e.detail.width;
  　　var sH = winWid * imgh / imgw + "px"
  　　this.setData({
  　　　　swiperH: sH//设置高度
  　　})
  },
  //swiper滑动事件
  swiperChange: function (e) {
    this.setData({
      nowIdx: e.detail.current,
      id:this.data.activity[e.detail.current].id
    })
  },
 
  togglerecordFun(){
    var _this = this;
    if(!this.data.isRecordMask){
      wx.showLoading({ title: '加载中...'})
      var q = Dec.Aese('mod=scratchCard&operation=drawRecord&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid+'&id='+ _this.data.id);
      console.log(app.signindata.comurl + 'spread.php?mod=scratchCard&operation=drawRecord&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid+'&id='+ _this.data.id)
      wx.request({
        url: app.signindata.comurl + 'spread.php'+q,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {
          console.log('抽奖记录======',res)
          wx.hideLoading();
          if (res.data.ReturnCode == 200) {
            if(res.data.List.awardList.length != 0){
              _this.setData({
                isRecordMask:true,
                awardList:res.data.List.awardList
              })
            }else{
              app.showToastC('你暂时没有抽奖记录')
            }
          }else{
            app.showToastC(res.data.Msg)
          }
        }
      }); 
    }else{
      _this.setData({
        isRecordMask:false
      })
    }
  },
  toggleRuleFun(){
    this.setData({
      isShowRule:!this.data.isShowRule
    })
  },
  toggleawardFun(){
    this.setData({
      isAwardMask:!this.data.isAwardMask
    })
  },
  toggleidCardFun(){
    if(this.data.identity.length == 0){
      wx.showModal({
        title: '提示',
        content: '您还未购买本次展会门票，请先购买门票',
        confirmText: '去购票',
        success (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: "/page/secondpackge/pages/buyingTickets/buyingTickets"
            });
          } else if (res.cancel) {

          }
        }
      })
    }else{
      if(this.data.isidCardMask){
        this.setData({
          idcardIndex: this.data.selectCard
        })
      }else{
        this.setData({
          selectCard : this.data.idcardIndex
        })
      }
      this.setData({
        isidCardMask:!this.data.isidCardMask
      })
    }
  },
  selectCardFun(e){
    var index = e.currentTarget.dataset.index;
    var idcard = e.currentTarget.dataset.idcard;
    var date = e.currentTarget.dataset.date;
    this.setData({
      idcardIndex:index,
      bindIdcard:idcard,
      bindDate:date
    })
  },
  plusXing (str,frontLen,endLen) {
    var len = str.length-frontLen-endLen;
    var xing = '';
    for (var i=0;i<len;i++) {
    xing+='*';
    }
    return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
  },
  getInfo(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=scratchCard&operation=info&id='+ _this.data.id +'&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&shareUId=' + _this.data.share_uid);
    console.log(app.signindata.comurl + 'spread.php?mod=scratchCard&operation=info&id='+ _this.data.id +'&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&shareUId=' + _this.data.share_uid)
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('数据======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200 || res.data.ReturnCode == 384) {
          let data = res.data;
          let nowTime = Date.parse(new Date())/1000;
          _this.setData({
            shareTitle:data.Info.shareTitle,
            shareImg:data.Info.shareImg,
            countdown:data.List.activity[0].stop_time,
            goodsList:data.List.goodsList,
            activity:data.List.activity,
            id:data.List.activity[0].id,
            scratch:data.List.scratch,
            explain:data.Info.explain,
            user:data.Info.user,
            subscribedata:res.data.Info.subscribe,
            suplusChance:data.Info.user.suplusChance,
            isDrawBtn:nowTime>=parseInt(data.List.activity[0].start_time) && nowTime<=parseInt(data.List.activity[0].stop_time)?true:false
          })
          _this.countdownbfun();        
          if(_this.data.addressdata && _this.data.addressdata.length != 0){}else{
            _this.nextpagediao();
          };
          if(res.data.ReturnCode == 384){
            wx.showToast({
              title: res.data.Msg,
              icon: 'none',
              mask:true,
              duration:1500
            });  
            _this.data.share_uid = 0;
          }
        }else{
          wx.showToast({
            title: res.data.Msg,
            icon: 'none',
            mask:true,
            duration:1000
          });  
          // if(res.data.ReturnCode == 384 && _this.data.share_uid){
          //   _this.data.share_uid = 0;
          //   setTimeout(function(){
          //     _this.getInfo()
          //   },1000)
          // }
        }
      }
    }); 
  },
  bindidCardFun(e){
    var _this = this;
    var idcard =this.data.bindIdcard;
    var bindDate = this.data.bindDate;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=prior&operation=bindIdentity&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&idcard=' + idcard + '&date='+bindDate);
    console.log(app.signindata.comurl + 'spread.php?mod=prior&operation=bindIdentity&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&idcard=' + idcard + '&date=' + bindDate)
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('绑定的身份证号======',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          wx.showToast({
            title: '绑定成功',
            icon: 'none',
            mask:true,
            duration:1000
          });  
          _this.setData({
            isidCardMask:false
          })  
          setTimeout(function(){
            _this.getInfo();
          },1000)
        }else{
          app.showToastC(res.data.Msg)
        }
      }
    }); 
  },
  drawFun(e){

    if(this.data.suplusChance == 0){
      app.showToastC('剩余刮刮卡不足')
      return false;
    }

    var num = e.currentTarget.dataset.num;
    var _this = this;
    wx.showLoading({ title: '加载中...',mask:true})
    var q = Dec.Aese('mod=scratchCard&operation=scratchGift&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&num=' + num+'&id='+_this.data.id);
    console.log(app.signindata.comurl + 'spread.php?mod=scratchCard&operation=scratchGift&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&num=' + num+'&id='+_this.data.id)
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('刮卡======',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          if(num == 1){
            _this.setData({
              suplusChance:_this.data.suplusChance-1,
            })
          }else{
            if(_this.data.user.isVIP){
              _this.setData({
                suplusChance:_this.data.suplusChance-7,
              })
            }else{
              _this.setData({
                suplusChance:_this.data.suplusChance-10,
              })
            }
          }
          _this.setData({
            drawnum:num,
            isAwardMask:true,
            result:res.data.List.result,
            isWinner:res.data.Info.isWinner
          })
        }else{
          app.showToastC(res.data.Msg)
        }
      }
    }); 
  },
  //领取刮刮卡次数
  getDrawFun(e){
    var type = e.currentTarget.dataset.type;
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=scratchCard&operation=getEntrance&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&getType='+type+'&id='+_this.data.id);
    console.log(app.signindata.comurl + 'spread.php?mod=scratchCard&operation=getEntrance&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&getType='+type+'&id='+_this.data.id)
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('领取刮刮======',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          wx.showToast({
            title: '领取成功',
            icon: 'none',
            mask:true,
            duration:2000
          });  
          setTimeout(function(){
            _this.getInfo();
          },2000)
        }else{
          app.showToastC(res.data.Msg)
        }
      }
    }); 
  },

  getAward(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=scratchCard&operation=getAward&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid='+_this.data.tipaid + '&id='+_this.data.awardId);
    console.log(app.signindata.comurl + 'spread.php?mod=scratchCard&operation=getAward&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid='+_this.data.tipaid + '&id='+_this.data.awardId)
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('领取奖励======',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          app.showToastC(res.data.Msg)
        }else{
          app.showToastC(res.data.Msg)
        }
      }
    }); 
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
    this.getAward();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否授权
    var _this = this;
    _this.data.share_uid = options.share_uid || 0
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
    _this.getInfo();
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
  };
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
    this.getInfo();
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
  // onShareAppMessage: function () {
  //   var reshare = app.sharemc();
  //   return reshare
  // },

  // onShareTimeline:function(){
  //   var _this = this;
  //   return {
  //     title: '优先入场资格刮刮卡',
  //     query:'share_uid='+_this.data.uid,
  //     imageUrl:_this.data.shareImg,
  //   }
  // },
  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {
  //   var _this = this;
  //   return {
  //     title: '优先入场资格刮刮卡',
  //     path: '/page/secondpackge/pages/luckyDraw/luckyDraw?share_uid='+_this.data.uid,
  //     imageUrl:_this.data.shareImg,
  //     success: function (res) {}
  //   }      
  // },


  onShareAppMessage: function () {
    var _this = this;
    return {
      title:_this.data.shareTitle,
      path: "/page/secondpackge/pages/entityLuckyDraw/entityLuckyDraw?share_uid=" + _this.data.uid,
      imageUrl:_this.data.shareImg  || 'https://cdn.51chaidan.com/images/default/shareImg.jpg',
    }   
  },
  onShareTimeline:function(){
    var _this = this;

    var indexShare = app.signindata.indexShare || [];
    var indexShareNum = Math.floor(Math.random() * indexShare.length) || 0;
    var indexShareImg = '';
    if(indexShare.length!=0 && indexShare[indexShareNum]){
      indexShareImg = indexShare[indexShareNum]+'?time=' + Date.parse(new Date());;
    };

    return {
      title:_this.data.shareTitle,
      query:'share_uid='+_this.data.uid,
      imageUrl:_this.data.shareImg || 'https://cdn.51chaidan.com/images/default/shareImg.jpg',
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
    app.comjumpwxnav(9021,'','');
  },
   // 订阅授权
   subscrfun:function(){
    var _this = this;
    app.comsubscribe(_this);
  },
})