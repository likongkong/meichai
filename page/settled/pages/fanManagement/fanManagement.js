
var Dec = require('../../../../common/public');//aes加密解密js
var api = require("../../../../utils/api.js");
var utils = require("../../../../utils/util.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '粉丝管理',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    ordername:'',
    itemType : 4, // -1 正常商品 4 抽选
    signaturePopUp:false,
    nodataiftr:false,
    salesEffectInfo:'',
    salesEffectList:[],
    lotteryNumberList:[],
    lotteryNumberIs:false,
    timeaddis:'',
    index:0
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var groups = this.data.groups || [];
    this.setData({
      index: e.detail.value,
      brand_id:groups[e.detail.value].brand_id
    })
    this.getInfo();

  },

  lotteryNumberFun(){
    if(!this.data.lotteryNumberIs && this.data.lotteryNumberList.length==0){
       this.getInfo();
    };
    this.setData({
      lotteryNumberIs:!this.data.lotteryNumberIs
    })
    
  },
  // 修改地址名字
  namefun:function(e){
    if(e.detail.value && e.detail.value.length <= 10){
      this.data.modifyName = e.detail.value;
    };
  },
  signaturePopUpFun(w){
    var userid = w.currentTarget.dataset.userid || w.target.dataset.userid || 0;
    this.setData({
      signaturePopUp:!this.data.signaturePopUp,
      fansUId:userid
    })
  },

  // 备注
  remarks(){
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })

    let data = `mod=community&operation=fansname&uid=${this.data.uid}&loginid=${this.data.loginid}&aliasName=${this.data.modifyName}&fansUId=${this.data.fansUId}&brand_id=${this.data.brand_id}`

    console.log( `mod=community&operation=fansname&uid=${this.data.uid}&loginid=${this.data.loginid}&aliasName=${this.data.modifyName}&fansUId=${this.data.fansUId}&brand_id=${this.data.brand_id}`)

    var q = Dec.Aese(data);

    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: (res) => { 
        console.log(res);
        wx.hideLoading()
        wx.stopPullDownRefresh();
        if(res.data.ReturnCode == 200){
          _this.getInfo();
        }else{
          app.showToastC(res.data.Msg,2000);
        }
        _this.setData({
          signaturePopUp:false
        })
      },
    });
  },

  // 获取用户下所有的品牌id
  getIp(){
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    let data = `mod=community&operation=showIp&uid=${this.data.uid}&loginid=${this.data.loginid}`;
    var q = Dec.Aese(data);
    console.log(`${app.signindata.comurl}?${data}`)
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: (res) => { 
        console.log(res);
        wx.hideLoading()
        wx.stopPullDownRefresh();
        if(res.data.ReturnCode == 200){
          _this.setData({
            groups:res.data.List.brandInfoList || [],
          });
          if(res.data.List && res.data.List.brandInfoList.length != 0){
            _this.data.brand_id = res.data.List.brandInfoList[0].brand_id
            _this.getInfo();
          };
        }else{
          app.showToastC(res.data.Msg,2000);
        }
      },
      fail: function () {},
      complete:function(){
        
      }
    });
  },
  getInfo(num = 1){
    var _this = this;
    wx.showLoading({ title: '加载中...',mask:true,nodataiftr:false});

    if (num==1){
      _this.setData({pid : 0,salesEffectList : []});
    }else{
      var pagenum = _this.data.pid || 0;
      _this.data.pid = ++pagenum;
    };


    console.log('mod=community&operation=fanslist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid +'&brand_id='+_this.data.brand_id + '&pageId=' + _this.data.pid + '&searchValue=' + _this.data.ordername || '' )

    var q = Dec.Aese('mod=community&operation=fanslist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid +'&brand_id='+_this.data.brand_id + '&pageId=' + _this.data.pid + '&searchValue=' + _this.data.ordername || '' )

    wx.request({
      url: app.signindata.comurl + 'toy.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('详情数据======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          if(num == 1){
            _this.setData({
              countFans:res.data.Info.countFans || 0,
              salesEffectList:res.data.List.fans || [],
              nodataiftr:true
            })
          }else{
            if(res.data.List && res.data.List.fans.length != 0){
              var salesEffectList = [...res.data.List.fans,_this.data.salesEffectList]
              _this.setData({
                  salesEffectList,
                  nodataiftr:true
              })
            }else{
              app.showToastC('暂无更多数据');
            }
          }
          
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
    this.getInfo();
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
      itemId : options.itemid || ''
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


    this.getIp();
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    app.downRefreshFun(() => {
      this.getInfo()
    })   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getInfo(2)
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