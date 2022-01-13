var Pub = require('../../common/mPublic.js'); //aes加密解密js
var Dec = require('../../../../common/public.js'); //aes加密解密js
const app = getApp();
Page({
  data: {
    // 接口地址
    comurl: app.signindata.comurl,
    comurlpub: app.signindata.clwcomurl,
    // 图片地址
    zdyurl: Dec.zdyurl(),
    versionNumber: Pub.versionNumber(),
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,
    appNowTime: app.signindata.appNowTime,
    // 适配苹果X 
    isIphoneX: app.signindata.isIphoneX,
    // 公共默认信息
    defaultinformation: app.signindata.defaultinformation,
    shopnum: 0, 
    inputdata:'',
    textconcent:'',
    // 话题选择
    topic_id:'',
    topic_name:'',
    // 图片地址
    tempFilePaths:[],
    headhidden:true,
    masklayer: false,
    srcVideo:'',
    srcVideoUp:'',
    video_img:'',
    orderbombbox:false,
    page:1,
    myordata:[],
    user_position:0,
    relation_order:[],
    mylist:[],
    locationtitle:0,
    // 晒单数量
    dryinglistnum: 0,
    widthheight:{width:'',height:''},
    isProduce: app.signindata.isProduce,
    hiddenreturn:false,
    videolist:[],

    c_title: '发帖',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
  },
  locationfun: function (location) {},
  // 跳转定位
  jumplocation:function(){
    wx.navigateTo({
      url: "../dllocation/dllocation",
    })
  },
  //  数组去重
  distinct: function (arr) {
    var arr = arr, i, j, len = arr.length;
    for (i = 0; i < len; i++) {
      for (j = i + 1; j < len; j++) {
        if (arr[i].gid == arr[j].gid) {
          arr.splice(j, 1);
          len--;
          j--;
        }
      }
    }
    return arr;
  },
  // 选中商品
  iftrchockshop: function (w) {
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind||0;
    var myordata = this.data.myordata||[];
    myordata[ind].iftr = !myordata[ind].iftr;
    this.setData({ myordata: myordata});
  },
  loadMore:function(){
    this.orderlist(1);
  },
  orderlist:function(num){
    // 调取数据
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    var _this = this;
    var arrlist = '';
    if (num==0){
      _this.data.page = 1;
    }else{
      var page = ++_this.data.page;
      _this.data.page = page;
    };

    var _this = this;
    Pub.postRequest(_this, 'my_order', { uid: _this.data.uid, loginid: _this.data.loginid, page: _this.data.page}, function (res) {
      var arrlist = res.data.List || [];
      if (arrlist.length != 0) {
        for (var i = 0; i < arrlist.length; i++) {
          arrlist[i].iftr = false;
        };
        var mylist = _this.data.mylist || [];
        for (var f = 0; f < mylist.length; f++) {
          for (var d = 0; d < arrlist.length; d++) {
            if (mylist[f] == arrlist[d].gid) {
              arrlist[d].iftr = true;
            };
          };
        };
        if (num == 0) {
          _this.setData({
            myordata: arrlist
          });
        } else {
          var arrlistarr = _this.data.myordata.concat(arrlist);
          _this.setData({
            myordata: arrlistarr
          });
        };
        // 去重
        if (_this.data.myordata.length != 0) {
          var myordatadis = _this.data.myordata || [];
          var dismyordata = _this.distinct(myordatadis);
          _this.setData({ myordata: dismyordata });
        };
      } else {};
    });

  },
  // 订单
  orderdisplay:function(){
    this.setData({
      orderbombbox: true
    })
  },
  orderdisplaynon:function(){
    this.setData({
      orderbombbox: false
    })
  },
  chooseVideo: function () {
    var that = this
    this.setData({ hiddenreturn: false, topic_name: '', topic_id: ''});
    wx.chooseVideo({
      success: function (res) {
        that.setData({
          srcVideo: res.tempFilePath,
          widthheight:{width:res.width||0,height:res.height||0}
        });
        that.uploadvideo();
      }
    })
  },
  hidechooseVideo: function () {
    var that = this;
    this.setData({ hiddenreturn: true, topic_name: '#隐藏返现', topic_id:9 });
    wx.chooseVideo({
      success: function (res) {
        that.setData({
          srcVideo: res.tempFilePath,
          widthheight: { width: res.width || 0, height: res.height || 0 }
        });
        that.uploadvideo();
      }
    })
  },
  //上传视频 目前后台限制最大100M，以后如果视频太大可以在选择视频的时候进行压缩
  uploadvideo: function () {
    var _this = this;
    var src = this.data.src;
    _this.setData({headhidden: false,masklayer: true,})
    wx.uploadFile({
      url: Pub.comurl() + 'dryingUpload',
      filePath: _this.data.srcVideo,
      name: 'file',
      method: 'POST',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: {
        'uid': _this.data.uid,
        'loginid': _this.data.loginid,
        'type': 'video',
        'vcode': _this.data.versionNumber,
        'source': 4,
        'width': _this.data.widthheight.width||0,
        'height': _this.data.widthheight.height||0
      },
      success: function (res) {
        _this.setData({ headhidden: true, masklayer: false })
        if (res.data){
          var comurll = JSON.parse(res.data).message || '';
          var video_img = JSON.parse(res.data).video_img || '';
          if (_this.data.hiddenreturn){
            var videolist = [];
          }else{
            var videolist = _this.data.videolist || [];
          };
          if (comurll){
            videolist.push({ video_path: comurll, video_img: video_img})
            _this.setData({
              videolist: videolist
            });
          };
        };
       
      },
      fail: function () {
      }
    })
  },
  // 确定发布
  dldlConfirmPublication:function(){
    var _this = this;
    var tempFilePaths = this.data.tempFilePaths || [];
    var myordata = _this.data.myordata||[];
    var relation_order = [];
    var videolist = _this.data.videolist||[];
    if (myordata.length!=0){
      for (var i = 0; i < myordata.length;i++){
        if (myordata[i].iftr){
          relation_order.push({ order_id: myordata[i].oid, goods_id: myordata[i].gid});
        };
      };
    };
    
    if (_this.data.topic_id==''){
      app.showToastC('话题不能为空');
      return false;
    };
    if (_this.data.videolist.length == 0){
      if (tempFilePaths.length==0){
        app.showToastC('图片和视频必须上传一个');
        return false;
      };
    };

    relation_order = JSON.stringify(relation_order);
    var img_extend = JSON.stringify(tempFilePaths);
    videolist = JSON.stringify(videolist);
    var videoliststring = videolist;
    
    _this.setData({ headhidden: false, masklayer: true })

    var dataa = { uid: _this.data.uid, loginid: _this.data.loginid, title: _this.data.inputdata, introduce: _this.data.textconcent, topic_id: _this.data.topic_id, user_position: _this.data.user_position, img_extend: img_extend, relation_order: relation_order, user_position: _this.data.locationtitle, video: videoliststring, vcode: Pub.versionNumber(), source: 4  }

    wx.request({
      url: app.signindata.clwcomurl + 'addDrying',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      data: dataa,
      complete: function () {
        _this.setData({
          headhidden: true,
        });
      },
      success: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        if (res.data.ReturnCode == 200) {
          
            wx.showModal({ 
              content: '发布成功,内容待审核',
              showCancel:false,
              success: function (res) {
                app.comjumpwxnav(993,'','');
              }
            });
        } else {
          if (res.data.ReturnCode == 856){
            wx.showModal({
              content: res.data.Msg,
              showCancel: false,
              success: function (res) {
                wx.redirectTo({
                  url: "/pages/myorder/myorder?tabnum=0",
                });
              }
            });
          }else{
            app.showToastC(res.data.Msg);
          };
          _this.setData({ headhidden: true, masklayer: false })
        };
      },
      fail: function () {
        wx.hideLoading();
      }
    })
  },
  // 上传图片
  upserverimg: function () {
    let that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        for (var i = 0; i < tempFilePaths.length; i++) {
          that.uploadFile(tempFilePaths[i]);
        };
      }
    })
  },
  //上传图片文件
  uploadFile: function (filePath) {
    var _this = this;
    _this.setData({ headhidden: false, masklayer: true })
    wx.uploadFile({
      url: Pub.comurl() + 'dryingUpload',
      filePath: filePath,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      }, // 设置请求的 header
      formData: {
        'uid': _this.data.uid,
        'loginid': _this.data.loginid,
        'type': 'picture',
        'vcode': _this.data.versionNumber,
        'source':4
      },
      success: function (res) {
        _this.setData({ headhidden: true, masklayer: false })
        if (res.data) {
          if (res.statusCode == 200) {
            var tempFilePaths = _this.data.tempFilePaths || [];
            // var comurl = JSON.parse(res.data);
            var comurll = JSON.parse(res.data).message||'';
            if (comurll){
              if (tempFilePaths.length<9){
                tempFilePaths.push(comurll)
                _this.setData({ tempFilePaths: tempFilePaths });
              };
            };
          } else {
            app.showToastC(res.data);
          }
        };
      },
      fail: function (res) {
        _this.setData({ headhidden: true });
        wx.hideToast();
        app.showToastC('上传失败');
      }
    })
  },
  // 删除图片
  dldeleteimg:function(w){
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var tempFilePaths = this.data.tempFilePaths||[];
    tempFilePaths.splice(ind, 1);
    this.setData({ tempFilePaths: tempFilePaths})
  },
  // 删除视频
  dldeletevideo: function (w) {
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var videolist = this.data.videolist || [];
    videolist.splice(ind, 1);
    this.setData({ videolist: videolist });  
    if (this.data.hiddenreturn){
      if (this.data.videolist.length==0){
        this.setData({ hiddenreturn: false, topic_name: '', topic_id: '' });
      }
    }
  },
  // input 值改变
  inputChange: function (e) {
    this.setData({
      inputdata: e.detail.value
    });
  },
  bindinput: function (e) {
    this.setData({
      textconcent: e.detail.value,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoadfun:function(){
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
    });
    // 购物车数量显示
    Dec.shopnum(_this,app.signindata.comurl);
    // 订单
    _this.orderlist(0);
    // 调取晒单数量
    Dec.dryingSum(_this, app.signindata.clwcomurl);
  },
  onLoad: function (options) {
    var mylist = [];
    if (options){
      if (options.mylist){
        mylist = JSON.parse(options.mylist);
      }
    }
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      mylist: mylist||[],
      isProduce: app.signindata.isProduce,
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
            });
            // 判断是否登录
            if (_this.data.loginid != '' && _this.data.uid != '') {
              _this.onLoadfun();
            } else {
              app.signin(_this)
            }
          } else {
            // 跳转获取权限页面
            wx.navigateTo({
              url: "../../../../pages/signin/signin"
            });
          }
        }
      });
    };
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {
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
  // 导航跳转 
  wnews: function () {
    var _this = this
    app.limitlottery(_this);
  },

  // 导航跳转
  whomepage: function () {
    app.comjumpwxnav(998,'','');
  },
  wmy: function () {
    app.comjumpwxnav(9059,'','');
  },
  wshoppingCart: function () {
    app.comjumpwxnav(9058, '', '');
  },
  dlfindfun: function () {
    app.comjumpwxnav(993,'','');
  },
  jumpselection:function(){
    wx.navigateTo({
      url: "../dltopicselection/dltopicselection",
    })
  },




})