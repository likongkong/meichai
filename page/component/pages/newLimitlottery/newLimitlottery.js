var Dec = require('../../../../common/public.js'); //aes加密解密js
var time = require('../../../../utils/util.js');
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '限定抽签',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    // 授权弹框
    tgabox: false,
    signinlayer:true,
    windowHeight: app.signindata.windowHeight - 65 - wx.getStorageSync('statusBarHeightMc') || 0,

    dayStr: "00",
    hrStr: "00",
    minStr: "00",
    secStr: "00",

    // 签号攻略
    isSignStrategyPopup:false,
    // 抽选规则
    isChRulePopup:false,
    // 参与成功/兑换成功/兑换失败
    isSignPopup:false,
    // 未获得签号
    isGetSignNumPopup:false,
    // 我的签号
    isMySignNumPopup:false,
    // 兑换成功 1  参与成功 2  兑换失败 3
    exchangeReturn:1,
    // 支付严禁弹框
    payMask:false,
    cashPledge:0,
    // 1 口令 2 押金
    awardstatus:1,

    // 口令
    redpinputdata: '',
    redpinputdataiftr: false,

    // 判断是否能分享
    is_share_but:true,
    // 太阳码参数 用户是否能分享 1 可以分享 
    canShare:0,
    // 判断是ios 还是android
    iftriosorand:app.signindata.iftriosorand || true,
    ownPromptBox:false,
    ownPromptBoxTxt:'',
    winningList:1

  },
  sharefriend:function(){
    this.setData({
     shareFriendBox:!this.data.shareFriendBox,
     shFrBxBo:true,
     shFrBxTo:false
    })
 },
 shFrBxToFun:function(){
  this.setData({
    shFrBxBo:false,
    shFrBxTo:true
   })   
},
  drawRulesFun:function(){
    this.setData({isChRulePopup:!this.data.isChRulePopup})
  },

  // 时间格式化输出，将时间戳转为 倒计时时间
  dateformat: function (micro_second) {
    var _this = this
    var timestamp = Date.parse(new Date())
    //总的秒数 
    var second = micro_second - (timestamp / 1000);
    if (second > 0) {
      // 天位    
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;
      // 小时位 
      var hr = Math.floor(second / 3600 % 24);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;
      // 分钟位  
      var min = Math.floor(second / 60 % 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;
      // 秒位  
      var sec = Math.floor(second % 60);
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;
      if (day == 0) {
        _this.setData({
          dayStr: "00",
          hrStr: hrStr,
          minStr: minStr,
          secStr: secStr,
        })
      } else {
        _this.setData({
          dayStr: dayStr,
          hrStr: hrStr,
          minStr: minStr,
          secStr: secStr,
        })
      }
    } else {
      _this.setData({
        dayStr: "00",
        hrStr: "00",
        minStr: "00",
        secStr: "00",
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    console.log('options========',options)
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      console.log('options========',scene)
      app.signindata.referee = _this.getSearchString('referee', scene) || 0;
      app.signindata.activity_id = _this.getSearchString('id', scene) || 0;
      _this.data.id = _this.getSearchString('id', scene) || 0;
      _this.data.gid = _this.getSearchString('gid', scene) || 0;
      // 用户是否能分享
      _this.data.canShare = _this.getSearchString('canShare', scene) || 0;

      this.setData({
        share_id: _this.getSearchString('referee', scene) || 0,
      })
    } else {
      console.log(2)
      app.signindata.referee = options.referee || 0;
      app.signindata.activity_id = options.id || 0;

      _this.data.id = options.id || 0;
      _this.data.gid = options.gid || 0;
      _this.data.canShare = options.canShare || 0;
      // 是否是朋友圈进入
      _this.data.perayu = options.perayu || 0;
      this.setData({
        share_id: options.referee || 0,
        brandId:options.brandId||''
      })
    };
    // 推送统计
    _this.data.push_id = options.push_id || 0;

    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.data.isNewer = app.signindata.isNewer;
    var saveimgurl = 'https://www.51chaidan.com/images/lot/' + _this.data.id + '.jpg'
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      avatarUrl: app.signindata.avatarUrl,
      saveimgurl: saveimgurl,
    });

    _this.data.pushWay = options.pushWay || 0;

    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      _this.onLoadfun();
    }else{
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {

            // '已经授权'
            _this.data.loginid = app.signindata.loginid;
            _this.data.openid = app.signindata.openid;
            _this.data.isNewer = app.signindata.isNewer;
            _this.setData({
              signinlayer: true,
              uid: app.signindata.uid,
              avatarUrl: app.signindata.avatarUrl,
              isProduce: app.signindata.isProduce,
            });
            // 判断是否登录
            if (_this.data.loginid != '' && _this.data.uid != '') {
              _this.onLoadfun();
            } else {
              app.signin(_this)
            }
          } else {
            wx.hideLoading()
            _this.onLoadfun();
            app.userstatistics(29);
            this.setData({
              signinlayer: false,
            })
          }
        }
      });
    };

  },
  onLoadfun: function () {
    var _this = this
    wx.hideLoading()

    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.data.isNewer = app.signindata.isNewer;

    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      avatarUrl: app.signindata.avatarUrl,
      defaultinformation:app.signindata.defaultinformation,
      iftriosorand:app.signindata.iftriosorand
    });
    console.log('限定判断手机型号',_this.data.iftriosorand)

    _this.getinfo();

    if (_this.data.share_id != 0) {
      _this.joinDraw(_this.data.share_id);
    }

    setTimeout(function () {
      _this.getdefault()
    }, 1000)
    // 生成图片商品数据
    if (app.signindata.activityblindbox) {
      _this.data.activityblindbox = app.signindata.activityblindbox;
    } else {
      app.activityblindboxfun(_this);
    };

  },
  getdefault: function () {
    // 调取晒单数量
    var _this = this;
    Dec.dryingSum(_this, app.signindata.clwcomurl);
    if(!_this.data.defaultinformation){
      var qqq = Dec.Aese('operation=info&mod=info');
      // 获取默认信息
      wx.request({
        url: app.signindata.comurl + 'general.php' + qqq,
        method: 'GET',
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          if (res.data.ReturnCode == 200) {
            _this.setData({
              defaultinformation: res.data.Info,
              wxnum: res.data.Info.cs.wxid || 'meichai666666',
            });
          };
          // 判断非200和登录
          Dec.comiftrsign(_this, res, app);
          // 购物车数据显示
          Dec.shopnum(_this,app.signindata.comurl);
        }
      });
    }

    // 统计推送进入
    if (_this.data.pushWay > 0) {
      app.pushfun(_this);
    }
  },
  ownPromptBoxFun:function(){
    this.setData({
      ownPromptBox:false,
      ownPromptBoxTxt:''
    }); 
  },
  // 分享领取
  joinDraw: function (share_uid) {
    var _this = this;

    wx.showLoading({
      title: '加载中...',
      mask:true
    })

    var q1 = Dec.Aese('mod=lotto&operation=joinDraw&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&share_uid=' + share_uid+'&perayu='+_this.data.perayu);

    console.log('朋友圈测试','mod=lotto&operation=joinDraw&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&share_uid=' + share_uid+'&perayu='+_this.data.perayu)

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log(share_uid,'领取分享=====================',res)
        if (res.data.ReturnCode == 200) {
          _this.getinfo();
          if(share_uid != 0){
            _this.setData({
              ownPromptBox:true,
              ownPromptBoxTxt:'助力成功'
            });
            setTimeout(function(){
              _this.ownPromptBoxFun()
            },2000)
          }else{
            _this.setData({
              exchangeReturn:2,
              isSignPopup:true,
              mySignatureNumber:res.data.Info.lottoNumber || '',
            })
          }
          var subscribedata = res.data.Info.subscribe || '';
          _this.data.subscribedata = subscribedata;
          if (app.signindata.subscribeif && subscribedata && subscribedata.template_id) {
            if (subscribedata.template_id instanceof Array) {
              wx.requestSubscribeMessage({
                tmplIds: subscribedata.template_id || [],
                success(res) {
                  for (var i = 0; i < subscribedata.template_id.length; i++) {
                    if (res[subscribedata.template_id[i]] == "accept") {
                      app.subscribefun(_this, 0, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
                    };
                  };
                }
              })
            } else {
              wx.requestSubscribeMessage({
                tmplIds: [subscribedata.template_id || ''],
                success(res) {
                  if (res[subscribedata.template_id] == "accept") {
                    app.subscribefun(_this, 0, subscribedata.template_id, subscribedata.subscribe_type);
                  };
                },
                complete() { }
              })
            };
          };

        } else if (res.data.ReturnCode == 358){
          _this.setData({
            payMask: true,
            cart_id: res.data.Info.cart_id
          })
        } else {
          if(res.data.ReturnCode != 300){
            if(res.data.Msg){
              wx.showModal({
                content: res.data.Msg || '',
                showCancel: false,
                success: function (res) {}
              })              
            }
          };
        }
      },
      complete:function(){
        wx.hideLoading()
      }
    })

  },
  getinfo: function () {
    var _this = this
    wx.showLoading({
      title: '加载中...',
      mask:true
    })

    var q1 = Dec.Aese('mod=lotto&operation=info&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&isNewer=' + _this.data.isNewer + '&gid=' + _this.data.gid + '&push_id='+_this.data.push_id);

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },

      success: function (res) {
        _this.data.push_id =  0;

        console.log(res)
        wx.stopPullDownRefresh();
        wx.stopPullDownRefresh()
        if (res.data.ReturnCode == 200) {
          wx.hideLoading()
          app.signindata.isNewer = false;
          _this.data.isNewer = false;
          _this.data.isonshow = true;
          res.data.Info.infoGoods.goods_desc = decodeURIComponent(res.data.Info.infoGoods.goods_desc.replace(/\+/g, ' '));

          // res.data.Info.infoGoods.goods_desc = decodeURIComponent(res.data.Info.infoGoods.goods_desc.replace(/<br>/g, ' '));

          res.data.Info.infoGoods.goods_desc = res.data.Info.infoGoods.goods_desc.replace(/<img/gi, '<img style="width:100%;display:block;" ')
          .replace(/<section/g, '<div')
          .replace(/\/section>/g, '\div>');


          clearInterval(_this.data.timer)


          if(res.data.Info.infoActivity.is_limit==1){

          }else{
            if (res.data.Info.infoActivity.status == 1) {
              _this.data.timer = setInterval(function () {
                //将时间传如 调用 
                _this.dateformat(res.data.Info.infoActivity.start_time);
              }.bind(_this), 1000);
            }
            if (res.data.Info.infoActivity.status == 2) {
              _this.data.timer = setInterval(function () {
                //将时间传如 调用 
                _this.dateformat(res.data.Info.infoActivity.stop_time);
              }.bind(_this), 1000);
            }
          };


          if (res.data.Info.infoActivity.status == 3) {

            if (res.data.Info.infoActivity.isWinner) {
              if (res.data.Info.infoActivity.isOrdered) {
                _this.setData({
                  btntext: "已领取成功",
                  awardstatus: 1,
                })
              } else if (res.data.Info.infoActivity.nextPay) { // 直接吊起预支付
                _this.setData({
                  btntext: "直接购买",
                  cart_id: res.data.Info.infoActivity.cart_id,
                  awardstatus: 2,
                })
                _this.data.timer = setInterval(function () {
                  //将时间传如 调用 
                  _this.dateformat(res.data.Info.infoActivity.overtime);
                }.bind(_this), 1000);
              } else if (res.data.Info.infoActivity.nextOrder) { // 中奖了
                _this.setData({
                  awardstatus: 2,
                  isgetaward:true
                })
                _this.data.timer = setInterval(function () {
                  //将时间传如 调用 
                  _this.dateformat(res.data.Info.infoActivity.overtime);
                }.bind(_this), 1000);
              } else {
                _this.setData({
                  btntext: "开奖24小时未领取，已过期",
                  awardstatus: 3,
                })
              }
            } else {
              _this.setData({
                btntext: "没有中奖,再接再厉",
                awardstatus: 4,
              })
            }

            var zlist = res.data.List.winnerLotto;
            for (var i = 0; i < zlist.length; i++) {
              var a = zlist[i].lotto;
              var aa = [];
              for (var j = 0; j < a.length; j++) {
                aa.push(a[j]);
              }
              zlist[i].lottolist = aa
            }
            res.data.List.winnerLotto = zlist
          }

          // var infoFragment = res.data.Info.infoFragment;
          // var chiplist = [];
          // var shareUserInfo = infoFragment.shareUserInfo || [];
          // res.data.Info.infoFragment.personalFragmentNumber = parseInt(infoFragment.personalFragmentNumber);

          // if (infoFragment.totalFragmentNumber && infoFragment.totalFragmentNumber > 0) {
          //   for (var i = 0; i < infoFragment.totalFragmentNumber; i++) {
          //     if (i < infoFragment.personalFragmentNumber) {
          //       chiplist.push(1);
          //     } else {
          //       chiplist.push(2);
          //     }
          //   }

          //   for (var i = infoFragment.shareUserInfo.length; i < infoFragment.totalFragmentNumber; i++) {
          //     shareUserInfo.push(1);
          //   }
          // }



          if (res.data.Info.infoActivity.joinMothed == "blindBox" && !res.data.Info.infoActivity.isCanOpenLotto) {
            wx.hideShareMenu();
          } else {
            wx.showShareMenu();
          }

          // res.data.List.ShareUser && res.data.List.ShareUser.indexOf(_this.data.uid) == -1

          if(res.data.Info.infoActivity.detail == 1 && _this.data.canShare !=1 ){
            console.log('detail == 1','不能分享')
            wx.hideShareMenu();
            _this.setData({
              is_share_but:false
            })
          };
          
          // 云统计
          var clouddata = { act_id: _this.data.id, type: res.data.Info.infoActivity.specialWay || 0 }
          app.cloudstatistics('activityStatistics', clouddata )

          
          if(_this.data.brandId&&_this.data.brandId!=0){
            console.log(1,_this.data.brandId)
             var brandid = _this.data.brandId||'';
             res.data.Info.infoActivity.brandId = brandid;
          }else{
            console.log(2)
            var brandid = res.data.Info.infoActivity ? res.data.Info.infoActivity.brandId||'' : '';
          };

          // var is_brand_display = false;
          // if(brandid&&brandid>0){
          //   res.data.Info.infoActivity.specialWay = 1;
          //   // 不是展会 但是是品牌
          //   is_brand_display = true;
          // }

          console.log('res.data.Info.infoActivity.specialWay=====',res.data.Info.infoActivity.specialWay)

          var lottoGetInfo = res.data.Info.lottoGetInfo;

          var infoLottoList = res.data.Info.infoLottoList || [];
          var infoActivity = res.data.Info.infoActivity;
          var forceGetLotto = true;
          if(( infoLottoList && infoLottoList.length == 0) && (infoActivity.isCommandActivity || infoActivity.joinMothed == "payTicket" || !_this.data.is_share_but) ) {
            forceGetLotto = false
          };
           



          _this.setData({
            infoLottoList:infoLottoList || [],
            lottoGetInfo:lottoGetInfo,
            forceGetLotto:forceGetLotto,
            // is_brand_display:is_brand_display,
            activityDesc: res.data.Info.activityDesc || "",
            brandRule: res.data.Info.infoActivity.brandRule || "",
            shareStatus: res.data.Info.shareStatus || "",
            activityMD: res.data.Info.activityMD || "",
            infoActivity: res.data.Info.infoActivity,
            is_exhibition: res.data.Info.infoActivity ? res.data.Info.infoActivity.specialWay||'' : '',
            brandId:brandid ,
            // infoFragment: res.data.Info.infoFragment,
            // chiplist: chiplist,
            // shareUserInfo: shareUserInfo,
            // chipwidth: 600 / infoFragment.totalFragmentNumber,
            // linenum: infoFragment.totalFragmentNumber / 2,
            infoGoods: res.data.Info.infoGoods,
            listLotto: res.data.List.listLotto || "",
            winnerLotto: res.data.List.winnerLotto || "",
            payprice: res.data.Info.infoGoods.shop_price || 0,
            subscribedata: res.data.Info.subscribe || '',
            id:res.data.Info.infoActivity.id||0,
            cashPledge:res.data.Info.cashPledge||0
          })
          // 是否调取展会数据
          // _this.exhibdatafun(1)
          // if (res.data.Info.infoActivity && res.data.Info.infoActivity.specialWay && res.data.Info.infoActivity.specialWay == 1||(res.data.Info.infoActivity.specialWay != 1&&brandid>0)) {
            
          //   app.livebroadcast(_this, res.data.Info.infoActivity.brandId)  // 直播数据
          // }
          //创建节点选择器
          // var box = wx.createSelectorQuery();
          // //选择id
          // box.select('#chipfather').boundingClientRect();
          // box.exec(function (res) {
          //   if (res && res[0]) {
          //     _this.setData({
          //       boxwidth: (res[0].width / _this.data.linenum - 2),
          //     })
          //   };
          // })


          _this.listdata(1)


          // if (res.data.Info.coupon.infoCoupon && res.data.Info.coupon.infoCoupon.length > 0) {
          //   _this.setData({
          //     iscoupon: true,
          //     newcoupondata: res.data.Info.coupon.infoCoupon || "",
          //     couponOverTime: res.data.Info.coupon.couponOverTime || "",
          //   })
          // }

          setTimeout(function () {
            if (res.data.Info.infoActivity.status == 3 && res.data.Info.infoActivity.isWinner && !res.data.Info.infoActivity.isOrdered) {
              _this.nextpagediao()
            }
            _this.getSnapshot()
          }, 1000)

        }else{
          wx.showModal({
            content: res.data.Msg || '',
            showCancel: false,
            success: function (res) {}
          })
        }

      },

      fail: function (res) {
        wx.stopPullDownRefresh();
        wx.hideLoading()
      }

    })
  },
  // 调取展会品牌数据
  exhibdatafun: function (num) {
    var _this = this;
    if (num == 1) {
      _this.data.exhpage = 0;
      _this.setData({});
    } else {
      var pagenum = parseInt(_this.data.exhpage)
      _this.data.exhpage = ++pagenum;
    };
    // 展会
    console.log('mod=show&operation=brandDetail&brandId=' + _this.data.brandId + '&page=' + _this.data.exhpage + '&gid=' + _this.data.gid+ '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid+'&dataType='+_this.data.is_exhibition)
    var exh = Dec.Aese('mod=show&operation=brandDetail&brandId=' + _this.data.brandId + '&page=' + _this.data.exhpage + '&gid=' + _this.data.gid+ '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid+'&dataType='+_this.data.is_exhibition);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + exh,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('展会品牌==================',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh()
        if (res.data.ReturnCode == 200) {
          if (num == 1) {
            var brand = res.data.Info.brand || '';
            var list = res.data.List.activity || '';
            for (var r = 0; r < list.length; r++) {
              if(_this.data.newdataexh){
                list[r].start_time = '暂未';
                list[r].stop_time = time.toDate(list[r].stop_time);
              }else{
                list[r].start_time = time.toDate(list[r].start_time);
                list[r].stop_time = time.toDate(list[r].stop_time);
              }

            };
            _this.setData({
              exhdata: list,
              userbranddata: brand
            })
            if(_this.data.is_exhibition==1){
              _this.addsementfun();
            };

          } else {
            var list = res.data.List.activity || [];
            if (list.length != 0) {
              var comdataarr = _this.data.exhdata.concat(list);
              _this.setData({
                exhdata: comdataarr
              })
            } else {
              app.showToastC('没有更多数据了');
            }
          };
        } else {
        };
      },
      fail: function () { }
    });
  },

  pullupsignin: function () {
    // // '没有授权'
    this.setData({
      tgabox: true
    });
  },
  // 授权点击统计
  clicktga: function () {
    app.clicktga(2)
  },
  clicktganone: function () {
    this.setData({
      tgabox: false
    })
  },
  userInfoHandler: function (e) {
    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 确认授权用户统计
          app.clicktga(4);
          _this.setData({
            tgabox: false,
            signinlayer: true,
          });
          // '已经授权'
          _this.data.loginid = app.signindata.loginid,
            _this.data.openid = app.signindata.openid,
            _this.data.isNewer = app.signindata.isNewer;

          _this.setData({
            uid: app.signindata.uid,
            avatarUrl: app.signindata.avatarUrl,
            isProduce: app.signindata.isProduce,
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
    if (e.detail.detail.userInfo) { } else {
      app.clicktga(8) //用户按了拒绝按钮
    };

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
    this.getinfo()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareTimeline:function(){
    var _this = this;
    _this.setData({
      shareFriendBox:false
    })
    return {
      title: _this.data.infoGoods.shop_price +'元 限定原价购 '+ _this.data.infoActivity.name +'，一起互换碎片！',
      query:'id='+_this.data.infoActivity.id+'&gid='+_this.data.gid+ '&referee=' + _this.data.uid+'&perayu=1',

      // query:{
      //   'id': _this.data.infoActivity.id,
      //   'gid':_this.data.gid
      // },
      imageUrl:_this.data.infoActivity.cover 
    }
  },
  onShareAppMessage: function () {
    var _this = this;
    _this.setData({
      shareFriendBox:false
    })

    if(_this.data.infoActivity.isShareBrandId){
      var urlpath = "/page/component/pages/limitlottery/limitlottery?id=" + _this.data.infoActivity.id + '&referee=' + _this.data.uid + '&gid=' + _this.data.gid+'&brandId='+_this.data.brandId||'';
    }else{
      var urlpath = "/page/component/pages/limitlottery/limitlottery?id=" + _this.data.infoActivity.id + '&referee=' + _this.data.uid + '&gid=' + _this.data.gid;
    };
    var share = {
      title: _this.data.infoGoods.shop_price + "元 限定原价购 " + _this.data.infoActivity.name + ",一起互换碎片!",
      imageUrl: _this.data.snapshotlim,
      path:urlpath ,
      success: function (res) {}
    }
    if (_this.data.infoActivity.isTodayShare) {
      _this.sharerequest()
    }
    return share;
  },

  // 跳转签到 
  mywallet: function () { 
    var _this = this;
    wx.navigateTo({    //签到
      url: "/page/component/pages/newsignin/newsignin?limaid="+_this.data.id
    });
  },  
  jumpsmoke:function(){
    var _this = this;
    wx.navigateTo({    //签到
      url: "/pages/smokeboxlist/smokeboxlist"
    });    
  },
  isMySignNumPopupfun:function(w){
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind||0;
    if(ind == 1){
      if(this.data.infoLottoList!=0){
        this.setData({isMySignNumPopup:!this.data.isMySignNumPopup,winningList:ind})
      }else{
        app.showToastC('您还未获得抽签号');
      }
    }else{
      this.setData({isMySignNumPopup:!this.data.isMySignNumPopup,winningList:ind})
    }

    
  },
  // 抽盒机可兑换
  exchangeSmoke:function(){
    var _this = this;
    var qqq = Dec.Aese('mod=lotto&operation=convert&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id='+_this.data.id);
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.signindata.comurl + 'spread.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log('兑换==========',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          _this.setData({
            mySignatureNumber:res.data.Info.lotto||'',
            exchangeReturn:1,
            isSignPopup:true
          })
          
        } else {
          _this.setData({
            isSignPopup:true,
            exchangeReturn:3
          })
          // app.showToastC(res.data.Msg);
        }
      }
    });



  },
  isSignPopupFun:function(){
    console.log(11111)
     if(this.data.exchangeReturn == 1){
        this.getinfo()   
     }
     this.setData({
      isSignPopup:false
     })
  },
  payMaskBox:function(){
     this.setData({payMask:false})
  },
  // 支付押金
  payMaskFun:function(){
    if(this.data.infoActivity.isCommandActivity){  // 口令
      this.redpinputdataiFun();
    } else if(this.data.infoActivity.joinMothed == "payTicket") {  // 押金
      // this.setData({payMask:!this.data.payMask})
      this.joinDraw(0);
    } else if (_this.data.infoActivity.joinMothed == "blindBox" && !_this.data.infoActivity.isCanOpenLotto) {
      wx.navigateTo({
        url: "/pages/smokeboxlist/smokeboxlist",
      });
    } else if (_this.data.infoActivity.joinMothed == "zone" && !_this.data.infoActivity.isCanOpenLotto) {
      wx.navigateTo({
        url: "/page/component/pages/newsigninarea/newsigninarea?type=3",
      });
    }  else {
      this.joinDraw(0);
    }
    
  },


  // 微信支付
  paymentmony: function (e) {
    var _this = this;
    var q = Dec.Aese('mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + _this.data.cart_id + '&xcx=1' + '&openid=' + _this.data.openid)
    console.log('mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + _this.data.cart_id + '&xcx=1' + '&openid=' + _this.data.openid)


    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          // 支付完成弹框显示数据
          var payinfo = res.data.Info;

          wx.requestPayment({
            'timeStamp': res.data.Info.timeStamp.toString(),
            'nonceStr': res.data.Info.nonceStr,
            'package': res.data.Info.package,
            'signType': 'MD5',
            'paySign': res.data.Info.paySign,
            'success': function (res) {

              // // 支付给签号
              // if(_this.data.payMask){
              //   // _this.setData({
              //   //   exchangeReturn:2,
              //   //   isChRulePopup:true,
              //   //   mySignatureNumber:res.data.Info.lottoNumber || '',
              //   //   payMask:false
              //   // })
              //   _this.joinDraw(0);
              // };

              _this.setData({
                payMask:false,
                tipbacktwo: false,
                buybombsimmediately: false,
                suboformola: false,
                desc: ''
              });

              var cart_id = _this.data.cart_id || '0';

              _this.getinfo()
              
              if(e && e != "undefined"){
                _this.joinDraw(0);
              }

              if (payinfo.isFreeBuyOrder) {
                wx.navigateTo({
                  url: "/page/component/pages/hidefun/hidefun?type=1&cart_id=" + _this.data.cart_id
                });
              } else {
                app.showToastC('购买成功');
              }

            },
            'fail': function (res) {
              _this.setData({
                tipbacktwo: false,
                buybombsimmediately: false,
                suboformola: false,
                desc: ''
              })
            },
            'complete': function (res) {
              // 订阅授权

            }
          })
        } else {
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


  // 红包口令 input 值改变
  redpinputChange: function (e) {
    this.setData({
      redpinputdata: e.detail.value
    });
  },

  redpinputdataiFun: function () {
    this.setData({
      redpinputdataiftr: !this.data.redpinputdataiftr,
      redpinputdata: ''
    })
  },
  // 复制微信号
  sponsocopytwo:function(){
    var _this = this;
    wx.setClipboardData({
      data:_this.data.infoActivity.wx|| _this.data.wxnum,
      success: function (res) {
        app.showToastC('复制成功');
        _this.setData({copyiftr:false});
      }
    });
  },

  getword: function () {
    var _this = this
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    var q1 = Dec.Aese('mod=lotto&operation=command&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.infoActivity.id + '&command=' + _this.data.redpinputdata);
    console.log('mod=lotto&operation=command&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.infoActivity.id + '&command=' + _this.data.redpinputdata)

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.stopPullDownRefresh();
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          
          _this.setData({
            isSignPopup:true,
            exchangeReturn:2,
            redpinputdataiftr: false,
            mySignatureNumber:res.data.Info.lottoNumber||'',
          })
          _this.getinfo();

        } else {
          wx.showModal({
            content: res.data.Msg || '',
            showCancel: false,
            success: function (res) {}
          })
        }
      },

      fail: function (res) {
        wx.hideLoading()
      }

    })
  },
  // 签号攻略
  signatureStrategy:function(){
    this.setData({isSignStrategyPopup:!this.data.isSignStrategyPopup})
  },
  winnerlogic: function () {
    var _this = this
    var infoActivity = _this.data.infoActivity
    if (infoActivity.isWinner) {
      if (infoActivity.isOrdered) { //购买完成
      } else if (infoActivity.nextPay) { // 直接吊起预支付
        // 微信支付
        _this.paymentmony()
      } else if (infoActivity.nextOrder) { // 中奖了
        _this.dsbbbutclickt()
      } else { }
    } else { //没有中奖,再接再厉

    }
  },
  // 立即购买弹框
  dsbbbutclickt: function () {
    this.setData({
      tipbacktwo: true,
      buybombsimmediately: true
    });
    this.amountcalculation()
  },
  // 金额计算
  amountcalculation: function () {
    var _this = this
    // 运费 
    var acc = 0;
    var xianshi = '0.00';
    var freightiftr = '0.00';
    // 商品个数
    var mcnum = parseInt((_this.data.rednum + _this.data.bluenum));
    if ((this.data.defaultinformation.carriage.free || "99") != '-1') {
      var tddefcarfr = parseFloat(this.data.defaultinformation.carriage.free || "99");
      if (mcnum >= parseFloat(this.data.defaultinformation.carriage.freeMCPieces)) {
        if (this.data.defaultinformation.carriage.freeMCPieces == 1) {
          acc = 0;
          freightiftr = 0;
          xianshi = '限时包邮';
        } else {
          acc = 0;
          freightiftr = 0;
          xianshi = '商品包邮';
        };
      } else if (_this.data.payprice >= tddefcarfr) {
        acc = 0;
        freightiftr = 0;
        xianshi = '满￥' + parseFloat(this.data.defaultinformation.carriage.free || "99").toFixed(2) + '包邮';
      } else {
        if (this.data.infoGoods.carriage !== '') {
          var tdzuncar = this.data.infoGoods.carriage;
        } else {
          var tdzuncar = this.data.defaultinformation.carriage.d;
        };
        xianshi = '￥' + parseFloat(tdzuncar).toFixed(2);
        freightiftr = parseFloat(tdzuncar);
        acc = parseFloat(tdzuncar) > parseFloat(this.data.coudata1mon) ? parseFloat(this.data.infoGoods.carriage) - parseFloat(this.data.coudata1mon) : 0;
      };
    } else {
      if (this.data.infoGoods.carriage !== '') {
        var tdzuncar = this.data.infoGoods.carriage;
      } else {
        var tdzuncar = this.data.defaultinformation.carriage.d;
      };
      xianshi = '￥0.00';
      freightiftr = parseFloat(tdzuncar);
      acc = parseFloat(tdzuncar) > parseFloat(this.data.coudata1mon) ? parseFloat(this.data.infoGoods.carriage) - parseFloat(this.data.coudata1mon) : 0;
    };

    this.setData({

      // 运费
      // freight: acc,
      freight: xianshi,
      freightiftr: freightiftr,

    });
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

  // 立即购买弹框
  dsbbbutclickt: function () {
    this.setData({
      tipbacktwo: true,
      buybombsimmediately: true
    });
    this.amountcalculation()
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
  },
  tipbacktwo: function () {
    this.setData({
      tipbacktwo: false,
      buybombsimmediately: false,
      receivingaddress: false,
    });
  },

  // 收货地址弹框
  seladdressfun: function () {
    this.setData({
      receivingaddress: true,
    });
  },

  // 隐藏收货地址弹框
  receivingaddressfun: function () {
    this.setData({
      receivingaddress: false,
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

  // 阻止蒙层冒泡
  preventD() { },

  pricedetailc: function () { // 价格明细显示隐藏
    this.setData({
      pricedetailc: !this.data.pricedetailc
    })
  },
  // 买家备注
  inputChange: function (e) {
    this.setData({
      desc: e.detail.value
    });
  },

  // 提交订单
  placeorder: function () {
    var _this = this;
    if (this.data.tipaid == '') {
      app.showToastC('请选择地址');
      return false;
    };

    var id = _this.data.infoActivity.id
    var aid = _this.data.tipaid;
    // 提交订单蒙层
    _this.setData({
      suboformola: true
    });
    var q = Dec.Aese('mod=lotto&operation=order&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + id + '&aid=' + aid + '&desc=' + _this.data.desc);
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            tipbacktwo: true,
            buybombsimmediately: true,
            receivingaddress: false,
            cart_id: res.data.Info.cart_id,
          });
          // 微信支付
          _this.paymentmony()
        } else {
          // 提交订单蒙层
          _this.setData({
            suboformola: false
          });
          app.showToastC(res.data.Msg);
        };
      }
    })
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
  /**
   * 生成截图
   */
  getSnapshot: function () {
    var _this = this;
    const ctx = wx.createCanvasContext('snapshotlim')

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 300, 240)

    wx.getImageInfo({
      src: _this.data.infoActivity.cover,
      success: function (res) {
        var ratio = res.width / res.height;
        var mh = ratio * 170;
        if (mh >= 300) {
          ctx.drawImage(res.path, 0, 0, 300, 170);
        } else {
          ctx.drawImage(res.path, (300 - mh) / 2, 0, mh, 170);
        }
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 170, 300, 40)

        if (_this.data.infoActivity.supportLogo != "") {
          wx.getImageInfo({
            src: _this.data.infoActivity.supportLogo,
            success: function (res) {
              ctx.drawImage(res.path, 210, 178, 25, 25);

              ctx.fillStyle = '#fff';
              ctx.setFontSize(14)
              ctx.fillText(_this.data.infoActivity.supportName, 238, 195)
              if (_this.data.dayStr != 0) {
                ctx.fillText("抽签倒计时" + _this.data.dayStr + "天" + _this.data.hrStr + "时" + _this.data.minStr + "分" + _this.data.secStr + "秒", 10, 195)
              } else {
                ctx.fillText("抽签倒计时" + _this.data.hrStr + "时" + _this.data.minStr + "分" + _this.data.secStr + "秒", 10, 195)
              }

              ctx.draw(true, setTimeout(function () {
                wx.canvasToTempFilePath({
                  canvasId: 'snapshotlim',
                  success: function (res) {
                    _this.setData({
                      snapshotlim: res.tempFilePath
                    })
                  },
                  fail: function (res) {},
                });
              }, 300));
            }
          })
        } else {
          ctx.fillStyle = '#fff';
          ctx.setFontSize(14)
          if (_this.data.dayStr != 0) {
            ctx.fillText("抽签倒计时" + _this.data.dayStr + "天" + _this.data.hrStr + "时" + _this.data.minStr + "分" + _this.data.secStr + "秒", 60, 195)
          } else {
            ctx.fillText("抽签倒计时" + _this.data.hrStr + "时" + _this.data.minStr + "分" + _this.data.secStr + "秒", 60, 195)
          }
          ctx.draw(true, setTimeout(function () {
            wx.canvasToTempFilePath({
              canvasId: 'snapshotlim',
              success: function (res) {
                _this.setData({
                  snapshotlim: res.tempFilePath
                })
              },
              fail: function (res) {},
            });
          }, 300));
        }

      },
      fail: function () {

      }
    })
  },
  listdata: function(num) { // 1 下拉 2 上拉
    var _this = this;
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    if (num == 1) {
      _this.setData({
        pid: 0,
        nodataiftr: false,
        listdata: [],
        signlist: [],
        finishedlist: [],
      });
    } else {
      var pagenum = _this.data.pid;
      _this.setData({
        pid: ++pagenum,
        nodataiftr: false
      });
    };
    var q = Dec.Aese('mod=lotto&operation=list&uid='  + _this.data.uid + '&loginid=' + _this.data.loginid + '&pid=' + _this.data.pid+'&id='+_this.data.id);
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        console.log('listdata===',res)
        // 刷新完自带加载样式回去
        wx.hideLoading()
        wx.stopPullDownRefresh();
        _this.setData({
          nodataiftr: true
        });
        if (res.data.ReturnCode == 200) {
          var arrlist = res.data.List.inProgree || [];
          if (arrlist && arrlist.length != 0) {
            for (var i = 0; i < arrlist.length; i++) {
              if (arrlist[i].status == 1) {
                arrlist[i].start_time = time.toDate(arrlist[i].start_time);
              } else if (arrlist[i].status == 2) {
                arrlist[i].stop_time = time.toDate(arrlist[i].stop_time);
              };
            };

            if (num == 1) {
              var comdataarr = arrlist || [];
            } else {
              var comdataarr = _this.data.listdata.concat(arrlist);
            };


            _this.setData({
              listdata: comdataarr
            });
          } else {
            app.showToastC('暂无更多数据');
          };

        };
        if (res.data.ReturnCode == 300) {
          if (num == 1) {
            _this.setData({
              listdata: []
            });
          }
        };
        _this.setData({
          nodataiftr: true
        })

      }

    });
  },
  // 跳转抽签详情
  limitlotteryd: function(w) {
    var id = w.currentTarget.dataset.gid || w.target.dataset.gid;
    wx.redirectTo({
      url: "/page/component/pages/limitlottery/limitlottery?id=" + id
    });
  },

  regPromptBox:function(){
    if(this.data.infoActivity.status == 3){
      app.showToastC("抽签已完成");
    }else{
      app.showToastC("请先报名");
    }
    
  }

})