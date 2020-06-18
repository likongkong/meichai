var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js

var WxParse = require('../../../../wxParse/wxParse.js');

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '一番赏', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    isProduce: app.signindata.isProduce,
    // 排队头像
    userimg:[],
    // 刮奖购买
    scrapingPur:false,
    // 刮奖弹框
    scrapingBox:false,
    // 奖品
    cardList:[],
    addressdata:[],
    // 判断是否有默认地址
    isBlindBoxDefaultAddress:true,
    ishowdealoradd:false,
    // 地址id
    maddid:'',
    addressdata:'',
    id:'',
    goodsdata:[],
    // 最终赏数据
    finalReward:'',
    // 商品展示数据
    goodsExhibition:[],
    activity:'',
    isHowToPlay:false,
    remaintime:'',
    recordtime:'',
    // 订单信息
    order:'',
    // 详情弹框
    iftrdetailpagetwo:false,
    isbuynow:false,
    isbuynowid:'',
    // 刮奖分享选择
    isSharingSAwards:false,
    // 继续刮奖 true 跳转列表 false
    scratchOrList:true,
    is_finish:false,
    //更换周边
    gearCount:null,   //可替换数量
    awardsData:null,   //奖品数据
    isChangeAwards:false,   //是否显示更换成功
    awardsIndex:null,    //当前奖品index
    orderid:null
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var _this = this
    var share = {
      title:  _this.data.activity.name + ' 来看我一发入魂',
      path: "/page/secondpackge/pages/aRewardDetails/aRewardDetails?id="+_this.data.activity.id,
      imageUrl:  _this.data.finalReward.img
    }
    return share;
  },

  howToPlayFun:function(){
     this.setData({
        isHowToPlay:!this.data.isHowToPlay
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
        if (res.data.ReturnCode == 200) {
          var rdl = res.data.List;
          var tptipadi = '';
          var tptipadd = '';
          var tipnamephone = '';
          if (rdl.length != 0) {
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

  showdealoradd: function () {
    this.setData({
      ishowdealoradd: true,
    })
  },

  closedealoradd: function () {
    this.setData({
      ishowdealoradd: false,
    })
  },
  // 跳转增加新地址
  jumpaddress: function () {
    var _this = this;
    wx.navigateTo({
      url: "/pages/newreceivingaddress/newreceivingaddress"
    })
  },
  selectdefult: function (w) {
    var _this = this;
    var ind = w.currentTarget.dataset.ind;
    var addressdata = _this.data.addressdata;
    for (var i = 0; i < addressdata.length; i++) {
      if (i != ind) {
        addressdata[i].checked = false;
      }
    }
    if (!addressdata[ind].checked) {
      addressdata[ind].checked = !addressdata[ind].checked;
      _this.setData({
        addressdata: addressdata,
        maddid: addressdata[ind].aid,
      })
    } else {
      addressdata[ind].checked = !addressdata[ind].checked;
      _this.setData({
        addressdata: addressdata,
        maddid: '',
      })
    }

  },

  setdefultadd: function () {
    var _this = this;
    //  调取收货地址
    var q = Dec.Aese('mod=address&operation=setBlindBoxDefaultAddress&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + _this.data.maddid)

    wx.request({
      url: app.signindata.comurl + 'user.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            ishowdealoradd: false,
            isBlindBoxDefaultAddress: true,
          })
          app.signindata.isBlindBoxDefaultAddress = true;
          _this.nextpagediao();
        }
      }
    });
  },




  // 刮奖翻转卡片
  rotateFn(e) {
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var gear = e.currentTarget.dataset.gear;  //档位
    var isreplace = e.currentTarget.dataset.isreplace;  //是否可替换
    var orderid = e.currentTarget.dataset.orderid;  //是否可替换
    let animation_main = wx.createAnimation({
      duration:400,
      timingFunction:'linear'
     })
    let animation_back = wx.createAnimation({
      duration:400,
      timingFunction:'linear'
     })
    // 点击正面
    if (id==1) {
      animation_main.rotateY(180).step()
      animation_back.rotateY(0).step()
      this.data.cardList[index].animation_main = animation_main.export() 
      this.data.cardList[index].animation_back   = animation_back.export() 
      this.setData({
        cardList: this.data.cardList,
        gear:gear,
        orderid:orderid
      })
      if(isreplace && this.data.gearCount[this.data.gear]>0){
        this.setData({
          awardsData: this.data.cardList[index],
          isChangeAwards:false,
          isSharingSAwards:true,
          awardsIndex:index
        })
      }
    }
  },
  
  // 隐藏换卡弹框
  hideWsh(){
    this.setData({isSharingSAwards: false})
  },
  // 更换样式
  changeStyleFun(){
    var _this = this;
    //  调取收货地址
    var q = Dec.Aese('mod=yifanshang&operation=chengeGoods&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.activity.id + '&order_id=' + _this.data.orderid)
    console.log('更换样式=========',app.signindata.comurl + 'spread.php?mod=yifanshang&operation=chengeGoods&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.activity.id + '&order_id=' + _this.data.orderid )
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log("更换数据===================",res)
        if (res.data.ReturnCode == 200) {
          setTimeout(function(){
            console.log("更换成功===================",res)
            --_this.data.gearCount[_this.data.gear];
            console.log("可替换数量==================",_this.data.gearCount)
            _this.data.cardList[_this.data.awardsIndex].cover = res.data.Info.imgRole;
            _this.data.cardList[_this.data.awardsIndex].name = res.data.Info.roleName;
            _this.data.awardsData.cover = res.data.Info.imgRole;
            _this.data.awardsData.name = res.data.Info.roleName;
            _this.setData({isChangeAwards: true,cardList:_this.data.cardList,awardsData:_this.data.awardsData})
          },1000)
        }else{
          app.showToastC(res.data.Msg);
        }
      }
    });
  },
  // 全部刮奖翻转卡片
  rotateFnWhole:function(){
    var _this = this;
    var cardList = _this.data.cardList;
    for(let i=0;i<cardList.length;i++){
      let animation_main = wx.createAnimation({
        duration:400,
        timingFunction:'linear'
        })
      let animation_back = wx.createAnimation({
        duration:400,
        timingFunction:'linear'
        })
      animation_main.rotateY(180).step()
      animation_back.rotateY(0).step()
      cardList[i].animation_main = animation_main.export() 
      cardList[i].animation_back   = animation_back.export() 
      // console.log(cardList)
      _this.setData({
        cardList:cardList
      })
    }

  },
  // 继续刮奖
  scrapingBoxfun:function(){
    this.setData({
      scrapingBox:false,
      scrapingPur:true,
    })
    this.queuefun(2,2)
  },
  // 刮奖购买
  scrapingPurfun:function(){
     this.setData({
      scrapingPur:!this.data.scrapingPur
     })
  },
  scrapingboxfunlit:function(){
    this.setData({
      scrapingPur:false,
      scrapingBox:true
     })    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onload=============')
    this.setData({
      id: options.id
    })
    // 判断是否授权
    this.activsign();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(this.data.uid&&this.data.loginid&&this.data.recordtime){
       this.listdata();
    }
  },

  onLoadfun:function(){

    // 判断是否有默认地址
    var ishowdealoradd = false;
    if(!app.signindata.isBlindBoxDefaultAddress){
      ishowdealoradd = true;
    };
    this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      isProduce: app.signindata.isProduce,
      isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
      ishowdealoradd:ishowdealoradd
    });

    this.listdata();

    this.nextpagediao();
  },

  listdata:function(){
    var _this = this;
    wx.showLoading({title: '加载中...',})
    _this.setData({
      userimg:[],
      goodsdata:[],
      activity:''
    });
    var exh = Dec.Aese('mod=yifanshang&operation=info&id='+_this.data.id+'&uid='+_this.data.uid+'&loginid='+_this.data.loginid);
    console.log(app.signindata.comurl + 'spread.php?mod=yifanshang&operation=info&id='+_this.data.id+'&uid='+_this.data.uid+'&loginid='+_this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'spread.php' + exh,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh();
        console.log('listdata=====',res)
        if (res.data.ReturnCode == 200) {
          var userimg = res.data.List.queue || [];
          var goodsdata = res.data.List.goods || [];
          var activity = res.data.Info.activity ||{};
          var finalReward = res.data.List.eventually || {};
          var goodsExhibition = res.data.List.goods_gear_list || [];
        
          var rightline = true;
          for(var i=0;i<goodsExhibition.length;i++){
            if(goodsExhibition[i].length>1){
                rightline = true;
            }else{
              goodsExhibition[i][0].rightline = rightline;
                rightline = !rightline;
            };
          };

          var newarr = [];
          for(var i=0;i<goodsExhibition.length;i++){
            newarr.push(goodsExhibition[i])
            if(goodsExhibition[i].length<=1){
              if(goodsExhibition[i][0].rightline&&goodsExhibition[i+1]&&goodsExhibition[i+1].length>1){
                  if(newarr[i]){
                    newarr[i][0].is_width = true;
                    newarr[i][0].rightline = false;
                  }
              };
            };
          };
          if(newarr&&newarr.length!=0&&newarr[newarr.length-1]&&newarr[newarr.length-1][0].rightline){
            newarr.push([{}])
          }
        console.log('newarr====',newarr)
        console.log(goodsExhibition)


          if ( activity.status==3 || activity.suplusNum<=0 ) {
            // wx.showModal({
            //   title: '提示',
            //   content: '活动已结束',
            //   showCancel: false,
            //   success: function (res) {
            //     wx.reLaunch({
            //       url: "/page/secondpackge/pages/aRewardList/aRewardList"
            //     });
            //   }
            // });
          }

          if (activity.isInQueue) {
            var timestamp = Date.parse(new Date())
            //总的秒数 
            // var second = activity.refreshTime - (timestamp / 1000);
            // second = second > 0 ? second : 0;
            // console.log('second==============',second)
            // setTimeout(function(){
            //   _this.listdata();
            // },second)  
            _this.data.recordtime = activity.refreshTime;	

            _this.countdown();

          }else{
            if(userimg.length==0&&activity.status!=3&&activity.suplusNum>0){
              _this.queuefun(1,1);
            };
          }
          

          

          // 是否可以下单
          // if ( !activity.aheadUser ) {
          //   _this.setData({
          //     scrapingBox:false,
          //     scrapingPur:false,
          //   }) 
          // }

          _this.setData({
            userimg:userimg,
            goodsdata:goodsdata,
            activity:activity,
            finalReward:finalReward,
            goodsExhibition:newarr
          })

        }else{
          app.showToastC(res.data.Msg);
        }
      },
      fail: function () { }
    });

    

  },
  // 排队
  // type 排队类型(1正常排队， 2延长排队时间)
  // continuedType 延长排队时间标识类型(1我要刮卡	2.继续刮奖)
  queuefun:function(type,continuedType){
    var _this = this;
    // wx.showLoading({title: '加载中...',})

    var exh = Dec.Aese('mod=yifanshang&operation=lineup&id='+_this.data.id+'&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&type='+type+'&continuedType='+continuedType);
    console.log(app.signindata.comurl + 'spread.php?mod=yifanshang&operation=lineup&id='+_this.data.id+'&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&type='+type+'&continuedType='+continuedType)
    wx.request({
      url: app.signindata.comurl + 'spread.php' + exh,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        // wx.hideLoading()
        // wx.stopPullDownRefresh();
        console.log('queuefun=====',res)
        if (res.data.ReturnCode == 200) {
           _this.data.recordtime = res.data.Info.newOverTime || 0;
           _this.listdata();
        }else{
          app.showToastC(res.data.Msg);
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

    var exh = Dec.Aese('mod=yifanshang&operation=order&id='+_this.data.id+'&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&number='+number+'&aid=' + _this.data.tipaid);

    console.log('下单=========',app.signindata.comurl + 'spread.php?mod=yifanshang&operation=order&id='+_this.data.id+'&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&number='+number+'&aid=' + _this.data.tipaid)

    wx.request({
      url: app.signindata.comurl + 'spread.php' + exh,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading()
        console.log('placeAnOrder=====',res)
        if (res.data.ReturnCode == 200) {
           _this.data.order = res.data.Info.order;
           _this.setData({
            cardList : res.data.List.goods || [],
            gearCount : res.data.List.relRefillGearCount,
            is_finish:res.data.Info.isFinished
           })
           _this.data.recordtime = res.data.Info.newOverTime;	
           _this.countdown();

           _this.paymentmony();
        }else{
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
                    _this.scrapingboxfunlit();
                    // 订阅授权
                    // app.comsubscribe(_this);
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
  // 立即排队
  lineUpNow:function(){
    this.queuefun(1,1)
  },
  // 倒计时时间
  countdown: function () {
    var _this = this;
    clearInterval(_this.data.timer);
    _this.setData({remaintime:''});
    _this.data.timer = setInterval(function () {
      //将时间传如 调用 
      _this.dateformat(_this.data.recordtime);
    }.bind(_this), 1000);
  },
  // 时间格式化输出，将时间戳转为
  dateformat: function (micro_second) {
    var _this = this
    var timestamp = Date.parse(new Date())
    //总的秒数 
    var second = micro_second - (timestamp / 1000);
    // console.log('倒计时===',second)
    if (second > 0) {
      _this.setData({
        remaintime: second,
      })
    } else if (second <= 0) {
      clearInterval(_this.data.timer)
      if(_this.data.scrapingBox){
        _this.rotateFnWhole()
        _this.setData({scratchOrList:false});
      }else{
        _this.setData({scratchOrList:true});
        if(_this.data.activity.aheadUser){
          wx.showModal({
            title: '重新排队提示',
            content: '等待时间过长,已被移除队列,是否继续排队',
            success: function (res) {
              if (res.confirm) {
                _this.lineUpNow();
              }else{
                _this.jumpaRewardList();
              };
            }
          });
        }else{
          _this.listdata();
        }

      }

    }
  },
  // 跳转定位
  jumpposition:function(w){
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;

    var query = wx.createSelectorQuery();
    query.select('#evepos' + ind).boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec(function(res) {
      if (res && res[0] && res[1]) {
        wx.pageScrollTo({
           scrollTop:res[0].top+res[1].scrollTop-app.signindata.statusBarHeightMc||90,
           duration:300
        })
      }
    });



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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.listdata();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {},
  scrapingRecord:function(){
    var _this = this;
    wx.navigateTo({   
      url: "/page/secondpackge/pages/aRewardHistory/aRewardHistory?id="+this.data.id
    });     
  },
  // 跳转列表
  jumpaRewardList:function(){
      // let pages = getCurrentPages();
      // let prevpage = pages[pages.length - 2];
      // if (prevpage) {
      //   if (prevpage.route == 'page/secondpackge/pages/aRewardList/aRewardList') {
      //     wx.navigateBack();
      //   } else {
      //     wx.redirectTo({
      //       url: "/page/secondpackge/pages/aRewardList/aRewardList"
      //     });
      //   };
      // } else {
      //   wx.redirectTo({
      //     url: "/page/secondpackge/pages/aRewardList/aRewardList"
      //   });
      // };
      wx.redirectTo({
        url: "/page/secondpackge/pages/aRewardList/aRewardList"
      });

  },
  iftrdetailpageb: function () {
    this.setData({
      iftrdetailpagetwo: false
    });
  },
  iftrdetailpagen: function (w) {
    var _this = this;

    var index = w.currentTarget.dataset.index || w.target.dataset.index || 0;

    var is_buy = w.currentTarget.dataset.is_buy || w.target.dataset.is_buy || 2;
    var goods_id = w.currentTarget.dataset.goods_id || w.target.dataset.goods_id || 0;

    var isbuynow = false;

    if(is_buy==1){
      isbuynow = true;
    };

    if(index==10000){
      var finalReward = this.data.finalReward;
      if(finalReward.goods_desc){
        WxParse.wxParse('article', 'html', finalReward.goods_desc, _this, 0);
      };
    }else{
      var goodsExhibition = this.data.goodsExhibition;
      var num = w.currentTarget.dataset.num || w.target.dataset.num || 0;

      if(goodsExhibition[index]){
        if(goodsExhibition[index][num]){
          WxParse.wxParse('article', 'html', goodsExhibition[index][num].goods_desc, _this, 0);
        };
      };
    };


    console.log(isbuynow,goods_id)
    this.setData({
      isbuynow:isbuynow,
      isbuynowid:goods_id,
      iftrdetailpagetwo: true
    })
  },
  // 跳转详情
  jumpdetails:function(){
     console.log(this.data.isbuynowid)
     app.detailspage(this.data.isbuynowid)
  },
  // 计算图片大小
  imageLoadad: function (e) {
    var _this = this;
    var $width = e.detail.width,
    $height = e.detail.height,
    ratio = $width / $height;
    var viewWidth = 353,
    viewHeight = 353 / ratio;
    var finalReward = this.data.finalReward;
    if (viewHeight > 495) {
      viewHeight = 495;
    };
    if (finalReward) {
        finalReward.height= viewHeight
        _this.setData({
          finalReward:finalReward
        });
    };

  },

})