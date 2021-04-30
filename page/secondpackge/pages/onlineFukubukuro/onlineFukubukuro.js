var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '在线福袋', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    // 适配苹果X
    isIphoneX: false,
    isProduce: app.signindata.isProduce,
    scene:'',
    isredpacket:false,
    isawardMask:false,
    recordList:[],
    goodsList:[],
     // 收货地址
     receivingaddress:false,
     tipback:false,
     // 收货地址数据
     addressdata:[],
     // 收货地址显示 请选择收货地址
     tipaddress:'请选择收货地址',
     tipaid:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options) {
      this.setData({
        scene:options,
      })
    } 
    app.signindata.suap = 14;
    // 判断是否授权
    this.activsign();
  },
  onLoadfun:function(){
    this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      isProduce: app.signindata.isProduce
    });
    this.gitList();
  },
  activsign: function () {
    // 判断是否授权 
    var _this = this;
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
      return false;
    };    

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
            // '没有授权 统计'
            app.userstatistics(43);
            _this.onLoadfun();
          }
        }
      });  
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

  hideAwardMask(){
    this.setData({
      isawardMask:false
    })
  },

  getWelfare(e){
    this.setData({
      welfare:e.detail.welfare
    })
  },
  redpagshareimage(e){
    console.log(e.detail,"111111")
    this.setData({
      redpagshareimg:e.detail
    })
  },


  gitList(){
    var _this = this;
    wx.showLoading({title: '加载中...',})
    var exh = Dec.Aese('mod=luckbag&operation=goodsList&uid='+app.signindata.uid+'&loginid='+app.signindata.loginid)
    console.log("福袋详情 ===== "+app.signindata.comurl + 'mod=luckbag&operation=goodsList&uid='+app.signindata.uid+'&loginid='+app.signindata.loginid)
    wx.request({
      url: app.signindata.comurl + 'goods.php' + exh,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log('福袋详情 =========== ',res)
        if (res.data.ReturnCode == 200) {

          _this.setData({
            bannerImg:res.data.List.bannerImg,
            recordList:res.data.List.recordList,
            goodsList:res.data.List.goodsList,
          })
          
        } else {
          app.showToastC(res.data.msg);
        }
      },
      fail: function () { }
    });
  },


  // 下单
  placeAnOrder:function(w){
    var _this = this;
    wx.showLoading({title: '加载中...',mask:true});

    var number = w.currentTarget.dataset.number || w.target.dataset.number || 0;

    if (this.data.tipaid == '') {
      app.showToastC('请选择地址');
      _this.setData({ishowdealoradd:true})
      return false;
    };

    var exh = Dec.Aese('mod=yifanshang&operation=order&id='+_this.data.id+'&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&number='+number+'&aid=' + _this.data.tipaid+'&isDeduct='+_this.data.isDeductNum);

    console.log('下单=========',app.signindata.comurl + 'spread.php?mod=yifanshang&operation=order&id='+_this.data.id+'&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&number='+number+'&aid=' + _this.data.tipaid+'&isDeduct='+_this.data.isDeductNum)

    wx.request({
      url: app.signindata.comurl + 'spread.php' + exh,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        // wx.hideLoading()
        console.log('placeAnOrder=====',res)
        if (res.data.ReturnCode == 200) {
           _this.data.order = res.data.Info.order;
          //  _this.setData({
          //   cardList : res.data.List.goods || [],
          //   gearCount : res.data.List.relRefillGearCount,
          //   is_finish:res.data.Info.isFinished
          //  })
          //  _this.data.recordtime = res.data.Info.newOverTime;	
          //  _this.countdown();

           _this.paymentmony();
        } else if(res.data.ReturnCode == 341){
          wx.hideLoading()
          if(res.data.Info.is_jump && res.data.Info.is_jump==2){
            var otherActivity = res.data.Info.otherActivity ||{};
            _this.setData({ is_jump: true ,otherActivity:otherActivity,isPurchase:false,scrapingPur:!_this.data.scrapingPur});  
          }
        } else {
          wx.hideLoading()
          app.showToastC(res.data.Msg);
        }
      },
      fail: function () { }
    });
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
                    // var pages = getCurrentPages();
                    // var prevPage = pages[pages.length - 2];  //上一个页面
                    // prevPage.reset();
                    // prevPage.gitList();
                    // _this.scrapingboxfunlit();
                    _this.getOrderRecord();
                    _this.queuefun(2,4)
                    // 订阅授权
                    // app.comsubscribe(_this);

                    // 更新抽盒金
                    if(_this.data.isDeduct && _this.data.isUseBlindboxMoney){
                      var gbm = Dec.Aese('mod=blindBox&operation=getBlindboxMoney&uid='+_this.data.uid);
                      wx.request({
                        url: app.signindata.comurl + 'spread.php' + gbm,
                        method: 'GET',
                        header: { 'Accept': 'application/json' },
                        success: function (res) {
                          if (res.data.ReturnCode == 200) {
                            console.log('更新抽盒金=====',res)
                            _this.setData({
                              blindboxMoney: res.data.Info.blindbox_money || ""
                            });
                            app.signindata.blindboxMoney = res.data.Info.blindbox_money || "";
                            app.signindata.tempBlindboxMoney = res.data.Info.tempBlindboxMoney || "";
                          };
                        }
                      })
                    }

                  },
                  'fail':function(res){},
                  'complete': function (res) {}
                })
        }else{
          // 提交订单蒙层
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


  //跳转详情
  toaRewarddeyails(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({   
      url: "/page/secondpackge/pages/aRewardDetails/aRewardDetails?id=" + id
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
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(options ) {
    var _this = this
    var share = {
      imageUrl:  "https://cdn.51chaidan.com/images/sign/yifanshangLisSharet.jpg"
    }
    if( options.from == 'button' ){
      var info = _this.data.welfare
      var xilie = _this.data.welfare.roleName != "" ? "-" : ""
      var title = ""
      if(info.welfareType == 1){
        title = "我抽到了"+ xilie + info.roleName + "，隐藏红包送给你们。"
      } else if(info.welfareType == 2){
        if (info.userId && info.userId != _this.data.uid) {
          title = info.nick + "抽到了"+ xilie + info.roleName + "，幸运值红包送给你们。"
        } else {
          title = "我抽到了"+ xilie + info.roleName + "，幸运值红包送给你们。"
        }
      }else if(info.welfareType == 3){
        if (info.userId && info.userId != _this.data.uid) {
          title = info.nick + "抽到了"+ xilie + info.roleName + "，抽盒金红包送给你们。"
        } else {
          title = "我抽到了"+ xilie + info.roleName + "，抽盒金红包送给你们。"
        }
      }
      var share = {
        title: title,
        imageUrl: _this.data.redpagshareimg,
        path: "/page/secondpackge/pages/aRewardList/aRewardList?id=" + _this.data.scene.id + '&referee=' + _this.data.uid + '&gid=' + _this.data.scene.gid + '&welfareid=' + _this.data.scene.welfareid + '&isredpag=1',
        success: function (res) {}
      }
    }

    return share;
  },
  onShareTimeline:function(){
    var _this = this;
    return {
      title:'来美拆一番赏，一发入魂，抢战最终手办大赏',
      query:{},
      imageUrl: 'https://cdn.51chaidan.com/images/sign/yifanshangShareImg.jpg'
    }
  },
  jumpowntoy: function() {
    wx.navigateTo({
      url: "/page/component/pages/myothertoydg/myothertoydg?ownerId=" + this.data.uid
    })
  },
})