<template>
  <div class="student-info">
    <h1>个人信息详情页</h1>
    <div class="content-show">
      <el-form label-width="100px" class="demo-ruleForm">
        <el-form-item label="学号:">
          <el-input type="text" :value="userInfo.sno"  readonly="readonly" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名:">
          <el-input type="text" :value="userInfo.name"  readonly="readonly" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄:">
          <el-input type="text" :value="userInfo.age"  readonly="readonly" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别:">
          <el-radio v-model="userInfo.sex" label="男" >男</el-radio>
          <el-radio v-model="userInfo.sex" label="女" :disabled="true">女</el-radio>
        </el-form-item>
        <el-form-item label="所属楼栋:" v-if="userInfo.bf">
          <el-input type="text" :value="userInfo.bf.respective_region+' '+userInfo.bf.nums+'栋'"  readonly="readonly" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="宿舍号:" v-if="userInfo.dormitory">
          <el-input type="text" :value="userInfo.dormitory.hostel_no"  readonly="readonly" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像:">
          <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar" style="width: 178px;height: 178px">
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "StudentInfo",
    props: {
      userInfo: {
        type: Object,
        default() {
          return {};
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .student-info {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 20px;
    overflow: hidden;
    h1{
      font-size: 18px;
      text-align: center;
    }
    .content-show{
      padding-top: 10px;
      width: 500px;
      height: 100%;
      margin: 0 auto;
    }
  }
</style>
