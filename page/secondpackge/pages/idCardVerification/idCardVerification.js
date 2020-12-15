var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '新增实名认证', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,

    inputnamedata:'',
    contactsphone:'',
    inputidnumberdata:'',
    realnamenotice:false

  },
  realnamenoticef:function(){
     this.setData({
      realnamenotice:!this.data.realnamenotice
     })
  },
  // 录入身份信息
  upIdentity:function(){
    var _this = this;

    if (_this.data.inputnamedata==''){
      app.showToastC('姓名不能为空');
      return false;
    };
    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

    if (this.data.inputidnumberdata == '') {
      app.showToastC('身份证号不能为空');
      return false;
    } else if (!regIdCard.test(this.data.inputidnumberdata)){
      app.showToastC('身份证号格式不正确');
      return false;
    } else if (this.data.inputidnumberdata.length!=18){
      app.showToastC('身份证号位数不正确');
      return false;
    } else if (this.data.contactsphone == '') {
      app.showToastC('手机号不能为空')
      return false;
    } else if (this.data.contactsphone.length < 11) {
      app.showToastC('手机号长度有误')
      return false;
    }else{}; 


    wx.showModal({
      title: '身份信息确认',
      content: '姓名:'+_this.data.inputnamedata + '\n手机号:'+_this.data.contactsphone +  '\n身份证号:'+_this.data.inputidnumberdata ,
      cancelText: '确定',
      confirmText: '取消',
      confirmColor:'#000',
      cancelColor: '#000',
      success (res) {
        if (res.cancel) {
            var q = Dec.Aese('mod=ticket&operation=addIdentity&consignee='+_this.data.inputnamedata+'&idcard='+_this.data.inputidnumberdata + '&uid=' + _this.data.uid+'&loginid=' + _this.data.loginid+'&mobile=' + _this.data.contactsphone)

            console.log('mod=ticket&operation=addIdentity&consignee='+_this.data.inputnamedata+'&idcard='+_this.data.inputidnumberdata + '&uid=' + _this.data.uid+'&loginid=' + _this.data.loginid+'&mobile=' + _this.data.contactsphone)
        
            wx.showLoading({title: '加载中...',mask:true});
        
            wx.request({
              url: app.signindata.comurl + 'toy.php' + q,
              method: 'GET',
              header: { 'Accept': 'application/json' },
              success: function (res) {
                wx.hideLoading();
                wx.stopPullDownRefresh();
                console.log('录入身份信息=======',res)
                if (res.data.ReturnCode == 200) {
                  wx.showModal({
                    content: '认证成功',
                    showCancel:false,
                    success: function (r) {
                          // 调取上一页地址接口重新刷新数据
                          var pages = getCurrentPages(); // 当前页面  
                          if(pages){
                            var beforePage = pages[pages.length - 2]; // 前一个页面 
                            //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
                            wx.navigateBack({
                              success: function () {
                                                            
                                var identityarr = beforePage.data.identity || [];
                                var identity = res.data.Info.identity || '';
                                var iid = '';
                                if(identityarr && identityarr.length != 0){
                                  for(var i=0; i<identityarr.length ;i++){
                                    identityarr[i].isCheck = false;
                                  };
                                };
                      
                                if(identity){
                                  identity.isCheck = true;
                                  identity.idcarddis = identity.idcard.replace(/^(.{4})(?:\w+)(.{4})$/, "$1**********$2");
                                  identity.mobiledis = identity.mobile.replace(/^(.{3})(?:\w+)(.{3})$/, "$1*****$2");
                                  iid = identity.id || '';
                                  identityarr.push(identity);
                                };
                                beforePage.setData({
                                  identity: identityarr || [],
                                  inputnamedata:'',
                                  inputidnumberdata:'',
                                  contactsphone:'',
                                  iid : iid
                                });


                              }
                            }); 
                          }
                    }
                  }) 





                  

                } else {
                  if(res.data.Msg){
                    wx.showToast({
                      title: res.data.Msg,
                      icon: 'none',
                      duration: 1500
                    })
                  };
                }
              }
            })
         } else if (res.confirm) {
    
         }
       }
    })

    
  },

  // 真实姓名 input 值改变
  inputnameChange: function (e) {
    this.setData({inputnamedata: e.detail.value});
  },    
  // 身份证号
  inputidChange: function (e) {
    this.setData({inputidnumberdata: e.detail.value});
  }, 
  // 手机号
  contactsChangep: function (e) {
    this.setData({contactsphone: e.detail.value});
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否授权
    this.activsign();
  },
  onLoadfun:function(){


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
  getInfo(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=memberVip&operation=vipInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'member.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('vip数据======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          var goodsDescDetails  = res.data.List.prerogativeList[0].desc.replace(/<img/gi, '<img style="width:100%;height:auto;display:block;"');
          _this.setData({
            goodsDescDetails,
            infoData:res.data.Info,
            listData:res.data.List,
            memberExpireTime:_this.formatTime(res.data.Info.memberExpireTime,'Y年M月D日')
          })
        }
      }
    }); 
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
        if (res.authSetting['scope.userInfo']) {
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
        if (res.authSetting['scope.userInfo']) {
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
    this.getInfo()
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
    var reshare = Dec.sharemc();
    return reshare
  },
  
})