import request from '@/utils/request'
import config from '@/utils/config'
import queryString from 'querystring'

const TagAPI = {
  create(data) {
    return request({
      url: `${config.api.tag}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.tag}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.tag}/${id}`,
      method: 'get'
    })
  },
  update(id, ids) {
    return request({
      url: `${config.api.tag}/${id}`,
      method: 'put',
      data: {
        ...ids
      }
    })
  },
  delete(id) {
    return request({
      url: `${config.api.tag}/${id}`,
      method: 'delete'
    })
  },
}
export default TagAPI
