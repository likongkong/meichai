var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '申请退款', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    texts: "至少需要15个字",
    min: 15,//最少字数
    max: 50, //最多字数 (根据自己需求改变) 
    currentWordNumber:0,
    currentWord:'',
    isReasonBox:false, 
    isTwoConfirmBox:false,
    refundType:[],
    checkedObj:'',
    refundOrderfocus:false,
    refundOrderInputValue:'',
    listData:[
      {
        isRequired:false,
        type:'uploadImg',
        subtitle:'上传凭证',
        name:'voucherPic',
        imageList:[],
        margintop0:true,
        mode:'multiple',
        storagelocation:'images/goods'
      },
    ],
  },
  chooseReasonFun(e){
    let index = e.currentTarget.dataset.index;
    let refundType = this.data.refundType;
    for(var i=0;i<refundType.length;i++){
      if(refundType[i].checked){
        refundType[i].checked = false;
      }
    }
    refundType[index].checked = true;
    this.setData({
      refundType,
      checkedObj:{id:refundType[index].type_id,name:refundType[index].type_name}
    })
  },
  reasonFun(){
    this.setData({
      isReasonBox:!this.data.isReasonBox
    })
  },
  twoConfirmBoxFun(){
    this.setData({
      isTwoConfirmBox:false
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      refundOrderInputValue: e.detail.value
    })
  },
  refundOrderfocusFun(){
    this.setData({
      refundOrderfocus:true,
      isTwoConfirmBox:false
    })
  },
  //字数限制  
  inputs: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    //最少字数限制
    // if (len <= this.data.min)
    //   this.setData({
    //     texts: "至少还需要",
    //     textss: "字",
    //     num:this.data.min-len
    //   })
    // else if (len > this.data.min)
    //   this.setData({
    //     texts: " ",
    //     textss: " ",
    //     num:''
    //   })

    this.setData({
      currentWordNumber: len, //当前字数
      currentWord:value
    });
    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
  },
  getInfo(){
    wx.showLoading({ title: '加载中...'})
    var _this = this;
    let oid = _this.data.oid;
    var q = Dec.Aese('mod=operate&operation=applyRefundInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid='+oid);
    console.log(app.signindata.comurl + 'order.php?' +'mod=operate&operation=applyRefundInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid='+oid)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('详情数据====',res)
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          let infoData = res.data.Info;
          for(var i=0;i<infoData.refundType.length;i++){
              infoData.refundType[i].checked = false;
          }
          _this.setData({
            infoData,
            refundType:infoData.refundType
          })
        }else{
          app.showToastC(res.data.Msg)
        }
      }
    }) 
  },
  submit(){
    console.log(this.data.checkedObj,this.data.currentWord)
    if(!this.data.checkedObj){
      wx.showToast({
        title: '请选择退款原因',
        icon: 'none',
        duration: 1000
      })
      return false;
    }else if(!this.data.isTwoConfirmBox && this.data.infoData.refundPrice >=0 && this.data.refundOrderInputValue == ''){
      this.setData({
        isTwoConfirmBox: true,
      });
      return false;
    }
    wx.showLoading({ title: '加载中...'})
    var _this = this;
    var q = Dec.Aese('mod=operate&operation=submitApplyRefund&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type='+this.data.checkedObj.id+'&oid='+_this.data.oid+'&describe='+this.data.currentWord+'&giftShipping='+this.data.refundOrderInputValue);
    console.log(app.signindata.comurl + 'order.php?' +'mod=operate&operation=submitApplyRefund&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type='+this.data.checkedObj.id+'&oid='+_this.data.oid+'&describe='+this.data.currentWord+'&giftShipping='+this.data.refundOrderInputValue)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('提交====',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          _this.setData({
            isTwoConfirmBox: false,
          });
          app.showToastC(res.data.Msg)
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2]; //上一个页面
          prevPage.onLoadfun();
          setTimeout(function(){
            wx.navigateBack()
          },1500)
        }else{
          app.showToastC(res.data.Msg)
        }
      }
    }) 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.data.share_uid = options.share_uid || 0
    _this.setData({
      uid: app.signindata.uid,
      loginid:app.signindata.loginid,
      isProduce: app.signindata.isProduce,
      oid: options.oid,
    });  
    this.getInfo();
    // 判断是否授权
    this.activsign();
  },
  onLoadfun:function(){
    var _this = this;
    // _this.setData({
    //   uid: app.signindata.uid,
    //   loginid:app.signindata.loginid,
    //   isProduce: app.signindata.isProduce,
    // });  
    // this.getInfo();
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
          _this.setData({
            tgabox: false,
            signinlayer: false
          })
          console.log()
          // '没有授权 统计'
          app.userstatistics(48);
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
    this.getInfo();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },
  clicktganone: function () {
    this.setData({ tgabox: false })
  }, 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var reshare = app.sharemc();
    return reshare
  },
})