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
    // 品牌详情 2 单张详情 1
    isBrandDetail:0,
    share_uid:0,
    pid:0,
    isBrandJumpCalend:false,
    shopDetail:false
  },
  shopDetailfun:function(){
    this.setData({
      shopDetail:!this.data.shopDetail
    })
  },
  // 跳转品牌
  jumpBrandDeail:function(w){
    var mid = w.currentTarget.dataset.mid || w.target.dataset.mid || 0;
    this.setData({
      isBrandDetail:2, 
      brand_id: mid
    })

    this.brandDetail();


    // wx.navigateTo({
    //   url: "/page/secondpackge/pages/brandDetails/brandDetails?id=" + mid + "&settlement=1",
    // });
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options===',options)
    var _this = this;
    // 品牌详情 2 单张详情 1
    if(options.brand_id){
      this.setData({
        isBrandDetail:2, 
        brand_id:options.brand_id
      })
    }else{
      this.setData({
        isBrandDetail:1,
        c_title: '展会日历',
        calendar_id:options.calendar_id
      })      
    }

    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          topheight : res.statusBarHeight+44 || 90
        });
      }
    })



    this.data.share_uid = options.share_uid || 0


    // 判断是否授权
    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      this.onLoadfun();
    }else{
      this.activsign();
    };
  },
  onLoadfun:function(){
    // '已经授权'
    this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      isAuthMobile:app.signindata.isAuthMobile
    });
    if(this.data.isBrandDetail==2){
      this.brandDetail()
    }else{
      this.calendarDetail(1);
    }
    
  },

  brandDetail:function(refresh){
    var _this = this;

    var refresh = refresh || false;

    wx.showLoading({ title: '加载中...',mask:true }) 

    var q = Dec.Aese('mod=Obtain&operation=BrandToCalendarList&uid=' +_this.data.uid+'&loginid='+_this.data.loginid+'&brand_id='+_this.data.brand_id + '&refresh=' + refresh);


    console.log(app.signindata.comurl + 'spread.php?'+'mod=Obtain&operation=BrandToCalendarList&uid=' +_this.data.uid+'&loginid='+_this.data.loginid+'&brand_id='+_this.data.brand_id + '&refresh=' + refresh)

    wx.request({
      url: app.signindata.comurl + 'brandDrying.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) { 
        console.log('brandDetail====',res)
        if (res.data.ReturnCode == 200) {
          var name = '展会日历';
          var goodsDescDetails = '';
          if(res.data.List && res.data.List.brandDetails){
            name = res.data.List.brandDetails.name || '展会日历';
            goodsDescDetails  = res.data.List.goodsInfo.goods_desc.replace(/<img/gi, '<img style="width:100%;height:auto;display:block;"');
          };
          

          _this.setData({
            c_title: name, 
            brandDetails:res.data.List.brandDetails,
            calendarDetails:res.data.List.calendarDetails,
            voteToUserList:res.data.List.voteToUserList,
            goodsDescDetails:goodsDescDetails || ''
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.Msg,
            showCancel: false,
            success: function (res) { }
          })           
        }
      },
      fail: function () {},
      complete:function(){
        wx.hideLoading()
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh()        
      }
    });
  },
  calendarDetail:function(num,refresh){
    var _this = this;

    var refresh = refresh || false;

    if (num == 1) {
      _this.data.pid = 0;
      _this.setData({
        listdata: [],
      });
    } else {
      var pagenum = parseInt(_this.data.pid)
      _this.data.pid = ++pagenum;
    };

    wx.showLoading({ title: '加载中...',mask:true }) 

    var q = Dec.Aese('mod=Obtain&operation=calendarInfo&uid=' +_this.data.uid+'&loginid='+_this.data.loginid+'&id='+_this.data.calendar_id+'&pid='+_this.data.pid + '&refresh=' + refresh);


    console.log(app.signindata.comurl + 'brandDrying.php?'+'mod=Obtain&operation=calendarInfo&uid=' +_this.data.uid+'&loginid='+_this.data.loginid+'&id='+_this.data.calendar_id+'&pid='+_this.data.pid + '&refresh=' + refresh)

    wx.request({
      url: app.signindata.comurl + 'brandDrying.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) { 
        console.log('calendarDetail====',res)
        if (res.data.ReturnCode == 200) {
          if(num == 1){
            _this.setData({
              calendarDetails:res.data.List.calendarDetails,
              calendarDetailsToUser:res.data.List.calendarDetailsToUser,
              otherCalendarByBrand:res.data.List.otherCalendarByBrand || []
            })
          }else{
            var store = res.data.List.calendarDetailsToUser || [];
            _this.setData({
              calendarDetailsToUser: [..._this.data.calendarDetailsToUser,...store]
            });
          }

        }else{
          app.showToastC(res.data.Msg);
        }
      },
      fail: function () {},
      complete:function(){
        wx.hideLoading();
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh()

      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    var _this = this;
    var form = options.target.dataset.form || 0;
    if (options.from == 'button' && form == 1) {
        var num = options.target.dataset.num || 0;
        var shareUrl = 'pages/modifythenickname/modifythenickname?calendar_id='+_this.data.calendarDetails[num].id + '&share_uid=' + _this.data.uid;
        var imageUrl = _this.data.calendarDetails[num].calendar_img || '';
    }else{
      if(_this.data.isBrandDetail == 2){
        var shareUrl = 'pages/modifythenickname/modifythenickname?brand_id='+_this.data.brand_id + '&share_uid=' + _this.data.uid;
        var imageUrl = _this.data.calendarDetails[0].calendar_img || [];
     }else{
        var shareUrl = 'pages/modifythenickname/modifythenickname?calendar_id='+_this.data.calendar_id + '&share_uid=' + _this.data.uid;
        var imageUrl = _this.data.calendarDetails.calendar_img || '';
     };
    };  
    console.log(shareUrl,imageUrl)
    return {
      title: '这个展会限量版台历太好看了，快来为它投票免费拿',
      path:shareUrl,
      imageUrl:imageUrl,
      success: function (res) {}
    }  
  },
  onShareTimeline:function(){
    var _this = this;
    if(_this.data.isBrandDetail == 2){
      var shareUrl = 'brand_id='+_this.data.brand_id+'&share_uid='+_this.data.share_uid;
      var imageUrl = _this.data.calendarDetails[0].calendar_img || [];
   }else{
      var shareUrl = 'calendar_id='+_this.data.calendar_id+'&share_uid='+_this.data.share_uid;
      var imageUrl = _this.data.calendarDetails.calendar_img || '';
   };
    return {
      title:'这个展会限量版台历太好看了，快来为它投票免费拿',
      query:shareUrl,
      imageUrl:imageUrl
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
        if (res.authSetting['scope.userInfo']) {
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
          app.userstatistics(44);
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
        if (res.authSetting['scope.userInfo']) {
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
    if(this.data.isBrandDetail==2){
      this.brandDetail(true)
    }else{
      this.calendarDetail(1,true);
    }
  },
  onReachBottom: function () {
    if(this.data.isBrandDetail==1){
      this.calendarDetail(2);
    }
  },

  clicktganone: function () {
    this.setData({ tgabox: false })
  }, 
 

  // 跳转
  jumpOtherPage:function(w){
    var num = w.currentTarget.dataset.num || w.target.dataset.num || 100000;
    var whref = w.currentTarget.dataset.whref || w.target.dataset.whref || 100000;
    var title = w.currentTarget.dataset.title || w.target.dataset.title || '';
    app.comjumpwxnav(num,whref,title)
  },
  // 跳转我的投票
  jumpiwas:function(){
    var _this = this;
    wx.navigateTo({
      url: "/page/component/pages/iWasInvolved/iWasInvolved?share_uid=" + _this.data.share_uid || 0
    })
  },

  // 投票
  votingInterface:function(w){

    var _this = this;

    var brand_id = w.currentTarget.dataset.brand_id || w.target.dataset.brand_id || 0;
    var calendar_id = w.currentTarget.dataset.calendar_id || w.target.dataset.calendar_id || 0;

    wx.showLoading({ title: '加载中...',mask:true }) 

    var q = Dec.Aese('mod=Obtain&operation=recordVote&uid=' +_this.data.uid+'&loginid='+_this.data.loginid + '&calendar_id=' + calendar_id + '&brand_id=' + brand_id + '&share_uid=' + _this.data.share_uid);


    console.log(app.signindata.comurl +'brandDrying.php?' + 'mod=Obtain&operation=recordVote&uid=' +_this.data.uid+'&loginid='+_this.data.loginid + '&calendar_id=' + calendar_id + '&calendar_id=' + brand_id + '&share_uid=' + _this.data.share_uid)


    wx.request({
      url: app.signindata.comurl + 'brandDrying.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) { 
        console.log('receivefun====',res)
        if (res.data.ReturnCode == 200) {
          wx.showModal({
            title: '',
            content: '投票成功',
            showCancel: false,
            success: function (res) { }
          })
          if(_this.data.isBrandDetail==2){
            _this.brandDetail()
          }else{
            _this.calendarDetail(1);
          }
        }else{
          if(res.data.ReturnCode == 386){
            wx.showModal({
              title: '提示',
              content: res.data.Msg,
              showCancel: true,
              cancelText:"取消",
              confirmText:"去获取",
              success: function (res) { 
                if (res.cancel) {} else {
                  //点击确定
                  _this.jumpiwas();
                }
              }
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
      },
      fail: function () {},
      complete:function(){
        wx.hideLoading()
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh()

      }
    });    
  },
  jumpLeaflet:function(w){

    var calendar_id = w.currentTarget.dataset.calendar_id || w.target.dataset.calendar_id || '';

    this.setData({
      isBrandDetail:1,
      c_title: '展会日历',
      calendar_id: calendar_id,
      isBrandJumpCalend:true
    })

    this.calendarDetail(1);

  },

  jumpLeafletNew:function(w){
    var calendar_id = w.currentTarget.dataset.calendar_id || w.target.dataset.calendar_id || '';
    this.setData({
      isBrandDetail:1,
      c_title: '展会日历',
      calendar_id: calendar_id
    })
    this.calendarDetail(1);
  },

  jumphomepage:function(){
    //获取当前时间戳  
    wx.redirectTo({
      url: "/pages/index/index" 
    });     

  },
  // 返回上一页
  gateback: function () {
    var _this = this;
    let pages = getCurrentPages();
    let prevpage = pages[pages.length - 2];
    if (prevpage) {
      if(_this.data.isBrandJumpCalend){
          _this.setData({
            isBrandDetail:2,
            isBrandJumpCalend:false
          })
          _this.brandDetail();
      }else{
          wx.navigateBack();
      };
    } else {
      wx.redirectTo({
        url: "/pages/index/index"
      });
    };
  },

})