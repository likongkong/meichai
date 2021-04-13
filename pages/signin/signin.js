const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    // 授权弹框
    tograntauthorization: true,
    appNowTime: app.signindata.appNowTime,
    // 判断是ios或者android
    iftriosorand: app.signindata.iftriosorand,
    c_title: '',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
  }, 
  onLoadfun:function(){},
  // 点击登录获取权限
  userInfoHandler: function (e) {
    // 登录
    var _this = this;
    wx.getSetting({
      success: res => {
        if (true) {
          var pages = getCurrentPages(); // 当前页面  
          var beforePage = pages[pages.length - 2]; // 前一个页面     
          wx.navigateBack({
            success: function () {
              beforePage.onLoad(); // 执行前一个页面的onLoad方法  
            }
          }); 
          // 确认授权用户统计
          app.clicktga(4)
        };
      }
    });
    if (e.detail.userInfo) { } else {
      app.clicktga(8)  //用户按了拒绝按钮
    };

  },
  // 授权跳转
  // tgawchtgaw: function () {
  //   wx.openSetting()
  // },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // '没有授权 统计'
    // app.userstatistics(14);
    wx.getUserInfo({
      success: res => {
        var pages = getCurrentPages(); // 当前页面  
        var beforePage = pages[pages.length - 2]; // 前一个页面     
        wx.navigateBack({
          success: function () {
            beforePage.onLoad(); // 执行前一个页面的onLoad方法  
          }
        });
        // 确认授权用户统计
        app.clicktga(4)
      },
      fail: res => {
        // '没有授权 统计'
        app.userstatistics(14);
      }
    });

  },
  // 授权
  clicktga: function () {
    app.clicktga(2)
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
    
  }
})