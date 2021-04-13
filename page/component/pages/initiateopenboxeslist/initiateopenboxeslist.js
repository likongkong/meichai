var Dec = require('../../../../common/public.js'); //aes加密解密js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
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

    c_title: '发起拆明盒',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    listdata: [],
    pid: 0,
    // 晒单数量
    dryinglistnum: 0,
    shopnum: 0,
    nodataiftr: false,
    canvasshare:false,
    id: 0,
    gid: 0,
    snapshot:'',
    shareimgurl:{}

  },
  sharebackgroundfun:function(){
    this.setData({
      canvasshare:false
    })
  },
  shareimgbut:function(w){
    var _this = this;
    var index = w.currentTarget.dataset.index || w.target.dataset.index || 0;
    var activity_id = w.currentTarget.dataset.activity_id || w.target.dataset.activity_id || 0;
    var goods_id = w.currentTarget.dataset.goods_id || w.target.dataset.goods_id || 0;
    this.setData({
      canvasshare:true,
      id: activity_id,
      gid: goods_id
    })
    _this.getSnapshot(activity_id, index, goods_id);




  },


  getSnapshot: function (activity_id, index, goods_id) {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
      mask:true
    });
    _this.setData({
      snapshot: ''
    });
    var shareimgurl = _this.data.shareimgurl||{};
    if (shareimgurl[activity_id]){
      wx.hideLoading();
      _this.setData({
        snapshot: shareimgurl[activity_id]
      });     
      return false;
    };
    const ctx = wx.createCanvasContext('snapshot' + activity_id)
    let dw = 300
    let dh = 180

    wx.getImageInfo({
      src: "https://www.51chaidan.com/images/mingbox/" + activity_id + ".jpg",

      success: function (head) {
        ctx.drawImage(head.path, 0, 0, dw, 240)


            var listdata = _this.data.listdata;
            ctx.fillStyle = '#FE666B'
            ctx.setFontSize(15)
            ctx.fillText(listdata[index].shop_price, 7.5, 224)
            let textwidth = ctx.measureText(listdata[index].shop_price).width
            ctx.fillStyle = '#000'
            ctx.setFontSize(12)
            ctx.fillText(listdata[index].name + ' ' + (listdata[index].completion||''), 7.5 + textwidth, 225)
            ctx.draw(true, setTimeout(function () {
              wx.canvasToTempFilePath({
                canvasId: 'snapshot' + activity_id,
                success: function (res) {
                  wx.hideLoading()
                  var shareimgurl = _this.data.shareimgurl || {}; 
                  shareimgurl[activity_id] = res.tempFilePath;
                  var listdata = _this.data.listdata||[];
                  listdata[index].iftrshare = true;
                  _this.setData({
                    snapshot: res.tempFilePath,
                    shareimgurl: shareimgurl,
                    listdata: listdata
                  });
                  return;
                },
                fail: function (res) {
                  wx.hideLoading()
                  return;
                },
              });
            }, 300));
      },
      fail: function (res) { 
        wx.hideLoading();
        _this.setData({
          canvasshare: false
        })
        wx.navigateTo({
          url: "/page/component/pages/initiateopenboxes/initiateopenboxes?gid=" + goods_id + '&id=' + activity_id
        });
      }
    })

  },
















  clicktipstxt:function(){
    app.showToastC('发起成功后才可邀请返现！');
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 判断是否授权 
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      isProduce: app.signindata.isProduce,
      // 适配苹果X 
      isIphoneX: app.signindata.isIphoneX
    });
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
      return false;
    };
    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      _this.onLoadfun();
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
              // 适配苹果X 
              isIphoneX: app.signindata.isIphoneX
            });
            // 判断是否登录
            if (_this.data.loginid != '' && _this.data.uid != '') {
              _this.onLoadfun();
            } else {
              app.signin(_this)
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
                wx.navigateTo({
                  url: "/pages/signin/signin"
                });
              }
            });
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
        nodataiftr: false
      });
    } else {
      var pagenum = _this.data.pid;
      _this.setData({
        pid: ++pagenum,
        nodataiftr: false
      });
    };


    var q = Dec.Aese('mod=showBox&operation=openBoxList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&pid=' + _this.data.pid);
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        // 刷新完自带加载样式回去
        wx.hideLoading()
        wx.stopPullDownRefresh();
        _this.setData({
          nodataiftr: true
        });
        if (res.data.ReturnCode == 200) {
          var arrlist = res.data.List || [];
          if (arrlist && arrlist.length != 0) {
            for (var li = 0; li < arrlist.length; li++) {
              arrlist[li].iftrshare = false;
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
  onHide: function() {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.listdata(1)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.listdata(2)
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
  onShareAppMessage: function (options) {
    var _this = this;
    this.setData({
      canvasshare: false
    });
    if (options.from == 'button'){
      var index = options.target.dataset.index||0;
      var activity_id = options.target.dataset.activity_id;
      var listdata = _this.data.listdata||[];
      if (activity_id){
        if (listdata[index].iftrshare) {
          var shareimgurl = _this.data.shareimgurl;
          _this.setData({
            snapshot: shareimgurl[activity_id]
          });
        };
      };
      var share = {
        title: '跟我一起原价拆明盒，官方售后，1件包邮',
        imageUrl: _this.data.snapshot,
        path: "/page/component/pages/initiateopenboxes/initiateopenboxes?id=" + _this.data.id + '&referee=' + _this.data.uid + '&gid=' + _this.data.gid,
        success: function (res) { }
      }
      return share;
    }

  },
  jumpaction: function(w) {
    var path = w.currentTarget.dataset.path || w.target.dataset.path || '';
    wx.navigateTo({
      url: path
    });
  },
  //时间戳转换时间  
  toDate: function(number) {
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
      return M + '月' + D + '日' + ' ' + h + ':' + m;
    }
  },



  // 导航跳转
  whomepage: function() {
    wx.reLaunch({
      url: "/pages/index/index?judgeprof=2"
    });
  },

  dlfindfun: function() {
    wx.reLaunch({
      url: "/page/component/pages/dlfind/dlfind",
    })
  },

  // 导航跳转 
  wnews: function() {
    var _this = this;
    app.limitlottery(_this); 
  },

  wshoppingCart: function() {
    wx.redirectTo({
      url: "/pages/shoppingCart/shoppingCart"
    });
  },

  wmy: function() {
    app.signindata.iftr_mc = true;
    wx.redirectTo({
      url: "/pages/wode/wode"
    });
  },
  // 跳转抽签详情
  limitlotteryd: function(w) {
    var _this = this;
    var activity_id = w.currentTarget.dataset.activity_id || w.target.dataset.activity_id||0;
    var id = w.currentTarget.dataset.id || w.target.dataset.id||0;
    var gid = w.currentTarget.dataset.gid || w.target.dataset.gid||0;
    var open = w.currentTarget.dataset.open || w.target.dataset.open||0;
    if (open==1){
      wx.navigateTo({
        url: "/page/component/pages/initiateopenboxes/initiateopenboxes?gid=" + gid + '&id=' + activity_id
      });
    }else{
      wx.showLoading({ title: '加载中...', mask: true })
      var q = Dec.Aese('mod=showBox&operation=addOpenBox&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&goods_id=' + gid + '&id=' + id);
      wx.request({
        url: app.signindata.comurl + 'spread.php' + q,
        method: 'GET',
        header: {'Accept': 'application/json'},
        success: function (res) {
          // 刷新完自带加载样式回去
          wx.hideLoading();
          if (res.data.ReturnCode == 200) {
            wx.navigateTo({
              url: "/page/component/pages/initiateopenboxes/initiateopenboxes?gid=" + res.data.Info.goods_id + '&id=' + res.data.Info.activity_id
            });
          };
        }
      });
    };

  },
  // 计算图片大小
  imageLoadad: function(e) {
    var _this = this;
    var indexnum = e.currentTarget.dataset.indexnum || e.target.dataset.indexnum || 0;
    var listdata = _this.data.listdata || [];
    var $width = e.detail.width,
      $height = e.detail.height,
      ratio = $width / $height;
    var viewWidth = 714,
      viewHeight = 714 / ratio;
    if (listdata[indexnum]) {
      listdata[indexnum].heightc = viewHeight;
      _this.setData({
        listdata: listdata
      })
    };
  },



})