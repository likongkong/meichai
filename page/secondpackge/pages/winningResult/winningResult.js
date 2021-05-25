var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
var WxParse = require('../../../../wxParse/wxParse.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '中奖结果', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    current:0,
    // 上拉加载数据
    pid: 0,
    limit:20,
    loadprompt:true,
    processingData:[],
    dataList:[]
  },

  tabqh(e){
    this.setData({
      current: e.currentTarget.dataset.ind
    }); 
    if(this.data.current==0){
      this.setData({
        processingData:this.data.twelve
      }); 
    }else if(this.data.current==1){
      this.setData({
        processingData:this.data.thirteen
      }); 
    }else if(this.data.current==2){
      this.setData({
        processingData:this.data.fourteen
      }); 
    }else if(this.data.current==3){
      this.setData({
        processingData:this.data.makeUpList
      }); 
    }
    this.reset();
    this.processingDataPaging()
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
    var q = Dec.Aese('mod=lotto&operation=priorityAwardList');
    console.log('mod=lotto&operation=priorityAwardList')

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
           _this.setData({
            dataInfo:res.data.Info,
           })
           if(res.data.List.makeUpList && res.data.List.makeUpList.length!=0){
            for(var i=0;i<res.data.List.makeUpList.length;i++){
              res.data.List.makeUpList[i].tel = _this.plusXing(res.data.List.makeUpList[i].tel,3,3)
              res.data.List.makeUpList[i].card = _this.plusXing(res.data.List.makeUpList[i].card,4,5)
             }
           }
           var twelve = res.data.List.listOfWinningResults.twelve;
           var thirteen = res.data.List.listOfWinningResults.thirteen;
           var fourteen = res.data.List.listOfWinningResults.fourteen;
           var makeUpList = res.data.List.makeUpList;
           _this.data.twelve = twelve;
           _this.data.thirteen = thirteen;
           _this.data.fourteen = fourteen;
           _this.data.makeUpList = makeUpList;

           if(_this.data.current == 0){
            _this.data.processingData = twelve;
           }else if(_this.data.current == 1){
            _this.data.processingData = thirteen;
           }else if(_this.data.current == 2){
            _this.data.processingData = fourteen;
           }else if(_this.data.current == 3){
            _this.data.processingData = makeUpList;
           }
           _this.processingDataPaging()
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

   // 处理列表数据分页
   processingDataPaging(){
    let _this = this;
    let pid = _this.data.pid;
    let limit = _this.data.limit;
    let dataList = _this.data.processingData || [];
    console.log(dataList)
    if(dataList.length == 0){
      wx.showToast({
        title: '暂无数据',
        icon: 'none',
        mask:true,
        duration:1000
      });  
      return false;
    }

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
    setTimeout(function(){
      // 刷新完自带加载样式回去
      wx.stopPullDownRefresh();
      wx.hideLoading();
    },500)
    _this.setData({
      dataList: [..._this.data.dataList,...data]
    })
  },

  reset(){
    this.setData({pid:0,dataList:[],loadprompt:true,nodata:false})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否授权
    var _this = this;
    _this.activsign();
    // this.onLoadfun();
  },
  onLoadfun:function(){
    var _this = this;
    _this.setData({
      uid: app.signindata.uid,
      loginid: app.signindata.loginid,
    });  
    
    _this.getInfo();
    wx.request({
      url: 'https://cdn.51chaidan.com/produce/ticketsLotto.json?time='+app.signindata.appNowTime,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('规则==========',res)
        _this.setData({
          termsOfBookingService:res.data.clause || '',
          bindingRule:res.data.bindingRule || ''
        });
      }
    })
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
    this.reset();
    this.getInfo();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.loadprompt){
      this.data.pid = ++this.data.pid;
      // 处理数据分页    
      wx.showLoading({ title: '加载中...'})    
      this.processingDataPaging();
    }else{
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 2000
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var reshare = app.sharemc();
    return reshare
  },


  // 跳转入场顺序
  jumpTicketRcSort(e){
    wx.navigateTo({  
      url: "/page/secondpackge/pages/ticketRcSort/ticketRcSort?keyDay="+e.currentTarget.dataset.keyday
    })
  },

  //时间戳转换时间  
  toDatehd: function (number) {
    var date = new Date(number * 1000);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + '年' + M + '月' + D + '日';
    
  },
})