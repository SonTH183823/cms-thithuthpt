import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "query-string"

const NotificationAPI = {
  create(data) {
    return request({
      url: `${config.api.notification}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.notification}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.notification}/${id}`,
      method: 'get',
    })
  },
  update(data, id) {
    return request({
      url: `${config.api.notification}/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.notification}/${id}`,
      method: 'delete'
    })
  },
  createTemplate(data) {
    return request({
      url: `${config.api.notificationTemplate}`,
      method: 'post',
      data
    })
  },
  getTemplate(params = {}) {
    return request({
      url: `${config.api.notificationTemplate}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getTemplateById(id) {
    return request({
      url: `${config.api.notificationTemplate}/${id}`,
      method: 'get',
    })
  },
  updateTemplate(id, data) {
    return request({
      url: `${config.api.notificationTemplate}/${id}`,
      method: 'put',
      data
    })
  },
  deleteTemplate(id) {
    return request({
      url: `${config.api.notificationTemplate}/${id}`,
      method: 'delete'
    })
  },
}
export default NotificationAPI
