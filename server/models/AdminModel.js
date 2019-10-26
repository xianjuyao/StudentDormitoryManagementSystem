/**
 *  管理员表
 *  2019/9/12
 * @type {Mongoose}
 */
const mongoose=require("../utils/db");
const Schema=mongoose.Schema;
const AdminModel=new Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        set(value){
            return require("bcryptjs").hashSync(value,10);
        }
    },
    avatar:{
        type:String,
    }
});
module.exports=mongoose.model("Admin",AdminModel,"admin");


