<template>
  <tl-dialog
    ref="dialog"
    title="Người dùng"
    dialogid="nguoi-dung"
    @parrent-callback="callbackFromChild"
  >
    <el-form ref="form" :model="form" :rules="rulesCreate">
<!--      <div class="avatar-wrap">-->
<!--        <el-upload-->
<!--          class="avatar-uploader"-->
<!--          :action="urlUploadImage"-->
<!--          :show-file-list="false"-->
<!--          :auto-upload="true"-->
<!--          :on-success="onUploadAvatarSuccess"-->
<!--        >-->
<!--          <img v-if="form.avatar" :src="form.avatar" class="avatar" alt="thumbnails">-->
<!--          <i v-else class="el-icon-user-solid avatar-blank"/>-->
<!--          <i class="el-icon-edit-outline avatar-uploader-icon"/>-->
<!--        </el-upload>-->
<!--      </div>-->
      <el-form-item
        label="Tên đăng nhập"
        :label-width="formLabelWidth"
        prop="username"
      >
        <el-input v-model="form.username" autocomplete="off"/>
      </el-form-item>
      <el-form-item
        label="Họ và tên"
        :label-width="formLabelWidth"
        prop="name"
      >
        <el-input v-model="form.name" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="Quản trị viên" prop="isAdministrator" :label-width="formLabelWidth">
        <el-switch v-model="form.isAdministrator" :active-value="1" :inactive-value="0"/>
      </el-form-item>
      <el-form-item
        label="Quyền"
        :label-width="formLabelWidth"
        prop="roles"
        v-if="!form.isAdministrator"
      >
        <el-select v-model="form.roles" placeholder="Chọn" multiple>
          <el-option
            v-for="item in loaiNguoiDungMap"
            :key="item._id"
            :label="item.title"
            :value="item._id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-checkbox
        v-if="formType === 'edit'"
        v-model="checked"
        style="margin: 0px 0px 35px 15px"
      >
        <h2 style="margin:0px 0px 35px 30px; color: #606266">Thay đổi mật khẩu
        </h2>
      </el-checkbox>
      <div v-if="checked">
        <el-form-item
          label="Mật khẩu mới"
          :label-width="formLabelWidth"
          prop="password"
        >
          <el-input
            v-model="form.password"
            type="password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="Xác nhận mật khẩu"
          :label-width="formLabelWidth"
          prop="checkPass"
        >
          <el-input
            v-model="form.checkPass"
            type="password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
  </tl-dialog>
</template>

<script>
import TlDialog from '@/components/TlDialog/index'
import config from '@/utils/config'
import moment from 'moment'
import roleAPI from '@/api/auth/role'
import UserAPI from '@/api/auth/user'

export default {
  name: 'NguoiDungForm',
  components: {
    TlDialog,
  },
  props: ['formvalue', 'formType'],

  data(props) {
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Yêu cầu nhập lại mật khẩu'))
      } else if (value !== this.form.password) {
        callback(new Error('Nhập lại mật khẩu không chính xác'))
      } else {
        callback()
      }
    }
    return {
      config,
      urlUploadImage: `${config.api.upload}`,
      genderMap: Object.entries(config.genderMap),
      userList: [],
      loadingUser: false,
      loaiNguoiDungMap: [],
      donVis: [],
      chucVus: [],
      capBacs: [],
      phongBans: [],
      category: config.taxonomyType,
      loadingCategory: false,
      checked: props.formType !== 'edit',
      defaultForm: {
        name: '',
        username: '',
        birthday: Date.now(),
        assignPer: 1
      },
      form: this.formvalue
        ? { ...this.formvalue }
        : {
          name: '',
          username: '',
          birthday: Date.now(),
          assignPer: 1,
          isAdministrator: 0
        },
      formLabelWidth: '150px',
      rulesCreate: {
        username: [
          {
            required: true,
            message: 'Yêu cầu nhập tên đăng nhập',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: 'Yêu cầu nhập mật khẩu',
            trigger: 'blur',
          },
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' },
        ],
        unit: [
          {
            required: true,
            message: 'Yêu cầu chọn đơn vị',
            trigger: 'blur',
          },
        ],
        roles: [
          // {
          //   required: true,
          //   message: 'Yêu cầu chọn quyền',
          //   trigger: 'blur',
          // },
        ],
        roleEmail: [
          {
            required: true,
            message: 'Yêu cầu chọn vai trò',
            trigger: 'blur',
          },
        ],
        phongBan: [
          {
            required: true,
            message: 'Yêu cầu chọn phòng ban',
            trigger: 'blur',
          },
        ],
      },
    }
  },

  watch: {
    formvalue(newValue) {
      if (newValue) {
        this.form = { ...newValue }
        this.checked = !newValue._id
      } else {
        this.form = { ...this.defaultForm }
        this.checked = true
      }
    },
  },

  created() {
    this.getRoles()
    this.getUsers()
  },
  methods: {
    async handleSearchUser(query) {
      const list = this.userList

      if(query !== '') {
        this.loadingUser = true
        try {
          const byName = await UserAPI.get({ name: query })

          if(byName?.data?.length > 0) {
            this.userList = byName.data
          } else {
            const byUsername = await UserAPI.get({ username: query })
            this.userList = byUsername.data
          }

          this.loadingUser = false
        } catch (err) {
          console.log(err)
          this.loadingUser = false
        }
      } else {
        const res = await UserAPI.get({ perPage: 100 })
        this.userList = res.data
      }
    },
    async getUsers() {
      const res = await UserAPI.get()
      this.userList = res.data
    },
    async getRoles() {
      const res = await roleAPI.get({ perPage: 1000 })
      this.loaiNguoiDungMap = res.data
    },
    async onUploadAvatarSuccess(res) {
      if (res) {
        this.form.avatar = `${config.api.domainUpload}/${res.path}`
        this.$message.closeAll()
        this.$message({
          message: res.msg || 'Tải lên thành công',
          type: 'success',
          duration: 3000
        })
      }
    },
    async callbackFromChild(e) {
      if (e.action === 'visibility' && e.data === true) {
        // khi ban đầu vào form thì sẽ reset validation,
        if (this.$refs.form) {
          this.$refs.form.resetFields()
        }
        return
      }
      if (e.action === 'nguoi-dung-submit') {
        const dataSubmit = {
          ...this.form,
          birthday: moment(this.form.birthday).unix()
        }

        this.$refs.form.validate((valid) => {
          if (valid) {
            console.log(dataSubmit)
            // Nếu có id thì là update
            if (this.form._id) {
              // gọi api update dữ liệu

              if (!this.checked) {
                delete dataSubmit.password
                delete dataSubmit.checkPass
              }

              UserAPI.update(this.form._id, dataSubmit)
                .then((res) => {
                  this.$emit('submit-success-event')
                  this.$refs.dialog.updateShowDialog(false)
                })
                .catch((err) => {
                  console.error(err)
                })
            } else {
              // không có id là create
              // gọi api create dữ liệu
              UserAPI.create(dataSubmit)
                .then((res) => {
                  this.$emit('submit-success-event')
                  this.$refs.dialog.updateShowDialog(false)
                })
                .catch((err) => {
                  console.error(err)
                })
            }
          } else {
            return false
          }
        })
      }
    },
  },
}
</script>

<style lang="scss">
.el-dialog__body {
  padding-top: 20px;
}

.el-select__tags {
  span {
    .el-tag {
      background-color: #ecf5ff;
      border-color: #d9ecff;
      color: #409eff;

      .el-tag__close {
        color: #409eff;
        background: #ecf5ff;
        font-size: 13px;

        &:hover {
          color: #fff;
          background: #409eff;
        }
      }
    }
  }
}

.avatar {
  width: 160px;
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;

  .avatar-uploader {
    position: relative !important;

    .el-upload {
      width: 160px;
      height: 160px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #b4bccc;
      position: relative;

      &:hover {
        //border: 1px solid #40a9ff;
        color: #40a9ff;

        .avatar-uploader-icon {
          color: #40a9ff;
        }
      }

      .avatar-blank {
        color: #fff;
        background: #b4bccc;
        width: 160px;
        height: 160px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 60px;
      }

      .avatar-uploader-icon {
        position: absolute;
        bottom: 15px;
        right: 0;
        background: #fff;
        padding: 5px;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #435b71;
      }
    }
  }
}

</style>
