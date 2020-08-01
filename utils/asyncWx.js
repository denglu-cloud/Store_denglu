// promise 形式 getSetting
export const getSetting = () =>{
    return new Promise((resolve,reject) => {
        wx.getSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
          
        });
          
    })
} 

// promise 形式 chooseAddress
export const chooseAddress = () =>{
    return new Promise((resolve,reject) => {
        wx.chooseAddress({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
          
        });
          
    })
} 


// promise 形式 openSetting
export const openSetting = () =>{
    return new Promise((resolve,reject) => {
        wx.openSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
          
        });
          
    })
} 

// promise形式showModal
export const showModal=({content}) => {
    return new Promise((resolve,reject) => {
        wx.showModal({
            title: '提示',
            // 提示内容content可在外面自定义
            content: content,
            success: (result) => {
                resolve(result);
                //  if (result.confirm) {
                //       // 删除一个
                //       cart.splice(index,1);
                //       this.setCart(cart);
                //  }else if(result.cancel){
                //       console.log('用户点击取消')

                //  }
            },
            fail:(err) => {
                reject(err);
            }
       });
    })
}


// promise形式 showToast
export const showToast=({title}) => {
    return new Promise((resolve,reject) => {
        wx.showToast({
            title: title,
            // 提示内容content可在外面自定义
            icon: 'none',
            success: (result) => {
                resolve(result);
            },
            fail:(err) => {
                reject(err);
            }
       });
    })
}


// promise形式 login
export const login=() => {
    return new Promise((resolve,reject) => {
        wx.login({
            timeout: 10000,
            success: (result) => {
                resolve(result);
            },
            fail:(err) => {
                reject(err);
            }
       });
    })
}

/**
 * promise形式的小程序的微信支付
 * @param {object} pay 支付所必要的参数
 */
export const requestPayment=(pay) => {
    return new Promise((resolve,reject) => {
       wx.requestPayment({
           ...pay,
           success: (result) => {
               resolve(result)
           },
          fail: (err) => {
              reject(err);
          }
       });
         
    })
}