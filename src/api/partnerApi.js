import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "query-string";
const PartnerAPI = {
  create(data) {
    return request({
      url: `${config.api.partner}`,
      method: 'post',
      data
    })
  },
  get(params= {}) {
    return request({
      url: `${config.api.partner}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.partner}/${id}`,
      method: 'get'
    })
  },
  update(data, id) {
    return request({
      url: `${config.api.partner}/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.partner}/${id}`,
      method: 'delete'
    })
  },
}
export default PartnerAPI
