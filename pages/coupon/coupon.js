var Dec = require('../../common/public.js');//aes加密解密js
var time = require('../../utils/util.js');
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
    imgcheck:false,
    iftrnoimag:false,
    // 优惠券数据
    coudata:[],
    // input值
    coupondata:'',
    // 点击请求判断防止多次提交
    clicktherequestiftr: true,  
    iftrcoudata:false,
    c_title: '优惠券',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),  
    tgabox:false,
    iftrscene:false
  },
  chebocheck:function(){
     this.setData({
       imgcheck: !this.data.imgcheck
     })
  },
  // input 值改变
  inputChange: function (e) {
    this.setData({
      coupondata: e.detail.value
    });
  },  
  // 兑换激活码
  couclicksou:function(){
    var _this = this;
    if (_this.data.clicktherequestiftr){
      _this.setData({clicktherequestiftr:false});
      var coupondata = _this.data.coupondata.replace(/\s*/g, "");
      var q = Dec.Aese('mod=coupon&operation=exchange&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&code=' + coupondata);
      wx.showLoading({ title: '加载中...', mask: true }) 
      wx.request({
        url: app.signindata.comurl + 'user.php' + q,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {
     
          wx.hideLoading();
          _this.setData({ clicktherequestiftr:true});
          if (res.data.ReturnCode == 906) {
            app.showToastC('激活码错误');
          }else if (res.data.ReturnCode == 907) {
            app.showToastC('激活码已被使用');
          } else if (res.data.ReturnCode == 914) {
            app.showToastC(res.data.Msg);
          } else if (res.data.ReturnCode == 908) {
            app.showToastC('激活码已过期');
          } else if (res.data.ReturnCode == 200) {
            app.showToastC('兑换成功');
          } else {
            app.showToastC(res.data.Msg);    
          };
          var qq = Dec.Aese('mod=coupon&operation=getlist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
          wx.request({
            url: app.signindata.comurl + 'user.php' + qq,
            method: 'GET',
            header: { 'Accept': 'application/json' },
            success: function (res) {
              if (res.data.ReturnCode == 200) {
                if (res.data.List.length != 0) {
                  for (var i = 0; i < res.data.List.length; i++) {
                    res.data.List[i].gettime = time.formatTimeTwo(res.data.List[i].gettime, 'Y/M/D h:m:s');
                    res.data.List[i].overtime = time.formatTimeTwo(res.data.List[i].overtime, 'Y/M/D h:m:s')
                  };
                  _this.setData({
                    coudata: res.data.List
                  })
                }
              };
              // 判断非200和登录
              Dec.comiftrsign(_this, res, app);
            },
            fail: function () {
              // fail
            }
          })

        },
        fail: function () {
          // fail
        }
      });


    };

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoadfun: function () {
    this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid
    });
    var _this = this;
    this.selectComponent("#hide").getappData();
    if (_this.data.iftrscene){
      
        var q = Dec.Aese('mod=coupon&operation=getKey&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&channelId=' + _this.getSearchString('channelId', _this.data.scene) || 0);
          wx.showLoading({ title: '加载中...', mask: true }) 
          wx.request({
            url: app.signindata.comurl + 'user.php' + q,
            method: 'GET',
            header: { 'Accept': 'application/json' },
            success: function (res) {
            
              wx.hideLoading();
              if (res.data.ReturnCode == 200) {
                if (res.data.Info){
                  _this.setData({
                    coupondata: res.data.Info.voucherKey || ''
                  })
                  _this.couclicksou();
                }else{
                  _this.getlist();
                };
              }else{
                _this.getlist();
              };
              // 判断非200和登录
              Dec.comiftrsign(_this, res, app);
            },
            fail: function () {}
          })
    }else{
        _this.getlist()
    };
 
  },  
  getlist:function(){
    var _this = this;
    wx.showLoading({ title: '加载中...', mask: true }) 
    var q = Dec.Aese('mod=coupon&operation=getlist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'user.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading();
        _this.setData({ iftrcoudata: true });
        if (res.data.ReturnCode == 200) {
          if (res.data.List.length != 0) {
            for (var i = 0; i < res.data.List.length; i++) {
              res.data.List[i].gettime = time.formatTimeTwo(res.data.List[i].gettime, 'Y/M/D h:m:s');
              res.data.List[i].overtime = time.formatTimeTwo(res.data.List[i].overtime, 'Y/M/D h:m:s')
            };
            _this.setData({
              coudata: res.data.List
            })
          }
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
      },
      fail: function () {
        // fail
      }
    })
  },

  // 授权点击统计
  clicktga: function () {
    app.clicktga(2)
  },
  // 点击登录获取权限
  userInfoHandler: function (e) {
    var _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          _this.setData({
            tgabox: false
          });
          _this.activsign();
          // 确认授权用户统计
          app.clicktga(4);
        }
      }
    });
    if (e.detail.userInfo) { } else {
      app.clicktga(8)  //用户按了拒绝按钮
    };

  },
  //key(需要检错的键） url（传入的需要分割的url地址）
  getSearchString: function (key, Url) {
    // 获取URL中?之后的字符
    var str = Url;
    var arr = str.split("&");
    var obj = new Object();
    // 将每一个数组元素以=分隔并赋给obj对象 
    for (var i = 0; i < arr.length; i++) {
      var tmp_arr = arr[i].split("=");
      obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
    }
    return obj[key];
  },
  onLoad: function (options) {
      
      var _this = this;
      _this.setData({
        loginid: app.signindata.loginid,
        uid: app.signindata.uid
      });   

      if (options.scene) {
        let scene = decodeURIComponent(options.scene);
    
        _this.setData({ iftrscene: true, scene: scene});
      }
      _this.activsign();
 
  },
  activsign: function () {
    // 判断是否授权 
    var _this = this;
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
      return false;
    };
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // '已经授权'
          _this.setData({
            loginid: app.signindata.loginid,
            uid: app.signindata.uid,
            openid: app.signindata.openid,
            grocerystoreiftr: app.signindata.grocerystoreiftr || 'off',
            avatarUrl: app.signindata.avatarUrl,
            isShareFun: app.signindata.isShareFun
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this);
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
              // '没有授权 统计'
              app.userstatistics(14);
              // '没有授权'
              _this.setData({
                tgabox: true
              });
            }
          });
        }
      }
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
    return Dec.sharemc()  
  }
})