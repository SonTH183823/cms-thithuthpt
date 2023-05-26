<template>
  <div class="navbar">
    <!--    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"/>-->

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <span style="font-weight: 600">{{ userInfo.username }} {{ userInfo.name ? `- ${userInfo.name}` : '' }}</span>
          <el-icon name="user-solid" class="icon-avatar"/>
          <i class="el-icon-caret-bottom"/>
        </div>
        <!--        <div class="avatar-wrapper">-->
        <!--        </div>-->
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              Trang chủ
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="handleEditInfo">
            Thông tin cá nhân
          </el-dropdown-item>
          <el-dropdown-item @click.native="handleChangePassword">
            Đổi mật khẩu
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Đăng xuất</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog
      :close-on-click-modal="false"
      :modal="true"
      :modal-append-to-body="false"
      title="Thông tin cá nhân"
      :visible.sync="dialogUserInfo"
    >

      <el-form ref="form" :model="form">
        <el-form-item
          label="Tên đăng nhập"
          :label-width="formLabelWidth"
          prop="username"
        >
          <el-input v-model="form.username" :disabled="true" autocomplete="off"/>
        </el-form-item>
        <el-form-item
          label="Họ và tên"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input v-model="form.name" autocomplete="off"/>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogUserInfo = false">Hủy</el-button>
        <el-button type="primary" @click="handleSubmitUserInfo">Xác nhận</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :modal="true"
      :modal-append-to-body="false"
      title="Thay đổi mật khẩu"
      :visible.sync="dialogPasswordForm"
    >

      <el-form ref="formPassword" :model="formPassword" :rules="ruleFormPassword">
        <el-form-item
          label="Mật khẩu cũ"
          :label-width="formLabelWidth"
          prop="oldPassword"
        >
          <el-input
            ref="oldPassword"
            :key="oldPasswordType"
            v-model="formPassword.oldPassword"
            :type="oldPasswordType"
            autocomplete="off"
          />
          <span class="show-pwd" @click="showOldPwd">
            <svg-icon :icon-class="oldPasswordType === 'password' ? 'eye' : 'eye-open'"/>
          </span>
        </el-form-item>
        <el-form-item
          label="Mật khẩu mới"
          :label-width="formLabelWidth"
          prop="newPassword"
        >
          <el-input
            ref="newPassword"
            :key="newPasswordType"
            v-model="formPassword.newPassword"
            :type="newPasswordType"
            autocomplete="off"
          />
          <span class="show-pwd" @click="showNewPwd">
            <svg-icon :icon-class="newPasswordType === 'password' ? 'eye' : 'eye-open'"/>
          </span>
        </el-form-item>
        <el-form-item
          label="Xác nhận mật khẩu"
          :label-width="formLabelWidth"
          prop="checkPass"
        >
          <el-input
            ref="checkPass"
            :key="checkPassType"
            v-model="formPassword.checkPass"
            :type="checkPassType"
            autocomplete="off"
          />
          <span class="show-pwd" @click="showCheckPass">
            <svg-icon :icon-class="checkPassType === 'password' ? 'eye' : 'eye-open'"/>
          </span>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPasswordForm = false">Hủy</el-button>
        <el-button type="primary" @click="handleSubmitChangePassword">Xác nhận</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import moment from 'moment'
import {mapGetters} from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import config from '@/utils/config'
import UserAPI from '@/api/auth/user'

moment.locale('vi')

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Yêu cầu nhập lại mật khẩu'))
      } else if (value !== this.formPassword.newPassword) {
        callback(new Error('Nhập lại mật khẩu không chính xác'))
      } else {
        callback()
      }
    }

    return {
      urlUploadImage: `${config.api.upload}/upload`,
      genderMap: config.genderMap,
      userInfo: localStorage.getItem(config.userKey) ? JSON.parse(localStorage.getItem(config.userKey)) : {},
      dialogUserInfo: false,
      dialogPasswordForm: false,
      formLabelWidth: '150px',
      checked: false,
      oldPasswordType: 'password',
      newPasswordType: 'password',
      checkPassType: 'password',
      formPassword: {},
      notifications: [],
      ruleFormPassword: {
        oldPassword: [
          {
            required: true,
            message: 'Yêu cầu nhập mật khẩu cũ',
            trigger: 'change',
          },
        ],
        newPassword: [
          {
            required: true,
            message: 'Yêu cầu nhập mật khẩu mới',
            trigger: 'change',
          },
        ],
        checkPass: [
          {required: true, validator: validatePass2, trigger: 'change'},
        ],
      },
      form: {
        avatar: ''
      },
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
  },
  methods: {
    showOldPwd() {
      if (this.oldPasswordType === 'password') {
        this.oldPasswordType = ''
      } else {
        this.oldPasswordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.oldPassword.focus()
      })
    },
    showNewPwd() {
      if (this.newPasswordType === 'password') {
        this.newPasswordType = ''
      } else {
        this.newPasswordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.newPassword.focus()
      })
    },
    showCheckPass() {
      if (this.checkPassType === 'password') {
        this.checkPassType = ''
      } else {
        this.checkPassType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.checkPass.focus()
      })
    },
    handleChangePassword() {
      this.dialogPasswordForm = true
      this.formPassword = {}
      this.newPasswordType = 'password'
      this.oldPasswordType = 'password'
      this.checkPassType = 'password'
      this.$refs.formPassword.resetFields()
    },
    async handleEditInfo() {
      this.form = {...this.userInfo}
      this.dialogUserInfo = true
    },
    async handleSubmitUserInfo() {
      await UserAPI.update(this.form._id, ...this.form)
        .then((res) => {

        })
        .catch((err) => {
          console.error(err)
        })
    },
    async handleSubmitChangePassword() {
      this.$refs.formPassword.validate(async (valid) => {
        const {newPassword, oldPassword} = this.formPassword
        const dataSubmit = {newPassword, oldPassword}
        if (valid) {
          await UserAPI.changePassword(dataSubmit)
          this.dialogPasswordForm = false
        } else {
          return false
        }
      })
    },
    async logout() {
      // await UserAPI.logout()
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.show-pwd {
  position: absolute;
  right: 10px;
  font-size: 16px;
  color: #889aa4;
  cursor: pointer;
  user-select: none;
}

.avatar-user {
  margin-left: 10px;
  height: 33px;
  width: 33px;
  border-radius: 50%;
  object-fit: cover;
  vertical-align: middle;
  cursor: pointer;
}

.icon-avatar {
  margin-left: 10px;
  font-size: 18px;
  cursor: pointer;
  height: 32px;
  width: 32px;
  background: #97a8be;
  text-align: center;
  border-radius: 50%;
  color: #fff;
  padding-top: 5px;

  &:hover {
    background: #02967D;
  }
}

.user-dropdown {
  top: 50px !important;
}

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
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

.dialog-user-info {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1) !important;
}

.icon-notify {
  cursor: pointer;
  width: 28px;
  height: 28px;
  color: #97a8be;
  font-size: 20px;
  border-radius: 50%;
  text-align: center;
  align-items: center;
  vertical-align: middle;
  display: flex;
  justify-content: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%) translateX(-150%);

  &:hover {
    color: #40a9ff;
  }

  .badge {
    width: 24px;
    height: 18px;
    border-radius: 10px;
    background: #f56c6c;
    color: #fff;
    margin-left: 25px;
    position: absolute;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    padding: 4px;
  }
}

.notify-box {
  border-radius: 5px;
  position: relative;

  .option-read {
    cursor: pointer;
    position: absolute;
    top: 50px;
    right: 12px;
    font-size: 13px;
    color: #99a9bf;

    &:hover {
      text-decoration: underline;
      color: #606266;
    }
  }

  .title {
    margin: 0;
    font-size: 1.5em;
    font-style: inherit;
    font-weight: 500;
    letter-spacing: -.01em;
    line-height: 1.16666667;
    color: #172b4d;
    border-bottom: 1px solid #e4e7ed;
    padding-bottom: 12px;
  }

  .content {
    margin-top: 30px;
    padding: 5px;
    max-height: calc(100vh - 100px);
    overflow-y: auto;

    .notify-row {
      display: flex;
      align-items: flex-start;
      border-radius: 5px;
      padding: 10px;
      cursor: pointer;

      &:hover {
        background: #f4f5f7;
      }

      .icon-wrap {
        flex: 1;

        .icon-user {
          width: 32px;
          height: 32px;
          background: #97a8be;
          border-radius: 50%;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .detail {
        flex: 8;
        padding-left: 10px;
        padding-right: 20px;

        span {
          word-break: break-word;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.42857143;
        }

        .time {
          margin-top: 5px;
          color: #99a9bf;
          font-size: 13px;
          display: inline-block;
          font-weight: 400;
        }
      }

      .option {
        flex: 1;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;

        .icon-delete {
          border-radius: 2px;

          &:hover {
            i {
              font-weight: 700;
            }
          }
        }

        .icon-masrk-as-read-wrap {
          display: flex;
          justify-content: center;
          align-items: center;

          .icon-masrk-as-read {
            margin-left: 5px;
            display: inline-block;
            background: #40a9ff;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            border: 4px solid #ebecf0;

            &:hover {
              background: #97a8be;
            }
          }
        }
      }
    }
  }
}
</style>
