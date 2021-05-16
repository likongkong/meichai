var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newdataexh:Date.parse(new Date())/1000<1610035200?true:false,
    exhitime:Date.parse(new Date())/1000<1610035200?true:false,
    // 接口地址
    comurl: app.signindata.comurl,
    // 图片地址
    zdyurl: Dec.zdyurl(),
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,

    // 分享信息
    shareTitle:'',
    shareImageUrl:'',

    c_title: '', // -正品折扣多一点
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,

    timedata: [{ name: '2月5', id: 1 }, { name: '2月6', id: 2 }, { name: '2月7', id: 3 }],
    scrollleft: 1,
    category_id: 1,
    page: 0,
    swiperdata: [],
    exhibdata: [],
    scrollleft: 0,
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    pullUpData:[],
    judgeLoadData:true,
    isProduce: app.signindata.isProduce,
    sharedata:{},
    // 适配苹果X
    isIphoneX: app.signindata.isIphoneX,
    
  },

  // 展会公共跳转
  exhibitionpubjump: function (w) {
    var type = w.currentTarget.dataset.type || w.target.dataset.type || '';
    var jumpid = w.currentTarget.dataset.id || w.target.dataset.id || '';
    console.log(type, jumpid)
    app.exhibitionpubjump(type, jumpid)

    var clouddata = { type:0 ,adv_id: jumpid};
    app.cloudstatistics('advertisingStat', clouddata)

  },

  jumpexhdetail: function (w) {
    var type = w.currentTarget.dataset.type || w.target.dataset.type || '';
    if (type == 4) {
      var id = w.currentTarget.dataset.id || w.target.dataset.id || '';
      var brandid = w.currentTarget.dataset.brandid || w.target.dataset.brandid || "";
      wx.navigateTo({
        url: "/page/component/pages/limitlottery/limitlottery?id=" + id+'&brandId='+brandid,
      });
    } else if (type == 11 || type == 12  || type == 999) {
      var id = w.currentTarget.dataset.id || w.target.dataset.id || '';
      wx.navigateTo({
        url: "/pages/detailspage/detailspage?gid=" + id
      });
    } else if (type == 2) {
      var id = w.currentTarget.dataset.id || w.target.dataset.id || '';
      wx.navigateTo({
        url: "/page/secondpackge/pages/brandDetails/brandDetails?id=" + id + "&settlement=1"
      });
    } else if (type == 1) {
      var id = w.currentTarget.dataset.id || w.target.dataset.id || '';
      wx.navigateTo({
        url: "/pages/activitydetailspage/activitydetailspage?id=" + id,
      });
    } else if (type == 14) {
      var goodid = w.currentTarget.dataset.id || w.target.dataset.id || '';
      wx.navigateTo({
        url: "/page/component/pages/dlfinddetails/dlfinddetails?drying_id=" + goodid
      });
    } else if (type == 5) {
      var gid = w.currentTarget.dataset.gid || w.target.dataset.gid || '';
      wx.navigateTo({
        url: "/pages/smokebox/smokebox?gid=" + gid,
      });
    } else if (type == 8) {
      var id = w.currentTarget.dataset.id || w.target.dataset.id || '';
      wx.navigateTo({
        url: "/page/component/pages/crowdfunding/crowdfunding?aid=" + id,
      });
    } else if (type == 9) {
      wx.navigateTo({
        url: "/page/secondpackge/pages/exhibitionwelfare/exhibitionwelfare",
      });
    }


  },

  exhlistjump: function (w) {
    var type = w.currentTarget.dataset.type || w.target.dataset.type || 0;
    if (type == 1) { // 免单
      wx.navigateTo({
        url: "/page/secondpackge/pages/exhibition/exhibition?type=1"
      });
    } else if (type == 4) { // 限量
      wx.navigateTo({
        url: "/page/secondpackge/pages/exhibition/exhibition?type=4"
      });
    } else if (type == 2) {  // 品牌
      wx.navigateTo({
        url: "/page/secondpackge/pages/exhibition/exhibition?type=2"
      })
    } else if (type == 14) { //设计师展示 
      wx.navigateTo({
        url: "/page/secondpackge/pages/exhibition/exhibition?type=14"
      })
    } else if (type == 12) { //品牌福袋 
      wx.navigateTo({
        url: "/page/secondpackge/pages/exhibition/exhibition?type=12"
      })
    } else if (type == 5) { //抽盒机 
      wx.navigateTo({
        url: "/page/secondpackge/pages/exhibition/exhibition?type=5"
      })
    } else if (type == 11) { //抢购 
      wx.navigateTo({
        url: "/page/secondpackge/pages/exhibition/exhibition?type=11"
      })
    } else if (type == 15) { //抢购 
      wx.navigateTo({
        url: "/page/secondpackge/pages/exhibition/exhibition?type=15"
      })
    } else if (type == 17) { //种草 
      wx.navigateTo({
        url: "/page/component/pages/playgrasslist/playgrasslist"
      })
    } else if (type == 10) { //一番赏 
      wx.navigateTo({
        url: "/page/secondpackge/pages/aRewardList/aRewardList?its=1"
      })
    } else if (type == 999) { //限时不限量 
      wx.navigateTo({
        url: "/page/secondpackge/pages/exhibition/exhibition?type=999"
      })
    };
  },

  jumpdouble: function (w) {
    var type = w.currentTarget.dataset.type || w.target.dataset.type || 0;
    if (type == 9) {
      wx.navigateTo({
        url: "/page/secondpackge/pages/exhibitionwelfare/exhibitionwelfare",
      });
    } else {
      var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
      wx.navigateTo({
        url: "/page/component/pages/crowdfunding/crowdfunding?aid=" + id,
      });
    }
  },

  // 点赞
  ispraisefun: function (w) {
    var _this = this;
    if (_this.data.loginid != '' && _this.data.uid != '') {
      var is_praise = w.currentTarget.dataset.is_praise || w.target.dataset.is_praise || 0;
      var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
      var idx = w.currentTarget.dataset.idx || w.target.dataset.idx || 0;
      var lid = w.currentTarget.dataset.lid || w.target.dataset.lid || 0;
      var brandList = _this.data.pullUpData[ind];
      if (_this.data.loginid != '' && _this.data.uid != '') {
        Pub.postRequest(_this, 'praiseDrying', {
          uid: _this.data.uid,
          loginid: _this.data.loginid,
          drying_id: lid,
          is_praise: is_praise
        }, function (res) {
          if (is_praise == 0) {
            brandList.detail[idx].is_praise = 1;
            brandList.detail[idx].praise_sum = parseInt(brandList.detail[idx].praise_sum) + 1;
          } else {
            brandList.detail[idx].is_praise = 0;
            brandList.detail[idx].praise_sum = parseInt(brandList.detail[idx].praise_sum) - 1;
          };
          _this.setData({
            ['pullUpData[' + ind + ']']: brandList
          });
        });
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.hideShareMenu();
    var _this = this;
    app.signindata.suap = 12;
    // 判断是否授权
    this.activsign();
  },
  activsign: function () {
    // 判断是否授权 
    var _this = this;
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
      return false;
    };    

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
    };     
  },
  onLoadfun: function () {
    var _this = this;
    
    this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      avatarUrl: app.signindata.avatarUrl,
      isShareFun: app.signindata.isShareFun,
      isProduce: app.signindata.isProduce,
      windowHeight:app.signindata.windowHeight+20 || 820
    });

    this.auditversion();

    // 云统计
    var clouddata = { type: 0 };
    app.cloudstatistics('exhibitionList', clouddata)


    setTimeout(function(){
      app.indexShareBanner();
    },1000);
  },
  // 随机数
  ranomNumber(sposition){
    if(sposition.length>=8){
      var count = 8;
    }else{
      var count = sposition.length;
    };
    var randomArr = new Array; //随机数组 
    var returnArr = new Array; //返回数组
    var sposition = sposition || [];
    // 给原数组Arr赋值 
    var nArr = [];
    for (var i = 0; i < sposition.length; i++) {
      if(sposition[i].isTop){
        returnArr.push(sposition[i]);
      }else{
        nArr.push(sposition[i]);
      };
    };
    for (var i = 0; i < nArr.length ; i++) {
      randomArr.push(i);
    };

    randomArr.sort(function () { return 0.5 - Math.random();});
    var n = count-returnArr.length;
    if(returnArr.length < count){
       for(var i = 0; i < n ; i++){
          returnArr.push(nArr[randomArr[i]]);
       };
    };

    return returnArr;

  },

  // 数据请求
  auditversion:function(){
    var _this = this;
    this.setData({
      pullUpData:[],
      page : 0
    })
    if(Dec.env=='online'){
      var url = 'https://meichai-1300990269.cos.ap-beijing.myqcloud.com/produce/IndexToyShow.json?time='+app.signindata.appNowTime;// 正式
    }else{
      var url = 'https://meichai-1300990269.cos.ap-beijing.myqcloud.com/test/IndexToyShow.json?time='+app.signindata.appNowTime;  // 测试 
    };
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    _this.setData({
      swiperdata:[],
      exhibdata:[]      
    })
    wx.request({
      url: url,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('展会数据===========', res)
        if (res.data.ReturnCode == 200) {
          var listdata = res.data.List.model || [];
          var brandll = 0;
          for (var i = 0; i < listdata.length; i++) {
            if(listdata[i].type == 4 || listdata[i].type == 2 || listdata[i].type == 11 || listdata[i].type == 999){
              listdata[i].detail = _this.ranomNumber(listdata[i].detail);
            };
            if (listdata[i].type != 14) {
              for (var j = 0; j < listdata[i].detail.length; j++) {
                if(_this.data.newdataexh){
                    listdata[i].detail[j].start_time = '暂未';
                    listdata[i].detail[j].start = '暂未开售';
                }else{
                  if (listdata[i].type==15){
                    listdata[i].detail[j].start_time = _this.toDatehd(listdata[i].detail[j].start_time)
                  }else{
                    listdata[i].detail[j].start = _this.toDatehd(listdata[i].detail[j].start_time)
                  }
                }
                listdata[i].detail[j].stop_time = _this.toDatehd(listdata[i].detail[j].stop_time)
              };
              if (listdata[i].type == 2) {
                brandll = listdata[i].detail.length;
              }
            }
          };
          // var mlist = [];
          // var d = { type: 14, list: [] ,title: "设计师展示" };
          // for (var i = 0; i < listdata.length; i++) {
          //   if (listdata[i].type != 14) {
          //     mlist.push(listdata[i]);
          //   } else {
          //     d.list.push(listdata[i]);
          //   }
          // }
          // mlist.push(d);
          var liveBroad = res.data.Info;
          _this.setData({
            // shareTitle:res.data.Info.share.title,
            // shareImageUrl:res.data.Info.share.imgUrl,
            c_title: res.data.Info.show.title || '',
            swiperdata: res.data.List.banner || [],
            exhibdata: listdata || []
          },function(){
            if(liveBroad&&liveBroad.liveshow&&liveBroad.liveshow.roomId){
              wx.navigateTo({
                url: "plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id="+liveBroad.liveshow.roomId,
              });
            }
          })

          _this.getList(0)

          // if (num == 1) {

          // } else if (d.list.length > 0) {
          //   var exhibdata = _this.data.exhibdata;
          //   for (var i = 0; i < exhibdata.length; i++) {
          //     if (exhibdata[i].type == 14) {
          //       var l = exhibdata[i].list.concat(d.list);
          //       exhibdata[i].list = l;
          //     }
          //   }
          //   _this.setData({
          //     exhibdata: exhibdata,
          //   })
          // }
        } else {
        };  
      },
      complete:function(){
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })    
  },


  getList: function (num) {
    var _this = this;
    if(_this.data.judgeLoadData){
        _this.data.judgeLoadData = false;
        wx.showLoading({
          title: '加载中...',
        })
        if (num == 1) {
          _this.data.page = 0;
          _this.setData({ commoddata: [] });
        } else {
          var pagenum = parseInt(_this.data.page)
          _this.data.page = ++pagenum;
          _this.setData({ headhidden: false, loadmoreiftr: false, loadprompt: '加载更多.....' });
        };
        // 展会
        var exh = Dec.Aese('mod=show&operation=index&page=' + _this.data.page + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
        wx.request({
          url: app.signindata.comurl + 'toy.php' + exh,
          method: 'GET',
          header: { 'Accept': 'application/json' },
          success: function (res) {
            console.log('展会', res)
            if (res.data.ReturnCode == 200) {
              var listdata = res.data.List.model || [];
              if(listdata&&listdata.length!=0){
                for (var i = 0; i < listdata.length; i++) {
                  for (var j = 0; j < listdata[i].detail.length; j++) {
                    if (listdata[i].detail&&listdata[i].detail[j].start_time){
                      if(_this.data.newdataexh){
                        listdata[i].detail[j].start_time = '暂未';
                        listdata[i].detail[j].stop_time = _this.toDatehd(listdata[i].detail[j].stop_time)
                      }else{
                        listdata[i].detail[j].start_time = _this.toDatehd(listdata[i].detail[j].start_time);
                        listdata[i].detail[j].stop_time = _this.toDatehd(listdata[i].detail[j].stop_time)
                      };
                    };
                  };
                };
              };
              if (num == 1) {
                _this.setData({
                  pullUpData: listdata || []
                })            
              }else{
                // var ldata = _this.data.pullUpData.concat(listdata);
                var arrdata = _this.data.pullUpData||[];
                if(res.data.List.banner){
                   var obg = {
                    type:'ads',
                    detail:res.data.List.banner||[]
                   };
                   arrdata.push(obg);
                };
                if(listdata&&listdata.length!=0){
                  var num = '';
                  var iftrnum = false;
                  for(var i=0;i<arrdata.length;i++){
                    if(arrdata[i].type==14){
                      iftrnum = true;
                      num = i;
                    };
                  };
                  if(iftrnum){
                    var detaildata = arrdata[num].detail;
                    
                    for(var j=0;j<listdata.length;j++){
                      if(listdata[j].type==14){
                        detaildata = detaildata.concat(listdata[j].detail);
                      }
                    };
                    arrdata[num].detail = detaildata;
                  }else{
                    arrdata = arrdata.concat(listdata);
                  }
                };
                _this.setData({
                  pullUpData: arrdata || []
                })
                console.log(_this.data.pullUpData)
              };
              // var brandll = 0;
              // for (var i = 0; i < listdata.length; i++) {
              //   if (listdata[i].type != 14) {
              //     for (var j = 0; j < listdata[i].detail.length; j++) {
              //       if (listdata[i].type==15){
              //         listdata[i].detail[j].start_time = _this.toDatehd(listdata[i].detail[j].start_time)
              //       }else{
              //         listdata[i].detail[j].start = _this.toDatehd(listdata[i].detail[j].start_time)
              //       }
              //       listdata[i].detail[j].stop_time = _this.toDatehd(listdata[i].detail[j].stop_time)
              //     };
              //     if (listdata[i].type == 2) {
              //       brandll = listdata[i].detail.length;
              //     }
              //   }
              // };
              // var mlist = [];
              // var d = { type: 14, list: [] ,title: "设计师展示" };
              // for (var i = 0; i < listdata.length; i++) {
              //   if (listdata[i].type != 14) {
              //     mlist.push(listdata[i]);
              //   } else {
              //     d.list.push(listdata[i]);
              //   }
              // }
              // mlist.push(d);
              // if (num == 1) {
                // _this.setData({
                //   c_title: res.data.Info.show.title || '',
                //   swiperdata: res.data.List.banner || [],
                //   exhibdata: mlist || []
                // })
              // } else if (d.list.length > 0) {
                // var exhibdata = _this.data.exhibdata;
                // for (var i = 0; i < exhibdata.length; i++) {
                //   if (exhibdata[i].type == 14) {
                //     var l = exhibdata[i].list.concat(d.list);
                //     exhibdata[i].list = l;
                //   }
                // }
                // _this.setData({
                //   exhibdata: exhibdata,
                // })
              // }
            } else {
            };
          },
          complete:function(){
            _this.data.judgeLoadData = true;
            wx.hideLoading();
            wx.stopPullDownRefresh();
          }
        });
    }
  },






  //时间戳转换时间  
  toDatehd: function (number,num) {
    var date = new Date(number * 1000);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    if (new Date(number * 1000).toDateString() === new Date().toDateString()) {
      return h + ':' + m;
    } else {
      if (num==1){
        return M + '.' + D + ' ' + h + ':' + m;
      }else{
        return M + '' + D;
      };
    };
  },


  // 计算图片大小
  imageLoadad: function (e) {
    var _this = this;
    var idx = e.currentTarget.dataset.idx || e.target.dataset.idx || 0;
    var ind = e.currentTarget.dataset.ind || e.target.dataset.ind || 0;
    var height = e.currentTarget.dataset.height || e.target.dataset.height || 0;
    var $width = e.detail.width,
      $height = e.detail.height,
      ratio = $width / $height;
    var viewHeight = height,
      viewWidth = height * ratio;
    var exhibdata = this.data.exhibdata[ind];

    if (exhibdata.detail[idx]) {
      if (exhibdata.detail[idx]) {
        exhibdata.detail[idx].width = viewWidth;
        _this.setData({
          ['exhibdata[' + ind + ']']: exhibdata,
        });
      };
    };
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
    this.auditversion()
    this.setData({
      pullUpData:[],
      page : 0
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList(0)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this;
    var share = {
      title: app.signindata.toyShowTitleShare,
      imageUrl: app.signindata.toyShowShareImg,
      success: function (res) { }
    };
    return share;
  },
  onShareTimeline:function(){
    var _this = this;
    return {
      title:_this.data.c_title || '潮玩社交平台',
      query:{}    
    }
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
        if (true) {
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
  // 跳转一番赏列表
  toaRewarddeyails(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/page/secondpackge/pages/aRewardList/aRewardList?its=1"
    })
  },
  catchTouchMove:function(res){
    return false
   }

})