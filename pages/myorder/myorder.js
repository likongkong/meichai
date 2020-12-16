var Dec = require('../../common/public.js');//aes加密解密js
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
    windowHeight: app.signindata.windowHeight || 600,
    isProduce: app.signindata.isProduce,
    isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
    // loading 加载
    headhidden: true, 
    bothidden: true,        
    // tab
    myorhtabtr:0,
    // 数据
    myordata:[],
    // 倒计时
    countdown:'',
    // 查看页数
    page:0,
    oid: '',
    amount: '',
    cart_id: '' ,
    // 支付运费cart_id
    cart_idcarry:'',
    paymentiftr: false,
    //  背景
    tipback: false,
    // 支付完成弹框显示
    paymentcompletionwiftr: false,
    // 支付完成赠送卷
    paycheadwsong: '',
    // 分享图片地址
    paycheadwsongimg: '',
    paycheadwsongimgling:'',
    // 判断是否支付完成
    payiftr: false,
    // 分享
    gid:'', 
    title:'' , 
    shareimg:'',
    // 提交支付蒙层
    suboformola: false,
    // 微信号码
    wxnum: 'meichai666666',
    // 支付完成显示分类跳转数据
    shareinfo: '',
    // 领奖提示数据
    awardrresentation: [],
    awardrresentiftr: false,
    awardrresentationjump: '',
    // 支付运费弹框
    payfreightone: false,
    // 支付运费金额
    payfreightmony: 0,
    // 收货地址弹框
    receivingaddress:false ,
    // 防止多次提交
    preventmultiplesubmission: true,
    // 用户头像
    avatarUrl: app.signindata.avatarUrl,
    // 分享图片地址
    actimgshare:'',
    cart_idsave:'',
    uploadscreenshots:false,
    share_desc:'',
    urcShareImg:'',
    urcTitle:'',
    urcOrderType:'',
    couponvalue:'',
    // 领奖提示
    rpinfotip: '',
    actimgshareact:'',
    tgabox:false,
    ifnodata:false,
    // 上传图片
    canvasupimg:{},
    // 上传晒单图片
    generatePicturesimg:{},
    blackCity: app.signindata.blackCity,
    spreadEntry: app.signindata.spreadEntry,
    // 晒单数量
    dryinglistnum: 0,
    shopnum: 0,
    // 晒单数量
    dryinglistnum: 0,
    shopnum: 0,
    defaultinformation:'',
    prizeCover:[],
    order_type_show:1,
    c_title: '我的订单',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,  
    subscrproiftr:false,
    subscrpro:'',
    auditpictime:0,
    pushWay: 0,
    // 上传截图提示弹框
    screenshottipsiftr: false,
    tgaimg: app.signindata.tgaimg || 'https://www.51chaidan.com/images/default/openscreen.jpg',
    pictboxbox: false,
    subscribedata:''
  },
  pictboxboxfun: function () {
    this.setData({ pictboxbox: false });
    // 订阅授权
    app.comsubscribe(this);
  },
  screenshottips: function (w) {
    this.setData({
      screenshottipsiftr: true
    });
  },
  screenshottipsnone: function () {
    this.setData({
      screenshottipsiftr: false
    });
  },

  // 点击登录获取权限
  userInfoHandler: function (e) {
    var _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          _this.setData({
            tgabox: false
          });
          _this.onLoadfun();
        }
      }
    });
  }, 
  // 跳转邀请页面
  invitingfriends: function (w) {
    var cart_id = w.currentTarget.dataset.cart_id || w.target.dataset.cart_id || '0';
    var goods_id = w.currentTarget.dataset.gid || w.target.dataset.gid || '0';
    var goods_name = w.currentTarget.dataset.gname || w.target.dataset.gname || '0';
    var gsale = w.currentTarget.dataset.goods_price || w.target.dataset.goods_price || '0';
    var goods_share = w.currentTarget.dataset.gcover || w.target.dataset.gcover || '0';
    var order_type = w.currentTarget.dataset.order_type || w.target.dataset.order_type || '1';
    var pre_name = w.currentTarget.dataset.pre_name || w.target.dataset.pre_name || '0';
    var ds = w.currentTarget.dataset.ds || w.target.dataset.ds || '';
    if (order_type==2){
      wx.navigateTo({
        url: "/pages/invitingfriends/invitingfriends?goods_id=" + goods_id + "&goods_name=" + goods_name + "&gsale=" + gsale + "&goods_share=" + encodeURIComponent(goods_share) + "&cart_id=" + cart_id + "&shoporact=2"
      });
    }else{
      wx.navigateTo({
        url: "/pages/invitingfriends/invitingfriends?goods_id=" + goods_id + "&goods_name=" + goods_name + "&gsale=" + gsale + "&goods_share=" + encodeURIComponent(goods_share) + "&cart_id=" + cart_id + "&pre_name=" + pre_name + "&ds=" + ds + "&shoporact=1"
      });
    }
  },
  // 订单状态
  dismantling: function (event) {
    var oid = event.currentTarget.dataset.oid || event.target.dataset.oid;
    var order_type = event.currentTarget.dataset.order_type || event.target.dataset.order_type;
    if(order_type==29){
      wx.navigateTo({    
        url: "/page/component/pages/electronicTicket/electronicTicket?oid=" + oid
      })
    }else{
      wx.navigateTo({    
        url: "/page/component/pages/orderdetails/orderdetails?oid=" + oid
      })
    }

  },
  // 查看物流
  lookatthelogistics:function(w){
    var oid = w.target.dataset.oid || w.currentTarget.dataset.oid;
    var gcover = w.target.dataset.gcover || w.currentTarget.dataset.gcover;
    wx.navigateTo({  
      url: "/pages/lookatthelogistics/lookatthelogistics?oid="+oid+'&gcover='+gcover
    })
  },
  // tab切换
  myorhfun:function(e){
    this.setData({
      myorhtabtr: e.currentTarget.dataset.indnum,
      myordata:[]
    });
    this.datatransfer();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoadfun: function () {
    console.log(111111,app.signindata.isBlindBoxDefaultAddress)
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      avatarUrl: app.signindata.avatarUrl,
      blackCity: app.signindata.blackCity,
      spreadEntry: app.signindata.spreadEntry,
      windowHeight: app.signindata.windowHeight || 600,
      isProduce: app.signindata.isProduce,
      isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress
    });
    // 调取数据
    this.datatransfer(); 
    // 调取收货地址
    // _this.nextpagediao();
    setTimeout(function () { _this.otherdata(); app.indexShareBanner()},1000)
 
    if (app.signindata.isAwardOrder) {
      _this.setData({ isAwardOrder: app.signindata.isAwardOrder, awardOrder: app.signindata.awardOrder || false });
      app.winningtheprizetime(_this);
    };
    // 统计推送进入
    if (_this.data.pushWay > 0) {
      app.pushfun(_this);
    };


    // 生成图片商品数据
    if (app.signindata.activityblindbox) {
      _this.data.activityblindbox = app.signindata.activityblindbox;
    } else {
      app.activityblindboxfun(_this);
    };


  },  

  jumporder: function () {
    var _this = this;
    app.jumporder(_this);
  },
  
  otherdata:function(){
    var _this = this;
    // 购物车数量
    Dec.shopnum(_this,app.signindata.comurl);
    // 调取晒单数量
    Dec.dryingSum(_this, app.signindata.clwcomurl);
    var qqq = Dec.Aese('operation=info&mod=info');
    // 获取默认信息
    wx.request({
      url: app.signindata.comurl + 'general.php' + qqq,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            defaultinformation: res.data.Info,
            wxnum: res.data.Info.cs.wxid || 'meichai666666',
          })
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
      }
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
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          var rdl = res.data.List;
          var tptipadi = '';
          var tptipadd = '';
          var tipnamephone = '';
          if (rdl.length != 0) {
            for (var i = 0; i < rdl.length; i++) {
              if (rdl[i].isdefault == 1) {
                rdl[i].checked = true;
                tptipadi = rdl[i].aid;
                tptipadd = rdl[i].address;
                tipnamephone = rdl[i].consignee + " " + rdl[i].phone;
              } else {
                rdl[i].checked = false;
              }
            };
            _this.data.tipaid=tptipadi;
            _this.setData({
              addressdata: rdl,
              tipnamephone: tipnamephone,
              tipaddress: tptipadd
            })
          } else {
            _this.setData({
              addressdata: [],
            })
          };
        };
        if (res.data.ReturnCode == 900) {
          app.showToastC('登陆状态有误');
        };
      }
    });
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
  // 跳转增加新地址
  jumpaddress: function () {
    wx.navigateTo({
      url: "/pages/newreceivingaddress/newreceivingaddress?iftrid=1"
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
  // 收货地址弹框
  seladdressfun: function () {
    this.setData({
      receivingaddress: true,
    });
  },
  // 隐藏收货地址弹框
  receivingaddressfun: function () {
    this.setData({
      receivingaddress: false,
    })
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
            header: { 'Accept': 'application/json' },
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
            }
          })

        }
      }
    })
  },
 
  //  调取数据
  datatransfer:function(){
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    var _this = this;
    var arrlist = '';
    _this.setData({ headhidden:false})
    wx.showLoading({ title: '加载中...', })
    var q = Dec.Aese('mod=getinfo&operation=orderlist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=' + _this.data.myorhtabtr + '&blackCity=' + _this.data.blackCity);
    console.log(app.signindata.comurl + 'order.php?mod=getinfo&operation=orderlist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=' + _this.data.myorhtabtr + '&blackCity=' + _this.data.blackCity)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('列表=====',res)
        _this.setData({ headhidden: true});
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
            var arrlist = res.data.List||[];
            var infoshow = res.data.Info;
            if (infoshow){
              if (infoshow.showOrderDesc){
                var share_desc1 = infoshow.showOrderDesc.replace(/\\n/g, '\n') || '';
                _this.setData({ share_descWinningtheprize: share_desc1 });
              };
            };
            if (infoshow) {
              if (infoshow.share_desc){
                var share_desc = infoshow.share_desc.replace(/\\n/g, '\n') || '';
                _this.setData({ share_desc: share_desc });
              };
            };
            if (arrlist.length!=0){
            for (var i = 0; i < arrlist.length; i++) {
              if (!reg.test(arrlist[i].gcover)) {
                arrlist[i].gcover = _this.data.zdyurl + arrlist[i].gcover;
              };
              arrlist[i].gift_time = _this.toDate(arrlist[i].gift_time, 1);
              arrlist[i].ordertime = _this.toDate(arrlist[i].ordertime);
              if (Date.parse(new Date()) > arrlist[i].overtime * 1000 && arrlist[i].status==0){
                arrlist[i].status = 8
              };
            }
            if (arrlist.length!=0){
              var gar = parseFloat(arrlist[0].goods_amount) / parseFloat(arrlist[0].gnumber);
              var title = '￥' + gar.toFixed(2) + "  " + arrlist[0].pre_name + "  " + arrlist[0].ds+ "  " + arrlist[0].gname
                _this.setData({
                  gid:arrlist[0].gid,
                  title: title
                })
              _this.data.shareimg=arrlist[0].gcover;
            }else{
              _this.setData({
                gid:'',
                title:''
              });
              _this.data.shareimg = '';             
            };

            var arrchil = _this.dataprocessing(arrlist);

            _this.setData({
              myordata: arrchil,
              subscribedata: infoshow.subscribe||''
            },function(){
              console.log(_this.data.myordata)
            });
          }else{
              _this.setData({
                myordata: []
              });            
          }  
        };
        //  else if (res.data.ReturnCode == 500){
        //   _this.datatransfer();
        // };
        _this.setData({ ifnodata: true})
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
      }
    });
  },
  // 数据处理
  dataprocessing: function (arrlist){
    var _this = this;
    var arrlist = arrlist || [];
    var qarr = [];
    for (var i = 0; i < arrlist.length; i++) {
      if(arrlist[i].order_type==21 && arrlist[i].status==7){
        arrlist.splice(i, 1); 
      }
    };

    for (var q = 0; q < arrlist.length; q++) {
      var warr = [];
      for (var w = 0; w < arrlist.length; w++) {
        if (arrlist[q].cart_id == arrlist[w].cart_id && arrlist[q].status == arrlist[w].status) {
          warr.push(arrlist[w]);
        };
      };
      qarr.push({ list: warr, cart_id: arrlist[q].cart_id||'', status: arrlist[q].status||''})
    };
    // 去重
    var charr = this.distinct(qarr);
    var arrcharr = []
    for (var c = 0; c < charr.length; c++) {
      arrcharr.push(charr[c].list);
    };
    var arr = arrcharr;
    var arrchil = [];
    // 判断是否是能分享商品
    var notAllowShareGoodsId = app.signindata.notAllowShareGoodsId || [];

    for (var j = 0; j < arr.length; j++) {
      // 商品总价
      var goods_amount = 0;
      // 抽盒抵扣金
      var deductAmount = 0;
      // 加购减
      var cartDiscount = 0;
      // 代金券
      var bonus = 0;
      // 税
      var tax = 0;
      // 运费
      var carriage = 0;
      // 合计
      var amount = 0;
      // 订单编号
      var cart_id = arr[j][0].cart_id;
      // 时间
      var ordertime = arr[j][0].ordertime;
      for (var f = 0; f < arr[j].length; f++) {
        cartDiscount += parseFloat(arr[j][f].cartDiscount);
        deductAmount += parseFloat(arr[j][f].deductAmount);
        goods_amount += parseFloat(arr[j][f].goods_amount);
        bonus += parseFloat(arr[j][f].bonus);
        tax += parseFloat(arr[j][f].tax||0);
        carriage += parseFloat(arr[j][f].carriage);
        amount += parseFloat(arr[j][f].amount);
      }
      arrchil.push({
        deductAmount: deductAmount.toFixed(2),
        goods_amount: goods_amount.toFixed(2),
        cartDiscount: cartDiscount.toFixed(2),
        bonus: bonus.toFixed(2),
        tax: tax.toFixed(2),
        carriage: carriage.toFixed(2),
        amount: amount.toFixed(2),
        // 判断是否是多件装
        pre_name: arr[j][0].pre_name||'',
        ds: arr[j][0].ds||'',
        // 判断是否是活动
        order_type:arr[j][0].order_type,
        gcover: arr[j][0].gcover,
        goods_price: parseFloat(arr[j][0].goods_amount)/parseFloat(arr[j][0].gnumber),
        gname: arr[j][0].gname||'',
        // 快递单号
        // express_no: arr[j][0].express_no,
        cart_id: arr[j][0].cart_id,
        ordertime: arr[j][0].ordertime,
        gid: arr[j][0].gid,
        oid: arr[j][0].oid,
        // 订单状态编号
        status: arr[j][0].status,
        stockup: arr[j][0].stockup,
        list: arr[j],
        store_id: arr[j][0].store_id,
        // 是否显示跳转邀请页面
        is_invite: arr[j][0].is_invite||0,
        // 额外奖励
        is_receive: arr[j][0].is_receive||0,
        // 倒计时
        receive_time: _this.toDate(arr[j][0].receive_time||0,1),
        // 官方回复
        auditPic: arr[j][0].auditPic||0,
        isAuditPic: arr[j][0].isAuditPic||0,
        award_info: arr[j][0].award_info || '',
        cover: arr[j][0].cover || '',
        award_info: arr[j][0].award_info || '',
        qrcode: arr[j][0].qrcode || '',
        isShowOrder: arr[j][0].isShowOrder||0,
        showOrder: arr[j][arr[j].length-1].showOrder,
        gift_time: arr[j][0].gift_time||'',
        purchase_price: arr[j][0].purchase_price||'',
        gifts_order: arr[j][0].gifts_order||'',
        share_url: arr[j][0].share_url||'',
        surtime: _this.toDate(arr[j][0].overtime,2),
        isGoods: arr[j][0].isGoods || false,
        prizeCover: arr[j][0].prizeCover||[],
        isToyCabinet: arr[j][0].isToyCabinet || '',
        couponvalue: arr[j][0].couponValue||'',
        auditPicTime: arr[j][0].auditPicTime || 0,
        isBalances: arr[j][0].isBalances || 0,
        dateTitle: arr[j][0].dateTitle || '',
        depositOrderPayPrice: arr[j][0].depositOrderPayPrice || '',
        isShareGood : notAllowShareGoodsId.length!=0&&notAllowShareGoodsId.indexOf(arr[j][0].gid) > -1 ? false : true,
        toyshowTips:arr[j][0].toyshowTips || ''
      })
    };   
    if (arrchil && arrchil.length != 0){
      _this.data.urcShareImg = arrchil[0].gcover || '';
      _this.data.urcTitle = arrchil[0].gname || '';
      _this.data.urcOrderType = arrchil[0].order_type || '';
      _this.data.urcId = arrchil[0].gid || '';
      _this.data.couponvalue = arrchil[0].couponvalue || '';
    };
    return arrchil;
  },
  //  数组去重
  distinct:function(arr){
    var arr = arr,i,j,len = arr.length;
    for(i = 0; i < len; i++){
        for(j = i + 1; j < len; j++){
          if (arr[i].cart_id == arr[j].cart_id && arr[i].status == arr[j].status){
              arr.splice(j,1);
              len--;
              j--;
          }
        }
    }
    return arr;
  },

  onLoad: function (options) {   
    var _this = this;
    this.setData({
      myorhtabtr: options.tabnum||0,
      myordata: [],
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      avatarUrl: app.signindata.avatarUrl,
      blackCity: app.signindata.blackCity,      
      spreadEntry: app.signindata.spreadEntry,
      windowHeight: app.signindata.windowHeight || 600,
    });
    _this.data.pushWay = options.pushWay || 0;
    // 调取数据
    // this.datatransfer();
    
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
      return false;
    };
    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // '已经授权'
          _this.setData({
            loginid: app.signindata.loginid,
            uid: app.signindata.uid,
            openid: app.signindata.openid,
            store_id: app.signindata.store_id || 0,
            blackCity: app.signindata.blackCity,
            spreadEntry: app.signindata.spreadEntry,
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this)
          }
        } else {
          wx.getUserInfo({
            success: res => {
              // 判断是否登录
              if (_this.data.loginid != '' && _this.data.uid != '') {
                _this.onLoadfun();
              } else {
                app.signin(_this);
              }
            },
            fail: res => {
              // '没有授权'
              _this.setData({
                tgabox: true
              });
            }
          });
        }
      }
    });    
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
    this.setData({
      headhidden: false,
      page:0,
      myordata:[]
    }); 
    wx.showLoading({ title: '加载中...', })
    // 调取数据
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    var _this = this;
    var arrlist = '';
    var q = Dec.Aese('mod=getinfo&operation=orderlist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=' + _this.data.myorhtabtr + '&blackCity=' + _this.data.blackCity)
    wx.request({
      url: app.signindata.comurl + 'order.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        _this.setData({headhidden: true,});   
        wx.hideLoading()    
        if (res.data.ReturnCode == 200) {
          var arrlist = res.data.List;
          if (arrlist.length!=0){
              for (var i = 0; i < arrlist.length; i++) {
                if (!reg.test(arrlist[i].gcover)) {
                  arrlist[i].gcover = _this.data.zdyurl + arrlist[i].gcover;
                };
                arrlist[i].ordertime = _this.toDate(arrlist[i].ordertime);
                arrlist[i].gift_time = _this.toDate(arrlist[i].gift_time, 1);
                if (Date.parse(new Date()) > arrlist[i].overtime * 1000 && arrlist[i].status == 0) {
                  arrlist[i].status = 8
                };                
              };
              if (arrlist.length != 0) {
                var gar = parseFloat(arrlist[0].goods_amount) / parseFloat(arrlist[0].gnumber);
                var title = '￥' + gar.toFixed(2) + "   " + arrlist[0].pre_name + "  " + arrlist[0].ds + "  " +  arrlist[0].gname
                _this.setData({
                  gid: arrlist[0].gid,
                  title: title
                })
                _this.data.shareimg = arrlist[0].gcover;
              } else {
                _this.setData({
                  gid: '',
                  title: ''
                });
                _this.data.shareimg = '';
              };  
              // 数据处理
              var arrchil = _this.dataprocessing(arrlist);
              _this.setData({
                myordata: arrchil,
                headhidden: true,
              });
            wx.hideLoading()
          }
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app); 

      }
    })          
  },
  //时间戳转换时间  
  toDate: function (number,num) {
    var num = num || 0;
    var date = new Date(number * 1000);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    if (num==1){
      return Y + '-' + M + '-' + D + ' ' + h + ':' + m;
    } else if (num == 2) {
      return M + '-' + D + ' ' + h + ':' + m;
    }else{
      return Y + '-' + M + '-' + D;
    };
     
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      bothidden: false,
    });
    wx.showLoading({ title: '加载中...', })
    // 调取数据
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
    var _this = this;
    var arrlist = '';
    var page = ++_this.data.page;
    _this.setData({
      page: page
    });
    var q = Dec.Aese('mod=getinfo&operation=orderlist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=' + _this.data.myorhtabtr + '&page=' + page + '&blackCity=' + _this.data.blackCity)
    wx.request({
      url: app.signindata.comurl + 'order.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        _this.setData({bothidden: true});
        wx.hideLoading()       
        if (res.data.ReturnCode == 200) {
          var arrlist = res.data.List;
          if (arrlist.length != 0) {
            for (var i = 0; i < arrlist.length; i++) {
              if (!reg.test(arrlist[i].gcover)) {
                arrlist[i].gcover = _this.data.zdyurl + arrlist[i].gcover;
              };
              arrlist[i].ordertime = _this.toDate(arrlist[i].ordertime);
              arrlist[i].gift_time = _this.toDate(arrlist[i].gift_time, 1);
              if (Date.parse(new Date()) > arrlist[i].overtime * 1000 && arrlist[i].status == 0) {
                arrlist[i].status = 8
              };              
            };
            // 数据处理
            var arrchil = _this.dataprocessing(arrlist);
            var comdataarr = _this.data.myordata.concat(arrchil);
            _this.setData({
              myordata: comdataarr,
              bothidden: true,
            });
            wx.hideLoading()
          }else{
            app.showToastC('没有更多数据了'); 
          };
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);                 
      }
    })
  },
  /** 
   * 用户点击右上角分享
   */
  // 分享数据
  onShareAppMessage: function (options) {
    var _this = this;
　　if (options.from == 'button') {
      if (false){
        _this.paymentcompletionwimg();
        var reshare = {
          // title: _this.data.title,  // 转发标题（默认：当前小程序名称）
          title: '我刚买了这个商品，一起下单各领立减金',
          path: '/pages/detailspage/detailspage?gid=' + _this.data.gid + '&store_id=0',
          imageUrl: _this.data.shareimg,
          success: function (res) {
          },
        };
        var q = Dec.Aese('mod=share&operation=order&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + _this.data.comdata.cart_id)
        wx.request({
          url: app.signindata.comurl + 'user.php' + q,
          method: 'GET',
          header: { 'Accept': 'application/json' },
          success: function (res) {
            if (res.data.ReturnCode == 200) {
              app.showToastC(res.data.Info.notify);
              _this.setData({
                payiftr: false
              });
            };
            if (res.data.ReturnCode == 900) {
              app.showToastC('登陆状态有误');
            };
            if (res.data.ReturnCode == 800) {
              app.showToastC('非该用户订单');
            };
            if (res.data.ReturnCode == 701) {
              app.showToastC('订单状态有误(不是“已完成”状态)');
            };
          },
        })        
      }else{
         var gid = options.target.dataset.gid;
         var gcover = options.target.dataset.gcover;
         var goods_price = options.target.dataset.goods_price;
         var gname = options.target.dataset.gname;
         var order_type = options.target.dataset.order_type;
         var pre_name = options.target.dataset.pre_name;
         var ds = options.target.dataset.ds; 
         var couponvalue = options.target.couponvalue||'';
         if (order_type==2){
            var reshare = { 
              title: '免费送你' +  gname,  // 转发标题（默认：当前小程序名称）
              path: "/pages/activitydetailspage/activitydetailspage?id=" + gid +'&cs=1',
              imageUrl: gcover,
              success: function (res) {
              },
            };
           var q = Dec.Aese('mod=share&operation=goods&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&gid=' + gid)
           wx.request({
             url: app.signindata.comurl + 'user.php' + q,
             method: 'GET',
             header: { 'Accept': 'application/json' },
             success: function (res) {
               _this.onLoadfun();
             },
           })            
         } else if (order_type==3){
           var reshare = {
             title: '我用拆币兑换了' + " " + pre_name + "  " + ds + gname+ '，一起分享赢拆币！',
             path: '/page/component/pages/imdetailspage/imdetailspage?goods_id=' + gid,
             imageUrl: gcover,
             success: function (res) { },
           };
         } else if (order_type==21){
          var reshare = {
            title: gname+ ' 来看我一发入魂',
            path: "/page/secondpackge/pages/aRewardDetails/aRewardDetails?id=" + gid,
            imageUrl: gcover,
            success: function (res) { },
          };
         }else{
            var reshare = {
              title: couponvalue ? '我刚买了这个商品，一起下单各领￥' + couponvalue + '立减金' : '￥' + goods_price + "  " + pre_name + "  " + ds + "  " + gname,
              path: '/pages/detailspage/detailspage?gid=' + gid + '&store_id=0',
              imageUrl: gcover,
              success: function (res) {},
            };
           var q = Dec.Aese('mod=share&operation=goods&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&gid=' + gid)
           wx.request({
             url: app.signindata.comurl + 'user.php' + q,
             method: 'GET',
             header: { 'Accept': 'application/json' },
             success: function (res) {
               _this.onLoadfun();
             },
           })            
         }
      }
　　}else{
      var reshare = Dec.sharemc()
      // var shareimg = _this.data.paycheadwsongimg || _this.data.paycheadwsongimgling;
      // var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;
      // if (!reg.test(shareimg)) {
      //   shareimg = _this.data.zdyurl + shareimg;
      // };
      // _this.setData({
      //   paymentcompletionwiftr: false,
      //   tipback: false
      // });
      // // _this.data.payiftr
      // if (false) {
      //   _this.paymentcompletionwimg();
      //   if (_this.data.title){
      //     var titlea = _this.data.title;
      //     var patha = '/pages/detailspage/detailspage?gid=' + _this.data.gid + '&store_id=0'
      //   }else{
      //     var titlea = '美拆';
      //     var patha = '/pages/index/index'
      //   }
      //   var reshare = {
      //     // title: titlea ,  // 转发标题（默认：当前小程序名称）
      //     title: '我刚买了这个商品，一起下单各领立减金',
      //     path: patha,
      //     imageUrl: _this.data.shareimg,
      //     success: function (res) {
      //       var q = Dec.Aese('mod=share&operation=order&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + _this.data.comdata.cart_id)
      //       wx.request({
      //         url: app.signindata.comurl + 'user.php' + q,
      //         method: 'GET',
      //         header: { 'Accept': 'application/json' },
      //         success: function (res) {
      //           if (res.data.ReturnCode == 200) {
      //             app.showToastC(res.data.Info.notify);
      //             _this.onLoadfun();
      //             _this.setData({
      //               payiftr:false
      //             });
      //           };
      //           if (res.data.ReturnCode == 900) {
      //             app.showToastC('登陆状态有误');
      //           };
      //           if (res.data.ReturnCode == 800) {
      //             app.showToastC('非该用户订单');
      //           };
      //           if (res.data.ReturnCode == 701) {
      //             app.showToastC('订单状态有误(不是“已完成”状态)');
      //           };
      //         },
      //       })
      //     },
      //   }
      // } else {
      //   if (_this.data.urcShareImg == '' && _this.data.urcTitle == '' && _this.data.urcId == '' && _this.data.urcOrderType){
          
      //   }else{
      //     if (_this.data.urcOrderType==1){
      //       var reshare = {
      //         title: _this.data.couponvalue ? '我刚买了这个商品，一起下单各领￥' + _this.data.couponvalue + '立减金' : _this.data.urcTitle,
      //         path: '/pages/detailspage/detailspage?gid=' + _this.data.urcId + '&store_id=0',
      //         imageUrl: _this.data.urcShareImg,
      //         success: function (res) { },
      //       }
      //     } else if (_this.data.urcOrderType == 2){
      //       var reshare = { 
      //         title: '我刚买了这个商品，一起下单各领立减金',
      //         path: "/pages/activitydetailspage/activitydetailspage?id=" + _this.data.urcId + '&cs=1',
      //         imageUrl: _this.data.urcShareImg,
      //         success: function (res) {
      //         },
      //       };
      //     } else if (_this.data.urcOrderType == 3){
      //       var reshare = {
      //         title: '我用拆币兑换了' + _this.data.zunmdata.goods_name + '，一起分享赢拆币！',
      //         path: '/page/component/pages/imdetailspage/imdetailspage?goods_id=' + _this.data.urcId,
      //         imageUrl: _this.data.urcShareImg,
      //         success: function (res) { },
      //       };
      //     }else{
      //       var reshare = Dec.sharemc()
      //     }

      //   } 
      // }
    }      
    return reshare     
  },
  // 取消订单
  cancellationoforder: function (w) {
    var oid = w.currentTarget.dataset.oid || w.target.dataset.oid;
    var _this = this;
    var q = Dec.Aese('mod=operate&operation=cancel&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + oid)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          app.showToastC('操作成功');
          _this.datatransfer();
        };
        if (res.data.ReturnCode == 800) {
          app.showToastC('非该用户订单');
        };
        if (res.data.ReturnCode == 810) {
          app.showToastC('仅可以取消未付款订单');
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);  

      }
    })
  },  
  // 付款
  payment: function (event) {
    var oid = event.currentTarget.dataset.oid || event.target.dataset.oid;
    var amount = event.currentTarget.dataset.amount || event.target.dataset.amount;
    var cart_id = event.currentTarget.dataset.cart_id || event.target.dataset.cart_id;
    var gcover = event.currentTarget.dataset.gcover || event.target.dataset.gcover;

    var gid = event.currentTarget.dataset.gid || event.target.dataset.gid;
    var goods_price = event.currentTarget.dataset.goods_price || event.target.dataset.goods_price;    

    var gname = event.currentTarget.dataset.gname || event.target.dataset.gname; 
    var pre_name = event.currentTarget.dataset.pre_name || event.target.dataset.pre_name;
    var ds = event.currentTarget.dataset.ds || event.target.dataset.ds;
    var order_type = event.currentTarget.dataset.order_type || event.target.dataset.order_type;
    if (order_type==2){
      var title ='免费送你 ' + " " + pre_name + "  " + ds + gname; 
    }else{
      var title = '￥' + goods_price + "  " + pre_name + "  " + ds + "  " + gname;
    };
    this.setData({
       oid: oid,
       gid: gid,
       title: title,
       amount: amount,
       cart_id:cart_id,
       paycheadwsongimgling: gcover,
       suboformola: true
     })
    this.data.shareimg = gcover;
    // 直接支付
    this.paymentmony();   
  },
  // 微信支付
  paymentmony: function () {
    var _this = this;
    var q = Dec.Aese('mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1' + '&oid=' + _this.data.cart_id + '&xcx=1' + '&openid=' + _this.data.openid)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          // 支付完成弹框显示数据
          var shareinfo = res.data.Shareinfo;
          var payinfo = res.data.Info;
          if (shareinfo) {
            for (var f = 0; f < shareinfo.length; f++) {
              if (!app.signindata.reg.test(shareinfo[f].img)) {
                shareinfo[f].img = _this.data.zdyurl + shareinfo[f].img;
              };
              shareinfo[f].name = shareinfo[f].name.replace(/\\n/g, '\n');
            };
            _this.setData({ shareinfo: shareinfo });
          };         
          _this.data.subscribedata = res.data.Info.subscribe || ''  // 订阅信息  
          wx.requestPayment({
            'timeStamp': res.data.Info.timeStamp.toString(),
            'nonceStr': res.data.Info.nonceStr,
            'package': res.data.Info.package,
            'signType': 'MD5',
            'paySign': res.data.Info.paySign,
            'success': function (res) {
              _this.setData({
                tipback: false,
                paymentiftr: false,
                paymentcompletionwiftr: true,
                payiftr: true,
                suboformola: false
              });
              // 跳转红包页面
              // wx.navigateTo({
              //   url: "/pages/redenvelopes/redenvelopes?cart_id=" + _this.data.cart_id
              // }); 
              //跳转0元购
              if (payinfo.isFreeBuyOrder) {
                wx.navigateTo({
                  url: "/page/component/pages/hidefun/hidefun?type=1&cart_id=" + _this.data.cart_id
                });
              }
              // 调取数据
              _this.datatransfer(); 
              // 订阅授权
              app.comsubscribe(_this);
            },
            'fail': function (res) {
              _this.setData({
                tipback: false,
                paymentiftr: false,
                paymentcompletionwiftr: false,
                payiftr: false,
                suboformola: false
              });              
            },
            'complete': function (res) {}
          })
        }else{
          _this.setData({
             suboformola: false
          })
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
  // 支付完成弹框隐藏弹框
  paymentcompletionwimg: function () {
    this.setData({
      paymentcompletionwiftr: false,
      tipback: false,
      payiftr: false,
      payiftr:false
    });
  },
  // 查看订单
  viewtheorder: function () {
    var _this = this;
    wx.navigateTo({    
      url: "/page/component/pages/orderdetails/orderdetails?oid=" + _this.data.oid
    })
    this.paymentcompletionwimg();
  },
  // 返回首页
  returntothehomepage: function () {
    wx.reLaunch({    
      url: "/pages/index/index"
    });
    this.paymentcompletionwimg();
  },
  // 确认收货
  confirmationofreceipt:function(w){
    var oid = w.currentTarget.dataset.oid || w.target.dataset.oid;
    var _this = this;
    var q = Dec.Aese('mod=operation&operation=arrival&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + oid)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          app.showToastC('操作成功');
          _this.datatransfer();
        };
        if (res.data.ReturnCode == 800) {
          app.showToastC('非该用户订单');
        };
        if (res.data.ReturnCode == 824) {
          app.showToastC('订单状态有误');
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);          
      }
       
    });
   
  },
  // 删除订单
  delwholeheadrimg:function(w){
    var oid = w.currentTarget.dataset.oid || w.target.dataset.oid;
    var _this = this;
    var q = Dec.Aese('mod=operate&operation=delete&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + oid)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          app.showToastC('操作成功');
          _this.datatransfer();
        }else if (res.data.ReturnCode == 800) {
          app.showToastC('非该用户订单');
        }else if (res.data.ReturnCode == 824) {
          app.showToastC('订单状态有误');
        }else{
          app.showToastC(res.data.Msg);         
        };      
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);        
      }

    });    
  },

  //  支付成功跳转
  comindellistjump: function (w) {
    var whref = w.currentTarget.dataset.href || w.target.dataset.href;
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type || 0;
    var wname = w.currentTarget.dataset.name || w.target.dataset.name || '美拆';
    // 公共跳转
    this.comjumpwxnav(item_type, whref, wname);
  },
  // 公共跳转
  comjumpwxnav: function (item_type, whref, wname) {
    if (item_type == 0) {
      var url = encodeURIComponent(whref)
      wx.navigateTo({    // 外部链接
        url: "/page/component/pages/webview/webview?webview=" + url
      });
    } else if (item_type == 1) {
      wx.navigateTo({    // 商品详情页
        url: "/pages/detailspage/detailspage?gid=" + whref
      });
    } else if (item_type == 2 || item_type == 3) {
      wx.navigateTo({    // 信息流
        url: "/pages/classificationpage/classificationpage?" + whref + '&wtype=' + item_type + '&wname=' + wname
      });
    } else if (item_type == 4 || item_type == 5) {

      wx.navigateTo({    // 瀑布流
        url: "/pages/classificationpage/classificationpage?" + whref + '&wtype=' + item_type + '&wname=' + wname
      });
    } else if (item_type == 6 || item_type == 7) {
      wx.navigateTo({    // 活动列表
        url: "/pages/activitysharinglist/activitysharinglist"
      });
    } else if (item_type == 8) {
      wx.navigateTo({    // 活动详情页
        url: "/pages/activitydetailspage/activitydetailspage?id=" + whref
      });
    } else if (item_type == 9) {
      wx.navigateTo({    //签到
        url: "/page/component/pages/newsignin/newsignin"
      });
    } else if (item_type==998){
      wx.reLaunch({    //签到
        url: "/pages/index/index?judgeprof=2"
      });
    } else if (item_type == 996) {
      this.setData({
        awatip: true,
        awardrresentiftr:false
      })
    };
  }, 

  // 额外奖励
  clicktocollect: function (w) {
    var _this = this;

    var showorder = w.currentTarget.dataset.sorder || w.target.dataset.sorder || 0;
    if(showorder ==1){
      app.showToastC('请等待审核');
      return ;
    }

    if (_this.data.preventmultiplesubmission){
      var order_type = w.currentTarget.dataset.order_type || w.target.dataset.order_type || 0;
      _this.setData({ preventmultiplesubmission: false });
        var cart_id = w.currentTarget.dataset.cart_id || w.target.dataset.cart_id || 0;
        _this.setData({
          cart_idcarry: cart_id
        });
        var qqq = Dec.Aese('mod=operate&operation=receiveaward&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + cart_id);
        wx.request({
          url: app.signindata.comurl + 'order.php' + qqq,
          method: 'GET',
          header: { 'Accept': 'application/json' },
          success: function (res) {
            _this.setData({ preventmultiplesubmission: true });
            if (res.data.ReturnCode == 200) {
              app.showToastC('领取成功');
              _this.onLoadfun(); 
            } else if (res.data.ReturnCode == 830) {
              var rpiinfo = res.data.Info.tip.replace(/\\n/g, '\n') || '';
              if (res.data.Info.Goods.item_type == 996) {
                if (order_type==2){
                  _this.awajump()
                }else{
                  _this.setData({ awatip: true });
                };
              } else {
                _this.setData({ awardrresentiftr: !_this.data.awardrresentiftr, })
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
              setTimeout(function () {
                _this.onLoadfun();
              }, 1500)
            };
          }
        });
    };

  },
  awardrresentiftr: function () {
    this.setData({
      awardrresentiftr: !this.data.awardrresentiftr,
      payfreightone: false
    })
  },
  // 跳转详情页 
  addressmanagement: function (event) {
    var gid = event.currentTarget.dataset.gid || event.target.dataset.gid;
    wx.navigateTo({  
      url: "/pages/detailspage/detailspage?gid=" + gid
    })
  },
  // 免单活动跳转
  actexempfun: function (event) {
    var gid = event.currentTarget.dataset.gid || event.target.dataset.gid;
    wx.redirectTo({
      url: "/pages/activitydetailspage/activitydetailspage?id=" + gid
    })
  },

  acetlistfun: function () {
    wx.redirectTo({
      url: "/pages/activitysharinglist/activitysharinglist"
    });
    this.setData({
      wsh: false,
      awardrresentiftr: false,
      payfreightone: false
    });
  },


  // 支付运费
  payfreight: function () {
    this.setData({
      payfreightone: true
    });
  },
  // 支付运费订单
  payfreighplaceorder: function () {
    var _this = this;
    var aid = _this.data.tipaid;
    var cart_idcarry = _this.data.cart_idcarry;
    // 提交订单蒙层
    _this.setData({
      suboformola: true
    });
    var abcd = Dec.Aese('mod=operate&operation=activitycarriage&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + cart_idcarry + '&aid=' + aid);
    wx.request({
      url: app.signindata.comurl + 'order.php' + abcd,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {

          var cart_id = res.data.Info.cart_id || '';
          var q = Dec.Aese('mod=operate&operation=prepay&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=1&oid=' + cart_id + '&xcx=1' + '&openid=' + _this.data.openid)
          wx.request({
            url: app.signindata.comurl + 'order.php' + q,
            method: 'GET',
            header: { 'Accept': 'application/json' },
            success: function (res) {
              // 提交订单蒙层
              _this.setData({
                suboformola: false
              });
              if (res.data.ReturnCode == 200) {
                wx.requestPayment({
                  'timeStamp': res.data.Info.timeStamp.toString(),
                  'nonceStr': res.data.Info.nonceStr,
                  'package': res.data.Info.package,
                  'signType': 'MD5',
                  'paySign': res.data.Info.paySign,
                  'success': function (res) {
                    _this.setData({
                      payfreightone: false,
                      awardrresentiftr: false
                    });

                  },
                  'fail': function (res) {
                    _this.setData({
                      payfreightone: false,
                      awardrresentiftr: false
                    })
                  },
                  'complete': function (res) {}
                })
              } else {
                if (res.data.ReturnCode == 900) {
                  app.showToastC('登陆状态有误');
                } else if (res.data.ReturnCode == 800) {
                  app.showToastC('非该用户订单');
                } else if (res.data.ReturnCode == 815) {
                  app.showToastC('订单状态错误');
                } else if (res.data.ReturnCode == 816) {
                  app.showToastC('不支持的支付类型');
                } else if (res.data.ReturnCode == 817) {
                  app.showToastC('付款明细已生成');
                } else if (res.data.ReturnCode == 201) {
                  app.showToastC('微信预支付失败');
                } else if (res.data.ReturnCode == 805) {
                  app.showToastC('剩余库存不足');
                } else {
                  app.showToastC(res.data.Msg);
                };
              };

            }
          })

        }else{
          // 提交订单蒙层
          _this.setData({
            suboformola: false
          });
          app.showToastC(res.data.msg);
        }
      },
      fail: function () { }
    });
  },
  // 上传图片
  upImgSer: function (w) {
    var _this = this;
    var anum = w.currentTarget.dataset.anum || w.target.dataset.anum||1;
    if (anum==1){
      var auditPicTime = parseInt(_this.data.auditpictime)||0;
      var timestamp = Date.parse(new Date());
      if (auditPicTime){
        if (auditPicTime > timestamp / 1000) {
          _this.setData({
            subscrproiftr: true,
            subscrpro: '未到提供截图时间,请先分享朋友圈一小时后上传。上传开启时间:'+ _this.toDate(auditPicTime, 1)
          });
          return false;
        };
      }
    }
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths[0];
        _this.uploadFile(_this, tempFilePaths, 'litpic',  anum);
      }
    })
  },
  //上传文件
  uploadFile: function (_this, filePath, name, anum) {

    var _this = _this;
    _this.setData({ headhidden: false });
    wx.showLoading({ title: '加载中...', })
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
        'type': anum
      }, 
      success: function (res) {
        _this.setData({ headhidden: true, upserimgbox: false, upserimgboxact: false, screenshottipsiftr:false });
        wx.hideLoading()
        wx.hideToast();
        if (res.data){
          if (res.data == 200) {
            _this.setData({ pictboxbox: true })
          } else {
            _this.setData({
              subscrpro: res.data,
              subscrproiftr: true
            });
          }
        };
        setTimeout(function(){
          _this.onLoadfun();
        },3000);
      },
      fail: function (res) {
        _this.setData({ headhidden: true, upserimgbox: false, upserimgboxact: false  });
        wx.hideLoading()
        wx.hideToast();
        app.showToastC('上传失败');
      }
    })
  },
  // 跳转首页
  frontpagebutton: function () {
    wx.reLaunch({
      url: "/pages/index/index?judgeprof=2"
    })
  },
  // 生成图片
  generatePictures: function (qrcode, awardinfo, cover, cart_idsave, order_type){
    var _this = this;
    _this.setData({ headhidden: false, actimgshare: ''});
    wx.showLoading({ title: '加载中...', })
    var ctxt = wx.createCanvasContext('myordercanimgser' + cart_idsave)
    var generatePicturesimg = _this.data.generatePicturesimg||{};
    if (generatePicturesimg['myordercanimgser' + cart_idsave]){
    }else{
    }
    if (generatePicturesimg['myordercanimgser' + cart_idsave]){
      _this.setData({
        actimgshare: generatePicturesimg['myordercanimgser' + cart_idsave],
        headhidden: true,
      });
      wx.hideLoading()
      return false;
    };
    if (order_type==10){
      _this.generatePicturesbs(cart_idsave);
      return false;
    };

    const path = wx.getStorageSync('image_cache')
    var uidimg = app.signindata.avatarUrl || 'https://static.51chaidan.com/images/headphoto/' + _this.data.uid + '.jpg';
    if (uidimg) {
      var tdavatar = uidimg;
    } else if (path != null) {
      if (path) { var tdavatar = path; } else { var tdavatar = _this.data.avatarUrl; };
    } else {
      var tdavatar = _this.data.avatarUrl;
    };
    var labelstyleImg = '';
    wx.getImageInfo({
      src: 'https://cdn.51chaidan.com/images/icon/newArrival.png', // 新上抽盒机角标图片
      success: function (res) {
        labelstyleImg = res.path;
      }
    })
    console.log(tdavatar)
    wx.getImageInfo({
      src: 'https://www.51chaidan.com/images/mc.jpg', // 美拆头像
      success: function (res) {
        ctxt.drawImage(res.path, 134, 54, 52, 52);
        ctxt.draw(true);
        wx.getImageInfo({
          src: tdavatar, // 用户头像  
          success: function (res) {
            ctxt.drawImage(res.path, 134, 54, 52, 52);
            // ctxt.draw(true);
            wx.getImageInfo({
              src: 'https://www.51chaidan.com/images/default/bg_winner.png', // 背景
              success: function (res) {
                ctxt.drawImage(res.path, 0, 0, 319, 414);
                ctxt.setFontSize(16)
                ctxt.setFillStyle('#000')
                ctxt.fillText('我在美拆抽中了', 100, 135);
                var str = awardinfo || '';
                ctxt.setFontSize(13);
                ctxt.setFillStyle('#000');
                ctxt.fillText(str, (319 - ctxt.measureText(str).width) / 2, 162);

                wx.getImageInfo({
                  src: qrcode, // 太阳码
                  success: function (res) {
                    ctxt.drawImage(res.path, 129.5, 340, 60, 60);
                    // ctxt.draw(true);
                    wx.getImageInfo({
                      src: cover, // banner 图片
                      success: function (res) {
                        ctxt.drawImage(res.path, 17, 180, 285, 151);


                        if(app.signindata.is_eveShareAdver && app.signindata.mergePicImg){


                            // 渲染广告图片
                            wx.getImageInfo({
                              src: app.signindata.mergePicImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
                              success: function (res) {
                                var ratio = res.width / res.height;   
                                var viewHeight = (319/ratio)<=175?(319/ratio):175;    
  
                                ctxt.drawImage(res.path, 0, 414, 319, viewHeight)
                                ctxt.draw(true);
                                ctxt.draw(true, setTimeout(function () {
                                  wx.canvasToTempFilePath({
                                    canvasId: 'myordercanimgser' + cart_idsave,
                                    x:0,
                                    y:0,
                                    width:319,
                                    height:414+viewHeight,
                                    destWidth:319*4,
                                    destHeight:(414+viewHeight)*4,
                                    success: function (res) {
                                      generatePicturesimg['myordercanimgser' + cart_idsave] = res.tempFilePath
                                      _this.setData({
                                        actimgshare: res.tempFilePath,
                                        headhidden: true,
                                        generatePicturesimg: generatePicturesimg
                                      });
                                      wx.hideLoading()
                                    },
                                    fail: function (res) {
                                      wx.hideLoading()
                                      app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:01}');
                                      _this.setData({ upserimgbox: false, headhidden: true });

                                    },
                                  });
                                }, 300));

                              },
                              fail: function () {},
                            });

                        }else{

                        // 第一步 底部背景颜色改变
                        // ctxt.fillStyle = '#b3b2b2';
                        ctxt.fillStyle = '#feffff';
                        ctxt.fillRect(0, 414, 319, 175);
                        ctxt.draw(true);
                        // 第二部 渲染标题
                        var strnew = '—— 在线抽盒机 ——';
                        ctxt.setFontSize(13);
                        ctxt.setFillStyle('#000');
                        ctxt.fillText(strnew, (319 - ctxt.measureText(strnew).width) / 2, 437);
                        ctxt.draw(true);
                        // 第三部 渲染左边图片
                        wx.getImageInfo({
                          src: _this.data.activityblindbox[0].cover,
                          success: function (res) {
                            // 渲染左边图片
                            ctxt.fillStyle = '#fff';
                            ctxt.fillRect(10, 449, 144, 130);
                            ctxt.draw(true);
                            ctxt.drawImage(res.path, 10, 449, 144, 77)
                            ctxt.draw(true);
                            if(_this.data.activityblindbox[0].isNewArrival){
                              ctxt.drawImage(labelstyleImg, 114, 449, 40, 40)
                              ctxt.draw(true);
                            }
                            ctxt.setFontSize(11);
                            ctxt.setFillStyle('#000');
                            ctxt.fillText(_this.data.activityblindbox[0].name, 13, 544);
                            ctxt.draw(true);
                            ctxt.setFontSize(11);
                            ctxt.setFillStyle('#ff2742');
                            ctxt.fillText('￥' + _this.data.activityblindbox[0].shop_price, 13, 566);
                            ctxt.draw(true);
                            if (_this.data.activityblindbox[0].tip){
                              ctxt.setFontSize(10);
                              ctxt.setFillStyle('#ff2742');
                              ctxt.fillText(_this.data.activityblindbox[0].tip, 83, 566);
                              ctxt.draw(true);
                              ctxt.strokeStyle = "#ff2742";
                              ctxt.lineWidth = 1;
                              ctxt.strokeRect(80, 554, ctxt.measureText(_this.data.activityblindbox[0].tip).width + 6, 16);
                              ctxt.draw(true);
                            }

                            // 第四部 渲染右边图片
                            wx.getImageInfo({
                              src: _this.data.activityblindbox[1].cover,
                              success: function (res) {
                                // 渲染右边图片
                                ctxt.fillStyle = '#fff';
                                ctxt.fillRect(164, 449, 144, 130);
                                ctxt.draw(true);
                                ctxt.drawImage(res.path, 164, 449, 144, 77)
                                ctxt.draw(true);
                                if(_this.data.activityblindbox[1].isNewArrival){
                                  ctxt.drawImage(labelstyleImg, 268, 449, 40, 40)
                                  ctxt.draw(true);
                                }
                                ctxt.setFontSize(11);
                                ctxt.setFillStyle('#000');
                                ctxt.fillText(_this.data.activityblindbox[1].name, 167, 544);
                                ctxt.draw(true);
                                ctxt.setFontSize(11);
                                ctxt.setFillStyle('#ff2742');
                                ctxt.fillText('￥' + _this.data.activityblindbox[1].shop_price, 167, 566);
                                ctxt.draw(true);
                                if (_this.data.activityblindbox[1].tip){
                                  ctxt.setFontSize(10);
                                  ctxt.setFillStyle('#ff2742');
                                  ctxt.fillText(_this.data.activityblindbox[1].tip, 237, 566);
                                  ctxt.draw(true);
                                  ctxt.strokeStyle = "#ff2742";
                                  ctxt.lineWidth = 1;
                                  ctxt.strokeRect(234, 554, ctxt.measureText(_this.data.activityblindbox[1].tip).width + 6, 16);
                                  ctxt.draw(true);
                                }


                                      ctxt.draw(true, setTimeout(function () {
                                        wx.canvasToTempFilePath({
                                          canvasId: 'myordercanimgser' + cart_idsave,
                                          success: function (res) {
                                            generatePicturesimg['myordercanimgser' + cart_idsave] = res.tempFilePath
                                            _this.setData({
                                              actimgshare: res.tempFilePath,
                                              headhidden: true,
                                              generatePicturesimg: generatePicturesimg
                                            });
                                            wx.hideLoading()
                                          },
                                          fail: function (res) {
                                            wx.hideLoading()
                                            app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:01}');
                                            _this.setData({ upserimgbox: false, headhidden: true });

                                          },
                                        });
                                      }, 300));

                              },
                              fail: function () {},
                            });
                          },
                          fail: function () {},
                        });     
                        }
                      },
                      fail: function (res) {
                        wx.hideLoading()
                        app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:02}');
                        _this.setData({ upserimgbox: false, headhidden: true });
                      }
                    });
                  },
                  fail: function (res) {
                    wx.hideLoading()
                    app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:03}');
                    _this.setData({ upserimgbox: false, headhidden: true });
                  }
                });
              },
              fail: function (res) {
                wx.hideLoading()
                app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:04}');
                _this.setData({ upserimgbox: false, headhidden: true });
              }
            })
          },
          fail: function (res) {
            wx.getImageInfo({
              src: 'https://www.51chaidan.com/images/default/bg_winner.png', // 背景
              success: function (res) {
                ctxt.drawImage(res.path, 0, 0, 319, 414);
                ctxt.setFontSize(16)
                ctxt.setFillStyle('#000')
                ctxt.fillText('我在美拆抽中了', 100, 135);
                var str = awardinfo || '';
                ctxt.setFontSize(13);
                ctxt.setFillStyle('#000');
                ctxt.fillText(str, (319 - ctxt.measureText(str).width) / 2, 162);

                wx.getImageInfo({
                  src: qrcode, // 太阳码
                  success: function (res) {
                    ctxt.drawImage(res.path, 129.5, 340, 60, 60);
                    // ctxt.draw(true);
                    wx.getImageInfo({
                      src: cover, // banner 图片
                      success: function (res) {
                        ctxt.drawImage(res.path, 17, 180, 285, 151);

                        if(app.signindata.is_eveShareAdver && app.signindata.mergePicImg){


                          // 渲染广告图片
                          wx.getImageInfo({
                            src: app.signindata.mergePicImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
                            success: function (res) {
                              var ratio = res.width / res.height;   
                              var viewHeight = (319/ratio)<=175?(319/ratio):175;    

                              ctxt.drawImage(res.path, 0, 414, 319, viewHeight)
                              ctxt.draw(true);
                              ctxt.draw(true, setTimeout(function () {
                                wx.canvasToTempFilePath({
                                  canvasId: 'myordercanimgser' + cart_idsave,
                                  x:0,
                                  y:0,
                                  width:319,
                                  height:414+viewHeight,
                                  destWidth:319*4,
                                  destHeight:(414+viewHeight)*4,
                                  success: function (res) {
                                    generatePicturesimg['myordercanimgser' + cart_idsave] = res.tempFilePath
                                    _this.setData({
                                      actimgshare: res.tempFilePath,
                                      headhidden: true,
                                      generatePicturesimg: generatePicturesimg
                                    });
                                    wx.hideLoading()
                                  },
                                  fail: function (res) {
                                    wx.hideLoading()
                                    app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:01}');
                                    _this.setData({ upserimgbox: false, headhidden: true });

                                  },
                                });
                              }, 300));

                            },
                            fail: function () {},
                          });

                      }else{

                        // 第一步 底部背景颜色改变
                        // ctxt.fillStyle = '#b3b2b2';
                        ctxt.fillStyle = '#feffff';
                        ctxt.fillRect(0, 414, 319, 175);
                        ctxt.draw(true);
                        // 第二部 渲染标题
                        var strnew = '—— 在线抽盒机 ——';
                        ctxt.setFontSize(13);
                        ctxt.setFillStyle('#000');
                        ctxt.fillText(strnew, (319 - ctxt.measureText(strnew).width) / 2, 437);
                        ctxt.draw(true);
                        // 第三部 渲染左边图片
                        wx.getImageInfo({
                          src: _this.data.activityblindbox[0].cover,
                          success: function (res) {
                            // 渲染左边图片
                            ctxt.fillStyle = '#fff';
                            ctxt.fillRect(10, 449, 144, 130);
                            ctxt.draw(true);
                            ctxt.drawImage(res.path, 10, 449, 144, 77)
                            ctxt.draw(true);
                            if(_this.data.activityblindbox[0].isNewArrival){
                              ctxt.drawImage(labelstyleImg, 114, 449, 40, 40)
                              ctxt.draw(true);
                            }
                            ctxt.setFontSize(11);
                            ctxt.setFillStyle('#000');
                            ctxt.fillText(_this.data.activityblindbox[0].name, 13, 544);
                            ctxt.draw(true);
                            ctxt.setFontSize(11);
                            ctxt.setFillStyle('#ff2742');
                            ctxt.fillText('￥' + _this.data.activityblindbox[0].shop_price, 13, 566);
                            ctxt.draw(true);
                            if (_this.data.activityblindbox[0].tip){
                              ctxt.setFontSize(10);
                              ctxt.setFillStyle('#ff2742');
                              ctxt.fillText(_this.data.activityblindbox[0].tip, 83, 566);
                              ctxt.draw(true);
                              ctxt.strokeStyle = "#ff2742";
                              ctxt.lineWidth = 1;
                              ctxt.strokeRect(80, 554, ctxt.measureText(_this.data.activityblindbox[0].tip).width + 6, 16);
                              ctxt.draw(true);
                            }

                            // 第四部 渲染右边图片
                            wx.getImageInfo({
                              src: _this.data.activityblindbox[1].cover,
                              success: function (res) {
                                // 渲染右边图片
                                ctxt.fillStyle = '#fff';
                                ctxt.fillRect(164, 449, 144, 130);
                                ctxt.draw(true);
                                ctxt.drawImage(res.path, 164, 449, 144, 77)
                                ctxt.draw(true);
                                if(_this.data.activityblindbox[1].isNewArrival){
                                  ctxt.drawImage(labelstyleImg, 268, 449, 40, 40)
                                  ctxt.draw(true);
                                }
                                ctxt.setFontSize(11);
                                ctxt.setFillStyle('#000');
                                ctxt.fillText(_this.data.activityblindbox[1].name, 167, 544);
                                ctxt.draw(true);
                                ctxt.setFontSize(11);
                                ctxt.setFillStyle('#ff2742');
                                ctxt.fillText('￥' + _this.data.activityblindbox[1].shop_price, 167, 566);
                                ctxt.draw(true);
                                if (_this.data.activityblindbox[1].tip){
                                  ctxt.setFontSize(10);
                                  ctxt.setFillStyle('#ff2742');
                                  ctxt.fillText(_this.data.activityblindbox[1].tip, 237, 566);
                                  ctxt.draw(true);
                                  ctxt.strokeStyle = "#ff2742";
                                  ctxt.lineWidth = 1;
                                  ctxt.strokeRect(234, 554, ctxt.measureText(_this.data.activityblindbox[1].tip).width + 6, 16);
                                  ctxt.draw(true);
                                }


                                      ctxt.draw(true, setTimeout(function () {
                                        wx.canvasToTempFilePath({
                                          canvasId: 'myordercanimgser' + cart_idsave,
                                          success: function (res) {
                                            generatePicturesimg['myordercanimgser' + cart_idsave] = res.tempFilePath
                                            _this.setData({
                                              actimgshare: res.tempFilePath,
                                              headhidden: true,
                                              generatePicturesimg: generatePicturesimg
                                            });
                                            wx.hideLoading()
                                          },
                                          fail: function (res) {
                                            wx.hideLoading()
                                            app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:01}');
                                            _this.setData({ upserimgbox: false, headhidden: true });

                                          },
                                        });
                                      }, 300));

                              },
                              fail: function () {},
                            });
                          },
                          fail: function () {},
                        });     
                      }
                      },
                      fail: function (res) {
                        wx.hideLoading()
                        app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:02}');
                        _this.setData({ upserimgbox: false, headhidden: true });

                      }
                    });
                  },
                  fail: function (res) {
                    wx.hideLoading()
                    app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:03}');
                    _this.setData({ upserimgbox: false, headhidden: true });

                  }
                });

              },
              fail: function (res) {
                wx.hideLoading()
                app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:04}');
                _this.setData({ upserimgbox: false, headhidden: true });

              }
            })

          }
        }) 

      },
      fail: function (res) {
        app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:16}');
        _this.setData({ upserimgboxWinningtheprize: false, headhidden: true });
      }
    });
   
  },

  generatePicturesbs: function (cart_idsave) {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    });
    var generatePicturesimg = _this.data.generatePicturesimg || {};
    var prize = _this.data.prizeCover || [];
    var prizenum = prize.length;
    if (prizenum == 1) {
      var goodspo = prize[0].gcover || '';
      if (goodspo.indexOf("https") < 0) {
        goodspo = goodspo.replace(/http/, 'https');
      }
    } else {
      var goodspo = prize[0].gcover || '';
      if (goodspo.indexOf("https") < 0) {
        goodspo = goodspo.replace(/http/, 'https');
      }
      var goodspt = prize[1].gcover || '';
      if (goodspt.indexOf("https") < 0) {
        goodspt = goodspt.replace(/http/, 'https');
      }
    };

    var ctxt = wx.createCanvasContext('myordercanimgser' + cart_idsave)
    wx.getImageInfo({
      src: goodspo,
      success: function (res) {
        if (prizenum == 1) {
          ctxt.drawImage(res.path, 130, 296, 114, 114);
          wx.getImageInfo({
            src: "https://www.51chaidan.com/images/cast/ca_1.png",
            success: function (res) {
              ctxt.drawImage(res.path, 0, 0, 375, 603);
              // 第一步 底部背景颜色改变
              ctxt.fillStyle = '#feffff';
              ctxt.fillRect(0, 603, 375, 185);
              ctxt.draw(true);
              // 第二部 渲染标题
              var strnew = '—— 在线抽盒机 ——';
              ctxt.setFontSize(13);
              ctxt.setFillStyle('#000');
              ctxt.fillText(strnew, (375 - ctxt.measureText(strnew).width) / 2, 628);
              ctxt.draw(true);
              // 第三部 渲染左边图片
              wx.getImageInfo({
                src: _this.data.activityblindbox[0].cover,
                success: function (res) {
                  // 渲染左边图片
                  ctxt.fillStyle = '#fff';
                  ctxt.fillRect(15, 645, 165, 130);
                  ctxt.draw(true);
                  ctxt.drawImage(res.path, 15, 645, 165, 80)
                  ctxt.draw(true);
                  ctxt.setFontSize(11);
                  ctxt.setFillStyle('#000');
                  ctxt.fillText(_this.data.activityblindbox[0].name, 18, 742);
                  ctxt.draw(true);
                  ctxt.setFontSize(11);
                  ctxt.setFillStyle('#ff2742');
                  ctxt.fillText('￥' + _this.data.activityblindbox[0].shop_price, 18, 762);
                  ctxt.draw(true);
                  if (_this.data.activityblindbox[0].tip){
                    ctxt.setFontSize(10);
                    ctxt.setFillStyle('#ff2742');
                    ctxt.fillText(_this.data.activityblindbox[0].tip, 108, 762);
                    ctxt.draw(true);
                    ctxt.strokeStyle = "#ff2742";
                    ctxt.lineWidth = 1;
                    ctxt.strokeRect(105, 750, ctxt.measureText(_this.data.activityblindbox[0].tip).width + 6, 16);
                    ctxt.draw(true);
                  }

                  // 第四部 渲染右边图片
                  wx.getImageInfo({
                    src: _this.data.activityblindbox[1].cover,
                    success: function (res) {
                      // 渲染右边图片
                      ctxt.fillStyle = '#fff';
                      ctxt.fillRect(195, 645, 165, 130);
                      ctxt.draw(true);
                      ctxt.drawImage(res.path, 195, 645, 165, 80)
                      ctxt.draw(true);
                      ctxt.setFontSize(11);
                      ctxt.setFillStyle('#000');
                      ctxt.fillText(_this.data.activityblindbox[1].name, 198, 742);
                      ctxt.draw(true);
                      ctxt.setFontSize(11);
                      ctxt.setFillStyle('#ff2742');
                      ctxt.fillText('￥' + _this.data.activityblindbox[1].shop_price, 198, 762);
                      ctxt.draw(true);
                      if (_this.data.activityblindbox[1].tip){
                        ctxt.setFontSize(10);
                        ctxt.setFillStyle('#ff2742');
                        ctxt.fillText(_this.data.activityblindbox[1].tip, 288, 762);
                        ctxt.draw(true);
                        ctxt.strokeStyle = "#ff2742";
                        ctxt.lineWidth = 1;
                        ctxt.strokeRect(285, 750, ctxt.measureText(_this.data.activityblindbox[1].tip).width + 6, 16);
                        ctxt.draw(true);
                      };
                      ctxt.draw(true, setTimeout(function () {
                        wx.canvasToTempFilePath({
                          canvasId: 'myordercanimgser' + cart_idsave,
                          success: function (res) {
                            generatePicturesimg['myordercanimgser' + cart_idsave] = res.tempFilePath
                            _this.setData({
                              actimgshare: res.tempFilePath,
                              headhidden: true,
                              generatePicturesimg: generatePicturesimg
                            });
                            wx.hideLoading()
                          },
                          fail: function (res) {
                            wx.hideLoading()
                            app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:01}');
                            _this.setData({
                              upserimgbox: false,
                            });
                            
                          },
                        });
                      }, 300));

                      },
                      fail: function () {},
                    });
                  },
                  fail: function () {},
                });
            },
            fail: function (res) {
              wx.hideLoading()
              app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:02}');
              _this.setData({
                upserimgbox: false,
              });
              
            }
          });
        } else {
          ctxt.drawImage(res.path, 66, 293, 114, 114);
          wx.getImageInfo({
            src: goodspt,
            success: function (res) {
              ctxt.drawImage(res.path, 195, 293, 114, 114);
              wx.getImageInfo({
                src: "https://www.51chaidan.com/images/cast/ca_2.png",
                success: function (res) {
                  ctxt.drawImage(res.path, 0, 0, 375, 603);

                  // 第一步 底部背景颜色改变
                  ctxt.fillStyle = '#feffff';
                  ctxt.fillRect(0, 603, 375, 185);
                  ctxt.draw(true);
                  // 第二部 渲染标题
                  var strnew = '—— 在线抽盒机 ——';
                  ctxt.setFontSize(13);
                  ctxt.setFillStyle('#000');
                  ctxt.fillText(strnew, (375 - ctxt.measureText(strnew).width) / 2, 628);
                  ctxt.draw(true);
                  // 第三部 渲染左边图片
                  wx.getImageInfo({
                    src: _this.data.activityblindbox[0].cover,
                    success: function (res) {
                      // 渲染左边图片
                      ctxt.fillStyle = '#fff';
                      ctxt.fillRect(15, 645, 165, 130);
                      ctxt.draw(true);
                      ctxt.drawImage(res.path, 15, 645, 165, 80)
                      ctxt.draw(true);
                      ctxt.setFontSize(11);
                      ctxt.setFillStyle('#000');
                      ctxt.fillText(_this.data.activityblindbox[0].name, 18, 742);
                      ctxt.draw(true);
                      ctxt.setFontSize(11);
                      ctxt.setFillStyle('#ff2742');
                      ctxt.fillText('￥' + _this.data.activityblindbox[0].shop_price, 18, 762);
                      ctxt.draw(true);
                      if (_this.data.activityblindbox[0].tip) {
                        ctxt.setFontSize(10);
                        ctxt.setFillStyle('#ff2742');
                        ctxt.fillText(_this.data.activityblindbox[0].tip, 108, 762);
                        ctxt.draw(true);
                        ctxt.strokeStyle = "#ff2742";
                        ctxt.lineWidth = 1;
                        ctxt.strokeRect(105, 750, ctxt.measureText(_this.data.activityblindbox[0].tip).width + 6, 16);
                        ctxt.draw(true);
                      }

                      // 第四部 渲染右边图片
                      wx.getImageInfo({
                        src: _this.data.activityblindbox[1].cover,
                        success: function (res) {
                          // 渲染右边图片
                          ctxt.fillStyle = '#fff';
                          ctxt.fillRect(195, 645, 165, 130);
                          ctxt.draw(true);
                          ctxt.drawImage(res.path, 195, 645, 165, 80)
                          ctxt.draw(true);
                          ctxt.setFontSize(11);
                          ctxt.setFillStyle('#000');
                          ctxt.fillText(_this.data.activityblindbox[1].name, 198, 742);
                          ctxt.draw(true);
                          ctxt.setFontSize(11);
                          ctxt.setFillStyle('#ff2742');
                          ctxt.fillText('￥' + _this.data.activityblindbox[1].shop_price, 198, 762);
                          ctxt.draw(true);
                          if (_this.data.activityblindbox[1].tip) {
                            ctxt.setFontSize(10);
                            ctxt.setFillStyle('#ff2742');
                            ctxt.fillText(_this.data.activityblindbox[1].tip, 288, 762);
                            ctxt.draw(true);
                            ctxt.strokeStyle = "#ff2742";
                            ctxt.lineWidth = 1;
                            ctxt.strokeRect(285, 750, ctxt.measureText(_this.data.activityblindbox[1].tip).width + 6, 16);
                            ctxt.draw(true);
                          };


                          ctxt.draw(true, setTimeout(function () {
                            wx.canvasToTempFilePath({
                              canvasId: 'myordercanimgser' + cart_idsave,
                              success: function (res) {
                                generatePicturesimg['myordercanimgser' + cart_idsave] = res.tempFilePath
                                _this.setData({
                                  actimgshare: res.tempFilePath,
                                  headhidden: true,
                                  generatePicturesimg: generatePicturesimg
                                });
                                wx.hideLoading()
                              },
                              fail: function (res) {
                                wx.hideLoading()
                                app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:03}');
                                _this.setData({
                                  upserimgbox: false,
                                });
                                
                              },
                            });
                          }, 300));
                        },
                        fail: function () {},
                      });
                    },
                    fail: function () {},
                  });
                },
                fail: function (res) {
                  wx.hideLoading()
                  app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:04}');
                  _this.setData({
                    upserimgbox: false,
                  });
                  
                }
              });
            },
            fail: function (res) {
              wx.hideLoading()
              app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:05}');
              _this.setData({
                upserimgbox: false,
              });
              
            }
          });
        }


      },
      fail: function (res) {
        wx.hideLoading()
        app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:06}');
        _this.setData({
          upserimgbox: false,
        });
        
      }
    });
  },

  // 保存图片
  sharesavethepicture: function (w) {
    var _this = this;
    var indnum = w.currentTarget.dataset.indnum || w.target.dataset.indnum || '';
    if (indnum==1){
      var imgSrc = _this.data.actimgshare || '';
    }else{
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
                  if (indnum == 1){
                    _this.saveimgfun();
                  };
                  _this.setData({ upserimgbox: false, upserimgboxact: false });
                },
                fail() {
                  app.showToastC('保存失败');
                  _this.setData({ upserimgbox: false, actimgshare: ''});
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

              if (indnum == 1){
                _this.saveimgfun();
              }
              _this.setData({ upserimgbox: false, upserimgboxact: false });
            },
            fail() {
              app.showToastC('保存失败');
              _this.setData({ upserimgbox: false, savepicturesiftr: true, actimgshare: '' });
            }
          })
        }
      }
    });



  },
  saveimgfun:function(){
    var _this = this;
    var qsign = Dec.Aese('mod=operate&operation=confirmSave&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&oid=' + _this.data.cart_idsave);
    wx.request({
      url: app.signindata.comurl + 'order.php' + qsign,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        app.showToastC('保存成功');
        _this.setData({ upserimgbox: false, actimgshare: '' });
        _this.onLoadfun();
      },
      fail: function () { }
    });
  },
  handleSetting: function (e) {
    let that = this;
    var _this = this;
    if (!e.detail.authSetting['scope.writePhotosAlbum']) {
      wx.showModal({
        title: '警告',
        content: '若不打开授权，则无法将图片保存在相册中！',
        showCancel: false
      });
      that.setData({
        picbox: false
      });
      _this.setData({ shareshopiftr: false, tgimgbox: false });
    } else {
      that.setData({
        picbox: false,
      });
      _this.setData({ shareshopiftr: false, tgimgbox: false });
    }
  },
  // 关闭保存图片上传图片
  closeupserimg: function () {
    this.setData({ upserimgbox: false, actimgshare: '' });
  },
  upserimgboxiftr: function (w) {
    var _this = this;
    var qrcode = w.currentTarget.dataset.qrcode || w.target.dataset.qrcode;  // 太阳码
    var awardinfo = w.currentTarget.dataset.awardinfo || w.target.dataset.awardinfo||'';  // 标题
    var cover = w.currentTarget.dataset.cover || w.target.dataset.cover;  // banner图片
    if (!app.signindata.reg.test(cover)) {
      cover = _this.data.zdyurl + cover;
    };
    var cart_idsave = w.currentTarget.dataset.cart_id || w.target.dataset.cart_id;
    var showOrder = w.currentTarget.dataset.showorder || w.target.dataset.showorder||0;
    if (showOrder!=0){
      var uploadscreenshots = true;
    }else{
      var uploadscreenshots = false;
    };
    var myordata = _this.data.myordata || [];
    var order_type = 1;
    var prizeCover = [];
    if (myordata && myordata.length != 0) {
      for (var p = 0; p < myordata.length; p++) {
        if (myordata[p].cart_id == cart_idsave) {
          order_type = myordata[p].order_type || 1;
          prizeCover = myordata[p].prizeCover || [];
          _this.setData({
            prizeCover: myordata[p].prizeCover || [],
            order_type_show: myordata[p].order_type || 1
          })
        };
      }
    };
    this.setData({ upserimgbox: true, cart_idsave: cart_idsave, uploadscreenshots: uploadscreenshots });
    this.generatePictures(qrcode, awardinfo, cover, cart_idsave, order_type);
  },
  gobargainDetail: function (w) {
    var ordersn = w.target.dataset.ordersn || w.currentTarget.dataset.ordersn;
    wx.navigateTo({
      url: '/page/component/pages/bargainDetail/bargainDetail?order_sn=' + ordersn,
    })
  },

  // 生成分享图片
  generatePicturesact: function (w) {
    var _this = this;
    var cart_id = w.currentTarget.dataset.cart_id || w.target.dataset.cart_id || '';
    var auditpictime = w.currentTarget.dataset.auditpictime || w.target.dataset.auditpictime || 0;
    if (cart_id) {
      _this.setData({
        cart_idsave: cart_id,
        auditpictime: auditpictime
      });
    };
    var qrcode = w.currentTarget.dataset.qrcode || w.target.dataset.qrcode || '';
    var share_url = w.currentTarget.dataset.share_url || w.target.dataset.share_url || '';
    const ctx = wx.createCanvasContext('canimgser' + cart_id);
    ctx.clearRect(0, 0, 360, 384);
    ctx.setFillStyle('#fff')
    _this.setData({ upserimgboxact: true, actimgshareact:''});
   
    var canvasupimg = _this.data.canvasupimg || {};

    if (canvasupimg['canimgser' + cart_id]){
      _this.setData({
        actimgshareact: canvasupimg['canimgser' + cart_id],
        headhidden: true
      });
      wx.hideLoading()
      return false;
    };

      console.log('活动图片:' + share_url);
      console.log('太阳码图片:' + qrcode);
      console.log('用户头像:' + _this.data.avatarUrl)
      if (share_url != '' && qrcode != '') {
        _this.setData({ headhidden: false });
        wx.showLoading({ title: '加载中...', })
        wx.getImageInfo({
          src: share_url,

          success: function (res) {
            const ctx = wx.createCanvasContext('canimgser' + cart_id);
            
            _this.setData({
              imagesrespath:res.path
            })
            ctx.drawImage(res.path, 0, 0, 360, 384);
            ctx.draw(true);
            wx.getImageInfo({
              src: qrcode,
              success: function (res) {
                const ctxt = wx.createCanvasContext('canimgser' + cart_id);
                ctxt.drawImage(res.path, 141, 288, 70, 70)
                ctxt.draw(true);

                const path = wx.getStorageSync('image_cache')
                var uidimg = app.signindata.avatarUrl || 'https://static.51chaidan.com/images/headphoto/' + _this.data.uid + '.jpg';
                if (uidimg) {
                  var tdavatar = uidimg;
                } else if (path != null) {
                  if (path) { var tdavatar = path; } else { var tdavatar = _this.data.avatarUrl; };
                } else {
                  var tdavatar = _this.data.avatarUrl;
                };
                console.log(tdavatar)
                // 第一步 底部背景颜色改变
                ctxt.fillStyle = '#feffff';
                ctxt.fillRect(0, 384, 360, 191);
                ctxt.draw(true);
                // 第二部 渲染标题
                var strnew = '—— 在线抽盒机 ——';
                ctxt.setFontSize(13);
                ctxt.setFillStyle('#000');
                ctxt.fillText(strnew, (360 - ctxt.measureText(strnew).width) / 2, 409);
                ctxt.draw(true);
                // 第三部 渲染左边图片
                wx.getImageInfo({
                  src: _this.data.activityblindbox[0].cover,
                  success: function (res) {
                    // 渲染左边图片
                    ctxt.fillStyle = '#fff';
                    ctxt.fillRect(14, 424, 159, 140);
                    ctxt.draw(true);
                    ctxt.drawImage(res.path, 14, 424, 159, 85)
                    ctxt.draw(true);
                    ctxt.setFontSize(11);
                    ctxt.setFillStyle('#000');
                    ctxt.fillText(_this.data.activityblindbox[0].name, 17, 529);
                    ctxt.draw(true);
                    ctxt.setFontSize(11);
                    ctxt.setFillStyle('#ff2742');
                    ctxt.fillText('￥' + _this.data.activityblindbox[0].shop_price, 17, 551);
                    ctxt.draw(true);
                    if (_this.data.activityblindbox[0].tip){
                      ctxt.setFontSize(10);
                      ctxt.setFillStyle('#ff2742');
                      ctxt.fillText(_this.data.activityblindbox[0].tip, 98, 551);
                      ctxt.draw(true);
                      ctxt.strokeStyle = "#ff2742";
                      ctxt.lineWidth = 1;
                      ctxt.strokeRect(95, 539, ctxt.measureText(_this.data.activityblindbox[0].tip).width + 6, 16);
                      ctxt.draw(true);
                    }

                    // 第四部 渲染右边图片
                    wx.getImageInfo({
                      src: _this.data.activityblindbox[1].cover,
                      success: function (res) {
                        // 渲染右边图片
                        ctxt.fillStyle = '#fff';
                        ctxt.fillRect(187, 424, 159, 140);
                        ctxt.draw(true);
                        ctxt.drawImage(res.path, 187, 424, 159, 85)
                        ctxt.draw(true);
                        ctxt.setFontSize(11);
                        ctxt.setFillStyle('#000');
                        ctxt.fillText(_this.data.activityblindbox[1].name, 190, 527);
                        ctxt.draw(true);
                        ctxt.setFontSize(11);
                        ctxt.setFillStyle('#ff2742');
                        ctxt.fillText('￥' + _this.data.activityblindbox[1].shop_price, 190, 551);
                        ctxt.draw(true);
                        if (_this.data.activityblindbox[1].tip){
                          ctxt.setFontSize(10);
                          ctxt.setFillStyle('#ff2742');
                          ctxt.fillText(_this.data.activityblindbox[1].tip, 270, 551);
                          ctxt.draw(true);
                          ctxt.strokeStyle = "#ff2742";
                          ctxt.lineWidth = 1;
                          ctxt.strokeRect(267, 539, ctxt.measureText(_this.data.activityblindbox[1].tip).width + 6, 16);
                          ctxt.draw(true);
                        }




                      wx.getImageInfo({
                        src: 'https://www.51chaidan.com/images/mc.jpg', // 美拆头像
                        success: function (res) {
                          ctxt.arc(176, 323, 16, 0, Math.PI * 2, false);
                          ctxt.strokeStyle = "#fff";
                          ctxt.clip();
                          ctxt.drawImage(res.path, 160, 306, 34, 34);
                          ctxt.stroke();//画实心圆
                          ctxt.closePath();
                          ctxt.restore();
                          ctxt.draw(true);
                          wx.getImageInfo({
                            src: tdavatar,
                            success: function (res) {
                              const ctxt = wx.createCanvasContext('canimgser' + cart_id);
                              // ctxt.save();
                              // ctx.beginPath();
                              ctxt.arc(176, 323, 16, 0, Math.PI * 2, false);
                              ctxt.strokeStyle = "#fff";
                              ctxt.clip();
                              ctxt.drawImage(res.path, 160, 306, 34, 34);
                              ctxt.stroke();//画实心圆
                              ctxt.closePath();
                              ctxt.restore();
                              ctxt.draw(true, setTimeout(function () {
                                wx.canvasToTempFilePath({
                                  canvasId: 'canimgser' + cart_id,
                                  success: function (res) {
                                    canvasupimg['canimgser' + cart_id] = res.tempFilePath;
                                    _this.setData({
                                      actimgshareact: res.tempFilePath,
                                      headhidden: true,
                                      canvasupimg: canvasupimg
                                    });
                                    wx.hideLoading()
                                  },
                                  fail: function (res) {
                                    wx.hideLoading()
                                    app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:01}');
                                    _this.setData({ upserimgboxact: false, headhidden: true });

                                  },
                                });
                              }, 300));
                            },
                            fail: function (res) {
                              const ctxt = wx.createCanvasContext('canimgser' + cart_id);
                              ctxt.draw(true, setTimeout(function () {
                                wx.canvasToTempFilePath({
                                  canvasId: 'canimgser' + cart_id,
                                  success: function (res) {
                                    canvasupimg['canimgser' + cart_id] = res.tempFilePath;
                                    _this.setData({
                                      actimgshareact: res.tempFilePath,
                                      headhidden: true,
                                      canvasupimg: canvasupimg
                                    });
                                    wx.hideLoading()
                                  },
                                  fail: function (res) {
                                    wx.hideLoading()
                                    app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:01}');
                                    _this.setData({ upserimgboxact: false, headhidden: true });

                                  },
                                });
                              }, 300));

                            }
                          })
                        },
                        fail: function (res) {
                          app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:16}');
                          _this.setData({ upserimgboxWinningtheprize: false, headhidden: true });
                        }
                      });

                      },
                      fail: function () {
                        app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:011}');
                      }
                    })
                  },
                  fail: function () {
                    app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:010}');
                  }
                });



              },
              fail: function (res) {
                wx.hideLoading()
                app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:03}');
                _this.setData({ upserimgboxact: false, headhidden: true });
                
              }
            })
          },
          fail: function (res) {
            wx.hideLoading()
            app.showToastC('网络不佳,图片生成失败,请刷新页面后重试,{ReturnCode:04}');
            _this.setData({ upserimgboxact: false, headhidden: true });
            
          }
        })
      } else {
        _this.setData({ upserimgboxact: false,  savepicturesiftr: true });
        wx.hideLoading()
      };



  },
  acetlistfunact:function(){
    this.setData({ upserimgboxact:false});
  },
  screenshotpreviewImg: function (w) {
    var index = 0;
    var imgArr = ['http://www.51chaidan.com/images/default/consultOrder.jpg'];
    wx.previewImage({
      current: imgArr[index],
      urls: imgArr,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    });
  },
  screenshotpreviewImgzhong: function (w) {
    var index = 0;
    var imgArr = ['http://www.51chaidan.com/images/default/consultAudit.jpg'];
    wx.previewImage({
      current: imgArr[index],
      urls: imgArr,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    });
  },

  gofreedetail:function(w){
    var _this = this;
    var cart_id = w.currentTarget.dataset.cart_id || w.target.dataset.cart_id || '';
    wx.navigateTo({
      url: "/page/component/pages/hidefun/hidefun?type=0&cart_id=" + cart_id
    });
  },
  
  goodsetail: function (w) {
    var _this = this;
    var gid = w.currentTarget.dataset.gid || w.target.dataset.gid || '';
    wx.navigateTo({
      url: "/pages/detailspage/detailspage?gid=" + gid
    })
  },

  personalhomepage: function (w) {
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var myordata = this.data.myordata||[];
    var mylist = myordata[ind].list||[];
    var mylistarr = [];
    if (mylist.length!=0){
      for (var i = 0; i < mylist.length; i++) {
        mylistarr.push(mylist[i].gid);
      };
    };
    mylistarr = JSON.stringify(mylistarr);
    wx.reLaunch({
      url: "/page/component/pages/dldlcreate/dldlcreate?mylist=" + mylistarr,
    })
  },
  // 取消保存图片授权
  imgCanelTg: function () {
    app.showToastC('保存失败');
    this.setData({ shareshopiftr: false, tgimgbox: false, picbox: false });
  },

  awajump: function () {
    var cart_id = this.data.cart_idcarry || '';
    wx.navigateTo({
      url: "/page/component/pages/awardwinningarea/awardwinningarea?cart_id=" + cart_id,
    });
    this.setData({ awatip: false });
  },
  awatipdisnone: function () {
    this.setData({ awatip: false });
  },

  jumpgoodsthings: function () {
    wx.navigateToMiniProgram({
      appId: 'wx56c8f077de74b07c',
      path: "/open/function-introduction/function-introduction",
      extraData: {foo: 'bar'},
      envVersion: 'release',
      success(res) {}
    })
  },

  jumpaction: function (w) {
    var path = w.currentTarget.dataset.path || w.target.dataset.path || '';
    wx.navigateTo({
      url: path
    });
  },

  wshoppingCart: function () {
    wx.reLaunch({
      url: "/pages/shoppingCart/shoppingCart"
    });
  },
  // 导航跳转 
  wnews: function () {
    var _this = this;
    app.limitlottery(_this);
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

  wmy: function () {
    app.signindata.iftr_mc = true;
    wx.reLaunch({
      url: "/pages/wode/wode"
    });
  },
  jumpowntoy: function () {
    var _this = this;
    wx.navigateTo({
      url: "/page/component/pages/myothertoydg/myothertoydg?ownerId=" + _this.data.uid
    })
  },

  subscrprofun: function () {
    this.setData({ subscrproiftr: false })
  },

  // 计算图片大小
  imageLoadad: function (e) {
    var _this = this;
    var ind = e.currentTarget.dataset.ind || e.target.dataset.ind || 0;
    var num = e.currentTarget.dataset.num || e.target.dataset.num || 0;
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;
    var viewHeight = 140,           //设置图片显示宽度，
      viewWidth = 140 * ratio;
    var commoddata = this.data.myordata;
    if (viewWidth > 140) {
      viewWidth = 140;
    };
    if (commoddata[ind]) {
      if (commoddata[ind].list) {
        commoddata[ind].list[num].width = viewWidth;
        _this.setData({
          // myordata: commoddata,
          ['myordata[' + ind + '].list[' + num + '].width']: viewWidth
        })
      };
    };
  },

  // 地址管理
  goAddress:function(){
    wx.navigateTo({ 
      url: "/pages/newreceivingaddress/newreceivingaddress"
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
            if (rdl.length != 0) {
              for (var i = 0; i < rdl.length; i++) {
                if (rdl[i].isdefault == 1) {
                  _this.addmoddetermine(rdl[i].aid);
                  _this.setBlindBoxDefaultAddress(rdl[i].aid);
                  app.signindata.isBlindBoxDefaultAddress = true;
                  _this.setData({
                    isBlindBoxDefaultAddress: true
                  });
                }
              };
            }
          };
        }
      });
    },

  //  添加地址
  addmoddetermine:function(aid){
    var _this = this;
    var q = Dec.Aese('mod=operate&operation=changeAddress&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + aid + '&oid=11' + '&isSupplyAddress=1')
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          // wx.showModal({
          //   content: '设置成功',
          //   success: function (res) {
              _this.onPullDownRefresh();
            // }
          // })     
        }
      }
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













