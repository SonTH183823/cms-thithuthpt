import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "query-string"

const PopupVETCAPI = {
  create(data) {
    return request({
      url: `${config.api.popupVETC}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.popupVETC}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.popupVETC}/${id}`,
      method: 'get'
    })
  },
  update(data, id) {
    return request({
      url: `${config.api.popupVETC}/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.popupVETC}/${id}`,
      method: 'delete'
    })
  },
}
export default PopupVETCAPI
