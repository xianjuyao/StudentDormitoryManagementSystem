<template>
  <div class="building-management">
    <div class="title-box">
      <h1>宿舍信息管理</h1>
    </div>
    <div class="detail-info">
      <div class="bt-right">
        <el-button type="success" @click="handleAllInfo" class="show-all">查看所有</el-button>
        <el-input placeholder="请输入要查找的宿舍号" v-model="keywords" class="input-with-select search-left">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
        <el-button type="primary" @click="handleAdd">添加信息</el-button>
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
                label="ID"
                width="280"
                align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row._id }}</span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                label="所属区域"
                width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.dormitoryDetailInfo|toStringInfo }}</span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                label="宿舍号"
                width="150">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.hostel_no }}</span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                label="剩余位置"
                width="120">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.residual_position }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         align="center">
          <template slot-scope="scope">
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
                class="pagination">
        </el-pagination>
      </div>
    </div>
    <div>
      <el-dialog :title="dialogInfo.title"
                 :append-to-body="true"
                 :visible.sync="dialogInfo.dialogFormVisible">
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item label="宿舍号" :label-width="formLabelWidth" prop="hostel_no">
            <el-input v-model.number="form.hostel_no" autocomplete="off" type="text"></el-input>
          </el-form-item>
          <el-form-item label="剩余位置" :label-width="formLabelWidth" prop="residual_position">
            <el-input type="text" v-model.number="form.residual_position" autocomplete="off"></el-input>
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
  import {addDormitoryInfo, deleteDormitoryInfo, getDormitoryInfo} from "../../network/housemaster";

  export default {
    props: {
      userInfo: {
        type: Object,
        default() {
          return {
            id: ""
          }
        }
      }
    },
    name: "DormitoryManagement",
    data() {
      return {
        tableData: [],
        form: {
          residual_position: "",
          hostel_no: "",
        },
        keywords: null,
        formLabelWidth: "180px",
        rules: {
          hostel_no: [
            {type: 'number', message: '宿舍号必须为数字值'}
          ],
          residual_position: [
            {type: 'number', message: '剩余位置必须为数字值'}
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
        }
      }
    },
    methods: {
      handleAdd() {
        this.dialogInfo.title = "添加宿舍信息";
        this.dialogInfo.dialogFormVisible = true;
        this.dialogInfo.identity = "add";
        this.form = {
          residual_position: null,
          hostel_no: null
        };
      },
      handleClose(formName) {
        this.dialogInfo.dialogFormVisible = false;
        this.form = {
          residual_position: "",
          hostel_no: null
        };
      },
      fetchSuccess(text, formName) {
        this.dialogInfo.dialogFormVisible = false;
        this.$message.success(text);
        this.fetchData();//重新请求数据
      },
      handleSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {//通过验证
            addDormitoryInfo(this.$store.state.HouseMasterId, this.form).then(res => {
              if (res.data.status) {
                this.fetchSuccess("添加成功!", formName);
              }
            });
          }
        });
      },
      handleSearch() {
        this.fetchData();
      },
      handleAllInfo() {
        this.keywords = null;
        this.fetchData();
      },
      handleDelete(index, row) {
        deleteDormitoryInfo(row._id).then(res => {
          if (res.data.status) {
            this.fetchSuccess(res.data.msg,null);
          }
        });
      },
      handleCurrentChange(page) {
        this.pagination.currentPage = page;//改变当前页数
        this.fetchData();//重新请求数据
      },
      fetchData() {
        getDormitoryInfo(this.pagination.currentPage, this.keywords).then(res => {
          if (res.data.status) {
            this.tableData = res.data.data.list;
            //如果是第一页就不用了跳转了
            if (!this.tableData.length && this.pagination.currentPage !== 1) {
              this.handleCurrentChange(this.pagination.currentPage - 1);
            }
            this.pagination.total = res.data.data.count;
          }
        });
      }
    },

    created() {
      this.fetchData();
    },
    filters: {
      toStringInfo(value) {
        return value[0].respective_region + " " + value[0].nums + "栋";
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
        margin: 0 130px 10px 0;
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
    margin-right: 100px;
  }

  .show-all {
    margin-right: 240px;
  }
</style>
