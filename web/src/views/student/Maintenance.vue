<template>
  <div class="building-management">
    <div class="title-box">
      <h1>申请宿舍报修</h1>
    </div>
    <div class="detail-info">
      <div class="bt-right">
        <span class="text-title">报修记录</span>
        <el-button type="primary" @click="handleAdd">添加信息</el-button>
      </div>
      <el-table
              border
              :data="tableData"
              style="width: 100%;margin: 0 auto">
        <el-table-column
                label="序号"
                width="70"
                align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.$index+1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                label="所属区域"
                width="100">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.bfInfo[0].respective_region+" "+scope.row.bfInfo[0].nums+"栋" }}</span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                label="宿舍号"
                width="70">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.dormitoryInfo[0].hostel_no}}</span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                label="报修时间"
                width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.time|timeToString}}</span>
          </template>
        </el-table-column>
        <el-table-column label="报修内容"
                         align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.content}}</span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                label="状态"
                width="100">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.status===0?'未修复':'已修复'}}</span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                label="修复时间"
                width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.repair_time|timeToString}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 10px">
        <el-pagination
                background
                @current-change="handleCurrentChange"
                :current-page="pagination.currentPage"
                :page-size="pagination.pageSize"
                :layout="pagination.layout"
                :total="pagination.total"
                class="pagination">
        </el-pagination>
      </div>
    </div>
    <div>
      <el-dialog :title="dialogInfo.title"
                 :append-to-body="true"
                 :visible.sync="dialogInfo.dialogFormVisible">
        <el-form ref="form">
          <el-form-item label="报修内容" :label-width="formLabelWidth">
            <el-input v-model="form.content" autocomplete="off" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="报修时间" :label-width="formLabelWidth">
            <el-date-picker
                    v-model="form.time"
                    type="datetime"
                    placeholder="选择报修时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose('form')">取消</el-button>
          <el-button type="primary" @click="handleSubmit('form')">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {getMaintenanceInfo, saveMaintenanceInfo} from "../../network/student";

  export default {
    name: "Maintenance",
    data() {
      return {
        tableData: [],
        form: {
          content: "",
          time: "",
        },
        keywords: null,
        formLabelWidth: "180px",
        pagination: {
          currentPage: 1,//当前位于哪一页,
          total: 0,//总数
          pageSize: 6,//一页显示多少条
          layout: "total,prev, pager, next, jumper"//分页属性
        },
        dialogInfo: {
          title: "",
          dialogFormVisible: false,
          identity: ""
        }
      }
    },
    methods: {
      handleAdd() {
        this.dialogInfo.title = "添加宿舍报修信息";
        this.dialogInfo.dialogFormVisible = true;
        this.dialogInfo.identity = "add";
        this.form = {
          content: "",
          time: "",
        };
      },
      handleClose(formName) {
        this.dialogInfo.dialogFormVisible = false;
        this.form = {
          content: "",
          time: "",
        };
      },
      fetchSuccess(text, formName) {
        this.dialogInfo.dialogFormVisible = false;
        this.$message.success(text);
        this.fetchData();//重新请求数据
      },
      handleSubmit(formName) {
        saveMaintenanceInfo(this.form)
            .then(res => {
              if (res.data.status) {
                this.fetchSuccess(res.data.msg);
                this.fetchData();//重新请求数据
              }
            });
      },
      handleCurrentChange(page) {
        this.pagination.currentPage = page;//改变当前页数
        this.fetchData();//重新请求数据
      },
      fetchData() {
        getMaintenanceInfo(this.pagination.currentPage).then(res => {
          if (res.data.status) {
            console.log(res.data.data);
            this.tableData = res.data.data.list;
            //如果是第一页就不用了跳转了
            if (!this.tableData.length && this.pagination.currentPage !== 1) {
              this.handleCurrentChange(this.pagination.currentPage - 1);
            }
            this.pagination.total = res.data.data.count;
          }
        });
      },
    },
    created() {
      this.fetchData();
    },
    filters: {
      timeToString(val) {
        if (val !== null) {
          Date.prototype.format = function (fmt) {
            var o = {
              "M+": this.getMonth() + 1,                 //月份
              "d+": this.getDate(),                    //日
              "h+": this.getHours(),                   //小时
              "m+": this.getMinutes(),                 //分
              "s+": this.getSeconds(),                 //秒
              "q+": Math.floor((this.getMonth() + 3) / 3), //季度
              "S": this.getMilliseconds()             //毫秒
            };
            if (/(y+)/.test(fmt)) {
              fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
              if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
              }
            }
            return fmt;
          };
          return new Date(val).format("yyyy-MM-dd hh:mm:ss");
        }else {
          return "--";
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .building-management {
    box-sizing: border-box;
    padding-left: 20px;
    padding-right: 20px;

    .title-box {
      margin-top: 10px;
      width: 100%;
      text-align: center;

      h1 {
        font-size: 20px;
      }
    }

    .detail-info {
      margin-top: 20px;
      width: 100%;
      .bt-right {
        width: 100%;
        height: 40px;
        margin: 10px auto;
        span {
          line-height: 40px;
        }
        button {
          display: inline-block;
          float: right;
        }
      }

      .dialog-box {
        background: white;
      }
    }
  }

  .pagination {
    text-align: right;
    box-sizing: border-box;
    padding-right: 130px;
  }
</style>
