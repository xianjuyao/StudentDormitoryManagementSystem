<template>
  <div class="student-home">
    <h1 class="title">公告信息</h1>
    <div class="notice-box" v-if="notice">
      <el-card class="box-card">
        <div class="content">
          <pre>
             {{notice.detail}}
          </pre>
        </div>
        <div class="time">
          {{notice.time|DateFormatFun}}
        </div>
      </el-card>
    </div>
    <div v-else>
      <h1>暂无公告信息</h1>
    </div>
  </div>
</template>

<script>
  import {getStudentNoticeInfo} from "../../network/student";

  export default {
    name: "StudentHome",
    data() {
      return {
        notice: null
      }
    },
    created() {
      getStudentNoticeInfo().then(res => {
        if (res.data.status) {
          this.notice = res.data.data;
        }
      });
    },
    filters:{
      DateFormatFun(val){
        Date.prototype.format = function(fmt) {
          var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
          };
          if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
          }
          for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
              fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
          }
          return fmt;
        };
        return '----'+new Date(val).format("yyyy-MM-dd");
      }
    }
  }
</script>

<style scoped lang="less">
  .student-home {
    height: 100%;
    width: 100%;

    .title {
      padding-top: 20px;
      font-size: 18px;
      color: black;
      width: 100%;
      text-align: center;
    }
    .notice-box {
      width: 500px;
      margin: 30px auto 0;
      .content {
      }
      .time{
        text-align: right;
      }
    }
  }
</style>
