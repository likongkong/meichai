// page/component//pages/mingbox/mingbox.js
var Dec = require('../../../../common/public.js'); //aes加密解密js
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

    // 晒单数量
    dryinglistnum: 0,
    shopnum: 0,

    images: [],

    list: [],

    marginw: 0,
    imgw: 0,

    percent: 0,

    ishowrule: false,

    animation: "",

    infoActivity: '',

    infoGoods: '',

    dayStr: 0,
    hrStr: "00",
    minStr: "00",
    secStr: "00",

    tipnum: -1,
    mtip: -1,

    timer: '',
    atimer: '',
    tiptimer: '',

    rednum: 0,
    bluenum: 0,

    timout: '',

    ishowlist: true,

    ishowvideo: false,
    videoContext: '',

    isorder: false,

    payprice: 0,

    bottomtext: "先挑选一款喜欢的吧",

    wxnum: '',

    tipbacktwo: false,
    buybombsimmediately: false,
    receivingaddress: false,
    pricedetailc: false,
    freight: "",
    tipaid: "",
    addressdata: "",
    tipaddress: "",
    receivingaddress: "",
    desc: '',
    cart_id: '',

    imgleft: 0,
    imgleftselect: 0,

    linenum: 0,

    snapshot: '',

    bottomtop: 0,

    navbtn: 0,

    ishowsusp: false,

    pid: 0,

    recommendlist: [],

    c_title: '原价拆明盒',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),

    combinatorialLists: [],
    giftInfo: {},
    // 方便数据处理 勿删
    addsharec: [],
    havephoneiftr: false,
    referee: 0,
    quemarkimg: 'https://clw.51chaidan.com/images/goods/Doubt.png',
    ifpurch: true,
    giftInfogNumber: 1,

    id: 0,
    gid: 0,
    pushWay: 0,
    windowHeight: app.signindata.windowHeight - 65 - wx.getStorageSync('statusBarHeightMc') || 0,
    signinlayer: false,

    ishowtempChance: false,
    perspcardiftrmin: false,
    tempChance: "",
    // 倒计时时间戳
    perspcardata: '',
    // 倒计时展示数据
    percountdown: '',
    // 倒计时
    countdowntime: '',
    is_share: false
  },

  // 获取手机号
  getPhoneNumber: function(e) {
    var _this = this;
    if (e.detail.errMsg == 'getPhoneNumber: ok' || e.detail.errMsg == "getPhoneNumber:ok") {
      wx.login({
        success: function(res) {
          if (res.code) {
            _this.helpOther(res.code, e.detail.encryptedData, e.detail.iv)
          };
        }
      });
    } else {
      app.showToastC('获取手机号失败！');
      _this.setData({
        havephoneiftr: true
      })
    }
  },
  helpOther: function(code, encryptedData, iv) {
    var _this = this;
    var turndata = {
      uid: _this.data.uid,
      loginid: _this.data.loginid,
      code: code,
      encryptedData: encryptedData,
      iv: iv,
      callingAddress: 1
    };
    wx.showLoading({
      title: '加载中...',
    });
    var q1 = Dec.Aese('mod=showBox&operation=checkMobile&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id + '&iv=' + iv + '&encryptedData=' + encryptedData + '&code=' + code);

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        _this.setData({
          havephoneiftr: false
        });
        app.signindata.isNewer = false;
        wx.hideLoading()
      },

      fail: function(res) {
        wx.stopPullDownRefresh();
        wx.hideLoading()
      }
    })
  },

  // 跳转详情页 
  addressmanagement: function(event) {
    var gid = event.currentTarget.dataset.gid || event.target.dataset.gid;
    setTimeout(function() {
      wx.navigateTo({
        url: "/pages/detailspage/detailspage?gid=" + gid
      })
    }, 100);
  },
  showrule: function() {
    var _this = this

    wx.navigateTo({
      url: "/page/component/pages/webview/webview?webview=https://www.51chaidan.com/notice/strategyShowBox.html",
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    app.signindata.referee = options.referee || 0;
    app.signindata.activity_id = options.id || 0;


    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.data.gid = options.gid || 0;
    _this.data.id = options.id || 0;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      avatarUrl: app.signindata.avatarUrl,
      referee: options.referee || 0,
      is_share: options.referee ? true : false
    });
    wx.showLoading({
      title: '加载中...',
    })
    _this.data.pushWay = options.pushWay || 0;

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
            signinlayer: true,
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this)
          }
        } else {
          wx.hideLoading()
          app.userstatistics(25);
          _this.setData({
            tgabox: true
          });
          _this.onLoadfun();
          this.setData({
            signinlayer: false,
          })
        }
      }
    });

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
            signinlayer: true,
          });
          // '已经授权'
          _this.data.loginid = app.signindata.loginid,
            _this.data.openid = app.signindata.openid,
            _this.setData({
              uid: app.signindata.uid,
              avatarUrl: app.signindata.avatarUrl,
              isProduce: app.signindata.isProduce,
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
    _this.data.perspcardata = app.signindata.perspcardata || '';
    _this.setData({
      uid: app.signindata.uid,
      avatarUrl: app.signindata.avatarUrl,
      isProduce: app.signindata.isProduce,
    });

    _this.getinfo()

    setTimeout(function() {
      _this.getdefault()
    }, 1000)
    if (app.signindata.isNewer && _this.data.referee) {
      _this.setData({
        havephoneiftr: true
      });
    };
    
    if (_this.data.perspcardata) {
      _this.setData({
        perspcardiftrmin: true
      });
      app.countdowntime(_this, _this.data.perspcardata)
    };
    // 云统计
    var clouddata = { act_id: _this.data.id, type: 0 };
    app.cloudstatistics('activityStatistics', clouddata )

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
    // 统计推送进入
    if (_this.data.pushWay > 0) {
      app.pushfun(_this);
    }
  },

  getinfo: function() {
    var _this = this
    wx.showLoading({
      title: '加载中...',
    });

    var q1 = Dec.Aese('mod=showBox&operation=info&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&gid=' + _this.data.gid + '&id=' + _this.data.id);



    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },

      success: function(res) {
        wx.stopPullDownRefresh();
        wx.stopPullDownRefresh()
        if (res.data.ReturnCode == 200) {

          clearInterval(_this.data.timer)
          clearTimeout(_this.data.timout)
          _this.data.timer = setInterval(function() {
            //将时间传如 调用 
            _this.dateformat(res.data.Info.infoActivity.stop_time);
          }.bind(_this), 1000);

          var iftrshare = res.data.Info.isShare;
          if (!iftrshare){
            wx.hideShareMenu();
          };
          var rdlc = res.data.List.combinatorialLists || [];
          var ifpurch = true; // 是否购买过 true 购买过 false 没购买过
          if (rdlc.length == 0) { // 1 红  2 蓝
            rdlc.push([{
              type: 1,
              img: _this.data.quemarkimg
            }, {
              type: 2,
              img: _this.data.quemarkimg
            }]);
            ifpurch = false;
          };
          var totalNumber = res.data.Info.giftInfo.totalNumber || 0;
          var invitationUserInfo = res.data.Info.giftInfo.invitationUserInfo || [];
          var numw = parseInt(totalNumber) - parseInt(invitationUserInfo.length);
          var addsharec = [];
          if (numw > 0) {
            for (var n = 0; n < numw; n++) {
              addsharec.push('');
            };
          };
          _this.setData({
            id: res.data.Info.infoActivity.id,
            infoActivity: res.data.Info.infoActivity,
            infoGoods: res.data.Info.infoGoods,
            list: res.data.List.listRole || [],
            ishowlist: true,
            isorder: false,
            bottomtext: "先挑选一款喜欢的吧",
            combinatorialLists: res.data.List.combinatorialLists || [],
            giftInfo: res.data.Info.giftInfo || {},
            giftInfogNumber: res.data.Info.giftInfo.gNumber ? res.data.Info.giftInfo.gNumber : 1,
            ifpurch: ifpurch,
            addsharec: addsharec,
            discountAmount: res.data.Info.discountAmount || 0,
            superpositionTime: res.data.Info.superpositionTime ? res.data.Info.superpositionTime : "",
          })
          _this.initview()

          _this.data.timout = setTimeout(function() {
            _this.data.videoContext = wx.createVideoContext('myVideo') //初始化视频组件
            _this.nextpagediao()
            _this.getimginfolist()

          }, 500) //延迟时间 这里是1秒
        }
        // wx.hideLoading()
      },

      fail: function(res) {
        wx.stopPullDownRefresh();
        wx.hideLoading()
      }

    })
  },

  initview: function() {

    var _this = this
    if (_this.data.list.length == 4) {
      _this.setData({
        percent: 50,
        linenum: _this.data.list.length / 2,
      })
    } else if ((_this.data.list.length % 3) == 0) {
      _this.setData({
        percent: 33,
        linenum: _this.data.list.length / 2,
      })
    } else if ((_this.data.list.length % 4) == 0) {
      _this.setData({
        percent: 25,
        linenum: _this.data.list.length / 2,
      })
    } else if ((_this.data.list.length % 5) == 0) {
      _this.setData({
        percent: 20,
        linenum: _this.data.list.length / 2,
      })
    }
    //创建节点选择器
    var img = wx.createSelectorQuery();
    //选择id
    img.select('#img0').boundingClientRect();
    img.exec(function(resi) {
      if (resi && resi[0]) {
        _this.setData({
          // marginw: (resi[0].width / 3) * 4,
          marginw: resi[0].height,
          imgw: resi[0].width,
          imgleft: (resi[0].width / 10),
          imgleftselect: (resi[0].width / 10) - 5,
        })
      }
    })

    setTimeout(function() {
      _this.judgeSuspend()
      _this.setData({
        pid: 0,
      })
      _this.getrecommendlist(0)
      wx.hideLoading()
    }, 1200)

    _this.animation = wx.createAnimation({
      // 动画持续时间，单位ms，默认值 400
      duration: 300,
      timingFunction: 'linear',
      // 延迟多长时间开始
      delay: 0,
      transformOrigin: 'center center 0',
      success: function(res) {
      }
    })
    _this.mAnimation() //开启动画

    clearInterval(_this.data.tiptimer)
    this.data.tiptimer = setInterval(function() {
      if (_this.data.list) {
        var num = Math.floor(Math.random() * _this.data.list.length)
        _this.setData({
          tipnum: num,
        })
      }
      if (_this.data.list[num] && _this.data.list[num].tips) {
        var mtip = Math.floor(Math.random() * _this.data.list[num].tips.length)
        _this.setData({
          mtip: mtip
        })
      }

    }.bind(this), 5000)

  },

  judgeSuspend: function() {
    var _this = this
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#bottombtn').boundingClientRect();
    query.exec(function(resa) {

      if (resa && resa[0]) {

        _this.setData({
          bottomtop: resa[0].top,
        })
        //创建节点选择器
        var navbtn = wx.createSelectorQuery();
        //选择id
        navbtn.select('#navbtn').boundingClientRect();
        navbtn.exec(function(resb) {
          if (resb && resb[0]) {

            var judgvalue = resb[0].top - resa[0].height;
            _this.setData({
              navbtn: judgvalue,
            })
            if (resa[0].top > judgvalue) {
              _this.setData({
                ishowsusp: true
              })
            }

          }

        });
      }
    });
  },

  onPageScroll(e) {
    var space = this.data.bottomtop - this.data.navbtn

    if (e.scrollTop > space) {
      this.setData({
        ishowsusp: false
      })
    } else {
      this.setData({
        ishowsusp: true
      })
    }
  },

  mAnimation: function() {
    clearInterval(this.data.atimer)
    this.data.atimer = setInterval(function() {
      this.animation.translate(0, -13).step().translate(0, 0).step().translate(0, -5).step().translate(0, 0).step()
      this.setData({
        //输出动画
        animation: this.animation.export(),
      })
    }.bind(this), 1350)

  },

  rollgoods: function() {
    var _this = this
    var rednum = _this.data.rednum;
    var bluenum = _this.data.bluenum;
    var mtip = 0;
    if (rednum == 0 && bluenum == 0) {
      // 先挑选一款喜欢的吧
      mtip = Math.floor(Math.random() * _this.data.list.length)

    } else if (rednum != 0 && rednum == bluenum) {} else {
      if (rednum > bluenum) {
        mtip = Math.floor(Math.random() * _this.data.infoActivity.relTypeRoleId[1].length) + _this.data.infoActivity.relTypeRoleId[1].length

      } else {
        mtip = Math.floor(Math.random() * _this.data.infoActivity.relTypeRoleId[1].length)
      }
    }

    if (_this.data.list[mtip]) {
      if (_this.data.list[mtip].userId && _this.data.list[mtip].userId != "") {
        _this.rollgoods()
      } else if (_this.data.list[mtip].select != 1) {
        _this.itemClick(mtip, 2)
      } else {
        _this.rollgoods()
      }
    }

  },

  itemClick: function(w, type) {
    var _this = this
    if (_this.data.infoActivity.status == 3) {
      return;
    }
    clearTimeout(_this.data.timout)
    if (type != 2) {
      var index = w.currentTarget.dataset.mindex;
    } else {
      var index = w;
    }
    var arrlist = _this.data.list;
    var rednum = 0;
    var bluenum = 0;
    var roleId = [];

    var arrred = [];
    var arrblue = [];

    if (arrlist[index].select && arrlist[index].select == 1) {
      arrlist[index].select = 0;
    } else {
      arrlist[index].select = 1;
    }
    for (let i = 0; i < arrlist.length; i++) {
      if (arrlist[i].select && arrlist[i].select == 1) {
        if (arrlist[i].type == 1) {
          rednum++;
          arrred.push({
            type: 1,
            img: arrlist[i].img
          });
        } else {
          bluenum++;
          arrblue.push({
            type: 2,
            img: arrlist[i].img
          });
        }
        roleId.push(arrlist[i].roleId)
      }
    }
    if (!_this.data.ifpurch) {
      var combinatorialLists = [];
      var redlength = arrred.length;
      var bluelength = arrblue.length;
      var redblueleng = 0;
      if (redlength > bluelength) {
        redblueleng = redlength;
      } else {
        redblueleng = bluelength;
      };
      redblueleng = redblueleng > 0 ? redblueleng : 1;
      for (var a = 0; a < redblueleng; a++) {
        combinatorialLists.push([{
          type: 1,
          img: (arrred[a] ? arrred[a].img : _this.data.quemarkimg)
        }, {
          type: 2,
          img: (arrblue[a] ? arrblue[a].img : _this.data.quemarkimg)
        }]);
      };
      var giftInfo = _this.data.giftInfo
      if (giftInfo.gImg) {
        giftInfo.gNumber = redblueleng * _this.data.giftInfogNumber;
      };
      _this.setData({
        combinatorialLists: combinatorialLists || [],
        giftInfo: giftInfo
      });
    }
    _this.setData({
      list: arrlist,
      rednum: rednum,
      bluenum: bluenum,
      roleId: roleId,
    })
    if (rednum == 0 && bluenum == 0) {
      _this.setData({
        isorder: false,
        bottomtext: "先挑选一款喜欢的吧"
      })
    } else if (rednum != 0 && rednum == bluenum) {
      _this.setData({
        isorder: true,
        payprice: (_this.data.infoGoods.shop_price * (rednum + bluenum)).toFixed(2)
      })
      // _this.data.timout = setTimeout(function() {
      //   _this.showlist()
      // }, 5000) //延迟时间 这里是1秒
    } else {
      if (rednum > bluenum) {
        _this.setData({
          isorder: false,
          bottomtext: rednum == 1 ? "再选一款蓝色区域的就可以购买了" : "选择" + rednum + "款红色区域的需要搭配" + rednum + "款蓝色区域购买"
        })
      } else {
        _this.setData({
          isorder: false,
          bottomtext: bluenum == 1 ? "再选一款红色区域的就可以购买了" : "选择" + bluenum + "款蓝色区域的需要搭配" + bluenum + "款红色区域购买"
        })
      }
    }

  },

  showlist: function() {
    this.setData({
      ishowlist: !this.data.ishowlist
    })
  },

  // 视屏预览
  previewVideo: function(w) {
    var _this = this
    var url = w.currentTarget.dataset.url;
    _this.setData({
      ishowvideo: true,
      video: url,
    })
    _this.data.videoContext.play()
  },

  closevideo: function() {
    var _this = this
    _this.data.videoContext.pause()
    _this.data.videoContext.stop()
    _this.setData({
      ishowvideo: false,
      // video: "",
    })
  },

  onHide: function() {
    clearInterval(this.data.countdowntime);
  },

  onUnload: function() {
    clearInterval(this.data.timer)
    clearInterval(this.data.atimer)
    clearInterval(this.data.tiptimer)
    clearInterval(this.data.countdowntime);
    if (this.data.videoContext) {
      this.data.videoContext.pause()
      this.data.videoContext.stop()
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getinfo()
    this.setData({
      pid: 0,
    })
    this.getrecommendlist(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var p = this.data.pid + 1;
    this.data.pid = p;
    this.getrecommendlist(p)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(options) {
    var _this = this;
    var share = {
      title: '跟我一起原价拆明盒，官方售后，1件包邮',
      imageUrl: _this.data.snapshot,
      path: "/page/component/pages/mingbox/mingbox?id=" + _this.data.id + '&referee=' + _this.data.uid + '&gid=' + _this.data.gid,
      success: function(res) {}
    }
    return share;
  },


  // 导航跳转
  whomepage: function() {
    setTimeout(function() {
      wx.reLaunch({
        url: "/pages/index/index?judgeprof=2"
      });
    }, 100);
  },

  dlfindfun: function() {
    setTimeout(function() {
      wx.reLaunch({
        url: "/page/component/pages/dlfind/dlfind",
      })
    }, 100);
  },

  // 导航跳转 
  wnews: function() {
    var _this = this;
    setTimeout(function() {
      app.limitlottery(_this);
    }, 100);
  },

  wshoppingCart: function() {
    setTimeout(function() {
      wx.redirectTo({
        url: "/pages/shoppingCart/shoppingCart"
      });
    }, 100);
  },

  wmy: function() {
    app.signindata.iftr_mc = true;
    setTimeout(function() {
      wx.redirectTo({
        url: "/pages/wode/wode"
      });
    }, 40);
  },

  // 时间格式化输出，将时间戳转为 倒计时时间
  dateformat: function(micro_second) {
    var _this = this
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
        //   return hrStr + ":" + minStr + ":" + secStr;
        _this.setData({
          dayStr: 0,
          hrStr: hrStr,
          minStr: minStr,
          secStr: secStr,
        })
      } else {
        _this.setData({
          dayStr: dayStr,
          hrStr: hrStr,
          minStr: minStr,
          secStr: secStr,
        })
        //   return dayStr + "天" + hrStr + ":" + minStr + ":" + secStr;
      }
    } else {
      _this.setData({
        dayStr: 0,
        hrStr: "00",
        minStr: "00",
        secStr: "00",
      })
    }

  },

  // 立即购买弹框
  dsbbbutclickt: function() {
    this.setData({
      tipbacktwo: true,
      buybombsimmediately: true
    });

    this.amountcalculation()

  },

  tipbacktwo: function() {
    this.setData({
      tipbacktwo: false,
      buybombsimmediately: false,
      receivingaddress: false,
    });
  },

  // 收货地址弹框
  seladdressfun: function() {
    this.setData({
      receivingaddress: true,
    });
  },

  // 隐藏收货地址弹框
  receivingaddressfun: function() {
    this.setData({
      receivingaddress: false,
    })
  },

  // 编辑地址
  jumpeditaddress: function(event) {
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
  jumpaddress: function() {
    wx.navigateTo({
      url: "/pages/newreceivingaddress/newreceivingaddress"
    })
  },
  // 阻止蒙层冒泡
  preventD() {},

  pricedetailc: function() { // 价格明细显示隐藏
    this.setData({
      pricedetailc: !this.data.pricedetailc
    })
  },

  // 金额计算
  amountcalculation: function() {
    var _this = this
    // 运费 
    var acc = 0;
    var xianshi = '0.00';
    var freightiftr = '0.00';
    // 商品个数
    var mcnum = parseInt((_this.data.rednum + _this.data.bluenum));
    if ((this.data.defaultinformation.carriage.free || "99") != '-1') {
      var tddefcarfr = parseFloat(this.data.defaultinformation.carriage.free || "99");
      if (mcnum >= parseFloat(this.data.defaultinformation.carriage.freeMCPieces)) {
        if (this.data.defaultinformation.carriage.freeMCPieces == 1) {
          acc = 0;
          freightiftr = 0;
          xianshi = '限时包邮';
        } else {
          acc = 0;
          freightiftr = 0;
          xianshi = '商品包邮';
        };
      } else if (_this.data.payprice >= tddefcarfr) {
        acc = 0;
        freightiftr = 0;
        xianshi = '满￥' + parseFloat(this.data.defaultinformation.carriage.free || "99").toFixed(2) + '包邮';
      } else {
        if (this.data.infoGoods.carriage !== '') {
          var tdzuncar = this.data.infoGoods.carriage;
        } else {
          var tdzuncar = this.data.defaultinformation.carriage.d;
        };
        xianshi = '￥' + parseFloat(tdzuncar).toFixed(2);
        freightiftr = parseFloat(tdzuncar);
        acc = parseFloat(tdzuncar) > parseFloat(this.data.coudata1mon) ? parseFloat(this.data.infoGoods.carriage) - parseFloat(this.data.coudata1mon) : 0;
      };
    } else {
      if (this.data.infoGoods.carriage !== '') {
        var tdzuncar = this.data.infoGoods.carriage;
      } else {
        var tdzuncar = this.data.defaultinformation.carriage.d;
      };
      xianshi = '￥0.00';
      freightiftr = parseFloat(tdzuncar);
      acc = parseFloat(tdzuncar) > parseFloat(this.data.coudata1mon) ? parseFloat(this.data.infoGoods.carriage) - parseFloat(this.data.coudata1mon) : 0;
    };

    this.setData({

      // 运费
      // freight: acc,
      freight: xianshi,
      freightiftr: freightiftr,

    });
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

  // 删除地址
  deladdress: function(event) {
    var _this = this;
    var dat = this.data.addressdata;
    var indid = event.target.dataset.ind;
    var num = '';
    for (var i = 0; i < dat.length; i++) {
      if (dat[i].aid == indid) {
        num = i;
      }
    };
    wx.showModal({
      content: '您确定要删除这个地址吗？',
      success: function(res) {
        if (res.confirm) {
          var q = Dec.Aese('mod=address&operation=delete&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + indid)
          wx.request({
            url: app.signindata.comurl + 'user.php' + q,
            method: 'GET',
            header: {
              'Accept': 'application/json'
            },
            success: function(res) {
              if (res.data.ReturnCode == 200) {
                dat.splice(num, 1);
                _this.setData({
                  addressdata: dat
                });
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
  revisethereceivingaddress: function(w) {
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

  // 买家备注
  inputChange: function(e) {
    this.setData({
      desc: e.detail.value
    });
  },

  // 提交订单
  placeorder: function() {
    var _this = this;
    // 验证地址
    if (this.data.tipaid == '') {
      app.showToastC('请选择地址');
      return false;
    };

    var id = _this.data.infoActivity.id
    var roleId = JSON.stringify(_this.data.roleId).replace("[", "").replace("]", "")
    var aid = _this.data.tipaid;

    // 提交订单蒙层
    _this.setData({
      suboformola: true
    });
    var q = Dec.Aese('mod=showBox&operation=order&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + id + '&roleId=' + roleId + '&aid=' + aid + '&desc=' + _this.data.desc);
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            tipbacktwo: true,
            buybombsimmediately: true,
            receivingaddress: false,
            couponprojectile: false,
            cart_id: res.data.Info.cart_id,
            paymentiftr: false,
            payment: res.data.Info.amount,
            tempChance: res.data.Info.tempChance ? res.data.Info.tempChance : "",
          });
          // 微信支付
          _this.paymentmony()
        } else {
          // 提交订单蒙层
          _this.setData({
            suboformola: false
          });
          app.showToastC(res.data.Msg);
        };
      }
    })
  },



  // 微信支付
  paymentmony: function() {
    var _this = this;
    var q = Dec.Aese('mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + _this.data.cart_id + '&xcx=1' + '&openid=' + _this.data.openid)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          // 支付完成弹框显示数据
          var shareinfo = res.data.Shareinfo;
          var payinfo = res.data.Info;
          if (shareinfo) {
            for (var f = 0; f < shareinfo.length; f++) {
              if (!app.signindata.reg.test(shareinfo[f].img)) {
                shareinfo[f].img = _this.data.zdyurl + shareinfo[f].img;
              };
              shareinfo[f].name = shareinfo[f].name.replace(/\\n/g, '\n');
            };
            _this.setData({
              shareinfo: shareinfo
            });
          };
          _this.data.subscribedata = res.data.Info.subscribe || '' 
          wx.requestPayment({
            'timeStamp': res.data.Info.timeStamp.toString(),
            'nonceStr': res.data.Info.nonceStr,
            'package': res.data.Info.package,
            'signType': 'MD5',
            'paySign': res.data.Info.paySign,
            'success': function(res) {
              _this.setData({
                tipbacktwo: false,
                buybombsimmediately: false,
                tipback: false,
                tipbox: false,
                dsbframeiftr: false,
                paymentiftr: false,
                paymentcompletionwiftr: true,
                // 优惠券清空
                tipcoupon: '请选择优惠券',
                coudata1cid: '',
                coudata1mon: '0.00',
                coudata2cid: '',
                coudata2mon: '0.00',
                //  分享判断是否支付成功
                payiftr: true,
                numberofdismantling: 1,
                //  活动支付完成隐藏弹框
                combinationt: false,
                combdsbframeiftr: false, // 活动组合弹框 
                suboformola: false,
                desc: ''
              });
              // 订阅授权
              app.comsubscribe(_this);

              var cart_id = _this.data.cart_id || '0';

              _this.getinfo()

              if (payinfo.isFreeBuyOrder) {
                wx.navigateTo({
                  url: "/page/component/pages/hidefun/hidefun?type=1&cart_id=" + _this.data.cart_id
                });
              } else {
                app.showToastC('购买成功');
              }

              if (_this.data.tempChance) {
                _this.setData({
                  ishowtempChance: true,
                })
                app.signindata.perspcardata = _this.data.tempChance.overtime;
                _this.data.perspcardata = _this.data.tempChance.overtime;
              }
            },
            'fail': function(res) {
              _this.setData({
                tipback: false,
                tipbox: false,
                tipbacktwo: false,
                buybombsimmediately: false,
                dsbframeiftr: false,
                paymentiftr: false,
                // 优惠券清空
                tipcoupon: '请选择优惠券',
                coudata1cid: '',
                coudata1mon: '0.00',
                coudata2cid: '',
                coudata2mon: '0.00',
                //  分享判断是否支付成功
                payiftr: false,
                numberofdismantling: 1,
                //  活动支付完成隐藏弹框
                combinationt: false,
                combdsbframeiftr: false, // 活动组合弹框
                suboformola: false,
                desc: ''
              })
            },
            'complete': function(res) {
              // 订阅授权

            }
          })
        } else {
          // 提交订单蒙层
          _this.setData({
            suboformola: false
          });
          if (res.data.ReturnCode == 800) {
            app.showToastC('非该用户订单');
          };
          if (res.data.ReturnCode == 815) {
            app.showToastC('订单状态错误');
          };
          if (res.data.ReturnCode == 816) {
            app.showToastC('不支持的支付类型');
          };
          if (res.data.ReturnCode == 817) {
            app.showToastC('付款明细已生成');
          };
          if (res.data.ReturnCode == 201) {
            app.showToastC('微信预支付失败');
          };
          if (res.data.ReturnCode == 805) {
            app.showToastC('剩余库存不足');
          };
          // 判断非200和登录
          Dec.comiftrsign(_this, res, app);
        };
      }
    })
  },

  getimginfolist: function() {
    var _this = this
    var mlist = _this.data.list
    for (let i = 0; i < mlist.length; i++) {
      if (mlist[i].userId != "") {
        wx.getImageInfo({
          src: mlist[i].headphoto,
          success: function(head) {
            mlist[i].localhead = head.path
            if (i == mlist.length - 1) {
              _this.setData({
                list: mlist,
              })
              _this.getSnapshot()
            }
          },
          fail: function(res) {
            mlist[i].localhead = ""
            if (i == mlist.length - 1) {
              _this.setData({
                list: mlist,
              })
              _this.getSnapshot()
            }
          }
        })
      } else if (i == mlist.length - 1) {
        mlist[i].localhead = ""
        _this.setData({
          list: mlist,
        })
        _this.getSnapshot()
      }

    }
  },

  /**
   * 生成截图
   */
  getSnapshot: function() {
    var _this = this;
    const ctx = wx.createCanvasContext('snapshot')
    let dw = 300
    let dh = 180
    let recwidth = _this.data.linenum >= 4 ? (300 / _this.data.linenum) : (300 / 4);
    let imgwidth = recwidth * 0.8
    let marginleft = recwidth * 0.1
    let imgpro = _this.data.infoActivity.radioHW
    let imgheight = imgwidth * _this.data.infoActivity.radioHW
    let forwidth = 0;
    let forheight = 0;
    let left = 0;

    if (imgheight > (180 * 0.44)) {
      var e = (180 * 0.44) / imgheight
      marginleft = marginleft * e
      recwidth = recwidth * e
      var w = (recwidth * _this.data.linenum)
      left = (300 - w) / 2
      imgheight = 180 * 0.44
    }

    var name = _this.data.infoActivity.name;
    var unpackRole = _this.data.infoActivity.unpackRole;
    var totalRole = _this.data.infoActivity.totalRole;

    wx.getImageInfo({
      src: "https://www.51chaidan.com/images/mingbox/" + _this.data.id + ".jpg",

      success: function(head) {
        ctx.drawImage(head.path, 0, 0, dw, 240)

        for (let i = 0; i < _this.data.linenum * 2; i++) {

          if (i < _this.data.linenum) {
            if (_this.data.linenum >= 4) {
              forwidth = i * recwidth + left
            } else {
              forwidth = i * recwidth + (300 - recwidth * _this.data.linenum) / 2
            }
            forheight = 0
          } else {
            if (_this.data.linenum >= 4) {
              forwidth = (i - _this.data.linenum) * recwidth + left
            } else {
              forwidth = (i - _this.data.linenum) * recwidth + (300 - recwidth * _this.data.linenum) / 2
            }
            forheight = imgheight + 18
          }

          if (_this.data.list[i].userId != "") {
            ctx.fillStyle = _this.data.list[i].type == 1 ? '#FE666B' : '#546DF3';
            ctx.fillRect(marginleft * 3 - 1 + forwidth, imgheight * 0.8 - 1 + forheight, marginleft * 4 + 2, 12)

            ctx.fillStyle = '#fff';
            ctx.fillRect(marginleft * 3 + forwidth, imgheight * 0.8 + forheight, marginleft * 4, 10)

            ctx.fillStyle = _this.data.list[i].type == 1 ? '#FE666B' : '#546DF3';
            ctx.setFontSize(7)
            ctx.fillText("已拆", marginleft * 4 + forwidth, imgheight * 0.8 + 7 + forheight)

            if (_this.data.list[i].localhead && _this.data.list[i].localhead != "") {
              //绘制圆头像
              ctx.save();
              ctx.beginPath(); //开始绘制
              ctx.arc(marginleft * 2.5 + forwidth, imgheight * 0.8 + 4 + forheight, 7, 0, Math.PI * 2, false);
              ctx.clip();
              ctx.drawImage(_this.data.list[i].localhead, marginleft * 2.5 - 7 + forwidth, imgheight * 0.8 - 3 + forheight, 14, 14)
              ctx.restore();
            }

          }

          if (i == _this.data.linenum * 2 - 1) {
            ctx.fillStyle = '#FE666B'
            ctx.setFontSize(15)
            ctx.fillText(_this.data.infoGoods.shop_price + "元", marginleft, 230)
            let textwidth = ctx.measureText(_this.data.infoGoods.shop_price + "元").width
            ctx.fillStyle = '#000'
            ctx.setFontSize(12)
            ctx.fillText(name + "（完成度" + unpackRole + "/" + totalRole + "）", marginleft + textwidth, 231)
            ctx.draw(true, setTimeout(function() {
              wx.canvasToTempFilePath({
                canvasId: 'snapshot',
                success: function(res) {
                  _this.setData({
                    snapshot: res.tempFilePath
                  })
                  return;
                },
                fail: function(res) {
                  return;
                },
              });
            }, 300));
          }

        }
      },
      fail: function(res) {}
    })

  },

  getrecommendlist: function(pid) {
    var _this = this
    wx.showLoading({
      title: '加载中...',
    })
    var q1 = Dec.Aese('mod=showBox&operation=list&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + "&pid=" + pid);

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },

      success: function(res) {
        wx.stopPullDownRefresh();
        wx.stopPullDownRefresh()
        if (res.data.ReturnCode == 200) {
          var mlist = res.data.List.activity
          for (let i = 0; i < mlist.length; i++) {
            mlist[i].stopdate = formatTimeTwo(mlist[i].stop_time, 'M.D h:m')
          }
          if (pid == 0 && mlist.length > 0) {
            _this.setData({
              recommendlist: mlist,
            })
          } else if (mlist.length > 0) {
            mlist = _this.data.list.concat(mlist)
            _this.setData({
              recommendlist: mlist,
            })
          } else {
            _this.setData({
              pid: pid - 1,
            })
          }
        }
        wx.hideLoading()
      },

      fail: function(res) {
        wx.stopPullDownRefresh();
        wx.hideLoading()
      }

    })
  },

  jumpdetail: function(w) {
    var gid = w.currentTarget.dataset.gid;
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    wx.redirectTo({
      url: "/page/component/pages/mingbox/mingbox?gid=" + gid + '&id=' + id,
    });
  },

  pullupsignin: function() {
    // // '没有授权'
    this.setData({
      tgabox: true
    });
  },

  atOnceUse: function() {
    wx.redirectTo({
      url: "/pages/smokeboxlist/smokeboxlist",
    });
  },

  closetempChance: function() {
    var _this = this
    _this.setData({
      ishowtempChance: false,
    })
    if (_this.data.perspcardata) {
      _this.setData({
        perspcardiftrmin: true
      });
      app.countdowntime(_this, _this.data.perspcardata)
    };
  }

})


/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
 */
function formatTimeTwo(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}