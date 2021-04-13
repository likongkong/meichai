var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    movies:[
      {url: "https://cdn.51chaidan.com//images/toyShow3/brandGoodsRotation/20210109/20a758966d18f609bf1154f869a20168.png"},
      {url: "https://cdn.51chaidan.com//images/toyShow3/brandGoodsRotation/20210109/d97a4aff74449d2215c431a1aa679fd3.png"},
      {url: "https://cdn.51chaidan.com//images/toyShow3/brandGoodsRotation/20210109/4225651d69b29b8659b6b6a749a33e72.png"},
      {url: "https://cdn.51chaidan.com//images/toyShow3/brandGoodsRotation/20210109/7b69de7f20fdd34c68ca139cb15c1454.png"},

    ],
    detailSwiperindex:0,
    bgColor:['#ff2742','blue','#000','pink'],
    modelArray: ['请选择', '手机', '电脑', '办公用品', '生活用品', '其他'],
    modelSel:'请选择',
    modelSelInde:0,
    detailDetails:'"<p><img src="https://cdn.51chaidan.com/images/wangEditor/ecshop/20210119/f60fe65864944d2cedd0b1459ae215b9.jpg" style="max-width:100%;"><img src="https://cdn.51chaidan.com/images/wangEditor/ecshop/20210119/fbae38da0d14464971d6624c7d86b368.jpg" style="font-family:  , sans-serif, Arial, Verdana; max-width: 100%;"><img src="https://cdn.51chaidan.com/images/wangEditor/ecshop/20210119/335e9814ea345b03b8f7b8fe502354d5.jpg" style="font-family:  , sans-serif, Arial, Verdana; max-width: 100%;"><img src="https://cdn.51chaidan.com/images/wangEditor/ecshop/20210119/96159fb678d2e85ea13f13e7f6b3fc46.jpg" style="font-family:  , sans-serif, Arial, Verdana; max-width: 100%;"><img src="https://cdn.51chaidan.com/images/wangEditor/ecshop/20210119/5e359edb95c009c10e5cc1874800813e.jpg" style="font-family:  , sans-serif, Arial, Verdana; max-width: 100%;"><img src="https://cdn.51chaidan.com/images/wangEditor/ecshop/20210119/11e0f49e5d31d9a2585c02512f978752.jpg" style="font-family:  , sans-serif, Arial, Verdana; max-width: 100%;"><img src="https://cdn.51chaidan.com/images/wangEditor/ecshop/20210119/d17543eaa31d10a6f2e0ce9e36a466f9.jpg" style="font-family:  , sans-serif, Arial, Verdana; max-width: 100%;"><img src="https://cdn.51chaidan.com/images/wangEditor/ecshop/20210119/6aee1c5b0db65fedd89d6951bed92482.jpg" style="font-family:  , sans-serif, Arial, Verdana; max-width: 100%;"><img src="https://cdn.51chaidan.com/images/wangEditor/ecshop/20210119/16353389a869089e029f2ae513ee4432.jpg" style="font-family:  , sans-serif, Arial, Verdana; max-width: 100%;"><img src="https://cdn.51chaidan.com/images/wangEditor/ecshop/20210119/fbb284f175daa971bdb3cdd60eb1a3bb.jpg" style="font-family:  , sans-serif, Arial, Verdana; max-width: 100%;"><img src="https://cdn.51chaidan.com/images/wangEditor/ecshop/20210119/d2a043d19b05e174e92c53e9b75bdf36.jpg" style="font-family:  , sans-serif, Arial, Verdana; max-width: 100%;"><img src="https://cdn.51chaidan.com/images/wangEditor/ecshop/20210119/4e5ea7f7314c4d3379610a9c4cd529e2.jpg" style="font-family:  , sans-serif, Arial, Verdana; max-width: 100%;"><img src="https://cdn.51chaidan.com/images/wangEditor/ecshop/20210119/dd3c37f99a70c1dc4b313daedc2f7cd7.jpg" style="font-family:  , sans-serif, Arial, Verdana; max-width: 100%;"><img src="https://cdn.51chaidan.com/images/wangEditor/ecshop/20210119/6b9a242d03158476ffda8bdbf55f8246.jpg" style="font-family:  , sans-serif, Arial, Verdana; max-width: 100%;"></p>"'
  },
  //分类选择
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var modelArray = this.data.modelArray || [];
    this.setData({
      modelSelInde:e.detail.value,
      modelSel: modelArray[e.detail.value]
    })
  },

  swiperchangeindex: function (detail){
    this.setData({
      detailSwiperindex: detail.detail.current
    });
    if(this.data.isVideoSwiper && this.data.ishowvideo && this.data.video){
      this.closevideo();
    }
  },
  changeGoodsSwip: function (detail) {
    if (detail.detail.source == "touch") {
      if (detail.detail.current == 0) {
        let swiperError = this.data.swiperError
        swiperError += 1
        this.setData({ swiperError: swiperError })
        if (swiperError >= 3) {
          console.error(this.data.swiperError)
          this.setData({ goodsIndex: this.data.preIndex });
          this.setData({ swiperError: 0 })
        }
      } else {
        this.setData({ preIndex: detail.detail.current });
        this.setData({ swiperError: 0 })
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否授权
    this.activsign();
  },
  onLoadfun:function(){


  },
  //获取用户信息
  getUserInfo(){
    var _this = this;
    wx.login({
      success:function(){
        wx.getUserInfo({
          success: function (res) {
            _this.setData({
              avatarUrl: res.userInfo.avatarUrl,
              nickName: res.userInfo.nickName
            })
          }
        });
      }
    });
  },
  getInfo(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=memberVip&operation=vipInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'member.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('vip数据======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          var goodsDescDetails  = res.data.List.prerogativeList[0].desc.replace(/<img/gi, '<img style="width:100%;height:auto;display:block;"');
          _this.setData({
            goodsDescDetails,
            infoData:res.data.Info,
            listData:res.data.List,
            memberExpireTime:_this.formatTime(res.data.Info.memberExpireTime,'Y年M月D日')
          })
        }
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
    this.getInfo()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  clicktganone: function () {
    this.setData({ tgabox: false })
  }, 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var reshare = Dec.sharemc();
    return reshare
  },
  
})