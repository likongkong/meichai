var Dec = require('../../common/public.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '', 
    c_arrow: true,
    c_backcolor: '',
    statusBarHeightMc:wx.getStorageSync('statusBarHeightMc')?wx.getStorageSync('statusBarHeightMc')-44:90,
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,

    movies:[
      {
        image: "https://cdn.51chaidan.com//images/brandEntry/abbreviation/20200710/812c1f02fde1fde61be8b4afd48a4e70.jpg",
        item_type: "1",
        title: "标题",
        type: "1",
        price: "6789"
      },
      {
        image: "https://cdn.51chaidan.com//images/brandEntry/abbreviation/20200710/86c7acad56ba574a0f1387c477b04129.jpg",
        item_type: "2",
        title: "咪咪嘎嘎吊卡",
        type: "2",
        price: "12345"        
      }
    ],
    // 订阅上传id
    pid:0,
    page:0,
    liveind:0,
    goodsListThree:[],
    goodsListTwo:[],
    goodsListOne:[],
    liveListData:[],
    typeEve:1,
    indexEve:0
  },
  // banner 跳转
  jumpbanner: function (w) {
    var whref = w.currentTarget.dataset.href || w.target.dataset.href;
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type||0;
    var imgurl = w.currentTarget.dataset.imgurl || w.target.dataset.imgurl || '';
    var wname = w.currentTarget.dataset.title || w.target.dataset.title || '美拆'; 
    // 公共跳转
    app.comjumpwxnav(item_type, whref, wname, imgurl);

  },
  auditversion:function(){
     this.onLoadfun();
  },
  // 每一个拉起订阅
  evesubscrfun:function(w){
    var _this = this;
    var eveid = w.currentTarget.dataset.eveid || w.target.dataset.eveid||1;
    var type = w.currentTarget.dataset.type || w.target.dataset.type||1;
    var index = w.currentTarget.dataset.index || w.target.dataset.index||0;
    var subscribedata = '';
    if(type==1){
       var goodsListOne = _this.data.goodsListOne;
       subscribedata = goodsListOne.toyShowSubscribe || '';
    }else if(type==2){
      var goodsListTwo = _this.data.goodsListTwo;
      subscribedata = goodsListTwo.toyShowSubscribe || '';
    }else if(type==3){
      var goodsListThree = _this.data.goodsListThree;
      subscribedata = goodsListThree.toyShowSubscribe || '';
    };
    _this.setData({
      subscribedata:subscribedata,
      id:eveid,
      typeEve:type,
      indexEve:index
    });
    _this.subscrfun();
  },
  // 拉起订阅
  subscrfun: function () {
    var _this = this;
    var subscribedata = _this.data.subscribedata || '';
    if (subscribedata && subscribedata.template_id && app.signindata.subscribeif) {
      if (subscribedata.template_id instanceof Array) {
        wx.requestSubscribeMessage({
          tmplIds: subscribedata.template_id || [],
          success(res) {
            var is_show_modal = true;
            for (var i = 0; i < subscribedata.template_id.length; i++) {
              if (res[subscribedata.template_id[i]] == "accept") {
                app.subscribefun(_this, 0, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
                if (is_show_modal) {
                  _this.subshowmodalfun();
                  is_show_modal = false;
                };
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
              _this.subshowmodalfun();
            };
          }
        })
      };
    };
  },
  subshowmodalfun: function () {
    var _this = this;
    // wx.showModal({
    //   // title: '提示',
    //   content: '订阅成功',
    //   showCancel: false,
    //   success: function (res) {
          var typeEve = _this.data.typeEve || 1;
          var indexEve = _this.data.indexEve || 0;
          console.log(typeEve,indexEve)
          if(typeEve==1){
              var goodsListOne = _this.data.goodsListOne;
              _this.setData({
                 ['goodsListOne.goodsList['+indexEve+'].is_subscribe']: 1
              })
          }else if(typeEve==2){
            var goodsListTwo = _this.data.goodsListTwo;
            _this.setData({
                 ['goodsListTwo.goodsList['+indexEve+'].is_subscribe']: 1
            })
          }else if(typeEve==3){
            var goodsListThree = _this.data.goodsListThree;
            _this.setData({
                ['goodsListThree.goodsList['+indexEve+'].is_subscribe']: 1
            })
          };
          
      // }
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.signindata.sceneValue==1154){
      this.onLoadfun();
    }else{
      // 判断是否授权
      this.activsign();
    }

  },
  onLoadfun:function(){
    console.log('123')
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      avatarUrl: app.signindata.avatarUrl,
      isShareFun: app.signindata.isShareFun,
      isProduce: app.signindata.isProduce
    });

    _this.brandinformation(1);
    // 线上
    _this.commodityinformation(1,1);
    // blibli
    _this.commodityinformation(1,2);
    // 直播商品
    _this.commodityinformation(1,3)
    // 直播列表
    _this.liveList(1)
  },
  // 直播信息  
  liveList:function(num){
    var _this = this
    wx.showLoading({
      title: '加载中...',
    })
    if (num==1){
      _this.data.liveind = 0;
    }else{
      var pagenum = _this.data.liveind;
      _this.data.liveind = ++pagenum;
    };


    var q1 = Dec.Aese('mod=subscription&operation=liveList&pid=' + _this.data.liveind );
    console.log('mod=subscription&operation=brandList&pid=' + _this.data.liveind)

    wx.request({
      url: app.signindata.comurl + 'toy.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        console.log('直播列表=====',res)
        wx.stopPullDownRefresh();
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          if(num==1){
            var liveListData = res.data.List.liveList || [];
            _this.setData({
              liveListData:liveListData
            })
          }else{
            var liveList = res.data.List.liveList || [];
            console.log('品牌信息=======2',res)
            var liveListData = _this.data.liveListData.concat(liveList);
            _this.setData({
              liveListData:liveListData
            })
          };
        };
      },

    })
},

  // 品牌信息
  brandinformation:function(num){
      var _this = this
      wx.showLoading({
        title: '加载中...',
      })
      if (num==1){
        _this.data.pid = 0;
      }else{
        var pagenum = _this.data.pid;
        _this.data.pid = ++pagenum;
      };
      var q1 = Dec.Aese('mod=subscription&operation=brandList&type=1&pid=' + _this.data.pid );
      console.log('mod=subscription&operation=brandList&type=1&pid=' + _this.data.pid)
      wx.request({
        url: app.signindata.comurl + 'toy.php' + q1,
        method: 'GET',
        header: {'Accept': 'application/json'},
        success: function(res) {
          console.log('品牌信息=====',res)
          wx.stopPullDownRefresh();
          wx.hideLoading()
          if (res.data.ReturnCode == 200) {
            if(num==1){
              var bannerList = res.data.List.bannerList || [];
              var brandList = res.data.List.brandList || [];
              _this.setData({
                bannerList:bannerList,
                brandList:brandList
              })
            }else{
              var brandList = res.data.List.brandList || [];
              if(brandList&&brandList.length!=0){
                console.log('品牌信息=======2',res)
                var comdataarr = _this.data.brandList.concat(brandList);
                _this.setData({
                  brandList:comdataarr
                })
              }else{
                app.showToastC('没有更多数据了');
              };
            }

          };
        },
  
      })
  },
  // 商品信息 type 1为线上 2为blibli 3为直播
  commodityinformation:function(num,type){
      var _this = this
      wx.showLoading({
        title: '加载中...',
      })
      var q1 = Dec.Aese('mod=subscription&operation=goodsList&type=' + type + "&pid=" + _this.data.page + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid );
      console.log('mod=subscription&operation=goodsList&type=' + type + "&pid=" + _this.data.page)
      wx.request({
        url: app.signindata.comurl + 'toy.php' + q1,
        method: 'GET',
        header: {'Accept': 'application/json'},
        success: function(res) {
          console.log('商品信息====='+type,res)
          wx.stopPullDownRefresh();
          wx.hideLoading()
          if (res.data.ReturnCode == 200) {
            // 商品信息 type 1为线上 2为blibli 3为直播
             if(type==1){
                if(num==1){
                  var toyShowSubscribe = res.data.Info.toyShowSubscribe || {};
                  var goodsList = res.data.List.goodsList || [];
                  var goodsListOne = {
                    toyShowSubscribe:toyShowSubscribe,
                    goodsList:goodsList
                  };
                  _this.setData({
                    goodsListOne:goodsListOne
                  })
                }else{
                  var goodsList = res.data.List.goodsList || [];
                  if(goodsList&&goodsList.length!=0){
                    var goodsListOne =  _this.data.goodsListOne;
                    var goodsListAnd = goodsListOne.goodsList.concat(goodsList);
                    goodsListOne.goodsList = goodsListAnd;
                    _this.setData({
                      goodsListOne:goodsListOne
                    })
                    console.log(_this.data.goodsListOne)
                  };
                };

             };
             if(type==2){
                if(num==1){
                  var toyShowSubscribe = res.data.Info.toyShowSubscribe || {};
                  var goodsList = res.data.List.goodsList || [];
                  var goodsListTwo = {
                    toyShowSubscribe:toyShowSubscribe,
                    goodsList:goodsList
                  };
                  _this.setData({
                    goodsListTwo:goodsListTwo
                  })
                }else{
                  var goodsList = res.data.List.goodsList || [];
                  if(goodsList&&goodsList.length!=0){
                    var goodsListTwo =  _this.data.goodsListTwo;
                    var goodsListAnd = goodsListTwo.goodsList.concat(goodsList);
                    goodsListTwo.goodsList = goodsListAnd;
                    _this.setData({
                      goodsListTwo:goodsListTwo
                    })
                  };
                };
             };
             if(type==3){
                if(num==1){
                    var toyShowSubscribe = res.data.Info.toyShowSubscribe || {};
                    var goodsList = res.data.List.goodsList || [];
                    var goodsListThree = {
                      toyShowSubscribe:toyShowSubscribe,
                      goodsList:goodsList
                    };
                    _this.setData({
                      goodsListThree:goodsListThree
                    })
                }else{
                    var goodsList = res.data.List.goodsList || [];
                    if(goodsList&&goodsList.length!=0){
                      var goodsListThree =  _this.data.goodsListTwo;
                      var goodsListAnd = goodsListThree.goodsList.concat(goodsList);
                      goodsListThree.goodsList = goodsListAnd;
                      _this.setData({
                        goodsListThree:goodsListThree
                      })
                    };
                };
             };
          };
        },

      })
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
        if (res.authSetting['scope.userInfo']) {
          // '已经授权'
          _this.setData({
            loginid: app.signindata.loginid,
            uid: app.signindata.uid,
            openid: app.signindata.openid,
            avatarUrl: app.signindata.avatarUrl,
            isShareFun: app.signindata.isShareFun,
            isProduce: app.signindata.isProduce,
            signinlayer: true,
            tgabox: false
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this);
          }
        } else {
          console.log(11111111111111111111111111111)
          _this.setData({
            tgabox: false,
            signinlayer: false
          })
          console.log()
          // '没有授权 统计'
          app.userstatistics(42);
          _this.onLoadfun();
        }
      }
    });      
  },
  // 授权点击统计
  clicktga: function () {
    app.clicktga(2)
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
            signinlayer: true,
            tgabox: false
          });
          _this.activsign();
          // 确认授权用户统计
          app.clicktga(4);          
        }
      }
    });
    if (e.detail.detail.userInfo) { } else {
      app.clicktga(8)  //用户按了拒绝按钮
    };
  },
  pullupsignin: function () {
    // // '没有授权'
    this.setData({
      tgabox: true
    });
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
    var _this = this;
    _this.data.page = 0;
    _this.brandinformation(1);
    // 线上
    _this.commodityinformation(1,1);
    // blibli
    _this.commodityinformation(1,2);
    // 直播商品
    _this.commodityinformation(1,3)
    // 直播列表
    _this.liveList(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // var _this = this;
    // var pagenum = _this.data.page;
    // _this.data.page = ++pagenum;
    // // 线上
    // _this.commodityinformation(2,1);
    // // blibli
    // _this.commodityinformation(2,2);
    // // 直播
    // _this.commodityinformation(2,3)
    // _this.brandinformation(2);
  },
  clicktganone: function () {
    this.setData({ tgabox: false })
  }, 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this;
    var img = 'https://cdn.51chaidan.com/images/default/toyShow/toyshowShare.jpg';
    return {
      title: 'Bilibiliworld x MCTS 8.7~8.9 不见不散，超多展品不要错过',
      imageUrl: img
    }    
  },
  onShareTimeline:function(){
    var _this = this;
    var img = 'https://cdn.51chaidan.com/images/default/toyShow/toyshowShare.jpg';
    return {
      title:'Bilibiliworld x MCTS 8.7~8.9 不见不散，超多展品不要错过',
      imageUrl: img
    }
  },  
})