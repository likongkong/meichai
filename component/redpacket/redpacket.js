// component/redpacket.js
var Dec = require('../../common/public.js'); //aes加密解密js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    scene: {   //navbarData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        console.log('分享数据===',newVal)
        if(newVal){
          app.signindata.referee = newVal.referee || 0;
          app.signindata.activity_id = newVal.id || 0;
          this.data.id = newVal.id || 0;
          this.data.gid = newVal.gid || 0;
          this.data.welfareid = newVal.welfareid || 0;
          this.data.isredpag = newVal.isredpag || 0;
          this.setData({
            is_share: newVal.referee || 0 ? true : false,
            loginid: app.signindata.loginid,
            uid: app.signindata.uid,
          })
          if (this.data.isredpag == 1) {
              this.shareopen(this.data.welfareid)
          }
        }
      }
    },
    countWelfare: {  
      type: Number,
      value: {},
      observer: function (newVal, oldVal) {
        this.setData({
          countWelfare:newVal
        })
      }
    },
    sourcePage: {  
      type: Number,
      value: {},
      observer: function (newVal, oldVal) {
        this.setData({
          sourcePage:newVal
        })
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    welfare: [],
    redpagList: [],
    ishowredpackage: false,
    firstshowredpag: true,
    ishowpagInfo: false,
    welfareInfo: "",
    welfareList: [],
    isharepag: false,
    isredshare: false,
    welfareid: 0,
    isredpag: 0,
    redpagshareimg: "http://www.51chaidan.com/images/blindBox/halfPackage.jpg",
    ishowsurebuy: false,
    wwheight: app.signindata.windowHeight,
    isheavyroll: false, // 点击了重抽
    rollbefore: "",
    rollbelater: "",
    isallready: false,
    istipsure: false,
    israysure: false,
    framtop: (app.signindata.windowHeight - 400) / 2,
    pmc:true,
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.setData({
        loginid: app.signindata.loginid,
        uid: app.signindata.uid,
      });
    },
    ready: function() {
      this.setData({
        loginid: app.signindata.loginid,
        uid: app.signindata.uid,
      });
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    
    // 幸运值红包
  hidepackage: function () {
    var _this = this;
    if (!_this.data.ishowredpackage) {
      _this.setData({
        redpagList: _this.data.welfare,
      })
    }
    _this.setData({
      ishowredpackage: !_this.data.ishowredpackage,
      isharepag: false,
    })
  },
  // 抽盒金红包
  toggleBlindboxPacket(){
    var _this = this;
    if (!_this.data.isBlindboxPacketOne) {
      _this.setData({
        redpagList: _this.data.welfare,
      })
    }
    _this.setData({
      isBlindboxPacketOne: !_this.data.isBlindboxPacketOne,
      isharepag: false,
    })
  },

  openpackage: function (w) {
    var _this = this;
    var id = w.currentTarget.dataset.mid;
    var isget = w.currentTarget.dataset.isget;
    var samount = w.currentTarget.dataset.samount;
    var ind = w.currentTarget.dataset.ind;
    
    if( this.data.isredpag != 1 ){
        var url = "/page/secondpackge/pages/redEnvelopeList/redEnvelopeList?hs=" + String(_this.data.welfare[0].welfareType==2?1:2);
        console.log(url)
        wx.navigateTo({   
          url: url
        });
        this.hidepackage()
        return false;
    }


    _this.drawredpagshare(ind)
    if (!isget || (samount && samount == 0)) {
      _this.openredpackage(id)
      _this.setData({
        welfareid: id,
        redpagind: ind,
      })
    } else {
      _this.redpagInfo(id)
      _this.setData({
        welfareid: id,
        redpagind: ind,
      })
    }
  },

  openredpackage: function (welfareId) {
    var _this = this;
    wx.showLoading({
      title: '开启中...',
    })
    if(_this.data.pmc){
      console.log('_this.data.pmc========',_this.data.pmc)
      _this.data.pmc = false;
      var q = Dec.Aese('mod=blindBox&operation=receiveWelfare&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&welfareId=' + welfareId)
      wx.request({
        url: app.signindata.comurl + 'spread.php' + q,
        method: 'GET',
        header: {'Accept': 'application/json'},
        success: function (res) {
          console.log('开启红包======',res)
          wx.hideLoading()
          _this.data.pmc = true;
          if (res.data.ReturnCode == 200) {
            wx.showToast({
              title: '领取成功',
              icon: 'none',
              mask:true,
              duration:1500
            }); 
            _this.redpagInfo(welfareId)
          } else {
            wx.showToast({
              title: res.data.Msg,
              icon: 'none',
              mask:true,
              duration:1500
            }); 
            if(_this.data.welfare && _this.data.welfare.length != 0 && _this.data.welfare[0]){
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
        }
      });
    }

  },

  redpagInfo: function (welfareId) {
    var _this = this
    wx.showLoading({
      title: '加载中...',
    })
    var q = Dec.Aese('mod=blindBox&operation=getWelfareDetail&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&welfareId=' + welfareId)

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
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
          
          

          let isgetBlindboxMoney = true;
          if(res.data.List.welfare && res.data.List.welfare.length!=0){
            res.data.List.welfare.forEach(item => {
              if(_this.data.uid == item.userId){
                isgetBlindboxMoney =false;
              }
            });
          }

          if(isgetBlindboxMoney){
            // 更新抽盒金
            var gbm = Dec.Aese('mod=blindBox&operation=getBlindboxMoney&uid='+_this.data.uid);
            wx.request({
              url: app.signindata.comurl + 'spread.php' + gbm,
              method: 'GET',
              header: { 'Accept': 'application/json' },
              success: function (res) {
                if (res.data.ReturnCode == 200) {
                  console.log('更新抽盒金=====',res)
                  _this.setData({
                    blindboxMoney: res.data.Info.blindbox_money || ""
                  });
                  app.signindata.blindboxMoney = res.data.Info.blindbox_money || "";
                  app.signindata.tempBlindboxMoney = res.data.Info.tempBlindboxMoney || "";
                };
              }
            })
          }
          

          let getWelfaredada ={
            welfare:res.data.Info.welfare,
            redpagind:_this.data.redpagind,
            redpagshareimg:_this.data.redpagshareimg
          }
          _this.triggerEvent('getWelfare',getWelfaredada)

        } else {
          wx.showToast({
            title: res.data.Msg,
            icon: 'none',
            mask:true,
            duration:1500
          }); 
        }
      }
    });
  },

  blindboxClosepagInfo: function () {
    var _this = this
    _this.setData({
      isBlindboxPacketTwo: false,
    })
    // this.getInfo();
  },
  closepagInfo: function () {
    var _this = this
    _this.setData({
      ishowpagInfo: false,
    })
  },

  shareopen: function (welfareId) {
    var _this = this;
    var q = Dec.Aese('mod=blindBox&operation=getWelfareInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&welfareId=' + welfareId)

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          _this.setData({
            redpagList: res.data.Info.welfare || [],
            isharepag: true,
          })
          if(res.data.Info.welfare[0].welfareType == 2){
            _this.setData({
              ishowredpackage: true,
            })
          }else if(res.data.Info.welfare[0].welfareType == 3){
            _this.setData({
              isBlindboxPacketOne:true,
            })
          }
        } else {
          wx.showToast({
            title: res.data.Msg,
            icon: 'none',
            mask:true,
            duration:1500
          }); 
        }
      }
    });
  },

  showsurebuy: function () {
    var _this = this
    _this.setData({
      ishowsurebuy: !_this.data.ishowsurebuy,
    })
  },

  drawredpagshare: function (ind) {
    var _this = this
    var info = _this.data.redpagList[ind]
    wx.getImageInfo({
      src: "https://www.51chaidan.com/images/blindBox/halfPackage.jpg",
      success: function (res) {
        const ctxt = wx.createCanvasContext('redpagshare',_this);
        ctxt.drawImage(res.path, 0, 0, 300, 240)
        wx.getImageInfo({
          src: info.roleImg,
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
                  _this.triggerEvent('redpagshareimage',res.tempFilePath)
                },
                fail: function (res) {},
              },_this);
            }, 300));
          }
        })
      }
    })
  },
    jumpRedList(w){
      var ind = w.currentTarget.dataset.ind;
      wx.navigateTo({   
        url: "/page/secondpackge/pages/redEnvelopeList/redEnvelopeList?hs=" + ind + "&sourcePage="+this.data.sourcePage
      });
    },

  }
})
