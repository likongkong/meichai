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
    listDataB:[],
    listDataC:[],
    listDataD:[],
    // loading 加载
    headhidden: true,
    bothidden: true, 
    // 上拉加载数据
    pid: 0 ,
    // input 值
    inputdata:'',
    inputdatano:'',
    // 有无数据img
    iftrimg:false,
    // 数据小于21不可以触发分页
    isonReachBottom:true,
    // 点击请求判断防止多次提交
    clicktherequestiftr: true, 
    inputtxt1:'想要找点什么',
    hotdata:[],   
    searchtip:'',
    iftrsearchtip:false,

    c_title: '搜索',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90
  },
  jumptoCalendarDetail(e){
    wx.navigateTo({ 
      url: "/pages/modifythenickname/modifythenickname?share_uid=" + this.data.share_uid + "&calendar_id="+e.currentTarget.dataset.calendar_id
    })
  },
  onFocus: function (w) {
    this.setData({
      inputtxt1: ""
    });
  },
  sscloseFun(){
    setTimeout( ()=>{
      this.setData({ inputdata: '' });
    },200)
    wx.navigateBack();
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

    _this.jump();
   
    // var q = Dec.Aese('mod=getinfo&operation=list&type=hot')
    // wx.request({
    //   url: app.signindata.comurl + 'search.php' + q,
    //   method: 'GET',
    //   header: { 'Accept': 'application/json' },
    //   success: function (res) {

    //     if (res.data.Navi) {
    //       _this.setData({
    //         hotdata: res.data.Navi || []
    //       });
    //     }
    //     _this.jump();
    //   },
    //   fail: function () {
    //     _this.jump();
    //   }
    // })
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
    var hotdata = app.signindata.searchSkipKeyword||[];
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
      // '+ _this.data.inputdata +'
      wx.showLoading({ title: '加载中...', })
      _this.setData({
        listDataA:[],
        listDataB:[],
        pid:0,
        iftrimg:false,
        isonReachBottom:true
      });
      _this.gitInfo();
    };
  },
  gitInfo(){
      var _this = this;
      // 商品列表
      // var q = Dec.Aese('mod=search&operation=search&key=Mix&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&pid='+_this.data.pid)
      var q = Dec.Aese('mod=search&operation=search&key='+ _this.data.inputdata +'&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&pid='+_this.data.pid)
      console.log('https://api.51chaidan.com/search.php?mod=search&operation=search&key='+ _this.data.inputdata +'&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&pid='+_this.data.pid)
      wx.request({
        url: app.signindata.comurl + 'search.php' + q,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {
          console.log('商品列表=======',res.data)
          _this.setData({ clicktherequestiftr: true});
          wx.hideLoading();
          // 刷新完自带加载样式回去
           wx.stopPullDownRefresh();
          if (res.data.ReturnCode == 200) {
            console.log('listDataA======',res.data.List.record.normal)
            console.log('listDataB======',res.data.List.record.store)
            console.log('listDataC======',res.data.List.record.recommend)
            let normal = res.data.List.record.normal;
            let store = res.data.List.record.store;
            let recommend = res.data.List.record.recommend;
            let calendar = res.data.List.record.calendar;

            
            
            if(_this.data.pid==0){
              _this.data.listDataC = recommend;
            }

            if(normal.length==0 && (!store || store.length==0) && _this.data.pid==0 && calendar.length==0){
              _this.setData({
                iftrimg:true,
                isonReachBottom:false,
                listDataB: [..._this.data.listDataB,..._this.data.listDataC]
              });
            } else if ((!store || store.length<5) && _this.data.pid!=0){
              _this.setData({
                isonReachBottom:false,
                listDataB: [..._this.data.listDataB,..._this.data.listDataC]
              });
            }else if(store && normal){
              _this.setData({
                listDataA:normal,
                listDataB: [..._this.data.listDataB,...store]
              });
            } else if(normal && !store){
              _this.setData({
                isonReachBottom:false,
                listDataA:[...normal,..._this.data.listDataC]
              });
            } else if (normal.length==0 &&store){
              if(store.length<5){
                _this.setData({
                  isonReachBottom:false,
                  listDataB: [...store,..._this.data.listDataC]
                });
              }else{
                _this.setData({
                  listDataB: store
                });
              }
            }


            if(calendar && calendar.length != 0){
              _this.setData({
                listDataA:[...calendar,..._this.data.listDataA]
              });
            }

          }
        },
        fail: function () {
        }
      })   
  },
  clickJump(e){
    let itemid = e.currentTarget.dataset.itemid;
    let itemtype = e.currentTarget.dataset.itemtype;
    let url = e.currentTarget.dataset.url;
    let idtype = e.currentTarget.dataset.idtype;
    wx.navigateTo({
      url: url+'?'+idtype+'='+e.currentTarget.dataset.itemid
    });
  },
  clickJumpBrand(e){
    let itemid = e.currentTarget.dataset.itemid;
    let itemtype = e.currentTarget.dataset.itemtype;
    let url = e.currentTarget.dataset.url;
    let idtype = e.currentTarget.dataset.idtype;
    if(itemtype == "store"){
      wx.navigateTo({
        url: url+'?'+idtype+'='+itemid +"&settlement=0"
      });
    }else{
      wx.navigateTo({
        url: url+'?'+idtype+'='+itemid +"&settlement=1"
      });
    }
   
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

    _this.setData({
      headhidden: false,
      listDataA:[],
      listDataB:[],
      iftrimg:false,
      pid:0,
      isonReachBottom:true
    });
    // 商品列表
    wx.showLoading({ title: '加载中...', })
    _this.gitInfo();
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
      pid: ++this.data.pid
    });
    // 商品列表
    if(_this.data.isonReachBottom){
      wx.showLoading({ title: '加载中...', })
      _this.gitInfo();
    }else{
      app.showToastC('没有更多数据了');
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.sharemc()    
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