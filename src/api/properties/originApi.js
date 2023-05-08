import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "query-string";

const OriginAPI = {
  create(data) {
    return request({
      url: `${config.api.domainCar}/origin`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.domainCar}/origin?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.domainCar}/origin/${id}`,
      method: 'get',
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.domainCar}/origin/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.domainCar}/origin/${id}`,
      method: 'delete'
    })
  },
}
export default OriginAPI
