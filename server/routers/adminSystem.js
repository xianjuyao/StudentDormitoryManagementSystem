/**
 * 系统管理员模块
 * 2019/9/14
 * @type {Router}
 */
const router = require("express").Router();
const AdminModel = require("../models/AdminModel");
const BFModel = require("../models/BuildingInformation");
const HousemasterModel = require("../models/Housemaster");
const com = require("../utils/common");
const jwt = require("jsonwebtoken");
const {authAdmin} = require("../utils/auth");
const path = require("path");
const multer = require('multer');
const upload = multer({dest: path.join(__dirname, "../uploads")});
const mongoose = require("../utils/db");
const notice=require("../models/Notice");
const pageSize = 6;//分页条数
module.exports = function (app) {
    /**
     *  fun:管理员登录
     *  url:/api/admin/login
     *  type:post
     */
    router.post("/login", async (req, res) => {
        const adminUser = req.body;
        //判断空数据
        if (adminUser.username.trim().length === 0) {
            return res.json(com(false, "用户名长度不能为0!", null));
        }
        if (adminUser.password.trim().length === 0) {
            return res.json(com(false, "密码长度不能为0!", null));
        }
        //去数据库查询用户名

        //查询用户名是否存在
        //select * from admin where username="xxx";
        const result = await AdminModel.findOne({username: adminUser.username});
        if (!result) {//不存在
            return res.json(com(false, "用户名不存在", null));
        }
        //校验密码
        const isValid = require("bcryptjs").compareSync(adminUser.password, result.password);
        if (!isValid) {//密码校验失败
            return res.json(com(false, "密码错误!", null));
        }
        //校验通过返回token
        const token = jwt.sign({
            id: result._id,
            username: result.username
        }, require("../utils/private").privateKey, {expiresIn: 3600});
        res.json(com(true, "登录成功!", token));
    });

    /**
     *  fun:获取登录后管理员信息
     *  url:/api/admin/
     *  type:get
     *  comm:需要登录后才能访问
     */
    router.get("/", authAdmin, (req, res) => {
        res.json(com(true, null, {
            id: req.currentUser._id,
            username: req.currentUser.username,
            avatar: req.currentUser.avatar,
        }));
    });

    //图片上传
    router.post("/uploads", authAdmin, upload.single("file"), (req, res) => {
        const file = req.file;
        file.url = `http://127.0.0.1:8888/public/${file.filename}`;
        res.send(file);
    });

    /**
     *  fun:更新登录后管理员信息
     *  url:/api/admin/update
     *  type:put
     *  comm:需要登录后才能访问
     */
    router.put("/update", authAdmin, async (req, res) => {
        const admin = {};
        if (req.body.username) admin.username = req.body.username;
        if (req.body.password) admin.password = req.body.password;
        if (req.body.avatar) admin.avatar = req.body.avatar;
        const result = await AdminModel.findByIdAndUpdate(req.body.id, admin);
        if (!result) return res.json(com(false, "更新失败!", null));
        res.json(com(true, "更新成功!", result));
    });


    //楼栋信息接口
    /**
     *  fun:添加楼栋信息
     *  url:/api/admin/building/create
     *  type:post
     *  comm:需要登录后才能访问
     */
    router.post("/building/create", authAdmin, async (req, res) => {
        let bfInfo = {};
        if (req.body.respective_region) bfInfo.respective_region = req.body.respective_region;
        if (req.body.nums) bfInfo.nums = req.body.nums;
        const bf = await BFModel.create(bfInfo);
        if (!bf) {  //添加失败
            return res.json(com(false, "添加失败,请稍后再试!", null));
        }
        res.json(com(true, "添加成功!", bf));
    });

    /**
     *  fun:获取一页楼栋信息
     *  url:/api/admin/building/find?page=?
     *  type:get
     *  comm:需要登录后才能访问
     */
    router.get("/building/find", authAdmin, async (req, res) => {
        let keywords = null;
        let filter = {};
        //查询关键字
        if (req.query.keywords) {//关键字存在就进行匹配
            let keywords = req.query.keywords;
            filter = {
                $or: [ //多字段同时匹配
                    {respective_region: {$regex: keywords, $options: "$i"}},
                ]
            };
        }

        const page = req.query.page;//当前所在页

        const bf = await BFModel.find(filter).skip((page - 1) * pageSize).limit(pageSize);//分页查询

        const count = await BFModel.countDocuments(filter);//数据总条数

        res.json(com(true, "加载成功!", {
            count,//数据总条数
            bfList: bf//当前页的数据
        }));
    });

    /**
     *  fun:获取单个楼栋信息
     *  url:/api/admin/building/:id
     *  type:get
     *  comm:需要登录后才能访问
     */
    router.get("/building/:id", authAdmin, async (req, res) => {
        const bf = await BFModel.findOne(req.params.id);
        res.json(com(true, "", bf));
    });

    /**
     *  fun:修改单个楼栋信息
     *  url:/api/admin/building/:id
     *  type:put
     *  comm:需要登录后才能访问
     */
    router.put("/building/:id", authAdmin, async (req, res) => {
        const bf = await BFModel.findByIdAndUpdate(req.params.id, req.body);
        if (!bf) {
            return json(com(false, "更新失败!", null));
        }
        res.json(com(true, "更新成功!", null));
    });

    /**
     *  fun:删除单个楼栋信息
     *  url:/api/admin/building/:id
     *  type:delete
     *  comm:需要登录后才能访问
     */
    router.delete("/building/:id", authAdmin, async (req, res) => {
        const bf = await BFModel.findByIdAndDelete(req.params.id);
        if (!bf) {
            return res.json(com(false, "删除失败!", null));
        }
        res.json(com(true, "删除成功!", null));
    });


    //宿管模块接口
    /**
     * fun:创建宿管用户
     * url:/api/admin/housemaster/create
     * type:post
     * comm:需要登录后才能访问
     */
    router.post("/housemaster/create", authAdmin, async (req, res) => {
        let hs = {};
        let temp = null;
        let result = null;
        for (let key in req.body) {
            if (req.body[key]) {
                hs[key] = req.body[key];
            }
        }
        //设置默认图像
        hs.avatar="http://127.0.0.1:8888/public/defalut.png";
        try {
            temp = await HousemasterModel.create(hs);
            result = await BFModel.findByIdAndUpdate(hs.management, {status: 1});//更新楼栋信息
            result1= await notice.create({"bf_id":temp._id,"time":new Date(),"detail":"初始化"});
        } catch (e) {
            return res.json(com(false, e.toString(), null));
        }
        if (!temp) {
            return res.json(com(false, "添加失败", null));
        }
        res.json(com(true, "", null));
    });
    /**
     * fun:获取所有楼栋信息
     * url:/api/admin/housemaster/bf/info
     * type:get
     * comm:需要登录后才能访问
     */
    router.get("/housemaster/bf/info", authAdmin, async (req, res) => {
        const bf = await BFModel.find({status: 0});
        res.json(com(true, "", bf));
    });
    /**
     * fun:获取一页宿舍管理员的数据
     * url:/api/admin/housemaster/find?page=x&&keywords=xx
     * type:get
     * comm:需要登录后才能访问
     */
    router.get("/housemaster/find", authAdmin, async (req, res) => {
        const currentPage = req.query.page;//拿到当前页
        let last_id = null;
        let filter = null;
        let Housemasters = null;
        let hsList = null;
        let count = null;
        if (req.params.keywords) {//存在关键字就查询
            Housemasters = await HousemasterModel.find({name: req.query.keywords}).limit((currentPage - 1) * pageSize);
        } else {
            Housemasters = await HousemasterModel.find().limit((currentPage - 1) * pageSize);
        }
        if (parseInt(currentPage) !== 1) {//不是第一页就大于上一页的最后的数据
            last_id = Housemasters.pop()._id;
            filter = {$gt: mongoose.Types.ObjectId(last_id)};
        } else {
            last_id = Housemasters.shift()._id;
            filter = {$gte: mongoose.Types.ObjectId(last_id)};
        }
        if (req.query.keywords) {
            hsList = await HousemasterModel.aggregate([
                {
                    $match: {"_id": filter, name: req.query.keywords},
                },
                {
                    $limit: pageSize
                },
                {
                    $lookup: {
                        from: "buildingInfo",//需要关联的表(注意这里是写表名)
                        localField: "management",//表需要关联的键
                        foreignField: "_id",//关联的外键
                        as: "managementInfo"
                    }

                },
            ]);
            count = await HousemasterModel.countDocuments({name: req.query.keywords});
        } else {
            hsList = await HousemasterModel.aggregate([
                {
                    $match: {"_id": filter}
                },
                {
                    $limit: pageSize
                },
                {
                    $lookup: {
                        from: "buildingInfo",//需要关联的表(注意这里是写表名)
                        localField: "management",//表需要关联的键
                        foreignField: "_id",//关联的外键
                        as: "managementInfo"
                    }

                },
            ]);
            count = await HousemasterModel.countDocuments();
        }
        res.json(com(true, "请求成功!", {hsList, count}));
    });
    /**
     * fun:更新宿舍管理员的数据
     * url:/api/admin/housemaster/update
     * type:put
     * comm:需要登录后才能访问
     */
    router.put("/housemaster/update", authAdmin, async (req, res) => {
        let hs = {};
        let result2 = null, result1 = null;
        for (let key in req.body) {
            if (req.body[key]) {
                hs[key] = req.body[key];
            }
        }
        //如果出错说明前端数据没有改变,那么没有必要更新楼栋信息
        try {
            result1 = await BFModel.findByIdAndUpdate(hs.management, {status: 1});
            result2 = await BFModel.findByIdAndUpdate(hs.managementInfo[0]._id, {status: 0});
        } catch (e) {
            delete hs.management;
        }
        delete hs.managementInfo;
        const result = await HousemasterModel.findByIdAndUpdate(hs._id, hs);
        if (!result) {
            return res.json(com(false, "更新失败!", null));
        }
        res.json(com(true, "更新成功!", null));
    });
    /**
     * fun:删除宿舍管理员的数据
     * url:/api/admin/housemaster/delete
     * type:delete
     * comm:需要登录后才能访问
     */
    router.delete("/housemaster/delete/:id", authAdmin, async (req, res) => {
        try {
            const demo = await HousemasterModel.findById(req.params.id);
            const demo1 = await BFModel.findByIdAndUpdate(demo.management, {status: 0});
        } catch (e) {
            return res.json(com(false, "删除失败!", null));
        }
        const temp = await HousemasterModel.findByIdAndDelete(req.params.id);
        if (!temp) {
            return res.json(com(false, "删除失败!", null));
        }
        res.json(com(true, "删除成功!", null));
    });

    //挂载路由
    app.use("/api/admin", router);
};
