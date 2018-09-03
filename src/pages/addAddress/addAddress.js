//index.js
//获取应用实例
const app = getApp()

import { requestApi } from '../../utils/api'
import { WxValidate } from '../../utils/WxValidate'
Page({
  data: {
    region: ['请选择', '', ''],
    customItem: '请选择'
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
  onLoad: function () {
    this.WxValidate = new WxValidate({
      customerName: {
        required: true,
        minlength: 2,
        maxlength: 20
      }, customerContact: {
        required: true,
        minlength: 3,
        maxlength: 20
      }
    }, {
        customerName: {
          required: '请输入联系人姓名',
          minlength: '姓名长度不少于2位',
          maxlength: '姓名长度不大于20位'
        }, customerContact: {
          required: '请输入联系人电话',
          minlength: '联系电话不得小于3位',
          maxlength: '联系电话不得大于20位'
        }
      });
    // 自定义验证规则
    this.WxValidate.addMethod('assistance', (value, param) => {
      return this.WxValidate.optional(value) || (value.length >= 1 && value.length <= 2)
    }, '请勾选1-2个敲码助手');
  },
  bindRegionChange: function (e) {
    console.log(e.detail);
    this.setData({
      region: e.detail.value
    })
  },
  submit: function (e) {
    console.log(e.detail);
    const params = e.detail.value

    console.log(params)

    // 传入表单数据，调用验证方法
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }

    this.showModal({
      msg: '提交成功',
    })
  }
})
