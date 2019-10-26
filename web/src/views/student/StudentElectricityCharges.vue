<template>
  <div class="student-ele-charges">
    <div id="demo" style="width:100%; height:400px;"></div>
    <hr>
    <div class="detail-info">
      <div class="title">详细记录</div>
      <hr>
      <div class="content">
        <el-table
                border
                :data="tableData"
                style="width: 80%;margin: 0 auto">
          <el-table-column
                  label="序号"
                  width="200"
                  align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.$index+1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
                  align="center"
                  label="所属区域"
                  width="200">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.bfInfo[0].respective_region+" "+scope.row.bfInfo[0].nums+"栋" }}</span>
            </template>
          </el-table-column>
          <el-table-column
                  align="center"
                  label="宿舍号"
                  width="200">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.dormitoryInfo[0].hostel_no}}</span>
            </template>
          </el-table-column>
          <el-table-column
                  align="center"
                  label="电费"
                  width="200">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.cost+"元"}}</span>
            </template>
          </el-table-column>
          <el-table-column
                  align="center"
                  label="时间"
                  width="222">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.time|timeToString }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin:10px auto 0">
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
    </div>
  </div>
</template>

<script>
  // 引入基本模板
  import {getStudentDormitoryEleInfo, getStudentElePaginationData} from "../../network/student";

  let echarts = require('echarts/lib/echarts');
  // 引入柱状图组件
  require('echarts/lib/chart/bar');
  // 引入提示框和title组件
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');
  export default {
    name: "StudentElectricityCharges",
    data() {
      return {
        tableData: [],
        chartmainbar: null,
        info: null,
        time: [],
        options: {
          color:"#66ccff",
          title: {
            text: '近一年宿舍用电详情',
            left: "center"
          },
          tooltip: {
            formatter: '费用:<br/>{b0} : {c0}元'
          },
          xAxis: {
            data: [],
            name: "时间",
          },
          yAxis: {
            name: "消费",
          },
          series: [{
            name: '费用',
            type: 'bar', //设置图表主题
            data: []
          }]
        },
        pagination: {
          currentPage: 1,//当前位于哪一页,
          total: 0,//总数
          pageSize: 6,//一页显示多少条
          layout: "total,prev, pager, next, jumper"//分页属性
        },
      }
    },
    methods: {
      drawLine: function () {
        //基于准本好的DOM，初始化echarts实例
        this.chartmainbar = echarts.init(document.getElementById("demo"));
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
        return new Date(val).format("yyyy-MM");
      },
      fetchPaginationData() {
        getStudentElePaginationData(this.pagination.currentPage)
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
      handleCurrentChange(page) {//page当前所在页
        this.pagination.currentPage = page;//改变当前页数
        this.fetchPaginationData();//重新请求数据
      },
      fetchBarData() {
        getStudentDormitoryEleInfo()
            .then(res => {
              if (res.data.status) {
                this.info = res.data.data;
                for (let i = 0; i < 12; i++) {
                  if (res.data.data[i]) {
                    let temp = this.formatDate(res.data.data[i].time);
                    this.options.xAxis.data.push(temp);
                    this.options.series[0].data.push(res.data.data[i].cost);
                  }
                }
              }
            });
      }
    },
    mounted() {
      this.drawLine();
    }
    ,
    created() {
      this.fetchBarData();
      this.fetchPaginationData();
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
    filters:{
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
  .student-ele-charges {
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;

    .detail-info {
      width: 100%;
      height: 500px;

      .title {
        font-size: 18px;
      }
    }
  }

  .pagination {
    text-align: right;
    box-sizing: border-box;
    padding-right: 210px;
  }
</style>

