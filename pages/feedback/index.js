/**
 * 1 点击“+”图标，触发tap点击事件
 *   1 调用小程序内置的选择图片的api
 *   2 获取到图片的路径，数组
 *   3 把图片路径，存在data的变量中
 *   4 页面就可以根据图片数组，进行循环显示，自定义组件
 */

// pages/feedback/index.js
Page({

     /**
      * 页面的初始数据
      */
     data: {
          // 被选中的图片路径，数组
          chooseImgs: [],
           // 商品列表顶部
           tabs:[
               {
                    id:0,
                    value: "体验问题",
                    isActive: true
               },
               { 
                    id:1,
                    value: "商品、商家投诉",
                    isActive: false
               }
          ]
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

     // 点击添加图片
     handleChooseImg(){
          // 2 调用小程序内置的选择图片api
          wx.chooseImage({
               // 同时选中的图片的最大数量
               count: 9,
               // 图片的质量，原图，还是压缩
               sizeType: ['original', 'compressed'],
               // 图片的来源，相册还是照相机
               sourceType: ['album', 'camera'],
               success: (result) => {
                    this.setData({
                         // 图片数组，进行拼接,三个小点是拼接运算符，this.data.chooseImgs是原来的数组，把现在的result.temFilePahts拼接在一起
                         chooseImgs: [...this.data.chooseImgs,...result.tempFilePaths]
                    })
               },
          });
     }

})