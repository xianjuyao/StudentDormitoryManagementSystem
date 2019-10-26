<template>
    <div class="admin-user-info">
        <div class="title">
            <h1>个人信息修改</h1>
        </div>
        <el-form :model="userInfo" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
                <el-input type="text" v-model="userInfo.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="头像">
                <el-upload
                        class="avatar-uploader"
                        :action="$http.defaults.baseURL+'/admin/uploads'"
                        :show-file-list="false"
                        :headers="getAuthHeaders()"
                        :on-success="handleAvatarSuccess">
                    <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">更新</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        props: ["userInfo"],
        name: "AdminUserInfo",
        data() {
            let checkUserName= (rule, value, callback) => {
                if (value.trim() === '') {
                    callback(new Error('请输入正确的用户名!'));
                } else {
                    callback();
                }
            };
            return {
                rules:{
                    username:[
                        {validator:checkUserName,trigger:"blur"},
                        {min:2,max:8,message:"用户名在2-8个字符之间",trigger:"blur"}
                    ]
                }
            }
        },
        methods: {
            handleAvatarSuccess(res){
                console.log(res);
                this.userInfo.avatar=res.url;
            },
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http.put("/admin/update",this.userInfo).then(res=>{
                            if (res.data.status){
                                this.$message.success(res.data.msg);
                                this.$router.push("/admin/index");
                            }
                        });
                    }
                });
            },
            resetForm(formName){
                this.$refs[formName].resetFields();
            }

        },
        components: {},
    }
</script>

<style scoped lang="less">
    .admin-user-info {
        width: 500px;
        margin: 20px auto;
        .title{
            width: 100%;
            text-align: center;
            margin-bottom: 20px;
           h1{
               font-size: 20px!important;
           }
        }
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
        border: 1px dashed #d9d9d9;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
