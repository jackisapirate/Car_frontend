<template>
  <el-row type="flex" class="row-bg" justify="center">

    <div class="windowL">
    <el-col :xl="6" :lg="8">
      <div class="grid-content bg-purple">
        <h1>Used Car Information</h1>
        <el-image
            style="width: 200px;"
            :src="require('@/assets/logo.png')"
            alt="Vue logo"></el-image>
        <p>Front-end by VUE2.0</p>
        <p>Style by Element-UI</p>
      </div>
    </el-col>
    <el-col :span="1">
      <div class="grid-content bg-purple-light">
        <el-divider direction="vertical"></el-divider>
      </div>
    </el-col>
    <el-col :xl="6" :lg="8">
      <div class="grid-content bg-purple">
        <h1>This is an Login Page</h1>
        <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px" class="demo-loginForm">
          <el-form-item label="Username" prop="username" style="width: 380px">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="password" style="width: 380px">
            <el-input v-model="loginForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item label="Verification Code" prop="code" style="width: 380px">
            <el-input v-model="loginForm.code" style="width: 172px; float: left"></el-input>
            <el-image :src="captchaImg" class="captchaImg" @click="getCaptcha"></el-image>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')">Confirm</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
    </div>
  </el-row>
</template>

<script>
import qs from "qs";
import request from "@/axios";

export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: 'root',
        code: '',
        token: ''
      },
      rules: {
        username: [
          {required: true, message: 'Please enter the Username', trigger: 'blur'},
        ],
        password: [
          {required: true, message: 'Please enter the Password', trigger: 'blur'},
          {min: 4, message: 'The value contains more than 4 characters', trigger: 'blur'}
        ],
        code: [
          {required: true, message: 'Please enter the Verification Code', trigger: 'blur'},
          {min: 4, max: 4, message: 'The value must contain 4 characters', trigger: 'blur'}
        ]
      },
      captchaImg: null
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axiosSourse.post('/login', qs.stringify(this.loginForm)).then(res => {
            console.log(res);
            const jwt = res.headers['authorization']
            // trigger vuex to store the jwt
            this.$store.commit('SET_TOKEN', jwt)
            this.$router.push("/index").catch(err => {
              console.log('Redirects the same route',err)
            });
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getCaptcha() {
      this.$axios.get('/getCaptcha').then(res => {
        console.log("Background verification code is returned；")
        console.log(res)
        this.loginForm.token = res.data.data.token;
        this.captchaImg = res.data.data.base64Img;
        this.loginForm.code = '';
      })
    }
  },
  created() {
    // this.getCaptcha();
    this.$axios.get('/getCaptcha').then(res => {
      console.log("Background verification code is returned；")
      console.log(res)
      this.loginForm.token = res.data.data.token;
      this.captchaImg = res.data.data.base64Img;
      this.loginForm.code = '';
    })
  }
}
</script>

<style>
.windowL{
  background-color: #E9EEF3;
  height: 80%;
  display: flex;
  align-items: center;
  text-align: center;
}
.el-row {
  background-color: #fafafa;
  height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
}

.el-col {
  height: 100%;
}

.el-divider {
  height: 80%;
}

.captchaImg {
  float: left;
  margin-left: 8px;
  border-radius: 4px;
  width: 100px;
}

.bg-purple {
  margin-top: 80px;
  /*background-color: #B3C0D1;*/
}
</style>
