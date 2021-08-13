const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    num: {
      type: Number,
      observer(newVal){
        console.log(newVal)
      }
    }
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
  },
   /**
   * 组件的方法列表
   */
  methods: {

  }
})