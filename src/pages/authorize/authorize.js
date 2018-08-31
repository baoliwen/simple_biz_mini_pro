//index.js
//获取应用实例
const app = getApp()

import { requestApi } from '../../utils/api'
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.navigateTo({
            url: './../index/index'
          });
        }
      }
    });
  },
  bindGetUserInfo: function (e) {
    let that = this;
    if (e.detail.userInfo) {
        //用户按了允许授权按钮
        app.globalData.userInfo = e.detail.userInfo;
        //授权成功后，跳转进入小程序首页
        wx.navigateTo({
          url: './../index/index'
        });
    } else {
        //用户按了拒绝按钮
        wx.showModal({
            title:'警告',
            content:'您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
            showCancel:false,
            confirmText:'返回授权',
            success:function(res){
                if (res.confirm) {
                    console.log('用户点击了“返回授权”')
                } 
            }
        })
    }
  }
})
