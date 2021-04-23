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
    appNowTime: app.signindata.appNowTime,
    // 判断是ios或者android
    iftriosorand: app.signindata.iftriosorand,    
    infodata: [],
    headhidden: true,
    bothidden: true, 
    nid:'',    
    // 购物车显示数据
    shopnum: 0,
    // 授权弹框
    tgabox: false,
    // 第一次加载不显示暂无数据
    nodataiftr: false,
    // 点击请求判断防止多次提交
    clicktherequestiftr: true,   

    c_title: '消息中心',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,                
  },
  // 跳转页面
  comjump: function (event){
    var typenum = event.currentTarget.dataset.type || event.target.dataset.type, wname = '';
    var gcover = event.currentTarget.dataset.cid || event.target.dataset.cid; 
    switch (parseInt(typenum)){
      case 0: wname = '官方公告'; break;
      case 1: wname = '订单状态'; break;
      case 2: wname = '快递状态'; break;
      case 3: wname = '评论相关'; break;
      case 4: wname = '活动状态'; break;
    };
    // wx.navigateTo({
    //   url: "../informationdetail/informationdetail?type=" + typenum + '&wname=' + wname
    // });
  },
  // 查看物流
  lookatthelogistics: function (event) {
    var gcover = event.currentTarget.dataset.cid || event.target.dataset.cid;    
    wx.navigateTo({ 
      url: "../../../../pages/lookatthelogistics/lookatthelogistics?oid="+gcover
    })
  },
  // 订单状态
  dismantling:function(event){
    var oid = event.currentTarget.dataset.cid || event.target.dataset.cid;
    wx.navigateTo({ 
      url: "/page/component/pages/orderdetails/orderdetails?oid=" + oid
    })
  },
  // 跳转评论
  comment:function(event){
    var cid = event.currentTarget.dataset.cid || event.target.dataset.cid;
    wx.navigateTo({    
      url: "../../../../pages/allcomments/allcomments?gid=" + cid
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //时间戳转换时间  
  toDate: function (number) {
    var n = number * 1000;
    var date = new Date(n);
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (Y + M + D)
  },  
  onLoadfun:function(){
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid
    }); 
    this.setData({
      headhidden: true,
      nodataiftr:false
    });     
    // 消息列表
    var q = Dec.Aese('mod=getinfo&operation=newest&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'news.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200){
          var resdatlis = res.data.List;
          if (resdatlis.length != 0) {
            for (var i = 0; i < resdatlis.length; i++) {
              resdatlis[i].time = _this.toDate(resdatlis[i].time);
            };
            _this.setData({
              infodata: resdatlis,
            });
          }
        };
        _this.setData({
          nodataiftr:true,
          // 多次提交判断
          clicktherequestiftr: true,          
        });
        wx.stopPullDownRefresh()        
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);    
      }
    });
    // 购物车数据显示
    Dec.shopnum(_this,app.signindata.comurl); 
  },
  onLoad: function (options) {},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 判断是否授权 
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid
    });
    this.setData({
      headhidden: false
    });     
    wx.getSetting({
      success: res => {
        if (true) {
          // '已经授权'
          _this.setData({
            loginid: app.signindata.loginid,
            uid: app.signindata.uid
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun(_this);
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
              // '没有授权 统计'
              app.userstatistics(9);
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
  // 授权点击统计
  clicktga: function () {
    app.clicktga(2)
  },

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
  onPullDownRefresh: function () {
    this.setData({
      headhidden: false
    });    
    this.onLoadfun();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.sharemc()    
  },
  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    };
  },  
  // 导航跳转
  whomepage: function () {
    wx.redirectTo({
      url: "../../../../pages/index/index?judgeprof=2"
    })
  },
  wnews:function(){
    //  刷新
    // 防止多次提交
    if (this.data.clicktherequestiftr) {
      this.setData({ clicktherequestiftr: false });
      this.onPullDownRefresh();
      this.goTop();
    };

  },
  wshoppingCart: function () {
    wx.redirectTo({
      url: "../../../../pages/shoppingCart/shoppingCart"
    })
  },
  wmy: function () {
    wx.redirectTo({
      url: "../../../../pages/wode/wode"
    })
  },
  // 点击登录获取权限
  userInfoHandler: function (e) {
    var _this = this;
    wx.getSetting({
      success: res => {
        if (true) {
          _this.setData({
            tgabox: false
          });
          _this.onShow();
          // 确认授权用户统计
          app.clicktga(4);
        }
      }
    });
    if (e.detail.userInfo) { } else {
      app.clicktga(8) 
    };

  }        
})