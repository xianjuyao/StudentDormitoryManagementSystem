/**
 *  用户登录权限认证
 */
const com = require("./common.js");
const jwt = require("jsonwebtoken");
const admin = require("../models/AdminModel");
const housemaster = require("../models/Housemaster");
const student = require("../models/Student");
//认证系统管理员
let authAdmin = async (req, res, next) => {
  if (!req.headers.authorization) {//没有带上token
    return res.json(com(false, "请先登录!", null));
  }
  const token = req.headers.authorization.split(" ").pop();
  let user = null;
  try {
    user = jwt.verify(token, require("../utils/private").privateKey);
    user = await admin.findById(user.id);
  } catch (e) {
    return res.status(401).json(com(false, "请先登录!", {user: "admin"}));
  }
  if (user) {//通过该验证
    req.currentUser = user;
    next();
  } else {
    return res.json(com(false, "请先登录!", null));
  }
};
//宿舍管理员权限认证
let authHouseMaster = async (req, res, next) => {
  if (!req.headers.authorization) {//没有带上token
    return res.json(com(false, "请先登录!", null));
  }
  const token = req.headers.authorization.split(" ").pop();
  let user = null;
  try {
    user = jwt.verify(token, require("../utils/private").privateKey);
    user = await housemaster.findById(user.id);
  } catch (e) {
    return res.status(401).json(com(false, "请先登录!", {user: "housemaster"}));
  }
  if (user) {//通过该验证
    req.currentUser = user;
    next();
  } else {
    return res.json(com(false, "请先登录!", null));
  }
};
//学生登录权限认证
let authStudent = async (req, res, next) => {
  if (!req.headers.authorization) {//没有带上token
    return res.json(com(false, "请先登录!", null));
  }
  const token = req.headers.authorization.split(" ").pop();
  let user = null;
  try {
    user = jwt.verify(token, require("../utils/private").privateKey);
    user = await student.findById(user.id);
  } catch (e) {
    return res.status(401).json(com(false, "请先登录!", {user: "student"}));
  }
  if (user) {//通过该验证
    req.currentUser = user;
    next();
  } else {
    return res.json(com(false, "请先登录!", null));
  }
};


module.exports = {
  authAdmin,
  authHouseMaster,
  authStudent
};
