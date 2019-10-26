/**
 *  宿舍用电详情
 *  2019/10/22
 *  ymcj
 * 
 */
const mongoose=require("../utils/db");
const dormitory=require("./Dormitory");
const Schema=mongoose.Schema;
const eleCharges=new Schema({
    //宿舍id
    dormitory:{
      type:mongoose.Schema.ObjectId,
      ref:'dormitory',
      required:true
    },
    //时间
    time:{
      type:Date,
      required:true
    },
    //费用
    cost:{
      type:Number,
      required:true
    },
  
    //所属楼栋
    bf_id:{
      type:mongoose.Schema.ObjectId,
      ref:"bf",
      required:true
    }
});
module.exports=mongoose.model("EleCharges",eleCharges,"electricityCharges");