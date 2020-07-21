// page/secondpackge/pages/exhibitionwelfare/exhibitionwelfare.js
var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
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
    openid: app.signindata.openid,

    c_title: '展会福利', // -正品折扣多一点
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,

    brandList: [],
    adList: [],

    windowHeight: app.signindata.windowHeight,

    brandInfo: "",

    dayStr: 0,
    hrStr: "00",
    minStr: "00",
    secStr: "00",
    ishowdetail: false,
    bigimage: "",

    addfrindcommoni: false,
    showimg: "",

    ishowsignin: false,
    receiveList: [],
    mshareId: 0,

    ishowextain: false,

    ishowtips1: false,
    ishowtips2: false,
    ishowtips3: false,

  },

  showtips1: function () {
    var _this = this
    this.setData({
      ishowtips1: !_this.data.ishowtips1,
    })
  },

  showtips2: function () {
    var _this = this
    this.setData({
      ishowtips2: !_this.data.ishowtips2,
    })
  },

  showtips3: function () {
    var _this = this
    this.setData({
      ishowtips3: !_this.data.ishowtips3,
    })
  },


  //领取奖励
  getaward: function () {
    var cart_id = this.data.welfareInfo.cart_id || '';
    wx.navigateTo({
      url: "/page/component/pages/awardwinningarea/awardwinningarea?cart_id=" + cart_id,
    });
  },

  // 展会公共跳转
  exhibitionpubjump: function (w) {
    var type = w.currentTarget.dataset.type || w.target.dataset.type || '';
    var jumpid = w.currentTarget.dataset.id || w.target.dataset.id || '';
    app.exhibitionpubjump(type, jumpid)
    var clouddata = { type:19 ,adv_id: jumpid};
    app.cloudstatistics('advertisingStat', clouddata)

  },

  showextain: function () {
    var _this = this;
    this.setData({
      ishowextain: !_this.data.ishowextain,
    })
  },

  closesignin: function () {
    this.setData({
      ishowsignin: false,
    })
  },

  gettodayposter: function () {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    var exh = Dec.Aese('mod=show&operation=receive&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + "&shareId=" + _this.data.mshareId);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + exh,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('分享数据===',res)
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          _this.setData({
            ishowsignin: true,
            ishowdetail: false,
            receiveList: res.data.List.receiveList,
          })
          _this.data.mshareId = 0;
          app.showToastC('领取成功')
          _this.welfareInfo();
        } else {
          app.showToastC(res.data.Msg)
          setTimeout(function(){
              _this.welfareInfo();
          },2000)
        };
      },
      fail: function () {
        _this.welfareInfo();
      }
    });
  },

  lookdetail: function (w) {
    var _this = this;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    _this.setData({
      currentind: ind,
      brandInfo: _this.data.welfareInfoList[ind],
      ishowdetail: true,
      bigimage: _this.data.welfareInfoList[ind].images,
    })
  },

  closedetail: function () {
    var _this = this
    this.setData({
      ishowdetail: false,
    })
  },

  gobrandDetails: function (w) {
    var mid = w.currentTarget.dataset.mid || w.target.dataset.mid || 0;
    wx.navigateTo({
      url: "/page/secondpackge/pages/brandDetails/brandDetails?id=" + mid,
    });
  },


  welfareInfo: function () {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    var exh = Dec.Aese('mod=show&operation=welfareInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + exh,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log(res)
        wx.hideLoading()
        wx.stopPullDownRefresh();
        if (res.data.ReturnCode == 200) {
          var info = res.data.Info;
          info.gearPosition = parseInt(info.gearPosition);
          info.haveNumber = parseInt(info.haveNumber);
          _this.setData({
            welfareInfoList: res.data.List.welfareInfoList,
            welfareInfo: res.data.Info,
            shareInfo: res.data.Info.shareInfo ? res.data.Info.shareInfo : 0,
          })
          _this.data.timer = setInterval(function () {
            //将时间传如 调用 
            _this.dateformat(res.data.Info.stop_time);
          }.bind(_this), 1000);
        } else {

        };
      },
      fail: function () { }
    });
  },

  getADList: function () {
    var _this = this;
    var exh = Dec.Aese('mod=info&operation=toyShow&type=15');
    wx.request({
      url: app.signindata.comurl + 'ads.php' + exh,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log(res)
        if (res.data.ReturnCode == 200) {
          _this.setData({
            adList: res.data.banner[0],
          })
        } else {

        };
      },
      fail: function () { }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.hideShareMenu();
    var _this = this;
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      app.signindata.referee = _this.getSearchString('referee', scene) || 0;
      _this.data.loginid = app.signindata.loginid;
      _this.data.openid = app.signindata.openid;
      _this.setData({
        uid: app.signindata.uid,
        isShareFun: app.signindata.isShareFun,
        referee: _this.getSearchString('referee', scene) || 0,
        mshareId: _this.getSearchString('share_id', scene) || 0,
      });
    } else {
      app.signindata.referee = options.referee || 0;
      _this.data.loginid = app.signindata.loginid;
      _this.data.openid = app.signindata.openid;
      _this.setData({
        uid: app.signindata.uid,
        isShareFun: app.signindata.isShareFun,
        referee: options.referee || 0,
        mshareId: options.share_id || 0,
      });
    }
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
              signinlayer: true,
              isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
            });
            // 判断是否登录
            if (_this.data.loginid != '' && _this.data.uid != '') {
              _this.onLoadfun();
            } else {
              app.signin(_this)
            }
            _this.setData({})
          } else {
            wx.hideLoading()
            app.userstatistics(40);
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
  clicktga: function () {
    app.clicktga(2)
  },
  clicktganone: function () {
    this.setData({
      tgabox: false
    })
  },
  userInfoHandler: function (e) {
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
    if (e.detail.detail.userInfo) { } else {
      app.clicktga(8) //用户按了拒绝按钮
    };

  },


  onLoadfun: function () {
    var _this = this
    wx.hideLoading()
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      avatarUrl: app.signindata.avatarUrl,
    });

    this.getADList();
    if (_this.data.mshareId != 0) {
      this.gettodayposter();
    } else {
      this.welfareInfo();
    }
  },

  addfrindcommonifun: function (w) {
    var _this = this;
    var url = w.currentTarget.dataset.url || w.target.dataset.url || 0;
    var name = w.currentTarget.dataset.name || w.target.dataset.name || 0;
    if (url && url != "") {
      this.setData({
        showimg: url != "" ? url : "https://cdn.51chaidan.com/images/act/1577083808.jpg",
        addfrindcommoni: !this.data.addfrindcommoni
      });
    } else {
      app.showToastC(name + '未提供此方式');
    }
  },
  closefrindcommoni:function(){
    this.setData({
      addfrindcommoni: !this.data.addfrindcommoni
    });
  },

  saveposter: function (w) {
    var _this = this;
    var img = w.currentTarget.dataset.img || w.target.dataset.img || 0;
    this.setData({
      showimg: img != "" ? img : "https://cdn.51chaidan.com/images/act/1577083808.jpg",
    });
    _this.sharesavethepicture();
  },

  imgCanelTgexh: function () {
    this.setData({
      exhpicsave: false,
      addfrindcommoni: false
    });
  },

  exhsavehandleSetting: function (e) {
    var _this = this;
    if (!e.detail.authSetting['scope.writePhotosAlbum']) {
      wx.showModal({
        title: '警告',
        content: '若不打开授权，则无法将图片保存在相册中！',
        showCancel: false
      });
      _this.setData({
        exhpicsave: false
      });
    } else {
      _this.setData({
        exhpicsave: false,
      });
      _this.frpcomsavethepicture();
    }
  },

  // 保存图片
  sharesavethepicture: function () {
    var _this = this;
    var imgSrc = '';
    wx.getImageInfo({
      src: _this.data.showimg || '',
      fail: function (res) {},
      success: function (res) {
        var imgSrc = res.path;
        wx.getSetting({
          success(res) {
            // 如果没有则获取授权
            if (!res.authSetting['scope.writePhotosAlbum']) {
              if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
                wx.authorize({
                  scope: 'scope.writePhotosAlbum',
                  success() {
                    wx.saveImageToPhotosAlbum({
                      filePath: imgSrc,
                      success() {
                        app.showToastC('保存成功');
                        _this.setData({ addfrindcommoni: false })
                      },
                      fail() {
                        app.showToastC('保存失败');
                        _this.setData({ addfrindcommoni: false })
                      }
                    })
                  }
                })
              } else {
                _this.setData({
                  exhpicsave: true,
                });
              }
            } else {
              // 有则直接保存
              wx.saveImageToPhotosAlbum({
                filePath: imgSrc,
                success(res) {
                  app.showToastC('保存成功');
                  _this.setData({
                    addfrindcommoni: false
                  });
                },
                fail(res) {
                  app.showToastC('保存失败');
                  _this.setData({
                    addfrindcommoni: false
                  });
                }
              })
            }
          }
        });
      }
    })

  },

  pullupsignin: function () {
    // // '没有授权'
    this.setData({
      tgabox: true
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
    this.welfareInfo();
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
    var _this = this
    var share_id = _this.data.shareInfo != 0 ? _this.data.shareInfo.shareId : 0;
    var share = {
      title: _this.data.shareInfo.shareTitle,
      imageUrl: _this.data.shareInfo.shareImg,
      path: "/page/secondpackge/pages/exhibitionwelfare/exhibitionwelfare?id=" + _this.data.id + '&referee=' + _this.data.uid + '&share_id=' + share_id,
      success: function (res) { }
    }
    return share;
  },
  onShareTimeline:function(){
    var _this = this;
    return {
      title:_this.data.c_title || '潮玩社交平台',
      query:{id: _this.data.id}    
    }
  },

  // 时间格式化输出，将时间戳转为 倒计时时间
  dateformat: function (micro_second) {
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
})