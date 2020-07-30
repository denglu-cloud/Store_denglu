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
          this.getCates();
     },

     //获取分类数据
     getCates(){
          request({
               url: "https://api-hmugo-web.itheima.net/api/public/v1/categories"
          })
          .then(res => { 
               this.Cates = res.data.message;

               //构建左侧的大菜单数据
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
           * 注意一下
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