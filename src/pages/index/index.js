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
    windowH:0,
    pageSize: constant.pageSize,
    totalPageNum: 0,
    hasMoreData: true
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindKeywordInput: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  toAddAddress: function () {
    wx.navigateTo({
      url: '../addAddress/addAddress'
    })
  },
  onLoad: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowH:res.windowHeight - 100
        })
      }
    })
    if (!app.globalData.openid) {
      that.setOpenid();
    } else {
      that.initData();
    }
  },
  onReachBottom:function(){
    this.loadMore();
  },
  initData: function () {
    let that = this;
    let keyword = that.data.keyword,//输入框字符串作为参数
      pageNum = that.data.pageNum,//把第几次加载次数作为参数
      pageSize = that.data.pageSize; //返回数据的个数
    wx.showLoading({
      title: '加载中',
    })
    requestApi('address/page/list?openid=' + app.globalData.openid + '&keyword=' + keyword + '&pageNum=' + pageNum + '&pageSize=' + pageSize, 'GET', {}).then(response => {
      wx.hideLoading();
      let records = this.data.records;
      records = records.concat(response.data.data.records);
      this.setData({
        totalPageNum: Math.ceil(response.data.data.total / pageSize),
        records: records
      })
      if (that.data.totalPageNum > that.data.pageNum) {
        that.data.hasMoreData = true;
      } else {
        that.data.hasMoreData = false;
      }
    }, err => {
      wx.hideLoading();
      console.log(err)
    });
  },
  keywordSearch: function () {
    this.setData({  
      pageNum: 1,   //第一次加载，设置1
      records:[],  //放置返回数据的数组,设为空
    })
    this.initData();
  },
  loadMore: function () {
    let that = this;
    //debugger
    if (that.data.hasMoreData) {
      that.setData({
        pageNum: that.data.pageNum + 1,  //每次触发上拉事件，把searchPageNum+1
      });
      that.initData();
    }
  },
  setOpenid() {
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
                app.globalData.openid = response.data.data.openid;
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
