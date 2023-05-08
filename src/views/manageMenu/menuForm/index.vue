<template>
  <div v-loading="loadingForm" class="menu-form-container">
    <el-row><h3>Thông tin menu</h3></el-row>
    <el-row style="margin-top: 12px;margin-bottom: 20px">
      <el-col style="display: flex; justify-content: flex-end; margin-right: 10px">
        <el-button @click="handleCancel">Hủy</el-button>
        <el-button v-if="formType === 'create'" type="primary" class="btn-submit" @click="handleAddMenu">Tạo menu</el-button>
        <el-button v-else-if="formType === 'edit'" type="primary" class="btn-submit" @click="handleEditMenu">Cập nhật</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-form ref="formSubmit" :rules="formRules" :model="formSubmit" label-width="120px">
        <el-form-item label="Kích hoạt">
          <el-switch v-model="formSubmit.active" :active-value="1" :inactive-value="0" active-color="#13ce66" style="margin-right: 10px;" />
        </el-form-item>
        <el-form-item label="Mã menu" prop="code">
          <el-input name="code" ref="code" v-model="formSubmit.code"></el-input>
        </el-form-item>
        <el-form-item label="Tên menu" prop="name">
          <el-input name="name" ref="name" v-model="formSubmit.name"></el-input>
        </el-form-item>
        <el-form-item label="Cấp menu" prop="rank">
          <el-input name="rank" type="rank" ref="rank" v-model.number="formSubmit.rank"></el-input>
        </el-form-item>
        <el-form-item label="Đường dẫn" prop="url">
          <el-input
            type="url"
            name="url"
            ref="url"
            placeholder="ví dụ: https://example.com"
            v-model="formSubmit.url"
          />
        </el-form-item>
        <el-form-item label="Mô tả" prop="description">
          <el-input type="textarea" name="description" ref="description" v-model="formSubmit.description" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
        </el-form-item>
      </el-form>
      <!--      <div>{{formSubmit.content + '&&' + formSubmit.title}}</div>-->
    </el-row>
  </div>
</template>

<script>
import { validText } from "@/utils/validate"
import config from "@/utils/config"
import MenuAPI from "@/api/menuApi"

export default {
  data() {
    const token = localStorage.getItem(config.tokenKey)
    const validateText = (rule, value, callback) => {
      if (!validText(value)) {
        callback(new Error('Vui lòng không để trống trường'))
      } else {
        callback()
      }
    }
    const validatePositiveNumber = (rule, value, callback) => {
      console.log(value)
      if (typeof value === 'number' && value < 0) {
        callback(new Error('Trường nhập phải là số lơn hơn 0'))
      } else {
        callback()
      }
    }

    const validateUrl = (rule, value, callback) => {
      const url = /http[s]?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
      console.log(value, value.match(url))
      if (value.match(url) === null) {
        callback(new Error('Trường nhập phải là một đường link'))
      } else {
        callback()
      }
    }

    return {
      headerUpload: {
        'x-access-token': token
      },
      formSubmit: {
        name: '',
        code: '',
        description: '',
        active: 1,
        rank: '',
        url: ''
      },
      htmlForEditor: '',
      formRules: {
        name: [{ required: true, trigger: 'blur', message: 'Vui lòng nhập tên menu' }],
        code: [{ required: true, trigger: 'blur', message: 'Vui lòng nhập mã menu' }],
        rank: [
          { required: true, trigger: 'blur', message: 'Vui lòng nhập cấp menu' },
          { type: 'number', message: 'Cấp phải là một số' },
          { validator: validatePositiveNumber, trigger: 'change' },
        ],
        url: [
          { required: true, trigger: 'blur', message: 'Vui lòng nhập đường dẫn', validator: validateText },
          { validator: validateUrl, trigger: 'change' },
        ],
        // description: [{ trigger: 'blur', validator: validateText }],
      },
      formType: '',
      MenuId: this.$route.params.id,
      loadingForm: false,
      categoryList: [],
    }
  },
  mounted() {
    if (this.MenuId !== '0') {
      this.formType = 'edit'
      this.loadFormEdit()
    } else {
      this.formType = 'create'
    }
  },
  methods: {
    async loadFormEdit() {
      try {
        this.loadingForm = true
        const data = await MenuAPI.getById(this.MenuId)
        this.formSubmit = {
          ...data
        }
        this.loadingForm = false
      } catch (err) {
        console.log(err)
      }
    },
    async handleAddMenu() {
      const dataSubmit = {
        ...this.formSubmit,
      }
      await this.$refs.formSubmit.validate(async valid => {
        if (valid) {
          await MenuAPI.create(dataSubmit)
          this.formSubmit = {}
          this.$router.push('/quan-ly/menu')
        } else {
          return false
        }
      })
    },
    async handleEditMenu() {
      const dataSubmit = {
        ...this.formSubmit,
      }
      await this.$refs.formSubmit.validate(async valid => {
        if (valid) {
          try {
            this.loadingForm = true
            await MenuAPI.update(dataSubmit, this.MenuId)
            this.loadingForm = false
          } catch (err) {
            this.loadingForm = false
          }
          this.$router.push('/quan-ly/menu')
        } else {
          console.log('Error Submit!')
          return false
        }
      })
    },
    handleCancel() {
      this.$router.push('/quan-ly/menu')
    },
  }
}
</script>

<style lang="scss">
.menu-form-container{
  padding: 20px;
}
</style>
