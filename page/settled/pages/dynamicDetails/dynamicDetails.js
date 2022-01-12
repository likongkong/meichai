
var Dec = require('../../../../common/public');//aes加密解密js
var tcity = require("../../../../common/citys.js");
var api = require("../../../../utils/api.js");
import Poster from '../../../../pages/wxa_plugin_canvas/poster/poster';

const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '动态',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    videoArr:[],
    detailData:{},
    illustrated_id:'',
    textconcent:'',
    placeholderTxt:'评论一下~',

    // 画布


    userinfo: {},
    QRcode_img: '',
    posterConfig: {},
    savepic: '',
    tgfrShareIftr:false,

    goodsGift:'',
    grassFragments:false,
    receiveUserInfo:'',
    grassFragmentsMore:false,
    is_creatCavnvaImg:false

  },
  creatCavnvaImgFun(){
    this.setData({
      is_creatCavnvaImg:!this.data.is_creatCavnvaImg
    })
  },
  // 删除图鉴 
  del_illustrated(){
    var _this = this;

    var qqq = Dec.Aese('mod=community&operation=del_illustrated&uid='+_this.data.uid+'&loginid='+_this.data.loginid + '&id=' + _this.data.drying_id + '&type=2');
    console.log('mod=community&operation=del_illustrated&uid='+_this.data.uid+'&loginid='+_this.data.loginid + '&id=' + _this.data.drying_id + '&type=2')
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        console.log('删除动态=====',res)
        if (res.data.ReturnCode == 200) {
          wx.showModal({
            content: '删除成功',
            showCancel: false,
            success: function(res) {
              let pages = getCurrentPages();
              let prevpage = pages[pages.length - 2];
              if (prevpage) {
                wx.navigateBack();
                prevpage.onLoadfun()
              } else {
                wx.redirectTo({
                  url: "/pages/index/index"
                });
              };
            }
          });
  
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
  // 更新用户信息
  getUserProfileCom(w){
    console.log(1111111)
    app.getUserProfile((res,userInfo) => {
      this.inputboxfun(w);
    },'',1)
  },
  inputboxfun:function(w){
    console.log(w)
    var comment_id = w.currentTarget.dataset.comment_id || w.target.dataset.comment_id || 0;
    var _this = this;
    var name = w.currentTarget.dataset.name || w.target.dataset.name || 0;
    if(name){
      var placeholderTxt = '回复@'+name;
    }else{
      var placeholderTxt = '评论一下~';
    }
    _this.setData({ inputbox: true, comment_id: comment_id,placeholderTxt:placeholderTxt});
    setTimeout(function(){
      _this.setData({autofocus: true})
    },600)
  }, 
  swiperChange(e){
    console.log(e.detail.current)
    if(e.detail.current == 0){
      // this.data.videoCtx.play();
    }else{
      this.data.videoCtx.seek(0)
      this.data.videoCtx.pause();
    }
  },
  //监听input获得焦点
  bindfocus: function (e) {
    let _this = this;
    _this.setData({
      inputboxheight: e.detail.height||200
    })
  },
  //监听input值改变
  bindinput: function (e) {
    this.setData({
      textconcent: e.detail.value || '',
    });
  },
  inputboxbgfun:function(){
    this.setData({ inputbox:false})
  },
  // 失去焦点
  bindblur:function(){
    this.setData({
      inputboxheight: 0,
      autofocus: false
    })
  },

  jumpdetail(w){
    var id = w.currentTarget.dataset.id || w.target.dataset.id || '';
    var type = w.currentTarget.dataset.type || w.target.dataset.type || '';
    if(type == 1){
      var item_type = 1;
    }else if(type == 2){
      var item_type = 9003;
    }else if(type == 4){
      var item_type = 9032;
      id = 'id='+id
    }
    app.comjumpwxnav(item_type, id, '', '')

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
    console.log(2,subscribedata)
    var subscribedata = _this.data.subscribedata || '';
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    console.log(options,decodeURIComponent(options.scene))
    // wx.hideShareMenu();
    _this.data.loginid = app.signindata.loginid;
    _this.data.uid = app.signindata.uid;

    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      _this.data.orderid = _this.getSearchString('orderid', scene) || 0;
      console.log(_this.getSearchString('did', scene))
      _this.setData({
        drying_id: _this.getSearchString('did', scene) || 0
      })
    } else {
      _this.data.orderid = options.orderid;
      _this.setData({
        drying_id:options.did || 0
      })
    }


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
      videoCtx:wx.createVideoContext('myVideo', this)
    });
    this.getData();
    this.getComments();
  },
  // 获取数据
  getData(){
    var _this = this;

    var q1 = Dec.Aese('mod=community&operation=showDynamicInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&drying_id='+_this.data.drying_id);

    wx.showLoading({title: '加载中...',mask:true})
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        console.log('动态详情=====',res)
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          res.data.Info.title = res.data.Info.title.split('hc').join('\n');
           _this.setData({
             dataInfo:res.data.Info,
             videoArr:res.data.Info.videoArr,
             illustratedInfo:res.data.List.illustratedInfo
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
 // 关注 和 点赞 函数
 followfun: function(w) {
    var _this = this;
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    var type = w.currentTarget.dataset.type || w.target.dataset.type || 0;
    console.log('mod=community&operation=likeAttention&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&setType=' + type + '&id=' + id)
    var qqq = Dec.Aese('mod=community&operation=likeAttention&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&setType=' + type + '&id=' + id);
    wx.showLoading({ title: '加载中...',mask:true})
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        console.log('同款想要=====',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          if(type == 7){
            _this.getComments();
          }else{
            _this.getData();
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
  // 获取评论
  getComments: function(num=1) {
    var _this = this;

    if (num==1){
      _this.setData({pid : 0});
    }else{
      var pagenum = _this.data.pid;
      _this.data.pid = ++pagenum;
    };

    console.log('mod=community&operation=showComment&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&pid=' + _this.data.pid + '&id=' + _this.data.drying_id + '&type=1');

    var qqq = Dec.Aese('mod=community&operation=showComment&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&pid=' + _this.data.pid + '&id=' + _this.data.drying_id + '&type=1');

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

    console.log('mod=community&operation=addcomment&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&pid=' + _this.data.comment_id + '&id=' + _this.data.drying_id + '&type=1&comment='+ _this.data.textconcent +'&brand_id='+_this.data.dataInfo.brand_id)

    var qqq = Dec.Aese('mod=community&operation=addcomment&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&pid=' + _this.data.comment_id + '&id=' + _this.data.drying_id + '&type=1&comment='+ _this.data.textconcent +'&brand_id='+_this.data.dataInfo.brand_id);

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
            autofocus: false,
            placeholderTxt:'评论一下~'
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
    app.downRefreshFun(() => {
      this.getData()
    })  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.commentlist.length != 0){
      this.getComments(2)
    };
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this;
    var reshare = {
      title: _this.data.dataInfo.title && _this.data.dataInfo.title!=''?_this.data.dataInfo.title:'发布了一条新的动态',
      path: 'page/settled/pages/dynamicDetails/dynamicDetails?did='+_this.data.drying_id,
      imageUrl: _this.data.dataInfo.imgArr[0],
      success: function(res) {},
    };
    return reshare
  },
  // 跳转日历
  jumpoffering(w){
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    var type = w.currentTarget.dataset.type || w.target.dataset.type || 0;
    var istype = w.currentTarget.dataset.istype || w.target.dataset.istype || 0;
    if(istype == 1){ // 秒杀
      type = 1;
    }else if(istype == 2){ // 抽选
      type = 9003;
    }else if(istype == 3){ // 动态
      type = 9036;
    }
    app.comjumpwxnav(type,id,'','')
  },
  
  creatCanvasImg(){
      this.onCreatePoster() 
  },

/**
   * 异步生成海报
   */
  onCreatePoster() {
    var _this = this;
    var dataInfo = this.data.dataInfo || {};
    wx.showLoading({
      title: '生成中...',
    })
    // setData配置数据
    _this.setData({
      posterConfig: {
        width: 700,
        height: 1170,
        debug: false,
        // pixelRatio: 1000,
        preload: false,
        hideLoading: false,
        backgroundColor: '#fff',
        blocks: [{
          x: 30,
          y: 30,
          width: 640,
          height: 840,
          backgroundColor:'#fff',
          zIndex: 1,
          borderRadius: 20,
        },{
          x: 50,
          y: 50,
          width: 340,
          height: 80,
          backgroundColor:'#ccc',
          zIndex: 1,
          borderRadius: 80,
        }],
        texts: [{
          x: 138,
          y: 92,
          baseLine: 'middle',
          width:220,
          lineNum:1,
          text:dataInfo.brandName, // 品牌名
          fontSize: 26,
          textAlign: 'left',
          color: '#fff',
          zIndex: 3,
        },{
          x: 60,
          y: 780,
          baseLine: 'middle',
          width:560,
          lineNum:2,
          lineHeight:40,
          text:dataInfo.title, // 商品名
          fontSize:30,
          textAlign: 'left',
          color: '#000',
          zIndex: 12,
          fontWeight:'bold'
        },{
          x: 220,
          y: 1120,
          baseLine: 'middle',
          text:'了解更多，扫码查看',
          fontSize: 30,
          textAlign: 'left',
          color: '#000',
          zIndex: 2,
        }],
        images: [
          {  // 背景图
            x: 0,
            y: 0,
            url: 'https://cdn.51chaidan.com/images/brandInfoIcon/dynamicBackground.jpg',
            width: 700,
            height: 1170,
            zIndex: 1
          },{  // 头像
          x: 57,
          y: 57,
          url: dataInfo.brandLogo,
          width: 66,
          height:66,
          zIndex:2,
          borderRadius:66,
        }
        ,{  // banner
          x: 60,
          y: 150,
          url: dataInfo.imgArr[0],
          width: 580,
          height:580,
          zIndex: 3,
          borderRadius:20,
        }
        ,{
          x: 260,
          y: 900,
          url:'https://cdn.51chaidan.com/images/qrcode/dynamic/'+_this.data.drying_id+'.png',
          width: 180,
          height:180,
          zIndex: 2,
          borderRadius:180,
        }]
      }
    }, () => {
      Poster.create();
    });
  },
  onPosterFail(e){
    wx.hideLoading()
    this.tgfrShareIftrFun();
  },
  onPosterSuccess(e) {
    wx.hideLoading()
    const {
      detail
    } = e;
    console.log(detail)
    this.setData({
      savepic: detail
    });
    this.creatCavnvaImgFun();
  },
  savetoA() {
    var _this = this;
    wx.getSetting({
      success(res) {
        wx.hideLoading();
        if (!res.authSetting['scope.writePhotosAlbum']) {
          //请求授权
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              //获得授权，开始下载
              _this.downloadfile()
            },
            fail() {
              wx.showModal({
                title: '',
                content: '保存到系统相册需要授权',
                confirmText: '授权',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success(res) {
                        if (res.authSetting['scope.writePhotosAlbum'] === true) {
                          _this.downloadfile()
                        }
                      }
                    })
                  }
                },
                fail() {
                  app.showToastC('打开设置页失败')
                }
              })
            }
          })
        } else {
          //已有授权
          _this.downloadfile()
        }
      },
      fail() {
        wx.hideLoading();
        app.showToastC('获取授权失败')
      }
    })
    this.tgfrShareIftrFun();
  },
  downloadfile() {
    var _this = this;
    wx.saveImageToPhotosAlbum({
      filePath: _this.data.savepic,
      success(res) {
        app.showToastC("保存至相册成功");
        _this.creatCavnvaImgFun();
      },
      fail() {
        app.showToastC("保存至相册失败");
      }
    })
  },


})
