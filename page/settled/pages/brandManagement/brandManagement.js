
var Dec = require('../../../../common/public');//aes加密解密js
const util = require('../../../../utils/util');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '专区管理',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    uid:'',
    loginid:'',
    dataList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    this.data.uid = app.signindata.uid;
    this.data.loginid = app.signindata.loginid;
    // 获取系统信息
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          contentHeight:(res.windowHeight - this.data.statusBarHeightMc)-85,
        });
      }
    });
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
    } else {
      app.signin(_this)
    }
  },
  onLoadfun(){
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.uid = app.signindata.uid;
    this.getData();
  },
  getData(){
    var _this = this;
    var q1 = Dec.Aese('mod=community&operation=personagebrand&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid );
    wx.showLoading({title: '加载中...',mask:true})
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        console.log(res)
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          let info = res.data.Info.certificationInfo;
          let list = res.data.List;
          _this.setData({
            dataList:list,
            info,
            isFansAdmin:res.data.Info.isFansAdmin,
            enterpriseinfo:JSON.stringify(info),
            tel:util.plusXing(info.firm_tel,3,4)
          })
        }else{
          
        }
      }
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
    this.getData()
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
  //返回n页
  navigateBack(e){
    let num = e.currentTarget.dataset.num;
    app.navigateBack(num)
  },
  comjumpwxnav(e){
    let type = e.currentTarget.dataset.type;
    let whref = e.currentTarget.dataset.whref;
    app.comjumpwxnav(type,whref,'')
  }
})
