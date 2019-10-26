<template>
  <div class="admin-user-info">
    <div class="title">
      <h1>查看个人信息</h1>
    </div>
    <el-form label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名:">
        <el-input type="text" :value="userInfo.username"  readonly="readonly" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="性别:">
        <el-input type="text" :value="userInfo.sex"  readonly="readonly" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机号:">
        <el-input type="text" :value="userInfo.tel"  readonly="readonly" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱:">
        <el-input type="text" :value="userInfo.email"  readonly="readonly" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="管理楼栋:" v-if="userInfo.management">
        <el-input type="text" :value="userInfo.management.respective_region+userInfo.management.nums+'栋'"  readonly="readonly" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="头像:">
          <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar">
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "HouseMasterInfo",
    props:{
      userInfo:{
        type:Object,
        default(){
          return {};
        }
      }
    },
  }
</script>

<style scoped lang="less">
  .admin-user-info {
    width: 500px;
    margin: 20px auto;
  .title{
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
  h1{
    font-size: 20px!important;
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
