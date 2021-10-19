
var Dec = require('../../../../common/public');//aes加密解密js
var api = require("../../../../utils/api.js");
var time = require("../../../../utils/util.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '中奖名单',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    // 2 助力列表 1 中奖名单 3 参与人数
    type:0
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    // wx.hideShareMenu();

    // '已经授权'
    _this.data.loginid = app.signindata.loginid;
    _this.data.uid = app.signindata.uid;
    _this.setData({
        type:options.type,
        id:options.id
    })
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
    } else {
      app.signin(_this)
    };


  },
  onLoadfun(){
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.uid = app.signindata.uid;
    _this.setData({
      uid: app.signindata.uid,
      avatarUrl: app.signindata.avatarUrl,
      isProduce: app.signindata.isProduce,
      isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
    });
    
    if(_this.data.type == 2){ // 中奖名单 
      _this.helpUserList(1)
    }else if(_this.data.type == 2){ // 助力记录 
      _this.helpUserList(1)
    }else if(_this.data.type == 3){ // 参与人数

    }
    
  },
  // 中奖
  isWinnerList(num=1){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    if (num==1){
      _this.setData({page : 0,order : []});
    }else{
      var pagenum = _this.data.page;
      _this.data.page = ++pagenum;
    };

    var q = Dec.Aese('mod=lottoV2&operation=winnerList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&page=' + _this.data.page + '&id=' + _this.data.id)

    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('助力======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          var winnerList = res.data.List.winner || [];
          for(var i = 0 ; i < winnerList.length ; i++){
              winnerList[i].tel = time.plusXing(winnerList[i].tel,3,4);
              winnerList[i].idcard = time.plusXing(winnerList[i].idcard,4,4);
              winnerList[i].nick = time.plusXing(winnerList[i].nick,1,0);
          };
          if(num == 1){
            _this.setData({
              winnerList:winnerList
            });  
          }else{
            _this.setData({
              winnerList:[...winnerList,..._this.data.winnerList] || []
            });  
          }

        }
      }
    });
  },
  // 助力
  helpUserList(num=1){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    if (num==1){
      _this.setData({page : 0,order : []});
    }else{
      var pagenum = _this.data.page;
      _this.data.page = ++pagenum;
    };

    var q = Dec.Aese('mod=lottoV2&operation=helpUserList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&page=' + _this.data.page + '&id=' + _this.data.id)

    wx.request({
      url: app.signindata.comurl + 'spread.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('助力======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          var helpUserList = res.data.List.helpUserList || [];
          for(var i = 0 ; i < helpUserList.length ; i++){
            helpUserList[i].add_time = time.toDate(helpUserList[i].add_time,2);
            helpUserList[i].nick = time.plusXing(helpUserList[i].nick,1,0);
          };
          if(num == 1){
            _this.setData({
              helpTotalNumber:res.data.List.helpTotalNumber || 0,
              helpUserList:helpUserList
            });  
          }else{
            _this.setData({
              helpUserList:[...helpUserList,..._this.data.helpUserList] || []
            });  
          }

        }
      }
    });
  },
  // 获取数据
  getData(num=1){
     var _this = this;

     wx.showLoading({ title: '加载中...'})
     var q = Dec.Aese('mod=lottoPrior&operation=info&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
     console.log('mod=lottoPrior&operation=info&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
     wx.request({
       url: app.signindata.comurl + 'spread.php'+q,
       method: 'GET',
       header: { 'Accept': 'application/json' },
       success: function (res) {
         console.log('详情数据======',res)
         // 刷新完自带加载样式回去
         wx.stopPullDownRefresh();
         wx.hideLoading();
         if (res.data.ReturnCode == 200) {
           var ticket = res.data.List.ticket;
           for(var i=0;i<ticket.length;i++){
             ticket[i].actualidcard = ticket[i].idcard;
             ticket[i].idcard = _this.plusXing(ticket[i].idcard,4,4);
             ticket[i].consignee = _this.plusXing(ticket[i].consignee,1,0);
             ticket[i].mobile = _this.plusXing(ticket[i].mobile,3,4);
           }
           _this.setData({
             subscribedata:res.data.Info.subscribe,
             listData:ticket
           });  
         }
       }
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
    app.downRefreshFun(() => {
      this.getData()
    })   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getData(2)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    var _this = this;

    var indexShare = app.signindata.indexShare || [];
    var indexShareNum = Math.floor(Math.random() * indexShare.length) || 0;
    var indexShareImg = '';
    if(indexShare.length!=0 && indexShare[indexShareNum]){
      indexShareImg = indexShare[indexShareNum]+'?time=' + Date.parse(new Date());
    };
    var title = app.signindata.titleShare?app.signindata.titleShare:'你喜欢的潮玩都在这里！'
    var onshareUrl = 'pages/index/index';
    var onshareImg = indexShareImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg';

    if (options.from == 'button') {
      var num = options.target.dataset.num;
      var selectData = _this.data.order[num];
      title = selectData.itemName || '你喜欢的潮玩都在这里！';
      onshareImg = selectData.itemImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg';
      if (selectData.itemType == '-1'){  // 正常商品
        onshareUrl = '/pages/detailspage/detailspage?gid=' + selectData.itemId + '&referee=' + app.signindata.uid;
      }else if(selectData.itemType == 4){ // 抽选
        onshareUrl = "/page/component/pages/limitlottery/limitlottery?id=" + selectData.itemId + '&referee=' + app.signindata.uid;
      };      
    }
    return {
      title: title ,
      path: onshareUrl,
      imageUrl:onshareImg,
      success: function (res) {}
    };

  },

})
