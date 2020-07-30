//这是es6的promise函数  以后要专门学习一下
export const request = (params)=>{
    // 定义公共的url
    const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1"

    //resolve表示成功时执行的回调函数，reject表示失败时执行的回调函数
    return new Promise((resolve,reject)=>{
      wx.request({
        //先接受参数,但是又什么用？ 
        ...params,
        //合并url,合并上面的公共部分
        url:baseUrl + params.url,
        success:(result)=>{
          resolve(result);
        },
        fail:(err)=>{   
          reject(err);
        }
      });
    })  
  }