var Dec = require('../../common/public.js');//aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 接口地址
    comurl: app.signindata.comurl,
    // 图片地址
    zdyurl: Dec.zdyurl(),
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,   
    inpdata:'',
    c_title: '修改昵称',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
  },
  changinp:function(e){

    var regLowerCase = new RegExp('^[\u4e00-\u9fa50-9a-zA-Z_\-]{0,20}$', 'g');
    var rsLowerCase = regLowerCase.test(e.detail.value);
      if (!rsLowerCase) {
        this.setData({
          inpdata: this.data.inpdata
        })
      }else{
        this.setData({
          inpdata: e.detail.value
        });
      }
  },
  addinp:function(){
   var _this=this;
   if (this.data.inpdata==''){
    app.showToastC('昵称不能为空!');
     return false;
   };
   var q = Dec.Aese('mod=info&operation=tptinfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&nick=' + _this.data.inpdata)
    wx.request({
      url: app.signindata.comurl + 'user.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          app.showToastC('提交成功');
        };
        if (res.data.ReturnCode == 201) {
          app.showToastC('第三方登录信息有误');
        };        
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);          
      }  
    })
  },
  
  clearinp:function(){
    this.setData({
      inpdata:""
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoadfun: function () {
    this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid
    });
  },   
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid
    });     
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return Dec.sharemc()    
  }
})