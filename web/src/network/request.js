import axios from 'axios';
import {Loading, Message} from 'element-ui';
import router from "../router.js";

let loading;

//请求加载动画
function startLoading() {
  loading = Loading.service({
    lock: true,
    text: "拼命加载中...",
    background: "rgba(0,0,0,0.7)"
  });
}

//结束加载动画
function endLoading() {
  loading.close();
}
//宿舍管理员请求封装
export function requestHouseMasterData(config) {
  //1.创建axios实例
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/housemaster',
    timeout: 5000
  });

  //2.axios请求拦截器
  instance.interceptors.request.use((config) => {
    //加载动画
    startLoading();
    //请求头权限认证
    config.headers.authorization = "Bearer " + localStorage.getItem("token");
    return config;
  }, error => {
    console.log(error);
  });
  //axios响应拦截器
  instance.interceptors.response.use((res) => {
    endLoading();//结束动画
    //统一错误处理
    if (!res.data.status) {
      Message({
        message: res.data.msg,
        type: "error"
      });
    }
    return res;
  }, error => {
    endLoading();//结束动画
    if (error.response.status === 401 && error.response.data.data.user==="housemaster") {
      Message.error("请先登录!");
      //清除token
      localStorage.removeItem("token");
      router.push("/housemaster/login");
    }
    console.log(error);
  });
  return instance(config);
}
//学生信息请求封装
export function requestStudentData(config) {
  //1.创建axios实例
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/student',
    timeout: 5000
  });

  //2.axios请求拦截器
  instance.interceptors.request.use((config) => {
    //加载动画
    startLoading();
    //请求头权限认证
    config.headers.authorization = "Bearer " + localStorage.getItem("token");
    return config;
  }, error => {
    console.log(error);
  });
  //axios响应拦截器
  instance.interceptors.response.use((res) => {
    endLoading();//结束动画
    //统一错误处理
    if (!res.data.status) {
      Message({
        message: res.data.msg,
        type: "error"
      });
    }
    return res;
  }, error => {
    endLoading();//结束动画
    if (error.response.status === 401 && error.response.data.data.user==="student") {
      Message.error("请先登录!");
      //清除token
      localStorage.removeItem("token");
      router.push("/student/login");
    }
    console.log(error);
  });
  return instance(config);
}

