/**
 * 1 页面加载的时候
 *   1 从缓存中获取购物车的数据 渲染到页面中
 *     这些数据，checked=true
 * 2 微信支付
 *   1 哪些人 哪些账号 可以实现微信支付
 *        1 企业账号
 *        2 企业账号的小程序后台中，必须给开发者添加上白名单
 *             1 一个AppId可以同时绑定多个开发者
 *             2 这些开发者就可以公用这个AppId和他的开发权限
 * 3 支付按钮
 *   1 先判断缓存汇总有没有token
 *   2 没有，跳转到授权页面，进行获取token
 *   3 有token
 *   4 创建订单，获取订单编号
 *   5 已经完成了微信支付
 *   6 手动删除缓存中 已经被选中了的商品
 *   7 删除后的购物车数据，填充回缓存
 *   8 再跳转页面
 */

//引入 用来发送请求的 方法 一定要把路径补全
//引入自定义的promise函数，request表示导入函数返回
import { getSetting,chooseAddress,openSetting,showModal,showToast,requestPayment} from "../../utils/asyncWx.js"; 
//引入⽀持es7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';
import {request} from "../../request/index.js";


Page({

     data:{
          address:{},
          cart: [],
          totalPrice: 0,
          totalNum: 0
     },

     // 相对onload，常用的动作就用onShow
     onShow(){
          // 1 获取缓存中的收货地址信息
          const address = wx.getStorageSync("address");
          // 1 获取缓存中的购物车数据,这个cart数据从哪来的？？？ 在商品详情goods_detail点击购物车时加入了缓存
          // wx.getStorageSync("cart") || []：表示若wx.getStorageSync("cart")为空就等于[]
          let cart = wx.getStorageSync("cart") || [];

          // 过滤后的购物车数组  相对也结算页面最大的区别就在这
          cart= cart.filter(v => v.checked)
          this.setData({address});


          // 设置购物车状态同时，重新计算，底部工具栏的数据，全选，总价格，购买的数量
          // 里面又调用setData
          // 总价格，总数量
          let totalPrice = 0;
          let totalNum = 0;
          cart.forEach(v => {
               if(v.checked){
                    totalPrice += v.num * v.goods_price;
                    totalNum += v.num;
               }
          })

          this.setData({
               cart,
               totalPrice,
               totalNum,
               address
          });
          wx.setStorageSync("cart",cart);
          
     },

     // 点击支付
     async handleOrderPay(){

          try {
                    // 1 判断缓存中有没有token
               // const token = wx.getStorageSync("token");
               // 在这里写假冒的token是可以的，注意这是假的！！！
               const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
               
               
               // 2 判断
               if(!token){
                    wx.navigateTo({
                         url: '/pages/auth/index'
                         
                    });
                    return;
               }
               // 3 创建订单
               // 3.1 准备请求头参数
               // const header = {Authorization: token};
               // 3.2 准备，请求体参数
               const order_price = this.data.totalPrice;
               const consignee_addr = this.data.address.all;
               const cart = this.data.cart;
               let goods = [];
               cart.forEach(v => goods.push({
                    goods_id : v.goods_id,
                    goods_number : v.num,
                    goods_price : v.goods_price
               }))
               const orderParams = {order_price,consignee_addr,goods};
               // 4 准备发送请求，创建订单，获取订单编号
               // const order_number = await request({url:"/my/orders/create",method:"POST",data:orderParams});
               // 上一行的变量order_number加上{ }有什么作用？
               const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams });

               //5 发起预支付接口
               const {pay} =await request({url:"/my/orders/req_unifiedorder",method:"POST",data:{order_number}})
               //6 进行微信扫码支付，这一步会弹出支付二维码，但是由于我的是假的token，所以这一步开始动不了了！！！
               await requestPayment(pay);
               // 7 查询后台 订单状态
               const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number }});
               await showToast({ title: "支付成功" });
               // 8 手动删除缓存中 已经支付了的商品，注意这里是先拿还没有过滤掉的cart购物车数据
               let newCart=wx.getStorageSync("cart");
               //过滤，留下来未被选中的
               newCart=newCart.filter(v=>!v.checked);
               wx.setStorageSync("cart", newCart);
          
               // 8 支付成功了 跳转到订单页面
               wx.navigateTo({
                    url: '/pages/order/index'
               });
        
          } catch (error) {
               // await showToast({ title: "支付失败" })
               const title = "支付失败，但既然给我了，那我就收下了： -" + this.data.totalPrice + "￥"
               await showToast({ title: title }) 
               console.log(error);
               

               // 注意，这里主要是为了测试，所以支付失败也会跳转到成功页面！！！！！
               //=============================================================================
               // 8 手动删除缓存中 已经支付了的商品，注意这里是先拿还没有过滤掉的cart购物车数据
               let newCart=wx.getStorageSync("cart");
               //过滤，留下来未被选中的
               newCart=newCart.filter(v=>!v.checked);
               wx.setStorageSync("cart", newCart);
                // 8 支付成功了 跳转到订单页面
                wx.navigateTo({
                    url: '/pages/order/index'
               });
               //=============================================================================
          }

     }

})
