<template>
  <div>
    <div v-loading="loadingNews" class="news-form-container">
      <el-row><h2 style="font-weight: bold">Bài viết tin tức</h2></el-row>
      <el-row style="margin-top: 12px;margin-bottom: 20px">
        <el-col style="display: flex; justify-content: flex-end; margin-right: 10px">
          <el-button @click="handleCancel">Hủy</el-button>
          <!--          <el-button type="primary" plain @click="handleEditSizeImg">Chọn kích cỡ ảnh</el-button>-->
          <el-button type="primary" class="btn-submit" @click="handleSend">
            {{ formType !== 'edit' ? 'Tạo tin tức' : 'Cập nhật' }}
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-form ref="formSubmit" :rules="formRules" :model="formSubmit" label-width="120px">
          <el-form-item>
            <div
              style="display: flex; flex-direction: row; justify-content: space-between; width: 90%; margin-top: 10px; margin-bottom: 10px;"
            >
              <div style="flex-direction: row; font-weight: bold">
                Kích hoạt
                <el-switch
                  v-model="formSubmit.active"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#13ce66"
                  style="margin-left: 10px;"
                />
              </div>
              <div style="flex-direction: row; font-weight: bold">
                Nổi bật
                <el-switch
                  v-model="formSubmit.isOutstanding"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#13ce66"
                  style="margin-left: 10px;"
                />
              </div>
              <div style="flex-direction: row; font-weight: bold">
                Xem nhiều
                <el-switch
                  v-model="formSubmit.isManyViewed"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#13ce66"
                  style="margin-left: 10px;"
                />
              </div>
            </div>
          </el-form-item>
          <el-form-item label="Tiêu đề" prop="title">
            <el-input ref="title" v-model="formSubmit.title" name="title"/>
          </el-form-item>
          <el-form-item label="Hình ảnh" prop="thumbnail">
            <div>
              <div v-if="formSubmit.thumbnail" style="position: relative">
                <img :src="`${config.api.domainUpload}/${formSubmit.thumbnail}`" class="one-img" alt="">
                <span class="close" @click="onRemoveFile">
                  <i
                    class="el-icon-close"
                    style="color: #fff; position: absolute; top: 0; right: 0; font-size: 1.6em;"
                  />
                </span>
              </div>
              <img v-else src="../../../assets/images/image_placeholder.png" style="max-width: 500px" @click="addImg()">
              <div v-if="!formSubmit.thumbnail" class="el-row--flex">
                <el-button type="text" @click="addImg()">Thêm ảnh cover</el-button>
              </div>
              <div v-if="!hasImg && !formSubmit.thumbnail" style="color:#f56c6c; font-size: 12px">Vui lòng chọn ảnh!
              </div>
            </div>
          </el-form-item>
          <div class="category-list">
            <el-form-item class="category-form" label="Loại tin tức" prop="category">
              <el-select
                v-model="formSubmit.category"
                style="display: flex; width: 100%"
                placeholder="Lựa chọn loại tin tức"
                multiple
              >
                <el-option
                  v-for="category in categoryList"
                  :key="category.id"
                  :label="category.name"
                  :value="category.id"
                >
                  {{ category.name }}
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="category-list">
            <el-form-item class="category-form" label="Tags" prop="tags">
              <el-select
                v-model="formSubmit.tags"
                style="display: flex; width: 100%"
                placeholder="Lựa chọn tags"
                multiple
              >
                <el-option
                  v-for="tag in tagList"
                  :key="tag.id"
                  :label="tag.name"
                  :value="tag.id"
                >
                  {{ tag.name }}
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="Mô tả" prop="description">
            <el-input v-model="formSubmit.description" type="textarea" :rows="2"/>
          </el-form-item>
          <el-form-item label="Nội dung" prop="content">
            <EditorComponent
              v-if="!loadingNews && formType!==''"
              :content="formSubmit.content"
              :type-form="formType"
              @content-html-change="handleHTML"
            />
          </el-form-item>
        </el-form>
      </el-row>
    </div>
    <el-dialog
      title="Tải ảnh lên"
      :visible.sync="dialogVisibleAddImg"
      :close-on-click-modal="false"
      width="40%"
      :before-close="handleAddImgCancel"
    >
      <file-pond
        ref="pond"
        name="file"
        label-idle="Tải lên"
        allow-remove="true"
        allow-image-preview="true"
        accepted-file-types="image/*"
        label-file-type-not-allowed="Không đúng định dạng ảnh"
        :files="myFiles"
        :server="server"
        credits="false"
        instant-upload="true"
      />
      <div style="width: 100%; display: flex; justify-content: flex-end">
        <el-button @click="handleAddImgCancel">Xong</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import config from "@/utils/config"
import { validText } from "@/utils/validate"
import NewsApi from "@/api/newsApi"
import vueFilePond, { setOptions } from 'vue-filepond'
import 'filepond/dist/filepond.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import MinIOAPI from "@/api/minioApi"
import EditorComponent from "@/components/Editor"
import UploadAPI from "@/api/uploadApi"

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
    FilePond,
    EditorComponent
  },

  data() {
    const validateText = (rule, value, callback) => {
      if (!validText(value)) {
        callback(new Error('Vui lòng nhập đầy đủ trường'))
      } else {
        callback()
      }
    }
    return {
      myFiles: [],
      myFiles1: [],
      hasImg: true,
      isUpload: false,
      dialogVisible: false,
      server: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await UploadAPI.uploadFile(file)
            if (!this.editorFocus) {
              this.formSubmit.thumbnail = data.filename
              this.editorFocus = true
            }
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      config,
      dialogVisibleAddImg: false,
      formSubmit: {
        title: '',
        category: [],
        content: '',
        active: 1,
        thumbnail: '',
        isOutstanding: 0,
        isManyViewed: 0,
        description: '',
        hasNotification: 1,
        tags: []
      },
      formRules: {
        title: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng nhập tiêu đề bài viết',
          validator: validateText
        }],
        content: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng nhập nội dung bài viết',
          validator: validateText
        }],
        description: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng nhập mô tả bài viết',
          validator: validateText
        }],
        thumbnail: [{ required: true, trigger: 'blur', message: ' ' }],
        category: [{ required: true, trigger: 'blur', message: ' ' }]
      },
      formType: '',
      NewsId: this.$route.params.id,
      loadingNews: false,
      categoryList: [],
      tagList: [],
    }
  },

  async mounted() {
    this.loadingNews = true
    await Promise.all([
        this.handleCategory(),
        this.handleTags()
      ]
    )
    if (this.NewsId !== '0') {
      this.formType = 'edit'
      await this.loadFormEdit()
    } else {
      this.formType = 'create'
    }
    this.loadingNews = false
  },
  methods: {
    async loadFormEdit() {
      try {
        this.loadingNews = true
        const data = await NewsApi.getById(this.NewsId)
        this.formSubmit = {
          ...data,
        }
        this.formSubmit.category = []
        data.category.map(item => {
          this.formSubmit.category.push(item._id)
        })
        this.formSubmit.tags = []
        data.tags?.map(tag => {
          this.formSubmit.tags.push(tag._id)
        })
        this.loadingNews = false
      } catch (err) {
        console.log(err)
      }
    },
    async addImg() {
      if (this.formSubmit.thumbnail) {
        this.myFiles = [await this.getImageFilePreview(this.formSubmit.thumbnail)]
      }
      this.dialogVisibleAddImg = true
    },
    handleAddImgCancel() {
      this.dialogVisibleAddImg = false
    },
    onRemoveFile() {
      this.formSubmit.thumbnail = undefined
      this.myFiles = []
    },
    async getImageFilePreview(imgName) {
      const dt = await MinIOAPI.download(`${config.api.domainUpload}/${imgName}`)
      const blob = dt.data
      return new File([blob], config.blobNamePreview, {
        type: blob.type
      })
    },
    async handleSend() {
      const dataSubmit = {
        ...this.formSubmit,
      }
      await this.$refs.formSubmit.validate(async valid => {
        if (!this.formSubmit.thumbnail) {
          this.hasImg = false
          valid = false
        } else {
          this.hasImg = true
        }
        if (valid) {
          try {
            this.loadingNews = true
            if (this.formType === 'create') {
              await NewsApi.create(dataSubmit)
            } else {
              await NewsApi.update(dataSubmit, this.NewsId)
            }
            this.formSubmit = {}
            this.loadingNews = false
          } catch (err) {
            this.loadingNews = false
          }
          this.$router.push('/quan-ly-tin-tuc/tin-tuc')
        } else {
          console.log('Error Submit!')
          return false
        }
      })
    },
    async handleCategory() {
      const { data } = await NewsApi.getCategoryNews({ perPage: 1000 })
      this.categoryList = data.map(item => {
        return {
          name: item.name,
          id: item._id
        }
      })
    },
    async handleTags() {
      const { data } = await NewsApi.getTagNews({ perPage: 1000 })
      this.tagList = data.map(item => {
        return {
          name: item.name,
          id: item._id
        }
      })
    },
    handleCancel() {
      this.$router.push('/quan-ly-tin-tuc/tin-tuc')
    },
    handNewsType() {
      this.$router.push('/quan-ly/loai-tin-tuc')
    },
    handleHTML(data) {
      this.formSubmit.content = data
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
  border-top-left-radius: 5px;

  &:hover {
    opacity: 1;
  }
}

.category-list {
  display: grid;
  flex-direction: column;
}

.one-img {
  object-fit: cover;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
  width: 100%;
  max-width: 500px;
}
</style>
