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
  uploadMultipleFile(files) {
    const data = new FormData()
    for (const item of files) {
      data.append('files', item)
    }
    return request({
      url: `${config.api.uploadMultiple}`,
      method: 'post',
      data
    })
  }
}
export default UploadAPI
