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
          app.setOpenid(res.userInfo);
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
  }
})
