
var Dec = require('../../../../common/public');//aes加密解密js
var api = require("../../../../utils/api.js");
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

    
  },
  // 获取数据
  getData(num=1){
     var _this = this;

    if (num==1){
      _this.setData({countOrder:0,page : 1,nodataiftr:false ,order : []});
    }else{
      var pagenum = _this.data.page;
      _this.data.page = ++pagenum;
    };
     api.settledGoodsList({
       'searchValue':_this.data.ordername,
       'goodsStatus':_this.data.centerIndex,
       'brandId':_this.data.brandid || 0,
       'pageId':_this.data.page,
       'goodsType':_this.data.selectid
     }).then((res) => {
      console.log('列表数据=======',res)
      _this.setData({nodataiftr:true})
      if (res.data.status_code == 200) {
          var order = res.data.data.List.item || [];
          // if(order && order.length != 0){
          //   order.forEach(element => {
          //      if(element.order.payTime){
          //         element.order.payTimeTrans = _this.toDate(element.order.payTime);
          //      };
          //   });
          // };
          if(order && order.length ==0){
              app.showToastC('暂无更多数据');
          };
          if (num==1){
              var brand = res.data.data.List.brand || [];
              _this.setData({
                brand,
                order
              });
          }else{
            var orderData = [..._this.data.order,...order]
            _this.setData({
              order:orderData
            });
          };
      }else{
        if(res.data && res.data.message){
          app.showModalC(res.data.message); 
        };        
      };
     })
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
