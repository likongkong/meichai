var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
var WxParse = require('../../../../wxParse/wxParse.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '展会VIP激活', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    current:0,
    isBindBox:false,
    cdKeyinputValue:'',
    rccdkey:'',
    consignee:'',
    mobile:'',
    idcard:''
  },

  tabChangeFun(e){
    this.setData({
      current: e.currentTarget.dataset.ind
    });
  },
  plusXing (str,frontLen,endLen) {
    var len = str.length-frontLen-endLen;
    var xing = '';
    for (var i=0;i<len;i++) {
    xing+='*';
    }
    return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
  },
 
  getInfo(){
    var _this = this;
    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=bind&operation=index&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
    console.log('mod=bind&operation=index&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)

    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log('数据======',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          res.data.Info.stopTime = _this.toDatehd(res.data.Info.stopTime);
           _this.setData({
            dataInfo:res.data.Info,
            priority:res.data.List.priority,
           })
          // WxParse.wxParse('article', 'html', dataInfo.actionDetails, _this, 0);
        }else{
          wx.showToast({
            title: res.data.Msg,
            icon: 'none',
            mask:true,
            duration:1000
          });  
        }
      }
    }); 
  },

  bindCdkeyInput(e){
    this.setData({
      cdKeyinputValue: e.detail.value
    })
  },

  // 校验激活码
  activateBtnFun(){
    var _this = this;

    console.log(_this.data.cdKeyinputValue.length)
    if(_this.data.cdKeyinputValue==''){
      wx.showToast({
        title: '请输入激活码',
        icon: 'none',
        mask:true,
        duration:1000
      });  
      return false;
    }else if(_this.data.cdKeyinputValue.length < 16 || _this.data.cdKeyinputValue.length > 16){
      wx.showToast({
        title: "激活码有误，请重试",
        icon: 'none',
        mask:true,
        duration:1000
      });  
      return false;
    }

    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=bind&operation=checkCDKEY&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&cdkey=' +_this.data.cdKeyinputValue);
    console.log('去激活数据======','mod=bind&operation=checkCDKEY&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&cdkey=' +_this.data.cdKeyinputValue)
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log('去激活数据======',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          _this.setData({
            rcdate:res.data.Info.date,
            rccdkey:res.data.Info.cdkey,
            rcsort:res.data.Info.sort,
            isBindBox: true,
          })
        }else{
         wx.showToast({
           title: res.data.Msg,
           icon: 'none',
           mask:true,
           duration:1000
         });  
        }
      }
    })
  },

  bindUserInput(e){
    let type = e.currentTarget.dataset.type;
    if(type==1){
      this.setData({
        consignee:e.detail.value
      })
    }else if(type==2){
      this.setData({
        mobile:e.detail.value
      })
    }else if(type==3){
      this.setData({
        idcard:e.detail.value
      })
    }
  },

  bindUserTicket(){
    var _this = this;

    console.log(this.data.consignee,this.data.mobile,this.data.idcard)
    if(this.data.consignee==''){
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        mask:true,
        duration:1000
      });  
      return false;
    }

    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

    if (this.data.mobile == '') {
      wx.showToast({
        title: '请输入电话号码',
        icon: 'none',
        mask:true,
        duration:1000
      });
      return false;
    } else if (this.data.mobile.length < 11) {
      wx.showToast({
        title: '电话号码长度有误',
        icon: 'none',
        mask:true,
        duration:1000
      });
      return false;
    } else if (this.data.idcard == '') {
      wx.showToast({
        title: '请输入身份证号',
        icon: 'none',
        mask:true,
        duration:1000
      });
      return false;
    } else if (!regIdCard.test(this.data.idcard)){
      wx.showToast({
        title: '身份证号格式不正确',
        icon: 'none',
        mask:true,
        duration:1000
      });
      return false;
    } else if (this.data.idcard.length!=18){
      wx.showToast({
        title: '身份证号位数不正确',
        icon: 'none',
        mask:true,
        duration:1000
      });
      return false;
    }

    wx.showLoading({ title: '加载中...'})
    var q = Dec.Aese('mod=bind&operation=bindCDKEY&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&cdkey=' +_this.data.rccdkey + '&consignee=' +_this.data.consignee + '&mobile=' +_this.data.mobile + '&idcard=' +_this.data.idcard);
    console.log('绑定用户信息======','mod=bind&operation=checkCDKEY&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&cdkey=' +_this.data.cdKeyinputValue)
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log('绑定用户信息数据======',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          
          wx.showToast({
            title: '激活成功',
            icon: 'none',
            mask:true,
            duration:1500
          });
          setTimeout(function(){
            _this.setData({
              isBindBox: false,
            })
            _this.getInfo();
          },1500)

        }else{
         wx.showToast({
           title: res.data.Msg,
           icon: 'none',
           mask:true,
           duration:1000
         });  
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否授权
    var _this = this;
    _this.activsign();
    // this.onLoadfun(); 

  },
  onLoadfun:function(){
    var _this = this;
    _this.setData({
      uid: app.signindata.uid,
      loginid: app.signindata.loginid,
    });  
    
    _this.getInfo();
    wx.request({
      url: 'https://cdn.51chaidan.com/produce/ticketsLotto.json?time='+app.signindata.appNowTime,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('规则==========',res)
        _this.setData({
          termsOfBookingService:res.data.clause || '',
          bindingRule:res.data.bindingRule || ''
        });
      }
    })
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
          app.userstatistics(49);
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this;
    return {
      title:'我正在美拆抽取展会优先入场资格，快来一起参与吧',
      path: "/page/secondpackge/pages/luckyDraw/luckyDraw?id="+_this.data.id,
      imageUrl:app.signindata.indexShareImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
    } 
  },
  // /**
  //  * 用户点击右上角分享
  //  */
  onShareTimeline:function(){
    var _this = this;
    var indexShare = app.signindata.indexShare || [];
    var indexShareNum = Math.floor(Math.random() * indexShare.length) || 0;
    var indexShareImg = '';
    if(indexShare.length!=0 && indexShare[indexShareNum]){
      indexShareImg = indexShare[indexShareNum]+'?time=' + Date.parse(new Date());;
    };
    return {
      title:'我正在美拆抽取展会优先入场资格，快来一起参与吧',
      query:'perayu=1&id='+_this.data.id,
      imageUrl:indexShareImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
    } 
  },  

  // 跳转入场顺序
  jumpTicketRcSort(e){
    wx.navigateTo({  
      url: "/page/secondpackge/pages/ticketRcSort/ticketRcSort?keyDay="+e.currentTarget.dataset.keyday
    })
  },

  //时间戳转换时间  
  toDatehd: function (number) {
    var date = new Date(number * 1000);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + '年' + M + '月' + D + '日';
    
  },
})