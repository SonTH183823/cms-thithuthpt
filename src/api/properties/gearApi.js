import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "query-string";

const GearAPI = {
  create(data) {
    return request({
      url: `${config.api.domainCar}/gear`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.domainCar}/gear?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.domainCar}/gear/${id}`,
      method: 'get',
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.domainCar}/gear/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.domainCar}/gear/${id}`,
      method: 'delete'
    })
  },
}
export default GearAPI
