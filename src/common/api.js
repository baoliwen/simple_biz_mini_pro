
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
        'platform':'miniProgram'
      },
      success: function (res) {
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