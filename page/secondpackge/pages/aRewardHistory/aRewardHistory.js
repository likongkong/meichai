var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '刮卡记录', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    page:0,
    history:[],
    todayActivity:[], //今日完成活动集合
    nodata:false,
    loadprompt:false,
    options:null, //上个页面传过来的参数
    // 适配苹果X
    isIphoneX: false,
    isProduce: app.signindata.isProduce,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({options})
    this.gitList()
  },

  gitList(){
    var _this = this;
    var exh = Dec.Aese('mod=yifanshang&operation=history&id='+this.data.options.id+'&pid='+this.data.page)
    wx.showLoading({title: '加载中...',})
    console.log("一番赏历史记录接口地址 ===== "+app.signindata.comurl + 'mod=yifanshang&operation=history&id='+this.data.options.id+'&pid='+this.data.page)
    wx.request({
      url: app.signindata.comurl + 'spread.php' + exh,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log('一番赏历史记录 =========== ',res)
        if ( res.data.ReturnCode == 200 ) {
            if(res.data.List.history.length == 0 && _this.data.page == 0){
              _this.setData({ nodata : true})
            }else{
              if(res.data.List.history.length == 0 && _this.data.page != 0){
                wx.showToast({
                  title: '没有更多记录了',
                  icon: 'none',
                  duration: 1000
                })
                _this.setData({loadprompt : true })
              }else{
                let alldata = [...res.data.List.history,..._this.data.history];
                // console.log(alldata)
                _this.setData({history : alldata})
              }
            }
            _this.setData({
              todayActivity:res.data.List.todayActivity
            })
        } else {
          app.showToastC(res.data.msg);
        }
      },
      fail: function () { }
    });
  },
  toARewardHistoryPage(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({   
      url: "/page/secondpackge/pages/aRewardHistory/aRewardHistory?id=" + id
    });
  },
  reset(){
    this.setData({page:0,history:[],loadprompt:false,nodata:false})
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
    this.reset();
    this.gitList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.loadprompt == false){
      this.setData({page:++this.data.page})
    }
    this.gitList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})