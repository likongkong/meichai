
var Dec = require('../../../../common/public');//aes加密解密js
var util = require("../../../../utils/util.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '福袋排行榜',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    is_toggleExplain:false,
    listData:[],
    start:'2021-12-07',
    endTime:'',
    is_prize:false,
    selectDate:'',
    // 8号之后显示排行榜 积分
    newdataexh:Date.parse(new Date())/1000 > 1638892800?true:false,
  },
  // 更新用户信息
  getUserProfileSettled(w){
    app.getUserProfile((res,userInfo) => {
        this.receivePrize()
    })
  },
  shopImgTip(e){
    var ind = e.currentTarget.dataset.ind || 0;
    var selectData = this.data.listData[ind];
    this.setData({
      selectData,
      is_prize:true
    })

  },
  is_prizefun(){
    this.setData({
      is_prize:!this.data.is_prize
    })
  },
  toggleExplain(){
    this.setData({is_toggleExplain:!this.data.is_toggleExplain})
  },

  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      selectDate: e.detail.value
    })
    this.getData();
  },
  // 获取昨日数据
  getdataLast(){
    var date = new Date();//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = (parseInt(date.getDate()) - 1 ) < 10 ? '0' + (parseInt(date.getDate()) - 1 ) : (parseInt(date.getDate()) - 1 );
    this.setData({
      selectDate:Y + '-' + M +'-' + D
    })
    this.getData();
  },
  // 查看今日
  getdataLastToday(){
    var date = new Date();//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    this.setData({
      selectDate:Y + '-' + M +'-' + D
    })
    this.getData();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.hideShareMenu();

    var date = new Date();//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    this.setData({
      endTime:Y + '-' + M +'-' + D,
      selectDate:Y + '-' + M +'-' + D
    })
    console.log(this.data.endTime)
    // '已经授权'
    _this.data.loginid = app.signindata.loginid;
    _this.data.uid = app.signindata.uid;
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

    this.getData();

    wx.request({
      url: 'https://meichai-1300990269.cos.ap-beijing.myqcloud.com/luckBag_rules.json?',
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        if(Date.parse(new Date())/1000 > 1638892800){
          var ruleData = res.data.rule1 || '';
        }else{
          var ruleData = res.data.rule || '';
        };
        _this.setData({
          ruleData:ruleData
        })
      },
      fail: function () { }
    });
  },
  // 领取奖励
  receivePrize(){
    var _this = this;

    wx.showLoading({title: '加载中...'})

    var exh = Dec.Aese('mod=luckbag&operation=rankReward&uid='+app.signindata.uid+'&loginid='+app.signindata.loginid+'&date='+_this.data.selectDate);

    console.log('mod=luckbag&operation=rankReward&uid='+app.signindata.uid+'&loginid='+app.signindata.loginid+'&date='+_this.data.selectDate)
    wx.request({
      url: app.signindata.comurl + 'goods.php' + exh,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading();
        console.log('领取奖励 =========== ',res)
        if (res.data.ReturnCode == 200) {
          app.showModalC(res.data.msg || res.data.Msg);
          _this.getData();
        } else {
          app.showModalC(res.data.msg || res.data.Msg)
        }
      },
      fail: function () { }
    });
  },
  // 获取数据
  getData(num=1){
    var _this = this;

    wx.showLoading({title: '加载中...',nodataiftr:false})

    var exh = Dec.Aese('mod=luckbag&operation=rankList&uid='+app.signindata.uid+'&loginid='+app.signindata.loginid+'&date='+_this.data.selectDate);
    console.log('mod=luckbag&operation=rankList&uid='+app.signindata.uid+'&loginid='+app.signindata.loginid+'&date='+_this.data.selectDate)
    wx.request({
      url: app.signindata.comurl + 'goods.php' + exh,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log('福袋排行榜 =========== ',res)
        if (res.data.ReturnCode == 200) {
          var listData = res.data.List || [];
          var infoData = res.data.Info;
          for(var i=0;i<listData.length;i++){
            // listData[i].nick = util.plusXing(listData[i].nick,1,0);
            listData[i].nick = listData[i].nick[0]?listData[i].nick[0]+'**':'***';
          };
          if(infoData.user){
            infoData.user.nick = infoData.user.nick?infoData.user.nick[0]+'**':'***';
          };
          _this.setData({
            listData,
            infoData,
            nodataiftr:true
          })
        } else {
          app.showToastC(res.data.msg);
        }
      },
      fail: function () { }
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
    // this.getData(2)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this;
    var indexShare = app.signindata.indexShare || [];
    var indexShareNum = Math.floor(Math.random() * indexShare.length) || 0;
    var indexShareImg = '';
    if(indexShare.length!=0 && indexShare[indexShareNum]){
      indexShareImg = indexShare[indexShareNum]+'?time=' + Date.parse(new Date());
    };
    return {
      title:app.signindata.titleShare?app.signindata.titleShare:'你喜欢的潮玩都在这里！',
      path: 'pages/index/index',
      imageUrl:indexShareImg || 'https://cdn.51chaidan.com/images/default/shareImg.jpg',
      success: function (res) {}
    } 
  },

})
