import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "query-string";

const FigureAPI = {
  create(data) {
    return request({
      url: `${config.api.domainCar}/figure`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.domainCar}/figure?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.domainCar}/figure/${id}`,
      method: 'get',
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.domainCar}/figure/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.domainCar}/figure/${id}`,
      method: 'delete'
    })
  },
}
export default FigureAPI
