import request from '@/utils/request'
import config from '@/utils/config'
import queryString from 'querystring'

const RatingAPI = {
  create(data) {
    return request({
      url: `${config.api.rating}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.rating}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.rating}/${id}`,
      method: 'get'
    })
  },
  update(id, ids) {
    return request({
      url: `${config.api.rating}/${id}`,
      method: 'put',
      data: {
        ...ids
      }
    })
  },
  delete(id) {
    return request({
      url: `${config.api.rating}/${id}`,
      method: 'delete'
    })
  },
}
export default RatingAPI
