import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "query-string";

const FAQAPI = {
  create(data) {
    return request({
      url: `${config.api.domainFaq}/faq`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.domainFaq}/faq?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.domainFaq}/faq/${id}`,
      method: 'get',
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.domainFaq}/faq/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.domainFaq}/faq/${id}`,
      method: 'delete'
    })
  },
  getCategory(params = {}) {
    return request({
      url: `${config.api.domainFaq}/category?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getBrandByCategory(id, params = {}) {
    return request({
      url: `${config.api.domainFaq}/domainFaq/manufacturer/${id}?${queryString.stringify(params)}`,
      method: 'get',
    })
  }
}
export default FAQAPI
