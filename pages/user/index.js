// pages/user/index.js
Page({
 
     /**
      * 页面的初始数据
      */
     data: {
          userinfo: {},
          // 被收藏的商品的数量
          collectNums: 0

     },

     onShow(){
          const userinfo = wx.getStorageSync("userinfo");
          const collect = wx.getStorageSync("collect")||[];

          this.setData({
               userinfo,
               // 注意冒号就是赋值
               collectNums: collect.length
          });
            
     }

})