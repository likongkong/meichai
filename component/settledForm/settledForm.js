var COS = require('../../common/cos-wx-sdk-v5.js');
var Dec = require('../../common/public.js'); //aes加密解密js
const app = getApp();
let timeNum = 120; //60秒倒计时
let countDownTime = timeNum;
let timer; //计时器
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      observer(newVal){
        // console.log(newVal)
      }
    },
    form: {
      type: String,
      // value:'settled',
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
    errorDom:'',
    isExplain:false,
    isCountdown:false,
    phoneCodeValue:'获取验证码',
  },
   /**
   * 组件的方法列表
   */
  methods: {
    noclickTip(e){
      let clicktip = e.currentTarget.dataset.clicktip;
      app.showToastC(clicktip,1500);
    },
    showExplain(e){
      let explaintxt = e.currentTarget.dataset.explaintxt;
      this.setData({
        explaintxt,
        isExplain:true
      })
    },
    hideExplain(){
      this.setData({
        isExplain:false
      })
    },
    getPhoneCode(){
      this.triggerEvent("getPhoneCode");
    },
    onPickerChange3 (e) {
      let name = e.currentTarget.dataset.name;
      let index = e.currentTarget.dataset.index;
      console.log(e)
      let value = `list[${index}].time`;
      this.setData({errorDom:''});
      this.triggerEvent("bindchange", {value:e.detail.dateString,name:name});
    },
    onKeyInput(e){
      let obj = {};
      obj.name = e.currentTarget.dataset.name;
      obj.value = e.detail.value.trim();
      this.setData({errorDom:''});
      this.triggerEvent("bindchange",obj)
    },
    bindRadioChange(e){
      let index = e.currentTarget.dataset.index;
      let name = e.currentTarget.dataset.name;
      let sonindex = e.currentTarget.dataset.sonindex;
      console.log(index,name,sonindex)
      let value = `list[${index}].index`;
      this.setData({errorDom:''});
      // let pages =  getCurrentPages()
      // pages[pages.length -  1].setData({
      //   ['listData2[1].index']: sonindex
      // });
      this.setData({[value]:sonindex})
      this.triggerEvent("bindchange", {value:sonindex,name:name});
    },
    pickerChange(e){
      console.log(e)
      let index = e.currentTarget.dataset.index;
      let groups = e.currentTarget.dataset.groups;
      let value = e.detail.value;
      let groupsIndex = `list[${index}].groupsIndex`;
      this.setData({errorDom:''});
      this.setData({[groupsIndex]:value})
      this.triggerEvent("bindchange", {value:value,name:'logisticsIndex'});
      this.triggerEvent("bindchange", {value:groups[0][value[0]],name:'shipping'});
      this.triggerEvent("bindchange", {value:value[1],name:'shippingPriceStatus'});
    },
    multiseriatePicker(e){
      console.log(e)
      let index = e.currentTarget.dataset.index;
      let value = e.detail.value;
      value[1]=value[1]?value[1]:0
      let groupsIndex = `list[${index}].groupsIndex`;
      this.setData({errorDom:''});
      this.setData({[groupsIndex]:value})
      this.triggerEvent("pickerchange", {value:value,name:'groupsIndex',index:index});
    },
    bindcolumnchange(e){
      this.triggerEvent("columnchange", {column:e.detail.column,value:e.detail.value});
    },
    radioPickerChange(e){
      let index = e.currentTarget.dataset.index;
      let sonindex = e.currentTarget.dataset.sonindex;
      let groups = e.currentTarget.dataset.groups;
      let value = e.detail.value;
      let groupsIndex = `list[${index}].radioArr[${sonindex}].groupsIndex`;
      this.setData({errorDom:''});
      this.setData({[groupsIndex]:value})
      this.triggerEvent("bindchange", {value:value,name:'logisticsIndex'});
      this.triggerEvent("bindchange", {value:groups[0][value[0]],name:'shipping'});
      this.triggerEvent("bindchange", {value:value[1],name:'shippingPriceStatus'});
    },
    showActionSheet(e){
      console.log(e)
      let index = e.currentTarget.dataset.index;
      let name = e.currentTarget.dataset.name;
      this.triggerEvent("showActionSheet",{index:index,name:name});
    },
    deleteitemImage(e){
      let name = e.currentTarget.dataset.name;
      let ind = e.currentTarget.dataset.ind;
      let index = e.currentTarget.dataset.index;
      let imageList = this.data.list[index].imageList;
      console.log('剪前',imageList)
      for (var i = imageList.length - 1; i >= 0; i--) {
        if (i==ind) {
          imageList.splice(i, 1);
        }
      }
      this.setData({[`list[${index}].imageList`]: imageList})
      console.log('剪后',imageList)
      this.triggerEvent("bindchange", {value:imageList,name:name});
    },
    deleteitemVideo(e){
      let name = e.currentTarget.dataset.name;
      let index = e.currentTarget.dataset.index;
      let src = this.data.list[index].src;
      this.setData({[`list[${index}].src`]: ''})
      this.triggerEvent("bindchange", {value:'',name:name});
    },
    uploadVideo(e){
      let mode = e.currentTarget.dataset.mode;
      let storagelocation = e.currentTarget.dataset.storagelocation;
      let name = e.currentTarget.dataset.name;
      let ind = e.currentTarget.dataset.index;
      var cos = new COS({
        SecretId: 'AKIDmY0RxErYIm2TfkckG8mEYbcNA4wYsPbe',
        SecretKey: '4WkpgJ5bJlU4B6wNuCG4EDyVnGWUFhw1',
      });
      
      // 先选择文件，得到临时路径
      wx.chooseMedia({
        count: 1, // 默认9
        mediaType:['video'],
        sourceType: ['album','camera'], // 'album'相册  camera 相机
        success: (res) => {
          wx.showLoading({
            title: '上传中...',
          })
          // console.log(res.tempFiles[0].tempFilePath)

            // return false;
          let imageList = res.tempFiles;
          let promiseList=[];
          imageList.forEach((item, idx) => {
            console.log(item)
            // return false;
            var filePath = item.tempFilePath;
            //获取最后一个.的位置
            var index= filePath.lastIndexOf(".");
            //获取后缀
            var ext = filePath.substr(index+1);
            // var filename = filePath.substr(filePath.lastIndexOf('/') + 1);
            promiseList.push( 
              new Promise((resolve, reject)=>{
                cos.postObject({
                  Bucket: 'mc-1300990269',
                  Region: 'ap-beijing',
                  Key: `${storagelocation}/${new Date().getTime()}${idx}_${app.signindata.uid}.${ext}`,
                  FilePath: filePath,
                  onProgress: function (info) {  //上传进度
                      // console.log(JSON.stringify(info));
                  }
                  },(err, data) => {
                    resolve('https://'+data.Location)
                  }
                );
              })
            )
          })
          // 使用Promise.all进行多视频上传
          Promise.all(promiseList).then(res => {
            wx.hideLoading()
            // console.log(res)     
            this.setData({errorDom:''});
            if(mode=='multiple'){
              let imageList=`list[${ind}].imageList`;
              this.setData({[imageList]: [...this.data.list[ind].imageList,...res]})
              this.triggerEvent("bindchange", {value:this.data.list[ind].imageList,name:name});
            }else{
              let src = `list[${ind}].src`;
              this.setData({[src]: `${res[0]}`})
              console.log(this.data.list[ind].src,ind)
              this.triggerEvent("bindchange", {value:res[0],name:name});
            }
          }).catch((error) => {
            wx.hideLoading()
            wx.showToast({
              title:'上传失败请重试',
              icon:'none'
            })
            console.log(error);
          });
        }
      });
    },
    uploadImage(e){
      let mode = e.currentTarget.dataset.mode;
      let storagelocation = e.currentTarget.dataset.storagelocation;
      let name = e.currentTarget.dataset.name;
      let ind = e.currentTarget.dataset.index;
      var cos = new COS({
        SecretId: 'AKIDmY0RxErYIm2TfkckG8mEYbcNA4wYsPbe',
        SecretKey: '4WkpgJ5bJlU4B6wNuCG4EDyVnGWUFhw1',
      });
      
      // 先选择文件，得到临时路径
      wx.chooseImage({
        count: mode=='multiple'?(10 - this.data.list[ind].imageList.length):1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图original还是压缩图compressed，默认用原图
        sourceType: ['camera','album'], // 'album'相册  camera 相机
        success: (res) => {
          if(mode=='multiple'){
            if ((this.data.list[ind].imageList.length + res.tempFilePaths.length) > 9) {
              wx.showToast({
                  title: "最多只能上传9张",
                  icon: 'none'
               })
              return;
            }
          }
          wx.showLoading({
            title: '上传中...',
          })
          console.log(res)
          let imageList = res.tempFiles;
          let promiseList=[];
          imageList.forEach((item, idx) => {
            console.log(item)
            var filePath = item.path;
            //获取最后一个.的位置
            var index= filePath.lastIndexOf(".");
            //获取后缀
            var ext = filePath.substr(index+1);
            // var filename = filePath.substr(filePath.lastIndexOf('/') + 1);
            promiseList.push( 
              new Promise((resolve, reject)=>{
                cos.postObject({
                  Bucket: 'mc-1300990269',
                  Region: 'ap-beijing',
                  Key: `${storagelocation}/${new Date().getTime()}${idx}_${app.signindata.uid}.${ext}`,
                  FilePath: filePath,
                  onProgress: function (info) {  //上传进度
                      // console.log(JSON.stringify(info));
                  }
                  },(err, data) => {
                    resolve('https://'+data.Location)
                  }
                );
              })
            )
          })
          // 使用Promise.all进行多图上传
          Promise.all(promiseList).then(res => {
            wx.hideLoading()
            // console.log(res)     
            this.setData({errorDom:''});
            if(mode=='multiple'){
              let imageList=`list[${ind}].imageList`;
              this.setData({[imageList]: [...this.data.list[ind].imageList,...res]})
              this.triggerEvent("bindchange", {value:this.data.list[ind].imageList,name:name});
            }else{
              let src = `list[${ind}].src`;
              this.setData({[src]: `${res[0]}`})
              console.log(this.data.list[ind].src,ind)

              this.triggerEvent("bindchange", {value:res[0],name:name});
            }
          }).catch((error) => {
            wx.hideLoading()
            wx.showToast({
              title:'上传失败请重试',
              icon:'none'
            })
            console.log(error);
          });

          return false;
          

         
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
                console.log(data)
                let src = `list[${ind}].src`;
                this.setData({[src]: `https://${data.Location}`})
                this.triggerEvent("bindchange", {value:data.Location,name:name});
              }
          );

        }
      });
    },
    scrollto(e){
      console.log(e)
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
    },
    refreshData(value,index){
      if(value == 0){
        this.setData({
          [`list[${index}].noClick`]:true
        })
      }else{
        this.setData({
          [`list[${index}].noClick`]:false
        })
      }
    }, 
    refreshTimeData(value,index){
      this.setData({
        [`list[${index}].time`]:value
      })
    },

    smsSend(e){
      this.setData({errorDom:''});
      this.triggerEvent("smsSend")
    },
    countDown(){
      if (countDownTime == timeNum) {
        this.countDown1()
        this.setData({
          phoneCodeValue: countDownTime + "s后重试",
          isCountdown:true
        })
      } else {
        this.setData({
          isCountdown:true
        })
      }
    },
    countDown1(){
      const that = this
      timer = setInterval(function() { // 设置定时器
        countDownTime--
        if (countDownTime == 0) {
          clearInterval(timer)
          that.setData({
            phoneCodeValue: "获取验证码",
            isCountdown:false
          })
          countDownTime = timeNum
        } else {
          that.setData({
            phoneCodeValue: countDownTime + "s后重试",
            isCountdown:true
          })
        }
      }, 1000)
    },

    comjumpwxnav(e){
      let type = e.currentTarget.dataset.itemtype;
      let whref = e.currentTarget.dataset.whref;
      let query = e.currentTarget.dataset.query;
      this.setData({errorDom:''});
      if(query){
        app.comjumpwxnav(type,query)
      }else{
        app.comjumpwxnav(type,whref)
      }
    },
  }
   
})