/**
 *
 * 2019/9/5
 * 项目启动文件
 * ymcj
 * @type {createApplication}
 */
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
//开放静态目录文件夹
app.use("/public/", express.static(path.join(__dirname, "/uploads")));

//解决跨域问题
app.use(require("cors")());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

//系统管理员模块路由
require("./routers/adminSystem")(app);
//宿舍管理员模块
require("./routers/HouseMaster")(app);
//学生模块
require("./routers/student")(app);

app.listen(8888, () => {
    console.log("server is running at http://127.0.0.1:8888");
});
