import request from '@/utils/request'
import config from '@/utils/config'
import queryString from 'querystring'

const ExamAPI = {
  create(data) {
    return request({
      url: `${config.api.exam}`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.exam}?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.exam}/${id}`,
      method: 'get'
    })
  },
  getExamHasQuestionById(id) {
    return request({
      url: `${config.api.toeic}/question/${id}`,
      method: 'get'
    })
  },
  update(data, id) {
    return request({
      url: `${config.api.exam}/${id}`,
      method: 'put',
      data: {
        ...data
      }
    })
  },
  updateQuestion(data, id) {
    return request({
      url: `${config.api.exam}/question/${id}`,
      method: 'put',
      data: {
        ...data
      }
    })
  },
  updateQuestionToeic(data, id) {
    return request({
      url: `${config.api.toeic}/question/${id}`,
      method: 'put',
      data: {
        ...data
      }
    })
  },
  delete(id) {
    return request({
      url: `${config.api.exam}/${id}`,
      method: 'delete'
    })
  },
}
export default ExamAPI
