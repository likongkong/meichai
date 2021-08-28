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
        name:'goodsName'
      },
    ],
    listData2:[
      {
        isRequired:true,
        type:'uploadImg',
        subtitle:'企业营业执照或与IP相关凭证',
        name:'businessLicense',
        src:'',
        storagelocation:'brandinfo/voucher'
      },
    ]
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
