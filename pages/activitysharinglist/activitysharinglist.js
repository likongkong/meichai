var Dec = require('../../common/public.js');//aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断组件关注公众号是否兼容
    canIUse: wx.canIUse('official-account'),     
    // 接口地址
    comurl: app.signindata.comurl,
    // 图片地址
    zdyurl: Dec.zdyurl(),
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,
    typea:1,    
    //  免单次数
    countdown:'',
    // 数据
    commoddata:[],
    // 最大上线数
    maxchange:3,
    // 第一次加载不显示暂无数据
    nodataiftr: false,
    // tab 数据
    scrdata:[],
    // tab 数据
    category_id:-1, 
    // 防止多次提交
    preventmultiplesubmission:true,
    // 列表分页
    pid:0,

    // 赠送优惠券数据
    newcoupondata: [],
    // 节日主题
    newcoutitle: '新人礼包',
    // 赠送优惠券弹框是否显示
    newcoupon: false, 
    isProduce: app.signindata.isProduce,
    // 晒单数量
    dryinglistnum: 0,
    shopnum: 0,
    // 适配苹果X 
    isIphoneX: app.signindata.isIphoneX,
    // 微信号码
    wxnum: 'meichai666666', 
    spreadEntry: app.signindata.spreadEntry,
    c_title: '拆免单',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    finishedlist:[],
    signlist: [],
    // 是否授权
    windowHeight: app.signindata.windowHeight - 65 - wx.getStorageSync('statusBarHeightMc') || 0,
    tgabox: false,
    signinlayer:false,

    // 倒计时时间戳
    perspcardata: '',
    // 倒计时展示数据
    percountdown: '',
    // 倒计时
    countdowntime: '',
    perspcardiftrmin:false
  },
  jumpWebview(e){
    let url = e.currentTarget.dataset.url;
    app.comjumpwxnav(0,url,'','');
    this.setData({
      isFocusPublic:true
    })
    app.signindata.isFocusPublic = true;
  },

  onHide: function () {
    clearInterval(this.data.countdowntime);
    // 调用重置刷新
    app.resetdownRefresh();
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.countdowntime);
    // 调用重置刷新
    app.resetdownRefresh();
  },
  pullupsignin: function () {
    // // '没有授权'
    this.setData({
      tgabox: true
    });
  },
  // 阻止蒙层冒泡
  preventD() { },
  newhbfun: function () {
    this.setData({
      newcoupon: !this.data.newcoupon
    });
  },
  // 新人获取优惠券弹框
  swfcanimgcou: function () {
    this.setData({
      newcoupon: !this.data.newcoupon
    });
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  //时间戳转换时间  
  toDate: function (number) {
    var date = new Date(number * 1000);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    if (new Date(number * 1000).toDateString() === new Date().toDateString()) {
      return h + ':' + m + ':' + s;
    } else {
      // return M + '-' + D + ' ' + h + ':' + m;
      return M + '月' + D +'日'+ ' ' + h + ':' + m;
    }
  },  
  // 跳转抽盒机
  bblistfun: function () {
    app.comjumpwxnav(988,'','');
  },
  onLoadfun:function(){
    var newDate = new Date();
    var m = newDate.getMinutes();
    var s = newDate.getSeconds();
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      isProduce: app.signindata.isProduce,
      spreadEntry: app.signindata.spreadEntry,
      // 适配苹果X 
      isIphoneX: app.signindata.isIphoneX,
      signinlayer: true,
      defaultinformation:app.signindata.defaultinformation,
      isFocusPublic: app.signindata.isFocusPublic,
      tgabox: false
    });

    _this.data.perspcardata = app.signindata.perspcardata || '';
    if (_this.data.perspcardata) {
      _this.setData({
        perspcardiftrmin: true
      });
      app.countdowntime(_this, _this.data.perspcardata)
    };

    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    // tab
    _this.listdata(1);
  
    setTimeout(function () { _this.otherdata();},1000);
    if (app.signindata.isAwardOrder) {
      _this.setData({ isAwardOrder: app.signindata.isAwardOrder, awardOrder: app.signindata.awardOrder || false });
      app.winningtheprizetime(_this);
    };
  },
  jumporder:function(){
     var _this = this;
     app.jumporder(_this);
  },
  otherdata:function(){
    var _this = this;
    // 节日红包奖励
    var qqqqq = Dec.Aese('mod=coupon&operation=holiday&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
    wx.request({
      url: app.signindata.comurl + 'user.php' + qqqqq,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          if (res.data.Info) {
            _this.setData({
              newcoupon: true,
              newcoupondata: res.data.Info.List,
              newcoutitle: res.data.Info.title
            });
          };
        };
        if (res.data.ReturnCode == 201) {
          _this.setData({
            newcoupon: false
          });
        };
        _this.textfun();
        // 购物车数量
        Dec.shopnum(_this,app.signindata.comurl);
        // 调取晒单数量
        Dec.dryingSum(_this, app.signindata.clwcomurl);
      },
      fail: function () { _this.textfun(); }
    });
    // wx.getUserInfo({
    //   success: function (res) {
    //     // 下载用户头像
    //     wx.downloadFile({
    //       url: res.userInfo.avatarUrl,
    //       success(res) {
    //         const fs = wx.getFileSystemManager();
    //         fs.saveFile({
    //           tempFilePath: res.tempFilePath,
    //           success(res) {
    //             wx.setStorageSync('image_cache', res.savedFilePath)
    //           }
    //         });
    //       },
    //       fail: function (err) {
    //         wx.setStorageSync('image_cache', '')
    //       }
    //     });
    //   }
    // });

  },
  textfun:function(){
    var _this = this;

    if(this.data.defaultinformation){}else{
      app.defaultinfofun(this);
    };    

    // 获取剩余次数 
    var qc = Dec.Aese('mod=activity&operation=chance&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1');
    wx.request({
      url: app.signindata.comurl + 'spread.php' + qc,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          var countdown = res.data.Info.chance || 0;
          _this.setData({
            countdown: countdown
          })
        };
        if (res.data.ReturnCode == 900) {
          app.showToastC('登陆状态有误');
        };

      }
    });
  },
  listdata:function(num){  // 1 下拉 2 上拉
    var _this = this;
    wx.showLoading({ title: '加载中...', })
    if (num==1){
      _this.setData({ pid: 0, nodataiftr: false});
    }else{
      var pagenum = _this.data.pid;
      _this.setData({ pid: ++pagenum, nodataiftr: false});
    };
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    // 商品列表
    var newDate = new Date();
    var m = newDate.getMinutes();
    var s = newDate.getSeconds();
    var q = Dec.Aese('mod=activity&operation=list&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&category_id=' + _this.data.category_id+'&pid='+_this.data.pid);
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('listdata=====',res)
        // 刷新完自带加载样式回去
        wx.hideLoading()
        wx.stopPullDownRefresh(); 
        if (res.data.ReturnCode == 200) {
          var arrlist = res.data.List.list || [];
          if (arrlist.length != 0) {
            for (var i = 0; i < arrlist.length; i++) {
              if (!reg.test(arrlist[i].goods_cover)) {
                arrlist[i].goods_cover = _this.data.zdyurl + arrlist[i].goods_cover;
              };
              if (!reg.test(arrlist[i].cover)) {
                arrlist[i].cover = _this.data.zdyurl + arrlist[i].cover;
              };
              arrlist[i].start_time = _this.toDate(arrlist[i].start_time);
              arrlist[i].stop_time = _this.toDate(arrlist[i].stop_time);
              if(arrlist[i].brand &&  arrlist[i].brand.name && arrlist[i].brand.name.indexOf("旗舰店") != -1){
                arrlist[i].isBrandNaq = 1;
              }else{
                arrlist[i].isBrandNaq = 0;
              };
            };
          };
          if (num == 1) {
            var comdataarr = arrlist || [];
            var finished = res.data.List.finished || [];
            var sign = res.data.List.sign || [];
            _this.setData({
              finishedlist: finished||[],
              signlist: sign||[]
            })
          } else {
            var comdataarr = _this.data.commoddata.concat(arrlist);
          };
          _this.setData({
            commoddata: comdataarr
          });          
        };
        if (res.data.ReturnCode == 300) {
          app.showToastC('暂无更多数据');
          if(num==1){
            _this.setData({
              commoddata: []
            });
          }
        };
        if (res.data.ReturnCode == 900) {
          app.showToastC('登陆状态有误');
        };
        _this.setData({
          nodataiftr: true
        })
        var newDate = new Date();
        var m = newDate.getMinutes();
        var s = newDate.getSeconds();
      }
      
    });
  },
  onLoad: function (options) {
    var newDate = new Date();
    var m = newDate.getMinutes();
    var s = newDate.getSeconds();
    // 判断是否授权 
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      isProduce: app.signindata.isProduce,
      spreadEntry: app.signindata.spreadEntry,
      // 适配苹果X 
      isIphoneX: app.signindata.isIphoneX
    });
    app.signindata.suap = 9;
    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;
      _this.setData({isProduce:true}); 
      _this.listdata(1);
    }else{
      wx.getSetting({
        success: res => {
          if (true) {
            // '已经授权'
            _this.setData({
              loginid: app.signindata.loginid,
              uid: app.signindata.uid,
              openid: app.signindata.openid,
              isProduce: app.signindata.isProduce,
              spreadEntry: app.signindata.spreadEntry,
              // 适配苹果X 
              isIphoneX: app.signindata.isIphoneX,
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
            _this.setData({
              tgabox: false,
              signinlayer: false
            })
            _this.listdata(1);
          }
        }
      }); 
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
        if (true) {
          _this.setData({
            tgabox: false,
            signinlayer: true
          });
          _this.onLoad();
        }
      }
    });
    if (e.detail.detail.userInfo) { } else {
      app.clicktga(8)  //用户按了拒绝按钮
    };
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    if (app.signindata.perspcardata) {
      clearInterval(this.data.countdowntime);
      _this.setData({
        perspcardiftrmin: true
      });
      app.countdowntime(_this, _this.data.perspcardata)
    }else{
      clearInterval(this.data.countdowntime);
      _this.setData({
        perspcardiftrmin: false
      });
    };
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    app.downRefreshFun(() => {
      var _this = this;
      wx.showLoading({ title: '加载中...', })
      var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
      // 商品列表
      _this.listdata(1);
      // 获取剩余次数 
      var qc = Dec.Aese('mod=activity&operation=chance&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1');
      wx.request({
        url: app.signindata.comurl + 'spread.php' + qc,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {
          wx.hideLoading()
          if (res.data.ReturnCode == 200) {
            var countdown = res.data.Info.chance||0;
            _this.setData({countdown: countdown})
          };
          if (res.data.ReturnCode == 900) {
            app.showToastC('登陆状态有误');
          };
        }
      });   
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.listdata(2);
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
    // return app.sharemc() 
    return {
      title: '免单活动列表',
      path: '/page/component/pages/activitysharinglist/activitysharinglist',
      success: function (res) { }
    } 
  },
  // 跳转活动详情页
  activitydetailspage: function (event) {
    var id = event.currentTarget.dataset.id || event.target.dataset.id;
    wx.navigateTo({ 
      url: "/pages/activitydetailspage/activitydetailspage?id=" + id
    });
  },  
  myexemption:function(){
    wx.navigateTo({
      url: "/pages/myorder/myorder?tabnum=0"
    });
  },
  // 跳转详情页 
  addressmanagement: function (event) {
    var gid = event.currentTarget.dataset.gid || event.target.dataset.gid;
    app.comjumpwxnav(1,gid,'');
  },   
  //  支付成功跳转
  comindellistjump: function (w) {
    var whref = w.currentTarget.dataset.href || w.target.dataset.href;
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type || 0;
    var wname = w.currentTarget.dataset.name || w.target.dataset.name || '美拆';
    // 公共跳转
    this.comjumpwxnav(item_type, whref, wname);
  },
  // 公共跳转
  comjumpwxnav: function (item_type, whref, wname) {
    app.comjumpwxnav(item_type, whref, wname)
  },
  // 免单活动跳转
  actexempfun: function (event) {
    var gid = event.currentTarget.dataset.gid || event.target.dataset.gid;
    wx.redirectTo({
      url: "/pages/activitydetailspage/activitydetailspage?id=" + gid
    });
  },
  // 导航跳转 
  wnews: function () {
    var _this = this;
    app.limitlottery(_this);
  },
  // 导航跳转
  whomepage: function () {
    app.comjumpwxnav(998,'','');
  },
  dlfindfun: function () {
    app.comjumpwxnav(993,'','');
  },
  wmy: function () {
    app.signindata.iftr_mc = true;
    app.comjumpwxnav(9059,'','');
  },


  jumpaction: function (w) {
    var path = w.currentTarget.dataset.path || w.target.dataset.path || '';
    wx.navigateTo({
      url: path
    });
  },

})