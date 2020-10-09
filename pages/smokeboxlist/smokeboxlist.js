// /pages/smokeboxlist/smokeboxlist.js
var Dec = require('../../common/public.js'); //aes加密解密js
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    //接口地址
    comurl: app.signindata.comurl,
    // 图片地址
    zdyurl: Dec.zdyurl(),
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,
    avatarUrl: app.signindata.avatarUrl,
    isProduce: app.signindata.isProduce,
    // 适配苹果X
    isIphoneX: app.signindata.isIphoneX,
    defaultinformation: '',
    wxnum: '',

    // 授权弹框
    tgabox: false,

    // 晒单数量
    dryinglistnum: 0,
    shopnum: 0,

    c_title: '抽盒机列表',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,

    pid: 0,
    list: [],
    boastlist: [],
    listbutnum: 0,
    windowHeight: app.signindata.windowHeight - 65 - wx.getStorageSync('statusBarHeightMc') || 0,
    signinlayer: false,
    festivalId: false,
    // 倒计时时间戳
    perspcardata: '',
    // 倒计时展示数据
    percountdown: '',
    // 倒计时
    countdowntime: '',
    perspcardiftrmin: false,
    automat: app.signindata.automat,
    automatTimes: 0,
    automattitle: '',
    bannerList: [],
    currentSwiper: 0,
    ishowdealoradd: false,
    ishowdeal: true,
    ishowadd: false,
    addressdata: [],
    isBlindBoxDefaultAddress: false,
    maddid: '',
    ishowcover: false,
    ishowofficial:false,
    officialid:0,
    appid:0,
    brandprompts:false,
    brand_id:0,
    is_havedata:false
  },
  swiperChange: function(e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  onHide: function() {
    clearInterval(this.data.countdowntime);
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(this.data.countdowntime);
  },
  jumpowntoy: function() {
    var _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.navigateTo({
            url: "/page/component/pages/myothertoydg/myothertoydg?ownerId=" + _this.data.uid
          })
        } else {
          this.setData({
            tgabox: true,
          })
        }
      }
    });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      avatarUrl: app.signindata.avatarUrl,
      isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
    });
    wx.showLoading({
      title: '加载中...',
    })

    // 判断是否授权 
    var _this = this;

    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      _this.onLoadfun();
    }else{
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // '已经授权'
            _this.data.loginid = app.signindata.loginid;
            _this.data.openid = app.signindata.openid;
            _this.setData({
              uid: app.signindata.uid,
              avatarUrl: app.signindata.avatarUrl,
              isProduce: app.signindata.isProduce,
              isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
            });
            // 判断是否登录
            if (_this.data.loginid != '' && _this.data.uid != '') {
              _this.onLoadfun();
            } else {
              app.signin(_this)
            }
          } else {
            wx.hideLoading()
            app.userstatistics(30);
            _this.onLoadfun();
          }
        }
      });
    };

  },

  // 授权点击统计
  clicktga: function() {
    app.clicktga(2)
  },
  clicktganone: function() {
    this.setData({
      tgabox: false
    })
  },
  userInfoHandler: function(e) {
    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 确认授权用户统计
          app.clicktga(4);
          _this.setData({
            tgabox: false,
          });
          // '已经授权'
          _this.data.loginid = app.signindata.loginid,
            _this.data.openid = app.signindata.openid,
            _this.setData({
              uid: app.signindata.uid,
              avatarUrl: app.signindata.avatarUrl,
              isProduce: app.signindata.isProduce,
              isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
            });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this);
          };
        } else {
          _this.setData({
            tgabox: true
          });
        }
      }
    });
    if (e.detail.detail.userInfo) {} else {
      app.clicktga(8) //用户按了拒绝按钮
    };

  },

  onLoadfun: function() {

    var _this = this
    wx.hideLoading()
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      avatarUrl: app.signindata.avatarUrl,
      isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
      automat: app.signindata.automat ? app.signindata.automat : {
        isOpen: false,
        title: "",
        times: 0
      },
      automatTimes: app.signindata.automat.times,
      automattitle: app.signindata.automattitle || ''
    });


    _this.data.perspcardata = app.signindata.perspcardata || '';
    if (_this.data.perspcardata) {
      _this.setData({
        perspcardiftrmin: true
      });
      app.countdowntime(_this, _this.data.perspcardata)
    };

    if (_this.data.loginid != '' && _this.data.uid != '' && !_this.data.isBlindBoxDefaultAddress) {
      _this.setData({
        ishowdealoradd: true,
        ishowcover: true,
      })
    }

    _this.getlist(0)

    _this.getboast()

    _this.nextpagediao();

    setTimeout(function() {
      _this.getdefault()
    }, 1000)

  },


  getdefault: function() {
    var _this = this;
    // 调取晒单数量
    Dec.dryingSum(_this, app.signindata.clwcomurl);
    var qqq = Dec.Aese('operation=info&mod=info');
    // 获取默认信息
    wx.request({
      url: app.signindata.comurl + 'general.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if (res.data.ReturnCode == 200) {
        
          _this.setData({
            defaultinformation: res.data.Info,
            wxnum: res.data.Info.cs.wxid || 'meichai666666',
          });
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
        // 购物车数据显示
        Dec.shopnum(_this,app.signindata.comurl);
      }
    });

  },

  jumpsouchtem:function(w){
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    this.setData({
      brand_id: id||0,
    })
    this.getlist(0);
  },

  getlist: function(pid) {
    var _this = this
    wx.showLoading({
      title: '加载中...',
    })
     
    _this.setData({is_havedata:false})

    var q1 = Dec.Aese('mod=blindBox&operation=list&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + "&pid=" + pid+'&brandId='+_this.data.brand_id);

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        console.log('listdata=====',res)
        wx.stopPullDownRefresh();
        if (res.data.ReturnCode == 200) {
          var mlist = res.data.List.activity|| [];
          if (pid == 0 && mlist.length > 0) {
            var listbutnum = res.data.Info.countToys || 0;
            var festivalId = res.data.Info.festivalId || false;
            var festivalTicket = res.data.Info.festivalTicket || "";

            // 品牌id
            var eldataclass = res.data.List.brand || [];

            // 添加广告
            var adlist = res.data.List.ads || [];
            var listdata = [];
            if(adlist&&adlist.length!=0){
              var adindex = 0;
              for(var i=0;i<mlist.length;i++){
                  listdata.push(mlist[i]);
                  if(i%8==7){
                    console.log('i%8==8',i+'%8==7')
                    listdata.push({
                      list:adlist[adindex],
                      showtype:2
                    });
                    adindex++;
                    if(adindex >= adlist.length){
                      adindex=0;
                    };
                  }
              };
            }else{
              listdata = mlist;
            };


            _this.setData({
              // list: mlist,
              list: listdata,
              alert: res.data.List.alert,
              listbutnum: listbutnum,
              festivalId: festivalId,
              festivalTicket: festivalTicket,
              bannerList: res.data.List.banner || [],
              eldataclass:eldataclass
            })
          } else if (mlist.length > 0) {


            // 添加广告
            var adlist = res.data.List.ads || [];
            var listdata = [];
            if(adlist&&adlist.length!=0){
              var adindex = 0;
              for(var i=0;i<mlist.length;i++){
                  listdata.push(mlist[i]);
                  if(i%8==7){
                    console.log('i%4==0',i+'%4==0')
                    listdata.push({
                      list:adlist[adindex],
                      showtype:2
                    });
                    adindex++;
                    if(adindex >= adlist.length){
                      adindex=0;
                    };
                  }
              };
            }else{
              listdata = mlist;
            };

            mlist = _this.data.list.concat(listdata)
            _this.setData({
              list: mlist,
            })
            
          } else {
            _this.setData({
              pid: pid - 1,
            })
          }
        }
      },
      complete:function(){
        _this.setData({is_havedata:true});
        wx.stopPullDownRefresh();
        wx.hideLoading()
      }

    })
  },
  topjumpdetail: function(w) {
    var _this = this;
    var gid = w.currentTarget.dataset.gid;
    if (gid && gid != 0 && typeof(gid) != "undefined") {
      wx.navigateTo({
        url: "/pages/smokebox/smokebox?gid=" + gid
      });
    }
  },

  jumpdetail: function(w) {
    var _this = this;
    var id = w.currentTarget.dataset.id;
    var gid = w.currentTarget.dataset.gid;
    var official = w.currentTarget.dataset.official;
    var isdirectshipping = w.currentTarget.dataset.isdirectshipping;
    var isnoautomat = w.currentTarget.dataset.isnoautomat;
    
    var appid = w.currentTarget.dataset.appid;
    if (gid && gid != 0 && typeof(gid) != "undefined") {
      if (official){
        _this.setData({
          ishowofficial:true,
          officialid: gid,
          appid:appid,
          isnoautomat:false
        })
      } else if (isdirectshipping){
        if(isnoautomat){
          this.setData({
            gid: gid,
            brandprompts:true,
            isnoautomat:true,
            is_isdirectshipping:true
          })
        }else{
          this.setData({
            gid: gid,
            brandprompts:true,
            isnoautomat:false,
            is_isdirectshipping:false
          })
        }
      }else if(isnoautomat){
        this.setData({
          gid: gid,
          brandprompts:true,
          isnoautomat:isnoautomat,
          is_isdirectshipping:false
        })
      } else {
        wx.navigateTo({
          url: "/pages/smokebox/smokebox?gid=" + gid
        });
      }
    }
  },
  brandpromptsjump:function(){
    var _this = this;
    wx.navigateTo({
      url: "/pages/smokebox/smokebox?gid=" + _this.data.gid,
      complete: function () {
        _this.setData({
          brandprompts: false,
        })
      }
    });
  },
  closeoffbp:function(){
    this.setData({
      brandprompts: false,
    })
  },
  closeofficial:function(){
    var _this = this;
    _this.setData({
      ishowofficial: false,
    })
  },

  surejumpoutside: function(){
    var _this = this;
    wx.navigateToMiniProgram({
      appId: _this.data.appid,
      path: "/pages/smokebox/smokebox?gid=" + _this.data.officialid,
      envVersion: 'release',
      success(res) { }
    })
  },


  getboast: function() {
    var _this = this
    // wx.showLoading({
    //   title: '加载中...',
    // })
    var q1 = Dec.Aese('mod=blindBox&operation=record&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },

      success: function(res) {
        wx.stopPullDownRefresh();
        if (res.data.ReturnCode == 200) {
          _this.setData({
            boastlist: res.data.List.record,
          })
        }
        // wx.hideLoading()
      },

      fail: function(res) {
        // wx.hideLoading()
      }

    })
  },


  // 导航跳转
  whomepage: function() {
    wx.reLaunch({
      url: "/pages/index/index?judgeprof=2"
    });
  },

  dlfindfun: function() {
    wx.reLaunch({
      url: "/page/component/pages/dlfind/dlfind",
    })
  },

  // 导航跳转 
  wnews: function() {
    var _this = this;
    app.limitlottery(_this);
  },

  wshoppingCart: function() {
    wx.redirectTo({
      url: "/pages/shoppingCart/shoppingCart"
    });
  },

  wmy: function() {
    app.signindata.iftr_mc = true;
    wx.redirectTo({
      url: "/pages/wode/wode"
    });
  },

  onShow: function() {
    this.setData({
      pid: 0,
    })
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      avatarUrl: app.signindata.avatarUrl,
      isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
    });
    if(app.signindata.uid==''&&app.signindata.loginid==''){
      this.getlist(0)
    }
    
    if (app.signindata.perspcardata) {
      clearInterval(this.data.countdowntime);
      _this.setData({
        perspcardiftrmin: true
      });
      app.countdowntime(_this, _this.data.perspcardata)
    } else {
      clearInterval(this.data.countdowntime);
      _this.setData({
        perspcardiftrmin: false
      });
    };
    Dec.getdoubleEleven(this, app);

    if (_this.data.loginid != '' && _this.data.uid != '' && !_this.data.isBlindBoxDefaultAddress) {
      _this.setData({
        ishowdealoradd: true,
        ishowcover: true,
      })
      _this.nextpagediao();
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      pid: 0,
    })
    this.getlist(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var p = this.data.pid + 1;
    this.data.pid = p;
    this.getlist(p)
  },

  /**
   * 用户点击右上角分享
   */
  onShareTimeline:function(){
    var _this = this;
    return {
      title:_this.data.c_title || '潮玩社交平台',
      query: {},
    }
  },
  onShareAppMessage: function() {
    var _this = this
    var share = {
      title: "我正在在线抽盲盒，免费重抽！免费重抽！免费重抽！",
      imageUrl: "https://www.51chaidan.com/images/background/bgShareBlindBox.jpg",
      success: function(res) {

      }
    }
    return share;
  },
  doubleEleven: function() {
    var _this = this;
    wx.navigateTo({
      url: "/page/component/pages/doubleEleven/doubleEleven"
    });
  },

  agreeset: function() {
    var _this = this;
    _this.setData({
      ishowdeal: false,
      ishowadd: true,
    })
  },

  closedealoradd: function() {
    var _this = this;
    if (!_this.data.ishowdealoradd) {
      _this.setData({
        ishowdealoradd: true,
      })
    } else {
      if (_this.data.ishowadd) {
        _this.setData({
          ishowdeal: true,
          ishowadd: false,
        })
      } else {
        _this.setData({
          ishowdealoradd: false,
        })
      }
    }
  },

  showdealoradd: function() {
    var _this = this;
    _this.setData({
      ishowdealoradd: !_this.data.ishowdealoradd,
    })
  },

  // 跳转增加新地址
  jumpaddress: function() {
    var _this = this;
    wx.navigateTo({
      url: "/pages/newreceivingaddress/newreceivingaddress"
    })
  },

  // 下一页返回调取
  nextpagediao: function() {
    var _this = this;
    //  调取收货地址
    var q = Dec.Aese('mod=address&operation=getlist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'user.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          var rdl = res.data.List;
          if (rdl.length != 0) {
            for (var i = 0; i < rdl.length; i++) {
              rdl[i].checked = false;
            };
            _this.setData({
              addressdata: rdl,
            })
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

  selectdefult: function(w) {
    var _this = this;
    var ind = w.currentTarget.dataset.ind;
    var addressdata = _this.data.addressdata;
    for (var i = 0; i < addressdata.length; i++) {
      if (i != ind) {
        addressdata[i].checked = false;
      }
    }
    if (!addressdata[ind].checked) {
      addressdata[ind].checked = !addressdata[ind].checked;
      _this.setData({
        addressdata: addressdata,
        maddid: addressdata[ind].aid,
      })
    } else {
      addressdata[ind].checked = !addressdata[ind].checked;
      _this.setData({
        addressdata: addressdata,
        maddid: '',
      })
    }

  },

  setdefultadd: function() {
    var _this = this;
    //  调取收货地址
    var q = Dec.Aese('mod=address&operation=setBlindBoxDefaultAddress&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + _this.data.maddid)

    wx.request({
      url: app.signindata.comurl + 'user.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            ishowdealoradd: false,
            isBlindBoxDefaultAddress: true,
            ishowcover: false,
          })
          app.signindata.isBlindBoxDefaultAddress = true;
        }
      }
    });
  }
})