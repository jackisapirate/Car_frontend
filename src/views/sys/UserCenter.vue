<template>
  <el-row>
    <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="8"><div class="grid-content bg-purple-light">

      <el-form :model="passForm" :rules="rules" ref="passForm" label-width="120px" class="demo-ruleForm">
        <h3> Change Password </h3>
        <el-form-item label="Old password" prop="currentPass">
          <el-input v-model="passForm.currentPass" maxlength="30" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="New password" prop="newPassword">
          <el-input v-model="passForm.newPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="New password*" prop="checkPassword">
          <el-input v-model="passForm.checkPassword" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('passForm')">Confirm</el-button>
          <el-button @click="resetForm('passForm')">Reset</el-button>
        </el-form-item>
      </el-form>
    </div></el-col>
    <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
</template>

<script>
export default {
  name: "UserCenter",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter your password again'));
      } else if (value !== this.passForm.password) {
        callback(new Error('The entered passwords are inconsistent'));
      } else {
        callback();
      }
    };
    return {
      userInfo: {

      },
      passForm: {
        currentPass: '',
        newPassword: '',
        checkPassword: '',
      },
      rules: {
        currentPass: [
          {required: true, message: 'Please input Old Password', trigger: 'blur'},
          {min: 6, max: 12, message: 'The length is 6 to 12 characters', trigger: 'blur'}
        ],
        newPassword: [
          {required: true, message: 'Please input New Password', trigger: 'blur'},
        ],
        checkPassword: [
          {required: true, message: 'Please input New Password again', trigger: 'blur'},
        ]
      }
    };
  },
  methods: {
    getUserInfo() {
      this.$axios.get("/sys/userInfo").then(res => {
        this.userInfo = res.data.data;
      })
    },
    submitForm(passForm) {
      const _this = this;
      _this.$refs[passForm].validate((valid) => {
        if (valid) {
          const _this = this;
          this.$axios.post('/sys/user/updatePass', this.passForm).then(res => {
            _this.$alert(res.data.msg, 'Prompt', {
              confirmButtonText: 'Confirm',
              callback: action => {
                _this.$refs[passForm].resetFields();
              }
            })
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      }
      );
    },
    resetForm(passForm) {
      const _this = this;
      _this.$refs[passForm].resetFields();
    }
  }
}
</script>

<style scoped>
h3{
  text-align: center;
  align-items: center;
}
.el-form-item{
  width: 400px;
  text-align: center;
  align-items: center;
}
.el-input{
  width: 300px;
}
.el-row {
  margin-bottom: 40px;
}
.el-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
