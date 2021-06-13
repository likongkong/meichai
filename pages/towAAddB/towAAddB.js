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

  onLoad: function (options) {
    console.log('inventory====',options.inventory)
    wx.hideShareMenu()
    var dateTime = new Date();
    var day = dateTime.getDate();
    if(day == 12){
      var txtColor = '#F8627B';
    }else if(day == 13){
      var txtColor = '#3B8DB5';
    }else if(day == 14){
      var txtColor = '#299331';
    }else{
      var txtColor = '#F8627B';
    };
    this.setData({
      txtColor:txtColor,
      inventory:options.inventory || 1
    })
    console.log(day,txtColor)

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
  addressmanagementB(w){
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var ch = w.currentTarget.dataset.ch || w.target.dataset.ch || false;
    var _this = this;
    var zoneB = _this.data.zoneB || [];
    console.log('zoneB[ind]===',zoneB[ind])
    if(zoneB[ind]){
        if(ch){
          zoneB[ind].checked = !zoneB[ind].checked;
          _this.setData({
            zoneB
          });
        }else{
          var stock = zoneB[ind].stock;
          if(stock <= 0){
            app.showToastC('暂无库存');
            return false;
          };
          zoneB.forEach(element => {
            element.checked = false;
          });
          zoneB[ind].checked = !zoneB[ind].checked;
          _this.setData({
            zoneB
          });
        }

    };
    _this.isup()

  },
  addressmanagementA(w){
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var ch = w.currentTarget.dataset.ch || w.target.dataset.ch || false;
    var _this = this;
    var zoneA = _this.data.zoneA || [];
    console.log('zoneB[ind]===',zoneA[ind])
    if(zoneA[ind]){
        if(ch){
          zoneA[ind].checked = !zoneA[ind].checked;
          _this.setData({
            zoneA
          });
        }else{
          var stock = zoneA[ind].stock;
          if(stock <= 0){
            app.showToastC('暂无库存');
            return false;
          };
          var i =0;
          zoneA.forEach(element => {
            if(element.checked){
              ++i;
            };
          });
          if(i >= 2){
            app.showToastC('A最多选两个');
          }else{
            zoneA[ind].checked = !zoneA[ind].checked;
            _this.setData({
              zoneA
            });
          }
        };
    };

    _this.isup()

  },
  isup(){
     var _this = this;
     var zoneB = _this.data.zoneB || [];
     var is_b = false;
     var commonPrice = 0;
     var arrId = [];
     zoneB.forEach(element => {
       if(element.checked){
         is_b = true;
         commonPrice += parseInt(element.price);
         arrId.push(element.id)
       }
     });

     var zoneA = _this.data.zoneA || [];
     var is_a = false;
     var i = 0;
     zoneA.forEach(element => {
       if(element.checked){
          is_a = true;
          i ++;
          commonPrice += parseInt(element.price);
          arrId.push(element.id);
       }
     });
     if(is_b || is_a){
       _this.setData({
         is_upup:true,
         commonPrice,
         arrId
       });
     }else{
       _this.setData({
         is_upup:false,
         commonPrice,
         arrId
       });      
     }

  },
  dsbbbutclickt(){
    var _this = this;
    var zone = [...this.data.zoneA,...this.data.zoneB];
    var zone1=[];
    for(var i =0;i<this.data.arrId.length;i++){
        for(var j =0;j<zone.length;j++){
          if(this.data.arrId[i] == zone[j].id){
            zone1.push(zone[j].zone)
          }
        }
    }
    if(zone1.indexOf('B') != 0){
      console.log('没有选B');
      wx.showModal({
        title: '提示',
        content: '您没有选B区商品，是否确认下单',
        success (res) {
          if (res.confirm) {
            _this.setData({
              tipback: true,
              tipbacktwo: true,
              buybombsimmediately: true
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      this.setData({
        tipback: true,
        tipbacktwo: true,
        buybombsimmediately: true
      });
    }
   
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

  // myorderfun(){

  //   var _this = this;
  //   var zoneB = _this.data.zoneB || [];
  //   var is_b = false;
  //   var b_name = '',
  //   var b_id = '';
  //   zoneB.forEach(element => {
  //     if(element.checked){
  //       is_b = true;
  //       b_name = element.name,
  //       b_id = id;
  //     }
  //   });

  //   var zoneA = _this.data.zoneA || [];
  //   var is_a = false;
  //   var i = 0;
  //   var a_name = '',
  //   var a_id = '';

  //   zoneA.forEach(element => {
  //     if(element.checked){
  //        i ++;
  //        a_name = 'A:'+element.name,
  //        a_id = a_id + toString(element.id) ;         
  //     };
  //   });
  //   console.log(i)
  //   if(i==2){
  //     is_a = true;
  //   };
  //   // if(is_b && is_a){

  //   // }else{
     
  //   // };

    
  // },
  listdata:function(){
    var _this = this;
    wx.showLoading({ title: '加载中...', mask:true })

    var q = Dec.Aese('mod=show&operation=listaab&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
console.log(app.signindata.comurl + 'toy.php'+q)
    wx.request({
      url: app.signindata.comurl + 'toy.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('A+B===',res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        wx.hideLoading()
        if (res.data.ReturnCode == 200){
          // vip
          var zoneA = res.data.List.zoneA || [];
          var zoneB = res.data.List.zoneB || [];
          zoneA.forEach(element => {
            element.checked = false;
          });
          zoneB.forEach(element => {
            element.checked = false;
          });

          _this.setData({
            zoneA,
            zoneB,
            is_upup:false
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.Msg,
            showCancel: false,
            success: function (res) {
              wx.reLaunch({
                url: "/pages/index/index?judgeprof=2"
              });
            }
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
    _this.listdata()

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

  // 编辑地址
  jumpeditaddress: function (event){
    var aid = event.target.dataset.aid || event.currentTarget.dataset.aid;
    var address = event.target.dataset.address || event.currentTarget.dataset.address;
    var city = event.target.dataset.city || event.currentTarget.dataset.city;
    var consignee = event.target.dataset.consignee || event.currentTarget.dataset.consignee;
    var district = event.target.dataset.district || event.currentTarget.dataset.district;
    var idcard = event.target.dataset.idcard || event.currentTarget.dataset.idcard;
    var phone = event.target.dataset.phone || event.currentTarget.dataset.phone;
    var province = event.target.dataset.province || event.currentTarget.dataset.province;
    wx.navigateTo({ 
      url: "/pages/shippingAddress/shippingAddress?aid=" + aid + '&address=' + address + '&city=' + city + '&consignee=' + consignee + '&district=' + district + '&idcard=' + idcard + '&phone=' + phone + '&province=' + province
    })
  },
  // 跳转增加新地址
  jumpaddress:function(){
    wx.navigateTo({ 
      url: "/pages/newreceivingaddress/newreceivingaddress"
    })     
  },

  // 一级背景
  tipbackdis:function(){
    var _this = this;
    if (this.data.paymentiftr){
      wx.showModal({
        title:'确定放弃支付吗？',
        content: '个人中心-我的订单-继续支付\n付款成功后，才可以拆单成功',
        success: function (res) {
          if (res.confirm) {
            _this.setData({
              tipback: false,
              dsbframeiftr: false,
              paymentiftr:false,
            })
          }
        }
      })       
    }else{
      _this.setData({
        tipback: false,
        dsbframeiftr: false,
      })
    }
  },
  receivingaddressfun(){
    this.setData({
      receivingaddress: false,
    })    
  },
  // 二级背景函数
  tipbacktwo:function(){
    if(this.data.specialGoods==1){
      this.setData({
        tipback: false
      })
    };
    if (this.data.receivingaddress){
      this.setData({
        receivingaddress: false,
      })        
    } else if (this.data.couponprojectile){
      var checktwo1 = this.data.coudata1
      for (var i = 0; i < checktwo1.length; i++) {
        if (this.data.coudata1cid == checktwo1[i].cid) {
          checktwo1[i].imgcheck = true;
        } else {
          checktwo1[i].imgcheck = false;
        };
      };
      var checktwo2 = this.data.coudata2;
      for (var i = 0; i < checktwo2.length; i++) {
        if (this.data.coudata2cid == checktwo2[i].cid) {
          checktwo2[i].imgcheck = true;
        } else {
          checktwo2[i].imgcheck = false;
        };
      }; 
      this.setData({
        coudata1: checktwo1,
        coudata2: checktwo2,   
        couponprojectile: false,     
      });
    }else{
      this.setData({
        tipbacktwo: false,
        tipback: false,
        buybombsimmediately: false,
        receivingaddress: false,
        couponprojectile: false,
      })
    };
  },

  qandanswerquestions:function(){
    var _this = this;
    _this.placeorder();
  },
  // 提交订单
  placeorder:function(){
    var _this = this;
    
    var aid = _this.data.tipaid;
    var arrId = _this.data.arrId.join(',');
    var q = Dec.Aese('mod=show&operation=orderaab&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + aid + '&roleId='+ arrId);

    console.log('mod=show&operation=orderaab&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + aid + '&roleId='+ arrId)

    wx.showLoading({ title: '加载中...', mask:true})
    wx.request({
      url: app.signindata.comurl + 'toy.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {  
        console.log('提交订单====',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          wx.redirectTo({    
            url: "/page/component/pages/orderdetails/orderdetails?oid="+res.data.Info.orderId
          })
        }else{
        
          wx.showModal({
            title: '提示',
            content: res.data.Msg,
            showCancel: false,
            success: function (res) { }
          })
        };
      }
    })
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
    return app.sharemc()    
  },
  onShareTimeline:function(){
    return {
      title:'潮玩社交平台',
      query:{}
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