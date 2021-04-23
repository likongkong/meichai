var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newdataexh:Date.parse(new Date())/1000<1610035200?true:false,
    // 接口地址
    comurl: app.signindata.comurl,
    // 图片地址
    zdyurl: Dec.zdyurl(),
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,

    c_title: '限定抽选', // -正品折扣多一点
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,

    timedata: [],
    scrollleft: 1,
    dateKey: '',
    listdata: [],

    pagetype: 0,
    brandpage: 0,
    brandList: [],
    nameserch: "",
    adList: [],
    currentIndex: 0,
    windowHeight: app.signindata.windowHeight - 65 - wx.getStorageSync('statusBarHeightMc') || 0,
    signinlayer: true,
    // 授权弹框
    tgabox: false,

    heatList: [],

    designerList: [],

    smokelist: [],
    brannerlist: [],
    freelist: [],

    page: 0,

    mbrandId: 0,
    liveListData:[]
  },


  // 点赞
  ispraisefun: function (w) {
    var _this = this;
    if (_this.data.loginid != '' && _this.data.uid != '') {
      var is_praise = w.currentTarget.dataset.is_praise || w.target.dataset.is_praise || 0;
      var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
      var lid = w.currentTarget.dataset.lid || w.target.dataset.lid || 0;
      var designerList = _this.data.designerList;
      if (_this.data.loginid != '' && _this.data.uid != '') {
        Pub.postRequest(_this, 'praiseDrying', {
          uid: _this.data.uid,
          loginid: _this.data.loginid,
          drying_id: lid,
          is_praise: is_praise
        }, function (res) {
          if (is_praise == 0) {
            designerList[ind].is_praise = 1;
            designerList[ind].praise_sum = parseInt(designerList[ind].praise_sum) + 1;
          } else {
            designerList[ind].is_praise = 0;
            designerList[ind].praise_sum = parseInt(designerList[ind].praise_sum) - 1;
          };
          _this.setData({
            designerList: designerList
          });
        });
      }
    }
  },

  // 展会公共跳转
  exhibitionpubjump: function (w) {
    var _this = this;
    var type = w.currentTarget.dataset.type || w.target.dataset.type || '';
    var jumpid = w.currentTarget.dataset.id || w.target.dataset.id || '';
    app.exhibitionpubjump(type, jumpid)

    var clouddata = { type:_this.data.pagetype ,adv_id: jumpid};
    app.cloudstatistics('advertisingStat', clouddata)

  },

  jumpexhdetail: function (w) {
    var _this = this;
    var type = _this.data.pagetype;
    if (type == 4) {
      var brandid = w.currentTarget.dataset.brandid || w.target.dataset.brandid || "";
      var id = w.currentTarget.dataset.id || w.target.dataset.id || '';
      wx.navigateTo({
        url: "/page/component/pages/limitlottery/limitlottery?id=" + id+'&brandId='+brandid,
      });
    } else if (type == 11 || type == 12 || type == 999) {
      var id = w.currentTarget.dataset.id || w.target.dataset.id || '';
      wx.navigateTo({
        url: "/pages/detailspage/detailspage?gid=" + id
      });
    } else if (type == 2) {
      var id = w.currentTarget.dataset.id || w.target.dataset.id || '';
      wx.navigateTo({
        url: "/page/secondpackge/pages/brandDetails/brandDetails?id=" + id+"&settlement=1"
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
    }


  },
  gobrandDetails: function (w) {
    var mid = w.currentTarget.dataset.mid || w.target.dataset.mid || 0;
    wx.navigateTo({
      url: "/page/secondpackge/pages/brandDetails/brandDetails?id=" + mid + "&settlement=1",
    });
  },
  //  获取滚动条位置
  scrollleftf: function (event) {
    this.data.scrolllefthq = event.detail.scrollLeft;
    this.data.scrollwidth = event.detail.scrollwidth;
  },

  // tab切换
  tabbotdata: function (w) {
    var _this = this;
    var dateKey = w.currentTarget.dataset.datekey || w.target.dataset.datekey || 0;
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type || 0;
    _this.setData({
      dateKey: dateKey,
      item_type: item_type,
      inputdata: '',
      page: 0,
    });
    if (_this.data.pagetype == 4) {
      _this.listdata(0);
    } else if (_this.data.pagetype == 11) {
      _this.getlimigGoods(0);
    } else if (_this.data.pagetype == 1) {
      _this.getfreeList(0);
    }
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#q' + dateKey).boundingClientRect();
    query.exec(function (res) {
      if (res && res[0]) {
        if (res[0].width) {
          _this.setData({
            scrollleft: w.currentTarget.offsetLeft - wx.getSystemInfoSync().windowWidth / 2 + (res[0].width / 2)
          });
        };
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    console.log(options)
    app.signindata.suap = 13;
    // wx.hideShareMenu();
    _this.setData({
      pagetype: options.type || 0,
    })
    _this.activsign();

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

  // 授权点击统计
  clicktga: function () {
    app.clicktga(2)
  },
  clicktganone: function () {
    this.setData({ tgabox: false })
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
            _this.setData({
              tgabox: false,
              signinlayer: false
            })
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
    //pagetype  2 品牌列表  4限量  11品牌福袋  14 设计师展示 15 直播间列表
    var clouddata = { type: _this.data.pagetype || '' };
    app.cloudstatistics('exhibitionList', clouddata)

    if (_this.data.pagetype == 2) {
      _this.getbrandList(_this.data.nameserch);
      _this.setData({
        c_title: "参展品牌",
      })
    } else if (_this.data.pagetype == 12) {
      _this.setData({
        c_title: "福袋列表",
      })
      _this.getluckybag(0);
    } else if (_this.data.pagetype == 14) {
      _this.setData({
        c_title: "设计师展示",
      })
      _this.getHeatList();
      _this.getdesignerList("", 0, 0);
    } else if (_this.data.pagetype == 5) {
      _this.setData({
        c_title: "展会限量抽盒",
      })
      _this.getSmokeboxList("", 0);
    } else if (_this.data.pagetype == 11) {
      _this.setData({
        c_title: "限时抢购",
      })
    } else if (_this.data.pagetype == 1) {
      _this.setData({
        c_title: "免单活动",
      })
    } else if (_this.data.pagetype == 15) {
      _this.setData({
        c_title: "直播间列表",
      })
    } else if (_this.data.pagetype == 999) {
      _this.setData({
        c_title: "限时不限量",
      })
    };
    if (_this.data.pagetype == 4 || _this.data.pagetype == 11 || _this.data.pagetype == 1 || _this.data.pagetype == 999) {
      _this.getDate();
    }
    if (_this.data.pagetype == 2 || _this.data.pagetype == 14 || _this.data.pagetype == 1) {
      _this.getADList(_this.data.pagetype);
    };
    if(_this.data.pagetype == 15){
      _this.getLiveList(1)
    }
    app.livebroadcast(_this, 0)  // 直播数据


    setTimeout(function(){
      app.indexShareBanner();
    },1000);

  },
  getLiveList:function(num){
    var _this = this;
      wx.showLoading({
        title: '加载中...',
      })
      if (num == 1) {
        _this.data.page = 0;
        _this.setData({
          commoddata: []
        });
      } else {
        var pagenum = parseInt(_this.data.page)
        _this.data.page = ++pagenum;
        _this.setData({
          headhidden: false,
          loadmoreiftr: false,
          loadprompt: '加载更多.....'
        });
      };
      // 直播   http://api-test.51chaidan.com/?
      
      var exh = Dec.Aese('mod=show&operation=liveShowList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
      wx.request({
        url: app.signindata.comurl + 'toy.php' + exh,
        method: 'GET',
        header: {'Accept': 'application/json'},
        success: function (res) {
          wx.hideLoading();
          wx.stopPullDownRefresh();
          console.log('直播列表===========',res)
          if (res.data.ReturnCode == 200) {
            var listdata = res.data.List.liveshow||[];
            if(listdata&&listdata.length!=0){
               for(var i=0;i<listdata.length;i++){
                if(_this.data.newdataexh){
                  listdata[i].start_time= '暂未';
                 }else{
                  listdata[i].start_time=_this.toDatehd(listdata[i].start_time)
                 };
               };
            };
            _this.setData({
              brannerlist:res.data.List.banner||[],
              liveListData:listdata||[]
            })
          } else {
          };
        },
        fail: function () { }
      });

  },
  getDate: function () {
    var _this = this;
    // 日期
    var exh = Dec.Aese('mod=show&operation=getDate');
    wx.request({
      url: app.signindata.comurl + 'toy.php' + exh,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log('datekey==================',res)
        if (res.data.ReturnCode == 200) {
          var listdata = res.data.List.activity || [];
          var datekey = res.data.Info.date || listdata[0].dateKey || '';
          _this.setData({
            dateKey: datekey || '',
            timedata: listdata || []
          },()=>{
            if(datekey){
              //创建节点选择器
              var query = wx.createSelectorQuery();
              //选择id
              query.select('#q' + datekey).boundingClientRect();
              query.exec(function (res) {
                console.log(res)
                if (res && res[0]) {
                  if (res[0].width) {
                    _this.setData({
                      scrollleft: res[0].left - wx.getSystemInfoSync().windowWidth / 2 + (res[0].width / 2)
                    });
                  };
                }
              });
            };
          })
          console.log(_this.data.pagetype)
          if (_this.data.pagetype == 4) {
            _this.listdata(0);
          } else if (_this.data.pagetype == 11) {
            _this.getlimigGoods(0);
          } else if (_this.data.pagetype == 1) {
            _this.getfreeList(0);
          } else if (_this.data.pagetype == 999) {
            _this.getnolimigGoods(0);
          }
        } else {
        };
      },
      fail: function () { }
    });
  },

  listdata: function (page) {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
      mask:true
    });
    // 展会
    var exh = Dec.Aese('mod=show&operation=lotto&date=' + _this.data.dateKey + '&page=' + page+ '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + exh,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        if (res.data.ReturnCode == 200) {
          var listdata = res.data.List.activity || [];
          for (var i = 0; i < listdata.length; i++) {
            if(_this.data.newdataexh){
              listdata[i].start = '暂未开始';
              listdata[i].stop = _this.toDatehd(listdata[i].stop_time)
            }else{
              listdata[i].start = _this.toDatehd(listdata[i].start_time)
              listdata[i].stop = _this.toDatehd(listdata[i].stop_time)
            };
          };

          if (page == 0) {
            _this.setData({
              listdata: listdata || [],
            })
          } else if (listdata.length > 0) {
            var l = _this.data.listdata.concat(listdata);
            _this.setData({
              listdata: l,
            })
          } else {
            app.showToastC('暂无更多数据');
            _this.setData({
              page: page - 1,
            })
          };
        } else {
        };
      },
      fail: function () { }
    });
  },

  //限时抢购
  getlimigGoods: function (page) {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    var exh = Dec.Aese('mod=show&operation=limitGoods&date=' + _this.data.dateKey + '&page=' + page+ '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + exh,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log('限时抢购================',res)
        wx.hideLoading()
        wx.stopPullDownRefresh();
        if (res.data.ReturnCode == 200) {
          var listdata = res.data.List.activity || [];
          for (var i = 0; i < listdata.length; i++) {
            if(_this.data.newdataexh){
              listdata[i].start =  '暂未';
              listdata[i].stop = _this.toDatehd(listdata[i].stop_time)
            }else{
              listdata[i].start = _this.toDatehd(listdata[i].start_time)
              listdata[i].stop = _this.toDatehd(listdata[i].stop_time)
            }

          };
          if (page == 0) {
            _this.setData({
              listdata: listdata || [],
              currentIndex: 0,
            })
          } else if (listdata.length > 0) {
            var l = _this.data.listdata.concat(listdata);
            _this.setData({
              listdata: l,
            })
          } else {
            app.showToastC('暂无更多数据');
            _this.setData({
              page: page - 1,
            })
          }
        } else { };
      },
      fail: function () { }
    });
  },

  //限时不限量
  getnolimigGoods: function (page) {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    console.log('unlimitGoods')
    var exh = Dec.Aese('mod=show&operation=unlimitGoods&date=' + _this.data.dateKey + '&page=' + page+ '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
    console.log('mod=show&operation=unlimitGoods&date=' + _this.data.dateKey + '&page=' + page+ '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'toy.php' + exh,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log('限时不限量================',res)
        wx.hideLoading()
        wx.stopPullDownRefresh();
        if (res.data.ReturnCode == 200) {
          var listdata = res.data.List.activity || [];
          for (var i = 0; i < listdata.length; i++) {
            if(_this.data.newdataexh){
              listdata[i].start =  '暂未';
              listdata[i].stop = _this.toDatehd(listdata[i].stop_time)
            }else{
              listdata[i].start = _this.toDatehd(listdata[i].start_time)
              listdata[i].stop = _this.toDatehd(listdata[i].stop_time)
            }

          };
          if (page == 0) {
            _this.setData({
              listdata: listdata || [],
              currentIndex: 0,
            })
          } else if (listdata.length > 0) {
            var l = _this.data.listdata.concat(listdata);
            _this.setData({
              listdata: l,
            })
          } else {
            app.showToastC('暂无更多数据');
            _this.setData({
              page: page - 1,
            })
          }
        } else { };
      },
      fail: function () { }
    });
  },

  //福袋列表
  getluckybag: function (page) {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    var exh = Dec.Aese('mod=show&operation=luckyBag&page=' + page+ '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + exh,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh();
        if (res.data.ReturnCode == 200) {
          var listdata = res.data.List.activity || [];
          for (var i = 0; i < listdata.length; i++) {
            if(_this.data.newdataexh){
              listdata[i].start =  '暂未';
              listdata[i].stop = _this.toDatehd(listdata[i].stop_time)
            }else{
              listdata[i].start = _this.toDatehd(listdata[i].start_time)
              listdata[i].stop = _this.toDatehd(listdata[i].stop_time)
            }

          };
          if (page == 0) {
            _this.setData({
              listdata: listdata || [],
            })
          } else if (listdata.length > 0) {
            var l = _this.data.listdata.concat(listdata);
            _this.setData({
              listdata: l,
            })
          } else {
            _this.setData({
              page: page - 1,
            })
          }
        } else {
          _this.setData({
            page: page - 1,
          })
        };
      },
      fail: function () { }
    });
  },

  //时间戳转换时间  
  toDatehd: function (number, m) {
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
      if (m==1){
        return M + '.' + D + ' ' + h + ':' + m;
      }else{
        return M + '.' + D;
      };
    }
  },

  getbrandList: function (searchKey) {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    var exh = Dec.Aese('mod=show&operation=brand&searchKey=' + searchKey);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + exh,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh();
        if (res.data.ReturnCode == 200) {
          var brandList = res.data.List.activity || [];
          _this.setData({
            brandList: brandList || [],
            currentIndex: 0,
          })
        } else { };
      },
      fail: function () { }
    });
  },

  getHeatList: function () {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    var exh = Dec.Aese('mod=Obtain&operation=brandList');
    wx.request({
      url: app.signindata.comurl + 'brandDrying.php' + exh,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh();
        if (res.data.ReturnCode == 200) {
          var heatList = res.data.List.brandList || [];
          for (var i = 0; i < heatList.length; i++) {
            heatList[i].heat_degree = _this.fromathot(heatList[i].heat_degree)
          };
          parseInt
          _this.setData({
            heatList: heatList || [],
          })
        } else { };
      },
      fail: function () { }
    });
  },

  fromathot: function (num) {
    var n = parseInt(num);
    if (n > 1000) {
      var m = n / 1000;
      if (n % 1000 > 0) {
        m = m.toFixed(1);
      }
      return m + "k";
    } else {
      return n;
    }
  },

  getdesignerList: function (Keyword, page, brandId) {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    var exh = Dec.Aese('mod=Obtain&operation=dryingList&Keyword=' + Keyword + '&brandId=' + brandId + '&page=' + page
      + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
    wx.request({
      url: app.signindata.comurl + 'brandDrying.php' + exh,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh();
        if (res.data.ReturnCode == 200) {
          var dryingList = res.data.List.dryingList || [];
          if (page == 0) {
            _this.setData({
              designerList: dryingList || [],
            })
          } else if (dryingList.length > 0) {
            var l = _this.data.designerList.concat(dryingList);
            _this.setData({
              designerList: l,
            })
          } else {
            _this.setData({
              page: page - 1,
            })
          }
        } else {
          _this.setData({
            page: page - 1,
          })
        };
      },
      fail: function () {
        if (page == 0) {
        } else {
          _this.setData({
            page: page - 1,
          })
        }
      }
    });
  },

  changeGoodsSwip: function (detail) {
    if (detail.detail.source == "touch") {
      this.setData({
        currentIndex: detail.detail.current
      })
    }
  },

  getADList: function (type) {
    var _this = this;
    var exh = Dec.Aese('mod=info&operation=toyShow&type=' + type);
    wx.request({
      url: app.signindata.comurl + 'ads.php' + exh,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log('广告===========',res)
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

  getSmokeboxList: function (searchKey, page) {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    var exh = Dec.Aese('mod=show&operation=blindbox&searchKey=' + searchKey + "&page=" + page+ '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + exh,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh();
        if (res.data.ReturnCode == 200) {
          var smokelist = res.data.List.activity || [];
          if (page == 0) {
            _this.setData({
              brannerlist: res.data.List.banner,
              smokelist: smokelist || [],
            })
          } else if (smokelist.length > 0) {
            var l = _this.data.smokelist.concat(smokelist);
            _this.setData({
              smokelist: l,
            })
          } else {
            _this.setData({
              page: page - 1,
            })
          }
        } else {
          _this.setData({
            page: page - 1,
          })
        };
      },
      fail: function () { }
    });
  },

  getfreeList: function (page) {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    var exh = Dec.Aese('mod=show&operation=miandan&date=' + _this.data.dateKey + "&page=" + page+'&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + exh,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh();
        if (res.data.ReturnCode == 200) {
          var freelist = res.data.List.activity || [];
          for (var i = 0; i < freelist.length; i++) {
            if(_this.data.newdataexh){
              freelist[i].start = '暂未';
              freelist[i].stop = _this.toDatehd(freelist[i].stop_time)
            }else{
              freelist[i].start = _this.toDatehd(freelist[i].start_time)
              freelist[i].stop = _this.toDatehd(freelist[i].stop_time)
            }

          };
          console.log(freelist)
          if (page == 0) {
            _this.setData({
              freelist: freelist || [],
            })
          } else if (freelist.length > 0) {
            var l = _this.data.freelist.concat(freelist);
            _this.setData({
              freelist: l,
            })
          } else {
            _this.setData({
              page: page - 1,
            })
          }
        } else {
          _this.setData({
            page: page - 1,
          })
        };
      },
      fail: function () { }
    });
  },

  // 监听输入input值
  namefun: function (e) {
    this.setData({
      nameserch: e.detail.value,
    })
  },

  serchclick: function () {
    var _this = this;
    _this.data.page = 0;
    if (_this.data.pagetype == 2) {
      _this.getbrandList(_this.data.nameserch);
    } else if (_this.data.pagetype == 14) {
      _this.getdesignerList(_this.data.nameserch, 0, _this.data.mbrandId);
    } else if (_this.data.pagetype == 5) {
      _this.getSmokeboxList(_this.data.nameserch, 0);
    }
  },

  brandClick: function (w) {
    var _this = this;
    _this.data.page = 0;
    var bid = w.currentTarget.dataset.bid || w.target.dataset.bid || '';
    _this.data.mbrandId = bid;
    _this.getdesignerList(_this.data.nameserch, 0, bid);
  },


  jumpedryingdetail: function (w) {
    var _this = this;
    var goodid = w.currentTarget.dataset.goodid || w.target.dataset.goodid || '';
    wx.navigateTo({
      url: "/page/component/pages/dlfinddetails/dlfinddetails?drying_id=" + goodid
    });
  },

  jumpdetail: function (w) {
    var goodid = w.currentTarget.dataset.gid || w.target.dataset.gid || '';
    wx.navigateTo({
      url: "/pages/smokebox/smokebox?gid=" + goodid,
    });
  },

  onPullDownRefresh: function () {
    var _this = this;
    _this.data.page = 0;
    if (_this.data.pagetype == 14) {
      _this.getdesignerList(_this.data.nameserch, 0, _this.data.mbrandId);
    } else if (_this.data.pagetype == 5) {
      _this.getSmokeboxList(_this.data.nameserch, 0);
    } else if (_this.data.pagetype == 11) {
      _this.getlimigGoods(0);
    } else if (_this.data.pagetype == 999) {
      _this.getnolimigGoods(0);
    } else if (_this.data.pagetype == 1) {
      _this.getfreeList(0);
    } else if (_this.data.pagetype == 12) {
      _this.getluckybag(0);
    } else if (_this.data.pagetype == 4){
      _this.listdata(0);
    } else if (_this.data.pagetype == 15){
      _this.getLiveList(1)
    }else{
      wx.stopPullDownRefresh();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this;
    var p = _this.data.page + 1;
    _this.data.page = p;
    console.log(_this.data.page,_this.data.pagetype)
    if (_this.data.pagetype == 14) {
      _this.getdesignerList(_this.data.nameserch, p, _this.data.mbrandId);
    } else if (_this.data.pagetype == 5) {
      _this.getSmokeboxList(_this.data.nameserch, p);
    } else if (_this.data.pagetype == 11) {
      _this.getlimigGoods(p);
    } else if (_this.data.pagetype == 1) {
      _this.getfreeList(p);
    } else if (_this.data.pagetype == 12) {
      _this.getluckybag(p);
    } else if (_this.data.pagetype == 4) {
      _this.listdata(p);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareTimeline:function(){
    var _this = this;
    return {
      title:_this.data.c_title || '潮玩社交平台',
      query:{'type':_this.data.pagetype||0}    
    }
  },
  onShareAppMessage: function () {
    var _this = this;
    var share = {
      title: app.signindata.toyShowTitleShare,
      path: "/page/secondpackge/pages/exhibition/exhibition?type="+_this.data.pagetype||0,
      imageUrl:app.signindata.toyShowShareImg,
      success: function (res) { }
    };
    return share;
  }


})