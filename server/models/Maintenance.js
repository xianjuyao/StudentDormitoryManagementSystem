/**
 * 宿舍报修模型
 * 2019/10/26
 * ymcj
 * 
 */
const bf=require("./BuildingInformation");
const mongoose=require("../utils/db");
const dormitory=require("./Dormitory");
const Schema=mongoose.Schema;
const MaintenanceSchema=new Schema({
    time:{
      type:Date,
      default:Date.now()
    },
    dormitory:{
      type:mongoose.Schema.ObjectId,
      ref:'dormitory',
      required:true
    },
    bf_id:{
      type:mongoose.Schema.ObjectId,
      ref:"bf",
      required:true
    },
    content:{
      type:String,
    },
    status:{      
      type:Number,//0代表未修复，1代表已修复
      default:0
    },
    repair_time:{
      type:Date,
      default:null
    }
  }
);
module.exports=mongoose.model("MaintenanceSchema",MaintenanceSchema,"maintenance");