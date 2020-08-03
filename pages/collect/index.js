// pages/collect/index.js
Page({

     /**
      * 页面的初始数据
      */
     data: {
           collect: [],

           // 列表顶部
           tabs:[
               {
                    id:0,
                    value: "商品收藏",
                    isActive: true
               },
               { 
                    id:1,
                    value: "品牌收藏",
                    isActive: false
               },
               {
                    id:2,
                    value: "店铺收藏",
                    isActive: false
               },
               {
                    id:3,
                    value: "浏览足迹",
                    isActive: false
               }
          ],

     },

     onShow(){
          const collect = wx.getStorageSync("collect") || [];
          this.setData({
               collect
          });
            
     },

     // 点击标题事件，从子组件传递过来（在子组件那边定义，这里实现具体的）
     handleTabsItemChange(e){
          // 1 获取被点击的标题索引
          const {index} = e.detail;
           // 2 修改源数组
           let {tabs} = this.data;
           // 判断使标题菜单点亮与否 (v,i)表示什么？v是循环项，i是索引，注意
           tabs.forEach((v,i) => i === index ? v.isActive = true : v.isActive = false);
           // 3 赋值到data
           this.setData({
                tabs
           })
     },

})