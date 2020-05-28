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
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,
    appNowTime: Date.parse(new Date()),
    // 适配苹果X 
    isIphoneX: app.signindata.isIphoneX,
    // 用户id
    drying_id:'',
    // tab
    dlfhboteve: [],
    // 数据 
    listdata:[],
    // 评论列表
    commentlist:[],
    // 防止swiper卡住
    swiperError: 0,
    goodsIndex: 0,
    preIndex: 0, 
    shopnum:0,
    listdata:{},
    comment_count:0,
    inputbox:false,
    autofocus:false,
    inputboxheight:0,
    shbar:false,
    textconcent:'',
    comment_id:-1,
    defaultinformation:'',
    tgabox:false,
    location: false,
    ishowvideo:false,
    video:'',
    videoContext: '',
    // 晒单数量
    dryinglistnum: 0,
    // 是否开启了分享功能
    isShareFun: true,
    // 拆币规则框
    exchangeiftr:false,
    tipaddress:'',
    tipaid: '',
    addressdata:[],
    tipback:false,
    headhidden:true,
    isProduce: app.signindata.isProduce,
    videolist:[],

    c_title: '',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    // 生成分享图片
    snapshot: '',
    detaposiiftr: true,
    tgaimg: app.signindata.tgaimg || 'https://www.51chaidan.com/images/default/openscreen.jpg'
  },
  detaposiiftrfun: function () {
    this.setData({ detaposiiftr: !this.data.detaposiiftr });
  },
  // 生成图片
  getSnapshot:function(){
    var _this = this;
    var txtnum = '';
    if (_this.data.listdata.goodsInfo) {
      txtnum = _this.data.listdata.goodsInfo.currency_sum || '';
    };
    wx.getImageInfo({
      src: _this.data.listdata.shareImg,
      success: function (res) {
        const ctx = wx.createCanvasContext('snapshot');
        ctx.drawImage(res.path, 0, 0, 300, 300);
        ctx.draw(true)
        wx.getImageInfo({
          src: 'https://clw.51chaidan.com/images/goods/currency.png',
          success: function (res) {
            ctx.drawImage(res.path, 5, 10, 110, 30);
            ctx.draw(true);
            ctx.setFontSize(14);
            ctx.setFillStyle('#fff');
            ctx.fillText(txtnum, 44, 30);
            ctx.draw(true, setTimeout(function () {
              wx.canvasToTempFilePath({
                canvasId: 'snapshot',
                success: function (res) {
                  _this.setData({
                    snapshot: res.tempFilePath
                  })
                },
                fail: function (res) {
                },
              });
            }, 300));
          }
        })

      }
    })
  },
  previewVideo: function (w) { 
    var _this = this
    if (_this.data.videoContext) {
      _this.data.videoContext.pause();
    };
    var videonum = w.currentTarget.dataset.videonum || w.target.dataset.videonum || 0;
    _this.data.videoContext = wx.createVideoContext('myVideo' + videonum)//初始化视频组件
    if (videonum==999){
      var videolist = this.data.videolist || [];
      if (videolist && videolist.length!=0){
        for (var i = 0; i < videolist.length; i++) {
          videolist[i].ishowvideo = false;
        };
      };
      _this.setData({
        ishowvideo: true,
        video: this.data.listdata.video_path,
        videolist: videolist
      });
    }else{
      var videolist = this.data.videolist||[];
      for(var i=0;i<videolist.length;i++){
        if (i == videonum){
          videolist[i].ishowvideo = true;
        }else{
          videolist[i].ishowvideo = false;
        };           
      };
      _this.setData({
        ishowvideo: false,
        videolist: videolist,
      })  
    };
    _this.data.videoContext.play();
  },
  // 图片预览
  previewImg: function (w) {
    var index = w.currentTarget.dataset.index || w.target.dataset.index||0;
    var listdata = this.data.listdata.img_extend||[];
    var imgArr = [];
    for (var i = 0; i < listdata.length;i++){
      imgArr.push(listdata[i].img)
    };
    wx.previewImage({
      current: imgArr[index],
      urls: imgArr,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    });
  },
  // 删除
  deletedrying:function(){
    var _this = this;
    Pub.postRequest(_this, 'deleteDrying', { uid: _this.data.uid, loginid: _this.data.loginid, drying_id: _this.data.drying_id }, function (res) {
      wx.showToast({
        title: '删除成功',
        icon: 'none',
        duration: 1000,
        mask:true,
        complete: function () {
          wx.reLaunch({
            url: "/page/component/pages/dlfind/dlfind",
          });
        }
      });
    });
  },
  // 授权
  clicktga: function () {
    app.clicktga(2)
  },
  inputboxbgfun:function(){
    this.setData({ inputbox:false})
  },
  // 点击登录获取权限
  userInfoHandler: function (e) {
    var _this = this;
    if (e.detail.userInfo) { } else {
      app.clicktga()  
    };
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          _this.setData({
            tgabox: false
          });
          _this.activsign();
          // 确认授权用户统计
          app.clicktga()
        };      
      }
    });
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
            isShareFun: app.signindata.isShareFun
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this);
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
              // '没有授权 统计'
              app.userstatistics(7);
              // '没有授权'
              _this.setData({
                tgabox: true
              });
            }
          });
        }
      }
    });
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoadfun: function () {
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isShareFun: app.signindata.isShareFun,
      isProduce: app.signindata.isProduce,
    });
    _this.listdata();
    this.selectComponent("#hide").getappData()
    // 购物车数量
    Dec.shopnum(_this,app.signindata.comurl);
    var qqq = Dec.Aese('operation=info&mod=info');
    // 调取晒单数量
    Dec.dryingSum(_this, app.signindata.clwcomurl);
    // 获取默认信息
    wx.request({
      url: app.signindata.comurl + 'general.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            defaultinformation: res.data.Info,
            wxnum: res.data.Info.cs.wxid || 'meichai666666',
          });
          app.signindata.defaultinformation = res.data.Info || '';
        };
      }
    });
    // 调取收货地址
    this.nextpagediao();
  }, 
  // 阻止蒙层冒泡
  preventD() { },
  onLoad: function (options) {
    // 购物车数据显示
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      drying_id: options.drying_id||'',
      uid: app.signindata.uid,
      isShareFun: app.signindata.isShareFun
    });
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // '已经授权'
          _this.data.loginid = app.signindata.loginid;
          _this.data.openid = app.signindata.openid;
          _this.setData({
            uid: app.signindata.uid,
            isShareFun: app.signindata.isShareFun
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this)
          }
        } else {
          // 跳转获取权限页面
          _this.setData({
            tgabox: true
          });
        }
      }
    });
  },
  listdata:function(){
    var _this = this;
    _this.setData({
      appNowTime: Date.parse(new Date()),
    })
    // 发现详情
    Pub.postRequest(_this, 'dryingdetails', { uid: _this.data.uid, loginid: _this.data.loginid, drying_id:_this.data.drying_id},function (res) { 
      var listdata = res.data.List||{};
      var videolist = res.data.List.video||[];
      if (videolist && videolist.length!=0){
        for (var i = 0; i < videolist.length;i++){
          videolist[i].ishowvideo = false;
        };
      };
      if (listdata.shareimg) {
        if (listdata.shareimg.indexOf("https") < 0) {
          listdata.shareimg = listdata.shareimg.replace(/http/, 'https');
        };
      };
      listdata.iftrtip = true;
      _this.setData({
        listdata: listdata,
        videolist: videolist,
        c_title: listdata.headName ||listdata.topic_name || '晒单详情',
      });
      //,
      if (_this.data.listdata.video_img){
        _this.previewVideo({ currentTarget: { dataset: { videonum: 999 } } })
      };
      wx.setNavigationBarTitle({
        title: listdata.headName || listdata.topic_name || '晒单详情'
      });
      if (listdata.drying_type==2){
        _this.getSnapshot();
      }
    });
    // 评论
    Pub.postRequest(_this, 'commentlist', { uid: _this.data.uid, loginid: _this.data.loginid, drying_id: _this.data.drying_id }, function (res) {
      var commentlist = res.data.List.comment_list||[];
      for (var i = 0; i < commentlist.length;i++) {
        var reply_list = commentlist[i].reply_list || [];
        if (reply_list.length>=10){
          commentlist[i].iftrdisplay = false;
        }else{
          commentlist[i].iftrdisplay = true;
        };
      };
      var comment_count = res.data.List.comment_count||0;
      _this.setData({ commentlist: commentlist, comment_count: comment_count});
    });
  },
  changeGoodsSwip: function (detail) {
    var _this = this;
    if (detail.detail.source == "touch") {
      if (this.data.videoContext) {
        this.data.videoContext.pause();
      };
      //当页面卡死的时候，current的值会变成0 
      if (detail.detail.current == 0) {
        //有时候这算是正常情况，所以暂定连续出现3次就是卡了
        let swiperError = this.data.swiperError
        swiperError += 1
        this.setData({ swiperError: swiperError })
        if (swiperError >= 3) { //在开关被触发3次以上
          console.error(this.data.swiperError)
          this.setData({ goodsIndex: this.data.preIndex });//，重置current为正确索引
          this.setData({ swiperError: 0 })
        }
      } else {//正常轮播时，记录正确页码索引
        this.setData({ preIndex: detail.detail.current });
        //将开关重置为0
        this.setData({ swiperError: 0 })
      }
    }
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
  onUnload: function () {
    var _this = this;
    if (_this.data.listdata.video_path) {
      if (_this.data.videoContext){
        _this.data.videoContext.pause()
        _this.data.videoContext.stop()
      };
    }
  },
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
  onShareAppMessage: function (options) {
    var _this = this;
    Pub.postRequest(_this, 'dryingshare', { uid: _this.data.uid, loginid: _this.data.loginid, drying_id: _this.data.drying_id }, function (res) { });
    var title = _this.data.listdata.title||'';
    var topic_name = _this.data.listdata.topic_name || '';
    if (topic_name) {
      title = topic_name + '#  ' + title;
    };
    if (_this.data.listdata.drying_type == 2) {
      var shareimg = _this.data.snapshot || _this.data.listdata.shareImg || '';
    }else{
      var shareimg = _this.data.listdata.shareImg || '';
    };
    var reshare = {
      title: title || '我在美拆发现一个优质话题，你也快来看看吧!',
      path: 'page/component/pages/dlfinddetails/dlfinddetails?drying_id=' + _this.data.drying_id,
      imageUrl: shareimg || Pub.dryinglistshare(),
      success: function (res) { },
    };
    return reshare
  },
  dlfindfun: function () {
    wx.reLaunch({
      url: "/page/component/pages/dlfind/dlfind",
    })
  },
  // 导航跳转
  whomepage: function () {
    wx.reLaunch({
      url: "../../../../pages/index/index?judgeprof=2"
    })
  },
  wmy: function () {
    wx.reLaunch({
      url: "../../../../pages/wode/wode"
    });
  },
  wshoppingCart: function () {
    wx.reLaunch({
      url: "../../../../pages/shoppingCart/shoppingCart"
    });
  },
  wnews:function(){
    var _this = this;
    app.limitlottery(_this); 
  },
  // 跳转商品详情
  jumpshopdetail:function(w){
    var goods_id = w.currentTarget.dataset.goods_id || w.target.dataset.goods_id || 0;
    wx.navigateTo({
      url: "../../../../pages/detailspage/detailspage?gid=" + goods_id,
    }); 
  },
  inputboxfun:function(w){
    var comment_id = w.currentTarget.dataset.comment_id || w.target.dataset.comment_id || -1;
    var _this = this;
    _this.setData({ inputbox: true, comment_id: comment_id});
    setTimeout(function(){
      _this.setData({autofocus: true})
    },600)
  }, 
  //监听input获得焦点
  bindfocus: function (e) {
    let that = this;
    that.setData({
      inputboxheight: e.detail.height||200
    })
  },
  //监听input值改变
  bindinput: function (e) {
    this.setData({
      textconcent: e.detail.value,
    });
  },
  // 关注函数
  followfun: function (w) {
    var drying_id = w.currentTarget.dataset.drying_id || w.target.dataset.drying_id || 0;
    var is_follow = w.currentTarget.dataset.is_follow || w.target.dataset.is_follow || 0;
    var _this = this;
    Pub.postRequest(_this, 'focuonusers', { uid: _this.data.uid, loginid: _this.data.loginid, drying_uid: drying_id, is_follow: is_follow }, function (res) {
      if (is_follow==0){
        app.showToastC('关注成功')
      }else{
        app.showToastC('已取消关注')
      };
      _this.listdata();
    });
  },
  // 失去焦点
  bindblur:function(){
    this.setData({
      inputboxheight: 0,
      autofocus: false
    })
  },
  // 提交评论
  submissionfun:function(){
    var _this = this;
    _this.setData({ autofocus:false});
    _this.setData({ inputbox: false, autofocus: false });
    Pub.postRequest(_this, 'addcomment', { uid: _this.data.uid, loginid: _this.data.loginid, drying_id: _this.data.drying_id, content: _this.data.textconcent, comment_id: _this.data.comment_id}, function (res) {
      _this.setData({
        textconcent:'',
        inputboxheight:0,
        autofocus: false
      });
      wx.showModal({
        content: '评论成功,内容待审核',
        showCancel: false,
        success: function (res) { 
          _this.listdata();
        }
      });
      
    });
  },
  dlfddchimgcfun:function(w){
    var dlfddind = w.currentTarget.dataset.dlfddind || w.target.dataset.dlfddind || 0;
    var _this = this;
    var commentlist = _this.data.commentlist;
    commentlist[dlfddind].iftrdisplay = !commentlist[dlfddind].iftrdisplay;
    _this.setData({ commentlist: commentlist});
  },
  // 点赞
  ispraisefun: function (w) {
    var _this = this;
    var is_praise = w.currentTarget.dataset.is_praise || w.target.dataset.is_praise || 0;
    var drying_id = w.currentTarget.dataset.drying_id || w.target.dataset.drying_id || 0;
    var listdata = this.data.listdata;
    Pub.postRequest(_this, 'praiseDrying', { uid: _this.data.uid, loginid: _this.data.loginid, drying_id: drying_id, is_praise: is_praise }, function (res) {
      if (is_praise == 0) {
        listdata.is_praise = 1;
        listdata.praise_sum = parseInt(listdata.praise_sum) + 1;
      } else {
        listdata.is_praise = 0;
        listdata.praise_sum = parseInt(listdata.praise_sum) - 1;
      };
      _this.setData({ listdata: listdata });
    });
  },
  // 评论点赞
  ispraisefuneve: function (w) {
    var _this = this;
    var is_praise = w.currentTarget.dataset.is_praise || w.target.dataset.is_praise || 0;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var drying_id = _this.data.drying_id||0;
    var comment_id = w.currentTarget.dataset.comment_id || w.target.dataset.comment_id || 0;
    var commentlist = this.data.commentlist;
    Pub.postRequest(_this, 'praiseDrying', { uid: _this.data.uid, loginid: _this.data.loginid, drying_id: drying_id, is_praise: is_praise, comment_id: comment_id }, function (res) {
      if (is_praise == 0) {
        commentlist[ind].is_praise = 1;
        commentlist[ind].follow_sum = parseInt(commentlist[ind].follow_sum) + 1;
      } else {
        commentlist[ind].is_praise = 0;
        commentlist[ind].follow_sum = parseInt(commentlist[ind].follow_sum) - 1;
      };
      _this.setData({ commentlist: commentlist });
    });
  },
  // 评论点赞
  ispraisefuneveeve: function (w) {
    var _this = this;
    var is_praise = w.currentTarget.dataset.is_praise || w.target.dataset.is_praise || 0;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var inds = w.currentTarget.dataset.inds || w.target.dataset.inds || 0;
    var drying_id = _this.data.drying_id || 0;
    var comment_id = w.currentTarget.dataset.comment_id || w.target.dataset.comment_id || 0;
    var commentlist = this.data.commentlist;
    Pub.postRequest(_this, 'praiseDrying', { uid: _this.data.uid, loginid: _this.data.loginid, drying_id: drying_id, is_praise: is_praise, comment_id: comment_id }, function (res) {
      if (is_praise == 0) {
        commentlist[ind].reply_list[inds].is_praise = 1;
        commentlist[ind].reply_list[inds].follow_sum = parseInt(commentlist[ind].reply_list[inds].follow_sum) + 1;
      } else {
        commentlist[ind].reply_list[inds].is_praise = 0;
        commentlist[ind].reply_list[inds].follow_sum = parseInt(commentlist[ind].reply_list[inds].follow_sum) - 1;
      };
      _this.setData({ commentlist: commentlist });
    });
  },
  // 计算图片大小
  imageLoad: function (e) {
    var _this = this;
    var ind = e.currentTarget.dataset.ind || e.target.dataset.ind || 0;
    var ifvideo = e.currentTarget.dataset.ifvideo || e.target.dataset.ifvideo || 0;
    var _this = this;
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;
    if (ifvideo == 1) {
      var viewHeight = 384,           //设置图片显示宽度，
        viewWidth = 384 * ratio;
    } else {
      var viewHeight = 500,           //设置图片显示宽度，
        viewWidth = 500 * ratio;
    };      
    var listdata = this.data.listdata;
    if (viewWidth > 680) {
      viewWidth = 680;
    };
    if (ind=='ww'){
      listdata.width = viewWidth;
      _this.setData({
        listdata: listdata
      });
    }else{
      listdata.img_extend[ind].width = viewWidth;
      _this.setData({
        listdata: listdata
      })
    };
  },
  imageLoadvio: function (e) {
    var _this = this;
    var index = e.currentTarget.dataset.index || e.target.dataset.index || 0;
    var ifvideo = e.currentTarget.dataset.ifvideo || e.target.dataset.ifvideo || 0;
    var _this = this;
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;
    if (ifvideo == 1) {
      var viewHeight = 384,           //设置图片显示宽度，
        viewWidth = 384 * ratio;
    } else {
      var viewHeight = 500,           //设置图片显示宽度，
        viewWidth = 500 * ratio;
    };
    var videolist = this.data.videolist;
    if (viewWidth > 680) {
      viewWidth = 680;
    };
    videolist[index].width = viewWidth;
    _this.setData({
      videolist: videolist
    })
  },
  // 跳转主页
  jumpdlfchlimgdetail: function (w) {
    var _this = this;
    var uid = w.currentTarget.dataset.uid || w.target.dataset.uid || 0;
    var nick = w.currentTarget.dataset.nick || w.target.dataset.nick || '';
    if (_this.data.uid != uid) {
      wx.navigateTo({
        url: "/page/component/pages/dluserhomepage/dluserhomepage?uid=" + uid + "&nick=" + nick,
      });
    } else {
      wx.reLaunch({
        url: "/page/component/pages/dlpersonalhomepage/dlpersonalhomepage",
      });
    };
  },
  // 弹框显示
  locationfun:function(){
    this.setData({
      location: true
    });
  },
  // 弹框取消按钮
  apptipleftfun: function () {
    this.setData({
      location: false
    });
  },
  // 弹框确定按钮
  apptiprightfun:function(){
    this.setData({
      location: false
    });    
    this.deletedrying();
  },
  // 领取礼物
  receivegifts: function (w) {
    var _this = this;
    var drying_id = w.currentTarget.dataset.drying_id || w.target.dataset.drying_id || 0;
    var is_gift = w.currentTarget.dataset.is_gift || w.target.dataset.is_gift || 0;
    if (is_gift==2){
      var listdata = this.data.listdata;
      var title = listdata.gift_name || '';
      if (title) {
        listdata.iftrtip = !listdata.iftrtip;
        _this.setData({
          listdata: listdata
        });
      };
      return false;
    } else if(is_gift==1){
      Pub.postRequest(_this, 'receiveAwards', { uid: _this.data.uid, loginid: _this.data.loginid, drying_id: drying_id }, function (res) {
        app.showToastC(res.data.List.gift_name || '')
        _this.listdata();
      });
    }
  },
  // 兑换函数
  exchangefun:function(){
    var _this = this;
    var listdata = _this.data.listdata || {};
    if (listdata.currency_status==1){
      _this.setData({ exchangeiftr:true});
    }else{
      app.showToastC('拆币不足')
    }
  },
  dlfderdprestion:function(){
    this.setData({ exchangeiftr: false });
  },
  // 确认兑换
  payfreight: function () {
    this.setData({
      payfreightone: true,
      tipback:true,
      exchangeiftr: false
    });
  },
  // 收货地址弹框
  seladdressfun: function () {
    this.setData({
      receivingaddress: true,
    });
  },
  // 隐藏收货地址弹框
  receivingaddressfun: function () {
    this.setData({
      receivingaddress: false,
    })
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
          var q = Dec.Aese('mod=address&operation=delete&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + indid)
          wx.request({
            url: app.signindata.comurl + 'user.php' + q,
            method: 'GET',
            header: { 'Accept': 'application/json' },
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
            }
          })
        }
      }
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
      url: "/pages/newreceivingaddress/newreceivingaddress?iftrid=1"
    })
  },
  // 下一页返回调取
  nextpagediao: function () {
    var _this = this;
    //  调取收货地址
    var q = Dec.Aese('mod=address&operation=getlist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'user.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
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
        if (res.data.ReturnCode == 900) {
          app.showToastC('登陆状态有误');
        };
      }
    });
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
  // 提交订单
  payfreighplaceorder:function(){
    var _this = this;
    var addressdata = _this.data.addressdata||[];
    var tipaid = _this.data.tipaid || '';
    if (tipaid==''){
      app.showToastC('请选择地址');
      return false;
    };
    var drying_id = _this.data.drying_id||'', province = '', city = '', district = '', address = '', consignee = '', idcard = '', tel = '';
    if (addressdata.length!=0){
       for (var i = 0; i < addressdata.length;i++){
          if (addressdata[i].aid == tipaid){
            province = addressdata[i].province || '';
            city = addressdata[i].city || '';
            district = addressdata[i].district || '';
            address = addressdata[i].address || '';
            consignee = addressdata[i].consignee || '';
            idcard = addressdata[i].idcard || '';
            tel = addressdata[i].phone || '';
          }
       }
    };
    Pub.postRequest(_this, 'exchange_order', { uid: _this.data.uid, loginid: _this.data.loginid, drying_id: drying_id, province: province, city: city, district: district, address: address, consignee: consignee, idcard: idcard, tel: tel}, function (res) {
      app.showToastC('下单成功');
      _this.tipbackfun();
      _this.listdata();
    });
  },
  tipbackfun:function(){
    this.setData({
      payfreightone: false,
      tipback: false,
      exchangeiftr: false,
      receivingaddress:false
    });
  },

})