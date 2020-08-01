/**
 * 1 获取用户的收货地址
 *   1 绑定点击事件
 *   2 调用小程序内置 api 获取用户的收货地址 wx.chooseAddress
 *        1 假设用户点击获取收货地址的权限转态 scope
 *          scope值true直接调用获取收货地址
 *        2 假设用户从来没有调用过收货地址的api
 *          scope undefined直接调用获取收货地址
 *        3 假设用户点击获取收货地址的提示框，取消
 *          scope值为false
 *        4 把获取到的收货地址 存入到 本地存储中
 * 2 页面加载完毕
 *   0 onLoad onShow
 *   1 获取本地存储中的地址数据
 *   2 把数据设置给data中的一个变量
 * 3 onShow
 *   0 回到了商品详情页面，第一次添加商品的时候，手动新添加了新的属性
 *        1 num=1;
 *        2 checked=true;
 *   1 获取缓存中的购物车数组
 *   2 把购物车数据 填充到data中
 * 4 全选的实现 数据的展示
 *   1 onShow 获取缓存中的购物车数组
 *   2 根据购物车中的商品数据，所有的商品都被选中，checked=true,全选就被选中
 * 5 总价格和总数量
 *   1 都需要商品被选中，我们才拿它来计算
 *   2 获取购物车数组
 *   3 遍历
 *   4 判断商品是否被选中
 *   5 总价格 += 商品的单价 * 商品的数量‘
 *   5 总数量 += 商品的数量
 *   6 把计算后的价格和数量，设置会data中即可
 * 6 商品的选中
 *   1 绑定change事件
 *   2 获取到别修改的商品对象
 *   3 商品对象的选中状态，取反
 *   4 重新填充回data中和缓存中
 *   5 重新计算全选，总价格，总数量
 * 7 全选和反选
 *   1 全选复选框绑定事件 change
 *   2 获取data中的全选变量 allChecked
 *   3 直接取反 allChecked = !allChecked
 *   4 遍历购物车数组，让里面商品选中状态跟随，allChecked,改变而改变
 *   5 把购物车数组 和 allChecked,重新设置会data，把购物车重新设置会缓存中
 * 8 商品数量的编辑
 *   1 "+" "-"按钮绑定同一个点击事件，区分的关键就是自定义属性
 *        1 "+" "+1"
 *        2 "-" "-1"
 *   2 传递被点击的商品id goods_id
 *   3 获取data中的购物车数组，来获取需要被修改的商品对象
 *   4-0 当购物车的数量=1时，同时用户点击“-”时
 *        弹窗提示(showModal),询问用户，是否要删除
 *        1 确定，直接执行删除
 *        2 取消，什么都不做
 *   4-1 直接修改商品对象的数量 num
 *   5 把cart数组 重新设置回缓存中，和data中this.setCart
 */

//引入 用来发送请求的 方法 一定要把路径补全
//引入自定义的promise函数，request表示导入函数返回
import { getSetting,chooseAddress,openSetting,showModal } from "../../utils/asyncWx.js"; 
//引入⽀持es7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

     data:{
          address:{},
          cart: [],
          allChecked:false,
          totalPrice: 0,
          totalNum: 0
     },

     // 相对onload，常用的动作就用onShow
     onShow(){
          // 1 获取缓存中的收货地址信息
          const address = wx.getStorageSync("address");
          // 1 获取缓存中的购物车数据,这个cart数据从哪来的？？？ 在商品详情goods_detail点击购物车时加入了缓存
          // wx.getStorageSync("cart") || []：表示若wx.getStorageSync("cart")为空就等于[]
          const cart = wx.getStorageSync("cart") || [];

          // // 1 计算全选
          // // every数组方法，会遍历，会接受一个回调函数，那么每一个回调函数都会返回true,那么every方法的返回值为true
          // // 只要有一个回调函数返回了false,那么不再循环执行，直接返回false
          // // 空数组，注意，调用every，返回值就是true
          // let allChecked = true;
          // // 1 总价格、总数量
          // let totalPrice = 0;
          // let totalNum = 0;
          // cart.forEach(v => {
          //      if(v.checked){
          //           totalPrice += v.num * v.goods_price;
          //           totalNum += v.num;
          //      }else{
          //           allChecked = false;
          //      }
          // })
          // // 判断数组是否为空
          // allChecked = cart.length != 0 ? allChecked : false;
          // // 2 给data赋值
          // this.setData({
          //      address,
          //      cart,
          //      allChecked,
          //      totalPrice,
          //      totalNum
          // })

          // 版本3
          this.setData({address});
          this.setCart(cart);
          
     },

     // 版本1
     // // 点击收货地址
     // handleChooseAddress(){ 
     //      // 1 获取授权页面设置 
     //      wx.getSetting({
     //           success: (result) => {
     //                // 2 获取权限状态 主要发现一些属性名很怪异的时候，都要使用[]的形式来获取属性值(比如，["scope.address"])
     //                const scopeAddress = result.authSetting["scope.address"];
     //                if(scopeAddress === true || scopeAddress === undefined){
     //                      // 2 获取收货地址
     //                     wx.chooseAddress({
     //                          success: (result1) => {
     //                               console.log(result1);
     //                          }, 
     //                     });
     //                }else{
     //                     // 3 用户以前拒绝过授予权限，先诱导用户打开授权页面设置
     //                     wx.openSetting({
     //                          success: (result2) => {
     //                               // 4 可以调用收货地址代码
     //                               wx.chooseAddress({
     //                                    success: (result3) => {
     //                                         console.log(result3);
     //                                    },
     //                               });
     //                          },
     //                     });
                           
     //                }
     //           },
     //           fail: () => {},
     //           complete: () => {}
     //      });
     // }

     // 改进上面的代码1 版本2
     // 点击收货地址
     async handleChooseAddress(){
          try {
               // 1 获取权限状态 
               // await是和async同时出现的。await等待getSetting的出现
               const res1 = await getSetting();
               const scopeAddress = res1.authSetting["scope.address"];
               // 2 判断权限状态
               if(scopeAddress === false){
                    await openSetting();
               }
               // 4 调用获取收货地址的 api
               let address = await chooseAddress();
               // address.all的all这个属性怎么来的？
               address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo;
               // 5 存入到缓存中
               wx.setStorageSync("address",address);
          } catch (error) {
               console.log(error);
          }
     },

     // 商品的选中
     handleItemChange(e){
          // 1 获取被修改的商品的id  
          // wxml中传过来的数据是保存在哪里的？
          // （wxml那边写的代码:<checkbox-group data-id="{{item.goods_id}}" bindchange="handleItemChange">）
          const goods_id = e.currentTarget.dataset.id;
          // 2 获取购物车数组，下面的data又是指什么？指js文件中的data{ }?
          let {cart} = this.data;
          // 3 找到被修改的商品对象
          let index = cart.findIndex(v => v.goods_id === goods_id);
          // 4 选中状态取反
          cart[index].checked = !cart[index].checked;

          this.setCart(cart);
     },

     // 版本3
     // 设置购物车状态同时，重新计算，底部工具栏的数据，全选，总价格，购买的数量
     // 里面又调用setData
     setCart(cart){
          let allChecked = true;
          // 总价格，总数量
          let totalPrice = 0;
          let totalNum = 0;
          cart.forEach(v => {
               if(v.checked){
                    totalPrice += v.num * v.goods_price;
                    totalNum += v.num;
               }else{
                    allChecked = false
               }
          })
          // 判断数组是否为空
          allChecked = cart.length != 0 ? allChecked : false;
          this.setData({
               cart,
               totalPrice,
               totalNum,
               allChecked
          });
          wx.setStorageSync("cart",cart);
     },

     // 商品全选功能
     handleItemAllChecked(){
          // 1 获取data中的数据
          let {cart,allChecked} = this.data;
          // 2 修改值
          allChecked = !allChecked;
          // 3 循环修改cart数组中的商品选中状态
          cart.forEach(v => v.checked = allChecked);
          // 4 把修改后的值，填充回data或者缓存中
          this.setCart(cart);
     },

     // 商品数量的编辑功能
     async handleItemNumEdit(e){
          // 1 获取传递过来的参数
          const {operation,id} = e.currentTarget.dataset;
          // 2 获取购物车数组
          let {cart} = this.data;
          // 3 找到需要修改的商品的索引
          const index = cart.findIndex(v => v.goods_id === id);
          // 4 判断是否要执行删除
          if(cart[index].num === 1 && operation === -1){
               // 4-0 弹窗提示
               const result = await showModal({content:"您是否要删除？"})
               if (result.confirm) {
                    // 删除一个
                    cart.splice(index,1);
                    this.setCart(cart);
               }


               // // 4-0 弹窗提示
               // wx.showModal({
               //      title: '提示',
               //      content: '你是否要删除',
               //      success: (result) => {
               //           if (result.confirm) {
               //                // 删除一个
               //                cart.splice(index,1);
               //                this.setCart(cart);
               //           }else if(result.cancel){
               //                console.log('用户点击取消')

               //           }
               //      },
               // });
                 
          }else{
               // 4-1 进行修改数量
          cart[index].num += operation;
          // 5 设置会缓存和data中
          this.setCart(cart);
          }
     }
})