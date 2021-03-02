var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '我的红包', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,

    headSel:1,
    listdata:[]
  },
  getInfo: function (recycle = true) {
    var _this = this;

    wx.showLoading({
      title: '加载中...',
      mask:true
    });

    var q1 = Dec.Aese('mod=blindBox&operation=welfareList&uid=' + app.signindata.uid + '&loginid=' + app.signindata.loginid);

    console.log('mod=blindBox&operation=welfareList&uid=' + app.signindata.uid + '&loginid=' + app.signindata.loginid)

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        console.log('getInfo======',res)
        wx.stopPullDownRefresh();
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {

          var listData = res.data.List.welfare || {};
          var listdata = [];
          if(_this.data.headSel == 1){
              listdata = listData.luckyValue; 
          }else if(_this.data.headSel == 2){
              listdata = listData.blindboxMoney;
          };
          _this.setData({
             blindboxMoney: listData.blindboxMoney || [], // 是抽盒金的
             luckyValue: listData.luckyValue || [],  // 是幸运值的
             listdata
          });
        }
        
      },

      fail: function (res) {
        wx.stopPullDownRefresh();
        wx.hideLoading()
      }

    })
  },


  openpackage: function (w) {
    var _this = this;
    var id = w.currentTarget.dataset.mid;
    var isget = w.currentTarget.dataset.isget;
    var samount = w.currentTarget.dataset.samount;
    var ind = w.currentTarget.dataset.ind;
    var gid = w.currentTarget.dataset.gid;
    if (!isget || (samount && samount == 0)) {
      _this.openredpackage(id)
      _this.setData({
        welfareid: id,
        redpagind: ind,
        isget,
        gid
      })
    } else {
      _this.redpagInfo(id)
      _this.setData({
        welfareid: id,
        redpagind: ind,
        isget,
        gid
      })
    }
  },

  openredpackage: function (welfareId) {
    var _this = this;

    wx.showLoading({
      title: '开启中...',
      mask:true
    })
    
    var q = Dec.Aese('mod=blindBox&operation=receiveWelfare&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&welfareId=' + welfareId)
    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading()
        _this.data.pmc = true;
        if (res.data.ReturnCode == 200) {
          app.showToastC('领取成功');
          _this.redpagInfo(welfareId)
        } else {
          app.showToastC(res.data.Msg);
          console.log()
          if(_this.data.welfare[0].welfareType == 2){
            _this.setData({
              ishowredpackage: false,
            })
          }else if(_this.data.welfare[0].welfareType == 3){
            _this.setData({
              isBlindboxPacketOne: false,
            })
          }
        }
      }
    });

  },

  // 抽红包 幸运值
  redpagInfo: function (welfareId) {
    var _this = this;
    var welfareId = welfareId;
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    var q = Dec.Aese('mod=blindBox&operation=getWelfareDetail&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&welfareId=' + welfareId)
   
    console.log('mod=blindBox&operation=getWelfareDetail&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&welfareId=' + welfareId)

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        console.log('领取红包',res)
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          if(res.data.Info.welfare.welfareType == 2){
            _this.setData({
              ishowredpackage: false,
              ishowpagInfo: true,
            })
          }else if(res.data.Info.welfare.welfareType == 3){
            _this.setData({
              isBlindboxPacketOne: false,
              isBlindboxPacketTwo: true,
            })
          }
          _this.setData({
            welfareInfo: res.data.Info.welfare,
            welfareList: res.data.List.welfare,
          })
          _this.drawredpagshare(_this.data.redpagind)
        } else {
          app.showToastC(res.data.Msg);
        }
      }
    });
  },
  drawredpagshare: function (ind) {
    var _this = this
    var info = _this.data.listdata[ind]
    wx.getImageInfo({
      src: "https://www.51chaidan.com/images/blindBox/halfPackage.jpg",
      success: function (res) {
        const ctxt = wx.createCanvasContext('redpagshare');
        ctxt.drawImage(res.path, 0, 0, 300, 240)
        wx.getImageInfo({
          src: _this.data.welfareInfo.roleImg,
          success: function (res) {
            var radio = res.width / res.height;
            var width = 80 * radio;
            if(width>110){
              var widthOther = 60 * radio;
              ctxt.drawImage(res.path, 25, 25, widthOther, 60)
            }else{
              ctxt.drawImage(res.path, 25, 25, width, 80)
            };
            
            ctxt.setFontSize(25);
            ctxt.setFillStyle('#f0ca97');
            if (info.welfareType == 1) {
              ctxt.fillText("隐藏红包", 165, 60);
              ctxt.fillText(parseInt(info.limitAmount) + "元", 177, 90);
              ctxt.fillText("隐藏红包", 165, 60.5);
              ctxt.fillText(parseInt(info.limitAmount) + "元", 177.5, 90);
            } else if (info.welfareType == 2)  {
              ctxt.fillText("幸运值红包", 145, 60);
              ctxt.fillText(parseInt(info.limitAmount) + "点", 170, 90);
              ctxt.fillText("幸运值红包", 145, 60.5);
              ctxt.fillText(parseInt(info.limitAmount) + "点", 170.5, 90);
            } else if (info.welfareType == 3)  {
              ctxt.fillText("抽盒金红包", 145, 60);
              ctxt.fillText(parseInt(info.limitAmount) + "元", 170, 90);
              ctxt.fillText("抽盒金红包", 145, 60.5);
              ctxt.fillText(parseInt(info.limitAmount) + "元", 170.5, 90);
            }
            ctxt.draw(true, setTimeout(function () {
              wx.canvasToTempFilePath({
                canvasId: 'redpagshare',
                success: function (res) {
                  _this.setData({
                    redpagshareimg: res.tempFilePath
                  })
                },
                fail: function (res) {},
              });
            }, 300));

          }
        })

      }
    })
  },
  headSelFun(event){
    var index = event.currentTarget.dataset.index || event.target.dataset.index || 1;

    var listdata = [];
    if(index == 1){
        listdata = this.data.luckyValue || []; // 是幸运值的
    }else if(index == 2){
        listdata = this.data.blindboxMoney || []; // 是抽盒金的
    };
    this.setData({
      headSel:index,
      listdata
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      headSel:options.hs || 1
    })
    // 判断是否授权
    this.activsign();
    
  },
  onLoadfun:function(){
    var _this = this;

    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
    });

    this.getInfo()

  },
  closepagInfo: function () {
    var _this = this
    _this.setData({
      ishowpagInfo: false,
    })
    if(!this.data.isget){
      this.getInfo();
    };
    
  },
  //获取用户信息
  getUserInfo(){
    var _this = this;
    wx.login({
      success:function(){
        wx.getUserInfo({
          success: function (res) {
            _this.setData({
              avatarUrl: res.userInfo.avatarUrl,
              nickName: res.userInfo.nickName
            })
          }
        });
      }
    });
  },
  activsign: function () {
    // 判断是否授权 
    var _this = this;
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
      return false;
    };    
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // '已经授权'
          _this.setData({
            loginid: app.signindata.loginid,
            uid: app.signindata.uid,
            openid: app.signindata.openid,
            avatarUrl: app.signindata.avatarUrl,
            isShareFun: app.signindata.isShareFun,
            isProduce: app.signindata.isProduce,
            signinlayer: true,
            tgabox: false
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this);
          }
        } else {
          console.log(11111111111111111111111111111)
          _this.setData({
            tgabox: false,
            signinlayer: false
          })
          console.log()
          // '没有授权 统计'
          app.userstatistics(42);
          _this.onLoadfun();
        }
      }
    });      
  },
  // 授权点击统计
  clicktga: function () {
    app.clicktga(2)
  },
  clicktganone: function () {
    this.setData({ tgabox: false })
  },
  // 点击登录获取权限
  userInfoHandler: function (e) {
    var _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          _this.setData({
            signinlayer: true,
            tgabox: false
          });
          _this.activsign();
          // 确认授权用户统计
          app.clicktga(4);          
        }
      }
    });
    if (e.detail.detail.userInfo) { } else {
      app.clicktga(8)  //用户按了拒绝按钮
    };
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
    this.getInfo()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  clicktganone: function () {
    this.setData({ tgabox: false })
  }, 
  blindboxClosepagInfo: function () {
    var _this = this
    _this.setData({
      isBlindboxPacketTwo: false,
    })
    if(!this.data.isget){
      this.getInfo();
    };
  },  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this
    if (_this.data.ishowpagInfo || _this.data.isBlindboxPacketTwo) {
      var info = _this.data.listdata[_this.data.redpagind]
      var xilie = _this.data.welfareInfo.roleName || "";
      var title = ""
      if(info.welfareType == 1){
        title = "我抽到了" + xilie + "，隐藏红包送给你们。"
      } else if(info.welfareType == 2){
        if (info.userId && info.userId != _this.data.uid) {
          title = info.nick + "抽到了" + xilie +  "，幸运值红包送给你们。"
        } else {
          title = "我抽到了" + xilie +  "，幸运值红包送给你们。"
        }
      }else if(info.welfareType == 3){
        if (info.userId && info.userId != _this.data.uid) {
          title = info.nick + "抽到了" + xilie +  "，抽盒金红包送给你们。"
        } else {
          title = "我抽到了" + xilie + "，抽盒金红包送给你们。"
        }
      }
      var reshare = {
        title: title,
        imageUrl: _this.data.redpagshareimg,
        path: "/pages/smokebox/smokebox?id=" + _this.data.id + '&referee=' + _this.data.uid + '&gid=' + _this.data.gid + '&welfareid=' + _this.data.welfareid + '&isredpag=1',
        success: function (res) {}
      }
    } else {
      var reshare = app.sharemc();
    }  
    return reshare
  },
  
})