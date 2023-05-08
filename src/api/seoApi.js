import request from '@/utils/request'
import config from '@/utils/config'
import * as queryString from 'querystring'

const SeoAPI = {
  hasSEO(params = {}) {
    return request({
      url: `${config.api.seo}?target.${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  create(data) {
    return request({
      url: `${config.api.seo}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.seo}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.seo}/${id}`,
      method: 'get',
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.seo}/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.seo}/${id}`,
      method: 'delete'
    })
  },
}
export default SeoAPI
