var Dec = require('../../common/public.js');//aes加密解密js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 接口地址
    comurl: app.signindata.comurl,
    // 图片地址
    zdyurl: Dec.zdyurl(),
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    appNowTime: app.signindata.appNowTime,

    // 版本号
    versionnumber: app.signindata.versionnumber,
 
    inputtxt1: '姓名（请填写真实姓名）',
    inputtxt2: '手机号',
    inputtxt3: '收货地址',
    inputtxt4: '身份证号码',
    
    // 判断身份选项是否显示
    iftrid:'',
    c_title: '',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90, 
    // 是否授权
    signinlayer:true,
    windowHeight: app.signindata.windowHeight - 65 - wx.getStorageSync('statusBarHeightMc')||0,

    is_vip:0
  },

  // 我的订单
  myorderfun:function(e){
    wx.navigateTo({  
      url: "/pages/myorder/myorder?tabnum=3"
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //key(需要检错的键） url（传入的需要分割的url地址）
  getSearchString: function (key, Url) {
    // 获取URL中?之后的字符
    var str = Url;
    var arr = str.split("&");
    var obj = new Object();
    for (var i = 0; i < arr.length; i++) {
      var tmp_arr = arr[i].split("=");
      obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
    }
    return obj[key];
  },
  onLoad: function (options) {
    var _this = this;
    if (options.scene){
        let scene = decodeURIComponent(options.scene);
        var c_title = (_this.getSearchString('isv', scene) || 2) == 1 ? 'VIP票信息核实' : '普通票信息核实';
        var inputtxt5 = (_this.getSearchString('isv', scene) || 2) == 1 ? 'VIP序号' : '订单号';
        this.setData({
          is_vip:options.isv || 2,
          c_title:c_title,
          inputtxt5:inputtxt5
        });
    }else{
        var c_title = (options.isv || 2) == 1 ? 'VIP票信息核实' : '普通票信息核实';
        var inputtxt5 = (options.isv || 2) == 1 ? 'VIP序号' : '订单号';
        this.setData({
          is_vip:options.isv || 2,
          c_title:c_title,
          inputtxt5:inputtxt5
        });
    };


    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        if (true) {
          // '已经授权'
          _this.data.loginid = app.signindata.loginid;
          _this.setData({
            uid: app.signindata.uid,
            isProduce: app.signindata.isProduce,
            signinlayer: true,
            tgabox: false
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this)
          }
        } else {
          wx.hideLoading();
          _this.setData({
            signinlayer:false
          }); 
          // '没有授权 统计'
          app.userstatistics(4);

        }
      }
    });
  },
  onFocus: function (w) {
    var inp = w.currentTarget.dataset.inp || w.target.dataset.inp || 0;
    if(inp==1){
      this.setData({
        inputtxt1: " "
      });
    } else if (inp == 2){
      this.setData({
        inputtxt2: " "
      });
    } else if (inp == 3) {
      this.setData({
        inputtxt3: " "
      });
    } else if (inp == 4) {
      this.setData({
        inputtxt4: " "
      });
    }else if(inp == 5){
      this.setData({
        inputtxt5: " "
      });     
    };

  },
  onBlur: function (w) {
    var inp = w.currentTarget.dataset.inp || w.target.dataset.inp || 0;
    if (inp == 1) {
      this.setData({
        inputtxt1: "姓名（请填写真实姓名）"
      });
    } else if (inp == 2) {
      this.setData({
        inputtxt2: "手机号"
      });
    } else if (inp == 3) {
      this.setData({
        inputtxt3: "收货地址"
      });
    } else if (inp == 4) {
      this.setData({
        inputtxt4: "身份证号码"
      });
    }else if(inp == 5){
      var inputtxt5 = this.data.is_vip == 1 ? 'VIP序号' : '订单号';
      this.setData({
        inputtxt5:inputtxt5
      });      
    };
  },  
  // 监听输入input值
  namefun:function(e){
    this.data.name = e.detail.value;
  },
  telfun: function (e) { 
    this.data.tel = e.detail.value
  },
  addressfun: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  deladdressfun: function (e) {
    this.setData({
      deladdress: e.detail.value
    })
  },
  idnumberfun: function (e) {
    this.data.idnumber = e.detail.value
  },
  ordernumber: function (e) {
    this.data.orderNumber = e.detail.value
  },
  
  listdata:function(){
    var _this = this;

    if (this.data.name == ''){
      app.showToastC('姓名不能为空');
      return false;
    };
    var myreg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57]|19[0-9]|16[0-9])[0-9]{8}$/;
    if (this.data.tel.length == 0) {
      app.showToastC('输入的手机号为空')
      return false;
    } else if (this.data.tel.length < 11) {
      app.showToastC('手机号长度有误！')
      return false;
    } else if (this.data.tel && this.data.tel[0]!=1) {
      app.showToastC('手机号有误！')
      return false;
    } else if(this.data.idnumber == '') {
      app.showToastC('身份证号不能为空');
      return false;
    } else if(this.data.orderNumber == '') {
      if(this.data.is_vip==1){
        app.showToastC('VIP序号不能为空');
      }else{
        app.showToastC('订单号不能为空');
      };
      return false;
    }; 
    
    if(_this.data.is_vip == 1){
      var txttxt =  '姓名:'+_this.data.name + '\n手机号:'+_this.data.tel +  '\n身份证号:'+_this.data.idnumber +  '\nVIP序号:'+_this.data.orderNumber
    }else{
      var txttxt =  '姓名:'+_this.data.name + '\n手机号:'+_this.data.tel +  '\n身份证号:'+_this.data.idnumber +  '\n订单号:'+_this.data.orderNumber
    }
    // var txttxt =  '每人只有一次提交机会，请核对好信息再提交，一旦发现作假信息，将会对订单进行封禁处理，失去购买对应商品的资格'
    
    wx.showModal({
      title: '身份信息确认',
      content:txttxt ,
      cancelText: '确定',
      confirmText: '取消',
      confirmColor:'#000',
      cancelColor: '#000',
      success (res) {
        if (res.cancel) {
          wx.showLoading({ title: '加载中...', mask:true })

          var q = Dec.Aese('mod=bind&operation=addTicketsUserInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&add_type=' + _this.data.is_vip + '&consignee='+ _this.data.name + '&idcard=' + _this.data.idnumber + '&mobile=' + _this.data.tel + '&vipNumber=' + _this.data.orderNumber)
      
          console.log('mod=bind&operation=addTicketsUserInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&add_type=' + _this.data.is_vip + '&consignee='+ _this.data.name + '&idcard=' + _this.data.idnumber + '&mobile=' + _this.data.tel + '&vipNumber=' + _this.data.orderNumber)
      
          wx.request({
            url: app.signindata.comurl + 'toy.php'+q,
            method: 'GET',
            header: { 'Accept': 'application/json' },
            success: function (res) {
              console.log('票务信息统计===',res)
              // 刷新完自带加载样式回去
              wx.stopPullDownRefresh();
              wx.hideLoading()
              if (res.data.ReturnCode == 200){
                wx.showModal({
                  title: '提示',
                  content: '提交成功',
                  showCancel: false,
                  success: function (res) { 
                    wx.reLaunch({
                      url: "/pages/index/index?judgeprof=2"
                    });
                  }
                }) 
              }else{
                wx.showModal({
                  title: '提示',
                  content: res.data.Msg || res.data.msg,
                  showCancel: false,
                  success: function (res) {}
                })          
              };
      
      
            }
          });             
         } else if (res.confirm) {
           
         }
       }
    })


    
  },
  onLoadfun:function(){
    //  我的订单数据
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
    });
    // 是否可以分享 
    if(app.signindata.isManager){}else{
      wx.hideShareMenu();
    };

    // 已经授权，可以直接调用
    if(app.signindata.userInfo && app.signindata.userInfo.avatarUrl){
      var userInfo = app.signindata.userInfo || {};
      _this.setData({
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        gender: userInfo.gender,
        istitnex: false,
        istit: true,
      })
    };

  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  pullupsignin:function(){
    // // '没有授权'
    this.setData({
      tgabox: true
    });
  },
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
      this.listdata();  
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title:  'MCTS 展会信息核验',
      imageUrl: 'https://www.51chaidan.com/images/shareImg/ddm_heyan.jpg',
      success: function (res) {}
    }   
  },
  // 导航跳转
  whomepage: function () {
    wx.reLaunch({
      url: "/pages/index/index?judgeprof=2"
    });
  },
  wnews: function () {
    var _this = this;
    app.limitlottery(_this);
  },
  wshoppingCart: function () {
    var _this = this;
    wx.redirectTo({
      url: "/pages/shoppingCart/shoppingCart"
    });
  },
  wmy: function () { 
    this.onPullDownRefresh(); 
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
            tgabox: false
          });
          _this.onShow();
          // 确认授权用户统计
          app.clicktga(4)
        }
      }
    });
    if (e.detail.detail.userInfo) { } else {
      app.clicktga(8)  //用户按了拒绝按钮
    };

  },


})