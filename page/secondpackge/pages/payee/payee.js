var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '绑定信息', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,
    inputnamedata:'',
    inputbranddata:'',
    inputidnumberdata:'',
    inputcreditnumberdata:'',
    inputcreditnamedata:'',
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    wx.showLoading({ title: '加载中...'})
    // 判断是否授权
    this.activsign();
  },
  onLoadfun:function(){
    wx.hideLoading();
    this.setData({
      uid: app.signindata.uid,
      loginid: app.signindata.loginid,
      openid: app.signindata.openid
    }); 
  },
  //获取用户信息
  getUserInfo(){
    var _this = this;
    wx.login({
      success:function(){
        wx.getUserInfo({
          success: function (res) {
            _this.setData({
              avatarUrl: res.userInfo.avatarUrl,
              nickName: res.userInfo.nickName
            })
          }
        });
      }
    });
  },
  // 真实姓名 input 值改变
  inputnameChange: function (e) {
    this.setData({inputnamedata: e.detail.value});
  },    
  // 身份证号
  inputidChange: function (e) {
    this.setData({inputidnumberdata: e.detail.value});
  }, 
  // 品牌名
  inputbrandChange: function (e) {
    this.setData({inputbranddata: e.detail.value});
  }, 
   // 银行名称
   inputcreditnameChange: function (e) {
    this.setData({inputcreditnamedata: e.detail.value});
  }, 
   // 银行卡号
   inputcreditnumberChange: function (e) {
    this.setData({inputcreditnumberdata: e.detail.value});
  }, 

  submit(){
    var _this = this;
    if (_this.data.inputnamedata==''){
      app.showToastC('收款人姓名不能为空');
      return false;
    };
    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

    if (this.data.inputbranddata == '') {
      app.showToastC('品牌名称不能为空');
      return false;
    } else if (this.data.inputidnumberdata == '') {
      app.showToastC('身份证号不能为空');
      return false;
    } else if (!regIdCard.test(this.data.inputidnumberdata)){
      app.showToastC('身份证号格式不正确');
      return false;
    } else if (this.data.inputidnumberdata.length!=18){
      app.showToastC('身份证号位数不正确');
      return false;
    } else if (this.data.inputcreditnamedata==''){
      app.showToastC('银行名称不能为空');
      return false;
    } else if (this.data.inputcreditnumberdata.length==''){
      app.showToastC('银行卡号不能为空');
      return false;
    }else{}; 

    // wx.showModal({
    //   title: '身份信息确认',
    //   content: '姓名:'+_this.data.inputnamedata + '\n手机号:'+_this.data.contactsphone +  '\n身份证号:'+_this.data.inputidnumberdata +  '\n激活码:'+_this.data.code +  '\n入场日期:'+_this.data.code,
    //   cancelText: '确定',
    //   confirmText: '取消',
    //   confirmColor:'#000',
    //   cancelColor: '#000',
    //   success (res) {
    //     if (res.cancel) {
          wx.showLoading({ title: '加载中...'})
          var q = Dec.Aese('mod=address&operation=addBrandReceiptInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&consignee='+_this.data.inputnamedata+'&idcard='+_this.data.inputidnumberdata+'&openid='+_this.data.openid+'&brand_name='+_this.data.inputbranddata+'&bank_name='+_this.data.inputcreditnamedata+'&bank_number='+_this.data.inputcreditnumberdata)
          console.log('mod=address&operation=addBrandReceiptInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&consignee='+_this.data.inputnamedata+'&idcard='+_this.data.inputidnumberdata+'&openid='+_this.data.openid+'&brand_name='+_this.data.inputbranddata+'&bank_name='+_this.data.inputcreditnamedata+'&bank_number='+_this.data.inputcreditnumberdata)
          wx.request({
            url: app.signindata.comurl + 'user.php'+q,
            method: 'GET',
            header: { 'Accept': 'application/json' },
            success: function (res) {
              console.log('数据======',res)
              // 刷新完自带加载样式回去
              wx.hideLoading();
              if (res.data.ReturnCode == 200) {
                wx.showToast({
                  title: res.data.Msg,
                  icon: 'none',
                  mask:true,
                  duration:4000
                });  
                _this.setData({
                  inputnamedata:'',
                  inputbranddata:'',
                  inputidnumberdata:'',
                  inputcreditnumberdata:'',
                  inputcreditnamedata:'',
                })
              }else{
                app.showToastC(res.data.Msg)
              }
            }
          }); 
      //   } else if (res.confirm) {
          
      //   }
      // }
    // })
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
          console.log(11111111111111111111111111111)
          _this.setData({
            tgabox: false,
            signinlayer: false
          })
          console.log()
          // '没有授权 统计'
          app.userstatistics(50);
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


  clicktganone: function () {
    this.setData({ tgabox: false })
  }, 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // var reshare = app.sharemc();
    // return reshare
  },
  
})