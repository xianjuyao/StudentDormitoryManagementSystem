<template>
    <div class="building-management">
        <div class="title-box">
            <h1>楼栋信息管理</h1>
        </div>
        <div class="detail-info">
            <div class="bt-right">
                <el-button type="success" @click="handleAllInfo" class="show-all">查看所有</el-button>
                <el-input placeholder="请输入要查找的区域" v-model="keywords" class="input-with-select search-left">
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
                        <span style="margin-left: 10px">{{ scope.row.respective_region }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="楼栋"
                        width="150">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.nums }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="分配状态"
                        width="100">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.status|statusToString }}</span>
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
                    <el-form-item label="所属区域" :label-width="formLabelWidth">
                        <el-select v-model="form.respective_region" placeholder="请选择所属区域" prop="region">
                            <el-option label="同大" value="同大"></el-option>
                            <el-option label="三里" value="三里"></el-option>
                            <el-option label="西区" value="西区"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所在楼栋" :label-width="formLabelWidth" prop="nums">
                        <el-input v-model.number="form.nums" autocomplete="off"></el-input>
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

    export default {
        name: "BuildingManagement",
        data() {
            let checkNums = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入楼栋信息'));
                } else {
                    callback();
                }
            };
            return {
                tableData: [],
                form: {
                    respective_region: "",
                    nums: null,
                    status:0
                },
                keywords: "",
                formLabelWidth: "180px",
                rules: {
                    region: [
                        {required: true, message: "请选择宿舍所在区域", trigger: "change"}
                    ],
                    nums: [
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
                }
            }
        },
        methods: {
            fetchData() {
                let url = `/admin/building/find?page=${this.pagination.currentPage}`;
                if (this.keywords && this.keywords.trim().length > 0)//关键字存在就带上关键字
                    url += `&&keywords=${this.keywords}`;
                this.$http.get(url).then(res => {
                    if (res.data.status) {
                        this.tableData = res.data.data.bfList;
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
                    respective_region: "",
                    nums: null
                };
            },
            handleSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {//通过验证
                        if (this.dialogInfo.identity === "edit") {//编辑界面
                            this.$http.put(`/admin/building/${this.form._id}`, this.form).then(res => {
                                if (res.data.status) {
                                    this.fetchSuccess("更新成功!", formName);
                                }
                            });
                        } else {
                            this.$http.post("/admin/building/create", this.form).then(res => {
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
                    _id: row._id,
                    respective_region: row.respective_region,
                    nums: row.nums
                };
            },
            //处理添加事件
            handleAdd() {
                this.dialogInfo.title = "添加信息";
                this.dialogInfo.identity = "add";
                this.dialogInfo.dialogFormVisible = true;
                this.form = {
                    respective_region: "",
                    nums: null
                };
            },
            handleDelete(index, row) {
                this.$http.delete(`/admin/building/${row._id}`).then(res => {
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
                this.keywords = null;
                this.fetchData();
            }
        },
        created() {
            this.fetchData();//创建请求所求数据
        },
        filters:{
            statusToString(val){
                return val===0?"未分配":"已分配";
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
