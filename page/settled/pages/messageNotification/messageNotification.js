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
    pid:0,
    dataList:[],
    noData:false,
    isMoreData:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
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
    this.setData({
      pid:0,
      dataList:[],
      noData:false,
      isMoreData:false
    })
    this.gitData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(!this.data.isMoreData){
      this.data.pid = ++this.data.pid;
      this.gitData();
    }else{
      app.showToastC('暂无更多数据了',1500);
    }
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
    let data = `mod=mcMessage&operation=list&uid=${this.data.uid}&loginid=${this.data.loginid}&pid=${this.data.pid}`
    var q = Dec.Aese(data);
    console.log(`${app.signindata.comurl}?${data}`)
    wx.request({
      url: app.signindata.comurl + 'user.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: (res) => { 
        console.log('消息列表====',res)
        if(res.data.ReturnCode == 200){
          if(this.data.pid == 0 && res.data.List.length == 0){
            this.setData({
              noData:true
            })
          }else if(this.data.pid != 0 && res.data.List.length == 0){
            this.setData({
              isMoreData:true
            })
            app.showToastC('暂无更多数据了',1500);
          }else{
            this.setData({
              dataList:[...this.data.dataList,...res.data.List]
            })
          }
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
  },
  comjumpwxnav(e){
    let type = e.currentTarget.dataset.type;
    let id = e.currentTarget.dataset.id;
    app.comjumpwxnav(type,id)
  },
})