var Dec = require('../../common/public.js');//aes加密解密js
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
    appNowTime: app.signindata.appNowTime,
    // 判断是ios或者android
    iftriosorand: app.signindata.iftriosorand,    
    store_id: '',
    istit:false,
    istitnex:true,
    icon_sex:0,
    // 用户图片
    avatarUrl:'../images/pic_head.png',
    // 用户名称
    nickName:'',
    // 待付款
    nonpayment:0,
    // 待拆单数
    nonunpack:0,
    // 待发货数
    nonsend:0,
    // 待收货数
    nonreceive:0,
    // 完成数
    finished: 0,
    // 售后数
    after_sale: 0,
    // 提现金额
    putforwardmoney:0,
    // 最佳合伙人
    partner:[],
    // 下拉提示
    bothidden: true,
    // 购物车显示数据
    shopnum: 0,
    // 授权弹框
    tgabox: false,
    // 微信号码
    wxnum:'',
    // 我的钱包数据
    point:0,
    // 点击请求判断防止多次提交
    clicktherequestiftr: true,  
    B: false,
    temporary_store_id:'',
    // 判断美拆 or 店铺
    iftrstor:0,
    iftr_wx:false,
    // 版本号
    versionnumber: app.signindata.versionnumber,
    // 适配苹果X
    isIphoneX: app.signindata.isIphoneX,
    // 随机显示复制背景颜色
    wxcopybg:1 ,
    //公告标题
    notice_title: "",
    //公告链接
    notice_url: "",
    //公告类型
    notice_type: "",
    defaultinformation: "",
    // 晒单数量
    dryinglistnum: 0,
    isProduce: app.signindata.isProduce,
    c_title: '',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'), 
    // 是否授权
    signinlayer:true,
    windowHeight: app.signindata.windowHeight - 65 - wx.getStorageSync('statusBarHeightMc')||0,
    isweekend:false,
    isweekendtip:false,
    businesscooperation:false,
    cliptxt:'zhangjing@51chaidan.com',
    awasustipimages:false,
    luckyValue:0
  },

  awasustipimages: function () {
    this.setData({
      awasustipimages: !this.data.awasustipimages
    })
  },
  businesscooperationfun:function(){
    this.setData({
      businesscooperation: !this.data.businesscooperation
    })
  },
  businesscooperationfunfz:function(){
    var _this = this;
    wx.setClipboardData({
      data: _this.data.cliptxt||'',
      success: function (res) {
        app.showToastC('复制成功');
      }
    });
    this.businesscooperationfun();
  },
  isweekendfun:function(){
     this.setData({
       isweekendtip: !this.data.isweekendtip
     })
  },
  isWeekEnd: function () {
    var weekArray = new Array("日", "一", "二", "三", "四", "五", "六");
    var date = new Date();
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var evedate = year + '/' + month + '/' + day;
    var week = weekArray[new Date(evedate).getDay()];
    var isweekend = false;
    if (week == '日' || week =='六'){
      isweekend = true;
    } else if (week == '五'){
      if (hour>=20){
        isweekend = true;
      };
    } else if (week == '一') {
      if (hour < 10) {
        isweekend = true;
      };
    };
    this.setData({
      isweekend: isweekend
    })

  },
  wxjurisdiction:function(){
      var _this = this;
      // 获取用户信息
      wx.login({
        success:function(){
          wx.getUserInfo({
            success: function (res) {
              _this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName,
                icon_sex: res.userInfo.gender,
                istitnex: false,
                istit: true,
              })
            }
          });
        }
      });
  },
  // 我的订单
  myorderfun:function(e){
    var num = e.currentTarget.dataset.tabnum;
    wx.navigateTo({  
      url: "/pages/myorder/myorder?tabnum=" + num
    });
  },
  // 地址管理
  addressmanagement:function(){
    wx.navigateTo({ 
      url: "/pages/addressmanagement/addressmanagement"
    });
  },
  //  编辑信息
  personaldata:function(){
    wx.navigateTo({
      url: "/pages/personaldata/personaldata"
    })
  },
  // 优惠券 
  coupon: function () {
    wx.navigateTo({ 
      url: "/pages/coupon/coupon"
    });
  },
  // 我的钱包 
  mywallet: function () { 
    wx.navigateTo({    //签到
      url: "/page/component/pages/newsignin/newsignin"
    });
  },  
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {


    this.isWeekEnd();

    if (options.scene){let scene = decodeURIComponent(options.scene);}else{
   
    }
    var test = [1, 2, 3];
    var num = test[Math.floor(Math.random() * test.length)]||1;
    this.data.loginid = app.signindata.loginid;
    this.setData({
      wxcopybg: num,
      temporary_store_id: options.store_id ||0,
      iftrstor: options.iftrstor||0,
      store_id: options.store_id || 0,
      uid: app.signindata.uid,
      store_id: app.signindata.store_id || 0,
      isProduce: app.signindata.isProduce,
    });
 
  },
  onLoadfun:function(){
    //  我的订单数据
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.setData({
      uid: app.signindata.uid,
      store_id: app.signindata.store_id || 0,
      isProduce: app.signindata.isProduce,
    });  
    _this.setData({
      bothidden: true
    }); 
    wx.hideLoading()    
    _this.setData({ B: true, iftr_wx: true });  

    var q = Dec.Aese('mod=getinfo&operation=myorder&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'order.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.Message != "Empty info") {
          if (res.data.ReturnCode == 200){
            _this.setData({
              // 待付款
              nonpayment: res.data.Info.non_payment||0,
              // 待拆单数
              nonunpack: res.data.Info.non_unpack || 0,
              // 待发货数
              nonsend: res.data.Info.non_send || 0,
              // 待收货数
              nonreceive: res.data.Info.non_receive || 0,
              // 我的钱包数据
              point: res.data.Info.point || 0,
              // 提现金额
              putforwardmoney: res.data.Info.money || "0.00",
              // 幸运值
              luckyValue: res.data.Info.blindbox_lucky||0
            });
            _this.data.after_sale = res.data.Info.after_sale || 0;// 售后数
          };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);            
        } else {
          _this.setData({
            // 待付款
            nonpayment: 0,
            // 待拆单数
            nonunpack: 0,
            // 待发货数
            nonsend: 0,
            // 待收货数
            nonreceive: 0,
          });
          _this.data.after_sale = 0;// 售后数
        }
      }
    }); 
    var qqq = Dec.Aese('operation=info&mod=info');
    // 获取默认信息
    wx.request({
      url: app.signindata.comurl + 'general.php' + qqq,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            wxnum: res.data.Info.cs.wxid || 'meichai666666',
            notice_title: res.data.Info.notice.title || "",
            defaultinformation: res.data.Info,
          });
          app.signindata.defaultinformation = res.data.Info || '';
          _this.data.notice_type = res.data.Info.notice.type || "";
          _this.data.notice_url = res.data.Info.notice.url || "";
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
      }
    })    
    // 已经授权，可以直接调用 getUserInfo 
    wx.getUserInfo({
      success: function (res) {
        _this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName,
          icon_sex: res.userInfo.gender,
          istitnex: false,
          istit: true,
        })
      }
    }); 
    // 购物车数据显示
    Dec.shopnum(_this,app.signindata.comurl);  
    // 调取晒单数量
    Dec.dryingSum(_this, app.signindata.clwcomurl);   

    if (app.signindata.isAwardOrder) {
      _this.setData({ isAwardOrder: app.signindata.isAwardOrder, awardOrder: app.signindata.awardOrder || false });
      app.winningtheprizetime(_this);
    };
  },

  jumporder: function () {
    var _this = this;
    app.jumporder(_this);
  },

  //  复制内容到粘贴板
  copyTBL: function (e) {
    var self = this;
    wx.setClipboardData({
      data: self.data.wxnum,
      success: function (res) {
        app.showToastC('复制成功');
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
  pullupsignin:function(){
    // // '没有授权'
    this.setData({
      tgabox: true
    });
  },
  onShow: function () {
    this.setData({
      bothidden: false
    });    
    wx.showLoading({ title: '加载中...', }) 
    // 判断是否授权 
    var _this = this;

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // '已经授权'
          _this.data.loginid = app.signindata.loginid;
          _this.setData({
            uid: app.signindata.uid,
            isProduce: app.signindata.isProduce,
            signinlayer: true,
            tgabox: false
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this)
          }
        } else {
          wx.hideLoading();
          _this.setData({
            bothidden: true,
            signinlayer:false
          }); 
          // '没有授权 统计'
          app.userstatistics(4);

        }
      }
    });
  },
  // 授权点击统计
  clicktga: function () {
    app.clicktga(2)
  },
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
    var _this = this;
    _this.setData({
      bothidden: false
    }); 
    wx.showLoading({ title: '加载中...', })   
    var q = Dec.Aese('mod=getinfo&operation=myorder&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        _this.setData({
          bothidden: true,
          // 多次提交判断
          clicktherequestiftr: true,
        });        
        wx.hideLoading()
        if (res.data.Message != "Empty info") {
          if (res.data.ReturnCode == 200) {
            _this.setData({
              // 待付款
              nonpayment: res.data.Info.non_payment,
              // 待拆单数
              nonunpack: res.data.Info.non_unpack,
              // 待发货数
              nonsend: res.data.Info.non_send,
              // 待收货数
              nonreceive: res.data.Info.non_receive,
            });
            _this.data.after_sale = res.data.Info.after_sale;// 售后数
          };
          // 判断非200和登录
          Dec.comiftrsign(_this, res, app);
        } else {
          _this.setData({
            // 待付款
            nonpayment: 0,
            // 待拆单数
            nonunpack: 0,
            // 待发货数
            nonsend: 0,
            // 待收货数
            nonreceive: 0,
          });
          _this.data.after_sale = 0;// 售后数
        };        
      }
    });    
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return Dec.sharemc()    
  },
  // 导航跳转
  whomepage: function () {
    wx.reLaunch({
      url: "/pages/index/index?judgeprof=2"
    });
  },
  wnews: function () {
    var _this = this;
    app.limitlottery(_this);
  },
  wshoppingCart: function () {
    var _this = this;
    wx.redirectTo({
      url: "/pages/shoppingCart/shoppingCart"
    });
  },
  wmy: function () {
    //  刷新 防止多次提交
    if (this.data.clicktherequestiftr) {
      this.setData({ clicktherequestiftr: false });
      this.onPullDownRefresh(); 
    };        
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
            tgabox: false
          });
          _this.onShow();
          // 确认授权用户统计
          app.clicktga(4)
        }
      }
    });
    if (e.detail.detail.userInfo) { } else {
      app.clicktga(8)  //用户按了拒绝按钮
    };

  },
  // 提现跳转
  putforward:function(){
    var siddata = this.data.temporary_store_id
    wx.navigateTo({
      url: "/pages/sputforward/sputforward?store_id=" + siddata
    });  
  },
  // 最佳合伙人
  sbestpartner: function () {
    wx.navigateTo({
      url: "/pages/sbestpartner/sbestpartner"
    });
  },  
  //公告跳转
  jumpnotice: function () {
    var _this = this
    if (_this.data.notice_type == 1) {
      var url = encodeURIComponent(_this.data.notice_url + "?uid=" + _this.data.uid)
      wx.navigateTo({
        url: "/page/component/pages/webview/webview?webview=" + url
      });
    } else {
      wx.navigateTo({
        url: "/pages/detailspage/detailspage?gid=" + _this.data.notice_url,
      })
    }
  }, 
  dlfindfun: function () {
    wx.reLaunch({
      url: "/page/component/pages/dlfind/dlfind",
    })
  },
  personalhomepage: function () {
    wx.reLaunch({
      url: "/page/component/pages/dlpersonalhomepage/dlpersonalhomepage",
    })
  },
  jumpowntoy: function () {
    var _this = this;
    wx.navigateTo({
      url: "/page/component/pages/myothertoydg/myothertoydg?ownerId=" + _this.data.uid
    })
  },
  handleContact(e) {},

  // 点击复制
  sponsocopyone: function () {
    this.setData({
      copyiftr: true
    });
  },
  copyfitrfun: function () {
    this.setData({
      copyiftr: false
    });
  },
  sponsocopytwo: function () {
    var _this = this;
    wx.setClipboardData({
      data: "meichaimeichai",
      success: function (res) {
        app.showToastC('复制成功');
        _this.setData({
          copyiftr: false
        });
      }
    });
  },
})