import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "query-string";

const ModelCarAPI = {
  create(data) {
    return request({
      url: `${config.api.domainCar}/carTemplate`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.domainCar}/carTemplate?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.domainCar}/carTemplate/${id}`,
      method: 'get',
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.domainCar}/carTemplate/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.domainCar}/carTemplate/${id}`,
      method: 'delete'
    })
  },
}
export default ModelCarAPI
