
var Dec = require('../../../../common/public');//aes加密解密js
var tcity = require("../../../../common/citys.js");
var api = require("../../../../utils/api.js");
const util = require('../../../../utils/util');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '我的钱包',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    endTime:util.format("yyyy-MM-dd"),
    animationData:{},
    popHeight:620,
    accountList:[],  //账号列表
    accountNum:0,
    isDescriptionMask:false,  //说明弹框
    isAuthenticationMask:false,  //提现认证弹框
    date:'',
    transactionType:0,
    orderData:[],  //列表数据
    noData:false,
    transactionTypeArray: [
      {
        id: '',
        name: '全部交易类型'
      },
      {
        id: 1,
        name: '订单收入'
      },
      {
        id: 3,
        name: '订单退款'
      },
      {
        id: 2,
        name: '提现'
      }
    ],
    limitprame:1,  //当前页码
    perPage:20,  //每页多少条
    year:'',  //年
    month:'',   //月
    status_type:'',  //交易类型
    loadprompt:false,
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
      this.getListData();
      this.getLumpsumAndWithdraw();
      this.getAccountNumberList();
    }else{
      app.getAccessToken(this.onLoadfun)
    };
  },
  reset(){
    this.setData({limitprame:1,orderData:[],loadprompt:false})
  },
  // 获取钱包余额、提现判断
  getLumpsumAndWithdraw(){
    api.getLumpsumAndWithdraw({}).then((res) => {
      console.log('iofo',res)
      this.setData({
        info:res.data.data
      })
    }).catch((err)=>{
      console.log(err)
    })
  },
  //获取账号列表
  getAccountNumberList(){
    api.getAccountNumberList({}).then((res) => {
      console.log('账号列表',res)
      let list = res.data.data.list;
      let withdrawAccount;
      for(var i=0;i<res.data.data.list.length;i++){
        if(list[i].isdefault == 1){
          withdrawAccount = list[i];
          break;
        }
      }
      this.setData({
        accountList:list,
        currentAccount:withdrawAccount,
        withdrawAccount,
        explanation:res.data.data.explanation
      })
    }).catch((err)=>{
      console.log(err)
    })
  },
  getListData(){
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    let data = {
      limitprame:this.data.limitprame,
      perPage:this.data.perPage,
      status_type:this.data.status_type,
      year:this.data.year,
      month:this.data.month,
    }
    api.settledWithCashList(data).then((res) => {
      console.log('订单数据',res)
      wx.hideLoading();
      wx.stopPullDownRefresh();
      let list = res.data.data.list;
      if(this.data.limitprame==1 && list.length == 0){
        this.setData({
          noData:true
        })
      }else if(this.data.limitprame!=1 && list.length == 0){
        this.setData({
          loadprompt:true
        })
        app.showToastC('暂无更多数据了',1500);
      }else{
        this.setData({
          noData:false,
          orderData:[...this.data.orderData,...res.data.data.list]
        })
      }
    }).catch((err)=>{
      console.log(err)
    })
  },
  // 提现判断
  bideWithdraw(){
    let currentAccount = this.data.currentAccount;
    if(currentAccount){
      if(currentAccount.account_type == 1){
        this.setData({
          merchantNo: util.plusXing(currentAccount.account,2,2)
        })
        this.toggleAuthenticationMask();
      }else if(currentAccount.account_type == 2){
        this.executionApplicationWithdrawal();
      }
    }else{
      this.clickme();
    }
  },
  // 提现
  executionApplicationWithdrawal(){
    api.executionApplicationWithdrawal({}).then((res) => {
      console.log(res)
      //今日已申请过提现
      if(res.data.status_code == 200304){
        wx.showModal({
          title: '',
          content: '今日已申请过提现，注意每天仅可申请一次提现，请明天再来提现吧',
          showCancel:false,
          confirmText:'关闭',
          confirmColor:'#02BB00',
          success (res) {
            if (res.confirm) {
              
            }
          }
        })
      }else if(res.data.status_code == 200306){
        wx.showModal({
          title: '',
          content: '钱包余额不足，最低提现￥1.00',
          showCancel:false,
          confirmText:'关闭',
          confirmColor:'#02BB00',
          success (res) {
            if (res.confirm) {
              
            }
          }
        })
      }else{
        app.showToastC(res.data.data,1500);
        setTimeout(()=>{
          this.reset();
          this.getLumpsumAndWithdraw();
          this.getListData();
        },1500)
      }
      this.setData({
        isAuthenticationMask:false
      })
    }).catch((err)=>{
      console.log(err)
    })
  },
  // 设置账号
  submitAudit(){
    let withdrawAccount = this.data.withdrawAccount;
    let id = withdrawAccount.id;
    let account_type = withdrawAccount.account_type;
    let data={
      account:withdrawAccount.account,
      account_type
    }
    api.setDefaultAccount(id,data).then((res) => {
      console.log(res)
      app.showToastC(this.data.currentAccount?'修改成功':'设置成功',1500);
      setTimeout(()=>{
        this.setData({
          currentAccount:withdrawAccount,
        })
        this.hideModal()
      },1500)
    }).catch((err)=>{
      console.log(err)
    })
  },
  // 商户号输入
  bindKeyInput(e){
    // console.log(e.detail.value)
    this.setData({
      [`withdrawAccount.account`]:e.detail.value
    })
  },
  // 日期选择
  bindDateChange(e) {
    console.log(e.detail.value.split('-'))
    let value = e.detail.value.split('-');
    this.setData({
      date: e.detail.value,
      year:value[0],
      month:value[1],
    })
    this.reset();
    this.getListData();
  },
  // 类型选择
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value,this.data.transactionTypeArray[e.detail.value].id)
    this.setData({
      transactionType: e.detail.value,
      status_type:this.data.transactionTypeArray[e.detail.value].id
    })
    this.reset();
    this.getListData();
  },
  //说明弹框显示隐藏
  toggleDescriptionMask(e){
    // console.log(e.currentTarget.dataset.type)
    let type = e.currentTarget.dataset.type;
    let explanation = this.data.explanation;
    // explanation
    this.setData({
      clickType:type,
      isDescriptionMask:!this.data.isDescriptionMask,
      explain:type==1?explanation.merchant:explanation.personal
    })
  },
  //认证弹框显示隐藏
  toggleAuthenticationMask(){
    this.setData({
      isAuthenticationMask:!this.data.isAuthenticationMask
    })
  },
  confirmWithdrawal(){
    this.executionApplicationWithdrawal();
  },
  //切换收款账号
  chooseAccount(e){
    let ind = e.currentTarget.dataset.ind;
    for(var i=0;i<this.data.accountList.length;i++){
      this.setData({[`accountList[${i}].isdefault`]:false})
    }
    this.setData({
      accountNum:ind,
      [`accountList[${ind}].isdefault`]:true,
      withdrawAccount:this.data.accountList[ind]
    })
  },
  //点击我显示底部弹出框
  clickme:function(){
    this.showModal();
  },
  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(this.data.popHeight).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(this.data.popHeight).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
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
    this.reset();
    this.getListData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.loadprompt == false){
      this.setData({limitprame:++this.data.limitprame})
      this.getListData();
    }else{
      app.showToastC('暂无更多数据了',1500);
    }
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
