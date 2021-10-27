var Dec = require('../../../../common/public');//aes加密解密js
const util = require('../../../../utils/util');
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    // '已经授权'
    this.data.id = options.id;
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
    this.gitData()
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
    let data = `mod=mcMessage&operation=info&uid=${this.data.uid}&loginid=${this.data.loginid}&id=${this.data.id}`
    var q = Dec.Aese(data);
    console.log(`${app.signindata.comurl}?${data}`)
    wx.request({
      url: app.signindata.comurl + 'user.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: (res) => { 
        console.log('消息详情====',res)
        if(res.data.ReturnCode == 200){
          // .replace(/<p>/ig, '<p style="font-size: 14px;">')
          res.data.List.image_text = res.data.List.image_text.replace(/<img([\s\w"-=\/\.:;]+)/ig, '<img style="width: 100%;display:block;" $1').replace(/<p>/ig, '<p style="font-size: 14px; line-height: 24px;">');
          this.setData({
            data:res.data.List
          })
        }else{
          app.showToastC(res.data.Msg,2000);
        }
      },
      fail: function () {},
      complete:function(){
        wx.hideLoading()
        wx.stopPullDownRefresh();
      }
    });
  }
})