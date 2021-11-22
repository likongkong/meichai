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
        subtitle:'开户人身份证号码',
        placeholder:'请输入开户人身份证号码',
        value:'',
        borderbottom1:'show',
        name:'idCard'
      },{
        isRequired:true,
        type:'text',
        subtitle:'银行卡号',
        placeholder:'请输入银行卡号',
        value:'',
        borderbottom1:'show',
        name:'cardnumber'
      }
    ],
    enterpriseData1:[{
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
        groupsIndex:[],
        value:'',
        isClick:true,
        clickTip:'请选择开户银行',
        margintop0:true,
        borderbottom1:'show',
        name:'bankdepositLocation'
      },{
        isRequired:true,
        type:'link',
        subtitle:'开户支行',
        placeholder:'请选择开户支行',
        item_type:9053,
        query:'',
        value:'',
        isClick:true,
        clickTip:'请选择开户银行所在地',
        margintop0:true,
        borderbottom1:'show',
        name:'bankSubBranch'
      }],
      enterpriseData2:[{
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

    individualBusiness:[{
        type:'title',
        subtitle:'公司信息',
        backgroundColor:'#f4f5f9'
      },{
        isRequired:true,
        type:'text',
        subtitle:'公司名称',
        placeholder:'请输入公司名称',
        value:'',
        borderbottom1:'show',
        name:'companyName'
      },{
        isRequired:true,
        type:'text',
        subtitle:'公司证件号码',
        placeholder:'请输入社会统一信用代码',
        value:'',
        borderbottom1:'show',
        name:'companyIdCard'
      },{
        type:'title',
        subtitle:'银行卡信息（需要填写法人绑定的银行卡）',
        backgroundColor:'#f4f5f9'
      }
    ],
    enterpriseBusiness:[{
        type:'title',
        subtitle:'企业信息',
        backgroundColor:'#f4f5f9'
      },{
        isRequired:true,
        type:'text',
        subtitle:'企业名称',
        placeholder:'请输入企业名称',
        value:'',
        borderbottom1:'show',
        name:'companyName'
      },{
        isRequired:true,
        type:'text',
        subtitle:'企业证件号码',
        placeholder:'请输入社会统一信用代码',
        value:'',
        borderbottom1:'show',
        name:'companyIdCard'
      },{
        isRequired:true,
        type:'text',
        subtitle:'法人姓名',
        placeholder:'请输入法人姓名',
        value:'',
        borderbottom1:'show',
        name:'legalPersonName'
      },{
        isRequired:true,
        type:'text',
        subtitle:'法人身份证号',
        placeholder:'请输入法人身份证号',
        value:'',
        borderbottom1:'show',
        name:'legalPersonIdCard'
      },{
        isRequired:true,
        type:'text',
        subtitle:'企业联系电话',
        placeholder:'请输入企业联系电话',
        value:'',
        borderbottom1:'show',
        name:'companyPhone'
      },{
        type:'title',
        subtitle:'企业账户信息（需要填写法人绑定的银行卡）',
        backgroundColor:'#f4f5f9'
      },{
        isRequired:true,
        type:'text',
        subtitle:'对公账户',
        placeholder:'请输入对公账户',
        value:'',
        borderbottom1:'show',
        name:'corporateAccount'
      },
    ],
    obj:{},
    num:1,  //进度
    brandInfo:{}, //品牌信息
    type:'',
    isUnbindAndBindMask:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options==',options)
    this.data.uid = app.signindata.uid;
    this.data.loginid = app.signindata.loginid;
    this.data.from = options.from;
    this.setData({
      type: options.type || 1,
      accountId: options.accountId || '',
      fromVerify: options.fromVerify || false,
    })
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
    if(this.data.fromVerify){
      this.getDetailForCard();
    }
    // this.getProvince();
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
    let provincename = this.data.enterpriseData1[index].groups[0][provinceCodeIndex].name;
    let cityename = this.data.enterpriseData1[index].groups[1][cityCodeIndex].name;
    this.data.obj.provincename = provincename;
    this.data.obj.cityename = cityename;
    this.data.obj.provinceCode = this.data.enterpriseData1[index].groups[0][provinceCodeIndex].provinceCode;
    this.data.obj.cityCode = this.data.enterpriseData1[index].groups[1][cityCodeIndex].cityCode;
    this.data.obj.bankSubBranch='';
    this.setData({
      [`enterpriseData1[1].groupsIndex`]:e.detail.value,
      [`enterpriseData1[1].value`]:`${provincename}-${cityename}`,
      [`enterpriseData1[2].query`]:`bankCode=${this.data.obj.bankdeposit}&cityCode=${this.data.obj.cityCode}`,
      [`enterpriseData1[2].value`]:'',
      [`enterpriseData1[2].isClick`]:false,
    });
    
    // console.log(this.data.enterpriseData[4])

  },
  columnchange(e){
    // console.log(e.detail.column)
    // console.log(e.detail.value)
    this.data.obj.columnprovinceCode = this.data.enterpriseData1[1].groups[0][e.detail.value].provinceCode;
    this.data.obj.columnvalue = e.detail.value;
    if(e.detail.column == 0){
    console.log(this.data.obj.columnprovinceCode)
    this.getCity();
    }
  },
  // 获取验证码
  smsSend(){
    var obj = this.data.obj;
    if(this.data.type == 1){ //个人帮商户
      this.data.arr = [
        {placeholder:'请输入开户姓名',domId:'enterpriseData',name:"name",value:obj.name},
        {placeholder:'请输入开户人身份证号码',domId:'enterpriseData',name:"idCard",value:obj.idCard},
        {placeholder:'请输入银行卡号',domId:'enterpriseData',name:"cardnumber",value:obj.cardnumber},
        {placeholder:'请选择开户银行',domId:'enterpriseData1',name:"bankdeposit",value:obj.bankdeposit},
        {placeholder:'请选择开户银行所在地',domId:'enterpriseData1',name:"bankdepositLocation",value:obj.cityCode},
        {placeholder:'请选择开户支行',domId:'enterpriseData1',name:"bankSubBranch",value:obj.bankSubBranch},
        {placeholder:'请输入银行预留手机号',domId:'enterpriseData2',name:"phoneNum",value:obj.phoneNum},
      ] 
    }else if(this.data.type == 2){ //个人工商户
      this.data.arr = [ 
        {placeholder:'请输入公司名称',domId:'individualBusiness',name:"companyName",value:obj.companyName},
        {placeholder:'请输入社会统一信用代码',domId:'individualBusiness',name:"companyIdCard",value:obj.companyIdCard},
        {placeholder:'请输入开户姓名',domId:'enterpriseData',name:"name",value:obj.name},
        {placeholder:'请输入开户人身份证号码',domId:'enterpriseData',name:"idCard",value:obj.idCard},
        {placeholder:'请输入银行卡号',domId:'enterpriseData',name:"cardnumber",value:obj.cardnumber},
        {placeholder:'请选择开户银行',domId:'enterpriseData1',name:"bankdeposit",value:obj.bankdeposit},
        {placeholder:'请选择开户银行所在地',domId:'enterpriseData1',name:"bankdepositLocation",value:obj.cityCode},
        {placeholder:'请选择开户支行',domId:'enterpriseData1',name:"bankSubBranch",value:obj.bankSubBranch},
        {placeholder:'请输入银行预留手机号',domId:'enterpriseData2',name:"phoneNum",value:obj.phoneNum},
      ] 
    }
    this.bindBankCard();
  },
  // 获取绑定的银行卡详情
  getDetailForCard(){
    let _this = this;
    console.log('获取绑定的银行卡详情请求'+'mod=account&operation=getDetailForCard&uid='+this.data.uid+'&loginid='+this.data.loginid+'&accountId='+this.data.accountId)
    let qqq = Dec.Aese('mod=account&operation=getDetailForCard&uid='+this.data.uid+'&loginid='+this.data.loginid+'&accountId='+this.data.accountId);
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
        console.log('获取绑定的银行卡详情=====',res)
        if (res.data.ReturnCode == 200) {
          let account = res.data.Info.account;

          if(_this.data.type == 2){
            for(var i=0;i<_this.data.individualBusiness.length;i++){
              _this.setData({
                [`individualBusiness[${i}].num`]:2
              })
            }
            _this.setData({
              [`individualBusiness[1].value`]:account.shopName,
              [`individualBusiness[2].value`]:account.userGlobalId,
            })
            _this.data.obj.companyName = account.shopName;
            _this.data.obj.companyGlobalId = account.userGlobalId;
          }
          for(var i=0;i<_this.data.enterpriseData.length;i++){
            _this.setData({
              [`enterpriseData[${i}].num`]:2
            })
          }
          for(var i=0;i<_this.data.enterpriseData1.length;i++){
            _this.setData({
              [`enterpriseData1[${i}].num`]:2
            })
          }
          _this.setData({
            [`enterpriseData[0].value`]:account.userName,
            [`enterpriseData[1].value`]:account.userIdCard,
            [`enterpriseData[2].value`]:account.bankNumber,
            [`enterpriseData1[0].value`]:account.bankName,
            [`enterpriseData1[1].value`]:account.province+'-'+account.city,
            [`enterpriseData1[2].query`]:`bankCode=${account.bankCode}&cityCode=${account.city}`,
            [`enterpriseData1[2].value`]:account.bankLName,
            [`enterpriseData1[0].isClick`]:false,
            [`enterpriseData1[1].isClick`]:false,
            [`enterpriseData1[2].isClick`]:false,
            [`enterpriseData2[0].value`]:account.userMobile,
            [`enterpriseData2[0].num`]:2,
          })
          
          _this.data.obj.name = account.userName;
          _this.data.obj.idCard = account.userIdCard;
          _this.data.obj.cardnumber = account.bankNumber;
          _this.data.obj.bankName = account.bankName;
          _this.data.obj.bankdeposit = account.bankCode;
          _this.data.obj.provinceCode = account.province;
          _this.data.obj.cityCode = account.city;
          _this.data.obj.bankLName = account.bankLName;
          _this.data.obj.bankSubBranch = account.bankLId;
          _this.data.obj.phoneNum = account.userMobile;

          // bankLName: "中国银行股份有限公司合肥中环城支行"
          // bankName: "中国银行"
          // bankSubBranch: "31154"
          // bankdeposit: "104"
          // cardnumber: "3"
          // cityCode: "361000"
          // cityename: "合肥市"
          // columnprovinceCode: "3610"
          // idCard: "2"
          // name: "1"
          // phoneNum: "11111111111"
          // provinceCode: "3610"
          // provincename: "安徽"
          _this.getProvince();
        }else{
          app.showToastC(res.data.Msg)  
        };
      }
    });
  },
  // 绑定银行卡
  bindBankCard(){
    let _this = this;
    let qqq;
    let reg = /^1[3456789]\d{9}$/;
    var obj = this.data.obj;
    if(this.data.type == 3){ //企业商户
      this.data.arr = [ 
        {placeholder:'请输入企业名称',domId:'enterpriseBusiness',name:"companyName",value:obj.companyName},
        {placeholder:'请输入社会统一信用代码',domId:'enterpriseBusiness',name:"companyIdCard",value:obj.companyIdCard},
        {placeholder:'请输入法人姓名',domId:'enterpriseBusiness',name:"legalPersonName",value:obj.legalPersonName},
        {placeholder:'请输入法人身份证号码',domId:'enterpriseBusiness',name:"legalPersonIdCard",value:obj.legalPersonIdCard},
        {placeholder:'请输入企业联系电话',domId:'enterpriseBusiness',name:"companyPhone",value:obj.companyPhone},
        {placeholder:'请输入对公账号',domId:'enterpriseBusiness',name:"corporateAccount",value:obj.corporateAccount},
        {placeholder:'请选择开户银行',domId:'enterpriseData1',name:"bankdeposit",value:obj.bankdeposit},
        {placeholder:'请选择开户银行所在地',domId:'enterpriseData1',name:"bankdepositLocation",value:obj.cityCode},
        {placeholder:'请选择开户支行',domId:'enterpriseData1',name:"bankSubBranch",value:obj.bankSubBranch},
      ] 
    }
    let arr = this.data.arr;
    for(var i=0;i<arr.length;i++){
      if(!arr[i].value || arr[i].value == undefined){
        this.selectComponent('#'+arr[i].domId).scrollto(arr[i].name);
        app.showToastC(arr[i].placeholder,1500);
        return false;
      }
      // if(arr[i].name == 'phoneNum' && !reg.test(obj.phoneNum)){
      //   this.selectComponent('#'+arr[i].domId).scrollto(arr[i].name);
      //   app.showToastC('手机号有误请重新填写',2000);
      //   return false;
      // }
    }
    if(this.data.type != 3){ 
      this.selectComponent('#enterpriseData2').countDown();
    }
    if(this.data.type == 1){
      console.log('1绑定银行卡请求'+'mod=account&operation=bindCard&uid='+this.data.uid+'&loginid='+this.data.loginid+'&type='+this.data.type+'&userName='+this.data.obj.name+'&userIdcard='+this.data.obj.idCard+'&userMobile='+this.data.obj.phoneNum+'&bankNumber='+this.data.obj.cardnumber+'&bankCode='+this.data.obj.bankdeposit+'&bankName='+this.data.obj.bankName+'&province='+this.data.obj.provincename+'&city='+this.data.obj.cityename+'&bankLId='+this.data.obj.bankSubBranch+'&bankLName='+this.data.obj.bankLName)
      qqq = Dec.Aese('mod=account&operation=bindCard&uid='+this.data.uid+'&loginid='+this.data.loginid+'&type='+this.data.type+'&userName='+this.data.obj.name+'&userIdcard='+this.data.obj.idCard+'&userMobile='+this.data.obj.phoneNum+'&bankNumber='+this.data.obj.cardnumber+'&bankCode='+this.data.obj.bankdeposit+'&bankName='+this.data.obj.bankName+'&province='+this.data.obj.provincename+'&city='+this.data.obj.cityename+'&bankLId='+this.data.obj.bankSubBranch+'&bankLName='+this.data.obj.bankLName);
    } else if(this.data.type == 2){
      console.log('2绑定银行卡请求'+'mod=account&operation=bindCard&uid='+this.data.uid+'&loginid='+this.data.loginid+'&type='+this.data.type+'&companyName='+this.data.obj.companyName+'&companyGlobalId='+this.data.obj.companyIdCard+'&userName='+this.data.obj.name+'&userIdcard='+this.data.obj.idCard+'&userMobile='+this.data.obj.phoneNum+'&bankNumber='+this.data.obj.cardnumber+'&bankCode='+this.data.obj.bankdeposit+'&bankName='+this.data.obj.bankName+'&province='+this.data.obj.provincename+'&city='+this.data.obj.cityename+'&bankLId='+this.data.obj.bankSubBranch+'&bankLName='+this.data.obj.bankLName)
      qqq = Dec.Aese('mod=account&operation=bindCard&uid='+this.data.uid+'&loginid='+this.data.loginid+'&type='+this.data.type+'&companyName='+this.data.obj.companyName+'&companyGlobalId='+this.data.obj.companyIdCard+'&userName='+this.data.obj.name+'&userIdcard='+this.data.obj.idCard+'&userMobile='+this.data.obj.phoneNum+'&bankNumber='+this.data.obj.cardnumber+'&bankCode='+this.data.obj.bankdeposit+'&bankName='+this.data.obj.bankName+'&province='+this.data.obj.provincename+'&city='+this.data.obj.cityename+'&bankLId='+this.data.obj.bankSubBranch+'&bankLName='+this.data.obj.bankLName);
    } else if(this.data.type == 3){
      console.log('3绑定银行卡请求'+'mod=account&operation=bindCard&uid='+this.data.uid+'&loginid='+this.data.loginid+'&type='+this.data.type+'&companyName='+this.data.obj.companyName+'&companyGlobalId='+this.data.obj.companyIdCard+'&userName='+this.data.obj.legalPersonName+'&userIdcard='+this.data.obj.legalPersonIdCard+'&userMobile='+this.data.obj.companyPhone+'&bankNumber='+this.data.obj.corporateAccount+'&bankCode='+this.data.obj.bankdeposit+'&bankName='+this.data.obj.bankName+'&province='+this.data.obj.provincename+'&city='+this.data.obj.cityename+'&bankLId='+this.data.obj.bankSubBranch+'&bankLName='+this.data.obj.bankLName)
      qqq = Dec.Aese('mod=account&operation=bindCard&uid='+this.data.uid+'&loginid='+this.data.loginid+'&type='+this.data.type+'&companyName='+this.data.obj.companyName+'&companyGlobalId='+this.data.obj.companyIdCard+'&userName='+this.data.obj.legalPersonName+'&userIdcard='+this.data.obj.legalPersonIdCard+'&userMobile='+this.data.obj.companyPhone+'&bankNumber='+this.data.obj.corporateAccount+'&bankCode='+this.data.obj.bankdeposit+'&bankName='+this.data.obj.bankName+'&province='+this.data.obj.provincename+'&city='+this.data.obj.cityename+'&bankLId='+this.data.obj.bankSubBranch+'&bankLName='+this.data.obj.bankLName);
    }  
     
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
        console.log('绑定银行卡=====',res)
        if (res.data.ReturnCode == 200) {
          _this.data.accountId = res.data.Info.account.accountId;
          if(_this.data.type == 3){
            app.showToastC('绑定成功',1500);
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
              let pages = getCurrentPages();    //获取当前页面信息栈
              let prevPage = pages[pages.length-2];
              prevPage.onLoadfun();
            },1500)
          }
        }else{
          app.showToastC(res.data.Msg)  
        };
      }
    });
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
            [`enterpriseData1[1].groups[0]`]:res.data.List.province
          });
          _this.data.obj.columnprovinceCode = res.data.List.province[0].provinceCode;
          _this.getCity();
         }else{
           app.showToastC(res.data.Msg)  
         };
       }
     });
  },
  //获取市列表
  getCity(){
    var _this = this;
    console.log(_this.data.obj.columnprovinceCode)

    console.log('mod=account&operation=listCity?bankCode='+_this.data.obj.bankdeposit+'&provinceCode='+_this.data.obj.columnprovinceCode);
    var qqq = Dec.Aese('mod=account&operation=listCity&bankCode=102&provinceCode='+_this.data.obj.columnprovinceCode);
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
          let groups = 'enterpriseData1[1].groups[1]';
          let groupsIndex = 'enterpriseData1[1].groupsIndex';
          _this.setData({
            [groups]:res.data.List.city,
            [groupsIndex]:[_this.data.obj.columnvalue,0],
          });
           
        }else{
          app.showToastC(res.data.Msg)
        };
      }
    });
  },
  //确认绑定
  submitAudit(){
    var _this = this;
    if(!this.data.obj.phoneCode ||this.data.obj.phoneCode == ''){
      this.selectComponent('#enterpriseData2').scrollto('phoneCode');
      app.showToastC('请输入验证码',1500);
      return false;
    }
    console.log('银行卡验证请求'+'mod=account&operation=verifyCard&uid='+this.data.uid+'&loginid='+this.data.loginid+'&verifyCode='+this.data.obj.phoneCode+'&accountId='+this.data.accountId);
    var qqq = Dec.Aese('mod=account&operation=verifyCard&uid='+this.data.uid+'&loginid='+this.data.loginid+'&verifyCode='+this.data.obj.phoneCode+'&accountId='+this.data.accountId);
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
        console.log('银行卡验证=====',res)
        if (res.data.ReturnCode == 200) {
          app.showToastC('绑定成功',1500);
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
            let pages = getCurrentPages();    //获取当前页面信息栈
            let prevPage = pages[pages.length-2];
            prevPage.setData({
              isBankcardlistMask:false
            })
            prevPage.onLoadfun();
          },1500)
        }else{
          app.showToastC(res.data.Msg)  
        };
      }
    });

  },
  toggleImmediatelyUnlink(){
    this.setData({
      isUnbindAndBindMask:!this.data.isUnbindAndBindMask,
    })
  },
  // 立即解绑
  immediatelyUnlink(){  //type==2?解绑并绑定新卡:立即解绑
    let _this = this;
    let qqq = Dec.Aese('mod=account&operation=unBindCard&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&accountId='+_this.data.accountId+'&isCloseAcct=1');
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
        console.log('销户成功',res)
        if (res.data.ReturnCode == 200) {

          _this.setData({
            obj:{},
            isUnbindAndBindMask:!_this.data.isUnbindAndBindMask,
            fromVerify:false,
            [`individualBusiness[1].value`]:'',
            [`individualBusiness[2].value`]:'',
            [`enterpriseData[0].value`]:'',
            [`enterpriseData[1].value`]:'',
            [`enterpriseData[2].value`]:'',
            [`enterpriseData1[0].value`]:'',
            [`enterpriseData1[1].value`]:'',
            [`enterpriseData1[2].value`]:'',
            [`enterpriseData1[0].isClick`]:true,
            [`enterpriseData1[1].isClick`]:true,
            [`enterpriseData1[2].isClick`]:true,
            [`enterpriseData2[0].value`]:'',
            [`enterpriseData2[0].num`]:'',
            [`enterpriseData2[1].value`]:'',
          })
          for(var i=0;i<_this.data.individualBusiness.length;i++){
            _this.setData({
              [`individualBusiness[${i}].num`]:''
            })
          }
          for(var i=0;i<_this.data.enterpriseData.length;i++){
            _this.setData({
              [`enterpriseData[${i}].num`]:''
            })
          }
          for(var i=0;i<_this.data.enterpriseData1.length;i++){
            _this.setData({
              [`enterpriseData1[${i}].num`]:''
            })
          }
        }else{
          app.showToastC(res.data.Msg)  
        };
      }
    });
  },
})
