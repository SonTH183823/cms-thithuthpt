import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "query-string";

const DriveAPI = {
  create(data) {
    return request({
      url: `${config.api.domainCar}/drive`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.domainCar}/drive?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.domainCar}/drive/${id}`,
      method: 'get',
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.domainCar}/drive/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.domainCar}/drive/${id}`,
      method: 'delete'
    })
  },
}
export default DriveAPI
