import request from '@/utils/request'
import config from '@/utils/config'
import queryString from 'querystring'

const ExamAPI = {
  create(data) {
    return request({
      url: `${config.api.exam}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.exam}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.exam}/${id}`,
      method: 'get'
    })
  },
  update(id, ids) {
    return request({
      url: `${config.api.exam}/${id}`,
      method: 'put',
      data: {
        ...ids
      }
    })
  },
  delete(id) {
    return request({
      url: `${config.api.exam}/${id}`,
      method: 'delete'
    })
  },
}
export default ExamAPI
