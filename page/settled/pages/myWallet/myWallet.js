
var Dec = require('../../../../common/public');//aes加密解密js
var tcity = require("../../../../common/citys.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '订单管理',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    animationData:{},
    popHeight:620,
    account:[{
      title:'个人账号（适用于公对私）-提现到微信零钱',
      quotaNum:'30000.00',
      id:1
    },{
      title:'商户账号（适用于公对公）-提现到商户账号',
      quotaNum:'50000.00',
      id:2
    }],
    accountNum:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    // '已经授权'
    this.data.loginid = app.signindata.loginid;
    this.data.uid = app.signindata.uid;
    // 判断是否登录
    if (this.data.loginid != '' && this.data.uid != '') {
      this.onLoadfun();
    } else {
      app.signin(this)
    };
  },
  onLoadfun(){
    this.data.loginid = app.signindata.loginid;
    this.data.uid = app.signindata.uid;

    // wx.showModal({
    //   title: '',
    //   content: '钱包余额不足，最低提现￥1.00',
    //   showCancel:false,
    //   confirmText:'关闭',
    //   confirmColor:'#02BB00',
    //   success (res) {
    //     if (res.confirm) {
          
    //     }
    //   }
    // })

  },
  chooseAccount(e){
    this.setData({
      accountNum:e.currentTarget.dataset.ind
    })
  },
  //点击我显示底部弹出框
  clickme:function(){
    this.showModal();
  },
  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(this.data.popHeight).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(this.data.popHeight).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
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
    
  },

})