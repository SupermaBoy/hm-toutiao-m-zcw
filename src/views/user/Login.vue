<template>
  <div class="page-login">
    <van-nav-bar left-arrow @click-left="$router.back()" title="登 录"></van-nav-bar>
    <van-cell-group>
      <van-field label="手机号"
      placeholder="请输入手机号"
       v-model="loginForm.mobile"
       :error-message="errorMsg.mobileMsg"
       @blur="checkMobile" />
      <van-field label="验证码"
       placeholder="请输入验证码"
       v-model="loginForm.code"
       :error-message="errorMsg.codeMsg"
       @blur="checkCode">
        <van-button class="p5" slot="button" size="mini" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="btn_box">
      <van-button type="info" block round @click="checkAll">登 录</van-button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { login } from '@/api/user.js'
export default {
  name: 'user-login',
  data () {
    return {
      loginForm: {
        mobile: '13222222222',
        code: '246810'
      },
      errorMsg: {
        mobileMsg: '',
        codeMsg: ''
      }
    }
  },
  methods: {
    ...mapMutations(['setUser']),
    checkMobile () {
      const value = this.loginForm.mobile.trim()
      if (!value) {
        this.errorMsg.mobileMsg = '请输入手机号'
      } else if (!/^1[3-9]\d{9}/.test(value)) {
        this.errorMsg.mobileMsg = '请输入正确的手机号'
      } else {
        this.errorMsg.mobileMsg = ''
      }
    },
    checkCode () {
      const value = this.loginForm.code.trim()
      if (!value) {
        this.errorMsg.codeMsg = '请输入验证码'
      } else if (!/\d{6}/.test(value)) {
        this.errorMsg.codeMsg = '请输入正确的验证码'
      } else {
        this.errorMsg.codeMsg = ''
      }
    },
    async checkAll () {
      this.checkMobile()
      this.checkCode()
      if (this.errorMsg.mobileMsg || this.errorMsg.codeMsg) return false
      try {
        const data = await login(this.loginForm)
        console.log(data)
        this.setUser(data)
        this.$router.push(this.$route.query.redirectUrl || '/user')
        this.$toast.success('登陆成功')
      } catch (e) {
        console.log(e)
        this.$toast.fail('手机号或验证码错误')
      }
    }
  }
}
</script>

<style scoped lang = "less">
.p5 {
  padding: 0 5px;
}
.btn_box {
  padding: 10px;
  .van-button {
    height: 32px;
    line-height: 30px;
  }
}
</style>
