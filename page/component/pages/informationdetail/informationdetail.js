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
    infodata: [],
    headhidden: true,
    bothidden: true,
    nid: '',
    // 购物车显示数据
    shopnum: 0,
    // 授权弹框
    tgabox: false,
    typea:'',
    page:1,
    // 第一次加载不显示暂无数据
    nodataiftr: false,
    c_title: '',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),         
  },
  // 跳转页面
  comjump: function (event) {
    var typenum = event.currentTarget.dataset.type || event.target.dataset.type, wname = '';
    var gcover = event.currentTarget.dataset.cid || event.target.dataset.cid;
    if (typenum==2){
      wx.navigateTo({
        url: "/pages/lookatthelogistics/lookatthelogistics?oid=" + gcover
      })
    };
    if (typenum == 1 || typenum == 4) {
      wx.navigateTo({
        url: "/page/component/pages/orderdetails/orderdetails?oid=" + gcover
      })
    };  
    if (typenum == 3) {
      wx.navigateTo({   
        url: "/pages/allcomments/allcomments?gid=" + gcover
      })
    };      
  },

  //时间戳转换时间  
  toDate: function (number) {
    var date = new Date(number * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.wname, 
    });
    this.setData({
      typea: options.type
    });
    // 判断是否授权 
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.setData({
      uid: app.signindata.uid
    });
    this.setData({
      headhidden: false
    });
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // '已经授权'
          _this.data.loginid = app.signindata.loginid;
          _this.setData({
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
              wx.navigateTo({
                url: "/pages/signin/signin"
              })
            }
          });


        }
      }
    });           
  }, 
  onLoadfun: function () {
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.setData({
      uid: app.signindata.uid
    });
    this.selectComponent("#hide").getappData()
    this.setData({
      headhidden: true
    });
    // 消息列表
    var q = Dec.Aese('mod=getinfo&operation=sublist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid +'&type='+_this.data.typea);
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    wx.request({
      url: app.signindata.comurl + 'news.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          var resdatlis = res.data.List;
          if (resdatlis.length != 0) {
            for (var i = 0; i < resdatlis.length; i++) {
              resdatlis[i].time = _this.toDate(resdatlis[i].time);
              resdatlis[i].img = decodeURIComponent(resdatlis[i].img);
              if (resdatlis[i].img!=''){
                if (!reg.test(resdatlis[i].img)) {
                  resdatlis[i].img = _this.data.zdyurl + resdatlis[i].img;
                }; 
              };
            };
            _this.setData({
              infodata: resdatlis,
            });
          }
        };
        _this.setData({
          nodataiftr:true
        })
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
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
  onPullDownRefresh: function () {
    var _this = this;
    this.setData({
      page:1,
      headhidden:false
    })
    // 消息列表
    var q = Dec.Aese('mod=getinfo&operation=sublist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=' + _this.data.typea);
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    wx.request({
      url: app.signindata.comurl + 'news.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        _this.setData({headhidden: true});
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh()        
        if (res.data.ReturnCode == 200) {
          var resdatlis = res.data.List;
          if (resdatlis.length != 0) {
            for (var i = 0; i < resdatlis.length; i++) {
              resdatlis[i].time = _this.toDate(resdatlis[i].time);
              resdatlis[i].img = decodeURIComponent(resdatlis[i].img);
              if (resdatlis[i].img != '') {
                if (!reg.test(resdatlis[i].img)) {
                  resdatlis[i].img = _this.data.zdyurl + resdatlis[i].img;
                };
              };
            };
            _this.setData({
              infodata: resdatlis,
            });
          }
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
      }
    })    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function(){
    var _this = this;
    this.setData({
      bothidden: false,
      page: ++_this.data.page
    });
    // 消息列表
    var q = Dec.Aese('mod=getinfo&operation=sublist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=' + _this.data.typea + '&page=' + _this.data.page);
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    wx.request({
      url: app.signindata.comurl + 'news.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        _this.setData({bothidden: true});        
        if (res.data.ReturnCode == 200) {
          var resdatlis = res.data.List;
          if (resdatlis.length != 0) {
            for (var i = 0; i < resdatlis.length; i++) {
              resdatlis[i].time = _this.toDate(resdatlis[i].time);
              resdatlis[i].img = decodeURIComponent(resdatlis[i].img);
              if (resdatlis[i].img != '') {
                if (!reg.test(resdatlis[i].img)) {
                  resdatlis[i].img = _this.data.zdyurl + resdatlis[i].img;
                };
              };
            };
            var comdataarr = _this.data.infodata.concat(resdatlis);
            _this.setData({
              infodata: comdataarr,
            });
          }else{
            app.showToastC('没有更多数据了');
          };
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
      }
    })    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})