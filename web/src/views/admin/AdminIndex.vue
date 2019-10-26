<template>
    <div class="index-container">
        <div class="layui-layout layui-layout-admin">
            <div class="layui-header">
                <router-link tag="div" class="layui-logo" to="/admin/index" style="cursor: pointer">学生宿舍管理系统
                </router-link>
                <ul class=" layui-nav layui-layout-right">
                    <li class="layui-nav-item">
                        <a href="javascript:;">
                            <img :src="userInfo.avatar" class="layui-nav-img" style="width: 40px;height: 40px">
                            <el-dropdown class="user-text" @command="handleCommand">
                                      <span class="el-dropdown-link">
                                        {{userInfo.username}}<i class="el-icon-arrow-down el-icon--right"></i>
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
                            <template slot="title"><i class="el-icon-message"></i>宿管信息管理</template>
                            <el-menu-item-group>
                                <el-menu-item index="/admin/building/info">楼栋管理</el-menu-item>
                                <el-menu-item index="/admin/housemaster/management">宿管管理</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-submenu index="2">
                            <template slot="title"><i class="el-icon-menu"></i>个人信息管理</template>
                            <el-menu-item-group>
                                <el-menu-item index="/admin/change/pw">修改密码</el-menu-item>
                                <el-menu-item index="/admin/info">修改资料</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                    </el-menu>
                </div>
            </div>
            <div class="layui-body">
                <router-view :userInfo="userInfo" :key="$route.path"/>
            </div>
            <div class="layui-footer" style="text-align: center">
                Copyright © 2019-2021 项目小组
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AdminIndex",
        data() {
            return {
                userInfo: {
                    id: "",
                    username: "",
                    avatar: "",
                    password:null
                }
            }
        },
        methods: {
            handleCommand(command) {
                if (command === "personInfo") {//个人信息
                    this.$router.push("/admin/info");
                } else if (command === "logout") {//退出登录
                    localStorage.removeItem("token");//清除token
                    this.$router.push("/admin/login");//跳转到登录界面
                }
            },
            //请求当前用户信息
            fetchUserInfo() {
                this.$http.get("/admin/").then(res => {
                    if (res.data.status) {
                        this.userInfo = res.data.data;
                    }
                });
            }
        },
        created() {
            this.fetchUserInfo();
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

    .el-menu-item:focus,.el-menu-item:hover{
        background-color: #009688 !important;
        color: white !important;
    }
    .user-text {
        color: rgba(255, 255, 255, 0.8)!important;
        span {
            &:hover {
                color: white !important;
            }
        }
    }
</style>