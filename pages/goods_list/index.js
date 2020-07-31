//引入 用来发送请求的 方法 一定要把路径补全
//request表示导入函数返回的
import { request } from "../../request/index.js"; 
//引入⽀持es7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';

/**
 * 1 用户上滑页面，滚动条触底，开始加载下一页数据
 *   1 找到滚动条的触底事件，微信小程序官方开发文档寻找
 *   2 判断还有没有下一页数据
 *        1 获取到总页数 只有总条数
 *             总页数 = Math.ceil(总条数 / 页容量 pagesize)
 *             总页数 = Math.ceil(23 / 10) = 3 ，向上取整
 *        2 获取到当前的页面 pageNum
 *        3 判断一下 当前的页码是否大于等于 总页数
 *   3 假设没有下一页数据，弹出一个提示
 *   4 假设还有下一页数据，来加载下一页数据
 * 
 * 2 下拉刷新页面
 *   1 触发下拉刷新页面 需要在页面的json文件中开启一个配置项来开启
 *        找到触发下拉刷新的事件
 *   2 重置数据数组
 *   3 重置页码 设置为1
 *   4 重新发送请求
 *   5 数据请求回来，需要手动的关闭，等待效果
 */


// pages/goods_list/index.js
Page({

     /**
      * 页面的初始数据
      */
     data: { 
          // 商品列表顶部
          tabs:[
               {
                    id:0,
                    value: "综合",
                    isActive: true
               },
               { 
                    id:1,
                    value: "销量",
                    isActive: false
               },
               {
                    id:2,
                    value: "价格",
                    isActive: false
               }
          ],

          goodsList: []
     },

     

     // 接口要的参数
     QueryParams:{
          query: "",
          cid: "",
          pagenum: 1,
          pagesize: 10
     },

     // 总页数
     totalPages: 1,

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          this.QueryParams.cid = options.cid;
          this.getGoodsList();
     },

     // 获取商品列表数据
     async getGoodsList(){
          const res = await request({url:"/goods/search",data:this.QueryParams});
          // 获取总条数
          const total = res.total;
          // 计算总页数
          this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
          // console.log(this.totalPages);

          this.setData({
               // 拼接了数组
               goodsList: [...this.data.goodsList,...res.goods]
          })

          // 下拉刷新，更新数据完时，关闭下拉刷新的窗口，如果没有调用下拉刷新的的窗口，直接关闭也不会报错
          wx.stopPullDownRefresh();
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

     // 页面上滑，滚动条触底事件
     onReachBottom(){
          // 1 判断还有没有写一页数据
          if(this.QueryParams.pagenum >= this.totalPages){
               // 没有下一页数据
               // console.log();
               wx.showToast({title: '没有下一页数据'});
          }else{
               // 还有下一页数据
               this.QueryParams.pagenum++;
               // 再次获取商品列表数据
               this.getGoodsList();
          }
     },

     // 下拉刷新事件
     onPullDownRefresh(){
          //1 重置数组 
          this.setData({
               goodsList: []
          })
          // 2 重置页码
          this.QueryParams.pagenum = 1;
          // 3 发送请求
          this.getGoodsList();

     }
     

})