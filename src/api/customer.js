import request from '@/utils/request'
import config from '@/utils/config'
import queryString from 'querystring'

const CustomerAPI = {
  create(data) {
    return request({
      url: `${config.api.customer}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    const url = params ? `${config.api.customer}?${queryString.stringify(params)}` : `${config.api.customer}`

    return request({
      url,
      method: 'get',
    })
  },
  getById(uid) {
    return request({
      url: `${config.api.customer}/${uid}/details`,
      method: 'get'
    })
  },
  getHistory(uid) {
    return request({
      url: `${config.api.customer}/history/${uid}`,
      method: 'get'
    })
  },
  update(uid, data) {
    return request({
      url: `${config.api.customer}/${uid}`,
      method: 'put',
      data
    })
  },
  block(uid) {
    return request({
      url: `${config.api.customer}/block/${uid}`,
      method: 'put',
      data: {
        isLocked: 1
      },
    })
  },
  unlock(uid) {
    return request({
      url: `${config.api.customer}/block/${uid}`,
      method: 'put',
    })
  },
  login(data) {
    return request({
      url: `${config.api.customer}/login`,
      method: 'post',
      data
    })
  },
  logout() {
    return request({
      url: `${config.api.customer}/logout`,
      method: 'get'
    })
  },
  loginViaIp(data = {}) {
    return request({
      url: `${config.api.customer}/loginViaIp`,
      method: 'post',
      data
    })
  },
  changePassword(data) {
    return request({
      url: `${config.api.customer}/changePassword`,
      method: 'put',
      data
    })
  },
  refreshToken() {
    return request({
      url: `${config.api.customer}/refreshToken`,
      method: 'get'
    })
  }
}

export default CustomerAPI
