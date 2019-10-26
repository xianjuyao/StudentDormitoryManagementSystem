/**
 * 学生模块
 * 2019/10/23
 * ymcj
 */
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const com = require("../utils/common");
const path = require("path");
const { authStudent } = require("../utils/auth");
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, "../uploads") });
const mongoose = require("mongoose");
const pageSize = 6;//分页条数
const Hygienic = require("../models/Hygienic");
const student = require("../models/Student");
const notice = require("../models/Notice");
const dormitory = require("../models/Dormitory");
const elecharges = require("../models/ElectricityCharges");
const BFModel = require("../models/BuildingInformation");
const maintenance=require("../models/Maintenance");
module.exports = function (app) {
  /**
   * fun:学生登录
   * url:"/api/student/login"
   * type:post
   */
  router.post("/login", async (req, res) => {
    const user = req.body;
    //判断空数据
    if (user.sno.trim().length === 0) {
      return res.json(com(false, "学号长度不能为0!", null));
    }
    if (user.password.trim().length === 0) {
      return res.json(com(false, "密码长度不能为0!", null));
    }
    //去数据库查询用户名

    //查询用户名是否存在
    //select * from admin where username="xxx";
    const result = await student.findOne({ sno: user.sno });
    if (!result) {//不存在
      return res.json(com(false, "学号不存在", null));
    }
    //校验密码
    const isValid = (result.password === user.password);
    if (!isValid) {//密码校验失败
      return res.json(com(false, "密码错误!", null));
    }
    //校验通过返回token
    const token = jwt.sign({
      id: result._id,
      sno: result.sno,
      age: result.age,
      sex: result.sex
    }, require("../utils/private").privateKey, { expiresIn: 3600 });
    res.json(com(true, "登录成功!", token));
  });

  /**
   * fun:获取登录学生的信息
   * url:/api/student/
   * type:GET
   */
  router.get("/", authStudent, async (req, res) => {
    const bf = await BFModel.findById(req.currentUser.bf_id);
    const dor = await dormitory.findById(req.currentUser.dormitory);
    res.json(com(true, null, {
      id: req.currentUser._id,
      sno: req.currentUser.sno,
      name: req.currentUser.name,
      age: req.currentUser.age,
      avatar: req.currentUser.avatar,
      sex: req.currentUser.sex,
      bf,
      dormitory: dor
    }));
  });
  /**
   * fun:获取本栋楼的公告信息
   * url:"/api/student/notice"
   * type:get
   */
  router.get("/notice", authStudent, async (req, res) => {
    const result = await notice.findOne({ "bf_id": req.currentUser.bf_id });
    if (!result) return res.json(com(false, "获取数据失败", null));
    res.json(com(true, null, result));
  });
  /**
   * fun:更新学生信息
   * url:"/api/student/info"
   * type:"put"
   */
  router.put("/info", authStudent, async (req, res) => {
    if (req.body.password) {//含有密码就更新密码
      const result = await student.findByIdAndUpdate(req.body.id, req.body);
      if (!result) return res.json(com(false, "更新密码失败!", null));
    } else {
      let user = {};
      for (let key in req.body) {
        if (req.body[key]) {
          user[key] = req.body[key];
        }
      }
      const result = await student.findByIdAndUpdate(user.id, user);
      if (!result) return res.json(com(false, "更新资料失败!", null));
    }
    res.json(com(true, "更新成功!", null));
  });

  //图片上传
  router.post("/uploads", authStudent, upload.single("file"), (req, res) => {
    const file = req.file;
    file.url = `http://127.0.0.1:8888/public/${file.filename}`;
    res.send(file);
  });
  /**
   * fun:根据学生的所住宿舍id拿到住宿用电信息
   * url:"/api/student/elecharges"
   * type:get
   * 
   */
  router.get("/elecharges", authStudent, async (req, res) => {
    const result = await elecharges.find({ "dormitory": req.currentUser.dormitory }).sort({ "time": -1 });
    if (!result) res.json(com(false, "", null));
    res.json(com(true, "", result));
  });

  /**
   *fun:获取一页学生宿舍用电信息
   *url:"/api/student/elecharges/info"
   *type:"get"
   */
  router.get("/elecharges/info", authStudent, async (req, res) => {
    let page = req.query.page;
    let result = null;
    let count = null;
    let bfId = req.currentUser.bf_id;
    let d_id = req.currentUser.dormitory;
    //获取分页数据
    result = await elecharges.aggregate([
      {
        $match: {
          "bf_id": mongoose.Types.ObjectId(bfId),
          "dormitory": mongoose.Types.ObjectId(d_id),
        }
      },
      { $sort: { "time": -1 } },
      { $skip: (page - 1) * pageSize },
      { $limit: pageSize },
      {
        $lookup: {
          from: "dormitory",
          localField: "dormitory",
          foreignField: "_id",
          as: "dormitoryInfo"
        }
      },
      {
        $lookup: {
          from: "buildingInfo",
          localField: "bf_id",
          foreignField: "_id",
          as: "bfInfo"
        }
      }
    ]);
    if (!result) return res.json(com(false, "", null));
    //获取总数
    count = await elecharges.countDocuments({
      "bf_id": mongoose.Types.ObjectId(bfId),
      "dormitory": mongoose.Types.ObjectId(d_id),
    });
    res.json(com(true, "", {
      result,
      count
    }));
  });
  /**
   * fun:获取宿舍卫生数据
   * url:"/api/student/hygienic"
   * type:get
   */
  router.get("/hygienic", authStudent, async (req, res) => {
    let page = req.query.page;
    let result = null;
    if (page) {//如果有请求页数就返回一页数据
      result = await Hygienic.aggregate([
        {
          $match: {
            "bf_id": mongoose.Types.ObjectId(req.currentUser.bf_id),
            "dormitory": mongoose.Types.ObjectId(req.currentUser.dormitory),
          }
        },
        { $sort: { "check_time": -1 } },
        { $skip: (page - 1) * pageSize },
        { $limit: pageSize },
        {
          $lookup: {
            from: "dormitory",
            localField: "dormitory",
            foreignField: "_id",
            as: "dormitoryInfo"
          }
        },
        {
          $lookup: {
            from: "buildingInfo",
            localField: "bf_id",
            foreignField: "_id",
            as: "bfInfo"
          }
        }
      ]);
      //获取总数
      count = await Hygienic.countDocuments({
        "bf_id": mongoose.Types.ObjectId(req.currentUser.bf_id),
        "dormitory": mongoose.Types.ObjectId(req.currentUser.dormitory),
      });
      res.json(com(true, "", {
        result,
        count
      }));
    } else {//没有就返回前十二条数据作为统计图的数据
      result = await Hygienic.find({ "bf_id": req.currentUser.bf_id, "dormitory": req.currentUser.dormitory }).sort({ "check_time": -1 }).limit(12);
      if (!result) return res.json(com(false, "获取数据失败", null));
      else res.json(com(true, null, result));
    }
  });
  /**
   * fun:添加学生宿舍报修信息
   * url:"/api/student/maintenance"
   * type:post
   * 
   */
  router.post("/maintenance",authStudent,async(req,res)=>{
    //先校验数据
    const info=req.body;
    if(!info.time)return res.json(com(false,"报修时间不能为空",null));
    if(info.content.trim().length===0)return res.json(com(false,"报修内容不能为空!",null));
    //通过校验保存数据
    info.bf_id=req.currentUser.bf_id;
    info.dormitory=req.currentUser.dormitory;
    const result=await  maintenance.create(info);
    if(!result)return res.json(com(false,"保存失败!",null));
    res.json(com(true,"报修成功!",null));
  });
  /**
   * fun:获取一页学生宿舍报修信息
   * url:"/api/student/maintenance"
   * type:get
   */
  router.get("/maintenance",authStudent,async(req,res)=>{
      let page=req.query.page;
      let result=null;
      let count=null;
      let bfId=req.currentUser.bf_id;
      let d_id=req.currentUser.dormitory;
      result=await maintenance.aggregate([
      {
        $match: {
          "bf_id": mongoose.Types.ObjectId(bfId),
          "dormitory": mongoose.Types.ObjectId(d_id),
        }
      },
      { $sort: {"time": -1 } },
      { $skip: (page - 1) * pageSize },
      { $limit: pageSize },
      {
        $lookup: {
          from: "dormitory",
          localField: "dormitory",
          foreignField: "_id",
          as: "dormitoryInfo"
        }
      },
      {
        $lookup: {
          from: "buildingInfo",
          localField: "bf_id",
          foreignField: "_id",
          as: "bfInfo"
        }
      }
      ]);
      if(!result)return res.json(com(false,"获取失败",null));
      count = await maintenance.countDocuments({
        "bf_id": mongoose.Types.ObjectId(bfId),
        "dormitory": mongoose.Types.ObjectId(d_id),
      });
      res.json(com(true,"",{
        list:result,
        count
      }));
  });








  //挂载路由
  app.use("/api/student", router);
};





