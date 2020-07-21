
var COS = require('../../common/cos-wx-sdk-v5.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {},
  upload: function(){
    var _this = this;
    var cos = new COS({
      SecretId: 'AKIDmY0RxErYIm2TfkckG8mEYbcNA4wYsPbe',
      SecretKey: '4WkpgJ5bJlU4B6wNuCG4EDyVnGWUFhw1',
    });

    // 先选择文件，得到临时路径
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认用原图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
          console.log(res)
          var filePath = res.tempFiles[0].path;

          //获取最后一个.的位置
          var index= filePath.lastIndexOf(".");
          //获取后缀
          var ext = filePath.substr(index+1);

          var filename = filePath.substr(filePath.lastIndexOf('/') + 1);
          console.log('filename====',filename,'filePath=====',filePath,'ext=====',ext);
          console.log('图片地址===','toyshow/sign/'+ new Date().getTime() +'_'+ app.signindata.uid+ '.'+ext)
          cos.postObject(
              {
                Bucket: 'meichai-1300990269',
                Region: 'ap-beijing',
                Key: 'toyshow/sign/'+ new Date().getTime() +'_'+ app.signindata.uid+ '.'+ext,
                FilePath: filePath,
                onProgress: function (info) {
                    console.log(JSON.stringify(info));
                }
              },
              function (err, data) {
                  console.log(err || data);
              }
          );
      }
    });



  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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
    
  }
})