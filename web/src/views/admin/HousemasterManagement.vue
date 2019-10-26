<template>
    <div class="housemaster-management">
        <div class="title-box">
            <h1>宿管信息管理</h1>
        </div>
        <div class="detail-info">
            <div class="bt-right">
                <el-button type="primary" @click="handleAdd">添加信息</el-button>
                <el-button type="success" @click="handleAllInfo" class="show-all">查看所有</el-button>
                <el-input placeholder="请输入要查找的宿管的姓名" v-model="keywords" class="input-with-select search-left">
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
                        label="ID"
                        width="220"
                        align="center">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row._id }}</span>
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
                        label="姓别"
                        width="100">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.sex }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="手机号"
                        width="150">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.tel }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="管理区域"
                        width="150">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.managementInfo[0]|toShowString}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="邮箱"
                        width="180">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.email }}</span>
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
                <el-form :model="houseInfo" :rules="rules" ref="form" label-width="80px">
                    <el-tabs v-model="activeName" type="card">
                        <el-tab-pane label="基本信息" name="first">
                            <el-form-item label="姓名" prop="name">
                                <el-input v-model="houseInfo.name" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="性别" prop="sex">
                                <el-select v-model="houseInfo.sex">
                                    <el-option label="男" value="男"></el-option>
                                    <el-option label="女" value="女"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="手机号" prop="tel">
                                <el-input v-model="houseInfo.tel" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="email" prop="email">
                                <el-input type="email" v-model="houseInfo.email" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="管理信息" name="second">
                            <el-form-item label="用户名" prop="username">
                                <el-input v-model="houseInfo.username"></el-input>
                            </el-form-item>
                            <el-form-item label="密码" prop="password">
                                <el-input v-model="houseInfo.password"></el-input>
                            </el-form-item>
                            <el-form-item label="管理区域" prop="management">
                                <el-select filterable v-model="houseInfo.management">
                                    <el-option v-for="item in buildingInfo"
                                               :label="item.respective_region+'    '+item.nums+'栋'"
                                               :value="item._id"></el-option>
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
    export default {
        name: "HousemasterManagement",
        data() {
            let checkTel = (rule, value, callback) => {
                if (value.trim() === "") {
                    return callback(new Error('手机号不能为空'));
                } else if (value.trim().length !== 11 && value.trim().length !== 14) {
                    return callback(new Error("手机号格式不正确(长度为11或者14位)！"));
                } else {
                    return callback();
                }
            };
            return {
                tableData: [],
                activeName: "first",
                keywords: null,
                houseInfo: {
                    _id: null,
                    username: "",
                    password: "",
                    name: "",
                    sex: "",
                    tel: "",
                    avatar: "",
                    email: "",
                    management: "",
                    managementInfo: null
                },
                buildingInfo: [],
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
                    name: [
                        {required: true, message: "请输入姓名!", trigger: "blur"}
                    ],
                    tel: [
                        {required: true, message: "请输入手机号", trigger: "blur"},
                        {validator: checkTel, trigger: "blur"},
                    ],
                    username: [
                        {required: true, message: "请输入用户名", trigger: "blur"},
                        {min: 2, max: 10, message: "用户名在2-10个字符之间", trigger: "blur"}
                    ],
                    password: [
                        {required: true, message: "请输入密码", trigger: "blur"},
                        {min: 6, max: 18, message: "密码在6-18个字符之间", trigger: "blur"}
                    ],
                    management: [
                        {required: true, message: "请选择管理区域", trigger: "blur"}
                    ],
                }
            }
        },
        methods: {
            //处理添加信息，打开模态框
            handleAdd() {
                this.dialogInfo.title = "添加宿舍管理员";
                for (let key in this.houseInfo) {//置空数据添加
                    this.houseInfo[key] = null;
                }
                this.dialogInfo.dialogFormVisible = true;
                this.dialogInfo.identity = "add";
                this.fetchBuildInfo();
            },
            //关闭模态框
            handleClose(formName) {
                this.$refs[formName].resetFields();
                this.dialogInfo.dialogFormVisible = false;
            },
            //请求所有楼栋信息
            fetchBuildInfo() {
                this.$http.get("/admin/housemaster/bf/info").then(res => {
                    if (res.data.status) {
                        this.buildingInfo = res.data.data;
                    }
                });
            },
            handleCurrentChange(page) {//page当前所在页
                this.pagination.currentPage = page;//改变当前页数
                this.fetchPaginationData();//重新请求数据
            },
            handleSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.dialogInfo.identity === "edit") {
                            this.$http.put("/admin/housemaster/update", this.houseInfo).then(res => {
                                if (res.data.status) {
                                    this.handleClose("form");
                                    this.$message.success(res.data.msg);
                                    this.fetchPaginationData();//重新请求数据
                                }
                            })
                        } else {
                            this.$http.post("/admin/housemaster/create", this.houseInfo).then(res => {
                                if (res.data.status) {
                                    this.$message.success("添加成功!");
                                    this.handleClose("form");
                                    //请求数据
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
                // 遍历赋值
                for (let key in row) {
                    if (row[key]) {
                        this.houseInfo[key] = row[key];
                    }
                }
                this.houseInfo.management =
                    this.houseInfo.managementInfo[0].respective_region +
                    this.houseInfo.managementInfo[0].nums + "栋";
                this.fetchBuildInfo();//请楼栋信息
            },
            handleSearch() {
               this.fetchPaginationData();
            },
            handleAllInfo() {
                this.keywords=null;
                this.fetchPaginationData();
            },
            fetchPaginationData() {
                let url = `/admin/housemaster/find?page=${this.pagination.currentPage}`;
                if (this.keywords && this.keywords.trim().length > 0)//关键字存在就带上关键字
                    url += `&&keywords=${this.keywords}`;
                this.$http.get(url).then(res => {
                    if (res.data.status) {
                        this.tableData = res.data.data.hsList;
                        console.log(typeof this.pagination.currentPage);
                        if (!this.tableData.length && this.pagination.currentPage !== 1) {
                            console.log("进来了"+this.tableData,this.pagination.currentPage);
                            this.handleCurrentChange(this.pagination.currentPage - 1);
                        }
                        this.pagination.total = res.data.data.count;
                    }
                })
            },
            handleDelete(index, row) {
                this.$http.delete(`/admin/housemaster/delete/${row._id}`).then(res => {
                    if (res.data.status) {
                        this.$message.success(res.data.msg);
                        this.fetchPaginationData();//重新请求数据
                    }
                });
            }
        },
        created() {
            this.fetchPaginationData();
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