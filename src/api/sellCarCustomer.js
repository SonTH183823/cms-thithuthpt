import request from '@/utils/request'
import config from '@/utils/config'
import * as queryString from 'querystring'
import axios from "axios";

const SellCarCustomerAPI = {
  create(data) {
    return request({
      url: `${config.api.userTransaction}/sellCar`,
      method: 'post',
      data
    })
  },
  getExportExcel() {
    return axios({
      url: `${config.api.userTransaction}/export/sell`,
      method: 'get',
      responseType: 'blob',
    })
  },
  getExportCustomerMailExcel() {
    return axios({
      url: `${config.api.userTransaction}/export/emailLead`,
      method: 'get',
      responseType: 'blob',
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.userTransaction}/sellCar?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.userTransaction}/sellCar/${id}`,
      method: 'get',
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.userTransaction}/sellCar/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.userTransaction}/sellCar/${id}`,
      method: 'delete'
    })
  },
  getStatistic(params = {}) {
    return request({
      url: `${config.api.userTransaction}/sellCar/statistic?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
}
export default SellCarCustomerAPI
