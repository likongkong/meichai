// pages/getjigsaw/getjigsaw.js
var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
var util = require('../../../../utils/util.js');
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 接口地址
    comurl: app.signindata.comurl,
    gifturl: app.signindata.clwcomurl,
    version: Pub.versionNumber(),
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,
    // 授权弹框判断
    tgabox: false,
    ishowphone: false,
    ishowerror: false,

    jigsawinfo: '',
    shareinfo: '',

    order_sn: 'G181218178030489',

    imageWidth: 0,

    row: 0,

    viewWidth: 0,

    defaultList: [],

    help_ratio: [],

    clock: '',
    ishowclock: false,

    help_num: 0,

    statusBarHeight: '',
    titleBarHeight: '',

    help_list: [],

    recommend_list: [],

    page: 1,

    ishowmore: true,

    helpjigsaw: [],
    helpuid: 0,

    ishowsendone: false,
    ishowsendtwo: false,

    dialoginfo: '',

    ishowhint: false,

    createimage: '',
    ishowcreate: false,
    tgabox: false,
    appNowTime: app.signindata.appNowTime,
    ishowaffirm: false,

    c_title: '送拼图',
    c_arrow: true,
    c_backcolor: '#ff6968',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
  },

  dialogClick: function() {
    this.setData({
      ishowsendtwo: false,
      ishowcreate: false,
      ishowhint: false,
      ishowaffirm: false,
    })
  },

  refuse: function() {
    var _this = this
    _this.setData({
      ishowaffirm: false,
    })
  },

  help: function() {
    var _this = this
    _this.setData({
      ishowsendtwo: true,
      ishowaffirm: false,
    })
    _this.jigsaworderinfo();
  },

  savefun: function() {
    var _this = this;
    wx.downloadFile({
      url: _this.data.createimage,
      success: function(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(data) {
            app.showToastC('保存成功')
            _this.dialogClick()
          },
          fail: function(err) {
            // _this.saveImg()
            if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              wx.openSetting({
                success(settingdata) {
                  if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                    _this.savefun()
                  } else {
                  }
                }
              })
            }
          },
        })
      }
    })
  },

  myCatchTouch: function() {
    return;
  },

  helpheadclick: function(w) {
    var _this = this;
    var list = w.currentTarget.dataset.list || w.target.dataset.list;
    var uid = w.currentTarget.dataset.uid || w.target.dataset.uid;
    if (_this.data.helpuid != uid) {
      var defaultList = _this.data.defaultList;
      for (var i = 0; i < _this.data.helpjigsaw.length; i++) {
        var index = _this.data.helpjigsaw[i];
        defaultList[index] = 0;
      }
      for (var i = 0; i < list.length; i++) {
        var index = list[i];
        defaultList[index] = 2;
      }
      _this.setData({
        defaultList: defaultList,
        helpjigsaw: list,
        helpuid: uid,
      })
    } else {
      var defaultList = _this.data.defaultList;
      for (var i = 0; i < _this.data.helpjigsaw.length; i++) {
        var index = _this.data.helpjigsaw[i];
        defaultList[index] = 0;
      }
      _this.setData({
        defaultList: defaultList,
        helpjigsaw: [],
        helpuid: 0,
      })
    }


  },

  lookmore: function(w) {
    var _this = this;
    this.setData({
      help_list: _this.data.jigsawinfo.help_friends,
      ishowmore: false,
    })
  },

  packup: function() {
    var _this = this;
    this.setData({
      // .slice(0, 18)
      help_list: _this.data.jigsawinfo.help_friends,
      ishowmore: true,
    })
  },

  gojigsaw: function() {
    wx.reLaunch({
      url: "/pages/index/index",
    })
  },

  gojigsawDetail: function(w) {
    var order_sn = w.currentTarget.dataset.order_sn || w.target.dataset.order_sn;
    wx.navigateTo({
      url: "../jigsawDetail/jigsawDetail?order_sn=" + order_sn,
    })
  },

  givejigsaw: function() {
    var _this = this;
    _this.setData({
      headhidden: false,
    })
    wx.request({
      url: app.signindata.clwcomurl + 'help',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        source: 4,
        vcode: _this.data.version,
        order_sn: _this.data.order_sn,
      },
      success: function(res) {
        _this.setData({
          headhidden: true,
        })
        if (res.data.ReturnCode == 200) {
          app.showToastC("恭喜您，赠送拼图碎片成功啦")
          _this.setData({
            help_ratio: res.data.Info.help_ratio,
            help_num: res.data.Info.help_num,
          })
          _this.jigsaworderinfo();
        } else {
          app.showToastC(res.data.Msg)
        }

      },
    })
  },

  helpuserclick: function() {
    var _this = this;
    _this.setData({
      headhidden: false,
    })

    wx.request({
      url: app.signindata.clwcomurl + 'helpuserclick',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        source: 4,
        vcode: _this.data.version,
        order_sn: _this.data.order_sn,
      },
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          if (res.data.Info.is_jigsaw != '-1') {
            _this.setData({
              // ishowsendtwo: true,
              ishowaffirm: true,
              dialoginfo: res.data.Info,
            })
          }
          if (res.data.Info.is_jigsaw == 0 || res.data.Info.is_buck == 1) {
            _this.setData({
              ishowsendone: true,
            })
          } else {
            _this.setData({
              ishowsendone: false,
            })
          }
        }
      },
      complete: function() {
        _this.setData({
          headhidden: true,
        })
        // _this.jigsaworderinfo();
      },
    })
  },

  orderClick: function() {
    this.dialogClick();
    var _this = this;
    if (_this.data.dialoginfo.goldcoin_status != 1) {
      _this.setData({
        ishowhint: true,
        ishowsendtwo: false,
      })
      return;
    }
    _this.setData({
      headhidden: false,
    })
    wx.request({
      url: app.signindata.clwcomurl + 'perPay',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        source: 4,
        vcode: _this.data.version,
        address_id: '',
        province: '',
        city: '',
        district: '',
        address: '',
        consignee: '',
        idcard: '',
        tel: '',
        number: '',
        quota: '',
        price: '',
        goods_id: _this.data.dialoginfo.goods_id,
        blessing: '',
        sale_type: _this.data.dialoginfo.sale_type,
        is_spelling: _this.data.dialoginfo.is_spelling,
        launch: 'meichai',
        acknowledge_num: _this.data.dialoginfo.acknowledge_num,
      },
      complete: function() {},
      success: function(res) {
        _this.setData({
          ishowpay: false,
        })
        if (res.data.ReturnCode == 200) {
          _this.mCreateImg(res.data.Info.order.orderSn);
        } else {
          _this.setData({
            headhidden: true,
          })
          app.showToastC(res.data.Msg)
        }
      },
    })
  },

  mCreateImg: function(order_sn) {
    var _this = this;
    _this.setData({
      headhidden: false,
    })
    wx.request({
      url: app.signindata.clwcomurl + 'spellingImg',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        source: 4,
        vcode: _this.data.version,
        order_sn: order_sn,
      },
      complete: function() {
        _this.setData({
          headhidden: true,
        })
      },
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            createimage: res.data.Info.path,
            ishowcreate: true,
            ishowsendtwo: false,
          })
        } else {
          app.showToastC(res.data.Msg)
        }
      },
    })
  },

  gosignin: function() {
    this.dialogClick();
    wx.navigateTo({ //签到
      url: "/page/component/pages/newsignin/newsignin"
    });
  },

  golist: function() {
    this.dialogClick();
    wx.navigateTo({ //列表
      url: "../jigsawList/jigsawList"
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var options = options || {};
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,

    });
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      if (scene) {
        _this.setData({
          order_sn: scene,
        })
      };
    } else {
      _this.setData({
        order_sn: options.order_sn || '',
      })
    }
    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        if (true) {
          // '已经授权'
          _this.setData({
            loginid: app.signindata.loginid,
            uid: app.signindata.uid,
            openid: app.signindata.openid,
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this)
          }
        } else {
          // 跳转获取权限页面
          // wx.navigateTo({
          //   url: "../../../../pages/signin/signin"
          // })
          app.userstatistics(19);
          _this.setData({
            tgabox: true
          });
          _this.onLoadfun();
        }
      }
    });
    // _this.onLoadfun();

    this.setData({
      statusBarHeight: wx.getStorageSync('statusBarHeight'),
      titleBarHeight: wx.getStorageSync('titleBarHeight')
    })


  },
  // 授权点击统计
  clicktga: function() {
    app.clicktga(2)
  },
  userInfoHandler: function(e) {
    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        if (true) {
          // 确认授权用户统计
          app.clicktga(4);
          _this.setData({
            tgabox: false
          });
          // '已经授权'
          _this.setData({
            loginid: app.signindata.loginid,
            uid: app.signindata.uid,
            openid: app.signindata.openid,
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
    if (e.detail.userInfo) {} else {
      app.clicktga(8) //用户按了拒绝按钮
    };

  },
  onLoadfun: function() {
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
    });
    
    _this.jigsaworderinfo();
    _this.helpuserclick();
    _this.recommendList(1);

    _this.setData({
      imageWidth: wx.getSystemInfoSync().windowWidth,
    })

    wx.hideShareMenu();
    this.selectComponent("#hide").getappData()
  },

  jigsaworderinfo: function() {
    var _this = this;
    _this.setData({
      headhidden: false,
    })
    wx.request({
      url: app.signindata.clwcomurl + 'jigsaworderinfo',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        source: 4,
        vcode: _this.data.version,
        order_sn: _this.data.order_sn,
      },
      success: function(res) {
        _this.setData({
          headhidden: true,
        })
        if (res.data.ReturnCode == 200) {
          _this.setData({
            jigsawinfo: res.data.Info,
            order_sn: res.data.Info.order_sn,
            shareinfo: res.data.Info.share,
            help_num: res.data.Info.help_num,
            row: Math.sqrt(res.data.Info.quick_num),
            // viewWidth: (wx.getSystemInfoSync().windowWidth * 0.8) / Math.sqrt(res.data.Info.quick_num),
            help_list: res.data.Info.help_friends,
          })

          if (res.data.Info.is_configure == 1) {
            _this.setData({
              viewWidth: (wx.getSystemInfoSync().windowWidth * 0.8) / res.data.Info.jigsaw_length,
            })
          } else {
            _this.setData({
              viewWidth: (wx.getSystemInfoSync().windowWidth * 0.8) / Math.sqrt(res.data.Info.quick_num),
            })
          }


          var defaultList = [];
          for (var i = 0; i < res.data.Info.quick_num; i++) {
            defaultList.push(1); //暗
          }
          for (var i = 0; i < res.data.Info.ratio.length; i++) {
            var index = res.data.Info.ratio[i];
            defaultList[index] = 0; //亮
          }
          _this.setData({
            defaultList: defaultList,
          })
          var nowtime = Date.parse(new Date()) / 1000;
          if (res.data.Info.overtime > nowtime && res.data.Info.status == 1) {
            _this.setData({
              ishowclock: true,
            })
            var interval = setInterval(function() {
              //将时间传如 调用
              var clock = dateformat(res.data.Info.overtime);
              if (clock <= 0) {
                _this.setData({ //倒计时结束隐藏按钮      
                  ishowclock: false,
                });
                // _this.jigsaworderinfo();
              }
              _this.setData({ //正常倒计时        
                clock: clock
              });
            }.bind(_this), 1000);

          } else {
            _this.setData({
              ishowclock: false,
            })
          }
        } else {
          app.showToastC(res.data.Msg)
        }

      },
    })
  },

  recommendList: function(page) {
    var _this = this;

    wx.request({
      url: app.signindata.clwcomurl + 'jigsawlist',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        source: 4,
        vcode: _this.data.version,
        page: page,
        more: "more",
        launch: 'meichai',
      },
      success: function(res) {
        wx.stopPullDownRefresh();
        if (res.data.ReturnCode == 200) {
          if (page == 1) {
            _this.setData({
              recommend_list: res.data.List,
            })
          } else {
            var l = _this.data.recommend_list.concat(res.data.List);
            _this.setData({
              recommend_list: l,
            })
          }
        }
      }
    })
  },

  jumpDetail: function(w) {
    setTimeout(function() {
      var id = w.currentTarget.dataset.id || w.target.dataset.id;
      var meichai_jigsaw = w.currentTarget.dataset.meichai_jigsaw || w.target.dataset.meichai_jigsaw;
      if (meichai_jigsaw == 1) {
        wx.navigateTo({
          url: "../jigsawDetail/jigsawDetail?goods_id=" + id,
        })
      } else {
        wx.navigateToMiniProgram({
          appId: 'wxfe253b7309e29868',
          path: "/pages/jigsawDetail/jigsawDetail?goods_id=" + id,
          extraData: {
            foo: 'bar'
          },
          envVersion: 'release',
          success(res) {
            // 打开成功
          }
        })
      }
    }, 100);
  },

  createImg: function() {
    var _this = this;
    _this.setData({
      headhidden: false,
    })
    wx.request({
      url: app.signindata.clwcomurl + 'spellingImg',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        source: 4,
        vcode: _this.data.version,
        order_sn: _this.data.order_sn,
      },
      complete: function() {
        _this.setData({
          headhidden: true,
        })
      },
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            createimage: res.data.Info.path,
            ishowcreate: true,
          })
        } else {
          app.showToastC(res.data.Msg)
        }
      },
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      page: 1,
    })
    this.jigsaworderinfo();
    this.recommendList(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var page = this.data.page + 1;
    this.setData({
      page: page,
    })
    this.recommendList(page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(ops) {
    var _this = this;
    if (ops.from == 'button') {
      var mtype = ops.target.dataset.mtype;
      if (mtype == 'other') {
        var share = {
          title: _this.data.dialoginfo.share.title,
          path: 'page/component/pages/getjigsaw/getjigsaw?order_sn=' + _this.data.dialoginfo.share.order_sn,
          imageUrl: _this.data.dialoginfo.share.cover,
          success: function(res) {

          }
        }
      } else {
        var share = {
          title: _this.data.shareinfo.title,
          path: 'page/component/pages/getjigsaw/getjigsaw?order_sn=' + _this.data.order_sn,
          imageUrl: _this.data.shareinfo.cover,
          success: function(res) {

          }
        }
      }
    } else {
      var share = {
        title: _this.data.shareinfo.title,
        path: 'page/component/pages/getjigsaw/getjigsaw?order_sn=' + _this.data.order_sn,
        imageUrl: _this.data.shareinfo.cover,
        success: function(res) {

        }
      }
    }
    return share;
  },
})

// 时间格式化输出，将时间戳转为 倒计时时间
function dateformat(micro_second) {

  var timestamp = Date.parse(new Date())
  //总的秒数 
  var second = micro_second - (timestamp / 1000);
  if (second > 0) {
    // 天位    
    var day = Math.floor(second / 3600 / 24);
    var dayStr = day.toString();
    if (dayStr.length == 1) dayStr = '0' + dayStr;

    // 小时位 
    var hr = Math.floor(second / 3600 % 24);
    // var hr = Math.floor(second / 3600); //直接转为小时 没有天 超过1天为24小时以上
    var hrStr = hr.toString();
    if (hrStr.length == 1) hrStr = '0' + hrStr;

    // 分钟位  
    var min = Math.floor(second / 60 % 60);
    var minStr = min.toString();
    if (minStr.length == 1) minStr = '0' + minStr;

    // 秒位  
    var sec = Math.floor(second % 60);
    var secStr = sec.toString();
    if (secStr.length == 1) secStr = '0' + secStr;
    if (day == 0) {
      return hrStr + ":" + minStr + ":" + secStr;
    } else {
      return dayStr + "天" + hrStr + ":" + minStr + ":" + secStr;
    }
  } else {
    return 0;
  }

}

function cleanSpelChar(localData) {
  var noiseChar = "~!@#$%^&*()_+-=`[]{};':\"\\|,./<>?\n\r";
  var goodChar = "～！＠＃＄％＾＆＊（）＿＋－＝｀［］｛｝；＇：＂＼｜，．／＜＞？　　";
  for (var i = 0; i < noiseChar.length; i++) {
    var oneChar = noiseChar.charAt(i);
    var towChar = goodChar.charAt(i)
    while (localData.indexOf(oneChar) >= 0) {
      localData = localData.replace(oneChar, towChar)
    }
  }
  return localData;

}