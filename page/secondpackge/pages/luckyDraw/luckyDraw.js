var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '展会VIP抽选', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    share_uid:0,
    countdown:'',
    percent:'',
    isRecordMask:false,
    isAwardMask:false,
    isidCardMask:false,
    idcardIndex:0,
    selectCard:0,
    // 绑定身份证id
    bindIdcard:'',
    bindDate:'',
    // 抽奖数
    drawnum:1,
    isShowRule:false,
    isPrior:false,
    // 弹框数据
    mySignatureNumber:false,
    signatureList:false,
    winningProbability:false,
    // 是否中奖
    wonOrNot:false,
    sigListdata:[],
    rLUserLotto:{},
    muSnData:[],
    multipleDisplay:'',
    displayClearText:false,

    id:'374855',
    current:0,
    commoddata:{}
  },

  tabChangeFun(e){
    this.setData({
      current: e.currentTarget.dataset.ind
    });
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

    var q = Dec.Aese('mod=lotto&operation=info&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&isNewer=' + _this.data.isNewer + '&gid=' + _this.data.gid + '&push_id='+_this.data.push_id);
    console.log('mod=lotto&operation=info&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&isNewer=' + _this.data.isNewer + '&gid=' + _this.data.gid + '&push_id='+_this.data.push_id)

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
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
          let dataInfo = res.data.Info;
          _this.setData({
            dataInfo,
            priority: res.data.List.priority,
            countdown: dataInfo.status==1?res.data.Info.start_time:dataInfo.status==2?res.data.Info.stop_time:0,
          });  
          _this.countdownbfun();        
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
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否授权
    var _this = this;
    _this.data.share_uid = options.share_uid || 0
    _this.activsign();
    _this.countdownbfun();        
    // this.onLoadfun(); 
  },
  onLoadfun:function(){
    var _this = this;
    _this.setData({
      uid: app.signindata.uid,
      loginid: app.signindata.loginid,
    });  
    _this.getInfo();
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
      title:'刮刮卡:我正在美拆抽取展会优先入场资格，快来帮我助力吧',
      path: "/page/secondpackge/pages/luckyDraw/luckyDraw?share_uid=" + _this.data.uid,
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
      title:'刮刮卡:我正在美拆抽取展会优先入场资格，快来帮我助力吧',
      query:'share_uid='+_this.data.uid,
      imageUrl:indexShareImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
    }
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
        dayStr:commoddata.day,
        hrStr:commoddata.hour,
        minStr:commoddata.minute,
        secStr:commoddata.second,
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
  jumpVipPage(){
    wx.navigateTo({  
      url: "/page/secondpackge/pages/vipPage/vipPage"
    })
  },
   // 订阅授权
   subscrfun:function(){
    var _this = this;
    app.comsubscribe(_this);
  },
  // 中奖概率 弹框
  winProbility(w){
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    if(ind == 9999){
      this.setData({
        winningProbability:!this.data.winningProbability
      })
    }else{
      if(ind == 999){
        var multipleDisplay = this.data.rLUserLotto
      }else{
        var multipleDisplay = this.data.sigListdata[ind];
      };
      this.setData({
        winningProbability:!this.data.winningProbability,
        multipleDisplay:multipleDisplay
      })      
    };

  },
  wonOrNot(){
    this.setData({wonOrNot:!this.data.wonOrNot})
  },
  // 已获得幸运值
  mySignatureNum(){
    var _this = this;
    if(_this.data.muSnData.length == 0){

      var qhd = Dec.Aese('mod=miandan&operation=mylotto&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id);
      wx.showLoading({ title: '加载中...', mask: true })
      wx.request({
        url: app.signindata.comurl + 'spread.php' + qhd,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {
          console.log('签号列表================',res)
          wx.hideLoading();
          if (res.data.ReturnCode == 200) {
            var muSnData = res.data.List.lotto || [];
            if(muSnData.length != 0){
              muSnData.map(function(item){
                if(item.nick){
                  item.nick =  _this.plusXing(item.nick,1,0);
                };
                return item;
              })
            };
            _this.setData({
              muSnData:muSnData || []
            });
            _this.setData({mySignatureNumber:!_this.data.mySignatureNumber})
          } else {
            app.showModalC(res.data.Msg)
          };
        }
      }); 
    }else{
      this.setData({mySignatureNumber:!this.data.mySignatureNumber})
    };
  },
  // 排行榜
  sigListFun(){
    var _this = this;
    if(_this.data.sigListdata.length == 0){
      var qhd = Dec.Aese('mod=miandan&operation=lottoTop&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id);
      wx.showLoading({ title: '加载中...', mask: true })
      wx.request({
        url: app.signindata.comurl + 'spread.php' + qhd,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {
          console.log('列表排行================',res)
          wx.hideLoading();
          if (res.data.ReturnCode == 200) {
            var sigListdata = res.data.List.lotto || [];
            if(sigListdata.length != 0){
              sigListdata.map(function(item){
                if(item.nick){
                  item.nick = _this.plusXing(item.nick,1,0);
                };
                return item;
              })
            };

            _this.setData({
              sigListdata:sigListdata || [],
              rLUserLotto:res.data.Info.userLotto || {}
            })
            _this.setData({signatureList:!_this.data.signatureList})
          } else {
            app.showModalC(res.data.Msg)
          };
        }
      }); 
    }else{
      this.setData({signatureList:!this.data.signatureList})
    };

    
  },
  //  复制内容到粘贴板
  copyTBL: function (e) {
    var _this = this;
    wx.setClipboardData({
      data: '123456',
      success: function (res) {
        app.showToastC('复制成功');
      }
    });

  },  
  // 激活码 是否明文 切换
  is_dct:function(){
    this.setData({
      displayClearText:!this.data.displayClearText
    })
  },
  // 去激活
  deactivation(){
    app.showToastC('暂未开放');
  }


})