
var Dec = require('../../../../common/public');//aes加密解密js
var api = require("../../../../utils/api.js");
var COS = require("../../../../common/cos-wx-sdk-v5.js")
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '提现申请',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    descPrice:'',
    // 线下邮寄 上传
    selectData:[{name:'线下邮寄',select:true,id:1},{name:'上传电子发票',select:false,id:2}],
    selectId:1
  },
  fullWithdrawal(){
    this.setData({
        descPrice:this.data.dataInfo.can_withdraw
    })
  },
  // 选中函数
  selectFun(w){
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var selectData = this.data.selectData || [];
    for(var i=0;i<selectData.length;i++){
      selectData[i].select = false;
    };
    selectData[ind].select = true;
    var selectId = selectData[ind].id;
    console.log(selectId)
    this.setData({
      selectData,
      selectId
    })
  },
  // 复制单号
  copyCart(w){
    var cart = w.currentTarget.dataset.cart || w.target.dataset.cart || '';
    wx.setClipboardData({
      data: cart || '',
      success: function (res) {
        app.showToastC('复制成功');
      }
    });
  },
  // input 值改变
  inputChange: function (e) {
    this.setData({
      descPrice: e.detail.value
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.hideShareMenu();

    // '已经授权'
    _this.data.loginid = app.signindata.loginid;
    _this.data.uid = app.signindata.uid;
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
    } else {
      app.signin(_this)
    };


  },
  onLoadfun(){
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.uid = app.signindata.uid;
    _this.setData({
      uid: app.signindata.uid,
      avatarUrl: app.signindata.avatarUrl,
      isProduce: app.signindata.isProduce,
      isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
    });

    if(wx.getStorageSync('access_token')){
      this.getData();
    }else{
      app.getAccessToken(_this.getData)
    };
    
  },
  // 获取数据
  getData(num=1){
    var _this = this;
    api.withdraw_data({}).then((res) => {
      console.log('提现数据=======',res)
      if (res.data.status_code == 200) {
          _this.setData({
            dataInfo:res.data.data || {}
          })
      }else{
        if(res.data && res.data.message){
          app.showModalC(res.data.message); 
        };        
      }
    })
  },
  // 提现
  withdrawal(){
    var _this = this;
    var dataInfo = _this.data.dataInfo || {};
    if(!this.data.descPrice){
      app.showModalC('提现金额不能为空')
      return false;
    };

    if(parseFloat(this.data.descPrice) > parseFloat(dataInfo.can_withdraw)){
      app.showModalC('提现金额不能大于最高可申请提现金额')
      return false;
    };
    if(_this.data.selectId == 2){
       if(!_this.data.withFilePath){
          app.showModalC('请上传电子发票')
          return false;
       };
    };
    api.withdrawUp({
      rise_path:_this.data.withFilePath || '', //电子发票地址
      rise_type:_this.data.selectId==1?0:1, //发票类型0=线下1=电子发票
      bank_id:dataInfo.bank_list[0].id, //银行卡id
      amount:_this.data.descPrice, //提现金额
      firmId:dataInfo.firmId, //企业ID
    }).then((res) => {
      console.log('提交提现=======',res)
      if (res.data.status_code == 200) {
        wx.navigateBack();
      }else{
        if(res.data && res.data.message){
          app.showModalC(res.data.message); 
        };        
      }
    })
  },
  UploadFile(){
    var _this = this;
    var cos = new COS({
      SecretId: 'AKIDmY0RxErYIm2TfkckG8mEYbcNA4wYsPbe',
      SecretKey: '4WkpgJ5bJlU4B6wNuCG4EDyVnGWUFhw1',
    });
    console.log(1111111111)
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success (res) {
        console.log('上传文件',res)
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFiles;
        if(tempFilePaths && tempFilePaths.length != 0){
            var iftr = true;
            tempFilePaths.forEach(element => {
                console.log(element)
                var filePath = element.path;
                //获取最后一个.的位置
                var index= filePath.lastIndexOf(".");
                //获取后缀
                var ext = filePath.substr(index+1);
                _this.setData({
                  fileName:element.name
                })

                var fileName =  `${app.signindata.uid}_${new Date().getTime()}.${ext}`;
                cos.postObject({
                      Bucket: 'brand-settled-info-1300990269',
                      Region: 'ap-beijing',
                      Key: `withdrawal/${fileName}`,
                      FilePath: filePath,
                      onProgress: function (info) {  //上传进度
                          console.log('进度条',JSON.stringify(info));
                      }
                    },(err, data) => {
                      console.log(err,data)
                      if(data){
                        _this.setData({
                          withFilePath:data.Location
                        })
                      }else if(err){
                        app.showToastC('上传失败')
                      };

                    }
                );
            });
        };

      }
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
    app.downRefreshFun(() => {
      this.getData()
    })   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // this.getData(2)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this;
    var indexShare = app.signindata.indexShare || [];
    var indexShareNum = Math.floor(Math.random() * indexShare.length) || 0;
    var indexShareImg = '';
    if(indexShare.length!=0 && indexShare[indexShareNum]){
      indexShareImg = indexShare[indexShareNum]+'?time=' + Date.parse(new Date());
    };
    return {
      title:app.signindata.titleShare?app.signindata.titleShare:'你喜欢的潮玩都在这里！',
      path: 'pages/index/index',
      imageUrl:indexShareImg || 'https://cdn.51chaidan.com/images/default/shareImg.jpg',
      success: function (res) {}
    } 
  },

})
