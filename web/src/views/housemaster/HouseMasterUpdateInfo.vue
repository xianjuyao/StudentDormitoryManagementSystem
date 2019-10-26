<template>
  <div class="admin-user-info">
    <div class="title">
      <h1>查看个人信息</h1>
    </div>
    <el-form label-width="100px" class="demo-ruleForm" ref="ruleForm" :rules="rules" :model="userInfo">
      <el-form-item label="用户名:" prop="username">
        <el-input type="text" v-model="userInfo.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="性别:">
        <el-radio-group v-model="userInfo.sex">
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号:" prop="tel">
        <el-input type="text" v-model="userInfo.tel" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱:">
        <el-input type="text" v-model="userInfo.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="头像:">
        <el-upload
                class="avatar-uploader"
                :action="$http.defaults.baseURL+'/housemaster/uploads'"
                :show-file-list="false"
                :headers="getAuthHeaders()"
                :on-success="handleAvatarSuccess">
          <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">更新</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {updateHouseMasterInfo} from "../../network/housemaster";

  export default {
    name: "HouseMasterUpdateInfo",
    props: {
      userInfo: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    data() {
      let checkUserName = (rule, value, callback) => {
        if (value.trim() === '') {
          callback(new Error('请输入正确的用户名!'));
        } else {
          callback();
        }
      };
      let checkTel = (rule, value, callback) => {
        if (value.trim() === '') {
          callback(new Error('请输入正确的手机号!'));
        } else if (value.trim().length !== 11 && value.trim().length !== 14) {
          callback(new Error("手机号格式不正确"));
        } else {
          callback();
        }
      };
      return {
        rules: {
          username: [
            {min: 2, max: 8, message: "用户名在2-8个字符之间", trigger: 'blur'},
            {validator: checkUserName, trigger: 'blur'}
          ],
          tel: [
            {validator: checkTel, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleAvatarSuccess(res) {
        console.log(res);
        this.userInfo.avatar = res.url;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            updateHouseMasterInfo(this.userInfo)
                .then(res => {
                  this.$message.success(res.data.msg);
                  this.$router.push("/housemaster/index");
                });
          }
        });
      },
      resetForm() {
        this.$router.go(0);
      }
    }
  }
</script>

<style scoped lang="less">
  .admin-user-info {
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

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
