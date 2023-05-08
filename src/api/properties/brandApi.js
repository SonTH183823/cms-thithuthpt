import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "query-string";

const BrandAPI = {
  create(data) {
    return request({
      url: `${config.api.domainCar}/brand`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.domainCar}/brand?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.domainCar}/brand/${id}`,
      method: 'get',
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.domainCar}/brand/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.domainCar}/brand/${id}`,
      method: 'delete'
    })
  },
  getBrandByManufacturer(id, params = {}) {
    return request({
      url: `${config.api.domainCar}/brand/manufacturer/${id}?${queryString.stringify(params)}`,
      method: 'get',
    })
  }
}
export default BrandAPI
