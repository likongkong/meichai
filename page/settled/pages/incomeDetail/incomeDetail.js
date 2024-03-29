var Dec = require('../../../../common/public');//aes加密解密js
var api = require("../../../../utils/api.js");
const util = require('../../../../utils/util');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '余额明细',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    orderData:[],
    date:'',
    transactionType:0,
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
        id: 2,
        name: '订单退款'
      },
      {
        id: 3,
        name: '提现'
      }
    ],
    orderType:0,
    orderTypeArray: [
      {
        id: 0,
        name: '全部订单类型'
      },
      {
        id: 1,
        name: '入驻订单'
      },
      {
        id: 2,
        name: '展会订单'
      }
    ],
    limitprame:1,  //当前页码
    perPage:10,  //每页多少条
    year:'',  //年
    month:'',   //月
    status_type:'',  //交易类型
    order_type:0,  //订单类型
    loadprompt:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.data.uid = app.signindata.uid;
    this.data.loginid = app.signindata.loginid;
    // 判断是否登录
    if (this.data.loginid != '' && this.data.uid != '') {
      this.onLoadfun();
    } else {
      app.signin(this)
    }
  },
  onLoadfun(){
    this.data.loginid = app.signindata.loginid;
    this.data.uid = app.signindata.uid;
    if(wx.getStorageSync('access_token')){
      this.getListData();
    }else{
      app.getAccessToken(this.onLoadfun)
    };
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
      searchType:2,
      walletType:this.data.order_type
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
        app.showToastC('暂无数据',1500);
      }else if(this.data.limitprame!=1 && list.length == 0){
        this.setData({
          loadprompt:true
        })
        app.showToastC('暂无更多数据了',1500);
      }else{
        this.setData({
          noData:false,
        })
        if(this.data.orderData.length == 0){
          this.setData({
            orderData: res.data.data.list 
          });
        }else{
          this.setData({
            orderData: this.dataprocessing(this.data.orderData,res.data.data.list)
          });
        };
      }
    }).catch((err)=>{
      console.log(err)
    })
  },

    // 数据处理
    dataprocessing: function (arrlist,newArr){
      var arrlist = arrlist || [];
      var newArr = newArr || [];
      for (var q = 0; q < arrlist.length; q++) {
        for (var w = 0; w < newArr.length; w++) {
          if (arrlist[q].date == newArr[w].date) {
            arrlist[q].mouthList = [...arrlist[q].mouthList,...newArr[w].mouthList];
            newArr[w].mouthList = [...arrlist[q].mouthList,...newArr[w].mouthList]
          };
        };
      };
      var dataList = [...arrlist,...newArr];
      // 去重
      var charr = this.distinct(dataList);
      return charr;
    },
    //  数组去重
    distinct:function(arr){
      var arr = arr,i,j,len = arr.length;
      for(i = 0; i < len; i++){
          for(j = i + 1; j < len; j++){
            if (arr[i].date == arr[j].date){
                arr.splice(j,1);
                len--;
                j--;
            }
          }
      }
      return arr;
    },

  reset(){
    this.setData({limitprame:1,orderData:[],loadprompt:false})
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
  // 订单类型选择
  bindOrderPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value,this.data.orderTypeArray[e.detail.value].id)
    this.setData({
      orderType: e.detail.value,
      order_type:this.data.orderTypeArray[e.detail.value].id
    })
    this.reset();
    this.getListData();
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
    if(!this.data.loadprompt){
      this.data.limitprame = ++this.data.limitprame;
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
  //返回n页
  navigateBack(e){
    let num = e.currentTarget.dataset.num;
    app.navigateBack(num)
  },
  comjumpwxnav(e){
    let type = e.currentTarget.dataset.type;
    let whref = e.currentTarget.dataset.whref;
    app.comjumpwxnav(type,whref)
  },
  // 获取表单数据
  bindchange(e){
    let key=e.detail.name;
    this.data.obj[key]=e.detail.value;
    console.log(this.data.obj)
  },
  //获取品牌信息
  getBrandInfo(){
    this.data.obj = {
      enterpriseName:this.data.info.firm_name,
      enterpriseContact:this.data.info.firm_linkman,
      enterprisePhone:this.data.info.firm_tel,
      wechatID:this.data.info.wechat_number,
      businessLicense:this.data.info.certificate_img,
    };
    this.setData({
      [`enterpriseData[0].value`]:this.data.info.firm_name,
      [`enterpriseData[1].value`]:this.data.info.firm_linkman,
      [`enterpriseData[2].value`]:util.plusXing(this.data.info.firm_tel,3,4),
      [`enterpriseData[3].value`]:this.data.info.wechat_number,
      [`enterpriseData[4].src`]:this.data.info.certificate_img,
    })
  },
  //提交审核
  submitAudit(){
    let obj = this.data.obj;
    let phoneNum = /^1[3456789]\d{9}$/;

    if(!obj.enterpriseName || obj.enterpriseName == ''){
      this.selectComponent('#settledForm').scrollto('enterpriseName');
      app.showToastC('请输入企业名称',1500);
      return false;
    }
    if(!obj.enterpriseContact || obj.enterpriseContact == ''){
      this.selectComponent('#settledForm').scrollto('enterpriseContact');
      app.showToastC('请输入企业联系人',1500);
      return false;
    }
    if(!obj.enterprisePhone || obj.enterprisePhone == ''){
      this.selectComponent('#settledForm').scrollto('enterprisePhone');
      app.showToastC('请输入手机号',1500);
      return false;
    }else if(!phoneNum.test(obj.enterprisePhone)){
      this.selectComponent('#settledForm').scrollto('enterprisePhone');
      app.showToastC('手机号有误请重新填写',2000);
      return false;
    }
    if(!obj.wechatID || obj.wechatID == ''){
      this.selectComponent('#settledForm').scrollto('wechatID');
      app.showToastC('请输入微信号',1500);
      return false;
    }
    if(!obj.businessLicense || obj.businessLicense == ''){
      this.selectComponent('#settledForm').scrollto('businessLicense');
      app.showToastC('请上传企业营业执照或与IP相关凭证',1500);
      return false;
    }
    
    console.log(obj.businessLicense)
    let data = `mod=community&operation=certificationSet&uid=${this.data.uid}&loginid=${this.data.loginid}&firm_name=${obj.enterpriseName}&firm_linkman=${obj.enterpriseContact}&firm_tel=${obj.enterprisePhone}&wechat_number=${obj.wechatID}&certificate_img=${obj.businessLicense}`
    var q = Dec.Aese(data);
    console.log(`${Dec.comurl()}?${data}`)
    wx.request({
      url: Dec.comurl() + 'toy.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) { 
        console.log('提交审核====',res)
        wx.hideLoading()
        if(res.data.ReturnCode == 200){
          app.showToastC('修改成功',1500);
          setTimeout(function(){
            let pages = getCurrentPages();
            let prevPage = pages[pages.length -2];//上一页
            prevPage.getData();
            wx.navigateBack({
              delta: 1
            })
          },1500)
        }else{
          app.showToastC(res.data.Msg,2000);
        }
      },
      fail: function () {},
      complete:function(){
      }
    });
  }
})
