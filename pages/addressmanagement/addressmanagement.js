var Dec = require('../../common/public.js');//aes加密解密js

var tcity = require("../../common/citys.js");
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
    morn:true,
    addmandata:[],
    c_title: '收货地址',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
  },
  addeditclick:function(){
    this.setData({
      morn: !this.data.morn
    });
  },
  radioChange: function (event){
    var id = event.currentTarget.dataset.id;
  },
  // 设置默认地址
  obtainind:function(event){
    var _this=this;
    var dat = this.data.addmandata;
    var indid = event.target.dataset.ind;
    for (var i = 0; i < dat.length;i++){
       if (dat[i].aid == indid){
          dat[i].checked=true;
          dat[i].isdefault=1;
          var q = Dec.Aese('mod=address&operation=setdefault&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + indid)
          wx.request({   
            url: app.signindata.comurl + 'user.php'+q,
          method: 'GET',
            header: { 'Accept': 'application/json' },
            success: function (res) {
              if (res.data.ReturnCode == 200) {
                app.showToastC('设置成功');
              }else if (res.data.ReturnCode == 900) {
                app.showToastC('登陆状态有误');
              }else if (res.data.ReturnCode == 908) {
                app.showToastC('aid和uid不匹配');
              }else{
                app.showToastC(res.data.Msg);                
              };              
             
            }
          })
        }else{
          dat[i].checked = false;
          dat[i].isdefault = 0;
        }
    };
    this.setData({
      addmandata:dat
    });
  },
  // 编辑地址
  shippingAddress: function (event){
    var aid = event.target.dataset.aid || event.currentTarget.dataset.aid ;
    var address = event.target.dataset.address || event.currentTarget.dataset.address;
    var city = event.target.dataset.city || event.currentTarget.dataset.city;
    var consignee = event.target.dataset.consignee || event.currentTarget.dataset.consignee;
    var district = event.target.dataset.district || event.currentTarget.dataset.district;
    var idcard = event.target.dataset.idcard || event.currentTarget.dataset.idcard||'';
    var phone = event.target.dataset.phone || event.currentTarget.dataset.phone;
    var province = event.target.dataset.province || event.currentTarget.dataset.province;     
    wx.navigateTo({
      url: "/pages/shippingAddress/shippingAddress?aid=" + aid + '&address=' + address + '&city=' + city + '&consignee=' + consignee + '&district=' + district + '&idcard=' + idcard + '&phone=' + phone + '&province=' + province
    })
  },
  // 添加新地址
  addressnew:function(){
    wx.navigateTo({
      url: "/pages/newreceivingaddress/newreceivingaddress"
    })
  },
  // 删除地址
  deladdress: function (event){
    var _this = this;
    var dat = this.data.addmandata;
    var indid = event.currentTarget.dataset.ind || event.target.dataset.ind;
    var num = '';
    var iftrdefault = false;
    for (var i = 0; i < dat.length;i++) {
       if (dat[i].aid == indid){
         num=i;
         if (dat[i].isdefault==1){
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
          var q = Dec.Aese('mod=address&operation=delete&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&aid='+indid)
          wx.request({
            url: app.signindata.comurl + 'user.php'+q,
            method: 'GET',
            header: { 'Accept': 'application/json' },
            success: function (res) {
              if (res.data.ReturnCode == 200) {
                dat.splice(num, 1);
                _this.setData({
                  addmandata: dat
                });
              }else if (res.data.ReturnCode == 900) {
                app.showToastC('登陆状态有误');
              }else if (res.data.ReturnCode == 908) {
                app.showToastC('aid和uid不匹配');
              } else {
                app.showToastC(res.data.Msg);
              };                          
            }
          })          

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
    wx.getSetting({
      success: res => {
        if (true) {
          // '已经授权'
          _this.setData({
            loginid: app.signindata.loginid,
            uid: app.signindata.uid
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun(options);
          } else {
            app.signin(_this)
          }
        } else {
          wx.getUserInfo({
            success: res => {
              // 判断是否登录
              if (_this.data.loginid != '' && _this.data.uid != '') {
                _this.onLoadfun(options);
              } else {
                app.signin(_this);
              }
            },
            fail: res => {
              wx.navigateTo({
                url: "/pages/signin/signin"
              });
            }
          });

        }
      }
    });
  },
  // 加载数据
  onLoadfun: function (){
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid
    });
    var qq = Dec.Aese('mod=address&operation=getlist&uid='+_this.data.uid+'&loginid='+_this.data.loginid);     
    wx.request({
      url: app.signindata.comurl + 'user.php'+qq,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {

        if (res.data.ReturnCode == 200){
          var rdl = res.data.List;
          if (rdl.length != 0) {
            for (var i = 0; i < rdl.length; i++) {
              if (rdl[i].isdefault == 1) {
                rdl[i].checked = true;
              } else {
                rdl[i].checked = false;
              }
            }
          };
          _this.setData({
            addmandata: rdl
          })

          app.signindata.receivingAddress = rdl;
        };
        if (res.data.ReturnCode == 900) {
          app.showToastC('登陆状态有误');
        };     
      },
      fail: function () {
        // fail
      }
    })
  },
  // 下一页返回调取
  nextpagediao: function () {
    var _this = this;
    //  调取收货地址
    var q = Dec.Aese('mod=address&operation=getlist&uid='+_this.data.uid+'&loginid='+_this.data.loginid);
    wx.request({
      url: app.signindata.comurl + 'user.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200){
          var rdl = res.data.List;
          if (rdl.length != 0) {
            for (var i = 0; i < rdl.length; i++) {
              if (rdl[i].isdefault == 1) {
                rdl[i].checked = true;
              } else {
                rdl[i].checked = false;
              }
            };
            _this.setData({
              addmandata: rdl,
            })

            app.signindata.receivingAddress = rdl;

          } else {
            _this.setData({
              addmandata: [],
            })
          };
        }else if (res.data.ReturnCode == 900) {
          app.showToastC('登陆状态有误');
        } else {
          app.showToastC(res.data.Msg);
        };      
      }
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
    return app.sharemc()
  }
})