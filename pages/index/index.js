//引入 用来发送请求的 方法 一定要把路径补全
//request表示导入函数返回的
import { request } from "../../request/index.js";

//Page Object
Page({
  data: {
    // 轮播图数组
    swiperList: [],
    catesList: [],
    floorList: []
  },

  // 页面开始加载 就会触发
  onLoad: function(options) {
    // 1 发送异步请求获取轮播图数据  优化的手段可以通过es6的 promise来解决这个问题 
  //   wx.request({
  //     url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
  //     success: (result) => {
  //       this.setData({ 
  //         swiperList: result.data.message
  //       })
  //     }
  //   });  
  // }

  //下面是优化上面的代码
  this.getSwiperList();
  this.getCateList();
  this.getFloorList();
  
 }, 

 //获取轮播图数据
 getSwiperList(){
  request({
    //url会被放到request/index.js中的...params
    url : "/home/swiperdata"})
    //以后嵌套调用，就在后面直接.then就行，就不会发生地狱回调了
    .then(result => {
      this.setData({ 
        // swiperList: result.data.message
        //result.data.message已经在request那边提取公共部分合并了
        swiperList: result
      }) 
    })
 },

 //获取分类导航数据
 getCateList(){
  request({
    //url会被放到request/index.js中的...params
    // url : "https://api-hmugo-web.itheima.net/api/public/v1/home/catitems"})
    //提取url的公共部分
    url : "/home/catitems"})
    //以后嵌套调用，就在后面直接.then就行，就不会发生地狱回调了
    .then(result => {
      this.setData({ 
        catesList: result
      }) 
    })
 },

 //获取楼层数据
 getFloorList(){
  request({
    //url会被放到request/index.js中的...params
    url : "/home/floordata"})
    //以后嵌套调用，就在后面直接.then就行，就不会发生地狱回调了
    .then(result => {
      this.setData({ 
        floorList: result
      }) 
    })
 },
  
});
  