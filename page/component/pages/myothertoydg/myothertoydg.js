// page/component/pages/myothertoydg/myothertoydg.js
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
    avatarUrl: app.signindata.avatarUrl,
    appNowTime: Date.parse(new Date()),
    // 适配苹果X 
    isIphoneX: app.signindata.isIphoneX,
    defaultinformation: '',
    wxnum: '',
    // 数据 
    listdata: [],
    headhidden: false,
    shopnum: 0,
    dryinglistnum: 0,
    // 授权弹框
    tgabox: false,
    title: '别人的玩具柜',
    arrow: true,
    backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    ownerId: 0,
    listdata: [],
    iefwidth: 0,
    page: 0,
    isAllselect: false,
    selectedimg: "https://www.51chaidan.com/images/toyCabinet/selection.png",
    unselectedimg: "https://www.51chaidan.com/images/toyCabinet/unchecked.png",
    goodsNum: 0,
    goodsAmount: 0,
    tipbacktwo: false,
    buybombsimmediately: false,
    receivingaddress: false,
    pricedetailc: true,
    freight: "",
    tipaid: "",
    addressdata: "",
    tipaddress: "",
    receivingaddress: "",
    desc: '',
    cart_id: '',
    userInfo: {},
    // 1 我的玩具柜
    ownoth: 1,
    // 数据 
    listdataown: [],
    headhidden: false,
    shopnum: 0,
    dryinglistnum: 0,
    headtab: [{name: '全部',ind: 0},{name: '出售中',ind: 1},{name: '已售出',ind: 2},{name: '已回收',ind: 8},{name: '待发货',ind: 4},{name: '已发货',ind: 3}],

    headtabid: 0,
    c_title: '我的玩具柜',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    inputdataprice: 0,
    pricemod: false,
    tipelafra: false,
    page: 0,
    SHOW_TOP_MTO: true,
    sid: '',
    shop_price: 0,
    rolename: '',
    goods_img: '',
    tioimgwidth: 0,
    iftrnodata: false,
    mtdtiploctxt: '',
    mtdlocation: false,
    shareimgarr: [],
    // tab 数据
    scrolllefthq: 0,
    scrollleft: 1,
    scrollwidth: 0,
    scrollwidthiftr: true,
    snapshot: '',
    total: '',
    posterList: [],
    headImageInfo: '',
    qCodePath: '',
    qCodeImageInfo: '',
    posterTips: '扫码下单，官方发货',
    imgPoster: '',
    posterImgHeight: 0,
    ishowposter: false,
    ishowempty: false,
    tipimgurl: '',
    tipimgurlbox: false,
    isdelivergoods: false,
    placeoIds: "",
    placetoyIds: "",
    isonshow: false,
    withdrawiftr:false,
    toyId:'',
    // 是否授权
    windowHeight: app.signindata.windowHeight - 55 - wx.getStorageSync('statusBarHeightMc') || 0,
    tgabox: false,
    signinlayer: false,
    manypricemod:false,
    tiplist:[],
    tipsellist: [],
    manyshopselect:false,
    manypage:0,
    // 组合价格
    combinationprice:'',
    isnewold:1,//1 添加新组合 2 已有组合
    mong_group_id:0,//修改组合价格用
    group_id_y: [],
    group_id_n: [],
    group_id_o: [],
    addressefm:false,
    ishowdealoradd: false,
    ishowdeal: true,
    ishowadd: false,
    addressdata: [],
    isBlindBoxDefaultAddress: false,
    maddid: '',
    ishowcover: false,
    isshowaddress:true,
    //我的抽盒金
    blindboxMoney:'',
    // 使用抽盒金比率
    deductRatio:0.6,
    // 此商品是否可以使用抽盒金抵扣
    isDeduct:true,
    // 是否使用抽盒金抵扣
    isUseBlindboxMoney:true,
    // 提交订单时是否使用抽盒金抵扣
    isDeductNum:1
  },
  useBlindboxMoneyFun(){
    this.setData({
      isUseBlindboxMoney:!this.data.isUseBlindboxMoney,
    })
    this.setData({
      total:this.data.isUseBlindboxMoney? (this.data.originalAmountpayable-this.data.useblindAmountpayable).toFixed(2):this.data.originalAmountpayable,
      isDeductNum:this.data.isUseBlindboxMoney?1:0
    })
  },
  addresssefmcancel:function(){
    this.setData({ addressefm:false})
  },
  diaplayaddressefm:function(){
    this.placeorder();
  },
  selmodifyl:function(w){
    var group_id = w.currentTarget.dataset.group_id || w.target.dataset.group_id || 0;
    var group_price = w.currentTarget.dataset.group_price || w.target.dataset.group_price || 0;
    var tipsellist = [];
    var listdataown = this.data.listdataown||[];
    for (var i = 0; i < listdataown.length;i++){
      if (listdataown[i].group_id == group_id){
        tipsellist.push(listdataown[i]);
      };
    };
    this.setData({
      isnewold:2,
      tipsellist: tipsellist,
      manyshopselect: false,
      manypricemod: true,
      combinationprice: group_price,
      mong_group_id: group_id
    })
  },
  // 组合弹框确定
  modpricemany:function(){
    var _this = this;
    var tipsellist = this.data.tipsellist||[];
    if (tipsellist.length < 2) {
      app.showToastC('最少选择2个商品');
      return false;
    };
    if (tipsellist.length>0){
      var iftrtipx= false;
      var iftrtipd = false;
      for (var i = 0; i < tipsellist.length;i++){
        if (10 > tipsellist[i].shop_price || tipsellist[i].shop_price==''){
          iftrtipx = true;
        };
        if (tipsellist[i].shop_price > 999){
          iftrtipd = true;
        };
      };
      if (iftrtipx) {
        app.showToastC('单个商品价格不能小于10');
        return false;
      };
      if (iftrtipd){
        app.showToastC('单个商品价格不能大于999');
        return false;        
      }
    };

    if (this.data.combinationprice == '') {
      app.showToastC('组合价格不能为空');
      return false;
    };
    if (this.data.combinationprice > 999) {
      app.showToastC('组合价格不能大于999');
      return false;
    };
    if (this.data.combinationprice<10){
      app.showToastC('组合价不能小于10');
      return false;
    };
    wx.showModal({
      title: '提示',
      content: '其他娃友将可以￥' + _this.data.combinationprice +' 购买您出售的组合',
      success: function (res) {
        if (res.confirm) {
          if (_this.data.isnewold==1){
            _this.manysubdata('add')
          }else{
            _this.manysubdata('modify')
          }
        } else if (res.cancel) {
        }
      }
    }) 
  },
  // 组合弹框确定提交数据
  manysubdata:function(typemony){
    var typemony = typemony; // 请求类别 add 添加  modify 修改 
    var _this = this;
    var tipsellist = this.data.tipsellist||[];
    var ids = [];
    var single = [];
    for (var i = 0; i < tipsellist.length; i++) {
      ids.push(parseInt(tipsellist[i].id));
      single.push({ toy_id: tipsellist[i].id, price: tipsellist[i].shop_price})
    };
    ids = JSON.stringify(ids).replace("[", "").replace("]", "");
    single = JSON.stringify(single)
    if (typemony=='add'){
      var qqq = Dec.Aese('mod=cabinet&operation=generationGroup&setCategory=' + typemony + '&group_price=' + _this.data.combinationprice + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&ids=' + ids + '&single=' + single);
    }else{
      var qqq = Dec.Aese('mod=cabinet&operation=generationGroup&setCategory=' + typemony + '&group_price=' + _this.data.combinationprice + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&ids=' + ids + '&group_id=' + _this.data.mong_group_id + '&single=' + single);
    };

    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh()
        if (res.data.ReturnCode == 200) {
          app.showToastC(res.data.Msg);
          setTimeout(function () { _this.listdataown(0);},2000)
          _this.setData({
            manyshopselect: false,
            manypricemod: false
          });
          
        }else{
          app.showToastC(res.data.Msg);
        };
      }
    });    
  },
  // 组合弹框添加商品
  addselshop:function(){
    this.setData({
      manyshopselect: true,
      pricemod: false,
      manypricemod:false,
    });
    this.manydatafun(1);
  },
  // 多选框删除数据
  dldeletedata: function (w) {
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var sid = w.currentTarget.dataset.sid || w.target.dataset.sid || 0;
    var tipsellist = this.data.tipsellist || [];
    var tiplist = this.data.tiplist ||[];
    if (tiplist.length!=0){
      for (var i = 0; i < tiplist.length; i++) {
        if (sid == tiplist[i].id){
          tiplist[i].iftrcheck=false;
        }
      };
    };
    tipsellist.splice(ind, 1);
    if (tipsellist.length==1){
      var sid = tipsellist[0].id;
      var shop_price = tipsellist[0].shop_price||'';
      var rolename = tipsellist[0].roleName || '';
      var goods_img = tipsellist[0].goods_img || '';
      var viewwidthone = tipsellist[0].viewwidthone || 0;
      var viewwidthtwo = tipsellist[0].viewwidthtwo || 0;
      var tipsellist = [{
        "id": sid,
        "shop_price": shop_price,
        "roleName": rolename,
        "goods_img": goods_img,
        "viewwidthtwo": viewwidthtwo
      }];
      this.setData({
        tipsellist: tipsellist,
        tiplist: tiplist,
        pricemod: true,

        manyshopselect: false,
        manypricemod: false,

        sid: sid,
        shop_price: shop_price,
        inputdataprice: shop_price,
        rolename: rolename,
        goods_img: goods_img,
        tioimgwidth: viewwidthone,
        tipsellist: tipsellist
      });
    }else{
      this.setData({ tipsellist: tipsellist, tiplist: tiplist })
    };
    
  },
  // 组合价格修改
  combinahangeprice:function(e){
    this.setData({
      combinationprice: e.detail.value
    });
  },
  // 组合商品价格调整
  inputselprice:function(e){
    var inputindex = e.currentTarget.dataset.inputindex || e.target.dataset.inputindex || 0;
    var inputdata = parseFloat(e.detail.value);
    var tipsellist = this.data.tipsellist||[];
    tipsellist[inputindex].shop_price = inputdata;
    this.setData({
      tipsellist: tipsellist
    });
  },
  // 隐藏选择商品弹框
  nonemanyshop:function(){
    this.setData({ manyshopselect: false})
  },
  // 选择商品确定按钮
  selectsure:function(){
    var _this = this;
    var tiplist = this.data.tiplist || [];
    var tipsellist = this.data.tipsellist||[];
    if(tiplist.length!=0){
       for(var i=0;i<tiplist.length;i++){
         if (tiplist[i].iftrcheck){
           tipsellist.push(tiplist[i])
         };
       };
    };
    if (tipsellist.length==1){
      this.setData({
        manyshopselect: false,
        manypricemod: false,
        pricemod:true,
        tipsellist: tipsellist,
        combinationprice: ''
      });
    }else{
      this.setData({
        manyshopselect: false,
        manypricemod: true,
        tipsellist: tipsellist,
        combinationprice: ''
      });
    }

  },
  iftrcheckfunmony:function(w){
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var tiplist = this.data.tiplist||[];
    var tipsellist = this.data.tipsellist || [];
    if (tiplist[ind].iftrcheck){
      tiplist[ind].iftrcheck=false;
    }else{
      var g = 0;
      for (var i = 0; i < tiplist.length;i++){
        if (tiplist[i].iftrcheck){
           g++;
        };
      };
      if (tipsellist.length+g>2){
          app.showToastC('最多挑选3个商品');
         return false;
      };
      tiplist[ind].iftrcheck=true;
    };
    this.setData({
      tiplist: tiplist
    });
  },

  // 计算图片大小
  imageLoadownsel: function (e) {
    var _this = this;
    var ind = parseInt(e.currentTarget.dataset.ind || e.target.dataset.ind || 0);
    var $width = e.detail.width; //获取图片真实宽度
    var $height = e.detail.height;
    var ratio = $width / $height;
    var viewwidth = 150 * ratio;
    var viewwidthtwo = 240 * ratio;
    var tiplist = this.data.tiplist;
    if (viewwidth > 160) {
      viewwidth = 160;
    };
    if (tiplist[ind]) {
      tiplist[ind].width = viewwidth;
      tiplist[ind].viewwidthtwo = viewwidthtwo;
      _this.setData({
        tiplist: tiplist
      })
    };
  },
  // scroll上拉加载
  tolower:function(){
    this.manydatafun(2)
  },
  // 组合商品数据
  manydatafun:function(num){
    var _this = this;
    if (num == 1) {
      _this.data.manypage = 0;
      _this.setData({
        tiplist:[]
      });
    } else {
      var manypage = parseInt(_this.data.manypage)
      _this.data.manypage = ++manypage;
    };  

    var tipsellist = this.data.tipsellist || [];
    var ids = [];
    for (var i = 0; i < tipsellist.length; i++) {
      ids.push(parseInt(tipsellist[i].id));
    };
    ids = JSON.stringify(ids).replace("[", "").replace("]", "");

    var qqq = Dec.Aese('mod=cabinet&operation=generatableGroupList&pid=' + _this.data.manypage + '&toyId=' + ids + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh()
        if (res.data.ReturnCode == 200) {
          var listdata = res.data.List.toyList || [];
          if (num == 1) {
            if (listdata){
              for (var i = 0; i < listdata.length; i++) {
                listdata[i].iftrcheck = false;
              };
            };
            _this.setData({
              tiplist: listdata
            });
          } else {
            if (listdata) {
              for (var i = 0; i < listdata.length; i++) {
                listdata[i].iftrcheck = false;
              };
            };
            var ltlist = _this.data.tiplist.concat(listdata);
            _this.setData({
              tiplist: ltlist
            });
          };
        };
      }
    });
  },
  // 添加组合商品按钮
  manydispalyfun:function(){
    this.manydatafun(1);
    this.setData({
      manyshopselect:true,
      pricemod:false
    });
  },
  // 多个商品隐藏弹框
  manypricemodfun:function(){
    this.setData({
      manyshopselect: false,
      manypricemod: false
    })
  },
  //进入玩具柜
  enterinto: function () {
    var _this = this;
    wx.navigateTo({
      url: "/page/component/pages/myothertoydg/myothertoydg?ownerId=" + _this.data.uid,
      complete: function () {
        _this.setData({
          isdelivergoods: false,
        });
      }
    })
  },
  // 图片预览
  previewImgurl: function (w) {
    var imgurl = w.currentTarget.dataset.imgurl || w.target.dataset.imgurl || '';
    this.setData({
      tipimgurl: imgurl || '',
      tipimgurlbox: true
    })
  },
  tipimgfun: function () {
    this.setData({
      tipimgurlbox: false
    })
  },

  jumpmytoydg: function () {
    wx.navigateTo({
      url: "/page/component/pages/mytoydg/mytoydg"
    })
  },
  // 计算图片大小
  imageLoadown: function (e) {
    var _this = this;
    var ind = parseInt(e.currentTarget.dataset.ind || e.target.dataset.ind || 0);
    var $width = e.detail.width; //获取图片真实宽度
    var $height = e.detail.height;
    var ratio = $width / $height;
    var viewwidth = 150 * ratio;
    var viewwidthone = 300 * ratio;
    var viewwidthtwo = 240 * ratio;
    var listdata = this.data.listdataown;
    if (viewwidth > 160) {
      viewwidth = 160;
    };
    console.log('listdata=========',ind,ratio)
    if (listdata[ind]) {
      listdata[ind].width = viewwidth;
      listdata[ind].ratio = ratio;
      listdata[ind].viewwidthone = viewwidthone;
      listdata[ind].viewwidthtwo = viewwidthtwo;
      _this.setData({
        listdataown: listdata
      })
    };
  },




  listdataown: function (num) {
    var _this = this;
    if (num == 0) {
      _this.data.page = 0;
      _this.setData({
        listdataown: [],
        iftrnodata: false
      });
    } else {
      var pagenum = parseInt(_this.data.page)
      _this.data.page = ++pagenum;
    };
    if (_this.data.isBusinessSkip == 1) {
      // 发现详情
      var qqq = Dec.Aese('mod=cabinet&operation=list&pid=' + _this.data.page + '&class=' + _this.data.headtabid + '&personal_list=1&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + "&isBusinessSkip=" + _this.data.isBusinessSkip + "&businessClientUserId=" + _this.data.businessClientUserId + "&isMergedUserInfo=" + _this.data.isMergedUserInfo);
    } else {
      // 发现详情
      var qqq = Dec.Aese('mod=cabinet&operation=list&pid=' + _this.data.page + '&class=' + _this.data.headtabid + '&personal_list=1&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log('listdataown=====',res)
        wx.hideLoading();
        wx.stopPullDownRefresh()
        _this.mtotipscliffun();
        _this.setData({
          iftrnodata: true
        });
        // _this.data.isonshow = true;
        if (res.data.ReturnCode == 200) {
          var listdata = res.data.List.activity || [];
          
          if (num == 0) {
            var listdatamy = []
            if (listdata.length!=0){
              for (var l = 0; l < listdata.length; l++) {
                listdatamy.push(listdata[l]);
              };
            };
             
            _this.setData({
              listdataown: listdata
            });
            _this.getimginfolist();
          } else {
            var ltlist = _this.data.listdataown.concat(listdata);
            _this.setData({
              listdataown: ltlist
            });
          };
        };
      }
    });

  },

  
  mtdlocationfun: function () {
    this.setData({
      mtdlocation: false
    });
  },
  modprice: function () {
    var _this = this;
    wx.showModal({
      title: '提示',
      content: '其他娃友将可以￥' + _this.data.inputdataprice + ' 购买您出售的潮玩',
      success: function (res) {
        if (res.confirm) {
          if (_this.data.inputdataprice == '') {
            app.showToastC('价格修改不能为空');
            return false;
          };
          if (parseFloat(_this.data.inputdataprice) < 10) {
            app.showToastC('价格修改不能小于10');
            return false;
          };
          if(_this.data.goods_name == 'BE@RBRICK'){
            if (parseFloat(_this.data.inputdataprice) > 9999) {
              app.showToastC('价格修改不能大于9999');
              return false;
            };
          }else{
            if (parseFloat(_this.data.inputdataprice) > 999) {
              app.showToastC('价格修改不能大于999');
              return false;
            };
          }
          var qqq = Dec.Aese('mod=cabinet&operation=setPrice&id=' + _this.data.sid + '&price=' + _this.data.inputdataprice + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
          wx.showLoading({
            title: '加载中...',
            mask: true
          })
          wx.request({
            url: app.signindata.comurl + 'toy.php' + qqq,
            method: 'GET',
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              wx.hideLoading();
              _this.setData({
                iftrnodata: true
              });
              if (res.data.ReturnCode == 200) {
                _this.setData({
                  mtdtiploctxt: res.data.Msg,
                  mtdlocation: true,
                  pricemod: false
                });
                _this.listdataown(0);
              } else {
                _this.setData({
                  mtdtiploctxt: res.data.Msg,
                  mtdlocation: true,
                  pricemod: false
                })
              };
            }
          });


        } else if (res.cancel) {
        }
      }
    })
    
    
  },
  mtotipscliffun: function () {
    var _this = this;
    // _this.setData({
    //   SHOW_TOP_MTO: true
    // });
    // 关闭时间
    setTimeout(() => {
      _this.setData({
        SHOW_TOP_MTO: false
      });
    }, 5000);
  },
  apptipleftfun: function () {
    this.setData({
      tipelafra: false
    })
  },
  pricemodfun: function () {
    this.setData({
      pricemod: false
    })
  },
  pricemodblocl: function (w) {
    var sid = w.currentTarget.dataset.sid || w.target.dataset.sid || 0;
    var shop_price = w.currentTarget.dataset.shop_price || w.target.dataset.shop_price || '';
    var rolename = w.currentTarget.dataset.rolename || w.target.dataset.rolename || '';
    var goods_img = w.currentTarget.dataset.goods_img || w.target.dataset.goods_img || '';
    var viewwidthone = w.currentTarget.dataset.viewwidthone || w.target.dataset.viewwidthone || 0;
    var viewwidthtwo = w.currentTarget.dataset.viewwidthtwo || w.target.dataset.viewwidthtwo || 0;
    var goods_name = w.currentTarget.dataset.goods_name || w.target.dataset.goods_name || 0;


    // listdata[ind].viewwidthone = viewwidthone;
    // listdata[ind].viewwidthtwo = viewwidthtwo;



    var tipsellist = [{
      "id": sid,
      "shop_price": shop_price,
      "roleName": rolename,
      "goods_img": goods_img,
      "viewwidthtwo": viewwidthtwo,
      "goods_name": goods_name
    }];
    this.setData({
      pricemod: true,
      sid: sid,
      shop_price: shop_price,
      inputdataprice: shop_price,
      rolename: rolename,
      goods_img: goods_img,
      tioimgwidth: viewwidthone,
      tipsellist: tipsellist,
      isnewold:1,
      goods_name:goods_name
    })
  },
  // input 值改变
  inputChangeprice: function (e) {
    this.setData({
      inputdataprice: e.detail.value
    });
  },

  headtabfun: function (w) {
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    this.setData({
      headtabid: ind
    });
    this.listdataown(0);
    var _this = this;
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#q' + ind).boundingClientRect();
    query.exec(function (res) {
      if (res && res[0]) {
        _this.setData({
          scrollleft: w.currentTarget.offsetLeft - wx.getSystemInfoSync().windowWidth / 2 + (res[0].width / 2)
        });
      };
    });
  },


  // 2 别人的玩具柜
  // 返回上一页
  gateback: function () {
    let pages = getCurrentPages();
    let prevpage = pages[pages.length - 2];
    if (prevpage) {
      wx.navigateBack();
    } else {
      wx.redirectTo({
        url: "/pages/smokeboxlist/smokeboxlist",
      });
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否授权  
    var _this = this;
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      _this.data.ownerId = _this.getSearchString('ownerId', scene) || 0;
    } else {
      _this.data.ownerId = options.ownerId || 0;
      _this.data.businessClientUserId = options.ownerId || 0;
      _this.data.isBusinessSkip = options.isBusinessSkip || 0;
      _this.data.isMergedUserInfo = options.isMergedUserInfo || 0;
    };
    // 测试 别人的玩具柜
    // _this.data.ownerId = 39860 || 0;
    // _this.data.ownerId = 853 || 0;

    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      avatarUrl: app.signindata.avatarUrl,
      isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
    });
    wx.showLoading({
      title: '加载中...',
    })

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
              isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
              signinlayer: true,
              tgabox: false
            });
            // 判断是否登录
            if (_this.data.loginid != '' && _this.data.uid != '') {
              _this.onLoadfun();
            } else {
              if (_this.data.isBusinessSkip == 1) {
                var BSkipData = {
                  businessClientUserId: _this.data.ownerId,
                  isBusinessSkip: _this.data.isBusinessSkip,
                  isMergedUserInfo: _this.data.isMergedUserInfo,
                }
                app.signin(_this, BSkipData)
              } else {
                app.signin(_this)
              }
            }
          } else {
            wx.hideLoading()
            app.userstatistics(32);
            _this.setData({
              tgabox: false,
              signinlayer: false
            });
            _this.onLoadfun();
          }
        }
      });
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
  userInfoHandler: function (e) {
    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 确认授权用户统计
          app.clicktga(4);
          _this.setData({
            signinlayer: true,
            tgabox: false
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
            if (_this.data.isBusinessSkip == 1) {
              var BSkipData = {
                businessClientUserId: _this.data.ownerId,
                isBusinessSkip: _this.data.isBusinessSkip,
                isMergedUserInfo: _this.data.isMergedUserInfo,
              }
              app.signin(_this, BSkipData)
            } else {
              app.signin(_this)
            }
          };
        } else {
          _this.setData({
            tgabox: false,
            signinlayer: false
          });
        }
      }
    });
    if (e.detail.detail.userInfo) { } else {
      app.clicktga(8) //用户按了拒绝按钮
    };

  },

  onLoadfun: function () {
    var _this = this

    wx.hideLoading()

    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      avatarUrl: app.signindata.avatarUrl,
      isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
      defaultinformation:app.signindata.defaultinformation,
      blindboxMoney:app.signindata.blindboxMoney
    });
    if (_this.data.ownerId == _this.data.uid || _this.data.ownerId == 'own') {
      var userInfo = {
        nick: '我',
        litpic: ''
      }
      _this.setData({
        ownoth: 1,
        userInfo: userInfo,
        ownerId: _this.data.uid
      })
    } else if (_this.data.isBusinessSkip == 1) {
      var userInfo = {
        nick: '我',
        litpic: ''
      }
      _this.setData({
        ownoth: 1,
        userInfo: userInfo,
        ownerId: _this.data.uid
      })
    } else {
      _this.setData({
        ownoth: 2
      })
    }
    if (this.data.ownoth == 1) {
      this.listdataown(0)
    } else {
      _this.listdata(0)
    }

    if (_this.data.loginid != '' && _this.data.uid != '' && !_this.data.isBlindBoxDefaultAddress) {
      _this.setData({
        ishowdealoradd: true,
        ishowcover: true,
      })

      _this.nextpagediao();
    }

    setTimeout(function () {
      _this.getdefault()
    }, 1000)

  },

  getdefault: function () {
    var _this = this;
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
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            defaultinformation: res.data.Info,
            wxnum: res.data.Info.cs.wxid || 'meichai666666',
          });
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
        // 购物车数据显示
        Dec.shopnum(_this,app.signindata.comurl);
      }
    });

  },

  listdata: function (num) {
    var _this = this;
    if (num == 0) {
      _this.data.page = 0;
      _this.setData({
        listdata: [],
        iftrnodata: false
      });
    } else {
      var pagenum = parseInt(_this.data.page)
      _this.data.page = ++pagenum;
      _this.setData({ iftrnodata: false });
    };
    // 发现详情
    var qqq = Dec.Aese('mod=cabinet&operation=list&pid=' + _this.data.page + '&personal_list=0&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + "&ownerId=" + _this.data.ownerId);
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log('listdata=========',res)
        wx.stopPullDownRefresh()
        wx.hideLoading();
        // _this.data.isonshow = true;
        if (res.data.ReturnCode == 200) {
          var listdata = res.data.List.activity || [];

          for (var i = 0; i < listdata.length; i++) {
            if (listdata[i].status != 1) {
              listdata[i].selected = false
            }
          }

          if (num == 0) {
            var userInfo = res.data.Info.userInfo || {};
            _this.setData({
              listdata: listdata,
              userInfo: userInfo,
              deductRatio:res.data.Info.deduct.deductRatio,
              isDeduct:res.data.Info.deduct.isDeduct,
              isUseBlindboxMoney:res.data.Info.deduct.isDeduct?true:false,
              isDeductNum:res.data.Info.deduct.isDeduct&&_this.data.blindboxMoney!=0?1:0
            });
            _this.getimginfolist();
          } else {
            var ltlist = _this.data.listdata.concat(listdata);
            _this.setData({
              listdata: ltlist
            });
          };

          _this.nextpagediao()
        };
        _this.setData({ iftrnodata: true })
      }
    });

  },

  allselect: function () {
    var _this = this;
    var listdata = _this.data.listdata;
    var num = 0;
    var price = 0;
    if (!_this.data.isAllselect) {
      for (var i = 0; i < listdata.length; i++) {
        if (listdata[i].status != 1) {
          listdata[i].selected = true
          num = num + 1
          if (listdata[i].group_id > 0 && listdata[i].end){
            price = parseFloat(price) + parseFloat(listdata[i].group_price)
          } else if (listdata[i].group_id == 0){
            price = parseFloat(price) + parseFloat(listdata[i].shop_price)
          };
        }
      };
      _this.setData({
        listdata: listdata
      })
      var listdata = _this.data.listdata;
      if (listdata.length!=0){
        // 组合商品
        var group_id_y = [];
        var group_id_n = [];
        var group_id_o = [];
        for (var a = 0; a < listdata.length; a++) {
          var group_chinum = 0;
          var group_chi_id = 0;
          var toyeveumber = 0;
          for (var l = 0; l < listdata.length; l++) {
            if (listdata[l].status != 1 && listdata[l].group_id != 0 && listdata[a].group_id == listdata[l].group_id) {
              if (listdata[l].selected) {
                group_chinum++;
              };
              group_chi_id = listdata[l].group_id;
              toyeveumber = parseInt(listdata[l].toyNumber)
            };
          };
          if (group_chi_id > 0 && group_chinum == toyeveumber) {
            group_id_y.push(parseInt(group_chi_id));
          } else if (group_chi_id > 0) {
            group_id_n.push(parseInt(group_chi_id));
          };
          if (group_chi_id > 0 && group_chinum > 0 && group_chinum != toyeveumber) {
            group_id_o.push(parseInt(group_chi_id))
          };
        };
        group_id_y = this.unique(group_id_y);
        group_id_n = this.unique(group_id_n);
        group_id_o = this.unique(group_id_o);
        _this.setData({
          group_id_y: group_id_y || [],
          group_id_n: group_id_n || [],
          group_id_o: group_id_o || []
        })
      };

    } else {
      for (var i = 0; i < listdata.length; i++) {
        if (listdata[i].status != 1) {
          listdata[i].selected = false
        }
      }
      num = 0
      price = 0
    }
    _this.setData({
      isAllselect: !_this.data.isAllselect,
      listdata: listdata,
      goodsNum: num,
      goodsAmount: parseFloat(price).toFixed(2)
    })
  },

  // 普通商品计算价格
  singleselect: function (e) {
    var _this = this
    var num = _this.data.goodsNum
    var price = _this.data.goodsAmount
    var ind = parseInt(e.currentTarget.dataset.ind || e.target.dataset.ind || 0);
    var listdata = _this.data.listdata

    if (listdata[ind].selected) {
      listdata[ind].selected = false
      price = parseFloat(price) - parseFloat(listdata[ind].shop_price)
      num = num - 1
      _this.setData({
        isAllselect: false
      })
    } else {
      listdata[ind].selected = true
      price = parseFloat(price) + parseFloat(listdata[ind].shop_price)
      num = num + 1
    };
    var iftrcom = true;
    for (var i = 0; i < listdata.length; i++) {
      if (!listdata[i].selected && listdata[i].status != 1) {
        iftrcom = false;
      };
    };

    _this.setData({
      listdata: listdata,
      goodsNum: num,
      goodsAmount: parseFloat(price).toFixed(2),
      isAllselect: iftrcom
    })

  },
  // 组合商品计算价格
  singleselectgroup: function (e) {
    var _this = this;
    var group_id = e.currentTarget.dataset.group_id || e.target.dataset.group_id || 0;
    var toynumber = e.currentTarget.dataset.toynumber || e.target.dataset.toynumber || 0;


    var ind = parseInt(e.currentTarget.dataset.ind || e.target.dataset.ind || 0);
    var listdata = _this.data.listdata;
    if (listdata[ind]){
      var eveiftr = false;
      if (listdata[ind].selected) {
        listdata[ind].selected = false;
        eveiftr = false;
        _this.setData({
          isAllselect: false
        })
      } else {
        listdata[ind].selected = true;
        eveiftr = true;
      };
      var group_id = listdata[ind].group_id || '';
      if (group_id && group_id > 0) {
        for (var i = 0; i < listdata.length; i++) {
          if (listdata[i].group_id == group_id) {
            listdata[i].selected = eveiftr;
          };
        };
      };
    };

    var iftrcom = true;
    for (var i = 0; i < listdata.length; i++) {
      if (!listdata[i].selected && listdata[i].status != 1) {
        iftrcom = false;
      };
    };
    _this.setData({
      listdata: listdata,
      isAllselect: iftrcom
    });
    // 计算价格
    // 全选中
    var num = 0;
    var price = 0;
    if (iftrcom) {
      for (var i = 0; i < listdata.length; i++) {
        if (listdata[i].status != 1) {
          num = num + 1
          if (listdata[i].group_id > 0 && listdata[i].end) {
            price = parseFloat(price) + parseFloat(listdata[i].group_price)
          } else if (listdata[i].group_id == 0) {
            price = parseFloat(price) + parseFloat(listdata[i].shop_price)
          };
        }
      };

      // 组合商品
      var group_id_y = [];
      var group_id_n = [];
      var group_id_o = [];
      for (var a = 0; a < listdata.length; a++) {
        var group_chinum = 0;
        var group_chi_id = 0;
        var toyeveumber = 0;
        for (var l = 0; l < listdata.length; l++) {
          if (listdata[l].status != 1 && listdata[l].group_id != 0 && listdata[a].group_id == listdata[l].group_id) {
            if (listdata[l].selected) {
              group_chinum++;
            };
            group_chi_id = listdata[l].group_id;
            toyeveumber = parseInt(listdata[l].toyNumber)
          };
        };
        if (group_chi_id > 0 && group_chinum == toyeveumber) {
          group_id_y.push(parseInt(group_chi_id));
        } else if (group_chi_id > 0) {
          group_id_n.push(parseInt(group_chi_id));
        };
        if (group_chi_id > 0 && group_chinum > 0 && group_chinum != toyeveumber) {
          group_id_o.push(parseInt(group_chi_id))
        };
      };

      group_id_y = this.unique(group_id_y);
      group_id_n = this.unique(group_id_n);
      group_id_o = this.unique(group_id_o);


    } else {
      // 单个商品
      for (var i = 0; i < listdata.length; i++) {
        if (listdata[i].status != 1 && listdata[i].group_id == 0 && listdata[i].selected) {
            price = parseInt(price) + parseInt(listdata[i].shop_price);
            num++;
        };
      };
      // 组合商品
      var group_id_y = [];
      var group_id_n = [];
      var group_id_o = [];
      for (var a = 0; a < listdata.length; a++){
        var group_chinum = 0;
        var group_chi_id = 0;
        var toyeveumber = 0;
        for (var l = 0; l < listdata.length; l++) {
          if (listdata[l].status != 1 && listdata[l].group_id != 0&&listdata[a].group_id == listdata[l].group_id) {
            if (listdata[l].selected){
              group_chinum++;
            };
            group_chi_id = listdata[l].group_id;
            toyeveumber = parseInt(listdata[l].toyNumber)
          };
        };
        if (group_chi_id>0&&group_chinum == toyeveumber) {
          group_id_y.push(parseInt(group_chi_id));
        } else if (group_chi_id > 0){
          group_id_n.push(parseInt(group_chi_id));
        };
        if (group_chi_id > 0 && group_chinum > 0 && group_chinum != toyeveumber){
          group_id_o.push(parseInt(group_chi_id))
        };
      };
      
      group_id_y = this.unique(group_id_y);
      group_id_n = this.unique(group_id_n);
      group_id_o = this.unique(group_id_o);

      for (var i = 0; i < listdata.length;i++){
        for (var y = 0; y < group_id_y.length;y++){
          if (listdata[i].status != 1 &&listdata[i].group_id == group_id_y[y] && listdata[i].end && listdata[i].selected){
            price = parseInt(price) + parseInt(listdata[i].group_price);
            num += parseFloat(listdata[i].toyNumber)
          };
        };
        for (var n = 0; n < group_id_n.length; n++) {
          if (listdata[i].status != 1 && listdata[i].group_id == group_id_n[n] && listdata[i].selected) {
            price = parseInt(price) + parseInt(listdata[i].shop_price);
            num++;
          };
        };
      };
    }
    _this.setData({
      goodsNum: num,
      goodsAmount: parseFloat(price).toFixed(2),
      group_id_y: group_id_y || [],
      group_id_n: group_id_n || [],
      group_id_o: group_id_o || []
    });
  },
  // 数组去重
  unique:function (arr) {
    return Array.from(new Set(arr))
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
    var _this = this
    if (this.data.ownoth == 1) {
      this.listdataown(0)
    } else {
      this.listdata(0)
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this
    if (this.data.ownoth == 1) {
      this.listdataown(1)
    } else {
      this.listdata(1)
    }
  },

  onShow: function () {
    var _this = this
    if (_this.data.isonshow) {
      if (this.data.ownoth == 1) {
        this.listdataown(0)
      } else {
        this.listdata(0)
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this
    var share = {
      title: "快来围观我的玩具柜,直接下单,美拆发货,官方售后",
      path: "/page/component/pages/myothertoydg/myothertoydg?ownerId=" + _this.data.uid,
      imageUrl: _this.data.snapshot,
      success: function (res) {
      }
    }
    return share;
  },
  onShareTimeline:function(){
    var _this = this;
    return {
      title:'快来围观我的玩具柜，直接下单，美拆发货，官方售后',
      query:{
        'ownerId':_this.data.uid
      },
      imageUrl:_this.data.listdataown[0].goods_img
    }
  },


  // 计算图片大小
  imageLoadad: function (e) {
    var _this = this;
    var ind = parseInt(e.currentTarget.dataset.ind || e.target.dataset.ind || 0);
    var listdata = this.data.listdata;
    var $width = e.detail.width,
      $height = e.detail.height,
      ratio = $width / $height;
    var viewWidth = 150 * ratio,
      viewHeight = 150;
    if (viewWidth > 150) {
      viewWidth = 150;
    };
    if (viewWidth > _this.data.iefwidth) {
      _this.setData({
        iefwidth: viewWidth
      });
    }
    if (listdata[ind]) {
      listdata[ind].width = viewWidth;
      listdata[ind].ratio = ratio;
      _this.setData({
        listdata: listdata
      })
    };

  },

  // 导航跳转
  whomepage: function () {
    wx.reLaunch({
      url: "/pages/index/index?judgeprof=2"
    });
  },

  dlfindfun: function () {
    wx.reLaunch({
      url: "/page/component/pages/dlfind/dlfind",
    })
  },

  // 导航跳转 
  wnews: function () {
    var _this = this;
    app.limitlottery(_this);
  },

  wshoppingCart: function () {
    wx.redirectTo({
      url: "/pages/shoppingCart/shoppingCart"
    });
  },

  wmy: function () {
    app.signindata.iftr_mc = true;
    wx.redirectTo({
      url: "/pages/wode/wode"
    });
  },

  // 立即购买弹框
  dsbbbutclickt: function () {
    var oIds = [];
    var listdata = this.data.listdata || [];
    for (var i = 0; i < listdata.length; i++) {
      if (listdata[i].selected) {
        oIds.push(parseInt(listdata[i].order_id))
      }
    };
    if (oIds.length == 0) {
      app.showToastC('请选中商品');
      return false;
    };
    this.setData({
      tipbacktwo: true,
      buybombsimmediately: true
    });
    this.amountcalculation()
  },

  tipbacktwo: function () {
    this.setData({
      tipbacktwo: false,
      buybombsimmediately: false,
      receivingaddress: false,
    });
  },

  // 收货地址弹框
  seladdressfun: function () {
    this.setData({
      receivingaddress: true,
      addressefm:false
    });
  },

  // 隐藏收货地址弹框
  receivingaddressfun: function () {
    this.setData({
      receivingaddress: false,
    })
  },

  // 编辑地址
  jumpeditaddress: function (event) {
    var aid = event.target.dataset.aid || event.currentTarget.dataset.aid;
    var address = event.target.dataset.address || event.currentTarget.dataset.address;
    var city = event.target.dataset.city || event.currentTarget.dataset.city;
    var consignee = event.target.dataset.consignee || event.currentTarget.dataset.consignee;
    var district = event.target.dataset.district || event.currentTarget.dataset.district;
    var idcard = event.target.dataset.idcard || event.currentTarget.dataset.idcard;
    var phone = event.target.dataset.phone || event.currentTarget.dataset.phone;
    var province = event.target.dataset.province || event.currentTarget.dataset.province;
    wx.navigateTo({
      url: "/pages/shippingAddress/shippingAddress?aid=" + aid + '&address=' + address + '&city=' + city + '&consignee=' + consignee + '&district=' + district + '&idcard=' + idcard + '&phone=' + phone + '&province=' + province
    })
  },

  // 跳转增加新地址
  jumpaddress: function () {
    wx.navigateTo({
      url: "/pages/newreceivingaddress/newreceivingaddress"
    })
  },

  // 阻止蒙层冒泡
  preventD() { },

  pricedetailc: function () { // 价格明细显示隐藏
    this.setData({
      pricedetailc: !this.data.pricedetailc
    })
  },

  // 金额计算
  amountcalculation: function () {
    var _this = this
    // 运费 
    var xianshi = '0.00';
    var freightiftr = '0.00';
    var amount = '0.00';
    // 商品个数
    var mcnum = 1;


    // var listdata = _this.data.listdata||[];
    // var group_id_y = _this.data.group_id_y||[];
    // var shopAmount = 0;
    // if (listdata.length!=0){
    //   for (var i = 0; i < listdata.length;i++){
    //     if (listdata[i].selected && listdata[i].channelId != 3 && listdata[i].channelId!=5){
    //       if (group_id_y.length!=0){
    //         for (var j = 0; j < group_id_y.length;j++){

    //         };
    //       };
          
          
    //       shopAmount += listdata[i].shop_price;
    //     };
    //   };
    // };


    if ((this.data.defaultinformation.carriage.free || "99") != '-1') {
      var tddefcarfr = parseFloat(this.data.defaultinformation.carriage.free || "99");
      if (mcnum >= parseFloat(this.data.defaultinformation.carriage.freeMCPieces)) {
        if (this.data.defaultinformation.carriage.freeMCPieces == 1) {
          freightiftr = 0;
          xianshi = '限时包邮';
        } else {
          freightiftr = 0;
          xianshi = '商品包邮';
        };
      } else if (_this.data.goodsAmount >= tddefcarfr) {
        freightiftr = 0;
        xianshi = '满￥' + parseFloat(this.data.defaultinformation.carriage.free || "99").toFixed(2) + '包邮';
      } else {
        var tdzuncar = this.data.defaultinformation.carriage.d;
        xianshi = '￥' + parseFloat(tdzuncar).toFixed(2);
        freightiftr = parseFloat(tdzuncar);
      };
    } else {
      var tdzuncar = this.data.defaultinformation.carriage.d;
      xianshi = '￥0.00';
      freightiftr = parseFloat(tdzuncar);
    };
    let payprice = parseFloat(parseFloat(_this.data.goodsAmount) + freightiftr);
    let useblindAmountpayable = _this.data.blindboxMoney>(payprice.toFixed(2)*_this.data.deductRatio)?payprice.toFixed(2)*_this.data.deductRatio:_this.data.blindboxMoney;
    let amountpayable = _this.data.blindboxMoney!=0? _this.data.isDeduct? _this.data.isUseBlindboxMoney? (payprice.toFixed(2)-useblindAmountpayable).toFixed(2) :payprice.toFixed(2) :payprice.toFixed(2) :payprice.toFixed(2)
    console.log(amountpayable)
    this.setData({
      total: amountpayable,
      freight: xianshi,
      freightiftr: freightiftr,
      // 原始应付金额
      originalAmountpayable: payprice,
      // 使用抽盒金后应付金额
      useblindAmountpayable: parseFloat(useblindAmountpayable).toFixed(3).slice(0,-1),
    });
  },

  // 下一页返回调取
  nextpagediao: function () {
    var _this = this;
    //  调取收货地址
    var q = Dec.Aese('mod=address&operation=getlist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'user.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          var rdl = res.data.List;
          var tptipadi = '';
          var tptipadd = '';
          var tipnamephone = '';
          if (rdl.length != 0) {
            var isshowaddress = true;
            for (var i = 0; i < rdl.length; i++) {
              if (rdl[i].isdefault == 1) {
                rdl[i].checked = true;
                isshowaddress=false;
                tptipadi = rdl[i].aid;
                tptipadd = rdl[i].address;
                tipnamephone = rdl[i].consignee + " " + rdl[i].phone;
                _this.setBlindBoxDefaultAddress(rdl[i].aid);
              } else {
                rdl[i].checked = false;
              }
              rdl[i].mchecked = false;
            };
            _this.data.tipaid = tptipadi;
            _this.setData({
              addressdata: rdl,
              tipnamephone: tipnamephone,
              tipaddress: tptipadd,
              isshowaddress: isshowaddress
            })
          } else {
            _this.setData({
              addressdata: [],
            })
          };
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);

      }
    });
  },

  // 删除地址
  deladdress: function (event) {
    var _this = this;
    var dat = this.data.addressdata;
    var indid = event.target.dataset.ind;
    var num = '';
    for (var i = 0; i < dat.length; i++) {
      if (dat[i].aid == indid) {
        num = i;
      }
    };
    wx.showModal({
      content: '您确定要删除这个地址吗？',
      success: function (res) {
        if (res.confirm) {
          var q = Dec.Aese('mod=address&operation=delete&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + indid)
          wx.request({
            url: app.signindata.comurl + 'user.php' + q,
            method: 'GET',
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              if (res.data.ReturnCode == 200) {
                dat.splice(num, 1);
                _this.setData({
                  addressdata: dat
                });
              };
              if (res.data.ReturnCode == 908) {
                app.showToastC('aid和uid不匹配');
              };
              // 判断非200和登录
              Dec.comiftrsign(_this, res, app);
            }
          })

        }
      }
    })
  },

  // 修改收货地址
  revisethereceivingaddress: function (w) {
    var tipaid = w.currentTarget.dataset.tipaid || w.target.dataset.tipaid;
    var tipadd = w.currentTarget.dataset.tipadd || w.target.dataset.tipadd;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind||0;
    this.data.tipaid = tipaid;
    var data = this.data.addressdata;
    this.setData({
      tipnamephone: data[ind].consignee + " " + data[ind].phone,
      tipaddress: tipadd,
      receivingaddress: false
    });
  },

  // 买家备注
  inputChange: function (e) {
    this.setData({
      desc: e.detail.value
    });
  },

  // 提交订单
  placeorder: function () {
    var _this = this;
    if (this.data.tipaid == '') {
      app.showToastC('请选择地址');
      return false;
    };
    var listdata = _this.data.listdata
    var oIds = [];
    var goods_ids = [];
    var group_id = _this.data.group_id_y.concat(_this.data.group_id_o);
    for (var i = 0; i < listdata.length; i++) {
      if (listdata[i].selected) {
        oIds.push(parseInt(listdata[i].order_id));
        goods_ids.push(parseInt(listdata[i].id));
      };
    };
    var aid = _this.data.tipaid;
    oIds = JSON.stringify(oIds).replace("[", "").replace("]", "");
    goods_ids = JSON.stringify(goods_ids).replace("[", "").replace("]", "");
    if (group_id.length == 0) { group_id = '' } else { group_id = JSON.stringify(group_id).replace("[", "").replace("]", "");};
    _this.data.placeoIds = oIds;
    _this.data.placetoyIds = goods_ids;
    // 提交订单蒙层
    _this.setData({
      suboformola: true,
    });
    var q = Dec.Aese('mod=cabinet&operation=buy&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oIds=' + oIds + '&totalPrice=' + _this.data.goodsAmount + '&ownerId=' + _this.data.ownerId + '&aid=' + aid + '&desc=' + _this.data.desc + '&toyId=' + goods_ids + '&groupIds=' + group_id+'&isDeduct='+_this.data.isDeductNum);
    console.log('mod=cabinet&operation=buy&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oIds=' + oIds + '&totalPrice=' + _this.data.goodsAmount + '&ownerId=' + _this.data.ownerId + '&aid=' + aid + '&desc=' + _this.data.desc + '&toyId=' + goods_ids + '&groupIds=' + group_id+'&isDeduct='+_this.data.isDeductNum)
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            tipbacktwo: true,
            buybombsimmediately: true,
            receivingaddress: false,
            cart_id: res.data.Info.cart_id,
          });
          // 微信支付
          _this.paymentmony()
        } else {
          // 提交订单蒙层
          _this.setData({
            suboformola: false
          });
          app.showToastC(res.data.Msg);
        };
      }
    })
  },

  // 微信支付
  paymentmony: function () {
    var _this = this;
    var q = Dec.Aese('mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + _this.data.cart_id + '&xcx=1' + '&openid=' + _this.data.openid)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          // 支付完成弹框显示数据
          var payinfo = res.data.Info;

          wx.requestPayment({
            'timeStamp': res.data.Info.timeStamp.toString(),
            'nonceStr': res.data.Info.nonceStr,
            'package': res.data.Info.package,
            'signType': 'MD5',
            'paySign': res.data.Info.paySign,
            'success': function (res) {
              _this.setData({
                tipbacktwo: false,
                buybombsimmediately: false,
                suboformola: false,
                desc: '',
                goodsNum: 0,
                goodsAmount: 0.00,
                isAllselect: false,
                isdelivergoods: true,
                addressefm:false
              });

              var cart_id = _this.data.cart_id || '0';


              _this.listdata(0)
              app.showToastC('购买成功');

              // 更新抽盒金
              if(_this.data.isDeduct && _this.data.isUseBlindboxMoney){
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
                      app.signindata.blindboxMoney = res.data.Info.blindbox_money || ""
                    };
                  }
                })
              }

            },
            'fail': function (res) {
              _this.setData({
                tipbacktwo: false,
                buybombsimmediately: false,
                suboformola: false,
                desc: '',
                goodsNum: 0,
                goodsAmount: 0.00,
                isAllselect: false,
                addressefm: false
              });
              _this.listdata(0)
            },
            'complete': function (res) {
              // 订阅授权
              
            }
          })
        } else {
          // 提交订单蒙层
          _this.setData({
            suboformola: false
          });
          if (res.data.ReturnCode == 800) {
            app.showToastC('非该用户订单');
          };
          if (res.data.ReturnCode == 815) {
            app.showToastC('订单状态错误');
          };
          if (res.data.ReturnCode == 816) {
            app.showToastC('不支持的支付类型');
          };
          if (res.data.ReturnCode == 817) {
            app.showToastC('付款明细已生成');
          };
          if (res.data.ReturnCode == 201) {
            app.showToastC('微信预支付失败');
          };
          if (res.data.ReturnCode == 805) {
            app.showToastC('剩余库存不足');
          };
          // 判断非200和登录
          Dec.comiftrsign(_this, res, app);
        };
      }
    })
  },

  delivergoods: function () {
    var _this = this;

    var qqq = Dec.Aese('mod=cabinet&operation=deliverGoods&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oIds=' + _this.data.placeoIds + '&toyIds=' + _this.data.placetoyIds + '&type=Others');

    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          _this.setData({
            isdelivergoods: false,
          });
          app.jumporder(_this);
        } else {
          app.showToastC(res.data.Msg);
        };
      }
    });
  },

  //  获取滚动条位置
  scrollleftf: function (event) {
    this.setData({
      scrolllefthq: event.detail.scrollLeft,
      scrollwidth: event.detail.scrollWidth
    })
  },


  getimginfolist: function () {
    var _this = this

    if (this.data.ownoth == 1) {
      var mlist = [];
      for (let i = 0; i < _this.data.listdataown.length; i++) {
        if (_this.data.listdataown[i].shop_price > 0 && _this.data.listdataown[i].status == 0) {
          mlist.push(_this.data.listdataown[i])
        }
      }
    } else {
      var mlist = _this.data.listdata;
    };
    for (let i = 0; i < mlist.length; i++) {
      if (true) {
        wx.getImageInfo({
          src: mlist[i].goods_img,
          success: function (head) {
            mlist[i].localhead = head.path
            if (i == mlist.length - 1) {
              _this.setData({
                listdata: mlist,
              })
              setTimeout(function () {
                _this.getSnapshot()
              }, 1000)

            }
          },
          fail: function (res) {
            mlist[i].localhead = ""
            if (i == mlist.length - 1) {
              _this.setData({
                listdata: mlist,
              })
              setTimeout(function () {
                _this.getSnapshot()
              }, 1000)
            }
          }
        })
      } else {
        mlist[i].localhead = ""
        if (i == mlist.length - 1) {
          _this.setData({
            listdata: mlist,
          })
          setTimeout(function () {
            _this.getSnapshot()
          }, 1000)
        }
      }
    }
  },

  /**
   * 生成截图
   */
  getSnapshot: function () {
    var _this = this;
    
    // var mlist = _this.data.listdata
    if (this.data.ownoth == 1) {
      var mlist = [];
      for (let i = 0; i < _this.data.listdataown.length; i++) {
        if (_this.data.listdataown[i].shop_price > 0 && _this.data.listdataown[i].status == 0) {
          mlist.push(_this.data.listdataown[i])
        }
      }
    } else {
      var mlist = _this.data.listdata;
    };

    const ctx = wx.createCanvasContext('snapshot')
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 300, 240)

    var imgHeight = 40; // 顶部 10 价格 10
    var singlewidth = 50;
    var recordTopInterval = 10;
    var recordLeftInterval = 0;

    var groupricelength = 0;
    var groupleft = 0;
    var groupnum = 0;
    var mlistlength = 0;
    // 行
    var linehang = 1;

    // x轴偏移量
    var off_x = 0;
    // y轴偏移量
    var off_y = 0;


    if(mlist.length>24){
      mlist.splice(2);
    };
    mlistlength = mlist.length;
    if (mlist.length == 1) {
      imgHeight = 180;
      singlewidth = 240;
      recordTopInterval = 20;
      recordLeftInterval = 30;
      off_x = 30;
    } else if (mlist.length == 2) {
      imgHeight = 130;
      singlewidth = 140;
      recordTopInterval = 50;
      recordLeftInterval = 10;
      off_x = 10;
    } else if (mlist.length == 3) {
      imgHeight = 83;
      singlewidth = 93;
      recordTopInterval = 70;
      recordLeftInterval = 7;
      off_x = 7;
    } else if (mlist.length == 4) {
      imgHeight = 60;
      singlewidth = 70;
      recordTopInterval = 80;
      recordLeftInterval = 10;
      off_x = 10;
    } else if (5 <= mlist.length && mlist.length < 9) {
      imgHeight = 60;
      singlewidth = 70;
      recordTopInterval = 46;
      recordLeftInterval = 7;
      off_x = 7;
    } else if (9 <= mlist.length && mlist.length <= 12) {
      imgHeight = 50;
      singlewidth = 60;
      recordTopInterval = 20;
      recordLeftInterval = imgHeight/2;
      off_x = imgHeight / 2;
    } else if (12 < mlist.length && mlist.length < 16) {
      imgHeight = 45;
      singlewidth = 55;
      recordTopInterval = 25;
      recordLeftInterval = 13;
      off_x =13;
    } else if (16 <= mlist.length && mlist.length <= 20) {
      imgHeight = 40;
      singlewidth = 50;
      recordTopInterval = 10;
      recordLeftInterval = imgHeight/2;
      off_x = imgHeight / 2;
    } else if (20 < mlist.length && mlist.length < 24) {
      imgHeight = 40;
      singlewidth = 50;
      recordTopInterval = 10;
      off_x = 0;
    } else {
      imgHeight = 40;
      singlewidth = 50;
      recordTopInterval = 5;
      off_x = 0;
    };

    var lineobj ={}; 
    console.log('mlist==========',mlist)
    for (let i = 0; i < mlist.length; i++) {
      ctx.setFontSize(10);
      ctx.fillStyle = 'red';
      if (mlist[i].ratio && mlist[i].ratio != null && typeof (mlist[i].ratio) != "undefined") {
      } else {
        mlist[i].ratio = 1;
      }
      var str = "￥" + parseInt(mlist[i].shop_price)
      var leftInterval = (singlewidth - imgHeight * mlist[i].ratio) / 2;
      if (mlist[i].localhead && mlist[i].localhead != "") {
        ctx.drawImage(mlist[i].localhead, recordLeftInterval + leftInterval, recordTopInterval, imgHeight * mlist[i].ratio, imgHeight);
      }
      // 
      if (mlist[i].group_id != "0") {
        ctx.setFontSize(10);
        if (mlistlength <= 3) {
          ctx.setFontSize(14);
        } else if (mlistlength > 3 && mlistlength <= 6) {
          ctx.setFontSize(12);
        } else {
          ctx.setFontSize(10);
        };
        lineobj[i] = mlist[i].group_id;

        groupricelength += 50;
        if (!mlist[i].end) {
          var addlocation = 0;
          if (mlist[i + 1] && mlist[i + 1].ratio) {
            addlocation = recordLeftInterval + leftInterval + imgHeight * mlist[i].ratio + (singlewidth - imgHeight * mlist[i + 1].ratio) / 2 - 5;
          }
          ctx.fillText("+", addlocation, recordTopInterval + imgHeight / 2)

          if (groupleft == 0) {
            groupleft = recordLeftInterval + leftInterval;
          }
        } else {};
          if (lineobj[i - 1] != mlist[i].group_id) {
            if (mlistlength <= 3) {
              ctx.setFontSize(14);
              var txttop = recordTopInterval + imgHeight + 13;
            } else if (mlistlength > 3 && mlistlength <= 6) {
              ctx.setFontSize(12);
              var txttop = recordTopInterval + imgHeight + 13
            } else {
              ctx.setFontSize(10);
              var txttop = recordTopInterval + imgHeight + 10
            };
            var groupstr = "组合价:￥" + mlist[i].group_price;
            var groupstrwidth = ctx.measureText(groupstr).width;
            if ((300 - (recordLeftInterval + singlewidth)) < singlewidth) {
              ctx.fillText(groupstr, recordLeftInterval + leftInterval - 20, txttop);
            } else {
              ctx.fillText(groupstr, recordLeftInterval + leftInterval, txttop);
            }

          };

      } else {
        if (mlistlength<=3){
          ctx.setFontSize(14);
          var txttop = recordTopInterval + imgHeight + 13;
        } else if (mlistlength > 3 && mlistlength<=6){
          ctx.setFontSize(12);
          var txttop = recordTopInterval + imgHeight + 10;
        }else{
          ctx.setFontSize(10);
          var txttop = recordTopInterval + imgHeight + 10;
        };
        var strlength = ctx.measureText(str).width;
        ctx.fillText(str, recordLeftInterval + leftInterval - (strlength / 2) + (imgHeight * mlist[i].ratio)/2, txttop)
      }

      if (mlist[i].chancelId == 2){
        ctx.setFontSize(7);
        var txtw = ctx.measureText('盲盒全新未拆').width;
        var redtxt = recordLeftInterval + leftInterval + (imgHeight * mlist[i].ratio - txtw) / 2
        var redtxttop = recordTopInterval + imgHeight;
        ctx.setFillStyle("#e94f57");
        ctx.fillRect(redtxt - 3, redtxttop - 10, txtw + 6, 10);
        ctx.fillStyle = '#fff';
        _this.drawText(ctx, '盲盒全新未拆', redtxt + 1, redtxttop - 2, 0, txtw, 7, 1)
      }else if (mlist[i].chancelId == 3) {
        ctx.setFontSize(7);
        var txtw = ctx.measureText('隐藏碎片').width;
        var redtxt = recordLeftInterval + leftInterval + (imgHeight * mlist[i].ratio - txtw) / 2
        var redtxttop = recordTopInterval + imgHeight;
        ctx.setFillStyle("#e94f57");
        ctx.fillRect(redtxt - 3, redtxttop - 10, txtw + 6, 10);
        ctx.fillStyle = '#fff';
        _this.drawText(ctx, '隐藏碎片', redtxt + 1, redtxttop - 2, 0, txtw, 7, 1)
      } else if (mlist[i].chancelId == 5){
        ctx.setFontSize(7);
        var txtw = ctx.measureText('随机盲盒碎片').width;
        var redtxt = recordLeftInterval + leftInterval + (imgHeight * mlist[i].ratio - txtw) / 2
        var redtxttop = recordTopInterval + imgHeight;
        ctx.setFillStyle("#e94f57");
        ctx.fillRect(redtxt - 3, redtxttop - 10, txtw + 6, 10);
        ctx.fillStyle = '#fff';
        _this.drawText(ctx, '随机盲盒碎片', redtxt + 1, redtxttop - 2, 0, txtw, 7, 1)        
      }

      recordLeftInterval = recordLeftInterval + singlewidth
      // if ((i + 1) % 6 == 0 ) {   || groupnum >= 2
      if ((300 - recordLeftInterval) < singlewidth) {
        recordLeftInterval = off_x;
        recordTopInterval = recordTopInterval + imgHeight + 20;
        groupnum = 0;
        linehang++;
        if ((240 - recordTopInterval) < imgHeight) {
          break;
        }
      }
    }


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


  getPosterList: function () {
    var _this = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var q = Dec.Aese("mod=cabinet&operation=sharingList&uid=" + _this.data.uid + "&loginid=" + _this.data.loginid + "&&ownerId=" + _this.data.ownerId);

    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.ReturnCode == 200 && res.data.List.sharingList.length > 0) {
          _this.setData({
            posterList: res.data.List.sharingList,
            qCodePath: res.data.Info.qCodePath,
            posterTips: res.data.Info.Tips,
          })
          _this.downloadPosterImg()
        } else {
          _this.setData({
            ishowempty: true,
          })
          wx.hideLoading()
        }
      },
      fail: function () {
        app.showToastC(res.data.Msg);
      }
    })
  },

  downloadPosterImg: function () {
    var _this = this
    var mlist = _this.data.posterList;
    for (let i = 0; i < mlist.length; i++) {
      wx.getImageInfo({
        src: mlist[i].goods_img,
        success: function (head) {
          mlist[i].localhead = head.path;
          mlist[i].ratio = head.width / head.height;
          if (i == mlist.length - 1) {
            _this.setData({
              posterList: mlist,
            })
            setTimeout(function () {
              _this.dowbloadhead()
            }, 1000)
          }
        },
        fail: function (res) {
          mlist[i].localhead = "";
          mlist[i].ratio = 0;
          if (i == mlist.length - 1) {
            _this.setData({
              posterList: mlist,
            })
            setTimeout(function () {
              _this.dowbloadhead()
            }, 1000)
          }
        }
      })
    }
  },

  dowbloadhead: function () {
    var _this = this
    var uidimg = app.signindata.avatarUrl || 'https://static.51chaidan.com/images/headphoto/' + _this.data.ownerId + '.jpg';
    if (uidimg) {
      var tdavatar = uidimg;
    } else {
      var tdavatar = _this.data.userInfo.litpic;
    };

    wx.getImageInfo({
      src: tdavatar,
      success: function (res) {
        _this.setData({
          headImageInfo: res.path
        })
        _this.downloadqCode()
      },
      fail: function () {
        _this.downloadqCode()
      }
    })

  },

  downloadqCode: function () {
    var _this = this
    wx.getImageInfo({
      src: _this.data.qCodePath,
      success: function (res) {
        _this.setData({
          qCodeImageInfo: res.path
        })
        _this.createPoster()
      },
      fail: function () {
        _this.createPoster()
      }
    })
  },

  createPoster: function () {
    var _this = this
    var mlist = _this.data.posterList;
    var imgHeight;
    var linenum;
    var canvasHeight;
    var top = 50;
    if (mlist.length == 1) {
      imgHeight = 200;
      linenum = 1;
    } else if (mlist.length == 2) {
      imgHeight = 120;
      linenum = 2;
    } else if (mlist.length == 4) {
      imgHeight = 120;
      linenum = 2;
    } else if (mlist.length == 3) {
      imgHeight = 80;
      linenum = 3;
    } else if (mlist.length > 4 && mlist.length < 10) {
      imgHeight = 80;
      linenum = 3;
    } else if (mlist.length >= 10) {
      imgHeight = 40;
      linenum = 6;
    }
    var singlewidth = 300 / linenum;
    var sumLine = mlist.length % linenum == 0 ? parseInt(mlist.length / linenum) : parseInt(mlist.length / linenum) + 1

    canvasHeight = sumLine * (imgHeight + 50) + 100
    if (canvasHeight * 2 > 900) {
      var u = 450 / canvasHeight;
      _this.setData({
        canvasHeight: canvasHeight,
        posterheight: 450,
        posterwidth: 600 * u,
      })
    } else {
      _this.setData({
        canvasHeight: canvasHeight,
        posterheight: canvasHeight,
        posterwidth: 600,
      })
    }

    const ctx = wx.createCanvasContext('poster')
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 300, canvasHeight)

    //绘制圆头像
    ctx.save();
    ctx.beginPath(); //开始绘制
    ctx.arc(25, 25, 15, 0, Math.PI * 2, false);
    ctx.clip();
    if (_this.data.headImageInfo != '') {
      ctx.drawImage(_this.data.headImageInfo, 10, 10, 30, 30);
    }
    ctx.restore();

    ctx.setFontSize(13);
    ctx.fillStyle = 'black';
    ctx.fillText(_this.data.userInfo.nick + "的玩具柜", 50, 30)
    if (_this.data.qCodeImageInfo != '') {
      ctx.drawImage(_this.data.qCodeImageInfo, 10, canvasHeight - 50, 40, 40);
    }
    ctx.fillText(_this.data.posterTips, 60, canvasHeight - 20)

    //绘制圆头像
    ctx.save();
    ctx.beginPath(); //开始绘制
    ctx.arc(30, canvasHeight - 30, 10, 0, Math.PI * 2, false);
    ctx.clip();
    if (_this.data.headImageInfo != '') {
      ctx.drawImage(_this.data.headImageInfo, 20, canvasHeight - 40, 20, 20);
    }
    ctx.restore();

    var recordLeftInterval = 0;
    var recordTopInterval = 0;
    ctx.setFontSize(10);
    for (var i = 0; i < mlist.length; i++) {
      var leftInterval = (singlewidth - imgHeight * mlist[i].ratio) / 2;
      if (mlist[i].localhead && mlist[i].localhead != "") {
        ctx.drawImage(mlist[i].localhead, recordLeftInterval + leftInterval, top + recordTopInterval, imgHeight * mlist[i].ratio, imgHeight);
      }
      if (mlist[i].chancelId == 2) {

        var redtxt = (singlewidth - ctx.measureText('盲盒全新未拆').width) / 2
        var redtxttop = top + imgHeight + recordTopInterval - 4;
        ctx.save();
        ctx.setFillStyle("#e94f57");
        ctx.fillRect(recordLeftInterval + redtxt - 3, redtxttop - 10, ctx.measureText('盲盒全新未拆').width + 6, 14);
        ctx.fillStyle = '#fff';
        if (redtxt > 0) {
          _this.drawText(ctx, '盲盒全新未拆', recordLeftInterval + redtxt, redtxttop + 1, 0, ctx.measureText('盲盒全新未拆').width, 10, 1)
        } else {
          _this.drawText(ctx, '盲盒全新未拆', recordLeftInterval, redtxttop + 1, 0, ctx.measureText('盲盒全新未拆').width, 10, 1)
        };

      }else if (mlist[i].chancelId == 3) {

        var redtxt = (singlewidth - ctx.measureText('隐藏碎片').width) / 2
        var redtxttop = top + imgHeight + recordTopInterval - 4;
        ctx.save();
        ctx.setFillStyle("#e94f57");
        ctx.fillRect(recordLeftInterval + redtxt - 3, redtxttop - 10, ctx.measureText('隐藏碎片').width + 6, 14);
        ctx.fillStyle = '#fff';
        if (redtxt > 0) {
          _this.drawText(ctx, '隐藏碎片', recordLeftInterval + redtxt, redtxttop + 1, 0, ctx.measureText('隐藏碎片').width, 10, 1)
        } else {
          _this.drawText(ctx, '隐藏碎片', recordLeftInterval, redtxttop + 1, 0, ctx.measureText('隐藏碎片').width, 10, 1)
        };

      }else if (mlist[i].chancelId == 5) {

        var redtxt = (singlewidth - ctx.measureText('随机盲盒碎片').width) / 2
        var redtxttop = top + imgHeight + recordTopInterval - 4;
        ctx.save();
        ctx.setFillStyle("#e94f57");
        ctx.fillRect(recordLeftInterval + redtxt - 3, redtxttop - 10, ctx.measureText('随机盲盒碎片').width + 6, 14);
        ctx.fillStyle = '#fff';
        if (redtxt > 0) {
          _this.drawText(ctx, '随机盲盒碎片', recordLeftInterval + redtxt, redtxttop + 1, 0, ctx.measureText('随机盲盒碎片').width, 10, 1)
        } else {
          _this.drawText(ctx, '随机盲盒碎片', recordLeftInterval, redtxttop + 1, 0, ctx.measureText('随机盲盒碎片').width, 10, 1)
        };

      } else {
        ctx.fillStyle = 'black';
        var nameLeftInterval = (singlewidth - ctx.measureText(mlist[i].goods_name).width) / 2
        var nameTopInterval = top + imgHeight + 30 + recordTopInterval
        if (nameLeftInterval > 0) {
          _this.drawText(ctx, mlist[i].goods_name, recordLeftInterval + nameLeftInterval, nameTopInterval, 0, singlewidth, 15, 1)
        } else {
          _this.drawText(ctx, mlist[i].goods_name, recordLeftInterval, nameTopInterval, 0, singlewidth, 10, 1)
        }
      };
      ctx.fillStyle = 'red';
      var priceLeftInterval = (singlewidth - ctx.measureText("￥" + mlist[i].price).width) / 2
      var priceTopInterval = top + imgHeight + 15 + recordTopInterval
      ctx.fillText("￥" + mlist[i].price, recordLeftInterval + priceLeftInterval, priceTopInterval)



      recordLeftInterval = recordLeftInterval + singlewidth
      if ((i + 1) % linenum == 0) {
        recordLeftInterval = 0;
        recordTopInterval = recordTopInterval + imgHeight + 50;
      }
    }

    ctx.draw(true, setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'poster',
        success: function (res) {
          wx.hideLoading()
          _this.setData({
            imgPoster: res.tempFilePath,
            ishowposter: true,
          })
        },
        fail: function (res) {
          wx.hideLoading()
        },
      });
    }, 300));

  },

  //文本换行 参数：1、canvas对象，2、文本 3、距离左侧的距离 4、距离顶部的距离 5，没用 6、文本的宽度 7. 行高  8.行数
  drawText: function (ctx, str, leftWidth, initHeight, titleHeight, canvasWidth, lineheight, linenum) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    var num = 0;
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
        initHeight += lineheight; //16为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 30;
        num += 1;
      }
      if (num == linenum) {
        return;
      }
      if (i == str.length - 1) { //绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }
    }
    // 标题border-bottom 线距顶部距离
    titleHeight = titleHeight + 10;
    return titleHeight
  },

  closeposter: function () {
    this.setData({
      ishowposter: false,
    })
  },

  closeempty: function () {
    this.setData({
      ishowempty: false,
    })
  },

  savePoster: function () {
    var _this = this;
    var imgSrc = _this.data.imgPoster || '';
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
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
                    ishowposter: false,
                  });
                },
                fail() {
                  app.showToastC('保存失败');
                  _this.setData({
                    ishowposter: false,
                  });
                }
              })
            },
            fail() {
              wx.hideLoading()
            }
          })
        } else {
          // 有则直接保存
          wx.saveImageToPhotosAlbum({
            filePath: imgSrc,
            success() {
              app.showToastC('保存成功');
              _this.setData({
                ishowposter: false,
              });
            },
            fail() {
              app.showToastC('保存失败');
              _this.setData({
                ishowposter: false,
              });
            }
          })
        }
      }
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
  // 撤回函数
  withdrawfun:function(w){
    var sid = w.currentTarget.dataset.sid || w.target.dataset.sid || '';
    this.setData({
      withdrawiftr:true,
      toyId: sid
    })
  },
  cancelwidthdraw:function(){
    this.setData({
      withdrawiftr:false
    })
  },
  // 确定撤回
  confirmwidthdraw:function(){
    var _this = this;
    var q = Dec.Aese("mod=cabinet&operation=toyWithdraw&uid=" + _this.data.uid + "&loginid=" + _this.data.loginid + "&toyId=" + _this.data.toyId);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          app.showToastC('撤回成功');
          setTimeout(function(){
            if (_this.data.ownoth == 1) {
              _this.listdataown(0)
            } else {
              _this.listdata(0)
            };
          },2000);
        } else {
          app.showToastC(res.data.Msg)
        };
        _this.setData({
          withdrawiftr: false
        })
      },
      fail: function (res) {
        app.showToastC(res.data.Msg);
      }
    })
    

  },


  agreeset: function () {
    var _this = this;
    _this.setData({
      ishowdeal: false,
      ishowadd: true,
    })
  },

  closedealoradd: function () {
    var _this = this;
    if (!_this.data.ishowdealoradd) {
      _this.setData({
        ishowdealoradd: true,
      })
    } else {
      if (_this.data.ishowadd) {
        _this.setData({
          ishowdeal: true,
          ishowadd: false,
        })
      } else {
        _this.setData({
          ishowdealoradd: false,
        })
      }
    }
  },

  showdealoradd: function () {
    var _this = this;
    _this.setData({
      ishowdealoradd: !_this.data.ishowdealoradd,
    })
  },

  // 跳转增加新地址
  jumpaddress: function () {
    var _this = this;
    wx.navigateTo({
      url: "/pages/newreceivingaddress/newreceivingaddress"
    })
  },

  selectdefult: function (w) {
    var _this = this;
    var ind = w.currentTarget.dataset.ind;
    var addressdata = _this.data.addressdata;
    for (var i = 0; i < addressdata.length; i++) {
      if (i != ind) {
        addressdata[i].mchecked = false;
      }
    }
    if (!addressdata[ind].mchecked) {
      addressdata[ind].mchecked = !addressdata[ind].mchecked;
      _this.setData({
        addressdata: addressdata,
        maddid: addressdata[ind].aid,
      })
    } else {
      addressdata[ind].mchecked = !addressdata[ind].mchecked;
      _this.setData({
        addressdata: addressdata,
        maddid: '',
      })
    }

  },

  setdefultadd: function () {
    var _this = this;
    //  调取收货地址
    var q = Dec.Aese('mod=address&operation=setBlindBoxDefaultAddress&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + _this.data.maddid)

    wx.request({
      url: app.signindata.comurl + 'user.php' + q,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            ishowdealoradd: false,
            isBlindBoxDefaultAddress: true,
            ishowcover: false,
          })
          app.signindata.isBlindBoxDefaultAddress = true;
          _this.nextpagediao();
        }
      }
    });
  },
  jumpDSIE(w){
    var gid = w.currentTarget.dataset.gid;
    console.log('gid=============',gid)
    wx.navigateTo({
      url: "/page/secondpackge/pages/detailSimgEffects/detailSimgEffects?gid="+gid
    });
  },


// 设置抽盒機默認地址
setBlindBoxDefaultAddress: function (aid) {
  var _this = this;
  //  调取收货地址
  var q = Dec.Aese('mod=address&operation=setBlindBoxDefaultAddress&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + aid)
  wx.request({
    url: app.signindata.comurl + 'user.php' + q,
    method: 'GET',
    header: {
      'Accept': 'application/json'
    },
    success: function (res) {
      if (res.data.ReturnCode == 200) {
      }
    }
  });
},

})