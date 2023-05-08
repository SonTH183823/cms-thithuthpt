import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "query-string";

const StatisticalAPI = {
  create(data) {
    return request({
      url: `${config.api.domainStatistic}/statistic`,
      method: 'post',
      data
    })
  },
  get(params = {}) {
    return request({
      url: `${config.api.domainStatistic}/statistic?${queryString.stringify(params)}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `${config.api.domainStatistic}/statistic/${id}`,
      method: 'get',
    })
  },
  update(id, data) {
    return request({
      url: `${config.api.domainStatistic}/statistic/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `${config.api.domainStatistic}/statistic/${id}`,
      method: 'delete'
    })
  },
}
export default StatisticalAPI
