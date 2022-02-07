
var Dec = require('../../../../common/public');//aes加密解密js

var COS = require('../../../../common/cos-wx-sdk-v5.js');
const app = getApp();
const emojiUrl = 'https://web.sdk.qcloud.com/im/assets/emoji/'
const emojiMap = {'[NO]':'emoji_0@2x.png','[OK]':'emoji_1@2x.png','[下雨]':'emoji_2@2x.png','[么么哒]':'emoji_3@2x.png','[乒乓]':'emoji_4@2x.png','[便便]':'emoji_5@2x.png','[信封]':'emoji_6@2x.png','[偷笑]':'emoji_7@2x.png','[傲慢]':'emoji_8@2x.png','[再见]':'emoji_9@2x.png','[冷汗]':'emoji_10@2x.png','[凋谢]':'emoji_11@2x.png','[刀]':'emoji_12@2x.png','[删除]':'emoji_13@2x.png','[勾引]':'emoji_14@2x.png','[发呆]':'emoji_15@2x.png','[发抖]':'emoji_16@2x.png','[可怜]':'emoji_17@2x.png','[可爱]':'emoji_18@2x.png','[右哼哼]':'emoji_19@2x.png','[右太极]':'emoji_20@2x.png','[右车头]':'emoji_21@2x.png','[吐]':'emoji_22@2x.png','[吓]':'emoji_23@2x.png','[咒骂]':'emoji_24@2x.png','[咖啡]':'emoji_25@2x.png','[啤酒]':'emoji_26@2x.png','[嘘]':'emoji_27@2x.png','[回头]':'emoji_28@2x.png','[困]':'emoji_29@2x.png','[坏笑]':'emoji_30@2x.png','[多云]':'emoji_31@2x.png','[大兵]':'emoji_32@2x.png','[大哭]':'emoji_33@2x.png','[太阳]':'emoji_34@2x.png','[奋斗]':'emoji_35@2x.png','[奶瓶]':'emoji_36@2x.png','[委屈]':'emoji_37@2x.png','[害羞]':'emoji_38@2x.png','[尴尬]':'emoji_39@2x.png','[左哼哼]':'emoji_40@2x.png','[左太极]':'emoji_41@2x.png','[左车头]':'emoji_42@2x.png','[差劲]':'emoji_43@2x.png','[弱]':'emoji_44@2x.png','[强]':'emoji_45@2x.png','[彩带]':'emoji_46@2x.png','[彩球]':'emoji_47@2x.png','[得意]':'emoji_48@2x.png','[微笑]':'emoji_49@2x.png','[心碎了]':'emoji_50@2x.png','[快哭了]':'emoji_51@2x.png','[怄火]':'emoji_52@2x.png','[怒]':'emoji_53@2x.png','[惊恐]':'emoji_54@2x.png','[惊讶]':'emoji_55@2x.png','[憨笑]':'emoji_56@2x.png','[手枪]':'emoji_57@2x.png','[打哈欠]':'emoji_58@2x.png','[抓狂]':'emoji_59@2x.png','[折磨]':'emoji_60@2x.png','[抠鼻]':'emoji_61@2x.png','[抱抱]':'emoji_62@2x.png','[抱拳]':'emoji_63@2x.png','[拳头]':'emoji_64@2x.png','[挥手]':'emoji_65@2x.png','[握手]':'emoji_66@2x.png','[撇嘴]':'emoji_67@2x.png','[擦汗]':'emoji_68@2x.png','[敲打]':'emoji_69@2x.png','[晕]':'emoji_70@2x.png','[月亮]':'emoji_71@2x.png','[棒棒糖]':'emoji_72@2x.png','[汽车]':'emoji_73@2x.png','[沙发]':'emoji_74@2x.png','[流汗]':'emoji_75@2x.png','[流泪]':'emoji_76@2x.png','[激动]':'emoji_77@2x.png','[灯泡]':'emoji_78@2x.png','[炸弹]':'emoji_79@2x.png','[熊猫]':'emoji_80@2x.png','[爆筋]':'emoji_81@2x.png','[爱你]':'emoji_82@2x.png','[爱心]':'emoji_83@2x.png','[爱情]':'emoji_84@2x.png','[猪头]':'emoji_85@2x.png','[猫咪]':'emoji_86@2x.png','[献吻]':'emoji_87@2x.png','[玫瑰]':'emoji_88@2x.png','[瓢虫]':'emoji_89@2x.png','[疑问]':'emoji_90@2x.png','[白眼]':'emoji_91@2x.png','[皮球]':'emoji_92@2x.png','[睡觉]':'emoji_93@2x.png','[磕头]':'emoji_94@2x.png','[示爱]':'emoji_95@2x.png','[礼品袋]':'emoji_96@2x.png','[礼物]':'emoji_97@2x.png','[篮球]':'emoji_98@2x.png','[米饭]':'emoji_99@2x.png','[糗大了]':'emoji_100@2x.png','[红双喜]':'emoji_101@2x.png','[红灯笼]':'emoji_102@2x.png','[纸巾]':'emoji_103@2x.png','[胜利]':'emoji_104@2x.png','[色]':'emoji_105@2x.png','[药]':'emoji_106@2x.png','[菜刀]':'emoji_107@2x.png','[蛋糕]':'emoji_108@2x.png','[蜡烛]':'emoji_109@2x.png','[街舞]':'emoji_110@2x.png','[衰]':'emoji_111@2x.png','[西瓜]':'emoji_112@2x.png','[调皮]':'emoji_113@2x.png','[象棋]':'emoji_114@2x.png','[跳绳]':'emoji_115@2x.png','[跳跳]':'emoji_116@2x.png','[车厢]':'emoji_117@2x.png','[转圈]':'emoji_118@2x.png','[鄙视]':'emoji_119@2x.png','[酷]':'emoji_120@2x.png','[钞票]':'emoji_121@2x.png','[钻戒]':'emoji_122@2x.png','[闪电]':'emoji_123@2x.png','[闭嘴]':'emoji_124@2x.png','[闹钟]':'emoji_125@2x.png','[阴险]':'emoji_126@2x.png','[难过]':'emoji_127@2x.png','[雨伞]':'emoji_128@2x.png','[青蛙]':'emoji_129@2x.png','[面条]':'emoji_130@2x.png','[鞭炮]':'emoji_131@2x.png','[风车]':'emoji_132@2x.png','[飞吻]':'emoji_133@2x.png','[飞机]':'emoji_134@2x.png','[饥饿]':'emoji_135@2x.png','[香蕉]':'emoji_136@2x.png','[骷髅]':'emoji_137@2x.png','[麦克风]':'emoji_138@2x.png','[麻将]':'emoji_139@2x.png','[鼓掌]':'emoji_140@2x.png','[龇牙]':'emoji_141@2x.png',}
const emojiName = ['[龇牙]','[调皮]','[流汗]','[偷笑]','[再见]','[敲打]','[擦汗]','[猪头]','[玫瑰]','[流泪]','[大哭]','[嘘]','[酷]','[抓狂]','[委屈]','[便便]','[炸弹]','[菜刀]','[可爱]','[色]','[害羞]','[得意]','[吐]','[微笑]','[怒]','[尴尬]','[惊恐]','[冷汗]','[爱心]','[示爱]','[白眼]','[傲慢]','[难过]','[惊讶]','[疑问]','[困]','[么么哒]','[憨笑]','[爱情]','[衰]','[撇嘴]','[阴险]','[奋斗]','[发呆]','[右哼哼]','[抱抱]','[坏笑]','[飞吻]','[鄙视]','[晕]','[大兵]','[可怜]','[强]','[弱]','[握手]','[胜利]','[抱拳]','[凋谢]','[米饭]','[蛋糕]','[西瓜]','[啤酒]','[瓢虫]','[勾引]','[OK]','[爱你]','[咖啡]','[月亮]','[刀]','[发抖]','[差劲]','[拳头]','[心碎了]','[太阳]','[礼物]','[皮球]','[骷髅]','[挥手]','[闪电]','[饥饿]','[困]','[咒骂]','[折磨]','[抠鼻]','[鼓掌]','[糗大了]','[左哼哼]','[打哈欠]','[快哭了]','[吓]','[篮球]','[乒乓]','[NO]','[跳跳]','[怄火]','[转圈]','[磕头]','[回头]','[跳绳]','[激动]','[街舞]','[献吻]','[左太极]','[右太极]','[闭嘴]','[猫咪]','[红双喜]','[鞭炮]','[红灯笼]','[麻将]','[麦克风]','[礼品袋]','[信封]','[象棋]','[彩带]','[蜡烛]','[爆筋]','[棒棒糖]','[奶瓶]','[面条]','[香蕉]','[飞机]','[左车头]','[车厢]','[右车头]','[多云]','[下雨]','[钞票]','[熊猫]','[灯泡]','[风车]','[闹钟]','[雨伞]','[彩球]','[钻戒]','[沙发]','[纸巾]','[手枪]','[青蛙]',]
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '',
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
    orderList: [],
    // 消息列表
    messageList:[],
    // scroll 跳转到最底部
    scrollView:'',
    imageUrl:'',
    messageType:1, // 1 文本 2 图片 3 订单
    order:''
  },
  // 发送图片
  sendTextMessageThree(){
    this.data.messageType = 3;
    this.sendTextMessage();
  },
  // 发送图片
  sendTextMessageTwo(imageUrl){
    this.data.messageType = 2;
    this.data.imageUrl = imageUrl;
    this.sendTextMessage();
  },
  // 消息发送
  sendTextMessageOne(){
     if(this.data.message){
        this.data.messageType = 1;
        this.sendTextMessage();
     }else{
        app.showToastC('发送消息不能为空');
     };
  },
  // 发送消息
  sendTextMessage(){
    var _this = this;

    if(_this.data.order && _this.data.messageType == 3){
      var q1 = Dec.Aese('mod=userSig&operation=pushInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&to_userid='+_this.data.from_userid + '&type=' + _this.data.messageType + '&order_id='+_this.data.order.order_id+'&order_name=' + _this.data.order.order_name+'&photo_url=' + _this.data.order.photo_url +'&price=' + _this.data.order.price+'&style=' + _this.data.order.style+'&group_id='+_this.data.group_id);

      console.log('mod=userSig&operation=pushInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&to_userid='+_this.data.from_userid + '&type=' + _this.data.messageType + '&order_id='+_this.data.order.order_id+'&order_name=' + _this.data.order.order_name+'&photo_url=' + _this.data.order.photo_url +'&price=' + _this.data.order.price+'&style=' + _this.data.order.style+'&group_id='+_this.data.group_id)
    }else{
      var q1 = Dec.Aese('mod=userSig&operation=pushInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&to_userid='+_this.data.from_userid+'&msg=' + _this.data.message + '&type=' + _this.data.messageType + '&url='+_this.data.imageUrl+'&group_id='+_this.data.group_id);

      console.log('mod=userSig&operation=pushInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&to_userid='+_this.data.from_userid+'&msg=' + _this.data.message + '&type=' + _this.data.messageType + '&url='+_this.data.imageUrl+'&group_id='+_this.data.group_id)
    };

    

    wx.showLoading({title: '加载中...',mask:true})
    wx.request({
      url: app.signindata.comurl + 'im.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        console.log('提交消息=====',res)
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
            _this.setData({
               message:'',
               imageUrl:'',
               sendMessageBtn: false,
               order:''
            })
            _this.getData();
        }else{
          wx.showModal({
            content: res.data.Msg || res.data.msg,
            showCancel:false,
            success: function (res) {}
          });          
        };
      },

    })
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
    console.log('options',options)
    var _this = this;
    wx.hideShareMenu();

    this.setData({
      from_userid:options.id,
      order:options.order?JSON.parse(options.order):'',
      group_id:options.groupid || 0
    });
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

    if(_this.data.order){
      wx.showModal({
        content: '是否发送订单信息',
        cancelText:"否",
        confirmText:"是",
        success: function(res) {
          if (res.confirm) {
            _this.sendTextMessageThree();
          }else{
            _this.getData();
          }
        }
      });
    }else{
      this.getData();
    };

    // 每隔段时间请求数据
    this.data.timer = setInterval(() => {
        this.getData();
    }, 5000);
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


  },
  // 获取数据
  getData(num=1){
    var _this = this;

    if (num==1){
      _this.setData({countOrder:0,conversationList : [],page : 1,nodataiftr:false});
    }else{
      var pagenum = _this.data.page;
      _this.data.page = ++pagenum;
    };

    var q1 = Dec.Aese('mod=userSig&operation=newsDetail&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&from_userid='+_this.data.from_userid);

    console.log('mod=userSig&operation=newsDetail&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&from_userid='+_this.data.from_userid)

    // wx.showLoading({title: '加载中...',mask:true})

    wx.request({
      url: app.signindata.comurl + 'im.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        console.log('消息详情=====',res)
        wx.stopPullDownRefresh();
        // wx.hideLoading();
        if (res.data.ReturnCode == 200) {
            var messageList = res.data.List || [];
            if(messageList.length != 0){
                for(var i=0 ; i<messageList.length ; i++){
                    if(messageList[i].type == 1){
                      messageList[i].renderDom = _this.parseText(messageList[i])
                    };
                };
            };
            if (num==1){
                console.log(1111111111)
                _this.setData({
                  messageList,
                  c_title:res.data.Info.nick || ''
                },()=>{
                    // scorll 跳转到最后
                    setTimeout(() => {
                      _this.setData({
                        scrollView:`lastView`
                      }) 
                    }, 100);
                });
                
            }else{
              console.log(22222222)
              if(messageList && messageList.length !=0){
                _this.setData({
                  messageList:[..._this.data.messageList,...messageList]
                },()=>{
                    // scorll 跳转到最后
                    setTimeout(() => {
                      _this.setData({
                        scrollView:`lastView`
                      }) 
                    }, 50);
                });
              }else{
                app.showToastC('暂无更多数据');
              };
            };
        }else{
          wx.showModal({
            content: res.data.Msg || res.data.msg,
            showCancel:false,
            success: function (res) {}
          });          
        };
      },

    })
  },

  // 监听聊天图片加载
  imageLoad(e){
    console.log('图片加载完成')
    this.setData({
      // scrollView:`item${_this.data.messageList.length}`
      scrollView:`lastView`
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
    clearInterval(this.data.timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer)
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
    var _this = this;
    wx.chooseImage({
      sourceType: [type],
      count: 1,
      success: (res) => {
        if (res) {
          console.log(res)
          _this.upload(res)
        }
      },
    })
  },

  // 表情
  appendMessage(e) {
    console.log(e.currentTarget.dataset.name)
    this.setData({
      message: this.data.message + e.currentTarget.dataset.name,
      sendMessageBtn: true,
    })
  },
  // 解析小程序text, 表情信息也是[嘻嘻]文本
  parseText:function (message) {
    const renderDom = []
    let temp = message.msg;
    let left = -1
    let right = -1
    while (temp !== '') {
      left = temp.indexOf('[')
      right = temp.indexOf(']')
      switch (left) {
        case 0:
          if (right === -1) {
            renderDom.push({
              name: 'span',
              text: temp,
            })
            temp = ''
          } else {
            const _emoji = temp.slice(0, right + 1)
            if (emojiMap[_emoji]) {
              renderDom.push({
                name: 'img',
                src: emojiUrl + emojiMap[_emoji],
              })
              temp = temp.substring(right + 1)
            } else {
              renderDom.push({
                name: 'span',
                text: '[',
              })
              temp = temp.slice(1)
            }
          }
          break
        case -1:
          renderDom.push({
            name: 'span',
            text: temp,
          })
          temp = ''
          break
        default:
          renderDom.push({
            name: 'span',
            text: temp.slice(0, left),
          })
          temp = temp.substring(left)
          break
      }
    }
    return renderDom
  },

  upload: function(res,ind,id){
    
    var _this = this;
    var cos = new COS({
      SecretId: 'AKIDmY0RxErYIm2TfkckG8mEYbcNA4wYsPbe',
      SecretKey: '4WkpgJ5bJlU4B6wNuCG4EDyVnGWUFhw1',
    });
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    console.log(res)
    var filePath = res.tempFiles[0].path;

    //获取最后一个.的位置
    var index= filePath.lastIndexOf(".");
    //获取后缀
    var ext = filePath.substr(index+1);

    var filename = filePath.substr(filePath.lastIndexOf('/') + 1);
    console.log('filename====',filename,'filePath=====',filePath,'ext=====',ext);
    console.log('图片地址===','timMessage/images/'+ new Date().getTime() +'_'+ app.signindata.uid+ '.'+ext)
    cos.postObject(
        {
          Bucket: 'meichai-1300990269',
          Region: 'ap-beijing',
          Key: 'timMessage/images/'+ new Date().getTime() +'_'+ app.signindata.uid+ '.'+ext,
          FilePath: filePath,
          onProgress: function (info) {
              console.log(JSON.stringify(info));
          }
        },
        function (err, data) {
            console.log(data);
            if(data){ 
                _this.sendTextMessageTwo('https://'+data.Location)
            }else{
              wx.hideLoading()
            };
            console.log('err============',err)
            if(err){
                wx.showModal({
                  content: err,
                  showCancel:false,
                  success: function (res) {}
                });
            }



        }
    );



  },


})
