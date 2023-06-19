<template>
  <div v-loading="loading">
    <div class="news-form-container">
      <el-row><h2 style="font-weight: bold">Biên tập đề thi</h2></el-row>
      <el-row style="margin-top: 12px;margin-bottom: 20px">
        <el-col style="display: flex; justify-content: flex-end; margin-right: 10px">
          <el-button @click="handleCancel">Hủy</el-button>
          <el-button type="primary" class="btn-submit" @click="handleSend">
            {{ formType !== 'edit' ? 'Tạo đề thi' : 'Cập nhật' }}
          </el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-form ref="formSubmit" :rules="formRules" :model="formSubmit" label-width="120px" label-position="top">
          <el-form-item>
            <div
              style="display: flex; flex-direction: row; justify-content: space-between; width: 70%; margin-top: 10px; margin-bottom: 10px;"
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
                  v-model="formSubmit.outstanding"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#13ce66"
                  style="margin-left: 10px;"
                />
              </div>
            </div>
          </el-form-item>
          <el-col :xl="12" :md="12">
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
                <img v-else src="../../../assets/images/image_placeholder.png" style="max-width: 250px"
                     @click="addImg()"
                >
                <div v-if="!formSubmit.thumbnail" class="el-row--flex">
                  <el-button type="text" @click="addImg()">Thêm ảnh cover</el-button>
                </div>
                <div v-if="!hasImg && !formSubmit.thumbnail" style="color:#f56c6c; font-size: 12px">Vui lòng chọn ảnh!
                </div>
              </div>
            </el-form-item>
            <el-form-item label="Tiêu đề" prop="title">
              <el-input ref="title" v-model="formSubmit.title" name="title" type="textarea"/>
            </el-form-item>
            <el-form-item label="Mô tả" prop="description">
              <el-input v-model="formSubmit.description" type="textarea" :rows="2"/>
            </el-form-item>
          </el-col>

          <el-col :xl="12" :md="12">
            <el-form-item class="category-form" label="Môn học" prop="category">
              <el-select
                v-model="formSubmit.subject"
                style="display: flex; width: 100%"
                placeholder="Đề thi môn ..."
              >
                <el-option
                  v-for="subject in config.subjectConfig"
                  :key="subject.value"
                  :label="subject.label"
                  :value="subject.value"
                >
                  {{ subject.label }}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Thời gian làm bài (phút)" prop="time">
              <el-input-number v-model="formSubmit.time" :min="0" style="width: 100%" :step="30"/>
            </el-form-item>
            <el-form-item class="category-form" label="Độ khó" prop="level">
              <el-select
                v-model="formSubmit.level"
                style="display: flex; width: 100%"
                placeholder="Chọn độ khó..."
              >
                <el-option
                  v-for="item in config.levelConfig"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  {{ item.label }}
                </el-option>
              </el-select>
            </el-form-item>
            <div style="display: flex; justify-content: space-between">
              <el-form-item label="Đánh giá" prop="rate">
                <el-input-number v-model="formSubmit.rate" :step="0.1" :min="0"/>
              </el-form-item>
              <el-form-item label="Lượt xem" prop="rate">
                <el-input-number v-model="formSubmit.numberView" :min="0"/>
              </el-form-item>
              <el-form-item label="Lượt thi" prop="rate">
                <el-input-number v-model="formSubmit.numberTest" :min="0"/>
              </el-form-item>
            </div>
<!--            <el-form-item label="Phân phối đề thi">-->
<!--              <div style="display: flex; justify-content: space-between; padding-left: 30px; font-weight: bold">-->
<!--                <span>STT</span>-->
<!--                <span>Dạng câu hỏi</span>-->
<!--                <span>Số câu hỏi</span>-->
<!--              </div>-->
<!--              <div v-for="(item,index) in listTypeQuestion" style="padding-left: 40px; padding-right: 30px">-->
<!--                <div :key="index" style="display: flex; justify-content: space-between">-->
<!--                  <span>{{ index + 1 }}</span>-->
<!--                  <span>{{ item.label }}</span>-->
<!--                  <span>{{ item.value }}</span>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div v-if="listTypeQuestion.length === 0"-->
<!--                   style="align-items: center; width: 100%; display: flex; justify-content: center"-->
<!--              >Không có dữ liệu-->
<!--              </div>-->
<!--            </el-form-item>-->
          </el-col>
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
import {validText} from "@/utils/validate"
import ExamAPI from "@/api/examApi"
import vueFilePond, {setOptions} from 'vue-filepond'
import 'filepond/dist/filepond.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
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
    FilePond
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
      hasImg: true,
      isUpload: false,
      dialogVisible: false,
      activeNames: [],
      server: {
        process: async (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
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
        subject: 1,
        active: 0,
        thumbnail: '',
        description: '',
        hasNotification: 1,
        time: 0,
        level: 1,
        outstanding: 0,
        rate: 5,
        numberView: 12,
        numberTest: 2
      },
      listTypeQuestion: [],
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
        thumbnail: [{required: true, trigger: 'blur', message: ' '}],
        subject: [{required: true, trigger: 'blur', message: ' '}]
      },
      formType: '',
      ExamId: this.$route.params.id,
      loading: true,
    }
  },
  watch: {
    'formSubmit.subject': {
      handler: function (val) {
        this.listTypeQuestion = []
        if (val === 1) {
          for (const item of config.subToanList) {
            this.listTypeQuestion.push({
              label: item,
              value: 5
            })
          }
        }
      },
      immediate: true,
      deep: true
    },
  },

  async mounted() {
    this.loading = true
    if (this.ExamId !== '0') {
      this.formType = 'edit'
      await this.loadFormEdit()
    } else {
      this.formType = 'create'
    }
    this.loading = false
  },
  methods: {
    async loadFormEdit() {
      try {
        this.loading = true
        const data = await ExamAPI.getById(this.ExamId)
        this.formSubmit = {...data}
        this.loading = false
      } catch (err) {
        console.log(err)
      }
    },
    async addImg() {
      if (this.formSubmit.thumbnail) {
        this.myFiles = []
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
            this.loading = true
            if (this.formType === 'create') {
              await ExamAPI.create(dataSubmit)
            } else {
              await ExamAPI.update(dataSubmit, this.ExamId)
            }
            this.formSubmit = {}
            this.loading = false
          } catch (err) {
            this.loading = false
          }
          this.$router.push('/quan-ly-de-thi/danh-sach')
        } else {
          console.log('Error Submit!')
          return false
        }
      })
    },
    handleCancel() {
      this.$router.push('/quan-ly-de-thi/danh-sach')
    },
    handleHTML(data) {
      this.formSubmit.content = data
    },
    checkAddNewQuestion() {

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

.container-gird {
  display: grid;
  grid-template-columns: [col1] 50% [col2] 50%;
  grid-gap: 10px;
  text-align: center;
}
</style>
