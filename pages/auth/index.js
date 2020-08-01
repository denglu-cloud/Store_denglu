import {request} from "../../request/index.js"
//引入⽀持es7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';
import { login } from "../../utils/asyncWx.js"; 
// pages/auth/index.js
Page({
     // 获取用户信息
     async handleGetUserInfo(e){
         try {
               // 1 获取用户信息
               const{encryptedData,rawData,iv,signature} = e.detail;
               // 2 获取小程序登录成功后的code
               const { code } = await login();
               const loginParams = {encryptedData,rawData,iv,signature,code};
               // 3 发送请求，获取用户的token
               const {token} = await request({url:"/users/wxlogin",data:loginParams,method:"post"});

               // 在这里写假冒的token不行的，在pay/index.js那边可以？？？？
               // const {token} = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
               wx.setStorageSync("token", token);
               // 授权成功之后就返回去，1就是上一层，同理2就是上两层...
               wx.navigateBack({
                    delta: 1
               });
         } catch (error) {
              console.log(error);
         }
           
           

            
     }
})