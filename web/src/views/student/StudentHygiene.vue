<template>
  <div class="building-management">
    <div id="test" style="width:100%; height:400px;" ref="test"></div>
    <hr>
        <div class="detail-info">
          <div class="text-title">
            历史纪录
          </div>
          <hr>
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
                <span style="margin-left: 10px">{{ scope.row.bfInfo[0].respective_region+" "+scope.row.bfInfo[0].nums+"栋" }}</span>
              </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="宿舍号"
                    width="150">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.dormitoryInfo[0].hostel_no}}</span>
              </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="评分"
                    width="100">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.score}}</span>
              </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="检查时间"
                    width="150">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.check_time|timeToString }}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作"
                             align="center"
            >
              <template slot-scope="scope">
                <el-button
                        type="success"
                        size="medium"
                        @click="handleLeavingMessage(scope.$index, scope.row)">查看留言
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
        <div class="content-info">
          <el-dialog :title="dialogInfo.title"
                     :append-to-body="true"
                     :visible.sync="dialogInfo.dialogFormVisible">
            <el-form  ref="form">
              <el-form-item label="留言" :label-width="180">
                <el-input type="textarea" :value="form.leavingMessage" readonly="readonly" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="handleClose('form')" type="success">取消</el-button>
            </div>
          </el-dialog>
        </div>
  </div>
</template>

<script>
  // 引入基本模板
  import {getStudentHygienicInfo} from "../../network/student";

  let echarts = require('echarts/lib/echarts');
  // 引入柱状图组件
  require('echarts/lib/chart/line');
  // 引入提示框和title组件
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');
  import {
    addHealthManagementInfo,
    deleteCheckInfo,
    getAllDormitoryInfo,
    getCheckInfo,
    updateCheckInfo
  } from "../../network/housemaster";

  export default {
    name: "StudentHygiene",
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
          leavingMessage: "",
          dormitory: null,
          score: null,
          check_time: null
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
        dormitoryList: [],
        chartmainbar: null,
        options: {
          color: "#66ccff",
          title: {
            top: '4%',
            text: '近十二次卫生详情统计',
            left: "center"
          },
          tooltip: {
            formatter: '评分:<br/>{b0} : {c0}分'
          },
          xAxis: {
            name:"检查时间",
            type: 'category',
            data: []
          },
          yAxis: {
            name: "分数",
          },
          series: [{
            data: [],
            type: 'line'
          }]
        },
      }
    },
    methods: {
      drawLine: function () {
        //基于准本好的DOM，初始化echarts实例
        this.chartmainbar = echarts.init(document.getElementById("test"));
        //绘制图表
        this.chartmainbar.setOption(this.options);
      },
      formatDate(val) {
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
        return new Date(val).format("yyyy-MM-dd");
      },
      fetchLineData() {
        getStudentHygienicInfo(null)
            .then(res => {
                if (res.data.status){
                  for (let i=0;i<res.data.data.length;i++){
                    if (res.data.data[i].check_time){
                      let temp=this.formatDate(res.data.data[i].check_time);
                      this.options.xAxis.data.push(temp);
                    }
                    if (res.data.data[i].score){
                      this.options.series[0].data.push(res.data.data[i].score);
                    }
                  }
                }
            });
      },
      fetchPaginationData(){
        getStudentHygienicInfo(this.pagination.currentPage)
            .then(res=>{
              if (res.data.status) {
                console.log(res.data.data);
                this.tableData = res.data.data.result;
                //如果是第一页就不用了跳转了
                if (!this.tableData.length && this.pagination.currentPage !== 1) {
                  this.handleCurrentChange(this.pagination.currentPage - 1);
                }
                this.pagination.total = res.data.data.count;
              }
            });
      },
      handleCurrentChange(page) {//page当前所在页
        this.pagination.currentPage = page;//改变当前页数
        this.fetchPaginationData();//重新请求数据
      },
      handleLeavingMessage(index,row){
        this.dialogInfo.title="查看宿管留言信息";
        this.dialogInfo.dialogFormVisible=true;
        this.form.leavingMessage=row.leavingMessage;
      },
      handleClose(form){
        this.dialogInfo.dialogFormVisible=false;
      }
    },
    created() {
      this.fetchLineData();
      this.fetchPaginationData();
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
        return new Date(val).format("yyyy-MM-dd");
      }
    },
    watch: {
      options: {
        handler(newVal, oldVal) {
          if (this.chartmainbar) {
            if (newVal) {
              this.chartmainbar.setOption(newVal);
            } else {
              this.chartmainbar.setOption(oldVal);
            }
          } else {
            this.init();
          }
        },
        deep: true //对象内部属性的监听，关键。
      }
    },
    mounted() {
      this.drawLine();
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
      margin-top: 10px;

      .bt-right {
        text-align: right;
        margin: 0 260px 10px 0;
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
  .content-info{
    margin-bottom: 50px;
  }
  .text-title{
    font-size: 18px;
  }
</style>
