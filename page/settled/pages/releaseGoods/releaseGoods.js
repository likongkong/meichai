var Dec = require('../../../../common/public');//aes加密解密js
var api = require("../../../../utils/api.js");
const util = require('../../../../utils/util');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '添加秒杀商品',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    listData:[
      {
        isRequired:false,
        type:'actionSheet',
        groups:[],
        subtitle:'商品关联IP',
        value:'点击关联',
        name:'associationIp'
      },
      {
        isRequired:false,
        type:'title',
        subtitle:'商品信息',
        borderbottom1:'hide'
      },
    ],
    listData1:[
      {
        isRequired:true,
        type:'text',
        subtitle:'商品名称',
        placeholder:'请输入商品名称',
        value:'',
        name:'goodsName',
        borderbottom1:'show',
        margintop0:true,
      },{
        isRequired:true,
        type:'uploadImg',
        subtitle:'商品展示图（建议上传比例1:1）',
        name:'flatPatternmaking',
        src:'',
        storagelocation:'brandinfo/voucher',
        borderbottom1:'show',
        margintop0:true,
      },{
        isRequired:false,
        type:'textarea',
        subtitle:'商品文字描述',
        placeholder:'请输入商品文字描述',
        value:'',
        name:'goodsDescribe',
        borderbottom1:'show',
        margintop0:true,
      },{
        isRequired:true,
        type:'text',
        subtitle:'商品售价',
        placeholder:'请输入售价金额',
        value:'',
        name:'goodsPrice',
        borderbottom1:'show',
        margintop0:true,
      },{
        isRequired:true,
        type:'text',
        subtitle:'商品库存',
        placeholder:'请输入当前可售库存数',
        value:'',
        name:'goodsStock',
        borderbottom1:'show',
        margintop0:true,
      },{
        isRequired:false,
        type:'label',
        subtitle:'商品标签',
        labelItem:[
          {index:0,name:'预售'},
          {index:1,name:'现货'},
        ],
        index:999,
        value:0,
        name:'goodsLabel',
        borderbottom1:'show',
        margintop0:true,
      },{
        isRequired:false,
        type:'radio',
        subtitle:'是否限购',
        radioArr:['是','否'],
        value:1,
        index:0,
        direction:'X',
        explain:false,
        input:true,
        margintop0:true,
        borderbottom1:'show',
        name:'purchaseLimitation',
      },
      // {
      //   isRequired:false,
      //   type:'text',
      //   subtitle:'消耗积分',
      //   placeholder:'无需消耗积分',
      //   value:'',
      //   name:'integrate',
      //   explain:true,
      //   borderbottom1:'show',
      //   margintop0:true,
      // },
      {
        isRequired:false,
        type:'uploadImg',
        subtitle:'商品详情图',
        name:'goodsDetailsPic',
        imageList:[],
        margintop0:true,
        mode:'multiple',
        storagelocation:'brandinfo/dynamic'
      },
    ],
    listData2:[
      {
        isRequired:true,
        type:'picker',
        subtitle:'物流方式',
        placeholder:'请选择物流方式',
        groups: [
          ['顺丰', '韵达', '圆通', '申通', '中通', 'EMS', '宅急送', '京东', '天天', '优速', '极兔', '百世', '德邦', '其他'], 
          ['到付', '包邮']
        ],
        groupsIndex:'',
        value:'',
        name:'logistics',
        borderbottom1:'show',
        margintop0:true,
      },{
        isRequired:true,
        type:'text',
        subtitle:'预计发货日期',
        placeholder:'请输入预计发货日期',
        value:'',
        name:'dateToPull',
        borderbottom1:'show',
        margintop0:true,
      },{
        isRequired:false,
        type:'radio',
        subtitle:'是否显示库存数量',
        radioArr:['是','否'],
        value:0,
        index:0,
        direction:'X',
        margintop0:true,
        borderbottom1:'show',
        name:'isGoodsStock',
      },{
        isRequired:false,
        type:'radio',
        subtitle:'是否显示已售数量',
        radioArr:['是','否'],
        value:0,
        index:0,
        direction:'X',
        margintop0:true,
        borderbottom1:'show',
        name:'isSoldNum',
      },{
        isRequired:true,
        type:'time',
        subtitle:'发售时间',
        value:0,
        margintop0:true,
        borderbottom1:'show',
        time: util.format("yyyy-MM-dd HH:mm"),
        name:'startTime',
      },{
        isRequired:true,
        type:'time',
        subtitle:'停售时间',
        value:0,
        margintop0:true,
        time: util.format("yyyy-MM-dd HH:mm",2592000000),
        name:'endTime',
      },
    ],
    listData3:[
      {
        isRequired:false,
        type:'radio',
        subtitle:'允许购买对象',
        radioArr:['所有人可购买','指定群成员购买'],
        value:0,
        index:0,
        direction:'Y',
        margintop0:true,
        explain:true,
        explainTxt:'所有人可购买：所有人可分享并且购买。\n指定群成员购买：只有管理员可分享，并且用户只可以通过分享链接购买',
        name:'isCanShare',
      }
    ],
    obj:{
      goodsDescribe:'', //文字描述
      goodsStock:'', //库存数
      goodsLabel:'', //标签
      purchaseLimitation:0, //是否限购
      purchaseLimitationNum:1, //限购体数
      goodsDetailsPic:'', //详情图
      shipping:'',  //快递公司名称
      shippingPriceStatus:'', //邮费类型
      logisticsIndex:'', //物流下标
      isGoodsStock:'', //是否显示库存数
      isSoldNum:'', //是否显示已售数量
      startTime:util.format("yyyy-MM-dd HH:mm"),
      endTime:util.format("yyyy-MM-dd HH:mm",2592000000),
      isCanShare:'', //允许购买对象
    },
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
    let key=e.detail.name;
    if(key == 'startTime'){
      let startTime = (new Date(e.detail.value).getTime())/1000;
      let endTime = (new Date(this.data.obj.endTime).getTime())/1000;
      console.log(startTime,endTime)
      if(startTime<endTime){
        this.setData({
          [`listData2[4].time`]:e.detail.value
        })
        this.data.obj[key]=e.detail.value;
      }else{
        app.showToastC('发售时间不可大于停售时间',1500);
      }
    }else if(key == 'endTime'){
      let endTime = (new Date(e.detail.value).getTime())/1000;
      let startTime = (new Date(this.data.obj.startTime).getTime())/1000;
      console.log(startTime,endTime)
      if(endTime>startTime){
        this.setData({
          [`listData2[5].time`]:e.detail.value
        })
        this.data.obj[key]=e.detail.value;
      }else{
        app.showToastC('停售时间不可小于发售时间',1500);
      }
    }else{
      this.data.obj[key]=e.detail.value;
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
        }else{
          wx.hideLoading()
          wx.stopPullDownRefresh();
          console.log(this.data.listData[0])
          this.setData({
            [`listData[0].value`]:res.data.data.List.brand[0].brandName
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
        that.setData({
          [`listData[${index}].value`]:groups[res.tapIndex].brandName
        })
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
          [`listData1[1].src`]:info.goodsThumb,
          [`listData1[2].value`]:info.goodsDescStr,
          [`listData1[3].value`]:info.goodsPrice,
          [`listData1[4].value`]:info.stock,
          [`listData1[5].index`]:info.deliverTimeStatus===''?999:info.deliverTimeStatus==1?0:1,
          [`listData1[6].index`]:info.limitBuy==0?1:0,
          [`listData1[6].value`]:info.limitBuy,
          [`listData1[7].imageList`]:info.arrGoodsDescImg,
          [`listData2[0].groupsIndex`]:info.logisticsIndex,
          [`listData2[1].value`]:info.deliverTime,
          [`listData2[2].index`]:info.isShowStock==0?1:0,
          [`listData2[3].index`]:info.isShowSellNumber==0?1:0,
          [`listData2[4].time`]:util.format1("yyyy-MM-dd HH:mm",info.startTime),
          [`listData2[5].time`]:util.format1("yyyy-MM-dd HH:mm",info.stopTime),
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
        obj.goodsDetailsPic = info.arrGoodsDescImg;
        obj.logisticsIndex = info.logisticsIndex,
        obj.shipping = info.shipping;
        obj.shippingPriceStatus = info.shippingPriceStatus==0?0:1;
        obj.dateToPull = info.deliverTime;
        obj.isGoodsStock = info.isShowStock==0?1:0;
        obj.isSoldNum = info.isShowSellNumber==0?1:0;
        obj.startTime = util.format1("yyyy-MM-dd HH:mm",info.startTime);
        obj.endTime = util.format1("yyyy-MM-dd HH:mm",info.stopTime);
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
    }
    if(!obj.goodsStock || obj.goodsStock == ''){
      this.selectComponent('#settledForm1').scrollto('goodsStock');
      app.showToastC('请输入当前可售库存数',1500);
      return false;
    }
    if(!obj.shipping || obj.shipping == ''){
      this.selectComponent('#settledForm2').scrollto('shipping');
      app.showToastC('请选择物流方式',1500);
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


    let data = {
      goodsId:this.data.id&&this.data.id!=0?this.data.id:'',
      brandId:obj.associationIp,
      goodsName:obj.goodsName,
      goodsThumb:obj.flatPatternmaking,
      goodsPrice:obj.goodsPrice,
      deliverTimeStatus:obj.goodsLabel===''?'':obj.goodsLabel==0?1:0,
      deliverTime:obj.dateToPull,
      startTime:(new Date(obj.startTime).getTime())/1000,
      stopTime:(new Date(obj.endTime).getTime())/1000,
      logisticsIndex:obj.logisticsIndex,
      shipping:obj.shipping,
      shippingPriceStatus:obj.shippingPriceStatus==0?0:2,
      limitBuy:obj.purchaseLimitation==0?obj.purchaseLimitationNum:0,
      goodsDescStr:obj.goodsDescribe,
      arrGoodsDescImg:obj.goodsDetailsPic,
      stock:obj.goodsStock,
      isShowStock:obj.isGoodsStock==0?1:0,
      isShowSellNumber:obj.isSoldNum==0?1:0,
      isCanShare:obj.isCanShare==0?1:0,
    }
    console.log(data)
    // return false;
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
