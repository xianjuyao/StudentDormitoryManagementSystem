import {requestStudentData} from "./request";

//学生登录请求
export function studentLogin(data) {
  return requestStudentData({
    url: "/login",
    method: "post",
    data
  });
}

//登录后请求个人信息
export function getLoginStudentInfo() {
  return requestStudentData({
    url: "/",
    method: "get"
  });
}

//请求公告信息
export function getStudentNoticeInfo() {
  return requestStudentData({
    url: "/notice",
    method: "get"
  });
}

//更新学生个人信息
export function updateStudentInfo(data) {
  return requestStudentData({
    url: "/info",
    method: 'put',
    data
  });
}

//拿到学生宿舍用电详情
export function getStudentDormitoryEleInfo() {
  return requestStudentData({
    url: "/elecharges",
    method: "get"
  });
}

//请求学生宿舍用电分页数据
export function getStudentElePaginationData(page) {
  return requestStudentData({
    url: "/elecharges/info",
    method: 'get',
    params: {
      page
    }
  });
}

//请求学生宿舍卫生信息数据
export function getStudentHygienicInfo(page) {
  return requestStudentData({
    url: "/hygienic",
    type: 'get',
    params: {
      page
    }
  });
}

//保存学生宿舍报修情况
export function saveMaintenanceInfo(data) {
  return requestStudentData({
    url: '/maintenance',
    method: 'post',
    data
  });
}

//请求一页学生宿舍报修情况
export function getMaintenanceInfo(page) {
  return requestStudentData({
    url: "/maintenance",
    method: "get",
    params: {
      page
    }
  });
}
