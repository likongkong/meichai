var Pub = require('../../common/mPublic.js'); //aes加密解密js
var Dec = require('../../../../common/public.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    // 接口地址
    comurl: app.signindata.comurl,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,
    appNowTime: Date.parse(new Date()),
    // 适配苹果X 
    isIphoneX: app.signindata.isIphoneX,
    // 是否显示杂货铺
    grocerystoreiftr: app.signindata.grocerystoreiftr || 'off',  
    isProduce: app.signindata.isProduce,
    // 数据 
    listdata: [],
    headhidden:false,
    shopnum:0,
    dryinglistnum:0,

    c_title: '闲置潮玩',
    c_arrow: true,
    c_backcolor: '#ff2742',
    page:0,
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    iftrnodata:false,
    inputdata: '',
    searchorwhole:true,
    windowHeight: app.signindata.windowHeight - 65 - wx.getStorageSync('statusBarHeightMc') || 0,
    signinlayer: false,
    scrollleft: 1,
    tabselid:0,
    // 字母显示
    letter: [],
    serieslist:{},
    // 最新和热门
    brandseries:{},
    // 最新上架
    brand:false,
    // 热门品牌
    series:false,
    // 最新热门id
    brandid:'',
    brandscroll:[],
    brandlist:[],
    iftrnodatabr:false,
    lettersheight:700,
    ishowdealoradd: false,
    ishowdeal: true,
    ishowadd: false,
    addressdata: [],
    isBlindBoxDefaultAddress: false,
    maddid: '',
    ishowcover: false,
    currentSwiper: 0,
    wholedata:0,
    wholebrand:[],
    wholenewsSeries:[],
    infodata:''
  },
  wholeeverybodbuy:function(){
    this.setData({
      wholedata: 0,
      brandid:''
    })
  },
  // 查看全部
  wholedata:function(e){
    var _this = this;
    var whole = e.currentTarget.dataset.whole || e.target.dataset.whole || 0;
    _this.setData({
      wholedata:whole
    })
  },
  changeGoodsSwip: function (detail) {
    this.setData({
      currentSwiper: detail.detail.current
    })
  },

  everybodbuy:function(){
    // this.setData({
    //   brandid: '',
    //   // 最新上架
    //   brand: false,
    //   // 热门品牌
    //   series: false,
    // });
    var infodata = this.data.infodata||{};
    if (infodata&&infodata.drawBox && infodata.drawBox){
      wx.navigateTo({
        url: "/pages/smokebox/smokebox?gid=" + infodata.goods_id,
      });
    }else{
      wx.navigateTo({
        url: "/pages/smokeboxlist/smokeboxlist"
      });
    }
    
  },
  // 热门品牌显示
  seriesfun:function(){
    var _this = this;
    this.setData({
      // 最新上架
      brand: false,
      // 热门品牌
      series: true,
    });
    var qqq = Dec.Aese('mod=cabinet&operation=indexBrand');
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading();
        _this.setData({ iftrnodata: true });
        if (res.data.ReturnCode == 200) {
          var listdata = res.data.List.brand || {};
          var letter = [];
          for(var i in listdata){
              letter.push(i);
          };
          var lettersheight = 0;
          if (letter.length*60>700){
            lettersheight = 700;
          }else{
            lettersheight = letter.length*60;
          };
          _this.setData({
            letter: letter,
            serieslist:listdata,
            lettersheight: lettersheight
          });
          // if (listdata.length != 0) {
          //   _this.setData({
          //     brandscroll: listdata,
          //     tabselid: listdata[0].id
          //   });
          //   _this.brandscrollfun(listdata[0].id);
          // } else {
          //   wx.showToast({
          //     title: '暂无更多数据',
          //     icon: 'none',
          //     duration: 2000
          //   });
          // };

        } else {
          wx.showToast({
            title: res.data.Msg,
            icon: 'none',
            duration: 2000
          });
        };
      }
    });




  },
  // 最新上架点击请求二级数据
  brandfun:function(e){
    var _this = this;
    var bid = e.currentTarget.dataset.bid || e.target.dataset.bid || 0;
    var isbs = e.currentTarget.dataset.isbs || e.target.dataset.isbs || 0;
    var topdata = e.currentTarget.dataset.topdata || e.target.dataset.topdata || 0;
    if (bid==0){
       this.setData({
         wholedata:1,
         brand: false, 
         brandid: bid
       })
       return false;
    }else{
      this.setData({
        wholedata: 0
      })      
    };
    if (topdata==1){
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    };
    this.setData({
      brandid: bid,
      brand:true,
      series:false,
      brandscroll:[],
      tabselid: ''
    });
    if (isbs==1){
      var qqq = Dec.Aese('mod=cabinet&operation=listSeries&seriesId=' + bid);
    }else{
      var qqq = Dec.Aese('mod=cabinet&operation=listSeries&brandId=' + bid);
    };
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading();
        _this.setData({ iftrnodata: true });
        if (res.data.ReturnCode == 200) {
          var listdata = res.data.List.series || [];
          if (listdata.length != 0) {
             _this.setData({
               brandscroll: listdata,
               tabselid: listdata[0].id
             });
             _this.brandscrollfun(listdata[0].id);
          } else {
            wx.showToast({
              title: '暂无更多数据',
              icon: 'none',
              duration: 2000
            });
          };

        } else {
          wx.showToast({
            title: res.data.Msg,
            icon: 'none',
            duration: 2000
          });
        };
      }
    });

  },
  //最新上架 scroll 请求三级数据
  brandscrollfun:function(num){
    var _this = this;
    var qqq = Dec.Aese('mod=cabinet&operation=detailSeries&seriesId=' + num);
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    _this.setData({
      brandlist:[],
      iftrnodatabr:false
    });
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading();
        _this.setData({ iftrnodatabr: true });
        if (res.data.ReturnCode == 200) {
          var listdata = res.data.List.goods || [];
          var infodata = res.data.Info||{};
          _this.setData({infodata: infodata})
          if (listdata.length != 0) {
            _this.setData({
              brandlist: listdata,
            })
          } else {
            wx.showToast({
              title: '暂无更多数据',
              icon: 'none',
              duration: 2000
            });
          };

        } else {
          wx.showToast({
            title: res.data.Msg,
            icon: 'none',
            duration: 2000
          });
          _this.setData({ infodata: { drawBox:false} })
        };
      }
    });
  }, 

  // input 值改变
  inputChange: function (e) {
    this.setData({
      inputdata: e.detail.value
    });
  },
  wholefun:function(){
    this.setData({
      inputdata: ''
    })
    // 获取list数据
    this.listdata(0);
  },
  // 搜索
  jumpsoousuo: function () {
    if (this.data.inputdata==''){
      wx.showToast({
        title: '输入框不能为空！',
        icon: 'none',
        mask:true,
        duration: 2000
      });
      return false;
    };
    // 获取list数据
    this.listdata(0);
  },

  
  // 授权
  clicktga: function () {
    app.clicktga(2)
  },
  clicktganone: function () {
    this.setData({ tgabox: false })
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
            grocerystoreiftr: app.signindata.grocerystoreiftr || 'off',
            isStore: app.signindata.isStore,
            isProduce: app.signindata.isProduce,
            isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
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
   * 生命周期函数--监听页面加载
   */
  onLoadfun: function () {
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      grocerystoreiftr: app.signindata.grocerystoreiftr || 'off',
      isProduce: app.signindata.isProduce,
      isShareFun: app.signindata.isShareFun,
      isStore: app.signindata.isStore,
      isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
    });
    _this.listdata(0);
    this.selectComponent("#hide").getappData()
    // 购物车数量
    Dec.shopnum(_this,app.signindata.comurl);
    var qqq = Dec.Aese('operation=info&mod=info');
    // 调取晒单数量
    Dec.dryingSum(_this, app.signindata.clwcomurl);
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
          app.signindata.defaultinformation = res.data.Info || '';
        };
      }
    });
    // 最新和热门
    this.brandseries();

    if (_this.data.loginid != '' && _this.data.uid != '' && !_this.data.isBlindBoxDefaultAddress) {
      _this.setData({
        ishowdealoradd: true,
        ishowcover: true,
      })

      _this.nextpagediao();
    }

  }, 
  // 最新和热门
  brandseries:function(){
     var _this = this;
    // 发现详情
    var qqq = Dec.Aese('mod=cabinet&operation=toyCate&uid='+_this.data.uid+'&loginid='+_this.data.loginid);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          var brandseries = res.data.List||{};
          var countcartcounttoy = res.data.Info||{} 
           _this.setData({
             brandseries: brandseries,
             countcartcounttoy: countcartcounttoy,
             wholebrand: brandseries.brand,
             wholenewsSeries: brandseries.newsSeries
           })

        };
      }
    });     
  },
  // 阻止蒙层冒泡
  preventD() { },
  onLoad: function (options) {
 
    // 购物车数据显示
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      drying_id: options.drying_id||'',
      uid: app.signindata.uid,
      grocerystoreiftr: app.signindata.grocerystoreiftr || 'off',
      isProduce: app.signindata.isProduce,
      isShareFun: app.signindata.isShareFun,
      isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
    });

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // '已经授权'
          _this.data.loginid = app.signindata.loginid;
          _this.data.openid = app.signindata.openid;
          _this.setData({
            signinlayer: true,
            uid: app.signindata.uid,
            grocerystoreiftr: app.signindata.grocerystoreiftr || 'off',
            isProduce: app.signindata.isProduce,
            isShareFun: app.signindata.isShareFun,
            isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this)
          }
        } else {
          _this.onLoadfun();
          this.setData({
            signinlayer: false,
          })
        }
      }
    });
    

  },
  listdata: function (num){
    var _this = this;
    if (num == 0) {
      _this.data.page = 0;
      _this.setData({ listdata: [], iftrnodata:false });
    } else {
      var pagenum = parseInt(_this.data.page)
      _this.data.page = ++pagenum;
    };
    // 发现详情
    var qqq = Dec.Aese('mod=cabinet&operation=listSquare&pid=' + _this.data.page + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&searchKey=' + _this.data.inputdata);
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        _this.setData({ iftrnodata:true});
        if (res.data.ReturnCode == 200) {
          var listdata = res.data.List.goods || [];
          if (listdata.length!=0){
            if (num == 0) {
              _this.setData({ listdata: listdata });
            } else {
              var ltlist = _this.data.listdata.concat(listdata);
              _this.setData({ listdata: ltlist });
            };
          }else{
            wx.showToast({
              title: '暂无更多数据',
              icon: 'none',
              duration: 2000
            });
          };

        }else{
          wx.showToast({
            title: res.data.Msg,
            icon: 'none',
            duration: 2000
          });          
        };
      }
    });     
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.listdata(0);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.listdata(1);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    var reshare = Dec.sharemc();
    return reshare
  },
  dlfindfun: function () {
    wx.reLaunch({
      url: "/page/component/pages/dlfind/dlfind",
    })
  },
  // 导航跳转
  whomepage: function () {
    wx.reLaunch({
      url: "../../../../pages/index/index?judgeprof=2"
    })
  },
  wmy: function () {
    wx.reLaunch({
      url: "../../../../pages/wode/wode"
    });
  },
  wshoppingCart: function () {
    wx.reLaunch({
      url: "../../../../pages/shoppingCart/shoppingCart"
    });
  },

  imageLoadtd:function(e){
    var ind = parseInt(e.currentTarget.dataset.ind || e.target.dataset.ind || 0);
    var latter = e.currentTarget.dataset.latter || e.target.dataset.latter || 0;
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;
    var serieslist = this.data.serieslist;
    var viewHeight = 150,           //设置图片显示宽度，
      viewWidth = 150 * ratio;
    if (viewWidth > 150) {
      viewWidth = 150;
    };
    if (serieslist[latter] && serieslist[latter].brand && serieslist[latter].brand[ind]) {
      serieslist[latter].brand[ind].width = viewWidth;
      _this.setData({
        brandseries: brandseries
      })
    };

  },

  // 计算图片大小
  imageLoad: function (e) {
    var _this = this;
    var ind = parseInt(e.currentTarget.dataset.ind || e.target.dataset.ind || 0);
    var eve = parseInt(e.currentTarget.dataset.eve || e.target.dataset.eve || 0);
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;
    if (eve==1){
      var viewHeight = 100,           //设置图片显示宽度，
        viewWidth = 100 * ratio;
      var brandseries = this.data.brandseries;
      if (viewWidth > 100) {
        viewWidth = 100;
      };
      
      if (brandseries.brand && brandseries.brand[ind]) {
        brandseries.brand[ind].width = viewWidth;
        _this.setData({
          brandseries: brandseries
        })
      };
    } else if (eve==2){
      var viewHeight = 100,           //设置图片显示宽度，
        viewWidth = 100 * ratio;
      var brandseries = this.data.brandseries;
      if (viewWidth > 100) {
        viewWidth = 100;
      };
      
      if (brandseries.series && brandseries.series[ind]) {
        brandseries.series[ind].width = viewWidth;
        _this.setData({
          brandseries: brandseries
        })
      };
    } else if (eve==3){
      var viewHeight = 200,           //设置图片显示宽度，
        viewWidth = 200 * ratio;
      var brandlist = this.data.brandlist;
      if (viewWidth > 170) {
        viewWidth = 170;
      };
      if (brandlist[ind]) {
        brandlist[ind].evewidth = viewWidth;
        _this.setData({
          brandlist: brandlist
        })
      };
    } else if (eve == 4) {
      var viewHeight = 200,           //设置图片显示宽度，
        viewWidth = 200 * ratio;
      var listdata = this.data.listdata||[];
      if (viewWidth > 170) {
        viewWidth = 170;
      };
      if (listdata[ind]) {
        listdata[ind].evewidth = viewWidth;
        _this.setData({
          listdata: listdata
        })
      };
    }

  },


  owneridfun: function (event) {
    var id = event.currentTarget.dataset.ownerid || event.target.dataset.ownerid||'';
    var _this = this;
    wx.navigateTo({
      url: "/page/component/pages/myothertoydg/myothertoydg?ownerId=" + id,
    });
  },
  jumpsmokelist:function(){
    wx.navigateTo({
      url: "/pages/smokeboxlist/smokeboxlist"
    });
  },
  // 导航跳转 
  wnews: function () {
    var _this = this;
    // setTimeout(function () {
      // app.limitlottery(_this);
    // }, 100);
  },

  pullupsignin: function () {
    // // '没有授权'
    this.setData({
      tgabox: true
    });
  },

  // tab切换
  tabbotdata: function (w) {
    var _this = this;
    var value = w.currentTarget.dataset.c_id || w.target.dataset.c_id || 0;
    var tablist = _this.data.tablist || [];

    _this.setData({
      tabselid: value
    });
    _this.brandscrollfun(value)
    // 获取list数据
    // this.listdata(0);
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#q' + value).boundingClientRect();
    query.exec(function (res) {
      if (res && res[0]) {
        if (res[0].width) {
          _this.setData({
            scrollleft: w.currentTarget.offsetLeft - wx.getSystemInfoSync().windowWidth / 2 + 70 + (res[0].width / 2)
          });
        };
      }
    });
  },
  //  获取滚动条位置
  scrollleftf: function (event) {
    this.data.scrollwidth = event.detail.scrollwidth;
  },


  chooseLetter(e) {
    this.setData({
      curLetter: null
    });
    var letter = e.currentTarget.dataset.letter;

    // 查找对应的id
    var id = "#letter" + letter;
    const query = wx.createSelectorQuery()
    query.select(id).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      wx.pageScrollTo({
        scrollTop: res[0].top + res[1].scrollTop-320,
        duration: 300
      })
    })
  },

  jumpchj:function(){
    wx.navigateTo({
      url: "/pages/smokeboxlist/smokeboxlist"
    });
  },
  jumpcartbut:function(){
    wx.navigateTo({
      url: "/page/component/pages/ocamcart/ocamcart?but=cart"
    });
  },
  jumpshopbut:function(w){
    var name = w.currentTarget.dataset.name || w.target.dataset.name;
    var minprice = w.currentTarget.dataset.minprice || w.target.dataset.minprice||0;
    var maxprice = w.currentTarget.dataset.maxprice || w.target.dataset.maxprice || 0;
    if (minprice == 0 && maxprice==0){
      wx.showToast({
        title: '暂无该款信息',
        icon: 'none',
        duration: 1500
      });
      return false
    };
    wx.navigateTo({
      url: "/page/component/pages/ocamcart/ocamcart?name=" + name+"&but=shop"
    });
  },
  jumpmyo:function(){
    var _this = this;
    wx.navigateTo({
      url: "/page/component/pages/myothertoydg/myothertoydg?ownerId=" + _this.data.uid
    });
  },



  agreeset: function () {
    var _this = this;
    _this.setData({
      ishowdeal: false,
      ishowadd: true,
    })
  },

  closedealoradd: function () {
    var _this = this;
    if (!_this.data.ishowdealoradd) {
      _this.setData({
        ishowdealoradd: true,
      })
    } else {
      if (_this.data.ishowadd) {
        _this.setData({
          ishowdeal: true,
          ishowadd: false,
        })
      } else {
        _this.setData({
          ishowdealoradd: false,
        })
      }
    }
  },

  showdealoradd: function () {
    var _this = this;
    _this.setData({
      ishowdealoradd: !_this.data.ishowdealoradd,
    })
  },

  // 跳转增加新地址
  jumpaddress: function () {
    var _this = this;
    wx.navigateTo({
      url: "/pages/newreceivingaddress/newreceivingaddress"
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
          if (rdl.length != 0) {
            for (var i = 0; i < rdl.length; i++) {
              rdl[i].checked = false;
            };
            _this.setData({
              addressdata: rdl,
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
            ishowcover: false,
          })
          app.signindata.isBlindBoxDefaultAddress = true;
        }
      }
    });
  }









})