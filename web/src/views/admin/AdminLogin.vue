<template>
    <div class="login">
        <div class="title">
            <h1>学生宿舍管理系统</h1>
        </div>
        <div class="login-box">
            <el-form :model="userInfo" :rules="rules" ref="userInfo" label-width="70px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input type="text" v-model="userInfo.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="userInfo.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('userInfo')">登录</el-button>
                    <el-button @click="resetForm('userInfo')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AdminLogin",
        data() {
            //校验用户名
            let validUserName = (rule, value, callback) => {
                if (value.trim() === ''||value.trim().length===0) {
                    callback(new Error('用户名不能为空!'));
                } else {
                    callback();
                }
            };
            //校验密码
            let validPassword = (rule, value, callback) => {
            if (value.trim() === ''||value.trim().length===0) {
                callback(new Error('密码不能为空!'));
            } else {
                callback();
            }
        };
            return {
                userInfo: {
                    username: "",
                    password: "",
                },
                rules:{
                    username:[
                        {validator:validUserName,trigger:"blur"},
                        {min:2,max:8,message:"用户名长度在2-8个字符之间",trigger:"blur"}
                    ],
                    password:[
                        {validator:validPassword,trigger:"blur"},
                        {min:6,max:16,message:"密码长度在6-16个字符之间",trigger:"blur"}
                    ]
                },
            }
        },
        methods: {
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid){//通过验证
                        this.$http.post("/admin/login",this.userInfo)
                            .then(res=>{
                               if (res.data.status){//执行成功
                                   localStorage.setItem("token",res.data.data);//保存在本地
                                  this.$message.success("登录成功!");this.$router.push("/admin/index");
                               }
                            });
                    }
                });
            },
            resetForm(forName){
                this.$refs[forName].resetFields();
            }
        }
    }
</script>

<style scoped lang="less">
    .login {
        background: url("../../assets/login-bg.jpg") no-repeat;
        width: 100%;
        height: 100%;
        background-size: 100% 100%;
        position: relative;
        .title {
            position: absolute;
            top: 20%;
            left: 80%;
            margin-left: -185px;
            width: 370px;
            text-align: center;

            h1 {
                font-size: 20px;
                color: white;
                font-weight: bold;
            }
        }

        .login-box {
            position: absolute;
            width: 370px;
            background: white;
            padding: 30px 20px 20px 0;
            left: 80%;
            margin-left: -185px;
            top: 30%;
            box-sizing: border-box;
        }
    }
</style>
