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
    listdata:[],
    shopnum: 0,  
    defaultinformation:'',
    userdata:{},
    // 1 晒单 2 关注 3 粉丝
    tabnum:1,
    page:1,
    // 粉丝和关注
    fansfollowlist:[],
    inputdata:'',
    locationtitle:'',
    // 晒单数量
    dryinglistnum: 0,
    isProduce: app.signindata.isProduce,
    // 是否开启了分享功能
    isShareFun: true,

    c_title: '个人主页',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,


    inputbox: false,
    inputboxheight: 0,
    textconcent:'',
    noticeind: 0

  },

  inputboxfun: function (w) {
    var drying_idnotice = w.currentTarget.dataset.drying_idnotice || w.target.dataset.drying_idnotice || -1;
    var noticeind = w.currentTarget.dataset.noticeind || w.target.dataset.noticeind || 0;
    var _this = this;
    _this.setData({ inputbox: true, drying_idnotice: drying_idnotice, noticeind: noticeind });
    setTimeout(function () {
      _this.setData({ autofocus: true })
    }, 600)
  },
  inputboxbgfun: function () {
    this.setData({ inputbox: false })
  },
  //监听input获得焦点
  bindfocus: function (e) {
    let that = this;
    that.setData({
      inputboxheight: e.detail.height || 200
    })
  },
  //监听input值改变
  bindinput: function (e) {
    this.setData({
      textconcent: e.detail.value,
    });
  },
  // 失去焦点
  bindblur: function () {
    this.setData({
      inputboxheight: 0,
      autofocus: false
    })
  },
  // 提交评论
  submissionfun: function () {
    var _this = this;
    _this.setData({ autofocus: false });
    _this.setData({ inputbox: false, autofocus: false });
    Pub.postRequest(_this, 'addcomment', { uid: _this.data.uid, loginid: _this.data.loginid, drying_id: _this.data.drying_idnotice, content: _this.data.textconcent }, function (res) {
      var listdata = _this.data.listdata || [];
      var drying_idnotice = _this.data.drying_idnotice || '';
      var noticeind = _this.data.noticeind || 0;
      if (listdata && listdata.length != 0 && listdata[noticeind]) {
        if (listdata[noticeind].id == drying_idnotice) {
          if (listdata[noticeind].commentList) {
            listdata[noticeind].commentList.push({ headphoto: app.signindata.avatarUrl, content: _this.data.textconcent || '' });
            _this.setData({ listdata: listdata })
          } else {
            listdata[noticeind].commentList = [{ headphoto: app.signindata.avatarUrl, content: _this.data.textconcent || '' }];
            _this.setData({ listdata: listdata })
          };
        };
      };
      _this.setData({
        textconcent: '',
        inputboxheight: 0,
        autofocus: false
      });
      wx.showModal({
        content: '评论成功,内容待审核',
        showCancel: false,
        success: function (res) {}
      });
      // _this.listdata(0);
    });
  },
  // 定位
  locationfun: function (location) {
    var location = location ||0;
    var _this = this;
    if (location==0){
      _this.setData({ locationtitle: '未知星球' })
    }else{
      _this.setData({locationtitle: location})
    }
    Pub.postRequest(_this, 'upUserinfor', { uid: _this.data.uid, loginid: _this.data.loginid, position: location }, function (res) {
      app.showToastC('修改成功')
    });
  },
  // 失去焦点
  bindblur: function () {
    var _this = this;
    if (this.data.inputdata == this.data.userdata.comment){return false;};
    Pub.postRequest(_this, 'upUserinfor', { uid: _this.data.uid, loginid: _this.data.loginid, introduce:_this.data.inputdata }, function (res) {
      app.showToastC('修改成功')
    });
  },
  // tab 切换
  tabswitch:function(w){
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 1;
    this.setData({ tabnum:ind});
    // 粉丝和关注
    this.fansfollowlist(0);
  },
  // input 值改变
  inputChange: function (e) {
    this.setData({
      inputdata: e.detail.value
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      isProduce: app.signindata.isProduce,
      isShareFun: app.signindata.isShareFun
    });

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
            wx.navigateTo({
              url: "../../../../pages/signin/signin"
            });
          }
        }
      });
    };
  },
  onLoadfun: function () {
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      isProduce: app.signindata.isProduce,
      defaultinformation:app.signindata.defaultinformation,
      isShareFun: app.signindata.isShareFun
    });
    this.selectComponent("#hide").getappData();

    if(this.data.defaultinformation){}else{
      app.defaultinfofun(this);
    }

    // 晒单列表
    _this.listdata(0);
    // 用户数据
    _this.userdata();
  },
  getUserProfile(){
    var _this = this;
    app.getUserProfile(()=>{
      // 晒单列表
      _this.listdata(0);
      // 用户数据
      _this.userdata();      
    })
  },
  // 晒单列表
  listdata: function (num) {
    var _this = this;
    if (num == 0) {
      _this.setData({ page: 1, loadprompt: '加载更多.....', appNowTime: Date.parse(new Date()), });
    } else {
      var pagenum = parseInt(_this.data.page)
      _this.setData({ page: ++pagenum, loadprompt: '加载更多.....', appNowTime: Date.parse(new Date()), });
    };
    Pub.postRequest(_this, 'dryinglist', { uid: _this.data.uid, loginid: _this.data.loginid, page: _this.data.page, homepage:1, user_id: '' }, function (res) {
      var listdata = res.data.List || [];
      if (listdata.length != 0) {
        for(var i=0;i<listdata.length;i++){
          listdata[i].iftrtip = true;
        };
        if (num == 0) {
          _this.setData({ listdata: listdata });
        } else {
          var ltlist = _this.data.listdata.concat(listdata);
          _this.setData({ listdata: ltlist });
        };
      } else {
        app.showToastC('暂无更多数据');
        _this.setData({ loadprompt: '没有更多数据了' });
      };
    });
  },
  // 用户数据
  userdata: function () {
    var _this = this;
    var data = { uid: _this.data.uid, loginid: _this.data.loginid, user_status: 'personal', user_id: '' };
    Pub.postRequest(_this, 'homepageNav', data, function (res) {
      var listdata = res.data.List||{};
      if (listdata){
        _this.setData({
          userdata:listdata,
          inputdata: listdata.comment||'',
          locationtitle: listdata.position||''
        }) 
      }
    });
  },
  // 跳转定位
  jumplocation: function () {
    wx.navigateTo({
      url: "../dllocation/dllocation",
    })
  },
  // 粉丝和关注
  fansfollowlist:function(num){
    var _this = this;
    if (num == 0) {
      _this.setData({ page: 1, loadprompt: '加载更多.....' });
    } else {
      var pagenum = parseInt(_this.data.page)
      _this.setData({ page: ++pagenum, loadprompt: '加载更多.....' });
    };
    if (_this.data.tabnum == 1){
      return false;
    }else if (_this.data.tabnum==2){
      var data = { uid: _this.data.uid, loginid: _this.data.loginid, nav_type: 'follow', page: _this.data.page};
    } else if (_this.data.tabnum==3){
      var data = { uid: _this.data.uid, loginid: _this.data.loginid, nav_type: 'fans', page: _this.data.page};
    };
    Pub.postRequest(_this, 'fansfollowlist', data, function (res) {
      var listdata = res.data.List || [];
      _this.setData({
        fansfollowlist: listdata
      });
    });
  },
  // 跳转用户主要
  jumpuserhomepage:function(w){
    var uid = w.currentTarget.dataset.uid || w.target.dataset.uid || 0;
    var nick = w.currentTarget.dataset.nick || w.target.dataset.nick || 0;
    wx.navigateTo({
      url: "/page/component/pages/dluserhomepage/dluserhomepage?uid=" + uid + "&nick=" + nick,
    })
  },
  // 跳转详情
  jumpdlfdetail: function (w) {
    var drying_id = w.currentTarget.dataset.drying_id || w.target.dataset.drying_id || 0;
    wx.navigateTo({
      url: "../dlfinddetails/dlfinddetails?drying_id=" + drying_id,
    })
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
  onReachBottom: function () {
    if (this.data.tabnum==1){
      this.listdata(1);
    } else if (this.data.tabnum == 2 || this.data.tabnum == 3){
      this.fansfollowlist(1);
    };
  },
  // 点赞
  ispraisefun: function (w) {
    var _this = this;
    var is_praise = w.currentTarget.dataset.is_praise || w.target.dataset.is_praise || 0;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var lid = w.currentTarget.dataset.lid || w.target.dataset.lid || 0;
    var listdata = this.data.listdata;
    Pub.postRequest(_this, 'praiseDrying', { uid: _this.data.uid, loginid: _this.data.loginid, drying_id: lid, is_praise: is_praise }, function (res) {
      if (is_praise == 0) {
        listdata[ind].is_praise = 1;
        listdata[ind].praise_sum = parseInt(listdata[ind].praise_sum) + 1;
      } else {
        listdata[ind].is_praise = 0;
        listdata[ind].praise_sum = parseInt(listdata[ind].praise_sum) - 1;
      };
      _this.setData({ listdata: listdata });
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareTimeline:function(){
    return {
      title:'潮玩社交平台',
      query:{}    
    }
  },
  onShareAppMessage: function (options) {
    // 发现详情
    var _this = this;
    if (false) {
      var drying_id = options.target.dataset.drying_id;
      var title = options.target.dataset.title||'';
      var shareimg = options.target.dataset.shareimg || '';
      var topic_name = options.target.dataset.topic_name || '';
      if (topic_name) {
        title = topic_name + '#  ' + title;
      };
      if (shareimg) {
        if (shareimg.indexOf("https") < 0) {
          shareimg = shareimg.replace(/http/, 'https');
        };
      };
      Pub.postRequest(_this, 'dryingshare', { uid: _this.data.uid, loginid: _this.data.loginid, drying_id: drying_id }, function (res) { });
      var reshare = {
        title: title,
        path: 'page/component/pages/dlfinddetails/dlfinddetails?drying_id=' + drying_id,
        imageUrl: shareimg,
        success: function (res) { },
      };
    } else {
      var reshare = app.sharemc();
    };
    return reshare
  },
  // 导航跳转 
  wnews: function () {
    var _this = this
    app.limitlottery(_this);
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
  dlfindfun: function () {
    wx.reLaunch({
      url: "/page/component/pages/dlfind/dlfind",
    })
  },
  personalhomepage: function () {
    wx.navigateTo({
      url: "/page/component/pages/dldlcreate/dldlcreate",
    })
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
    }
    listdata[ind].width = viewWidth;
    _this.setData({
      listdata: listdata
    })
  },
  // 领取礼物
  receivegifts: function (w) {
    var _this = this;
    var drying_id = w.currentTarget.dataset.drying_id || w.target.dataset.drying_id || 0;
    var is_gift = w.currentTarget.dataset.is_gift || w.target.dataset.is_gift || 0;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    if (is_gift == 2) {
      var listdata = this.data.listdata;
      var title = listdata[ind].gift_name || '';
      if (title) {
        listdata[ind].iftrtip = !listdata[ind].iftrtip;
        _this.setData({
          listdata: listdata
        });
      };
      return false;
    } else if (is_gift == 1) {
      Pub.postRequest(_this, 'receiveAwards', { uid: _this.data.uid, loginid: _this.data.loginid, drying_id: drying_id }, function (res) {
        app.showToastC(res.data.List.gift_name || '');
        setTimeout(function () {
          _this.listdata(0)
        }, 2000);
      });
    }
  },
})