
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
    c_title: '发布图鉴',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    ipData:[
      {
        isRequired:false,
        type:'actionSheet',
        groups:[],
        disabled:false,
        subtitle:'关联IP',
        value:'点击关联',
        name:'associationIp'
      }
    ],
    fieldGuideData:[
      {
        isRequired:true,
        type:'text',
        subtitle:'图鉴标题',
        placeholder:'请输入图鉴标题',
        value:'',
        name:'fieldGuideTitle'
      },{
        isRequired:true,
        type:'uploadImg',
        subtitle:'添加图片（最多上传九张，建议上传比例1:1)',
        name:'fieldGuidePic',
        margintop0:true,
        mode:'multiple',
        imageList:[],
        storagelocation:'images/illustrated'
      }
    ],
    fieldGuideData1:[
      {
        isRequired:false,
        type:'text',
        inputType:'digit',
        subtitle:'价格',
        placeholder:'请输入商品价格',
        value:'',
        name:'goodsPrice'
      },{
        isRequired:false,
        type:'text',
        inputType:'number',
        subtitle:'数量',
        placeholder:'请输入商品数量',
        value:'',
        name:'goodsNum'
      },{
        isRequired:false,
        type:'textarea',
        subtitle:'发售方式',
        placeholder:'请输入发售方式',
        value:'',
        paddingBottom12:true,
        name:'sellingway',
      },{
        isRequired:false,
        type:'textarea',
        subtitle:'商品简介',
        placeholder:'请输入商品简介描述',
        value:'',
        name:'fieldGuideDescription',
        paddingBottom12:true,
        borderbottom1:'hide'
      },
    ],
    fieldGuideData2:[
      {
        isRequired:false,
        type:'actionSheet',
        item_type:9034,
        selectArr:[],
        groups:[{name:'关联活动',id:1},{name:'关联动态',id:3}],
        subtitle:'关联动态/活动',
        value:'点击关联',
        name:'associationActivity'
      }
    ],
    obj:{},
    dynamicArr:[],
    activityArr:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();

    // 判断是否授权
    this.activsign();
    this.setData({
      id:options.id||0
    })
  },
  onLoadfun:function(){
    this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid
    });
    this.getIp();
  },
  activsign: function () {
    // 判断是否授权 
    var _this = this;
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
      return false;
    };    

    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      _this.onLoadfun();
    }else{
      wx.getSetting({
        success: res => {
          if (true) {
            // '已经授权'
            _this.setData({
              loginid: app.signindata.loginid,
              uid: app.signindata.uid,
              openid: app.signindata.openid,
              avatarUrl: app.signindata.avatarUrl,
              isShareFun: app.signindata.isShareFun,
              isProduce: app.signindata.isProduce,
              signinlayer: true,
              tgabox: false
            });
            // 判断是否登录
            if (_this.data.loginid != '' && _this.data.uid != '') {
              _this.onLoadfun();
            } else {
              app.signin(_this);
            }
          } else {
            _this.setData({
              tgabox: false,
              signinlayer: false
            })
            // '没有授权 统计'
            app.userstatistics(43);
            _this.onLoadfun();
          }
        }
      });  
    };    
  },
  // 授权点击统计
  clicktga: function () {
    app.clicktga(2)
  },
  clicktganone: function () {
    this.setData({ tgabox: false })
  },
  // 点击登录获取权限
  userInfoHandler: function (e) {
    var _this = this;
    wx.getSetting({
      success: res => {
        if (true) {
          _this.setData({
            signinlayer: true,
            tgabox: false
          });
          _this.activsign();
          // 确认授权用户统计
          app.clicktga(4);          
        }
      }
    });
    if (e.detail.detail.userInfo) { } else {
      app.clicktga(8)  //用户按了拒绝按钮
    };
  },
  pullupsignin: function () {
    // // '没有授权'
    this.setData({
      tgabox: true
    });
  },
  // 获取用户下所有的品牌id
  getIp(){
    wx.showLoading({
      title: '加载中',
    })
    let data = `mod=community&operation=showIp&uid=${this.data.uid}&loginid=${this.data.loginid}&type=4`
    var q = Dec.Aese(data);
    console.log(`${app.signindata.comurl}?${data}`)
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: (res) => { 
        console.log(res);
        if(res.data.ReturnCode == 200){
          let groups = `ipData[0].groups`;
          this.setData({
            [groups]:res.data.List.brandInfoList,
          })
          if(this.data.id!=0){
            this.getData();
            this.setData({
              [`ipData[0].disabled`]:true
            })
          }else{
            wx.hideLoading()
            wx.stopPullDownRefresh();
            this.setData({
              [`ipData[0].value`]:res.data.List.brandInfoList[0].name
            })
            this.data.obj.associationIp = res.data.List.brandInfoList[0].brand_id;
          }
        }else{
          wx.hideLoading()
          wx.stopPullDownRefresh();
          app.showToastC(res.data.Msg,2000);
        }
      },
      fail: function () {},
      complete:function(){
        
      }
    });
  },
  getData(){
    let data = `mod=community&operation=showIllustratedInfo&uid=${this.data.uid}&loginid=${this.data.loginid}&illustrated_id=${this.data.id}`
    var q = Dec.Aese(data);
    console.log(`${app.signindata.comurl}?${data}`)
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: (res) => { 
        wx.hideLoading()
        wx.stopPullDownRefresh();
        console.log(res);
        if(res.data.ReturnCode == 200){
          let info = res.data.Info;
          let list = res.data.List;
          let obj = this.data.obj;
          this.setData({
            [`ipData[0].value`]:info.brandName,
            [`fieldGuideData[0].value`]:info.title,
            [`fieldGuideData[1].imageList`]:info.imgArr,
            [`fieldGuideData1[0].value`]:info.price,
            [`fieldGuideData1[1].value`]:info.number,
            [`fieldGuideData1[2].value`]:info.sell_way.split('hc').join('\n'),
            [`fieldGuideData1[3].value`]:info.description.split('hc').join('\n'),
          })

          for(var i=0; i<list.relevanceInfo.length; i++){
            if(list.relevanceInfo[i].relation_type == 3){
              this.data.dynamicArr.push(list.relevanceInfo[i])
            }else{
              this.data.activityArr.push(list.relevanceInfo[i])
            }
          }
          this.relevanceData(list.relevanceInfo)
          obj.associationIp = info.brand_id;
          obj.fieldGuideTitle = info.title;
          obj.fieldGuidePic = info.imgArr;
          obj.goodsPrice = info.price;
          obj.goodsNum = info.number;
          obj.sellingway = info.sell_way;
          obj.fieldGuideDescription = info.description;
          obj.associationActivity = list.relevanceInfo;
        }else{
          app.showToastC(res.data.Msg,2000);
        }
      },
      fail: function () {},
      complete:function(){
        wx.hideLoading()
        wx.stopPullDownRefresh();
      }
    });
  },
  // 发布
  submitAudit(){
    let that = this;
    let obj = this.data.obj;
    if(!obj.fieldGuideTitle || obj.fieldGuideTitle == ''){
      this.selectComponent('#settledForm1').scrollto('fieldGuideTitle');
      app.showToastC('请输入图鉴标题',1500);
      return false;
    }
    if(!obj.fieldGuidePic || obj.fieldGuidePic.length == 0){
      this.selectComponent('#settledForm1').scrollto('fieldGuidePic');
      app.showToastC('请添加图片',1500);
      return false;
    }
    if(!obj.goodsPrice || obj.goodsPrice == ''){
      obj.goodsPrice = "";
    }
    if(!obj.goodsNum || obj.goodsNum == ''){
      obj.goodsNum = "";
    }
    if(!obj.sellingway || obj.sellingway == ''){
      obj.sellingway = "";
    }
    if(!obj.fieldGuideDescription || obj.fieldGuideDescription == ''){
      obj.fieldGuideDescription = "";
    }
    wx.showLoading({
      title: '加载中',
    })
    console.log(obj)

    let sellingway = obj.sellingway?encodeURIComponent(obj.sellingway.split('\n').join('hc')):'';
    let fieldGuideDescription = obj.fieldGuideDescription?encodeURIComponent(obj.fieldGuideDescription.split('\n').join('hc')):'';
    let data = `mod=community&operation=establishImages&uid=${this.data.uid}&loginid=${this.data.loginid}&brand_id=${obj.associationIp}&title=${obj.fieldGuideTitle}&price=${obj.goodsPrice}&number=${obj.goodsNum}&sell_way=${sellingway}&description=${fieldGuideDescription}&imgArr=${obj.fieldGuidePic}&id=${this.data.id}&relevanceInfo=${obj.associationActivity?JSON.stringify(obj.associationActivity):''}`
    var q = Dec.Aese(data);
    console.log(`${app.signindata.comurl}?${data}`)
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: (res) => { 
        console.log(res);
        wx.hideLoading()
        wx.stopPullDownRefresh();
        if(res.data.ReturnCode == 200){
          if(this.data.id!=0){
            app.showToastC('修改成功',1500);
            setTimeout(function(){
              let pages = getCurrentPages();    //获取当前页面信息栈
              let prevPage = pages[pages.length-2];
              prevPage.getData();
              that.navigateBack();
            },1000)
          }else{
            app.showToastC('发布成功',1500);
            setTimeout(function(){
              that.navigateBack();
            },1000)
          }
          
        }else{
          app.showToastC(res.data.Msg,2000);
        }
      },
      fail: function () {
        wx.hideLoading()
        wx.stopPullDownRefresh();
      },
      complete:function(){
        
      }
    });

  },
  // 获取表单数据
  bindchange(e){
    let key=e.detail.name;
    this.data.obj[key]=e.detail.value;
    console.log(this.data.obj)
  },
  // 获取IP数据
  showActionSheet(e){
    let that= this;
    let index = e.detail.index;
    let name = e.detail.name;
    let groups;
    if(name == 'associationIp'){
      groups = this.data.ipData[index].groups;
    }else{
      groups = this.data.fieldGuideData2[index].groups;
    }
    let arr = [];
    for(var i=0;i<groups.length;i++){
      arr.push(groups[i].name);
    }
    console.log(groups)
    wx.showActionSheet({
      itemList: arr,
      success (res) {
        if(name == 'associationIp'){
          that.setData({
            activityArr:[],
            dynamicArr:[],
            [`fieldGuideData2[0].value`]:`点击关联`,
          })
          that.data.obj.associationActivity = '';

          that.setData({
            [`ipData[${index}].value`]:groups[res.tapIndex].name
          })
        }
        if(name == 'associationIp'){
          that.data.obj.associationIp = groups[res.tapIndex].brand_id;
        }else{
          // that.data.obj.associationActivity = groups[res.tapIndex].id;
          // console.log(that.data.obj.associationActivity);
          that.comjumpwxnav1(that.data.fieldGuideData2[index].item_type,`type=${groups[res.tapIndex].id}&brand_id=${that.data.obj.associationIp}&illustrated_id=${that.data.id}&selectedArr=${JSON.stringify(that.data.obj.associationActivity)}`);
        }
        console.log(that.data.obj)
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
    console.log(this.data.obj)
  },
  relevanceData(arr,showType = 0){
    if(showType == 1){
      this.data.activityArr = arr;
    }else if(showType == 3){
      this.data.dynamicArr = arr;
    }
    let all = showType==0?arr:[...this.data.activityArr,...this.data.dynamicArr];
    this.data.obj.associationActivity = all;
    if(all.length==1){
      this.setData({
        [`fieldGuideData2[0].value`]:all[0].name
      })
    }else if(all.length>1){
      this.setData({
        [`fieldGuideData2[0].value`]:`已关联${all.length}条`
      })
    }else if(all.length==0){
      this.setData({
        [`fieldGuideData2[0].value`]:`点击关联`
      })
    }
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
  navigateBack(){
    wx.navigateBack({
      delta: 1
    })  
  },
  comjumpwxnav(e){
    let type = e.currentTarget.dataset.type;
    let whref = e.currentTarget.dataset.whref;
    app.comjumpwxnav(type,whref)
  },
  comjumpwxnav1(type,whref){
    app.comjumpwxnav(type,whref)
  },
})
