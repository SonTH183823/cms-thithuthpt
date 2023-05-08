import request from '@/utils/request'
import config from '@/utils/config'
import queryString from 'querystring'

const PointAPI = {
  create(data) {
    return request({
      url: `${config.api.domainPointCar}/point`,
      method: 'post',
      data
    })
  },
  createPosition(data) {
    return request({
      url: `${config.api.domainPointCar}/position`,
      method: 'post',
      data
    })
  },
  updatePosition(id, data) {
    return request({
      url: `${config.api.domainPointCar}/position/${id}`,
      method: 'put',
      data
    })
  },
  deletePosition(id) {
    return request({
      url: `${config.api.domainPointCar}/position/${id}`,
      method: 'delete'
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.domainPointCar}/point?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getPosition(params = {}) {
    return request({
      url: `${config.api.domainPointCar}/position?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.domainPointCar}/point/${id}`,
      method: 'get'
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.domainPointCar}/point/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.domainPointCar}/point/${id}`,
      method: 'delete'
    })
  },
  getRules(params = {}) {
    return request({
      url: `${config.api.domainPointCar}/inspectionTable/config?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getInspectionTableByCar(idCar) {
    return request({
      url: `${config.api.domainPointCar}/inspectionTableByCar/${idCar}`,
      method: 'get'
    })
  },
  updateInspectionTable(_id, data) {
    return request({
      url: `${config.api.domainPointCar}/inspectionTable/${_id}`,
      method: 'put',
      data
    })
  },
  createInspectionTable(data) {
    return request({
      url: `${config.api.domainPointCar}/inspectionTable`,
      method: 'post',
      data
    })
  },
}
export default PointAPI
