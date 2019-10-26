/**
 * Student model
 * 2019/10/22
 * ymcj
 */
const dormitory = require("./Dormitory");
const mongoose = require("../utils/db");
const bf=require("./BuildingInformation");
const Schema = mongoose.Schema;
const StudentSchema = new Schema({
  sno: {
    type: String,
    require: true
  },
  name: {
    type: String
  },
  age: {
    type: Number
  },
  sex: {
    type: String,
  },
  password: {
    type: String,
  },
  avatar:{
    type:String
  },
  //宿舍id
  dormitory: {
    type: mongoose.Schema.ObjectId,
    ref: 'dormitory',
    required: true
  },
   //所属楼栋
   bf_id:{
    type:mongoose.Schema.ObjectId,
    ref:"bf",
    required:true
  }
});
module.exports=mongoose.model("students",StudentSchema,"student");
