import request from '@/utils/request'
import config from '@/utils/config'
import queryString from 'querystring'

const CustomerUserAPI = {
  get(params = {}) {
    const url = params ? `${config.api.customerUser}?${queryString.stringify(params)}` : config.api.customerUser

    return request({
      url,
      method: 'get',
    })
  },
  create(data) {
    return request({
      url: `${config.api.customerUser}`,
      method: 'post',
      data
    })
  },
  addToProject(data) {
    return request({
      url: `${config.api.customerUser}/addProject`,
      method: 'post',
      data
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.customerUser}/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.customerUser}/${id}`,
      method: 'delete'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.customerUser}/${id}`,
      method: 'get'
    })
  }
}

export default CustomerUserAPI
