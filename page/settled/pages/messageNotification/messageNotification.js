var Dec = require('../../../../common/public');//aes加密解密js
const util = require('../../../../utils/util');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '任务说明',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    type:0, // 1 抽选规则
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    // '已经授权'
    // this.data.id = options.id;
    this.data.type = options.type || 0; 
    if(this.data.type == 1){
      this.setData({
        c_title:'活动规则'
      }) 
    };

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
    this.gitData();
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
  gitData(){
    wx.showLoading({
      title: '加载中',
    })
    if(this.data.type == 1){
        var getUrl = 'https://cdn.51chaidan.com/produce/tipLotto.json';
    }else{
        var getUrl = 'https://cdn.51chaidan.com/produce/tipBrandMission.json';
    };
    wx.request({
      url: getUrl ,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: (res) => { 
        console.log('说明====',res)
        this.setData({
          data:res.data
        })
      },
      fail: function () {},
      complete:function(){
        wx.hideLoading()
        wx.stopPullDownRefresh();
      }
    });
  }
})