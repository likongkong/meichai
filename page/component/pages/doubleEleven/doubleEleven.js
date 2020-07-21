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
    c_title: '',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    windowHeight: app.signindata.windowHeight - 65 - wx.getStorageSync('statusBarHeightMc') || 0,
    pid: 0,
    awardimg: "",
    roleName: "",
    ishowawardpop: false,
    ishowawardrule: false,
    ishowlesschance: false,
    ishowaddressNo: false,
    ishowagainroll: false,
    aid: 0,
    addressinfo: '',
    tipbacktwo: false,
    isNoOnce: false,
    mpid: 0,
    // 明盒最大页数
    mmaxPage: 1,
    bpid: 0,
    // 盲盒最大页数
    bmaxPage: 1,
    msdata: [],
    bsdata: [],
    oid: 0,
    currenChance: 0,
    // 晒单数量
    dryinglistnum: 0,
    shopnum: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      app.signindata.referee = _this.getSearchString('referee', scene) || 0;
    } else {
      app.signindata.referee = options.referee || 0;
    }

    // 推送统计
    _this.data.push_id = options.push_id || 0;

    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      avatarUrl: app.signindata.avatarUrl,
      aid: app.signindata.aid,
      addressinfo: app.signindata.addressinfo,
    })
    wx.showLoading({
      title: '加载中...',
    })
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
                aid: app.signindata.aid,
                addressinfo: app.signindata.addressinfo,
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
            signinlayer: true,
          });
          // '已经授权'
          _this.data.loginid = app.signindata.loginid,
            _this.data.openid = app.signindata.openid,
            _this.setData({
              uid: app.signindata.uid,
              avatarUrl: app.signindata.avatarUrl,
              isProduce: app.signindata.isProduce,
              aid: app.signindata.aid,
              addressinfo: app.signindata.addressinfo,
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
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      avatarUrl: app.signindata.avatarUrl,
      aid: app.signindata.aid,
      addressinfo: app.signindata.addressinfo,
    });
    wx.hideLoading();
    _this.getInfo();
    _this.getRecord(_this.data.pid);
    this.mswiperRequest(1);
    this.bswiperRequest(1);
    // 调取晒单数量
    Dec.dryingSum(_this, app.signindata.clwcomurl);
    // 购物车数据显示
    Dec.shopnum(_this,app.signindata.comurl);
    _this.nextpagediao();
  },
  getInfo: function() {
    var _this = this;
    var q1 = Dec.Aese('mod=automat&operation=getInfo' + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid+ '&push_id='+_this.data.push_id);
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        _this.data.push_id =  0;
        if (res.data.Info) {
          _this.setData({
            title: res.data.Info.title,
            isNoOnce: false,
            totalMoney: res.data.Info.totalMoney ? res.data.Info.totalMoney : "",
            currenChance: res.data.Info.currenChance || 0,
            ticketPrice: res.data.Info.ticketPrice || "",
            alert: res.data.Info.description.alert,
            display: res.data.Info.description.display,
            c_title: res.data.Info.title ? res.data.Info.title : "家里有矿 1直买1直送",
            nochanceNotice: res.data.Info.description.nochanceNotice ? res.data.Info.description.nochanceNotice : "",
          })
        }
      },
      fail: function() {wx.hideLoading()}
    })
  },
  getRecord: function(pid) {
    var _this = this;
    wx.showLoading({title: '加载中...',})
    var q1 = Dec.Aese('mod=automat&operation=getRecord' + '&pid=' + pid);
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        wx.stopPullDownRefresh();
        wx.hideLoading()
        if (pid == 0 && res.data.List) {
          _this.setData({
            recordList: res.data.List.record ? res.data.List.record : [],
          })
        } else if (res.data.List && res.data.List.record && res.data.List.record.length > 0 && typeof (res.data.List.record) != "undefined") {
          var l = _this.data.recordList.concat(res.data.List.record);
          _this.setData({
            recordList: l,
          })
        } else {
          var p = pid - 1;
          _this.setData({
            pid: p,
          })
        }
      },
      fail: function() {wx.hideLoading()}
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
      header: {'Accept': 'application/json'},
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          var rdl = res.data.List;
          var tptipadi = '';
          var tptipadd = '';
          if (rdl.length != 0) {
            for (var i = 0; i < rdl.length; i++) {
              if (rdl[i].isdefault == 1) {
                rdl[i].checked = true;
                tptipadi = rdl[i].aid;
                tptipadd = rdl[i].address;
              } else {
                rdl[i].checked = false;
              }
            };
            _this.data.tipaid = tptipadi;
            _this.setData({
              addressdata: rdl,
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
  onShow: function() {
    var _this = this;
    if (_this.data.isNoOnce) {
      _this.getInfo();
      _this.data.pid = 0;
      _this.getRecord(0);
      _this.nextpagediao();
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var _this = this
    _this.setData({
      pid: 0,
    })
    _this.getRecord(0);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var _this = this;
    var p = _this.data.pid + 1;
    _this.setData({
      pid: p,
    })
    _this.getRecord(p);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var _this = this;
    var share = {
      title: "家里有矿 1直买1直送",
      imageUrl: "https://www.51chaidan.com/images/turntable/share.jpg",
      success: function(res) {}
    }
    return share;
  },
  onShareTimeline:function(){
    var _this = this;
    return {
      title:_this.data.c_title || '潮玩社交平台',
      query:{}    
    }
  },
  pullupsignin: function() {
    // // '没有授权'
    this.setData({tgabox: true});
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
  gotosmokebox: function() {
    wx.navigateTo({
      url: '/pages/smokeboxlist/smokeboxlist',
    })
  },
  // 收货地址弹框
  seladdressfun: function() {
    this.setData({
      receivingaddress: true,
      tipbacktwo: true,
      ishowaddressNo: false,
    });
  },
  // 隐藏收货地址弹框
  receivingaddressfun: function() {
    this.setData({
      receivingaddress: false,
      tipbacktwo: false,
    })
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
            header: {'Accept': 'application/json'},
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
    var _this = this;
    wx.navigateTo({
      url: "/pages/newreceivingaddress/newreceivingaddress"
    })
  },
  // 阻止蒙层冒泡
  preventD() {},

  // 修改收货地址
  revisethereceivingaddress: function(w) {
    var _this = this;
    var tipaid = w.currentTarget.dataset.tipaid || w.target.dataset.tipaid;
    var tipadd = w.currentTarget.dataset.tipadd || w.target.dataset.tipadd;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind||0;
    var data = _this.data.addressdata;
    if (data[ind]&&data[ind].consignee && typeof (data[ind].consignee) != "undefined"){
      var addinfo = data[ind].consignee + " " + data[ind].phone + " " + data[ind].province + data[ind].city + data[ind].district + data[ind].address;
    } else {
      var addinfo = "" + data[ind].phone + " " + data[ind].province + data[ind].city + data[ind].district + data[ind].address;
    }
    this.setData({
      aid: tipaid,
      addressinfo: addinfo,
      receivingaddress: false,
      tipbacktwo: false,
    });
    app.signindata.aid = tipaid;
    app.signindata.addressinfo = addinfo;
  },

  clickgetAward: function() {
    var _this = this
    if (_this.data.currenChance <= 0) {
      _this.setData({
        ishowlesschance: true,
      })
      return;
    } else if (_this.data.aid == 0) {
      _this.setData({
        ishowaddressNo: true,
      })
      return;
    }
    _this.setData({
      suboformola: true,
    })

    var q1 = Dec.Aese('mod=automat&operation=draw' + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + "&aid=" + _this.data.aid);

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            currenChance: res.data.Info.currenChance,
            awardimg: res.data.Info.role.roleImg,
            roleName: res.data.Info.role.roleName,
            isappear: true,
            oid: res.data.Info.role.orderId,
          })
          setTimeout(function() {
            _this.setData({
              isappear: false,
              ishowawardpop: true,
              suboformola: false,
            })
          }, 1000)
        } else {
          _this.setData({
            suboformola: false,
          })
          app.showToastC(res.data.Msg);
        }
      },
      fail: function() {
        wx.hideLoading()
        _this.setData({
          suboformola: false,
        })
      }
    })
  },
  showactionrule: function() {
    var _this = this;
    _this.setData({
      ishowawardrule: !_this.data.ishowawardrule,
    })
  },
  closeawardpop: function() {
    var _this = this;
    _this.setData({
      ishowawardpop: false,
    })
  },
  closelesschance: function() {
    var _this = this;
    _this.setData({
      ishowlesschance: !_this.data.ishowlesschance,
    })
  },
  closeaddressNo: function() {
    var _this = this;
    _this.setData({
      ishowaddressNo: !_this.data.ishowaddressNo,
    })
  },
  againroll: function() {
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    var q1 = Dec.Aese('mod=automat&operation=reroll' + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + "&oid=" + _this.data.oid);

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},

      success: function(res) {
        setTimeout(function () {
          _this.setData({
            ishowawardpop: false,
            ishowagainroll: true,
          })
        }, 2000)
        if (res.data.ReturnCode == 200) {
          wx.hideLoading();
          _this.setData({
            awardimg: res.data.Info.role.roleImg,
            roleName: res.data.Info.role.roleName,
          })
        } else {
          app.showToastC(res.data.Msg);
        }
      },
      fail: function() {
        wx.hideLoading()
      }
    })
  },

  closeawardroll: function() {
    this.setData({
      ishowagainroll: false,
    })
  },

  changeGoodsSwip: function(detail) {
    if (detail.detail.source == "touch") {
      if (detail.detail.current == 0) {
        let swiperError = this.data.swiperError
        swiperError += 1
        this.setData({
          swiperError: swiperError
        })
        if (swiperError >= 3) {
          console.error(this.data.swiperError)
          this.setData({
            goodsIndex: this.data.preIndex
          });
          this.setData({
            swiperError: 0
          })
        }
      } else {
        this.setData({
          preIndex: detail.detail.current
        });
        this.setData({
          swiperError: 0
        })
      }
    }
  },

  mbindchange: function(e) {
    var _this = this;
    var msdata = _this.data.msdata.length;
    if (e.detail.current + 1 == msdata) {
      this.mswiperRequest(2);
    }
  },
  bbindchange: function(e) {
    var _this = this;
    var bsdata = _this.data.bsdata.length;
    if (e.detail.current + 1 == bsdata) {
      this.bswiperRequest(2);
    }
  },

  // 明盒
  mswiperRequest: function(num) {
    var _this = this;
    if (num == 1) {
      _this.data.mpid = 0;
    } else {
      if (_this.data.mpid >= _this.data.mmaxPage) {
        _this.data.mpid = 0;
      } else {
        var pagenum = parseInt(_this.data.mpid)
        _this.data.mpid = ++pagenum;
      };
    };
    var q = Dec.Aese('mod=automat&operation=getBoxImg&type=1&pid=' + _this.data.mpid);
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          if (num == 1) {
            var maxPage = res.data.Info.maxPage || 1;
            var data = res.data.List.box || [];
            _this.setData({
              msdata: data,
              mmaxPage: maxPage
            });
          } else {
            var data = res.data.List.box || [];
            if (data && data.length != 0) {
              if (data.length < 5) {
                setTimeout(function() {
                  for (var i = 0; i < data.length; i++) {
                    _this.setData({
                      ['msdata[' + i + ']']: data[i]
                    });
                  };
                }, 1000);
              } else {
                var lenc = data.length - 1;
                setTimeout(function() {
                  for (var i = 0; i < lenc; i++) {
                    _this.setData({
                      ['msdata[' + i + ']']: data[i]
                    });
                  };
                }, 1000);
                setTimeout(function() {
                  _this.setData({
                    ['msdata[' + lenc + ']']: data[lenc]
                  });
                }, 4000)
              }
            }
          };
        };
      }
    });
  },
  // 盲盒
  bswiperRequest: function(num) {
    var _this = this;
    if (num == 1) {
      _this.data.bpid = 0;
    } else {
      if (_this.data.bpid >= _this.data.bmaxPage) {
        _this.data.bpid = 0;
      } else {
        var pagenum = parseInt(_this.data.bpid)
        _this.data.bpid = ++pagenum;
      };
    };
    var q = Dec.Aese('mod=automat&operation=getBoxImg&type=0&pid=' + _this.data.bpid);
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          if (num == 1) {
            var baxPage = res.data.Info.maxPage || 1;
            var data = res.data.List.box || [];
            _this.setData({
              bsdata: data,
              bmaxPage: baxPage
            });
          } else {
            var data = res.data.List.box || [];
            if (data && data.length != 0) {
              if (data.length < 5) {
                setTimeout(function() {
                  for (var i = 0; i < data.length; i++) {
                    _this.setData({
                      ['bsdata[' + i + ']']: data[i]
                    });
                  };
                }, 1000);
              } else {
                var lenc = data.length - 1;
                setTimeout(function() {
                  for (var i = 0; i < lenc; i++) {
                    _this.setData({
                      ['bsdata[' + i + ']']: data[i]
                    });
                  };
                }, 1000);
                setTimeout(function() {
                  _this.setData({
                    ['bsdata[' + lenc + ']']: data[lenc]
                  });
                }, 4000)
              };
            }
          };
        };
      }
    });
  },
  mbimageLoadad: function(e) {
    var _this = this;
    var indexnum = e.currentTarget.dataset.indexnum || e.target.dataset.indexnum || 0;
    var $width = e.detail.width, //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;
    // 明盒
    if (indexnum == 1) {
      var ind = e.currentTarget.dataset.ind || e.target.dataset.ind || 0;
      var num = e.currentTarget.dataset.num || e.target.dataset.num || 0;
      var viewHeight = 180, //设置图片显示宽度，
        viewWidth = 180 * ratio;
      var msdata = this.data.msdata;
      if (viewWidth > 660 * 0.33) {
        viewWidth = 660 * 0.33;
      };
      if (msdata[ind]) {
        if (msdata[ind] && msdata[ind][num]) {
          msdata[ind][num].width = viewWidth;
          _this.setData({
            ['msdata[' + ind + '][' + num + '].width']: viewWidth
          })
        };
      };
    } else if (indexnum == 2) { //盲盒
      var ind = e.currentTarget.dataset.ind || e.target.dataset.ind || 0;
      var num = e.currentTarget.dataset.num || e.target.dataset.num || 0;
      var viewHeight = 180, //设置图片显示宽度，
        viewWidth = 180 * ratio;
      var bsdata = this.data.bsdata;
      if (viewWidth > 660 * 0.33) {
        viewWidth = 660 * 0.33;
      };
      if (bsdata[ind]) {
        if (bsdata[ind] && bsdata[ind][num]) {
          bsdata[ind][num].width = viewWidth;
          _this.setData({
            ['bsdata[' + ind + '][' + num + '].width']: viewWidth
          })
        };
      };
    };
  },

})