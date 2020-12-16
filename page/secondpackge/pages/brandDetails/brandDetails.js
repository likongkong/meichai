var Dec = require('../../../../common/public.js'); //aes加密解密js
var time = require('../../../../utils/util.js');
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

    c_title: '', // -正品折扣多一点
    c_arrow: true,
    c_backcolor: '',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,

    brandId: 0,
    page: 0,
    banner: [],
    brandList: [],

    addfrindcommoni: false,
    showimg: "",
    currentIndex: 0,

    adList: [],

    videoContext: "",

    signinlayer: true,
    windowHeight: app.signindata.windowHeight,
    type:'',
    settlement:0
  },

  // 展会公共跳转
  exhibitionpubjump: function (w) {
    var type = w.currentTarget.dataset.type || w.target.dataset.type || '';
    var jumpid = w.currentTarget.dataset.id || w.target.dataset.id || '';
    app.exhibitionpubjump(type, jumpid)
    
    var clouddata = { type:16 ,adv_id: jumpid};
    app.cloudstatistics('advertisingStat', clouddata)

  },

  jumpexhdetail: function (w) {
    var _this = this;
    var mtype = w.currentTarget.dataset.mtype || w.target.dataset.mtype || 0;
    var brandid = _this.data.brandId || "";
    var id;
    if (mtype == 12 || mtype == 11) {
      id = w.currentTarget.dataset.gid || w.target.dataset.gid || 0;
    } else {
      id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    }
    app.jumpexhdetail(mtype, id,brandid);
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
  // 保存图片
  sharesavethepicture: function () {
    var _this = this;
    var imgSrc = '';
    wx.getImageInfo({
      src: _this.data.showimg || '',
      fail: function (res) {
      },
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
      _this.sharesavethepicture();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //key(需要检错的键） url（传入的需要分割的url地址）
  getSearchString:function(key, Url) {
    // 获取URL中?之后的字符
    var str = Url;
    var arr = str.split("&");
    var obj = new Object();
    // 将每一个数组元素以=分隔并赋给obj对象 
    for(var i = 0; i<arr.length; i++) {
        var tmp_arr = arr[i].split("=");
        obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
    }
    return obj[key];
  },

  onLoad: function (options) {
    var _this = this;
    console.log(options)

    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      console.log(scene)
      _this.setData({
        brandId: _this.getSearchString('id', scene) || 0,
        type:_this.getSearchString('type', scene) || '',
        settlement:_this.getSearchString('sl', scene) || 0,
      })
    }else{
      _this.setData({
        brandId: options.id || 0,
        type: options.type||'',
        settlement:options.settlement||0
      })
    }
    console.log('品牌值============',_this.data.brandId,_this.data.type)


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
            app.userstatistics(39);
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
    var _this = this;
    wx.hideLoading()
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      avatarUrl: app.signindata.avatarUrl,
    });

    _this.data.page = 0;
    _this.getbrandDetail(_this.data.page);
    _this.getADList();

    _this.data.videoContext = wx.createVideoContext('myVideo')//初始化视频组件
  },

  getbrandDetail: function (page) {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    var exh = Dec.Aese('mod=show&operation=brandSummary&brandId=' + _this.data.brandId + '&page=' + page + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=' + _this.data.type+"&settlement="+_this.data.settlement);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + exh,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh();
        console.log(res)
        if (res.data.ReturnCode == 200) {
          var brandList = res.data.List.activity || [];
          for (var r = 0; r < brandList.length; r++) {
            brandList[r].start_time = time.toDate(brandList[r].start_time);
            brandList[r].stop_time = time.toDate(brandList[r].stop_time);
          };
          _this.setData({
            brandinfo: res.data.Info.brand,
            banner: res.data.List.banner,
            founder: res.data.List.founder,
            isVideo: res.data.Info.isVideo,
            video: res.data.List.video,
          })
          if (page == 0) {
            _this.setData({
              brandList: brandList,
              isVideo: res.data.Info.isVideo,
            })
          } else if (brandList.length > 0) {
            var l = _this.data.brandList.concat(brandList);
            _this.setData({
              brandList: l,
            })
          } else {
            _this.setData({
              page: page - 1,
            })
          }
        } else {
          if (page == 0) {
          } else {
            _this.setData({
              page: page - 1,
            })
          }
        };
      },
      fail: function () { }
    });
  },

  changeGoodsSwip: function (detail) {
    if (detail.detail.source == "touch") {
      this.setData({
        currentIndex: detail.detail.current
      })
    }
  },

  getADList: function () {
    var _this = this;
    var exh = Dec.Aese('mod=info&operation=toyShow&type=2');
    wx.request({
      url: app.signindata.comurl + 'ads.php' + exh,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('广告=============',res)
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

  // 点赞
  ispraisefun: function (w) {
    var _this = this;
    var is_praise = w.currentTarget.dataset.is_praise || w.target.dataset.is_praise || 0;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var lid = w.currentTarget.dataset.lid || w.target.dataset.lid || 0;
    var brandList = _this.data.brandList;
    if (_this.data.loginid != '' && _this.data.uid != '') {
      Pub.postRequest(_this, 'praiseDrying', {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        drying_id: lid,
        is_praise: is_praise
      }, function (res) {
        if (is_praise == 0) {
          brandList[ind].is_praise = 1;
          brandList[ind].praise_sum = parseInt(brandList[ind].praise_sum) + 1;
        } else {
          brandList[ind].is_praise = 0;
          brandList[ind].praise_sum = parseInt(brandList[ind].praise_sum) - 1;
        };
        _this.setData({
          brandList: brandList
        });
      });
    }
  },

  // 图片预览
  previewVideo: function () {
    var _this = this
    _this.data.videoContext.play();
  },

  pullupsignin: function () {
    // // '没有授权'
    this.setData({
      tgabox: true
    });
  },

  briefint:function(w){
    var _this = this;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var founder = _this.data.founder||[];
    founder[ind].description = founder[ind].description.replace(/<br>/g, '\n');
    _this.setData({
      founderbrief: founder[ind],
      founderbriefiftr:true
    })
  },
  founderbrieffun:function(){
    this.setData({
      founderbriefiftr:false
    })
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
    var _this = this;
    _this.data.page = 0;
    _this.getbrandDetail(_this.data.page);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this
    var p = _this.data.page + 1;
    _this.data.page = p;
    _this.getbrandDetail(p);
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
  onShareAppMessage: function () {
    var _this = this;
    var indexShare = app.signindata.indexShare || [];
    var indexShareNum = Math.floor(Math.random() * indexShare.length) || 0;
    var indexShareImg = '';
    if(indexShare.length!=0 && indexShare[indexShareNum]){
      indexShareImg = indexShare[indexShareNum]+'?time=' + Date.parse(new Date());
    };

    var share = {
      title: _this.data.brandinfo.shareDesc,
      imageUrl: _this.data.brandinfo.shareImg || indexShareImg,
      path: "/page/secondpackge/pages/brandDetails/brandDetails?id=" + _this.data.brandId + '&referee=' + _this.data.uid+"&settlement="+_this.data.settlement,
      success: function (res) { }
    }
    return share;
  }
})