var Dec = require('../../../../common/public.js'); //aes加密解密js
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '我的投票',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    // 授权弹框
    tgabox: false,
    signinlayer:true,
    windowHeight: app.signindata.windowHeight - 65 - wx.getStorageSync('statusBarHeightMc') || 0,
    
    ballotbox:false,
    pid:0,
    subscribedata:'',

    voteCalendarList: [],
    taskInfo:'', 
    subscribedata:'',
    share_uid:0,
    isJumpSignin:false,
    // Viptip:false
    countdown:'',
    isAwardBox:false,
    // 是否显示投票
    isShowVote:(Date.parse(new Date())/1000)<=1607702399?true:false
  },
  jumpVipPage(){
    app.comjumpwxnav(9021,'','');
  },
  toggleAwardFun(){
    this.setData({
      isAwardBox:!this.data.isAwardBox
    })
  },
  // vip 弹框
  // tipVipMode:function(){
  //   this.setData({Viptip:!this.data.Viptip})
  // },
  // 订阅授权
  subscrfun:function(){
    var _this = this;
    app.comsubscribe(_this);
  },
  
  
  ballotboxfun:function(){
    this.setData({
      ballotbox:true
    })
  },
  ballotboxnone:function(){
    this.setData({
      ballotbox:false
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
      isIphoneX: app.signindata.isIphoneX,
    });
    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      _this.onLoadfun();
      }else{
        wx.getSetting({
          success: res => {
            if (true) {
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
              app.userstatistics(47);

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

    _this.listdata(1);



  },

  evereceivefun:function(w){
    var num = w.currentTarget.dataset.num || w.target.dataset.num || 0;

    // if(num == 2){
    //   app.showToastC('敬请期待');
    //   return false;
    // }

    this.receivefun(num)
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
        console.log('votingInterface====',res)
        if (res.data.ReturnCode == 200) {
          wx.showModal({
            title: '',
            content: '投票成功',
            showCancel: false,
            success: function (res) { }
          })
          _this.listdata(1);
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

  // 每日领取，vip专属券  3 领取vip专属限时抽盒金
  receivefun:function(getType){
    var _this = this;

    wx.showLoading({ title: '加载中...',mask:true }) 

    var q = Dec.Aese('mod=Obtain&operation=getCalendarTicket&uid=' +_this.data.uid+'&loginid='+_this.data.loginid+'&getType='+getType);


    console.log(app.signindata.comurl +'brandDrying.php?' + 'mod=Obtain&operation=getCalendarTicket&uid=' +_this.data.uid+'&loginid='+_this.data.loginid+'&getType='+getType)


    wx.request({
      url: app.signindata.comurl + 'brandDrying.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) { 
        console.log('receivefun====',res)
        // if(getType == 3){
        //   _this.setData({Viptip:false})
        // };
        if (res.data.ReturnCode == 200) {
          wx.showModal({
            title: '',
            content: '领取成功',
            showCancel: false,
            success: function (res) { }
          })
          _this.listdata(1);
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

  bindDownLoad:function(){
    this.listdata(2)
  },

  listdata:function(num){
    var _this = this;
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

    var q = Dec.Aese('mod=Obtain&operation=personageInfo&uid=' +_this.data.uid+'&loginid='+_this.data.loginid+'&pid='+_this.data.pid);

    console.log(app.signindata.comurl+ 'brandDrying.php?' + 'mod=Obtain&operation=personageInfo&uid=' +_this.data.uid+'&loginid='+_this.data.loginid+'&pid='+_this.data.pid)

    wx.request({
      url: app.signindata.comurl + 'brandDrying.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) { 
        console.log('listdata====',res)
        if (res.data.ReturnCode == 200) {
          if (num == 1) {
             var infoData = res.data.Info;
             var listData = res.data.List;
             _this.setData({
              voteCalendarList:listData.voteCalendarList || [],
              taskInfo:infoData.taskInfo, 
              subscribedata:infoData.subscribe,
              voteChance:infoData.voteChance
             })
             _this.data.shareImg = infoData.shareImg || '';
             _this.data.countdown = listData.endTime || '';
             _this.countdownbfun();
          }else{
            var store = res.data.List.voteCalendarList || [];
            if(store.length!=0){
              _this.setData({
                voteCalendarList: [..._this.data.voteCalendarList,...store]
              });
            }else{
              app.showToastC('暂无更多数据');
            };

          };
    

        }else{
          app.showToastC(res.data.Msg);
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
        if (true) {
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
      this.listdata(1);
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
    this.listdata(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.listdata(2)
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
  // 跳转我的投票
  jumpiwas:function(){
    var _this = this;
    wx.navigateTo({
      url: "/page/secondpackge/pages/calendarList/calendarList?share_uid="+_this.data.share_uid
    })
  },
  // 跳转
  jumpOtherPage:function(w){
    var num = w.currentTarget.dataset.num || w.target.dataset.num || 100000;
    var whref = w.currentTarget.dataset.whref || w.target.dataset.whref || 100000;
    var title = w.currentTarget.dataset.title || w.target.dataset.title || '';
    app.comjumpwxnav(num,whref,title);
    if(num==9){
      this.data.isJumpSignin = true;
    }

  },
  bookingExhibVip:function(){
    app.showToastC('敬请期待');
  },
  // 预约展会
  bookingExhib:function(){
    wx.navigateTo({
      url: "/pages/dismantlingbox/dismantlingbox"
    });
    this.data.isJumpSignin = true;
  },
  // 单张详情
  jumpLeaflet:function(w){
    var calendar_id = w.currentTarget.dataset.calendar_id || w.target.dataset.calendar_id || 100000;
    var _this = this;
    wx.navigateTo({
      url: "/pages/modifythenickname/modifythenickname?calendar_id=" + calendar_id + "&share_uid=" + _this.data.share_uid || 0
    });
  },  

})