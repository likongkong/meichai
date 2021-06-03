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
    day:4,
    is_bg:false
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
            duration:3000
          });  
        }
      }
    }); 
  },

  setTicketInfo(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=getinfo&operation=setTicketInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + this.data.oid);
    console.log('核验======','mod=getinfo&operation=setTicketInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + this.data.oid)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log('核验结果======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          wx.showModal({
            title: '提示',
            content: res.data.Msg,
            cancelText:'关闭',
            confirmText:'继续核验',
            success (res) {
              if (res.confirm) {
                wx.scanCode({
                  success (res) {
                    console.log('扫码结果===',res)
                    var a = _this.GetRequest(res.path)
                    console.log('scene===',decodeURIComponent(a.scene))
                    var oid=_this.getCaption(decodeURIComponent(a.scene))
                    console.log('oid===',oid)
                    wx.redirectTo({
                      url: '/page/secondpackge/pages/ordinaryTicket/ordinaryTicket?oid='+oid
                    })
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
                _this.getInfo();
              }
            }
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
    var url = url;
    var temp1 = url.split('?');
    var pram = temp1[1];
    var keyValue = pram.split('&');
    var obj = {};
    for (var i = 0; i<keyValue.length; i++){
        var item = keyValue[i].split('=');
        var key = item[0];
        var value = item[1];
        obj[key] = value;
    }
    return obj
 },

 
 getCaption(obj){
  var index=obj.lastIndexOf("\=");
  obj=obj.substring(index+1,obj.length);
  return obj;
},
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否授权
    console.log('options========',options)
    var _this = this;
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      console.log('options.scene========',scene)
      _this.data.oid = _this.getCaption(scene) || 0;
    } else {
      _this.data.oid = options.oid || 0;
    };
    _this.activsign();
    wx.hideShareMenu();
  },
  indexpic(){
    var _this = this;
    wx.request({
      url: 'https://meichai-1300990269.cos.ap-beijing.myqcloud.com/produce/openScreen.json?time='+app.signindata.appNowTime,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if(res.data && res.data.List && res.data.List.openscreen){
          var openscreen = res.data.List.openscreen || [];
          var imgnum = Math.floor(Math.random() * openscreen.length) || 0;
          var nowTime = Date.parse(new Date());//当前时间戳
          if(openscreen[imgnum]){
            var imgUrl = openscreen[imgnum]+'?time=' + nowTime;
            app.signindata.tgaimg = imgUrl;
            console.log('首页开机图片===========', res,imgnum,imgUrl)
            _this.setData({
              imgUrl: imgUrl
            });
          }
        };    
      },
      fail: function (res) {}
    }) 
  },
  onLoadfun:function(){
    var _this = this;
    _this.setData({
      uid: app.signindata.uid,
      loginid: app.signindata.loginid,
    });  
    if(app.signindata.isManager){
      _this.setData({
        is_bg:true
      })
      _this.getInfo();
    }else{
      _this.indexpic()
      _this.setData({
        is_bg:false
      })

      wx.showModal({ 
        content: '此页面为工作人员核验入场信息使用，暂时无法查看',
        showCancel:false,
        confirmText:'返回首页',
        success: function (res) {
          wx.redirectTo({
            url: "/pages/dismantlingbox/dismantlingbox",
          });
        }
      });

      // wx.showToast({
      //   title: '',
      //   icon: 'none',
      //   mask:true,
      //   duration:3000
      // });  
      // setTimeout(() => {
      //   wx.redirectTo({
      //     url: "/pages/dismantlingbox/dismantlingbox"
      //   })
      // }, 3000);
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