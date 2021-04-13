var Dec = require('../../../../common/public.js');//aes加密解密js
var WxParse = require('../../../../wxParse/wxParse.js');
var time = require('../../../../utils/util.js');
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
    appNowTime: app.signindata.appNowTime,
    // 判断是ios或者android
    iftriosorand: app.signindata.iftriosorand,     
    // 授权弹框
    tgabox: false,   
    headhidden:true, 
    movies: [],
    // 商品详情数据
    zunmdata:{},
    // 一级弹框背景
    tipback:false,
    // 订单弹框
    tipbox:false, 
    // 文体提示弹框
    textpbiftr:false,
    textpbiftrtext:'已成功加入购物车',
    // 价格明细显示隐藏
    pricedetailc:true,
    // 协议radio
    radioagreement:true,
    // 选择弹框
    buybombsimmediately:false,
    // 二级背景
    tipbacktwo:false,
    // 收货地址
    receivingaddress:false,
    // 兑换input值
    coupondata:'',
    gid:'',
    // 评论数据
    allcomlist:[],
    // 收货地址数据
    addressdata:[],
    // 收货地址显示 请选择收货地址
    tipaddress:'请选择收货地址',
    tipaid:'',
    // 弹框优惠券 请选择优惠券
    tipcoupon:'请选择优惠券',
    // 颜色id
    colorid:'',
    colorcon:'',
    // 颜色id
    sizeid: '', 
    sizecon:'',  
    // 运费券
    coudata1:[],
    coudata1cid:'',
    coudata1mon:'0.00',
    // 代金券
    coudata2: [],
    coudata2cid: '',
    coudata2mon:'0.00',    
    // 公共默认信息
    defaultinformation:'',
    // 后台返回总价格
    payment:'',
    // 应付金额
    amountpayable:'0.00',
    // 运费
    freight:'￥0.00',
    // 运费判断关于运费券
    freightiftr:'0.00',
    // 商品价格
    commodityprice:0,
    // 税费
    taxation:'0.00',
    // 订单id
    cart_id:'',
    // 后台传回
    hamount:0,
    // 支付完成赠送卷
    paycheadwsong: '',     
    // 是否支付成功
    payiftr:false,
    // 支付成功分享的图片地址
    paycheadwsongimg:'',
    combdataimg:{},
    // 组合判断按钮是否可点击（商品是否全部选中）
    combaddpay:true,
    // 组合显示税总和
    combtaxation:'0.00',
    // 判断是否是 原产品还是活动 1原产品 2 活动二 
    judgmentactivity:1,
    // 滚动条的高度
    scrollHeight:0,
    // 购物车判断是否显示下拉提示图片
    addcatlimg:0,
    // 提交支付蒙层
    suboformola:false,
    // 买家备注
    desc:'',
    // 满减优惠券的使用判断
    commoditypriceiftr: 0,  
    // 购买显示商品数量
    quantityofgoods:'', 
    //  预览图数据
    imgArr: [],
    // 预加载商品详情
    iftrdetail:true,
    // 真实姓名
    inputnamedata:'',
    // 身份证号
    inputidnumberdata:'',
    // 浏览任务判断
    browsetaskiftr:true,
    // 微信号码
    wxnum: 'meichai666666', 
    // 浏览奖励提示框
    winshopawiftr:false,
    winshopawnum:0,
    // 支付完成显示分类跳转数据
    shareinfo:'',
    // 统计邀请
    rec_goods_id: 0,
    rec_cart_id: 0,
    // 生成分享图片
    snapshot: '',
    // 防止多次提交接口
    updataiftr:true,

    c_title: '商品详情',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,

  },

  /**
   * 绘制多行文本
   * @param str 文本内容
   * @param initHeight 文本绘制的初始高度
   * @param titleHeight 绘制文本的高度
   */
  drawText: function (ctx, str, initHeight, lineHeight, beginWidth, canvasWidth) {
    var line = 0;
    var lineWidth = 0;
    var dotWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      if (line > 0) {
        dotWidth = ctx.measureText('.').width * 6;
      }
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth + beginWidth + dotWidth >= canvasWidth) {
        if (line > 0 && i < str.length - 1) {
          ctx.fillText(str.substring(lastSubStrIndex, i) + '...', beginWidth + 0, initHeight);//绘制截取部分
        } else {
          ctx.fillText(str.substring(lastSubStrIndex, i), beginWidth + 0, initHeight);//绘制截取部分
        }
        initHeight += lineHeight;//20为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
        beginWidth = 0;
        line += 1;
        // titleHeight += 30;
      }
      if (i == str.length - 1) {//绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), beginWidth + 0, initHeight);
      }
      if (line > 0 + 1) {
        break;
      }
    }
    // 标题border-bottom 线距顶部距离
    // titleHeight = titleHeight + 10;
    return lineWidth
  },

  /**
   * 生成截图
   */
  getSnapshot: function () {
    var _this = this;
    wx.getImageInfo({
      src: _this.data.zdyurl + _this.data.zunmdata.goods_share,
      // src: "http://www.51chaidan.com/images/201811/source_img/18292_P_1541133356671.jpg",
      success: function (res) {
        const ctx = wx.createCanvasContext('snapshot')
        let dw = 300
        let dh = 240
        var width = res.width
        var height = res.height
        var scale = height / dh
        ctx.setFillStyle('#fff')
        ctx.fillRect(0, 0, dw, 240)

        ctx.drawImage(res.path, (dw - width / scale) / 2, 0, width / scale, dh)

        var lineHeight = 25; // 标题的高度
        // var canvasWidth = 310;//计算canvas的宽度
        var initHeight = 180;//绘制字体距离canvas顶部初始的高度

        ctx.setFontSize(18)
        ctx.setFillStyle('red')
        // ctx.fillText(_this.data.zunmdata.gname, 40, 190)
        var price = '';
        // if (_this.data.zunmdata.is_suit == 1) {
        //   price = '' + _this.data.zunmdata.munit + _this.data.zunmdata.gsale + _this.data.zunmdata.gsale_suit;
        // } else {
        //   price = '' + _this.data.zunmdata.munit + _this.data.zunmdata.gsale;
        // }

        // var begin = _this.drawText(ctx, price + ' ', initHeight + lineHeight, lineHeight, 0, dw);

        // ctx.setFillStyle('black')
        // var prname ='';
        // _this.drawText(ctx, prname, initHeight + lineHeight, lineHeight, begin, dw);

        ctx.draw(true, setTimeout(function () {
          wx.canvasToTempFilePath({
            canvasId: 'snapshot',
            success: function (res) {
              _this.setData({
                snapshot: res.tempFilePath
              });
            },
          })
        }, 100));
      }
    })
  },

  // 阻止蒙层冒泡
  preventD() { },
  tipbacktwo:function(){
    this.setData({
      tipbacktwo: !this.data.tipbacktwo,
      buybombsimmediately: !this.data.buybombsimmediately
    })
  },
  // 显示弹框
  buybomb:function(){
     this.setData({
       tipbacktwo: !this.data.tipbacktwo,
       buybombsimmediately: !this.data.buybombsimmediately
     })
  },
  // 提交订单
  placeorder:function(){
    var _this = this;
    if (_this.data.updataiftr){
      _this.setData({ updataiftr:false});
      var aid = _this.data.tipaid;
      // 验证地址
      if (this.data.tipaid == '') {
        app.showToastC('请选择地址');
        return false;
      }; 
      var q = Dec.Aese('mod=operate&operation=exchange&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&address_id=' + aid + '&goods_id=' + _this.data.gid);
      wx.request({
        url: app.signindata.comurl + 'integral.php' + q,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {
          _this.setData({ updataiftr:true});
          if (res.data.ReturnCode == 200){
            wx.showToast({
              title: '兑换成功',
              icon: 'none',
              duration: 1000,
              complete:function(){
                setTimeout(function(){
                  wx.redirectTo({
                      url: "../../../../pages/myorder/myorder?tabnum=0"
                  })
                },1000);
              }
            });          
            _this.setData({
              tipbacktwo: !_this.data.tipbacktwo,
              buybombsimmediately: !_this.data.buybombsimmediately
            });          
          }else{
            app.showToastC(res.data.Msg);
            _this.setData({
              tipbacktwo: !_this.data.tipbacktwo,
              buybombsimmediately: !_this.data.buybombsimmediately
            })          
          }

        }
      });
    }; 
  },

  // 修改收货地址
  revisethereceivingaddress:function(w){
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






  // 隐藏收货地址弹框
  receivingaddressfun:function(){
    this.setData({
      receivingaddress: false,
    })
  },
  // 收货地址弹框
  seladdressfun:function(){
    this.setData({
      receivingaddress:true,
    });
  },
  // 删除地址
  deladdress: function (event){
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
            url: app.signindata.comurl + 'user.php'+q,
            method: 'GET',
            header: { 'Accept': 'application/json' },
            success: function (res) {
              if (res.data.ReturnCode == 200){
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




  // 编辑地址
  jumpeditaddress: function (event){
    var aid = event.target.dataset.aid || event.currentTarget.dataset.aid;
    var address = event.target.dataset.address || event.currentTarget.dataset.address;
    var city = event.target.dataset.city || event.currentTarget.dataset.city;
    var consignee = event.target.dataset.consignee || event.currentTarget.dataset.consignee;
    var district = event.target.dataset.district || event.currentTarget.dataset.district;
    var idcard = event.target.dataset.idcard || event.currentTarget.dataset.idcard;
    var phone = event.target.dataset.phone || event.currentTarget.dataset.phone;
    var province = event.target.dataset.province || event.currentTarget.dataset.province;
    wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "../../../../pages/shippingAddress/shippingAddress?aid=" + aid + '&address=' + address + '&city=' + city + '&consignee=' + consignee + '&district=' + district + '&idcard=' + idcard + '&phone=' + phone + '&province=' + province
    })
  },
  // 跳转增加新地址
  jumpaddress:function(){
    wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "../../../../pages/newreceivingaddress/newreceivingaddress"
    })     
  },


 








  /**
   * 生命周期函数--监听页面加载
   */
  onLoadfun:function(){
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid:app.signindata.openid
    });
    this.setData({
      headhidden: true
    });     
    var reg = /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/;


    var q = Dec.Aese('mod=info&operation=goodsinfo&goods_id=' + _this.data.gid + '&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'integral.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200){
          if (res.data.Info.goods_gallery.length != 0) {
            var imgArr = [];
            for (var i = 0; i < res.data.Info.goods_gallery.length; i++) {
              if (!reg.test(res.data.Info.goods_gallery[i])) {
                res.data.Info.goods_gallery[i] = _this.data.zdyurl + res.data.Info.goods_gallery[i];
              };
              imgArr.push(res.data.Info.goods_gallery[i])
            };
            
          }

          var redauin = res.data.Info;

          redauin.goods_desc = decodeURIComponent(redauin.goods_desc.replace(/\+/g, ' '));
          WxParse.wxParse('article', 'html', redauin.goods_desc, _this, 0);
          redauin.retailer_url = decodeURIComponent(redauin.retailer_url)
          _this.setData({
            movies: res.data.Info.goods_gallery,
            zunmdata: redauin,
            imgArr: imgArr
          });
          // 分享生成图片
          _this.getSnapshot();
        }else{
          wx.showToast({
            title: res.data.Msg,
            icon: 'none',
            duration: 1500,
            complete: function () {
              setTimeout(function () {
                _this.jumpclassdh(); 
              }, 1500);
            }
          });                

        };                    
      }
    })

    //  收货地址
    _this.nextpagediao();


  },
 
  onLoad: function (options) { 
    this.setData({
      gid: options.goods_id,
    });
    // 判断是否授权
    this.activsign();
  },

   
  // 下一页返回调取
  nextpagediao:function(){
    var _this = this;
    //  调取收货地址
    var q = Dec.Aese('mod=address&operation=getlist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'user.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200){
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
            _this.setData({
              addressdata: rdl,
              tipaid: tptipadi,
              tipnamephone: tipnamephone,
              tipaddress: tptipadd
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
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    var _this = this;
    if (_this.data.snapshot){
      var reshare = {
        title: '我用拆币兑换了' + _this.data.zunmdata.goods_name + '，一起分享赢拆币！', 
        path: '/page/component/pages/imdetailspage/imdetailspage?goods_id=' + _this.data.gid,
        imageUrl: _this.data.snapshot,
        success: function (res) {},
      };
    }else{
      var reshare = {
        title: '我用拆币兑换了' + _this.data.zunmdata.goods_name + '，一起分享赢拆币！',
        path: '/page/component/pages/imdetailspage/imdetailspage?goods_id=' + _this.data.gid,
        success: function (res) {},
      };
    };
    return reshare  
  },
  activsign: function () {
    this.setData({
      headhidden: false
    });
    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        if (true) {
          // '已经授权'
          _this.setData({
            loginid: app.signindata.loginid,
            uid: app.signindata.uid,
            openid: app.signindata.openid
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this);
          }
        } else {
          // // '没有授权 统计'
          // app.userstatistics(8);
          // // '没有授权'
          // _this.setData({
          //   tgabox: true
          // });
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
              // '没有授权 统计'
              app.userstatistics(8);
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
  // 授权点击统计
  clicktga: function () {
    app.clicktga(2)
  },  
  // 点击登录获取权限
  userInfoHandler: function (e) {
    var _this = this;
    wx.getSetting({
      success: res => {
        if (true) {
          _this.setData({
            tgabox: false
          });
          _this.activsign();
          // 确认授权用户统计
          app.clicktga(4);          
        }
      }
    });
    if (e.detail.userInfo) { } else {
      app.clicktga(8)  //用户按了拒绝按钮
    };

  },
  frontpagebutton:function(){
    wx.reLaunch({     //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
      url: '../../../../pages/index/index'
    })
   
  },
  
  // 买家备注
  inputChange: function (e) {
    this.setData({
      desc: e.detail.value
    });
  }, 
  // 图片预览
  previewImg: function (w) {
    var index = w.currentTarget.dataset.index || w.target.dataset.index;
    var imgArr = this.data.imgArr;
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 更多兑换
  jumpclassdh:function(){
    wx.redirectTo({
      url: "../../../../pages/classificationpage/classificationpage?cate=21&cid=43&wtype=21&wname=拆币兑换"
    });

  },
})



