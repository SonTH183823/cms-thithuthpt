<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left">

      <div class="title-container">
        <img src="@/assets/images/logo-full.png" alt="" class="logo"/>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Tên đăng nhập"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Mật khẩu"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >Đăng nhập
      </el-button>

    </el-form>
  </div>
</template>

<script>
import {validUsername} from '@/utils/validate'
import defaultSettings from '@/settings'
import UserAPI from "@/api/auth/user"

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Vui lòng nhập tên đăng nhập'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Vui lòng nhập mật khẩu'))
      } else {
        callback()
      }
    }
    return {
      title: defaultSettings.title,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{required: true, trigger: 'blur', validator: validateUsername}],
        password: [{required: true, trigger: 'blur', validator: validatePassword}]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({path: this.redirect || '/'})
            window.location.reload()
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error login submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">

$bg: #f3f4f6;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    //color: $cursor;

    &:-webkit-autofill {
      box-shadow: 0 0 0px 1000px $bg inset !important;
    }
  }
}

.logo {
  object-fit: cover;
  height: fit-content;
  max-height: 100px;
  margin-bottom: 20px;
  width: 75%;
}

/* reset element-ui css */
.login-container {
  .logo {
    width: 250px;
    height: 200px;
  }

  .title-content {
    font-weight: 600;
    font-size: 24px;
    color: #435b71;
  }

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      padding: 12px 5px 12px 15px;
      height: 47px;
    }
  }

  .el-form-item {
    border: 1px solid #dcdfe6;
    border-radius: 5px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #f3f4f6;
$dark_gray: #889aa4;
$light_gray: #eee;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    //color: $cursor;

    &:-webkit-autofill {
      box-shadow: 0 0 0px 1000px $bg inset !important;
    }
  }
}

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 20px 35px 0;
    margin: 20vh auto 0;
    overflow: hidden;
    background: #fff;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    text-align: center;

    .title {
      font-size: 26px;
      //color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
