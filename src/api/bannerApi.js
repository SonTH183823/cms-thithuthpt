import request from '@/utils/request'
import config from '@/utils/config'
import * as queryString from 'querystring'

const BannerAPI = {
  create(data) {
    return request({
      url: `${config.api.banner}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.banner}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.banner}/${id}`,
      method: 'get',
    })
  },
  update(data, id) {
    return request({
      url: `${config.api.banner}/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.banner}/${id}`,
      method: 'delete'
    })
  },
}
export default BannerAPI
