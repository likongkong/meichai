
var Dec = require('../../../../common/public');//aes加密解密js
var api = require("../../../../utils/api.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '消息',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    xScale: 0,
    windowHeight: app.signindata.windowHeight - 15 - wx.getStorageSync('statusBarHeightMc') || 0,
    conversationList:[
      {
        avatar:'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_15.png',
        unreadCount:5,
        conversationName:'用户昵称昵称昵称昵称昵称',
        timeago:'12-12 15:23',
        messageForShow:'测试测试测试测试测试测试测试测试测试测试',
      },
      {
        avatar:'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_15.png',
        unreadCount:115,
        conversationName:'名称',
        timeago:'12-12 15:23',
        messageForShow:'测试测试测试测试测试测试测试测试',
      },
      {
        avatar:'https://web.sdk.qcloud.com/component/TUIKit/assets/avatar_15.png',
        unreadCount:0,
        conversationName:'名称',
        timeago:'12-12 15:23',
        messageForShow:'测试测试测试测试测',
      },
    ]
  },
  deleteConversation() {
    wx.showModal({
      content: '确认删除会话？',
      success: (res) => {
        if (res.confirm) {
          wx.$TUIKit.deleteConversation(this.data.conversation.conversationID)
          this.setData({
            conversation: {},
            xScale: 0,
          })
        }
      },
    })
  },
  handleTouchMove(e) {
    if (!this.lock) {
      this.last = e.detail.x
      this.lock = true
    }
    if (this.lock && e.detail.x - this.last < -5) {
      this.setData({
        xScale: -75,
      })
      setTimeout(() => {
        this.lock = false
      }, 2000)
    } else if (this.lock && e.detail.x - this.last > 5) {
      this.setData({
        xScale: 0,
      })
      setTimeout(() => {
        this.lock = false
      }, 2000)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.hideShareMenu();

    // '已经授权'
    _this.data.loginid = app.signindata.loginid;
    _this.data.uid = app.signindata.uid;
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
    } else {
      app.signin(_this)
    };


  },
  onLoadfun(){
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.uid = app.signindata.uid;
    _this.setData({
      uid: app.signindata.uid,
      avatarUrl: app.signindata.avatarUrl,
      isProduce: app.signindata.isProduce,
      isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
    });

    this.getData();
    
  },
  // 获取数据
  getData(num=1){
    var _this = this;
    
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
    app.downRefreshFun(() => {
      this.getData()
    })   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getData(2)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this;
    var indexShare = app.signindata.indexShare || [];
    var indexShareNum = Math.floor(Math.random() * indexShare.length) || 0;
    var indexShareImg = '';
    if(indexShare.length!=0 && indexShare[indexShareNum]){
      indexShareImg = indexShare[indexShareNum]+'?time=' + Date.parse(new Date());
    };
    return {
      title:app.signindata.titleShare?app.signindata.titleShare:'你喜欢的潮玩都在这里！',
      path: 'pages/index/index',
      imageUrl:indexShareImg || 'https://cdn.51chaidan.com/images/default/shareImg.jpg',
      success: function (res) {}
    } 
  },

})
