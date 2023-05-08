import request from '@/utils/request'
import config from '@/utils/config'
import * as queryString from 'querystring'
import axios from "axios"

const BuyCarCustomerAPI = {
  create(data) {
    return request({
      url: `${config.api.userTransaction}/lead`,
      method: 'post',
      data
    })
  },
  getExportExcel() {
    return axios({
      url: `${config.api.userTransaction}/export/lead`,
      method: 'get',
      responseType: 'blob',
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.userTransaction}/lead?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.userTransaction}/lead/${id}`,
      method: 'get',
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.userTransaction}/lead/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.userTransaction}/lead/${id}`,
      method: 'delete'
    })
  },
  getStatistic(params = {}) {
    return request({
      url: `${config.api.userTransaction}/lead/statistic?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
}
export default BuyCarCustomerAPI
