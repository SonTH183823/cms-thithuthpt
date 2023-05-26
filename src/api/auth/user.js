import request from '@/utils/request'
import config from '@/utils/config'
import queryString from 'querystring'

const UserAPI = {
  create(data) {
    return request({
      url: `${config.api.user}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    const url = params ? `${config.api.user}?${queryString.stringify(params)}` : `${config.api.user}`

    return request({
      url,
      method: 'get',
    })
  },
  getById(id) {
    return request({
      url: `${config.api.user}/${id}`,
      method: 'get'
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.user}/${id}`,
      method: 'put',
      data
    })
  },
  del(id) {
    return request({
      url: `${config.api.user}/${id}`,
      method: 'delete'
    })
  },
  login(data) {
    return request({
      url: `${config.api.auth}/login`,
      method: 'post',
      data
    })
  },
  logout() {
    return request({
      url: `${config.api.user}/logout`,
      method: 'get'
    })
  },
  changePassword(data) {
    return request({
      url: `${config.api.user}/changePassword`,
      method: 'put',
      data
    })
  },
  refreshToken() {
    return request({
      url: `${config.api.user}/refreshToken`,
      method: 'get'
    })
  }
}

export default UserAPI
