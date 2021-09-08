
var Dec = require('../../../../common/public');//aes加密解密js
var api = require("../../../../utils/api.js");
var utils = require("../../../../utils/util.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '销售效果',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    ordername:'',
    itemType : 4, // -1 正常商品 4 抽选
    umid:0,
    signaturePopUp:false,
    nodataiftr:false,
    salesEffectInfo:'',
    salesEffectList:[],
    lotteryNumberList:[],
    lotteryNumberIs:false,
    timeaddis:''

  },
  lotteryNumberFun(){
    if(!this.data.lotteryNumberIs && this.data.lotteryNumberList.length==0){
       this.getInfo();
    };
    this.setData({
      lotteryNumberIs:!this.data.lotteryNumberIs
    })
    
  },
  comjump(e){
    var id = e.currentTarget.dataset.id || e.target.dataset.id || 0;
    wx.navigateTo({
      url: "/page/settled/pages/businessOrderDetails/businessOrderDetails?orderid="+id
    });
  },
  // 查看签号
  signaturePopUpDis(e){
    var num = e.currentTarget.dataset.num || e.target.dataset.num || 0;
    var salesEffectList = this.data.salesEffectList || [];
    this.setData({
      selectData:salesEffectList[num]
    })
    this.signaturePopUpFun()
  },
  signaturePopUpFun(){
    this.setData({
      signaturePopUp:!this.data.signaturePopUp
    })
  },
  seTabDataFun(e){
    var type = e.currentTarget.dataset.type || e.target.dataset.type || 0;
    this.setData({
      umid:type
    })
    this.getData();
  },

  getInfo(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=lotto&operation=lottoList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid +'&id=' +_this.data.itemId)
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
        
          _this.setData({
            lotteryNumberList:res.data.List.winnerLotto || false
          })

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

  // input 值改变
  inputChange: function (e) {
    this.setData({
      ordername: e.detail.value
    });
  },
  jumpsearch:function(){
    // this.eldatalistfun(0);
    this.getData();
  },
  onFocus: function (w) {
    this.setData({
      ordername:""
    });
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    // wx.hideShareMenu();
    console.log(options)
    // '已经授权'
    _this.data.loginid = app.signindata.loginid;
    _this.data.uid = app.signindata.uid;
    _this.setData({
      itemType : options.itemtype || '',
      itemId : options.itemid || '',
      windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
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

    if(wx.getStorageSync('access_token')){
      this.getData();
    }else{
      app.getAccessToken(_this.getData)
    };
    
  },
  // 获取数据
  getData(num=1){
     var _this = this;

    if (num==1){
      _this.setData({countOrder:0,page : 1,salesEffectList : []});
    }else{
      var pagenum = _this.data.page;
      _this.data.page = ++pagenum;
    };
     api.salesResult(`${_this.data.itemType}/${_this.data.itemId}`,{listType:_this.data.umid}).then((res) => {
      console.log('列表数据=======',res)
      _this.setData({nodataiftr:true})
      if (res.data.status_code == 200) {
        var salesEffectInfo = res.data.data.Info;
        var salesEffectList = res.data.data.List;

        for(var i=0;i<salesEffectList.length;i++){
          salesEffectList[i].lotto = salesEffectList[i].lotto?utils.plusXing(salesEffectList[i].lotto,4,4):'';
          salesEffectList[i].tel = salesEffectList[i].tel?utils.plusXing(salesEffectList[i].tel,3,4):'';
          salesEffectList[i].userMobile = salesEffectList[i].userMobile?utils.plusXing(salesEffectList[i].userMobile,3,4):'';
        };

        if(_this.data.itemType == -1){
           _this.countdowntime(salesEffectInfo.summary.goodsAddTime)
        };

        _this.setData({
          salesEffectInfo,
          salesEffectList,
          timeaddis:salesEffectInfo.summary.goodsAddTime
        });
      }else{
        if(res.data && res.data.message){
          app.showModalC(res.data.message); 
        };        
      };
     })
  },
  // 倒计时
  countdowntime: function ( cdtime) {
    var _this = this;;
    clearInterval(_this.data.countdowntime);
    var countdowntime = function () {
      var totalSecond = Date.parse(new Date()) / 1000 - parseInt(cdtime);
      // 秒数  
      var second = totalSecond;
      // 天数位  
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;
      // 小时位  
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;
      // 分钟位  
      var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;
      // 秒位  
      var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;
      if (dayStr == '00') {
        _this.setData({
          percountdown: { dayStr: dayStr, hrStr: hrStr, minStr: minStr, secStr: secStr }
        });
      } else {
        _this.setData({
          percountdown: { dayStr: dayStr, hrStr: hrStr, minStr: minStr, secStr: secStr }
        });
      }
      if (totalSecond < 0) {
        // 从新调取数据
        clearInterval(_this.data.countdowntime);
        that.signindata.perspcardata = '';
        _this.setData({
          perspcardiftrmin: false
        });
        _this.setData({
          percountdown: '00:00:00',
        });
      }
    };
    _this.data.countdowntime = setInterval(countdowntime, 1000);
  },
  toDate(number,num) {
    var date = new Date(number * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + '/' + M + '/' + D +' ' + h + ':' + m + ':' +s;
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

    if(this.data.timeaddis){
      this.countdowntime(this.data.timeaddis)
    }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.countdowntime);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.countdowntime);
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
    // this.getData(2)
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

    return {
      title: title ,
      path: onshareUrl,
      imageUrl:onshareImg,
      success: function (res) {}
    };

  },

})
