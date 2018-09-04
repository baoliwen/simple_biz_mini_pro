//index.js
//获取应用实例
const app = getApp()

import { requestApi } from '../../utils/api'
import { WxValidate } from '../../utils/WxValidate'
Page({
  data: {
    region: ['', '', ''],
    customerName: '',
    customerContact: '',
    provinceName: '请选择',
    cityName: '',
    districtName: '',
    provinceCode: '',
    cityCode: '',
    districtCode: '',
    address: '',
    openid:app.globalData.openid
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
  initValidate: function () {
    const rules = {
      customerName: {
        required: true,
        minlength: 2,
        maxlength: 20
      }, customerContact: {
        required: true,
        minlength: 3,
        maxlength: 20
      }, provinceName: {
        required: true,

      }, cityName: {
        required: true,

      }
    }
    const messages = {
      customerName: {
        required: '请输入联系人姓名',
        minlength: '姓名长度不少于2位',
        maxlength: '姓名长度不大于20位'
      }, customerContact: {
        required: '请输入联系人电话',
        minlength: '联系电话不得小于3位',
        maxlength: '联系电话不得大于20位'
      }, provinceName: {
        required: '请选择省份',

      }, cityName: {
        required: '请选择城市',

      }
    }
    this.WxValidate = new WxValidate(rules, messages);
    // 自定义验证规则
    this.WxValidate.addMethod('assistance', (value, param) => {
      return this.WxValidate.optional(value) || (value.length >= 1 && value.length <= 2)
    }, '请勾选1-2个敲码助手')
  },
  onLoad: function () {
    this.initValidate();
  },
  bindRegionChange: function (e) {
    console.log(e.detail);
    this.setData({
      region: e.detail.value,
      provinceName: e.detail.value[0],
      cityName: e.detail.value[1],
      districtName: e.detail.value[2],
      provinceCode: e.detail.code[0],
      cityCode: e.detail.code[1],
      districtCode: e.detail.code[2]
    })
  },
  submit: function (e) {
    const params = e.detail.value;
    console.log(this.data);
    this.setData({
      customerName: params.customerName,
      customerContact: params.customerContact,
      address: params.address,
      openid:app.globalData.openid
    })
    
    
    console.log(app.globalData);

    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(this.data)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    console.log(this.data);
    requestApi('address/wx/save', 'POST', this.data).then(response => {
      if(response.data.code === 200){
        wx.navigateTo({
          url: '../index/index'
        })
      }
    }, err => {
      this.showModal({
        msg: '保存失败',
      })
      console.log(err)
    })
  }
})
