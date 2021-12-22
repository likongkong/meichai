
var Dec = require('../../../../common/public');//aes加密解密js
var api = require("../../../../utils/api.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '消息',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    xScale: 0,
    windowHeight: app.signindata.windowHeight - 15 - wx.getStorageSync('statusBarHeightMc') || 0,
    nodataiftr:false,
    conversationList:[]
  },
  // 跳转详情
  jumpTimDetail(e){
    if(e.currentTarget.dataset.fid == app.signindata.uid){
      var id = e.currentTarget.dataset.tid;
    }else{
      var id = e.currentTarget.dataset.fid;
    };
    var groupid = e.currentTarget.dataset.groupid || 0;
    wx.navigateTo({ 
      url: `/page/settled/pages/timHomePage/timHomePage?id=${id}&groupid=${groupid}`
    });
  },
  deleteConversation(e) {
    var _this = this;
    // var id = e.currentTarget.dataset.id || 0;
    // var num = e.currentTarget.dataset.num || 0;
    // console.log(id,num)
    wx.showModal({
      content: '确认删除会话？',
      success: (res) => {
        if (res.confirm) {
            if(e.currentTarget.dataset.fid == app.signindata.uid){
              var id = e.currentTarget.dataset.tid;
            }else{
              var id = e.currentTarget.dataset.fid;
            };
            var q1 = Dec.Aese('mod=userSig&operation=del&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&from_userid='+id);
            wx.showLoading({title: '加载中...',mask:true})
            wx.request({
              url: app.signindata.comurl + 'im.php' + q1,
              method: 'GET',
              header: {'Accept': 'application/json'},
              success: function(res) {
                console.log('删除会话=====',res)
                wx.hideLoading();
                if (res.data.ReturnCode == 200) {
                    // var conversationList = _this.data.conversationList || [];
                    // conversationList.splice(num,1);
                    // _this.setData({
                    //   conversationList
                    // });
                    _this.getData();
                }else{
                  wx.showModal({
                    content: res.data.Msg || res.data.msg,
                    showCancel:false,
                    success: function (res) {}
                  });          
                };
              },

            })
        };
      },
    })
  },
  handleTouchMove(e) {
    if (!this.lock) {
      this.last = e.detail.x
      this.lock = true
    }
    if (this.lock && e.detail.x - this.last < -5) {
      this.setData({
        xScale: -75,
      })
      setTimeout(() => {
        this.lock = false
      }, 2000)
    } else if (this.lock && e.detail.x - this.last > 5) {
      this.setData({
        xScale: 0,
      })
      setTimeout(() => {
        this.lock = false
      }, 2000)
    }
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
    
  },
  // 获取数据
  getData(num=1){
    var _this = this;

    if (num==1){
      _this.setData({countOrder:0,conversationList : [],page : 1,nodataiftr:false});
    }else{
      var pagenum = _this.data.page;
      _this.data.page = ++pagenum;
    };

    var q1 = Dec.Aese('mod=userSig&operation=newsList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&page='+_this.data.page+'&type=1');

    console.log('mod=userSig&operation=newsList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&page='+_this.data.page+'&type=1')

    wx.showLoading({title: '加载中...',mask:true})
    wx.request({
      url: app.signindata.comurl + 'im.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        console.log('消息列表=====',res)
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
            var conversationList = res.data.List.info || [];
            if (num==1){
                var is_read = res.data.List.is_read;
                var no_read = res.data.List.no_read;
                console.log(1111111111)
                _this.setData({
                  is_read,
                  no_read,
                  conversationList,
                  nodataiftr:true
                });
            }else{
              console.log(22222222)
              if(conversationList && conversationList.length !=0){
                _this.setData({
                  conversationList:[..._this.data.conversationList,...conversationList]
                });
              }else{
                app.showToastC('暂无更多数据');
              };
            };
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     if(this.data.uid && this.data.loginid){
       console.log(33333333)
       this.getData();
     }
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
