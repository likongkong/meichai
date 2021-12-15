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
    // 数据 
    listdata:[],
    headhidden:false,
    shopnum:0,
    dryinglistnum:0,

    c_title: '我的玩具柜',
    c_arrow: true,
    c_backcolor: '#ff2742',
    page:0,
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    // 全选
    comcheck:true,
    mtdlocation:false,
    mtdtiploctxt:'',
    iftrnodata:false,
    immdevery:false,
    mtdtipimd:'是否确认发货?',

    numberofdismantling:'',
    buybombsimmediately:false,
    tipnamephone:'',
    tipback:false,

    tipaid:'',
    addressdata:'',
    tipnamephone:'',
    tipaddress:'',
    tgaimg: app.signindata.tgaimg || 'https://www.51chaidan.com/images/default/openscreen.jpg'
  },
  immdeverycanncel:function(){
    this.setData({
      immdevery:false
    })
  },
  mtdlocationfun:function(){
    var _this = this;
    this.setData({
      mtdlocation:false
    });
    this.listdata(0);
    // let pages = getCurrentPages();
    // let prevpage = pages[pages.length - 2];
    // if (prevpage) {
    //   wx.navigateBack();
    // } else {
    //   wx.redirectTo({
    //     url: "/page/component/pages/myothertoydg/myothertoydg?ownerId=" + _this.data.uid
    //   });
    // };
  },
  immeddelfunone:function(){
    var _this = this;
    var listdata = this.data.listdata || [];
    var toyids = [];
    if (listdata && listdata.length != 0) {
      for (var i = 0; i < listdata.length; i++) {
        if (listdata[i].iftrcheck) {
          toyids.push(listdata[i].id);
        };
      };
    } else {
      return false;
    };
    if (toyids.length == 0) {
      if (listdata.legnth != 0) {
        app.showToastC('请选中发货商品');
      };
      return false;
    };
    _this.setData({
      // immdevery:true,
      // mtdtipimd: '已选中' + toyids.length +'个商品,是否确认发货?',
      receivingaddress:true,
      numberofdismantling: toyids.length,
      tipback:true
    })
  },
  immeddelfun:function(){
    var _this = this;
    var listdata = this.data.listdata||[];
    var toyids = [];
    if (listdata && listdata.length!=0){
      for(var i=0;i<listdata.length;i++){
        if (listdata[i].iftrcheck) {
          toyids.push(listdata[i].id); 
        };
      };
    }else{
      return false;
    };
    if (toyids.length==0){
      if (listdata.legnth!=0){
        app.showToastC('请选中发货商品');
      };
       return false;
    };
    var toyidsting = toyids.join(",");
    var qqq = Dec.Aese('mod=cabinet&operation=deliverGoods&toyIds=' + toyidsting + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + _this.data.tipaid);
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
        if (res.data.ReturnCode == 200) {
           _this.setData({
             mtdtiploctxt:res.data.Msg,
             mtdlocation:true,
             immdevery:false,
             tipback: false,
             receivingaddress: false,
             buybombsimmediately: false
           });
        }else if(res.data.ReturnCode == 201){
          _this.data.cart_id = res.data.Info.cart_id || '';
          wx.showModal({
            title: '',
            content: res.data.Msg,
            success(res) {
              if (res.confirm) {
                _this.paymentmony()
              }
            }
          })          
        }else{
          _this.setData({
            mtdtiploctxt: res.data.Msg,
            mtdlocation: true,
            immdevery: false,
            tipback: false,
            receivingaddress: false,
            buybombsimmediately: false
          })
        };
      }
    });
  },

  // 微信支付
  paymentmony: function() {
    var _this = this;
    var q = Dec.Aese('mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + _this.data.cart_id + '&xcx=1' + '&openid=' + app.signindata.openid)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          wx.requestPayment({
            'timeStamp': res.data.Info.timeStamp.toString(),
            'nonceStr': res.data.Info.nonceStr,
            'package': res.data.Info.package,
            'signType': 'MD5',
            'paySign': res.data.Info.paySign,
            'success': function(res) {
              wx.showModal({
                title: '',
                content:'发货成功',
                success(res) {}
              })
              _this.setData({
                mtdlocation: false,
                immdevery: false,
                tipback: false,
                receivingaddress: false,
                buybombsimmediately: false
              })
              _this.listdata(0);
            },
            'fail': function(res) {},
            'complete': function(res) {}
          })
        } else {
          // 提交订单蒙层
          _this.setData({
            suboformola: false
          });
          app.showModalC(res.data.Msg || res.data.msg || '');
        };
      }
    })
  },

  // 选中 未选中
  iftrcheckfun:function(w){
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var listdata = this.data.listdata||[];
    if(listdata[ind]){
      listdata[ind].iftrcheck = !listdata[ind].iftrcheck;
      var iftrcom = true;
      for(var i=0;i<listdata.length;i++){
        if (!listdata[i].iftrcheck){
          iftrcom = false;
        };
      };
      this.setData({
        listdata: listdata,
        comcheck:iftrcom
      })
    };
  },
  // 全选
  comcheckfun:function(){
    var listdata = this.data.listdata || [];
    var comcheck = !this.data.comcheck;
    if (listdata && listdata.length!=0) {
      for (var i = 0; i < listdata.length; i++) {
        listdata[i].iftrcheck = comcheck
      };
      this.setData({
        listdata: listdata,
        comcheck: comcheck
      })
    };
  },
  // 授权
  clicktga: function () {
    app.clicktga(2)
  },
  // 点击登录获取权限
  userInfoHandler: function (e) {
    var _this = this;
    if (e.detail.userInfo) { } else {
      app.clicktga()  
    };
    wx.getSetting({
      success: res => {
        if (true) {
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
        if (true) {
          // '已经授权'
          _this.setData({
            loginid: app.signindata.loginid,
            uid: app.signindata.uid,
            openid: app.signindata.openid,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoadfun: function () {
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isShareFun: app.signindata.isShareFun,
      isProduce: app.signindata.isProduce,
      defaultinformation:app.signindata.defaultinformation,
    });
    _this.listdata(0);
    this.selectComponent("#hide").getappData();

    if(this.data.defaultinformation){}else{
      app.defaultinfofun(this);
    }

    //  收货地址
    _this.nextpagediao();
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
      isShareFun: app.signindata.isShareFun
    });

    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      _this.onLoadfun();
    }else{

      wx.getSetting({
        success: res => {
          if (true) {
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
            // 跳转获取权限页面
            _this.setData({
              tgabox: true
            });
          }
        }
      });
    };

  },
  listdata: function (num){
    var _this = this;
    if (num == 0) {
      _this.data.page = 0;
      _this.setData({ listdata: [] });
    } else {
      var pagenum = parseInt(_this.data.page)
      _this.data.page = ++pagenum;
    };
    // 发现详情
    var qqq = Dec.Aese('mod=cabinet&operation=list&pid=' + _this.data.page + '&class=5&personal_list=1&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
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
          var listdata = res.data.List.activity || [];
          if (listdata && listdata.length!=0){
            for (var i = 0; i < listdata.length; i++) {
              listdata[i].iftrcheck = true;
            };
          };
          if (num == 0) {
            _this.setData({ listdata: listdata , comcheck:true});
          } else {
            var ltlist = _this.data.listdata.concat(listdata);
            _this.setData({ listdata: ltlist ,comcheck:true });
          };
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
    var reshare = app.sharemc();
    return reshare
  },
  onShareTimeline:function(){
    var _this = this;
    return {
      title:_this.data.c_title || '潮玩社交平台',
      query:{}    
    }
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



  // 计算图片大小
  imageLoad: function (e) {
    var _this = this;
    var ind = parseInt(e.currentTarget.dataset.ind || e.target.dataset.ind || 0);
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;
    var viewHeight = 150,           //设置图片显示宽度，
      viewWidth = 150 * ratio;
    var listdata = this.data.listdata;
    if (viewWidth > 160) {
      viewWidth = 160;
    };
    if (listdata[ind]) {
      listdata[ind].width = viewWidth;
      _this.setData({
        listdata: listdata
      })
    };
  },

  // 导航跳转 
  wnews: function () {
    var _this = this;
    app.limitlottery(_this);
  },
  // 下一页返回调取
  nextpagediao: function () {
    var _this = this;
    //  调取收货地址
    var q = Dec.Aese('mod=address&operation=getlist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'user.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
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
  // 收货地址弹框
  seladdressfun: function () {
    this.setData({
      receivingaddress: true,
    });
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
      buybombsimmediately: true,
    });
  },
  // 跳转增加新地址
  jumpaddress: function () {
    wx.navigateTo({
      url: "/pages/newreceivingaddress/newreceivingaddress"
    })
  },
  // 阻止蒙层冒泡
  preventD() { }, 
  tipbackfun:function(){
    this.setData({
      tipback:false,
      receivingaddress:false,
      buybombsimmediately:false
    })
  },
  // 隐藏收货地址弹框
  receivingaddressfun: function () {
    var tipback = true;
    if (this.data.buybombsimmediately){
      tipback=true;
    }else{
      tipback=false;
    };
    this.setData({
      receivingaddress: false,
      tipback: tipback
    });
  },



})