import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "query-string";

const ManufacturerAPI = {
  create(data) {
    return request({
      url: `${config.api.domainCar}/manufacturer`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.domainCar}/manufacturer?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.domainCar}/manufacturer/${id}`,
      method: 'get',
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.domainCar}/manufacturer/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.domainCar}/manufacturer/${id}`,
      method: 'delete'
    })
  },
}
export default ManufacturerAPI
