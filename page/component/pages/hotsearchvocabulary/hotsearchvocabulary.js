var Dec = require('../../../../common/public.js');//aes加密解密js
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
    hotdata:[],  
    hotdatahis:[],
    inputdata:'',
    iftr:true, 
    inputtxt1: '想要找点什么',
    hotdatalist:[],
    searchtip:'',
    iftrsearchtip: false,

    c_title: '搜索',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    windowHeight: app.signindata.windowHeight - 65 - wx.getStorageSync('statusBarHeightMc') || 0,
    signinlayer: true,
  },
  onFocus: function (w) {
    this.setData({
      inputtxt1: " "
    });
  },
  onBlur: function (w) {
    this.setData({
      inputtxt1: "想要找点什么"
    });
  },
  sscloseFun(){
    setTimeout(()=>{
      this.setData({ inputdata: '' });
    },200)
  },
  // 跳转搜索
  jump:function(event){
    var _this = this;
    var hot = event.currentTarget.dataset.hot || event.target.dataset.hot || '';
    
    var hotdatalist = app.signindata.searchSkipKeyword || [];
    var iftradopt = false;
    var keyname = hot;
    for (var i = 0; i < hotdatalist.length; i++) {
      if (keyname == hotdatalist[i].name) {
        if (hotdatalist[i].type == 1) {
          wx.navigateTo({
            url: hotdatalist[i].url
          });
          iftradopt = true;
        } else if (hotdatalist[i].type == 2) {
          _this.setData({
            searchtip: hotdatalist[i].url,
            iftrsearchtip: true
          });
          iftradopt = true;
        };
      };
    };
    if (iftradopt) {
      return false;
    };
    setTimeout(function(){
      wx.navigateTo({
        url: "/page/component/pages/search/search?hot=" + hot
      });
    },100);
  },
  jumpsoousuo: function (event) {
    var hot = this.data.inputdata || '';
    // if (this.data.inputdata == '') {
    //   app.showToastC('搜索内容不能为空');
    //   return false;
    // };
    var _this = this;
    wx.getStorage({ 
      key: 'hotdatahis',
      success: function (res) {
        var rd = res.data||[];
        if (rd){
          if (rd.length!=0){
              var iftr = true;
              for (var i = 0; i < rd.length;i++){
                 if (rd[i] == _this.data.inputdata){
                   iftr =false;
                  }
               };
               if (iftr){
                 rd.unshift(_this.data.inputdata);
                 if(rd.length>=13){
                    rd.splice(12)
                 };
                 wx.setStorage({
                   key: "hotdatahis",
                   data: rd 
                 }) 
               }
           }else{
             wx.setStorage({
               key: "hotdatahis",
               data: [_this.data.inputdata]
             })             
           }
        }
      },
      fail:function(){
        wx.setStorage({
          key: "hotdatahis",
          data: [_this.data.inputdata]
        })         
      }
    });    
   setTimeout(function(){
     let hot1 = _this.data.inputdata?hot:_this.data.inputtxt1;
     wx.navigateTo({
       url: "/page/component/pages/search/search?hot=" + hot1
     });
   },100);

  },  
  // input 值改变
  inputChange: function (e) {
    this.setData({
      inputdata: e.detail.value
    });
  }, 
  //  删除记录
  celdel:function(){
    wx.setStorage({
      key: "hotdatahis",
      data:[]
    });
    this.setData({
      hotdatahis:[]
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoadfun: function () {
    var _this = this;
    this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid
    });
    this.selectComponent("#hide").getappData()
  },  
  onLoad: function (options) {
    var _this = this;
    let hotKeyword =app.signindata.hotKeyword[Math.floor(Math.random()*app.signindata.hotKeyword.length)];
    this.setData({
      inputtxt1:app.signindata.hotKeyword.length!=0?hotKeyword:_this.data.inputtxt1
    });
    wx.getStorage({
      key: 'hotdatahis',
      success: function (res) {
        if (res.data) {
             _this.setData({
               hotdatahis: res.data
             });
        }
      }
    })    
    this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid
    });    

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          _this.setData({
            signinlayer: true,
          })
        } else {
          this.setData({
            signinlayer: false,
          })
        }
      }
    });
  
    var q = Dec.Aese('mod=getinfo&operation=list&type=hot')
    wx.request({
      url: app.signindata.comurl + 'search.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.List){
          _this.setData({
            hotdata: res.data.List,
            hotdatalist: res.data.Navi || []
          });
        }
      },
      fail: function () {
        // fail
      }
    })    
  },

  // 授权点击统计
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
            isProduce: app.signindata.isProduce,
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var _this = this;
    wx.getStorage({
      key: 'hotdatahis',
      success: function (res) {
        if (res.data) {
          _this.setData({
            hotdatahis: res.data
          });
        }
      }
    })    
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
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
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
    return Dec.sharemc()    
  },
  iftrsearchtipfun: function () {
    this.setData({
      iftrsearchtip: false
    });
  },

  pullupsignin: function () {
    // // '没有授权'
    this.setData({
      tgabox: true
    });
  },


})