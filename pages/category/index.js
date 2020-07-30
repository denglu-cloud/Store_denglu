//引入 用来发送请求的 方法 一定要把路径补全
//request表示导入函数返回的
import { request } from "../../request/index.js";

Page({

     /**
      * 页面的初始数据
      */
     data: {
         //左侧的菜单数据
         leftMenuList:[],
         //右侧的商品数据
         rightContent:[],
         //表点击的左侧的菜单
          currentIndex: 0

     },

     //接口的返回数据
     Cates:[],

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          /**
           * 使用缓存
           * 
           * 0 web中的本地储存和小程序中的本地储存的区别
           *   1 写代码的方式不一样了
           *        web:localStotage.setItem("key","value") localStorage.getItem("key")
           *        小程序中：wx.setStorageSync("cates",{time:Data.now(),data:this.Cates});
           *   2 存的时候有，有没有做类型转换
           *        web:不管存入的是什么类型的数据，最终都会先调用下 toString(),把数据变成了字符串 再存入进去
           *        小程序：不存在类型转换的这个操作，存什么类似的数据进去，获取的时候就是什么类型
           * 1 先判断一下本地储存中有没有旧的数据
           *   {time:Date.now(),data:[...]
           * 2 没有旧的数据，直接发送新请求
           * 3 有旧的数据，同时旧的数据也没有过期，就使用本地储存中的旧数据即可
           */
          // 1 获取本地存储中的数据（小程序中也是存在本地储存技术的）
          const Cates = wx.getStorageSync("cates");
          // 2 判断
          if(!Cates){
               // 不存在，发送请求获取数据,getCates就是下面的分类方法
               this.getCates();
          }else{
               // 有旧的数据，定义一个过期时间，假设10s
               if(Date.now() - Cates.time > 1000 * 10){  
                    //过期,重新发送请求
                    this.getCates();
               }else{
                    //获取旧的数据
                    this.Cates = Cates.data;

                    //构建左侧的菜单数据
                    let leftMenuList = this.Cates.map(v => v.cat_name);
                    //构建右侧的商品数据
                    let rightContent = this.Cates[0].children;
                    this.setData({
                         leftMenuList,
                         rightContent      
                         
                    })
               }
              
          }
     },

     //获取分类数据
     getCates(){
          request({
               url: "https://api-hmugo-web.itheima.net/api/public/v1/categories"
          })
          .then(res => { 
               this.Cates = res.data.message;

               // 把接口的数据存入到本地储存中
               wx.setStorageSync("cates",{time:Date.now(),data:this.Cates});

               //构建左侧的菜单数据
               let leftMenuList = this.Cates.map(v => v.cat_name);
               //构建右侧的商品数据
               let rightContent = this.Cates[0].children;
               this.setData({
                    leftMenuList,
                    rightContent      
                    
               })
          })
     },

     // 左侧菜单的点击事件
     handleItemTap(e){
          /**
           * 1 获取被点击的标题身上的索引 从.wxml文件中获取
           * 2 给data中的currentIndex赋值就可以了
           * 3 根据不同的索引来渲染右侧的商品内容
           */
          const {index} = e.currentTarget.dataset;

           //更新右侧的商品数据
           let rightContent = this.Cates[index].children;

          this.setData({
               currentIndex:index,
               rightContent
          })

         
     }

     
})