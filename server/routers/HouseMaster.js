/*
    宿舍管理员模块
    2019/10/19
    ymcj
 */
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const HousemasterModel = require("../models/Housemaster");
const com = require("../utils/common");
const { authHouseMaster } = require("../utils/auth");
const BFModel = require("../models/BuildingInformation");
const path = require("path");
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, "../uploads") });
const dormitory = require("../models/Dormitory");
const mongoose = require("mongoose");
const pageSize = 6;//分页条数
const Hygienic = require("../models/Hygienic");
const student = require("../models/Student");
const elecharges = require("../models/ElectricityCharges");
const notice = require("../models/Notice");
const maintenance = require("../models/Maintenance");
module.exports = function (app) {
  /**
   *  fun:宿舍管理员登录
   *  url:/api/housemaster/login
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
    const result = await HousemasterModel.findOne({ username: adminUser.username });
    if (!result) {//不存在
      return res.json(com(false, "用户名不存在", null));
    }
    //校验密码
    const isValid = (result.password === adminUser.password);
    if (!isValid) {//密码校验失败
      return res.json(com(false, "密码错误!", null));
    }
    //校验通过返回token
    const token = jwt.sign({
      id: result._id,
      username: result.username,
      email: result.email,
      tel: result.tel
    }, require("../utils/private").privateKey, { expiresIn: 3600 });
    res.json(com(true, "登录成功!", token));
  });
  /**
   * fun:获取登录宿舍管理员的信息
   * url:/api/housemaster/
   * type:GET
   */
  router.get("/", authHouseMaster, async (req, res) => {
    const management = await BFModel.findById(req.currentUser.management);
    res.json(com(true, null, {
      id: req.currentUser._id,
      username: req.currentUser.username,
      avatar: req.currentUser.avatar,
      sex: req.currentUser.sex,
      tel: req.currentUser.tel,
      email: req.currentUser.email,
      management: management
    }));
  });

  /**
   * fun:更新登录宿舍管理员的信息
   * url:/api/housemaster/update
   * type:put
   */
  router.put("/update", authHouseMaster, async (req, res) => {
    const user = {};
    for (let key in req.body) {
      if (req.body[key]) {
        user[key] = req.body[key];
      }
    }
    const result = await HousemasterModel.findByIdAndUpdate(user.id, user);
    if (!result) {
      return res.json(com(false, "更新失败!", null));
    }
    res.json(com(true, "更新成功!", null));
  });

  //图片上传
  router.post("/uploads", authHouseMaster, upload.single("file"), (req, res) => {
    const file = req.file;
    file.url = `http://127.0.0.1:8888/public/${file.filename}`;
    res.send(file);
  });


  /*********************宿舍管理模块************************** */

  /**
   * fun:添加宿舍信息
   * url:/api/housemaster/create/dormitory
   * type:post
   */
  router.post("/create/dormitory", authHouseMaster, async (req, res) => {
    req.body.respective_region = req.currentUser.management;
    const result = await dormitory.create(req.body);
    if (!result) return res.json(com(false, "添加失败!请稍后再试!", null));
    res.json(com(true, "添加成功!", null));
  });
  /**
   * fun:获取一页宿舍信息
   * url:/api/housemaster/find/dormitory
   * type:GET
   */
  router.get("/find/dormitory", authHouseMaster, async (req, res) => {
    const page = req.query.page;
    let filter = null;
    let keywords = req.query.keywords;
    if (req.query.keywords) {//关键字存在就进行匹配
      keywords = req.query.keywords;
      filter = {
        respective_region: mongoose.Types.ObjectId(req.currentUser.management._id),
        hostel_no: Number(keywords)
      }
    } else {
      filter = {
        respective_region: mongoose.Types.ObjectId(req.currentUser.management._id),
      }
    }
    const result = await dormitory.aggregate([
      {
        $match: filter
      },
      {
        $lookup: {
          from: "buildingInfo",//需要关联的表(注意这里是写表名)
          localField: "respective_region",//表需要关联的键
          foreignField: "_id",//关联的外键
          as: "dormitoryDetailInfo"
        }
      },
      { $skip: pageSize * (page - 1) },
      { $limit: pageSize }
    ]);
    const count = await dormitory.countDocuments(filter);
    res.json(com(true, null, {
      list: result,
      count
    }));
  });

  /**
   * fun:删除宿舍信息
   * url:/api/housemaster/delete/dormitory
   * type:delete
   */
  router.delete("/delete/dormitory", authHouseMaster, async (req, res) => {
    const result = await dormitory.findByIdAndDelete(req.query.id);
    if (!result) {
      return res.json(com(false, "删除失败!", null));
    }
    res.json(com(true, "删除成功!", null));
  });
  /**
   *
   * function renderTime(date) {
    var dateee = new Date(date).toJSON();
    return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
  }
   *
   */

  /**
   * fun:实现宿舍卫生信息的添加
   * url:/api/housemaster/create/hygienic
   * type:post
   */
  router.post("/create/hygienic", authHouseMaster, async (req, res) => {
    req.body.bf_id = req.currentUser.management;
    const result = await Hygienic.create(req.body);
    if (!result) return res.json(com(false, "添加失败!", null));
    res.json(com(true, "添加成功!", null));
  });


  /**
   * fun:获取本栋宿舍信息
   * url:/api/housemaster/get/dormitor
   * type:get
   */
  router.get("/get/dormitory", authHouseMaster, async (req, res) => {
    const management_id = req.currentUser.management;//获取宿舍管理员所管理楼栋信息的id
    const result = await dormitory.find({ 'respective_region': mongoose.Types.ObjectId(management_id) });
    res.json(com(true, "", result));
  });

  /**
   * fun:获取一页宿舍卫生信息
   * url:/api/housemaster/find/hygienic
   * type:get
   */
  router.get("/find/hygienic", authHouseMaster, async (req, res) => {
    const bfId = req.currentUser.management;
    let startTime = null;
    let endTime = null;
    let result = null;
    let count = null;
    //拿出页码
    const page = req.query.page;
    //拿出关键字
    if (req.query.startTime && req.query.endTime) {
      startTime = new Date(req.query.startTime);
      endTime = new Date(req.query.endTime);
      //获取分页数据
      result = await Hygienic.aggregate([
        {
          $match: {
            "bf_id": mongoose.Types.ObjectId(bfId),
            "check_time": { $gte: startTime, $lte: endTime }
          }
        },
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
        "bf_id": mongoose.Types.ObjectId(bfId),
        "check_time": { $gte: startTime, $lte: endTime }
      });
    } else {
      //获取分页数据
      result = await Hygienic.aggregate([
        {
          $match: {
            "bf_id": mongoose.Types.ObjectId(bfId),
          }
        },
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
        "bf_id": mongoose.Types.ObjectId(bfId)
      });
    }
    res.json(com(true, null, {
      result,
      count
    }));
  });

  /**
   * fun:通过id修改宿舍卫生信息
   * url:/api/housemaster/update/hygienic
   * type:put
   */
  router.put("/update/hygienic", authHouseMaster, async (req, res) => {
    const result = await Hygienic.findByIdAndUpdate(req.body.id, req.body);
    if (!result) return res.json(com(false, "更新失败!", null));
    res.json(com(true, "更新成功!", null));
  });

  /**
   * fun:通过id删除宿舍卫生信息
   * url:/api/housemaster/delete/hygienic
   * type:delete
   */
  router.delete("/delete/hygienic", authHouseMaster, async (req, res) => {
    const result = await Hygienic.findByIdAndDelete(req.query.id);
    if (!result) return res.json(com(true, "删除失败!", null));
    res.json(com(true, "删除成功!", null));
  });
  /**
   * fun:实现用电详情的添加
   * url:"/api/housemaster/elecharges"
   * type:post
   */
  router.post("/elecharges", authHouseMaster, async (req, res) => {
    req.body.bf_id = req.currentUser.management;
    console.log(req.body);
    const result = await elecharges.create(req.body);
    if (!result) return res.json(com(false, "添加失败!", null));
    res.json(com(true, "添加成功", null));
  });
  /**
   * fun:请求一页用电详情数据
   * url:"/api/housemaster/elecharges"
   * type:get
   */
  router.get("/elecharges", authHouseMaster, async (req, res) => {
    let result = null;
    let count = null;
    let bfId = req.currentUser.management;
    //拿出页码
    const page = req.query.page;
    //拿出关键字
    if (req.query.month) {
      time = new Date(req.query.month);
      //获取分页数据
      result = await elecharges.aggregate([
        {
          $match: {
            "bf_id": mongoose.Types.ObjectId(bfId),
            "time": time
          }
        },
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
      count = await elecharges.countDocuments({
        "bf_id": mongoose.Types.ObjectId(bfId),
        "time": time
      });
    } else {
      //获取分页数据
      result = await elecharges.aggregate([
        {
          $match: {
            "bf_id": mongoose.Types.ObjectId(bfId),
          }
        },
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
      count = await elecharges.countDocuments({
        "bf_id": mongoose.Types.ObjectId(bfId)
      });
    }
    res.json(com(true, "", {
      result,
      count
    }));
  });
  /**
   * fun:通过id更新宿舍用电信息
   * url:"/api/housemaster/elecharges"
   * type:put
   */
  router.put("/elecharges", authHouseMaster, async (req, res) => {
    const result = await elecharges.findByIdAndUpdate(req.body.id, req.body);
    if (!result) return res.json(com(true, "更新失败!", null));
    res.json(com(true, "更新成功!", null));
  });

  /**
   * fun:通过id删除宿舍用电信息
   * url:"/api/housemaster/elecharges"
   * type:delete
   */
  router.delete("/elecharges", authHouseMaster, async (req, res) => {
    const result = await elecharges.findByIdAndDelete(req.query.id);
    if (!result) return res.json(com(false, "删除失败", null));
    res.json(com(true, "删除成功!", null));
  });
  /**
   * fun:添加学生信息
   * url:"/api/housemaster/student"
   * type:post
   */
  router.post("/student", authHouseMaster, async (req, res) => {
    //设置默认头像
    req.body.avatar = "http://127.0.0.1:8888/public/defalut.png";
    req.body.bf_id = req.currentUser.management;//设置楼栋信息
    //先查询出宿舍的剩余位置减一
    const obj = await dormitory.findById(req.body.dormitory);
    obj.residual_position--;
    console.log(obj.residual_position);
    if (obj.residual_position < 0) return res.json(com(false, obj.hostel_no + "宿舍位置已满,请重新分配", null));
    const result = await dormitory.findByIdAndUpdate(obj._id, { residual_position: obj.residual_position });
    if (!result) return res.json(com(false, "添加失败！请重新尝试!", null));
    //以上操作完成后就可以对student数据进行保存了
    const result1 = await student.create(req.body);
    if (!result1) return res.json(com(false, "添加失败！请重新尝试!", null));
    res.json(com(true, "保存成功!", null));
  });
  /**
   * fun:获取所有有位置宿舍信息
   * url:"/api/housemaster/get/dstudent"
   * type:get
   */
  router.get("/get/dorInfo", authHouseMaster, async (req, res) => {
    const result = await dormitory.find({
      "respective_region": req.currentUser.management,
      "residual_position": { $gt: 0 }
    });
    res.json(com(true, "ok", result));
  });
  /**
   * fun:获取一页学生数据
   * url:"/api/housemaster/student"
   * type:get
   */
  router.get("/student", authHouseMaster, async (req, res) => {
    let result = null;
    let count = null;
    const page = req.query.page || 1;
    if (req.query.keywords) {//带有关键字
      result = await student.aggregate([
        {
          $match: {
            "bf_id": mongoose.Types.ObjectId(req.currentUser.management),
            "sno": req.query.keywords
          }
        },
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
      count = await student.countDocuments({
        "bf_id": mongoose.Types.ObjectId(req.currentUser.management),
        "sno": req.query.keywords
      });
    } else {
      result = await student.aggregate([
        {
          $match: {
            "bf_id": mongoose.Types.ObjectId(req.currentUser.management),
          }
        },
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
      count = await student.countDocuments({
        "bf_id": mongoose.Types.ObjectId(req.currentUser.management),
      });
    }
    res.json(com(true, null, {
      result,
      count
    }))
  });
  /**
   * fun:通过id更新学生数据
   * url:"/api/housemaster/student"
   * type:put
   *
   */
  router.put("/student", authHouseMaster, async (req, res) => {
    const o_did = req.body.dormitory;
    const oldStudent = await student.findById(req.body._id);
    if (o_did === oldStudent.dormitory) {//相等说明没有换宿舍
      const result = await student.findByIdAndUpdate(req.body.id, req.body);
      if (!result) return res.json(com(false, "更新失败!", null));
    } else {//换了宿舍
      //1.之前的宿舍位置加一
      const old_result = await dormitory.findById(oldStudent.dormitory);
      old_result.residual_position++;
      await dormitory.findByIdAndUpdate(old_result._id, { "residual_position": old_result.residual_position });
      //2.现在的宿舍位置减一
      const new_result = await dormitory.findById(req.body.dormitory);
      new_result.residual_position--;
      await dormitory.findByIdAndUpdate(req.body.dormitory, { "residual_position": new_result.residual_position });
      //执行学生数据的更新
      const result = await student.findByIdAndUpdate(req.body._id, req.body);
    }
    res.json(com(true, "更新成功!", null));
  });
  /**
   * fun:通过id删除学生信息
   * url:"/api/housemaster/student"
   * type:delete
   */
  router.delete("/student", authHouseMaster, async (req, res) => {
    //先拿到student id查询出之前宿舍的信息使空余位置++
    const s_id = req.query.id;
    const s = await student.findById(s_id);//查询出学生的信息
    const d = await dormitory.findById(s.dormitory);//查询出宿舍信息
    d.residual_position++;
    await dormitory.findByIdAndUpdate(s.dormitory, { "residual_position": d.residual_position });
    const result = await student.findByIdAndDelete(s._id);
    if (!result) return res.json(com(false, "删除失败！", null));
    res.json(com(true, "删除成功!", null));
  });

  /**
   * fun:添加公告信息
   * url:"/api/housemaster/notice"
   * type:post
   */
  router.put("/notice", authHouseMaster, async (req, res) => {
    const result = await notice.findByIdAndUpdate(req.body._id, req.body);
    if (!result) return res.json(com(false, "更新失败!", null));
    res.json(com(true, "发布成功!", null));
  });


  /**
   * fun:获取公告信息
   * url:"/api/housemaster/notice"
   * type:get
   */
  router.get("/notice", authHouseMaster, async (req, res) => {
    const result = await notice.findOne({ "bf_id": req.currentUser.management });
    if (!result) return res.json(com(false, "获取失败", null));
    res.json(com(true, null, result));
  });
  /**
   * fun:获取宿舍报修信息
   * url:"/api/housemaster/maintenance"
   * type:'get'
   */
  router.get("/maintenance", authHouseMaster, async (req, res) => {
    let page = req.query.page;
    let bfId = req.currentUser.management;
    let startTime = null;
    let endTime = null;
    if (req.query.startTime && req.query.endTime) {
      startTime = new Date(req.query.startTime);
      endTime = new Date(req.query.endTime);
      //获取分页数据
      result = await maintenance.aggregate([
        {
          $match: {
            "bf_id": mongoose.Types.ObjectId(bfId),
            "time": { $gte: startTime, $lte: endTime },
            "status": 0
          }
        },
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
      count = await maintenance.countDocuments({
        "bf_id": mongoose.Types.ObjectId(bfId),
        "status": 0,
        "time": { $gte: startTime, $lte: endTime }
      });
    } else {
      //获取分页数据
      result = await maintenance.aggregate([
        {
          $match: {
            "bf_id": mongoose.Types.ObjectId(bfId),
            "status": 0
          }
        },
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
      count = await maintenance.countDocuments({
        "bf_id": mongoose.Types.ObjectId(bfId),
        "status": 0
      });
    }
    res.json(com(true, null, {
      result,
      count
    }));
  });
  /**
   * fun:通过审核报修信息
   * url:"/api/housemaster/maintenance"
   * type:"put"
   */
  router.put("/maintenance", authHouseMaster, async (req, res) => {
    const resul = await maintenance.findByIdAndUpdate(req.body.id, { "status": 1,"repair_time":Date.now() });
    if (!result) return res.json(com(false, "更新失败!", null));
    res.json(com(true, "成功通过审核", null));
  });
  /**
  * fun:获取宿舍报修信息
  * url:"/api/housemaster/maintenance/info"
  * type:'get'
   */
  router.get("/maintenance/info", authHouseMaster, async (req, res) => {
    let page = req.query.page;
    let bfId = req.currentUser.management;
    let startTime = null;
    let endTime = null;
    if (req.query.startTime && req.query.endTime) {
      startTime = new Date(req.query.startTime);
      endTime = new Date(req.query.endTime);
      //获取分页数据
      result = await maintenance.aggregate([
        {
          $match: {
            "bf_id": mongoose.Types.ObjectId(bfId),
            "time": { $gte: startTime, $lte: endTime },
            "status": 1
          }
        },
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
      count = await maintenance.countDocuments({
        "bf_id": mongoose.Types.ObjectId(bfId),
        "status": 1,
        "time": { $gte: startTime, $lte: endTime }
      });
    } else {
      //获取分页数据
      result = await maintenance.aggregate([
        {
          $match: {
            "bf_id": mongoose.Types.ObjectId(bfId),
            "status": 1
          }
        },
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
      count = await maintenance.countDocuments({
        "bf_id": mongoose.Types.ObjectId(bfId),
        "status": 1
      });
    }
    res.json(com(true, null, {
      result,
      count
    }));
  });






  //挂载路由
  app.use("/api/housemaster", router);
};
