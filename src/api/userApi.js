import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "query-string"

const URLUser = config.api.domainUser

const UserAPI = {
  getURLUser() {
    return `${URLUser}/cms/user`
  },
  get(params = {}) {
    return request({
      url: `${URLUser}/cms/user?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  update(data, id) {
    return request({
      url: `${URLUser}/cms/user/${id}`,
      method: 'put',
      data
    })
  },
  blockUser(data, uid) {
    return request({
      url: `${URLUser}/cms/user/block/${uid}`,
      method: 'put',
      data
    })
  },
  getSessionUserAPI(uid) {
    return `${URLUser}/cms/user/session/${uid}`
  },
  deleteAllUserSession(uid) {
    return request({
      url: `${URLUser}/cms/user/session/${uid}`,
      method: 'delete',
    })
  },
  deleteUserSession(uid, id) {
    return request({
      url: `${URLUser}/cms/user/session/${uid}/${id}`,
      method: 'delete',
    })
  }
}
export default UserAPI
