import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "query-string"

const NewsAPI = {
  create(data) {
    return request({
      url: `${config.api.news}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.news}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getCategoryNews(params = {}) {
    return request({
      url: `${config.api.domain}/cateNews?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  createCategoryNews(data) {
    return request({
      url: `${config.api.domain}/cateNews`,
      method: 'post',
      data
    })
  },
  updateCategoryNews(data, id) {
    return request({
      url: `${config.api.domain}/cateNews/${id}`,
      method: 'put',
      data
    })
  },
  deleteCategoryNews(id) {
    return request({
      url: `${config.api.domain}/cateNews/${id}`,
      method: 'delete'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.news}/${id}`,
      method: 'get'
    })
  },
  update(data, id) {
    return request({
      url: `${config.api.news}/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.news}/${id}`,
      method: 'delete'
    })
  },
  getTagNews(params = {}) {
    return request({
      url: `${config.api.domain}/tagNews?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  createTagNews(data) {
    return request({
      url: `${config.api.domain}/tagNews`,
      method: 'post',
      data
    })
  },
  updateTagNews(data, id) {
    return request({
      url: `${config.api.domain}/tagNews/${id}`,
      method: 'put',
      data
    })
  },
  deleteTagNews(id) {
    return request({
      url: `${config.api.domain}/tagNews/${id}`,
      method: 'delete'
    })
  },
}
export default NewsAPI
