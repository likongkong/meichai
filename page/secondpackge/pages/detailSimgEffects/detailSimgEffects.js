var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '全景展示', // -正品折扣多一点
    c_arrow: true,
    c_backcolor: '#fff',
    txtcolor:'#000000',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    fullview:[], 
    windowHeight:0,
    prenum:0, //上一个位置
    scalevalue:0,  //比率值
    nownum:0, //当前位置
    windowWidth:0,  //屏幕宽度
    timeOut:'', //定时器
    autorotation:true,  //是否自动旋转
    duration:500 //持续时间
  },
  onLoad: function (options) {
    var _this = this;

    wx.showLoading({title: '加载中...',})

    var exh = Dec.Aese('mod=getinfo&operation=overallView&uid=' + app.signindata.uid + '&loginid=' + app.signindata.loginid +'&gid='+options.gid);

    console.log(app.signindata.comurl + 'goods.php?mod=getinfo&operation=overallView&uid=' + app.signindata.uid + '&loginid=' + app.signindata.loginid +'&gid='+options.gid)

    wx.request({
      url: app.signindata.comurl + 'goods.php' + exh,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log('3D图片列表===========',res)
        if (res.data.ReturnCode == 200) {
          for(var i = 0; i<res.data.List.overAllView.length;i++){
            if(i == 0)  _this.data.fullview.push({active:true,img:res.data.List.overAllView[i]})
            else  _this.data.fullview.push({active:false,img:res.data.List.overAllView[i]})
          }
          _this.setData({
            bgimg:res.data.info.overAllViewBackGround,
            fullview:_this.data.fullview
          })
          wx.getSystemInfo({
            success: function (res) {
              _this.setData({
                windowHeight:res.windowHeight-_this.data.statusBarHeightMc,
                scalevalue:res.windowWidth/_this.data.fullview.length,
                windowWidth:res.windowWidth,
                nownum:res.windowWidth,
                prenum:res.windowWidth,
              });
            }
          });
        } else {
          app.showToastC(res.data.msg);
        };
      },
      fail: function () { }
    });
    
  },
  onShow(){
    this.autorotationFun();
  },
  //页面隐藏
  onHide(){
    clearInterval(this.data.timeOut);
  },
  //页面卸载
  onUnload(){
    clearInterval(this.data.timeOut);
  },
  switchChange(e){
    if(e.detail.value){
      this.setData({autorotation: true});
      this.autorotationFun();
    }else{
      this.setData({autorotation: false});
      clearInterval(this.data.timeOut);
    }
  },
  autorotationFun(){
    let _this = this;
    if(_this.data.autorotation){
      let time = setInterval(function () {
        if(_this.data.nownum <= 0){
          _this.setData({nownum:_this.data.windowWidth,prenum:_this.data.windowWidth})
        }
        _this.setData({nownum:_this.data.nownum - _this.data.scalevalue})
        _this.moveFun(_this.data.nownum,_this.data.prenum);
      },_this.data.duration)
      _this.setData({
        timeOut: time
      });
    }
  },
  // 手指触摸
  handletouchstart(event){
    this.setData({prenum:event.touches[0].pageX})
  },
  // 手指触摸后移动
  handletouchmove(event){
    let nownum = event.touches[0].pageX;
    let prenum = this.data.prenum;
    this.moveFun(nownum,prenum);
  },
  moveFun(nownum,prenum){
    let images = this.data.fullview;
    console.log(' 当前值'+nownum +' 上一个值'+prenum +' 相差值'+ this.differencevalue(prenum,nownum) +' 比率值'+this.data.scalevalue)
    let differencevalue = this.differencevalue(prenum,nownum)
    if(differencevalue >= this.data.scalevalue){
      this.setData({prenum:nownum})
      this.setData({nownum:nownum})
      for(var i = 0;i<images.length;i++){
        if(images[i].active){
          images[i].active = false;
          if(prenum > nownum){
            i === images.length-1? i=0: i++;
          }else{
            i === 0? i=images.length-1: i--;
          }
          images[i].active = true;
          this.setData({fullview:images})
          break;
        }
      }
    }
  },
  
  differencevalue(prenum,nownum){
    if(prenum > nownum){
      return prenum - nownum
    }else{
      return nownum - prenum
    }
  }
  
})
