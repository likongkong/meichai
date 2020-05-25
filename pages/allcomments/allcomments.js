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
    allcomlist:[],
    // gid值
    gid:'',
    // 页数
    page: 0,
    c_title: '所有评论',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),     
  },
  //时间戳转换时间  
  toDate: function (number) {
    var n = number * 1000;
    var date = new Date(n);
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (Y + M + D)
  },
  // 评论点赞
  commentary:function(w){
    var _this = this;
    var cid = w.currentTarget.dataset.cid || w.target.dataset.cid;
    var q = Dec.Aese('mod=thumbs&operation=thumbup&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid+'&cid='+cid);
    wx.request({
      url: app.signindata.comurl + 'user.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          wx.showToast({
            title: '点赞成功',
            icon: 'none',
            duration: 1500
          });
          var abcdata = _this.data.allcomlist;
          var ind = parseInt(w.currentTarget.dataset.ind);
          abcdata[ind].praised=1;
          abcdata[ind].praise = parseInt(abcdata[ind].praise)+1;
          _this.setData({
             allcomlist: abcdata
          })
        };
        if (res.data.ReturnCode == 900) {
          wx.showToast({
            title: '登陆状态有误',
            icon: 'none',
            duration: 1500
          });
        };
        if (res.data.ReturnCode == 912) {
          wx.showToast({
            title: 'gid和cid不匹配',
            icon: 'none',
            duration: 1500
          });
        };
        if (res.data.ReturnCode == 917) {
          wx.showToast({
            title: '已经为这个商品点赞',
            icon: 'none',
            duration: 1500
          });
        };        

      }
    })
  },
  // 取消评论点赞
  cancelcommentary: function (w) {
    var cid = w.currentTarget.dataset.cid || w.target.dataset.cid;
    var _this = this;
    var q = Dec.Aese('mod=thumbs&operation=thumbdown&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&cid=' +cid)
    wx.request({
      url: app.signindata.comurl + 'user.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          wx.showToast({
            title: '已取消点赞',
            icon: 'none',
            duration: 1500
          });
          var abcdata = _this.data.allcomlist;
          var ind = parseInt(w.currentTarget.dataset.ind);
          abcdata[ind].praised = 0;
          abcdata[ind].praise = parseInt(abcdata[ind].praise) - 1;
          _this.setData({
            allcomlist: abcdata
          })
        };
        if (res.data.ReturnCode == 918) {
          wx.showToast({
            title: '未关注过该商品',
            icon: 'none',
            duration: 1500
          });
        };        
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);      
      }
    })
  },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoadfun: function (){
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid
    }); 
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    var arrlist = '';
    wx.showLoading({ title: '加载中...', })
    var qq = Dec.Aese('mod=comment&operation=getgoodcomment&gid=' + _this.data.gid+'&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
    wx.request({
      url: app.signindata.comurl + 'user.php'+qq,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          var arrlist = res.data.List;
          if (arrlist.length !=0){
            for (var i = 0; i < arrlist.length; i++) {
              if (!reg.test(arrlist[i].headphoto)) {
                arrlist[i].headphoto = _this.data.zdyurl + arrlist[i].headphoto;
              }
              if (arrlist[i].praised==1){
                arrlist[i].praised=1;
              }else{
                arrlist[i].praised =0;
              }
              arrlist[i].time = _this.toDate(arrlist[i].time);
            };
            var lengthl = res.data.List.length - 1;
            _this.setData({
              allcomlist: res.data.List,
              page: res.data.List[lengthl].cid
            });
          }

        } else {
          _this.setData({
            allcomlist: [],
          })
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);        
      }
    }) 
  },
  onLoad: function (options) {
    this.setData({
      gid: options.gid
    });
    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // '已经授权'
          _this.setData({
            loginid: app.signindata.loginid,
            uid: app.signindata.uid
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
                url: "/pages/signin/signin"
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
    wx.showLoading({ title: '加载中...', })   
    var _this = this;
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    var arrlist = '';
    var q = Dec.Aese('mod=comment&operation=getgoodcomment&gid=' + _this.data.gid);
    wx.request({
      url: app.signindata.comurl + 'user.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading()
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();        
        if (res.data.ReturnCode == 200) {
          var arrlist = res.data.List;
          if (arrlist.length!=0){
            for (var i = 0; i < arrlist.length; i++) {
              if (!reg.test(arrlist[i].headphoto)) {
                arrlist[i].headphoto = _this.data.zdyurl + arrlist[i].headphoto;
              };
              if (arrlist[i].praised == 1) {
                arrlist[i].praised = 1;
              } else {
                arrlist[i].praised = 0;
              }              
              arrlist[i].time = _this.toDate(arrlist[i].time);
            };
            var lengthl = res.data.List.length - 1;
            _this.setData({
              allcomlist: res.data.List,
              page: res.data.List[lengthl].cid
            });           
          }
          // 刷新完自带加载样式回去
          wx.stopPullDownRefresh()
        }else{

        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);      
      }
    })    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({ title: '加载中...', })
    var _this = this;
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    var arrlist = '';
    var q = Dec.Aese('mod=comment&operation=getgoodcomment&ltype=more&gid=' + _this.data.gid + '&cid=' + _this.data.page)
    wx.request({
      url: app.signindata.comurl + 'user.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading()        
        if (res.data.ReturnCode == 200) {
            var arrlist = res.data.List;
            if (arrlist.length!=0){
              for (var i = 0; i < arrlist.length; i++) {
                if (!reg.test(arrlist[i].headphoto)) {
                  arrlist[i].headphoto = _this.data.zdyurl + arrlist[i].headphoto;
                };
                if (arrlist[i].praised == 1) {
                  arrlist[i].praised = 1;
                } else {
                  arrlist[i].praised = 0;
                }                
                arrlist[i].time = _this.toDate(arrlist[i].time);
              };
              var lengthl = res.data.List.length - 1;
              var comdataarr = _this.data.allcomlist.concat(arrlist);
              _this.setData({
                allcomlist: comdataarr,
                page: res.data.List[lengthl].cid
              });              
            }else{
              wx.showToast({
                title: '没有更多数据了',
                icon: 'none',
                duration: 1500
              });
            };
        }else{
          wx.showToast({
            title: '没有更多数据了',
            icon: 'none',
            duration: 1500
          })                    
        };       
      }
    })   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return Dec.sharemc()  
  }
})