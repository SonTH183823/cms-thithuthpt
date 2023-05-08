<template>
  <div v-loading="loadingNews" class="news-form-container">
    <el-row><h2 style="font-weight: bold">{{ title }}</h2></el-row>
    <el-row style="margin-top: 12px;margin-bottom: 20px">
      <el-col style="display: flex; justify-content: flex-end; margin-right: 10px">
        <el-button @click="handleCancel">Hủy</el-button>
        <el-button v-if="formType === 'create'" type="primary" class="btn-submit" @click="handleAddPartner">Tạo mới
        </el-button>
        <el-button v-else-if="formType === 'edit'" type="primary" class="btn-submit" @click="handleEditNews">Cập nhật
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-form ref="formSubmit" :rules="formRules" :model="formSubmit" label-width="120px">
        <el-form-item label="Kích hoạt">
          <el-switch
            v-model="formSubmit.active"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            style="margin-right: 10px;"
          />
        </el-form-item>
        <el-form-item label="Tên đối tác" prop="name">
          <el-input name="name" ref="name" v-model="formSubmit.name"></el-input>
        </el-form-item>
        <el-form-item label="Logo" prop="logo">
          <file-pond
            ref="pond"
            name="file"
            label-idle="Tải lên"
            allowImagePreview="true"
            accepted-file-types="image/*"
            label-file-type-not-allowed="Không đúng định dạng ảnh"
            :files="myFiles"
            :server="server"
            credits="false"
            instantUpload="true"
            :onremovefile="onRemoveFile"
          />
        </el-form-item>
        <el-form-item label="Mô tả">
          <el-input type="textarea" v-model="formSubmit.description"></el-input>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import config from "@/utils/config"
import {validText} from "@/utils/validate"
import PartnerApi from "@/api/partnerApi"
import vueFilePond, {setOptions} from 'vue-filepond'
import 'filepond/dist/filepond.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import MinIOAPI from '@/api/minioApi'

// Create component
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginImageTransform,
  FilePondPluginImageResize
)

setOptions({
  styleLoadIndicatorPosition: "center top",
  styleProgressIndicatorPosition: "right top",
  styleButtonRemoveItemPosition: "left top",
  styleButtonProcessItemPosition: "right top",
  labelFileProcessing: 'Đang tải',
  labelTapToCancel: 'Bấm để hủy',
  labelTapToUndo: '',
  labelFileProcessingComplete: 'Thành công',
})

export default {
  components: {
    FilePond
  },

  data() {
    const token = localStorage.getItem(config.tokenKey)
    const validateText = (rule, value, callback) => {
      if (!validText(value)) {
        callback(new Error('Vui lòng nhập đầy đủ trường'))
      } else {
        callback()
      }
    }
    return {
      title: '',
      myFiles: [],
      isUpload: false,
      server: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: file.name })
            await MinIOAPI.upload(data.url, file)
            this.formSubmit.logo = data.path
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      config,
      headerUpload: {
        'x-access-token': token
      },
      urlImage: config.api.upload,
      formSubmit: {
        name: '',
        description: '',
        active: 0,
        logo: ''
      },
      htmlForEditor: '',
      formRules: {
        name: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng nhập tên đối tác!',
          validator: validateText
        }],
        logo: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng cập nhật logo!',
          validator: validateText
        }],
      },
      formType: '',
      PartnerId: this.$route.params.id,
      loadingNews: false,
      categoryList: [],
      loadingUpload: false,
    }
  },
  mounted() {
    if (this.PartnerId !== '0') {
      this.title = "Cập nhật thông tin đối tác"
      this.formType = 'edit'
      this.loadFormEdit()
    } else {
      this.title = "Tạo mới đối tác"
      this.formType = 'create'
    }
  },
  methods: {
    async getImageFilePreview(imgName) {
      const dt = await MinIOAPI.download(`${config.api.domainUpload}/${imgName}`)
      const blob = dt.data
      return new File([blob], config.blobNamePreview, {
        type: blob.type
      })
    },
    onRemoveFile() {
      this.formSubmit.logo = undefined
      this.myFiles = []
    },
    async loadFormEdit() {
      try {
        this.loadingNews = true
        const data = await PartnerApi.getById(this.PartnerId)
        this.formSubmit = {
          ...data
        }
        if (this.formSubmit.logo) {
          this.myFiles = [await this.getImageFilePreview(this.formSubmit.logo)]
        }
        this.loadingNews = false
      } catch (err) {
        console.log(err)
      }
    },
    async handleAddPartner() {
      const dataSubmit = {
        ...this.formSubmit,
      }
      await this.$refs.formSubmit.validate(async valid => {
        if (valid) {
          await PartnerApi.create(dataSubmit)
          this.formSubmit = {
            name: '',
            description: '',
            active: 0,
            logo: ''
          }
          this.$router.push('/quan-ly-doi-tac/doi-tac')
        } else {
          return false
        }
      })
    },
    async handleEditNews() {
      const dataSubmit = {
        ...this.formSubmit,
        category: this.formSubmit.category,
      }
      await this.$refs.formSubmit.validate(async valid => {
        if (valid) {
          try {
            this.loadingNews = true
            await PartnerApi.update(dataSubmit, this.PartnerId)
            this.loadingNews = false
          } catch (err) {
            this.loadingNews = false
          }
          this.$router.push('/quan-ly-doi-tac/doi-tac')
        } else {
          console.log('Error Submit!')
          return false
        }
      })
    },
    handleCancel() {
      this.$router.push('/quan-ly-doi-tac/doi-tac')
    },
    onUploadFileSuccess(err, file) {
      const fileData = file.serverId
      const fileDataString = JSON.parse(fileData)
      this.formSubmit.logo = fileDataString.path
    },
    onProgressUploadFile() {
      this.loadingUpload = true
    }
  }
}
</script>

<style lang="scss">
.news-form-container {
  padding: 20px;
}

.close {
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  width: 1.6em;
  height: 1.6em;
  opacity: 0.8;
  background-color: #333;

  &:hover {
    opacity: 1;
  }
}

.el-textarea__inner {
  height: 200px;
}

</style>
