import request from '@/utils/request'
import config from '@/utils/config'

const UploadAPI = {
  uploadFile(file) {
    const data = new FormData()
    data.append('file', file)
    return request({
      url: `${config.api.upload}`,
      method: 'post',
      data
    })
  },
  uploadMultipleFile(file) {
    const data = new FormData()
    data.append('file', file)
    return request({
      url: `${config.api.upload}`,
      method: 'post',
      data
    })
  }
}
export default UploadAPI
