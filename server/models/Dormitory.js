const mongoose =require("../utils/db");
const bf=require("./BuildingInformation");
const Schema=mongoose.Schema;
const Dormitory=new Schema({
  //所属区域
  respective_region:{
    type:mongoose.Schema.ObjectId,
         ref:"bf",
         required:true
  },
  //宿舍号
  hostel_no:{
    type:Number,
    required:true
  },
  //剩余可住位置
  residual_position:{
    type:Number,
    required:true
  } 
});
module.exports=mongoose.model("Dormitory",Dormitory,"dormitory");