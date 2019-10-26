<template>
  <div class="index-container">
    <div class="layui-layout layui-layout-admin">
      <div class="layui-header">
        <router-link tag="div" class="layui-logo" to="/student/index" style="cursor: pointer">学生宿舍管理系统
        </router-link>
        <ul class=" layui-nav layui-layout-right">
          <li class="layui-nav-item">
            <a href="javascript:;">
              <img :src="userInfo.avatar" class="layui-nav-img" style="width: 40px;height: 40px">
              <el-dropdown class="user-text" @command="handleCommand">
                                      <span class="el-dropdown-link">
                                        {{userInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i>
                                      </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="personInfo">个人信息</el-dropdown-item>
                  <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </a>
          </li>
        </ul>
      </div>
      <div class="layui-side layui-bg-black">
        <div class="layui-side-scroll">
          <el-menu background-color="#23262E" text-color="#eee"
                   active-text-color="#66ccff"
                   router>
            <el-submenu index="1">
              <template slot="title"><i class="el-icon-message"></i>宿舍信息</template>
              <el-menu-item-group>
                <el-menu-item index="/student/hygiene/info">宿舍卫生信息</el-menu-item>
                <el-menu-item index="/student/elecharges/info">宿舍电费信息</el-menu-item>
                <el-menu-item index="/student/maintenance/info">申请报修</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title"><i class="el-icon-menu"></i>个人信息</template>
              <el-menu-item-group>
                <el-menu-item index="/student/change/password">修改密码</el-menu-item>
                <el-menu-item index="/student/update/info">修改资料</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </div>
      </div>
      <div class="layui-body">
        <router-view :userInfo="userInfo" :key="$route.path"/>
      </div>
      <div class="layui-footer" style="text-align: center">
        Copyright © 2019-2021 数据库设计项目小组
      </div>
    </div>
  </div>
</template>

<script>
  import {getLoginStudentInfo} from "../../network/student";

  export default {
    name: "StudentIndex",
    data(){
      return{
        userInfo: {
          id: "",
          name: "",
          avatar: "",
        }
      }
    },
    methods:{
      handleCommand(command) {
        if (command === "personInfo") {//个人信息
          this.$router.push("/student/info");
        } else if (command === "logout") {//退出登录
          localStorage.removeItem("token");//清除token
          this.$router.push("/student/login");//跳转到登录界面
        }
      },
    },
    created() {
      getLoginStudentInfo().then(res=>{
        if (res.data.status){
          this.userInfo=res.data.data;
           this.$store.commit("setStudentId",this.userInfo.id);
        }
      });
    }
  }
</script>

<style scoped lang="less">
  .el-dropdown-link {
    cursor: pointer;
    color: #ffffff;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .el-menu-item:focus, .el-menu-item:hover {
    background-color: #009688 !important;
    color: white !important;
  }

  .user-text {
    color: rgba(255, 255, 255, 0.8) !important;

  span {
  &:hover {
     color: white !important;
   }

  }
  }
</style>
