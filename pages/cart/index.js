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
 */
Page({
     // 点击收货地址
     handleChooseAddress(){ 
          // 1 获取授权页面设置 
          wx.getSetting({
               success: (result) => {
                    // 2 获取权限状态 主要发现一些属性名很怪异的时候，都要使用[]的形式来获取属性值(比如，["scope.address"])
                    const scopeAddress = result.authSetting["scope.address"];
                    if(scopeAddress === true || scopeAddress === undefined){
                          // 2 获取收货地址
                         wx.chooseAddress({
                              success: (result1) => {
                                   console.log(result1);
                              },
                         });
                    }else{
                         // 3 用户以前拒绝过授予权限，先诱导用户打开授权页面设置
                         wx.openSetting({
                              success: (result2) => {
                                   // 4 可以调用收货地址代码
                                   wx.chooseAddress({
                                        success: (result3) => {
                                             console.log(result3);
                                        },
                                   });
                              },
                         });
                           
                    }
               },
               fail: () => {},
               complete: () => {}
          });
            
            
     }

})