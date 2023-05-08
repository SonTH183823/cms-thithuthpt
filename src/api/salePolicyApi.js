import request from '@/utils/request'
import config from '@/utils/config'
import queryString from 'querystring'

const SalePolicyAPI = {
  create(data) {
    return request({
      url: `${config.api.domainSalePolicy}/policy`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.domainSalePolicy}/policy?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.domainSalePolicy}/policy/${id}`,
      method: 'get'
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.domainSalePolicy}/policy/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.domainSalePolicy}/policy/${id}`,
      method: 'delete'
    })
  },
}
export default SalePolicyAPI
