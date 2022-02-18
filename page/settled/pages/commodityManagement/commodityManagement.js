
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
      {name:'未发布',num:'5'},
      {name:'未开始',num:'1'},
      {name:'进行中',num:'2'},
      {name:'已结束',num:'3'}
      // {name:'已删除',num:'4'}
    ], // 支付状态 
    subLedger: 0 , // 1 已分账 2 未分账
    countOrder:0,
    nodataiftr:false,
    selectid:0,
    selectBox:false,
    selectWordsData:[
      {'n':'全部',id:0},
      {'n':'限时商品',id:'1'},
      {'n':'限量商品',id:'2'},
      {'n':'展会商品',id:'3'},
      {'n':'抽选商品',id:4}
    ],
    screenWords:'筛选',
    shareImgTipIs:false
  },
  clickSelected(e){
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    let pages = getCurrentPages();    //获取当前页面信息栈
    let prevPage = pages[pages.length-2];
    prevPage.setData({
      [`fieldGuideData2[1].value`]:name,
    })
    prevPage.data.obj.associationGoodsId=id;
    wx.navigateBack({
      delta: 1
    })
  },
  shareImgTipFun(){
    this.setData({
      shareImgTipIs:!this.data.shareImgTipIs
    })
  },
  publicJump(w){
    var id = w.currentTarget.dataset.id || w.target.dataset.id || '';
    var istype = w.currentTarget.dataset.istype || w.target.dataset.istype || '';
    var type = ''
    if(istype == '-1'){
      type = 9047;
      id = id+'&canShare=1';
    }else if(istype == 4){
      type = 9001;
      id = id+'&canShare=1'
    }; 
    app.comjumpwxnav(type, id, '', '')
    
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
    let screenWords = e.currentTarget.dataset.word;
    this.setData({
      selectid:index,
      screenWords:screenWords
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
    let itemstatus = e.currentTarget.dataset.itemstatus || '';
    let num = e.currentTarget.dataset.num || 0; // 订单标识
    var _this = this;
    var order = _this.data.order || [];
    var selectData = order[num] || {};
    console.log(index)
    // return false;
    if(index == 1){ // 1 修改地址 2 退款 3 物流
      // 9039 发布抽选 9040 发布商品
      if(selectData.itemType == 4){
        app.comjumpwxnav(9039,'id='+selectData.itemId+'&itemstatus='+itemstatus,'','')
      }else{
        app.comjumpwxnav(9040,'id='+selectData.itemId+'&itemstatus='+itemstatus,'','')
      };
    } else if(index == 2){
      wx.navigateTo({ 
        url: "/page/settled/pages/salesEffect/salesEffect?itemtype="+selectData.itemType+"&itemid="+selectData.itemId,
      });
    } else if(index == 3){

    }else if(index == 4){
      this.toggleAddNewEventMask()
    }else if(index == 6){
      this.brandSettledGoodsStopSale('',selectData);
      return false;
    };
    if(index != 1 && index != 4 && index != 2){
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
      this.brandSettledGoodsStopSale(1,selectData);
    }else if(logisticsRefundModify == 4){

    }else if(logisticsRefundModify == 5){
      
    }
    _this.setData({
      commonBulletFrame:false
    });
  },
  //下架 or 删除
  brandSettledGoodsStopSale(isDelete,selectData){
    var _this = this;
    api.brandSettledGoodsStopSale({
        goodsId:selectData.goodsId,	// 商品id
        itemType:selectData.itemType, // 要删除的商品类型
        isDelete:isDelete
    }).then(res => {
      if (res.data.status_code == 200) {
        if(isDelete == 1){
          app.showToastC('删除成功');
          var order = _this.data.order || [];
          order.splice(_this.data.orderNum, 1)　
          _this.setData({
            commonBulletFrame:false,
            order
          });
        }else{
          app.showToastC('下架成功',1500);
          setTimeout(function(){
            _this.getData()
          },1500)
        }
      }else{
        if(res.data && res.data.message){
          app.showModalC(res.data.message); 
        };        
      }          
    })
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
    // wx.hideShareMenu();

    // '已经授权'
    console.log(options)
    this.setData({
      from:options.from || '',
      payStatus:options.from=='releaseDrawGoods'?[
        {name:'全部',num:'0'},
        {name:'未开始',num:'1'},
        {name:'进行中',num:'2'},
        {name:'已结束',num:'3'}
      ]:this.data.payStatus,
      c_title:options.from=='releaseDrawGoods'?'关联商品':'商品管理'
    })
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
      _this.setData({countOrder:0,page : 1,nodataiftr:false ,order : []});
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
              var userJurisdictionList = res.data.data.Info.jurisdiction || ''
              _this.setData({
                brand,
                order,
                userJurisdictionList
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
  onShareAppMessage: function (options) {
    var _this = this;

    var indexShare = app.signindata.indexShare || [];
    var indexShareNum = Math.floor(Math.random() * indexShare.length) || 0;
    var indexShareImg = '';
    if(indexShare.length!=0 && indexShare[indexShareNum]){
      indexShareImg = indexShare[indexShareNum]+'?time=' + Date.parse(new Date());
    };
    var title = app.signindata.titleShare?app.signindata.titleShare:'你喜欢的潮玩都在这里！'
    var onshareUrl = 'pages/index/index';
    var onshareImg = indexShareImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg';

    if (options.from == 'button') {
      var num = options.target.dataset.num;
      var selectData = _this.data.order[num];
      title = selectData.itemName || '你喜欢的潮玩都在这里！';
      onshareImg = selectData.itemImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg';
      if (selectData.itemType == '-1'){  // 正常商品
        onshareUrl = '/pages/detailspage/detailspage?gid=' + selectData.itemId + '&referee=' + app.signindata.uid;
      }else if(selectData.itemType == 4){ // 抽选
        onshareUrl = "/page/component/pages/limitlottery/limitlottery?id=" + selectData.itemId + '&referee=' + app.signindata.uid;
      };      
    }
    return {
      title: title ,
      path: onshareUrl,
      imageUrl:onshareImg,
      success: function (res) {}
    };
  },
  permissionDeniedFun(){
    app.showToastC('您没有权限',1500);
  },
})
