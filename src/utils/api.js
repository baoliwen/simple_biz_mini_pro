
var apiUrl = 'http://localhost:1002/';
// 获取sessionToken
    // 普通的get，post请求
export function requestApi (url, type, data) {
  if (type === '') { type = 'GET' }
  return new Promise(function (resolve, reject) {
    wx.request({
      url: apiUrl + url,
      data: data,
      method: type,
      header: {
        'content-type': 'application/json',
        'platform':'WX'
      },
      success: function (res) {
        console.log(res);
        if(res.statusCode === 500){
          wx.showToast({
            title: '服务器异常',
            icon: 'none',
            duration: 1000
          })
          return;
        }else if (res.statusCode !== 200){
          wx.showToast({
            title: res.data.error,
            icon: 'none',
            duration: 1000
          })
          return;
        }

        if(res.data.code !== 200){
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
          return;
        }
        resolve(res)
      },
      fail: function (error) {
        reject(error)
      },
      complete: function () {
        //console.log("完成");
      }
    })
  })
}