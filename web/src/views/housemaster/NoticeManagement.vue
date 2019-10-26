<template>
  <div class="notice">
    <div class="title-box">
      <h1>发布公告信息</h1>
    </div>
    <div class="info-show-box">
      <el-card class="box-card">
        <div slot="header" class="clearfix" style="text-align: center">
          <span>公告信息发布栏</span>
        </div>
        <div class="text item">
          <el-form ref="form"  label-width="80px" :model="notice">
            <el-form-item label="发布时间">
                <el-date-picker type="date" placeholder="选择日期"  v-model="notice.time" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="发布内容">
              <el-input type="textarea" v-model="notice.detail"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即发布</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  import {getNoticeInfo,updateNoticeInfo} from "../../network/housemaster";

  export default {
    name: "NoticeManagement",
    data(){
      return {
        notice:{
          _id:"",
          time:null,
          detail:"",
          bf_id:"",
        },
      }
    },
    methods:{
      onSubmit(){
        updateNoticeInfo(this.notice).then(res=>{
          if (res.data.status){
            this.$message.success(res.data.msg);
          }
        })
      }
    },
    created() {
      getNoticeInfo().then(res=>{
        if (res.data.status){
          console.log(res.data);
          this.notice=res.data.data;
        }
      });
    }
  }
</script>

<style scoped lang="less">
  .notice {
    padding: 20px;
    box-sizing: border-box;
    .title-box{
      width: 100%;
      text-align: center;
      h1 {
        font-size: 18px;
      }
    }
    .info-show-box{
      padding-top: 50px;
      width: 500px;
      height: 500px;
      margin: 10px auto;
    }
  }
</style>
