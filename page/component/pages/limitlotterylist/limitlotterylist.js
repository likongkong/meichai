var Dec = require('../../../../common/public.js'); //aes加密解密js

const app = getApp();
Page({
  data: {
    //接口地址
    comurl: app.signindata.comurl,
    // 图片地址
    zdyurl: Dec.zdyurl(),

    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,
    avatarUrl: app.signindata.avatarUrl,
    isProduce: app.signindata.isProduce,
    // 适配苹果X
    isIphoneX: app.signindata.isIphoneX,

    c_title: '限定抽签',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    listdata: [],
    pid: 0,
    // 晒单数量
    dryinglistnum: 0,
    shopnum: 0,
    nodataiftr: false,
    windowHeight: app.signindata.windowHeight - 65 - wx.getStorageSync('statusBarHeightMc') || 0,
    iscashpledge:false,
    drawOrFreeOrder:1, // 1 抽签 2 免单
  },
  drawOrFreeOrderFun(w){
    var drawOrFreeOrder = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    this.setData({drawOrFreeOrder});
    if(drawOrFreeOrder==2){
      this.listdataDraw(1);
    }else{
      this.listdata(1)
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 判断是否授权 
    var _this = this;
    app.signindata.suap = 21;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      isProduce: app.signindata.isProduce,
      // 适配苹果X 
      isIphoneX: app.signindata.isIphoneX
    });
    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      _this.onLoadfun();
      }else{
        // '已经授权'
        _this.setData({
          loginid: app.signindata.loginid,
          uid: app.signindata.uid,
          openid: app.signindata.openid,
          isProduce: app.signindata.isProduce,
          // 适配苹果X 
          isIphoneX: app.signindata.isIphoneX,
          spreadEntry: app.signindata.spreadEntry,
        });
        // 判断是否登录
        if (_this.data.loginid != '' && _this.data.uid != '') {
          _this.onLoadfun();
        } else {
          app.signin(_this)
        }
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

    _this.listdata(1),
      // 调取晒单数量
      Dec.dryingSum(_this, app.signindata.clwcomurl);
    // 购物车数据显示
    Dec.shopnum(_this,app.signindata.comurl);

    if (app.signindata.isAwardOrder) {
      _this.setData({
        isAwardOrder: app.signindata.isAwardOrder,
        awardOrder: app.signindata.awardOrder || false
      });
      app.winningtheprizetime(_this);
    };

  },
  listdataDraw:function(num){  // 1 下拉 2 上拉
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

  jumporder: function() {
    var _this = this;
    app.jumporder(_this);
  },

  listdata: function(num) { // 1 下拉 2 上拉
    var _this = this;
    wx.showLoading({
      title: '加载中...',
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
    var q = Dec.Aese('mod=lotto&operation=list&uid='  + _this.data.uid + '&loginid=' + _this.data.loginid + '&pid=' + _this.data.pid);
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
          var signarray = res.data.List.sign || [];
          var finishedarray = res.data.List.finished || [];
          if (arrlist && arrlist.length != 0) {
            for (var i = 0; i < arrlist.length; i++) {
              if (arrlist[i].status == 1) {
                if(arrlist[i].isLiveShow){
                  arrlist[i].start_time = _this.toDate(arrlist[i].start_time,1);
                }else{
                  arrlist[i].start_time = _this.toDate(arrlist[i].start_time);
                };
              } else if (arrlist[i].status == 2) {
                arrlist[i].stop_time = _this.toDate(arrlist[i].stop_time);
              };
            };
            if (num == 1) {
              var comdataarr = arrlist || [];
            } else {
              var comdataarr = _this.data.listdata.concat(arrlist);
            };
            _this.setData({
              listdata: comdataarr,
            });
          } else {
            app.showToastC('暂无更多数据');
          };

          if (signarray && signarray.length != 0) {
            if (num == 1) {
              var signarray = signarray || [];
            } else {
              var signarray = _this.data.signlist.concat(signarray);
            };
            _this.setData({
              signlist: signarray
            });
          }

          if (finishedarray && finishedarray.length != 0) {
            for (var i = 0; i < finishedarray.length; i++) {
              finishedarray[i].cover = finishedarray[i].cover+"?random="+Math.ceil(Math.random()*10000)
            };
            if (num == 1) {
              var finishedarray = finishedarray || [];
            } else {
              var finishedarray = _this.data.finishedlist.concat(finishedarray);
            };
            _this.setData({
              finishedlist: finishedarray,
            });
          }

        };
        if (res.data.ReturnCode == 300) {
          app.showToastC('暂无更多数据');
          if (num == 1) {
            _this.setData({
              listdata: []
            });
          }
        };
        if (res.data.ReturnCode == 900) {
          app.showToastC('登陆状态有误');
        };
        _this.setData({
          nodataiftr: true
        })

      }

    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    // 调用重置刷新
    app.resetdownRefresh();
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    // 调用重置刷新
    app.resetdownRefresh();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    app.downRefreshFun(() => {
      if(this.data.drawOrFreeOrder==2){
        this.listdataDraw(1);
      }else{
        this.listdata(1);
      };
      
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if(this.data.drawOrFreeOrder==2){
      this.listdataDraw(2);
    }else{
      this.listdata(2);
    };
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  onShareTimeline:function(){
    var _this = this;
    return {
      title:_this.data.c_title || '潮玩社交平台',
      query:{}    
    }
  },
  jumpaction: function(w) {
    var path = w.currentTarget.dataset.path || w.target.dataset.path || '';
    wx.navigateTo({
      url: path
    });
  },
  //时间戳转换时间  
  toDate: function(number,num) {
    var date = new Date(number * 1000);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    if(num == 1){
      return M + '月' + D + '日'
    }else if (new Date(number * 1000).toDateString() === new Date().toDateString()) {
      return h + ':' + m + ':' + s;
    } else {
      return M + '月' + D + '日' + ' ' + h + ':' + m;
    }
  },



  // 导航跳转
  whomepage: function() {
    setTimeout(function() {
      app.comjumpwxnav(998,'','');
    }, 100);
  },

  dlfindfun: function() {
    setTimeout(function() {
      app.comjumpwxnav(993,'','');
    }, 100);
  },

  // 导航跳转 
  wnews: function() {
    var _this = this;
    app.limitlottery(_this); 
  },

  wshoppingCart: function() {
    setTimeout(function() {
      app.comjumpwxnav(9058, '', '');
    }, 100);
  },

  wmy: function() {
    app.signindata.iftr_mc = true;
    setTimeout(function() {
      app.comjumpwxnav(9059,'','');
    }, 40);
  },
  // 跳转抽签详情
  limitlotteryd: function(w) {
    var id = w.currentTarget.dataset.gid || w.target.dataset.gid;
    if(id=='374855' || id=='374856' || id=='374857'){
      wx.navigateTo({
        url: "/page/secondpackge/pages/luckyDraw/luckyDraw?id=" + id
      });
    }else{
      wx.navigateTo({
        url: "/page/component/pages/limitlottery/limitlottery?list=1&id=" + id
      });
    }
  },
  // 计算图片大小
  // imageLoadad: function(e) {
  //   var _this = this;
  //   var indexnum = e.currentTarget.dataset.indexnum || e.target.dataset.indexnum || 0;
  //   var listdata = _this.data.listdata || [];
  //   var $width = e.detail.width,
  //     $height = e.detail.height,
  //     ratio = $width / $height;
  //   var viewWidth = 714,
  //     viewHeight = 714 / ratio;
  //   if (listdata[indexnum]) {
  //     listdata[indexnum].heightc = viewHeight;
  //     _this.setData({
  //       listdata: listdata
  //     })
  //   };
  // },

  // 计算图片大小
  imageLoadad: function (e) {
    var _this = this;
    var indexnum = e.currentTarget.dataset.indexnum || e.target.dataset.indexnum || 0;
    // 已报名
    if (indexnum == 1) {
      var ind = e.currentTarget.dataset.ind || e.target.dataset.ind || 0;
      var $width = e.detail.width,
        $height = e.detail.height,
        ratio = $width / $height;
      var viewHeight = 140,
        viewWidth = 140 * ratio;
      var signlist = this.data.signlist;
      if (signlist[ind]) {
        if (signlist[ind]) {
          signlist[ind].width = viewWidth;
          _this.setData({
            ['signlist[' + ind + '].width']: viewWidth
          });
        };
      };
    } else if (indexnum == 2) { // 已完成
      var ind = e.currentTarget.dataset.ind || e.target.dataset.ind || 0;
      var $width = e.detail.width,
        $height = e.detail.height,
        ratio = $width / $height;
      var viewHeight = 140,
        viewWidth = 140 * ratio;
      var finishedlist = this.data.finishedlist;
      if (finishedlist[ind]) {
        _this.setData({
          ['finishedlist['+ind+'].width']: viewWidth
        })
      };
    };
  },
  // 跳转活动详情页
  activitydetailspage: function (event) {
    var id = event.currentTarget.dataset.id || event.target.dataset.id;
    wx.navigateTo({ 
      url: "/pages/activitydetailspage/activitydetailspage?id=" + id
    });
  },

})