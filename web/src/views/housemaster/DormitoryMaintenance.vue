<template>
  <div class="building-management">
    <div class="title-box">
      <h1>宿舍报修审核</h1>
    </div>
    <div class="detail-info">
      <div class="bt-right">
        <span>待审核列表</span>
        <el-date-picker
                v-model="startTime"
                type="date"
                placeholder="选择开始日期" style="margin-left: 200px">
        </el-date-picker>
        --
        <el-date-picker
                v-model="endTime"
                type="date"
                placeholder="选择结束日期">
        </el-date-picker>
        <el-button icon="el-icon-search" @click="handleSearch"></el-button>
        <el-button type="success" @click="handleAllInfo" class="show-all">查看所有</el-button>
      </div>
      <el-table
              border
              :data="tableData"
              style="width: 80%;margin: 0 auto">
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
                width="200">
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
                label="操作"
                width="120">
          <template slot-scope="scope">
            <el-button
                    type="success"
                    size="medium"
                    @click="AuditPass(scope.$index, scope.row)">审核通过
            </el-button>
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
  </div>
</template>

<script>

  import {getStudentDormitoryMaintenanceAndZero, updateDormitoryMaintenance} from "../../network/housemaster";

  export default {
    name: "DormitoryMaintenance",
    data() {
      return {
        tableData: [],
        form: {
          content: "",
          time: "",
        },
        startTime: null,
        endTime: null,
        formLabelWidth: "180px",
        pagination: {
          currentPage: 1,//当前位于哪一页,
          total: 0,//总数
          pageSize: 6,//一页显示多少条
          layout: "total,prev, pager, next, jumper"//分页属性
        },
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
      handleAllInfo(){
        this.startTime=null;
        this.endTime=null;
      },
      handleClose(formName) {
        this.dialogInfo.dialogFormVisible = false;
        this.form = {
          content: "",
          time: "",
        };
      },
      fetchSuccess(text, formName) {
        this.$message.success(text);
        this.fetchData();//重新请求数据
      },
      AuditPass(index, row) {
        updateDormitoryMaintenance(row._id)
            .then(res => {
              if (res.data.status) {
                  this.fetchSuccess(res.data.msg);
              }
            });
      },
      handleSearch(){
        this.fetchData();
      },
      handleCurrentChange(page) {
        this.pagination.currentPage = page;//改变当前页数
        this.fetchData();//重新请求数据
      },
      fetchData() {
        getStudentDormitoryMaintenanceAndZero(this.pagination.currentPage, this.startTime, this.endTime)
            .then(res => {
              if (res.data.status) {
                this.tableData = res.data.data.result;
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
        font-size: 18px;
      }
    }

    .detail-info {
      margin-top: 20px;

      .bt-right {
        text-align: left;
        margin-left: 132px;
        margin-bottom: 10px;
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

  .search-left {
    width: 500px;
    margin-right: 150px;
  }

  .show-all {
    margin-right: 150px;
  }
</style>
