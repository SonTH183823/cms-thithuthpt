import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "query-string"

const URLUser = config.api.domain

const UserAPI = {
  getURLUser() {
    return `${URLUser}/allUsers`
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
      url: `${URLUser}/usersById/${uid}`,
      method: 'put',
      data
    })
  },
  deleteUer(id) {
    return request({
      url: `${URLUser}/users/${id}`,
      method: 'delete'
    })
  }
}
export default UserAPI
