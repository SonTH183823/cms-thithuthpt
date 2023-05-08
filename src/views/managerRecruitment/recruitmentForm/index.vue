<template>
  <div>
    <div v-loading="loading" class="news-form-container">
      <el-row><h2 style="font-weight: bold">Tin chi tiết</h2></el-row>
      <el-row style="margin-top: 12px;margin-bottom: 20px">
        <el-col style="display: flex; justify-content: flex-end; margin-right: 10px">
          <el-button @click="handleCancel">Hủy</el-button>
          <el-button v-if="formType === 'create'" type="primary" class="btn-submit" @click="handleSend">
            Tạo tin tuyển dụng
          </el-button>
          <el-button v-else-if="formType === 'edit'" type="primary" class="btn-submit" @click="handleSend">
            Cập nhật
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-form ref="formSubmit" :rules="formRules" :model="formSubmit" label-position="top">
          <el-row :gutter="20" style="margin-bottom: 10px;">
            <el-col :xl="12" :lg="12">
              <el-form-item label="Kích hoạt" prop="active">
                <div style="display: flex; flex-direction: row; align-items: center;">
                  <el-switch
                    v-model="formSubmit.active"
                    :active-value="1"
                    :inactive-value="0"
                    active-color="#13ce66"
                    style="margin-left: 10px;"
                    :disabled="disableActive"
                  />
                  <div style="color:#f56c6c; font-size: 12px; margin-left: 10px">
                    {{ disableActive ? 'Hãy chọn thời gian kết thúc lớn hơn thời gian hiện tại!' : ' ' }}
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="Vị trí" prop="title">
                <el-input name="title" ref="title" v-model="formSubmit.title"></el-input>
              </el-form-item>
              <el-form-item class="category-form" label="Hình thức làm việc" prop="workingForm">
                <el-select style="display: flex; width: 100%" v-model="formSubmit.workingForm"
                           placeholder="Lựa chọn hình thức"
                >
                  <el-option
                    v-for="item in config.workingForm"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xl="12" :lg="12">
              <el-form-item class="category-form" label="Lĩnh vực tuyển dụng" prop="category">
                <el-select style="display: flex; width: 100%" filterable v-model="formSubmit.category"
                           placeholder="Lựa chọn lĩnh vực"
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
              <el-form-item class="category-form" label="Địa điểm làm việc" prop="address">
                <el-select style="display: flex; width: 100%" v-model="formSubmit.address"
                           placeholder="Lựa chọn địa điểm"
                           filterable
                >
                  <el-option
                    v-for="item in provinces"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  >
                    {{ item.name }}
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Thời gian kết thúc" prop="timeEnd">
                <el-date-picker
                  style="width: 100%"
                  v-model="formSubmit.timeEnd"
                  type="datetime"
                  :picker-options="pickerOptions"
                  placeholder="Chọn ngày và giờ"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="Nội dung" prop="content">
            <EditorComponent
              v-if="!loading && formType!==''"
              :content="formSubmit.content"
              :type-form="formType"
              @content-html-change="handleHTML"
            />
          </el-form-item>
        </el-form>
      </el-row>
    </div>
  </div>
</template>

<script>
import config from "@/utils/config"
import { validText } from "@/utils/validate"
import RecruitmentApi from "@/api/recruitmentApi"
import MinIOAPI from "@/api/minioApi"
import provinces from "@/views/managerRecruitment/provinces"
import EditorComponent from "@/components/Editor"

export default {
  components: { EditorComponent },
  data() {
    const validateText = (rule, value, callback) => {
      if (!validText(value)) {
        callback(new Error('Vui lòng nhập đầy đủ trường!'))
      } else {
        callback()
      }
    }
    const validateTimeEnd = (rule, value, callback) => {
      if (value === 0) {
        callback(new Error('Vui lòng chọn thời gian kết thúc!'))
      } else {
        callback()
      }
    }
    return {
      provinces,
      server: {
        process: async(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await MinIOAPI.getPreUrlUpload({ name: file.name })
            await MinIOAPI.upload(data.url, file)
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      config,
      pickerOptions: {
        disabledDate(time) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          return time.getTime() < yesterday
        },
      },
      formSubmit: {
        title: '',
        category: '',
        content: '',
        active: 0,
        timeEnd: '',
        address: 0,
        workingForm: 1,
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
        workingForm: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng chọn hình thức làm việc',
          validator: validateText
        }],
        address: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng chọn nơi làm việc',
          validator: validateText
        }],
        timeEnd: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng chọn hình thức làm việc',
          validator: validateTimeEnd
        }],
        active: [{ required: true, trigger: 'blur', message: ' ' }],
        category: [{ required: true, trigger: 'blur', message: 'Hãy chọn lĩnh vực' }]
      },
      formType: '',
      RecruitmentId: this.$route.params.id,
      loading: false,
      categoryList: [],
      disableActive: true,
    }
  },
  watch: {
    'formSubmit.timeEnd': {
      handler: function(val) {
        this.checkTime(val)
      },
      immediate: false,
      deep: true
    }
  },
  async mounted() {
    this.loading = true
    await this.handleCategory()
    if (this.RecruitmentId !== '0') {
      this.formType = 'edit'
      await this.loadFormEdit()
    } else {
      this.formType = 'create'
    }
    this.loading = false
  },
  methods: {
    checkTime(val) {
      const now = new Date()
      this.disableActive = !(val && val > now)
    },
    async loadFormEdit() {
      try {
        const data = await RecruitmentApi.getById(this.RecruitmentId)
        this.formSubmit = { ...data }
        this.formSubmit.timeEnd = data.timeEnd * 1000
        this.formSubmit.category = data.category
        if (this.formSubmit.timeEnd) {
          await this.checkTime(this.formSubmit.timeEnd)
        }
      } catch (err) {
        console.log(err)
      }
    },
    async handleSend() {
      await this.$refs.formSubmit.validate(async valid => {
        if (valid) {
          try {
            this.loading = true
            const dataSubmit = {
              ...this.formSubmit,
              timeEnd: parseInt(this.formSubmit.timeEnd / 1000)
            }
            if (this.formType === 'edit') {
              await RecruitmentApi.update(dataSubmit, this.RecruitmentId)
            } else {
              await RecruitmentApi.create(dataSubmit)
            }
            this.formSubmit = {}
            this.loading = false
          } catch (err) {
            this.loading = false
          }
          this.$router.push('/quan-ly-tuyen-dung/tin-tuyen-dung')
        } else {
          console.log('Error Submit!')
          return false
        }
      })
    },
    async handleCategory() {
      const { data } = await RecruitmentApi.getCateRecruitment({ perPage: 1000 })
      this.categoryList = data.map(item => {
        return {
          name: item.name,
          id: item._id
        }
      })
    },
    handleCancel() {
      this.$router.push('/quan-ly-tuyen-dung/tin-tuyen-dung')
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
</style>
