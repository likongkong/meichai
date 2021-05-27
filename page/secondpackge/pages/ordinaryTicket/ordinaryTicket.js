var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '入场核验', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    oid:0,
    day:4
  },

  plusXing (str,frontLen,endLen) {
    var len = str.length-frontLen-endLen;
    var xing = '';
    for (var i=0;i<len;i++) {
    xing+='*';
    }
    return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
  },
 
  getInfo(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=getinfo&operation=showTicketInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + this.data.oid);
    console.log('mod=getinfo&operation=showTicketInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + this.data.oid)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log('数据======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          res.data.Info.tel = _this.plusXing(res.data.Info.tel,4,3)
          res.data.Info.idcard = _this.plusXing(res.data.Info.idcard,6,4)
          _this.setData({
            priorify:res.data.Info
          })
        }else{
          wx.showToast({
            title: res.data.Msg,
            icon: 'none',
            mask:true,
            duration:1000
          });  
        }
      }
    }); 
  },

  setTicketInfo(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=getinfo&operation=setTicketInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + this.data.oid);
    console.log('mod=getinfo&operation=setTicketInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + this.data.oid)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log('核验======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          wx.showToast({
            title: res.data.Msg,
            icon: 'none',
            mask:true,
            duration:2000
          });
          setTimeout(() => {
            _this.getInfo();
          }, 2000);
        }else{
          wx.showToast({
            title: res.data.Msg,
            icon: 'none',
            mask:true,
            duration:1000
          });  
        }
      }
    }); 
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

  GetRequest(url) {  
    var theRequest = new Object();  
    if (url.indexOf("?") != -1) {  
       var str = url.substr(1);  
       strs = str.split("&");  
       for(var i = 0; i < strs.length; i ++) {  
          theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);  
       }  
    }  
    return theRequest;  
 },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否授权
    var _this = this;
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      console.log('options========',scene)
      _this.data.oid = _this.getSearchString('oid', scene) || 0;
    } else {
      _this.data.oid = options.oid || 10907;
    };
    _this.activsign();
    wx.hideShareMenu();
  },
  onLoadfun:function(){
    var _this = this;
    _this.setData({
      uid: app.signindata.uid,
      loginid: app.signindata.loginid,
    });  

    // wx.showModal({
    //   title: '提示',
    //   content: '这是一个模态弹窗',
    //   success (res) {
    //     if (res.confirm) {
          wx.scanCode({
            success (res) {
              // res.path = decodeURIComponent(res.path);
              console.log(res,111111111)
              var a = _this.GetRequest(res.path)
              console.log(a,2222222)
              // var b =_this.getSearchString('oid', a)
              // console.log(res,11111111111,_this.getSearchString('scene', res.path),a,b)
              // wx.redirectTo({
              //   url: '/'+res.path
              // })
            }
          })
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
    

    if(app.signindata.isManager){
      _this.getInfo();
    }else{
      wx.showToast({
        title: '你无权访问该页面',
        icon: 'none',
        mask:true,
        duration:1500
      });  
      setTimeout(() => {
        wx.reLaunch({
          url: "/pages/index/index"
        })
      }, 1500);
    }

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
        if (true) {
          // '已经授权'
          _this.setData({
            loginid: app.signindata.loginid,
            uid: app.signindata.uid,
            openid: app.signindata.openid,
            avatarUrl: app.signindata.avatarUrl,
            isShareFun: app.signindata.isShareFun,
            isProduce: app.signindata.isProduce,
            signinlayer: true,
            tgabox: false
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this);
          }
        } else {
          console.log(11111111111111111111111111111)
          _this.setData({
            tgabox: false,
            signinlayer: false
          })
          console.log()
          // '没有授权 统计'
          app.userstatistics(49);
          _this.onLoadfun();
        }
      }
    });      
  },
  // 授权点击统计
  clicktga: function () {
    app.clicktga(2)
  },
  clicktganone: function () {
    this.setData({ tgabox: false })
  },
  // 点击登录获取权限
  userInfoHandler: function (e) {
    var _this = this;
    wx.getSetting({
      success: res => {
        if (true) {
          _this.setData({
            signinlayer: true,
            tgabox: false
          });
          _this.activsign();
          // 确认授权用户统计
          app.clicktga(4);          
        }
      }
    });
    if (e.detail.detail.userInfo) { } else {
      app.clicktga(8)  //用户按了拒绝按钮
    };
  },
  pullupsignin: function () {
    // // '没有授权'
    this.setData({
      tgabox: true
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
    this.getInfo();
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
    var _this = this;
    return {
      title:'我正在美拆抽取展会优先入场资格，快来一起参与吧',
      path: "/page/secondpackge/pages/luckyDraw/luckyDraw?id="+_this.data.id,
      imageUrl:app.signindata.indexShareImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
    } 
  },
  // /**
  //  * 用户点击右上角分享
  //  */
  onShareTimeline:function(){
    var _this = this;
    var indexShare = app.signindata.indexShare || [];
    var indexShareNum = Math.floor(Math.random() * indexShare.length) || 0;
    var indexShareImg = '';
    if(indexShare.length!=0 && indexShare[indexShareNum]){
      indexShareImg = indexShare[indexShareNum]+'?time=' + Date.parse(new Date());;
    };
    return {
      title:'我正在美拆抽取展会优先入场资格，快来一起参与吧',
      query:'perayu=1&id='+_this.data.id,
      imageUrl:indexShareImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
    } 
  },  

  // 跳转展会门票
  acetlistfun(){
    wx.navigateTo({  
      url: "/page/secondpackge/pages/buyingTickets/buyingTickets"
    })
  }


})