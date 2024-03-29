var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '抽隐藏', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    pid:0,
    isShowSearch:false,
    receivingaddress:false,
    recordlistData:[],
    inputValue:'',
    isWinning:false,
    isReachBottom:true,
    is_mobile_phone:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,111)
    var _this = this;
    _this.data.share_uid = options.share_uid || 0;
    _this.data.gid = options.gid || 0;
    if(options.gid && options.gid == 39328){
      app.signindata.suap = 23;
    }else{
      app.signindata.suap = 22;
    };
    
    // 判断是否授权
    this.activsign();
  }, 
  onLoadfun:function(){
    var _this = this;
    _this.setData({
      uid: app.signindata.uid,
      loginid:app.signindata.loginid,
      isProduce: app.signindata.isProduce,
    });  
    this.getInfo();
    this.getDrawRecord();
    this.nextpagediao();
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
    }      
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
  userProfile(){
    _this.setData({
      signinlayer: true,
      tgabox: false
    });
    _this.activsign();
    // 确认授权用户统计
    app.clicktga(4);
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
    this.getInfo();
    this.getDrawRecord();
    this.setData({
      isReachBottom: true,
      pid:0,
      recordlistData:[]
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.isReachBottom){
      this.data.pid = ++this.data.pid;
      this.getDrawRecord();
    }
  },
  clicktganone: function () {
    this.setData({ tgabox: false })
  }, 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var reshare = app.sharemc();
    return reshare
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  getInfo(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=LuckyDraw&operation=CurrentPrizesList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&goodsId='+_this.data.gid)
    console.log('mod=LuckyDraw&operation=CurrentPrizesList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&goodsId='+_this.data.gid)
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('详情数据======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          var infoData = res.data.Info;
          var listData = res.data.List;
          _this.setData({
            infoData,
            listData,
            chancenum:infoData.temp_chance_num,
            isShowWill:infoData.is_show_will,
            explain:infoData.rules || 'Hello world',
            is_mobile_phone:infoData.is_mobile_phone,
          })
        }
      }
    }); 
  },
  // 抽奖记录
  getDrawRecord(){
    var _this = this;
    var pid = _this.data.pid;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=LuckyDraw&operation=LotteryRecordList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&pid=' + pid+'&goodsId='+_this.data.gid)
    console.log('mod=LuckyDraw&operation=LotteryRecordList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&pid=' + pid+'&goodsId='+_this.data.gid)
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('抽奖记录======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          if(res.data.List.exchange_record_list.length<40){
            _this.setData({
              isReachBottom:false
            })
          }
          for(var i = 0; i < res.data.List.exchange_record_list.length; i++){
            res.data.List.exchange_record_list[i].yearMonthDay = _this.formatTimeTwo(res.data.List.exchange_record_list[i].update_stamp, 'Y年M月D日');
            res.data.List.exchange_record_list[i].hourMinuteSecond = _this.formatTimeTwo(res.data.List.exchange_record_list[i].update_stamp, 'h：m');
          }
          var recordlistData = [..._this.data.recordlistData,...res.data.List.exchange_record_list];
          _this.setData({
            recordlistData
          })
        }
      }
    }); 
  },
  // 兑换奖券
  getRaffleTicket(){
    var cdkey = this.data.inputValue;
    if(cdkey == ''){
      app.showToastC('请输入兑换码');
      return false;
    }
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=LuckyDraw&operation=ForTickets&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&cdkey='+cdkey+'&goodsId='+_this.data.gid)
    console.log('mod=LuckyDraw&operation=ForTickets&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&cdkey='+cdkey+'&goodsId='+_this.data.gid)
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('获取兑奖券======',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          var willInfo = res.data.Info.willInfo;
          var lastone = res.data.Info.lottery_record_lastone;
          if(willInfo.isRealGift){
            // _this.getInfo();
            _this.setData({isShowWill:2,})
          }
          lastone.yearMonthDay = _this.formatTimeTwo(lastone.update_stamp, 'Y年M月D日');
          lastone.hourMinuteSecond = _this.formatTimeTwo(lastone.update_stamp, 'h：m');
          _this.data.recordlistData.unshift(lastone)
          _this.setData({
            recordlistData:_this.data.recordlistData,
            isWinning:true,
            willInfo:res.data.Info.willInfo,
            inputValue:''
          })
        }else{
          app.showToastC(res.data.Msg);
        }
      }
    }); 
  },
  // 抽奖
  drawAward(){
    var _this = this;
    _this.setData({isWinning:false})
    return false;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=LuckyDraw&operation=PerformDraw&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    console.log('mod=LuckyDraw&operation=PerformDraw&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('抽奖======',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          var willInfo = res.data.Info.willInfo;
          var lastone = res.data.Info.lottery_record_lastone;
          if(willInfo.isRealGift){
            // _this.getInfo();
            _this.setData({isShowWill:2,})
          }
          lastone.yearMonthDay = _this.formatTimeTwo(lastone.update_stamp, 'Y年M月D日');
          lastone.hourMinuteSecond = _this.formatTimeTwo(lastone.update_stamp, 'h：m');
          _this.data.recordlistData.unshift(lastone)
          _this.setData({
            recordlistData:_this.data.recordlistData,
            isWinning:true,
            willInfo:res.data.Info.willInfo
          })

          if(_this.data.chancenum>0){
            _this.setData({
              chancenum:--_this.data.chancenum
            }) 
          }
          // _this.getDrawRecord();
        }else{
          app.showToastC(res.data.Msg);
        }
      }
    }); 
  },
  // 领奖
  acceptPrize(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=LuckyDraw&operation=award&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + _this.data.tipaid+'&goodsId='+_this.data.gid)
    console.log('mod=LuckyDraw&operation=award&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + _this.data.tipaid+'&goodsId='+_this.data.gid)
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('领奖======',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          app.showToastC(res.data.Msg);
          for(var i = 0;i<_this.data.recordlistData.length;i++){
            _this.data.recordlistData[i].is_reply = 2
          }
          _this.setData({
            recordlistData:_this.data.recordlistData,
            isWinning:false,
            isShowWill:1
          }) 
        }else{
          app.showToastC(res.data.Msg);
        }
      }
    }); 
  }, 
  
  showSearchFun(){
    this.setData({
      isShowSearch:!this.data.isShowSearch,
    }); 
  },

  toogleWinningPopup(){
    this.setData({
      isWinning:!this.data.isWinning,
    }); 
  },

  receivingaddressfun(){
    this.setData({
      receivingaddress:false,
    }); 
  },

  // 领奖
  getAward(){
    var _this= this;
    _this.setData({
      receivingaddress:true
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
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log('收货地址===',res)
        if (res.data.ReturnCode == 200) {
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
            header: {
              'Accept': 'application/json'
            },
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
      receivingaddress: false
    });
    this.acceptPrize();
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

  // 跳转抽盒机列表
  jumpPage(){
    this.setData({isWinning:false})
    app.comjumpwxnav(988,'','');
  },

   // banner 跳转
   jumpbanner: function (w) {
    var whref = w.currentTarget.dataset.href || w.target.dataset.href;
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type||0;
    var imgurl = w.currentTarget.dataset.imgurl || w.target.dataset.imgurl || '';
    var wname = w.currentTarget.dataset.title || w.target.dataset.title || ''; 
    // 公共跳转
    this.comjumpwxnav(item_type, whref, wname, imgurl);
  },

   // 公共跳转
   comjumpwxnav: function (item_type, whref, wname, imgurl){
    var imgurl = imgurl || '';
    var _this = this;
    _this.setData({ jumpdevanningiftr: true });

    app.comjumpwxnav(item_type, whref, wname, imgurl)

    _this.setData({ jumpdevanningiftr: false, indexelafra: false, index_ela_fra:false });
    app.signindata.index_ela_fra = false;   
  },


  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  
  /** 
   * 时间戳转化为年 月 日 时 分 秒 
   * number: 传入时间戳 
   * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
  */
  formatTimeTwo(number, format) {
    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];
    var date = new Date(number * 1000);
    returnArr.push(date.getFullYear());
    returnArr.push(this.formatNumber(date.getMonth() + 1));
    returnArr.push(this.formatNumber(date.getDate()));
    returnArr.push(this.formatNumber(date.getHours()));
    returnArr.push(this.formatNumber(date.getMinutes()));
    returnArr.push(this.formatNumber(date.getSeconds()));
    for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
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
    console.log('mod=subscription&operation=authMobile&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&iv=' + iv + '&encryptedData=' + encryptedData + '&code=' + code+'&goodsId='+_this.data.gid)
    var q1 = Dec.Aese('mod=subscription&operation=authMobile&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&iv=' + iv + '&encryptedData=' + encryptedData + '&code=' + code+'&goodsId='+_this.data.gid);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        wx.hideLoading()
        console.log('手机号授权提交=====',res)
        if(res.data.ReturnCode == 200){
          _this.setData({
            is_mobile_phone:true
          });
          app.showToastC('获取手机号成功');
        }else{
          if(res.data.Msg){
            app.showToastC(res.data.Msg||'');
          };
        };
      },
      fail: function(res) {
        wx.hideLoading()
      }
    })
  },


})