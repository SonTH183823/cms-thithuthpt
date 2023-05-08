import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "query-string";
import axios from "axios"

const CarAPI = {
  getExportExcel(params = {}) {
    return axios({
      url: `${config.api.domainCar}/car/export?${queryString.stringify(params)}`,
      method: 'get',
      responseType: 'blob',
    })
  },
  getCarOdoo(params = {}) {
    return request({
      url: `${config.api.domainCar}/carOdoo/notCreated?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getCarOdooID(id) {
    return request({
      url: `${config.api.domainCar}/carOdoo/${id}`,
      method: 'get'
    })
  },
  create(data) {
    return request({
      url: `${config.api.domainCar}/car`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.domainCar}/car?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.domainCar}/car/${id}`,
      method: 'get',
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.domainCar}/car/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.domainCar}/car/${id}`,
      method: 'delete'
    })
  },
  updateStatus(data) {
    return request({
      url: `${config.api.domainCar}/updateStatus`,
      method: 'put',
      data
    })
  },
  createMedia(data) {
    return request({
      url: `${config.api.domainCar}/media`,
      method: 'post',
      data
    })
  },
  getMedia(params = {}) {
    return request({
      url: `${config.api.domainCar}/media?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getMediaById(id) {
    return request({
      url: `${config.api.domainCar}/media/${id}`,
      method: 'get',
    })
  },
  updateMedia(id, data) {
    return request({
      url: `${config.api.domainCar}/media/${id}`,
      method: 'put',
      data
    })
  },
  deleteMedia(id) {
    return request({
      url: `${config.api.domainCar}/media/${id}`,
      method: 'delete'
    })
  },
}
export default CarAPI
