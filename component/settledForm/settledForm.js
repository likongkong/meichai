
var COS = require('../../common/cos-wx-sdk-v5.js');
var Dec = require('../../common/public.js'); //aes加密解密js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      observer(newVal){
        console.log(newVal)
      }
    },
    num: {
      type: Number,
      observer(newVal){
        console.log(newVal)
      }
    },
    isEdit:{
      type: Boolean,
      observer(newVal){
        console.log(newVal)
      }
    },
    statusBarHeightMc:{type: Number},
    brandInfo: {
      type: Object,
      observer(newVal){
        console.log(newVal)
      }
    },
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
    },
    ready: function(){
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 页面的初始数据
   */
  data: {
    errorDom:''
  },
   /**
   * 组件的方法列表
   */
  methods: {
    onKeyInput(e){
      let obj = {};
      obj.name = e.currentTarget.dataset.name;
      obj.value = e.detail.value.trim();
      this.setData({errorDom:''});
      this.triggerEvent("bindchange",obj)
    },
    uploadImage(e){
      let storagelocation = e.currentTarget.dataset.storagelocation;
      let name = e.currentTarget.dataset.name;
      let ind = e.currentTarget.dataset.index;
      var cos = new COS({
        SecretId: 'AKIDmY0RxErYIm2TfkckG8mEYbcNA4wYsPbe',
        SecretKey: '4WkpgJ5bJlU4B6wNuCG4EDyVnGWUFhw1',
      });
      
      // 先选择文件，得到临时路径
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图original还是压缩图compressed，默认用原图
        sourceType: ['camera','album'], // 'album'相册  camera 相机
        success: (res) => {
          wx.showLoading({
            title: '上传中...',
          })
          var filePath = res.tempFiles[0].path;
          //获取最后一个.的位置
          var index= filePath.lastIndexOf(".");
          //获取后缀
          var ext = filePath.substr(index+1);
          var filename = filePath.substr(filePath.lastIndexOf('/') + 1);
          cos.postObject({
                Bucket: 'brand-settled-info-1300990269',
                Region: 'ap-beijing',
                Key: `${storagelocation}/${new Date().getTime()}_${app.signindata.uid}.${ext}`,
                FilePath: filePath,
                onProgress: function (info) {  //上传进度
                    // console.log(JSON.stringify(info));
                }
              },(err, data) => {
                wx.hideLoading()
                let src = `list[${ind}].src`;
                this.setData({[src]: `https://${data.Location}`})
                this.triggerEvent("bindchange", {value:data.Location,name:name});
              }
          );
        }
      });
    },
    scrollto(e){
      const query = this.createSelectorQuery();
      query.select(`#${e}`).boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec((res)=>{
        console.log(res);
        if(res[0] && res[1]){
          this.setData({
            errorDom:e
          })
          wx.pageScrollTo({
            scrollTop: res[0].top + res[1].scrollTop - this.data.statusBarHeightMc,
            duration:200
          })
        }
      })
    }
  }
   
})