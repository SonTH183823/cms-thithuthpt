import request from '@/utils/request'
import config from '@/utils/config'
import queryString from "query-string"
import axios from "axios"

const MinIOAPI = {
  getPreUrlUpload(q) {
    if (q && q.name && !q.name.includes("/")) {
      q.name = `cms/${q.name}`
    }
    return request({
      url: `${config.api.minio}?${queryString.stringify(q)}`,
      method: 'get'
    })
  },
  upload(url, blob) {
    return request({
      url,
      method: 'put',
      data: blob,
      headers: {
        'Content-Type': blob.type
      }
    })
  },
  download(url) {
    return axios({
      url,
      method: "get",
      responseType: 'blob'
    })
  }
}
export default MinIOAPI
