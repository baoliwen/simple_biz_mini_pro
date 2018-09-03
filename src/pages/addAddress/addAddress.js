//index.js
//获取应用实例
const app = getApp()

import { requestApi } from '../../utils/api'
Page({
  data: {
    region: ['广东省', '广州市', '海珠区'],
    customItem: '请选择'
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    
  },
  bindRegionChange:function(e){
    console.log(e.detail);
    this.setData({
      region: e.detail.value
    })
  }
})
