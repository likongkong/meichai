// page/component/pages/hidefun/hidefun.js
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

    headhidden: true,

    dayStr: "0",
    hrStr: "0",
    minStr: "0",
    secStr: "0",

    imgUrls: [],

    //轮播选中下标
    swiperIndex: 0,
    //头像集合
    headlist: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

    tgabox: false,

    funinfo: '',
    funlist: '',

    orderinfo: '', //上部分信息

    detailinfo: '', //下部分信息

    //新头像集合
    newlist: '',
    olderlist: '',
    isProduce: app.signindata.isProduce,
    // 公共默认信息
    defaultinformation: '',

    shopnum: 0,

    topheight: 0,
    bottomheight: 0,
    disheight: 0,
    newheight: 0,

    snapshot: "",
    sharefriend: "",

    // 领奖提示数据
    awardrresentation: [],
    awardrresentiftr: false,
    awardrresentationjump: '',
    // 支付运费金额
    payfreightmony: 0,
    isNewer: 0,
    type: 0,
    cart_id: 0,
    order_id: 0,

    ishowsharefriend: false,
    ishowExplain: false,

    isuccess: false,

    isuccessdetail: false,

    ishowbottom: false,

    ishowaffirm: false,

    newcoupon: false,

    iscoupon: false,

    newcoutitle: '新人礼包',

    newcoupondata: [],

    isgetphone: false,

    isreload: false,

    c_title: '隐藏功能',
    c_arrow: true,
    c_backcolor: '#22292C',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,

    bottomtop: 0,
    ishowsusp: false,
    navbtn: 0,

    actrecactlist: [],
    listBlindBox: [],
    listShowBox: [],
    listLotto: [],
    pushWay: 0,
    tgaimg: app.signindata.tgaimg || 'https://www.51chaidan.com/images/default/openscreen.jpg'
  },

  refuse: function() {
    var _this = this;
    _this.setData({
      ishowaffirm: false,
      newcoupon: true,
    })
  },
  // 更新用户信息
  getUserProfile(w){
    var _this = this;
    console.log(1111111)
    app.getUserProfile((res,userInfo) => {
        _this.setData({
          ishowaffirm: false,
          newcoupon: true,
        })
       app.signindata.isNeedUserInfo = false; 
    });
  },
  help: function() {
    var _this = this;
    _this.setData({
      ishowaffirm: false,
      newcoupon: true,
    })
  },

  openExplain: function() {
    var _this = this;

    wx.navigateTo({
      url: "/page/component/pages/webview/webview?webview=https://www.51chaidan.com/notice/strategyFreeOrder.html",
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      avatarUrl: app.signindata.avatarUrl,
      type: options.type || 0,
      headhidden: false,
    });

    if (options.type == 2) {
      _this.setData({
        order_id: options.order_id || 0,
      })
    } else {
      _this.setData({
        cart_id: options.cart_id || 0,
      })
    }
    _this.data.pushWay = options.pushWay || 0;
    // _this.setData({
    //   order_id: 213554,
    //   type:2,
    // })

    // 判断是否授权 
    var _this = this;

    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      _this.onLoadfun();
    }else{

      wx.getSetting({
        success: res => {
          if (true) {
            // '已经授权'
            _this.setData({
              loginid: app.signindata.loginid,
              uid: app.signindata.uid,
              openid: app.signindata.openid,
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
    };

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
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      avatarUrl: app.signindata.avatarUrl,
      defaultinformation:app.signindata.defaultinformation,
      headhidden: false,
      isNeedUserInfo:app.signindata.isNeedUserInfo
    });
    if (app.signindata.isNewer) {
      _this.setData({
        isNewer: 1,
      })
    } else {
      _this.setData({
        isNewer: 0,
      })
    }

    _this.getfreeinfo(_this.data.type)

    if(this.data.defaultinformation){}else{
      app.defaultinfofun(this);
    }

    // 统计推送进入
    if (_this.data.pushWay > 0) {
      app.pushfun(_this);
    }


  },

  getfreeinfo: function(type) {
    var _this = this;
    // 延迟提交formId
    _this.setData({
      headhidden: false,
    })
    var q1 = ''
    if (type == 2) {
      q1 = Dec.Aese('mod=info&operation=list&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + "&order_id=" + _this.data.order_id + "&type=" + _this.data.type);
    } else {
      q1 = Dec.Aese('mod=info&operation=list&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + "&cart_id=" + _this.data.cart_id + "&type=" + _this.data.type);
    }

    wx.request({
      url: app.signindata.comurl + 'freeOrder.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        wx.stopPullDownRefresh();
        if (res.data.ReturnCode == "200") {
          _this.setData({
            isuccess: true,
            funinfo: res.data.Info,
            funlist: res.data.List,
            orderinfo: res.data.List.listFreeOrder[0],
          })
          if (res.data.List.listGoodsBanner) {
            _this.setData({
              imgUrls: res.data.List.listGoodsBanner,
            })
          } else {
            _this.setData({
              imgUrls: res.data.List.listFreeOrder,
            })
          }
          _this.getfreeDetail(res.data.List.listFreeOrder[0].order_id);
          var interval = setInterval(function() {
            _this.dateformat(res.data.Info.overtime);
          }.bind(_this), 1000);

        } else {
          _this.setData({
            headhidden: true,
          })
        }
      },
      complete: function() {}
    });

  },

  getfreeDetail: function(order_id) {
    var _this = this;
    // 延迟提交formId
    _this.setData({
      headhidden: false,
      listShowBox: [],
    })
    var q1 = Dec.Aese('mod=info&operation=detail&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + "&order_id=" + order_id + "&isNewHelper=" + _this.data.isNewer);
    wx.request({
      url: app.signindata.comurl + 'freeOrder.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      complete: function() {

      },
      success: function(res) {
        if (res.data.ReturnCode == "200") {

          var detaillist = res.data.List.newHelper;

          for (var i = 0; i < res.data.Info.surplusSeat; i++) {
            if (i == 0) {
              detaillist.push(1);
            } else {
              detaillist.push(2);
            }
          }

          var list = []
          var arr = []
          for (var i = 0; i < detaillist.length; i++) {
            arr.push(detaillist[i]);
            if ((i + 1) % res.data.Info.freeBuyOrderGearLimit == 0) {
              list.push(arr)
              arr = []
            } else if (i == (detaillist.length - 1)) {
              list.push(arr)
              arr = []
            }
          }

          _this.setData({
            detailinfo: res.data.Info,
            order_id: res.data.Info.order_id,
            newlist: list,
            olderlist: res.data.List.oldHelper,
            isuccessdetail: true,
            actrecactlist: res.data.List.MD,
            listBlindBox: res.data.List.BlindBox,
            listShowBox: res.data.List.ShowBox,
            listLotto: res.data.List.Lotto,
          })

          if ((res.data.Info.isOpenFreeOrder && res.data.Info.status == 0) || res.data.Info.selfFreeOrder) {
            _this.setData({
              ishowbottom: false,
            })
            setTimeout(function() {
              _this.judgeSuspend()
              _this.setData({
                headhidden: true,
              })
            }, 1500)
          } else {
            _this.setData({
              ishowbottom: true,
              headhidden: true,
            })
          }

          if (res.data.Info.isFirstHelp) {
            _this.setData({
              ishowaffirm: true,
            })
            if (app.signindata.isNewer && res.data.Info.isGainMobile) {
              _this.setData({
                isgetphone: true,
              })
            } else {
              _this.helpOther()
            }
          }

          if (res.data.Info.infoCoupon && res.data.Info.infoCoupon != null && res.data.Info.infoCoupon.length > 0) {
            _this.setData({
              iscoupon: true,
              newcoupondata: res.data.Info.infoCoupon,
            })
          }

          _this.getSnapshot()

        } else {
          _this.setData({
            headhidden: true,
          })
        }
      }
    });
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

  shareclick: function() {
    var _this = this
    _this.getfreeinfo(_this.data.type)
  },

  openorder: function() {
    var _this = this;
    _this.setData({
      headhidden: false,
    })
    var q1 = Dec.Aese('mod=operate&operation=open&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + "&order_id=" + _this.data.order_id);
    wx.request({
      url: app.signindata.comurl + 'freeOrder.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if (res.data.ReturnCode == "200") {

          _this.setData({
            cart_id: res.data.Info.cart_id,
            type: 0,
          })
          _this.getfreeinfo(0)
        } else {
          app.showToastC(res.data.Msg);
        }
      },
      complete: function() {
        _this.setData({
          headhidden: true,
        })
      }
    });
  },

  // 额外奖励
  clicktocollect: function() {
    var _this = this;

    var qqq = Dec.Aese('mod=operate&operation=receiveaward&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + _this.data.detailinfo.cart_id);
    wx.request({
      url: app.signindata.comurl + 'order.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          app.showToastC('领取成功');
          _this.onLoadfun();
        } else if (res.data.ReturnCode == 830) {
          var rpiinfo = res.data.Info.tip.replace(/\\n/g, '\n') || '';

          if (res.data.Info.Goods.item_type == 996) {
            _this.setData({
              awatip: true
            });
          } else {
            _this.setData({
              awardrresentiftr: !_this.data.awardrresentiftr,
            })
          };

          _this.setData({
            rpinfotip: rpiinfo
          });
          _this.setData({
            awardrresentation: res.data.List,
            awardrresentationjump: res.data.Info.Goods || '',
            payfreightmony: res.data.Info.amount || 10
          });
        } else {
          app.showToastC(res.data.Msg);
        };
      }
    });

  },

  /**
   * 生成分享图
   */
  getSnapshot: function() {
    var _this = this;

    wx.getImageInfo({
      src: "https://www.51chaidan.com/images/background/bg_share_freeBuyOrder2.png",
      success: function(ress) {
        wx.getImageInfo({
          src: _this.data.detailinfo.goods_share,
          success: function(res) {
            const ctx = wx.createCanvasContext('snapshot')
            let dw = 300
            let dh = 180
            let textwidth;
            var width = res.width
            var height = res.height
            var scale = height / dh
            ctx.setFillStyle('#fff')
            ctx.fillRect(0, 0, dw, 240)

            ctx.drawImage(ress.path, 0, 0, dw, 240)
            ctx.drawImage(res.path, 88, 52, 120, 120)

            ctx.fillStyle = 'red';
            ctx.setFontSize(30)
            ctx.fillText(_this.data.orderinfo.freeBuyOrderGearLimit, _this.data.orderinfo.freeBuyOrderGearLimit > 9 ? 85 : 100, 40) //120


            ctx.draw(true, setTimeout(function() {
              wx.canvasToTempFilePath({
                canvasId: 'snapshot',
                success: function(res) {
                  _this.setData({
                    snapshot: res.tempFilePath
                  })
                },
                fail: function(res) {},
              });
            }, 300));
          }
        })
      }
    })
  },

  circlepost: function() {
    var _this = this
    _this.getsharefriend();
  },

  dialogClick: function() {
    this.setData({
      ishowsharefriend: false,
      ishowExplain: false,
      newcoupon: false,
    })
  },


  /**
   * 生成二维码图 
   */
  getsharefriend: function() {
    var _this = this;

    _this.setData({
      headhidden: false,
    })
    //底图加载
    wx.getImageInfo({
      src: "https://www.51chaidan.com/images/background/bg_moments_freeBuyOrder.png",
      fail: function(res) {
        _this.setData({
          ishowsharefriend: true,
          headhidden: true,
          isreload: true,
        })
      },
      success: function(ress) {
        //分享商品图加载
        wx.getImageInfo({
          src: _this.data.detailinfo.goods_share,

          fail: function(res) {
            _this.setData({
              ishowsharefriend: true,
              headhidden: true,
              isreload: true,
            })
          },
          success: function(res) {
            const ctx = wx.createCanvasContext('sharefriend')
            let dw = 300
            let dh = 180
            let textwidth;
            var width = res.width
            var height = res.height
            var scale = height / dh
            ctx.setFillStyle('#fff')
            ctx.fillRect(0, 0, dw, 240)

            ctx.drawImage(ress.path, 0, 0, dw, 240)
            ctx.drawImage(res.path, 100, 42, 100, 100)

            //头像加载

            const patha = wx.getStorageSync('image_cache')
            var uidimg = app.signindata.avatarUrl || 'https://static.51chaidan.com/images/headphoto/' + _this.data.uid + '.jpg';
            if (uidimg) {
              var tdavatar = uidimg;
            } else if (path != null) {
              if (path) {
                var tdavatar = path;
              } else {
                var tdavatar = _this.data.avatarUrl;
              };
            } else {
              var tdavatar = _this.data.avatarUrl;
            };

            wx.getImageInfo({
              src: tdavatar,

              fail: function(res) {
                _this.setData({
                  ishowsharefriend: true,
                  headhidden: true,
                  isreload: true,
                })
              },

              success: function(avatar) {

                ctx.drawImage(avatar.path, 8, 1, 31, 31)

                //二维码加载
                wx.getImageInfo({
                  src: _this.data.detailinfo.qrcode,
                  success: function(code) {

                    ctx.setFillStyle('white')
                    ctx.fillRect(120, 152, 60, 60)

                    ctx.drawImage(code.path, 120, 152, 60, 60)

                    ctx.draw(true, setTimeout(function() {
                      wx.canvasToTempFilePath({
                        canvasId: 'sharefriend',
                        success: function(res) {
                          _this.setData({
                            ishowsharefriend: true,
                            sharefriend: res.tempFilePath,
                            headhidden: true,
                            isreload: false,
                          })
                        },
                        fail: function(res) {
                          _this.setData({
                            ishowsharefriend: true,
                            headhidden: true,
                            isreload: true,
                          })
                        },

                      });
                    }, 300));
                  }
                })

              }


            })

          }

        })
      }

    })
  },

  // 保存图片
  sharesavethepicture: function() {
    var _this = this;
    _this.setData({
      headhidden: false,
    })
    var imgSrc = _this.data.sharefriend;


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
                    upserimgbox: false,
                    savepicturesiftr: true,
                    tgfrShareIftr: false,
                    headhidden: true
                  });
                },
                fail() {
                  app.showToastC('保存失败');
                  _this.setData({
                    upserimgbox: false,
                    savepicturesiftr: true,
                    tgfrShareIftr: false,
                    headhidden: true
                  });
                }
              })
            },
            fail() {
              _this.setData({
                picbox: true
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
                upserimgbox: false,
                savepicturesiftr: true,
                tgfrShareIftr: false,
                headhidden: true
              });
            },
            fail() {
              app.showToastC('保存失败');
              _this.setData({
                upserimgbox: false,
                savepicturesiftr: true,
                tgfrShareIftr: false,
                headhidden: true
              });
            }
          })
        }
      }
    });
  },

  directbuy: function() {
    var _this = this
    _this.setData({
      newcoupon: false,
    })
    wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "../../../../pages/detailspage/detailspage?gid=" + _this.data.detailinfo.goods_id,
    })

  },

  newpsellwellfun: function(w) {
    var _this = this
    var href = w.currentTarget.dataset.href || w.target.dataset.href || 0;
    var title = w.currentTarget.dataset.title || w.target.dataset.title || '';
    _this.setData({
      newcoupon: false,
    })
    wx.navigateTo({
      url: "/page/component/pages/newpsellwell/newpsellwell?" + href + '&title=' + title,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var _this = this
    _this.getfreeinfo(_this.data.type)
  },

  /**
   * 用户点击右上角分享
   */
  onShareTimeline:function(){
    var _this = this;
    return {
      title:_this.data.c_title || '潮玩社交平台',
      query:{}    
    }
  },
  onShareAppMessage: function() {
    var _this = this
    var reshare = {
      title: "我开启了隐藏功能【0元购】快来帮我助力吧，你也可以领取~",
      path: "/page/component/pages/hidefun/hidefun?type=2&cart_id=" + _this.data.cart_id + "&order_id=" + _this.data.detailinfo.order_id,
      imageUrl: _this.data.snapshot,
      success: function(res) {}
    }
    return reshare;
  },

  bindchange(e) {
    var _this = this
    if (_this.data.funlist.listGoodsBanner) {
      this.setData({
        swiperIndex: e.detail.current,
      })
    } else {
      this.setData({
        swiperIndex: e.detail.current,
        orderinfo: _this.data.funlist.listFreeOrder[e.detail.current],
      })
      this.getfreeDetail(_this.data.funlist.listFreeOrder[e.detail.current].order_id);
    }

  },

  imageclick: function(w) {
    var _this = this
    var id = w.currentTarget.dataset.id || w.target.dataset.id || '';
    wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "../../../../pages/detailspage/detailspage?gid=" + _this.data.detailinfo.goods_id,
    })
  },

  backself: function(w) {
    var _this = this
    var cart_id = w.currentTarget.dataset.cart_id || w.target.dataset.cart_id || '';
    wx.redirectTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "/page/component/pages/hidefun/hidefun?type=0&cart_id=" + cart_id,
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  wshoppingCart: function() {
    wx.redirectTo({
      url: "/pages/shoppingCart/shoppingCart"
    });
  },
  // 导航跳转 
  wnews: function() {
    var _this = this
    app.limitlottery(_this);
  },
  // 导航跳转
  whomepage: function() {
    wx.reLaunch({
      url: "/pages/index/index?judgeprof=2"
    });
  },
  wmy: function() {
    app.signindata.iftr_mc = true;
    wx.redirectTo({
      url: "/pages/wode/wode"
    });
  },

  dlfindfun: function() {
    wx.reLaunch({
      url: "/page/component/pages/dlfind/dlfind",
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
  awajump: function() {
    var cart_id = this.data.detailinfo.cart_id || '';
    wx.navigateTo({
      url: "/page/component/pages/awardwinningarea/awardwinningarea?cart_id=" + cart_id,
    });
    this.setData({
      awatip: false
    });
  },
  awatipdisnone: function() {
    this.setData({
      awatip: false
    });
  },

  helpOther: function(code, encryptedData, iv) {
    var _this = this;
    var q1
    if (iv) {
      q1 = Dec.Aese('mod=operate&operation=help&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + "&order_id=" + _this.data.order_id +
        "&isNewHelper=" + _this.data.isNewer + '&mobile=1' + "&code=" + code + "&encryptedData=" + encryptedData + "&iv=" + iv);
    } else {
      q1 = Dec.Aese('mod=operate&operation=help&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + "&order_id=" + _this.data.order_id +
        "&isNewHelper=" + _this.data.isNewer + '&mobile=0');
    }

    wx.request({
      url: app.signindata.comurl + 'freeOrder.php' + q1,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          app.signindata.isNewer = false;
        }
        if (iv) {
          _this.setData({
            isgetphone: false,
          })
        }
      }
    });
  },

  getPhoneNumber: function(e) {
    var _this = this

    if (e.detail.errMsg == 'getPhoneNumber: ok' || e.detail.errMsg == "getPhoneNumber:ok") {
      wx.login({
        success: function(res) {
          if (res.code) {
            _this.helpOther(res.code, e.detail.encryptedData, e.detail.iv)
          } else {}
        }
      });
    } else {
      // _this.setData({
      //   ishowaffirm: false,
      // })
      // _this.helpOther()
      // getPhoneNumber: fail user deny
    }
  },

  acetlistfun: function() {
    let pages = getCurrentPages();
    let prevpage = pages[pages.length - 2];
    if (prevpage) {
      if (prevpage.route == '/page/component/pages/activitysharinglist/activitysharinglist') {
        wx.navigateBack();
      } else {
        wx.navigateTo({
          url: "/page/component/pages/activitysharinglist/activitysharinglist"
        });
      };
    } else {
      wx.navigateTo({
        url: "/page/component/pages/activitysharinglist/activitysharinglist"
      });
    };

  },

  // 免单活动跳转
  actexempfun: function(event) {
    var gid = event.currentTarget.dataset.gid || event.target.dataset.gid;
    setTimeout(function() {
      wx.navigateTo({
        url: "/pages/activitydetailspage/activitydetailspage?id=" + gid
      });
    }, 100);
  },

  limitlottfun: function() {
    wx.navigateTo({
      url: "/page/component/pages/limitlotterylist/limitlotterylist",
    });
  },

  jumpdlflottery: function(event) {
    var id = event.currentTarget.dataset.id || event.target.dataset.id;
    var _this = this;
    _this.setData({
      jumpdevanningiftr: true
    });
    wx.navigateTo({
      url: "/page/component/pages/limitlottery/limitlottery?id=" + id,
    });
  },

  bblistfun: function() {

    wx.navigateTo({
      url: "/pages/smokeboxlist/smokeboxlist",
    });
  },

  // 在线抽盒机
  bbevebox: function(event) {
    var id = event.currentTarget.dataset.gid || event.target.dataset.gid;
    var _this = this;
    wx.navigateTo({
      url: "/pages/smokebox/smokebox?id=" + id,
    });
  },

  // 计算图片大小
  imageLoadad: function(e) {
    var _this = this;
    var indexnum = e.currentTarget.dataset.indexnum || e.target.dataset.indexnum || 0;
    if (indexnum == 1) {
      var num = e.currentTarget.dataset.num || e.target.dataset.num || 0;
      var $width = e.detail.width, //获取图片真实宽度
        $height = e.detail.height,
        ratio = $width / $height;
      var viewHeight = 177, //设置图片显示宽度，
        viewWidth = 177 * ratio;
      var listBlindBox = this.data.listBlindBox || [];
      if (viewWidth > 680) {
        viewWidth = 680;
      };
      if (listBlindBox) {
        if (listBlindBox[num]) {
          listBlindBox[num].width = viewWidth;
          _this.setData({
            listBlindBox: listBlindBox
          });
        };
      };
    } else if (indexnum == 2) {
      var num = e.currentTarget.dataset.num || e.target.dataset.num || 0;
      var $width = e.detail.width, //获取图片真实宽度
        $height = e.detail.height,
        ratio = $width / $height;
      var viewHeight = 240, //设置图片显示宽度，
        viewWidth = 240 * ratio;
      var listShowBox = this.data.listShowBox || [];
      if (viewWidth > 680) {
        viewWidth = 680;
      };
      if (listShowBox) {
        if (listShowBox[num]) {
          listShowBox[num].width = viewWidth;
          _this.setData({
            listShowBox: listShowBox
          });
        };
      };
    }
  },

  showboxlistfun: function() {
    wx.navigateTo({
      url: "/page/component/pages/mingboxList/mingboxList",
    });
  },

  // 拆明盒
  jumpopenbox: function(event) {
    var id = event.currentTarget.dataset.id || event.target.dataset.id;
    var _this = this;
    wx.navigateTo({
      url: "/page/component/pages/mingbox/mingbox?id=" + id,
    });
  },


})