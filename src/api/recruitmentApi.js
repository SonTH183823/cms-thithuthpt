import request from '@/utils/request'
import config from '@/utils/config'
import queryString from 'querystring'

const RecruitmentAPI = {
  getCateRecruitment(params = {}) {
    return request({
      url: `${config.api.domainRecruitment}/cateRecruit?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  createCateRecruitment(data) {
    return request({
      url: `${config.api.domainRecruitment}/cateRecruit`,
      method: 'post',
      data
    })
  },
  updateCateRecruitment(data, id) {
    return request({
      url: `${config.api.domainRecruitment}/cateRecruit/${id}`,
      method: 'put',
      data: {
        ...data
      }
    })
  },
  deleteCateRecruitment(id) {
    return request({
      url: `${config.api.domainRecruitment}/cateRecruit/${id}`,
      method: 'delete'
    })
  },
  create(data) {
    return request({
      url: `${config.api.domainRecruitment}/recruit`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.domainRecruitment}/recruit?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.domainRecruitment}/recruit/${id}`,
      method: 'get'
    })
  },
  update(ids, id) {
    return request({
      url: `${config.api.domainRecruitment}/recruit/${id}`,
      method: 'put',
      data: {
        ...ids
      }
    })
  },
  delete(id) {
    return request({
      url: `${config.api.domainRecruitment}/recruit/${id}`,
      method: 'delete'
    })
  },
  getApplication(params = {}) {
    return request({
      url: `${config.api.domainRecruitment}/application?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  updateApplication(ids, id) {
    return request({
      url: `${config.api.domainRecruitment}/application/${id}`,
      method: 'put',
      data: {
        ...ids
      }
    })
  },
  deleteApplication(id) {
    return request({
      url: `${config.api.domainRecruitment}/application/${id}`,
      method: 'delete'
    })
  },
}
export default RecruitmentAPI
