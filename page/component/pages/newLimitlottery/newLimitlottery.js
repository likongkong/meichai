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
    isMySignNumPopup:false

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
  onLoadfun: function() {
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      isProduce: app.signindata.isProduce,
      // 适配苹果X 
      isIphoneX: app.signindata.isIphoneX
    });

    _this.getinfo();

    // _this.data.timer = setInterval(function () {
    //   //将时间传如 调用 
    //   _this.dateformat(1606119027);
    // }.bind(_this), 1000);

  },

  getinfo: function () {
    var _this = this
    wx.showLoading({
      title: '加载中...',
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

          var infoFragment = res.data.Info.infoFragment;
          var chiplist = [];
          var shareUserInfo = infoFragment.shareUserInfo;
          res.data.Info.infoFragment.personalFragmentNumber = parseInt(infoFragment.personalFragmentNumber);

          if (infoFragment.totalFragmentNumber && infoFragment.totalFragmentNumber > 0) {
            for (var i = 0; i < infoFragment.totalFragmentNumber; i++) {
              if (i < infoFragment.personalFragmentNumber) {
                chiplist.push(1);
              } else {
                chiplist.push(2);
              }
            }

            for (var i = infoFragment.shareUserInfo.length; i < infoFragment.totalFragmentNumber; i++) {
              shareUserInfo.push(1);
            }
          }



          if (res.data.Info.infoActivity.joinMothed == "blindBox" && !res.data.Info.infoActivity.isCanOpenLotto) {
            wx.hideShareMenu();
          } else {
            wx.showShareMenu();
          }

          // res.data.List.ShareUser && res.data.List.ShareUser.indexOf(_this.data.uid) == -1

          if(res.data.Info.infoActivity.detail == 1 && _this.data.canShare!=1){
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
          _this.setData({
            // is_brand_display:is_brand_display,
            activityDesc: res.data.Info.activityDesc || "",
            brandRule: res.data.Info.infoActivity.brandRule || "",
            shareStatus: res.data.Info.shareStatus || "",
            activityMD: res.data.Info.activityMD || "",
            infoActivity: res.data.Info.infoActivity,
            is_exhibition: res.data.Info.infoActivity ? res.data.Info.infoActivity.specialWay||'' : '',
            brandId:brandid ,
            infoFragment: res.data.Info.infoFragment,
            chiplist: chiplist,
            shareUserInfo: shareUserInfo,
            chipwidth: 600 / infoFragment.totalFragmentNumber,
            linenum: infoFragment.totalFragmentNumber / 2,
            infoGoods: res.data.Info.infoGoods,
            listLotto: res.data.List.listLotto || "",
            winnerLotto: res.data.List.winnerLotto || "",
            payprice: res.data.Info.infoGoods.shop_price || 0,
            subscribedata: res.data.Info.subscribe || '',
            id:res.data.Info.infoActivity.id||0,
            cashPledge:res.data.Info.cashPledge||0
          })
          // 是否调取展会数据
          _this.exhibdatafun(1)
          if (res.data.Info.infoActivity && res.data.Info.infoActivity.specialWay && res.data.Info.infoActivity.specialWay == 1||(res.data.Info.infoActivity.specialWay != 1&&brandid>0)) {
            
            app.livebroadcast(_this, res.data.Info.infoActivity.brandId)  // 直播数据
          }
          //创建节点选择器
          var box = wx.createSelectorQuery();
          //选择id
          box.select('#chipfather').boundingClientRect();
          box.exec(function (res) {
            if (res && res[0]) {
              _this.setData({
                boxwidth: (res[0].width / _this.data.linenum - 2),
              })
            };
          })



          if (res.data.Info.coupon.infoCoupon && res.data.Info.coupon.infoCoupon.length > 0) {
            _this.setData({
              iscoupon: true,
              newcoupondata: res.data.Info.coupon.infoCoupon || "",
              couponOverTime: res.data.Info.coupon.couponOverTime || "",
            })
          }

          // setTimeout(function () {
          //   if (res.data.Info.infoActivity.status == 3 && res.data.Info.infoActivity.isWinner && !res.data.Info.infoActivity.isOrdered) {
          //     _this.nextpagediao()
          //   }
          //   _this.getSnapshot()
          // }, 1000)

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
    
  },
  // 跳转签到 
  mywallet: function () { 
    var _this = this;
    wx.navigateTo({    //签到
      url: "/page/component/pages/newsignin/newsignin?limaid="+_this.data.id
    });
  },  

















})