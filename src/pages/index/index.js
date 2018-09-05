//index.js
//获取应用实例
const app = getApp()
import { requestApi } from '../../utils/api'
import touches from '../../utils/Touches'
const constant = require('../../utils/util');
Page({
  data: {
    keyword: '',
    records: [],
    pageNum: 1,
    windowH: 0,
    pageSize: constant.pageSize,
    totalPageNum: 0,
    hasMoreData: true,
    startX: 0, //开始坐标
    startY: 0
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
  toAddress: function () {
    wx.navigateTo({
      url: '../address/address'
    })
  },
  addressDetail: function (e) {
    wx.navigateTo({
      url: '../address/address?id=' + e.currentTarget.dataset.id
    })
  },
  onLoad: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowH: res.windowHeight - 100
        })
      }
    })
    if (!app.globalData.openid) {
      that.setOpenid();
    } else {
      that.initData();
    }
  },
  onReachBottom: function () {
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
      for (let i = 0; records.length > i; i++) {
        records[i].isTouchMove = false; //默认全隐藏删除
      }
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
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.records.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      records: this.data.records
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.records.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      records: that.data.records
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    console.log(e);
    let params = e.currentTarget.dataset;
    requestApi('address/wx/delete?addressId='+params.id, 'DELETE', {}).then(response => {
      this.data.records.splice(params.index, 1);
      this.setData({
        records: this.data.records
      })
    }, err => {
      console.log(err)
    })
  },
  keywordSearch: function () {
    this.setData({
      pageNum: 1,   //第一次加载，设置1
      records: [],  //放置返回数据的数组,设为空
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
