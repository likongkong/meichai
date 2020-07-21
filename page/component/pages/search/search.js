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
    commoddata:[],
    // loading 加载
    headhidden: true,
    bothidden: true, 
    // 上拉加载数据
    page: 0 ,
    // input 值
    inputdata:'',
    inputdatano:'',
    // 有无数据img
    iftrimg:false,
    // 点击请求判断防止多次提交
    clicktherequestiftr: true, 
    inputtxt1:'想要找点什么',
    hotdata:[],   
    searchtip:'',
    iftrsearchtip:false,

    c_title: '搜索',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
  },
  onFocus: function (w) {
    this.setData({
      inputtxt1: " "
    });
  },
  onBlur: function (w) {
    this.setData({
      inputtxt1: "想要找点什么"
    });
  },   
  // input 值改变
  inputChange:function(e){ 
     this.setData({
       inputdata: e.detail.value
     });
  },
  // 跳转详情页 
  addressmanagement: function (event) {
    // 统计商品点击量
    var gid = event.currentTarget.dataset.gid || event.target.dataset.gid;   
    wx.navigateTo({
      url: "../../../../pages/detailspage/detailspage?gid=" + gid
    })
  },   
  //时间戳转换时间  
  toDate: function (number) {
    var date = new Date(number * 1000);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    if (new Date(number * 1000).toDateString() === new Date().toDateString()) {
      return h + ':' + m;
    } else if (new Date(number * 1000) < new Date()) {
      return M +'-'+D;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoadfun:function(){
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.setData({
      uid: app.signindata.uid,
      avatarUrl: app.signindata.avatarUrl,
      isProduce: app.signindata.isProduce,
    });

    var q = Dec.Aese('mod=getinfo&operation=list&type=hot')
    wx.request({
      url: app.signindata.comurl + 'search.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {

        if (res.data.Navi) {
          _this.setData({
            hotdata: res.data.Navi || []
          });
        }
        _this.jump();
      },
      fail: function () {
        _this.jump();
      }
    })
  },
  onLoad: function (w) {
    var hot = w.hot || '';
    this.setData({
      inputdata: hot,
      loginid: app.signindata.loginid,
      uid: app.signindata.uid      
    });
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    var _this = this;
    this.selectComponent("#hide").getappData()

    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      _this.onLoadfun();
    }else{
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // '已经授权'
            _this.data.loginid = app.signindata.loginid;
            _this.setData({
              uid: app.signindata.uid,
              avatarUrl: app.signindata.avatarUrl,
              isProduce: app.signindata.isProduce,
            });
            // 判断是否登录
            if (_this.data.loginid != '' && _this.data.uid != '') {
              _this.onLoadfun();
            } else {
              app.signin(_this)
            }
          } else {
            _this.onLoadfun();
          }
        }
      });

    };

    
  },
  // 搜索历史记录
  searchhisfun:function(){
    var _this = this;
    wx.getStorage({
      key: 'hotdatahis',
      success: function (res) {
        
        var rd = res.data||[];
        if (rd) {
          if (rd.length != 0) {
            var iftr = true;
            for (var i = 0; i < rd.length; i++) {
              if (rd[i] == _this.data.inputdata) {
                iftr = false;
              }
            };
            if (iftr) {
              rd.unshift(_this.data.inputdata);
              if (rd.length >= 13) {
                rd.splice(11, 1)
              };
              wx.setStorage({
                key: "hotdatahis",
                data: rd
              })
            }
          } else {
            wx.setStorage({
              key: "hotdatahis",
              data: [_this.data.inputdata]
            })
          }
        }
      },
      fail: function () {
        wx.setStorage({
          key: "hotdatahis",
          data: [_this.data.inputdata]
        })
      }
    });    
  },
  iftrsearchtipfun:function(){
     this.setData({
       iftrsearchtip: false
     });
  },
  // 搜索
  jump:function(){
    var _this = this;
    _this.searchhisfun();
    var hotdata = _this.data.hotdata||[];
    var iftradopt = false;
    var keyname = _this.data.inputdata;
    for (var i = 0; i < hotdata.length;i++){
      if (keyname == hotdata[i].name){
        if (hotdata[i].type==1){
          wx.navigateTo({
            url: hotdata[i].url
          });
          iftradopt = true;
        } else if (hotdata[i].type ==2){
          _this.setData({
            searchtip: hotdata[i].url,
            iftrsearchtip: true
          });
          iftradopt = true;
        };
      };              
    };
    if (iftradopt){
      return false;
    };
    
    if (_this.data.clicktherequestiftr){
      _this.setData({clicktherequestiftr:false});
      var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
      var arrlist = '';
      // 商品列表
      
      var qq = Dec.Aese('mod=getinfo&operation=search&key=' + _this.data.inputdata + '&uid=' + _this.data.uid);
      wx.showLoading({ title: '加载中...', })
      wx.request({
        url: app.signindata.comurl + 'search.php' + qq,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {

          _this.setData({ clicktherequestiftr: true});
          wx.hideLoading()
          if (res.data.ReturnCode == 200) {
            var arrlist = res.data.List;
            if (arrlist){
              if (arrlist.length != 0) {
                for (var i = 0; i < arrlist.length; i++) {
                  if (!reg.test(arrlist[i].gcover)) {
                    arrlist[i].gcover = _this.data.zdyurl + arrlist[i].gcover;
                  }
                  arrlist[i].gpublish = _this.toDate(arrlist[i].gpublish);
                  // arrlist[i].product = {
                  //   "item_code": arrlist[i].gid,
                  //   "title": arrlist[i].gname,
                  //   "desc": arrlist[i].gname,
                  //   "category_list": ['1', '1'],
                  //   "image_list": [arrlist[i].gcover],
                  //   "src_mini_program_path": "/pages/detailspage/detailspage?gid=" + arrlist[i].gid,
                  //   "brand_info": {
                  //     "brand_name": "美拆",
                  //     "brand_url": "https://www.51chaidan.com/images/meichai.png",
                  //   }
                  // };
                }
                _this.setData({
                  commoddata: arrlist,
                  page: 0,
                  iftrimg: false
                });
              }
            };  
          }
          if (res.data.ReturnCode == 101) {
            var arrlist = res.data.List;
            if (arrlist){
              if (arrlist.length != 0) {
                for (var i = 0; i < arrlist.length; i++) {
                  if (!reg.test(arrlist[i].gcover)) {
                    arrlist[i].gcover = _this.data.zdyurl + arrlist[i].gcover;
                  }
                  arrlist[i].gpublish = _this.toDate(arrlist[i].gpublish);

                  // arrlist[i].product = {
                  //   "item_code": arrlist[i].gid,
                  //   "title": arrlist[i].gname,
                  //   "desc": arrlist[i].gname,
                  //   "category_list": ['1', '1'],
                  //   "image_list": [arrlist[i].gcover],
                  //   "src_mini_program_path": "/pages/detailspage/detailspage?gid=" + arrlist[i].gid,
                  //   "brand_info": {
                  //     "brand_name": "美拆",
                  //     "brand_url": "https://www.51chaidan.com/images/meichai.png",
                  //   }
                  // };
                }
                _this.setData({
                  commoddata: arrlist,
                  page: 0,
                  iftrimg: true,
                  inputdatano: _this.data.inputdata
                });
              };
            };
          }
        }
      });          
    };
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
    var hotdata = _this.data.hotdata || [];
    var iftradopt = false;
    var keyname = _this.data.inputdata;
    for (var i = 0; i < hotdata.length; i++) {
      if (keyname == hotdata[i].name) {
        if (hotdata[i].type == 1) {
          wx.navigateTo({
            url: hotdata[i].url
          });
          iftradopt = true;
        } else if (hotdata[i].type == 2) {
          _this.setData({
            searchtip: hotdata[i].url,
            iftrsearchtip: true
          });
          iftradopt = true;
        };
      };
    };
    if (iftradopt) {
      return false;
    };

    this.setData({
      headhidden: false,
    });
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    
    var arrlist = '';
    // 商品列表
    
    var q = Dec.Aese('mod=getinfo&operation=search&key=' + _this.data.inputdata + '&uid=' + _this.data.uid)
    wx.request({
      url: app.signindata.comurl + 'search.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        _this.setData({headhidden: true});        
        if (res.data.ReturnCode == 200){
          var arrlist = res.data.List;
          if (arrlist.length != 0) {
            for (var i = 0; i < arrlist.length; i++) {
              if (!reg.test(arrlist[i].gcover)) {
                arrlist[i].gcover = _this.data.zdyurl + arrlist[i].gcover;
              }
              arrlist[i].gpublish = _this.toDate(arrlist[i].gpublish);
            }
            _this.setData({
              commoddata: arrlist,
              headhidden: true,
              page: 0
            });
          };         
        };
        if (res.data.ReturnCode == 101) {
          var arrlist = res.data.List;
          if (arrlist.length != 0) {
            for (var i = 0; i < arrlist.length; i++) {
              if (!reg.test(arrlist[i].gcover)) {
                arrlist[i].gcover = _this.data.zdyurl + arrlist[i].gcover;
              }
              arrlist[i].gpublish = _this.toDate(arrlist[i].gpublish);
            }
            _this.setData({
              commoddata: arrlist,
              page: 0,
              iftrimg: true,
              inputdatano: _this.data.inputdata
            });
          }
        };                    
      }
    }); 
       
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this;
    var hotdata = _this.data.hotdata || [];
    var iftradopt = false;
    var keyname = _this.data.inputdata;
    for (var i = 0; i < hotdata.length; i++) {
      if (keyname == hotdata[i].name) {
        if (hotdata[i].type == 1) {
          wx.navigateTo({
            url: hotdata[i].url
          });
          iftradopt = true;
        } else if (hotdata[i].type == 2) {
          _this.setData({
            searchtip: hotdata[i].url,
            iftrsearchtip: true
          });
          iftradopt = true;
        };
      };
    };
    if (iftradopt) {
      return false;
    };

    this.setData({
      bothidden: false,
      page: ++this.data.page
    });
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    
    var arrlist = '';
    // 商品列表
    var q = Dec.Aese('mod=getinfo&operation=search&key=' + _this.data.inputdata + '&pid=' + _this.data.page + '&uid=' + _this.data.uid)
    wx.request({
      url: app.signindata.comurl+'search.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        _this.setData({bothidden: true});         
        if (res.data.ReturnCode == 200){
          var arrlist = res.data.List;
          if (arrlist.length != 0) {
            for (var i = 0; i < arrlist.length; i++) {
              if (!reg.test(arrlist[i].gcover)) {
                arrlist[i].gcover = _this.data.zdyurl + arrlist[i].gcover;
              }
              arrlist[i].gpublish = _this.toDate(arrlist[i].gpublish);
            }
            var comdataarr = _this.data.commoddata.concat(arrlist);
            _this.setData({
              commoddata: comdataarr,
              bothidden: true
            });
          };
        }else{
          app.showToastC('没有更多数据了');
        };  
      }
    }); 


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return Dec.sharemc()    
  },
  onShareTimeline:function(){
    return {
      title:'潮玩社交平台',
      query:{}    
    }
  },
  recommend: function (w) {
    var gid = w.currentTarget.dataset.gid || w.target.dataset.gid;
    var _this = this
    // 统计新用户
    var qqqqq = Dec.Aese('mod=share&operation=dotactivity' + '&referee=' + _this.data.uid + '&activity_id=' + gid + '&type=3');
    wx.request({
      url: app.signindata.comurl + 'statistics.php' + qqqqq,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        
      },
      fail: function () { }
    });
  },
})