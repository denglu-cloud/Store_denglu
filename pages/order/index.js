/**
 * 1 页面被打开时的时候，onShow
 *   1 onShow，不同于onLoad，无法在形参上接受，option参数
 *   2 判断缓存中有没有token
 *        1 没有：直接跳到授权页面
 *        2 有：直接往下进行
 *   3 获取url上的参数type
 *   4 根据tupe来决定页面的标题的数组元素，哪个别激活选中
 *   5 根据type,去发送请求获取订单数据
 *   6 渲染页面
 * 2 点击不同的标题，重新发送请求来获取和渲染数据
 */


//引入 用来发送请求的 方法 一定要把路径补全
//request表示导入函数返回的
import { request } from "../../request/index.js"; 
//引入⽀持es7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';

// pages/order/index.js
Page({

     /**
      * 页面的初始数据
      */
     data: {
          orders: [],
          // 商品列表顶部
          tabs:[
               {
                    id:0,
                    value: "全部",
                    isActive: true
               },
               { 
                    id:1,
                    value: "待付款",
                    isActive: false
               },
               {
                    id:2,
                    value: "待发货",
                    isActive: false
               },
               {
                    id:3,
                    value: "退款/退货",
                    isActive: false
               }
          ],

     },

     onShow(options){
          const token = wx.getStorageSync("token");
          console.log(token);
          // const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
          if(!token){
               wx.navigateTo({
                    url: '/pages/auth/index',
     
               });
                 
               return;
          }


          // 1 获取当前的小程序的页面栈-数组，长度最大是10页面
          let pages = getCurrentPages();
          // 2 数组中，索引最大的页面就是当前页面
          let currentPage = pages[pages.length - 1];
          console.log(currentPage.options);
          // 3 获取url上的type参数
          const {type} = currentPage.options;
          // 4 激活选中页面标题，当type=1,index=0
          this.changeTitleByIndex(type - 1);
          this.getOrders(type);

     },

     
     
     //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
     // 仿造url:"/my/orders/all"传回来的数据（由于没有订单数据，储存不了）
     setMyOrder(){
          const order = {};
          // 订单编号
          order.order_number =  "HMDD20190802000000000428";
          // 订单价格
          order.order_price = "13999";
          order.create_time =  "1564731518";
          order.update_time =  "1564731518";
          // order.order_detail =  null;

          this.setData({
               // orders: res.orders
               orders: order
               // 将时间戳改为具体的时间
               // orders: order.map(v => ({...v,create_time_cn:(new Data(v.create_time*1000).toLocaleString())}))

          })
     },
     //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

     // 获取订单列表的方法
     async getOrders(type){
          // 这是原本的数据！！！
          // const res = await request({url:"/my/orders/all",data:{type}});
          // this.setData({
          //      orders: res.orders
          // })


          // 这是伪造的订单数据
          this.setMyOrder();
         

     },

     // 根据标题索引来激活选中，标题数据
     changeTitleByIndex(index){
           // 2 修改源数组
           let {tabs} = this.data;
           // 判断使标题菜单点亮与否 (v,i)表示什么？v是循环项，i是索引，注意
           tabs.forEach((v,i) => i === index ? v.isActive = true : v.isActive = false);
           // 3 赋值到data
           this.setData({
                tabs
           })

     },

     // 点击标题事件，从子组件传递过来（在子组件那边定义，这里实现具体的）
     handleTabsItemChange(e){
          // 1 获取被点击的标题索引
          const {index} = e.detail;
          this.changeTitleByIndex(index);
          // 2 重新发送请求 type=1 index=0
          this.getOrder(index + 1);
     },

})