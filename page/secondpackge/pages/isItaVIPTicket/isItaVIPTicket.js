var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '列表', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    classifyIndex:0,
    scrollleft:0,
    classifyArr:[{name:'Pangram'},{name:'Keigo'},{name:'Agathe Sorlet'},{name:'Sue Tsai'},{name:'Ingrid Ching'},{name:'the Unsent Project'},{name:'Kunel Gaur'}],
    artworkArr:[{img:'https://cdn-image02.casetify.com/usr/13600/2323600/~v70/5057523_iphone12-pro-max__color_silver_16001666.png.350x350-w.m80.jpg',productdesc:'iPhone 12 Pro Max Ultra Impact',artworkdesc:'Pink Sharks',colordesc:'15 款顏色',price:'$70 USD'},{img:'https://cdn-image02.casetify.com/usr/24206/2784206/~v111/4473988_iphone12-pro-max__color_silver_16001665.png.350x350-w.m80.jpg',productdesc:'iPhone 12 Pro Max Ultra Impact',artworkdesc:'Wild Meadow',colordesc:'15 款顏色',price:'$70 USD'},{img:'https://cdn-image02.casetify.com/usr/11624/1511624/~v46/6182791_iphone12-pro-max__color_silver_16001665.png.350x350-w.m80.jpg',productdesc:'iPhone 12 Pro Max Ultra Impact',artworkdesc:'Bed of Tulips (Clear)',colordesc:'15 款顏色',price:'$70 USD'},{img:'https://cdn-image02.casetify.com/usr/11321/2561321/~v2/12547183_iphone12-pro-max__color_silver_16001571.png.350x350-w.m80.jpg',productdesc:'iPhone 12 Pro Max Ultra Impact',artworkdesc:'Poodle coffee clear phone case for unique dog breed lovers',colordesc:'15 款顏色',price:'$70 USD'}]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var data = JSON.parse(options.data)
    // console.log(data)
    // this.data.listData = data;
    // 判断是否授权
    this.activsign();
  },
  onLoadfun:function(){
    this.setData({
      uid: app.signindata.uid,
      loginid:app.signindata.loginid,
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
        if (true) {
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
          _this.setData({
            tgabox: true,
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
    app.comjumpwxnav(9059,'','');
  },
  // 点击登录获取权限
  userInfoHandler: function (e) {
    var _this = this;
    wx.getSetting({
      success: res => {
        if (true) {
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

  getInfo(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=memberVip&operation=vipPrivilegeInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    console.log('vip特权领取数据请求======','mod=memberVip&operation=vipPrivilegeInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'member.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('vip特权领取数据======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          _this.setData({
            listData:res.data.List.vipPrerogativeStyle,
            subscribedata:res.data.Info.subscribe
          })
        }else if(res.data.ReturnCode == 201){
          app.comjumpwxnav(9059,'',''); 
        }
      }
    });
  },

  classifyChange(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let name = e.currentTarget.dataset.name;
    let ele = '#ele' + index;
    that.setData({
      classifyIndex:index,
      classifyName:index != 0?name:'',
      loadprompt:false
    })
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select(ele).boundingClientRect();
    query.exec(function(res) {
      console.log(res[0])
      that.setData({
        scrollleft:e.currentTarget.offsetLeft - wx.getSystemInfoSync().windowWidth/2 + (res[0].width/2)
      })

      // that.animationFun(that,e.currentTarget.offsetLeft,res[0].width);
    })
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
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var reshare = app.sharemc();
    return reshare
  },

  jumpsmokeboxlistPage(){
    app.comjumpwxnav(988,'','');
  },

  // 获取手机号
  getPhoneNumber: function(e) {
    var _this = this;
    console.log(e.detail.errMsg == 'getPhoneNumber: ok' || e.detail.errMsg == "getPhoneNumber:ok");
    if (e.detail.errMsg == 'getPhoneNumber: ok' || e.detail.errMsg == "getPhoneNumber:ok") {
      wx.login({
        success: function(res) {
          if (res.code) {
            _this.helpOther(res.code, e.detail.encryptedData, e.detail.iv)
          };
        }
      });
    } else {
      app.showToastC('获取手机号失败！');
      _this.setData({
        havephoneiftr: true
      })
    }
  },
  helpOther: function(code, encryptedData, iv) {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    });
    console.log('mod=subscription&operation=authMobile&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&iv=' + iv + '&encryptedData=' + encryptedData + '&code=' + code)
    var q1 = Dec.Aese('mod=subscription&operation=authMobile&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&iv=' + iv + '&encryptedData=' + encryptedData + '&code=' + code);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        wx.hideLoading()
        console.log('手机号授权提交=====',res)
        if(res.data.ReturnCode == 200){
          _this.setData({
            is_mobile_phone:true,
            mobile:res.data.List.phoneNumber
          });
          app.showToastC('获取手机号成功');
        }else{
          if(res.data.Msg){
            app.showToastC(res.data.Msg||'');
          };
        };
      },
      fail: function(res) {
        wx.hideLoading()
      }
    })
  },
})