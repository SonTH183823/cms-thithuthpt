import request from '@/utils/request'
import config from '@/utils/config'
import * as queryString from 'querystring'

const UploadAPI = {
  create(data) {
    return request({
      url: `${config.api.upload}`,
      method: 'post',
      data
    })
  },
  // get(params = {}) {
  //   return request({
  //     url: `${config.api.manageSEO}`,
  //     method: 'get'
  //   })
  // },
  // getById(id) {
  //   return request({
  //     url: `${config.api.manageSEO}/${id}`,
  //     method: 'get',
  //   })
  // },
  // update(id, data) {
  //   return request({
  //     url: `${config.api.manageSEO}/${id}`,
  //     method: 'put',
  //     data
  //   })
  // },
  // delete(id) {
  //   return request({
  //     url: `${config.api.manageSEO}/${id}`,
  //     method: 'delete'
  //   })
  // },
}
export default UploadAPI
