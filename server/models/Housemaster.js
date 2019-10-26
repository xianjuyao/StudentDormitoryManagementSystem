/**
 *
 *   宿管信息
 *   2019/9/17
 * @type {Mongoose}
 */
const mongoose=require("../utils/db");
const BF=require("./BuildingInformation.js");
const HousemasterSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type: String,
        required: true
    },
    name:{
        type:String,
        required:true
    },
    sex:{
        type:String
    },
    tel:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
    },
    email:{
        type:String,
    },
    management:{
        type:mongoose.Schema.ObjectId,
        ref:"BF",
        required:true
    }
});
module.exports=mongoose.model("HousemasterSchema",HousemasterSchema,"housemasters");