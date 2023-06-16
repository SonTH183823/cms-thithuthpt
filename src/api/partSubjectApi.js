import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "query-string";

const PartSubjectAPI = {
  create(data) {
    return request({
      url: `${config.api.subject}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.subject}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.subject}/${id}`,
      method: 'get',
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.subject}/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.subject}/${id}`,
      method: 'delete'
    })
  },
}
export default PartSubjectAPI
