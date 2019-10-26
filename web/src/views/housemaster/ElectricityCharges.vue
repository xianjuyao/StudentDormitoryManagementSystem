<template>
  <div class="building-management">
    <div class="title-box">
      <h1>宿舍电费详情管理</h1>
    </div>
    <div class="detail-info">
      <div class="bt-right">
        <el-button type="success" @click="handleAllInfo" class="show-all">查看所有</el-button>
        <el-date-picker
                v-model="month"
                type="month"
                placeholder="选择月">
        </el-date-picker>
        <el-button icon="el-icon-search" @click="handleSearch"></el-button>
        <el-button type="primary" @click="handleAdd">添加信息</el-button>
      </div>
      <el-table
              border
              :data="tableData"
              style="width: 90%;margin: 0 auto">
        <el-table-column
                label="序号"
                width="70"
                align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.$index+1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
                label="ID"
                width="260"
                align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row._id }}</span>
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
                width="100">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.dormitoryInfo[0].hostel_no}}</span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                label="电费"
                width="150">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.cost+"元"}}</span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                label="时间"
                width="150">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.time|timeToString }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作"
                         align="center"
        >
          <template slot-scope="scope">
            <el-button
                    type="success"
                    size="medium"
                    @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
                    size="medium"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除
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
                class="pagination"
        >
        </el-pagination>
      </div>
    </div>
    <div>
      <el-dialog :title="dialogInfo.title"
                 :append-to-body="true"
                 :visible.sync="dialogInfo.dialogFormVisible">
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item label="宿舍号" :label-width="formLabelWidth">
            <el-select v-model="form.dormitory" placeholder="请选择宿舍号" prop="hostel_no" filterable>
              <el-option :label="item.hostel_no" :value="item._id" v-for="item in dormitoryList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="月份" :label-width="formLabelWidth">
            <el-date-picker
                    v-model="form.time"
                    type="month"
                    placeholder="选择月份">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="电费" :label-width="formLabelWidth" prop="score">
            <el-input v-model.number="form.cost" autocomplete="off"></el-input>
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
  import {
    getAllDormitoryInfo,
    addEleCharges,
    getEleCharges,
    updateEleCharges,
    deleteEleCharges
  } from "../../network/housemaster";

  export default {
    name: "ElectricityCharges",
    data() {
      let checkNums = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入宿舍号信息'));
        } else {
          callback();
        }
      };
      return {
        tableData: [],
        form: {
          dormitory: null,
          cost: null,
          time: null
        },
        month: "",
        formLabelWidth: "180px",
        rules: {
          hostel_no: [
            {required: true, triggered: 'blur'}
          ],
          score: [
            {validator: checkNums, trigger: "blur"},
            {type: 'number', message: '楼栋必须为数字值'}
          ]
        },
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
        },
        dormitoryList: []
      }
    },
    methods: {
      fetchData() {
        getEleCharges(this.pagination.currentPage, this.month).then(res => {
          if (res.data.status) {
            this.tableData = res.data.data.result;
            //如果是第一页就不用了跳转了
            if (!this.tableData.length && this.pagination.currentPage !== 1) {
              this.handleCurrentChange(this.pagination.currentPage - 1);
            }
            this.pagination.total = res.data.data.count;
          }
        })
      },
      handleClose(formName) {
        this.dialogInfo.dialogFormVisible = false;
        this.form = {
          cost: null,
          dormitory: null,
          time: null,
        };
      },
      handleSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {//通过验证
            if (this.dialogInfo.identity === "edit") {//编辑界面
              updateEleCharges(this.form).then(res => {
                if (res.data.status) {
                  this.fetchSuccess(res.data.msg, formName);
                }
              });
            } else {
                addEleCharges(this.form).then(res => {
                if (res.data.status) {
                  this.fetchSuccess("添加成功!", formName);
                }
              });

            }
          }
        });
      },
      handleEdit(index, row) {
        this.dialogInfo.title = "编辑信息";
        this.dialogInfo.dialogFormVisible = true;
        this.dialogInfo.identity = "edit";
        this.form = {
          id: row._id,
          cost: row.cost,
          dormitory: row.dormitory,
          time: row.time,
        };
      },
      //处理添加事件
      handleAdd() {
        this.dialogInfo.title = "添加信息";
        this.dialogInfo.identity = "add";
        this.dialogInfo.dialogFormVisible = true;
        this.form = {
          cost: null,
          dormitory: null,
          time: null,
        };
      },
      handleDelete(index, row) {
        deleteEleCharges(row._id).then(res => {
          if (res.data.status) {
            this.$message.success(res.data.msg);
            this.fetchData();
          }
        });
      },
      handleCurrentChange(page) {//page当前所在页
        this.pagination.currentPage = page;//改变当前页数
        this.fetchData();//重新请求数据
      },
      fetchSuccess(text, formName) {
        this.dialogInfo.dialogFormVisible = false;
        this.$message.success(text);
        this.fetchData();//重新请求数据
      },
      handleSearch() {
        this.fetchData();
      },
      handleAllInfo() {
        this.month = null;
        this.fetchData();
      }
    },
    created() {
      this.fetchData();//请求数据
      //请求所有本栋的宿舍的信息
      getAllDormitoryInfo().then(res => {
        if (res.data.status) {
          this.dormitoryList = res.data.data;
        }
      });
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
        return new Date(val).format("yyyy-MM");
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
        text-align: right;
        margin: 0 510px 10px 0;
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
    margin-right: 240px;
  }
</style>
