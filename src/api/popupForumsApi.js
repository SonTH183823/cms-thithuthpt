import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "query-string"

const PopupForumsAPI = {
  create(data) {
    return request({
      url: `${config.api.popupForums}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.popupForums}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.popupForums}/${id}`,
      method: 'get'
    })
  },
  update(data, id) {
    return request({
      url: `${config.api.popupForums}/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.popupForums}/${id}`,
      method: 'delete'
    })
  },
}
export default PopupForumsAPI
