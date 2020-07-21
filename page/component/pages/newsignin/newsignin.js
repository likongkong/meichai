// page/component/pages/newsignin/newsignin.js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
var Dec = require('../../../../common/public.js'); //aes加密解密js
var WxParse = require('../../../../wxParse/wxParse.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: { // 接口地址
    comurl: app.signindata.comurl,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,
    appNowTime: Date.parse(new Date()),
    // 适配苹果X 
    isIphoneX: app.signindata.isIphoneX,

    c_title: '签到领福利',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    bannerList: [],
    cardList: [],
    cardHeight: 0,
    giftheight: 200,

    // 授权弹框
    tgabox: false,
    windowHeight: app.signindata.windowHeight - 65 - wx.getStorageSync('statusBarHeightMc') || 0,
    signinlayer: false,

    shopnum: 0,
    dryinglistnum: 0,

    ishowdetail: false,

    itemimageurl: "",

    ishowbigimg: false,

    dayStr: "",
    hrStr: "",
    minStr: "",
    secStr: "",
    timer: '',
    isresponse: false,

    isdesc: false,

    bmgindex: 0,
    ishowsignin: false,
    ishowrecord: false,
    hintindex: -1,

    recordTips: 0,
    recordStatus: 0,

    actimgshare: "",

    share_id: 0,
    mshareId: 0,
    drawBoxGoodsInfo: "",
    ishowgetcard: false,
    isRetroactive: false,
    ishowRetro: false,

    roleList: [],
    switchList: [],
    ishowSwitch: false,
    selectedindex: -1,
    isjumpshow: false,
    selectaid: 0,
    isSwitch: false,

    id: 0,
    subscribedata: "",
    // 订阅判断
    subscribeif: app.signindata.subscribeif,
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
    wx.showLoading({
      title: '加载中...',
    })
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
          wx.hideLoading();
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      app.signindata.referee = _this.getSearchString('referee', scene) || 0;
      app.signindata.activity_id = _this.getSearchString('id', scene) || 0;
      _this.data.loginid = app.signindata.loginid;
      _this.data.openid = app.signindata.openid;
      _this.setData({
        uid: app.signindata.uid,
        isShareFun: app.signindata.isShareFun,
        id: _this.getSearchString('id', scene) || 0,
        referee: _this.getSearchString('referee', scene) || 0,
        mshareId: _this.getSearchString('share_id', scene) || 0,
      });
    } else {
      app.signindata.referee = options.referee || 0;
      app.signindata.activity_id = options.id || 0;
      _this.data.loginid = app.signindata.loginid;
      _this.data.openid = app.signindata.openid;
      _this.setData({
        uid: app.signindata.uid,
        isShareFun: app.signindata.isShareFun,
        id: options.id || 0,
        referee: options.referee || 0,
        mshareId: options.share_id || 0,
      });
    }

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
            _this.setData({
              uid: app.signindata.uid,
              avatarUrl: app.signindata.avatarUrl,
              isProduce: app.signindata.isProduce,
              signinlayer: true,
            });
            // 判断是否登录
            if (_this.data.loginid != '' && _this.data.uid != '') {
              _this.onLoadfun();
            } else {
              app.signin(_this)
            }
          } else {
            wx.hideLoading()
            app.userstatistics(37);
            _this.onLoadfun();
            this.setData({
              signinlayer: false,
            })
          }
        }
      });
    };
  },

  onLoadfun: function () {
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isShareFun: app.signindata.isShareFun,
      isProduce: app.signindata.isProduce,
    });

    wx.hideLoading()

    this.getInfo();

    if (_this.data.id != 0 && _this.data.referee != 0 && _this.data.referee != _this.data.uid && _this.data.mshareId != 0) {
      _this.giftrecord();
    }

    // 购物车数量
    Dec.shopnum(_this,app.signindata.comurl);
    // 调取晒单数量
    Dec.dryingSum(_this, app.signindata.clwcomurl);

  },

  getInfo: function () {
    var _this = this;
    var qqq = Dec.Aese('mod=Obtain&operation=list&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
    wx.request({
      url: app.signindata.comurl + 'sign.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.ReturnCode == 200) {

          var cardlist = res.data.List.cardList || [];
          var isone = true;
          if (res.data.Info.makeUpNumber > 0) {
            for (var i = 0; i < cardlist.length; i++) {
              if (cardlist[i].num == 0 && isone) {
                cardlist[i].isone = true;
                isone = false;
              } else {
                cardlist[i].isone = false;
              }
            }
          }

          _this.setData({
            isresponse: true,
            signinfo: res.data.Info,
            id: res.data.Info.aid,
            cardList: cardlist,
            daysList: res.data.List.daysList,
            linenum: Math.ceil(res.data.List.cardList.length / 2),
            singlewidth: 690 / Math.ceil(res.data.List.cardList.length / 2) - 18,
            share_id: res.data.Info.share_id ? res.data.Info.share_id : 0,
            drawBoxGoodsInfo: res.data.Info.drawBoxGoodsInfo ? res.data.Info.drawBoxGoodsInfo : "",
            drawBoxStatus: res.data.Info.drawBoxStatus,
            isRetroactive: res.data.Info.makeUpNumber > 0 ? true : false,
            receiveMakeUp: res.data.Info.receiveMakeUp,
            selectaid: res.data.Info.aid,
            isSwitch: res.data.Info.isSwitch || false,
          })

          // 商品详情 
          if (res.data.Info && res.data.Info.desc) {
            WxParse.wxParse('article', 'html', res.data.Info.desc, _this, 0);
            _this.setData({
              isdesc: true,
            });
          } else {
            _this.setData({
              isdesc: false
            });
          };

          if (res.data.Info.over_time) {
            _this.data.timer = setInterval(function () {
              _this.dateformat(res.data.Info.over_time);
            }.bind(_this), 1000);
          }

          // _this.giftrecord();

        } else { }
      }
    });
  },

  signin: function () {
    var _this = this;
    var qqq = Dec.Aese('mod=Obtain&operation=todaySign&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
    _this.setData({
      ishowrecord: false,
    })

    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.signindata.comurl + 'sign.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          wx.hideLoading();

          _this.setData({
            goodsGift: res.data.Info.receiveGiftInfo.goodsGift,
            gift: res.data.Info.receiveGiftInfo.gift,
            ishowsignin: true,
            share_id: res.data.Info.share_id ? res.data.Info.share_id : 0,
            subscribedata: res.data.Info.subscribe,
          })
          // _this.subscrfun();
          app.signindata.isTodaySign = true;
          _this.getInfo();

        } else {
          app.showToastC(res.data.Msg);
        }
      }
    });
  },

  // 拉起订阅
  subscrfun: function () {
    var _this = this;
    var subscribedata = _this.data.subscribedata || '';
    if (subscribedata && subscribedata.template_id && this.data.subscribeif) {
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
          complete() { }
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


  giftrecord: function () {
    var _this = this;
    var qqq = Dec.Aese('mod=Obtain&operation=shareGift&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + _this.data.id + '&share_uid=' + _this.data.referee + '&share_id=' + _this.data.mshareId);


    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.signindata.comurl + 'sign.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          wx.hideLoading();
          if (res.data.Info.receiveUserInfo && res.data.Info.receiveUserInfo.length < 3) {
            var num = 3 - parseInt(res.data.Info.receiveUserInfo.length);
            for (var j = 0; j < num; j++) {
              res.data.Info.receiveUserInfo.push(1);
            };
          }

          _this.setData({
            receiveUserInfo: res.data.Info.receiveUserInfo,
            ishowrecord: true,
            recordTips: res.data.Info.tips,
            recordStatus: res.data.Info.status,
          })

          _this.getInfo();

        } else {
          app.showToastC(res.data.Msg);
        }
      }
    })
  },

  //晒单领奖
  winaward: function () {
    var _this = this;

    return;

    this.setData({
      upserimgbox: true
    });

    this.generatePicturesbs();

  },

  myCatchTouch: function () {

  },

  //领取奖励
  getaward: function () {
    var cart_id = this.data.signinfo.cart_id || '';
    wx.navigateTo({
      url: "/page/component/pages/awardwinningarea/awardwinningarea?cart_id=" + cart_id,
    });
  },

  closegetcard: function () {
    var _this = this;
    this.setData({
      ishowgetcard: !_this.data.ishowgetcard,
    })
  },

  mgetcard: function () {
    var _this = this;
    var role_id = _this.data.drawBoxGoodsInfo.role_id || 0;

    var qqq = Dec.Aese('mod=Obtain&operation=payCard&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + "&role_id=" + role_id);

    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.signindata.comurl + 'sign.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          app.showToastC('领取成功');
          _this.setData({
            ishowgetcard: false,
          })
          _this.getInfo();
        } else {
          app.showToastC(res.data.Msg);
        }
      }
    })
  },

  // 计算图片大小
  imageLoad: function (e) {
    var _this = this
    var type = e.target.dataset.type;
    if (type == 1) {
      var _this = this;
      var $width = e.detail.width, //获取图片真实宽度
        $height = e.detail.height,
        ratio = $width / $height;
      var viewWidth = _this.data.singlewidth, //设置图片显示宽度，
        viewHeight = _this.data.singlewidth / ratio;
      _this.setData({
        cardHeight: viewHeight,
        cardratio: ratio,
      })
    } else {
      var _this = this;
      var $width = e.detail.width, //获取图片真实宽度
        $height = e.detail.height,
        ratio = $width / $height;
      var viewWidth = 100, //设置图片显示宽度，
        viewHeight = 100 / ratio;
      _this.setData({
        giftheight: viewHeight
      })
    }

  },

  onShow: function () {
    this.getInfo();
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
   * 用户点击右上角分享
   */
  onShareTimeline:function(){
    var _this = this;
    return {
      title:_this.data.c_title || '潮玩社交平台',
      query:{}    
    }
  },
  onShareAppMessage: function () {
    var _this = this
    var share = {
      title: "我在签到领盲盒,送你们随机款式x3,一起互换卡片吧。",
      imageUrl: _this.data.signinfo.goods_share,
      path: "/page/component/pages/newsignin/newsignin?id=" + _this.data.signinfo.aid + '&referee=' + _this.data.uid + '&share_id=' + _this.data.share_id,
      success: function (res) { }
    }
    return share;
  },

  lookbigimg: function (w) {
    var _this = this;
    var url = w.currentTarget.dataset.url || w.target.dataset.url;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind;

    _this.setData({
      itemimageurl: url,
      ishowbigimg: true,
      bmgindex: _this.data.cardList[ind].help ? _this.data.cardList[ind].help : [],
    })

  },

  closebigimg: function () {
    this.setData({
      ishowbigimg: false,
    })
  },

  pullupsignin: function () {
    // // '没有授权'
    this.setData({
      tgabox: true
    });
  },

  closedetail: function () {

    this.setData({
      ishowdetail: false,
    })
  },

  showDetail: function () {
    if (this.data.isdesc) {
      this.setData({
        ishowdetail: true,
      })
    }
  },

  closesignin: function () {
    this.setData({
      ishowsignin: false,
    })
  },

  closerecord: function () {
    this.setData({
      ishowrecord: false,
    })
  },

  showhint: function (w) {
    var _this = this
    var ind = w.currentTarget.dataset.ind;
    if (_this.data.hintindex == ind) {
      this.setData({
        hintindex: -1,
      })
    } else {
      this.setData({
        hintindex: ind,
      })
    }
  },

  gosmokelist: function () {
    var _this = this;

    if (_this.data.signinfo.existenceDrawBox) {
      wx.navigateTo({
        url: "/pages/smokebox/smokebox?gid=" + _this.data.signinfo.goodsId
      });
    } else {
      wx.navigateTo({
        url: "/pages/detailspage/detailspage?gid=" + _this.data.signinfo.goodsId,
      });
    }

  },

  dlfindfun: function () {
    setTimeout(function () {
      wx.reLaunch({
        url: "/page/component/pages/dlfind/dlfind",
      })
    }, 100);
  },
  // 导航跳转
  whomepage: function () {
    setTimeout(function () {
      wx.reLaunch({
        url: "../../../../pages/index/index?judgeprof=2"
      })
    }, 40);
  },
  wmy: function () {
    setTimeout(function () {
      wx.reLaunch({
        url: "../../../../pages/wode/wode"
      });
    }, 40);
  },
  wshoppingCart: function () {
    setTimeout(function () {
      wx.reLaunch({
        url: "../../../../pages/shoppingCart/shoppingCart"
      });
    }, 100);
  },

  // 关闭保存图片上传图片
  closeupserimg: function () {
    this.setData({
      upserimgbox: false,
      actimgshare: ''
    });
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
          dayStr: 0,
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
        dayStr: 0,
        hrStr: "00",
        minStr: "00",
        secStr: "00",
      })
      clearInterval(this.data.timer);
    }

  },

  generatePicturesbs: function () {
    var _this = this;
    // wx.showLoading({
    //   title: '加载中...',
    // });

    return;

    var ctxt = wx.createCanvasContext('canimgserceshi')
    wx.getImageInfo({
      src: _this.data.signinfo.banner[0],
      success: function (res) {
        ctxt.drawImage(res.path, 130, 296, 114, 114);
        wx.getImageInfo({
          src: "https://www.51chaidan.com/images/cast/ca_1.png",
          success: function (res) {
            ctxt.drawImage(res.path, 0, 0, 375, 603);
            ctxt.draw(true, setTimeout(function () {
              wx.canvasToTempFilePath({
                canvasId: 'canimgserceshi',
                success: function (res) {
                  wx.hideLoading()
                  _this.setData({
                    actimgshare: res.tempFilePath,
                  });

                },
                fail: function (res) {
                  wx.hideLoading()
                  app.showToastC('图片生成失败，请重新刷新页面重试,{ReturnCode:01}');
                  _this.setData({
                    upserimgbox: false,
                  });

                },
              });
            }, 300));

          },
          fail: function (res) {
            wx.hideLoading()
            app.showToastC('图片生成失败，请重新刷新页面重试,{ReturnCode:02}');
            _this.setData({
              upserimgbox: false,
            });
          }
        });

      },
      fail: function (res) {
        wx.hideLoading()
        app.showToastC('图片生成失败，请重新刷新页面重试,{ReturnCode:06}');
        _this.setData({
          upserimgbox: false,
        });
      }
    });
  },

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

  closeRorto: function () {
    var _this = this;
    if (!_this.data.ishowRetro) {
      _this.getRetroinfo();
    } else {
      _this.setData({
        ishowRetro: !_this.data.ishowRetro,
      })
    }
    _this.setData({
      ishowsignin: false,
    })
  },

  getRetroinfo: function () {
    var _this = this;
    var qqq = Dec.Aese('mod=Obtain&operation=showMakeUp&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + _this.data.signinfo.aid);

    wx.request({
      url: app.signindata.comurl + 'sign.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            ishowRetro: true,
            roleList: res.data.List.roleList,
          })
        } else {
          app.showToastC(res.data.Msg);
        }
      },
      fail: function (res) {}
    })
  },

  getRetro: function () {
    var _this = this;
    var qqq = Dec.Aese('mod=Obtain&operation=addMakeUp&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + _this.data.signinfo.aid);

    wx.request({
      url: app.signindata.comurl + 'sign.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          app.showToastC("领取成功");
          _this.setData({
            ishowRetro: false,
          })
          _this.getInfo();
        } else {
          app.showToastC(res.data.Msg);
        }
      },
      fail: function (res) {}
    })
  },

  gosignarea: function (w) {
    var _this = this;
    var type = w.currentTarget.dataset.type;
    wx.navigateTo({
      url: "/page/component/pages/newsigninarea/newsigninarea?type=" + type + "&activity_id=" + _this.data.selectaid,
    })
  },

  switchList: function () {
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    var qqq = Dec.Aese('mod=Obtain&operation=switchList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
    wx.request({
      url: app.signindata.comurl + 'sign.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          var activityList = res.data.List.activityList;
          for (var i = 0; i < activityList.length; i++) {
            activityList[i].iswitch = 0;
          }
          _this.setData({
            switchList: activityList,
            ishowSwitch: !_this.data.ishowSwitch,
          })
        } else {
          app.showToastC(res.data.Msg);
        }
      }
    })
  },

  switchclick: function () {
    var _this = this;
    if (!_this.data.ishowSwitch) {
      _this.switchList();
    } else {
      _this.setData({
        ishowSwitch: !_this.data.ishowSwitch,
      })
    }
  },

  switchselect: function () {
    var _this = this;
    var index = _this.data.selectedindex;
    var minfo = _this.data.switchList[index];
    if (minfo && minfo.is_pay && typeof (minfo.is_pay) != "undefined" && minfo.is_pay == 1) {
      _this.setData({
        isjumpshow: true,
      })
      return;
    }
    if (typeof (minfo) == "undefined") {
      return;
    }
    var qqq = Dec.Aese('mod=Obtain&operation=switchActivity&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + minfo.aid);
    wx.request({
      url: app.signindata.comurl + 'sign.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          app.showToastC("切换成功");
          _this.setData({
            ishowSwitch: false,
          })
          _this.getInfo();
        } else {
          app.showToastC(res.data.Msg);
        }
      }
    })
  },

  switchit: function (w) {
    var ind = w.currentTarget.dataset.ind;
    var _this = this;
    var activityList = _this.data.switchList;
    for (var i = 0; i < activityList.length; i++) {
      activityList[i].iswitch = 0;
    }
    activityList[ind].iswitch = 1;
    _this.setData({
      switchList: activityList,
      selectedindex: ind,
    })
  },

  closejumparea: function () {
    var _this = this
    _this.setData({
      isjumpshow: !_this.data.isjumpshow,
    })
  }
})