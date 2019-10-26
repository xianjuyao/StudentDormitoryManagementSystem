<template>
  <div class="chang-pw">
    <div class="title">
      <h1>个人密码修改</h1>
    </div>
    <el-form :model="userInfo" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="新密码" prop="password">
        <el-input type="password" v-model="userInfo.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="重复密码" prop="repeatPassword">
        <el-input type="password" v-model="userInfo.repeatPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">更新</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {updateStudentInfo} from "../../network/student";
  export default {
    name: "StudentChangePassword",
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.userInfo.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        userInfo: {
          password: "",
          repeatPassword: ""
        },
        rules: {
          password: [
            {validator: validatePass, trigger: "blur"},
            {min: 6, max: 18, message: "密码的长度在6-18个字符!", trigger: "blur"}
          ],
          repeatPassword: [
            {min: 6, max: 18, message: "密码的长度在6-18个字符!", trigger: "blur"},
            {validator: validatePass2, trigger: "blur"},
          ]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            updateStudentInfo({
              id: this.$store.state.StudentId,
              password: this.userInfo.password
            }).then(res => {
              if (res.data.status) {
                this.$message.success(res.data.msg);
                localStorage.removeItem("token");
                this.$router.push("/student/login");
              }
            });

            console.log("valid");
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped lang="less">
  .chang-pw {
    width: 500px;
    margin: 20px auto;

    .title {
      width: 100%;
      text-align: center;
      margin-bottom: 20px;

      h1 {
        font-size: 20px !important;
      }
    }
  }
</style>
