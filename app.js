//app.js
import { requestApi } from './src/common/api'
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
  },
  setOpenid(userInfo){
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          userInfo.loginCode = res.code;
          requestApi('wechat/login', 'POST', userInfo).then(response => {
            if (response.data.code === 200) {
              app.globalData.openId=response.data.data.openid;
              console.log(app.globalData);
            } else {
              wx.showToast({
                title: response.data.msg,
                icon: 'none',
                duration: 1000
              })
            }
          }, err => {
            console.log(err)
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      } 
    });
  },
  globalData: {
    userInfo: null,
    openId:null
  }
})