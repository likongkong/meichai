var Dec = require('../../../../common/public');//aes加密解密js
const util = require('../../../../utils/util');
var api = require("../../../../utils/api.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '任务返利',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    winHeight:wx.getSystemInfoSync().windowHeight,
    uid:'',
    loginid:'',
    current:0,
    mission:'',
    endtimeArr:[],
    triggered: false,
    // 没有绑定银行卡弹框
    commonBulletFrame:false,
    
  },
  confirmCommonTip(){
    app.comjumpwxnav(9030,'','','')
    this.closeCommonTip();
  },
  closeCommonTip(){
    this.setData({
      commonBulletFrame:false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  onShow: function (options) {
    wx.hideShareMenu();
    // '已经授权'
    // this.data.id = options.id;
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
    this.getData();

    if(wx.getStorageSync('access_token')){
      this.get_the_amount();
    }else{
      app.getAccessToken(this.get_the_amount)
    };
  },
  // 获取数据
  get_the_amount(){
    var _this = this;
    console.log('=========================')
    api.get_the_amount({}).then((res) => {
      console.log('提现金额=======',res)
     if (res.data.status_code == 200) {
        _this.setData({
          dataInfo:res.data.data.info || {}
        })
     }else{
       if(res.data && res.data.message){
         app.showModalC(res.data.message); 
       };        
     }
    })
  },  
  // 跳转
  goWAJump(e){
     var jump = e.currentTarget.dataset.jump || e.target.dataset.jump || 0;
     if(jump == 1){
        if(this.data.dataInfo.is_have){
            wx.navigateTo({
              url: `/page/settled/pages/applicationForWithdrawal/applicationForWithdrawal`
            });  
        }else{
            this.setData({
              commonBulletFrame:true
            })
        };
     }else if(jump == 2){
        wx.navigateTo({
          url: `/page/settled/pages/subsidyRecord/subsidyRecord?firmid=${this.data.dataInfo.firmId}`
        });
     }else if(jump == 3){
        app.comjumpwxnav(9050,2);
     }

     
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
    this.getData();
  },
  //用户下拉动作
  onScrollRefresh: function () {
    // var that=this;
    let isRefresh = true;
    this.getData(isRefresh);
    this.get_the_amount();
    // setTimeout(function(){
    //   that.setData({
    //     triggered: false,
    //   })
    // },2000);
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
  // tab切换
  tabChange(e){
    var id = e.target.id;
    this.setData({
      current:e.currentTarget.dataset.index,
      toView: id
    })
    console.log(id)
    var query = wx.createSelectorQuery();
    query.select('#' + id +'1').boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec(function(res) {
      if (res && res[0] && res[1]) {
        console.log(res)
        wx.pageScrollTo({
          scrollTop:res[0].top+res[1].scrollTop-app.signindata.statusBarHeightMc||99,
          duration:300
        })
      }
    });
  },
  getData(isRefresh = false){
    if(!isRefresh){
      wx.showLoading({
        title: '加载中',
      })
    }
    let data = `mod=mission&operation=info&uid=${this.data.uid}&loginid=${this.data.loginid}`
    var q = Dec.Aese(data);
    console.log(`${app.signindata.comurl}?${data}`)
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: (res) => { 
        wx.hideLoading()
        console.log('====',res)
        if(res.data.ReturnCode == 200){
          this.data.mission = res.data.List.mission;
          for(var i=0;i<res.data.List.mission.length;i++){
            this.data.endtimeArr.push({'endTime':res.data.List.mission[i].endTime});
          }
          this.severalCountDown();
          this.setData({
            score:res.data.Info.score[0],
            group:res.data.List.group,
            mission:res.data.List.mission,
          })
          setTimeout(()=>{
            this.setData({
              triggered: false,
            })
          },1000)
          console.log(this.data.mission)
        }else{
          app.showToastC(res.data.Msg,2000);
        }
      },
      fail: function () {},
      complete:function(){
        wx.stopPullDownRefresh();
      }
    });
  },
  // 领取奖励
  receiveAward(e){
    let missionIndex = e.currentTarget.dataset.missionindex;
    let missionGroup = e.currentTarget.dataset.missiongroup;
    let index = e.currentTarget.dataset.index;
    let sonindex = e.currentTarget.dataset.sonindex;
    wx.showLoading({
      title: '加载中',
    })
    let data = `mod=mission&operation=finishMission&uid=${this.data.uid}&loginid=${this.data.loginid}&missionIndex=${missionIndex}&missionGroup=${missionGroup}`
    var q = Dec.Aese(data);
    console.log(`${app.signindata.comurl}?${data}`)
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: (res) => { 
        wx.hideLoading()
        console.log('领取奖励====',res)
        if(res.data.ReturnCode == 200){
          app.showToastC('领取成功',1500);
          // if(sonindex!=undefined){
          //   this.setData({
          //     [`mission[${index}].listMission[${sonindex}].isReceive`]:true
          //   })
          // }else{
          //   this.setData({
          //     [`mission[${index}].isReceive`]:true
          //   })
          // }
          setTimeout(()=>{
            this.getData();
          },1500)
        }else{
          app.showToastC(res.data.Msg,2000);
        }
      },
      fail: function () {},
      complete:function(){
        wx.stopPullDownRefresh();
      }
    });
  },
  //多个倒计时
  severalCountDown: function () {
    var that = this;
    var time = 0;
    var obj = {};
    var endtimeArr = this.data.endtimeArr;
    //遍历数组，计算每个item的倒计时秒数
    endtimeArr.forEach(function (item) {
      var endTime = item.endTime * 1000;//结束时间时间戳
      var currentTime = new Date().getTime();//当前时间时间戳
      time =(endTime - currentTime) / 1000;
      // 如果活动未结束
      if (time > 0) {
        var day = Math.floor(time / 3600 / 24);
        var hour =Math.floor((time - day * 3600 * 24) / 3600);
        var minute = Math.floor((time - day * 3600 * 24 - hour * 3600) / 60);
        var second =Math.floor(time - day * 3600 * 24 - hour * 3600 - minute * 60);
        obj = {
          day: day,
          hou: hour,
          min: minute,
          sec: second
        }
      } else { //活动已结束
        obj = {
          day: "0",
          hou: "0",
          min: "0",
          sec: "0"
        }
        clearTimeout(that.data.timeIntervalSeveral); //清除定时器
      }
      item.time = obj;
    })
    var timeIntervalSeveral = setTimeout(that.severalCountDown, 1000);
    that.setData({
      timeIntervalSeveral,
      endtimeArr,
    })
  },
  comjumpwxnav(e){
    let type = e.currentTarget.dataset.type;
    app.comjumpwxnav(type);
  },
})