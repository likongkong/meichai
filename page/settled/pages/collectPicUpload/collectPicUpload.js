var Dec = require('../../../../common/public');//aes加密解密js
var api = require("../../../../utils/api.js");
const util = require('../../../../utils/util');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '征集图片',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    listData:[
      {
        isRequired:false,
        type:'uploadImg',
        subtitle:'上传图片',
        name:'detailsFigure',
        imageList:[],
        margintop0:true,
        mode:'multiple',
        storagelocation:'images/goods'
      },{
        isRequired:false,
        type:'textarea',
        subtitle:'图片配文',
        placeholder:'非必填，可输入图片配文',
        value:'',
        name:'awardsShow',
        borderbottom1:'show',
        margintop0:true,
      }
    ],
    obj:{
      startTime:'',
      endTime:'',
    },
    activityReward:2,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    // '已经授权'
    // this.data.id = options.id;
    this.data.id = options.id || '';
    this.data.loginid = app.signindata.loginid;
    this.data.uid = app.signindata.uid;
    // 判断是否登录
    if (this.data.loginid != '' && this.data.uid != '') {
      this.onLoadfun();
    } else {
      app.signin(this)
    };
  },
  onLoadfun(){
    this.data.loginid = app.signindata.loginid;
    this.data.uid = app.signindata.uid;
    if(wx.getStorageSync('access_token')){
      this.getIp();
    }else{
      app.getAccessToken(this.onLoadfun)
    };
  },
  // 获取表单数据
  bindchange(e){
    let value = e.detail.value; 
    let key=e.detail.name;
    if(key == 'startTime'){
      let startTime = (new Date(value).getTime())/1000;
      let endTime = (new Date(this.data.obj.endTime).getTime())/1000;
      if((startTime&&!endTime)||(startTime<endTime)){
        this.selectComponent('#settledForm').refreshTimeData(value,3);
        this.data.obj[key]=value;
      }else{
        app.showToastC('开始时间不可大于结束时间',1500);
      }
    }else if(key == 'endTime'){
      let endTime = (new Date(value).getTime())/1000;
      let startTime = (new Date(this.data.obj.startTime).getTime())/1000;
      if((!startTime&&endTime)||(endTime>startTime)){
        this.selectComponent('#settledForm').refreshTimeData(value,4);
        this.data.obj[key]=value;
      }else{
        app.showToastC('结束时间不可小于开始时间',1500);
      }
    }else if(key == 'goodsLabel'){
      this.setData({
        activityReward:value,
      })
    }else{
      this.data.obj[key]=value;
    }
    console.log(this.data.obj)
  },

  // 获取用户下所有的品牌id
  getIp(){
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    api.settledGoodsBrandlist().then((res) => {
      console.log(res.data)
      if(res.data.status_code == 200){
        let groups = `listData[0].groups`;
        this.setData({
          [groups]:res.data.data.List.brand,
        })
        if(this.data.id&&this.data.id!=0){
          this.getData();
          this.setData({
            [`listData[0].disabled`]:true
          })
        }else{
          wx.hideLoading()
          wx.stopPullDownRefresh();
          console.log(this.data.listData[0])
          this.setData({
            [`listData[0].value`]:res.data.data.List.brand[0].brandName,
            [`fieldGuideData2[0].brand_id`]:res.data.data.List.brand[0].brandId,
          })
          this.data.obj.associationIp = res.data.data.List.brand[0].brandId;
        }
      }else{
        wx.hideLoading()
        wx.stopPullDownRefresh();
        app.showToastC(res.data.Msg,2000);
      }
    }).catch((err)=>{
      console.log(err)
    })
  },
 // 修改IP数据
 showActionSheet(e){
    let that= this;
    let index = e.detail.index;
    let groups = this.data.listData[index].groups;
    let arr = [];
    for(var i=0;i<groups.length;i++){
      arr.push(groups[i].brandName);
    }
    wx.showActionSheet({
      itemList: arr,
      success (res) {
        
        // that.data.obj.associationActivity = '';
        that.setData({
          [`fieldGuideData2[0].value`]:`点击关联`,
          [`fieldGuideData2[0].selectedArr`]:[],
          [`listData[${index}].value`]:groups[res.tapIndex].brandName,
          [`fieldGuideData2[0].brand_id`]:groups[res.tapIndex].brandId
        })
        that.data.obj.fieldGuideId = '';
        that.data.obj.associationIp = groups[res.tapIndex].brandId;
        console.log(that.data.obj)
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  },
  getData(){
    api.settledGoodsInfoGoods(this.data.id).then((res) => {
      wx.hideLoading()
      wx.stopPullDownRefresh();
      console.log(res.data.data)
      if(res.data.status_code == 200){
        let info = res.data.data.Info.goods;
        let obj = this.data.obj;
        this.setData({
          [`listData[0].value`]:info.brand.brandName,
          [`listData1[0].value`]:info.goodsName,
          [`listData1[1].imageList`]:info.arrGoodsThumb,
          [`listData1[2].value`]:info.goodsDescStr,
          [`listData1[3].value`]:info.goodsPrice,
          [`listData1[4].value`]:info.stock,
          [`listData1[5].index`]:info.deliverTimeStatus===''?999:info.deliverTimeStatus==1?0:1,
          [`listData1[6].index`]:info.limitBuy==0?1:0,
          [`listData1[6].value`]:info.limitBuy,
          [`listData1[7].value`]:info.integral,
          [`listData1[8].imageList`]:info.arrGoodsDescImg,
          [`fieldGuideData2[0].value`]:info.illustratedInfo && info.illustratedInfo.length>0?info.illustratedInfo[0].title:'',
          [`fieldGuideData2[0].selectedArr`]:info.illustratedInfo && info.illustratedInfo.length>0?JSON.stringify(info.illustratedInfo):'',
          [`fieldGuideData2[0].brand_id`]:info.brand.brandId,
          // [`listData2[0].groupsIndex`]:info.logisticsIndex,
          [`listData2[0].radioArr[${info.shippingMothed}].groupsIndex`]:info.logisticsIndex,
          [`listData2[0].index`]:info.shippingMothed,
          [`listData2[1].index`]:info.salesMothed,
          [`listData2[2].time`]:util.format1("yyyy-MM-dd HH:mm",info.startTime),
          [`listData2[3].noClick`]:info.salesMothed==1?false:true,
          [`listData2[3].time`]:info.salesMothed==0?'':util.format1("yyyy-MM-dd HH:mm",info.stopTime),
          [`listData2[4].value`]:info.deliverTime,
          [`listData2[5].index`]:info.isShowStock==0?1:0,
          [`listData2[6].index`]:info.isShowSellNumber==0?1:0,
          // [`listData2[1].value`]:info.deliverTime,
          // [`listData2[2].index`]:info.isShowStock==0?1:0,
          // [`listData2[3].index`]:info.isShowSellNumber==0?1:0,
          // [`listData2[4].time`]:util.format1("yyyy-MM-dd HH:mm",info.startTime),
          // [`listData2[5].time`]:util.format1("yyyy-MM-dd HH:mm",info.stopTime),
          [`listData3[0].index`]:info.isCanShare==0?1:0,
        })
    //  goodsName:'', //商品名称
    //  flatPatternmaking:'', //商品展示图
    //  goodsDescribe:'', //文字描述
    //  goodsPrice:'', //商品售价金额
    //   goodsStock:'', //库存数
    //   goodsLabel:'', //标签
    //   purchaseLimitation:0, //是否限购
    //   purchaseLimitationNum:1, //限购体数
    //   goodsDetailsPic:'', //详情图
    //   shipping:'', //物流方式
    //   shippingPriceStatus:'', //邮费类型
    //   dateToPull:'', //预计发货日期
    //   isGoodsStock:'', //是否显示库存数
    //   isSoldNum:'', //是否显示已售数量
    //   startTime:util.format("yyyy-MM-dd HH:mm"),
    //   endTime:util.format("yyyy-MM-dd HH:mm",2592000000),

        obj.associationIp = info.brand.brandId;
        obj.goodsName = info.goodsName;
        obj.flatPatternmaking = info.goodsThumb;
        obj.goodsDescribe = info.goodsDescStr;
        obj.goodsPrice = info.goodsPrice;
        obj.goodsStock = info.stock;
        obj.goodsLabel = info.deliverTimeStatus===''?'':info.deliverTimeStatus==1?0:1;
        obj.purchaseLimitation = info.limitBuy==0?1:info.limitBuy;
        obj.purchaseLimitationNum = info.limitBuy;
        obj.integrate = info.integral;
        obj.goodsDetailsPic = info.arrGoodsDescImg;
        obj.fieldGuideId = info.illustratedInfo && info.illustratedInfo.length>0?info.illustratedInfo[0].id:'';
        obj.logisticsIndex = info.logisticsIndex,
        obj.modeOfDespatch = info.shippingMothed,
        obj.shipping = info.shipping;
        obj.shippingPriceStatus = info.shippingPriceStatus==0?0:1;

        // [`listData2[1].index`]:info.salesMothed,
        // [`listData2[2].time`]:util.format1("yyyy-MM-dd HH:mm",info.startTime),
        // [`listData2[3].time`]:info.salesMothed==0?'':util.format1("yyyy-MM-dd HH:mm",info.stopTime),
        // [`listData2[4].value`]:info.deliverTime,
        // [`listData2[5].index`]:info.isShowStock==0?1:0,
        // [`listData2[5].index`]:info.isShowSellNumber==0?1:0,
        obj.sellingWay = info.salesMothed;
        obj.startTime = util.format1("yyyy-MM-dd HH:mm",info.startTime);
        obj.endTime = info.salesMothed==0?'':util.format1("yyyy-MM-dd HH:mm",info.stopTime);
        obj.dateToPull = info.deliverTime;
        obj.isGoodsStock = info.isShowStock==0?1:0;
        obj.isSoldNum = info.isShowSellNumber==0?1:0;

        // obj.dateToPull = info.deliverTime;
        // obj.isGoodsStock = info.isShowStock==0?1:0;
        // obj.isSoldNum = info.isShowSellNumber==0?1:0;
        // obj.startTime = util.format1("yyyy-MM-dd HH:mm",info.startTime);
        // obj.endTime = util.format1("yyyy-MM-dd HH:mm",info.stopTime);

        obj.isCanShare = info.isCanShare==0?1:0;
      }else{
        app.showToastC(res.data.Msg,2000);
      }
    }).catch((err)=>{
      console.log(err)
    })
  },
  // 发布
  submitAudit(){
    let obj = this.data.obj;
    let that = this;

    if(!obj.goodsName || obj.goodsName == ''){
      this.selectComponent('#settledForm1').scrollto('goodsName');
      app.showToastC('请输入商品名称',1500);
      return false;
    }
    if(!obj.flatPatternmaking || obj.flatPatternmaking.length == 0){
      this.selectComponent('#settledForm1').scrollto('flatPatternmaking');
      app.showToastC('请添加商品展示图',1500);
      return false;
    }
    if(!obj.goodsPrice || obj.goodsPrice == ''){
      this.selectComponent('#settledForm1').scrollto('goodsPrice');
      app.showToastC('请输入商品售价金额',1500);
      return false;
    }else if(obj.goodsPrice<0.01){
      this.selectComponent('#settledForm1').scrollto('goodsPrice');
      app.showToastC('商品售价金额不可小于0.01',1500);
      return false;
    }
    if(!obj.goodsStock || obj.goodsStock == ''){
      this.selectComponent('#settledForm1').scrollto('goodsStock');
      app.showToastC('请输入当前可售库存数',1500);
      return false;
    }
    // if(!obj.goodsDetailsPic || obj.goodsDetailsPic.length == 0){
    //   this.selectComponent('#settledForm1').scrollto('goodsDetailsPic');
    //   app.showToastC('请添加商品详情图',1500);
    //   return false;
    // }
    if(!obj.logisticsIndex || obj.logisticsIndex == []){
      this.selectComponent('#settledForm2').scrollto('modeOfDespatch');
      app.showToastC('请选择发货方式',1500);
      return false;
    }
    if(!obj.dateToPull || obj.dateToPull == ''){
      this.selectComponent('#settledForm2').scrollto('dateToPull');
      app.showToastC('请输入预计发货日期',1500);
      return false;
    }
    wx.showLoading({
      title: '加载中',
    })
    //  goodsName:'', //商品名称
    //  flatPatternmaking:'', //商品展示图
    //  goodsDescribe:'', //文字描述
    //  goodsPrice:'', //商品售价金额
    //   goodsStock:'', //库存数
    //   goodsLabel:'', //标签
    //   purchaseLimitation:0, //是否限购
    //   purchaseLimitationNum:1, //限购体数
    //   goodsDetailsPic:'', //详情图
    //   shipping:'', //物流方式
    //   shippingPriceStatus:'', //邮费类型
    //   dateToPull:'', //预计发货日期
    //   isGoodsStock:'', //是否显示库存数
    //   isSoldNum:'', //是否显示已售数量
    //   startTime:util.format("yyyy-MM-dd HH:mm"),
    //   endTime:util.format("yyyy-MM-dd HH:mm",2592000000),

console.log(obj.modeOfDespatch)
    let data = {
      goodsId:this.data.id&&this.data.id!=0?this.data.id:'',
      brandId:obj.associationIp,
      goodsName:obj.goodsName,
      goodsThumb:obj.flatPatternmaking,
      goodsPrice:obj.goodsPrice,
      deliverTimeStatus:obj.goodsLabel===''?'':obj.goodsLabel==0?1:0,
      deliverTime:obj.dateToPull,
      salesMothed:obj.sellingWay,
      startTime:(new Date(obj.startTime.replace(/-/g,'/')).getTime())/1000,
      stopTime:obj.sellingWay==0?0:(new Date(obj.endTime.replace(/-/g,'/')).getTime())/1000,
      shippingMothed:obj.modeOfDespatch,
      logisticsIndex:obj.logisticsIndex,
      shipping: obj.modeOfDespatch==0?obj.shipping:'',  //自行发货
      shippingPriceStatus:obj.modeOfDespatch==0?obj.shippingPriceStatus==0?0:2:'',  //自行发货
      mcShippingName:obj.modeOfDespatch==1?obj.shipping:'',  //美拆代发
      mcShippingType:obj.modeOfDespatch==1?obj.shippingPriceStatus:'',  //美拆代发
      mcShippingPrice:obj.modeOfDespatch==1?obj.shippingPriceStatus==0?3:8:'',  //美拆代发
      limitBuy:obj.purchaseLimitation==0?obj.purchaseLimitationNum:0,
      goodsDescStr: obj.goodsDescribe,
      integral:obj.integrate,
      arrGoodsDescImg:obj.goodsDetailsPic,
      illustrated_id:obj.fieldGuideId || '',
      stock:obj.goodsStock,
      isShowStock:obj.isGoodsStock==0?1:0,
      isShowSellNumber:obj.isSoldNum==0?1:0,
      isCanShare:obj.isCanShare==0?1:0,
    }
    // obj.goodsDescribe.split('\n').join('</p><p>');
    console.log(data)
    // return false;
    clearTimeout(this.data.timer);
      this.data.timer=setTimeout(()=>{
      api.settledGoodsSetGoods(data).then((res) => {
        console.log(res)
        if(res.data.status_code == 200){
          if(this.data.id && this.data.id!=0){
            app.showToastC('修改成功',1500);
          }else{
            app.showToastC('发布成功',1500);
          }
          setTimeout(function(){
            that.navigateBack();
            let pages = getCurrentPages();    //获取当前页面信息栈
            let prevPage = pages[pages.length-2];
            prevPage.getData();
          },1500)
        }else{
          if(res.data && res.data.message){
            app.showModalC(res.data.message); 
          };        
        }
      }).catch((err)=>{
        console.log(err)
      })
    },500)
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
    // this.getListData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  navigateBack(e){
    let num = e?e.currentTarget.dataset.num:false;
    wx.navigateBack({
      delta: num?num:1
    })  
  },
  comjumpwxnav(e){
    let type = e.currentTarget.dataset.type;
    let whref = e.currentTarget.dataset.whref;
    app.comjumpwxnav(type,whref)
  },
})
