
var Dec = require('../../../../common/public');//aes加密解密js
var api = require("../../../../utils/api.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '商品管理',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    brandid:0,
    ordername:'',
    centerIndex:'0',
    scrollleft:0,
    scrollleftTop:0,
    logisticsRefundModify:4, // 1 修改 2 退款 3 物流 4批量导出订单
    scanCodeMsg: "",
    csc:'',
    commonBulletFrame:false, // 公共弹框
    condition: false,
    cityback:false, 
    brand:[],
    order:[],
    payStatus:[
      {name:'全部',num:'0'},
      {name:'未开始',num:'1'},
      {name:'进行中',num:'2'},
      {name:'已结束',num:'3'},
      {name:'已删除',num:'4'}
    ], // 支付状态 
    subLedger: 0 , // 1 已分账 2 未分账
    countOrder:0,
    nodataiftr:false,
    selectid:0,
    selectBox:false,
    selectData:[
      {'n':'全部',id:0},
      {'n':'秒杀商品',id:'-1'},
      {'n':'抽选商品',id:5}
    ]
  },
  toggleAddNewEventMask(){
    this.setData({
      isAddNewEventMask: !this.data.isAddNewEventMask
    })
  },

  selectBoxFun(){
     this.setData({
        selectBox:!this.data.selectBox
     })
  },
  selectCap(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      selectid:index
    })
    this.getData();
    this.selectBoxFun();
  },
  conditionfun(){
    this.setData({
      condition: false,
      cityback:false
    }) 
  }, 

  // 跳转详情
  jumpBusOrderDetails(w){
    let orderid = w.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: "/page/settled/pages/businessOrderDetails/businessOrderDetails?orderid="+orderid
    });
  },
  closeCommonTip(){
    this.setData({
      commonBulletFrame:false,
    })
  },
  commonBulletFrameFun(e){
    let index = e.currentTarget.dataset.index;
    let num = e.currentTarget.dataset.num || 0; // 订单标识
    var _this = this;
    var order = _this.data.order || [];
    var selectData = order[num] || {};
    if(index == 1){ // 1 修改地址 2 退款 3 物流
      // 9039 发布抽选 9040 发布商品
      if(selectData.itemType == 4){
        app.comjumpwxnav(9039,'id='+selectData.itemId,'','')
      }else{
        app.comjumpwxnav(9040,'id='+selectData.itemId,'','')
      };
    } else if(index == 2){      
        api.checkOrderRefund({
            orderId:selectData.order.orderId,	// Number订单id 对内唯一标识
            customerId:selectData.order.userId // 	Number对应订单的用户id
        }).then(res => {
          console.log('查询是否分账',res)
          if (res.data.status_code == 200) {
              var payInfoData = res.data.data.Info;
              var subLedger = 1;
              if(payInfoData.isProfit){
                subLedger = 1;
              }else{
                subLedger = 2;
              };
              _this.setData({
                subLedger:subLedger,
                payInfoData:payInfoData,
                commonBulletFrame:true,
                logisticsRefundModify:index,
                orderNum:num,
                selectData
              })
          }else{
            if(res.data && res.data.message){
              app.showModalC(res.data.message); 
            };        
          }          
        })
    } else if(index == 3){

    }else if(index == 4){
      this.toggleAddNewEventMask()
    };
    if(index != 1 && index != 4){
      this.setData({
        commonBulletFrame:true,
        logisticsRefundModify:index,
        orderNum:num,
        selectData
      })
    };

  },
  // 开启 秒杀和抽选
  jumpoffering(w){
    var type = w.currentTarget.dataset.type || w.target.dataset.type || 0;
    app.comjumpwxnav(type,'','','');
    this.setData({
      isAddNewEventMask:false
    })
  },
  // 弹框确认按钮    1 修改收货地址 2 退款 3 物流 4批量导出订单
  confirmCommonTip(){ 
    var _this = this;
    var logisticsRefundModify = _this.data.logisticsRefundModify;
    var selectData = _this.data.selectData || {};
    var orderNum = _this.data.orderNum || 0;
    console.log(logisticsRefundModify)
    if(logisticsRefundModify == 1){

          if (_this.data.modifyName == ''){
            app.showToastC('姓名不能为空');
            return false;
          };
          if (_this.data.modifyMobile.length == 0) {
            app.showToastC('输入的手机号为空')
            return false;
          } else if (_this.data.modifyMobile.length < 11) {
            app.showToastC('手机号长度有误！')
            return false;
          } else if (_this.data.modifyMobile && _this.data.modifyMobile[0]!=1) {
            app.showToastC('手机号有误！')
            return false;
          };

        api.modifyAddress(selectData.order.orderId,{
            orderId:selectData.order.orderId,// 订单id 对内唯一标识
            customerId:selectData.order.userId, //	Number对应订单的用户id
            province:_this.data.province, //	String收件地省份
            city:_this.data.city, //	String	收件地城市
            district:_this.data.county, //	String	收件地区县
            address:_this.data.deladdress, //	String	 收件地具体地址
            consignee:_this.data.modifyName, //	String	 收件人姓名
            mobile:_this.data.modifyMobile, //		String	收件人手机号
            idcard:''
        }).then(res => {
          if (res.data.status_code == 200) {
              app.showToastC('添加成功');
              var receipt = _this.data.order[orderNum].receipt || [];
              receipt.consignee = _this.data.modifyName;
              receipt.mobile = _this.data.modifyMobile;
              receipt.address = _this.data.deladdress;
              receipt.province = _this.data.province;
              receipt.city = _this.data.city;
              receipt.district = _this.data.county;
              _this.setData({
                commonBulletFrame:false,
                ['order[' + orderNum + '].receipt'] : receipt
              });
          }else{
            if(res.data && res.data.message){
              app.showModalC(res.data.message); 
            };        
          }          
        })
    }else if(logisticsRefundModify == 2){
 

    }else if(logisticsRefundModify == 3){

        api.brandSettledGoodsStopSale({
            goodsId:selectData.goodsId,	// 商品id
            itemType:selectData.itemType // 	要删除的商品类型
        }).then(res => {
          if (res.data.status_code == 200) {
              app.showToastC('删除成功');
              var order = _this.data.order || [];
              order.splice(_this.data.orderNum, 1)　
              _this.setData({
                commonBulletFrame:false,
                order
              });
          }else{
            if(res.data && res.data.message){
              app.showModalC(res.data.message); 
            };        
          }          
        })
    }else if(logisticsRefundModify == 4){

    }else if(logisticsRefundModify == 5){
      
    }
    _this.setData({
      commonBulletFrame:false
    });

  },

  //  复制内容到粘贴板
  copyTBL: function (title) {
    wx.setClipboardData({
      data: title,
      success: function (res) {
        app.showToastC('复制成功');
      }
    });
  },   
 

  classifyChange(e){
    let that = this;
    let index = e.currentTarget.dataset.index || 0;
    let ele = '#ele' + index;
    that.setData({
      centerIndex:index,
    })
    this.getData();
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
  // input 值改变
  inputChange: function (e) {
    this.setData({
      ordername: e.detail.value
    });
  },
  jumpsearch:function(){
    // this.eldatalistfun(0);
    this.getData();
  },
  onFocus: function (w) {
    this.setData({
      ordername:""
    });
  },  

  scrollViewTop(e){
    var brandid = e.currentTarget.dataset.brandid || 0;
    this.setData({
      brandid:brandid
    });
    this.getData();
    let that = this;
    let top = '#top' + brandid;
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select(top).boundingClientRect();
    query.exec(function(res) {
      that.setData({
        scrollleftTop:e.currentTarget.offsetLeft - wx.getSystemInfoSync().windowWidth/2 + (res[0].width/2)
      })
    })

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
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
    } else {
      app.signin(_this)
    };


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

    if(wx.getStorageSync('access_token')){
      this.getData();
    }else{
      app.getAccessToken(_this.getData)
    };
    
  },
  // 获取数据
  getData(num=1){
     var _this = this;

    if (num==1){
      _this.setData({countOrder:0,page : 1,nodataiftr:false});
    }else{
      var pagenum = _this.data.page;
      _this.data.page = ++pagenum;
    };
     api.settledGoodsList({
       'searchValue':_this.data.ordername,
       'goodsStatus':_this.data.centerIndex,
       'brandId':_this.data.brandid || 0,
       'pageId':_this.data.page,
       'goodsType':_this.data.selectid
     }).then((res) => {
      console.log('列表数据=======',res)
      _this.setData({nodataiftr:true})
      if (res.data.status_code == 200) {
          var order = res.data.data.List.item || [];
          // if(order && order.length != 0){
          //   order.forEach(element => {
          //      if(element.order.payTime){
          //         element.order.payTimeTrans = _this.toDate(element.order.payTime);
          //      };
          //   });
          // };
          if(order && order.length ==0){
              app.showToastC('暂无更多数据');
          };
          if (num==1){
              var brand = res.data.data.List.brand || [];
              _this.setData({
                brand,
                order
              });
          }else{
            var orderData = [..._this.data.order,...order]
            _this.setData({
              order:orderData
            });
          };
      }else{
        if(res.data && res.data.message){
          app.showModalC(res.data.message); 
        };        
      };
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
    this.getData(2)
  },

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

})
