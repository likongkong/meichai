var Dec = require('../../../../common/public');//aes加密解密js
var api = require("../../../../utils/api.js");
const util = require('../../../../utils/util');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '发布抽选',
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
    ],
    listData1:[
      {
        isRequired:true,
        type:'text',
        subtitle:'名称',
        placeholder:'请输入名称',
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
        isRequired:true,
        type:'text',
        subtitle:'抽选数量',
        placeholder:'请输入数量',
        value:'',
        name:'goodsNum',
        borderbottom1:'show',
        margintop0:true,
      },{
        isRequired:true,
        type:'text',
        subtitle:'抽选价格',
        placeholder:'请输入价格',
        value:'',
        name:'goodsPrice',
        borderbottom1:'show',
        margintop0:true,
      },
    ],
    listData2:[
      {
        isRequired:true,
        type:'time',
        subtitle:'抽选开始时间',
        placeholder:'请选择开始时间',
        value:'',
        time:'',
        name:'startTime',
        borderbottom1:'show',
        margintop0:true,
      },{
        isRequired:true,
        type:'time',
        subtitle:'抽选开奖时间',
        placeholder:'请选择开奖时间',
        value:'',
        time:'',
        name:'stopTime',
        borderbottom1:'show',
        margintop0:true,
      },{
        isRequired:true,
        type:'time',
        subtitle:'付款结束时间',
        placeholder:'请选择结束时间',
        value:'',
        time:'',
        name:'finalPayTime',
        borderbottom1:'show',
        margintop0:true,
      },
    ],
    listData3:[
      {
        isRequired:false,
        type:'textarea',
        subtitle:'抽选说明',
        placeholder:'请输入抽选说明',
        value:'',
        name:'explain',
        borderbottom1:'show',
        margintop0:true,
      },{
        isRequired:false,
        type:'uploadImg',
        subtitle:'详情图',
        name:'goodsDetailsPic',
        imageList:[],
        margintop0:true,
        mode:'multiple',
        storagelocation:'brandinfo/dynamic'
      },
    ],
    listData4:[
      {
        isRequired:false,
        type:'radio',
        subtitle:'是否显示参与人数',
        radioArr:['是','否'],
        value:0,
        index:0,
        direction:'X',
        margintop0:true,
        name:'isParticipants',
      },{
        isRequired:false,
        type:'radio',
        subtitle:'是否需要保证金',
        radioArr:['是','否'],
        value:'',
        index:1,
        direction:'X',
        explain:false,
        input:true,
        name:'isCashPledge',
      },
    ],
    obj:{
      explain:'', //说明
      goodsDetailsPic:'', //详情图
      isParticipants:0, //是否显示参与人数
      isCashPledge:1, //是否需要保证金
    },
    type:4,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    // '已经授权'
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
      let stopTime = (new Date(this.data.obj.stopTime).getTime())/1000;
      let finalPayTime = (new Date(this.data.obj.finalPayTime).getTime())/1000;
      if(!stopTime && !finalPayTime){
        this.setData({
          [`listData2[0].time`]:e.detail.value
        })
        this.data.obj[key]=e.detail.value;
      }else if(stopTime && !finalPayTime){
        if(startTime<stopTime){
          this.setData({
            [`listData2[0].time`]:e.detail.value
          })
          this.data.obj[key]=e.detail.value;
        }else{
          app.showToastC('开始时间不可大于开奖时间',1500);
        }
      }else if(!stopTime && finalPayTime){
        if(startTime<finalPayTime){
          this.setData({
            [`listData2[0].time`]:e.detail.value
          })
          this.data.obj[key]=e.detail.value;
        }else{
          app.showToastC('开始时间不可大于结束时间',1500);
        }
      }else{
        if(startTime<stopTime){
          app.showToastC('开始时间不可大于开奖时间',1500);
          return false;
        } 
        if(startTime<finalPayTime){
          app.showToastC('开始时间不可大于结束时间',1500);
          return false;
        }
        this.setData({
          [`listData2[0].time`]:e.detail.value
        })
        this.data.obj[key]=e.detail.value;
      }
    }else if(key == 'stopTime'){
      let startTime = (new Date(this.data.obj.startTime).getTime())/1000;
      let stopTime = (new Date(e.detail.value).getTime())/1000;
      let finalPayTime = (new Date(this.data.obj.finalPayTime).getTime())/1000;
      if(!startTime && !finalPayTime){
        this.setData({
          [`listData2[1].time`]:e.detail.value
        })
        this.data.obj[key]=e.detail.value;
      }else if(startTime && !finalPayTime){
        if(stopTime>startTime){
          this.setData({
            [`listData2[1].time`]:e.detail.value
          })
          this.data.obj[key]=e.detail.value;
        }else{
          app.showToastC('开奖时间不可小于开始时间',1500);
        }
      }else if(!startTime && finalPayTime){
        if(stopTime<finalPayTime){
          this.setData({
            [`listData2[1].time`]:e.detail.value
          })
          this.data.obj[key]=e.detail.value;
        }else{
          app.showToastC('开奖时间不可大于结束时间',1500);
        }
      }else{
        if(stopTime<startTime){
          app.showToastC('开奖时间不可小于开始时间',1500);
          return false;
        } 
        if(stopTime>finalPayTime){
          app.showToastC('开奖时间不可大于结束时间',1500);
          return false;
        }
        this.setData({
          [`listData2[1].time`]:e.detail.value
        })
        this.data.obj[key]=e.detail.value;
      }
    }else if(key == 'finalPayTime'){
      let startTime = (new Date(this.data.obj.startTime).getTime())/1000;
      let stopTime = (new Date(this.data.obj.stopTime).getTime())/1000;
      let finalPayTime = (new Date(e.detail.value).getTime())/1000;

      if(!startTime && !stopTime){
        this.setData({
          [`listData2[2].time`]:e.detail.value
        })
        this.data.obj[key]=e.detail.value;
      }else if(startTime && !stopTime){
        if(finalPayTime>startTime){
          this.setData({
            [`listData2[2].time`]:e.detail.value
          })
          this.data.obj[key]=e.detail.value;
        }else{
          app.showToastC('结束时间不可小于开始时间',1500);
        }
      }else if(!startTime && stopTime){
        if(finalPayTime>stopTime){
          this.setData({
            [`listData2[2].time`]:e.detail.value
          })
          this.data.obj[key]=e.detail.value;
        }else{
          app.showToastC('结束时间不可小于开奖时间',1500);
        }
      }else{
        if(finalPayTime<startTime){
          app.showToastC('结束时间不可小于开始时间',1500);
          return false;
        } 
        if(finalPayTime<stopTime){
          app.showToastC('结束时间不可小于开奖时间',1500);
          return false;
        }
        this.setData({
          [`listData2[2].time`]:e.detail.value
        })
        this.data.obj[key]=e.detail.value;
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
  //查看信息
  getData(){
    console.log(this.data.type,this.data.id)
    api.settledGoodsInfoActivity(this.data.type,this.data.id).then((res) => {
      wx.hideLoading()
      wx.stopPullDownRefresh();
      console.log(res.data.data)
      if(res.data.status_code == 200){
        let info = res.data.data.Info.activity;
        let obj = this.data.obj;
        this.setData({
          [`listData[0].value`]:info.brand.brandName,
          [`listData1[0].value`]:info.goodsName,
          [`listData1[1].src`]:info.goodsThumb,
          [`listData1[2].value`]:info.quota,
          [`listData1[3].value`]:info.goodsPrice,
          [`listData2[0].time`]:util.format1("yyyy-MM-dd HH:mm",info.startTime),
          [`listData2[1].time`]:util.format1("yyyy-MM-dd HH:mm",info.stopTime),
          [`listData2[2].time`]:util.format1("yyyy-MM-dd HH:mm",info.finalPayTime),
          [`listData3[0].value`]:info.rule,
          [`listData3[1].imageList`]:info.arrGoodsDescImg,
          [`listData4[0].index`]:info.isShowSellNumber==0?1:0,
          [`listData4[1].index`]:info.cashPledge==0?1:0,
          [`listData4[1].value`]:info.cashPledge==0?'':info.cashPledge,
        })
    //  goodsName:'', //商品名称
    //  flatPatternmaking:'', //商品展示图
    //  goodsPrice:'', //抽选价格
    //   goodsNum:'', //抽选数
    //   startTime:'',
    //   stopTime:'',
    //   finalPayTime:'',
    //   explain:'', //说明
    //   goodsDetailsPic:'', //详情图
    //   isParticipants:'', //是否显示参与人数
    //   isCashPledge:'', //是否需要保证金

        obj.associationIp = info.brand.brandId;
        obj.goodsName = info.goodsName;
        obj.flatPatternmaking = info.goodsThumb;
        obj.goodsNum = info.quota;
        obj.goodsPrice = info.goodsPrice;
        obj.startTime = util.format1("yyyy-MM-dd HH:mm",info.startTime);
        obj.stopTime = util.format1("yyyy-MM-dd HH:mm",info.stopTime);
        obj.finalPayTime = util.format1("yyyy-MM-dd HH:mm",info.finalPayTime);
        obj.explain = info.rule;
        obj.goodsDetailsPic = info.arrGoodsDescImg;
        obj.isParticipants = info.isShowSellNumber==0?1:0;
        obj.isCashPledge = info.cashPledge==0?1:0;
        obj.isCashPledgeNum = info.cashPledge==0?'':info.cashPledge;
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
      app.showToastC('请输入活动名称',1500);
      return false;
    }
    if(!obj.flatPatternmaking || obj.flatPatternmaking.length == 0){
      this.selectComponent('#settledForm1').scrollto('flatPatternmaking');
      app.showToastC('请添加商品展示图',1500);
      return false;
    }
    if(!obj.goodsNum || obj.goodsNum == ''){
      this.selectComponent('#settledForm1').scrollto('goodsNum');
      app.showToastC('请输入抽选数量',1500);
      return false;
    }
    if(!obj.goodsPrice || obj.goodsPrice == ''){
      this.selectComponent('#settledForm1').scrollto('goodsPrice');
      app.showToastC('请输入抽选价格',1500);
      return false;
    }
    if(!obj.startTime || obj.startTime == ''){
      this.selectComponent('#settledForm2').scrollto('startTime');
      app.showToastC('请选择抽选开始时间',1500);
      return false;
    }
    if(!obj.stopTime || obj.stopTime == ''){
      this.selectComponent('#settledForm2').scrollto('stopTime');
      app.showToastC('请选择抽选开奖时间',1500);
      return false;
    }
    if(!obj.finalPayTime || obj.finalPayTime == ''){
      this.selectComponent('#settledForm2').scrollto('finalPayTime');
      app.showToastC('请选择付款结束时间',1500);
      return false;
    }
    wx.showLoading({
      title: '加载中',
    })
    //  goodsName:'', //商品名称
    //  flatPatternmaking:'', //商品展示图
    //  goodsPrice:'', //抽选价格
    //   goodsNum:'', //抽选数
    //   startTime:'',
    //   stopTime:'',
    //   finalPayTime:'',
    //   explain:'', //说明
    //   goodsDetailsPic:'', //详情图
    //   isParticipants:'', //是否显示参与人数
    //   isCashPledge:'', //是否需要保证金
    //   isCashPledgeNum:'', //保证金额
  


    let data = {
      activityId:this.data.id&&this.data.id!=0?this.data.id:'',
      activityType:4,
      brandId:obj.associationIp,
      goodsName:obj.goodsName,
      goodsThumb:obj.flatPatternmaking,
      quota:obj.goodsNum,
      goodsPrice:obj.goodsPrice,
      startTime:(new Date(obj.startTime).getTime())/1000,
      stopTime:(new Date(obj.stopTime).getTime())/1000,
      finalPayTime:(new Date(obj.finalPayTime).getTime())/1000,
      rule:obj.explain,
      arrGoodsDescImg:obj.goodsDetailsPic,
      isShowSellNumber:obj.isParticipants==0?1:0,
      cashPledge:obj.isCashPledge==0?obj.isCashPledgeNum:0,
    }
    console.log(data)
    // return false;
    api.settledGoodsSetActivity(data).then((res) => {
      console.log(res)
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
