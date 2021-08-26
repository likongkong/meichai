
var Dec = require('../../../../common/public');//aes加密解密js
var tcity = require("../../../../common/citys.js");
var api = require("../../../../utils/api.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '动态',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    detailData:{},
    illustrated_id:''
  },  

  jumpdetail(w){
    var id = w.currentTarget.dataset.id || w.target.dataset.id || '';
    var type = w.currentTarget.dataset.type || w.target.dataset.type || '';
    if(type == 1){
      var item_type = 1;
    }else if(type == 2){
      var item_type = 9003;
    }
    app.comjumpwxnav(item_type, id, '', '')

  },

  subscrfundom:function(w){
    var _this = this;
    var sellList = _this.data.sellList;
    var index = w.currentTarget.dataset.index || w.target.dataset.index || 0;

    if(sellList&&sellList[index]&&sellList[index].subscribeList){
      _this.setData({
        id:sellList[index].id,
        subscribedata:sellList[index].subscribeList
      })
      _this.subscrfunstar()
    }

  },
  // 拉起订阅
  subscrfunstar: function () {
    var _this = this;
    console.log(2,subscribedata)
    var subscribedata = _this.data.subscribedata || '';
    if (subscribedata && subscribedata.template_id && app.signindata.subscribeif) {
      if (subscribedata.template_id instanceof Array) {
        wx.requestSubscribeMessage({
          tmplIds: subscribedata.template_id || [],
          success(res) {
            for (var i = 0; i < subscribedata.template_id.length; i++) {
              if (res[subscribedata.template_id[i]] == "accept") {
                app.subscribefun(_this, 0, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
              };
            };
          },
        })
      } else {
        wx.requestSubscribeMessage({
          tmplIds: [subscribedata.template_id || ''],
          success(res) {
            if (res[subscribedata.template_id] == "accept") {
              app.subscribefun(_this, 0, subscribedata.template_id, subscribedata.subscribe_type);
            };
          },
          complete() {}
        })
      };
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.hideShareMenu();
    
    // '已经授权'
    _this.data.loginid = app.signindata.loginid;
    _this.data.uid = app.signindata.uid;
    _this.data.orderid = options.orderid,
    _this.data.drying_id = options.did || 0
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
    } else {
      app.signin(_this)
    }
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
  },
  // 获取数据
  getData(){
    var _this = this;

    var q1 = Dec.Aese('mod=community&operation=showDynamicInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&drying_id='+_this.data.drying_id);

    wx.showLoading({title: '加载中...',mask:true})
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        console.log('动态详情=====',res)
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
           _this.setData({
             dataInfo:res.data.Info,
             illustratedInfo:res.data.List.illustratedInfo
           })
        }else{
          wx.showModal({
            content: res.data.Msg || res.data.msg,
            showCancel:false,
            success: function (res) {}
          });          
        };
      },

    })
 },  
 // 关注 和 点赞 函数
 followfun: function(w) {
    var _this = this;
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    var type = w.currentTarget.dataset.type || w.target.dataset.type || 0;
    console.log('mod=community&operation=likeAttention&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&setType=' + type + '&id=' + id)
    var qqq = Dec.Aese('mod=community&operation=likeAttention&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&setType=' + type + '&id=' + id);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        console.log('同款想要=====',res)
        if (res.data.ReturnCode == 200) {
            _this.getData();
        }else{
          if(res.data.Msg){
            wx.showModal({
              content: res.data.Msg || '',
              showCancel: false,
              success: function(res) {}
            });
          };
        };
      }
    });
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
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this;
    var reshare = {
      title: _this.data.dataInfo.shareData.name,
      path: 'page/settled/pages/dynamicDetails/dynamicDetails?did='+_this.data.drying_id,
      imageUrl: _this.data.dataInfo.shareData.shareImg,
      success: function(res) {},
    };
    return reshare
  },
  // 跳转日历
  jumpoffering(w){
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    var type = w.currentTarget.dataset.type || w.target.dataset.type || 0;
    var istype = w.currentTarget.dataset.istype || w.target.dataset.istype || 0;
    if(istype == 1){ // 秒杀
      type = 1;
    }else if(istype == 2){ // 抽选
      type = 9003;
    }else if(istype == 3){ // 动态
      type = 9036;
    }
    app.comjumpwxnav(type,id,'','')
  } 
})
