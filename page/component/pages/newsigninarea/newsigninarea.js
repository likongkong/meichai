var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
var time = require('../../../../utils/util.js');

var WxParse = require('../../../../wxParse/wxParse.js');

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 接口地址
    comurl: app.signindata.comurl,
    // 图片地址
    zdyurl: Dec.zdyurl(),
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,
    spreadEntry: app.signindata.spreadEntry,
    appNowTime: Date.parse(new Date()),
    isStore: app.signindata.isStore,
    isProduce: app.signindata.isProduce,
    // 适配苹果X 
    isIphoneX: app.signindata.isIphoneX,
    // 是否显示杂货铺
    grocerystoreiftr: app.signindata.grocerystoreiftr || 'off',
    tgabox: false,
    // tab 数据
    scrdata: [],
    scrolllefthq: 0,
    scrollleft: 1,
    scrollwidth: 0,
    scrollwidthiftr: true,
    category_id: -1,
    // 商品数据
    listdata: [],
    nodataiftr: false,
    page: 0,
    // 加载提示
    loadprompt: '加载更多.....',
    clicktherequestiftr: true,
    headhidden: true,
    cart_id: 0,
    timer: '',
    shopnum: 0,
    defaultinformation: app.signindata.defaultinformation,
    dryinglistnum: 0,
    awatxt: '',
    inputdata: '',
    SHOW_TOP_CLTIP: false,

    c_title: '',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),

    ishowCart: false,
    cartlist: [],
    order_id: 0,
    relGidTips: '',
    awardInfo: '',
    upMongolia: false,
    goodsDiscount: 0,
    isFinished: false,
    totalMoney: 0,
    mAmount: 0,

    // 一级弹框背景
    tipback: false,
    // 二级背景
    tipbacktwo: false,
    // 订单弹框
    tipbox: false,
    // 判断是否是 原产品还是活动 1原产品 2 活动二 
    judgmentactivity: 1,
    // 拆单数量
    numberofdismantling: 1,
    // 选择弹框
    buybombsimmediately: false,
    // 价格明细显示隐藏
    pricedetailc: true,
    // 协议radio
    radioagreement: true,
    // 收货地址
    receivingaddress: false,
    // 优惠券弹框
    couponprojectile: false,
    // 兑换input值
    coupondata: '',
    // 收货地址数据
    addressdata: [],
    // 收货地址显示 请选择收货地址
    tipaddress: '请选择收货地址',
    tipaid: '',

    // 弹框优惠券 请选择优惠券
    tipcoupon: '请选择优惠券',
    // 颜色id
    colorid: '',
    colorcon: '',
    // 颜色id
    sizeid: '',
    sizecon: '',
    // 运费券
    coudata1: [],
    coudata1cid: '',
    coudata1mon: '0.00',
    // 代金券
    coudata2: [],
    coudata2cid: '',
    coudata2mon: '0.00',
    // 后台返回总价格
    payment: '',
    // 应付金额
    amountpayable: '0.00',
    // 运费
    freight: '￥0.00',
    // 运费判断关于运费券
    freightiftr: '0.00',
    // 商品价格
    commodityprice: 0,
    // 税费
    taxation: '0.00',
    // 订单id
    cart_id: '',
    // 支付完成赠送卷
    paycheadwsong: '',
    // 是否支付成功
    payiftr: false,
    // 支付成功分享的图片地址
    paycheadwsongimg: '',
    // 组合弹框
    combinationt: false,
    combdataimg: {},
    // 组合判断按钮是否可点击（商品是否全部选中）
    combaddpay: true,
    // 组合购物车
    combdsbframeiftrselcs: false,
    // 组合立即购买
    combdsbframeiftr: false,
    // 组合显示税总和
    combtaxation: '0.00',
    // 判断是否是 原产品还是活动 1原产品 2 活动二 
    judgmentactivity: 1,
    // 滚动条的高度
    scrollHeight: 0,
    // 购物车判断是否显示下拉提示图片
    addcatlimg: 0,
    // 提交支付蒙层
    suboformola: false,
    // 买家备注
    desc: '',
    // 满减优惠券的使用判断
    commoditypriceiftr: 0,
    // 购买显示商品数量
    quantityofgoods: '',
    //  预览图数据
    imgArr: [],
    // 预加载商品详情
    iftrdetail: true,
    // 身份证号弹框判断
    idnumberboxiftr: false,
    // 真实姓名
    inputnamedata: '',
    // 身份证号
    inputidnumberdata: '',
    // 浏览任务判断
    browsetaskiftr: true,
    // 微信号码
    wxnum: 'meichai666666',
    // 浏览奖励提示框
    winshopawiftr: false,
    winshopawnum: 0,
    // 支付完成显示分类跳转数据
    shareinfo: '',
    windowHeight: app.signindata.windowHeight,
    jumptime: true,
    searchorwhole: true,
    // 是否显示弹框
    ishelladdtoy: false,
    tippurchase: 0,
    bottomdetail: false,
    bottomlimitNum: '',
    bottomgoods_id: '',
    bottomstock: '',

    signtype: 0,
    activity_id: 0,

  },
  bottomdetailnone: function() {
    this.setData({
      bottomdetail: false
    });
  },
  topcabinetordelgoods: function(w) {
    var num = w.currentTarget.dataset.num || w.target.dataset.num || 0;
    this.setData({
      ishelladdtoy: false
    });
    this.getCartInfo();
  },
  wholefun: function() {
    this.setData({
      inputdata: ''
    })
    // 获取list数据
    this.listdata(0);
  },
  // input 值改变
  inputChange: function(e) {
    this.setData({
      inputdata: e.detail.value
    });
  },

  // 加入购物车
  addtocart: function(w) {
    var _this = this;
    var stock = w.currentTarget.dataset.stock || w.target.dataset.stock;
    if (stock == 0) {
      app.showToastC('该商品库存不足');
      return;
    }
    if (_this.data.clicktherequestiftr) {
      _this.setData({
        clicktherequestiftr: false
      });

      var gid = w.currentTarget.dataset.gid || w.target.dataset.gid;
      var limitnum = w.currentTarget.dataset.limitnum || w.target.dataset.limitnum || 1;
      var adtocar = [{
        'goods_id': gid,
        'color_id': 0,
        'size_id': 0,
        'count': limitnum
      }];

      var adtocarleng = adtocar.length;
      adtocar = JSON.stringify(adtocar);

      var qformid = Dec.Aese('mod=cart&operation=add&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&gcount=' + adtocarleng + '&ginfo=' + adtocar + '&order_id=' + _this.data.signtype);
      wx.request({
        url: app.signindata.comurl + 'goods.php' + qformid,
        method: 'GET',
        header: {
          'Accept': 'application/json'
        },
        success: function(res) {
          _this.setData({
            clicktherequestiftr: true,
            bottomdetail: false
          });
          if (res.data.ReturnCode == 200) {
            app.showToastC('已成功加入购物车');
            // 购物车数量显示
            Dec.shopnum(_this,app.signindata.comurl);
            setTimeout(function() {
              _this.getCartInfo()
            }, 1500);

          } else if (res.data.ReturnCode == 802) {
            wx.navigateTo({ // 商品详情页
              url: "/pages/detailspage/detailspage?gid=" + gid + '&limitnum=' + limitnum + '&awa=1'
            });
          } else if (res.data.ReturnCode == 805) {
            app.showToastC('库存不足');
          } else if (res.data.ReturnCode == 201) {
            app.showToastC('添加失败');
          } else if (res.data.ReturnCode == 302) {
            app.showToastC('无效信息');
          } else {
            app.showToastC(res.data.Msg);
          };
        },
        fail: function() {}
      });
    };

  },

  // tab切换
  tabbotdata: function(w) {
    var _this = this;
    var category_id = w.currentTarget.dataset.category_id || w.target.dataset.category_id || 0;
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type || 0;
    _this.setData({
      category_id: category_id,
      item_type: item_type,
      inputdata: '',
    });
    this.listdata(0);
    var _this = this;
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#q' + category_id).boundingClientRect();
    query.exec(function(res) {
      if (res && res[0]) {
        if (res[0].width) {
          _this.setData({
            scrollleft: w.currentTarget.offsetLeft - wx.getSystemInfoSync().windowWidth / 2 + (res[0].width / 2)
          });
        };
      }
    });
  },
  // 搜索
  jumpsoousuo: function() {
    this.listdata(0);
  },
  //  获取滚动条位置
  scrollleftf: function(event) {
    this.data.scrolllefthq = event.detail.scrollLeft;
    this.data.scrollwidth = event.detail.scrollwidth;
  },
  // 商品详情
  addressmanagement: function(event) {
    // 统计商品点击量
    var _this = this;
    var iftrnum = event.currentTarget.dataset.iftrnum || event.target.dataset.iftrnum || 1;
    if (iftrnum == 1) {
      var listdata = _this.data.listdata || [];
      var othershop = [];
      var indexpar = event.currentTarget.dataset.indexpar || event.target.dataset.indexpar || 0;
      var gid = event.currentTarget.dataset.gid || event.target.dataset.gid;
      var limitnum = event.currentTarget.dataset.limitnum || event.target.dataset.limitnum || 1;
      if (listdata[indexpar]) {
        var listgoods = listdata[indexpar] || [];
        WxParse.wxParse('article', 'html', listdata[indexpar].goods_desc, _this, 0);

        _this.setData({
          bottomdetail: true,
          bottomlimitNum: listdata[indexpar].limitNum,
          bottomgoods_id: listdata[indexpar].goods_id,
          bottomstock: listdata[indexpar].stock,
        });
      };
    };

  },


  listdata: function(num) {
    var _this = this;
    if (num == 0) {
      _this.data.page = 0;
      _this.setData({
        loadprompt: '加载更多.....',
        headhidden: false,
        listdata: [],
        nodataiftr: false
      });
    } else {
      var pagenum = parseInt(_this.data.page)
      _this.data.page = ++pagenum;
      _this.setData({
        loadprompt: '加载更多.....',
        headhidden: false,
        nodataiftr: false
      });
    };
 
    var q = Dec.Aese('mod=info&operation=getgoods&category_id=' + _this.data.category_id + '&type=2&page=' + _this.data.page + '&goods_name=' + _this.data.inputdata + "&uid=" + _this.data.uid + "&loginid=" + _this.data.loginid);
    wx.request({
      url: app.signindata.comurl + 'zone.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        if (res.data.ReturnCode == 200) {
          var listdata = res.data.List.goods || [];
          if (listdata && listdata.length != 0) {
            for (var i = 0; i < listdata.length; i++) {
              if (!app.signindata.reg.test(listdata[i].goods_cover)) {
                listdata[i].goods_cover = _this.data.zdyurl + listdata[i].goods_cover;
              };
            };
            if (num == 0) {
              _this.setData({
                listdata: listdata
              });
            } else {
              var ltlist = _this.data.listdata.concat(listdata);
              _this.setData({
                listdata: ltlist
              });
            };
          } else {
            if (num == 0) {
              _this.setData({
                listdata: []
              });
            };
            app.showToastC('没有更多数据了');
            _this.setData({
              loadprompt: '没有更多数据了'
            });
          }
        };
        if (_this.data.inputdata == '') {
          _this.setData({
            nodataiftr: true,
            headhidden: true,
            searchorwhole: true
          });
        } else {
          _this.setData({
            nodataiftr: true,
            headhidden: true,
            searchorwhole: false
          });
        };
      },
      fail: function() {}
    });
  },
  wholefun: function() {
    this.setData({
      inputdata: ''
    })
    // 获取list数据
    this.listdata(0);
  },
  // 分类数据
  tablist: function() {
    var _this = this;
    var q = Dec.Aese('mod=info&operation=catebase&type=2&cart_id=' + _this.data.cart_id);

    wx.request({
      url: app.signindata.comurl + 'zone.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          var scrdata = res.data.List.category || [];
          if (scrdata && scrdata[0]) {
            var category_id = scrdata[0].category_id || -1;
            _this.setData({
              category_id: category_id
            });
            // 获取list数据
            _this.listdata(0);
          };
          _this.setData({
            scrdata: scrdata,
          });
          _this.getCartInfo();

        }
      },
      fail: function() {}
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoadfun: function() {
    var _this = this;
    var title = "";
    if (_this.data.signtype == "3") {
      title = '抽签专区';
    } else {
      title = '签到专区';
    }
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      spreadEntry: app.signindata.spreadEntry,
      grocerystoreiftr: app.signindata.grocerystoreiftr || 'off',
      isStore: app.signindata.isStore,
      isProduce: app.signindata.isProduce,
      c_title: title,
    });


    // 获取默认信息
    var qqq = Dec.Aese('operation=info&mod=info');
    wx.request({
      url: app.signindata.comurl + 'general.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            defaultinformation: res.data.Info,
            wxnum: res.data.Info.cs.wxid || 'meichai666666',
          });
          _this.tablist();
        };
      }
    });
    _this.getdefultInfo();
    _this.nextpagediao();
  },

  getdefultInfo: function() {
    var _this = this
    // 购物车数量显示
    Dec.shopnum(_this,app.signindata.comurl);
    // 调取晒单数量
    Dec.dryingSum(_this, app.signindata.clwcomurl);
  },

  onLoad: function(options) {
    // 购物车数据显示
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      spreadEntry: app.signindata.spreadEntry,
      grocerystoreiftr: app.signindata.grocerystoreiftr || 'off',
      cart_id: options.cart_id || 0,
      signtype: options.type || 0,
      activity_id: options.activity_id || 0,
    });

    this.awatipscliffun();
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
            spreadEntry: app.signindata.spreadEntry,
            grocerystoreiftr: app.signindata.grocerystoreiftr || 'off',
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this)
          }
        } else {
          // 跳转获取权限页面
          _this.setData({
            tgabox: true
          });
        }
      }
    });

  },

  awatipscliffun: function() {
    var _this = this;
    _this.setData({
      SHOW_TOP_CLTIP: true
    });
    setTimeout(() => {
      _this.setData({
        SHOW_TOP_CLTIP: false
      });
    }, 5000);
  },

  // 授权
  clicktga: function() {
    app.clicktga(2)
  },

  // 点击登录获取权限
  userInfoHandler: function(e) {
    var _this = this;
    if (e.detail.userInfo) {} else {
      app.clicktga()
    };
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          _this.setData({
            tgabox: false
          });
          _this.activsign();
          // 确认授权用户统计
          app.clicktga()
        };
      }
    });
  },

  activsign: function() {
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
            grocerystoreiftr: app.signindata.grocerystoreiftr || 'off',
            avatarUrl: app.signindata.avatarUrl,
            isShareFun: app.signindata.isShareFun
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this);
          }
        } else {
          wx.getUserInfo({
            success: res => {
              // 判断是否登录
              if (_this.data.loginid != '' && _this.data.uid != '') {
                _this.onLoadfun();
              } else {
                app.signin(_this);
              }
            },
            fail: res => {
              // '没有授权 统计'
              app.userstatistics(7);
              // '没有授权'
              _this.setData({
                tgabox: true
              });
            }
          });
        }
      }
    });
  },

  onShow: function() {},

  onHide: function() {
    clearInterval(this.data.timer);
  },

  onUnload: function() {
    clearInterval(this.data.timer);
  },
  // 下拉
  onPullDownRefresh: function() {
    this.listdata(0);
  },

  onReachBottom: function() {
    this.listdata(1);
  },

  onShareAppMessage: function() {
    var reshare = Dec.sharemc();
    return reshare
  },


  // 导航跳转 
  wnews: function() {
    var _this = this
    setTimeout(function() {
      app.limitlottery(_this);
    }, 100);
  },

  // 导航跳转
  whomepage: function() {
    setTimeout(function() {
      wx.reLaunch({
        url: "../../../../pages/index/index?judgeprof=2"
      })
    }, 40);
  },

  wmy: function() {
    setTimeout(function() {
      wx.reLaunch({
        url: "../../../../pages/wode/wode"
      });
    }, 40);
  },

  wshoppingCart: function() {
    setTimeout(function() {
      wx.reLaunch({
        url: "../../../../pages/shoppingCart/shoppingCart"
      });
    }, 100);
  },

  dlfindfun: function() {
    setTimeout(function() {
      wx.reLaunch({
        url: "/page/component/pages/dlfind/dlfind",
      })
    }, 100);
  },


  jumpaction: function(w) {
    var path = w.currentTarget.dataset.path || w.target.dataset.path || '';
    wx.navigateTo({
      url: path
    });
  },

  showCart: function() {
    var _this = this
    this.setData({
      ishowCart: !_this.data.ishowCart
    })
  },

  getCartInfo: function() {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var qqq = Dec.Aese('mod=info&operation=cartgoods&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&order_id=' + _this.data.signtype);
    wx.request({
      url: app.signindata.comurl + 'zone.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          var rdw = res.data.List.cart || [];

          if (rdw) {
            if (rdw.length != 0) {
              for (var i = 0; i < rdw.length; i++) {
                rdw[i].numberofdismantling = rdw[i].count;
                rdw[i].gid = rdw[i].goods_id;
                rdw[i].gsale = parseFloat(rdw[i].gsale).toFixed(2);

                if (rdw[i].count > rdw[i].stock) {
                  rdw[i].iftrcheck = false;
                } else {
                  rdw[i].iftrcheck = true;
                };
              };
            }
          };

          _this.setData({
            zunmdata: rdw,
          });

          // 计算总金额 
          _this.totalMoneyEvent();

        };
      }
    });
  },

  /** 
   * 增加数量触发函数
   */
  addEvent: function(target) {
    var _this = this;
    var index = target.currentTarget.dataset.add || target.target.dataset.add || 0;
    var stock = parseFloat(this.data.zunmdata[index].stock) || 1;
    if ((parseFloat(this.data.zunmdata[index].numberofdismantling) + 1) > stock) {
      app.showToastC('商品库存不足');
      return false;
    };
    this.data.zunmdata[index].numberofdismantling = parseFloat(this.data.zunmdata[index].numberofdismantling) + 1;
    if (this.data.zunmdata[index].numberofdismantling > 1) {
      this.data.zunmdata[index].color = "#000";
    };
    var groupData = _this.data.zunmdata[index].groupData;
    if (groupData) {
      if (groupData.goodsList.length == 1) {
        if (groupData.goodsList[0].goods_id == this.data.zunmdata[index].goods_id) {
          if (groupData.goodsList[0].num <= this.data.zunmdata[index].numberofdismantling) {
            _this.data.zunmdata[index].groupData.goodsList = [];
          };
        };
      };
    };

    var shopnum = parseFloat(_this.data.shopnum) + 1;

    this.setData({
      zunmdata: this.data.zunmdata,
    })

    //  每隔一段时间提交数据
    _this.jumpaddupdata();
    _this.setData({
      shopnum: shopnum
    });
  },

  reduceEvent: function(target) {
    var _this = this;
    var index = target.currentTarget.dataset.reduce || target.target.dataset.reduce || 0;
    if (this.data.zunmdata[index].numberofdismantling <= 1) {
      this.data.zunmdata[index].color = "#a8a8a8";
      this.setData({
        zunmdata: this.data.zunmdata
      })
      return false;
    };
    this.data.zunmdata[index].numberofdismantling = this.data.zunmdata[index].numberofdismantling - 1;
    this.data.zunmdata[index].iftrcheck = true;
    var shopnum = parseFloat(_this.data.shopnum) - 1;


    this.setData({
      zunmdata: this.data.zunmdata,
    });
    //  每隔一段时间提交数据
    _this.jumpaddupdata();
    _this.setData({
      shopnum: shopnum
    });
  },

  // 全选金额计算 
  totalMoneyEvent: function() {
    var _this = this;
    let zunmdata = this.data.zunmdata;
    let len = zunmdata.length;
    let taxation = 0;
    let totalMoney = 0;
    var mcnum = 0;
    for (let i = 0; i < len; i++) {
      totalMoney += parseFloat(zunmdata[i].gsale) * parseFloat(zunmdata[i].numberofdismantling);
      if (zunmdata[i].is_tax == 1) {
        taxation += parseFloat(zunmdata[i].tax || 0) * parseFloat(zunmdata[i].numberofdismantling);
      };

      mcnum += parseInt(zunmdata[i].numberofdismantling);
    };

    this.setData({
      totalMoney: totalMoney.toFixed(2),
      taxation: taxation.toFixed(2),
      mAmount: mcnum,
    });
  },

  // 监听页面跳转提交数据
  jumpaddupdata: function() {
    var _this = this;
    var combarr = _this.data.zunmdata || [];
    var adtocar = [];
    if (combarr.length != 0) {
      for (var i = 0; i < combarr.length; i++) {
        if (true) {
          adtocar.push({
            'cart_id': combarr[i].cart_id,
            'count': combarr[i].numberofdismantling,
            'selected': 1,
            'store_id': combarr[i].store_id
          })
        }
      };
    };
    var adtocarleng = adtocar.length;
    adtocar = JSON.stringify(adtocar);
    var qformid = Dec.Aese('mod=cart&operation=adjustforbatch&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&count=' + adtocarleng + '&info=' + adtocar);
    _this.setData({
      upMongolia: true
    });
    wx.request({
      url: app.signindata.comurl + 'goods.php' + qformid,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        _this.setData({
          upMongolia: false
        });
        _this.getCartInfo();
      },
      fail: function() {}
    });
  },

  /**
   * 删除某个数据触发函数
   */
  deleteData: function(currentTarget) {
    var _this = this;
    var index = currentTarget.currentTarget.dataset.index || currentTarget.target.dataset.index;
    var cart_id = currentTarget.currentTarget.dataset.cart_id || currentTarget.target.dataset.cart_id;
    var store_id = currentTarget.currentTarget.dataset.store_id || currentTarget.target.dataset.store_id;
    var qformid = Dec.Aese('mod=cart&operation=del&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&count=1' + '&cart_id=' + cart_id + '&store_id=' + store_id);
    _this.setData({
      upMongolia: true
    });
    wx.request({
      url: app.signindata.comurl + 'goods.php' + qformid,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          app.showToastC('删除成功');
          _this.data.zunmdata.splice(index, 1);
          _this.setData({
            zunmdata: _this.data.zunmdata
          })
          _this.getCartInfo();
          // 购物车数据显示
          Dec.shopnum(_this,app.signindata.comurl);
        } else if (res.data.ReturnCode == 825) {
          app.showToastC('用户id和购物车信息id不匹配');
        } else if (res.data.ReturnCode == 826) {
          app.showToastC('cart_id个数和count不匹配');
        } else if (res.data.ReturnCode == 900) {
          app.showToastC('登陆状态有误');
        };
        _this.setData({
          upMongolia: false
        });
      },
      fail: function() {}
    });

  },

  // 调取收货地址
  nextpagediao: function() {
    var _this = this;
    //  调取收货地址
    var q = Dec.Aese('mod=address&operation=getlist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'user.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
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
  dsbbbutclickt: function() {
    var _this = this;
    var zunmdata = _this.data.zunmdata || [];
    if (_this.data.ishowCart) {
      if (zunmdata.length == 0) {
        if (_this.data.tippurchase == 0) {
          wx.showModal({
            title: '提示',
            content: '任意购买满' + _this.data.defaultinformation.carriage.free + '元包邮,确认支付' + _this.data.defaultinformation.carriage.d + '元运费领奖吗？太浪费了！',
            showCancel: false,
            confirmText: _this.data.defaultinformation.carriage.free + "元包邮",
            confirmColor: "#e43d40",
            success: function(sm) {
              if (sm.confirm) {
                _this.setData({
                  ishowCart: false
                });
              }
            }
          })
          _this.data.tippurchase = 1
        } else {
          wx.showModal({
            title: '提示',
            content: '任意购买满' + _this.data.defaultinformation.carriage.free + '元包邮,确认支付' + _this.data.defaultinformation.carriage.d + '元运费领奖吗？太浪费了！',
            cancelText: _this.data.defaultinformation.carriage.d + "元运费",
            cancelColor: "#333333",
            confirmText: _this.data.defaultinformation.carriage.free + "元包邮",
            confirmColor: "#e43d40",
            success: function(sm) {
              if (sm.confirm) {
                _this.setData({
                  ishowCart: false
                });
              } else if (sm.cancel) {
                _this.setData({
                  tipbacktwo: true,
                  buybombsimmediately: true,
                  awardpresentation: false,
                });
                _this.amountcalculation();
                // 调取优惠券
                _this.comcouponprfun();
              }
            }
          })
        }

      } else {
        _this.setData({
          tipbacktwo: true,
          buybombsimmediately: true,
          awardpresentation: false,
        });
        _this.amountcalculation();
        // 调取优惠券
        _this.comcouponprfun();
      };
    } else {
      _this.setData({
        ishowCart: !_this.data.ishowCart
      })
    }

  },
  // 发票提示
  invoicefun: function() {
    app.showToastC('发票请联系客服');
  },
  // 协议radio
  radioagreement: function() {
    this.setData({
      radioagreement: !this.data.radioagreement
    });
  },
  // 编辑地址
  jumpeditaddress: function(event) {
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
  jumpaddress: function() {
    wx.navigateTo({
      url: "/pages/newreceivingaddress/newreceivingaddress"
    })
  },
  // 阻止蒙层冒泡
  preventD() {},
  // 拆单弹框隐藏点击事件
  tipdel: function() {
    this.setData({
      tipback: false,
      tipbox: false,
    })
  },
  // 隐藏直接购买弹框
  dsbffun: function() {
    this.setData({
      tipback: false,
    })
  },

  pricedetailc: function() { // 价格明细显示隐藏
    this.setData({
      pricedetailc: !this.data.pricedetailc
    })
  },

  // 优惠券
  comcouponprfun: function() {
    var _this = this;
    // 优惠券
    var q = Dec.Aese('mod=coupon&operation=getlist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'user.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        var screeningavailable1 = [];
        var screeningavailable2 = [];
        // 不可用优惠券
        var unavailablearr = [];
        if (res.data.ReturnCode == 200) {
          var redali = res.data.List;
          if (redali && redali.length != 0) {
            var comzund = _this.data.zunmdata;
            // 运费卷
            var comarrcarriage = [];
            // 选中商品个数
            var selectionnum = 0;
            for (var i = 0; i < comzund.length; i++) {
              if (comzund[i].iftrcheck) {
                selectionnum += 1;
                if (comzund[i].coupon.carriage) {
                  comarrcarriage = comarrcarriage.concat(comzund[i].coupon.carriage);
                };
              };
            };
            comarrcarriage = _this.unique(comarrcarriage);
            if (redali && redali.length != 0) {
              for (var r = 0; r < redali.length; r++) {
                redali[r].gettime = time.formatTimeTwo(redali[r].gettime, 'Y/M/D h:m:s');
                redali[r].overtime = time.formatTimeTwo(redali[r].overtime, 'Y/M/D h:m:s');
              };
            };
            for (var t = 0; t < comarrcarriage.length; t++) {
              var compric = 0;
              for (var y = 0; y < comzund.length; y++) {
                if (comzund[y].iftrcheck) {
                  if (comzund[y].coupon.carriage.indexOf(comarrcarriage[t]) != -1) {
                    compric += parseFloat(comzund[y].gsale).toFixed(2) * parseFloat(comzund[y].numberofdismantling).toFixed(2);
                  };
                };
              };
              for (var u = 0; u < redali.length; u++) {
                if (redali[u].status == 0) {
                  if (redali[u].type == comarrcarriage[t]) {
                    if (parseFloat(redali[u].condition) <= compric) {
                      redali[u].imgcheck = false;
                      screeningavailable1.push(redali[u]);
                    } else {
                      unavailablearr.push(redali[u]);
                    };
                  } else {
                    unavailablearr.push(redali[u]);
                  };
                } else {
                  unavailablearr.push(redali[u]);
                };
              };
            };
            // 优惠券
            var comarrvoucher = [];
            for (var e = 0; e < comzund.length; e++) {
              if (comzund[e].iftrcheck) {
                if (comzund[e].coupon.voucher) {
                  comarrvoucher = comarrvoucher.concat(comzund[e].coupon.voucher);
                };
              };
            };
            comarrvoucher = _this.unique(comarrvoucher);
            for (var p = 0; p < comarrvoucher.length; p++) {
              var compricvou = 0;
              for (var a = 0; a < comzund.length; a++) {
                if (comzund[a].iftrcheck) {
                  if (comzund[a].coupon.voucher.indexOf(comarrvoucher[p]) != -1) {
                    compricvou += parseFloat(comzund[a].gsale).toFixed(2) * parseFloat(comzund[a].numberofdismantling).toFixed(2);
                  };
                };
              };
              for (var b = 0; b < redali.length; b++) {
                if (redali[b].status == 0) {
                  if (redali[b].type == comarrvoucher[p]) {
                    if (parseFloat(redali[b].condition) <= compricvou) {
                      redali[b].imgcheck = false;
                      screeningavailable2.push(redali[b]);
                    } else {
                      unavailablearr.push(redali[b]);
                    };
                  } else {
                    unavailablearr.push(redali[b]);
                  };
                } else {
                  unavailablearr.push(redali[b]);
                };
              };
            };
            // 处理sp优惠券
            var marr = [];
            for (var m = 0; m < redali.length; m++) {
              if (redali[m].isSpecial == 1) {
                var spstr = redali[m].type.toString();
                var s1 = spstr.substring(0, spstr.length - 2);
                redali[m].iftrtype = s1;
                marr.push(redali[m])
              };
            };
            for (var p = 0; p < marr.length; p++) {
              if (comarrvoucher.indexOf(marr[p].iftrtype) != -1) {
                var compricvou = 0;
                for (var a = 0; a < comzund.length; a++) {
                  if (comzund[a].iftrcheck) {
                    if (comzund[a].coupon.voucher.indexOf(comarrvoucher[p]) != -1) {
                      compricvou += parseFloat(comzund[a].gsale).toFixed(2) * parseFloat(comzund[a].numberofdismantling).toFixed(2);
                    };
                  };
                };
                if (parseFloat(marr[p].condition) <= compricvou && selectionnum >= 2) {
                  marr[p].imgcheck = false;
                  screeningavailable2.push(marr[p]);
                };
              }
            };
            unavailablearr = _this.distinct(unavailablearr);
            if (screeningavailable2.length != 0) {
              for (var m = 0; m < unavailablearr.length; m++) {
                for (var n = 0; n < screeningavailable2.length; n++) {
                  if (unavailablearr[m]) {
                    if (unavailablearr[m].cid == screeningavailable2[n].cid) {
                      unavailablearr.splice(m, 1);
                      m--;
                    };
                  };
                };
              };
            };
            if (screeningavailable1.length != 0) {
              for (var m = 0; m < unavailablearr.length; m++) {
                for (var n = 0; n < screeningavailable1.length; n++) {
                  if (unavailablearr[m]) {
                    if (unavailablearr[m].cid == screeningavailable1[n].cid) {
                      unavailablearr.splice(m, 1);
                      m--;
                    };
                  };
                };
              };
            };

          };

          _this.setData({
            coudata1: screeningavailable1,
            coudata2: screeningavailable2,
            unavailablearr: unavailablearr,
            // 清空优惠券信息
            tipcoupon: '请选择优惠券',
            coudata1cid: '',
            coudata1mon: '0.00',
            coudata2cid: '',
            coudata2mon: '0.00',
          });

          // 优惠券
          var checktwo2 = _this.data.coudata2;
          var txt2 = '',
            check2cid = '',
            check2mon = '0.00',
            coupon_type = 1;
          if (checktwo2.length != 0) {

            var coutypeone = [],
              coutypetwo = []; // 1 平常购物券 2 折扣券
            for (var dc = 0; dc < checktwo2.length; dc++) {
              if (checktwo2[dc].coupon_type == 2) {
                coutypetwo.push(checktwo2[dc])
              } else {
                coutypeone.push(checktwo2[dc])
              };
            };
            if (coutypeone.length != 0) {
              coutypeone.sort(_this.compare('value', false));
            };
            if (coutypetwo.length != 0) {
              coutypetwo.sort(function(a, b) {
                var v1 = a['value'];
                var v2 = b['value'];
                return v1 - v2;
              });
            };
            checktwo2 = coutypetwo.concat(coutypeone);

            // checktwo2.sort(_this.compare('value', false));

            if (checktwo2[0].coupon_type == 2) {
              txt2 = checktwo2[0].name + ' ' + checktwo2[0].value + '折';
              check2cid = checktwo2[0].cid;
              check2mon = checktwo2[0].value;
              checktwo2[0].imgcheck = true;
              coupon_type = 2;
            } else {
              txt2 = checktwo2[0].name + checktwo2[0].unit + parseFloat(checktwo2[0].value).toFixed(2);
              check2cid = checktwo2[0].cid;
              check2mon = checktwo2[0].value;
              checktwo2[0].imgcheck = true;
              coupon_type = 1;
            }
          };
          _this.setData({
            coudata2: checktwo2,
            coudata2cid: check2cid,
            coudata2mon: parseFloat(check2mon).toFixed(2),
            coupon_type: coupon_type
          });
          // 计算价格
          _this.amountcalculation();
          // 运费卷
          var checktwo1 = _this.data.coudata1;
          var txt1 = '',
            check1cid = '',
            check1mon = '0.00';
          if (checktwo1.length != 0 && _this.data.freightiftr > 0) {
            checktwo1.sort(_this.compare('value', false));
            txt1 = checktwo1[0].name + checktwo1[0].unit + parseFloat(checktwo1[0].value).toFixed(2);
            check1cid = checktwo1[0].cid;
            check1mon = checktwo1[0].value;
            checktwo1[0].imgcheck = true;
            _this.setData({
              coudata1: checktwo1,
              coudata1cid: check1cid,
              coudata1mon: parseFloat(check1mon).toFixed(2),
            });
          } else {
            if (_this.data.freightiftr == 0) {
              for (var m = 0; m < unavailablearr.length; m++) {
                if (unavailablearr[m] != 'undefined') {
                  if (unavailablearr[m].type == 1) {
                    unavailablearr.splice(m, 1);
                    m--;
                  };
                };
              };
            };

            _this.setData({
              coudata1: [],
              coudata1cid: check1cid,
              unavailablearr: unavailablearr,
              coudata1mon: parseFloat(check1mon).toFixed(2),
            });
          };
          var txt = [];
          if (txt1 != '') {
            txt.push(txt1);
          };
          if (txt2 != '') {
            txt.push(txt2);
          };
          txt = txt.join('\n');
          if (txt1 == '' && txt2 == '') {
            txt = '请选择优惠券'
          };
          _this.setData({
            tipcoupon: txt,
          });
          // 计算价格
          _this.amountcalculation();

        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
      }
    });


  },

  // 数组去重
  unique: function(array) {
    var temp = []; //一个新的临时数组
    for (var i = 0; i < array.length; i++) {
      if (temp.indexOf(array[i]) == -1) {
        temp.push(array[i]);
      }
    }
    return temp;
  },

  //  数组去重
  distinct: function(arr) {
    var arr = arr,
      i, j, len = arr.length;
    for (i = 0; i < len; i++) {
      for (j = i + 1; j < len; j++) {
        if (arr[i].cid == arr[j].cid) {
          arr.splice(j, 1);
          len--;
          j--;
        }
      }
    }
    return arr;
  },

  // 显示优惠券弹框
  couponprofun: function() {
    this.setData({
      couponprojectile: true,
    });
  },

  // 取消隐藏优惠券弹框
  couponprojectilefun: function() {
    var checktwo1 = this.data.coudata1
    for (var i = 0; i < checktwo1.length; i++) {
      if (this.data.coudata1cid == checktwo1[i].cid) {
        checktwo1[i].imgcheck = true;
      } else {
        checktwo1[i].imgcheck = false;
      };
    };
    var checktwo2 = this.data.coudata2;
    for (var i = 0; i < checktwo2.length; i++) {
      if (this.data.coudata2cid == checktwo2[i].cid) {
        checktwo2[i].imgcheck = true;
      } else {
        checktwo2[i].imgcheck = false;
      };
    };
    this.setData({
      coudata1: checktwo1,
      coudata2: checktwo2,
      couponprojectile: false,
    })
  },
  // 确认隐藏优惠券弹框 
  querencouponprojectilefun: function() {
    var checktwo1 = this.data.coudata1;
    var txt1 = '',
      check1cid = '',
      check1mon = '0.00';
    for (var i = 0; i < checktwo1.length; i++) {
      if (checktwo1[i].imgcheck) {
        txt1 = checktwo1[i].name + checktwo1[i].unit + parseFloat(checktwo1[i].value).toFixed(2);
        check1cid = checktwo1[i].cid;
        check1mon = checktwo1[i].value;
      }
    };

    var checktwo2 = this.data.coudata2;
    var txt2 = '',
      check2cid = '',
      check2mon = '0.00',
      coupon_type = 1;
    for (var i = 0; i < checktwo2.length; i++) {
      if (checktwo2[i].imgcheck) {
        if (checktwo2[i].coupon_type == 1) {
          txt2 = checktwo2[i].name + checktwo2[i].unit + parseFloat(checktwo2[i].value).toFixed(2);
          check2cid = checktwo2[i].cid;
          check2mon = checktwo2[i].value;
          coupon_type = checktwo2[i].coupon_type || 1;
        } else {
          txt2 = checktwo2[i].name + '' + checktwo2[i].value + '折';
          check2cid = checktwo2[i].cid;
          check2mon = checktwo2[i].value;
          coupon_type = checktwo2[i].coupon_type || 1;
        }
      }
    };
    var txt = [];
    if (txt1 != '') {
      txt.push(txt1);
    };
    if (txt2 != '') {
      txt.push(txt2);
    };
    txt = txt.join('\n');
    if (txt1 == '' && txt2 == '') {
      txt = '请选择优惠券'
    };
    this.setData({
      tipcoupon: txt,
      // 隐藏弹框
      couponprojectile: false,
      coudata1cid: check1cid,
      coudata1mon: parseFloat(check1mon).toFixed(2),
      coudata2cid: check2cid,
      coudata2mon: parseFloat(check2mon).toFixed(2),
      coupon_type: coupon_type
    });
    // 计算价格
    this.amountcalculation()
  },
  // 隐藏收货地址弹框
  receivingaddressfun: function() {
    this.setData({
      receivingaddress: false,
    })
  },
  // 收货地址弹框
  seladdressfun: function() {
    this.setData({
      receivingaddress: true,
    });
  },
  // 删除地址
  deladdress: function(event) {
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
      success: function(res) {
        if (res.confirm) {
          var q = Dec.Aese('mod=address&operation=delete&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + indid)
          wx.request({
            url: app.signindata.comurl + 'user.php' + q,
            method: 'GET',
            header: {
              'Accept': 'application/json'
            },
            success: function(res) {
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

  // 提交金额计算
  amountcalculation: function() {
    var _this = this;
    var comzund = this.data.zunmdata;
    // 税费
    var txton = 0;
    var compric = 0;
    // 商铺总价格
    var storpric = 0;
    var carriagearr = [];
    var stornum = 0;
    // 美拆商品计数
    var mcnum = 0;
    for (var i = 0; i < comzund.length; i++) {
      if (true) {
        txton += parseFloat(comzund[i].tax || 0).toFixed(2) * parseFloat(comzund[i].numberofdismantling).toFixed(2);
        compric += parseFloat(comzund[i].gsale).toFixed(2) * parseFloat(comzund[i].numberofdismantling).toFixed(2);
        carriagearr.push(comzund[i].carriage || 0);
        if (comzund[i].is_store == 1) {
          stornum += parseInt(comzund[i].numberofdismantling);
          storpric += parseFloat(comzund[i].gsale).toFixed(2) * parseFloat(comzund[i].numberofdismantling).toFixed(2);
        };
        if (comzund[i].is_store == 0) {
          mcnum += parseInt(comzund[i].numberofdismantling);
        };
      };
    };
    compric = compric;
    var compricbj = compric - parseFloat(_this.data.coudata2mon).toFixed(2);
    // 运费
    var max3 = carriagearr.sort().reverse()[0] || _this.data.defaultinformation.carriage.d || 6;

    var acc = 0;
    var freightiftr = '0.00';
    var xianshi = '0.00';
    var storzom = parseFloat(this.data.defaultinformation.carriage.freeForAmount);

    if (this.data.defaultinformation.carriage.free != '-1') {
      var tddefcarfr = parseFloat(_this.data.defaultinformation.carriage.free);
      if (storpric >= storzom) {
        acc = 0;
        freightiftr = 0;
        xianshi = '满￥' + parseFloat(storzom).toFixed(2) + '包邮';
      } else if (stornum >= parseFloat(this.data.defaultinformation.carriage.freeForPieces)) {
        acc = 0;
        freightiftr = 0;
        xianshi = '商品包邮';
      } else if (mcnum >= parseFloat(this.data.defaultinformation.carriage.freeMCPieces)) {
        if (this.data.defaultinformation.carriage.freeMCPieces == 1) {
          acc = 0;
          freightiftr = 0;
          xianshi = '限时包邮';
        } else {
          acc = 0;
          freightiftr = 0;
          xianshi = '商品包邮';
        }

      } else if (compricbj >= tddefcarfr) {
        acc = 0;
        freightiftr = 0;
        xianshi = '满￥' + parseFloat(this.data.defaultinformation.carriage.free).toFixed(2) + '包邮';
      } else {
        var tdzuncar = max3;
        freightiftr = parseFloat(tdzuncar);
        xianshi = '￥' + parseFloat(tdzuncar).toFixed(2);
        acc = parseFloat(tdzuncar) > parseFloat(_this.data.coudata1mon) ? parseFloat(tdzuncar) - parseFloat(_this.data.coudata1mon) : 0;
      };
    } else {
      var tdzuncar = max3;
      xianshi = '￥0.00';
      freightiftr = parseFloat(tdzuncar);
      acc = parseFloat(tdzuncar) > parseFloat(_this.data.coudata1mon) ? parseFloat(tdzuncar) - parseFloat(_this.data.coudata1mon) : 0;
    };

    // 应付金额
    var _this = this;
    if (this.data.coupon_type == 1) {
      var ap = compric - parseFloat(_this.data.coudata2mon) + acc + txton;
    } else {
      var coudata2 = _this.data.coudata2 || [];
      var type = '';
      if (coudata2 && coudata2.length != 0) {
        for (var cou = 0; cou < coudata2.length; cou++) {
          if (coudata2[cou].imgcheck) {
            type = coudata2[cou].type;
          }
        };
      };
      var comnum = 0;
      if (type != '') {
        var comzund = _this.data.zunmdata;
        for (var e = 0; e < comzund.length; e++) {
          if (comzund[e].iftrcheck) {
            if (comzund[e].coupon.voucher) {
              if (comzund[e].coupon.voucher.indexOf(type) > -1) {
                comnum += parseFloat(comzund[e].gsale).toFixed(2) * parseFloat(comzund[e].numberofdismantling).toFixed(2);
              }
            };
          };
        };
      };

      var comnumpre = comnum - (comnum * parseFloat(_this.data.coudata2mon) / 10);
      var ap = compric - comnumpre + acc + txton;
      // var coudata2mondiscount = compric - (compric * (parseFloat(_this.data.coudata2mon) / 10))

      this.setData({
        coudata2mondiscount: comnumpre.toFixed(2) || '0'
      })
    };
    if (ap <= 0) {
      ap = 0;
    };

    this.setData({
      // 应付金额
      amountpayable: ap.toFixed(2),
      // 运费
      //  freight: acc,
      freight: xianshi,
      freightiftr: freightiftr,
      // 商品价格
      commodityprice: compric.toFixed(2),
      // 税费
      taxation: txton.toFixed(2)
    })
  },

  // 二级背景函数
  tipbacktwo: function() {

    this.setData({
      tipbacktwo: false,
      buybombsimmediately: false,
      receivingaddress: false,
      couponprojectile: false,
      tipback: false,
      ishowCart: false
    })

  },

  // 买家备注
  descinputChange: function(e) {
    this.setData({
      desc: e.detail.value
    });
  },


  // 修改收货地址
  revisethereceivingaddress: function(w) {
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

  // 兑换input值
  coupondatafun: function(e) {
    this.setData({
      coupondata: e.detail.value
    })
  },
  // 购物券选中
  checkimg1: function(event) {
    var cid = event.target.dataset.cid || event.currentTarget.dataset.cid;
    var checktwo1 = this.data.coudata1;
    for (var i = 0; i < checktwo1.length; i++) {
      if (checktwo1[i].cid == cid) {
        checktwo1[i].imgcheck = !checktwo1[i].imgcheck;
      } else {
        checktwo1[i].imgcheck = false;
      };
    };
    this.setData({
      coudata1: checktwo1
    })
  },
  checkimg2: function(event) {
    var cid = event.target.dataset.cid || event.currentTarget.dataset.cid;
    var checktwo2 = this.data.coudata2;
    for (var i = 0; i < checktwo2.length; i++) {
      if (checktwo2[i].cid == cid) {
        checktwo2[i].imgcheck = !checktwo2[i].imgcheck;
      } else {
        checktwo2[i].imgcheck = false;
      };
    };
    this.setData({
      coudata2: checktwo2
    })
  },
  // 兑换激活码
  couclicksou: function() {
    var _this = this;
    var coupondata = _this.data.coupondata.replace(/\s*/g, "");
    var q = Dec.Aese('mod=coupon&operation=exchange&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&code=' + coupondata)
    wx.request({
      url: app.signindata.comurl + 'user.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if (res.data.ReturnCode == 906) {
          app.showToastC('激活码错误');
        };

        if (res.data.ReturnCode == 907) {
          app.showToastC('激活码已被使用');
        };

        if (res.data.ReturnCode == 908) {
          app.showToastC('激活码已过期');
        };
        if (res.data.ReturnCode == 200) {
          app.showToastC('兑换成功');
          // 调取优惠券
          this.comcouponprfun();

        };

      },
      fail: function() {}
    })
  },

  // 提交订单
  placeorder: function() {
    var _this = this;

    if (this.data.tipaid == '') {
      app.showToastC('请选择地址');
      return false;
    };

    var zunmdata = _this.data.zunmdata;
    var iftrisabroad = false;
    var isisdefaultdata = false;

    if (zunmdata.length != 0) {
      for (var i = 0; i < zunmdata.length; i++) {
        if (zunmdata[i].iftrcheck) {
          if (zunmdata[i].isabroad == 1) {
            iftrisabroad = true;
          };
        };
      };
    };
    if (iftrisabroad) {
      var isisdefault = _this.data.addressdata;
      if (isisdefault.length != 0) {
        for (var i = 0; i < isisdefault.length; i++) {
          if (isisdefault[i].aid == _this.data.tipaid) {
            if (isisdefault[i].idcard != '' && isisdefault[i].idcard) {
              isisdefaultdata = false;
            } else {
              isisdefaultdata = true;
            };
          };
        };
      };
    };
    if (isisdefaultdata) { //海外购身份证号验证
      _this.setData({
        idnumberboxiftr: !_this.data.idnumberboxiftr
      });
      return false;
    };


    var zunmdata = _this.data.zunmdata;
    var ginfo = [];
    var cart_id = [];
    var iftrgti = true;

    for (var i = 0; i < zunmdata.length; i++) {
      if (zunmdata[i].iftrcheck) {
        if (iftrgti) {
          _this.setData({
            gid: zunmdata[i].gid,
            paycheadwsongimg: zunmdata[i].goods_thumb,
            title: '￥' + zunmdata[i].gsale + "   " + zunmdata[i].pre_name + " " + zunmdata[i].ds + " " + zunmdata[i].gname
          });
          iftrgti = false;
        };
        cart_id.push(zunmdata[i].cart_id);
        if (zunmdata[i].color.no) {
          var color = zunmdata[i].color.no;
        } else {
          var color = 0;
        };
        if (zunmdata[i].size.no) {
          var size = zunmdata[i].size.no;
        } else {
          var size = 0;
        };
        ginfo.push({
          gid: zunmdata[i].gid,
          color: color || 0,
          size: size || 0,
          count: zunmdata[i].numberofdismantling,
          store_id: zunmdata[i].store_id,
          rec_goods_id: zunmdata[i].rec_goods_id || 0,
          rec_cart_id: zunmdata[i].rec_cart_id || 0,
          group_id: zunmdata[i].group_id || 0,
          referee: zunmdata[i].referee || 0
        });
      };
    };
    var gcount = ginfo.length;
    var aid = _this.data.tipaid;
    var cid = [];
    cart_id = cart_id.join();
    if (_this.data.coudata1cid != '') {
      cid.push(_this.data.coudata1cid);
    };
    if (_this.data.coudata2cid != '') {
      cid.push(_this.data.coudata2cid);
    };
    var cid = cid.join();
    ginfo = JSON.stringify(ginfo);

    var q = Dec.Aese('mod=order&operation=carorder&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&gcount=' + gcount + '&aid=' + aid + '&cid=' + cid + '&ginfo=' + ginfo + '&desc=' + _this.data.desc + '&cart_id=' + cart_id + '&orderSource=' + _this.data.signtype + '&activity_id=' + _this.data.activity_id)
    var geturl = 'goods.php' + q;

    wx.request({
      url: app.signindata.comurl + geturl,
      method: 'GET',
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            tipbacktwo: false,
            buybombsimmediately: false,
            receivingaddress: false,
            couponprojectile: false,
            tipback: false,
            payment: res.data.Info.amount,
            cart_id: res.data.Info.cart_id,
            // 优惠券清空
            tipcoupon: '请选择优惠券',
            coudata1cid: '',
            coudata1mon: '0.00',
            coudata2cid: '',
            coudata2mon: '0.00',
            desc: '',
            ishowCart: false,
          });
          // 提交订单支付
          _this.paymentmony();
          var iftrgti = true;
          var comdata = _this.data.zunmdata;
          var comdataw = [];
          for (var i = 0; i < comdata.length; i++) {
            if (!comdata[i].iftrcheck) {
              comdataw.push(comdata[i]);
            };
            if (comdata[i].iftrcheck) {
              if (iftrgti) {
                _this.setData({
                  gid: comdata[i].gid,
                  paycheadwsongimg: comdata[i].goods_thumb,
                  title: '￥' + comdata[i].gsale + "  " + comdata[i].pre_name + " " + comdata[i].ds + " " + comdata[i].gname
                });
                iftrgti = false;
              };
            };
          };
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.Msg,
            showCancel: false,
            success: function (res) { }
          })
        };
      }
    });

  },

  // 点击取消支付页
  paymentboxheadfun: function() {
    var _this = this;
    wx.showModal({
      title: '确定放弃支付吗？',
      content: '个人中心-我的订单-继续支付\n付款成功后，才可以拆单成功',
      success: function(res) {
        if (res.confirm) {
          _this.setData({
            tipback: false,
            tipbox: false,
          })
        }
      }
    })
  },
  // 微信支付
  paymentmony: function() {
    var _this = this;
    var q = Dec.Aese('mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1' + '&oid=' + _this.data.cart_id + '&xcx=1&openid=' + _this.data.openid)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if (res.data.ReturnCode == 200) {

          // 支付完成弹框显示数据
          var shareinfo = res.data.Shareinfo;
          var payinfo = res.data.Info;
          if (shareinfo) {
            for (var f = 0; f < shareinfo.length; f++) {
              if (!app.signindata.reg.test(shareinfo[f].img)) {
                shareinfo[f].img = _this.data.zdyurl + shareinfo[f].img;
              };
              shareinfo[f].name = shareinfo[f].name.replace(/\\n/g, '\n');
            };
            _this.setData({
              shareinfo: shareinfo
            });
          };
          _this.data.subscribedata = res.data.Info.subscribe || '' // 订阅信息
          wx.requestPayment({
            'timeStamp': res.data.Info.timeStamp.toString(),
            'nonceStr': res.data.Info.nonceStr,
            'package': res.data.Info.package,
            'signType': 'MD5',
            'paySign': res.data.Info.paySign,
            'success': function(res) {
              _this.setData({
                gidiftr: _this.data.gid,
                paycheadwsongimgiftr: _this.data.paycheadwsongimg,
                titleiftr: _this.data.title,

                tipback: false,
                tipbox: false,
                buybombsimmediately: false,
                tipbacktwo: false,
                paymentcompletionwiftr: true,
                // 优惠券清空
                tipcoupon: '请选择优惠券',
                coudata1cid: '',
                coudata1mon: '0.00',
                coudata2cid: '',
                coudata2mon: '0.00',
                //  分享判断是否支付成功
                payiftr: true,
                desc: ''
              });
              _this.getCartInfo()
              // 订阅授权
              app.comsubscribe(_this);

              var cart_id = _this.data.cart_id;
              wx.redirectTo({
                url: "/page/component/pages/newsignin/newsignin"
              });
            },
            'fail': function(res) {
              _this.setData({
                tipback: false,
                tipbox: false,
                tipbacktwo: false,
                buybombsimmediately: false,
                // 优惠券清空
                tipcoupon: '请选择优惠券',
                coudata1cid: '',
                coudata1mon: '0.00',
                coudata2cid: '',
                coudata2mon: '0.00',
                //  分享判断是否支付成功
                payiftr: false,
                desc: ''
              })
              _this.getCartInfo()
            },
            'complete': function(res) {}
          });
          // _this.shoppingcartlist(1);
        };
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
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
      }
    })
  },

  // 身份证号弹框取消事件
  idnumbbcenfun: function() {
    this.setData({
      idnumberboxiftr: !this.data.idnumberboxiftr
    })
  },
  // 身份证号弹框确定事件
  idnumbbsubfun: function() {
    var _this = this;
    if (_this.data.inputnamedata == '') {
      app.showToastC('姓名不能为空');
      return false;
    };
    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    if (this.data.inputidnumberdata == '') {
      app.showToastC('身份证号不能为空');
      return false;
    } else if (!regIdCard.test(this.data.inputidnumberdata)) {
      app.showToastC('身份证号格式不正确');
      return false;
    } else {};
    var isisdefault = _this.data.addressdata;
    var isisdefaultdata = '';
    if (isisdefault.length != 0) {
      for (var i = 0; i < isisdefault.length; i++) {
        if (isisdefault[i].aid == _this.data.tipaid) {
          isisdefaultdata = isisdefault[i].isdefault;
        };
      };
    };
    var qformid = Dec.Aese('mod=address&operation=set&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + _this.data.tipaid + '&consignee=' + _this.data.inputnamedata + '&idcard=' + _this.data.inputidnumberdata + '&isdefault=' + isisdefaultdata);
    wx.request({
      url: app.signindata.comurl + 'user.php' + qformid,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          // 调取收货地址
          _this.nextpagediao();
          _this.setData({
            idnumberboxiftr: !_this.data.idnumberboxiftr
          });
        };
        if (res.data.ReturnCode == 900) {
          app.showToastC('登陆状态有误');
        };
        if (res.data.ReturnCode == 901) {
          app.showToastC('身份证号格式不正确');
        };
        if (res.data.ReturnCode == 909) {
          app.showToastC('身份证信息不匹配');
        };
        if (res.data.ReturnCode == 910) {
          app.showToastC('身份信息错误次数过多，请明天再试。');
        };
        if (res.data.ReturnCode == 913) {
          app.showToastC('地址有误');
        };
      },
      fail: function() {}

    });
  },
  // 真实姓名 input 值改变
  inputnameChange: function(e) {
    this.setData({
      inputnamedata: e.detail.value
    });
  },
  // 身份证号
  inputidChange: function(e) {
    this.setData({
      inputidnumberdata: e.detail.value
    });
  },

  // 组合加购物车
  mulshopaddcar: function(w) {

  },

  // 阻止蒙层冒泡
  preventD() {},

  // 根据数组中对象的某一个属性值进行排序
  compare: function(attr, rev) {
    //第二个参数没有传递 默认升序排列
    if (rev == undefined) {
      rev = 1;
    } else {
      rev = (rev) ? 1 : -1;
    }
    return function(a, b) {
      a = parseInt(a[attr]);
      b = parseInt(b[attr]);
      if (a < b) {
        return rev * -1;
      }
      if (a > b) {
        return rev * 1;
      }
      return 0;
    }
  },


})