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
    openid: app.signindata.openid,
    // 商铺id
    store_id: '',     
    // 流水tab切换
    tabind:0,    
    listdata:[],
    nodataiftr:false,
    reward: [{ desc: "奖励3元" },{ desc: "奖励3元" }, { desc: "分成10%" },{ desc: "分成10%" }],
    B:false,
    C:false,
    c_title: '最佳合伙人',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),    
  },
  // tab 切换
  sshpofboxtab: function (w) {
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind ||0;
    this.setData({
      tabind: ind
    });
    this.ranking();
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        if (true) {
          _this.setData({ tgabox: false });
          // '已经授权'
          _this.setData({
            loginid: app.signindata.loginid,
            uid: app.signindata.uid,
            openid: app.signindata.openid,
            store_id: app.signindata.store_id
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this);
          }
        } else {
          // '没有授权'
          // 跳转获取权限页面
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
                url: "/pages/signin/signin"
              })
            }
          });


        }
      }
    }); 
    // 调取四个显示数据
    wx.request({
      url:'https://api.51chaidan.com/data/store_award.conf',
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        var reward = res.data||[];
        if (reward && reward.length!=0){
          if (reward[0]) { } else { reward[0].desc = { desc: "敬请期待" } };
          if (reward[1]) { } else { reward[1].desc = { desc: "敬请期待" } };
          if (reward[2]) { } else { reward[2].desc = { desc: "敬请期待" } };
          if (reward[3]) { } else { reward[3].desc = { desc: "敬请期待" } };
          _this.setData({
            reward: reward
          });
        }else{
          _this.setData({
            reward: [{ desc: "敬请期待" }, { desc: "敬请期待" }, { desc: "敬请期待" }, { desc: "敬请期待" }]
          });          
        };
      }
    });


  },
  onLoadfun:function(){
    //  我的订单数据
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      store_id: app.signindata.store_id
    });
    if (app.signindata.store_id > 0) {
      _this.setData({ B: true, C: false });
    } else {
      _this.setData({ C: true, B: false });
    };
    
    // 调取数据
    _this.ranking();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
 
  ranking:function(){
    var _this = this;
    var qhd = Dec.Aese('mod=info&operation=partner&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=' + _this.data.tabind);
    wx.request({
      url: app.signindata.comurl + 'store.php' + qhd,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        _this.setData({ nodataiftr:true});
        if (res.data.ReturnCode == 200) {
          var rdlp = res.data.List.partner||[];
          if (rdlp && rdlp.length!=0){
              for (var i = 0; i < rdlp.length; i++) {
                if (!app.signindata.reg.test(rdlp[i].litpic)) {
                  rdlp[i].litpic = _this.data.zdyurl + rdlp[i].litpic;
                };
              };
              _this.setData({
                listdata: rdlp
              })
          };
        } else {
          app.showToastC(res.data.Msg);
        };
      }
    }); 
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    var _this = this;
    if (ops.from === 'button') {
      return {
        title: '开一家自己的解优杂货铺吧，分享赚钱，限时免费。',
        path: 'pages/storehomepage/storehomepage?referee=' + _this.data.store_id,
        success: function (res) {}
      }
    }else{
      return {
        title: '开一家自己的解优杂货铺吧，分享赚钱，限时免费。',
        path: 'pages/sbestpartner/sbestpartner',
        success: function (res) {}
      }       
    };
  },
  jumphompfun:function(w){
    var suid = w.currentTarget.dataset.suid || w.target.dataset.suid || 0;
    wx.navigateTo({
      url: "/pages/storehomepage/storehomepage?store_id=" + suid
    });    
  },
})