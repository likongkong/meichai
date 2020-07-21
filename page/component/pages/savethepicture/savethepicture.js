
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl:'',
    //  预览图数据
    imgArr: [], 
    ng_images: [], 

    c_title: '',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90, 
    is_txt:false,
    txt:'' 
  },
  // 图片预览
  previewImg: function (w) {
    var index = w.currentTarget.dataset.index || w.target.dataset.index||0;
    var imgArr = this.data.imgArr;
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.type==1){
     this.setData({
       is_txt: true,
       txt: options.txt||''
     })
    }else{
      var url = decodeURIComponent(options.imgurl);
    
      this.setData({
        imgurl: url,
        imgArr: [url],
        is_txt: false
      });
    }

  },
  // 图片等比例缩放
  imageLoad: function (e) {
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height; 
    var viewWidth = wx.getSystemInfoSync().windowWidth,    //设置图片显示宽度
      viewHeight = viewWidth / ratio; 
    var image = this.data.ng_images;
    //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
    image[e.target.dataset.index] = {
      width: viewWidth,
      height: viewHeight
    };
    this.setData({ 
      ng_images: image
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})