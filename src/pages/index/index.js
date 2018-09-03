//index.js
//获取应用实例
const app = getApp()
import { requestApi } from '../../utils/api'
const constant = require('../../utils/util');
Page({
  data: {
    keyword: '',
    records: [],
    pageNum: 1,
    pageSize: constant.pageSize,
    totalPageNum: 0,
    hasMoreData: true
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let that = this;
    if(!app.globalData.openid){
      that.setOpenid();
    }else{
      that.initData();
    }
  },
  initData: function(){
    let that = this;
    let keyword = that.data.keyword,//输入框字符串作为参数
        pageNum = that.data.pageNum,//把第几次加载次数作为参数
        pageSize =that.data.pageSize; //返回数据的个数
    requestApi('address/page/list?openid='+app.globalData.openid+'&keyword='+keyword+'&pageNum='+pageNum+'&pageSize='+pageSize, 'GET', {}).then(response => {
      that.data.totalPageNum = Math.ceil(response.data.data.total / pageSize);
      that.data.records = response.data.data.records;
        
    }, err => {
      console.log(err)
    });
  },
  searchScrollLower: function(){
    let that = this;
    if(that.data.hasMoreData){
      that.setData({
        pageNum: that.data.pageNum+1,  //每次触发上拉事件，把searchPageNum+1
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false
      });
      that.fetchSearchList();
    }
  },
  setOpenid(){
    let that = this;
    wx.getUserInfo({
      withCredentials: true,
      success: function (infoData) {
        let userInfo = infoData.userInfo;
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openid, sessionKey, unionId
            if (res.code) {
              userInfo.loginCode = res.code;
              requestApi('wechat/login', 'POST', userInfo).then(response => {
                app.globalData.openid=response.data.data.openid;
                app.globalData.userInfo = userInfo;
                that.initData();
              }, err => {
                console.log(err)
              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          } 
        });
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
})
