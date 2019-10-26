<template>
  <div class="housemaster-management">
    <div class="title-box">
      <h1>宿管信息管理</h1>
    </div>
    <div class="detail-info">
      <div class="bt-right">
        <el-button type="primary" @click="handleAdd">添加信息</el-button>
        <el-button type="success" @click="handleAllInfo" class="show-all">查看所有</el-button>
        <el-input placeholder="请输入要查找的学生的学号" v-model="keywords" class="input-with-select search-left">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
      </div>
      <!--表格-->
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
                label="学号"
                width="220"
                align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.sno }}</span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                label="姓名"
                width="100">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                label="性别"
                width="100">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.sex }}</span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                label="年龄"
                width="100">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.age }}</span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                label="所属楼栋"
                width="150">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.bfInfo[0]|toShowString}}</span>
          </template>
        </el-table-column>
        <el-table-column
                align="center"
                label="宿舍"
                width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.dormitoryInfo[0].hostel_no }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         align="center">
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
      <!--表格 end-->
      <!--分页-->
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
      <!--分页 end-->
    </div>
    <!--模态框 -->
    <div>
      <el-dialog :title="dialogInfo.title"
                 :append-to-body="true"
                 :visible.sync="dialogInfo.dialogFormVisible">
        <el-form :model="student" :rules="rules" ref="form" label-width="80px">
          <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="基本信息" name="first">
              <el-form-item label="学号" prop="sno">
                <el-input v-model="student.sno" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="name">
                <el-input v-model="student.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="年龄" prop="age">
                <el-input v-model="student.age" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                <el-select v-model="student.sex">
                  <el-option label="男" value="男"></el-option>
                  <el-option label="女" value="女"></el-option>
                </el-select>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="管理信息" name="second">
              <el-form-item label="密码" prop="password">
                <el-input v-model="student.password"></el-input>
              </el-form-item>
              <el-form-item label="宿舍号">
                <el-select v-model="student.dormitory" placeholder="请选择宿舍号" prop="hostel_no" filterable>
                  <el-option :label="item.hostel_no" :value="item._id" v-for="item in dormitoryList"></el-option>
                </el-select>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose('form')">取消</el-button>
          <el-button type="primary" @click="handleSubmit('form')">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <!--模态框 end-->
  </div>
</template>

<script>
  import {
    addStudentInfo, deleteStudentInfo,
    getAllDormitoryInfo,
    getPdormitory,
    getStudentInfo,
    updateStudentInfo
  } from "../../network/housemaster";

  export default {
    name: "StudentManagement",
    data() {
      let checkSno = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入学号'));
        } else if (value.trim().length !== 12) {
          callback(new Error("学号的长度必须为12"));
        } else {
          callback();
        }
      };
      return {
        tableData: [],
        activeName: "first",
        keywords: null,
        dormitoryList: [],
        student: {
          _id: null,
          sno: null,
          name: null,
          age: null,
          sex: null,
          password: null,
          avatar: null,
          //宿舍id
          dormitory: null,
          //所属楼栋
          bf_id: null
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
        rules: {
          sno: [
            {required: true, message: "请输入学号", trigger: "blur"},
            {validator: checkSno, trigger: "blur"},
          ],
          name: [
            {required: true, message: "请输入姓名!", trigger: "blur"}
          ],
          password: [
            {required: true, message: "请输入密码", trigger: "blur"},
            {min: 6, max: 18, message: "密码在6-18个字符之间", trigger: "blur"}
          ],
        }
      }
    },
    methods: {
      //处理添加信息，打开模态框
      handleAdd() {
        this.dialogInfo.title = "添加学生信息";
        for (let key in this.houseInfo) {//置空数据添加
          this.houseInfo[key] = null;
        }
        this.dialogInfo.dialogFormVisible = true;
        this.dialogInfo.identity = "add";
      },
      //关闭模态框
      handleClose(formName) {
        this.student = {
          _id: null,
          sno: null,
          name: null,
          age: null,
          sex: null,
          password: null,
          avatar: null,
          //宿舍id
          dormitory: null,
          //所属楼栋
          bf_id: null
        };
        this.dialogInfo.dialogFormVisible = false;
      },
      handleCurrentChange(page) {//page当前所在页
        this.pagination.currentPage = page;//改变当前页数
        this.fetchPaginationData();//重新请求数据
      },
      handleSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.dialogInfo.identity === "edit") {
              updateStudentInfo(this.student).then(res => {
                if (res.data.status) {
                  this.handleClose("form");
                  this.$message.success(res.data.msg);
                  this.fetchPaginationData();//重新请求数据
                }
              })
            } else {
              addStudentInfo(this.student).then(res => {
                if (res.data.status) {
                  this.$message.success("添加成功!");
                  this.handleClose("form");
                  //请求数据
                  this.fetchDormitoryData();
                  this.fetchPaginationData();
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
        //  注意不要直接赋值,直接赋值this.houseInfo和row指向同一内存地址，
        //  后面如果取消的话row会被置空,那么houseInfo自然也会被改变，切记
        //赋值内容
        this.student = {
          _id: row._id,
          sno: row.sno,
          name: row.name,
          age: row.age,
          sex: row.sex,
          password: row.password,
          //宿舍id
          dormitory: row.dormitory,
        };
        this.fetchDormitoryData();//请楼栋信息
      },
      handleSearch() {
        this.fetchPaginationData();
      },
      handleAllInfo() {
        this.keywords = null;
        this.fetchPaginationData();
      },
      fetchDormitoryData() {
        getPdormitory().then(res => {
          if (res.data.status) {
            this.dormitoryList = res.data.data;
          }
        });
      },
      fetchPaginationData() {
        getStudentInfo(this.pagination.currentPage, this.keywords).then(res => {
          if (res.data.status) {
            this.tableData = res.data.data.result;
            console.log(res.data.data.result);
            if (!this.tableData.length && this.pagination.currentPage !== 1) {
              console.log("进来了" + this.tableData, this.pagination.currentPage);
              this.handleCurrentChange(this.pagination.currentPage - 1);
            }
            this.pagination.total = res.data.data.count;
          }
        })
      },
      handleDelete(index, row) {
        deleteStudentInfo(row._id).then(res => {
          if (res.data.status) {
            this.$message.success(res.data.msg);
            this.fetchPaginationData();//重新请求数据
          }
        });
      }
    },
    created() {
      this.fetchPaginationData();
      this.fetchDormitoryData();
    },
    filters: {
      toShowString(value) {
        return value.respective_region + value.nums + "栋"
      }
    }
  }
</script>

<style scoped lang="less">
  .housemaster-management {
    box-sizing: border-box;
    padding-left: 10px;
    padding-right: 10px;

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
    width: 300px;
  }

  .show-all {
    margin-right: 200px;
  }

</style>
