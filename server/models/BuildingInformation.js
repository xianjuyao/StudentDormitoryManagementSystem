/**
 * 楼栋信息
 * 2019/9/15
 * @type {Mongoose}
 */
const mongoose = require("../utils/db");
const bf=new mongoose.Schema({
    respective_region:{//所属区域
        type:String,
        required:true,
    },
    nums:{//栋数
        type: Number,
        required:true
    },
    status:{
        type:Number,//是否已经被分配
        default:0
    }
});
module.exports=mongoose.model("bf",bf,"buildingInfo");