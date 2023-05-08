import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "query-string"

const URLUser = config.api.domainUser
const URLList = config.api.userTransaction

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
  getListSellCar(uid) {
    return request({
      url: `${URLList}/sellCar?uid=${uid}`,
      method: 'get',
    })
  },
  APIGetListSellCar(uid) {
    return `${URLList}/sellCar?uid=${uid}`
  },
  getListBuyer(uid) {
    return request({
      url: `${URLList}/lead?uid=${uid}`,
      method: 'get',
    })
  },
  delListBuyer(uid, id) {
    return request({
      url: `${URLList}/lead?uid=${uid}/${id}`,
      method: 'delete',
    })
  },
  APIGetListBuyer(uid) {
    return `${URLList}/lead?uid=${uid}`
  },
  getHistoryUserAPI(uid) {
    return `${URLUser}/cms/user/history/${uid}?limit=20`
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
