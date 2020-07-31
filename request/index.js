// 同时发送一步代码的次数,用于控制是否显示“加载中”的图标 注意
let ajaxTimes = 0;

//这是es6的promise函数  以后要专门学习一下
export const request = (params)=>{
    // 将请求次数+1
    ajaxTimes++;
    
    // 显示加载中图标效果
    wx.showLoading({
      title: "加载中",
      // 显示蒙版会把手势遮住
      mask: true
    })

    // 定义公共的url
    const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1"

    //resolve表示成功时执行的回调函数，reject表示失败时执行的回调函数
    return new Promise((resolve,reject)=>{
      wx.request({
        //先接受参数,但是又什么用？ 
        ...params,
        //合并url,合并上面的公共部分
        url: baseUrl + params.url, 
        success:(result)=>{
          // resolve(result);
          resolve(result.data.message);
        },
        fail:(err)=>{   
          reject(err);
        },

        complete:()=>{
          // 请求完成就将请求次数-1
          ajaxTimes--;
          if(ajaxTimes === 0)
            // 关闭正在等待的图标
            wx.hideLoading();
        }
      });
    })  
  }