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

    ownerId: 0,

    listdata: [],

    iefwidth: 0,

    page: 0,

    tipbacktwo: false,
    buybombsimmediately: false,
    receivingaddress: false,
    pricedetailc: true,
    freight: "",
    tipaid: "",
    addressdata: "",
    tipaddress: "",
    desc: '',
    cart_id: '',
    userInfo: {},
    // 1 我的玩具柜
    ownoth: 1,
    // 数据 
    listdataown: [],
    shopnum: 0,
    dryinglistnum: 0,

    headtabid: 0,
    c_title: '潮玩种草',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    ceshi:[],
    shopdetail:{},
    movies:[],
    founder:[],
    goodslist:[],
    videoList:[],
    pictureList:[],
    idTopic:'',
    iftrputfor:true,
    bottomdetail:false,
    openretract:false,
    // 简介
    founderbrief:{},
    founderbriefiftr:false,
    // 购买商品数据
    purchasedata:{},
    crowopenweliftr:false, // 开启福利
    crowshoptip:false,//商品弹框
    shoporalon:true, // true 商品 false 单个
    receivebenefitsiftr:false,
    crowspcontxteveiftr:false,
    wft:'',
    referee:'',
    numberofdismantling:1,
    dsbframeiftr: false,
    deductLucky:100,
    userLucky:0,

    // 画布


    userinfo: {},
    QRcode_img: '',
    posterConfig: {},
    savepic: '',
    tgfrShareIftr:false,

    goodsGift:'',
    grassFragments:false,
    receiveUserInfo:'',
    grassFragmentsMore:false

  },
  grassFragmentsFun(){
    this.setData({
      grassFragments:!this.data.grassFragments
    })
  },
  // // 生成海报图片
  tgfrShareIftrFun: function () {
    this.setData({
      tgfrShareIftr: false
    })
  },
  displaysharefriend:function(){
    wx.showLoading({ title: '加载中...', mask:true});
    this.onCreatePoster() 
    this.setData({
      tgfrShareIftr:true
    });
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
    this.tgfrShareIftrFun();
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
    this.tgfrShareIftrFun();
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


  jumpdetail:function(w){
    var gid = w.currentTarget.dataset.gid || w.target.dataset.gid || 0;
    app.detailspage(gid)
  },
  // 购买数量add
  clickadd: function () {
    var _this = this;
    var purchasedata = _this.data.purchasedata;
    if(purchasedata.roleId && purchasedata.roleId>0){
      app.showToastC('该商品只能购买一个');
      return false;
    };
    var numbadd = ++this.data.numberofdismantling;
    if (numbadd > 10) {
      app.showToastC('该商品最多一次性购买10件');
      numbadd = 10;
    };
    this.setData({
      numberofdismantling: numbadd
    })
  },
  // 购买数量sub
  clicksub: function () {
    var _this = this;
    var numbadd = --this.data.numberofdismantling;
    if (numbadd <= 1) {
      numbadd = 1;
    }
    this.setData({
      numberofdismantling: numbadd,
    })
  },
  pulltgat:function(){
     this.setData({crowshoptip: !this.data.crowshoptip})
  },
  openretractfun:function(){
     this.setData({
       openretract: !this.data.openretract
     })
  },
  bottomdetailfun:function(e){
    var _this = this;
    var ind = e.currentTarget.dataset.ind || e.target.dataset.ind || 0;
    var goodslist = this.data.goodslist||[];
    if(goodslist[ind].limit!=0){
      if(goodslist[ind].countUnpack>=goodslist[ind].limit){
        _this.comshowmodal('该商品已抢购完')
        return false;
      }
    };
    if(goodslist[ind].isCanOrder){
      if(goodslist[ind].goods_desc){
        WxParse.wxParse('article', 'html', goodslist[ind].goods_desc, _this, 0);
      }else{
        WxParse.wxParse('article', 'html', '<div style="text-align:center;padding-top:35px;">暂无详情</div>', _this, 0);
      }
      _this.setData({
        bottomdetail:true,
        purchasedata: goodslist[ind],
        goodsAmount: goodslist[ind].sale,
        crowshoptip:false,
        shoporalon:true,
        numberofdismantling:1
      });
    }else{
      _this.comshowmodal('您已购买过该商品,不能再次购买')
    }

  },
  bottomdetailnone:function(){
    this.setData({bottomdetail: false});
  },
  // 计算图片大小
  imageLoadad: function (e) {
    var _this = this;
    var indexnum = e.currentTarget.dataset.indexnum || e.target.dataset.indexnum || 1;
    var $width = e.detail.width; //获取图片真实宽度
    var $height = e.detail.height;
    var ratio = $width / $height;
    if (indexnum==1){
      var ind = parseInt(e.currentTarget.dataset.ind || e.target.dataset.ind || 0);
      var viewwidth = 146 * ratio;
      var videoList = this.data.videoList;
      if (videoList[ind]) {
        videoList[ind].width = viewwidth;
        _this.setData({
          ['videoList[' + ind + '].width']: viewwidth
        })
      };
    } else if (indexnum == 2) {
      var ind = parseInt(e.currentTarget.dataset.ind || e.target.dataset.ind || 0);
      var viewwidth = 166 * ratio;
      var goodslist = this.data.goodslist;
      if (goodslist[ind]) {
        goodslist[ind].width = viewwidth;
        _this.setData({
          ['goodslist[' + ind + '].width']: viewwidth
        })
      };
    } else if (indexnum == 3) {
      var ind = parseInt(e.currentTarget.dataset.ind || e.target.dataset.ind || 0);
      var viewwidth = 146 * ratio;
      var pictureList = this.data.pictureList;
      if (pictureList[ind]) {
        pictureList[ind].width = viewwidth;
        _this.setData({
          ['pictureList[' + ind + '].width']: viewwidth
        })
      };
    } else if (indexnum == 4) {
      var ind = parseInt(e.currentTarget.dataset.ind || e.target.dataset.ind || 0);
      var num = e.currentTarget.dataset.num || e.target.dataset.num || 0;
      var viewwidth = 146 * ratio;
      var welfare = this.data.welfare;
      if (welfare[ind] && welfare[ind].listRole) {
        welfare[ind].width = viewwidth;
        _this.setData({
          ['welfare[' + ind + '].listRole[' + num + '].width']: viewwidth
        })
      };
    }

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
    });
    
    setTimeout(function () {
      _this.getdefault()
    }, 1000)
    // 领分享信息
    if (_this.data.referee && _this.data.referee != _this.data.uid && _this.data.sid){
      var w = Dec.Aese('mod=wtb&operation=shareGift&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + _this.data.id + '&share_id=' + _this.data.sid + '&share_uid=' + _this.data.referee +'&welfareType=' + _this.data.wft);
      wx.request({
        url: app.signindata.comurl + 'spread.php' + w,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {
          if (res.data.ReturnCode == 200) {
            _this.shopdetail();
            // _this.comshowmodal('领取成功');
            _this.setData({
              receiveUserInfo:res.data.Info.receiveUserInfo
            })
            _this.grassFragmentsMoreFun();
          }else{
            _this.shopdetail();
            _this.comshowmodal(res.data.Msg);
          };
        }
      });
    }else{
      _this.shopdetail();
    };
  },
  grassFragmentsMoreFun(){
     this.setData({
      grassFragmentsMore:!this.data.grassFragmentsMore
     })
  },
  shopdetail:function(){
    var _this = this;
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    _this.setData({
      movies:[],
      founder:[],
      goodslist:[],
      pictureList:[],
      videoList:[],
      welfare:[]
    });
    var qqq = Dec.Aese('mod=wtb&operation=getInfo&id=' + _this.data.id +'&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
    wx.request({
      url: app.signindata.comurl + 'spread.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading()
        console.log('列表=========',res)
        if (res.data.ReturnCode == 200) {
          var shopdetail = res.data.Info.activity;
          var movies = res.data.List.banner||[];
          var founder = res.data.List.founder||[];
          var goodslist = res.data.List.goods||[];
          var pictureList = res.data.List.pictureList||[];
          var videoList = res.data.List.videoList||[];
          var idTopic = res.data.Info.activity.idTopic||'';
          var welfare = res.data.List.welfare||[];
          _this.data.subscribedata = res.data.Info.activity.subscribe || ''; //订阅信息
          if (shopdetail.description){
            shopdetail.description = shopdetail.description.replace(/<br>/g, '\n');
          };
          _this.setData({
            shopdetail: shopdetail, 
            movies: movies,
            founder: founder,
            goodslist: goodslist,
            pictureList: pictureList,
            videoList: videoList,
            idTopic: idTopic,
            welfare: welfare
          },function(){
                var query = wx.createSelectorQuery();
                query.select('#crowspcontxteve').boundingClientRect(function (rect) {
                  if (rect.height>72){
                    _this.setData({
                      openretract:true,
                      crowspcontxteveiftr: true
                    })
                  };
                }).exec();
          });
          _this.listdata(0);
        }else{
          _this.comshowmodal(res.data.Msg)
        };
      }
    });
  },
  getdefault: function () {
    var _this = this;
    // 调取晒单数量
    Dec.dryingSum(_this, app.signindata.clwcomurl);
    var qqq = Dec.Aese('operation=info&mod=info');
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
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
        // 购物车数据显示
        Dec.shopnum(_this,app.signindata.comurl);
        _this.nextpagediao(); // 地址
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
  // 晒单列表
  listdata: function (num) {
    var _this = this;
    if (num == 0) {
      _this.data.page = 1;
      _this.setData({
        loadprompt: '加载更多.....',
        appNowTime: Date.parse(new Date()),
        listdata: [],
        nodataiftr: false
      });
    } else {
      var pagenum = parseInt(_this.data.page)
      _this.data.page = ++pagenum;
      _this.setData({
        loadprompt: '加载更多.....',
        nodataiftr: false,
        appNowTime: Date.parse(new Date())
      });
    };
    Pub.postRequest(_this, 'dryinglist', {
      uid: _this.data.uid,
      loginid: _this.data.loginid,
      page: _this.data.page,
      cat_id: 0,
      topic_id: _this.data.idTopic
    }, function (res) {
      var listdata = res.data.List || [];
      if (listdata.length != 0) {
        for (var i = 0; i < listdata.length; i++) {
          listdata[i].iftrvideo = false;
          listdata[i].iftrtip = true;
        };
        if (num == 0) {
          _this.setData({
            listdata: listdata,
            nodataiftr: true
          });
        } else {
          var ltlist = _this.data.listdata.concat(listdata);
          _this.setData({
            listdata: ltlist,
            nodataiftr: true
          });
        };
      } else {
        if (num == 0) {
          _this.setData({
            listdata: [],
            nodataiftr: true
          });
        }else{
          // _this.setData({
          //   loadprompt: '没有更多数据了',
          //   nodataiftr: true
          // });
        };
      };
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var _this = this
    _this.shopdetail()
    _this.listdata(0)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this
    _this.listdata(1)
  },
  onShow: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    var _this = this
    if (options.from == 'button') {
      var form = options.target.dataset.form||1;
      if (form==1){
        var share = {
          title: _this.data.shopdetail.name||"潮玩种草",
          path: "/page/component/pages/crowdfunding/crowdfunding?aid=" + _this.data.id + "&referee=" + _this.data.uid,
          imageUrl: _this.data.shopdetail.cover,
          success: function (res) { }
        }
      }else{
        var welfaretype = options.target.dataset.welfaretype;
        var shareid = options.target.dataset.shareid
        var share = {
          title: _this.data.shopdetail.name ||"潮玩种草",
          path: "/page/component/pages/crowdfunding/crowdfunding?aid=" + _this.data.id + "&referee=" + _this.data.uid + '&wft=' + welfaretype + '&sid=' + shareid,
          imageUrl: _this.data.shopdetail.cover,
          success: function (res) { }
        }
      }
    }else{
      var share = {
        title: _this.data.shopdetail.name ||"潮玩种草",
        path: "/page/component/pages/crowdfunding/crowdfunding?aid=" + _this.data.id + "&referee=" + _this.data.uid,
        imageUrl: _this.data.shopdetail.cover,
        success: function (res) { }
      }
    };
    return share;
  },
  // 导航跳转
  whomepage: function () {
    wx.reLaunch({
      url: "/pages/index/index?judgeprof=2"
    });
  },
  dlfindfun: function () {
    wx.reLaunch({
      url: "/page/component/pages/dlfind/dlfind",
    })
  },
  // 导航跳转 
  wnews: function () {
    var _this = this;
    app.limitlottery(_this);
  },
  wshoppingCart: function () {
    wx.redirectTo({
      url: "/pages/shoppingCart/shoppingCart"
    });
  },
  wmy: function () {
    app.signindata.iftr_mc = true;
    wx.redirectTo({
      url: "/pages/wode/wode"
    });
  },
  // 立即购买弹框
  dsbbbutclickt: function () {
    this.setData({
      tipbacktwo: true,
      dsbframeiftr:true
    });
  },
  buybombsimmediatelyfun:function(){
    var _this = this;
    this.setData({
      tipbacktwo: true,
      buybombsimmediately: true,
      dsbframeiftr: true,
      total: _this.data.goodsAmount * _this.data.numberofdismantling,
      freight: '包邮',
      freightiftr: 0,
    });
  },
  tipbacktwonum:function(){
    this.setData({
      tipbacktwo: true,
      buybombsimmediately: false,
      dsbframeiftr: true
    });
  },
  tipbacktwo: function () {
    this.setData({
      tipbacktwo: false,
      buybombsimmediately: false,
      receivingaddress: false,
      dsbframeiftr: false
    });
  },
  // 收货地址弹框
  seladdressfun: function () {
    this.setData({
      receivingaddress: true,
      addressefm:false
    });
  },
  // 隐藏收货地址弹框
  receivingaddressfun: function () {
    this.setData({
      receivingaddress: false,
    })
  },
  // 编辑地址
  jumpeditaddress: function (event) {
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
  jumpaddress: function () {
    wx.navigateTo({
      url: "/pages/newreceivingaddress/newreceivingaddress"
    })
  },
  // 阻止蒙层冒泡
  preventD() { },
  pricedetailc: function () { // 价格明细显示隐藏
    this.setData({
      pricedetailc: !this.data.pricedetailc
    })
  },
  // 金额计算
  amountcalculation: function () {
    var _this = this
    // 运费 
    var xianshi = '0.00';
    var freightiftr = '0.00';
    var amount = '0.00';
    // 商品个数
    var mcnum = _this.data.numberofdismantling||1;
    if ((this.data.defaultinformation.carriage.free || "99") != '-1') {
      var tddefcarfr = parseFloat(this.data.defaultinformation.carriage.free || "99");
      if (mcnum >= parseFloat(this.data.defaultinformation.carriage.freeMCPieces)) {
        if (this.data.defaultinformation.carriage.freeMCPieces == 1) {
          freightiftr = 0;
          xianshi = '限时包邮';
        } else {
          freightiftr = 0;
          xianshi = '商品包邮';
        };
      } else if (_this.data.goodsAmount >= tddefcarfr) {
        freightiftr = 0;
        xianshi = '满￥' + parseFloat(this.data.defaultinformation.carriage.free || "99").toFixed(2) + '包邮';
      } else {
        var tdzuncar = this.data.defaultinformation.carriage.d;
        xianshi = '￥' + parseFloat(tdzuncar).toFixed(2);
        freightiftr = parseFloat(tdzuncar);
      };
    } else {
      var tdzuncar = this.data.defaultinformation.carriage.d;
      xianshi = '￥0.00';
      freightiftr = parseFloat(tdzuncar);
    };
    this.setData({
      total: parseFloat(parseFloat(_this.data.goodsAmount) + freightiftr).toFixed(2),
      freight: xianshi,
      freightiftr: freightiftr,
    });
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
  // 删除地址
  deladdress: function (event) {
    var _this = this;
    var dat = this.data.addressdata;
    var indid = event.target.dataset.ind;
    var num = '';
    for (var i = 0; i < dat.length; i++) {
      if (dat[i].aid == indid) {
        num = i;
      }
    };
    wx.showModal({
      content: '您确定要删除这个地址吗？',
      success: function (res) {
        if (res.confirm) {
          var q = Dec.Aese('mod=address&operation=delete&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&aid='+indid)
          wx.request({
            url: app.signindata.comurl + 'user.php' + q,
            method: 'GET',
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
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
      receivingaddress: false
    });
  },
  // 买家备注
  inputChange: function (e) {
    this.setData({
      desc: e.detail.value
    });
  },
  // 运费领取
  freightfun:function(){
    var _this = this;
    if(_this.data.userLucky>=_this.data.deductLucky){
      _this.setData({
        goodsAmount: 0,
        shoporalon: false,
        tipbacktwo: true,
        buybombsimmediately: true,
        dsbframeiftr: false
      });
      this.amountcalculation()
    }else{
      app.showToastC('幸运值不足');
    }

  },
  receivebenefitsfun:function(){
    this.setData({
      receivebenefitsiftr: false
    });
  },
  receivebenefits:function(w){
    var _this = this;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind||0;
    var welfare = this.data.welfare||[];
    var order_id = welfare[ind].readyReceiveOrderId;
    this.setData({
      order_id: order_id,
      receivebenefitsiftr:true,
      shoporalon:false,
      deductLucky:welfare[ind].deductLucky||0,
      userLucky:welfare[ind].blindboxlucky||0
    });
  },
  // 提交订单
  placeorder: function () {
    var _this = this;
    // 提交订单蒙层
    _this.setData({
      suboformola: true,
    });
    if (this.data.tipaid == '') {
      app.showToastC('请选择地址');
      return false;
    };
    var aid = _this.data.tipaid;
    if (_this.data.shoporalon) {
        var purchasedata = _this.data.purchasedata;
        var roleId = purchasedata.roleId||'';
        var roleName = purchasedata.roleName||'';
        var q = Dec.Aese('mod=wtb&operation=order&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&goods_id=' + purchasedata.goods_id + '&id=' + _this.data.id + '&count=' + _this.data.numberofdismantling + '&address_id=' + aid + '&desc=' + _this.data.desc+'&roleId='+roleId+'&roleName='+roleName);
        console.log('mod=wtb&operation=order&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&goods_id=' + purchasedata.goods_id + '&id=' + _this.data.id + '&count=' + _this.data.numberofdismantling + '&address_id=' + aid + '&desc=' + _this.data.desc+'&roleId='+roleId+'&roleName='+roleName)
        var crowurl = 'spread.php' + q
    } else {
      // 只付邮费
      var oidfreesheet = [_this.data.order_id];
      oidfreesheet = JSON.stringify(oidfreesheet).replace("[", "").replace("]", "");
      var q = Dec.Aese('mod=operate&operation=drawMiandan&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=123123&aid=' + aid + '&orderId=' + oidfreesheet);
      var crowurl = 'order.php' + q
    };
    wx.request({
      url: app.signindata.comurl + crowurl,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        // 提交订单蒙层
        _this.setData({
          suboformola: false
        });
        if (res.data.ReturnCode == 200) {
          _this.setData({
            tipbacktwo: true,
            buybombsimmediately: true,
            receivingaddress: false,
            cart_id: res.data.Info.cart_id,
          });
          // 微信支付
          _this.paymentmony()
        } else {
          _this.comshowmodal(res.data.Msg)
        };
      }
    })
  },
  // 微信支付
  paymentmony: function () {
    var _this = this;
    var q = Dec.Aese('mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + _this.data.cart_id + '&xcx=1' + '&openid=' + _this.data.openid)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          // 支付完成弹框显示数据
          var payinfo = res.data.Info;
          wx.requestPayment({
            'timeStamp': res.data.Info.timeStamp.toString(),
            'nonceStr': res.data.Info.nonceStr,
            'package': res.data.Info.package,
            'signType': 'MD5',
            'paySign': res.data.Info.paySign,
            'success': function (res) {
              _this.setData({
                tipbacktwo: false,
                buybombsimmediately: false,
                suboformola: false,
                desc: '',
                goodsAmount: 0.00,
                isAllselect: false,
                isdelivergoods: true,
                addressefm:false,
                bottomdetail: false,
                founderbriefiftr: false,
                crowopenweliftr: false, // 开启福利
                crowshoptip: false,//商品弹框
                receivebenefitsiftr: false,
                dsbframeiftr:false,
                numberofdismantling:1
              });
              var cart_id = _this.data.cart_id || '0';
              setTimeout(function(){
                _this.shopdetail()
              },1000);
              app.showToastC('购买成功');
            },
            'fail': function (res) {
              _this.setData({
                tipbacktwo: false,
                buybombsimmediately: false,
                suboformola: false,
                desc: '',
                goodsAmount: 0.00,
                isAllselect: false,
                addressefm: false,
                bottomdetail: false,
                founderbriefiftr: false,
                crowopenweliftr: false, // 开启福利
                crowshoptip: false,//商品弹框
                receivebenefitsiftr: false,
                dsbframeiftr:false,
                numberofdismantling:1
              });
              _this.shopdetail()
            },
            'complete': function (res) {}
          })
        } else {
          // 提交订单蒙层
          _this.setData({
            suboformola: false
          });
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
          if (res.data.ReturnCode == 805) {
            app.showToastC('剩余库存不足');
          };
          // 判断非200和登录
          Dec.comiftrsign(_this, res, app);
        };
      }
    })
  },
  //key(需要检错的键） url（传入的需要分割的url地址）
  getSearchString: function (key, Url) {
    // 获取URL中?之后的字符
    var str = Url;
    var arr = str.split("&");
    var obj = new Object();
    // 将每一个数组元素以=分隔并赋给obj对象 
    for (var i = 0; i < arr.length; i++) {
      var tmp_arr = arr[i].split("=");
      obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
    }
    return obj[key];
  },
  // 跳转详情
  jumpdlfdetail: function (w) {
    var drying_id = w.currentTarget.dataset.drying_id || w.target.dataset.drying_id || 0;
    wx.navigateTo({
      url: "/page/component/pages/dlfinddetails/dlfinddetails?drying_id=" + drying_id,
    })
  },
  // 点赞
  ispraisefun: function (w) {
    var _this = this;
    var is_praise = w.currentTarget.dataset.is_praise || w.target.dataset.is_praise || 0;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var lid = w.currentTarget.dataset.lid || w.target.dataset.lid || 0;
    var listdata = this.data.listdata;
    if (_this.data.iftrputfor) {
      _this.data.iftrputfor = false;
      Pub.postRequest(_this, 'praiseDrying', {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        drying_id: lid,
        is_praise: is_praise
      }, function (res) {
        _this.data.iftrputfor = true;
        if (is_praise == 0) {
          listdata[ind].is_praise = 1;
          listdata[ind].praise_sum = parseInt(listdata[ind].praise_sum) + 1;
        } else {
          listdata[ind].is_praise = 0;
          listdata[ind].praise_sum = parseInt(listdata[ind].praise_sum) - 1;
        };
        _this.setData({
          listdata: listdata
        });
      });
    }
  },
  briefint:function(w){
    var _this = this;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var founder = _this.data.founder||[];
    founder[ind].description = founder[ind].description.replace(/<br>/g, '\n');
    _this.setData({
      founderbrief: founder[ind],
      founderbriefiftr:true
    })
  },
  founderbrieffun:function(){
    this.setData({
      founderbriefiftr:false
    })
  },
  // 开启福利
  crowopenwel:function(){
    this.setData({ crowopenweliftr: !this.data.crowopenweliftr})
  },
  // 领取碎片
  pickupdebris:function(w){
    var welfaretype = w.currentTarget.dataset.welfaretype || w.target.dataset.welfaretype || 0;
    var _this = this;
    var qqq = Dec.Aese('mod=wtb&operation=todaySign&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + _this.data.id + '&welfareType=' + welfaretype);
    wx.request({
      url: app.signindata.comurl + 'spread.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            goodsGift:res.data.Info.receiveGiftInfo.goodsGift
          })
          _this.grassFragmentsFun();
          _this.shopdetail();
        }else{
          _this.comshowmodal(res.data.Msg)
        };
      }
    });
  },
  // subscribefun:function(){
  //   var _this = this;
  //   // 订阅授权
  //   app.comsubscribe(_this);
  // },
  // 拉起订阅
  subscrfun: function () {
    var _this = this;
    var subscribedata = _this.data.subscribedata || '';
    if (subscribedata && subscribedata.template_id && app.signindata.subscribeif) {
      if (subscribedata.template_id instanceof Array) {
        wx.requestSubscribeMessage({
          tmplIds: subscribedata.template_id || [],
          success(res) {
            for (var i = 0; i < subscribedata.template_id.length; i++) {
              if (res[subscribedata.template_id[i]] == "accept") {
                app.subscribefun(_this, 0, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
              };
            };
            _this.data.subscribeifstat = false;
          },
          complete() {}
        })
      } else {
        wx.requestSubscribeMessage({
          tmplIds: [subscribedata.template_id || ''],
          success(res) {
            if (res[subscribedata.template_id] == "accept") {
              app.subscribefun(_this, 0, subscribedata.template_id, subscribedata.subscribe_type);
            };
          },
          complete() {
            app.showToastC('暂不支持订阅')
          }
        })
      };
    };
  },



})