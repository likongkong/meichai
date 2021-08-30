var Dec = require('../../../../common/public');//aes加密解密js
var api = require("../../../../utils/api.js");
const util = require('../../../../utils/util');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '添加直购商品',
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
        subtitle:'关联IP',
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
        isRequired:false,
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
          {id:0,name:'预售'},
          {id:1,name:'现货'},
        ],
        value:'999',
        name:'goodsLabel',
        borderbottom1:'show',
        margintop0:true,
      },{
        isRequired:false,
        type:'radio',
        subtitle:'是否限购',
        radioArr:['是','否'],
        value:0,
        direction:'X',
        explain:false,
        input:true,
        margintop0:true,
        borderbottom1:'show',
        name:'purchaseLimitation',
      },{
        isRequired:false,
        type:'text',
        subtitle:'消耗积分',
        placeholder:'无需消耗积分',
        value:'',
        name:'integrate',
        explain:true,
        borderbottom1:'show',
        margintop0:true,
      },{
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
        groupsIndex: [0, 0],
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
        name:'releaseTime',
      },
    ],
    obj:{},
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    // '已经授权'
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
      // this.getListData();
    }else{
      app.getAccessToken(this.onLoadfun)
    };
  },
  // 获取表单数据
  bindchange(e){
    let key=e.detail.name;
    this.data.obj[key]=e.detail.value;
    console.log(this.data.obj)
  },
  getListData(){
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    api.settledWithCashList(data).then((res) => {
     
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
  comjumpwxnav(e){
    let type = e.currentTarget.dataset.type;
    let whref = e.currentTarget.dataset.whref;
    app.comjumpwxnav(type,whref)
  },
})
