import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "query-string"

const PopupAPI = {
  create(data) {
    return request({
      url: `${config.api.popup}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.popup}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.popup}/${id}`,
      method: 'get'
    })
  },
  update(data, id) {
    return request({
      url: `${config.api.popup}/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.popup}/${id}`,
      method: 'delete'
    })
  },
}
export default PopupAPI
