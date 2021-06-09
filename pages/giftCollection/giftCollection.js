var Dec = require('../../common/public.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    oid:'',
    is_bg:false

  },

  getItNow:function(){
     var _this = this;

     var qqq = Dec.Aese('mod=ticket&operation=varifyTicket&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + _this.data.oid);

     console.log('mod=ticket&operation=varifyTicket&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + _this.data.oid)

     wx.showLoading({ title: '加载中...',mask:true }) 
     wx.request({
       url: app.signindata.comurl + 'toy.php' + qqq,
       method: 'GET',
       header: { 'Accept': 'application/json' },
       success: function (res) {
         console.log('领取礼物',res)
         wx.hideLoading();
         // 刷新完自带加载样式回去
         wx.stopPullDownRefresh();          
         if (res.data.ReturnCode == 200) {
          wx.showModal({
            title: '提示',
            content: '领取成功',
            showCancel: false,
            success: function (res) {
              // wx.redirectTo({
              //   url: "/pages/index/index"
              // });
              _this.getData()
            }
          });
         }else{
           if(res.data.Msg){
             wx.showModal({
               title: '提示',
               content: res.data.Msg,
               showCancel: false,
               success: function (res) { }
             })
           };
         };
       }
     })

  },

  continueCheck(){
    wx.scanCode({
      success (res) {
        console.log('扫码结果===',res)
        var path = res.path; 
        path = res.path.split('?');
        var opScene = path[1];
        const oldscene = decodeURIComponent(opScene);
        var scene = oldscene.substring(6,oldscene.length);
        let obj = {}
        var arrPara = scene.split("&");
        for (let i = 0; i < arrPara.length; i++) {
          let arr_params = arrPara[i].split('=')
          obj[arr_params[0]] = arr_params[1]
        }
        console.log(obj,'obj')
        wx.redirectTo({
          url: '/pages/giftCollection/giftCollection?oid='+obj.oid
        })
      }
    })
  },

  getData:function(){
    var _this = this;



    var qqq = Dec.Aese('mod=ticket&operation=getTicketInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + _this.data.oid);

    console.log('mod=ticket&operation=getTicketInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + _this.data.oid)
    
    wx.showLoading({ title: '加载中...',mask:true })

    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('订单数据',res)
        wx.hideLoading();
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();

        if (res.data.ReturnCode == 200) {
            _this.setData({
              giftData:res.data.Info || {}
            })
        }else{
          if(res.data.Msg){
            wx.showModal({
              title: '提示',
              content: res.data.Msg,
              showCancel: false,
              success: function (res) { }
            })
          };
        };
      }
    })

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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options===',options)
    var _this = this;

    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      console.log('options========',scene)
      this.setData({
        oid: _this.getSearchString('oid', scene) || 0,
      })
    } else {
      console.log(2)
      this.setData({
        oid: options.oid || 0,
      })
    };

    // 判断是否授权
    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      this.onLoadfun();
    }else{
      this.activsign();
    };
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
    // '已经授权'
    this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      isAuthMobile:app.signindata.isAuthMobile,
      isProduce: app.signindata.isProduce,
      isManager:app.signindata.isManager || false
    });

    if(!app.signindata.isManager){
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
      //   title: '此页面为工作人员核验入场信息使用，3秒后会自动返回展会首页',
      //   icon: 'none',
      //   mask:true,
      //   duration:5000
      // });  
      // setTimeout(() => {
      //   wx.redirectTo({
      //     url: "/pages/dismantlingbox/dismantlingbox"
      //   })
      // }, 5000);


    }else{
      _this.setData({
        is_bg:true
      })
      this.getData()
    };



  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    var _this = this;

    // return {
    //   title: '这个展会限量版日历太好看了，快来为Ta投票免费拿',
    //   path:shareUrl,
    //   imageUrl:imageUrl,
    //   success: function (res) {}
    // }  
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
          console.log(111111)
          _this.setData({
            tgabox: false,
            signinlayer: false
          });
          _this.onLoadfun();

          // '没有授权 统计'
          app.userstatistics(46);

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

  onPullDownRefresh: function () {
    this.getData()
  },
  onReachBottom: function () {


  },

  clicktganone: function () {
    this.setData({ tgabox: false })
  }, 
 

})