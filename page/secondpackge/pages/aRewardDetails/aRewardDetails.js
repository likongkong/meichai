var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
var utiltime = require('../../../../utils/util.js');
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
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
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
    id:'',
    goodsdata:[],
    // 最终赏数据
    finalReward:'',
    // 商品展示数据
    goodsExhibition:[],
    activity:'',
    otherActivity:'',
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
    orderid:null,
    //是否加载刮卡记录组件
    isHistory:false,
    // 幸运值
    welfare: [],
    redpagList: [],
    ishowredpackage: false,
    firstshowredpag: true,
    ishowpagInfo: false,
    welfareInfo: "",
    welfareList: [],
    isharepag: false,
    isredshare: false,
    welfareid: 0,
    isredpag: 0,
    redpagshareimg: "http://www.51chaidan.com/images/blindBox/halfPackage.jpg",
    ishowsurebuy: false,
    wwheight: app.signindata.windowHeight,
    isheavyroll: false, // 点击了重抽
    rollbefore: "",
    rollbelater: "",
    isallready: false,
    istipsure: false,
    israysure: false,
    framtop: (app.signindata.windowHeight - 400) / 2,
    pmc:true,
    //是否显示购买按钮
    isPurchase:true,
    requestNum:0,
    is_jump:false
  },

  // 幸运值
  drawredpagshare: function (ind) {
    var _this = this
    var info = _this.data.redpagList[ind]
    wx.getImageInfo({
      src: "https://www.51chaidan.com/images/blindBox/halfPackage.jpg",
      success: function (res) {
        const ctxt = wx.createCanvasContext('redpagshare');
        ctxt.drawImage(res.path, 0, 0, 300, 240)
        wx.getImageInfo({
          src: info.roleImg,
          success: function (res) {
            var radio = res.width / res.height;
            var width = 80 * radio;
            if(width>=110){
              var widthOther = 60 * radio;
              ctxt.drawImage(res.path, 25, 25, widthOther, 60)
            }else{
              ctxt.drawImage(res.path, 25, 25, width, 80)
            }
            

            ctxt.setFontSize(25);
            ctxt.setFillStyle('#f0ca97');
            if (info.welfareType == 1) {
              ctxt.fillText("隐藏红包", 165, 60);
              ctxt.fillText(parseInt(info.limitAmount) + "元", 177, 90);
              ctxt.fillText("隐藏红包", 165, 60.5);
              ctxt.fillText(parseInt(info.limitAmount) + "元", 177.5, 90);
            } else {
              ctxt.fillText("幸运值红包", 145, 60);
              ctxt.fillText(parseInt(info.limitAmount) + "点", 170, 90);
              ctxt.fillText("幸运值红包", 145, 60.5);
              ctxt.fillText(parseInt(info.limitAmount) + "点", 170.5, 90);
            }
            ctxt.draw(true, setTimeout(function () {
              wx.canvasToTempFilePath({
                canvasId: 'redpagshare',
                success: function (res) {
                  _this.setData({
                    redpagshareimg: res.tempFilePath
                  })
                },
                fail: function (res) {},
              });
            }, 300));

          }
        })

      }
    })
  },
  openpackage: function (w) {
    var _this = this;
    var id = w.currentTarget.dataset.mid;
    var isget = w.currentTarget.dataset.isget;
    var samount = w.currentTarget.dataset.samount;
    var ind = w.currentTarget.dataset.ind;
    _this.drawredpagshare(ind)
    if (!isget || (samount && samount == 0)) {
      _this.openredpackage(id)
      _this.setData({
        welfareid: id,
        redpagind: ind,
      })
    } else {
      _this.redpagInfo(id)
      _this.setData({
        welfareid: id,
        redpagind: ind,
      })
    }

  },
  mmm: function () {

  },
  openredpackage: function (welfareId) {
    var _this = this;
    wx.showLoading({
      title: '开启中...',
    })
    
    if(_this.data.pmc){
      console.log('_this.data.pmc========',_this.data.pmc)
      _this.data.pmc = false;
      var q = Dec.Aese('mod=blindBox&operation=receiveWelfare&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&welfareId=' + welfareId)
      wx.request({
        url: app.signindata.comurl + 'spread.php' + q,
        method: 'GET',
        header: {'Accept': 'application/json'},
        success: function (res) {
          wx.hideLoading()
          _this.data.pmc = true;
          if (res.data.ReturnCode == 200) {
            app.showToastC('领取成功');
            _this.redpagInfo(welfareId)
          } else {
            app.showToastC(res.data.Msg);
            _this.setData({
              ishowredpackage: false,
            })
          }
        }
      });
    }

  },

  redpagInfo: function (welfareId) {
    var _this = this
    wx.showLoading({
      title: '加载中...',
    })
    var q = Dec.Aese('mod=blindBox&operation=getWelfareDetail&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&welfareId=' + welfareId)

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        console.log('领取红包=========',res)
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          _this.setData({
            ishowredpackage: false,
            ishowpagInfo: true,
            welfareInfo: res.data.Info.welfare,
            welfareList: res.data.List.welfare,
          })
        } else {
          app.showToastC(res.data.Msg);
        }
      }
    });
  },

  closepagInfo: function () {
    var _this = this
    _this.setData({
      ishowpagInfo: false,
    })
  },

  shareopen: function (welfareId) {
    var _this = this;

    var q = Dec.Aese('mod=blindBox&operation=getWelfareInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&welfareId=' + welfareId)

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        console.log('分享打开===========',res)
        if (res.data.ReturnCode == 200) {
          _this.setData({
            redpagList: res.data.Info.welfare || [],
            ishowredpackage: true,
            isharepag: true,
          })
        } else {
          app.showToastC(res.data.Msg);
        }
      }
    });
  },
  hidepackage: function () {
    var _this = this;
    if (!_this.data.ishowredpackage) {
      _this.setData({
        redpagList: _this.data.welfare,
      })
    }
    _this.setData({
      ishowredpackage: !_this.data.ishowredpackage,
      isharepag: false,
    })
  },
  
  // 幸运值
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var _this = this;

    if (_this.data.ishowpagInfo) {
      var info = _this.data.redpagList[_this.data.redpagind];
      var title = "我抽到了" + info.gear + '赏' + info.roleName + "，幸运值红包送给你们。";
      var share = {
        title: title,
        imageUrl: _this.data.redpagshareimg,
        path: "/page/secondpackge/pages/aRewardDetails/aRewardDetails?id=" +_this.data.activity.id + '&referee=' + _this.data.uid + '&gid=' + _this.data.gid + '&welfareid=' + _this.data.welfareid + '&isredpag=1',
        success: function (res) {}
      }
    } else {
      var share = {
        title:  _this.data.activity.name + ' 来看我一发入魂',
        path: "/page/secondpackge/pages/aRewardDetails/aRewardDetails?id="+_this.data.activity.id,
        imageUrl: _this.data.activity.lottoBackGround || _this.data.finalReward.img
      }
    }


    return share;
  },
  onShareTimeline:function(){
    var _this = this;
    return {
      title:_this.data.activity.name,
      query:{
        id:_this.data.id
      },
      imageUrl:_this.data.activity.cover
    }
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
  scrapingPurfun:function(e){
    if(e.currentTarget.dataset.purchase){
      this.setData({isPurchase:false})
    }else{
      this.setData({isPurchase:true})
    }
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
    console.log('onload=============',options)
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          topheight : res.statusBarHeight+44,
          worthSubsidiaryHeight:res.windowHeight - (res.statusBarHeight+44)
        });
      }
    })

    if (options.scene) {
      // '&welfareid=' + _this.data.welfareid + '&isredpag=1'
      let scene = decodeURIComponent(options.scene);
      app.signindata.referee = _this.getSearchString('referee', scene) || 0;
      app.signindata.activity_id = _this.getSearchString('id', scene) || 0;
      _this.data.id = _this.getSearchString('id', scene) || 0;
      _this.data.gid = _this.getSearchString('gid', scene) || 0;
      _this.data.welfareid = _this.getSearchString('welfareid', scene) || 0;
      _this.data.isredpag = _this.getSearchString('isredpag', scene) || 0;
      _this.setData({
        is_share: _this.getSearchString('referee', scene) || 0 ? true : false
      })
    } else {
      app.signindata.referee = options.referee || 0;
      app.signindata.activity_id = options.id || 0;
      _this.data.id = options.id || 0;
      _this.data.gid = options.gid || 0;
      _this.data.welfareid = options.welfareid || 0;
      _this.data.isredpag = options.isredpag || 0;
      _this.setData({
        is_share: options.referee ? true : false
      })
    }

    // this.setData({
    //   id: options.id
    // })
    // 判断是否授权
    this.activsign();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // if(this.data.uid&&this.data.loginid&&this.data.recordtime){
    //    this.listdata();
    // }
  },

  onLoadfun:function(){
    var _this = this;
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

    // this.listdata();
    _this.queuefun(1,1);

    this.nextpagediao();

    if (this.data.isredpag == 1) {
      this.shareopen(this.data.welfareid)
    }

  },
  listdata:function(){
    var _this = this;
    wx.showLoading({title: '加载中...',})
    _this.setData({
      userimg:[],
      goodsdata:[],
      activity:'',
      finalReward:''
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
          if(res.data.Info.is_jump && res.data.Info.is_jump==2){
            _this.setData({is_jump: true});  
          }
          var userimg = res.data.List.queue || [];
          var goodsdata = res.data.List.goods || [];
          var activity = res.data.Info.activity ||{};
          var otherActivity = res.data.Info.activity.otherActivity ||{};
          var finalReward = res.data.List.eventually || {};
          var goodsExhibition = res.data.List.goods_gear_list || [];
          
          if(activity.status==1){
            activity.start_time = utiltime.toDate(activity.start_time)
          };

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
          // if(activity.status==2&&activity.suplusNum>0&&_this.data.uid){
          //     _this.queuefun(1,1);
          // };
          // if (activity.isInQueue) {
            // var timestamp = Date.parse(new Date())
            //总的秒数 
            // var second = activity.refreshTime - (timestamp / 1000);
            // second = second > 0 ? second : 0;
            // console.log('second==============',second)
            // setTimeout(function(){
            //   _this.listdata();
            // },second)  
          //   if( activity.aheadUser ){
          //     _this.data.recordtime = activity.refreshTime;	
          //   }else{
          //     _this.data.recordtime = activity.refreshTimeForQueuer;	
          //   }
          //   _this.countdown();
          // }else{
          //   _this.data.recordtime = activity.refreshTime;	
          //   _this.countdown();
            // if(userimg.length==0&&activity.status==2&&activity.suplusNum>0&&_this.data.uid){
            //   _this.queuefun(1,1);
            // };
          // }
  
          // 是否可以下单
          // if ( !activity.aheadUser ) {
          //   _this.setData({
          //     scrapingBox:false,
          //     scrapingPur:false,
          //   }) 
          // }

          // 幸运值

          if (_this.data.firstshowredpag && res.data.List.welfare.length > 0 && res.data.List.welfare[0].currentAmount == 0 && _this.data.isredpag != 1) {
            _this.hidepackage()
            _this.setData({
              redpagList: res.data.List.welfare || [],
              firstshowredpag: false,
            })
          } else if (_this.data.firstshowredpag) {
            _this.data.firstshowredpag = false
          }
          _this.setData({
            userimg:userimg,
            goodsdata:goodsdata,
            activity:activity,
            otherActivity:otherActivity,
            finalReward:finalReward,
            goodsExhibition:newarr,
            isHistory:true,
            welfare: res.data.List.welfare || [],
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
  // continuType 延长排队时间标识类型(1我要刮卡	2.继续刮奖)
  queuefun:function(type,continuType){
    var _this = this;
    // wx.showLoading({title: '加载中...'})
    var exh = Dec.Aese('mod=yifanshang&operation=lineup&id='+_this.data.id+'&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&type='+type+'&continuType='+continuType);
    console.log(app.signindata.comurl + 'spread.php?mod=yifanshang&operation=lineup&id='+_this.data.id+'&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&type='+type+'&continuType='+continuType)
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
          if(continuType==4){
           _this.countdown();
          }else{
            _this.listdata();
          }
         
          // clearInterval(app.signindata.timer);
          // app.signindata.yifanshangIsInQueue = true;
          // app.yifanshangIsInQueueFun(_this.data.recordtime);

        }else if(res.data.ReturnCode == 348){
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
  getOrderRecord(){
    wx.showLoading({title: '加载中...',mask:true});
    var _this = this; 
    var requestNum = _this.data.requestNum;
    var q = Dec.Aese('mod=yifanshang&operation=getOrderRecord&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&cart_id=' + _this.data.order.cart_id)
    console.log('支付状态查询=====','mod=yifanshang&operation=getOrderRecord&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&cart_id=' + _this.data.order.cart_id)
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('支付状态查询结果=============',res)
        if (res.data.ReturnCode == 200) {
          wx.hideLoading();
          _this.setData({
            cardList : res.data.List.goods || [],
            gearCount : res.data.List.relRefillGearCount,
            is_finish:res.data.Info.isFinished
          })
          _this.scrapingboxfunlit();
        }else if(res.data.ReturnCode == 201){
          requestNum++;
          _this.setData({requestNum})
          if(requestNum != 5){
            setTimeout(function(){
              _this.getOrderRecord();
            },1000)
          }else{
            wx.hideLoading();
            app.showToastC('订单状态错误');
            _this.setData({requestNum:0});
          }
        }else if(res.data.ReturnCode == 202){
          wx.hideLoading();
          app.showToastC(res.data.Msg);
        }else{
          _this.toMyorderPage(0);
        }
      }
    })
  },
  toMyorderPage(delay){
    setTimeout(function(){
      wx.hideLoading();
      wx.navigateTo({
        url: '/pages/myorder/myorder?tabnum=0'
      })
    },2000)
  },
  // 立即排队
  lineUpNow:function(){
    var _this = this;
    // if(app.signindata.yifanshangIsInQueue){
    //   wx.showModal({
    //     title: '提示',
    //     content: '你在其他活动有排队，是否继续排队',
    //     success (res) {
    //       if (res.confirm) {
    //         _this.queuefun(1,1)
    //       }
    //     }
    //   })
    // }else{
    //   _this.queuefun(1,1)
    // }
    _this.queuefun(1,1)
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
        // if(_this.data.activity.aheadUser){
        //   wx.showModal({
        //     title: '重新排队提示',
        //     content: '等待时间过长,已被移除队列,是否继续排队',
        //     success: function (res) {
        //       if (res.confirm) {
        //         _this.lineUpNow();
        //       }else{
        //         // _this.jumpaRewardList();
        //         _this.listdata();
        //       };
        //     }
        //   });
        //   // wx.redirectTo({   
        //   //   url: "/page/secondpackge/pages/aRewardDetails/aRewardDetails?id=" + _this.data.id
        //   // });
        // }else{
        //   _this.listdata();
        // }

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
           scrollTop:( res[0].top+res[1].scrollTop-app.signindata.statusBarHeightMc||90 )-85,
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
    this.selectComponent('#history')._onPullDownRefresh();
    // this.listdata();
    this.queuefun(1,1);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.selectComponent('#history')._onReachBottom();
  },
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
    var viewWidth = 310,
    viewHeight = 310 / ratio;
    var finalReward = this.data.finalReward;
    // if (viewHeight > 495) {
    //   viewHeight = 495;
    // };
    if (finalReward) {
        finalReward.height= viewHeight
        _this.setData({
          finalReward:finalReward
        });
    };

  },
  //跳转详情
  toaRewarddeyails(e){
    let id = e.currentTarget.dataset.id;
    wx.redirectTo({   
      url: "/page/secondpackge/pages/aRewardDetails/aRewardDetails?id=" + id
    });
  },
  //关闭跳转其他一番赏弹框
  closefinishedBox(){
    this.setData({is_jump:false});
    this.queuefun(1,1);
  },
  zhanwei(){}

})