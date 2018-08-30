//app.js
import { dataApi } from './src/common/api'
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    
    
  },
  globalData: {
    userInfo: null,
    openId:null
  }
})