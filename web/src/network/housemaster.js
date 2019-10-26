import {requestHouseMasterData} from "./request";

//宿舍管理员登录
export function houseMasterLogin(houseMaster) {
  return requestHouseMasterData({
    method: 'post',
    url: "/login",
    data: houseMaster
  });
}

//获取登录后的宿舍管理员信息
export function getHouseMasterLoginInfo() {
  return requestHouseMasterData({
    method: 'GET',
    url: '/'
  });
}

//修改宿舍管理员资料
export function updateHouseMasterInfo(data) {
  return requestHouseMasterData({
    method: "put",
    url: "/update",
    data: data
  });
}

//添加宿舍信息
export function addDormitoryInfo(housemasterId, data) {
  return requestHouseMasterData({
    method: "post",
    url: "/create/dormitory",
    data: {
      respective_region: housemasterId,
      residual_position: data.residual_position,
      hostel_no: data.hostel_no
    }
  });
}

//获取第page页宿舍信息数据
export function getDormitoryInfo(page, keywords) {
  return requestHouseMasterData({
    method: "get",
    url: `/find/dormitory`,
    params: {
      page: page,
      keywords: keywords,
    },
  });
}

//删除宿舍信息
export function deleteDormitoryInfo(id) {
  return requestHouseMasterData({
    url: '/delete/dormitory',
    method: 'delete',
    params: {
      id
    }
  });
}

//添加宿舍卫生检查信息
export function addHealthManagementInfo(data) {
  return requestHouseMasterData({
    url: "/create/hygienic",
    method: "post",
    data: data
  });
}

//获取所有本栋宿舍信息
export function getAllDormitoryInfo() {
  return requestHouseMasterData({
    url: "/get/dormitory",
    method: "get"
  });
}

//请求一页卫生检查数据
export function getCheckInfo(page, startTime, endTime) {
  return requestHouseMasterData({
    url: "/find/hygienic",
    method: "get",
    params: {
      page,
      startTime,
      endTime
    }
  });
}

//通过id更新卫生检查数据
export function updateCheckInfo(data) {
  return requestHouseMasterData({
    url: "/update/hygienic",
    method: 'put',
    data
  });
}

//通过id删除卫生检查数据
export function deleteCheckInfo(id) {
  return requestHouseMasterData({
    url: "/delete/hygienic",
    method: "delete",
    params:{
      id
    }
  });
}
//添加宿舍用电信息
export function addEleCharges(data) {
  return requestHouseMasterData({
    url:"/elecharges",
    method:'post',
    data:data
  });
}
//请求一页宿舍用电信息
export function getEleCharges(page,time) {
  return requestHouseMasterData({
    url:"/elecharges",
    method:"get",
    params:{
      page,
      month:time
    }
  });
}
//通过id更新宿舍用电信息
export function updateEleCharges(data) {
  return requestHouseMasterData({
    url:"/elecharges",
    method:"put",
    data
  });
}
//通过id删除宿舍用电信息
export function deleteEleCharges(id) {
  return requestHouseMasterData({
    url:"/elecharges",
    method:"delete",
    params:{
      id
    }
  });
}


//获取还有剩余位置的所有宿舍
export function getPdormitory() {
  return requestHouseMasterData({
    url:"/get/dorInfo",
    type:'get'
  });
}

//添加学生信息
export function addStudentInfo(data) {
  return requestHouseMasterData({
    url:"/student",
    method:"post",
    data
  });
}
//获取一页学生数据
export function getStudentInfo(page,keywords) {
  return requestHouseMasterData({
    url:"/student",
    method:"get",
    params:{
      page,
      keywords
    }
  });
}
//通过id更新学生数据
export function updateStudentInfo(data) {
  return requestHouseMasterData({
    url:"/student",
    method:"put",
    data
  });
}
//通过id删除学生信息
export function deleteStudentInfo(id) {
  return requestHouseMasterData({
    url:"/student",
    method:"delete",
    params:{
      id
    }
  });
}

//获取本栋的公告信息
export function getNoticeInfo() {
  return requestHouseMasterData({
      url:"/notice",
      method:'get'
  });
}
//更新本栋的公告信息
export function updateNoticeInfo(data) {
  return requestHouseMasterData({
    url:"/notice",
    method:"put",
    data
  });
}

//获取一页学生宿舍报修待审核数据
export function getStudentDormitoryMaintenanceAndZero(page,startTime,endTime) {
  return requestHouseMasterData({
    url:"/maintenance",
    type:'get',
    params:{
      page,
      startTime,
      endTime
    }
  });
}
//审核通过更新数据
export function updateDormitoryMaintenance(id) {
  return requestHouseMasterData({
    url:"/maintenance",
    method:'put',
    data:{
      id
    }
  });
}
//请求已经通过审核的宿舍报修信息
export function getDormitoryMaintenanceInfo(page,startTime,endTime) {
  return requestHouseMasterData({
    url:"/maintenance/info",
    method:"get",
    params:{
      page,
      startTime,
      endTime
    }
  });
}

