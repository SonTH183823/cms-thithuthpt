import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "query-string";

const FuelAPI = {
  create(data) {
    return request({
      url: `${config.api.domainCar}/fuel`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.domainCar}/fuel?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.domainCar}/fuel/${id}`,
      method: 'get',
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.domainCar}/fuel/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.domainCar}/fuel/${id}`,
      method: 'delete'
    })
  },
}
export default FuelAPI
