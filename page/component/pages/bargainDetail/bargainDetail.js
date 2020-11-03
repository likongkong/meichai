var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
var tcity = require("../../../../common/citys.js"); //地址
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    comurl: app.signindata.comurl,
    gifturl: app.signindata.clwcomurl,
    version: Pub.versionNumber(),
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,


    help_list: [],
    recommend_list: [],
    goods_id: '',

    goodsInfo: '',

    clock: 10,

    order_sn: "",
    order_id: "",

    ishowshareone: false,
    ishowbuycd: false,

    shareinfo: '',

    page: 1,

    // 地址
    provinces: [],
    province: '北京市',
    citys: [],
    city: '北京市',
    countys: [],
    county: '东城区',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,

    name: '',
    tele: '',
    area: '',
    address: '',
    card: '',

    ishowaddress: false,
    ishowmore: true,
    ishowhelp: false,

    helpInfo: '',

    status: 0,

    createimage: '',
    ishowcreate: false,

    ishowExplain: false,
    tgabox: false,
    appNowTime: app.signindata.appNowTime,

    ishowsign: false,

    dayStr: "",
    hrStr: "",
    minStr: "",
    secStr: "",
    timer: "",

    ishowaffirm: false,
    ishowclock: false,

    news: [],

    awardpriview: false,

    newcoutitle: '新人礼包',

    newcoupondata: [1],

    iscoupon: false,
    newcoupon: false,

    awardBox: '',
    isawardBox: false,

    awardminStr: "00",
    awardsecStr: "00",
    awardmstr: "00",

    interval: "",

    awardinterval: "",

    isgetphone: false,

    // 是否开启了分享功能
    isShareFun: true,

    oldnum: 0,
    newnum: 0,
    perchlist: [],
    ishowmeichai: false,
    ishare: 0,

    c_title: '砍价',
    c_arrow: true,
    c_backcolor: '#ff6968',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    pushWay: 0,

    ishowAction:false,
    activityMD:'',

    getphoneInfo:'',
    getloginres:'',

  },

  clickperch: function() {
    this.setData({
      ishowmeichai: !this.data.ishowmeichai,
    })
  },

  openbox: function() {
    var _this = this
    _this.setData({
      isawardBox: !_this.data.isawardBox,
    })
  },

  closeCoupon: function() {
    var _this = this
    _this.setData({
      newcoupon: false,
    })
  },

  myCatchTouch: function() {
    return;
  },

  giftclick: function() {
    app.showToastC("砍至￥0，奖励翻倍！")
  },

  gosignin: function() {
    this.dialogClick();
    wx.navigateTo({ //签到
      url: "/page/component/pages/newsignin/newsignin"
    });
  },

  goDetail: function() {
    var _this = this
    _this.setData({
      newcoupon: false,
    })
    wx.navigateTo({
      url: "../../../../pages/detailspage/detailspage?gid=" + _this.data.goods_id,
    })
  },

  gobarDetail: function(w) {
    var _this = this
    var id = w.currentTarget.dataset.id || w.target.dataset.id;
    if (_this.data.goodsInfo.user_orderSn != '' && _this.data.goodsInfo.user_orderSn != null) {
      wx.navigateTo({
        url: "../bargainDetail/bargainDetail?goods_id=" + id,
      })
    } else {
      wx.navigateTo({
        url: "../bargainList/bargainList",
      })
    }

  },

  toDetail: function(w) {
    var _this = this
    var id = w.currentTarget.dataset.id || w.target.dataset.id;
    var ishare = w.currentTarget.dataset.ishare || w.target.dataset.ishare;
    wx.navigateTo({
      url: "../bargainDetail/bargainDetail?goods_id=" + id + "&ishare=" + ishare,
    })
  },

  gojigsaw: function() {
    wx.reLaunch({
      url: "../../../../pages/index/index",
    })
  },

  golist: function() {
    wx.navigateTo({
      url: "../bargainList/bargainList",
    })
  },

  refuse: function() {
    var _this = this
    _this.setData({
      ishowaffirm: false,
      newcoupon: true,
    })
  },

  help: function() {
    var _this = this
    _this.setData({
      ishowhelp: true,
      ishowaffirm: false,
    })
    _this.getjigsawinfo(2);
  },

  closehelp: function() {
    var _this = this
    _this.setData({
      ishowhelp: false,
      newcoupon: true,
    })
  },

  dialogClick: function() {
    var _this = this
    _this.setData({
      ishowshareone: false,
      ishowbuycd: false,
      ishowaddress: false,
      ishowhelp: false,
      ishowcreate: false,
      ishowsign: false,
      ishowaffirm: false,
    })
  },

  conbargain: function() {
    var _this = this
    _this.setData({
      ishowbuycd: false,
      ishowshareone: true,
    })
  },

  mybuy: function() {
    var _this = this

    _this.outright()
  },

  outright: function() {
    var _this = this
    _this.setData({
      ishowbuycd: false,
      ishowaddress: true,
    })
  },

  getbargain: function() {
    var _this = this
    _this.setData({
      ishowaddress: true,
    })
  },

  getaward: function() {
    var _this = this

    if (this.data.name == '') {
      app.showToastC('姓名不能为空');
      return false;
    }
    //判断是手机号
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (this.data.tele.length == 0) {
      app.showToastC('输入的手机号为空')
      return false;
    } else if (this.data.tele.length < 11) {
      app.showToastC('手机号长度有误！')
      return false;
    } else if (!myreg.test(this.data.tele)) {
      app.showToastC('手机号有误！')
      return false;
    } else {}
    if (this.data.province.replace(/\s+/g, '') == '') {
      app.showToastC('地区不能为空');
      return false;
    }
    if (this.data.city.replace(/\s+/g, '') == '') {
      app.showToastC('地区不能为空');
      return false;
    }
    if (this.data.county.replace(/\s+/g, '') == '') {
      app.showToastC('地区不能为空');
      return false;
    }
    if (this.data.address == '') {
      app.showToastC('地址不能为空');
      return false;
    }
    if (this.data.address.length > 50) {
      app.showToastC('地址不能超过50个字');
      return false;
    }
    // //判断身份证号
    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    if (this.data.goodsInfo.retailer == 1 && this.data.card == '') {
      app.showToastC('身份证号不能为空');
      return false;
    } else if (this.data.goodsInfo.retailer == 1 && !regIdCard.test(this.data.card)) {
      app.showToastC('身份证号不正确');
      return false;
    } else {};

    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.signindata.clwcomurl + 'receivejigsaw',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        source: 4,
        vcode: _this.data.version,
        province: _this.data.province,
        city: _this.data.city,
        district: _this.data.county,
        address: _this.data.address,
        consignee: _this.data.name,
        idcard: _this.data.card,
        tel: _this.data.tele,
        order_sn: _this.data.order_sn,
        retailer: _this.data.goodsInfo.retailer,
        through: 1,
        is_bargain: 'bargain',
        ct: '3',
        IsShare: _this.data.ishare,
      },
      complete: function() {},
      fail: function() {},
      success: function(res) {
        wx.hideLoading()
        var payinfo = res.data.Info;
        if (res.data.ReturnCode == 200) {
          if (res.data.Info.pay) {
            wx.requestPayment({
              'timeStamp': String(res.data.Info.pay.timeStamp),
              'nonceStr': String(res.data.Info.pay.nonceStr),
              'package': String(res.data.Info.pay.package),
              'signType': 'MD5',
              'paySign': String(res.data.Info.pay.paySign),
              'success': function(res) {
                _this.setData({
                  ishowaddress: false,
                })
                _this.getjigsawinfo(2);
                app.showToastC('领取成功')

                if (payinfo.isFreeBuyOrder) {
                  wx.navigateTo({
                    url: "../hidefun/hidefun?type=1&cart_id=" + payinfo.cart_id
                  });
                }
                
              },
              'fail': function(res) {},
              'complete': function(res) {
                // 订阅授权               
              }
            })
          } else {
            _this.setData({
              ishowaddress: false,
            })
            _this.getjigsawinfo(2);
            app.showToastC('领取成功')

            if (payinfo.isFreeBuyOrder) {
              wx.navigateTo({
                url: "../hidefun/hidefun?type=1&cart_id=" + payinfo.cart_id
              });
            }
          }
        } else {
          app.showToastC(res.data.Msg)
        }
      },
    })
  },

  onShow: function() {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
    })
    var options = options || {};
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.data.pushWay = options.pushWay || 0;
    _this.setData({
      uid: app.signindata.uid,
      isShareFun: app.signindata.isShareFun
    });
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      if (scene) {
        _this.data.order_sn = scene;
      };
    } else {
      _this.data.order_sn = options.order_sn || '';
      _this.setData({
        goods_id: options.goods_id || '',
        status: options.status || '',
        ishare: options.ishare || 0,
      });
    };

    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // '已经授权'
          _this.data.loginid = app.signindata.loginid;
          _this.data.openid = app.signindata.openid;
          _this.setData({
            uid: app.signindata.uid,
            isShareFun: app.signindata.isShareFun
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this)
          }
        } else {
          app.userstatistics(20);
          _this.setData({
            tgabox: true
          });
          _this.onLoadfun();
        }
      }
    });


  },
  // 授权点击统计
  clicktga: function() {
    app.clicktga(2)
  },
  userInfoHandler: function(e) {
    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 确认授权用户统计
          app.clicktga(4);
          _this.setData({
            tgabox: false
          });
          // '已经授权'
          _this.data.loginid = app.signindata.loginid,
            _this.data.openid = app.signindata.openid,
            _this.setData({
              uid: app.signindata.uid,
              isShareFun: app.signindata.isShareFun
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
    if (e.detail.userInfo) {} else {
      app.clicktga(8) //用户按了拒绝按钮
    };

  },
  onLoadfun: function() {
    var _this = this;
    _this.data.loginid = app.signindata.loginid,
      _this.data.openid = app.signindata.openid,
      _this.setData({
        uid: app.signindata.uid,
        isShareFun: app.signindata.isShareFun
      });
    this.selectComponent("#hide").getappData()
    _this.getjigsawinfo(1);
    // 统计推送进入
    if (_this.data.pushWay > 0) {
      app.pushfun(_this);
    }

  },

  getaddress: function() {
    //地址
    var that = this;
    tcity.init(that);
    var cityData = that.data.cityData;

    const provinces = [];
    const citys = [];
    const countys = [];


    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }

    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': cityData[0].name,
      'city': cityData[0].sub[0].name,
      'county': cityData[0].sub[0].sub[0].name
    })

    var _this = this
    wx.request({
      url: app.signindata.clwcomurl + 'getaddress',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        source: 4,
        vcode: _this.data.version,
      },
      success: function(res) {
        if (res.data.Info.address.province != "") {
          _this.setData({
            province: res.data.Info.address.province,
          })
        }
        if (res.data.Info.address.city != "") {
          _this.setData({
            city: res.data.Info.address.city,
          })
        }
        if (res.data.Info.address.district != "") {
          _this.setData({
            county: res.data.Info.address.district,
          })
        }
        _this.setData({
          name: res.data.Info.address.consignee,
          tele: res.data.Info.address.tel,
          address: res.data.Info.address.address,
          card: res.data.Info.address.idcard,
        });
      },
    })
  },

  getjigsawinfo: function(num) {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.signindata.clwcomurl + 'getjigsawinfo',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        source: 4,
        vcode: _this.data.version,
        goods_id: _this.data.goods_id,
        order_sn: _this.data.order_sn,
        is_bargain: 'bargain',
        IsShare: _this.data.ishare,
      },
      fail: function() {
        wx.hideLoading()
      },
      success: function(res) {
        wx.stopPullDownRefresh();
        if (res.data.ReturnCode == 200) {
          _this.setData({
            goodsInfo: res.data.Info,
            goods_id: res.data.Info.goods_id,
            ishowclock: true,
            boxbrief: res.data.Info.brief || "",
            boxtips: res.data.Info.tips || "",
            boxtype: res.data.Info.type || 0,
            help_list: res.data.List.help_list,
            ishare: res.data.Info.IsShare,
            activityMD: res.data.Info.activityMD || "",
          })

          _this.data.order_sn = res.data.Info.order_sn;
          _this.data.shareinfo = res.data.Info.share;
          setTimeout(function() {
            var oldnum = 0;
            var newnum = 0;
            for (let i = 0; i < res.data.List.help_list.length; i++) {
              if (res.data.List.help_list[i].is_new_users == "1") {
                newnum++;
              } else {
                oldnum++;
              }
            }
            _this.setData({
              help_list: res.data.List.help_list,
              oldnum: oldnum,
              newnum: newnum,
            })
            if (newnum < 5 && res.data.Info.IsShare == 1) {
              var plist = []
              var m = 5 - newnum
              for (let i = 0; i < m; i++) {
                if (i == m - 1) {
                  plist.push(2)
                } else {
                  plist.push(1)
                }
              }
              var mli = _this.data.help_list.concat(plist);
              _this.setData({
                help_list: mli
              })
            }
          }, 300)
          //助力逻辑
          if (res.data.Info.is_oneself != 1 && res.data.Info.userIsHelp != 1) {

            if (app.signindata.isNewer && res.data.Info.isGainMobile == 1) {
              _this.setData({
                ishowaffirm: true,
                isgetphone: true,
              })
            } else {
              _this.helpuserclick(res.data.Info.order_sn)
            }
          }
          //推送调取开箱接口
          if (res.data.Info.is_oneself == 1 && res.data.Info.is_receiveBoxReward && res.data.Info.is_receiveBoxReward == 1) {
            _this.getAwardBox(1, res.data.Info.arrive_price)
          }

          clearInterval(_this.data.interval)
          clearInterval(_this.data.awardinterval)
          var timestamp = Date.parse(new Date()) / 1000
          if (res.data.Info.end_time < timestamp) {
            _this.setData({ //正常倒计时        
              clock: 0
            });
          } else {
            _this.data.interval = setInterval(function() {
              //将时间传如 调用 
              _this.dateformat(res.data.Info.end_time);
            }.bind(_this), 1000);
          }
          if (res.data.Info.over_time > timestamp) {
            _this.data.awardinterval = setInterval(function() {
              //将时间传如 调用 
              _this.awardformat(res.data.Info.over_time);

            }.bind(_this), 100);
          }
        } else {
          app.showToastC(res.data.Msg)
        }
        if (num == 1) {
          setTimeout(function() {
            _this.getList(1);
            _this.getBroadcast();
          }, 300)
        } else {
          wx.hideLoading()
        }
      },
    })
  },

  getList: function(page) {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.signindata.clwcomurl + 'jigsawlist',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        source: 4,
        vcode: _this.data.version,
        more: 'more',
        page: page,
        is_bargain: 'recommend',
        launch: 'meichai',
      },
      complete: function() {
        wx.hideLoading()
      },
      success: function(res) {
        wx.stopPullDownRefresh();
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          if (page == 1) {
            _this.setData({
              recommend_list: res.data.List,
            })
          } else if (res.data.List.length > 0) {
            var l = _this.data.recommend_list.concat(res.data.List);
            _this.setData({
              recommend_list: l,
            })
          }
        } else {

        }
      },
    })
  },

  orderClick: function() {
    var _this = this

    if (_this.data.goodsInfo.goldcoin_status != 1 && _this.data.goodsInfo.no_deduction == 1) {
      _this.setData({
        ishowsign: true,
      })
      return;
    }

    wx.hideLoading()
    wx.request({
      url: app.signindata.clwcomurl + 'perPay',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        source: 4,
        vcode: _this.data.version,
        address_id: '',
        province: '',
        city: '',
        district: '',
        address: '',
        consignee: '',
        idcard: '',
        tel: '',
        number: '',
        quota: '',
        price: '',
        goods_id: _this.data.goods_id,
        blessing: '',
        sale_type: _this.data.goodsInfo.sale_type,
        is_spelling: "1",
        is_bargain: 'bargain',
        launch: 'meichai',
        IsShare: _this.data.ishare,
      },

      complete: function() {
        wx.hideLoading()
      },
      success: function(res) {
        _this.setData({
          ishowpay: false,
        })
        if (res.data.ReturnCode == 200) {
          _this.setData({
            order_id: res.data.Info.order.order_id,
            // shareinfo: res.data.Info.share,
            ishowshareone: true,
          })
          _this.data.order_sn = res.data.Info.order.orderSn;
          if (res.data.Info.order.amount) {
            _this.getAwardBox(1, res.data.Info.order.amount)
          }
          _this.getjigsawinfo(2);
        } else {
          wx.hideLoading()
          app.showToastC(res.data.Msg)
        }
      },
    })
  },

  getBroadcast: function() {
    var _this = this
    Pub.postRequest(_this, 'broadcast_news', {
      uid: _this.data.uid,
      loginid: _this.data.loginid
    }, function(res) {
      _this.setData({
        news: res.data.List,
      })
      setTimeout(function() {
        _this.getaddress()
      }, 500)
    });
  },

  getAwardBox: function(w, price) {
    var _this = this
    if (_this.data.goodsInfo.user_info.uid == _this.data.uid) {
      var amount
      if (w != 1) {
        amount = w.currentTarget.dataset.amount || w.target.dataset.amount;
      } else {
        amount = price;
      }
      Pub.postRequest(_this, 'receiveboxreward', {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        amount: amount,
        order_sn: _this.data.order_sn
      }, function(res) {
        _this.setData({
          isawardBox: true,
          awardBox: res.data.List,
          boxbrief: res.data.List.brief,
          boxtips: res.data.List.tips,
          boxtype: res.data.List.type,
        })

        clearInterval(_this.data.awardinterval)
        _this.data.awardinterval = setInterval(function() {
          //将时间传如 调用 
          _this.awardformat(res.data.List.over_time);

        }.bind(_this), 100);

        _this.getjigsawinfo(2);
      });
    } else {
      _this.openaward()
    }

  },

  helpOrderclick: function() {
    var _this = this

    if (_this.data.helpInfo.goldcoin_status != 1 && _this.data.goodsInfo.no_deduction != 1) {
      _this.setData({
        ishowhelp: false,
        ishowsign: true,
      })
      return;
    }

    wx.hideLoading()
    wx.request({
      url: app.signindata.clwcomurl + 'perPay',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        source: 4,
        vcode: _this.data.version,
        address_id: '',
        province: '',
        city: '',
        district: '',
        address: '',
        consignee: '',
        idcard: '',
        tel: '',
        number: '',
        quota: '',
        price: '',
        goods_id: _this.data.goods_id,
        blessing: '',
        sale_type: _this.data.goodsInfo.sale_type,
        is_spelling: "1",
        is_bargain: 'bargain',
        launch: 'meichai',
        help_price: _this.data.helpInfo.originator_help,
        help_uid: _this.data.helpInfo.help_uid

      },
      complete: function() {
        wx.hideLoading()
      },
      success: function(res) {
        _this.setData({
          ishowpay: false,
        })
        if (res.data.ReturnCode == 200) {
          _this.setData({
            order_id: res.data.Info.order.order_id,
            ishowhelp: false,
          })
          _this.data.order_sn = res.data.Info.order.orderSn;
          _this.getjigsawinfo(2);

        } else {
          app.showToastC(res.data.Msg)
        }
      },
    })
  },

  helpuserclick: function(order_sn, code, encryptedData, iv) {
    var _this = this
    wx.showLoading({
      title: '加载中...',
    })
    var param
    if (iv) {
      param = {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        source: 4,
        vcode: _this.data.version,
        order_sn: order_sn,
        isNewHelper: app.signindata.isNewer ? 1 : 0,
        mobile: 1,
        code: code,
        encryptedData: encryptedData,
        iv: iv,
      }
    } else {
      param = {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        source: 4,
        vcode: _this.data.version,
        order_sn: order_sn,
        isNewHelper: app.signindata.isNewer ? 1 : 0,
        mobile: 0,
      }
    }

    wx.request({
      url: app.signindata.clwcomurl + 'helpuserclick',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: param,
      complete: function() {
        wx.hideLoading()
      },
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          app.signindata.isNewer = false;
          if (res.data.Info.is_jigsaw != -1) {
            if (iv) {
              _this.setData({
                helpInfo: res.data.Info,
                // isgetphone: false,
                ishowAction: false,
                // ishowhelp: true,
                // newcoupon: true,
              })
              _this.help();
            } else {
              _this.setData({
                helpInfo: res.data.Info,
                ishowaffirm: true,
              })
            }
          } else {
            if (iv) {
              _this.setData({
                helpInfo: res.data.Info,
                // isgetphone: false,
                ishowAction: false,
              })
              _this.refuse();
            } else {
              _this.setData({
                helpInfo: res.data.Info,
              })
            }
          }

          if (res.data.Info.coupon) {
            _this.setData({
              iscoupon: true,
              newcoupondata: res.data.Info.coupon,
            })

          }
        } else {
          app.showToastC(res.data.Msg)
          _this.setData({
            helpInfo: res.data.Info,
            isgetphone: false,
            ishowAction: false,
          })
        }
      },
    })
  },

  createImg: function() {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.signindata.clwcomurl + 'spellingImg',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        source: 4,
        vcode: _this.data.version,
        order_sn: _this.data.order_sn,
      },
      complete: function() {
        wx.hideLoading()
      },
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            createimage: res.data.Info.path,
            ishowcreate: true,
          })
        } else {
          app.showToastC(res.data.Msg)
        }
      },
    })
  },

  savefun: function() {
    var _this = this;
    wx.downloadFile({
      url: _this.data.createimage,
      success: function(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(data) {
            app.showToastC('保存成功')
            _this.dialogClick()
          },
          fail: function(err) {
            if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              wx.openSetting({
                success(settingdata) {
                  if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                    _this.savefun()
                  } else {}
                }
              })
            }
          },
        })
      }
    })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var _this = this;
    _this.data.page = 1;
    _this.getjigsawinfo(2);
    _this.getList(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var _this = this;
    var p = _this.data.page + 1;
    _this.data.page = p;
    _this.getList(p);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var _this = this
    var share = {
      title: _this.data.shareinfo.title,
      path: 'page/component/pages/bargainDetail/bargainDetail?order_sn=' + _this.data.order_sn + "&ishare=" + _this.data.ishare,
      imageUrl: _this.data.shareinfo.cover,
      success: function(res) {

      }
    }
    return share;
  },

  // input 值改变
  nameChange: function(e) {
    this.setData({
      name: e.detail.value
    });
  },
  teleChange: function(e) {
    this.setData({
      tele: e.detail.value
    });
  },
  addressChange: function(e) {
    this.setData({
      address: e.detail.value
    });
  },
  cardChange: function(e) {
    this.setData({
      card: e.detail.value
    });
  },

  //地址
  bindChange: function(e) {
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;


    if (val[0] != t[0]) {
      const citys = [];
      const countys = [];


      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }


      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })


      return;
    }
    if (val[1] != t[1]) {
      const countys = [];


      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }


      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      this.setData({
        county: this.data.countys[val[2]],
        values: val,
        value: val
      })
      return;
    }

  },
  open: function() {
    this.setData({
      condition: !this.data.condition
    })
  },

  openExplain: function() {
    var _this = this
    this.setData({
      ishowExplain: !_this.data.ishowExplain,
    })
  },

  openaward: function() {
    var _this = this
    this.setData({
      awardpriview: !_this.data.awardpriview,
    })
  },

  onUnload: function() {
    var _this = this
    clearInterval(_this.data.interval)
    clearInterval(_this.data.awardinterval)
  },

  // 时间格式化输出，将时间戳转为 倒计时时间
  dateformat: function(micro_second) {
    var _this = this
    var timestamp = Date.parse(new Date())
    var second = micro_second - (timestamp / 1000);
    if (second > 0) {
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;
      var hr = Math.floor(second / 3600 % 24);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;
      var min = Math.floor(second / 60 % 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;
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
    }

  },

  // 时间格式化输出，将时间戳转为 倒计时时间
  awardformat: function(micro_second) {
    var _this = this
    var timestamp = new Date().getTime();
    var second = micro_second * 1000 - timestamp
    if (second > 0) {
      var min = Math.floor(second / 1000 / 60 % 6000);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;
      var sec = Math.floor(second / 1000 % 60);
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;
      var ms = Math.floor(second % 1000 / 100);
      var mstr = ms.toString();
      if (mstr.length == 1) mstr = '0' + mstr;
      _this.setData({
        awardminStr: minStr,
        awardsecStr: secStr,
        awardmstr: mstr,
      })
    } else {
      _this.setData({
        awardminStr: "00",
        awardsecStr: "00",
        awardmstr: "00",
      })
    }

  },

  getPhoneNumber: function(e) {
    var _this = this
    if (e.detail.errMsg == 'getPhoneNumber: ok' || e.detail.errMsg == "getPhoneNumber:ok") {
      wx.login({
        success: function(res) {
          if (res.code) {
              _this.data.getphoneInfo = e;
              _this.data.getloginres = res;
            if (_this.data.activityMD!=''){
              _this.setData({
                ishowAction:true,
              })
            } else {
              _this.helpuserclick(_this.data.goodsInfo.order_sn, res.code, e.detail.encryptedData, e.detail.iv)
            }
          } else {
          }
        }
      });
    } else {}
  },

  activityMD:function(){
    var _this = this;
    _this.helpuserclick(_this.data.goodsInfo.order_sn, _this.data.getloginres.code, _this.data.getphoneInfo.detail.encryptedData, _this.data.getphoneInfo.detail.iv)
  },

  showPrize: function() {
    var _this = this
    _this.setData({
      isawardBox: !_this.data.isawardBox,
    })
  },

  closeAction: function () {
    this.setData({
      ishowAction: false,
    })
  },

  jumpAction: function (event) {
    var _this = this
    // 跳转活动详情页
    var id = event.currentTarget.dataset.id || event.target.dataset.id;
    wx.navigateTo({
      url: "/pages/activitydetailspage/activitydetailspage?id=" + id + "&islimittery=1",
      complete: function () {
        _this.setData({
          ishowAction: false
        });
      }
    });
  },


})