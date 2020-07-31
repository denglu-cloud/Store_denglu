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
 */

//引入 用来发送请求的 方法 一定要把路径补全
//request表示导入函数返回的
import { getSetting,chooseAddress,openSetting } from "../../utils/asyncWx.js"; 
//引入⽀持es7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
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

     // 改进上面的代码
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
               const address = await chooseAddress();
               // 5 存入到缓存中
               wx.serStorageSync("adress",adress);
          } catch (error) {
               console.log(error);
          }
     }

})