
var Dec = require('../../../../common/public');//aes加密解密js
var api = require("../../../../utils/api.js");
const util = require('../../../../utils/util');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '物品信息',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    kgNumber:1,  //重量信息
    pieceNumber:1,  //件
    goodsArr:[{name:'玩具',id:0},{name:'日用品',id:1},{name:'服饰',id:2}],
    selectedGoodsArrIndex:'', //选中的物品类型
    textareaInput:'',  //备注
  },

  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function (options) {
    wx.hideShareMenu();
    // '已经授权'
    console.log(options)
    this.data.loginid = app.signindata.loginid;
    this.data.uid = app.signindata.uid;
    this.data.selectedGoodsArrIndex = options.selectedGoodsArrIndex;
    this.setData({
      kgNumber:options.kgNumber,
      [`goodsArr[${options.selectedGoodsArrIndex}].active`]:true,
      textareaInput:options.textareaInput
    })
    // 判断是否登录
    if (this.data.loginid != '' && this.data.uid != '') {
      this.onLoadfun();
    } else {
      app.signin(this)
    };

  },
  onLoadfun(){
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.uid = app.signindata.uid;
    _this.setData({
      uid: app.signindata.uid,
      windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    });
    // this.getData();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {

  },
  // 重量加减
  addSubtract(e){
    let type = e.currentTarget.dataset.type;
    let kgNumber = Number(this.data.kgNumber);
    if(kgNumber<=1 && type == 1){
      app.showToastC('最小了，别点了',1500);
      return false;
    }
    this.setData({
      kgNumber:type == 0?++kgNumber:--kgNumber
    })
  },
  // 件数加减
  pieceAddSubtract(e){
    let type = e.currentTarget.dataset.type;
    let pieceNumber = Number(this.data.pieceNumber);
    if(pieceNumber<=1 && type == 1){
      app.showToastC('最小了，别点了',1500);
      return false;
    }
    this.setData({
      pieceNumber:type == 0?++pieceNumber:--pieceNumber
    })
  },
  // 重量输入
  bindKeyInput(e){
    // if(e.detail.value.length>0){
      let type = e.target.dataset.type;  //type=0 重量 type=1 件数
      let data = type==0?`kgNumber`:`pieceNumber`;
      if(e.detail.value == 0){
        this.setData({
          [data]:''
        })
      }
    // }
  },
  // 物品类型选择
  stdmode(e){
    let id = e.currentTarget.dataset.id;
    let goodsArr = this.data.goodsArr;
    for(var i=0;i<goodsArr.length;i++){
      if(goodsArr[i].id == id){
        this.setData({
          [`goodsArr[${i}].active`]:true,
          selectedGoodsArrIndex:i,
        })
      }else{
        this.setData({
          [`goodsArr[${i}].active`]:false
        })
      }
    }
    console.log(this.data.selectedGoodsArrIndex);
  },
  // TextArea输入
  bindTextAreaInput(e){
    this.setData({
      textareaInput:`${e.detail.value}`
    })
  },
  // TextArea快捷输入
  fastRemarks(e){
    let txt = e.currentTarget.dataset.txt;
    this.setData({
      textareaInput:`${this.data.textareaInput}${txt}`
    })
  },
  submitBtn(){
    let pages = getCurrentPages();    //获取当前页面信息栈
    let prevPage = pages[pages.length-2];
    prevPage.setData({
      [`goodsInfo.kgNumber`]: this.data.kgNumber==''?1:this.data.kgNumber, //重量信息
      [`goodsInfo.pieceNumber`]: this.data.pieceNumber==''?1:this.data.pieceNumber, //件数信息
      [`goodsInfo.selectedGoodsArrIndex`]: this.data.selectedGoodsArrIndex, //选中的物品类型
      [`goodsInfo.textareaInput`]: this.data.textareaInput, //备注
    })
    console.log(prevPage.data.goodsInfo)
    wx.navigateBack({
      delta: 1
    })
  }
})
