var Pub = require('../../common/mPublic.js'); //aes加密解密js
var Dec = require('../../../../common/public.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 接口地址
    comurl: app.signindata.comurl,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,
    appNowTime: Date.parse(new Date()),
    // 适配苹果X 
    isIphoneX: app.signindata.isIphoneX,
    // 数据 
    listdata: [],
    headhidden: false,
    shopnum: 0,
    dryinglistnum: 0,

    c_title: '开车送隐藏',
    c_arrow: true,
    c_backcolor: '#ff2742',
    page: 0,
    teamPage: 0,
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    movies: [],
    scrolldata: [],
    listdata: [],
    tickettip: false,
    backtip: 1,
    isbacktip: false,
    id: '',
    activitydata: {},
    ishowmore: true,

    stoptimeStr: "",

    ishownoticket: false,
    // 授权弹框
    tgabox: false,
    windowHeight: app.signindata.windowHeight - 65 - wx.getStorageSync('statusBarHeightMc') || 0,
    signinlayer: false,
    nomoredata:false,
    // 生成分享图片
    snapshot: '',
    posterList:[]
  },

  downloadPosterImg: function () {
    var _this = this;
    
    var userlist = _this.data.activitydata.teamMember||[];
    var mlist = [];
    if (userlist.length!=0){
      for (var q = 0; q < userlist.length;q++){
        mlist.push(userlist[q]);
      };
    };
  
    if (_this.data.activitydata.teamMember.length < parseInt(_this.data.activitydata.teamVolume)){
      var len = parseInt(_this.data.activitydata.teamVolume) - _this.data.activitydata.teamMember.length;
      for(var a=0;a<len;a++){
        mlist.push({ photo:'https://www.51chaidan.com/images/driveCar/shareaddimg.png'});
      };
    };
    for (let i = 0; i < mlist.length; i++) {
      wx.getImageInfo({
        src: mlist[i].photo,
        success: function (head) {
          mlist[i].localhead = head.path;
          if (i == mlist.length - 1) {
            _this.setData({
              posterList: mlist,
            });
            setTimeout(function () {
              _this.getSnapshot()
            }, 1000)
          }
        },
        fail: function (res) {
          mlist[i].localhead = "";
          if (i == mlist.length - 1) {
            _this.setData({
              posterList: mlist,
            })
            setTimeout(function () {
              _this.getSnapshot()
            }, 1000)
          }
        }
      })
    }
  },

  getSnapshot: function () {
    var _this = this;

    wx.getImageInfo({
      src: _this.data.activitydata.activityCover || _this.data.activitydata.shareImg,
      success: function (res) {
        const ctx = wx.createCanvasContext('snapshot')
        let dw = 300;
        let dh = 150;
        var width = res.width;
        var height = res.height;
        var scale = height / dh;
        ctx.setFillStyle('#fff')
        ctx.fillRect(0, 0, dw, 240);
        ctx.drawImage(res.path, (dw - width / scale) / 2, 0, width / scale, dh);

        wx.getImageInfo({
          src: 'https://www.51chaidan.com/images/driveCar/vehicle_title.jpg',
          success: function (res) {
            let dwo = 300;
            let dho = 46;
            var scaleo = res.height / dho;
            ctx.drawImage(res.path, (dwo - res.width / scaleo) / 2, dh+1, res.width / scaleo, dho);

            var posterList = _this.data.posterList||[];
            if (posterList.length>6) {
              posterList = posterList.slice(0, 6);
            };

            var posterListLength = posterList.length;
            var imgwh = 34;
            var leftm = (dw - posterListLength * (imgwh + 16))/2;
            for (var i = 0; i < posterList.length;i++){
              if (posterList[i].localhead) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(parseInt(leftm + i * (imgwh + 16) + (imgwh + 16)/2), (dh + dho +23), 17, 0, Math.PI * 2, false);
                ctx.strokeStyle = "#ffffff";
                ctx.clip();
                ctx.drawImage(posterList[i].localhead, leftm + i * (imgwh + 16) + 16 / 2, (dh + dho + 6), imgwh, imgwh)

                ctx.stroke();
                ctx.closePath();
                ctx.restore();
                ctx.draw(true);
              };
            };

            var userlist = _this.data.activitydata.teamMember || [];
            if (userlist.length!=0){
              wx.getImageInfo({
                src: 'https://www.51chaidan.com/images/driveCar/captain.png',
                success: function (res) {
                 
                  ctx.drawImage(res.path, parseInt(leftm + (imgwh + 16) / 2) - 5, (dh + dho +1), 10, 10)
                  ctx.draw(true)
                }
              });
            };
      
            ctx.draw(true, setTimeout(function () {
              wx.canvasToTempFilePath({
                canvasId: 'snapshot',
                success: function (res) {
                  _this.setData({
                    snapshot: res.tempFilePath
                  })
                },
                fail: function (res) {},
              });
            }, 300));
          },
          fail: function (res) {

          }
        });
      },
      fail: function (res) {

      }
    })
  },












  cancelfun: function() {
    this.setData({
      isbacktip: false
    })
  },
  backtipfun: function(w) {
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 1;
    if (this.data.isbacktip && ind == this.data.backtip) {
      this.setData({
        isbacktip: false
      })
    } else {
      this.setData({
        isbacktip: true,
        backtip: ind
      })
    };
  },
  tickettipfun: function() {
    this.setData({
      tickettip: !this.data.tickettip
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
    wx.showLoading({
      title: '加载中...',
    })
    wx.getSetting({
      success: res => {
        if (true) {
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
          wx.hideLoading();
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoadfun: function() {
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isShareFun: app.signindata.isShareFun,
      isProduce: app.signindata.isProduce,
    });
    _this.listdata(0);
    // 购物车数量
    Dec.shopnum(_this,app.signindata.comurl);
    // 调取晒单数量
    Dec.dryingSum(_this, app.signindata.clwcomurl);

  },
  // 阻止蒙层冒泡
  preventD() {},
  onLoad: function(options) {
    var _this = this;
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      app.signindata.referee = _this.getSearchString('referee', scene) || 0;
      app.signindata.activity_id = _this.getSearchString('id', scene) || 0;
      _this.data.loginid = app.signindata.loginid;
      _this.data.openid = app.signindata.openid;
      _this.setData({
        uid: app.signindata.uid,
        isShareFun: app.signindata.isShareFun,
        id: _this.getSearchString('id', scene) || 0,
      });
    } else {
      app.signindata.referee = options.referee || 0;
      app.signindata.activity_id = options.id || 0;
      _this.data.loginid = app.signindata.loginid;
      _this.data.openid = app.signindata.openid;
      _this.setData({
        uid: app.signindata.uid,
        isShareFun: app.signindata.isShareFun,
        id: options.id || 0,
      });
    }
    wx.showLoading({
      title: '加载中...',
    })

    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      _this.onLoadfun();
    }else{
      wx.getSetting({
        success: res => {
          if (true) {
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
            _this.setData({})
          } else {
            wx.hideLoading()
            app.userstatistics(36);
            _this.onLoadfun();
            this.setData({
              signinlayer: false,
            })
          }
        }
      });
    };
  },
  listdata: function(num) {
    var _this = this;
    // 发现详情
    if (num == 0) {
      _this.data.page = 0;
      _this.setData({
        listdata: []
      });
    } else {
      var pagenum = parseInt(_this.data.page)
      _this.data.page = ++pagenum;
    };
    _this.setData({ nomoredata: false })
    var qqq = Dec.Aese('mod=fleet&operation=getInfo&id=' + _this.data.id + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&pid=' + _this.data.page);

    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.signindata.comurl + 'spread.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        _this.setData({
          iftrnodata: true
        });
        if (res.data.ReturnCode == 200) {

          var activitydata = res.data.Info.activity || {};
          var listdata = res.data.List || [];

          if (num == 0) {

            if (activitydata.activityCover && typeof(activitydata.activityCover) != "undefined" && activitydata.activityCover != "" && listdata.gallery.length > 0) {
              listdata.gallery.splice(0, 0, activitydata.activityCover);
            } 
            // else {
            //   listdata.gallery.push(activitydata.activityCover);
            // }

            if (activitydata.status == 2 && activitydata.isJoin && activitydata.teamVolume != activitydata.teamMember.length) {
              var numa = parseInt(activitydata.teamVolume) - parseInt(activitydata.teamMember.length);
              var arr = [].concat(activitydata.teamMember);
              for (var j = 0; j < numa; j++) {
                arr.push(1);
              };
              activitydata.addar = arr;
            }

            if (listdata.activity && listdata.activity.length != 0) {
              var acList = listdata.activity;
              for (var i = 0; i < acList.length; i++) {
                if (acList[i].teamVolume != acList[i].teamMember.length) {
                  var numa = parseInt(acList[i].teamVolume) - parseInt(acList[i].teamMember.length);
                  var arr = [];
                  for (var j = 0; j < numa; j++) {
                    arr.push(j);
                  };
                  acList[i].addarr = arr;
                }
              }
            };

            if (listdata.halfTeam && listdata.halfTeam.length > 0) {
              for (var i = 0; i < listdata.halfTeam.length; i++) {
                // activitydata.teamVolume
                if (activitydata.teamVolume != listdata.halfTeam[i].length) {
                  var numa = parseInt(activitydata.teamVolume) - parseInt(listdata.halfTeam[i].length);
                  for (var j = 0; j < numa; j++) {
                    listdata.halfTeam[i].push(listdata.halfTeam[i][0].team_id);
                  };
                }
              }
            }

            if (activitydata.stop_time) {
              _this.data.timer = setInterval(function() {
                _this.dateformat(activitydata.stop_time);
              }.bind(_this), 1000);
            }

            _this.setData({
              activitydata: activitydata,
              listdata: listdata,
              activityList: listdata.activity ? listdata.activity : [],
              fullTeamList: listdata.fullTeam ? listdata.fullTeam : [],
              ticket: parseInt(res.data.Info.ticket),
              ishowmore: true,
            })
            // 生成图片
            _this.downloadPosterImg()

          } else if (listdata && listdata.activity && listdata.activity.length > 0) {

            var ltlist = _this.data.activityList.concat(listdata.activity);
            _this.setData({
              activityList: ltlist
            });
          } else {
            var pagenum = parseInt(_this.data.page)
            _this.data.page = --pagenum;
          }
        } else if (res.data.ReturnCode == 300) {
          if (num > 0) {
            var pagenum = parseInt(_this.data.page)
            _this.data.page = --pagenum;
          }
          _this.setData({ nomoredata: true })
        } else {
          app.showToastC(res.data.Msg);
        };
      }
    });


  },

  lookmore: function() {
    var _this = this;
    var qqq = Dec.Aese('mod=fleet&operation=moreTeam&id=' + _this.data.id + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&pid=' + _this.data.page);

    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.signindata.comurl + 'spread.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if (res.data.ReturnCode == 200 && res.data.List && res.data.List.fullTeam && res.data.List.fullTeam.length > 0) {
          wx.hideLoading();
          var ltlist = _this.data.fullTeamList.concat(res.data.List.fullTeam);
          _this.setData({
            fullTeamList: ltlist,
          })
          var pagenum = parseInt(_this.data.page)
          _this.data.page = ++pagenum;
        } else {
          app.showToastC('没有更多数据了');
          _this.setData({
            ishowmore: false,
          })
        }
      }
    });
  },

  joinTeam: function(w) {
    var _this = this;
    var teamid = w.currentTarget.dataset.teamid;
    var qqq = Dec.Aese('mod=fleet&operation=joinTeam&teamId=' + teamid + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id);

    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.signindata.comurl + 'spread.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          wx.showToast({
            title: '加入成功',
            icon: 'none',
            mask: true,
            duration: 2000,
            complete:function(){
              if (app.signindata.subscribeif) {
                if (res.data.Info.subscribe && res.data.Info.subscribe.template_id) {
                  _this.data.subscribedata = res.data.Info.subscribe;
                  var acd = res.data.Info.subscribe.template_id || '';
                  if (acd instanceof Array){
                    wx.requestSubscribeMessage({
                      tmplIds: acd||[],
                      success(res) {
                        for(var i=0;i<acd.length;i++){
                          if (res[acd[i]] == "accept") {
                            app.subscribefun(_this, 0, acd[i], _this.data.subscribedata.subscribe_type[i]);
                          };
                        };
                      },
                      complete() { }
                    })
                  }else{
                    wx.requestSubscribeMessage({
                      tmplIds: [acd],
                      success(res) {
                        if (res[acd] == "accept") {
                          app.subscribefun(_this, 0, acd, _this.data.subscribedata.subscribe_type);
                        };
                      },
                      complete() { }
                    })
                  }

                }
              };
            }
          });
          _this.listdata(0);
        } else {
          app.showToastC(res.data.Msg);
        }
      }
    });
  },

  createTeam: function() {

    var _this = this;
    if (_this.data.ticket > 0) {

    } else {
      _this.setData({
        ishownoticket: true,
      })
      return;
    }
    var qqq = Dec.Aese('mod=fleet&operation=createTeam&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + _this.data.id);

    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.signindata.comurl + 'spread.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          wx.showToast({
            title: '创建成功',
            icon: 'none',
            mask: true,
            duration: 1500,
            complete:function(){
              
              if (app.signindata.subscribeif){
                if (res.data.Info.subscribe && res.data.Info.subscribe.template_id){
                  var acd = res.data.Info.subscribe.template_id || '';
                  _this.data.subscribedata = res.data.Info.subscribe;
                  if (acd instanceof Array) {
                    wx.requestSubscribeMessage({
                      tmplIds: acd || [],
                      success(res) {
                        for (var i = 0; i < acd.length; i++) {
                          if (res[acd[i]] == "accept") {
                            app.subscribefun(_this, 0, acd[i], _this.data.subscribedata.subscribe_type[i]);
                          };
                        };
                      },
                      complete() { }
                    })
                  } else {
                    wx.requestSubscribeMessage({
                      tmplIds: [acd],
                      success(res) {
                        if (res[acd] == "accept") {
                          app.subscribefun(_this, 0, acd, _this.data.subscribedata.subscribe_type);
                        };
                      },
                      complete() { }
                    })
                  }                  
                }
              };

            }
          });
          _this.listdata(0);
        } else {
          app.showToastC(res.data.Msg);
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearInterval(this.data.timer);
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(this.data.timer);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.listdata(0);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.listdata(1);
  },
  /**
   * 用户点击右上角分享
   */
  onShareTimeline:function(){
    var _this = this;
    return {
      title:app.signindata.nickName+'邀请你加入车队，3人开车！3人开车！',
      query:{'id':_this.data.id},
      imageUrl: _this.data.activitydata.cover 
    }
  },
  onShareAppMessage: function(options) {
    var _this = this
    var data = _this.data.activitydata;
    var name = app.signindata.userInfo.nickName||'';
    if (data.isJoin && data.teamVolume > data.teamMember.length) {
      // var mTitle = "开车送隐藏-我的车队还差" + (data.teamVolume - data.teamMember.length) + "人开车！快上车！";
      var mTitle = name + "邀请你加入车队,我的车队还差" + (data.teamVolume - data.teamMember.length) + "人开车！快上车！";
    } else {
      // var mTitle = "开车送隐藏-" + data.teamVolume + "人开车！" + data.teamVolume + "人开车！";
      var mTitle = name + "邀请你加入车队," + data.teamVolume + "人开车！" + data.teamVolume + "人开车！";
    }
    var share = {
      title: mTitle,
      imageUrl: _this.data.snapshot || data.shareImg,
      path: "/page/component/pages/drivetohide/drivetohide?id=" + _this.data.id + '&referee=' + _this.data.uid,
      success: function(res) {}
    }
    return share;
  },
  dlfindfun: function() {
    app.comjumpwxnav(993,'','');
  },
  // 导航跳转
  whomepage: function() {
    app.comjumpwxnav(998,'','');
  },
  wmy: function() {
    app.comjumpwxnav(9059,'','');
  },
  wshoppingCart: function() {
    app.comjumpwxnav(9058, '', '');
  },



  // 计算图片大小
  imageLoad: function(e) {
    var _this = this;
    // var ind = parseInt(e.currentTarget.dataset.ind || e.target.dataset.ind || 0);
    var iftr = e.currentTarget.dataset.iftr || e.target.dataset.iftr || 0;
    var $width = e.detail.width, //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;
    if (iftr == 1) {
      var viewHeight = 110, //设置图片显示宽度，
        viewWidth = 110 * ratio;
      var activitydata = this.data.activitydata;
      if (viewWidth > 160) {
        viewWidth = 160;
      };
      if (activitydata) {
        activitydata.width = viewWidth;
        _this.setData({
          activitydata: activitydata
        })
      };
    }

  },

  // 导航跳转 
  wnews: function() {
    // 延迟提交formId
    var _this = this;
    app.limitlottery(_this);
  },

  jumpdhhdetail: function(w) {
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    wx.navigateTo({
      url: "/page/component/pages/drivetohide/drivetohide?id=" + id,
    });
  },

  jumpsmokeList: function() {
    wx.navigateTo({
      url: "/pages/smokeboxlist/smokeboxlist",
    });
    this.setData({
      ishownoticket: false,
    })
  },

  signinget: function() {
    app.showToastC("暂未开放");
    this.setData({
      ishownoticket: false,
    })
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
        _this.setData({
          stoptimeStr: hrStr + ":" + minStr + ":" + secStr,
        })
      } else {
        _this.setData({
          stoptimeStr: dayStr + "天" + hrStr + ":" + minStr + ":" + secStr,
        })
      }
    } else {
      _this.setData({
        stoptimeStr: "00:00:00",
      })
      clearInterval(this.data.timer);
    }

  },

  pullupsignin: function() {
    // // '没有授权'
    this.setData({
      tgabox: true
    });
  },

  awajump: function () {
    var cart_id = this.data.activitydata.cart_id || '';
    wx.navigateTo({
      url: "/page/component/pages/awardwinningarea/awardwinningarea?cart_id=" + cart_id,
    });
  },

  closenoticket:function(){
    this.setData({
      ishownoticket:false,
    })
  },
  jumpnewsignin: function () {
    wx.navigateTo({
      url: "/page/component/pages/newsignin/newsignin",
    });
  },
  //key(需要检错的键） url（传入的需要分割的url地址）
  getSearchString: function (key, Url) {
    // 获取URL中?之后的字符
    var str = Url;
    var arr = str.split("&");
    var obj = new Object();

    // 将每一个数组元素以=分隔并赋给obj对象 
    for (var i = 0; i < arr.length; i++) {
      var tmp_arr = arr[i].split("=");
      obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
    }
    return obj[key];
  },


})