/**
 * 1 点击“+”图标，触发tap点击事件
 *   1 调用小程序内置的选择图片的api
 *   2 获取到图片的路径，数组
 *   3 把图片路径，存在data的变量中
 *   4 页面就可以根据图片数组，进行循环显示，自定义组件
 * 2 点击自定义图片组件
 *   1 获取被点击的元素的索引
 *   2 获取data中的图片数组
 *   3 根据索引数组中删除对应的元素
 *   4 把数组重新设置回data中
 * 3 点击提交按钮上传图片
 *   1 获取文本域的内容，类似输入框框获取
 *        1 data中定义变量，表示，输入框的内
 *        2 文本域绑定输入事件，事件触发的时候，把输入框的值传入到变量中
 *   2 对这个内容，合法性验证
 *   3 验证通过，用户选择的图片，上传到专门的图片服务器中，返回图片外网的链接
 *        1 遍历图片数组
 *        2 挨个上传
 *        3 自己再维护图片数组，存放图片上传后的外网的链接
 *   4 文本域和外网的图片的路径，一起提交到服务器，我们只是做下简单的前端模拟，不会真的发数据存到后台
 *   5 清空当前页面
 *   6 返回上一页
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
          ],
          // 被选中的图片路径，数组
          textVal: ""
     },
     
     // 外网的图片的路径数组
     UpLoadImgs: [],

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
     },

     // 点击自定义图片组件，删除图片
     handleRemoveImg(e){
          // 获取被点击的组件的索引
          const {index} = e.currentTarget.dataset;
          // 3 获取data中图片数组
          let {chooseImgs} = this.data;
          // 4 删除元素
          chooseImgs.splice(index,1)
          this.setData({
               chooseImgs
          })

     },

     // 文本域的输入的时事件
     handleTextInput(e){
          this.setData({
               textVal: e.detail.value
          })

     },

     // 点击提交按钮
     handleFormSubmit(){
          // 1 获取文本域的内容
          const {textVal,chooseImgs} = this.data;
          // 2 合法性的验证
          if(!textVal.trim()){
               // 不合法
               wx.showToast({
                    title: '输入不合法',
                    icon: 'none',
                    mask: true,
               });
               return;

          }
          // 3 准备要上传的图片，到专门的图片服务器
          // 上传文件的api不支持，多个文件同时上传，遍历数组，挨个上传
          // 显示正在等待的图片
          wx.showLoading({
               title: "正在上传中",
               mask: true,
          });

          // 判断有没有需要上传的图片数组
          if(chooseImgs.length != 0){
               chooseImgs.forEach((v,i) => {
                    wx.uploadFile({
                         // 图片要上传到哪里
                         url: 'https://img.coolcr.cn/api/upload',
                         // 被上传的文件的路径
                         filePath: v,
                         // 上传的文件的名称，后台来获取文件 file
                         name: "image",
                         // 顺带的文本信息
                         formData: {},
                         success: (result) => {
                              console.log(result);
                              let url = JSON.parse(result.data).url;
                              this.UpLoadImgs.push(url);
     
                              // 所有的图片都上传完毕了才触发，
                              if(i === chooseImgs.length-1){
     
                                   // 隐藏正在加载
                                   wx.hideLoading();
     
                                   console.log("把文本的内容和外网的图片数组，提交到后台中");
                                   // 提交都成功了
                                   // 重置页面
                                   this.setData({
                                        textVal: "",
                                        chooseImgs: []
                                   })
                                   // 返回上一个页面
                                   wx.navigateBack({
                                        delta: 1
                                   });
                                     
     
                              }
     
                         },
                    });
                      
               })
          }else{
               wx.hideLoading();
               console.log("只是提交了文本");
               wx.navigateBack({
                    delta: 1
               });
          }
            

         
     }

})