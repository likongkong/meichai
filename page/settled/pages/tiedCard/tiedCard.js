var Dec = require('../../../../common/public');//aes加密解密js
var api = require("../../../../utils/api.js");
const util = require('../../../../utils/util');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '绑定银行卡',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    enterpriseData:[{
        isRequired:true,
        type:'text',
        subtitle:'开户姓名',
        placeholder:'请输入开户姓名',
        value:'',
        borderbottom1:'show',
        name:'name'
      },{
        isRequired:true,
        type:'text',
        subtitle:'银行卡号',
        placeholder:'请输入银行卡号',
        value:'',
        borderbottom1:'show',
        name:'cardnumber'
      },{
        isRequired:true,
        type:'link',
        subtitle:'开户银行',
        placeholder:'请选择开户银行',
        item_type:9053,
        value:'',
        margintop0:true,
        borderbottom1:'show',
        name:'bankdeposit'
      },{
        isRequired:true,
        type:'multiseriatePicker',
        subtitle:'开户银行所在地',
        placeholder:'请选择开户银行所在地',
        groups: [[], []],
        groupsIndex:'',
        value:'',
        margintop0:true,
        borderbottom1:'show',
        name:'cardnumber'
      },{
        isRequired:true,
        type:'link',
        subtitle:'开户支行',
        placeholder:'请选择开户支行',
        value:'',
        margintop0:true,
        borderbottom1:'show',
        name:'bankSubBranch'
      },{
        isRequired:true,
        type:'text',
        subtitle:'手机号',
        placeholder:'请输入银行预留手机号',
        value:'',
        margintop0:true,
        borderbottom1:'show',
        name:'phoneNum'
      },{
        isRequired:true,
        type:'phoneCode',
        subtitle:'验证码',
        placeholder:'请输入验证码',
        value:'',
        margintop0:true,
        borderbottom1:'show',
        name:'phoneCode'
      }
    ],
    obj:{},
    num:1,  //进度
    brandInfo:{}, //品牌信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.uid = app.signindata.uid;
    this.data.loginid = app.signindata.loginid;
    console.log(options)
    this.data.from = options.from;
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
    this.getProvince();
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
  onShareAppMessage: function () {
    
  },
  //返回n页
  navigateBack(e){
    let num = e.currentTarget.dataset.num;
    app.navigateBack(num)
  },
  comjumpwxnav(e){
    let type = e.currentTarget.dataset.type;
    let num = e.currentTarget.dataset.num;
    app.comjumpwxnav(type,num)
  },
  // 获取表单数据
  bindchange(e){
    let key=e.detail.name;
    this.data.obj[key]=e.detail.value;
    console.log(this.data.obj)
  },
  pickerchange(e){
    let index = e.detail.index;
    let provinceCodeIndex = e.detail.value[0];
    let cityCodeIndex = e.detail.value[1];
    this.data.obj.provinceCode = this.data.enterpriseData[index].groups[0][provinceCodeIndex].provinceCode;
    this.data.obj.cityCode = this.data.enterpriseData[index].groups[1][cityCodeIndex].cityCode;
    console.log(this.data.obj)
  },
  columnchange(e){
    console.log(e.detail.column)
    console.log(e.detail.value)
    this.data.obj.provinceCode = this.data.enterpriseData[3].groups[0][e.detail.value].provinceCode;
    console.log(this.data.obj.provinceCode)
    if(e.detail.column == 0){
      this.getCity();
    }
  },
  // 获取验证码
  getPhoneCode(){
    console.log(11)
  },
  //获取省份列表
  getProvince(){
    var _this = this;
     console.log('mod=account&operation=listProvince')
     var qqq = Dec.Aese('mod=account&operation=listProvince');
     wx.showLoading({
       title: '加载中...',
       mask:true
     })
     wx.request({
       url: app.signindata.comurl + 'pingan.php' + qqq,
       method: 'GET',
       header: {'Accept': 'application/json'},
       success: function (res) {
         wx.hideLoading()
         console.log('省份列表=====',res)
         if (res.data.ReturnCode == 200) {
          for(var i=0;i<res.data.List.province.length;i++){
            res.data.List.province[i].name = res.data.List.province[i].provinceName;
          }
          _this.setData({
            [`enterpriseData[3].groups[0]`]:res.data.List.province
          });
          // _this.getCity();
          console.log(_this.data.enterpriseData[3].groups[0])
         }else{
           app.showToastC(res.data.Msg)  
         };
       }
     });
  },
  //获取市列表
  getCity(){
    var _this = this;
    console.log('mod=account&operation=listCity?bankCode='+_this.data.obj.bankdeposit+'&provinceCode='+_this.data.loginid);
    var qqq = Dec.Aese('mod=account&operation=listCity&bankCode=102&provinceCode='+_this.data.obj.provinceCode);
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    wx.request({
      url: app.signindata.comurl + 'pingan.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading()
        console.log('市列表=====',res)
        if (res.data.ReturnCode == 200) {
          for(var i=0;i<res.data.List.city.length;i++){
            res.data.List.city[i].name = res.data.List.city[i].cityName;
          }
          var ind = 1;
          var enterpriseData = _this.data.enterpriseData
          enterpriseData[3].groups[1] = res.data.List.city
          _this.setData({
            enterpriseData
          });
          // console.log(_this.data.enterpriseData[3].groups[1])
        }else{
          app.showToastC(res.data.Msg)
        };
      }
    });
  },
  //提交审核
  submitAudit(){
    let obj = this.data.obj;
    let phoneNum = /^1[3456789]\d{9}$/;

    if(!obj.name || obj.name == ''){
      this.selectComponent('#settledForm').scrollto('name');
      app.showToastC('请输入开户姓名',1500);
      return false;
    }
    if(!obj.cardnumber || obj.cardnumber == ''){
      this.selectComponent('#settledForm').scrollto('cardnumber');
      app.showToastC('请输入银行卡号',1500);
      return false;
    }
    if(!obj.bankdeposit || obj.bankdeposit == ''){
      this.selectComponent('#settledForm').scrollto('bankdeposit');
      app.showToastC('请输入开户银行',1500);
      return false;
    }
    if(!obj.bankSubBranch || obj.bankSubBranch == ''){
      this.selectComponent('#settledForm').scrollto('bankSubBranch');
      app.showToastC('请输入开户支行',1500);
      return false;
    }

    let data={
      account:obj.name,
      account_name:obj.cardnumber,
      bank_name:obj.bankdeposit,
      account_branch:obj.bankSubBranch,
    }
    api.addAccountNumber(data).then((res) => {
      console.log(res)
      app.showToastC('绑定成功',1500);
      setTimeout(()=>{
        let pages = getCurrentPages();    //获取当前页面信息栈
        let prevPage = pages[pages.length-2];
        // if(this.data.from == "account"){
          prevPage.getbankCardList();
          prevPage.getAccountNumberList();
        // }else{
        //   prevPage.getbankCardList();
        // }
        app.navigateBack(1)
      },1500)
    }).catch((err)=>{
      console.log(err)
    })
  }
})
