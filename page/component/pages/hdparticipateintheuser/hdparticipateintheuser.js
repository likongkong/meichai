var Dec = require('../../../../common/public.js');//aes加密解密js
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
    openid: app.signindata.openid,  
    // 活动id
    hdid:'',
    // 分页
    page:0,
    // 数据
    commoddata:[],
    // 加载loading
    headhidden: true,
    bothidden: true,    

    c_title: '活动参与用户',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    iftrnodata:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      hdid: options.hdid
    });
    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // '已经授权'
          _this.setData({
            loginid: app.signindata.loginid,
            uid: app.signindata.uid,
            openid: app.signindata.openid,
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this)
          }
        } else {

          wx.getUserInfo({
            success: res => {
              // 判断是否登录
              if (_this.data.loginid != '' && _this.data.uid != '') {
                _this.onLoadfun();
              } else {
                app.signin(_this);
              }
            },
            fail: res => {
              wx.navigateTo({
                url: "../../../../pages/signin/signin"
              })
            }
          });
        }
      }
    });      
  },
  onLoadfun:function(){
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
    });   
    this.selectComponent("#hide").getappData()
    // 调取数据
    _this.adjlist(1);
  },
  // 调取数据  
  adjlist:function(num){
    var _this = this;
    var reg = /^((https|http|ftp|rtsp|mms|www|wx)?:\/\/)[^\s]+/;
    _this.setData({ iftrnodata: false, headhidden:false});
    var qc = Dec.Aese('mod=activity&operation=more&id=' + _this.data.hdid + '&page=' + _this.data.page);
    wx.request({
      url: app.signindata.comurl + 'spread.php' + qc,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        _this.setData({
          bothidden: true,
          headhidden: true,
          iftrnodata:true
        });
        wx.stopPullDownRefresh()
        if (res.data.ReturnCode == 200) {
          var arrlist = res.data.Info.list;
          if (arrlist){
            if (arrlist.length != 0) {
              for (var i = 0; i < arrlist.length; i++) {
                if (arrlist[i].headphoto){
                  if (!reg.test(arrlist[i].headphoto)) {
                    arrlist[i].headphoto = _this.data.zdyurl + arrlist[i].headphoto;
                  };
                };
                arrlist[i].iftr = false
              };
              if (num == 1) {
                var comdataarr = arrlist;
              } else {
                var comdataarr = _this.data.commoddata.concat(arrlist);
              }
              _this.setData({
                commoddata: comdataarr
              });
            }else{
              wx.showToast({
                title: '没有更多数据了',
                icon: 'none',
                duration: 1000
              });              
            };
          };
        };
        if (res.data.ReturnCode == 400) {
          wx.showToast({
            title: '暂无信息',
            icon: 'none',
            duration: 1500
          });
        };
        if (res.data.ReturnCode == 900) {
          wx.showToast({
            title: '登陆状态有误',
            icon: 'none',
            duration: 1500
          });
        };
      }
    });
  },
  adsclicksefun: function (w) {
    var nick = w.currentTarget.dataset.nick || w.target.dataset.nick || '';
    var index = w.currentTarget.dataset.index || w.target.dataset.index || 0;
    if (nick != "") {
      var ccac = this.data.commoddata;
      for (var i = 0; i < ccac.length; i++) {
        if (i != index) {
          ccac[i].iftr = false;
        } else {
          ccac[i].iftr = true;
        };
      }
      this.setData({
        commoddata: ccac
      })
    }
  },  
  // 图片显示隐藏
  adspuserimgleftstar: function (w) {
    var nick = w.currentTarget.dataset.nick || w.target.dataset.nick;
    var index = w.currentTarget.dataset.index || w.target.dataset.index || 0;
    if (nick != " ") {
      var ccac = this.data.commoddata;
      ccac[index].iftr = !ccac[index].iftr;
      this.setData({
        commoddata: ccac
      })
    }
  },
  adspuserimgleftend: function (w) {
    var nick = w.currentTarget.dataset.nick || w.target.dataset.nick;
    var index = w.currentTarget.dataset.index || w.target.dataset.index || 0;
    if (nick != " ") {
      var ccac = this.data.commoddata;
      ccac[index].iftr = !ccac[index].iftr;
      this.setData({
        commoddata: ccac
      })
    }
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
      headhidden: false,
      page:0
    }); 
    // 调取数据
    this.adjlist(1);       
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      bothidden: false,
      page: ++this.data.page
    });   
    // 调取数据
    this.adjlist(2);     
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return Dec.sharemc()    
  }, 
})