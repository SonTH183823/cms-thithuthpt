<template>
  <div>
    <div v-loading="loading" class="news-form-container">
      <el-row><h2 style="font-weight: bold">Chi tiết chính sách bán hàng</h2></el-row>
      <el-row style="margin-top: 12px;margin-bottom: 20px">
        <el-col style="display: flex; justify-content: flex-end; margin-right: 10px">
          <el-button @click="handleCancel">Hủy</el-button>
          <el-button type="primary" class="btn-submit" @click="handleSend">
            {{ formType !== 'edit' ? 'Tạo mới chính sách' : 'Cập nhật chính sách' }}
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-form ref="formSubmit" :rules="formRules" :model="formSubmit" label-position="top">
          <el-form-item label="Kích hoạt" prop="active">
            <el-switch
              v-model="formSubmit.active"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              style="margin-left: 10px"
            />
          </el-form-item>
          <el-form-item label="Tên trang chính sách" prop="name">
            <el-input v-model="formSubmit.name" autosize/>
          </el-form-item>
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
import MinIOAPI from "@/api/minioApi"
import SalePolicyAPI from "@/api/salePolicyApi"
import EditorComponent from "@/components/Editor"

export default {
  components: {
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
      formSubmit: {
        name: '',
        content: '',
        active: 1,
      },
      formRules: {
        name: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng nhập tên trang chính sách',
          validator: validateText
        }],
        content: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng nhập nội dung bài viết',
          validator: validateText
        }],
        active: [{
          required: true,
          trigger: 'blur',
          message: 'Vui lòng nhập mô tả bài viết',
          validator: validateText
        }],
      },
      formType: '',
      SalePolicyId: this.$route.params.id,
      loading: false,
    }
  },

  async mounted() {
    this.loading = true
    if (this.SalePolicyId !== '0') {
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
        const data = await SalePolicyAPI.getById(this.SalePolicyId)
        this.formSubmit = { ...data }
        this.loading = false
      } catch (err) {
        console.log(err)
      }
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
        if (valid) {
          try {
            this.loading = true
            if (this.formType === 'create') {
              await SalePolicyAPI.create(dataSubmit)
            } else {
              await SalePolicyAPI.update(this.SalePolicyId, dataSubmit)
            }
            this.loading = false
          } catch (err) {
            this.loading = false
          }
          this.handleCancel()
        } else {
          console.log('Error Submit!')
          return false
        }
      })
    },
    handleCancel() {
      this.$router.push('/chinh-sach-ban-hang/danh-sach')
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

  &:hover {
    opacity: 1;
  }
}

.category-list {
  display: grid;
  flex-direction: column;
}
</style>
