var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '美拆', // -正品折扣多一点
    c_arrow: true,
    c_backcolor: '#fff',
    txtcolor:'#000000',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    images:[
      {active:true,img:'https://cdn.shopify.com/s/files/1/0701/0143/products/Death_Milk_WarmThoughts_Turnarounds_01_800x.png?v=1589337531'},
      {active:false,img:'https://cdn.shopify.com/s/files/1/0701/0143/products/Death_Milk_WarmThoughts_Turnarounds_08_800x.png?v=1589337531'},
      {active:false,img:'https://cdn.shopify.com/s/files/1/0701/0143/products/Death_Milk_WarmThoughts_Turnarounds_07_800x.png?v=1589337531'},
      {active:false,img:'https://cdn.shopify.com/s/files/1/0701/0143/products/Death_Milk_WarmThoughts_Turnarounds_06_800x.png?v=1589337531'},
      {active:false,img:'https://cdn.shopify.com/s/files/1/0701/0143/products/Death_Milk_WarmThoughts_Turnarounds_05_800x.png?v=1589337531'},
      {active:false,img:'https://cdn.shopify.com/s/files/1/0701/0143/products/Death_Milk_WarmThoughts_Turnarounds_04_800x.png?v=1589337531'},
      {active:false,img:'https://cdn.shopify.com/s/files/1/0701/0143/products/Death_Milk_WarmThoughts_Turnarounds_03_800x.png?v=1589337531'},
      {active:false,img:'https://cdn.shopify.com/s/files/1/0701/0143/products/Death_Milk_WarmThoughts_Turnarounds_02_800x.png?v=1589337531'},
    ],
    prenum:0,
    scalevalue:0
  },
  onLoad: function () {
    var _this = this;

    wx.showLoading({title: '加载中...',})
    var exh = Dec.Aese('mod=show&operation=liveShowList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + exh,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log('3D图片列表===========',res)
        if (res.data.ReturnCode == 200) {

        } else {
          app.showToastC(res.data.Msg);
        };
      },
      fail: function () { }
    });






    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          scalevalue:res.windowWidth/_this.data.images.length
        });
      }
    });










  },
  // 手指触摸
  handletouchstart(event){
    this.setData({prenum:event.touches[0].pageX})
  },
  // 手指触摸后移动
  handletouchmove(event){
    let nownum = event.touches[0].pageX;
    let prenum = this.data.prenum;
    let images = this.data.images;
    console.log('当前值'+nownum,'上一个值'+prenum,'相差值'+ this.differencevalue(prenum,nownum))
    let differencevalue = this.differencevalue(prenum,nownum)
    if(differencevalue > this.data.scalevalue){
      this.setData({prenum:nownum})
      for(var i = 0;i<images.length;i++){
        if(images[i].active){
          images[i].active = false;
          if(prenum > nownum){
            i === images.length-1? i=0: i++;
          }else{
            i === 0? i=images.length-1: i--;
          }
          images[i].active = true;
          this.setData({images:images})
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
