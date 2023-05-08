import request from '@/utils/request'
import config from '@/utils/config'

const BlockAPI = {
  create(data) {
    return request({
      url: `${config.api.block}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.block}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.block}/${id}`,
      method: 'get'
    })
  },
  update(data, id) {
    return request({
      url: `${config.api.block}/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.block}/${id}`,
      method: 'delete'
    })
  },
}
export default BlockAPI
