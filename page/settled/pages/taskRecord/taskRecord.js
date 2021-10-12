var Dec = require('../../../../common/public');//aes加密解密js
const util = require('../../../../utils/util');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '获取记录',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    page:0,
    records:[],
    noData:false,
    isMoreData:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    // '已经授权'
    // this.data.id = options.id;
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
    if(!this.data.isMoreData){
      this.data.page = ++this.data.page;
      this.gitData();
    }else{
      util.showToast('暂无更多数据了',1500);
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
    let data = `mod=mission&operation=record&uid=${this.data.uid}&loginid=${this.data.loginid}&pageId=${this.data.page}`
    var q = Dec.Aese(data);
    console.log(`${app.signindata.comurl}?${data}`)
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: (res) => { 
        console.log('记录====',res)
        if(res.data.ReturnCode == 200){
          for(var i=0; i<res.data.List.record.length;i++){
            console.log(res.data.List.record[i].receiveTime)
            res.data.List.record[i].created_at = util.format1("yyyy-MM-dd HH:mm:ss",Number(res.data.List.record[i].receiveTime))
          }
          if(this.data.page == 1 && res.data.List.record.length == 0){
            this.setData({
              noData:true
            })
          }else if(this.data.page != 1 && res.data.List.record.length == 0){
            this.setData({
              isMoreData:true
            })
          }else{
            this.setData({
              records:[...this.data.records,...res.data.List.record]
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
  }
})