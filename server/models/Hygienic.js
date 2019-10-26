/**
 * 宿舍卫生检查信息表
 * 2019/10/21
 * ymcj
 */
const mongoose=require("../utils/db");
const dormitory=require("./Dormitory");
const bf=require("./BuildingInformation");
const Schema=mongoose.Schema;
const Hygienic=new  Schema({
  //宿舍id
  dormitory:{
    type:mongoose.Schema.ObjectId,
    ref:'dormitory',
    required:true
  },
  //评分
  score:{
    type:Number,
    required:true
  },
  //留言
  leavingMessage:{
    type:String
  },
  //检查时间
  check_time:{
    type:Date,
    default:new Date()
  },
  bf_id:{
    type:mongoose.Schema.ObjectId,
    ref:"bf",
    required:true
  }
});
module.exports=mongoose.model("Hygienic",Hygienic);

