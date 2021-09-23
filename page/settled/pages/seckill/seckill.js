
var Dec = require('../../../../common/public');//aes加密解密js
var tcity = require("../../../../common/citys.js");
var WxParse = require('../../../../wxParse/wxParse.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '秒杀',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    addfrindcommoni:false
  },  


  subscrfundom:function(w){
    var _this = this;
    var sellList = _this.data.sellList;
    var index = w.currentTarget.dataset.index || w.target.dataset.index || 0;

    if(sellList&&sellList[index]&&sellList[index].subscribeList){
      _this.setData({
        id:sellList[index].id,
        subscribedata:sellList[index].subscribeList
      })
      _this.subscrfunstar()
    }
  },
  // 拉起订阅
  subscrfunstar: function () {
    var _this = this;
    
    var subscribedata = _this.data.subscribedata || '';
    console.log(2,subscribedata)
    if (subscribedata && subscribedata.template_id && app.signindata.subscribeif) {
      if (subscribedata.template_id instanceof Array) {
        wx.requestSubscribeMessage({
          tmplIds: subscribedata.template_id || [],
          success(res) {
            for (var i = 0; i < subscribedata.template_id.length; i++) {
              if (res[subscribedata.template_id[i]] == "accept") {
                app.subscribefun(_this, 0, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
              };
            };
          },
        })
      } else {
        wx.requestSubscribeMessage({
          tmplIds: [subscribedata.template_id || ''],
          success(res) {
            if (res[subscribedata.template_id] == "accept") {
              app.subscribefun(_this, 0, subscribedata.template_id, subscribedata.subscribe_type);
            };
          },
          complete() {}
        })
      };
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.hideShareMenu();
    
    // '已经授权'
    _this.data.loginid = app.signindata.loginid;
    _this.data.uid = app.signindata.uid;
    _this.data.orderid = options.orderid,
    _this.setData({
      gid: options.gid,
      id: options.gid,
      referee: options.referee || ''
    });
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
    } else {
      app.signin(_this)
    }
  },
  onLoadfun(){
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.uid = app.signindata.uid;
    _this.setData({
      uid: app.signindata.uid,
      avatarUrl: app.signindata.avatarUrl,
      isProduce: app.signindata.isProduce,
      isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
    });
    // this.getData();
    // this.getComments();
    // 品牌详情
    this.getbrandDetail();
    // 商品详情
    this.detailfunshop()
  },
  // 获取数据
  getData(){
    var _this = this;
    console.log('mod=community&operation=showIllustratedInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&illustrated_id='+_this.data.illustrated_id)
    var q1 = Dec.Aese('mod=community&operation=showIllustratedInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&illustrated_id='+_this.data.illustrated_id);
    wx.showLoading({title: '加载中...',mask:true})
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        console.log('图鉴详情=====',res)
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          var sellList = res.data.List.sellList || [];
            if(sellList.length != 0){
                sellList.forEach(element => {
                    element.start_time = _this.toDate(element.start_time)
                });
            };
            res.data.Info.description = res.data.Info.description.split('hc').join('\n');
            res.data.Info.sell_way = res.data.Info.sell_way.split('hc').join('\n');
            if(res.data.Info && res.data.Info.sameInfo && res.data.Info.sameInfo.sameUserImg){
                res.data.Info.sameInfo.sameUserImg.reverse()
            };
            if(res.data.Info && res.data.Info.wantInfo && res.data.Info.wantInfo.wantUserImg){
                res.data.Info.wantInfo.wantUserImg.reverse()
            };
           _this.setData({
             dataDetail:res.data.Info,
             sellList:sellList
           })
        }else{
          wx.showModal({
            content: res.data.Msg || res.data.msg,
            showCancel:false,
            success: function (res) {}
          });          
        };
      },

    })
 },  

 // 获取评论
 getComments: function(num=1) {
  var _this = this;

  if (num==1){
    _this.setData({pid : 0,commentlist : []});
  }else{
    var pagenum = _this.data.pid;
    _this.data.pid = ++pagenum;
  };

  console.log('mod=community&operation=showComment&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&pid=' + _this.data.pid + '&id=' + _this.data.illustrated_id + '&type=2');

  var qqq = Dec.Aese('mod=community&operation=showComment&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&pid=' + _this.data.pid + '&id=' + _this.data.illustrated_id + '&type=2');

  wx.request({
    url: app.signindata.comurl + 'toy.php' + qqq,
    method: 'GET',
    header: {'Accept': 'application/json'},
    success: function (res) {
      console.log('获取评论=====',res)
      if (res.data.ReturnCode == 200) {
          if(num == 1){
            _this.setData({
              commentNumber:res.data.Info.commentNumber || 0,
              commentlist:res.data.List
            })
          }else{
            if(res.data.List && res.data.List.length !=0){
              var list = [...res.data.List,_this.data.commentlist]
              _this.setData({
                commentlist:list
              })
            }else{
              app.showToastC('暂无更多数据');
            }
          }


      }else{
        if(res.data.Msg){
          wx.showModal({
            content: res.data.Msg || '',
            showCancel: false,
            success: function(res) {}
          });
        };
      };
    }
  });
},

  // 提交评论
  submissionfun:function(){
    var _this = this;

    _this.setData({ inputbox: false, autofocus: false });
    
    if(_this.data.textconcent == ''){
      app.showToastC('评论内容不能为空');
      return false;
    }

    console.log('mod=community&operation=addcomment&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&pid=' + _this.data.comment_id + '&id=' + _this.data.illustrated_id + '&type=2&comment='+ _this.data.textconcent +'&brand_id='+_this.data.dataDetail.brand_id)

    var qqq = Dec.Aese('mod=community&operation=addcomment&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&pid=' + _this.data.comment_id + '&id=' + _this.data.illustrated_id + '&type=2&comment='+ _this.data.textconcent +'&brand_id='+_this.data.dataDetail.brand_id);

    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        console.log('发布评论=====',res)
        if (res.data.ReturnCode == 200) {
          _this.setData({
            textconcent:'',
            inputboxheight:0,
            autofocus: false
          });
          _this.getComments();
        }else{
          if(res.data.Msg){
            wx.showModal({
              content: res.data.Msg || '',
              showCancel: false,
              success: function(res) {}
            });
          };
        };
      }
    });


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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    app.downRefreshFun(() => {
      this.getData()
    })  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this;
    var indexShare = app.signindata.indexShare || [];
    var indexShareNum = Math.floor(Math.random() * indexShare.length) || 0;
    var indexShareImg = '';
    if(indexShare.length!=0 && indexShare[indexShareNum]){
      indexShareImg = indexShare[indexShareNum]+'?time=' + Date.parse(new Date());
    };
    return {
      title:app.signindata.titleShare?app.signindata.titleShare:'你喜欢的潮玩都在这里！',
      path: 'pages/index/index',
      imageUrl:indexShareImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
      success: function (res) {}
    }    
  },

  getbrandDetail: function () {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })

    // var exh = Dec.Aese('mod=show&operation=brandSummary&brandId=' + _this.data.brandId + '&page=' + page + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=' + _this.data.type+"&settlement="+_this.data.settlement);

    var exh = Dec.Aese('mod=show&operation=brandSummary&brandId=777&page=0&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=drying' + "&settlement=0");
    wx.request({
      url: app.signindata.comurl + 'toy.php' + exh,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh();
        console.log(res) 
        if (res.data.ReturnCode == 200) {


          _this.setData({
            brandinfo: res.data.Info.brand,
            isOneselfBrand:res.data.Info.isOneselfBrand || false // 用户是否是当前品牌管理者

          })
          
        } else {

        };
      },
      fail: function () { }
    });
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
  closefrindcommoni:function(){
    this.setData({
      addfrindcommoni: !this.data.addfrindcommoni
    });
  },
  jumpFanMan(){
    wx.navigateTo({ 
      url: "/page/settled/pages/fanManagement/fanManagement"
    }); 
  },  // 跳转日历
  jumpoffering(w){
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    var type = w.currentTarget.dataset.type || w.target.dataset.type || 0;
    var istype = w.currentTarget.dataset.istype || w.target.dataset.istype || 0;
    if(istype == 1){ // 秒杀
      type = 1;
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

        };
      }
    });
  },
  detailfunshop:function(){
    var _this = this;
    _this.setData({headhidden: false}); 
    wx.showLoading({ title: '加载中...', })
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    // var q = Dec.Aese('mod=getinfo&operation=info&gid=' + _this.data.gid + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid+ '&push_id='+_this.data.push_id)

    var q = Dec.Aese('mod=getinfo&operation=info&gid=' + 39068 + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid+ '&push_id=0')
    wx.request({
      url: app.signindata.comurl + 'goods.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        _this.data.push_id =  0;
        console.log('详情',res)
        _this.setData({ headhidden: true }); 
        wx.hideLoading();
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh()
        clearInterval(_this.data.wintheprtintervaldetail);
        if (res.data.ReturnCode == 200) {

          if (!reg.test(res.data.Ginfo.goods_thumb)) {
            res.data.Ginfo.goods_thumb = _this.data.zdyurl + res.data.Ginfo.goods_thumb;
          };


          // 颜色
          if (res.data.Ginfo.color) {
            if (res.data.Ginfo.color.length != 0) {
              _this.setData({
                // 颜色id
                colorid: res.data.Ginfo.color[0].no,
                colorcon: res.data.Ginfo.color[0].property,
              })
            }
          } else {
            res.data.Ginfo.color = [];
            _this.setData({
              colorid: 0,
            })
          };
          // 尺寸
          if (res.data.Ginfo.size) {
            if (res.data.Ginfo.size.length != 0) {
              _this.setData({
                // 尺寸id
                sizeid: res.data.Ginfo.size[0].no,
                sizecon: res.data.Ginfo.size[0].property,
              })
            };
          } else {
            res.data.Ginfo.size = [];
            _this.setData({
              sizeid: 0,
            })
          };
          // 商品库存
          var exstring = 'c' + _this.data.colorid + '_' + _this.data.sizeid;
          if (res.data.Ginfo.extends[exstring]) {
            _this.setData({
              quantityofgoods: res.data.Ginfo.extends[exstring].num || 0
            });
          } else {
            _this.setData({
              quantityofgoods: 0
            });
          }
          var iftrnum = true;
          if (res.data.Ginfo.selected_spec) {
            var colsel = 'c' + res.data.Ginfo.selected_spec.color + '_' + res.data.Ginfo.selected_spec.size
            _this.setData({
              sizeid: res.data.Ginfo.extends[colsel].s,
              colorid: res.data.Ginfo.extends[colsel].c,
              quantityofgoods: res.data.Ginfo.extends[colsel].num
            });
            res.data.Ginfo.tax = res.data.Ginfo.extends[colsel].tax || 0;
            res.data.Ginfo.gsale = res.data.Ginfo.extends[colsel].price;
            if (res.data.Ginfo.extends[colsel].img != 0 && res.data.Ginfo.extends[colsel].img != '' && res.data.Ginfo.extends[colsel].img) {
              if (!reg.test(res.data.Ginfo.extends[colsel].img)) {
                res.data.Ginfo.goods_thumb = _this.data.zdyurl + res.data.Ginfo.extends[colsel].img;
              } else {
                res.data.Ginfo.goods_thumb = res.data.Ginfo.extends[colsel].img;
              };
            };
            var gid = res.data.Ginfo.extends[colsel].belong_goods_id;
            if (gid != '' && gid != 0 && gid != res.data.Ginfo.gid && gid) {
              _this.setData({
                gid: gid
              });
              _this.adjdatagid();
            };
            iftrnum = false;
          };
          // 是否点赞
          if (res.data.Ginfo.praise == 1) {
            _this.data.gttu= true;
          } else {
            _this.data.gttu=false;
          }
          // 是否是多件装
          var issuit = [];
          if (res.data.Ginfo.is_suit == 1) {
            for (var s = 0; s < parseInt(res.data.Ginfo.suit_num); s++) {
              issuit.push(s + 1);
            };
            res.data.Ginfo.issuit = issuit;
            if(_this.data.awa==1){
              res.data.Ginfo.limitnum = _this.data.numberofdismantling || 1;
            }
          } else {
            res.data.Ginfo.issuit = [];
          };
          var redauin = res.data.Ginfo;
          var imgArr = [];
          for (var j = 0; j < res.data.Ginfo.gimages.length; j++) {
            if (!reg.test(res.data.Ginfo.gimages[j].url)) {
              res.data.Ginfo.gimages[j].url = _this.data.zdyurl + res.data.Ginfo.gimages[j].url;
            };
            imgArr.push(res.data.Ginfo.gimages[j].url)
          };
          redauin.gdesc = decodeURIComponent(redauin.gdesc.replace(/\+/g, ' '));
          WxParse.wxParse('article', 'html', redauin.gdesc, _this, 0);
          redauin.retailer_url = decodeURIComponent(redauin.retailer_url);
          _this.data.ginfo=res.data.Ginfo;
          _this.data.imgArr=imgArr;

          _this.setData({
            movies: res.data.Ginfo.gimages,
            zunmdata: redauin,
            subscribedata: res.data.specSubscribe || '',
            taxation: redauin.tax || 0,
            isVideoSwiper: res.data.Ginfo.videoBanner||false,
            is_exhibition: res.data.Ginfo.specialWay || 0,
            brandId: res.data.Ginfo ? res.data.Ginfo.brandId : '',
            // exhibdetail: res.data.Ginfo.specialWay==1?true:false,
            exhibdetail:false,
            isSubscribeCoupon: res.data.isSubscribeCoupon || false,
            subscribeCouponTip: res.data.subscribeCouponTip || '',
            deductRatio:res.data.Ginfo.deductRatio,
            isDeduct:res.data.Ginfo.isDeduct,
            isUseBlindboxMoney:res.data.Ginfo.isDeduct?true:false,
            isDeductNum:res.data.Ginfo.isDeduct&&_this.data.blindboxMoney!=0?1:0,
            isCanShare:res.data.Ginfo.isCanShare,
            nowTime : Date.parse(new Date())/1000,//当前时间戳
            totalSpecStock:res.data.Ginfo.totalSpecStock || 0
          });




        };
        if (res.data.ReturnCode == 100) {
          app.showToastC('该商品已下架');
          wx.reLaunch({
            url: "/pages/index/index?judgeprof=2"
          });
        };
        if (res.data.ReturnCode == '000') {
          app.showToastC('商品暂时找不到了');
          wx.reLaunch({
            url: "/pages/index/index?judgeprof=2"
          });
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
      }
    })    
  },




})
