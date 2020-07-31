/**
 * 1 发送请求获取页面数据
 * 2 点击轮播图 预览大图
 *        1 给轮播图绑定点击事件
 *        2 调用小程序的api previewImage
 * 3 点击，加入购物车
 *        1 先绑定点击事件
 *        2 获取缓存中的购物车数据 数组格式
 *        3 先判断，当前的商品是否已经存在于购物车
 *        4 已经存在，修改商品的数据，执行购物车数量++，重新把购物车数组填充回缓存中
 *        5 不存在于购物车的数组中，直接给购物车数组添加一个新元素，新元素带上购买数量属性num,
 *          重新把购物车数组填充回缓存中
 *        6 弹出提示
 *        
 */


//引入 用来发送请求的 方法 一定要把路径补全
//request表示导入函数返回的
import { request } from "../../request/index.js"; 
//引入⽀持es7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';

// pages/goods_detail/index.js
Page({

     /**
      * 页面的初始数据
      */
     data: {
          // 这是一个对象 注意!!!
          goodsObj: {}
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          // 为什么options可以获取到url中的id???
          const {goods_id} = options;
          // console.log(goods_id);
          this.getGoodsDetail(goods_id)
     },

     // 商品对象
     GoodsInfo: {},

     // 获取商品详情数据
     async getGoodsDetail(goods_id){
          const goodsObj = await request({url:"/goods/detail",data:{goods_id}});
          // 赋值给GoodsInfo使下面的放大预览可见
          this.GoodsInfo = goodsObj;
          this.setData({
               // url返回的链接会有很多数据，但是很多是用不到的，用不要的数据传到微信小程序这里就会导致变慢，所以主动接受需要的数据就行
               goodsObj:{
                    goods_name:goodsObj.goods_name,
                    goods_price:goodsObj.goods_price,
                    // iphone部分手机，不识别，webp图片格式
                    // 最好找后台，让它进行修改
                    // 临时自己改，确保后台存在1.webp => 1.jpg
                    //  / /：表示正则，g表示全部
                    goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
                    pics:goodsObj.pics
               }
          })
     },

     // 点击轮播图，放大预览
     handlePreviewImage(e){
          // 1 先构造要预览的图片数组（GoodsInfo.pics.map就是）
          // v表示是什么
          const urls = this.GoodsInfo.pics.map(v => v.pics_mid);      
          // 2 接受传递过来的图片url
          const current = e.currentTarget.dataset.url; 
          wx.previewImage({
               // 点击谁（current：一个）要预览谁（urls：数组）
               // current: urls[0],
               // urls: urls,

                // 点击谁要预览谁，这个是怎么做到的？
               current,
               urls
          })
     },

     // 点击加入购物车
     handleCartAdd(){
          // 1 获取缓存中的购物车 数组
          // || []：表示转化为数组
          let cart = wx.getStorageSync("cart") || [];
          // 2 判断商品对象是否存在于购物车数组中
          let index = cart.findIndex(v=>v.goods_id === this.GoodsInfo.goods_id);
          if(index === -1){
               // 不存在，第一次添加
               this.GoodsInfo.num = 1;
               cart.push(this.GoodsInfo);
          }else{
               // 4 已经存在购物车数据，执行num++
               cart[index].num++;
          }
          // 5 把购物车重新添加回缓存中
          wx.setStorageSync("cart",cart);
          // 6 弹窗提示
          wx.showToast({
               title: '加入成功',
               icon: 'success',
               // true 防止用户手抖，疯狂点击按钮
               mask:true,

          })

     }

})