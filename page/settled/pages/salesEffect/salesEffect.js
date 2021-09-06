
var Dec = require('../../../../common/public');//aes加密解密js
var api = require("../../../../utils/api.js");
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
    seckillOrDraw : 4, // -1 正常商品 4 抽选
    umid:1,
    signaturePopUp:false
  },
  // 查看签号
  signaturePopUpDis(e){
    var num = e.currentTarget.dataset.type || e.target.dataset.num || 0;
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

    if(wx.getStorageSync('access_token')){
      this.getData();
    }else{
      app.getAccessToken(_this.getData)
    };
    
  },
  // 获取数据
  getData(num=1){
     var _this = this;

    // if (num==1){
    //   _this.setData({countOrder:0,page : 1,nodataiftr:false ,order : []});
    // }else{
    //   var pagenum = _this.data.page;
    //   _this.data.page = ++pagenum;
    // };
    //  api.settledGoodsList({
    //    'searchValue':_this.data.ordername,
    //    'goodsStatus':_this.data.centerIndex,
    //    'brandId':_this.data.brandid || 0,
    //    'pageId':_this.data.page,
    //    'goodsType':_this.data.selectid
    //  }).then((res) => {
    //   console.log('列表数据=======',res)
    //   _this.setData({nodataiftr:true})
    //   if (res.data.status_code == 200) {
    //       var order = res.data.data.List.item || [];
    //       if(order && order.length ==0){
    //           app.showToastC('暂无更多数据');
    //       };
    //       if (num==1){
    //           var brand = res.data.data.List.brand || [];
    //           _this.setData({
    //             brand,
    //             order
    //           });
    //       }else{
    //         var orderData = [..._this.data.order,...order]
    //         _this.setData({
    //           order:orderData
    //         });
    //       };
    //   }else{
    //     if(res.data && res.data.message){
    //       app.showModalC(res.data.message); 
    //     };        
    //   };
    //  })
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

    return {
      title: title ,
      path: onshareUrl,
      imageUrl:onshareImg,
      success: function (res) {}
    };

  },

})
