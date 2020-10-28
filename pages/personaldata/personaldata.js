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
    sex:1,
    // 头像地址
    nametxt:'',
    imgUrl:'../images/pic_headc.png',
    // 背景
    comback: false,
    // 性别弹框
    sextip: false,
    // 省市联动数据
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    cityback: false,
    // 临时数据
    provincel:'',
    cityl:'',
    countyl:'',
    c_title: '个人资料',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,     
  },
  // 选择图片
  setPhotoInfo:function(){
    var _this=this;
    wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          // success
          _this.setData({
            imgUrl: res.tempFilePaths
          });
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
  }, 
  //  上传图片
  upload:function (page, path) {
    var _this = this;    
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    }),
    wx.uploadFile({
      url: Dec.comurl() + 'user.php?mod=info&operation=upload&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid +'&litpic=',
      filePath: path[0],
      name: 'file',
      header: { "Content-Type": "multipart/form-data" },
      formData: {},
      success: function (res) {
        if (res.statusCode != 200) {
          wx.showModal({
            title: '提示',
            content: '上传失败',
            showCancel: false
          })
          return;
        }
        var data = res.data
        page.setData({  //上传成功修改显示头像
          imgUrl: path[0]
        })
      },
      fail: function (e) {
        wx.showModal({
          title: '提示',
          content: '上传失败',
          showCancel: false
        })
      },
      complete: function () {
        wx.hideToast();  //隐藏Toast
      }
    })
  },  
  // 显示性别弹框
  sextipfun:function(){
    this.setData({
      // 背景
      comback: true,
      // 性别弹框
      sextip: true
    })
  },
  // 修改性别女
  selwoman:function(){
     this.setData({
        // 背景
        comback: false,
        // 性别弹框
        sextip: false        
     });
     var _this = this;
     var q = Dec.Aese('mod=info&operation=setinfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&gender=0')
     wx.request({
       url: app.signindata.comurl + 'user.php'+q,
       method: 'GET',
       header: { 'Accept': 'application/json' },
       success: function (res) {
         if (res.data.ReturnCode == 200) {
           _this.setData({
             sex: 0,
             // 背景
             comback: false,
             // 性别弹框
             sextip: false
           });
           app.showToastC('提交成功');
         };
         // 判断非200和登录
         Dec.comiftrsign(_this, res, app); 
       },
     })     
  },
  selman: function () {
    this.setData({
      // 背景
      comback: false,
      // 性别弹框
      sextip: false      
    });
    var _this = this;
    var q = Dec.Aese('mod=info&operation=setinfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&gender=1')
    wx.request({
      url: app.signindata.comurl+'user.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            sex: 1,
            // 背景
            comback: false,
            // 性别弹框
            sextip: false
          });          
          app.showToastC('提交成功');
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app); 
      },
    })

  },
  sexcancel: function () {
    this.setData({
      // 背景
      comback: false,
      // 性别弹框
      sextip: false
    })
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoadfun: function () {
    this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid
    });
  },   
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid
    });     
    // 已经授权，可以直接调用 getUserInfo 
    wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            _this.setData({
              imgUrl: res.userInfo.avatarUrl,
            })
          }
        });
      }
    });   
    var q = Dec.Aese('mod=info&operation=getinfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'user.php'+q, 
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
           _this.setData({
             sex: res.data.Info.gender,
             nametxt: res.data.Info.nick,
             province: res.data.Info.province||'',
             city: res.data.Info.city||'',
             county: res.data.Info.district||'',             
           })
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);         
      },
      fail: function () {
        // fail
      }
    })



    // 省市联动
    var that = this;
    tcity.init(that);
    var cityData = that.data.cityData;
    const provinces = [];
    const citys = [];
    const countys = [];
    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    };
    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': that.data.province,
      'city': that.data.city,
      'county': that.data.county,
      'provincel': that.data.province,
      'cityl': that.data.city,
      'countyl': that.data.county      
    })   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
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
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return Dec.sharemc()    
  },
  // 省市联动
  bindChange: function (e) {
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if (val[0] != t[0]) {
      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })

      return;
    }
    if (val[1] != t[1]) {
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }


  },
  open: function () {
    this.setData({
      condition: !this.data.condition,
      cityback: !this.data.cityback
    })
  },
  // 取消
  opencan:function(){
    var _this = this;
    this.setData({
      condition: !this.data.condition,
      cityback: !this.data.cityback,
      province: _this.data.provincel,
      city: _this.data.cityl,
      county: _this.data.countyl,    
    });

  },
  // 确认并提交数据
  opentr:function(){
    var _this = this;
    this.setData({
      condition: !this.data.condition,
      cityback: !this.data.cityback,
      provincel: _this.data.province,
      cityl: _this.data.city,
      countyl: _this.data.county,       
    });
    var q = Dec.Aese('mod=info&operation=setinfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&province=' + _this.data.province + '&district=' + _this.data.county + '&city='+_this.data.city)
    wx.request({
      url: app.signindata.comurl + 'user.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          app.showToastC('提交成功');
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
      },
    })         
  }, 
})