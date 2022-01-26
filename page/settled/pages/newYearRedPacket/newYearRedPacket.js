var Dec = require('../../../../common/public.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '新年好礼', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    isDetailsMask:false,
    fiveLevelBulletFrame:false,
    infoData:{},
    listData:'',
    NewYearSctivitiesTip:false,
    SCBoxTip:false,
  },
  SCBoxTipFun(){
    this.setData({
      SCBoxTip:!this.data.SCBoxTip
    })
  },
  NewYearSctivitiesTipFun(){
    this.setData({
      NewYearSctivitiesTip:!this.data.NewYearSctivitiesTip
    })
  },
  // 分享助力 
  shereHelp(){
    var _this = this;
    wx.showLoading({ title: '加载中...',mask:true})

    var q = Dec.Aese('mod=experience&operation=share&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid+'&help_id='+_this.data.helpid);

    console.log('mod=experience&operation=share&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid+'&help_id='+_this.data.helpid)

    wx.request({
      url: app.signindata.comurl + 'yearExper.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('分享助力======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          app.showToastC(res.data.Msg || res.data.msg)
        }else if(res.data.ReturnCode == 800){}else{
          app.showToastC(res.data.Msg || res.data.msg)
        }
      }
    }); 
  },

  // 五级弹框数据
  fiveLevelBulletFrameData(){
    var _this = this;
    wx.showLoading({ title: '加载中...',mask:true})

    var q = Dec.Aese('mod=experience&operation=fiveAward&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);

    console.log('mod=experience&operation=fiveAward&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)

    wx.request({
      url: app.signindata.comurl + 'yearExper.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('五级弹框======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          
          _this.setData({
              fiveList:res.data.List.award || [],
              fiveLevelBulletFrame:true,
          });
         
        }else{
          app.showToastC(res.data.Msg || res.data.msg) 
        }
      }
    }); 
  },
  fiveLevelBulletFrameFun(){
     this.setData({
        fiveLevelBulletFrame:!this.data.fiveLevelBulletFrame
     })
  },
  isDetailsMaskFun(){
     this.setData({
        isDetailsMask:!this.data.isDetailsMask
     })
  },
  displayDetailTip(w){
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    const { award } = this.data.listData;
    this.setData({
      awardDetail : award[ind] || []
    })
    this.isDetailsMaskFun();
  },
  jumptaskDeail(w){
      var itemtype = w.currentTarget.dataset.itemtype || w.target.dataset.itemtype;
      app.comjumpwxnav(itemtype,'','');
  },
  // 领取任务
  receiveTask(w){
    var type = w.currentTarget.dataset.type || w.target.dataset.type;
    var _this = this;
    wx.showLoading({ title: '加载中...',mask:true})

    var q = Dec.Aese('mod=experience&operation=receExper&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=' + type);

    console.log('mod=experience&operation=receExper&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=' + type)

    wx.request({
      url: app.signindata.comurl + 'yearExper.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('新年活动数据======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          app.showToastC(res.data.Msg || res.data.msg)
          _this.getInfo();
         
        }else{
          app.showToastC(res.data.Msg || res.data.msg)
        }
      }
    }); 
  },

  // 领取 奖品 
  receivePrizes(w){
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var _this = this;
    wx.showLoading({ title: '加载中...',mask:true})

    var q = Dec.Aese('mod=experience&operation=receiveReward&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&grade=' + _this.data.listData.speed.grade + '&key=' + ind);

    console.log('mod=experience&operation=receiveReward&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&grade=' + _this.data.listData.speed.grade + '&key=' + ind)

    wx.request({
      url: app.signindata.comurl + 'yearExper.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('新年活动数据======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          app.showToastC(res.data.Msg || res.data.msg)
          _this.getInfo();
         
        }else{
          app.showToastC(res.data.Msg || res.data.msg) 
        }
      }
    }); 
  }, 

  jumpTask(){
    var query = wx.createSelectorQuery();
    query.select('#task').boundingClientRect();
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

  getInfo(){
    var _this = this;


    wx.showLoading({ title: '加载中...',mask:true})

    var q = Dec.Aese('mod=experience&operation=getYearActiveData&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&shareUId=' + _this.data.helpid);

    console.log('mod=experience&operation=getYearActiveData&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&shareUId=' + _this.data.helpid)

    wx.request({
      url: app.signindata.comurl + 'yearExper.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('新年活动数据======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          var speed = res.data.List.speed
          var speedOfProgress = (parseInt(speed.userExper) / parseInt(speed.upExper)) * 100;

          console.log(speedOfProgress)
          if(speedOfProgress > 100){
            speedOfProgress = 100;
          };
          _this.setData({
            infoData:res.data.Info || {},
            listData:res.data.List || [],
            isDetailsMask:false,
            fiveLevelBulletFrame:false,
            SCBoxTip:false,
            speedOfProgress
          },()=>{
             var active = res.data.List.active || [];
             for(var i=0;i<active.length;i++){
                 if(active[i].is_rece == 1){
                    _this.jumpTask();
                    break;
                 };
             };
          })
         
        }else{
          app.showToastC(res.data.Msg || res.data.msg)
        }
      }
    }); 
  },
 
  drawFun(e){
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

  onLoad: function (options) {
    // 判断是否授权
    var _this = this;

    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      console.log('options========',scene,)
      _this.data.helpid = _this.getSearchString('helpid', scene) || 0;
    } else {
      _this.data.helpid = options.helpid || 0;
    };
    _this.activsign();
       
    // this.onLoadfun(); 
  },
  onLoadfun:function(){
    var _this = this;
    _this.setData({
      uid: app.signindata.uid,
      loginid: app.signindata.loginid,
    });  
    // 助力
    if(_this.data.helpid && _this.data.helpid != _this.data.uid){
      _this.shereHelp();
    };
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
    };      
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
      if (this.data.uid && this.data.loginid) {
          this.getInfo();
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
      title:_this.data.infoData.share_title || '新年好礼',
      path: "/page/settled/pages/newYearRedPacket/newYearRedPacket?helpid=" + _this.data.uid,
      imageUrl:_this.data.infoData.share_img,
    }   
  },
  onShareTimeline:function(){
    var _this = this;
    return {
      title:_this.data.infoData.share_title || '新年好礼',
      query:'helpid='+_this.data.uid,
      imageUrl:_this.data.infoData.share_img,
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