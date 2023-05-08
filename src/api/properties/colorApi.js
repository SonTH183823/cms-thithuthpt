import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "query-string";

const ColorAPI = {
  create(data) {
    return request({
      url: `${config.api.domainCar}/color`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.domainCar}/color?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.domainCar}/color/${id}`,
      method: 'get',
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.domainCar}/color/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.domainCar}/color/${id}`,
      method: 'delete'
    })
  },
}
export default ColorAPI
