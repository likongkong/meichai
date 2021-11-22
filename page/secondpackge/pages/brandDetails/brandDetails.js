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

    c_title: '', 
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
    // 适配苹果X 
    isIphoneX: app.signindata.isIphoneX,
    shopnum: 0,
    isProduce: app.signindata.isProduce,

    adList: [],

    videoContext: "",

    signinlayer: true,
    windowHeight: app.signindata.windowHeight,
    type:'',
    settlement:0,
    morebrankip:false,
    brandArr:[],

    payStatus:[
      {name:'全部',num:'0'},
      {name:'限时',num:'8'},
      {name:'限量',num:'2'},
      {name:'抽选',num:'3'},
      {name:'动态',num:'4'},
      {name:'抽盒',num:'7'}
    ], // 支付状态 
    centerIndex:0,
    wOri:1 , // 1 瀑布流 2 信息流
    brandSinginBox:false,
    guidanceMask:false,
    finished_pid:0
  },
  siginInTip(){
    app.showToastC('今日已签到');
  },
  // 没有权限
  permissionDeniedFun(){
    app.showToastC('您没有权限',1500);
  },
  // 跳转编辑签到
  jumpSiginBrand(){
    var detailInfo = this.data.detailInfo
    wx.navigateTo({ // 抽签详情页  
      url: "/page/settled/pages/releaseSignIn/releaseSignIn?id=" + detailInfo.brand.id + '&name=' + detailInfo.brand.brandName + '&type=' + detailInfo.signActivityStatus + '&img=' + encodeURIComponent(detailInfo.brand.shareImg)
    });  
  },
  jumpFanMan(e){
    let isoneselfbrand = e.currentTarget.dataset.isoneselfbrand?1:2;
    let brandid = e.currentTarget.dataset.brandid;
    wx.navigateTo({ 
      url: "/page/settled/pages/fanManagement/fanManagement?isoneselfbrand="+isoneselfbrand+"&brandid="+brandid
    }); 
  },
  brandSinginBoxFun(){
     this.setData({
        brandSinginBox:!this.data.brandSinginBox
     })
  },
  // 签到
  brandSingin: function () {
    var _this = this;
    console.log('mod=community&operation=signIn&brand_id=' + _this.data.brandId + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&share_uid=' + _this.data.referee)
    var exh = Dec.Aese('mod=community&operation=signIn&brand_id=' + _this.data.brandId + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&share_uid=' + _this.data.referee);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + exh,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('签到=============',res)
        if (res.data.ReturnCode == 200) {
          _this.setData({
            brandSinginData:res.data
          })
          _this.brandSinginBoxFun();
          _this.data.page = 0;
          _this.getbrandDetail(_this.data.page);
        } else if(res.data.ReturnCode == 303){
          _this.setData({
            guidanceMask:true
          })
        } else {
          app.showToastC(res.data.Msg || res.data.msg);
        };
      },
      fail: function () { }
    });
  },

  toggleAddNewEventMask(){
    this.setData({
      isAddNewEventMask: !this.data.isAddNewEventMask
    })
  },
  // 瀑布流信息流切换
  wOriTab(){
    this.setData({
      wOri:(this.data.wOri == 1)?2:1
    });

  },
  classifyChange(e){
    let that = this;
    let index = e.currentTarget.dataset.index || 0;
    let ele = '#ele' + index;
    that.setData({
      centerIndex:index,
    })
    that.data.finished_pid = 0;
    that.eldatalistfun(0)
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select(ele).boundingClientRect();
    query.exec(function(res) {
      that.setData({
        scrollleft:e.currentTarget.offsetLeft - wx.getSystemInfoSync().windowWidth/2 + (res[0].width/2)
      })
    })
  }, 

  morebranfun:function(){
    this.setData({
      morebrankip:!this.data.morebrankip
    })
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
    if (url && url != "") {
      this.setData({
        showimg: url != "" ? url : "https://cdn.51chaidan.com/images/act/1577083808.jpg",
        addfrindcommoni: !this.data.addfrindcommoni
      });
    } else {
      app.showToastC((_this.data.brandinfo.brandName || '') + '未提供此方式');
    }
  },
  noClickTip(w){
    var identif = w.currentTarget.dataset.identif || w.target.dataset.identif || 0;
    switch(parseInt(identif)){
      case 1: var txt = '微信'; break;
      case 2: var txt = '公众号'; break;
      case 3: var txt = '微博'; break;
      case 4: var txt = '小红书'; break;
      case 5: var txt = '抖音'; break;
      default: var txt = '';
    };
    app.showToastC('暂未设置'+ txt +'信息');
  },
  jumpxcx(w){
    var type = w.currentTarget.dataset.type || w.target.dataset.type || 0;
    var path = w.currentTarget.dataset.path || w.target.dataset.path || '';
    var appId = '';
    if(type == 1){
      appId = 'wx9074de28009e1111';
    }else if(type == 2){
      appId = 'wxb296433268a1c654';
    }
    wx.navigateToMiniProgram({
         appId: appId,
         path: path,
         envVersion: 'release',// 打开正式版
         success(res) {},
         fail: function (err) {
            console.log(err);
          }
    })
  },
  //  复制内容到粘贴板
  copyTBL: function (e) {
    var _this = this;
    var txt = e.currentTarget.dataset.txt || e.target.dataset.txt || '';
    wx.setClipboardData({
      data: txt,
      success: function (res) {
        app.showToastC('复制成功');
      }
    });

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
        referee:_this.getSearchString('referee', scene) || 0
      })
    }else{
      _this.setData({
        brandId: options.id || 0,
        type: options.type||'',
        settlement:options.settlement||0,
        referee:options.referee||0
      })
    }
    console.log('品牌值============',_this.data.brandId,_this.data.type)


    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      _this.onLoadfun();
    }else{
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
    // _this.getADList();

    _this.eldatalistfun(0)
  },

  // 品牌社区列表
  eldatalistfun: function (num) {
    var _this = this;
    if (num == 0) {
      _this.data.page = 0;
      _this.setData({
        loadprompt: '加载更多.....',
        communityList: [],
        nodataiftr: false
      });
      wx.showLoading({
        title: '加载中...',
        mask:true
      })

    } else {
      var pagenum = parseInt(_this.data.page)
      _this.data.page = ++pagenum;
      _this.setData({
        loadprompt: '加载更多.....',
      });
    };

    var qqq = Dec.Aese('mod=community&operation=info&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&showType='+_this.data.centerIndex+'&pid='+ _this.data.page + '&brand_id='+_this.data.brandId + '&finished_pid=' + _this.data.finished_pid);

    console.log('mod=community&operation=info&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&showType='+_this.data.centerIndex+'&pid='+ _this.data.page + '&brand_id='+_this.data.brandId + '&finished_pid=' + _this.data.finished_pid)

    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh();
        console.log('动态瀑布流数据=====',res)
        if (res.data.ReturnCode == 200) {
          var communityList = res.data.List.communityList || [];
          if(communityList.length != 0){
             communityList.forEach(element => {
                element.add_time = _this.toDate(element.add_time || 0);
                element.start_time = _this.toDate(element.start_time || 0);
                element.end_time = _this.toDate(element.end_time || 0);
                element.title = element.title.split('hc').join('\n');
             });
          };
          _this.setData({
            nodataiftr:true
          })
          if(communityList.length == 0 && _this.data.finished_pid == 0){
            _this.data.finished_pid = _this.data.page>0?_this.data.page:1;
            _this.eldatalistfun();
          };
          if (num == 0) {
            _this.setData({
              communityList
            });
          } else {
            if(communityList.length != 0){
              var ltlist = [..._this.data.communityList,...communityList];
              _this.setData({
                communityList: ltlist
              });
            };
          };
        };
      }
    });
  }, 



  // ip 的品牌
  jumpsouchtemip:function(w){
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    this.setData({
      brandId: id||0,
      morebrankip:false,
    });
    this.data.page = 0;
    this.getbrandDetail(this.data.page);
  },
  getbrandDetail: function (page) {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    var exh = Dec.Aese('mod=show&operation=brandSummary&brandId=' + _this.data.brandId + '&page=' + page + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=' + _this.data.type+"&settlement="+_this.data.settlement);
    console.log('mod=show&operation=brandSummary&brandId=' + _this.data.brandId + '&page=' + page + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=' + _this.data.type+"&settlement="+_this.data.settlement)
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
          var brandArr = res.data.List.brandList || [];
          for (var r = 0; r < brandList.length; r++) {
            brandList[r].start_time = time.toDate(brandList[r].start_time);
            brandList[r].stop_time = time.toDate(brandList[r].stop_time);
          };
          res.data.Info.brand.bradDesc = res.data.Info.brand.bradDesc.split('hc').join('\n');
          var payStatus = _this.data.payStatus || [];
          if(res.data.Info.isExistFinishedGoods){
            payStatus.push({name:'已结束',num:'9'})
          };
          _this.setData({
            detailInfo:res.data.Info,
            brandinfo: res.data.Info.brand,
            banner: res.data.List.banner,
            founder: res.data.List.founder,
            isVideo: res.data.Info.isVideo,
            video: res.data.List.video,
            brandArr,
            brandSettledLimit:res.data.Info.brandSettledLimit || false,
            isOneselfBrand:res.data.Info.isOneselfBrand || false, // 用户是否是当前品牌管理者
            userJurisdictionList:res.data.Info.userJurisdictionList,
            payStatus
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

  // 点赞
  ispraisefun: function (w) {
    // var _this = this;
    // var is_praise = w.currentTarget.dataset.is_praise || w.target.dataset.is_praise || 0;
    // var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    // var lid = w.currentTarget.dataset.lid || w.target.dataset.lid || 0;
    // var brandList = _this.data.brandList;
    // if (_this.data.loginid != '' && _this.data.uid != '') {
    //   Pub.postRequest(_this, 'praiseDrying', {
    //     uid: _this.data.uid,
    //     loginid: _this.data.loginid,
    //     drying_id: lid,
    //     is_praise: is_praise
    //   }, function (res) {
    //     if (is_praise == 0) {
    //       brandList[ind].is_praise = 1;
    //       brandList[ind].praise_sum = parseInt(brandList[ind].praise_sum) + 1;
    //     } else {
    //       brandList[ind].is_praise = 0;
    //       brandList[ind].praise_sum = parseInt(brandList[ind].praise_sum) - 1;
    //     };
    //     _this.setData({
    //       brandList: brandList
    //     });
    //   });
    // }
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
    // 调用重置刷新
    app.resetdownRefresh();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 调用重置刷新
    app.resetdownRefresh();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    app.downRefreshFun(() => {
      var _this = this;
      _this.data.page = 0;
      _this.getbrandDetail(_this.data.page);
      _this.data.finished_pid = 0;
      _this.eldatalistfun(0)
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this
    // var p = _this.data.page + 1;
    // _this.data.page = p;
    // _this.getbrandDetail(p);
    _this.eldatalistfun(1)
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
    var exh = Dec.Aese('mod=share&operation=brand&brand_id=' + _this.data.brandId + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
    wx.request({
      url: app.signindata.comurl + 'user.php' + exh,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {}
    });
    var share = {
      title: _this.data.brandinfo.shareDesc,
      imageUrl: _this.data.brandinfo.shareImg || indexShareImg,
      path: "/page/secondpackge/pages/brandDetails/brandDetails?id=" + _this.data.brandId + '&referee=' + _this.data.uid+"&settlement="+_this.data.settlement,
      success: function (res) { }
    }
    return share;
  },
  isziaprtpfun(w){
    var url = w.currentTarget.dataset.url || w.target.dataset.url||0;
    this.setData({
      is_ziaprtp:!this.data.is_ziaprtp,
      ziaprtp_url:url
    })
  },
  toDate(number,num) {
    var date = new Date(number * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + '/' + M + '/' + D +' ' + h + ':' + m + ':' +s;
  },

  // 关注 和 点赞 函数
  followfun: function(w) {
    var _this = this;
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    var type = w.currentTarget.dataset.type || w.target.dataset.type || 0;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var communityList = _this.data.communityList || [];
    console.log('mod=community&operation=likeAttention&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&setType=' + type + '&id=' + id)
    var qqq = Dec.Aese('mod=community&operation=likeAttention&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&setType=' + type + '&id=' + id);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        console.log('关注=====',res)
        if (res.data.ReturnCode == 200) {

          if(type == 0){
            _this.data.page = 0;
            _this.getbrandDetail(_this.data.page);
          }else{
            if(communityList[ind].is_like){
              var like_number = parseInt(communityList[ind].like_number) - 1  
            }else{
              var like_number = parseInt(communityList[ind].like_number) + 1 
            };
            if(like_number<0){
              like_number = 0;
            };
            _this.setData({
              ['communityList['+ind+'].like_number']:like_number,
              ['communityList['+ind+'].is_like']:!communityList[ind].is_like
            });
          }

        }else{
          app.showToastC(res.data.Msg,2000);
        };
      }
    });
  },
  // 跳转日历
  jumpoffering(w){
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    var type = w.currentTarget.dataset.type || w.target.dataset.type || 0;
    var istype = w.currentTarget.dataset.istype || w.target.dataset.istype || 0;
    if(istype == 1){ // 秒杀
      var selltype = w.currentTarget.dataset.selltype || w.target.dataset.selltype || 0;
      if(selltype > 0){
        type = 1;
      }else{
        type = 9047;
      };
    }else if(istype == 2){ // 抽选
      type = 9003;
      wx.navigateTo({ // 抽签详情页
        url: "/page/component/pages/limitlottery/limitlottery?id=" + id
      });  
    }else if(istype == 3){ // 动态
      type = 9036;
    }else if(type == 9028){
      id = 'id='+id;
    }else if(istype == 5){ // 动态
      type = 9005;
    }
    if(istype != 2){
      app.comjumpwxnav(type,id,'','')
    };
    this.setData({
      isAddNewEventMask:false
    })
  },

  toogleGuidanceMask(){
    this.setData({
      guidanceMask:!this.data.guidanceMask
    }) 
  },
  SaveCard: function(e) {
    let that = this;
    console.log('保存');
    var imgSrc = e.currentTarget.dataset.img;
    //获取相册授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功');
              that.img(imgSrc)
            }
          })
        }else{
          that.img(imgSrc)
        }
      }
    })
  },
  img: function (imgSrc){
    var imgSrc = imgSrc;
    wx.downloadFile({
      url: imgSrc,
      success: function (res) {
        console.log(res); //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            console.log(data);
            wx.showToast({
              title: '保存成功',
              duration: 2000
            })
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    wx.showToast({
                      title: '图片已保存',
                      icon:'none',
                      duration:2000
                    })
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          }
        })
      }
    })

  }, 

})