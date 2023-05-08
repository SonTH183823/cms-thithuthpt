import request from '@/utils/request'
import config from '@/utils/config'
import queryString from 'querystring'
const TypeCarAPI = {
  create(data) {
    return request({
      url: `${config.api.typeCar}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.typeCar}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.typeCar}/${id}`,
      method: 'get',
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.typeCar}/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.typeCar}/${id}`,
      method: 'delete'
    })
  },
}
export default TypeCarAPI
