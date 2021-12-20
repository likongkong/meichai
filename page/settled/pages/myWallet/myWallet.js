
var Dec = require('../../../../common/public');//aes加密解密js
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
    showModalStatus:false,
    startdate:'',
    enddate:'',
    currentdate:0,
    speedyData:[
      {name:'近三天'},
      {name:'本周'},
      {name:'上月'},
      {name:'本月'},
    ],
    email:'',
    isUnbindAndBindMask:false,  //解绑并绑定新卡弹框
    isUnbindAndBindMask1:false,  //重新绑卡
    isBankcardlistMask:false,  //银行卡列表弹出框
    isUnlinkMask:false,  //解绑银行卡弹框
    unlinkCardId:'',  //解绑id
    isExportOrdersMask:false,  //导出账单弹框
    isNotBalanceMask:false,  //余额不足弹框
    twoAffirm:false,   //二次确认提现弹框
    twoAffirm1:false,   //二次确认提现弹框---超额
    realname:'', //真实姓名
    tiedCardList:[{name:'个人商户',id:1},{name:'个体工商户',id:2},{name:'企业商户',id:3}],  //绑卡列表
    istiedCardlist:false, //是否绑卡
    isVerification:false,  //验证弹框
    obj:{},
    current:1,
    walletType:0,
    isOtherAmount:false
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
      // this.getbankCardList();
      this.getLumpsumAndWithdraw();
      this.getAccountNumberList();
      let a = this.keepTwoDecimalFull(19841);
      console.log(a)
    }else{
      app.getAccessToken(this.onLoadfun)
    };
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.data.loginid = app.signindata.loginid;
    this.data.uid = app.signindata.uid;
    if(wx.getStorageSync('access_token')){
      this.getbankCardList();
    }else{
      app.getAccessToken(this.onLoadfun)
    };
  },
  toggleOtherAmount(){
    this.setData({
      isOtherAmount:!this.data.isOtherAmount
    })
  },
  // js将数字转换成万 并且保留两位小数
  keepTwoDecimalFull (num) {
    if (num > 10000) {
        let result = num / 10000;
        result = Math.floor(result * 100) / 100;
        var s_x = result.toString(); //将数字转换为字符串
        var pos_decimal = s_x.indexOf('.'); //小数点的索引值
        // 当整数时，pos_decimal=-1 自动补0
        if (pos_decimal < 0) {
            pos_decimal = s_x.length;
            s_x += '.';
        }
        // 当数字的长度< 小数点索引+2时，补0
        while (s_x.length <= pos_decimal + 2) {
            s_x += '0';
        }
        s_x += '万';
    } else {
        s_x = num;
    }
    return s_x
  },
  labelChange(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      current:index,
      walletType:index
    })
    this.getLumpsumAndWithdraw(index);
  },
  onKeyInput(e){
    let name = e.currentTarget.dataset.name;
    let value = e.detail.value.trim();
    this.data.obj[name]=value;
    console.log(this.data.obj)
  },

  reset(){
    this.setData({limitprame:1,orderData:[],loadprompt:false})
  },
  //获取银行卡列表
  getbankCardList(){
    let _this = this;
    let qqq = Dec.Aese('mod=account&operation=getListForCard&uid='+this.data.uid+'&loginid='+this.data.loginid);
    console.log('行卡列表请求==',Dec.comurl()+'mod=account&operation=getListForCard&uid='+this.data.uid+'&loginid='+this.data.loginid)
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    wx.request({
      url: Dec.comurl() + 'pingan.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading()
        console.log('行卡列表',res)
        if (res.data.ReturnCode == 200) {
          _this.setData({
            bankCardList:res.data.List.card,
            verifyCard:res.data.List.verifyCard || [],
          })
        }else{
          app.showToastC(res.data.Msg)  
        };
      }
    });
    // api.bankCardList().then((res) => {
    //   console.log('行卡列表',res)
    //   res.data.data.list.forEach(element => {
    //     element.account_name1 = ` (${element.account_name.substr(-4)})`;
    //   });

    //   this.setData({
    //     bankCardList:res.data.data.list
    //   })
    // }).catch((err)=>{
    //   console.log(err)
    // })
  },

  // 获取钱包余额、提现判断
  getLumpsumAndWithdraw(){
    api.getLumpsumAndWithdraw({walletType:this.data.walletType}).then((res) => {
      console.log('iofo',res)
      this.setData({
        info:res.data.data.info,
        notify:res.data.data.notify
      })
      app.signindata.isRecord = res.data.data.info.isRecord; //是否勾选同意挂网协议
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
        // if(list[i].account_type == 1){
          // console.log( list[i].account_name)
          // list[i].account_name1 = list[i].account_name.substr(-4);
        // }
        if(list[i].isdefault == 1){
          withdrawAccount = list[i];
          break;
        }
      }
      if(res.data.data.list.length>1){
        list[1].account_name1 = `(${list[1].account_name.substr(-4)})`;
      }
      this.setData({
        accountList:list,
        // currentAccount:withdrawAccount,
        withdrawAccount
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
  bideWithdraw(e){
    let _this = this;
    // let withdrawAccount = this.data.withdrawAccount;  
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    // api.setDefaultAccount(withdrawAccount.id).then((res) => {
    //   console.log('设置账号',res)
      api.viewWithdrawalInformation({walletType:this.data.walletType}).then((res) => {
        console.log('查看提现信息',res)
        wx.hideLoading();
        this.setData({
          viewWithdrawalInfo:res.data.data,
          twoAffirm1:true,
          // realname:res.data.data.account,
          accountId:e.currentTarget.dataset.id,
        })
        // if(Number(withdrawAccount.quota_num) > Number(this.data.info.available_cash_amount)){
        //   this.setData({
        //     twoAffirm1:true,
        //   })
        // }else{
        //   this.setData({
        //     twoAffirm:true,
        //   })
        // }
      }).catch((err)=>{
        console.log(err)
      })
    // }).catch((err)=>{
    //   console.log(err)
    // })

    
    // wx.showModal({
    //   title: '提示',
    //   content: '每天可提现一次，暂只支持全额提现，确认提现请点击下方立即提现',
    //   cancelText:'取消',
    //   cancelColor:'#90D2D6',
    //   confirmText:'立即提现',
    //   confirmColor:'#90D2D6',
    //   success (res) {
    //     if (res.confirm) {
          // 判断上次中的那个 currentAccount.account_type==1为银行卡  2为微信零钱
          // if(currentAccount){
          //   if(currentAccount.account_type == 1){
          //     _this.setData({
          //       merchantNo: util.plusXing(currentAccount.account,2,2)
          //     })
          //     _this.toggleAuthenticationMask();
          //   }else if(currentAccount.account_type == 2){
          //     _this.executionApplicationWithdrawal();
          //   }
          // }else{
            // _this.clickme();
          // }
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
    // this.executionApplicationWithdrawal();
  },
  // 提现
  executionApplicationWithdrawal(){
    let that = this;
    // if(!that.data.realname || that.data.realname == ''){
    //   app.showToastC('请输入绑定微信支付的实名',1500);
    //   return false;
    // }
    console.log('this.data.accountId',this.data.accountId)
    let data = {
      // account:that.data.realname
      walletType:this.data.walletType,
      accountId:this.data.accountId,
    }
    console.log(data)

    api.executionApplicationWithdrawal(data).then((res) => {
      console.log(res)
      //今日已申请过提现
      if(res.data.status_code != 200){
        wx.showModal({
          title: '',
          content: res.data.message,
          showCancel:false,
          confirmText:'关闭',
          confirmColor:'#90D2D6',
          success (res) {
            if (res.confirm) {
            }
          }
        })
      }else{
        this.getLumpsumAndWithdraw(this.data.walletType);
        this.setData({
          showModalStatus:false,
          twoAffirm:false,
          twoAffirm1:false,
        })
        app.showToastC('提现申请已提交',2000);
      }

      // //今日已申请过提现
      // if(res.data.status_code == 200304){
      //   wx.showModal({
      //     title: '',
      //     content: '今日已申请过提现，注意每天仅可申请一次提现，请明天再来提现吧',
      //     showCancel:false,
      //     confirmText:'关闭',
      //     confirmColor:'#90D2D6',
      //     success (res) {
      //       if (res.confirm) {
              
      //       }
      //     }
      //   })
      // }else if(res.data.status_code == 200306){
      //   wx.showModal({
      //     title: '',
      //     content: '钱包余额不足，最低提现￥1.00',
      //     showCancel:false,
      //     confirmText:'关闭',
      //     confirmColor:'#90D2D6',
      //     success (res) {
      //       if (res.confirm) {
              
      //       }
      //     }
      //   })
      // }else{
        // app.showToastC('提现申请已提交，审核通过之后三个工作日之内到账',1500);
        // setTimeout(()=>{
        //   this.reset();
        //   this.getLumpsumAndWithdraw();
        //   this.getListData();
        // },1500)
      // }
      // this.setData({
      //   isAuthenticationMask:false
      // })
      

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
      account_name:withdrawAccount.account_name,
      bank_name:withdrawAccount.bank_name,
      account_type
    }
    api.setDefaultAccount(id,data).then((res) => {
      console.log(res)
      // app.showToastC(this.data.currentAccount?'修改成功':'设置成功',1500);
      // setTimeout(()=>{
        // this.setData({
        //   currentAccount:withdrawAccount,
        // })
        this.hideModal();
        this.executionApplicationWithdrawal();
      // },1500)
    }).catch((err)=>{
      console.log(err)
    })
  },
  // 商户号输入
  bindKeyInput(e){
    // console.log(e.currentTarget.dataset.type)
    let type = e.currentTarget.dataset.type;
    console.log(e.detail.value,type)
    if(type == 'name'){
      this.setData({
        [`withdrawAccount.account_name`]:e.detail.value
      })
    }else if(type == 'bankname'){
      this.setData({
        [`withdrawAccount.bank_name`]:e.detail.value
      })
    }else if(type == 'cardno'){
      this.setData({
        [`withdrawAccount.account`]:e.detail.value
      })
    }
    // this.setData({
    //   [`withdrawAccount.account`]:e.detail.value
    // })
  },
  // 隐藏二次确认提现弹框
  hidetwoAffirm(){
    this.setData({
      twoAffirm:false,
      twoAffirm1:false
    })
  },
  // 切换账号
  changeAccount(e){
    let ind = e.currentTarget.dataset.ind;
    for(var i=0;i<this.data.accountList.length;i++){
      this.setData({
        [`accountList[${i}].isdefault`]:0
      })
    }
    this.setData({
      withdrawAccount: this.data.accountList[ind],
      [`accountList[${ind}].isdefault`]:1
    })
    console.log('选中的账号',this.data.withdrawAccount)
  },
  showLoading(){
    app.showToastC(this.data.info.nocan_trip,3000);
  },
  // 立即提现1
  withdraw(){
    // if(Number(this.data.info.available_cash_amount)<1){
    //   this.setData({
    //     isNotBalanceMask:true
    //   })
    // }else{
      // this.setData({
      //   showModalStatus:true
      // })
    // }
    app.getUserProfile((res,userInfo) => {
      if(this.data.verifyCard.length==0 && this.data.bankCardList.length==0){
        this.setData({
          istiedCardlist:true
        })
      }else if(this.data.verifyCard.length==0 && this.data.bankCardList.length>0){
        this.setData({
          isBankcardlistMask:true
        })
      }else{
        if(Number(this.data.info.can_income)>0){
          this.setData({
            showModalStatus:true
          })
        }else{
          app.showToastC('提现金额必须大于0',1500);
        }
      }
    })
  },
  // 隐藏余额不足弹框
  hideNotBalanceMask(){
    this.setData({
      isNotBalanceMask:false
    })
  },
  // 显示二次确认解绑弹框
  unlinkBtn(e){
    let id = e.currentTarget.dataset.id;
    this.setData({
      unlinkCardId:id,
      isUnlinkMask:true,
    })
  },
  // 取消解绑
  hideunlinkMask(){
    this.setData({
      isUnlinkMask:false,
      isUnbindAndBindMask:false,
      isUnbindAndBindMask1:false,
    })
  },
  hidetiedCardlistMisk(){
    this.setData({
      istiedCardlist:false,
    })
  },
  toogleVerificationMask(e){
    this.setData({
      accountId:e.currentTarget.dataset.id,
      isVerification:!this.data.isVerification,
    })
  },
  // 解绑并绑定新卡弹框显示
  alterationBankcard(e){
    let id = e.currentTarget.dataset.id;
    let isverify= e.currentTarget.dataset.isverify;
    if(isverify){
      this.setData({
        unlinkCardId:id,
        isUnbindAndBindMask:true
      })
    }else{
      this.setData({
        unlinkCardId:id,
        isUnbindAndBindMask1:true
      })
    }
  },
  // 解绑并绑定新卡按钮
  UnbindAndBindBankCard(){
    this.immediatelyUnlink('',2);
  },
  // 立即解绑
  immediatelyUnlink(e,type=1){  //type==2?解绑并绑定新卡:立即解绑
    let _this = this;
    let qqq = Dec.Aese('mod=account&operation=unBindCard&uid='+this.data.uid+'&loginid='+this.data.loginid+'&accountId='+this.data.unlinkCardId);
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    wx.request({
      url: Dec.comurl() + 'pingan.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading()
        console.log('解绑',res)
        if (res.data.ReturnCode == 200) {
          
          if(type==1){
            app.showToastC('解绑成功',1500);
            setTimeout(()=>{
              _this.setData({
                isUnlinkMask:false,
                isBankcardlistMask:false
              })
              _this.onLoadfun();
              _this.getbankCardList();
              // this.getAccountNumberList();
            },1500)
          }else{
            _this.setData({
              isBankcardlistMask:false,
              isUnbindAndBindMask:false,
              isUnbindAndBindMask1:false,
            })
            _this.tiedCardlist();
            _this.getbankCardList();
          }
        }else{
          app.showToastC(res.data.Msg)  
        };
      }
    });
    // api.bankUntie(this.data.unlinkCardId).then((res) => {
    //   app.showToastC('解绑成功',1500);
    //   setTimeout(()=>{
    //     this.setData({
    //       isUnlinkMask:false,
    //     })
    //     this.getbankCardList();
    //     this.getAccountNumberList();
    //   },1500)
    // }).catch((err)=>{
    //   console.log(err)
    // })
  },
  // 导出订单弹框
  toggleExportOrdersMask(){
    this.setData({
      isExportOrdersMask:!this.data.isExportOrdersMask,
    })
  },
  // 选择银行卡
  choiceBankCard(e){
    let ind = e.currentTarget.dataset.ind;
    if(this.data.showModalStatus){
      for(var i=0;i<this.data.accountList.length;i++){
        this.setData({
          [`accountList[${i}].isdefault`]:0
        })
      }
      this.data.bankCardList[ind].isdefault = 1;
      // list[1].account_name1 = `(${list[1].account_name.substr(-4)})`;
      this.setData({
        [`accountList[1]`]:this.data.bankCardList[ind],
        withdrawAccount: this.data.bankCardList[ind],
        isBankcardlistMask:false
      })
      console.log('选中的账号',this.data.withdrawAccount)
    }
  },
  // 银行卡列表显示隐藏
  toogleBankcardlistMask(){
    if(this.data.bankCardList.length == 0){
      this.tiedCardlist();
    }else{
      this.setData({
        isBankcardlistMask:!this.data.isBankcardlistMask
      })
    }
    // this.getbankCardList();
    // this.setData({
    //   isBankcardlistMask:!this.data.isBankcardlistMask
    // })
  },

  //绑卡列表
  tiedCardlist(){
    let _this = this;
    let arr = [];
    this.setData({
      istiedCardlist:false   //隐藏'添加银行卡提示'弹框
    })
    for(var i=0;i<this.data.tiedCardList.length;i++){
      arr.push(this.data.tiedCardList[i].name);
    }
    wx.showActionSheet({
      itemList: arr,
      success (res){
        _this.jumpTiedCard(9045,'type='+_this.data.tiedCardList[res.tapIndex].id);
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  },
  //导出订单选日期
  choiceDate(e){
    let ind = e.currentTarget.dataset.ind;
    this.setData({
      currentdate:ind,
      startdate:'',
      enddate:''
    })
  },
  // 填写真实姓名
  bindRealnameInput(e){
    this.setData({
      realname: e.detail.value
    })
  },
  // 填写邮箱弹框
  bindEmailKeyInput(e){
    this.setData({
      email: e.detail.value
    })
  },
  // 日期选择
  bindDateChange(e) {
    console.log(e.detail.value)
    let type = e.currentTarget.dataset.type;
    if(type == 0){
      this.setData({
        startdate: e.detail.value
      })
    }else{
      this.setData({
        enddate: e.detail.value
      })
    }
    this.setData({
      currentdate:999
    })
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

  // 提交验证
  merchantVerification(){
    let _this = this;
    let obj = this.data.obj;
    if(!obj.verificationMoney || obj.verificationMoney == ''){
      app.showToastC('请输入对公账户的打款金额',1500);
      return false;
    }
    if(!obj.verificationCode || obj.verificationCode == ''){
      app.showToastC('请输入认证绑卡的验证码',1500);
      return false;
    }
    let qqq = Dec.Aese('mod=account&operation=verifyCard&uid='+this.data.uid+'&loginid='+this.data.loginid+'&accountId='+this.data.accountId+'&verifyCode='+obj.verificationCode+'&authAmount='+obj.verificationMoney);
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    wx.request({
      url: Dec.comurl() + 'pingan.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading()
        console.log('对公提交验证',res)
        if (res.data.ReturnCode == 200) {
          app.showToastC('验证成功',1500);
          setTimeout(()=>{
            _this.setData({
              isVerification:!_this.data.isVerification,
            })
            _this.getbankCardList();
          },1500)
        }else{
          app.showToastC(res.data.Msg)  
        };
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
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
    this.getAccountNumberList()
    this.getLumpsumAndWithdraw(this.data.walletType);
    this.getbankCardList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // if(this.data.loadprompt == false){
    //   this.setData({limitprame:++this.data.limitprame})
    //   this.getListData();
    // }else{
    //   app.showToastC('暂无更多数据了',1500);
    // }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  jinqingqidai(){
    app.showToastC('敬请期待')
  },
  comjumpwxnav(e){
    let type = e.currentTarget.dataset.type;
    let whref = e.currentTarget.dataset.whref;
    app.comjumpwxnav(type,whref)
  },
  jumpTiedCard(type,whref){
    app.comjumpwxnav(type,whref)
  },
})
