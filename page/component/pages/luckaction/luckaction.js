// page/component/pages/luckaction/luckaction.js
var Dec = require('../../../../common/public.js'); //aes加密解密js
var util = require('../../../../utils/util.js');
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
    avatarUrl: app.signindata.avatarUrl,
    isProduce: app.signindata.isProduce,

    type: '',

    activityinfo: '',

    mUserInfo: '',

    images: [],
    upserimgbox: false,
    actimgshare: '',

    ishowrule: false,

    prize: [],

    qrcode: '',

    shopnum: 0,

    dryinglistnum: 0,

    defaultinformation: app.signindata.defaultinformation,

    cart_idsave:"",

    c_title: '美拆大咖',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    pushWay: 0
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.data.pushWay = options.pushWay || 0;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      avatarUrl: app.signindata.avatarUrl,
    });
    wx.showLoading({
      title: '加载中...',
    })

    // 判断是否授权 
    var _this = this;
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
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this)
          }
        } else {
          wx.hideLoading()
          // 跳转获取权限页面
          // wx.navigateTo({
          //   url: "../../../../pages/signin/signin"
          // })
          // '没有授权 统计'
          app.userstatistics(21);
          _this.setData({
            tgabox: true
          });
          _this.onLoadfun();
        }
      }
    });

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
        if (res.authSetting['scope.userInfo']) {
          // 确认授权用户统计
          app.clicktga(4);
          _this.setData({
            tgabox: false
          });
          _this.data.loginid = app.signindata.loginid;
          _this.data.openid = app.signindata.openid;
          // '已经授权'
          _this.setData({
            uid: app.signindata.uid,
            isProduce: app.signindata.isProduce,
            avatarUrl: app.signindata.avatarUrl,
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

    var _this = this
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      avatarUrl: app.signindata.avatarUrl,
    });
    wx.hideLoading()

    _this.getinfo()
    // 购物车数量显示
    Dec.shopnum(_this,app.signindata.comurl);
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
          app.signindata.defaultinformation = res.data.Info || '';
        };
      }
    });
    // 统计推送进入
    if (_this.data.pushWay > 0) {
      app.pushfun(_this);
    }
  },

  getinfo: function() {

    var _this = this

    var q1 = Dec.Aese('mod=bigshot&operation=info&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        wx.stopPullDownRefresh()
        if (res.data.ReturnCode == 200) {
          var user = res.data.Info.user

          if (res.data.Info.user.distance2top) {
            user.int2top = parseInt(res.data.Info.user.distance2top)
          }

          _this.setData({
            type: res.data.Info.type,
            // type: "aaa",
            activityinfo: res.data.Info.activity,
            mUserInfo: user,
            images: res.data.List.banner,
            cart_idsave: res.data.Info.cart_id || "",
          })
          _this.data.qrcode = res.data.Info.qrcode;

          if (res.data.Info.prize) {
            _this.setData({
              prize: res.data.Info.prize,
            })
          }
          // _this.generatePicturesbs();
        }
      }
    });

  },

  addorder: function() {
    // wx.redirectTo({
    //   url: "/pages/index/index",
    // });

    wx.reLaunch({
      url: "/pages/index/index"
    });
  },

  baskorder: function() {

  },

  showrule: function() {
    var _this = this
    this.setData({
      ishowrule: !this.data.ishowrule,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var _this = this
    _this.getinfo()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var _this = this
    var share = {
      title: '这个活动真给力！每周购买' + _this.data.activityinfo.conditionNumber + '件商品，瓜分' + _this.data.activityinfo.totalPrizeNumber + '个盲盒。',
      imageUrl: 'https://clw.51chaidan.com/images/bargain/share.jpg',
      success: function(res) {

      }
    }
    return share;
  },

  // 关闭保存图片上传图片
  closeupserimg: function() {
    this.setData({
      upserimgbox: false,
      actimgshare: ''
    });
  },

  upserimgboxiftr: function(w) {
    var _this = this;

    this.setData({
      upserimgbox: true
    });
    // this.generatePictures();
    _this.generatePicturesbs();
  },

  screenshotpreviewImgzhong: function(w) {
    var index = 0;
    var imgArr = ['https://www.51chaidan.com/images/default/consultAudit.jpg'];
    wx.previewImage({
      current: imgArr[index],
      urls: imgArr,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    });
  },
  generatePicturesbs:function(){
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    });
    var prize = _this.data.prize || [];
    var prizenum = prize.length;
    if (prizenum==1){
      var goodspo = prize[0].gcover||'';
      if (goodspo.indexOf("https") < 0){
        goodspo=goodspo.replace(/http/,'https');
      }
    }else{
      var goodspo = prize[0].gcover || '';
      if (goodspo.indexOf("https") < 0) {
        goodspo = goodspo.replace(/http/, 'https');
      }     
      var goodspt = prize[1].gcover || '';
      if (goodspt.indexOf("https") < 0) {
        goodspt = goodspt.replace(/http/, 'https');
      }
    }
    var ctxt = wx.createCanvasContext('canimgserceshi')
    wx.getImageInfo({
      src: goodspo, 
      success: function (res) {
        if (prizenum==1){
          ctxt.drawImage(res.path, 130, 296,114,114);
          wx.getImageInfo({
            src: "https://www.51chaidan.com/images/cast/ca_1.png", 
            success: function (res) {
              ctxt.drawImage(res.path, 0, 0,375, 603);
              ctxt.draw(true, setTimeout(function () {
                wx.canvasToTempFilePath({
                  canvasId: 'canimgserceshi',
                  success: function (res) {
                    wx.hideLoading()
                    _this.setData({
                      actimgshare: res.tempFilePath,
                    });
                    
                  },
                  fail: function (res) {
                    wx.hideLoading()
                    app.showToastC('图片生成失败，请重新刷新页面重试,{ReturnCode:01}');
                    _this.setData({
                      upserimgbox: false,
                    });
                    
                  },
                });
              }, 300));

            },
            fail: function (res) {
              wx.hideLoading()
              app.showToastC('图片生成失败，请重新刷新页面重试,{ReturnCode:02}');
              _this.setData({
                upserimgbox: false,
              });
            }
          });
        }else{
          ctxt.drawImage(res.path, 66, 293, 114, 114);
          wx.getImageInfo({
            src: goodspt,
            success: function (res) {
                ctxt.drawImage(res.path, 195, 293, 114, 114);
                wx.getImageInfo({
                  src: "https://www.51chaidan.com/images/cast/ca_2.png",
                  success: function (res) {
                    ctxt.drawImage(res.path, 0, 0, 375, 603);
                    ctxt.draw(true, setTimeout(function () {
                      wx.canvasToTempFilePath({
                        canvasId: 'canimgserceshi',
                        success: function (res) {
                          _this.setData({
                            actimgshare: res.tempFilePath,
                          });
                          wx.hideLoading()
                        },
                        fail: function (res) {
                          wx.hideLoading()
                          app.showToastC('图片生成失败，请重新刷新页面重试,{ReturnCode:03}');
                          _this.setData({
                            upserimgbox: false,
                          });
                        },
                      });
                    }, 300));

                  },
                  fail: function (res) {
                    wx.hideLoading()
                    app.showToastC('图片生成失败，请重新刷新页面重试,{ReturnCode:04}');
                    _this.setData({
                      upserimgbox: false,
                    });
                  }
                });
            }, 
            fail: function (res) {
              wx.hideLoading()
              app.showToastC('图片生成失败，请重新刷新页面重试,{ReturnCode:05}');
              _this.setData({
                upserimgbox: false,
              });
            }
          });   
        }
        

      },
      fail: function (res) {
        wx.hideLoading()
        app.showToastC('图片生成失败，请重新刷新页面重试,{ReturnCode:06}');
        _this.setData({
          upserimgbox: false,
        });
      }
    });
  },
  // 生成图片
  generatePictures: function() {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    _this.setData({
      actimgshare: ''
    });
    var ctxt = wx.createCanvasContext('canimgser')

    const path = wx.getStorageSync('image_cache')
    var uidimg = app.signindata.avatarUrl || 'https://static.51chaidan.com/images/headphoto/' + _this.data.uid + '.jpg';
    if (uidimg) {
      var tdavatar = uidimg;
    } else if (path != null) {
      if (path) { var tdavatar = path; } else { var tdavatar = _this.data.avatarUrl; };
    } else {
      var tdavatar = _this.data.avatarUrl;
    };

    wx.getImageInfo({
      src: tdavatar, // 用户头像  
      success: function(res) {
        ctxt.drawImage(res.path, 134, 54, 52, 52);
        // ctxt.draw(true);
        wx.getImageInfo({
          src: 'https://www.51chaidan.com/images/default/bg_winner.png', // 背景
          success: function(res) {
            ctxt.drawImage(res.path, 0, 0, 319, 414);
            ctxt.setFontSize(16)
            ctxt.setFillStyle('#000')
            ctxt.fillText('我在美拆抽中了', 100, 135);
            var str = "美拆大咖瓜分1000盲盒得活动，获得盲盒玩具";
            ctxt.setFontSize(13);
            ctxt.setFillStyle('#000');
            ctxt.fillText(str, (319 - ctxt.measureText(str).width) / 2, 162);

            wx.getImageInfo({
              src: _this.data.qrcode, // 太阳码
              success: function(res) {
                ctxt.drawImage(res.path, 129.5, 340, 60, 60);
                // ctxt.draw(true);
                wx.getImageInfo({
                  src: "https://www.51chaidan.com/images/background/bgBigShotAward.png", // banner 图片
                  success: function(res) {
                    ctxt.drawImage(res.path, 17, 180, 285, 151);
                    ctxt.draw(true, setTimeout(function() {
                      wx.canvasToTempFilePath({
                        canvasId: 'canimgser',
                        success: function(res) {
                          _this.setData({
                            actimgshare: res.tempFilePath,
                          });
                          wx.hideLoading()
                        },
                        fail: function(res) {
                          wx.hideLoading()
                          app.showToastC('图片生成失败，请重新刷新页面重试,{ReturnCode:01}');
                          _this.setData({
                            upserimgbox: false,
                          });
                          
                        },
                      });
                    }, 300));

                  },
                  fail: function(res) {
                    wx.hideLoading()
                    app.showToastC('图片生成失败，请重新刷新页面重试,{ReturnCode:02}');
                    _this.setData({
                      upserimgbox: false,
                    });
                    
                  }
                });
              },
              fail: function(res) {
                wx.hideLoading()
                app.showToastC('图片生成失败，请重新刷新页面重试,{ReturnCode:03}');
                _this.setData({
                  upserimgbox: false,
                });
                
              }
            });

          },
          fail: function(res) {
            wx.hideLoading()
            app.showToastC('图片生成失败，请重新刷新页面重试,{ReturnCode:04}');
            _this.setData({
              upserimgbox: false,
            });
            
          }
        })
      },
      fail: function(res) {
        wx.hideLoading()
        app.showToastC('图片生成失败，请重新刷新页面重试,{ReturnCode:05}');
        _this.setData({
          upserimgbox: false,
        });
        
      }
    })
  },

  // 保存图片
  sharesavethepicture: function(w) {
    var _this = this;
    var indnum = w.currentTarget.dataset.indnum || w.target.dataset.indnum || '';
    if (indnum == 1) {
      var imgSrc = _this.data.actimgshare || '';
    } else {
      var imgSrc = _this.data.actimgshareact || '';
    };
    wx.getSetting({
      success(res) {
        // 如果没有则获取授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.saveImageToPhotosAlbum({
                filePath: imgSrc,
                success() {
                  app.showToastC('保存成功');
                  _this.setData({
                    upserimgbox: false
                  });
                },
                fail() {
                  app.showToastC('保存失败');
                  _this.setData({
                    upserimgbox: false,
                    actimgshare: ''
                  });
                }
              })
            },
            fail() {
              _this.setData({
                picbox: true,
                upserimgbox: false,
                actimgshare: ''
              });
            }
          })
        } else {
          // 有则直接保存
          wx.saveImageToPhotosAlbum({
            filePath: imgSrc,
            success() {
              app.showToastC('保存成功');
              _this.setData({
                upserimgbox: false
              });
            },
            fail() {
              app.showToastC('保存失败');
              _this.setData({
                upserimgbox: false,
                savepicturesiftr: true,
                actimgshare: ''
              });
            }
          })
        }
      }
    });

  },

  // 上传图片
  upImgSer: function(w) {
    var _this = this;
    var anum = w.currentTarget.dataset.anum || w.target.dataset.anum || 1;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths[0];
        _this.uploadFile(_this, tempFilePaths, 'litpic', anum);
      }
    })
  },

  //上传文件
  uploadFile: function(_this, filePath, name, anum) {

    var _this = _this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.uploadFile({
      url: Dec.comurl() + 'order.php',
      filePath: filePath,
      name: name,
      header: {
        'content-type': 'multipart/form-data'
      }, // 设置请求的 header
      formData: {
        'mod': 'info',
        'operation': 'upload',
        'uid': _this.data.uid,
        'cart_id': _this.data.cart_idsave,
        'loginid': _this.data.loginid,
        // 'picture_type': 2,
        'type': anum
      }, // HTTP 请求中其他额外的 form data
      success: function(res) {
        wx.hideLoading()
        _this.setData({
          upserimgbox: false,
          upserimgboxact: false
        });
        wx.hideToast();
        if (res.data) {
          if (res.data == 200) {
            app.showToastC('上传成功');
          } else {
            app.showToastC(res.data);
          }
        };
        setTimeout(function(){
           _this.onLoadfun();
        },3000)
        
      },
      fail: function(res) {
        wx.hideLoading()
        _this.setData({
          upserimgbox: false,
          upserimgboxact: false
        });
        wx.hideToast();
        app.showToastC('上传失败');
      }
    })
  },

  //公告跳转
  jumpnotice: function() {
    var _this = this

    wx.navigateTo({
      url: "/page/component/pages/webview/webview?webview=https://www.51chaidan.com/notice/strategyBigShot.html",
    });

  },
  // 导航跳转 
  wnews: function() {
    var _this = this
    setTimeout(function() {
      app.limitlottery(_this);
    }, 100);
  },

  // 导航跳转
  whomepage: function() {
    setTimeout(function() {
      wx.reLaunch({
        url: "../../../../pages/index/index?judgeprof=2"
      })
    }, 40);
  },
  wmy: function() {
    setTimeout(function() {
      wx.reLaunch({
        url: "../../../../pages/wode/wode"
      });
    }, 40);
  },
  wshoppingCart: function() {
    setTimeout(function() {
      wx.reLaunch({
        url: "../../../../pages/shoppingCart/shoppingCart"
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





})