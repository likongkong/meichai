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
    // 是否设置默认地址
    radselect:true,
    // 姓名
    name:'',
    // 手机号
    tel: '',
    // 地址
    address: '',
    // 详细地址
    deladdress: '',
    // 身份证号
    idnumber:'',
    // 地址id
    aid:'',
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
    // 提交遮罩层
    whitemask: false,     
    inputtxt1: '收货人姓名（请填写真实姓名）',
    inputtxt2: '手机号',
    inputtxt3: '详细地址',
    inputtxt4: '身份证号码（选填）',
    c_title: '收货地址',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),

  },
  onFocus: function (w) {
    var inp = w.currentTarget.dataset.inp || w.target.dataset.inp || 0;
    if (inp == 1) {
      this.setData({
        inputtxt1: " "
      });
    } else if (inp == 2) {
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
    };

  },
  onBlur: function (w) {
    var inp = w.currentTarget.dataset.inp || w.target.dataset.inp || 0;
    if (inp == 1) {
      this.setData({
        inputtxt1: "收货人姓名（请填写真实姓名）"
      });
    } else if (inp == 2) {
      this.setData({
        inputtxt2: "手机号"
      });
    } else if (inp == 3) {
      this.setData({
        inputtxt3: "详细地址"
      });
    } else if (inp == 4) {
      this.setData({
        inputtxt4: "身份证号码（选填）"
      });
    };
  }, 
  // 是否设置默认地址
  radselectfun:function(){
    this.setData({
      radselect: !this.data.radselect
    })
  },
  // 监听输入input值
  namefun:function(e){
    this.setData({
      name: e.detail.value
    })   
  },
  telfun: function (e) {  
    this.setData({
      tel: e.detail.value
    })
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
    this.setData({
      idnumber: e.detail.value
    })
  },
// 提交数据
  submissionofdata:function(){
    if (this.data.name == '') {
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
    } else if (!myreg.test(this.data.tel)) {
      app.showToastC('手机号有误！')
      return false;
    } else {}
    if (this.data.province == '') {
      app.showToastC('所在区不能为空');
      return false;
    };
    if (this.data.deladdress == '') {
      app.showToastC('详细地址不能为空');
      return false;
    };
    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;


    //  提交数据
    var _this = this;
    // 判断是否选中
    if (_this.data.radselect) {
      var isdefa = 1;
    } else {
      var isdefa = 0;
    };
    _this.setData({
      whitemask: true
    });
    var q = Dec.Aese('mod=address&operation=set&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&phone=' + _this.data.tel + '&consignee=' + _this.data.name + '&province=' + _this.data.province + '&city=' + _this.data.city + '&district=' + _this.data.county + '&address=' + _this.data.deladdress + '&idcard=' + _this.data.idnumber + '&isdefault=' + isdefa + '&aid=' + _this.data.aid)
    wx.request({
      url: app.signindata.comurl + 'user.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        _this.setData({
          whitemask: false
        });        
        if (res.data.ReturnCode == 200) {
          app.showToastC('提交成功');
          var pages = getCurrentPages();  
          var beforePage = pages[pages.length - 2];
          wx.navigateBack({
            success: function () {
              beforePage.nextpagediao();
            }
          });
        }else if (res.data.ReturnCode == 901) {
          app.showToastC('身份证号格式不正确');
        }else if (res.data.ReturnCode == 909) {
          app.showToastC('身份证信息不匹配');
        }else if (res.data.ReturnCode == 910) {
          app.showToastC('身份信息错误次数过多，请明天再试');
        }else if (res.data.ReturnCode == 913) {
          app.showToastC('地址id有误');
        } else {
          app.showToastC(res.data.Msg);
        };        
      },
      fail: function () {}
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
    this.selectComponent("#hide").getappData()
  },   
  onLoad: function (options) {
    this.setData({
      deladdress:options.address,
      aid:options.aid,
      city:options.city,
      name:options.consignee,
      county:options.district,
      idnumber:options.idcard||'',
      tel:options.phone,
      province:options.province,
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      lim: options.lim || 0      
    });

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
    }
    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': options.province,
      'city': options.city,
      'county': options.district
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
  /*** 生命周期函数--监听页面卸载*/
  onUnload: function () { },
  /** * 页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function () {},
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
        values: val,
        value: val
      })
      return;
    }
  },
  open: function () {
    this.setData({
      condition: !this.data.condition,
      cityback: !this.data.cityback
    })
  }    
})