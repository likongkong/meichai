var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '一番赏', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    page: 0,
    loadprompt:false,
    nodata:false,
    // 适配苹果X
    isIphoneX: false,
    isProduce: app.signindata.isProduce,
    datalist:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.gitList();
  },
  gitList(){
    var _this = this;
    wx.showLoading({title: '加载中...',})
    if(_this.data.page ==0){
      this.setData({datalist:[]})
    };
    var exh = Dec.Aese('mod=yifanshang&operation=list&pid='+_this.data.page)
    console.log("一番赏活动列表接口地址 ===== "+app.signindata.comurl + 'mod=yifanshang&operation=list&pid='+_this.data.page)
    wx.request({
      url: app.signindata.comurl + 'spread.php' + exh,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log('一番赏列表 =========== ',res)
        if (res.data.ReturnCode == 200) {
          if(res.data.List.activity.length == 0 && _this.data.page == 0){
            _this.setData({ nodata : true})
          }else{
            let alldata = [..._this.data.datalist,...res.data.List.activity];
            // console.log(alldata)
            _this.setData({datalist : alldata})
          }
        } else if (res.data.ReturnCode == 201){
          _this.setData({loadprompt : true })
        } else {
          app.showToastC(res.data.msg);
        }
      },
      fail: function () { }
    });
  },
  //跳转详情
  toaRewarddeyails(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({   
      url: "/page/secondpackge/pages/aRewardDetails/aRewardDetails?id=" + id
    });
  },
  reset(){
    this.setData({page:0,datalist:[],loadprompt:false})
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
    this.gitList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.loadprompt == false){
      this.setData({page:++this.data.page})
      this.gitList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var _this = this
    var share = {
      imageUrl:  "https://cdn.51chaidan.com/images/sign/yifanshangLisSharet.jpg"
    }
    return share;
  },
  onShareTimeline:function(){
    var _this = this;
    return {
      title:'来美拆一番赏，一发入魂，抢战最终手办大赏',
      query:{},
      imageUrl: 'https://cdn.51chaidan.com/images/sign/yifanshangShareImg.jpg'
    }
  },
})