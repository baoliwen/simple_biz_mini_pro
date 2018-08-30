//index.js
//获取应用实例
const app = getApp()
import { requestApi } from './../../common/api'
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let that = this;
    console.log(app.globalData);
    if(app.globalData.userInfo == null){
      wx.getUserInfo({
        withCredentials: true,
        success: function (res) {
          app.globalData.userInfo=res.userInfo;
        },
        fail: function () {
          //获取用户信息失败后。请跳转授权页面
          wx.showModal({
            title: '警告',
            content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../authorize/authorize',
                })
              }
            }
          })
        }
      });
    }
    if(!app.globalData.openid){
      wx.getUserInfo({
        withCredentials: true,
        success: function (res) {
          that.setOpenid(res.userInfo);
        },
        fail: function () {
          //获取用户信息失败后。请跳转授权页面
          wx.showModal({
            title: '警告',
            content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../authorize/authorize',
                })
              }
            }
          })
        }
      });
    }
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
  }
})
