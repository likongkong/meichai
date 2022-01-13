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
    inputdataname:'',
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
    page:0,
    myordata:[],
    user_position:0,
    relation_order:[],
    mylist:[],
    locationtitle:0,
    // 晒单数量
    dryinglistnum: 0,
    widthheight:{width:'',height:''},
    isProduce: app.signindata.isProduce,
    tabdata:[],
    currencysum:'',
    stocksum:1,
    videolist: [],
    
    c_title: '兑换拆币',
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
  tabselfun:function(w){
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var tabdata = this.data.tabdata || [];
    if (tabdata[ind].iftr==0){
      tabdata[ind].iftr = 1;
    }else{
      tabdata[ind].iftr = 0;
    };
    this.setData({
      tabdata: tabdata
    });
  },
  orderlist:function(num){
    // 调取数据
    var _this = this;
    Pub.postRequest(_this, 'label_list', {uid: _this.data.uid, loginid: _this.data.loginid}, function (res) {
      var tabdata = res.data.List || [];
      if (tabdata.length!=0){
        for (var i = 0; i < tabdata.length;i++){
          tabdata[i].iftr = 0;
        };
      };
      _this.setData({
        tabdata: tabdata
      });
    });

  },
  chooseVideo: function () {
    var that = this
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
          var videolist = _this.data.videolist || [];
          if (comurll) {
            videolist.push({ video_path: comurll, video_img: video_img })
            _this.setData({
              // srcVideoUp: comurll||'',
              // video_img: video_img||''
              videolist: videolist
            });
          };
        };
       
      },
      fail: function () {}
    })
  },
  // 确定发布
  dldlConfirmPublication:function(){
    var _this = this;
    var tempFilePaths = this.data.tempFilePaths || [];
    var myordata = _this.data.myordata||[];
    var relation_order = [];
    var videolist = _this.data.videolist || [];
    if (myordata.length!=0){
      for (var i = 0; i < myordata.length;i++){
        if (myordata[i].iftr){
          relation_order.push({ order_id: myordata[i].oid, goods_id: myordata[i].gid});
        };
      };
    };

    if (tempFilePaths.length == 0) {
      app.showToastC('图片至少上传一个');
      return false;
    };
    if (_this.data.inputdataname == '') {
      app.showToastC('商品名称不能为空');
      return false;
    };
    if (_this.data.currencysum == '') {
      app.showToastC('拆币不能为空');
      return false;
    };
    if (_this.data.stocksum == '') {
      app.showToastC('商品个数不能为空');
      return false;
    };

    relation_order = JSON.stringify(relation_order);
    var img_extend = JSON.stringify(tempFilePaths);

    var tabdata = this.data.tabdata || [];
    var label = [];
    if (tabdata.length!=0){
      for (var t = 0; t < tabdata.length;t++){
        label.push({ key: tabdata[t].key, value: tabdata[t].iftr});
      };
    };
    label = JSON.stringify(label);
    videolist = JSON.stringify(videolist);
    var videoliststring = videolist;
    _this.setData({ headhidden: false, masklayer: true })
    Pub.postRequest(_this, 'addDrying', { uid: _this.data.uid, loginid: _this.data.loginid, title: _this.data.inputdata, introduce: _this.data.textconcent, user_position: _this.data.user_position, img_extend: img_extend, user_position: _this.data.locationtitle, is_drying: 'currency', currency_sum: _this.data.currencysum, stock_sum: _this.data.stocksum, goods_name: _this.data.inputdataname, label: label, video: videoliststring}, function (res) {
      _this.setData({ headhidden: true, masklayer: false })
      wx.showToast({
        title: '发布成功',
        icon: 'none',
        duration: 1500,
        complete:function(){
          app.comjumpwxnav(993,'','');
        }
      });
    },function(){
      _this.setData({ headhidden: true, masklayer: false })
    });
    
  },
  // 拆币数量
  inputChangecurrencysum:function(e){
    var curnum = parseInt(e.detail.value);
    if (curnum<=0){
      curnum = 1;
    };
    this.setData({
      currencysum: curnum
    });
  },
  // 商品库存
  inputChangestocksum:function(e){
    var curnum = parseInt(e.detail.value);
    if (curnum <= 0) {
      curnum = 1;
    };
    this.setData({
      stocksum: curnum
    });
  },
  // 上传图片
  upserverimg: function () {
    let that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'], 
      success: res => {
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
            wx.hideToast(res.data);
          }
        };
      },
      fail: function (res) {
        _this.setData({ headhidden: true });
        wx.hideToast('上传失败');
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
  },
  // input 值改变
  inputChange: function (e) {
    this.setData({
      inputdata: e.detail.value
    });
  },
  // input 商品名称 值改变
  inputChangename: function (e) {
    this.setData({
      inputdataname: e.detail.value
    });
  },
  //监听textarea值改变
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
    // 数据
    _this.orderlist();
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
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
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