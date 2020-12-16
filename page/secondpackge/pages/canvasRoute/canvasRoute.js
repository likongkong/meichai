// page/component/pages/myothertoydg/myothertoydg.js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
var Dec = require('../../../../common/public.js'); //aes加密解密js
const app = getApp();
var WxParse = require('../../../../wxParse/wxParse.js');

import Poster from '../../../../pages/wxa_plugin_canvas/poster/poster';

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
    avatarUrl: app.signindata.avatarUrl,
    appNowTime: Date.parse(new Date()),
    // 适配苹果X 
    isIphoneX: app.signindata.isIphoneX,
    defaultinformation: '',
    wxnum: '',
    shopnum: 0,
    dryinglistnum: 0,
 
    // 授权弹框
    tgabox: false,

    c_title: '潮玩种草',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,



  },

  displaysharefriend:function(){
    wx.showLoading({ title: '加载中...', mask:true});
    this.onCreatePoster() 
  },
  /**
   * 异步生成海报
   */
  onCreatePoster() {
    var that = this;
    var userInfo = app.signindata.userInfo||{};
    // 用户头像
    var uidimg = app.signindata.avatarUrl || 'https://static.51chaidan.com/images/headphoto/' + that.data.uid + '.jpg';
    if (uidimg) {
      var tdavatar = uidimg;
    } else if (path != null) {
      if (path) { var tdavatar = path; } else { var tdavatar = that.data.avatarUrl; };
    } else {
      var tdavatar = that.data.avatarUrl;
    };
    // 小程序码
    var shopdetail = that.data.shopdetail;
    // setData配置数据
    that.setData({
      posterConfig: {
        width: 700,
        height: 1000,
        debug: false,
        // pixelRatio: 1000,
        preload: false,
        hideLoading: false,
        backgroundColor: '#fff',
        blocks: [{
          x: 40,
          y: 165,
          width: 618,
          height: 540,
          backgroundColor:'#fff',
          zIndex: 1,
          borderRadius: 20,
          // borderColor: '#ccc',
          // borderWidth:4,
          boxSetShadow:{a:10,b:10,c:10,d:'#e0e0e0'}
        }],
        texts: [{
          x: 140,
          y: 64,
          baseLine: 'middle',
          text:userInfo.nickName,
          fontSize: 26,
          textAlign: 'left',
          color: '#000',
          zIndex: 1,
        },{
          x: 140,
          y: 106,
          baseLine: 'middle',
          text:'我在『美拆』发现1件新奇好物',
          fontSize: 26,
          textAlign: 'left',
          color: '#7a7f85',
          zIndex: 1,
        },{
          x: 80,
          y: 541,
          baseLine: 'middle',
          width:530,
          lineNum:2,
          lineHeight:40,
          text:shopdetail.name,
          fontSize:30,
          textAlign: 'left',
          color: '#000',
          zIndex: 2,
          fontWeight:'bold'
        },{
          x: 80,
          y: 655,
          baseLine: 'middle',
          text:'已预约: '+shopdetail.totalUnpack+' 人',
          fontSize: 26,
          textAlign: 'left',
          color: '#000',
          zIndex: 2,
        },{
          x: 270,
          y: 790,
          baseLine: 'middle',
          text:'长按小程序码',
          fontSize: 30,
          textAlign: 'left',
          color: '#c3c3c3',
          zIndex: 2,
        },{
          x: 270,
          y: 846,
          baseLine: 'middle',
          text:'进入美拆',
          fontSize: 30,
          textAlign: 'left',
          color: '#c3c3c3',
          zIndex: 2,
        },{
          x: 270,
          y: 900,
          baseLine: 'middle',
          text:'了解项目详情',
          fontSize: 30,
          textAlign: 'left',
          color: '#c3c3c3',
          zIndex: 2,
        }],
        images: [{
          x: 40,
          y: 40,
          url: uidimg,
          width: 80,
          height:80,
          zIndex: 1,
          borderRadius:80,
        },{
          x: 42,
          y: 167,
          url: shopdetail.cover,
          width: 616,
          height:313,
          zIndex: 2,
        },{
          x: 40,
          y: 740,
          url: shopdetail.qrcode,
          width: 200,
          height:200,
          zIndex: 2,
          borderRadius:200,
        }]
      }
    }, () => {
      Poster.create();
    });
  },
  onPosterFail(e){
    wx.hideLoading()

  },
  onPosterSuccess(e) {
    wx.hideLoading()
    const {
      detail
    } = e;
    console.log(detail)
    this.setData({
      savepic: detail
    })
  },
  savetoA() {
    var that = this;
    wx.getSetting({
      success(res) {
        wx.hideLoading();
        if (!res.authSetting['scope.writePhotosAlbum']) {
          //请求授权
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              //获得授权，开始下载
              that.downloadfile()
            },
            fail() {
              wx.showModal({
                title: '',
                content: '保存到系统相册需要授权',
                confirmText: '授权',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success(res) {
                        if (res.authSetting['scope.writePhotosAlbum'] === true) {
                          that.downloadfile()
                        }
                      }
                    })
                  }
                },
                fail() {
                  app.showToastC('打开设置页失败')
                }
              })
            }
          })
        } else {
          //已有授权
          that.downloadfile()
        }
      },
      fail() {
        wx.hideLoading();
        app.showToastC('获取授权失败')
      }
    })
  },
  downloadfile() {
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.savepic,
      success(res) {
        app.showToastC("保存至相册成功");
      },
      fail() {
        app.showToastC("保存至相册失败");
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否授权  
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    app.signindata.referee = options.referee || 0;
    app.signindata.activity_id = options.aid || 0;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      avatarUrl: app.signindata.avatarUrl,
      id:options.aid,
      wft: options.wft||0,
      referee:options.referee || 0,
      sid: options.sid||0
    });

    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      _this.onLoadfun();
    }else{
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // '已经授权'
            _this.data.loginid = app.signindata.loginid;
            _this.data.openid = app.signindata.openid;
            _this.setData({
              uid: app.signindata.uid,
              avatarUrl: app.signindata.avatarUrl,
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
            wx.hideLoading()
            app.userstatistics(32);
            _this.setData({
              tgabox: false,
              signinlayer: false
            });
            _this.onLoadfun();
          }
        }
      });
    };
  },
  pullupsignin: function () {
    // // '没有授权'
    this.setData({
      tgabox: true
    });
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
            signinlayer: true,
            tgabox: false
          });
          // '已经授权'
          _this.data.loginid = app.signindata.loginid,
            _this.data.openid = app.signindata.openid,
            _this.setData({
              uid: app.signindata.uid,
              avatarUrl: app.signindata.avatarUrl,
              isProduce: app.signindata.isProduce,
            });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this)
          };
        } else {
          _this.setData({
            tgabox: false,
            signinlayer: false
          });
        }
      }
    });
    if (e.detail.detail.userInfo) { } else {
      app.clicktga(8) //用户按了拒绝按钮
    };

  },

  onLoadfun: function () {
    var _this = this

    wx.hideLoading()

    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      avatarUrl: app.signindata.avatarUrl,
      defaultinformation:app.signindata.defaultinformation,
    });
    
  },

  shopdetail:function(){
    var _this = this;
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    var qqq = Dec.Aese('mod=wtb&operation=getInfo&id=' + _this.data.id +'&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
    wx.request({
      url: app.signindata.comurl + 'spread.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading()
        console.log('列表=========',res)
        if (res.data.ReturnCode == 200) {
          
        }else{
          _this.comshowmodal(res.data.Msg)
        };
      }
    });
  },

  comshowmodal:function(title){
    wx.showModal({
      title: '提示',
      content: title,
      showCancel: false,
      success: function (res) { }
    })
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
  onShow: function () {},
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
    var _this = this
    
    return Dec.sharemc();
  },

  // 阻止蒙层冒泡
  preventD() { },


})