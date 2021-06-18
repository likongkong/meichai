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

    is_vip:0,
    sizeArr:['S','M','L','XL'],
    selSize:'',
    is_updata:true,
    sizeArrOr:['L'],
  },
  selSizefun(w){
    var ss = w.currentTarget.dataset.ss || w.target.dataset.ss;
    this.setData({
      selSize:ss
    })
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
    console.log(options)
    var _this = this;
    if (options.scene){
        let scene = decodeURIComponent(options.scene);
        var c_title = (_this.getSearchString('isv', scene) || 2) == 1 ? 'VIP礼包领取' : '普通票礼包领取';
        this.setData({
          is_vip:_this.getSearchString('isv', scene) || 2,
          c_title:c_title,
          oid:_this.getSearchString('oid', scene)
        });
    }else{
      var c_title = (options.isv || 2) == 1 ? 'VIP礼包领取' : '普通票礼包领取';
        this.setData({
          is_vip: options.isv || 2,
          c_title: c_title,
          oid: options.oid
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


  
  updata(){
    var _this = this;
    if (this.data.selSize == ''){
      app.showToastC('请选择衣服尺码~');
      return false;
    }; 
    _this.setData({
      tipbacktwo:true,
      buybombsimmediately:true
    })

  },

  listdata:function(){
    var _this = this;

    wx.showLoading({ title: '加载中...', mask:true })

    var q = Dec.Aese('mod=operate&operation=executeToReceiveVIPPackage&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + _this.data.oid + '&address_id='+ _this.data.tipaid + '&size=' + _this.data.selSize)

    console.log('mod=operate&operation=executeToReceiveVIPPackage&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + _this.data.oid + '&address_id='+ _this.data.tipaid + '&size=' + _this.data.selSize)

    wx.request({
      url: app.signindata.comurl + 'order.php'+q,
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
            content: '领取成功',
            showCancel: false,
            success: function (res) {
              wx.redirectTo({    
                url: "/page/component/pages/orderdetails/orderdetails?oid=" + _this.data.oid
              })
            }
          }) 
          _this.setData({
            tipbacktwo:false,
            buybombsimmediately:false,
            is_updata:false
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
    if(app.signindata.isManager){wx.showShareMenu({ withShareTicket: true})}else{
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

    if(app.signindata.receivingAddress && app.signindata.receivingAddress.length != 0){
      var rdl = app.signindata.receivingAddress;
      var tptipadi = '';
      var tptipadd = '';
      var tipnamephone = '';
      for (var i = 0; i < rdl.length; i++) {
        if (rdl[i].isdefault == 1) {
          rdl[i].checked = false;
          tptipadi = rdl[i].aid;
          tptipadd = rdl[i].address;
          tipnamephone = rdl[i].consignee + " " + rdl[i].phone;
        } else {
          rdl[i].checked = false;
        }
      };
      _this.data.tipaid = tptipadi;
      _this.setData({
        addressdata: rdl,
        tipnamephone: tipnamephone,
        tipaddress: tptipadd
      })
      console.log('地址=======onloadfun====',_this.data.addressdata)
    }else{
        this.nextpagediao();
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

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this;
    return {
      title:  'MCTS 展会信息核验',
      path: '/pages/vipOrTicket/vipOrTicket?isv=' + _this.data.is_vip + '&oid='+_this.data.oid,
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

  // 下一页返回调取
  nextpagediao:function(){
    var _this = this;
    //  调取收货地址
    var q = Dec.Aese('mod=address&operation=getlist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'user.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('收货地址======nextpagediao=======',res)
        if (res.data.ReturnCode == 200){
          var rdl = res.data.List;
          var tptipadi = '';
          var tptipadd = '';
          var tipnamephone = '';
          if (rdl.length != 0) {
            for (var i = 0; i < rdl.length; i++) {
              if (rdl[i].isdefault == 1) {
                rdl[i].checked = true;
                tptipadi = rdl[i].aid;
                tptipadd = rdl[i].address;
                tipnamephone = rdl[i].consignee + " " + rdl[i].phone;
              } else {
                rdl[i].checked = false;
              }
            };
            _this.data.tipaid = tptipadi;
            _this.setData({
              addressdata: rdl,
              tipnamephone: tipnamephone,
              tipaddress: tptipadd
            })

            app.signindata.receivingAddress = rdl;

          } else {
            _this.setData({
              addressdata: [],
            })
          };
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);         
      }
    });
  },

// 收货地址弹框
seladdressfun:function(){
  this.setData({
    receivingaddress:true,
  });
},
// 删除地址
deladdress: function (event){
  var _this = this;
  var dat = this.data.addressdata;
  var indid = event.target.dataset.ind;
  var num = '';
  var iftrdefault = false;
  for (var i = 0; i < dat.length; i++) {
    if (dat[i].aid == indid) {
      num = i;
      if (dat[i].isdefault == 1) {
        iftrdefault = true;
      }
    }
  };
  if (iftrdefault) {
    app.showToastC('默认地址不能删除');
    return false;
  };
  wx.showModal({
    content: '您确定要删除这个地址吗？',
    success: function (res) {
      if (res.confirm) {
        var q = Dec.Aese('mod=address&operation=delete&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + indid)
        wx.request({
          url: app.signindata.comurl + 'user.php'+q,
          method: 'GET',
          header: { 'Accept': 'application/json' },
          success: function (res) {
            if (res.data.ReturnCode == 200){
              dat.splice(num, 1);
              _this.setData({
                addressdata: dat
              });
              app.signindata.receivingAddress = dat;
            };
            if (res.data.ReturnCode == 908) {
              app.showToastC('aid和uid不匹配');
            };              
            // 判断非200和登录
            Dec.comiftrsign(_this, res, app);              
          }
        })
      }
    }
  })
},
  // 跳转增加新地址
  jumpaddress:function(){
    wx.navigateTo({ 
      url: "/pages/newreceivingaddress/newreceivingaddress"
    })     
  },
  // 隐藏收货地址弹框
  receivingaddressfun:function(){
    this.setData({
      receivingaddress: false,
    })
  },
  // 修改收货地址
  revisethereceivingaddress:function(w){
    var tipaid = w.currentTarget.dataset.tipaid || w.target.dataset.tipaid;
    var tipadd = w.currentTarget.dataset.tipadd || w.target.dataset.tipadd;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind||0;
    this.data.tipaid = tipaid;
    var data = this.data.addressdata;
    this.setData({
      tipnamephone: data[ind].consignee + " " + data[ind].phone,
      tipaddress: tipadd,
      receivingaddress: false
    });
  },
  tiphidfun(){
     if(this.data.receivingaddress){
        this.setData({
          receivingaddress:false,
        })
     }else{
        this.setData({
          tipbacktwo:false,
          buybombsimmediately:false
        })
     }

  }
})