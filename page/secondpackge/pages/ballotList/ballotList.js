var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '中签名单', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    appNowTime: Date.parse(new Date()),
    pid:0,
    dataList:[],
    processingData:[],
    limit:17,
    loadprompt:true,
    ismore:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.data.id = options.id || 0
    // 判断是否授权
    this.activsign();
    console.log(_this.data.limit)

    let that = this;
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          worthSubsidiaryHeight:((res.windowHeight - (res.statusBarHeight+44))/20)-1,
          moreH:((res.windowHeight - (res.statusBarHeight+44))/20)*2
        });
        console.log(res.windowHeight - (res.statusBarHeight+44))
      }
    });
  },
  onLoadfun:function(){
    var _this = this;
    _this.setData({
      uid: app.signindata.uid,
      loginid:app.signindata.loginid
    });  
    this.getInfo();
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
          _this.setData({
            tgabox: false,
            signinlayer: false
          })
          console.log()
          // '没有授权 统计'
          app.userstatistics(48);
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
    // this.reset();
    // this.getInfo();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
  nextpage(){
    if(this.data.loadprompt){
      this.data.pid = ++this.data.pid;
      // 处理数据分页    
      wx.showLoading({ title: '加载中...'})    
      this.processingDataPaging();
    }else{
      // wx.showToast({
      //   title: '没有更多数据了',
      //   icon: 'none',
      //   duration: 2000
      // })
      this.setData({ loadprompt: false })
    }
  },
  clicktganone: function () {
    this.setData({ tgabox: false })
  }, 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var reshare = app.sharemc();
    return reshare
  },
  getInfo(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=lotto&operation=lottoList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid +'&id=' +_this.data.id)
    console.log('mod=lotto&operation=lottoList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid +'&id=' +_this.data.id)
    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('详情数据======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        // wx.hideLoading();
        if (res.data.ReturnCode == 200) {
        
          _this.data.processingData = res.data.List.winnerLotto;
          _this.processingDataPaging();

          // var ticket = res.data.List.ticket;
          // for(var i=0;i<ticket.length;i++){
          //   ticket[i].actualidcard = ticket[i].idcard;
          //   ticket[i].idcard = _this.plusXing(ticket[i].idcard,4,4);
          //   ticket[i].consignee = _this.plusXing(ticket[i].consignee,1,0);
          //   ticket[i].mobile = _this.plusXing(ticket[i].mobile,3,4);
          // }
          // _this.setData({
          //   subscribedata:res.data.Info.subscribe,
          //   listData:ticket
          // });  
          // if(res.data.List.activity.length == 0 && _this.data.page == 0){
          //   _this.setData({ nodata : true})
          // }else{
          //   let alldata = [..._this.data.datalist,...res.data.List.activity];
          //   // console.log(alldata)
          //   _this.setData({datalist : alldata,rewardswiperData:res.data.List.topicActivity,consumemessageData:res.data.List.record,classifyArr:res.data.List.classifyList,countWelfare:res.data.Info.countWelfare})
          //   _this.setData({
          //     isredpacket:true
          //   })
          // }
        }
      }
    }); 
  },
  // reset(){
  //   this.setData({pid:0,dataList:[],loadprompt:true,nodata:false})
  // },
  // 处理列表数据分页
  processingDataPaging(){
    let _this = this;
    let pid = _this.data.pid;
    let limit = _this.data.limit;
    let dataList = _this.data.processingData;
    console.log(dataList,pid)
    // _this.setData({
    //   ismore:true
    // });  
    let data = [];
    if(pid == 0){
      for (let i=0; i < limit; i++) {
        if(dataList[i]!=undefined){
          data.push(dataList[i])
        }else{
          _this.data.loadprompt = false;
        }
      }
    }else{
      let num = Number(pid*limit);
      let len = Number(num+limit);
      for (let i=num; i < len; i++) {
        if(dataList[i]!=undefined){
          data.push(dataList[i])
        }else{
          _this.data.loadprompt = false;
        }
      }
    }
    console.log(data,pid)
    // setTimeout(function(){
      // 刷新完自带加载样式回去
      wx.stopPullDownRefresh();
      wx.hideLoading();
    // },500)
    // setTimeout(function() {
      _this.setData({
        dataList: data,
        ismore:true,
      })
      if(_this.data.dataList.length < _this.data.limit){
        _this.setData({
          loadprompt : false
        })
      }
    // },2000)

  },

})