var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '闲置交易', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    pid:0,
    limit:20,
    tabbarAll:[
      {name:'全部',type:0},
      {name:'盲盒',type:1},
      {name:'一番赏',type:2}
    ],
    currentNum:0,
    ipcurrentNum:-1,
    dataList:[],
    allSeriesData:[],
    blindboxData:[],
    yifanshangData:[],
    allIpData:[],
    blindboxIpData:[],
    yifanshangIpData:[],
    ipData:[],
    processingData:[],
    loadprompt:true,
    isipPopMask:false,
    inputValue:'',
    isSearchInput:false,
    searchInputFocus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var data = JSON.parse(options.data)
    // console.log(data)
    // this.data.listData = data;
    // 判断是否授权
    this.activsign();
  },
  onLoadfun:function(){
    this.setData({
      uid: app.signindata.uid,
      loginid:app.signindata.loginid,
    }); 
    this.getInfo();
    this.brandseries();
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
          _this.setData({
            tgabox: true,
            signinlayer: false
          })
          console.log()
          // '没有授权 统计'
          app.userstatistics(42);
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
    wx.navigateTo({ 
      url: "/pages/wode/wode"
    }) 
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

  toggleIpPopMask(){
    this.setData({
      isipPopMask: !this.data.isipPopMask
    })
  },

  changetabbar(e){
    let type = e.currentTarget.dataset.type;
    this.setData({
      currentNum: e.currentTarget.dataset.ind
    })
    this.reset();
    this.getInfo();
  },

  brandfun(e){
    this.reset();
    let ipid = e.currentTarget.dataset.ipid;
    let ind = e.currentTarget.dataset.ind;
    let dataList,ipdataList=[];
    if(this.data.currentNum==0){
      dataList = this.data.allSeriesData;
    }else if(this.data.currentNum==1){
      dataList = this.data.blindboxData;
    }else if(this.data.currentNum==2){
      dataList = this.data.yifanshangData;
    }
    for (let i=0; i < dataList.length; i++) {
      if(dataList[i].ipId == ipid){
        ipdataList.push(dataList[i])
      }
    }
    this.setData({
      ipcurrentNum:ind,
      isipPopMask: false
    })
    this.data.processingData = ipdataList;
    this.processingDataPaging();
  },


  getInfo(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    wx.request({
      url: 'https://meichai-1300990269.cos.ap-beijing.myqcloud.com/produce/toyCabinet.json',
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('闲置列表数据======',res)
        let ip = res.data.List.ip;
        let blindboxIpData = [],yifanshangIpData = [];
        for (let i=0; i < ip.length; i++) {
          if(ip[i].isBlindBox){
            blindboxIpData.push(ip[i])
          }else if(ip[i].isYifanshang){
            yifanshangIpData.push(ip[i])
          }
        }
        _this.setData({
          allIpData:res.data.List.ip,
          blindboxIpData,
          yifanshangIpData
        })
        _this.data.allSeriesData = res.data.List.series;
        _this.data.blindboxData = res.data.List.blindbox;
        _this.data.yifanshangData = res.data.List.yifanshang;
        _this.data.processingData = _this.data.currentNum==0?_this.data.allSeriesData: _this.data.currentNum==1?_this.data.blindboxData:_this.data.yifanshangData;
        // 处理数据分页        
        _this.processingDataPaging();
      }
    });
  },

  showSearchInput(){
    this.setData({
      isSearchInput: true,
      searchInputFocus:true
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value.replace(/\s+/g, '')
    })
  },
  bindInputblur(){
    this.setData({
      isSearchInput: false
    })
  },
  searchFun(){
    var _this = this;
    if(this.data.inputValue==''){
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=cabinet&operation=search&searchKey=' + this.data.inputValue)
    console.log('搜索请求数据===','mod=cabinet&operation=search&searchKey=' + this.data.inputValue)
    wx.request({
      url: app.signindata.comurl + 'toy.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('搜索数据======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          _this.reset();
          _this.setData({
            currentNum:0
          })
          _this.data.allSeriesData = res.data.List.series;
          _this.data.processingData = _this.data.allSeriesData;
          // 处理数据分页        
          _this.processingDataPaging();
        } else {
          app.showToastC(res.data.Msg);
        }
      }
    });
  },

  // 处理列表数据分页
  processingDataPaging(){
    let _this = this;
    let pid = _this.data.pid;
    let limit = _this.data.limit;
    let dataList = _this.data.processingData;
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

  brandseries:function(){
     var _this = this;
    // 发现详情
    var qqq = Dec.Aese('mod=cabinet&operation=toyCate&uid='+_this.data.uid+'&loginid='+_this.data.loginid);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          var brandseries = res.data.List||{};
          var countcartcounttoy = res.data.Info||{} 
           _this.setData({
             brandseries: brandseries,
             countcartcounttoy: countcartcounttoy,
             wholebrand: brandseries.brand,
             wholenewsSeries: brandseries.newsSeries
           })

        };
      }
    });     
  },


  jumpshopbut:function(w){
    var minprice = w.currentTarget.dataset.minprice || w.target.dataset.minprice||0;
    var id = w.currentTarget.dataset.id || w.target.dataset.id || '';
    if (minprice == 0){
      app.showToastC('暂无该款信息');
      return false
    };
    wx.navigateTo({
      url: "/page/component/pages/ocamgoodsseries/ocamgoodsseries?seriesId="+id
    });
  },

  jumpmyo:function(){
    var _this = this;
    wx.navigateTo({
      url: "/page/component/pages/myothertoydg/myothertoydg?ownerId=" + _this.data.uid
    });
  },

  jumpcartbut:function(){
    wx.navigateTo({
      url: "/page/component/pages/ocamcart/ocamcart?but=cart"
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
  reset(){
    this.setData({pid:0,dataList:[],loadprompt:true,nodata:false,ipcurrentNum:-1})
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
   /**
   * 用户点击右上角分享朋友圈
   */
  onShareTimeline:function(){
    var _this = this;
    return {
      title:_this.data.c_title || '潮玩社交平台',
      query:{}    
    }
  },


})