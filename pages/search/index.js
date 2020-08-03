/**
 * 1 输入框绑定，值改变事件，input事件
 *   1 获取到输入框的值
 *   2 合法性判断
 *   3 检验通过，把把输入框的值，发送到后台
 *   4 返回的数据打印到页面上
 * 2 防抖(防止抖动)，定时器，节流
 *   0 防抖，一般输入框中，防止重复输入，重复发送请求
 *   1 节流，一般是用在页面下拉和上拉
 *   2 定义全局的定时器id
 * 
 *   好像还有一个bug,搜索空清空时，下面还有记录的？
 */

//引入 用来发送请求的 方法 一定要把路径补全
//request表示导入函数返回的
import { request } from "../../request/index.js"; 
//引入⽀持es7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';

// pages/search/index.js
Page({

     /**
      * 页面的初始数据
      */
     data: {
          goods: [],
          // 是否显示取消按钮
          isFocus: false,
          // 输入框的值
          inpValue: ""
     }, 


     // 定义全局的定时器id
     TimeId: -1,

     // 输入框的值改变，就会触发的事件
     handleInput(e){
          // 1 获取输入框的值
          const {value} = e.detail;
          // 2 检测合法性
          if(!value.trim()){
               this.setData({
                    goods: [],
                    isFocus: false
                   
               })
               // 值不合法
               return;
          }

         

          // 3 准备发送请求数据
          // 利用定时器，解决搜索抖动问题，比如Xiaomi,有了定时器，就不会输入X就搜，输入i就搜索，
          // 而是每输入一个字母在定时器范围内是不会直接搜索的，而是输入完整才搜索
          this.setData({
               isFocus: true
          })
          clearTimeout(this.TimeId);
          this.TimeId=setTimeout(() => {
               this.qsearch(value);
          },1000);
          // this.qsearch(value);
     },

     // 发送请求获取搜索建议，数据
     async qsearch(query){
          const res = await request({url:"/goods/qsearch",data:{query}});
          console.log(res);

          this.setData({
               goods: res
          })
     },

     handleCancel(){
          this.setData({
               inpValue: "",
               isFocus: false,
               goods: []
          })
     }
})