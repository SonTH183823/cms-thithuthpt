import request from '@/utils/request'
import config from '@/utils/config'
import queryString from 'querystring'

const DocumentAPI = {
  create(data) {
    return request({
      url: `${config.api.document}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.document}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.document}/${id}`,
      method: 'get'
    })
  },
  update(data, id) {
    return request({
      url: `${config.api.document}/${id}`,
      method: 'put',
      data: {
        ...data
      }
    })
  },
  delete(id) {
    return request({
      url: `${config.api.document}/${id}`,
      method: 'delete'
    })
  },
}
export default DocumentAPI
