<template>
  <div class="login">
    <div class="title">
      <h1>学生宿舍管理系统</h1>
    </div>
    <div class="login-box">
      <el-form :model="form" :rules="rules" ref="userInfo" label-width="70px" class="demo-ruleForm">
        <el-form-item label="学号" prop="sno">
          <el-input type="text"  autocomplete="off" v-model="form.sno"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('userInfo')">登录</el-button>
          <el-button @click="resetForm('userInfo')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {studentLogin} from "../../network/student";

  export default {
    name: "StudentLogin",
    data(){
      //校验用户名
      let validUserSno= (rule, value, callback) => {
        if (value.trim() === '' || value.trim().length === 0) {
          callback(new Error('学号不能为空!'));
        } else {
          callback();
        }
      };
      //校验密码
      let validPassword = (rule, value, callback) => {
        if (value.trim() === '' || value.trim().length === 0) {
          callback(new Error('密码不能为空!'));
        } else {
          callback();
        }
      };
      return{
        form:{
          sno:"",
          password:""
        },
        rules: {
          username: [
            {validator: validUserSno, trigger: "blur"},
            {min: 12, max: 12, message: "学号长度为12个数字", trigger: "blur"}
          ],
          password: [
            {validator: validPassword, trigger: "blur"},
            {min: 6, max: 16, message: "密码长度在6-16个字符之间", trigger: "blur"}
          ]
        },
      }
    },
    methods:{
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {//通过验证
            studentLogin(this.form).then(res => {
              if (res.data.status) {//执行成功
                localStorage.setItem("token", res.data.data);//保存在本地
                this.$message.success("登录成功!");
                this.$router.push("/student/index");
              }
            });
          }
        });
      },
      resetForm(forName) {
        this.$refs[forName].resetFields();
      }
    }
  }
</script>

<style scoped lang="less">
  .login {
    background: url("../../assets/login.jpg") no-repeat;
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    position: relative;

  .title {
    position: absolute;
    top: 20%;
    left: 50%;
    margin-left: -185px;
    width: 370px;
    text-align: center;

  h1 {
    font-size: 20px;
    color: white;
    font-weight: bold;
  }
  }

  .login-box {
    position: absolute;
    width: 370px;
    background: white;
    padding: 30px 20px 20px 0;
    left: 50%;
    margin-left: -185px;
    top: 30%;
    box-sizing: border-box;
  }
  }
</style>
