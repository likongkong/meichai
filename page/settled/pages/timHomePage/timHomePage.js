
var Dec = require('../../../../common/public');//aes加密解密js
var api = require("../../../../utils/api.js");
const app = getApp();
const emojiUrl = 'https://web.sdk.qcloud.com/im/assets/emoji/'
const emojiMap = {
  '[NO]': 'emoji_0@2x.png',
  '[OK]': 'emoji_1@2x.png',
  '[下雨]': 'emoji_2@2x.png',
  '[么么哒]': 'emoji_3@2x.png',
  '[乒乓]': 'emoji_4@2x.png',
  '[便便]': 'emoji_5@2x.png',
  '[信封]': 'emoji_6@2x.png',
  '[偷笑]': 'emoji_7@2x.png',
  '[傲慢]': 'emoji_8@2x.png',
  '[再见]': 'emoji_9@2x.png',
  '[冷汗]': 'emoji_10@2x.png',
  '[凋谢]': 'emoji_11@2x.png',
  '[刀]': 'emoji_12@2x.png',
  '[删除]': 'emoji_13@2x.png',
  '[勾引]': 'emoji_14@2x.png',
  '[发呆]': 'emoji_15@2x.png',
  '[发抖]': 'emoji_16@2x.png',
  '[可怜]': 'emoji_17@2x.png',
  '[可爱]': 'emoji_18@2x.png',
  '[右哼哼]': 'emoji_19@2x.png',
  '[右太极]': 'emoji_20@2x.png',
  '[右车头]': 'emoji_21@2x.png',
  '[吐]': 'emoji_22@2x.png',
  '[吓]': 'emoji_23@2x.png',
  '[咒骂]': 'emoji_24@2x.png',
  '[咖啡]': 'emoji_25@2x.png',
  '[啤酒]': 'emoji_26@2x.png',
  '[嘘]': 'emoji_27@2x.png',
  '[回头]': 'emoji_28@2x.png',
  '[困]': 'emoji_29@2x.png',
  '[坏笑]': 'emoji_30@2x.png',
  '[多云]': 'emoji_31@2x.png',
  '[大兵]': 'emoji_32@2x.png',
  '[大哭]': 'emoji_33@2x.png',
  '[太阳]': 'emoji_34@2x.png',
  '[奋斗]': 'emoji_35@2x.png',
  '[奶瓶]': 'emoji_36@2x.png',
  '[委屈]': 'emoji_37@2x.png',
  '[害羞]': 'emoji_38@2x.png',
  '[尴尬]': 'emoji_39@2x.png',
  '[左哼哼]': 'emoji_40@2x.png',
  '[左太极]': 'emoji_41@2x.png',
  '[左车头]': 'emoji_42@2x.png',
  '[差劲]': 'emoji_43@2x.png',
  '[弱]': 'emoji_44@2x.png',
  '[强]': 'emoji_45@2x.png',
  '[彩带]': 'emoji_46@2x.png',
  '[彩球]': 'emoji_47@2x.png',
  '[得意]': 'emoji_48@2x.png',
  '[微笑]': 'emoji_49@2x.png',
  '[心碎了]': 'emoji_50@2x.png',
  '[快哭了]': 'emoji_51@2x.png',
  '[怄火]': 'emoji_52@2x.png',
  '[怒]': 'emoji_53@2x.png',
  '[惊恐]': 'emoji_54@2x.png',
  '[惊讶]': 'emoji_55@2x.png',
  '[憨笑]': 'emoji_56@2x.png',
  '[手枪]': 'emoji_57@2x.png',
  '[打哈欠]': 'emoji_58@2x.png',
  '[抓狂]': 'emoji_59@2x.png',
  '[折磨]': 'emoji_60@2x.png',
  '[抠鼻]': 'emoji_61@2x.png',
  '[抱抱]': 'emoji_62@2x.png',
  '[抱拳]': 'emoji_63@2x.png',
  '[拳头]': 'emoji_64@2x.png',
  '[挥手]': 'emoji_65@2x.png',
  '[握手]': 'emoji_66@2x.png',
  '[撇嘴]': 'emoji_67@2x.png',
  '[擦汗]': 'emoji_68@2x.png',
  '[敲打]': 'emoji_69@2x.png',
  '[晕]': 'emoji_70@2x.png',
  '[月亮]': 'emoji_71@2x.png',
  '[棒棒糖]': 'emoji_72@2x.png',
  '[汽车]': 'emoji_73@2x.png',
  '[沙发]': 'emoji_74@2x.png',
  '[流汗]': 'emoji_75@2x.png',
  '[流泪]': 'emoji_76@2x.png',
  '[激动]': 'emoji_77@2x.png',
  '[灯泡]': 'emoji_78@2x.png',
  '[炸弹]': 'emoji_79@2x.png',
  '[熊猫]': 'emoji_80@2x.png',
  '[爆筋]': 'emoji_81@2x.png',
  '[爱你]': 'emoji_82@2x.png',
  '[爱心]': 'emoji_83@2x.png',
  '[爱情]': 'emoji_84@2x.png',
  '[猪头]': 'emoji_85@2x.png',
  '[猫咪]': 'emoji_86@2x.png',
  '[献吻]': 'emoji_87@2x.png',
  '[玫瑰]': 'emoji_88@2x.png',
  '[瓢虫]': 'emoji_89@2x.png',
  '[疑问]': 'emoji_90@2x.png',
  '[白眼]': 'emoji_91@2x.png',
  '[皮球]': 'emoji_92@2x.png',
  '[睡觉]': 'emoji_93@2x.png',
  '[磕头]': 'emoji_94@2x.png',
  '[示爱]': 'emoji_95@2x.png',
  '[礼品袋]': 'emoji_96@2x.png',
  '[礼物]': 'emoji_97@2x.png',
  '[篮球]': 'emoji_98@2x.png',
  '[米饭]': 'emoji_99@2x.png',
  '[糗大了]': 'emoji_100@2x.png',
  '[红双喜]': 'emoji_101@2x.png',
  '[红灯笼]': 'emoji_102@2x.png',
  '[纸巾]': 'emoji_103@2x.png',
  '[胜利]': 'emoji_104@2x.png',
  '[色]': 'emoji_105@2x.png',
  '[药]': 'emoji_106@2x.png',
  '[菜刀]': 'emoji_107@2x.png',
  '[蛋糕]': 'emoji_108@2x.png',
  '[蜡烛]': 'emoji_109@2x.png',
  '[街舞]': 'emoji_110@2x.png',
  '[衰]': 'emoji_111@2x.png',
  '[西瓜]': 'emoji_112@2x.png',
  '[调皮]': 'emoji_113@2x.png',
  '[象棋]': 'emoji_114@2x.png',
  '[跳绳]': 'emoji_115@2x.png',
  '[跳跳]': 'emoji_116@2x.png',
  '[车厢]': 'emoji_117@2x.png',
  '[转圈]': 'emoji_118@2x.png',
  '[鄙视]': 'emoji_119@2x.png',
  '[酷]': 'emoji_120@2x.png',
  '[钞票]': 'emoji_121@2x.png',
  '[钻戒]': 'emoji_122@2x.png',
  '[闪电]': 'emoji_123@2x.png',
  '[闭嘴]': 'emoji_124@2x.png',
  '[闹钟]': 'emoji_125@2x.png',
  '[阴险]': 'emoji_126@2x.png',
  '[难过]': 'emoji_127@2x.png',
  '[雨伞]': 'emoji_128@2x.png',
  '[青蛙]': 'emoji_129@2x.png',
  '[面条]': 'emoji_130@2x.png',
  '[鞭炮]': 'emoji_131@2x.png',
  '[风车]': 'emoji_132@2x.png',
  '[飞吻]': 'emoji_133@2x.png',
  '[飞机]': 'emoji_134@2x.png',
  '[饥饿]': 'emoji_135@2x.png',
  '[香蕉]': 'emoji_136@2x.png',
  '[骷髅]': 'emoji_137@2x.png',
  '[麦克风]': 'emoji_138@2x.png',
  '[麻将]': 'emoji_139@2x.png',
  '[鼓掌]': 'emoji_140@2x.png',
  '[龇牙]': 'emoji_141@2x.png',
}
const emojiName = [
  '[龇牙]',
  '[调皮]',
  '[流汗]',
  '[偷笑]',
  '[再见]',
  '[敲打]',
  '[擦汗]',
  '[猪头]',
  '[玫瑰]',
  '[流泪]',
  '[大哭]',
  '[嘘]',
  '[酷]',
  '[抓狂]',
  '[委屈]',
  '[便便]',
  '[炸弹]',
  '[菜刀]',
  '[可爱]',
  '[色]',
  '[害羞]',
  '[得意]',
  '[吐]',
  '[微笑]',
  '[怒]',
  '[尴尬]',
  '[惊恐]',
  '[冷汗]',
  '[爱心]',
  '[示爱]',
  '[白眼]',
  '[傲慢]',
  '[难过]',
  '[惊讶]',
  '[疑问]',
  '[困]',
  '[么么哒]',
  '[憨笑]',
  '[爱情]',
  '[衰]',
  '[撇嘴]',
  '[阴险]',
  '[奋斗]',
  '[发呆]',
  '[右哼哼]',
  '[抱抱]',
  '[坏笑]',
  '[飞吻]',
  '[鄙视]',
  '[晕]',
  '[大兵]',
  '[可怜]',
  '[强]',
  '[弱]',
  '[握手]',
  '[胜利]',
  '[抱拳]',
  '[凋谢]',
  '[米饭]',
  '[蛋糕]',
  '[西瓜]',
  '[啤酒]',
  '[瓢虫]',
  '[勾引]',
  '[OK]',
  '[爱你]',
  '[咖啡]',
  '[月亮]',
  '[刀]',
  '[发抖]',
  '[差劲]',
  '[拳头]',
  '[心碎了]',
  '[太阳]',
  '[礼物]',
  '[皮球]',
  '[骷髅]',
  '[挥手]',
  '[闪电]',
  '[饥饿]',
  '[困]',
  '[咒骂]',
  '[折磨]',
  '[抠鼻]',
  '[鼓掌]',
  '[糗大了]',
  '[左哼哼]',
  '[打哈欠]',
  '[快哭了]',
  '[吓]',
  '[篮球]',
  '[乒乓]',
  '[NO]',
  '[跳跳]',
  '[怄火]',
  '[转圈]',
  '[磕头]',
  '[回头]',
  '[跳绳]',
  '[激动]',
  '[街舞]',
  '[献吻]',
  '[左太极]',
  '[右太极]',
  '[闭嘴]',
  '[猫咪]',
  '[红双喜]',
  '[鞭炮]',
  '[红灯笼]',
  '[麻将]',
  '[麦克风]',
  '[礼品袋]',
  '[信封]',
  '[象棋]',
  '[彩带]',
  '[蜡烛]',
  '[爆筋]',
  '[棒棒糖]',
  '[奶瓶]',
  '[面条]',
  '[香蕉]',
  '[飞机]',
  '[左车头]',
  '[车厢]',
  '[右车头]',
  '[多云]',
  '[下雨]',
  '[钞票]',
  '[熊猫]',
  '[灯泡]',
  '[风车]',
  '[闹钟]',
  '[雨伞]',
  '[彩球]',
  '[钻戒]',
  '[沙发]',
  '[纸巾]',
  '[手枪]',
  '[青蛙]',
]
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: 'TIM',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc') || 0,
    uid:'',
    loginid:'',
    // input
    conversation: {},
    message: '',
    extensionArea: false,
    sendMessageBtn: false,
    displayFlag: '',
    isAudio: false,
    bottomVal: 0,
    startPoint: 0,
    popupToggle: false,
    isRecording: false,
    canSend: true,
    text: '按住说话',
    title: ' ',
    notShow: false,
    isShow: true,
    displayServiceEvaluation: false,
    // input 结束
    // 表情
    emojiList:[],
    // 订单列表
    displayTag:false,
    orderList: [
      {
        orderNum: 1,
        time: '2021-7-20 20:45',
        title: '[天博检验]新冠核酸检测/预约',
        description: '专业医学检测，电子报告',
        imageUrl: 'https://sdk-web-1252463788.cos.ap-hongkong.myqcloud.com/component/TUIKit/assets/miles.jpeg',
        price: '80元',
      },
      {
        orderNum: 2,
        time: '2021-7-20 22:45',
        title: '[路边]新冠核酸检测/预约',
        description: '专业医学检测，电子报告',
        imageUrl: 'https://sdk-web-1252463788.cos.ap-hongkong.myqcloud.com/component/TUIKit/assets/miles.jpeg',
        price: '7000元',
      },
    ],
    // 消息列表
    messageList:[],
    // scroll 跳转到最底部
    scrollView:''
  },
  onInputValueChange(event) {
    if (event.detail.value) {
      this.setData({
        message: event.detail.value,
        sendMessageBtn: true,
      })
    } else {
      this.setData({
        sendMessageBtn: false,
      })
    }
  },
  handleClose() {
    this.setData({
      displayFlag: '',
    })
  },
  handleEmoji() {
    let targetFlag = 'emoji'
    if (this.data.displayFlag === 'emoji') {
      targetFlag = ''
    }
    this.setData({
      displayFlag: targetFlag,
    })
  },

  handleSendOrder() {
    this.setData({
      displayTag: !this.data.displayTag,
    })
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

    this.getData();

    // 表情
    for (let i = 0; i < emojiName.length; i++) {
      this.data.emojiList.push({
        emojiName: emojiName[i],
        url: emojiUrl + emojiMap[emojiName[i]],
      })
    }
    this.setData({
      emojiList: this.data.emojiList,
    })



    var arr = [{
      isSelf:true,
      type:'TIMTextElem',
      text:'测试测试测试测试测试测试测试测试测试测试测试测试测试测试',
      isPeerRead:true
    },
    {
      isSelf:true,
      type:'TIMTextElem',
      text:'测试测试测试测试测试测试测试测试测试测试测试测试测试测试',
      isPeerRead:true
    },
    {
      isSelf:false,
      type:'TIMTextElem',
      text:'测试测试测试测试测试测试测试测试测试测试测试测试测试测试',
      isPeerRead:true
    },
    {
      isSelf:true,
      type:'TIMImageElem',
      imageUrl: 'https://sdk-web-1252463788.cos.ap-hongkong.myqcloud.com/component/TUIKit/assets/miles.jpeg',
      isPeerRead:true
    },
    {
      isSelf:false,
      type:'TIMImageElem',
      imageUrl: 'https://sdk-web-1252463788.cos.ap-hongkong.myqcloud.com/component/TUIKit/assets/miles.jpeg',
      isPeerRead:true
    },
    {
      isSelf:true,
      type:'TIMOrderElem',
      imageUrl: 'https://sdk-web-1252463788.cos.ap-hongkong.myqcloud.com/component/TUIKit/assets/miles.jpeg',
      title:'商品名称商品名称商品名称商品名称商品名称',
      description:'介绍介绍介绍介',
      price:'￥80',
      isPeerRead:false
    },
    {
      isSelf:false,
      type:'TIMOrderElem',
      imageUrl: 'https://sdk-web-1252463788.cos.ap-hongkong.myqcloud.com/component/TUIKit/assets/miles.jpeg',
      title:'商品名称',
      description:'说明说明说明',
      price:'￥180',
      isPeerRead:true
    },{
      isSelf:true,
      type:'TIMTextElem',
      text:'测试测试测试测试测试测试测试测试测试测试测试测试测试测试',
      isPeerRead:true
    },
    {
      isSelf:true,
      type:'TIMTextElem',
      text:'测试测试测试测试测试测试测试测试测试测试测试测试测试测试',
      isPeerRead:true
    },
    {
      isSelf:false,
      type:'TIMTextElem',
      text:'测试测试测试测试测试测试测试测试测试测试测试测试测试测试',
      isPeerRead:true
    },
    {
      isSelf:true,
      type:'TIMImageElem',
      imageUrl: 'https://sdk-web-1252463788.cos.ap-hongkong.myqcloud.com/component/TUIKit/assets/miles.jpeg',
      isPeerRead:true
    },
    {
      isSelf:false,
      type:'TIMImageElem',
      imageUrl: 'https://sdk-web-1252463788.cos.ap-hongkong.myqcloud.com/component/TUIKit/assets/miles.jpeg',
      isPeerRead:true
    },
    {
      isSelf:true,
      type:'TIMOrderElem',
      imageUrl: 'https://sdk-web-1252463788.cos.ap-hongkong.myqcloud.com/component/TUIKit/assets/miles.jpeg',
      title:'商品名称商品名称商品名称商品名称商品名称',
      description:'介绍介绍介绍介',
      price:'￥80',
      isPeerRead:false
    },
    {
      isSelf:false,
      type:'TIMOrderElem',
      imageUrl: 'https://sdk-web-1252463788.cos.ap-hongkong.myqcloud.com/component/TUIKit/assets/miles.jpeg',
      title:'商品名称',
      description:'说明说明说明',
      price:'￥180',
      isPeerRead:true
    },]

    this.setData({
        messageList:arr,
    },() => {
      // scorll 跳转到最后
      setTimeout(() => {
        this.setData({
          // scrollView:`item${_this.data.messageList.length}`
          scrollView:`item${arr.length}`
        }) 
      }, 50);

    })


    




  },
  // 获取数据
  getData(num=1){
    var _this = this;
    
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
    this.getData(2)
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

  handleExtensions() {
    let targetFlag = 'extension'
    if (this.data.displayFlag === 'extension') {
      targetFlag = ''
    }
    this.setData({
      displayFlag: targetFlag,
    })
  },
  handleSendPicture() {
    this.sendImageMessage('camera')
  },
  handleSendImage() {
    this.sendImageMessage('album')
  },
  sendImageMessage(type) {
    wx.chooseImage({
      sourceType: [type],
      count: 1,
      success: (res) => {
        if (res) {
          const message = wx.$TUIKit.createImageMessage({
            to: this.getToAccount(),
            conversationType: this.data.conversation.type,
            payload: {
              file: res,
            },
            onProgress: percent => {
              message.percent = percent
            },
          })
          this.$sendTIMMessage(message)
        }
      },
    })
  },
  handleShootVideo() {
    this.sendVideoMessage('camera')
  },
  handleSendVideo() {
    this.sendVideoMessage('album')
  },
  sendVideoMessage(type) {
    wx.chooseVideo({
      sourceType: [type], // 来源相册或者拍摄
      maxDuration: 60, // 设置最长时间60s
      camera: 'back', // 后置摄像头
      success: (res) => {
        if (res) {
          const message = wx.$TUIKit.createVideoMessage({
            to: this.getToAccount(),
            conversationType: this.data.conversation.type,
            payload: {
              file: res,
            },
            onProgress: percent => {
              message.percent = percent
              console.log(message, '777')
            },
          })
          this.$sendTIMMessage(message)
        }
      },
    })
  },
// 表情
appendMessage(e) {
  this.setData({
    message: this.data.message + e.currentTarget.dataset.name,
    sendMessageBtn: true,
  })
},

})
