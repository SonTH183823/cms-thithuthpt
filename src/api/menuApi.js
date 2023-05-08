import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "query-string";

const MenuAPI = {
  create(data) {
    return request({
      url: `${config.api.menu}`,
      method: 'post',
      data
    })
  },
  get() {
    return request({
      url: `${config.api.menu}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.menu}/${id}`,
      method: 'get'
    })
  },
  update(data, id) {
    return request({
      url: `${config.api.menu}/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.menu}/${id}`,
      method: 'delete'
    })
  },
}
export default MenuAPI
