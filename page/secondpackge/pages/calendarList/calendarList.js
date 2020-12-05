var Dec = require('../../../../common/public.js'); //aes加密解密js
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '限定日历投票',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    // 授权弹框
    tgabox: false,
    signinlayer:true,
    windowHeight: app.signindata.windowHeight - 65 - wx.getStorageSync('statusBarHeightMc') || 0,
    share_uid:0,
    tabIndex:4,
    ispopupMask:false,
    isShowSearch:false,
    swiperCalendrList:[],
    listData:[],
    brandData:[],
    pid:0,
    isReachBottom:true,
    brand_name:'',
    brand_name_dis:'',
    countdown:'',
    isAwardBox:false,
    isJumpSignin:false
  },
  toggleAwardFun(){
    this.setData({
      isAwardBox:!this.data.isAwardBox
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 判断是否授权 
    var _this = this;
    this.data.share_uid = options.share_uid || 0
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      isProduce: app.signindata.isProduce,
      // 适配苹果X 
      isIphoneX: app.signindata.isIphoneX
    });
    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      _this.onLoadfun();
      }else{
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // '已经授权'
              _this.setData({
                loginid: app.signindata.loginid,
                uid: app.signindata.uid,
                openid: app.signindata.openid,
                isProduce: app.signindata.isProduce,
                // 适配苹果X 
                isIphoneX: app.signindata.isIphoneX
              });
              // 判断是否登录
              if (_this.data.loginid != '' && _this.data.uid != '') {
                _this.onLoadfun();
              } else {
                app.signin(_this)
              }
              _this.setData({
                signinlayer: true,
              })
            } else {
              wx.hideLoading()
              _this.onLoadfun();
              _this.setData({
                signinlayer: false,
              })
              // '没有授权 统计'
              app.userstatistics(45);

            }
          }
        });
      };
  },
  onLoadfun: function() {
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      isProduce: app.signindata.isProduce,
      // 适配苹果X 
      isIphoneX: app.signindata.isIphoneX
    });
    wx.showLoading({
      title: '加载中...',
    })
    _this.getInfo();
    _this.getSwiperInfo();
  },



  pullupsignin: function () {
    // // '没有授权'
    this.setData({
      tgabox: true
    });
  },
  // 授权点击统计
  clicktga: function () {
    app.clicktga(2)
  },
  clicktganone: function () {
    this.setData({
      tgabox: false
    })
  },
  userInfoHandler: function (e) {
    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 确认授权用户统计
          app.clicktga(4);
          _this.setData({
            tgabox: false,
            signinlayer: true,
          });
          // '已经授权'
          _this.data.loginid = app.signindata.loginid,
          _this.data.openid = app.signindata.openid,
          _this.data.isNewer = app.signindata.isNewer;

          _this.setData({
            uid: app.signindata.uid,
            avatarUrl: app.signindata.avatarUrl,
            isProduce: app.signindata.isProduce,
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this);
          };
        } else {
          _this.setData({
            tgabox: true
          });
        }
      }
    });
    if (e.detail.detail.userInfo) { } else {
      app.clicktga(8) //用户按了拒绝按钮
    };

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
    if(this.data.isJumpSignin && this.data.uid){
      this.getSwiperInfo();
      this.data.isJumpSignin = false;
    };
    if (this.data.countdown) {
      this.countdownbfun();
    };
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer);
  },

  // 倒计时
  countdownbfun: function () {
    var _this = this;
    clearInterval(_this.data.timer);
    var countdown = _this.data.countdown || '';
    var commoddata = _this.data.commoddata||{};

    function nowTime() { //时间函数
      var iftrins = true;
      // 获取现在的时间
      var nowTime = new Date().getTime();
      // nowTime = Date.parse(nowTime);//当前时间戳
      var lastTime = countdown * 1000;
      var differ_time = lastTime - nowTime; //时间差：
      if (differ_time >= 0) {
        var differ_day = Math.floor(differ_time / (3600 * 24 * 1e3));
        var differ_hour = Math.floor(differ_time % (3600 * 1e3 * 24) / (1e3 * 60 * 60));
        var differ_minute = Math.floor(differ_time % (3600 * 1e3) / (1000 * 60));
        var s = Math.floor(differ_time % (3600 * 1e3) % (1000 * 60) / 1000);
        if (differ_day.toString().length < 2) {
          differ_day = "0" + differ_day;
        };
        if (differ_hour.toString().length < 2) {
          differ_hour = "0" + differ_hour;
        };
        if (differ_minute.toString().length < 2) {
          differ_minute = "0" + differ_minute;
        };
        if (s.toString().length < 2) {
          s = "0" + s;
        };
        commoddata.day = differ_day;
        commoddata.hour = differ_hour;
        commoddata.minute = differ_minute;
        commoddata.second = s;
      } else {
        commoddata.day = '00'
        commoddata.hour = '00';
        commoddata.minute = '00';
        commoddata.second = '00';
      };
      if (commoddata.day != '00' || commoddata.hour != '00' || commoddata.minute != '00' || commoddata.second != '00') {
        iftrins = false;
      };
      _this.setData({
        commoddata: commoddata
      });
      
      if (iftrins) {
        clearInterval(_this.data.timer);
      };
    }
    if (countdown) {
      nowTime();
      clearInterval(_this.data.timer);
      _this.data.timer = setInterval(nowTime, 1000);
    };
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      listData:[],
      brandData:[],
      pid:0,
      isReachBottom:true
    })
    wx.showLoading({
      title: '加载中...',
    })
    if(this.data.tabIndex != 5){
      if(this.data.brand_name!=''){
        let search = true;
        this.getInfo(search);
      }else{
        this.getInfo()
      }
    }else{
      this.getBrandRanking();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.isReachBottom){
      this.setData({
        pid:++this.data.pid
      })
      wx.showLoading({
        title: '加载中...',
      })
      if(this.data.tabIndex != 5){
        this.getInfo()
      }else{
        this.getBrandRanking();
      }
    }else{
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 1500
      })
    }
  },
  onShareTimeline:function(){
    var _this = this;
    return {
      title: '这个展会限量版日历太好看了，快来为Ta投票免费拿',
      query:'share_uid='+_this.data.uid,
      imageUrl:_this.data.shareImg,
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this;
    return {
      title: '这个展会限量版日历太好看了，快来为Ta投票免费拿',
      path: '/page/secondpackge/pages/calendarList/calendarList?share_uid='+_this.data.uid,
      imageUrl:_this.data.shareImg,
      success: function (res) {}
    } 
  },
  onFocus: function (w) {
    this.setData({
      brand_name:"",
      brand_name_dis:''
    });
  },
  // input 值改变
  inputChange: function (e) {
    this.setData({
      brand_name: e.detail.value,
      brand_name_dis:e.detail.value
    });
  },
  showSearchFun(){
    this.setData({
      isShowSearch:!this.data.isShowSearch
    })
  },
  tabChangeFun(e){
    let ind = e.currentTarget.dataset.ind;
    this.setData({
      tabIndex:ind,
      pid:0,
      listData:[],
      brandData:[],
      isReachBottom:true,
      brand_name:'',
      brand_name_dis:''
    })
    wx.showLoading({
      title: '加载中...',
    })
    if(ind == 1 || ind == 2 || ind == 4){
      this.getInfo();
    }else{
      this.getBrandRanking();
    }
  },
  jumptoIWasInvolved(e){
    this.data.isJumpSignin = true;
    wx.navigateTo({ 
      url: "/page/component/pages/iWasInvolved/iWasInvolved?share_uid=" + this.data.share_uid
    })
  },
  jumptoCalendarDetail(e){
    if(e.currentTarget.dataset.brand_id){
      wx.navigateTo({ 
        url: "/pages/modifythenickname/modifythenickname?share_uid=" + this.data.share_uid + "&brand_id=" + e.currentTarget.dataset.brand_id
      })
    }else{
      wx.navigateTo({ 
        url: "/pages/modifythenickname/modifythenickname?share_uid=" + this.data.share_uid + "&calendar_id="+e.currentTarget.dataset.calendar_id
      })
    }
  },
  jumpsearch(){
    this.setData({
      tabIndex:1,
      pid:0,
      listData:[],
      isReachBottom:true
    })
    let search = true;
    this.getInfo(search);
  },
  getSwiperInfo(){
    let _this = this;
    let q = Dec.Aese('mod=Obtain&operation=calendarList&type='+3+'&uid=' +_this.data.uid+'&loginid='+_this.data.loginid)
    console.log('顶部日历轮播请求=============','mod=Obtain&operation=calendarList&type='+3+'&uid=' +_this.data.uid+'&loginid='+_this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'brandDrying.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('顶部日历轮播=============',res)
        if (res.data.ReturnCode == 200) {
          _this.setData({
            swiperCalendrList:res.data.List.calendrList,
            explain:res.data.List.explain || '',
            voteChance:res.data.List.voteChance
          })
          _this.data.shareImg = res.data.List.shareImg || '';
          _this.data.countdown = res.data.List.endTime || '';
          _this.countdownbfun();          

        }else{
          _this.setData({
            swiperCalendrList:[]
          })
        }
      }
    })
  },
  getInfo(search = false){
    let _this = this;
    // if(search){
      var q = Dec.Aese('mod=Obtain&operation=calendarList&type='+_this.data.tabIndex+'&pid='+_this.data.pid+'&keyword='+_this.data.brand_name+'&uid=' +_this.data.uid+'&loginid='+_this.data.loginid)
      console.log('mod=Obtain&operation=calendarList&type='+_this.data.tabIndex+'&pid='+_this.data.pid+'&keyword='+_this.data.brand_name+'&uid=' +_this.data.uid+'&loginid='+_this.data.loginid)
    // }else{
    //   var q = Dec.Aese('mod=Obtain&operation=calendarList&type='+_this.data.tabIndex+'&pid='+_this.data.pid)
    //   console.log('mod=Obtain&operation=calendarList&type='+_this.data.tabIndex+'&pid='+_this.data.pid)
    // }
    wx.request({
      url: app.signindata.comurl + 'brandDrying.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log('内容=============',res)
        if (res.data.ReturnCode == 200) {
          // if(res.data.List.calendrList.length<40 && _this.data.pid != 0){
          //   _this.setData({
          //     isReachBottom:false
          //   })
          //   wx.showToast({
          //     title: '没有更多数据了',
          //     icon: 'none',
          //     duration: 1500
          //   })
          // }
          let listData = [..._this.data.listData,...res.data.List.calendrList];
          // listData.sort(function(a,b){
          //   return a.rank - b.rank
          // })
          _this.setData({
            listData,
            voteChance:res.data.List.voteChance,
            brand_name_dis:''
          })
        }else if(res.data.ReturnCode == 201){
          _this.setData({
            isReachBottom:false,
            brand_name_dis:''
          })
          wx.showToast({
            title: res.data.Msg,
            icon: 'none',
            duration: 1500
          })
        }
      }
    })
  },
  getBrandRanking(){
    let _this = this;
    let q = Dec.Aese('mod=Obtain&operation=calendarBrandList&pid='+_this.data.pid)
    console.log('mod=Obtain&operation=calendarBrandList&pid='+_this.data.pid)
    wx.request({
      url: app.signindata.comurl + 'brandDrying.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log('品牌排行榜=============',res)
        if (res.data.ReturnCode == 200) {
          let brandData = [..._this.data.brandData,...res.data.List.calendrList];
          // brandData.sort(function(a,b){
          //   return a.rank - b.rank
          // })
          _this.setData({
            brandData
          })
        }else if(res.data.ReturnCode == 201){
          _this.setData({
            isReachBottom:false
          })
          wx.showToast({
            title: res.data.Msg,
            icon: 'none',
            duration: 1500
          })
        }
      }
    })
  },

   // 投票
   votingInterface:function(w){

    var _this = this;

    var brand_id = w.currentTarget.dataset.brand_id || w.target.dataset.brand_id || 0;
    var calendar_id = w.currentTarget.dataset.calendar_id || w.target.dataset.calendar_id || 0;
    var index = w.currentTarget.dataset.index || w.target.dataset.index || 0;

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
          let change = "listData["+ index +"].vote_number";
          _this.setData({
            [change]: ++_this.data.listData[ index ].vote_number,
            voteChance:--_this.data.voteChance
          })
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
                  wx.navigateTo({
                    url: "/page/component/pages/iWasInvolved/iWasInvolved?share_uid=" + _this.data.share_uid || 0
                  })
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
      }
    });    
  },
})